import crypto from 'crypto';
import type { Express, NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import {
  PAYMENT_CATALOG_BY_SKU,
  PAYMENT_CATALOG_LIST,
  PaymentSku,
} from '../src/data/paymentCatalog';
import {
  AuthenticatedRequest,
  createSessionForUser,
  hashPassword,
  makeAuthMiddleware,
  requirePermission,
  requireRole,
  toPublicUser,
  verifyPassword,
} from './auth';
import {
  calculateQuotationTotals,
  computeDashboardKpis,
  computeRecurringRevenueInsights,
  computeRevenueReport,
  getIstDateParts,
  RevenuePeriodPreset,
  round2,
} from './finance';
import { dispatchNotification, getSmtpConfig } from './notifications';
import {
  findUpcomingRenewals,
  getSchedulerStatus,
  runSubscriptionRenewalReminderSweep,
} from './scheduler';
import { appendAuditLog, readDb, slugifyServiceName, withDbMutation } from './storage';
import {
  CRM_STAGES,
  CrmLead,
  InvoiceRecord,
  LEAD_SOURCES,
  LeadSource,
  NotificationEventKey,
  NotificationLogEntry,
  PaymentRecord,
  quotationLineItemSchema,
  QuotationRecord,
  SERVICE_CATEGORIES,
  ServiceCatalogItem,
  ServiceCategoryRecord,
  SubscriptionRecord,
  SuiteAppointmentRecord,
  SuiteDatabase,
  USER_ROLES,
  UserRole,
} from './types';

function stripControls(value: string): string {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
}

export function sanitizeCsvCell(raw: unknown): string {
  const str = String(raw ?? '');
  const trimmedLeading = str.replace(/[\r\n]+/g, ' ');
  // Prevent CSV spreadsheet formula injection (=, +, -, @, \t)
  const neutralized = /^[=+\-@\t]/.test(trimmedLeading) ? `'${trimmedLeading}` : trimmedLeading;
  return `"${neutralized.replace(/"/g, '""')}"`;
}

export function getRazorpayCredentials(): {
  keyId: string;
  keySecret: string;
  mode: 'test' | 'live';
  webhookSecret: string;
} | null {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (
    !keyId ||
    !keySecret ||
    keyId === 'MY_RAZORPAY_KEY_ID' ||
    keySecret === 'MY_RAZORPAY_KEY_SECRET'
  ) {
    return null;
  }
  const explicitMode = (process.env.RAZORPAY_MODE || '').trim().toLowerCase();
  const mode: 'test' | 'live' =
    explicitMode === 'live' && keyId.startsWith('rzp_live_') ? 'live' : 'test';
  const webhookSecret = (process.env.RAZORPAY_WEBHOOK_SECRET || '').trim();
  return { keyId, keySecret, mode, webhookSecret };
}

export function verifyRazorpayCheckoutSignature(
  orderId: string,
  paymentId: string,
  signature: string,
  keySecret: string
): boolean {
  if (!/^[a-f0-9]{64}$/i.test(signature)) return false;
  const expectedHex = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  const expectedBuf = Buffer.from(expectedHex, 'hex');
  const actualBuf = Buffer.from(signature.toLowerCase(), 'hex');
  return expectedBuf.length === actualBuf.length && crypto.timingSafeEqual(expectedBuf, actualBuf);
}

export function verifyRazorpayWebhookSignature(
  rawBody: Buffer | string,
  signatureHeader: string,
  webhookSecret: string
): boolean {
  if (!webhookSecret || !signatureHeader || !/^[a-f0-9]{64}$/i.test(signatureHeader)) {
    return false;
  }
  const expectedHex = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');
  const expectedBuf = Buffer.from(expectedHex, 'hex');
  const actualBuf = Buffer.from(signatureHeader.toLowerCase(), 'hex');
  return expectedBuf.length === actualBuf.length && crypto.timingSafeEqual(expectedBuf, actualBuf);
}

function getDayNameIst(dateStr: string): string {
  const dt = new Date(`${dateStr}T12:00:00+05:30`);
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
  }).format(dt);
}

function parseHm(hm: string): number {
  const [h, m] = hm.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function formatHm(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function formatSlotRangeIst(start: string, end: string): string {
  const to12 = (hm: string) => {
    const [hh, mm] = hm.split(':').map(Number);
    const suffix = hh >= 12 ? 'PM' : 'AM';
    const h12 = hh % 12 === 0 ? 12 : hh % 12;
    return `${h12}:${String(mm).padStart(2, '0')} ${suffix}`;
  };
  return `${to12(start)} – ${to12(end)} IST`;
}

function getCurrentMinutesIst(): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === 'hour')?.value || 0);
  const m = Number(parts.find((p) => p.type === 'minute')?.value || 0);
  return h * 60 + m;
}

export function computeDateAvailability(db: SuiteDatabase, dateStr: string) {
  const todayIst = getIstDateParts().isoDate;
  const fee = db.websiteSettings?.consultationFee || '₹1,999 (30-min IST Session)';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return {
      date: dateStr,
      blocked: true,
      reason: 'Please choose a valid date (YYYY-MM-DD).',
      slots: [],
      consultationFee: fee,
    };
  }
  if (dateStr < todayIst) {
    return {
      date: dateStr,
      blocked: true,
      reason: 'Past dates cannot be booked.',
      slots: [],
      consultationFee: fee,
    };
  }
  const blocked = (db.blockedDates || []).find((b) => b.date === dateStr);
  if (blocked) {
    return {
      date: dateStr,
      blocked: true,
      reason: blocked.reason || 'This date is currently blocked.',
      slots: [],
      consultationFee: fee,
    };
  }
  const dayName = getDayNameIst(dateStr);
  const rule = (db.availability || []).find((r) => r.day === dayName);
  if (!rule || !rule.enabled) {
    return {
      date: dateStr,
      blocked: true,
      reason: `Advisory consultations are not scheduled on ${dayName}.`,
      slots: [],
      consultationFee: fee,
    };
  }

  const startMin = parseHm(rule.startTime);
  const endMin = parseHm(rule.endTime);
  const duration = Math.max(15, rule.slotDuration || 30);
  const intervals: Array<{ startTime: string; endTime: string }> = [];
  for (let cur = startMin; cur + duration <= endMin; cur += duration) {
    intervals.push({ startTime: formatHm(cur), endTime: formatHm(cur + duration) });
  }

  const dayAppointments = (db.appointments || []).filter(
    (a) => a.appointmentDate === dateStr && a.bookingStatus !== 'Cancelled'
  );
  if (dayAppointments.length >= Math.max(1, rule.maximumBookings)) {
    return {
      date: dateStr,
      blocked: false,
      reason: 'Daily consultation capacity reached for this date.',
      slots: intervals.map((s) => ({
        startTime: s.startTime,
        endTime: s.endTime,
        label: formatSlotRangeIst(s.startTime, s.endTime),
        available: false,
        reason: 'Booked',
      })),
      consultationFee: fee,
    };
  }

  const nowMinIst = getCurrentMinutesIst();
  return {
    date: dateStr,
    blocked: false,
    reason: '',
    slots: intervals.map((s) => {
      const slotStartMin = parseHm(s.startTime);
      if (dateStr === todayIst && slotStartMin <= nowMinIst + 15) {
        return {
          startTime: s.startTime,
          endTime: s.endTime,
          label: formatSlotRangeIst(s.startTime, s.endTime),
          available: false,
          reason: 'Elapsed',
        };
      }
      const taken = dayAppointments.some((a) => a.startTime === s.startTime);
      return {
        startTime: s.startTime,
        endTime: s.endTime,
        label: formatSlotRangeIst(s.startTime, s.endTime),
        available: !taken,
        reason: taken ? 'Reserved' : 'Available',
      };
    }),
    consultationFee: fee,
  };
}

function recalculateInvoiceStatus(inv: InvoiceRecord): void {
  const netPaid = round2(Math.max(0, inv.paidAmount));
  if (inv.refundedAmount >= inv.totalAmount && inv.totalAmount > 0) {
    inv.status = 'REFUNDED';
  } else if (netPaid >= inv.totalAmount && inv.totalAmount > 0) {
    inv.status = 'PAID';
  } else if (netPaid > 0) {
    inv.status = 'PARTIAL';
  } else {
    inv.status = 'UNPAID';
  }
  inv.updatedAt = new Date().toISOString();
}

export async function handleRazorpayWebhook(req: Request, res: Response): Promise<void> {
  const creds = getRazorpayCredentials();
  const webhookSecret = creds?.webhookSecret || (process.env.RAZORPAY_WEBHOOK_SECRET || '').trim();
  if (!webhookSecret) {
    res.status(503).json({ error: 'Webhook secret not configured.', code: 'WEBHOOK_UNCONFIGURED' });
    return;
  }

  const signature = String(req.headers['x-razorpay-signature'] || '').trim();
  const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body || {}));
  if (!verifyRazorpayWebhookSignature(rawBody, signature, webhookSecret)) {
    res.status(400).json({ error: 'Invalid webhook signature.', code: 'INVALID_WEBHOOK_SIGNATURE' });
    return;
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody.toString('utf8')) as Record<string, unknown>;
  } catch {
    res.status(400).json({ error: 'Invalid JSON webhook body.' });
    return;
  }

  const eventName = String(payload.event || '');
  const eventIdHeader = String(req.headers['x-razorpay-event-id'] || '').trim();
  const paymentEntity = (payload.payload as Record<string, any> | undefined)?.payment?.entity;
  const refundEntity = (payload.payload as Record<string, any> | undefined)?.refund?.entity;
  const orderId = String(paymentEntity?.order_id || '');
  const paymentId = String(paymentEntity?.id || refundEntity?.payment_id || '');
  const dedupeKey = eventIdHeader || `${eventName}:${paymentId || orderId}:${rawBody.length}`;

  const outcome = await withDbMutation(async (db) => {
    if (db.processedWebhookEvents.includes(dedupeKey)) {
      return { duplicate: true };
    }
    db.processedWebhookEvents.unshift(dedupeKey);
    db.processedWebhookEvents = db.processedWebhookEvents.slice(0, 1000);

    const nowIso = new Date().toISOString();
    const targetPayment = db.payments.find(
      (p) =>
        (paymentId && p.razorpayPaymentId === paymentId) ||
        (orderId && p.razorpayOrderId === orderId)
    );

    if (eventName === 'payment.captured' || eventName === 'order.paid') {
      const amountInMajor = paymentEntity?.amount ? round2(Number(paymentEntity.amount) / 100) : 0;
      const feeInMajor = paymentEntity?.fee ? round2(Number(paymentEntity.fee) / 100) : 0;
      if (targetPayment) {
        if (!targetPayment.webhookEventIds.includes(dedupeKey)) {
          targetPayment.webhookEventIds.push(dedupeKey);
        }
        const alreadyCounted = targetPayment.status === 'captured' && targetPayment.verified;
        targetPayment.razorpayPaymentId = paymentId || targetPayment.razorpayPaymentId;
        targetPayment.method = String(paymentEntity?.method || targetPayment.method || 'razorpay');
        targetPayment.gatewayFeeAmount = feeInMajor || targetPayment.gatewayFeeAmount;
        targetPayment.status = 'captured';
        targetPayment.verified = true;
        targetPayment.capturedAt = targetPayment.capturedAt || nowIso;
        targetPayment.updatedAt = nowIso;

        if (!alreadyCounted && targetPayment.invoiceId) {
          const inv = db.invoices.find((i) => i.id === targetPayment.invoiceId);
          if (inv) {
            inv.paidAmount = round2(inv.paidAmount + (amountInMajor || targetPayment.amount));
            recalculateInvoiceStatus(inv);
          }
        }
      }
      appendAuditLog(db, {
        actorId: 'razorpay_webhook',
        actorName: 'Razorpay Webhook',
        actorRole: 'Webhook',
        action: 'WEBHOOK_PAYMENT_CAPTURED',
        targetId: paymentId || orderId || dedupeKey,
        summary: `Webhook ${eventName} verified and settled (${amountInMajor || 'matched'} ${paymentEntity?.currency || 'INR'}).`,
      });
      await dispatchNotification(db, {
        event: 'payment_received',
        subject: `Razorpay payment captured: ${paymentId || orderId}`,
        body: `Event: ${eventName}\nOrder: ${orderId}\nPayment: ${paymentId}\nAmount: ${amountInMajor}\nMode: ${creds?.mode || 'test'}`,
      });
    } else if (eventName === 'payment.failed') {
      if (targetPayment && targetPayment.status !== 'captured') {
        targetPayment.status = 'failed';
        targetPayment.verified = false;
        targetPayment.updatedAt = nowIso;
      }
      appendAuditLog(db, {
        actorId: 'razorpay_webhook',
        actorName: 'Razorpay Webhook',
        actorRole: 'Webhook',
        action: 'WEBHOOK_PAYMENT_FAILED',
        targetId: paymentId || orderId || dedupeKey,
        summary: `Webhook reported payment.failed for ${orderId || paymentId}.`,
      });
      await dispatchNotification(db, {
        event: 'payment_failed',
        subject: `Payment failed alert: ${orderId || paymentId}`,
        body: `Razorpay reported payment.failed for order ${orderId}, payment ${paymentId}.`,
      });
    } else if (eventName === 'refund.processed' && targetPayment) {
      const refundAmt = refundEntity?.amount ? round2(Number(refundEntity.amount) / 100) : 0;
      if (refundAmt > 0) {
        targetPayment.refundedAmount = round2(
          Math.min(targetPayment.amount, targetPayment.refundedAmount + refundAmt)
        );
        if (targetPayment.refundedAmount >= targetPayment.amount) {
          targetPayment.status = 'refunded';
        }
        targetPayment.updatedAt = nowIso;
        if (targetPayment.invoiceId) {
          const inv = db.invoices.find((i) => i.id === targetPayment.invoiceId);
          if (inv) {
            inv.refundedAmount = round2(inv.refundedAmount + refundAmt);
            inv.paidAmount = round2(Math.max(0, inv.paidAmount - refundAmt));
            recalculateInvoiceStatus(inv);
          }
        }
        appendAuditLog(db, {
          actorId: 'razorpay_webhook',
          actorName: 'Razorpay Webhook',
          actorRole: 'Webhook',
          action: 'WEBHOOK_REFUND_PROCESSED',
          targetId: paymentId,
          summary: `Refund of ${refundAmt} processed via Razorpay webhook.`,
        });
      }
    }

    return { duplicate: false };
  });

  res.json({ ok: true, duplicate: outcome.duplicate });
}

export function createSimpleRateLimiter(windowMs: number, max: number, code: string, message: string) {
  const buckets = new Map<string, { count: number; resetAt: number }>();
  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const cur = buckets.get(key);
    if (!cur || cur.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }
    if (cur.count >= max) {
      res.status(429).json({ error: message, code });
      return;
    }
    cur.count += 1;
    next();
  };
}

export function registerSuiteRoutes(app: Express): void {
  const requireAuth = makeAuthMiddleware(() => readDb());
  const authRateLimiter = createSimpleRateLimiter(
    60_000,
    12,
    'AUTH_RATE_LIMITED',
    'Too many authentication attempts. Wait 60 seconds and try again.'
  );
  const publicLeadLimiter = createSimpleRateLimiter(
    60_000,
    12,
    'LEAD_RATE_LIMITED',
    'Too many enquiry submissions. Wait 60 seconds and retry.'
  );
  const bookingLimiter = createSimpleRateLimiter(
    60_000,
    10,
    'BOOKING_RATE_LIMITED',
    'Too many booking requests. Please wait a minute and retry.'
  );

  // =========================================================================
  // 1. AUTHENTICATION & SESSION MANAGEMENT (No public signup!)
  // =========================================================================
  app.get('/api/auth/status', (_req: Request, res: Response) => {
    const db = readDb();
    res.json({
      configured: db.users.length > 0,
      hasSuperAdmin: db.users.some((u) => u.role === 'Super Admin' && u.active),
      publicRegistrationAllowed: false,
    });
  });

  app.post('/api/auth/setup', authRateLimiter, async (req: Request, res: Response) => {
    const schema = z.object({
      name: z.string().trim().min(2).max(100),
      email: z.string().trim().email().max(160),
      password: z.string().min(8).max(128),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid setup data.' });
      return;
    }

    try {
      const result = await withDbMutation((db) => {
        if (db.users.length > 0) {
          const err = new Error('Initial Super Admin is already configured.');
          (err as any).statusCode = 409;
          throw err;
        }
        const nowIso = new Date().toISOString();
        const user = {
          id: `usr-${crypto.randomBytes(4).toString('hex')}`,
          name: stripControls(parsed.data.name),
          email: stripControls(parsed.data.email).toLowerCase(),
          role: 'Super Admin' as UserRole,
          active: true,
          passwordHash: hashPassword(parsed.data.password),
          createdAt: nowIso,
          updatedAt: nowIso,
          lastLoginAt: nowIso,
        };
        db.users.push(user);
        const { rawToken, session } = createSessionForUser(db, user);
        appendAuditLog(db, {
          actorId: user.id,
          actorName: user.name,
          actorRole: user.role,
          action: 'INITIAL_SUPER_ADMIN_SETUP',
          targetId: user.id,
          summary: `Created initial Super Admin account (${user.email}).`,
        });
        return {
          token: rawToken,
          expiresAt: session.expiresAt,
          user: toPublicUser(user),
        };
      });
      res.status(201).json(result);
    } catch (err: any) {
      res.status(err?.statusCode || 500).json({ error: err?.message || 'Setup failed.' });
    }
  });

  app.post('/api/auth/login', authRateLimiter, async (req: Request, res: Response) => {
    const schema = z.object({
      email: z.string().trim().max(160).optional().default(''),
      password: z.string().min(1).max(128),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Provide email and password.' });
      return;
    }

    try {
      const result = await withDbMutation((db) => {
        if (db.users.length === 0) {
          const err = new Error('No admin user configured yet. Complete initial owner setup.');
          (err as any).statusCode = 400;
          throw err;
        }
        const cleanEmail = parsed.data.email.trim().toLowerCase();
        const user = cleanEmail
          ? db.users.find((u) => u.email.toLowerCase() === cleanEmail)
          : db.users.find((u) => u.role === 'Super Admin');

        if (!user || !user.active || !verifyPassword(parsed.data.password, user.passwordHash)) {
          appendAuditLog(db, {
            actorId: 'unknown',
            actorName: cleanEmail || 'Anonymous',
            actorRole: 'Public',
            action: 'FAILED_LOGIN',
            targetId: cleanEmail || 'admin',
            summary: 'Rejected invalid admin login attempt.',
          });
          const err = new Error('Invalid credentials or inactive account.');
          (err as any).statusCode = 401;
          throw err;
        }

        const { rawToken, session } = createSessionForUser(db, user);
        appendAuditLog(db, {
          actorId: user.id,
          actorName: user.name,
          actorRole: user.role,
          action: 'ADMIN_LOGIN',
          targetId: user.id,
          summary: `Signed in as ${user.role}.`,
        });
        return {
          token: rawToken,
          expiresAt: session.expiresAt,
          user: toPublicUser(user),
        };
      });
      res.json(result);
    } catch (err: any) {
      res.status(err?.statusCode || 401).json({ error: err?.message || 'Authentication failed.' });
    }
  });

  app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    res.json({ user: req.suiteUser });
  });

  app.post('/api/auth/logout', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    await withDbMutation((db) => {
      db.sessions = db.sessions.filter((s) => s.tokenHash !== req.suiteTokenHash);
      if (req.suiteUser) {
        appendAuditLog(db, {
          actorId: req.suiteUser.id,
          actorName: req.suiteUser.name,
          actorRole: req.suiteUser.role,
          action: 'ADMIN_LOGOUT',
          targetId: req.suiteUser.id,
          summary: 'Signed out cleanly.',
        });
      }
    });
    res.json({ ok: true });
  });

  app.post('/api/auth/change-password', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    const schema = z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(8).max(128),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'New password must be at least 8 characters.' });
      return;
    }
    try {
      await withDbMutation((db) => {
        const user = db.users.find((u) => u.id === req.suiteUser?.id);
        if (!user || !verifyPassword(parsed.data.currentPassword, user.passwordHash)) {
          const err = new Error('Current password does not match.');
          (err as any).statusCode = 400;
          throw err;
        }
        user.passwordHash = hashPassword(parsed.data.newPassword);
        user.updatedAt = new Date().toISOString();
        // Keep the current session alive, but revoke all other sessions after password rotation.
        db.sessions = db.sessions.filter(
          (session) => session.userId !== user.id || session.tokenHash === req.suiteTokenHash
        );
        appendAuditLog(db, {
          actorId: user.id,
          actorName: user.name,
          actorRole: user.role,
          action: 'PASSWORD_ROTATED',
          targetId: user.id,
          summary: 'Updated account password.',
        });
      });
      res.json({ ok: true });
    } catch (err: any) {
      res.status(err?.statusCode || 400).json({ error: err?.message || 'Unable to update password.' });
    }
  });

  // =========================================================================
  // 2. PUBLIC DISCOVERY, TICKER, SERVICES, QUOTATION PORTAL & BOOKINGS
  // =========================================================================
  app.get('/api/public/ticker', (_req: Request, res: Response) => {
    const db = readDb();
    const visibleClients = (db.clients || [])
      .filter((c) => c.showInTicker)
      .map((c) => ({
        id: c.id,
        name: c.name,
        category: c.category,
        websiteUrl: c.websiteUrl || '',
        internalShowcaseRoute: c.internalShowcaseRoute || '',
        wordmarkStyle: c.wordmarkStyle || 'sans',
        verified: c.verified,
        summary: c.summary,
        supportScope: c.supportScope,
      }));
    res.json({
      reportedClientsHandled: db.websiteSettings?.reportedClientsCount || 58,
      verifiedCount: db.clients.filter((c) => c.verified).length,
      clients: visibleClients,
    });
  });

  const handlePublicServices = (_req: Request, res: Response) => {
    const db = readDb();
    const categoryRecords = (db.serviceCategories || [])
      .filter((c) => c.active)
      .slice()
      .sort((a, b) => (a.menuOrder ?? a.sortOrder) - (b.menuOrder ?? b.sortOrder));
    const categories =
      categoryRecords.length > 0 ? categoryRecords.map((c) => c.name) : [...SERVICE_CATEGORIES];
    const services = (db.services || [])
      .filter((s) => s.active)
      .slice()
      .sort((a, b) => (a.menuOrder ?? a.sortOrder) - (b.menuOrder ?? b.sortOrder));
    res.json({
      categories,
      categoryRecords,
      services,
    });
  };

  app.get('/api/public/services', handlePublicServices);
  app.get('/api/public/catalog', handlePublicServices);

  app.get('/api/public/services/:slug', (req: Request, res: Response) => {
    const rawSlug = String(req.params.slug || '').trim().toLowerCase();
    const db = readDb();
    const activeServices = (db.services || []).filter((s) => s.active);
    const service = activeServices.find(
      (s) => s.slug.toLowerCase() === rawSlug || s.id.toLowerCase() === rawSlug
    );
    if (!service) {
      res.status(404).json({ error: 'Standalone service not found.', code: 'SERVICE_NOT_FOUND' });
      return;
    }
    const categoryRecord =
      (db.serviceCategories || []).find(
        (c) => c.name.toLowerCase() === service.category.toLowerCase()
      ) || null;
    const relatedServices = activeServices
      .filter((s) => s.category === service.category && s.id !== service.id)
      .sort((a, b) => (a.menuOrder ?? a.sortOrder) - (b.menuOrder ?? b.sortOrder))
      .slice(0, 6);

    res.json({
      service,
      categoryRecord,
      relatedServices,
    });
  });

  app.get('/api/public/availability', (req: Request, res: Response) => {
    const dateStr = String(req.query.date || '').trim();
    const db = readDb();
    res.json(computeDateAvailability(db, dateStr));
  });

  app.post('/api/public/appointments', bookingLimiter, async (req: Request, res: Response) => {
    const schema = z.object({
      customerName: z.string().trim().min(2).max(100),
      phone: z.string().trim().min(7).max(28),
      email: z.string().trim().email().max(160),
      city: z.string().trim().min(2).max(80),
      country: z.string().trim().min(2).max(80),
      businessName: z.string().trim().max(120).optional().default(''),
      website: z.string().trim().max(240).optional().default(''),
      businessStage: z.string().trim().min(2).max(80),
      consultationTopic: z.string().trim().min(2).max(140),
      businessChallenge: z.string().trim().min(8).max(1500),
      appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      startTime: z.string().regex(/^\d{2}:\d{2}$/),
      endTime: z.string().regex(/^\d{2}:\d{2}$/),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid booking details.' });
      return;
    }

    try {
      const confirmation = await withDbMutation(async (db) => {
        const avail = computeDateAvailability(db, parsed.data.appointmentDate);
        if (avail.blocked) {
          const err = new Error(avail.reason || 'Selected date is unavailable.');
          (err as any).statusCode = 409;
          throw err;
        }
        const slot = avail.slots.find(
          (s) => s.startTime === parsed.data.startTime && s.endTime === parsed.data.endTime
        );
        if (!slot || !slot.available) {
          const err = new Error('Selected consultation slot is no longer available.');
          (err as any).statusCode = 409;
          throw err;
        }

        const nowIso = new Date().toISOString();
        const bookingId = `AKY-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
        const record: SuiteAppointmentRecord = {
          bookingId,
          createdAt: nowIso,
          updatedAt: nowIso,
          customerName: stripControls(parsed.data.customerName),
          phone: stripControls(parsed.data.phone),
          email: stripControls(parsed.data.email),
          city: stripControls(parsed.data.city),
          country: stripControls(parsed.data.country),
          businessName: stripControls(parsed.data.businessName),
          website: stripControls(parsed.data.website),
          businessStage: stripControls(parsed.data.businessStage),
          consultationTopic: stripControls(parsed.data.consultationTopic),
          businessChallenge: stripControls(parsed.data.businessChallenge),
          appointmentDate: parsed.data.appointmentDate,
          startTime: parsed.data.startTime,
          endTime: parsed.data.endTime,
          paymentStatus: 'Payment Awaited',
          bookingStatus: 'Pending',
          adminNotes: '',
          calendarEventId: '',
        };
        db.appointments.unshift(record);
        appendAuditLog(db, {
          actorId: 'public_booking',
          actorName: record.customerName,
          actorRole: 'Public',
          action: 'APPOINTMENT_BOOKED',
          targetId: bookingId,
          summary: `Booked ${record.appointmentDate} ${slot.label}.`,
        });
        await dispatchNotification(db, {
          event: 'appointment_booked',
          subject: `New Consultation Request ${bookingId} — ${record.appointmentDate}`,
          body: `Customer: ${record.customerName}\nEmail: ${record.email}\nPhone: ${record.phone}\nSlot: ${record.appointmentDate} ${slot.label}\nTopic: ${record.consultationTopic}`,
        });

        return {
          bookingId,
          bookingStatus: record.bookingStatus,
          paymentStatus: record.paymentStatus,
          slotLabel: slot.label,
          appointmentDate: record.appointmentDate,
          startTime: record.startTime,
          endTime: record.endTime,
          calendarEventCreated: false,
          confirmationNotice:
            'Your appointment slot is reserved provisionally. Our team will confirm after consultation fee verification.',
        };
      });
      res.status(201).json(confirmation);
    } catch (err: any) {
      res.status(err?.statusCode || 400).json({ error: err?.message || 'Booking failed.' });
    }
  });

  // Public Lead Submission (upgraded Phase 4 fields while staying 100% compatible with old widget)
  app.post('/api/leads', publicLeadLimiter, async (req: Request, res: Response) => {
    const schema = z.object({
      fullName: z.string().trim().min(2).max(100),
      businessName: z.string().trim().min(2).max(120),
      mobileNumber: z
        .string()
        .trim()
        .min(7)
        .max(28)
        .refine((v) => /^[+\d\s\-()]{7,28}$/.test(v), 'Enter a valid mobile number.'),
      email: z.string().trim().email().max(160),
      website: z.string().trim().max(240).optional().default(''),
      city: z.string().trim().min(2).max(80),
      country: z.string().trim().min(2).max(80),
      businessCategory: z.string().trim().max(120).optional().default(''),
      requiredService: z.string().trim().min(2).max(140),
      monthlyMarketingBudget: z.string().trim().min(2).max(80),
      preferredContactMethod: z.string().trim().max(60).optional().default('Phone / WhatsApp'),
      message: z.string().trim().min(8).max(1500),
      consentAccepted: z.boolean().refine((v) => v === true, 'Privacy consent is required.'),
      honeypot: z.string().max(60).optional().default(''),
      source: z.string().trim().max(80).optional().default('Website'),
      campaignSource: z.string().trim().max(40).optional().default('Website'),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        ok: false,
        error: parsed.error.issues[0]?.message || 'Invalid lead enquiry payload.',
        code: 'INVALID_LEAD_PAYLOAD',
      });
      return;
    }
    if (parsed.data.honeypot.trim().length > 0) {
      res.status(400).json({ ok: false, error: 'Submission rejected.', code: 'INVALID_LEAD_PAYLOAD' });
      return;
    }

    const result = await withDbMutation(async (db) => {
      const nowIso = new Date().toISOString();
      const leadId = `AKY-LEAD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
      const cleanEmail = stripControls(parsed.data.email).toLowerCase();
      const cleanPhoneDigits = parsed.data.mobileNumber.replace(/\D/g, '');
      const duplicate = db.leads.find(
        (l) =>
          l.email.toLowerCase() === cleanEmail ||
          (cleanPhoneDigits.length >= 7 &&
            l.mobileNumber.replace(/\D/g, '') === cleanPhoneDigits)
      );

      const srcCandidate = parsed.data.campaignSource as LeadSource;
      const campaignSource: LeadSource = LEAD_SOURCES.includes(srcCandidate)
        ? srcCandidate
        : 'Website';

      const lead: CrmLead = {
        leadId,
        receivedAt: nowIso,
        updatedAt: nowIso,
        fullName: stripControls(parsed.data.fullName),
        mobileNumber: stripControls(parsed.data.mobileNumber),
        email: cleanEmail,
        companyName: stripControls(parsed.data.businessName),
        website: stripControls(parsed.data.website),
        city: stripControls(parsed.data.city),
        country: stripControls(parsed.data.country),
        businessCategory: stripControls(parsed.data.businessCategory),
        requiredService: stripControls(parsed.data.requiredService),
        estimatedBudget: stripControls(parsed.data.monthlyMarketingBudget),
        preferredContactMethod: stripControls(parsed.data.preferredContactMethod),
        description: stripControls(parsed.data.message),
        consentAccepted: true,
        stage: 'NEW',
        secondaryTag: '',
        assignedToUserId: '',
        assignedToName: '',
        followUpAt: '',
        campaignSource,
        expectedDealValue: 0,
        currency: 'INR',
        lostReason: '',
        privateNotes: '',
        convertedClientId: '',
        duplicateWarning: duplicate ? `Matches existing enquiry ${duplicate.leadId}` : '',
        sourcePage: stripControls(parsed.data.source),
        activities: [
          {
            id: `act_${crypto.randomBytes(4).toString('hex')}`,
            timestamp: nowIso,
            actor: 'Public Enquiry Form',
            type: 'system',
            summary: `Submitted via ${stripControls(parsed.data.source)} (${parsed.data.requiredService}).`,
          },
        ],
      };

      db.leads.unshift(lead);
      appendAuditLog(db, {
        actorId: 'public_form',
        actorName: lead.fullName,
        actorRole: 'Public',
        action: 'LEAD_SUBMITTED',
        targetId: leadId,
        summary: `New enquiry from ${lead.companyName} (${lead.requiredService}).`,
      });
      await dispatchNotification(db, {
        event: 'enquiry_received',
        subject: `New Enquiry ${leadId}: ${lead.companyName} (${lead.requiredService})`,
        body: `Name: ${lead.fullName}\nCompany: ${lead.companyName}\nPhone: ${lead.mobileNumber}\nEmail: ${lead.email}\nService: ${lead.requiredService}\nBudget: ${lead.estimatedBudget}\nNotes: ${lead.description}`,
      });
      return { leadId, receivedAt: nowIso };
    });

    res.status(201).json({ ok: true, ...result });
  });

  app.get('/api/leads', (_req: Request, res: Response) => {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ ok: false, error: 'Method not allowed.', code: 'METHOD_NOT_ALLOWED' });
  });

  // Public Quotation Review Portal (Tokenized; never auto-accepts on view!)
  app.get('/api/public/quote/:token', (req: Request, res: Response) => {
    const token = String(req.params.token || '').trim();
    const db = readDb();
    const quote = db.quotations.find((q) => q.shareToken === token);
    if (!quote) {
      res.status(404).json({ error: 'Quotation link is invalid or expired.' });
      return;
    }
    const linkedInvoice = quote.convertedInvoiceId
      ? db.invoices.find((i) => i.id === quote.convertedInvoiceId) || null
      : null;

    res.json({
      quotation: {
        quoteNumber: quote.quoteNumber,
        version: quote.version,
        customerName: quote.customerName,
        companyName: quote.companyName,
        cityCountry: quote.cityCountry,
        currency: quote.currency,
        items: quote.items,
        subtotal: quote.subtotal,
        discountAmount: quote.discountAmount,
        taxableAmount: quote.taxableAmount,
        gstEnabled: quote.gstEnabled,
        gstRate: quote.gstRate,
        gstAmount: quote.gstAmount,
        grandTotal: quote.grandTotal,
        paymentTerms: quote.paymentTerms,
        expiryDate: quote.expiryDate,
        scopeOfWork: quote.scopeOfWork,
        exclusions: quote.exclusions,
        notes: quote.notes,
        status: quote.status,
        customerResponseNote: quote.customerResponseNote,
        respondedAt: quote.respondedAt,
        createdAt: quote.createdAt,
      },
      invoice: linkedInvoice
        ? {
            id: linkedInvoice.id,
            invoiceNumber: linkedInvoice.invoiceNumber,
            currency: linkedInvoice.currency,
            totalAmount: linkedInvoice.totalAmount,
            paidAmount: linkedInvoice.paidAmount,
            status: linkedInvoice.status,
            dueDate: linkedInvoice.dueDate,
          }
        : null,
      uaeGatewayEnabled: Boolean(db.websiteSettings?.uaeGatewayEnabled),
      uaeGatewayNote: db.websiteSettings?.uaeGatewayNote || '',
    });
  });

  app.post('/api/public/quote/:token/respond', async (req: Request, res: Response) => {
    const token = String(req.params.token || '').trim();
    const schema = z.object({
      decision: z.enum(['ACCEPTED', 'REJECTED']),
      note: z.string().trim().max(600).optional().default(''),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid response decision.' });
      return;
    }

    try {
      const updated = await withDbMutation(async (db) => {
        const quote = db.quotations.find((q) => q.shareToken === token);
        if (!quote) {
          const err = new Error('Quotation not found.');
          (err as any).statusCode = 404;
          throw err;
        }
        if (quote.status === 'ACCEPTED' || quote.status === 'REJECTED') {
          const err = new Error(`Quotation is already marked as ${quote.status}.`);
          (err as any).statusCode = 409;
          throw err;
        }
        const nowIso = new Date().toISOString();
        quote.status = parsed.data.decision;
        quote.customerResponseNote = stripControls(parsed.data.note);
        quote.respondedAt = nowIso;
        quote.updatedAt = nowIso;

        appendAuditLog(db, {
          actorId: 'customer_portal',
          actorName: quote.customerName,
          actorRole: 'Public',
          action: `QUOTATION_${parsed.data.decision}`,
          targetId: quote.quoteNumber,
          summary: `Customer explicitly marked quotation ${quote.quoteNumber} as ${parsed.data.decision}.`,
        });

        await dispatchNotification(db, {
          event:
            parsed.data.decision === 'ACCEPTED' ? 'quotation_accepted' : 'quotation_rejected',
          subject: `Quotation ${quote.quoteNumber} ${parsed.data.decision} by ${quote.companyName || quote.customerName}`,
          body: `Quotation: ${quote.quoteNumber}\nCustomer: ${quote.customerName}\nDecision: ${parsed.data.decision}\nNote: ${quote.customerResponseNote || 'None'}`,
        });

        return quote;
      });
      res.json({ ok: true, status: updated.status, respondedAt: updated.respondedAt });
    } catch (err: any) {
      res.status(err?.statusCode || 400).json({ error: err?.message || 'Unable to save response.' });
    }
  });

  // =========================================================================
  // 3. RAZORPAY GATEWAY (Supports both Legacy SKUs + Dynamic Invoices/Quotes)
  // =========================================================================
  app.get('/api/razorpay/config', (_req: Request, res: Response) => {
    const creds = getRazorpayCredentials();
    const db = readDb();
    res.json({
      configured: Boolean(creds),
      mode: creds?.mode || 'test',
      keyId: creds ? creds.keyId : null,
      currency: 'INR',
      catalog: PAYMENT_CATALOG_LIST,
      uaeGatewayEnabled: Boolean(db.websiteSettings?.uaeGatewayEnabled),
      uaeGatewayNote: db.websiteSettings?.uaeGatewayNote || '',
    });
  });

  app.post('/api/razorpay/create-order', async (req: Request, res: Response) => {
    const creds = getRazorpayCredentials();
    if (!creds) {
      res.status(503).json({
        error:
          'Online Razorpay checkout requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment secrets.',
        code: 'RAZORPAY_NOT_CONFIGURED',
      });
      return;
    }

    const bodySchema = z.object({
      sku: z
        .enum([
          'advisory-session',
          'growth-marketing-setup',
          'lead-filtering-setup',
          'sales-training',
          'bulk-sms-starter',
          'whatsapp-business-setup',
        ])
        .optional(),
      invoiceId: z.string().trim().max(80).optional(),
      quotationToken: z.string().trim().max(120).optional(),
      customerName: z.string().trim().max(120).optional().default(''),
      customerEmail: z
        .union([z.string().trim().email().max(160), z.literal('')])
        .optional()
        .default(''),
      customerPhone: z.string().trim().max(30).optional().default(''),
      referenceId: z.string().trim().max(80).optional().default(''),
    });

    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid payment order request.', code: 'INVALID_REQUEST' });
      return;
    }

    const dbSnapshot = readDb();
    let amountMajor = 0;
    let currency: 'INR' | 'AED' | 'USD' = 'INR';
    let title = 'AKYIN Commercial Payment';
    let description = 'Verified payment via AKYIN.com';
    let invoiceId = '';
    let invoiceNumber = '';
    let quotationId = '';
    let clientId = '';
    let serviceCategory = 'Business consulting';
    let gstPortion = 0;
    let leadSource: LeadSource = 'Website';

    if (parsed.data.invoiceId) {
      const inv = dbSnapshot.invoices.find((i) => i.id === parsed.data.invoiceId);
      if (!inv) {
        res.status(404).json({ error: 'Invoice not found.' });
        return;
      }
      if (inv.currency !== 'INR') {
        res.status(400).json({
          error: `Online Razorpay order only supports INR settlement right now (${inv.currency} invoices use manual transfer).`,
          code: 'CURRENCY_MANUAL_FALLBACK',
        });
        return;
      }
      amountMajor = round2(Math.max(0, inv.totalAmount - inv.paidAmount));
      if (amountMajor <= 0) {
        res.status(409).json({ error: 'Invoice balance is already settled.' });
        return;
      }
      title = `Invoice ${inv.invoiceNumber}`;
      description = `${inv.companyName || inv.customerName} (${inv.paymentType})`;
      invoiceId = inv.id;
      invoiceNumber = inv.invoiceNumber;
      quotationId = inv.quotationId;
      clientId = inv.clientId;
      serviceCategory = inv.serviceCategory;
      gstPortion = inv.gstAmount;
      leadSource = inv.leadSource;
    } else if (parsed.data.sku) {
      const item = PAYMENT_CATALOG_BY_SKU[parsed.data.sku as PaymentSku];
      if (!item) {
        res.status(404).json({ error: 'Catalog item not found.' });
        return;
      }
      amountMajor = item.amountInr;
      title = item.title;
      description = item.description;
      serviceCategory = item.category;
    } else {
      res.status(400).json({ error: 'Provide either sku or invoiceId.' });
      return;
    }

    const amountPaise = Math.round(amountMajor * 100);
    const receipt = `aky_${Date.now().toString(36)}_${crypto.randomBytes(2).toString('hex')}`;

    try {
      const authHeader = Buffer.from(`${creds.keyId}:${creds.keySecret}`).toString('base64');
      const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${authHeader}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountPaise,
          currency,
          receipt,
          notes: {
            invoiceId: invoiceId || '',
            sku: parsed.data.sku || '',
            mode: creds.mode,
            customerName: parsed.data.customerName || 'Client',
          },
        }),
      });
      const rzpBody = (await rzpResponse.json().catch(() => ({}))) as {
        id?: string;
        receipt?: string;
        error?: { description?: string };
      };
      if (!rzpResponse.ok || !rzpBody.id) {
        res.status(502).json({
          error: rzpBody?.error?.description || 'Razorpay refused order creation.',
          code: 'RAZORPAY_UPSTREAM_ERROR',
        });
        return;
      }

      const orderId = rzpBody.id;
      await withDbMutation((db) => {
        const nowIso = new Date().toISOString();
        const paymentRec: PaymentRecord = {
          id: `PAY-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
          invoiceId,
          invoiceNumber,
          quotationId,
          clientId,
          customerName: parsed.data.customerName || 'Web Client',
          customerEmail: parsed.data.customerEmail || '',
          serviceCategory,
          leadSource,
          mode: creds.mode,
          gateway: 'razorpay',
          method: 'razorpay_checkout',
          currency,
          amount: amountMajor,
          gstPortion,
          gatewayFeeAmount: 0,
          refundedAmount: 0,
          status: 'created',
          verified: false,
          razorpayOrderId: orderId,
          razorpayPaymentId: '',
          razorpaySignatureVerified: false,
          webhookEventIds: [],
          idempotencyKey: `order:${orderId}`,
          notes: description,
          createdAt: nowIso,
          capturedAt: '',
          updatedAt: nowIso,
        };
        db.payments.unshift(paymentRec);
      });

      res.json({
        orderId,
        amount: amountPaise,
        currency,
        keyId: creds.keyId,
        mode: creds.mode,
        sku: parsed.data.sku || null,
        invoiceId: invoiceId || null,
        title,
        displayPrice: `₹${amountMajor.toLocaleString('en-IN')}`,
        description,
        receipt: rzpBody.receipt || receipt,
      });
    } catch (err) {
      res.status(502).json({
        error: err instanceof Error ? err.message : 'Unable to reach Razorpay Orders API.',
        code: 'RAZORPAY_NETWORK_ERROR',
      });
    }
  });

  app.post('/api/razorpay/verify-payment', async (req: Request, res: Response) => {
    const creds = getRazorpayCredentials();
    if (!creds) {
      res.status(503).json({ verified: false, error: 'Razorpay not configured.' });
      return;
    }
    const schema = z.object({
      razorpay_order_id: z.string().trim().min(4).max(100),
      razorpay_payment_id: z.string().trim().min(4).max(100),
      razorpay_signature: z.string().trim().regex(/^[a-f0-9]{64}$/i),
      sku: z
        .enum([
          'advisory-session',
          'growth-marketing-setup',
          'lead-filtering-setup',
          'sales-training',
          'bulk-sms-starter',
          'whatsapp-business-setup',
        ])
        .optional(),
      invoiceId: z.string().trim().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ verified: false, error: 'Invalid payment verification payload.' });
      return;
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, sku } = parsed.data;
    if (
      !verifyRazorpayCheckoutSignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        creds.keySecret
      )
    ) {
      res.status(400).json({
        verified: false,
        error: 'Payment signature mismatch.',
        code: 'SIGNATURE_MISMATCH',
      });
      return;
    }

    const settled = await withDbMutation(async (db) => {
      const nowIso = new Date().toISOString();
      const paymentRec = db.payments.find(
        (p) =>
          p.razorpayOrderId === razorpay_order_id ||
          (razorpay_payment_id && p.razorpayPaymentId === razorpay_payment_id)
      );
      if (paymentRec) {
        const wasSettled = paymentRec.status === 'captured' && paymentRec.verified;
        paymentRec.razorpayPaymentId = razorpay_payment_id;
        paymentRec.razorpaySignatureVerified = true;
        paymentRec.verified = true;
        paymentRec.status = 'captured';
        paymentRec.capturedAt = paymentRec.capturedAt || nowIso;
        paymentRec.updatedAt = nowIso;

        if (!wasSettled && paymentRec.invoiceId) {
          const inv = db.invoices.find((i) => i.id === paymentRec.invoiceId);
          if (inv) {
            inv.paidAmount = round2(inv.paidAmount + paymentRec.amount);
            recalculateInvoiceStatus(inv);
          }
        }
      }
      appendAuditLog(db, {
        actorId: 'razorpay_verify',
        actorName: 'Razorpay Checkout',
        actorRole: 'System',
        action: 'PAYMENT_VERIFIED',
        targetId: razorpay_payment_id,
        summary: `Verified HMAC-SHA256 Razorpay payment ${razorpay_payment_id} (${creds.mode} mode).`,
      });
      await dispatchNotification(db, {
        event: 'payment_received',
        subject: `Verified Razorpay Payment ${razorpay_payment_id} (${creds.mode.toUpperCase()})`,
        body: `Order ID: ${razorpay_order_id}\nPayment ID: ${razorpay_payment_id}\nMode: ${creds.mode}`,
      });
      return paymentRec;
    });

    const item = sku ? PAYMENT_CATALOG_BY_SKU[sku] : undefined;
    res.json({
      verified: true,
      mode: creds.mode,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      sku: sku || null,
      title: item?.title || settled?.notes || 'AKYIN Commercial Payment',
      displayPrice: item?.displayPrice || null,
      verifiedAt: new Date().toISOString(),
    });
  });

  // =========================================================================
  // 4. PROTECTED ADMIN SUITE ENDPOINTS (/api/suite/*)
  // =========================================================================
  app.get(
    '/api/suite/overview',
    requireAuth,
    requirePermission('overview'),
    (_req: Request, res: Response) => {
      const db = readDb();
      const kpis = computeDashboardKpis(db);
      res.json({
        kpis,
        recentLeads: db.leads.slice(0, 8),
        recentAppointments: db.appointments.slice(0, 8),
        recentPayments: db.payments.slice(0, 8),
        recentQuotations: db.quotations.slice(0, 8),
        razorpayMode: getRazorpayCredentials()?.mode || 'test',
        razorpayConfigured: Boolean(getRazorpayCredentials()),
        smtpConfigured: Boolean(getSmtpConfig()),
      });
    }
  );

  // --- Leads & CRM ---
  app.get(
    '/api/suite/leads',
    requireAuth,
    requirePermission('leads'),
    (req: Request, res: Response) => {
      const db = readDb();
      const q = String(req.query.q || '').trim().toLowerCase();
      const stage = String(req.query.stage || '').trim();
      const source = String(req.query.source || '').trim();

      let list = db.leads || [];
      if (stage && stage !== 'ALL') {
        list = list.filter((l) => l.stage === stage);
      }
      if (source && source !== 'ALL') {
        list = list.filter((l) => l.campaignSource === source);
      }
      if (q) {
        list = list.filter(
          (l) =>
            l.leadId.toLowerCase().includes(q) ||
            l.fullName.toLowerCase().includes(q) ||
            l.companyName.toLowerCase().includes(q) ||
            l.email.toLowerCase().includes(q) ||
            l.mobileNumber.toLowerCase().includes(q) ||
            l.requiredService.toLowerCase().includes(q)
        );
      }
      res.json({ leads: list, stages: CRM_STAGES, sources: LEAD_SOURCES });
    }
  );

  app.get(
    '/api/suite/leads/export.csv',
    requireAuth,
    requirePermission('leads'),
    (_req: Request, res: Response) => {
      const db = readDb();
      const header = [
        'Lead ID',
        'Received At',
        'Full Name',
        'Company',
        'Email',
        'Mobile',
        'City',
        'Country',
        'Service',
        'Budget',
        'Stage',
        'Source',
        'Expected Value',
      ]
        .map(sanitizeCsvCell)
        .join(',');
      const rows = (db.leads || []).map((l) =>
        [
          l.leadId,
          l.receivedAt,
          l.fullName,
          l.companyName,
          l.email,
          l.mobileNumber,
          l.city,
          l.country,
          l.requiredService,
          l.estimatedBudget,
          l.stage,
          l.campaignSource,
          l.expectedDealValue,
        ]
          .map(sanitizeCsvCell)
          .join(',')
      );
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="akyin-leads-crm.csv"');
      res.send([header, ...rows].join('\n'));
    }
  );

  app.post(
    '/api/suite/leads',
    requireAuth,
    requirePermission('leads'),
    async (req: AuthenticatedRequest, res: Response) => {
      const schema = z.object({
        fullName: z.string().trim().min(2).max(100),
        companyName: z.string().trim().max(120).default(''),
        mobileNumber: z.string().trim().min(7).max(28),
        email: z.string().trim().email().max(160),
        city: z.string().trim().max(80).default(''),
        country: z.string().trim().max(80).default('India'),
        businessCategory: z.string().trim().max(120).default(''),
        requiredService: z.string().trim().min(2).max(140),
        estimatedBudget: z.string().trim().max(80).default(''),
        campaignSource: z.string().trim().max(40).default('Direct contact'),
        expectedDealValue: z.number().finite().min(0).default(0),
        description: z.string().trim().max(1500).default(''),
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid lead data.' });
        return;
      }

      const lead = await withDbMutation((db) => {
        const nowIso = new Date().toISOString();
        const leadId = `AKY-LEAD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        const srcCandidate = parsed.data.campaignSource as LeadSource;
        const created: CrmLead = {
          leadId,
          receivedAt: nowIso,
          updatedAt: nowIso,
          fullName: stripControls(parsed.data.fullName),
          mobileNumber: stripControls(parsed.data.mobileNumber),
          email: stripControls(parsed.data.email).toLowerCase(),
          companyName: stripControls(parsed.data.companyName),
          website: '',
          city: stripControls(parsed.data.city),
          country: stripControls(parsed.data.country),
          businessCategory: stripControls(parsed.data.businessCategory),
          requiredService: stripControls(parsed.data.requiredService),
          estimatedBudget: stripControls(parsed.data.estimatedBudget),
          preferredContactMethod: 'Phone / WhatsApp',
          description: stripControls(parsed.data.description),
          consentAccepted: true,
          stage: 'NEW',
          secondaryTag: '',
          assignedToUserId: req.suiteUser?.id || '',
          assignedToName: req.suiteUser?.name || '',
          followUpAt: '',
          campaignSource: LEAD_SOURCES.includes(srcCandidate) ? srcCandidate : 'Direct contact',
          expectedDealValue: round2(parsed.data.expectedDealValue),
          currency: 'INR',
          lostReason: '',
          privateNotes: '',
          convertedClientId: '',
          duplicateWarning: '',
          sourcePage: 'Admin Manual Entry',
          activities: [
            {
              id: `act_${crypto.randomBytes(4).toString('hex')}`,
              timestamp: nowIso,
              actor: req.suiteUser?.name || 'Admin',
              type: 'system',
              summary: 'Created manually inside CRM.',
            },
          ],
        };
        db.leads.unshift(created);
        appendAuditLog(db, {
          actorId: req.suiteUser!.id,
          actorName: req.suiteUser!.name,
          actorRole: req.suiteUser!.role,
          action: 'CREATE_CRM_LEAD',
          targetId: leadId,
          summary: `Added lead ${created.fullName} (${created.companyName}).`,
        });
        return created;
      });
      res.status(201).json({ lead });
    }
  );

  app.patch(
    '/api/suite/leads/:leadId',
    requireAuth,
    requirePermission('leads'),
    async (req: AuthenticatedRequest, res: Response) => {
      const leadId = String(req.params.leadId || '');
      try {
        const updated = await withDbMutation(async (db) => {
          const lead = db.leads.find((l) => l.leadId === leadId);
          if (!lead) {
            const err = new Error('Lead not found.');
            (err as any).statusCode = 404;
            throw err;
          }
          const body = req.body || {};
          const prevStage = lead.stage;
          const prevAssignee = lead.assignedToUserId;
          const nowIso = new Date().toISOString();

          if (typeof body.stage === 'string' && CRM_STAGES.includes(body.stage as any)) {
            lead.stage = body.stage as any;
          }
          if (typeof body.secondaryTag === 'string') {
            lead.secondaryTag = body.secondaryTag as any;
          }
          if (typeof body.assignedToUserId === 'string') {
            lead.assignedToUserId = body.assignedToUserId;
            const targetUser = db.users.find((u) => u.id === body.assignedToUserId);
            lead.assignedToName = targetUser ? targetUser.name : body.assignedToName || '';
          }
          if (typeof body.followUpAt === 'string') lead.followUpAt = body.followUpAt;
          if (typeof body.campaignSource === 'string' && LEAD_SOURCES.includes(body.campaignSource as any)) {
            lead.campaignSource = body.campaignSource as LeadSource;
          }
          if (typeof body.expectedDealValue === 'number' && Number.isFinite(body.expectedDealValue)) {
            lead.expectedDealValue = round2(Math.max(0, body.expectedDealValue));
          }
          if (typeof body.lostReason === 'string') lead.lostReason = stripControls(body.lostReason);
          if (typeof body.privateNotes === 'string') lead.privateNotes = stripControls(body.privateNotes);
          lead.updatedAt = nowIso;

          if (prevStage !== lead.stage) {
            lead.activities.unshift({
              id: `act_${crypto.randomBytes(4).toString('hex')}`,
              timestamp: nowIso,
              actor: req.suiteUser!.name,
              type: 'stage_change',
              summary: `Moved stage from ${prevStage} to ${lead.stage}.`,
            });
          }
          if (prevAssignee !== lead.assignedToUserId && lead.assignedToName) {
            await dispatchNotification(db, {
              event: 'lead_assigned',
              subject: `Lead ${lead.leadId} assigned to ${lead.assignedToName}`,
              body: `Lead: ${lead.fullName} (${lead.companyName})\nAssigned to: ${lead.assignedToName}\nStage: ${lead.stage}`,
            });
          }

          appendAuditLog(db, {
            actorId: req.suiteUser!.id,
            actorName: req.suiteUser!.name,
            actorRole: req.suiteUser!.role,
            action: 'UPDATE_CRM_LEAD',
            targetId: lead.leadId,
            summary: `Updated lead stage=${lead.stage}, followUp=${lead.followUpAt || 'none'}.`,
          });
          return lead;
        });
        res.json({ lead: updated });
      } catch (err: any) {
        res.status(err?.statusCode || 400).json({ error: err?.message || 'Update failed.' });
      }
    }
  );

  app.post(
    '/api/suite/leads/:leadId/activity',
    requireAuth,
    requirePermission('leads'),
    async (req: AuthenticatedRequest, res: Response) => {
      const leadId = String(req.params.leadId || '');
      const schema = z.object({
        type: z.enum(['note', 'call', 'email', 'whatsapp']),
        summary: z.string().trim().min(2).max(1000),
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: 'Provide activity summary.' });
        return;
      }
      try {
        const updated = await withDbMutation((db) => {
          const lead = db.leads.find((l) => l.leadId === leadId);
          if (!lead) {
            const err = new Error('Lead not found.');
            (err as any).statusCode = 404;
            throw err;
          }
          const nowIso = new Date().toISOString();
          lead.activities.unshift({
            id: `act_${crypto.randomBytes(4).toString('hex')}`,
            timestamp: nowIso,
            actor: req.suiteUser!.name,
            type: parsed.data.type,
            summary: stripControls(parsed.data.summary),
          });
          lead.updatedAt = nowIso;
          return lead;
        });
        res.json({ lead: updated });
      } catch (err: any) {
        res.status(err?.statusCode || 400).json({ error: err?.message || 'Activity log failed.' });
      }
    }
  );

  app.post(
    '/api/suite/leads/:leadId/convert-client',
    requireAuth,
    requirePermission('clients'),
    async (req: AuthenticatedRequest, res: Response) => {
      const leadId = String(req.params.leadId || '');
      try {
        const result = await withDbMutation((db) => {
          const lead = db.leads.find((l) => l.leadId === leadId);
          if (!lead) {
            const err = new Error('Lead not found.');
            (err as any).statusCode = 404;
            throw err;
          }
          if (lead.convertedClientId) {
            const existing = db.clients.find((c) => c.id === lead.convertedClientId);
            if (existing) return { client: existing, lead };
          }
          const nowIso = new Date().toISOString();
          const clientId = `client-${crypto.randomBytes(4).toString('hex')}`;
          const newClient = {
            id: clientId,
            name: lead.companyName || lead.fullName,
            companyName: lead.companyName || lead.fullName,
            category: lead.businessCategory || lead.requiredService || 'Commercial Client',
            contactPerson: lead.fullName,
            email: lead.email,
            phone: lead.mobileNumber,
            city: lead.city,
            country: lead.country,
            websiteUrl: lead.website,
            supportScope: lead.requiredService,
            summary: lead.description.slice(0, 220),
            status: 'Active' as const,
            verified: true,
            showInTicker: false,
            wordmarkStyle: 'sans' as const,
            sourceLeadId: lead.leadId,
            createdAt: nowIso,
            updatedAt: nowIso,
          };
          db.clients.unshift(newClient);
          lead.stage = 'WON';
          lead.convertedClientId = clientId;
          lead.updatedAt = nowIso;
          lead.activities.unshift({
            id: `act_${crypto.randomBytes(4).toString('hex')}`,
            timestamp: nowIso,
            actor: req.suiteUser!.name,
            type: 'system',
            summary: `Converted WON lead to verified client record (${clientId}).`,
          });
          appendAuditLog(db, {
            actorId: req.suiteUser!.id,
            actorName: req.suiteUser!.name,
            actorRole: req.suiteUser!.role,
            action: 'CONVERT_LEAD_TO_CLIENT',
            targetId: clientId,
            summary: `Converted lead ${lead.leadId} to client ${newClient.name}.`,
          });
          return { client: newClient, lead };
        });
        res.status(201).json(result);
      } catch (err: any) {
        res.status(err?.statusCode || 400).json({ error: err?.message || 'Conversion failed.' });
      }
    }
  );

  // --- Clients & Ticker Directory ---
  app.get(
    '/api/suite/clients',
    requireAuth,
    requirePermission('clients'),
    (_req: Request, res: Response) => {
      const db = readDb();
      res.json({
        clients: db.clients,
        reportedClientsHandled: db.websiteSettings?.reportedClientsCount || 58,
      });
    }
  );

  app.get(
    '/api/suite/clients/export.csv',
    requireAuth,
    requirePermission('clients'),
    (_req: Request, res: Response) => {
      const db = readDb();
      const header = [
        'Client ID',
        'Name',
        'Category',
        'Contact Person',
        'Email',
        'Phone',
        'City',
        'Country',
        'Support Scope',
        'Status',
        'Verified',
        'In Ticker',
      ]
        .map(sanitizeCsvCell)
        .join(',');
      const rows = (db.clients || []).map((c) =>
        [
          c.id,
          c.name,
          c.category,
          c.contactPerson,
          c.email,
          c.phone,
          c.city,
          c.country,
          c.supportScope,
          c.status,
          c.verified ? 'Yes' : 'No',
          c.showInTicker ? 'Visible' : 'Hidden',
        ]
          .map(sanitizeCsvCell)
          .join(',')
      );
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="akyin-clients.csv"');
      res.send([header, ...rows].join('\n'));
    }
  );

  app.post(
    '/api/suite/clients',
    requireAuth,
    requirePermission('clients'),
    async (req: AuthenticatedRequest, res: Response) => {
      const schema = z.object({
        name: z.string().trim().min(2).max(120),
        companyName: z.string().trim().max(120).optional().default(''),
        category: z.string().trim().min(2).max(100),
        contactPerson: z.string().trim().max(100).optional().default(''),
        email: z.string().trim().max(160).optional().default(''),
        phone: z.string().trim().max(30).optional().default(''),
        city: z.string().trim().max(80).optional().default(''),
        country: z.string().trim().max(80).optional().default('India'),
        websiteUrl: z.string().trim().max(240).optional().default(''),
        supportScope: z.string().trim().max(200).optional().default(''),
        summary: z.string().trim().max(500).optional().default(''),
        verified: z.boolean().optional().default(true),
        showInTicker: z.boolean().optional().default(false),
        wordmarkStyle: z.enum(['sans', 'serif', 'mono']).optional().default('sans'),
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid client payload.' });
        return;
      }

      const client = await withDbMutation((db) => {
        const nowIso = new Date().toISOString();
        const id = `client-${crypto.randomBytes(4).toString('hex')}`;
        const record = {
          id,
          name: stripControls(parsed.data.name),
          companyName: stripControls(parsed.data.companyName || parsed.data.name),
          category: stripControls(parsed.data.category),
          contactPerson: stripControls(parsed.data.contactPerson),
          email: stripControls(parsed.data.email),
          phone: stripControls(parsed.data.phone),
          city: stripControls(parsed.data.city),
          country: stripControls(parsed.data.country),
          websiteUrl: stripControls(parsed.data.websiteUrl),
          supportScope: stripControls(parsed.data.supportScope),
          summary: stripControls(parsed.data.summary),
          status: 'Active' as const,
          verified: parsed.data.verified,
          showInTicker: parsed.data.showInTicker,
          wordmarkStyle: parsed.data.wordmarkStyle,
          createdAt: nowIso,
          updatedAt: nowIso,
        };
        db.clients.push(record);
        appendAuditLog(db, {
          actorId: req.suiteUser!.id,
          actorName: req.suiteUser!.name,
          actorRole: req.suiteUser!.role,
          action: 'ADD_CLIENT_RECORD',
          targetId: id,
          summary: `Added client '${record.name}' (ticker=${record.showInTicker}).`,
        });
        return record;
      });
      res.status(201).json({ client });
    }
  );

  app.patch(
    '/api/suite/clients/:clientId',
    requireAuth,
    requirePermission('clients'),
    async (req: AuthenticatedRequest, res: Response) => {
      const clientId = String(req.params.clientId || '');
      try {
        const updated = await withDbMutation((db) => {
          const client = db.clients.find((c) => c.id === clientId);
          if (!client) {
            const err = new Error('Client not found.');
            (err as any).statusCode = 404;
            throw err;
          }
          const b = req.body || {};
          if (typeof b.name === 'string' && b.name.trim()) client.name = stripControls(b.name);
          if (typeof b.companyName === 'string') client.companyName = stripControls(b.companyName);
          if (typeof b.category === 'string') client.category = stripControls(b.category);
          if (typeof b.contactPerson === 'string') client.contactPerson = stripControls(b.contactPerson);
          if (typeof b.email === 'string') client.email = stripControls(b.email);
          if (typeof b.phone === 'string') client.phone = stripControls(b.phone);
          if (typeof b.city === 'string') client.city = stripControls(b.city);
          if (typeof b.country === 'string') client.country = stripControls(b.country);
          if (typeof b.websiteUrl === 'string') client.websiteUrl = stripControls(b.websiteUrl);
          if (typeof b.supportScope === 'string') client.supportScope = stripControls(b.supportScope);
          if (typeof b.summary === 'string') client.summary = stripControls(b.summary);
          if (typeof b.verified === 'boolean') client.verified = b.verified;
          if (typeof b.showInTicker === 'boolean') client.showInTicker = b.showInTicker;
          if (b.status === 'Active' || b.status === 'Paused' || b.status === 'Completed') {
            client.status = b.status;
          }
          client.updatedAt = new Date().toISOString();
          appendAuditLog(db, {
            actorId: req.suiteUser!.id,
            actorName: req.suiteUser!.name,
            actorRole: req.suiteUser!.role,
            action: 'UPDATE_CLIENT_RECORD',
            targetId: client.id,
            summary: `Updated client '${client.name}' (ticker=${client.showInTicker}).`,
          });
          return client;
        });
        res.json({ client: updated });
      } catch (err: any) {
        res.status(err?.statusCode || 400).json({ error: err?.message || 'Client update failed.' });
      }
    }
  );

  app.delete(
    '/api/suite/clients/:clientId',
    requireAuth,
    requirePermission('clients'),
    async (req: AuthenticatedRequest, res: Response) => {
      const clientId = String(req.params.clientId || '');
      await withDbMutation((db) => {
        const before = db.clients.length;
        db.clients = db.clients.filter((c) => c.id !== clientId);
        if (db.clients.length !== before) {
          appendAuditLog(db, {
            actorId: req.suiteUser!.id,
            actorName: req.suiteUser!.name,
            actorRole: req.suiteUser!.role,
            action: 'DELETE_CLIENT_RECORD',
            targetId: clientId,
            summary: `Removed client entry ${clientId}.`,
          });
        }
      });
      res.json({ ok: true });
    }
  );

  // --- Service Categories & Menu Order ---
  app.get(
    '/api/suite/service-categories',
    requireAuth,
    requirePermission('services'),
    (_req: Request, res: Response) => {
      const db = readDb();
      const categoryRecords = (db.serviceCategories || [])
        .slice()
        .sort((a, b) => (a.menuOrder ?? a.sortOrder) - (b.menuOrder ?? b.sortOrder));
      res.json({ categoryRecords });
    }
  );

  app.post(
    '/api/suite/service-categories',
    requireAuth,
    requirePermission('services'),
    async (req: AuthenticatedRequest, res: Response) => {
      const schema = z.object({
        name: z.string().trim().min(2).max(80),
        slug: z.string().trim().max(100).optional(),
        description: z.string().trim().max(400).optional().default(''),
        menuOrder: z.number().finite().int().min(1).max(1000).optional(),
        active: z.boolean().optional().default(true),
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid category data.' });
        return;
      }

      try {
        const created = await withDbMutation((db) => {
          if (!Array.isArray(db.serviceCategories)) db.serviceCategories = [];
          const cleanName = stripControls(parsed.data.name);
          const cleanSlug = slugifyServiceName(parsed.data.slug || cleanName);
          const duplicate = db.serviceCategories.find(
            (c) =>
              c.name.trim().toLowerCase() === cleanName.toLowerCase() ||
              c.slug.toLowerCase() === cleanSlug
          );
          if (duplicate) {
            const err = new Error(`Category '${duplicate.name}' already exists.`);
            (err as any).statusCode = 409;
            throw err;
          }
          const nowIso = new Date().toISOString();
          const nextOrder = db.serviceCategories.length + 1;
          const record: ServiceCategoryRecord = {
            id: `cat-${crypto.randomBytes(4).toString('hex')}`,
            name: cleanName,
            slug: cleanSlug,
            description: stripControls(parsed.data.description),
            sortOrder: nextOrder,
            menuOrder: parsed.data.menuOrder ?? nextOrder,
            active: parsed.data.active,
            updatedAt: nowIso,
          };
          db.serviceCategories.push(record);
          appendAuditLog(db, {
            actorId: req.suiteUser!.id,
            actorName: req.suiteUser!.name,
            actorRole: req.suiteUser!.role,
            action: 'CREATE_SERVICE_CATEGORY',
            targetId: record.id,
            summary: `Added service category '${record.name}'.`,
          });
          return record;
        });
        res.status(201).json({ category: created });
      } catch (err: any) {
        res.status(err?.statusCode || 400).json({ error: err?.message || 'Category creation failed.' });
      }
    }
  );

  app.put(
    '/api/suite/service-categories/reorder',
    requireAuth,
    requirePermission('services'),
    async (req: AuthenticatedRequest, res: Response) => {
      const schema = z.object({
        categoryIds: z.array(z.string().trim().min(1)).min(1),
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: 'Provide ordered categoryIds.' });
        return;
      }

      const ordered = await withDbMutation((db) => {
        const orderMap = new Map(parsed.data.categoryIds.map((id, idx) => [id, idx + 1]));
        const nowIso = new Date().toISOString();
        for (const cat of db.serviceCategories || []) {
          const pos = orderMap.get(cat.id);
          if (pos !== undefined) {
            cat.menuOrder = pos;
            cat.sortOrder = pos;
            cat.updatedAt = nowIso;
          }
        }
        db.serviceCategories.sort((a, b) => (a.menuOrder ?? a.sortOrder) - (b.menuOrder ?? b.sortOrder));
        appendAuditLog(db, {
          actorId: req.suiteUser!.id,
          actorName: req.suiteUser!.name,
          actorRole: req.suiteUser!.role,
          action: 'REORDER_SERVICE_CATEGORIES',
          targetId: 'CATEGORIES',
          summary: `Updated menu order across ${db.serviceCategories.length} categories.`,
        });
        return db.serviceCategories;
      });
      res.json({ categoryRecords: ordered });
    }
  );

  app.patch(
    '/api/suite/service-categories/:catId',
    requireAuth,
    requirePermission('services'),
    async (req: AuthenticatedRequest, res: Response) => {
      const catId = String(req.params.catId || '').trim();
      try {
        const updated = await withDbMutation((db) => {
          const cat = (db.serviceCategories || []).find((c) => c.id === catId);
          if (!cat) {
            const err = new Error('Service category not found.');
            (err as any).statusCode = 404;
            throw err;
          }
          const b = req.body || {};
          const prevName = cat.name;
          if (typeof b.name === 'string' && b.name.trim()) {
            const cleanName = stripControls(b.name);
            const dup = db.serviceCategories.find(
              (c) => c.id !== catId && c.name.trim().toLowerCase() === cleanName.toLowerCase()
            );
            if (dup) {
              const err = new Error(`Category name '${cleanName}' already exists.`);
              (err as any).statusCode = 409;
              throw err;
            }
            cat.name = cleanName;
          }
          if (typeof b.slug === 'string' && b.slug.trim()) {
            const cleanSlug = slugifyServiceName(b.slug);
            const dupSlug = db.serviceCategories.find(
              (c) => c.id !== catId && c.slug.toLowerCase() === cleanSlug
            );
            if (dupSlug) {
              const err = new Error(`Category slug '${cleanSlug}' already exists.`);
              (err as any).statusCode = 409;
              throw err;
            }
            cat.slug = cleanSlug;
          }
          if (typeof b.description === 'string') cat.description = stripControls(b.description);
          if (typeof b.menuOrder === 'number' && Number.isFinite(b.menuOrder)) {
            cat.menuOrder = Math.max(1, Math.floor(b.menuOrder));
            cat.sortOrder = cat.menuOrder;
          }
          if (typeof b.active === 'boolean') cat.active = b.active;
          cat.updatedAt = new Date().toISOString();

          if (cat.name !== prevName) {
            for (const srv of db.services) {
              if (srv.category === prevName) {
                srv.category = cat.name;
              }
            }
          }

          appendAuditLog(db, {
            actorId: req.suiteUser!.id,
            actorName: req.suiteUser!.name,
            actorRole: req.suiteUser!.role,
            action: 'UPDATE_SERVICE_CATEGORY',
            targetId: cat.id,
            summary: `Updated category '${cat.name}' (active=${cat.active}, order=${cat.menuOrder}).`,
          });
          return cat;
        });
        res.json({ category: updated });
      } catch (err: any) {
        res.status(err?.statusCode || 400).json({ error: err?.message || 'Category update failed.' });
      }
    }
  );

  app.delete(
    '/api/suite/service-categories/:catId',
    requireAuth,
    requirePermission('services'),
    async (req: AuthenticatedRequest, res: Response) => {
      const catId = String(req.params.catId || '').trim();
      try {
        await withDbMutation((db) => {
          const cat = (db.serviceCategories || []).find((c) => c.id === catId);
          if (!cat) {
            const err = new Error('Category not found.');
            (err as any).statusCode = 404;
            throw err;
          }
          const linkedCount = db.services.filter((s) => s.category === cat.name).length;
          if (linkedCount > 0) {
            const err = new Error(
              `Cannot delete '${cat.name}' while ${linkedCount} service(s) belong to it. Reassign services first.`
            );
            (err as any).statusCode = 409;
            throw err;
          }
          db.serviceCategories = db.serviceCategories.filter((c) => c.id !== catId);
          appendAuditLog(db, {
            actorId: req.suiteUser!.id,
            actorName: req.suiteUser!.name,
            actorRole: req.suiteUser!.role,
            action: 'DELETE_SERVICE_CATEGORY',
            targetId: catId,
            summary: `Removed category '${cat.name}'.`,
          });
        });
        res.json({ ok: true });
      } catch (err: any) {
        res.status(err?.statusCode || 400).json({ error: err?.message || 'Delete failed.' });
      }
    }
  );

  // --- Service Catalogue ---
  app.get(
    '/api/suite/services',
    requireAuth,
    requirePermission('services'),
    (_req: Request, res: Response) => {
      const db = readDb();
      const categoryRecords = (db.serviceCategories || [])
        .slice()
        .sort((a, b) => (a.menuOrder ?? a.sortOrder) - (b.menuOrder ?? b.sortOrder));
      const categories =
        categoryRecords.length > 0 ? categoryRecords.map((c) => c.name) : [...SERVICE_CATEGORIES];
      res.json({
        categories,
        categoryRecords,
        services: (db.services || [])
          .slice()
          .sort((a, b) => (a.menuOrder ?? a.sortOrder) - (b.menuOrder ?? b.sortOrder)),
      });
    }
  );

  app.get(
    '/api/suite/services/price-history',
    requireAuth,
    requirePermission('services'),
    (_req: Request, res: Response) => {
      const db = readDb();
      const sortedServices = (db.services || []).slice().sort((a, b) => a.sortOrder - b.sortOrder);
      const revisions: Array<{
        id: string;
        serviceId: string;
        serviceName: string;
        category: string;
        currentPrice: number;
        previousPrice: number;
        newPrice: number;
        effectiveDate: string;
        changedBy: string;
        changedByEmail: string;
        priceField: string;
        note: string;
      }> = [];

      for (const srv of sortedServices) {
        const currentPrice =
          srv.oneTimePrice ?? srv.setupFee ?? srv.monthlyPrice ?? srv.recurringFee ?? srv.packagePrice ?? 0;
        const history = Array.isArray(srv.priceHistory) ? srv.priceHistory : [];
        history.forEach((h, index) => {
          revisions.push({
            id: `${srv.id}-rev-${index}`,
            serviceId: srv.id,
            serviceName: srv.name,
            category: srv.category,
            currentPrice,
            previousPrice: Number(h.previousPrice) || 0,
            newPrice: Number(h.newPrice) || 0,
            effectiveDate: h.changedAt,
            changedBy: h.changedBy || 'Admin',
            changedByEmail: h.changedByEmail || '',
            priceField: h.priceField || 'Service Rate',
            note: h.note || '',
          });
        });
      }

      revisions.sort((a, b) => Date.parse(b.effectiveDate || '') - Date.parse(a.effectiveDate || ''));

      res.json({
        revisions,
        totalRevisions: revisions.length,
        services: sortedServices.map((s) => ({
          id: s.id,
          name: s.name,
          category: s.category,
          revisionCount: s.priceHistory?.length || 0,
        })),
      });
    }
  );

  app.post(
    '/api/suite/services',
    requireAuth,
    requirePermission('services'),
    async (req: AuthenticatedRequest, res: Response) => {
      const tierSchema = z
        .object({
          setupFee: z.number().finite().min(0).optional(),
          packagePrice: z.number().finite().min(0).optional(),
          unitRate: z.number().finite().min(0).optional(),
          additionalUnitRate: z.number().finite().min(0).optional(),
        })
        .optional();
      const schema = z.object({
        name: z.string().trim().min(2).max(140),
        slug: z.string().trim().max(140).optional(),
        category: z.string().trim().min(2).max(80),
        description: z.string().trim().max(800).default(''),
        benefits: z.array(z.string().trim().max(220)).optional().default([]),
        deliverables: z.array(z.string().trim().max(200)).default([]),
        workProcess: z.array(z.string().trim().max(220)).optional().default([]),
        pricingModel: z.enum(['fixed', 'custom']).default('fixed'),
        setupFee: z.number().finite().min(0).default(0),
        recurringFee: z.number().finite().min(0).default(0),
        oneTimePrice: z.number().finite().min(0).optional(),
        monthlyPrice: z.number().finite().min(0).optional(),
        revisionLimit: z.union([z.string().trim().max(120), z.number()]).optional(),
        additionalDeliverableCharge: z.number().finite().min(0).optional(),
        subscriptionDuration: z.string().trim().max(120).optional(),
        renewalTerms: z.string().trim().max(160).optional(),
        cancellationPolicy: z.string().trim().max(160).optional(),
        transactionalSmsEnabled: z.boolean().optional(),
        billingCycle: z.enum(['one-time', 'monthly', 'quarterly', 'custom']).default('monthly'),
        gstEnabled: z.boolean().default(true),
        gstRate: z.number().finite().min(0).max(100).default(18),
        deliveryPeriod: z.string().trim().max(120).default('7 business days'),
        active: z.boolean().default(true),
        menuOrder: z.number().finite().int().min(1).max(2000).optional(),
        showInMenu: z.boolean().optional().default(true),
        packagePrice: z.number().finite().min(0).optional(),
        includedUnits: z.number().finite().min(0).optional(),
        unitLabel: z.string().trim().max(40).optional(),
        unitRate: z.number().finite().min(0).optional(),
        additionalUnitRate: z.number().finite().min(0).optional(),
        internationalPricing: z
          .object({
            aed: tierSchema,
            usd: tierSchema,
            notes: z.string().trim().max(300).optional(),
          })
          .optional(),
        disclaimer: z.string().trim().max(600).optional(),
        integrationConfigured: z.boolean().optional(),
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid service item.' });
        return;
      }

      try {
        const result = await withDbMutation(async (db) => {
          const validCats = new Set([
            ...SERVICE_CATEGORIES,
            ...(db.serviceCategories || []).map((c) => c.name),
          ]);
          const cleanCategory = stripControls(parsed.data.category);
          if (!validCats.has(cleanCategory)) {
            const err = new Error(`Category '${cleanCategory}' is not configured in Service Categories.`);
            (err as any).statusCode = 400;
            throw err;
          }

          const cleanName = stripControls(parsed.data.name);
          const cleanSlug = slugifyServiceName(parsed.data.slug || cleanName);
          const duplicate = db.services.find(
            (s) =>
              s.name.trim().toLowerCase() === cleanName.toLowerCase() ||
              (s.slug || slugifyServiceName(s.name)).toLowerCase() === cleanSlug
          );
          if (duplicate) {
            const err = new Error(
              `Duplicate service prevented: '${duplicate.name}' (/${duplicate.slug}) already exists in the standalone catalogue.`
            );
            (err as any).statusCode = 409;
            throw err;
          }

          const nowIso = new Date().toISOString();
          const basePrice =
            parsed.data.oneTimePrice ??
            parsed.data.setupFee ??
            parsed.data.recurringFee ??
            parsed.data.packagePrice ??
            0;
          const srv: ServiceCatalogItem = {
            id: `srv-${crypto.randomBytes(4).toString('hex')}`,
            ...parsed.data,
            name: cleanName,
            slug: cleanSlug,
            category: cleanCategory,
            benefits: parsed.data.benefits.map(stripControls).filter(Boolean),
            deliverables: parsed.data.deliverables.map(stripControls).filter(Boolean),
            workProcess: parsed.data.workProcess.map(stripControls).filter(Boolean),
            oneTimePrice: parsed.data.oneTimePrice ?? parsed.data.setupFee,
            monthlyPrice: parsed.data.monthlyPrice ?? parsed.data.recurringFee,
            addons: [],
            sortOrder: db.services.length + 1,
            menuOrder: parsed.data.menuOrder ?? db.services.length + 1,
            showInMenu: parsed.data.showInMenu ?? true,
            updatedAt: nowIso,
            priceHistory: [
              {
                previousPrice: 0,
                newPrice: basePrice,
                changedAt: nowIso,
                changedBy: req.suiteUser!.name,
                changedByEmail: req.suiteUser!.email,
                priceField: 'Initial Base Rate',
                note: 'Initial service creation',
              },
            ],
          };
          db.services.push(srv);
          appendAuditLog(db, {
            actorId: req.suiteUser!.id,
            actorName: req.suiteUser!.name,
            actorRole: req.suiteUser!.role,
            action: 'CREATE_SERVICE_ITEM',
            targetId: srv.id,
            summary: `Added standalone service '${srv.name}' (/${srv.slug}) under ${srv.category}.`,
          });

          const oneTimeVal = srv.oneTimePrice ?? srv.setupFee ?? 0;
          const monthlyVal = srv.monthlyPrice ?? srv.recurringFee ?? srv.packagePrice ?? 0;
          const alertEntry = await dispatchNotification(db, {
            event: 'service_added',
            subject: `[AKYIN Admin Alert] New Service Added: ${srv.name}`,
            body: [
              'AKYIN Service Catalogue Alert — New Service Added',
              '',
              `Service Name: ${srv.name} (${srv.id})`,
              `Slug: /services/${srv.slug}`,
              `Category: ${srv.category}`,
              `Pricing Model: ${srv.pricingModel} | Billing Cycle: ${srv.billingCycle}`,
              `One-Time / Setup Fee: INR ${oneTimeVal.toLocaleString('en-IN')}`,
              `Monthly / Package Price: INR ${monthlyVal.toLocaleString('en-IN')}`,
              srv.unitRate ? `Usage Rate: INR ${srv.unitRate.toFixed(2)}/${srv.unitLabel || 'unit'}` : 'Usage Rate: N/A',
              `GST: ${srv.gstEnabled ? `${srv.gstRate}%` : 'Exempt'}`,
              `Status: ${srv.active ? 'Active' : 'Disabled'}`,
              '',
              `Authorizing Admin: ${req.suiteUser!.name} (${req.suiteUser!.role})`,
              `Authorizing Admin Email: ${req.suiteUser!.email}`,
              `Timestamp: ${nowIso}`,
            ].join('\n'),
          });

          return { service: srv, notification: alertEntry };
        });
        res.status(201).json(result);
      } catch (err: any) {
        res.status(err?.statusCode || 400).json({ error: err?.message || 'Service creation failed.' });
      }
    }
  );

  app.post(
    '/api/suite/services/:serviceId/duplicate',
    requireAuth,
    requirePermission('services'),
    async (req: AuthenticatedRequest, res: Response) => {
      const serviceId = String(req.params.serviceId || '');
      try {
        const result = await withDbMutation(async (db) => {
          const original = db.services.find((s) => s.id === serviceId);
          if (!original) {
            const err = new Error('Service item not found.');
            (err as any).statusCode = 404;
            throw err;
          }
          const nowIso = new Date().toISOString();
          const copyId = `srv-${crypto.randomBytes(4).toString('hex')}`;
          const copySuffix = copyId.replace(/^srv-/, '').slice(0, 4);
          const currentPrice = original.oneTimePrice ?? original.setupFee ?? original.recurringFee ?? original.packagePrice ?? 0;
          const duplicated: ServiceCatalogItem = {
            ...JSON.parse(JSON.stringify(original)),
            id: copyId,
            name: `${original.name} (Draft ${copySuffix})`,
            slug: `${original.slug || slugifyServiceName(original.name)}-draft-${copySuffix}`,
            active: false,
            showInMenu: false,
            sortOrder: db.services.length + 1,
            menuOrder: db.services.length + 1,
            updatedAt: nowIso,
            priceHistory: [
              {
                previousPrice: 0,
                newPrice: currentPrice,
                changedAt: nowIso,
                changedBy: req.suiteUser!.name,
                changedByEmail: req.suiteUser!.email,
                priceField: 'Duplicated Base Rate',
                note: `Duplicated from '${original.name}' (${original.id})`,
              },
            ],
          };
          db.services.push(duplicated);
          appendAuditLog(db, {
            actorId: req.suiteUser!.id,
            actorName: req.suiteUser!.name,
            actorRole: req.suiteUser!.role,
            action: 'DUPLICATE_SERVICE_ITEM',
            targetId: copyId,
            summary: `Duplicated service '${original.name}' as '${duplicated.name}'.`,
          });

          const alertEntry = await dispatchNotification(db, {
            event: 'service_added',
            subject: `[AKYIN Admin Alert] New Service Duplicated: ${duplicated.name}`,
            body: [
              'AKYIN Service Catalogue Alert — Service Duplicated & Added',
              '',
              `New Service Name: ${duplicated.name} (${duplicated.id})`,
              `Duplicated From: ${original.name} (${original.id})`,
              `Category: ${duplicated.category}`,
              `One-Time / Setup Fee: INR ${(duplicated.oneTimePrice ?? duplicated.setupFee ?? 0).toLocaleString('en-IN')}`,
              `Monthly / Package Price: INR ${(duplicated.monthlyPrice ?? duplicated.recurringFee ?? duplicated.packagePrice ?? 0).toLocaleString('en-IN')}`,
              '',
              `Authorizing Admin: ${req.suiteUser!.name} (${req.suiteUser!.role})`,
              `Authorizing Admin Email: ${req.suiteUser!.email}`,
              `Timestamp: ${nowIso}`,
            ].join('\n'),
          });

          return { service: duplicated, notification: alertEntry };
        });
        res.status(201).json(result);
      } catch (err: any) {
        res.status(err?.statusCode || 400).json({ error: err?.message || 'Duplication failed.' });
      }
    }
  );

  app.patch(
    '/api/suite/services/:serviceId',
    requireAuth,
    requirePermission('services'),
    async (req: AuthenticatedRequest, res: Response) => {
      const serviceId = String(req.params.serviceId || '');
      try {
        const result = await withDbMutation(async (db) => {
          const srv = db.services.find((s) => s.id === serviceId);
          if (!srv) {
            const err = new Error('Service item not found.');
            (err as any).statusCode = 404;
            throw err;
          }
          const b = req.body || {};
          const oldPrimaryPrice = srv.oneTimePrice ?? srv.setupFee ?? srv.recurringFee ?? srv.packagePrice ?? 0;
          const beforePrices = {
            oneTime: srv.oneTimePrice ?? srv.setupFee ?? 0,
            monthly: srv.monthlyPrice ?? srv.recurringFee ?? srv.packagePrice ?? 0,
            packagePrice: srv.packagePrice ?? 0,
            includedUnits: srv.includedUnits ?? 0,
            unitRate: srv.unitRate ?? 0,
            additionalUnitRate: srv.additionalUnitRate ?? 0,
            additionalDeliverableCharge: srv.additionalDeliverableCharge ?? 0,
            gstEnabled: Boolean(srv.gstEnabled),
            gstRate: srv.gstRate ?? 18,
            aed: JSON.stringify(srv.internationalPricing?.aed || {}),
            usd: JSON.stringify(srv.internationalPricing?.usd || {}),
          };

          if (typeof b.name === 'string' && b.name.trim()) {
            const cleanName = stripControls(b.name);
            const dupName = db.services.find(
              (s) => s.id !== serviceId && s.name.trim().toLowerCase() === cleanName.toLowerCase()
            );
            if (dupName) {
              const err = new Error(`Service name '${cleanName}' is already assigned to another service.`);
              (err as any).statusCode = 409;
              throw err;
            }
            srv.name = cleanName;
          }
          if (typeof b.slug === 'string' && b.slug.trim()) {
            const cleanSlug = slugifyServiceName(b.slug);
            const dupSlug = db.services.find(
              (s) => s.id !== serviceId && (s.slug || '').toLowerCase() === cleanSlug
            );
            if (dupSlug) {
              const err = new Error(`Service URL slug '${cleanSlug}' is already in use.`);
              (err as any).statusCode = 409;
              throw err;
            }
            srv.slug = cleanSlug;
          }
          if (typeof b.category === 'string' && b.category.trim()) {
            const validCats = new Set([
              ...SERVICE_CATEGORIES,
              ...(db.serviceCategories || []).map((c) => c.name),
            ]);
            const cleanCat = stripControls(b.category);
            if (validCats.has(cleanCat)) {
              srv.category = cleanCat;
            }
          }
          if (typeof b.description === 'string') srv.description = stripControls(b.description);
          if (Array.isArray(b.benefits)) {
            srv.benefits = b.benefits.map((d: unknown) => stripControls(String(d))).filter(Boolean);
          }
          if (Array.isArray(b.deliverables)) {
            srv.deliverables = b.deliverables.map((d: unknown) => stripControls(String(d))).filter(Boolean);
          }
          if (Array.isArray(b.workProcess)) {
            srv.workProcess = b.workProcess.map((d: unknown) => stripControls(String(d))).filter(Boolean);
          }
          if (typeof b.menuOrder === 'number' && Number.isFinite(b.menuOrder)) {
            srv.menuOrder = Math.max(1, Math.floor(b.menuOrder));
          }
          if (typeof b.showInMenu === 'boolean') {
            srv.showInMenu = b.showInMenu;
          }
          if (b.pricingModel === 'fixed' || b.pricingModel === 'custom') {
            srv.pricingModel = b.pricingModel;
          }
          if (typeof b.setupFee === 'number' && Number.isFinite(b.setupFee)) {
            srv.setupFee = round2(Math.max(0, b.setupFee));
          }
          if (typeof b.recurringFee === 'number' && Number.isFinite(b.recurringFee)) {
            srv.recurringFee = round2(Math.max(0, b.recurringFee));
          }
          if (typeof b.oneTimePrice === 'number' && Number.isFinite(b.oneTimePrice)) {
            srv.oneTimePrice = round2(Math.max(0, b.oneTimePrice));
            if (b.setupFee === undefined && srv.setupFee !== undefined) {
              srv.setupFee = srv.oneTimePrice;
            }
          }
          if (typeof b.monthlyPrice === 'number' && Number.isFinite(b.monthlyPrice)) {
            srv.monthlyPrice = round2(Math.max(0, b.monthlyPrice));
            if (b.recurringFee === undefined && srv.recurringFee !== undefined) {
              srv.recurringFee = srv.monthlyPrice;
            }
          }
          if (b.revisionLimit !== undefined) {
            srv.revisionLimit = typeof b.revisionLimit === 'number' ? b.revisionLimit : stripControls(String(b.revisionLimit));
          }
          if (typeof b.additionalDeliverableCharge === 'number' && Number.isFinite(b.additionalDeliverableCharge)) {
            srv.additionalDeliverableCharge = round2(Math.max(0, b.additionalDeliverableCharge));
          }
          if (typeof b.subscriptionDuration === 'string') {
            srv.subscriptionDuration = stripControls(b.subscriptionDuration);
          }
          if (typeof b.renewalTerms === 'string') {
            srv.renewalTerms = stripControls(b.renewalTerms);
          }
          if (typeof b.cancellationPolicy === 'string') {
            srv.cancellationPolicy = stripControls(b.cancellationPolicy);
          }
          if (typeof b.transactionalSmsEnabled === 'boolean') {
            srv.transactionalSmsEnabled = b.transactionalSmsEnabled;
          }
          if (
            b.billingCycle === 'one-time' ||
            b.billingCycle === 'monthly' ||
            b.billingCycle === 'quarterly' ||
            b.billingCycle === 'custom'
          ) {
            srv.billingCycle = b.billingCycle;
          }
          if (typeof b.packagePrice === 'number' && Number.isFinite(b.packagePrice)) {
            srv.packagePrice = round2(Math.max(0, b.packagePrice));
            if (b.recurringFee === undefined) {
              srv.recurringFee = srv.packagePrice;
            }
          }
          if (typeof b.includedUnits === 'number' && Number.isFinite(b.includedUnits)) {
            srv.includedUnits = Math.max(0, Math.floor(b.includedUnits));
          }
          if (typeof b.unitLabel === 'string') {
            srv.unitLabel = stripControls(b.unitLabel);
          }
          if (typeof b.unitRate === 'number' && Number.isFinite(b.unitRate)) {
            srv.unitRate = round2(Math.max(0, b.unitRate));
          }
          if (typeof b.additionalUnitRate === 'number' && Number.isFinite(b.additionalUnitRate)) {
            srv.additionalUnitRate = round2(Math.max(0, b.additionalUnitRate));
          }
          if (b.internationalPricing && typeof b.internationalPricing === 'object') {
            const nextIntl: NonNullable<ServiceCatalogItem['internationalPricing']> = {
              ...(srv.internationalPricing || {}),
            };
            for (const curKey of ['aed', 'usd'] as const) {
              const tier = b.internationalPricing[curKey];
              if (tier && typeof tier === 'object') {
                nextIntl[curKey] = {
                  ...(nextIntl[curKey] || {}),
                  ...(typeof tier.setupFee === 'number' && Number.isFinite(tier.setupFee)
                    ? { setupFee: round2(Math.max(0, tier.setupFee)) }
                    : {}),
                  ...(typeof tier.packagePrice === 'number' && Number.isFinite(tier.packagePrice)
                    ? { packagePrice: round2(Math.max(0, tier.packagePrice)) }
                    : {}),
                  ...(typeof tier.unitRate === 'number' && Number.isFinite(tier.unitRate)
                    ? { unitRate: round2(Math.max(0, tier.unitRate)) }
                    : {}),
                  ...(typeof tier.additionalUnitRate === 'number' &&
                  Number.isFinite(tier.additionalUnitRate)
                    ? { additionalUnitRate: round2(Math.max(0, tier.additionalUnitRate)) }
                    : {}),
                };
              }
            }
            if (typeof b.internationalPricing.notes === 'string') {
              nextIntl.notes = stripControls(b.internationalPricing.notes);
            }
            srv.internationalPricing = nextIntl;
          }
          if (typeof b.disclaimer === 'string') {
            srv.disclaimer = stripControls(b.disclaimer);
          }
          if (typeof b.integrationConfigured === 'boolean') {
            srv.integrationConfigured = b.integrationConfigured;
          }
          if (typeof b.gstEnabled === 'boolean') srv.gstEnabled = b.gstEnabled;
          if (typeof b.gstRate === 'number' && Number.isFinite(b.gstRate)) {
            srv.gstRate = Math.min(100, Math.max(0, b.gstRate));
          }
          if (typeof b.deliveryPeriod === 'string') srv.deliveryPeriod = stripControls(b.deliveryPeriod);
          if (typeof b.active === 'boolean') srv.active = b.active;

          const afterPrices = {
            oneTime: srv.oneTimePrice ?? srv.setupFee ?? 0,
            monthly: srv.monthlyPrice ?? srv.recurringFee ?? srv.packagePrice ?? 0,
            packagePrice: srv.packagePrice ?? 0,
            includedUnits: srv.includedUnits ?? 0,
            unitRate: srv.unitRate ?? 0,
            additionalUnitRate: srv.additionalUnitRate ?? 0,
            additionalDeliverableCharge: srv.additionalDeliverableCharge ?? 0,
            gstEnabled: Boolean(srv.gstEnabled),
            gstRate: srv.gstRate ?? 18,
            aed: JSON.stringify(srv.internationalPricing?.aed || {}),
            usd: JSON.stringify(srv.internationalPricing?.usd || {}),
          };

          const priceChanges: string[] = [];
          if (beforePrices.oneTime !== afterPrices.oneTime) {
            priceChanges.push(
              `One-Time / Setup Price: INR ${beforePrices.oneTime.toLocaleString('en-IN')} -> INR ${afterPrices.oneTime.toLocaleString('en-IN')}`
            );
          }
          if (beforePrices.monthly !== afterPrices.monthly) {
            priceChanges.push(
              `Monthly / Package Price: INR ${beforePrices.monthly.toLocaleString('en-IN')} -> INR ${afterPrices.monthly.toLocaleString('en-IN')}`
            );
          }
          if (beforePrices.packagePrice !== afterPrices.packagePrice && beforePrices.monthly === afterPrices.monthly) {
            priceChanges.push(
              `Package Price: INR ${beforePrices.packagePrice.toLocaleString('en-IN')} -> INR ${afterPrices.packagePrice.toLocaleString('en-IN')}`
            );
          }
          if (beforePrices.includedUnits !== afterPrices.includedUnits) {
            priceChanges.push(
              `Included Units (${srv.unitLabel || 'units'}): ${beforePrices.includedUnits.toLocaleString('en-IN')} -> ${afterPrices.includedUnits.toLocaleString('en-IN')}`
            );
          }
          if (beforePrices.unitRate !== afterPrices.unitRate) {
            priceChanges.push(
              `Per-Unit Usage Rate: INR ${beforePrices.unitRate.toFixed(2)} -> INR ${afterPrices.unitRate.toFixed(2)}`
            );
          }
          if (beforePrices.additionalUnitRate !== afterPrices.additionalUnitRate) {
            priceChanges.push(
              `Additional Unit Rate: INR ${beforePrices.additionalUnitRate.toFixed(2)} -> INR ${afterPrices.additionalUnitRate.toFixed(2)}`
            );
          }
          if (beforePrices.additionalDeliverableCharge !== afterPrices.additionalDeliverableCharge) {
            priceChanges.push(
              `Additional Deliverable Charge: INR ${beforePrices.additionalDeliverableCharge.toLocaleString('en-IN')} -> INR ${afterPrices.additionalDeliverableCharge.toLocaleString('en-IN')}`
            );
          }
          if (beforePrices.gstEnabled !== afterPrices.gstEnabled || beforePrices.gstRate !== afterPrices.gstRate) {
            priceChanges.push(
              `GST Configuration: ${beforePrices.gstEnabled ? `${beforePrices.gstRate}%` : 'Exempt'} -> ${afterPrices.gstEnabled ? `${afterPrices.gstRate}%` : 'Exempt'}`
            );
          }
          if (beforePrices.aed !== afterPrices.aed) {
            priceChanges.push('AED International Tier Pricing updated');
          }
          if (beforePrices.usd !== afterPrices.usd) {
            priceChanges.push('USD International Tier Pricing updated');
          }

          const nowIso = new Date().toISOString();
          const newPrimaryPrice = srv.oneTimePrice ?? srv.setupFee ?? srv.recurringFee ?? srv.packagePrice ?? 0;
          const auditNote =
            typeof b.priceChangeNote === 'string' && b.priceChangeNote.trim()
              ? stripControls(b.priceChangeNote)
              : priceChanges.length > 0
                ? priceChanges.join('; ')
                : 'Service price updated via admin catalogue';

          if (oldPrimaryPrice !== newPrimaryPrice || priceChanges.length > 0) {
            if (!srv.priceHistory) srv.priceHistory = [];
            const prevHistPrice =
              oldPrimaryPrice !== newPrimaryPrice
                ? oldPrimaryPrice
                : beforePrices.monthly !== afterPrices.monthly
                  ? beforePrices.monthly
                  : beforePrices.unitRate !== afterPrices.unitRate
                    ? beforePrices.unitRate
                    : oldPrimaryPrice;
            const nextHistPrice =
              oldPrimaryPrice !== newPrimaryPrice
                ? newPrimaryPrice
                : beforePrices.monthly !== afterPrices.monthly
                  ? afterPrices.monthly
                  : beforePrices.unitRate !== afterPrices.unitRate
                    ? afterPrices.unitRate
                    : newPrimaryPrice;
            srv.priceHistory.push({
              previousPrice: prevHistPrice,
              newPrice: nextHistPrice,
              changedAt: nowIso,
              changedBy: req.suiteUser!.name,
              changedByEmail: req.suiteUser!.email,
              priceField:
                oldPrimaryPrice !== newPrimaryPrice
                  ? 'One-Time / Setup Price'
                  : beforePrices.monthly !== afterPrices.monthly
                    ? 'Monthly Subscription Price'
                    : beforePrices.unitRate !== afterPrices.unitRate
                      ? 'Per-Unit Rate'
                      : 'Service Pricing',
              note: auditNote,
            });
          }

          srv.updatedAt = nowIso;
          appendAuditLog(db, {
            actorId: req.suiteUser!.id,
            actorName: req.suiteUser!.name,
            actorRole: req.suiteUser!.role,
            action: 'UPDATE_SERVICE_ITEM',
            targetId: srv.id,
            summary:
              priceChanges.length > 0
                ? `Updated '${srv.name}' pricing: ${priceChanges.join('; ')}.`
                : `Updated '${srv.name}' (active=${srv.active}).`,
          });

          let alertEntry: NotificationLogEntry | undefined;
          if (priceChanges.length > 0) {
            alertEntry = await dispatchNotification(db, {
              event: 'service_price_updated',
              subject: `[AKYIN Admin Alert] Service Price Updated: ${srv.name}`,
              body: [
                'AKYIN Service Catalogue Alert — Manual Price Update',
                '',
                `Service Name: ${srv.name} (${srv.id})`,
                `Category: ${srv.category}`,
                '',
                'Summary of Changes:',
                ...priceChanges.map((line) => `- ${line}`),
                '',
                `Audit Note: ${auditNote}`,
                `Authorizing Admin: ${req.suiteUser!.name} (${req.suiteUser!.role})`,
                `Authorizing Admin Email: ${req.suiteUser!.email}`,
                `Timestamp: ${nowIso}`,
              ].join('\n'),
            });
          }

          return { service: srv, notification: alertEntry };
        });
        res.json(result);
      } catch (err: any) {
        res.status(err?.statusCode || 400).json({ error: err?.message || 'Service update failed.' });
      }
    }
  );

  app.post(
    '/api/suite/services/bulk-update',
    requireAuth,
    requirePermission('services'),
    async (req: AuthenticatedRequest, res: Response) => {
      const schema = z.object({
        serviceIds: z.array(z.string().trim().min(1).max(80)).min(1).max(200),
        action: z.enum(['activate', 'archive', 'adjust_gst']),
        gstEnabled: z.boolean().optional(),
        gstRate: z.number().finite().min(0).max(100).optional(),
        note: z.string().trim().max(300).optional(),
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid bulk service update payload.' });
        return;
      }

      if (parsed.data.action === 'adjust_gst' && parsed.data.gstRate === undefined && parsed.data.gstEnabled === undefined) {
        res.status(400).json({ error: 'Specify gstEnabled or gstRate when adjusting GST rates.' });
        return;
      }

      try {
        const result = await withDbMutation(async (db) => {
          const targetSet = new Set(parsed.data.serviceIds);
          const nowIso = new Date().toISOString();
          const updatedServices: ServiceCatalogItem[] = [];
          const gstChangeSummaries: string[] = [];

          for (const srv of db.services) {
            if (!targetSet.has(srv.id)) continue;

            if (parsed.data.action === 'activate') {
              srv.active = true;
              srv.updatedAt = nowIso;
              updatedServices.push(srv);
            } else if (parsed.data.action === 'archive') {
              srv.active = false;
              srv.updatedAt = nowIso;
              updatedServices.push(srv);
            } else if (parsed.data.action === 'adjust_gst') {
              const prevGstEnabled = srv.gstEnabled;
              const prevGstRate = srv.gstRate;
              const nextGstRate =
                parsed.data.gstRate !== undefined ? round2(parsed.data.gstRate) : srv.gstRate;
              const nextGstEnabled =
                parsed.data.gstEnabled !== undefined
                  ? parsed.data.gstEnabled
                  : nextGstRate > 0;

              srv.gstEnabled = nextGstEnabled;
              srv.gstRate = nextGstEnabled ? nextGstRate : 0;
              srv.updatedAt = nowIso;

              if (prevGstEnabled !== srv.gstEnabled || prevGstRate !== srv.gstRate) {
                if (!srv.priceHistory) srv.priceHistory = [];
                const beforeLabel = prevGstEnabled ? `${prevGstRate}%` : 'Exempt';
                const afterLabel = srv.gstEnabled ? `${srv.gstRate}%` : 'Exempt';
                const noteText = parsed.data.note
                  ? stripControls(parsed.data.note)
                  : `Bulk GST adjustment: ${beforeLabel} -> ${afterLabel}`;
                srv.priceHistory.push({
                  previousPrice: prevGstEnabled ? prevGstRate : 0,
                  newPrice: srv.gstEnabled ? srv.gstRate : 0,
                  changedAt: nowIso,
                  changedBy: req.suiteUser!.name,
                  changedByEmail: req.suiteUser!.email,
                  priceField: 'GST Rate (%)',
                  note: noteText,
                });
                gstChangeSummaries.push(`${srv.name} (${beforeLabel} -> ${afterLabel})`);
              }
              updatedServices.push(srv);
            }
          }

          if (updatedServices.length === 0) {
            const err = new Error('No matching services found for bulk update.');
            (err as any).statusCode = 404;
            throw err;
          }

          const actionSummary =
            parsed.data.action === 'activate'
              ? `Bulk activated ${updatedServices.length} service(s).`
              : parsed.data.action === 'archive'
                ? `Bulk archived ${updatedServices.length} service(s).`
                : `Bulk adjusted GST on ${updatedServices.length} service(s): ${gstChangeSummaries.join(', ') || 'rate confirmed'}.`;

          appendAuditLog(db, {
            actorId: req.suiteUser!.id,
            actorName: req.suiteUser!.name,
            actorRole: req.suiteUser!.role,
            action: 'BULK_UPDATE_SERVICES',
            targetId: `${updatedServices.length}_SERVICES`,
            summary: actionSummary,
          });

          let alertEntry: NotificationLogEntry | undefined;
          if (parsed.data.action === 'adjust_gst' && gstChangeSummaries.length > 0) {
            alertEntry = await dispatchNotification(db, {
              event: 'service_price_updated',
              subject: `[AKYIN Admin Alert] Bulk GST Update Applied to ${gstChangeSummaries.length} Service(s)`,
              body: [
                'AKYIN Service Catalogue Alert — Bulk GST Adjustment',
                '',
                `Updated Services (${gstChangeSummaries.length}):`,
                ...gstChangeSummaries.map((line) => `- ${line}`),
                '',
                `Authorizing Admin: ${req.suiteUser!.name} (${req.suiteUser!.role})`,
                `Authorizing Admin Email: ${req.suiteUser!.email}`,
                `Timestamp: ${nowIso}`,
              ].join('\n'),
            });
          }

          return {
            updatedCount: updatedServices.length,
            services: updatedServices,
            notification: alertEntry,
          };
        });

        res.json(result);
      } catch (err: any) {
        res.status(err?.statusCode || 400).json({ error: err?.message || 'Bulk service update failed.' });
      }
    }
  );

  app.delete(
    '/api/suite/services/:serviceId',
    requireAuth,
    requirePermission('services'),
    async (req: AuthenticatedRequest, res: Response) => {
      const serviceId = String(req.params.serviceId || '');
      await withDbMutation((db) => {
        db.services = db.services.filter((s) => s.id !== serviceId);
        appendAuditLog(db, {
          actorId: req.suiteUser!.id,
          actorName: req.suiteUser!.name,
          actorRole: req.suiteUser!.role,
          action: 'DELETE_SERVICE_ITEM',
          targetId: serviceId,
          summary: `Removed service ${serviceId}.`,
        });
      });
      res.json({ ok: true });
    }
  );

  // --- Quotations ---
  app.get(
    '/api/suite/quotations',
    requireAuth,
    requirePermission('quotations'),
    (_req: Request, res: Response) => {
      const db = readDb();
      res.json({ quotations: db.quotations });
    }
  );

  app.post(
    '/api/suite/quotations',
    requireAuth,
    requirePermission('quotations'),
    async (req: AuthenticatedRequest, res: Response) => {
      const schema = z.object({
        leadId: z.string().trim().max(80).optional().default(''),
        clientId: z.string().trim().max(80).optional().default(''),
        customerName: z.string().trim().min(2).max(120),
        companyName: z.string().trim().max(120).optional().default(''),
        customerEmail: z.string().trim().email().max(160),
        customerPhone: z.string().trim().max(30).optional().default(''),
        cityCountry: z.string().trim().max(120).optional().default(''),
        currency: z.enum(['INR', 'AED', 'USD']).default('INR'),
        items: z.array(quotationLineItemSchema).min(1),
        discountAmount: z.number().finite().min(0).default(0),
        gstEnabled: z.boolean().default(true),
        gstRate: z.number().finite().min(0).max(100).default(18),
        paymentTerms: z.string().trim().max(500).default('50% advance on acceptance, 50% on delivery.'),
        expiryDate: z.string().trim().max(20).optional().default(''),
        scopeOfWork: z.string().trim().max(3000).default(''),
        exclusions: z.string().trim().max(2000).default('Ad spend paid directly to Meta/Google by client.'),
        notes: z.string().trim().max(2000).default(''),
        status: z.enum(['DRAFT', 'SENT']).default('SENT'),
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid quotation.' });
        return;
      }

      const totals = calculateQuotationTotals(
        parsed.data.items,
        parsed.data.discountAmount,
        parsed.data.gstEnabled,
        parsed.data.gstRate
      );

      const quote = await withDbMutation(async (db) => {
        const nowIso = new Date().toISOString();
        const id = `QT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        const seq = String(db.quotations.length + 1).padStart(4, '0');
        const quoteNumber = `AKY-QT-${new Date().getUTCFullYear()}-${seq}`;
        const shareToken = crypto.randomBytes(16).toString('hex');
        const created: QuotationRecord = {
          id,
          quoteNumber,
          version: 1,
          shareToken,
          leadId: parsed.data.leadId,
          clientId: parsed.data.clientId,
          customerName: stripControls(parsed.data.customerName),
          companyName: stripControls(parsed.data.companyName),
          customerEmail: stripControls(parsed.data.customerEmail),
          customerPhone: stripControls(parsed.data.customerPhone),
          cityCountry: stripControls(parsed.data.cityCountry),
          currency: parsed.data.currency,
          items: totals.items,
          subtotal: totals.subtotal,
          discountAmount: totals.discountAmount,
          taxableAmount: totals.taxableAmount,
          gstEnabled: parsed.data.gstEnabled,
          gstRate: parsed.data.gstEnabled ? parsed.data.gstRate : 0,
          gstAmount: totals.gstAmount,
          grandTotal: totals.grandTotal,
          paymentTerms: stripControls(parsed.data.paymentTerms),
          expiryDate:
            parsed.data.expiryDate ||
            new Date(Date.now() + 14 * 86_400_000).toISOString().slice(0, 10),
          scopeOfWork: stripControls(parsed.data.scopeOfWork),
          exclusions: stripControls(parsed.data.exclusions),
          notes: stripControls(parsed.data.notes),
          status: parsed.data.status,
          customerResponseNote: '',
          respondedAt: '',
          convertedInvoiceId: '',
          revisions: [
            {
              version: 1,
              savedAt: nowIso,
              savedBy: req.suiteUser!.name,
              grandTotal: totals.grandTotal,
              note: 'Initial quotation created',
            },
          ],
          createdBy: req.suiteUser!.name,
          createdAt: nowIso,
          updatedAt: nowIso,
        };
        db.quotations.unshift(created);

        if (created.leadId) {
          const lead = db.leads.find((l) => l.leadId === created.leadId);
          if (lead && (lead.stage === 'NEW' || lead.stage === 'CONTACTED' || lead.stage === 'QUALIFIED')) {
            lead.stage = 'PROPOSAL SENT';
            lead.expectedDealValue = created.grandTotal;
            lead.updatedAt = nowIso;
          }
        }

        appendAuditLog(db, {
          actorId: req.suiteUser!.id,
          actorName: req.suiteUser!.name,
          actorRole: req.suiteUser!.role,
          action: 'CREATE_QUOTATION',
          targetId: quoteNumber,
          summary: `Created ${quoteNumber} (${created.currency} ${created.grandTotal}).`,
        });

        await dispatchNotification(db, {
          event: 'quotation_created',
          recipient: created.customerEmail,
          subject: `AKYIN Ventures Quotation ${quoteNumber} for ${created.companyName || created.customerName}`,
          body: `Quotation ${quoteNumber} (${created.currency} ${created.grandTotal}) is ready for review.\nPublic Portal Link: https://akyin.com/quote?token=${shareToken}`,
        });

        return created;
      });
      res.status(201).json({ quotation: quote });
    }
  );

  app.patch(
    '/api/suite/quotations/:id',
    requireAuth,
    requirePermission('quotations'),
    async (req: AuthenticatedRequest, res: Response) => {
      const id = String(req.params.id || '');
      try {
        const updated = await withDbMutation((db) => {
          const qt = db.quotations.find((q) => q.id === id);
          if (!qt) {
            const err = new Error('Quotation not found.');
            (err as any).statusCode = 404;
            throw err;
          }
          const b = req.body || {};
          const nowIso = new Date().toISOString();
          if (Array.isArray(b.items) && b.items.length > 0) {
            const totals = calculateQuotationTotals(
              b.items,
              typeof b.discountAmount === 'number' ? b.discountAmount : qt.discountAmount,
              typeof b.gstEnabled === 'boolean' ? b.gstEnabled : qt.gstEnabled,
              typeof b.gstRate === 'number' ? b.gstRate : qt.gstRate
            );
            qt.items = totals.items;
            qt.subtotal = totals.subtotal;
            qt.discountAmount = totals.discountAmount;
            qt.taxableAmount = totals.taxableAmount;
            qt.gstAmount = totals.gstAmount;
            qt.grandTotal = totals.grandTotal;
            qt.version += 1;
            qt.revisions.unshift({
              version: qt.version,
              savedAt: nowIso,
              savedBy: req.suiteUser!.name,
              grandTotal: qt.grandTotal,
              note: stripControls(String(b.revisionNote || `Updated v${qt.version}`)),
            });
          }
          if (typeof b.status === 'string') qt.status = b.status;
          if (typeof b.notes === 'string') qt.notes = stripControls(b.notes);
          if (typeof b.paymentTerms === 'string') qt.paymentTerms = stripControls(b.paymentTerms);
          if (typeof b.expiryDate === 'string') qt.expiryDate = b.expiryDate;
          qt.updatedAt = nowIso;
          appendAuditLog(db, {
            actorId: req.suiteUser!.id,
            actorName: req.suiteUser!.name,
            actorRole: req.suiteUser!.role,
            action: 'UPDATE_QUOTATION',
            targetId: qt.quoteNumber,
            summary: `Updated ${qt.quoteNumber} v${qt.version} (status=${qt.status}).`,
          });
          return qt;
        });
        res.json({ quotation: updated });
      } catch (err: any) {
        res.status(err?.statusCode || 400).json({ error: err?.message || 'Quotation update failed.' });
      }
    }
  );

  app.post(
    '/api/suite/quotations/:id/convert-invoice',
    requireAuth,
    requirePermission('quotations'),
    async (req: AuthenticatedRequest, res: Response) => {
      const id = String(req.params.id || '');
      const paymentTypeSchema = z.object({
        paymentType: z.enum(['advance', 'full', 'balance']).default('full'),
        dueDate: z.string().trim().max(20).optional().default(''),
        serviceCategory: z.string().trim().max(100).optional(),
      });
      const parsed = paymentTypeSchema.safeParse(req.body || {});
      const opts = parsed.success
        ? parsed.data
        : { paymentType: 'full' as const, dueDate: '', serviceCategory: undefined };

      try {
        const result = await withDbMutation((db) => {
          const qt = db.quotations.find((q) => q.id === id);
          if (!qt) {
            const err = new Error('Quotation not found.');
            (err as any).statusCode = 404;
            throw err;
          }
          if (qt.convertedInvoiceId) {
            const existing = db.invoices.find((i) => i.id === qt.convertedInvoiceId);
            if (existing) return { invoice: existing, quotation: qt };
          }
          const nowIso = new Date().toISOString();
          const invId = `INV-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
          const seq = String(db.invoices.length + 1).padStart(4, '0');
          const invoiceNumber = `AKY-INV-${new Date().getUTCFullYear()}-${seq}`;
          const linkedLead = qt.leadId ? db.leads.find((l) => l.leadId === qt.leadId) : undefined;

          let resolvedCategory = opts.serviceCategory?.trim() || '';
          if (!resolvedCategory) {
            const firstMatchedService = qt.items
              .map((item) => db.services.find((s) => s.id === item.serviceId))
              .find(Boolean);
            if (firstMatchedService) {
              resolvedCategory = firstMatchedService.category;
            } else {
              const joinedTitles = qt.items.map((i) => i.title.toLowerCase()).join(' ');
              if (joinedTitles.includes('whatsapp')) {
                resolvedCategory = 'WhatsApp Business Messaging';
              } else if (joinedTitles.includes('bulk sms') || joinedTitles.includes('sms credit')) {
                resolvedCategory = 'Bulk SMS Marketing';
              } else {
                resolvedCategory = 'Digital marketing';
              }
            }
          }

          const inv: InvoiceRecord = {
            id: invId,
            invoiceNumber,
            quotationId: qt.id,
            quotationNumber: qt.quoteNumber,
            leadId: qt.leadId,
            clientId: qt.clientId,
            serviceCategory: resolvedCategory,
            leadSource: linkedLead?.campaignSource || 'Website',
            customerName: qt.customerName,
            companyName: qt.companyName,
            customerEmail: qt.customerEmail,
            customerPhone: qt.customerPhone,
            currency: qt.currency,
            paymentType: opts.paymentType,
            subtotal: qt.subtotal,
            discountAmount: qt.discountAmount,
            taxableAmount: qt.taxableAmount,
            gstEnabled: qt.gstEnabled,
            gstRate: qt.gstRate,
            gstAmount: qt.gstAmount,
            totalAmount: qt.grandTotal,
            paidAmount: 0,
            refundedAmount: 0,
            status: 'UNPAID',
            dueDate:
              opts.dueDate || new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10),
            notes: `Generated from ${qt.quoteNumber}`,
            createdAt: nowIso,
            updatedAt: nowIso,
          };
          db.invoices.unshift(inv);
          qt.convertedInvoiceId = invId;
          qt.updatedAt = nowIso;
          appendAuditLog(db, {
            actorId: req.suiteUser!.id,
            actorName: req.suiteUser!.name,
            actorRole: req.suiteUser!.role,
            action: 'CONVERT_QUOTE_TO_INVOICE',
            targetId: invoiceNumber,
            summary: `Generated ${invoiceNumber} (${inv.currency} ${inv.totalAmount}) from ${qt.quoteNumber}.`,
          });
          return { invoice: inv, quotation: qt };
        });
        res.status(201).json(result);
      } catch (err: any) {
        res.status(err?.statusCode || 400).json({ error: err?.message || 'Conversion failed.' });
      }
    }
  );

  // --- Appointments & Availability ---
  app.get(
    '/api/suite/appointments',
    requireAuth,
    requirePermission('appointments'),
    (_req: Request, res: Response) => {
      const db = readDb();
      res.json({
        appointments: db.appointments,
        availability: db.availability,
        blockedDates: db.blockedDates,
      });
    }
  );

  app.post(
    '/api/suite/appointments',
    requireAuth,
    requirePermission('appointments'),
    async (req: AuthenticatedRequest, res: Response) => {
      const b = req.body || {};
      const resData = await withDbMutation((db) => {
        const nowIso = new Date().toISOString();
        const existingIdx = b.bookingId
          ? db.appointments.findIndex((a) => a.bookingId === b.bookingId)
          : -1;
        if (existingIdx === -1) {
          const bookingId = `AKY-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
          const rec: SuiteAppointmentRecord = {
            bookingId,
            createdAt: nowIso,
            updatedAt: nowIso,
            customerName: stripControls(String(b.customerName || 'Client')),
            phone: stripControls(String(b.phone || '')),
            email: stripControls(String(b.email || '')),
            city: stripControls(String(b.city || '')),
            country: stripControls(String(b.country || 'India')),
            businessName: stripControls(String(b.businessName || '')),
            website: stripControls(String(b.website || '')),
            businessStage: stripControls(String(b.businessStage || 'Early Stage (0–2 Years)')),
            consultationTopic: stripControls(
              String(b.consultationTopic || 'Business Clarity & Strategic Direction')
            ),
            businessChallenge: stripControls(String(b.businessChallenge || '')),
            appointmentDate: String(b.appointmentDate || getIstDateParts().isoDate),
            startTime: String(b.startTime || '18:00'),
            endTime: String(b.endTime || '18:30'),
            paymentStatus: b.paymentStatus || 'Payment Awaited',
            bookingStatus: b.bookingStatus || 'Pending',
            adminNotes: stripControls(String(b.adminNotes || '')),
            calendarEventId: stripControls(String(b.calendarEventId || '')),
          };
          db.appointments.unshift(rec);
          appendAuditLog(db, {
            actorId: req.suiteUser!.id,
            actorName: req.suiteUser!.name,
            actorRole: req.suiteUser!.role,
            action: 'CREATE_APPOINTMENT',
            targetId: bookingId,
            summary: `Created appointment ${bookingId}.`,
          });
          return { appointment: rec };
        }
        const cur = db.appointments[existingIdx];
        db.appointments[existingIdx] = {
          ...cur,
          ...b,
          updatedAt: nowIso,
        };
        appendAuditLog(db, {
          actorId: req.suiteUser!.id,
          actorName: req.suiteUser!.name,
          actorRole: req.suiteUser!.role,
          action: 'UPDATE_APPOINTMENT',
          targetId: cur.bookingId,
          summary: `Status=${b.bookingStatus || cur.bookingStatus}, Payment=${b.paymentStatus || cur.paymentStatus}.`,
        });
        return { appointment: db.appointments[existingIdx] };
      });
      res.json(resData);
    }
  );

  app.put(
    '/api/suite/availability',
    requireAuth,
    requirePermission('appointments'),
    async (req: AuthenticatedRequest, res: Response) => {
      const rules = Array.isArray(req.body?.rules) ? req.body.rules : [];
      const activeCount = await withDbMutation((db) => {
        db.availability = rules;
        appendAuditLog(db, {
          actorId: req.suiteUser!.id,
          actorName: req.suiteUser!.name,
          actorRole: req.suiteUser!.role,
          action: 'UPDATE_AVAILABILITY',
          targetId: 'WEEKLY_SCHEDULE',
          summary: `Updated ${rules.length} weekly consultation schedule rules.`,
        });
        return db.appointments.filter(
          (a) => a.bookingStatus === 'Confirmed' || a.bookingStatus === 'Pending'
        ).length;
      });
      res.json({ updated: rules.length, activeBookingsProtected: activeCount });
    }
  );

  app.post(
    '/api/suite/blocked-dates',
    requireAuth,
    requirePermission('appointments'),
    async (req: AuthenticatedRequest, res: Response) => {
      const date = String(req.body?.date || '');
      const reason = stripControls(String(req.body?.reason || 'Unavailable'));
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        res.status(400).json({ error: 'Valid YYYY-MM-DD date required.' });
        return;
      }
      const conflicts = await withDbMutation((db) => {
        if (!db.blockedDates.some((b) => b.date === date)) {
          db.blockedDates.push({
            date,
            reason,
            createdBy: req.suiteUser!.name,
            createdAt: new Date().toISOString(),
          });
        }
        appendAuditLog(db, {
          actorId: req.suiteUser!.id,
          actorName: req.suiteUser!.name,
          actorRole: req.suiteUser!.role,
          action: 'BLOCK_DATE',
          targetId: date,
          summary: reason,
        });
        return db.appointments.filter(
          (a) =>
            a.appointmentDate === date &&
            (a.bookingStatus === 'Confirmed' || a.bookingStatus === 'Pending')
        ).length;
      });
      res.json({ blocked: date, conflictWarningCount: conflicts });
    }
  );

  app.delete(
    '/api/suite/blocked-dates/:date',
    requireAuth,
    requirePermission('appointments'),
    async (req: AuthenticatedRequest, res: Response) => {
      const date = String(req.params.date || '');
      await withDbMutation((db) => {
        db.blockedDates = db.blockedDates.filter((b) => b.date !== date);
        appendAuditLog(db, {
          actorId: req.suiteUser!.id,
          actorName: req.suiteUser!.name,
          actorRole: req.suiteUser!.role,
          action: 'UNBLOCK_DATE',
          targetId: date,
          summary: 'Unblocked consultation date.',
        });
      });
      res.json({ unblocked: date });
    }
  );

  // --- Payments & Invoices ---
  app.get(
    '/api/suite/payments',
    requireAuth,
    requirePermission('payments'),
    (_req: Request, res: Response) => {
      const db = readDb();
      const creds = getRazorpayCredentials();
      res.json({
        invoices: db.invoices,
        payments: db.payments,
        razorpayConfigured: Boolean(creds),
        razorpayMode: creds?.mode || 'test',
        webhookConfigured: Boolean(
          creds?.webhookSecret || (process.env.RAZORPAY_WEBHOOK_SECRET || '').trim()
        ),
        uaeGatewayEnabled: Boolean(db.websiteSettings?.uaeGatewayEnabled),
      });
    }
  );

  app.post(
    '/api/suite/invoices',
    requireAuth,
    requirePermission('payments'),
    async (req: AuthenticatedRequest, res: Response) => {
      const schema = z.object({
        clientId: z.string().trim().max(80).optional().default(''),
        customerName: z.string().trim().min(2).max(120),
        companyName: z.string().trim().max(120).optional().default(''),
        customerEmail: z.string().trim().email().max(160),
        customerPhone: z.string().trim().max(30).optional().default(''),
        serviceCategory: z.string().trim().min(2).max(100),
        leadSource: z.string().trim().max(40).optional().default('Website'),
        currency: z.enum(['INR', 'AED', 'USD']).default('INR'),
        paymentType: z.enum(['advance', 'full', 'consultation', 'recurring', 'balance']).default('full'),
        amount: z.number().finite().positive().max(100_000_000),
        gstEnabled: z.boolean().default(true),
        gstRate: z.number().finite().min(0).max(100).default(18),
        dueDate: z.string().trim().max(20).optional().default(''),
        notes: z.string().trim().max(1000).optional().default(''),
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid invoice payload.' });
        return;
      }

      const totals = calculateQuotationTotals(
        [
          {
            id: 'line-1',
            title: parsed.data.serviceCategory,
            qty: 1,
            unitPrice: parsed.data.amount,
          },
        ],
        0,
        parsed.data.gstEnabled,
        parsed.data.gstRate
      );

      const invoice = await withDbMutation((db) => {
        const nowIso = new Date().toISOString();
        const invId = `INV-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        const seq = String(db.invoices.length + 1).padStart(4, '0');
        const invoiceNumber = `AKY-INV-${new Date().getUTCFullYear()}-${seq}`;
        const src = parsed.data.leadSource as LeadSource;
        const created: InvoiceRecord = {
          id: invId,
          invoiceNumber,
          quotationId: '',
          quotationNumber: '',
          leadId: '',
          clientId: parsed.data.clientId,
          serviceCategory: stripControls(parsed.data.serviceCategory),
          leadSource: LEAD_SOURCES.includes(src) ? src : 'Website',
          customerName: stripControls(parsed.data.customerName),
          companyName: stripControls(parsed.data.companyName),
          customerEmail: stripControls(parsed.data.customerEmail),
          customerPhone: stripControls(parsed.data.customerPhone),
          currency: parsed.data.currency,
          paymentType: parsed.data.paymentType,
          subtotal: totals.subtotal,
          discountAmount: 0,
          taxableAmount: totals.taxableAmount,
          gstEnabled: parsed.data.gstEnabled,
          gstRate: parsed.data.gstEnabled ? parsed.data.gstRate : 0,
          gstAmount: totals.gstAmount,
          totalAmount: totals.grandTotal,
          paidAmount: 0,
          refundedAmount: 0,
          status: 'UNPAID',
          dueDate:
            parsed.data.dueDate || new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10),
          notes: stripControls(parsed.data.notes),
          createdAt: nowIso,
          updatedAt: nowIso,
        };
        db.invoices.unshift(created);
        appendAuditLog(db, {
          actorId: req.suiteUser!.id,
          actorName: req.suiteUser!.name,
          actorRole: req.suiteUser!.role,
          action: 'CREATE_INVOICE',
          targetId: invoiceNumber,
          summary: `Issued invoice ${invoiceNumber} for ${created.currency} ${created.totalAmount}.`,
        });
        return created;
      });
      res.status(201).json({ invoice });
    }
  );

  // --- Recurring Subscriptions & Monthly Creative Billing ---
  app.get(
    '/api/suite/subscriptions',
    requireAuth,
    requirePermission('payments'),
    (_req: Request, res: Response) => {
      const db = readDb();
      const monthlyServices = (db.services || [])
        .filter((s) => {
          const monthlyVal = Number(s.monthlyPrice ?? s.recurringFee ?? 0) || 0;
          return (
            s.active &&
            (monthlyVal > 0 ||
              s.billingCycle === 'monthly' ||
              s.category === 'Business Creative & Documentation Services')
          );
        })
        .sort((a, b) => a.sortOrder - b.sortOrder);

      const renewalInvoices = (db.invoices || []).filter((inv) => inv.paymentType === 'recurring');
      res.json({
        subscriptions: db.subscriptions || [],
        monthlyServices,
        clients: db.clients || [],
        renewalInvoices,
      });
    }
  );

  app.post(
    '/api/suite/subscriptions',
    requireAuth,
    requirePermission('payments'),
    async (req: AuthenticatedRequest, res: Response) => {
      const schema = z.object({
        clientId: z.string().trim().max(80).optional().default(''),
        customerName: z.string().trim().min(2).max(120),
        companyName: z.string().trim().max(120).optional().default(''),
        customerEmail: z.string().trim().email().max(160),
        customerPhone: z.string().trim().max(30).optional().default(''),
        serviceId: z.string().trim().min(2).max(80),
        currency: z.enum(['INR', 'AED', 'USD']).default('INR'),
        monthlyAmount: z.number().finite().positive().max(100_000_000).optional(),
        gstEnabled: z.boolean().optional(),
        gstRate: z.number().finite().min(0).max(100).optional(),
        billingCycleDay: z.number().int().min(1).max(28).default(1),
        startDate: z
          .string()
          .trim()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional(),
        nextBillingDate: z
          .string()
          .trim()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional(),
        notes: z.string().trim().max(600).optional().default(''),
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid subscription payload.' });
        return;
      }

      try {
        const created = await withDbMutation((db) => {
          const srv = db.services.find((s) => s.id === parsed.data.serviceId);
          if (!srv) {
            const err = new Error('Selected monthly service not found.');
            (err as any).statusCode = 404;
            throw err;
          }

          const tierKey =
            parsed.data.currency === 'AED' ? 'aed' : parsed.data.currency === 'USD' ? 'usd' : null;
          const catalogMonthly =
            (tierKey && srv.internationalPricing?.[tierKey]?.packagePrice !== undefined
              ? Number(srv.internationalPricing[tierKey]!.packagePrice)
              : undefined) ??
            (Number(srv.monthlyPrice ?? srv.recurringFee ?? srv.packagePrice ?? 0) || 0);

          const monthlyAmount = round2(
            parsed.data.monthlyAmount && parsed.data.monthlyAmount > 0
              ? parsed.data.monthlyAmount
              : catalogMonthly
          );
          if (monthlyAmount <= 0) {
            const err = new Error('Monthly billing amount must be greater than zero.');
            (err as any).statusCode = 400;
            throw err;
          }

          const nowIso = new Date().toISOString();
          const todayIso = getIstDateParts().isoDate;
          const startDate = parsed.data.startDate || todayIso;
          const nextBillingDate = parsed.data.nextBillingDate || startDate;
          const seq = String((db.subscriptions?.length || 0) + 1).padStart(4, '0');
          const sub: SubscriptionRecord = {
            id: `SUB-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
            subscriptionCode: `AKY-SUB-${new Date().getUTCFullYear()}-${seq}`,
            clientId: stripControls(parsed.data.clientId),
            customerName: stripControls(parsed.data.customerName),
            companyName: stripControls(parsed.data.companyName),
            customerEmail: stripControls(parsed.data.customerEmail).toLowerCase(),
            customerPhone: stripControls(parsed.data.customerPhone),
            serviceId: srv.id,
            serviceName: srv.name,
            serviceCategory: srv.category,
            currency: parsed.data.currency,
            monthlyAmount,
            gstEnabled: parsed.data.gstEnabled ?? srv.gstEnabled,
            gstRate:
              (parsed.data.gstEnabled ?? srv.gstEnabled)
                ? parsed.data.gstRate ?? srv.gstRate ?? 18
                : 0,
            status: 'ACTIVE',
            billingCycleDay: parsed.data.billingCycleDay,
            startDate,
            nextBillingDate,
            lastBilledAt: '',
            lastInvoiceId: '',
            lastInvoiceNumber: '',
            renewalCount: 0,
            notes: stripControls(parsed.data.notes),
            createdAt: nowIso,
            updatedAt: nowIso,
          };

          if (!Array.isArray(db.subscriptions)) db.subscriptions = [];
          db.subscriptions.unshift(sub);

          appendAuditLog(db, {
            actorId: req.suiteUser!.id,
            actorName: req.suiteUser!.name,
            actorRole: req.suiteUser!.role,
            action: 'CREATE_SUBSCRIPTION',
            targetId: sub.subscriptionCode,
            summary: `Started recurring billing for ${sub.companyName || sub.customerName} on '${sub.serviceName}' (${sub.currency} ${sub.monthlyAmount}/mo).`,
          });

          return sub;
        });

        res.status(201).json({ subscription: created });
      } catch (err: any) {
        res.status(err?.statusCode || 400).json({ error: err?.message || 'Unable to create subscription.' });
      }
    }
  );

  app.patch(
    '/api/suite/subscriptions/:subId/status',
    requireAuth,
    requirePermission('payments'),
    async (req: AuthenticatedRequest, res: Response) => {
      const subId = String(req.params.subId || '');
      const schema = z.object({
        status: z.enum(['ACTIVE', 'PAUSED', 'CANCELLED']),
        note: z.string().trim().max(300).optional(),
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid status payload.' });
        return;
      }

      try {
        const updated = await withDbMutation((db) => {
          const sub = (db.subscriptions || []).find((s) => s.id === subId);
          if (!sub) {
            const err = new Error('Subscription not found.');
            (err as any).statusCode = 404;
            throw err;
          }
          const prevStatus = sub.status;
          sub.status = parsed.data.status;
          sub.updatedAt = new Date().toISOString();
          if (parsed.data.note) {
            sub.notes = stripControls(parsed.data.note);
          }

          appendAuditLog(db, {
            actorId: req.suiteUser!.id,
            actorName: req.suiteUser!.name,
            actorRole: req.suiteUser!.role,
            action: 'UPDATE_SUBSCRIPTION_STATUS',
            targetId: sub.subscriptionCode,
            summary: `Changed ${sub.customerName} (${sub.serviceName}) recurring billing status from ${prevStatus} to ${sub.status}.`,
          });

          return sub;
        });
        res.json({ subscription: updated });
      } catch (err: any) {
        res.status(err?.statusCode || 400).json({ error: err?.message || 'Unable to update subscription status.' });
      }
    }
  );

  app.post(
    '/api/suite/subscriptions/:subId/trigger-renewal',
    requireAuth,
    requirePermission('payments'),
    async (req: AuthenticatedRequest, res: Response) => {
      const subId = String(req.params.subId || '');
      try {
        const result = await withDbMutation(async (db) => {
          const sub = (db.subscriptions || []).find((s) => s.id === subId);
          if (!sub) {
            const err = new Error('Subscription not found.');
            (err as any).statusCode = 404;
            throw err;
          }
          if (sub.status !== 'ACTIVE') {
            const err = new Error(
              `Cannot trigger renewal invoice while subscription is ${sub.status}. Resume billing first.`
            );
            (err as any).statusCode = 400;
            throw err;
          }

          const totals = calculateQuotationTotals(
            [
              {
                id: 'renewal-line-1',
                serviceId: sub.serviceId,
                title: `${sub.serviceName} — Monthly Renewal`,
                qty: 1,
                unitPrice: sub.monthlyAmount,
                billingType: 'monthly',
              },
            ],
            0,
            sub.gstEnabled,
            sub.gstRate
          );

          const nowIso = new Date().toISOString();
          const invId = `INV-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
          const seq = String(db.invoices.length + 1).padStart(4, '0');
          const invoiceNumber = `AKY-INV-${new Date().getUTCFullYear()}-${seq}`;
          const renewalCycleNumber = sub.renewalCount + 1;

          const createdInvoice: InvoiceRecord = {
            id: invId,
            invoiceNumber,
            quotationId: '',
            quotationNumber: sub.subscriptionCode,
            leadId: '',
            clientId: sub.clientId,
            serviceCategory: sub.serviceCategory,
            leadSource: 'Direct contact',
            customerName: sub.customerName,
            companyName: sub.companyName,
            customerEmail: sub.customerEmail,
            customerPhone: sub.customerPhone,
            currency: sub.currency,
            paymentType: 'recurring',
            subtotal: totals.subtotal,
            discountAmount: 0,
            taxableAmount: totals.taxableAmount,
            gstEnabled: sub.gstEnabled,
            gstRate: sub.gstEnabled ? sub.gstRate : 0,
            gstAmount: totals.gstAmount,
            totalAmount: totals.grandTotal,
            paidAmount: 0,
            refundedAmount: 0,
            status: 'UNPAID',
            dueDate: new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10),
            notes: `Manual renewal #${renewalCycleNumber} triggered for ${sub.serviceName} (${sub.subscriptionCode}) by ${req.suiteUser!.name}.`,
            createdAt: nowIso,
            updatedAt: nowIso,
          };

          db.invoices.unshift(createdInvoice);

          // Advance nextBillingDate by 1 month preserving billingCycleDay
          const baseParts = sub.nextBillingDate.split('-').map(Number);
          const baseDate =
            baseParts.length === 3
              ? new Date(Date.UTC(baseParts[0], baseParts[1] - 1, baseParts[2]))
              : new Date();
          const targetMonth = baseDate.getUTCMonth() + 1;
          const targetYear = baseDate.getUTCFullYear() + Math.floor(targetMonth / 12);
          const normMonth = targetMonth % 12;
          const maxDayInMonth = new Date(Date.UTC(targetYear, normMonth + 1, 0)).getUTCDate();
          const clampedDay = Math.min(sub.billingCycleDay || 1, maxDayInMonth);
          const nextIsoDate = new Date(Date.UTC(targetYear, normMonth, clampedDay))
            .toISOString()
            .slice(0, 10);

          sub.renewalCount = renewalCycleNumber;
          sub.lastBilledAt = nowIso;
          sub.lastInvoiceId = createdInvoice.id;
          sub.lastInvoiceNumber = createdInvoice.invoiceNumber;
          sub.nextBillingDate = nextIsoDate;
          sub.updatedAt = nowIso;

          appendAuditLog(db, {
            actorId: req.suiteUser!.id,
            actorName: req.suiteUser!.name,
            actorRole: req.suiteUser!.role,
            action: 'TRIGGER_RENEWAL_INVOICE',
            targetId: createdInvoice.invoiceNumber,
            summary: `Triggered renewal invoice ${createdInvoice.invoiceNumber} (${createdInvoice.currency} ${createdInvoice.totalAmount}) for ${sub.subscriptionCode} (${sub.serviceName}).`,
          });

          if (db.notificationSettings?.sendClientReceipts && sub.customerEmail) {
            await dispatchNotification(db, {
              event: 'quotation_created',
              recipient: sub.customerEmail,
              subject: `[AKYIN Invoice] Monthly Renewal ${createdInvoice.invoiceNumber} — ${sub.serviceName}`,
              body: [
                `Hello ${sub.customerName},`,
                '',
                `A monthly renewal invoice (${createdInvoice.invoiceNumber}) has been generated for your recurring service:`,
                `Service: ${sub.serviceName}`,
                `Subscription Reference: ${sub.subscriptionCode}`,
                `Total Due (incl. taxes): ${createdInvoice.currency} ${createdInvoice.totalAmount.toLocaleString('en-IN')}`,
                `Due Date: ${createdInvoice.dueDate}`,
                '',
                'Thank you for working with AKYIN Ventures.',
              ].join('\n'),
            });
          }

          return { subscription: sub, invoice: createdInvoice };
        });

        res.status(201).json(result);
      } catch (err: any) {
        res.status(err?.statusCode || 400).json({ error: err?.message || 'Unable to trigger renewal invoice.' });
      }
    }
  );

  app.get(
    '/api/suite/subscriptions/reminders/status',
    requireAuth,
    requirePermission('payments'),
    (_req: Request, res: Response) => {
      const db = readDb();
      const scheduler = getSchedulerStatus();
      const upcomingCandidates = findUpcomingRenewals(db, 7);
      const reminderLogs = (db.notificationLogs || [])
        .filter((l) => l.event === 'subscription_renewal_reminder')
        .slice(0, 20);
      res.json({
        scheduler,
        smtpConfigured: Boolean(getSmtpConfig()),
        reminderRuleEnabled: Boolean(db.notificationSettings?.events?.subscription_renewal_reminder),
        upcomingCandidates,
        reminderLogs,
      });
    }
  );

  app.post(
    '/api/suite/subscriptions/reminders/run',
    requireAuth,
    requirePermission('payments'),
    async (req: AuthenticatedRequest, res: Response) => {
      const schema = z.object({
        leadDays: z.number().int().min(0).max(30).optional(),
        forceResend: z.boolean().optional(),
      });
      const parsed = schema.safeParse(req.body || {});
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid reminder run parameters.' });
        return;
      }
      const result = await runSubscriptionRenewalReminderSweep({
        leadDays: parsed.data.leadDays,
        forceResend: parsed.data.forceResend,
        source: 'manual',
        actorName: req.suiteUser!.name,
      });
      res.json(result);
    }
  );

  app.post(
    '/api/suite/invoices/:invoiceId/record-manual',
    requireAuth,
    requirePermission('payments'),
    async (req: AuthenticatedRequest, res: Response) => {
      const invoiceId = String(req.params.invoiceId || '');
      const schema = z.object({
        amount: z.number().finite().positive(),
        gateway: z.enum(['manual_bank', 'manual_uae_transfer', 'cash']).default('manual_bank'),
        mode: z.enum(['live', 'test']).default('live'),
        gatewayFeeAmount: z.number().finite().min(0).default(0),
        referenceNote: z.string().trim().max(400).optional().default(''),
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid manual payment.' });
        return;
      }

      try {
        const result = await withDbMutation(async (db) => {
          const inv = db.invoices.find((i) => i.id === invoiceId);
          if (!inv) {
            const err = new Error('Invoice not found.');
            (err as any).statusCode = 404;
            throw err;
          }
          const nowIso = new Date().toISOString();
          const remaining = round2(Math.max(0, inv.totalAmount - inv.paidAmount));
          const appliedAmount = round2(Math.min(parsed.data.amount, remaining || parsed.data.amount));
          const gstRatio = inv.totalAmount > 0 ? inv.gstAmount / inv.totalAmount : 0;

          const payRec: PaymentRecord = {
            id: `PAY-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
            invoiceId: inv.id,
            invoiceNumber: inv.invoiceNumber,
            quotationId: inv.quotationId,
            clientId: inv.clientId,
            customerName: inv.companyName || inv.customerName,
            customerEmail: inv.customerEmail,
            serviceCategory: inv.serviceCategory,
            leadSource: inv.leadSource,
            mode: parsed.data.mode,
            gateway: parsed.data.gateway,
            method: parsed.data.gateway,
            currency: inv.currency,
            amount: appliedAmount,
            gstPortion: round2(appliedAmount * gstRatio),
            gatewayFeeAmount: round2(parsed.data.gatewayFeeAmount),
            refundedAmount: 0,
            status: 'manual_recorded',
            verified: true,
            razorpayOrderId: '',
            razorpayPaymentId: '',
            razorpaySignatureVerified: false,
            webhookEventIds: [],
            idempotencyKey: `manual:${crypto.randomBytes(8).toString('hex')}`,
            notes: stripControls(parsed.data.referenceNote),
            createdAt: nowIso,
            capturedAt: nowIso,
            updatedAt: nowIso,
          };
          db.payments.unshift(payRec);
          if (parsed.data.mode === 'live') {
            inv.paidAmount = round2(inv.paidAmount + appliedAmount);
            recalculateInvoiceStatus(inv);
          }
          appendAuditLog(db, {
            actorId: req.suiteUser!.id,
            actorName: req.suiteUser!.name,
            actorRole: req.suiteUser!.role,
            action: 'RECORD_MANUAL_PAYMENT',
            targetId: inv.invoiceNumber,
            summary: `Recorded ${parsed.data.mode} ${parsed.data.gateway} settlement (${inv.currency} ${appliedAmount}).`,
          });
          await dispatchNotification(db, {
            event: 'payment_received',
            subject: `Manual Settlement Recorded: ${inv.invoiceNumber}`,
            body: `Invoice: ${inv.invoiceNumber}\nAmount: ${inv.currency} ${appliedAmount}\nMethod: ${parsed.data.gateway}\nMode: ${parsed.data.mode}`,
          });
          return { invoice: inv, payment: payRec };
        });
        res.status(201).json(result);
      } catch (err: any) {
        res.status(err?.statusCode || 400).json({ error: err?.message || 'Manual settlement failed.' });
      }
    }
  );

  app.post(
    '/api/suite/payments/:paymentId/refund',
    requireAuth,
    requirePermission('payments'),
    async (req: AuthenticatedRequest, res: Response) => {
      const paymentId = String(req.params.paymentId || '');
      const schema = z.object({
        refundAmount: z.number().finite().positive(),
        reason: z.string().trim().max(300).optional().default('Client refund'),
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: 'Provide a valid positive refund amount.' });
        return;
      }

      try {
        const result = await withDbMutation(async (db) => {
          const pay = db.payments.find((p) => p.id === paymentId);
          if (!pay) {
            const err = new Error('Payment record not found.');
            (err as any).statusCode = 404;
            throw err;
          }
          const refundable = round2(Math.max(0, pay.amount - pay.refundedAmount));
          if (parsed.data.refundAmount > refundable) {
            const err = new Error(`Maximum refundable balance is ${refundable}.`);
            (err as any).statusCode = 400;
            throw err;
          }
          const appliedRefund = round2(parsed.data.refundAmount);
          pay.refundedAmount = round2(pay.refundedAmount + appliedRefund);
          if (pay.refundedAmount >= pay.amount) {
            pay.status = 'refunded';
          }
          pay.updatedAt = new Date().toISOString();

          if (pay.invoiceId && pay.mode === 'live') {
            const inv = db.invoices.find((i) => i.id === pay.invoiceId);
            if (inv) {
              inv.refundedAmount = round2(inv.refundedAmount + appliedRefund);
              inv.paidAmount = round2(Math.max(0, inv.paidAmount - appliedRefund));
              recalculateInvoiceStatus(inv);
            }
          }

          appendAuditLog(db, {
            actorId: req.suiteUser!.id,
            actorName: req.suiteUser!.name,
            actorRole: req.suiteUser!.role,
            action: 'PROCESS_REFUND',
            targetId: pay.id,
            summary: `Refunded ${pay.currency} ${appliedRefund}: ${stripControls(parsed.data.reason)}.`,
          });

          await dispatchNotification(db, {
            event: 'refund_processed',
            subject: `Refund Issued: ${pay.id} (${pay.currency} ${appliedRefund})`,
            body: `Payment: ${pay.id}\nRefund: ${pay.currency} ${appliedRefund}\nReason: ${parsed.data.reason}`,
          });

          return { payment: pay };
        });
        res.json(result);
      } catch (err: any) {
        res.status(err?.statusCode || 400).json({ error: err?.message || 'Refund failed.' });
      }
    }
  );

  // --- Revenue Reports ---
  app.get(
    '/api/suite/reports/revenue',
    requireAuth,
    requirePermission('reports'),
    (req: Request, res: Response) => {
      const db = readDb();
      const preset = String(req.query.preset || 'this_month') as RevenuePeriodPreset;
      const report = computeRevenueReport(db, {
        preset,
        startDate: typeof req.query.startDate === 'string' ? req.query.startDate : undefined,
        endDate: typeof req.query.endDate === 'string' ? req.query.endDate : undefined,
        clientId: typeof req.query.clientId === 'string' ? req.query.clientId : undefined,
        serviceCategory:
          typeof req.query.serviceCategory === 'string' ? req.query.serviceCategory : undefined,
        leadSource: typeof req.query.leadSource === 'string' ? req.query.leadSource : undefined,
        paymentMethod:
          typeof req.query.paymentMethod === 'string' ? req.query.paymentMethod : undefined,
      });
      res.json(report);
    }
  );

  app.get(
    '/api/suite/reports/export.csv',
    requireAuth,
    requirePermission('reports'),
    (req: Request, res: Response) => {
      const db = readDb();
      const preset = String(req.query.preset || 'this_month') as RevenuePeriodPreset;
      const report = computeRevenueReport(db, {
        preset,
        startDate: typeof req.query.startDate === 'string' ? req.query.startDate : undefined,
        endDate: typeof req.query.endDate === 'string' ? req.query.endDate : undefined,
      });
      const header = [
        'Payment ID',
        'Captured At',
        'Invoice',
        'Customer',
        'Service Category',
        'Lead Source',
        'Mode',
        'Method',
        'Status',
        'Verified',
        'Currency',
        'Amount',
        'GST Portion',
        'Gateway Fee',
        'Refunded',
      ]
        .map(sanitizeCsvCell)
        .join(',');
      const rows = report.matchingPayments.map((p) =>
        [
          p.id,
          p.capturedAt || p.createdAt,
          p.invoiceNumber,
          p.customerName,
          p.serviceCategory,
          p.leadSource,
          p.mode,
          p.method,
          p.status,
          p.verified ? 'Yes' : 'No',
          p.currency,
          p.amount,
          p.gstPortion,
          p.gatewayFeeAmount,
          p.refundedAmount,
        ]
          .map(sanitizeCsvCell)
          .join(',')
      );
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="akyin-revenue-${preset}.csv"`);
      res.send([header, ...rows].join('\n'));
    }
  );

  app.get(
    '/api/suite/reports/recurring-insights',
    requireAuth,
    requirePermission('reports'),
    (req: Request, res: Response) => {
      const rawMonths = Number(req.query.months || 12);
      const monthsWindow = Number.isFinite(rawMonths) ? Math.min(24, Math.max(3, Math.floor(rawMonths))) : 12;
      const db = readDb();
      const insights = computeRecurringRevenueInsights(db, monthsWindow);
      res.json(insights);
    }
  );

  // --- Website Settings & Social Media ---
  app.get(
    '/api/suite/settings',
    requireAuth,
    requirePermission('overview'),
    (_req: Request, res: Response) => {
      const db = readDb();
      res.json({
        websiteSettings: db.websiteSettings,
        notificationSettings: db.notificationSettings,
        notificationLogs: db.notificationLogs.slice(0, 80),
        smtpConfigured: Boolean(getSmtpConfig()),
      });
    }
  );

  app.put(
    '/api/suite/settings',
    requireAuth,
    async (req: AuthenticatedRequest, res: Response) => {
      if (
        req.suiteUser!.role !== 'Super Admin' &&
        req.suiteUser!.role !== 'Sales Manager'
      ) {
        res.status(403).json({ error: 'Insufficient permission to edit website settings.' });
        return;
      }
      const patch = (req.body || {}) as Record<string, unknown>;
      const updated = await withDbMutation((db) => {
        for (const [k, v] of Object.entries(patch)) {
          if (k === 'reportedClientsCount') {
            const num = Number(v);
            if (Number.isFinite(num) && num >= 0) {
              db.websiteSettings.reportedClientsCount = Math.round(num);
            }
          } else if (k === 'uaeGatewayEnabled') {
            db.websiteSettings.uaeGatewayEnabled = Boolean(v);
          } else if (typeof v === 'string') {
            db.websiteSettings[k] = stripControls(v);
          }
        }
        appendAuditLog(db, {
          actorId: req.suiteUser!.id,
          actorName: req.suiteUser!.name,
          actorRole: req.suiteUser!.role,
          action: 'UPDATE_WEBSITE_SETTINGS',
          targetId: 'WEBSITE_SETTINGS',
          summary: `Updated keys: ${Object.keys(patch).join(', ')}`,
        });
        return db.websiteSettings;
      });
      res.json({ websiteSettings: updated });
    }
  );

  // --- RBAC User Management (Super Admin Only) ---
  app.get(
    '/api/suite/users',
    requireAuth,
    requireRole(['Super Admin']),
    (_req: Request, res: Response) => {
      const db = readDb();
      res.json({
        users: db.users.map(toPublicUser),
        roles: USER_ROLES,
      });
    }
  );

  app.post(
    '/api/suite/users',
    requireAuth,
    requireRole(['Super Admin']),
    async (req: AuthenticatedRequest, res: Response) => {
      const schema = z.object({
        name: z.string().trim().min(2).max(100),
        email: z.string().trim().email().max(160),
        role: z.enum(['Super Admin', 'Sales Manager', 'Finance Manager', 'Staff']),
        password: z.string().min(8).max(128),
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid user payload.' });
        return;
      }
      try {
        const user = await withDbMutation((db) => {
          const cleanEmail = parsed.data.email.toLowerCase();
          if (db.users.some((u) => u.email.toLowerCase() === cleanEmail)) {
            const err = new Error('A user with this email already exists.');
            (err as any).statusCode = 409;
            throw err;
          }
          const nowIso = new Date().toISOString();
          const created = {
            id: `usr-${crypto.randomBytes(4).toString('hex')}`,
            name: stripControls(parsed.data.name),
            email: cleanEmail,
            role: parsed.data.role,
            active: true,
            passwordHash: hashPassword(parsed.data.password),
            createdAt: nowIso,
            updatedAt: nowIso,
            lastLoginAt: '',
          };
          db.users.push(created);
          appendAuditLog(db, {
            actorId: req.suiteUser!.id,
            actorName: req.suiteUser!.name,
            actorRole: req.suiteUser!.role,
            action: 'CREATE_USER',
            targetId: created.id,
            summary: `Created ${created.role} account for ${created.email}.`,
          });
          return toPublicUser(created);
        });
        res.status(201).json({ user });
      } catch (err: any) {
        res.status(err?.statusCode || 400).json({ error: err?.message || 'Unable to create user.' });
      }
    }
  );

  app.patch(
    '/api/suite/users/:userId',
    requireAuth,
    requireRole(['Super Admin']),
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = String(req.params.userId || '');
      try {
        const updated = await withDbMutation((db) => {
          const user = db.users.find((u) => u.id === userId);
          if (!user) {
            const err = new Error('User not found.');
            (err as any).statusCode = 404;
            throw err;
          }
          const b = req.body || {};
          const actorId = req.suiteUser!.id;
          if (b.role !== undefined && !USER_ROLES.includes(b.role as UserRole)) {
            const err = new Error('Invalid user role.');
            (err as any).statusCode = 400;
            throw err;
          }
          if (b.resetPassword !== undefined &&
              (typeof b.resetPassword !== 'string' || b.resetPassword.length < 8 || b.resetPassword.length > 128)) {
            const err = new Error('Reset password must be between 8 and 128 characters.');
            (err as any).statusCode = 400;
            throw err;
          }
          if (user.id === actorId && (b.active === false || b.role !== undefined || b.resetPassword !== undefined)) {
            const err = new Error('You cannot change your own access, role or password from team management.');
            (err as any).statusCode = 400;
            throw err;
          }
          const willRemainSuperAdmin = user.role === 'Super Admin' &&
            (b.active === false || (b.role !== undefined && b.role !== 'Super Admin'));
          if (willRemainSuperAdmin &&
              db.users.filter((candidate) => candidate.active && candidate.role === 'Super Admin' && candidate.id !== user.id).length === 0) {
            const err = new Error('At least one active Super Admin must remain.');
            (err as any).statusCode = 400;
            throw err;
          }
          if (typeof b.active === 'boolean') user.active = b.active;
          if (typeof b.role === 'string') user.role = b.role as UserRole;
          if (typeof b.resetPassword === 'string') user.passwordHash = hashPassword(b.resetPassword);
          // Revoke every existing session whenever credentials or privileges change.
          if (typeof b.active === 'boolean' || typeof b.role === 'string' || typeof b.resetPassword === 'string') {
            db.sessions = db.sessions.filter((session) => session.userId !== user.id);
          }
          user.updatedAt = new Date().toISOString();
          appendAuditLog(db, {
            actorId: req.suiteUser!.id,
            actorName: req.suiteUser!.name,
            actorRole: req.suiteUser!.role,
            action: 'UPDATE_USER',
            targetId: user.id,
            summary: `Updated user ${user.email}: role=${user.role}, active=${user.active}.`,
          });
          return toPublicUser(user);
        });
        res.json({ user: updated });
      } catch (err: any) {
        res.status(err?.statusCode || 400).json({ error: err?.message || 'User update failed.' });
      }
    }
  );

  app.delete(
    '/api/suite/users/:userId',
    requireAuth,
    requireRole(['Super Admin']),
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = String(req.params.userId || '').trim();
      try {
        await withDbMutation((db) => {
          const user = db.users.find((candidate) => candidate.id === userId);
          if (!user) {
            const err = new Error('User not found.');
            (err as any).statusCode = 404;
            throw err;
          }
          if (user.id === req.suiteUser!.id) {
            const err = new Error('You cannot delete your own account.');
            (err as any).statusCode = 400;
            throw err;
          }
          if (user.active && user.role === 'Super Admin' &&
              db.users.filter((candidate) => candidate.active && candidate.role === 'Super Admin' && candidate.id !== user.id).length === 0) {
            const err = new Error('The last active Super Admin cannot be deleted.');
            (err as any).statusCode = 400;
            throw err;
          }
          db.users = db.users.filter((candidate) => candidate.id !== user.id);
          db.sessions = db.sessions.filter((session) => session.userId !== user.id);
          appendAuditLog(db, {
            actorId: req.suiteUser!.id,
            actorName: req.suiteUser!.name,
            actorRole: req.suiteUser!.role,
            action: 'DELETE_USER',
            targetId: user.id,
            summary: `Deleted internal account ${user.email} (${user.role}). All sessions revoked.`,
          });
        });
        res.json({ ok: true, deletedUserId: userId });
      } catch (err: any) {
        res.status(err?.statusCode || 400).json({ error: err?.message || 'User deletion failed.' });
      }
    }
  );

  // --- Security, Audit Logs & Notification Settings ---
  app.get(
    '/api/suite/audit-logs',
    requireAuth,
    requirePermission('security_audit'),
    (_req: Request, res: Response) => {
      const db = readDb();
      res.json({
        auditLogs: db.auditLogs,
        notificationSettings: db.notificationSettings,
        notificationLogs: db.notificationLogs,
        smtpConfigured: Boolean(getSmtpConfig()),
      });
    }
  );

  app.put(
    '/api/suite/notifications',
    requireAuth,
    requirePermission('security_audit'),
    async (req: AuthenticatedRequest, res: Response) => {
      const b = req.body || {};
      if (typeof b.ownerNotificationEmail === 'string' && b.ownerNotificationEmail.trim()) {
        const emailCheck = z.string().trim().email().max(160).safeParse(b.ownerNotificationEmail);
        if (!emailCheck.success) {
          res.status(400).json({ error: 'Please provide a valid administrator notification email.' });
          return;
        }
      }
      const updated = await withDbMutation((db) => {
        if (typeof b.ownerNotificationEmail === 'string') {
          db.notificationSettings.ownerNotificationEmail = stripControls(b.ownerNotificationEmail).toLowerCase();
        }
        if (typeof b.sendClientReceipts === 'boolean') {
          db.notificationSettings.sendClientReceipts = b.sendClientReceipts;
        }
        if (b.events && typeof b.events === 'object') {
          for (const [k, val] of Object.entries(b.events)) {
            if (k in db.notificationSettings.events && typeof val === 'boolean') {
              db.notificationSettings.events[k as NotificationEventKey] = val;
            }
          }
        }
        appendAuditLog(db, {
          actorId: req.suiteUser!.id,
          actorName: req.suiteUser!.name,
          actorRole: req.suiteUser!.role,
          action: 'UPDATE_NOTIFICATIONS',
          targetId: 'NOTIFICATION_SETTINGS',
          summary: 'Updated automated email notification toggles.',
        });
        return db.notificationSettings;
      });
      res.json({ notificationSettings: updated });
    }
  );

  app.post(
    '/api/suite/notifications/test',
    requireAuth,
    requirePermission('security_audit'),
    async (req: AuthenticatedRequest, res: Response) => {
      const result = await withDbMutation(async (db) => {
        const nowIso = new Date().toISOString();
        const log = await dispatchNotification(db, {
          event: 'service_price_updated',
          subject: '[AKYIN SMTP Test] Automated Admin Price & Service Notification Verified',
          body: [
            'This is a live SMTP configuration test from AKYIN Business Suite.',
            '',
            `Triggered By: ${req.suiteUser!.name} (${req.suiteUser!.role})`,
            `Authorizing Admin Email: ${req.suiteUser!.email}`,
            `Owner Notification Recipient: ${db.notificationSettings.ownerNotificationEmail || 'connect@akyin.com'}`,
            `Timestamp: ${nowIso}`,
          ].join('\n'),
        });
        return {
          notification: log,
          smtpConfigured: Boolean(getSmtpConfig()),
        };
      });
      res.json(result);
    }
  );
}
