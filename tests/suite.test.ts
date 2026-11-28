import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { after, describe, it } from 'node:test';

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'akyin-suite-test-'));
process.env.AKYIN_DATA_DIR = tempDir;

import { hasPermission, hashPassword, verifyPassword } from '../server/auth';
import {
  calculateQuotationTotals,
  computeRecurringRevenueInsights,
  computeRevenueReport,
  getIndiaFinancialYearBounds,
} from '../server/finance';
import { runSubscriptionRenewalReminderSweepOnDb } from '../server/scheduler';
import {
  computeDateAvailability,
  handleRazorpayWebhook,
  sanitizeCsvCell,
  verifyRazorpayCheckoutSignature,
  verifyRazorpayWebhookSignature,
} from '../server/routes';
import { buildDynamicSitemapXml, renderSeoHtml } from '../server/seoRenderer';
import { readDb, slugifyServiceName, withDbMutation, writeDbAtomic } from '../server/storage';
import { SERVICE_CATEGORIES } from '../server/types';

after(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
});

describe('AKYIN Business Management Suite — Core Financial, Security & Booking Tests', () => {
  it('preserves a corrupt database instead of silently replacing live data with an empty database', () => {
    const isolatedDir = fs.mkdtempSync(path.join(os.tmpdir(), 'akyin-corrupt-db-test-'));
    const previousDataDir = process.env.AKYIN_DATA_DIR;
    const dbPath = path.join(isolatedDir, 'suite-db.json');
    const originalContents = '{"schemaVersion":4,"payments":[broken-json';
    fs.writeFileSync(dbPath, originalContents, 'utf8');

    try {
      process.env.AKYIN_DATA_DIR = isolatedDir;
      assert.throws(() => readDb(), /database could not be read/i);
      assert.equal(fs.readFileSync(dbPath, 'utf8'), originalContents);
      const backupsDir = path.join(isolatedDir, 'backups');
      const backups = fs.readdirSync(backupsDir).filter((name) => name.startsWith('suite-db-corrupt-'));
      assert.equal(backups.length, 1);
      assert.equal(fs.readFileSync(path.join(backupsDir, backups[0]), 'utf8'), originalContents);
    } finally {
      if (previousDataDir === undefined) delete process.env.AKYIN_DATA_DIR;
      else process.env.AKYIN_DATA_DIR = previousDataDir;
      fs.rmSync(isolatedDir, { recursive: true, force: true });
    }
  });

  it('calculates quotation line items, clamped discounts, and GST totals accurately', () => {
    const withGst = calculateQuotationTotals(
      [
        { id: '1', title: 'Growth Retainer', qty: 2, unitPrice: 15000 },
        { id: '2', title: 'Creative Pack', qty: 1, unitPrice: 4000 },
      ],
      2000,
      true,
      18
    );
    assert.equal(withGst.subtotal, 34000);
    assert.equal(withGst.discountAmount, 2000);
    assert.equal(withGst.taxableAmount, 32000);
    assert.equal(withGst.gstAmount, 5760);
    assert.equal(withGst.grandTotal, 37760);

    // Discount exceeding subtotal must clamp cleanly to subtotal
    const clampedNoGst = calculateQuotationTotals(
      [{ id: '1', title: 'Custom Scope', qty: 1, unitPrice: 5000 }],
      99999,
      false,
      18
    );
    assert.equal(clampedNoGst.discountAmount, 5000);
    assert.equal(clampedNoGst.taxableAmount, 0);
    assert.equal(clampedNoGst.gstAmount, 0);
    assert.equal(clampedNoGst.grandTotal, 0);
  });

  it('resolves India Apr-Mar Financial Year bounds and strictly separates live verified collections from test/failed/unverified payments', () => {
    const fyFeb = getIndiaFinancialYearBounds(new Date('2026-02-15T10:00:00+05:30'));
    assert.equal(fyFeb.startDate, '2025-04-01');
    assert.equal(fyFeb.endDate, '2026-03-31');
    assert.equal(fyFeb.label, 'FY 2025-26');

    const fyMay = getIndiaFinancialYearBounds(new Date('2026-05-01T10:00:00+05:30'));
    assert.equal(fyMay.startDate, '2026-04-01');
    assert.equal(fyMay.endDate, '2027-03-31');

    const db = readDb();
    const nowIso = '2026-06-15T10:00:00.000Z';
    db.quotations = [
      {
        id: 'qt-1',
        quoteNumber: 'AKY-QT-001',
        version: 1,
        shareToken: 'tok1',
        leadId: '',
        clientId: 'client-autoclub',
        customerName: 'AutoClub',
        companyName: 'AutoClub',
        customerEmail: 'ops@autoclub.example',
        customerPhone: '9876543210',
        cityCountry: 'India',
        currency: 'INR',
        items: [],
        subtotal: 50000,
        discountAmount: 0,
        taxableAmount: 50000,
        gstEnabled: true,
        gstRate: 18,
        gstAmount: 9000,
        grandTotal: 59000,
        paymentTerms: 'Full',
        expiryDate: '2026-07-15',
        scopeOfWork: '',
        exclusions: '',
        notes: '',
        status: 'ACCEPTED',
        customerResponseNote: '',
        respondedAt: nowIso,
        convertedInvoiceId: 'inv-1',
        revisions: [],
        createdBy: 'Admin',
        createdAt: nowIso,
        updatedAt: nowIso,
      },
    ];
    db.invoices = [
      {
        id: 'inv-1',
        invoiceNumber: 'AKY-INV-001',
        quotationId: 'qt-1',
        quotationNumber: 'AKY-QT-001',
        leadId: '',
        clientId: 'client-autoclub',
        serviceCategory: 'Automotive dealership marketing',
        leadSource: 'Website',
        customerName: 'AutoClub',
        companyName: 'AutoClub',
        customerEmail: 'ops@autoclub.example',
        customerPhone: '9876543210',
        currency: 'INR',
        paymentType: 'full',
        subtotal: 50000,
        discountAmount: 0,
        taxableAmount: 50000,
        gstEnabled: true,
        gstRate: 18,
        gstAmount: 9000,
        totalAmount: 59000,
        paidAmount: 49000,
        refundedAmount: 10000,
        status: 'PARTIAL',
        dueDate: '2026-06-30',
        notes: '',
        createdAt: nowIso,
        updatedAt: nowIso,
      },
    ];
    db.payments = [
      {
        id: 'pay-live',
        invoiceId: 'inv-1',
        invoiceNumber: 'AKY-INV-001',
        quotationId: 'qt-1',
        clientId: 'client-autoclub',
        customerName: 'AutoClub',
        customerEmail: 'ops@autoclub.example',
        serviceCategory: 'Automotive dealership marketing',
        leadSource: 'Website',
        mode: 'live',
        gateway: 'razorpay',
        method: 'upi',
        currency: 'INR',
        amount: 59000,
        gstPortion: 9000,
        gatewayFeeAmount: 1000,
        refundedAmount: 10000,
        status: 'captured',
        verified: true,
        razorpayOrderId: 'order_live_1',
        razorpayPaymentId: 'pay_live_1',
        razorpaySignatureVerified: true,
        webhookEventIds: [],
        idempotencyKey: 'k1',
        notes: '',
        createdAt: nowIso,
        capturedAt: nowIso,
        updatedAt: nowIso,
      },
      {
        id: 'pay-test',
        invoiceId: 'inv-1',
        invoiceNumber: 'AKY-INV-001',
        quotationId: 'qt-1',
        clientId: 'client-autoclub',
        customerName: 'AutoClub',
        customerEmail: 'ops@autoclub.example',
        serviceCategory: 'Automotive dealership marketing',
        leadSource: 'Website',
        mode: 'test',
        gateway: 'razorpay',
        method: 'card',
        currency: 'INR',
        amount: 25000,
        gstPortion: 0,
        gatewayFeeAmount: 0,
        refundedAmount: 0,
        status: 'captured',
        verified: true,
        razorpayOrderId: 'order_test_1',
        razorpayPaymentId: 'pay_test_1',
        razorpaySignatureVerified: true,
        webhookEventIds: [],
        idempotencyKey: 'k2',
        notes: '',
        createdAt: nowIso,
        capturedAt: nowIso,
        updatedAt: nowIso,
      },
      {
        id: 'pay-failed',
        invoiceId: 'inv-1',
        invoiceNumber: 'AKY-INV-001',
        quotationId: 'qt-1',
        clientId: 'client-autoclub',
        customerName: 'AutoClub',
        customerEmail: 'ops@autoclub.example',
        serviceCategory: 'Automotive dealership marketing',
        leadSource: 'Website',
        mode: 'live',
        gateway: 'razorpay',
        method: 'netbanking',
        currency: 'INR',
        amount: 59000,
        gstPortion: 0,
        gatewayFeeAmount: 0,
        refundedAmount: 0,
        status: 'failed',
        verified: false,
        razorpayOrderId: 'order_fail_1',
        razorpayPaymentId: 'pay_fail_1',
        razorpaySignatureVerified: false,
        webhookEventIds: [],
        idempotencyKey: 'k3',
        notes: '',
        createdAt: nowIso,
        capturedAt: '',
        updatedAt: nowIso,
      },
    ];

    const report = computeRevenueReport(db, {
      preset: 'custom',
      startDate: '2026-06-01',
      endDate: '2026-06-30',
    });

    assert.equal(report.metrics.quotedValue, 59000);
    assert.equal(report.metrics.acceptedQuotationValue, 59000);
    assert.equal(report.metrics.invoicedAmount, 59000);
    assert.equal(report.metrics.grossCollections, 59000);
    assert.equal(report.metrics.refunds, 10000);
    assert.equal(report.metrics.netCollections, 49000);
    assert.equal(report.metrics.gatewayFees, 1000);
    assert.equal(report.metrics.netRevenueAfterFeesAndRefunds, 48000);
    assert.equal(report.metrics.testModeTotal, 25000);
    assert.equal(report.metrics.excludedFailedOrUnverifiedCount, 2);
  });

  it('verifies Razorpay checkout HMAC-SHA256 & webhook signatures and enforces webhook idempotency', async () => {
    const secret = 'rzp_test_secret_12345';
    const orderId = 'order_ABC123';
    const paymentId = 'pay_XYZ789';
    const sig = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    assert.equal(verifyRazorpayCheckoutSignature(orderId, paymentId, sig, secret), true);
    assert.equal(verifyRazorpayCheckoutSignature(orderId, paymentId, '0'.repeat(64), secret), false);

    const webhookSecret = 'whsec_akyin_test_key';
    process.env.RAZORPAY_WEBHOOK_SECRET = webhookSecret;

    await withDbMutation((db) => {
      const nowIso = new Date().toISOString();
      db.invoices = [
        {
          id: 'inv-wh-1',
          invoiceNumber: 'AKY-INV-WH-1',
          quotationId: '',
          quotationNumber: '',
          leadId: '',
          clientId: '',
          serviceCategory: 'Digital marketing',
          leadSource: 'Website',
          customerName: 'Webhook Client',
          companyName: 'Webhook Co',
          customerEmail: 'wh@example.com',
          customerPhone: '9999999999',
          currency: 'INR',
          paymentType: 'full',
          subtotal: 10000,
          discountAmount: 0,
          taxableAmount: 10000,
          gstEnabled: false,
          gstRate: 0,
          gstAmount: 0,
          totalAmount: 10000,
          paidAmount: 0,
          refundedAmount: 0,
          status: 'UNPAID',
          dueDate: '2026-12-31',
          notes: '',
          createdAt: nowIso,
          updatedAt: nowIso,
        },
      ];
      db.payments = [
        {
          id: 'pay-wh-1',
          invoiceId: 'inv-wh-1',
          invoiceNumber: 'AKY-INV-WH-1',
          quotationId: '',
          clientId: '',
          customerName: 'Webhook Co',
          customerEmail: 'wh@example.com',
          serviceCategory: 'Digital marketing',
          leadSource: 'Website',
          mode: 'live',
          gateway: 'razorpay',
          method: 'razorpay',
          currency: 'INR',
          amount: 10000,
          gstPortion: 0,
          gatewayFeeAmount: 0,
          refundedAmount: 0,
          status: 'created',
          verified: false,
          razorpayOrderId: orderId,
          razorpayPaymentId: '',
          razorpaySignatureVerified: false,
          webhookEventIds: [],
          idempotencyKey: 'wh-idem-1',
          notes: '',
          createdAt: nowIso,
          capturedAt: '',
          updatedAt: nowIso,
        },
      ];
    });

    const rawBody = Buffer.from(
      JSON.stringify({
        event: 'payment.captured',
        payload: {
          payment: {
            entity: {
              id: paymentId,
              order_id: orderId,
              amount: 1000000, // 10,000 INR in paise
              fee: 23600, // 236 INR
              currency: 'INR',
              method: 'upi',
            },
          },
        },
      }),
      'utf8'
    );
    const whSig = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
    assert.equal(verifyRazorpayWebhookSignature(rawBody, whSig, webhookSecret), true);

    const makeMockRes = () => {
      const state: { statusCode: number; body: any } = { statusCode: 200, body: null };
      return {
        state,
        res: {
          status(code: number) {
            state.statusCode = code;
            return this;
          },
          json(data: unknown) {
            state.body = data;
            return this;
          },
        } as any,
      };
    };

    const req1: any = {
      headers: { 'x-razorpay-signature': whSig, 'x-razorpay-event-id': 'evt_unique_001' },
      body: rawBody,
    };
    const r1 = makeMockRes();
    await handleRazorpayWebhook(req1, r1.res);
    assert.equal(r1.state.statusCode, 200);
    assert.equal(r1.state.body.duplicate, false);

    // Replay exact same webhook event -> must deduplicate without double-crediting paidAmount
    const r2 = makeMockRes();
    await handleRazorpayWebhook(req1, r2.res);
    assert.equal(r2.state.statusCode, 200);
    assert.equal(r2.state.body.duplicate, true);

    const afterDb = readDb();
    const settledInv = afterDb.invoices.find((i) => i.id === 'inv-wh-1');
    assert.equal(settledInv?.paidAmount, 10000);
    assert.equal(settledInv?.status, 'PAID');
    delete process.env.RAZORPAY_WEBHOOK_SECRET;
  });

  it('prevents double-booking conflicts under concurrent IST appointment slot mutations', async () => {
    const futureDate = '2029-12-10'; // Monday in the future
    await withDbMutation((db) => {
      db.appointments = [];
      db.blockedDates = [];
    });

    const attemptBook = (name: string) =>
      withDbMutation((db) => {
        const avail = computeDateAvailability(db, futureDate);
        const slot = avail.slots.find((s) => s.startTime === '18:00');
        if (!slot || !slot.available) {
          throw new Error('SLOT_TAKEN');
        }
        const nowIso = new Date().toISOString();
        db.appointments.push({
          bookingId: `AKY-${name}`,
          createdAt: nowIso,
          updatedAt: nowIso,
          customerName: name,
          phone: '9876543210',
          email: `${name}@example.com`,
          city: 'Delhi',
          country: 'India',
          businessName: 'Test Co',
          website: '',
          businessStage: 'Growing SME / Retail',
          consultationTopic: 'Business Clarity',
          businessChallenge: 'Testing concurrency safety',
          appointmentDate: futureDate,
          startTime: slot.startTime,
          endTime: slot.endTime,
          paymentStatus: 'Payment Awaited',
          bookingStatus: 'Pending',
          adminNotes: '',
          calendarEventId: '',
        });
        return name;
      });

    const results = await Promise.allSettled([attemptBook('First'), attemptBook('Second')]);
    const fulfilled = results.filter((r) => r.status === 'fulfilled');
    const rejected = results.filter((r) => r.status === 'rejected');
    assert.equal(fulfilled.length, 1);
    assert.equal(rejected.length, 1);
  });

  it('enforces scrypt password verification, RBAC permissions, CSV injection neutralization, and strict client/service defaults', () => {
    const hash = hashPassword('StrongPass!2026');
    assert.ok(hash.startsWith('scrypt$'));
    assert.equal(verifyPassword('StrongPass!2026', hash), true);
    assert.equal(verifyPassword('WrongPassword', hash), false);

    // RBAC matrix checks
    assert.equal(hasPermission('Super Admin', 'users'), true);
    assert.equal(hasPermission('Sales Manager', 'users'), false);
    assert.equal(hasPermission('Sales Manager', 'quotations'), true);
    assert.equal(hasPermission('Sales Manager', 'payments'), false);
    assert.equal(hasPermission('Finance Manager', 'payments'), true);
    assert.equal(hasPermission('Finance Manager', 'reports'), true);
    assert.equal(hasPermission('Finance Manager', 'leads'), false);
    assert.equal(hasPermission('Staff', 'appointments'), true);
    assert.equal(hasPermission('Staff', 'security_audit'), false);

    // CSV injection prevention
    assert.equal(sanitizeCsvCell('=CMD|"/C calc"!A0'), `"'=CMD|""/C calc""!A0"`);
    assert.equal(sanitizeCsvCell('+SUM(A1:A2)'), `"'${'+SUM(A1:A2)'}"`);
    assert.equal(sanitizeCsvCell('-100'), `"'${'-100'}"`);
    assert.equal(sanitizeCsvCell('@evil'), `"'${'@evil'}"`);
    assert.equal(sanitizeCsvCell('Safe Value'), `"Safe Value"`);

    // Client portfolio & service catalogue integrity
    const db = readDb();
    writeDbAtomic(db);
    assert.equal(db.websiteSettings.reportedClientsCount, 58);
    assert.equal(db.clients.length, 11);
    assert.deepEqual(
      db.clients.map((c) => c.name),
      [
        'BizNXT.online',
        'Kartigo.online',
        'Thrift Store',
        'Budget Bazaar',
        'AutoClub',
        'Arosco Ventures',
        'MEI Cosmetics',
        'Krutika Cosmetics',
        'Nyika Traders',
        'NS Traders',
        'AICalc',
      ]
    );
    assert.equal(SERVICE_CATEGORIES.length, 10);
    assert.equal(db.serviceCategories.length, 10);
    assert.equal(db.services.length, 39);

    // Enforce zero Package A/B/C bundles & 100% unique names and slugs
    const seenNames = new Set<string>();
    const seenSlugs = new Set<string>();
    for (const srv of db.services) {
      assert.equal(/package\s*[abc]/i.test(srv.name), false, `Unexpected bundle name: ${srv.name}`);
      assert.ok(srv.slug && srv.slug === slugifyServiceName(srv.slug), `Invalid slug on ${srv.id}`);
      const normName = srv.name.trim().toLowerCase();
      assert.equal(seenNames.has(normName), false, `Duplicate service name: ${srv.name}`);
      assert.equal(seenSlugs.has(srv.slug.toLowerCase()), false, `Duplicate slug: ${srv.slug}`);
      seenNames.add(normName);
      seenSlugs.add(srv.slug.toLowerCase());
      assert.ok(SERVICE_CATEGORIES.includes(srv.category as (typeof SERVICE_CATEGORIES)[number]));
    }

    // Verify Preserved Doubled Prices on Existing Standalone Services (no double multiplication)
    const growthMkt = db.services.find((s) => s.id === 'srv-digital-marketing');
    assert.ok(growthMkt);
    assert.equal(growthMkt.setupFee, 79998); // Doubled from 39999
    assert.equal(growthMkt.recurringFee, 60000); // Doubled from 30000

    const leadFiltering = db.services.find((s) => s.id === 'srv-lead-gen');
    assert.ok(leadFiltering);
    assert.equal(leadFiltering.setupFee, 29998); // Doubled from 14999
    assert.equal(leadFiltering.recurringFee, 24000); // Doubled from 12000

    const socialMedia = db.services.find((s) => s.id === 'srv-social-media');
    assert.ok(socialMedia);
    assert.equal(socialMedia.recurringFee, 16000); // Doubled from 8000

    const metaAds = db.services.find((s) => s.id === 'srv-meta-ads');
    assert.ok(metaAds);
    assert.equal(metaAds.recurringFee, 40000); // Doubled from 20000

    const advisory = db.services.find((s) => s.id === 'srv-consulting');
    assert.ok(advisory);
    assert.equal(advisory.setupFee, 3998); // Doubled from 1999

    const salesTraining = db.services.find((s) => s.id === 'srv-sales-strategy');
    assert.ok(salesTraining);
    assert.equal(salesTraining.setupFee, 50000); // Doubled from 25000
    assert.equal(salesTraining.slug, 'commercial-dealership-sales-training');

    // STRICT EXCEPTIONS: Bulk SMS & WhatsApp must NEVER be doubled
    const bulkSms = db.services.find((s) => s.id === 'srv-bulk-sms');
    assert.ok(bulkSms);
    assert.equal(bulkSms.slug, 'bulk-sms');
    assert.equal(bulkSms.category, 'Messaging and Communication');
    assert.equal(bulkSms.packagePrice, 3000); // STRICT EXCEPTION: exactly 3000
    assert.equal(bulkSms.recurringFee, 3000);
    assert.equal(bulkSms.includedUnits, 10000);
    assert.equal(bulkSms.unitRate, 0.3); // 0.30 per SMS
    assert.equal(bulkSms.additionalUnitRate, 0.3);

    const whatsapp = db.services.find((s) => s.id === 'srv-whatsapp-messaging');
    assert.ok(whatsapp);
    assert.equal(whatsapp.slug, 'whatsapp-business-setup');
    assert.equal(whatsapp.category, 'Messaging and Communication');
    assert.equal(whatsapp.setupFee, 4999); // STRICT EXCEPTION: exactly 4999 setup
    assert.equal(whatsapp.unitRate, 1.5); // strictly separate 1.50/msg usage
    assert.equal(whatsapp.recurringFee, 0);

    // Verify Small Business-Support Creative/Document/Excel Services remain independently priced
    const standaloneCreativeIds = [
      'srv-creative-logo',
      'srv-creative-thumbnails',
      'srv-creative-scriptwriting',
      'srv-creative-ppt',
      'srv-creative-excel',
      'srv-creative-support',
    ];
    for (const id of standaloneCreativeIds) {
      const cs = db.services.find((s) => s.id === id);
      assert.ok(cs, `Missing standalone creative/document service: ${id}`);
      assert.ok(cs.oneTimePrice && cs.oneTimePrice > 0);
      assert.ok(cs.monthlyPrice && cs.monthlyPrice > 0);
      assert.ok(cs.revisionLimit);
      assert.ok(cs.gstEnabled);
    }

    const customServices = db.services.filter((s) => s.pricingModel === 'custom');
    assert.ok(customServices.length >= 10);
    for (const srv of customServices) {
      assert.equal(srv.setupFee, 0);
      assert.equal(srv.recurringFee, 0);
      assert.equal(srv.oneTimePrice ?? 0, 0);
      assert.equal(srv.monthlyPrice ?? 0, 0);
    }
  });

  it('calculates quotation breakdown with separate one-time, monthly, and usage subtotals', () => {
    const quoteMath = calculateQuotationTotals(
      [
        { id: '1', title: 'Logo Design (One-Time Project)', qty: 1, unitPrice: 6000, billingType: 'one-time' },
        { id: '2', title: 'Monthly Thumbnail Retainer', qty: 1, unitPrice: 8000, billingType: 'monthly' },
        { id: '3', title: 'WhatsApp Business Message Usage (1000 msgs)', qty: 1000, unitPrice: 1.5, billingType: 'usage' },
      ],
      1000,
      true,
      18
    );
    assert.equal(quoteMath.oneTimeSubtotal, 6000);
    assert.equal(quoteMath.monthlySubtotal, 8000);
    assert.equal(quoteMath.usageSubtotal, 1500);
    assert.equal(quoteMath.subtotal, 15500);
    assert.equal(quoteMath.discountAmount, 1000);
    assert.equal(quoteMath.taxableAmount, 14500);
    assert.equal(quoteMath.gstAmount, 2610);
    assert.equal(quoteMath.grandTotal, 17110);
    assert.equal(quoteMath.payableNow, 17110);
    assert.equal(quoteMath.futureRecurringAmount, 9440); // 8000 + 18% GST = 9440
  });

  it('dispatches automated admin email alerts when a new service is added or a service price is updated', async () => {
    const { dispatchNotification } = await import('../server/notifications');
    const db = readDb();
    assert.equal(db.notificationSettings.events.service_added, true);
    assert.equal(db.notificationSettings.events.service_price_updated, true);

    db.notificationSettings.ownerNotificationEmail = 'owner-alerts@akyin.com';
    db.notificationLogs = [];

    const addedLog = await dispatchNotification(db, {
      event: 'service_added',
      subject: '[AKYIN Admin Alert] New Service Added: Pitch Deck Pro',
      body: 'Service added by Authorized Admin: AKYIN Owner (connect@akyin.com · Super Admin)',
    });
    assert.equal(addedLog.event, 'service_added');
    assert.equal(addedLog.recipient, 'owner-alerts@akyin.com');
    assert.ok(addedLog.subject.includes('Pitch Deck Pro'));

    const priceUpdatedLog = await dispatchNotification(db, {
      event: 'service_price_updated',
      subject: '[AKYIN Admin Alert] Service Price Updated: Logo and Branding Design',
      body: 'One-Time / Setup Price: INR 10,000 -> INR 12,000\nAuthorized Admin: AKYIN Owner',
    });
    assert.equal(priceUpdatedLog.event, 'service_price_updated');
    assert.equal(priceUpdatedLog.recipient, 'owner-alerts@akyin.com');
    assert.equal(db.notificationLogs.length, 2);

    // Turning off the event toggle must skip dispatch
    db.notificationSettings.events.service_price_updated = false;
    const skippedLog = await dispatchNotification(db, {
      event: 'service_price_updated',
      subject: 'Skipped Alert',
      body: 'Should not send',
    });
    assert.equal(skippedLog.deliveryStatus, 'skipped_disabled');
  });

  it('initializes recurring subscriptions empty (no fake customer data) and calculates monthly creative renewal invoice totals', async () => {
    const { dispatchNotification } = await import('../server/notifications');
    const db = readDb();
    assert.ok(Array.isArray(db.subscriptions));
    assert.equal(db.subscriptions.length, 0);

    // Renewal invoice math for a monthly creative service (e.g. Social Media Thumbnail Design ₹8,000/mo + 18% GST)
    const creativeSubTotals = calculateQuotationTotals(
      [
        {
          id: 'renewal-1',
          serviceId: 'srv-creative-thumbnails',
          title: 'Social Media Thumbnail Design — Monthly Renewal',
          qty: 1,
          unitPrice: 8000,
          billingType: 'monthly',
        },
      ],
      0,
      true,
      18
    );
    assert.equal(creativeSubTotals.subtotal, 8000);
    assert.equal(creativeSubTotals.gstAmount, 1440);
    assert.equal(creativeSubTotals.grandTotal, 9440);

    // Verify PriceRevisionEntry & email alert include changedByEmail / Authorizing Admin Email
    db.notificationSettings.events.service_price_updated = true;
    db.notificationLogs = [];
    const srv = db.services.find((s) => s.id === 'srv-creative-thumbnails');
    assert.ok(srv);
    if (!Array.isArray(srv.priceHistory)) {
      srv.priceHistory = [];
    }
    const revDate = new Date().toISOString();
    srv.priceHistory.unshift({
      previousPrice: 8000,
      newPrice: 9000,
      changedAt: revDate,
      changedBy: 'AKYIN Owner',
      changedByEmail: 'owner@akyin.com',
      priceField: 'Monthly Price',
      note: 'Q3 creative rate adjustment',
    });
    assert.equal(srv.priceHistory[0].changedByEmail, 'owner@akyin.com');
    assert.equal(srv.priceHistory[0].previousPrice, 8000);
    assert.equal(srv.priceHistory[0].newPrice, 9000);

    const emailAlert = await dispatchNotification(db, {
      event: 'service_price_updated',
      subject: '[AKYIN Admin Alert] Service Price Updated: Social Media Thumbnail Design',
      body: [
        'Service Name: Social Media Thumbnail Design',
        'Authorizing Admin: AKYIN Owner',
        'Authorizing Admin Email: owner@akyin.com',
      ].join('\n'),
    });
    assert.equal(emailAlert.event, 'service_price_updated');
    assert.ok(emailAlert.subject.includes('Social Media Thumbnail Design'));
  });

  it('triggers automated Subscription Renewal Reminder emails for approaching renewals without duplicating a cycle, and computes Creative Services MRR insights', async () => {
    const db = readDb();
    db.notificationLogs = [];
    db.notificationSettings.events.subscription_renewal_reminder = true;

    const emptyInsights = computeRecurringRevenueInsights(db, 6, new Date('2026-06-15T10:00:00Z'));
    assert.equal(emptyInsights.summary.activeCreativeMrr, 0);
    assert.equal(emptyInsights.summary.activeCreativeSubscribers, 0);
    assert.equal(emptyInsights.monthlyTrend.length, 6);

    db.subscriptions = [
      {
        id: 'sub-due-soon',
        subscriptionCode: 'AKY-SUB-101',
        clientId: 'client-1',
        customerName: 'Ananya Sharma',
        companyName: 'CraftStudio',
        customerEmail: 'ananya@craftstudio.example',
        customerPhone: '',
        serviceId: 'srv-creative-thumbnails',
        serviceName: 'Social Media Thumbnail Design',
        serviceCategory: 'Business Creative & Documentation Services',
        currency: 'INR',
        monthlyAmount: 8000,
        gstEnabled: true,
        gstRate: 18,
        status: 'ACTIVE',
        billingCycleDay: 17,
        startDate: '2026-04-17',
        nextBillingDate: '2026-06-17', // 2 days after refDate 2026-06-15
        lastBilledAt: '',
        lastInvoiceId: '',
        lastInvoiceNumber: '',
        renewalCount: 2,
        notes: '',
        createdAt: '2026-04-17T08:00:00.000Z',
        updatedAt: '2026-04-17T08:00:00.000Z',
      },
      {
        id: 'sub-paused',
        subscriptionCode: 'AKY-SUB-102',
        clientId: 'client-2',
        customerName: 'Rohan Mehta',
        companyName: 'Mehta Exports',
        customerEmail: 'rohan@mehta.example',
        customerPhone: '',
        serviceId: 'srv-creative-excel',
        serviceName: 'Excel Reports',
        serviceCategory: 'Business Creative & Documentation Services',
        currency: 'INR',
        monthlyAmount: 6000,
        gstEnabled: true,
        gstRate: 18,
        status: 'PAUSED',
        billingCycleDay: 16,
        startDate: '2026-05-16',
        nextBillingDate: '2026-06-16', // Paused: must NOT receive reminder
        lastBilledAt: '',
        lastInvoiceId: '',
        lastInvoiceNumber: '',
        renewalCount: 1,
        notes: '',
        createdAt: '2026-05-16T08:00:00.000Z',
        updatedAt: '2026-06-01T08:00:00.000Z',
      },
      {
        id: 'sub-far-away',
        subscriptionCode: 'AKY-SUB-103',
        clientId: 'client-3',
        customerName: 'Vikram Singh',
        companyName: 'Singh Motors',
        customerEmail: 'vikram@singhmotors.example',
        customerPhone: '',
        serviceId: 'srv-creative-ppt',
        serviceName: 'PowerPoint Presentation',
        serviceCategory: 'Business Creative & Documentation Services',
        currency: 'INR',
        monthlyAmount: 10000,
        gstEnabled: true,
        gstRate: 18,
        status: 'ACTIVE',
        billingCycleDay: 28,
        startDate: '2026-05-28',
        nextBillingDate: '2026-06-28', // 13 days away: outside 3-day reminder lead window
        lastBilledAt: '',
        lastInvoiceId: '',
        lastInvoiceNumber: '',
        renewalCount: 1,
        notes: '',
        createdAt: '2026-05-28T08:00:00.000Z',
        updatedAt: '2026-05-28T08:00:00.000Z',
      },
    ];

    const refDate = new Date('2026-06-15T10:00:00+05:30');
    const firstSweep = await runSubscriptionRenewalReminderSweepOnDb(db, {
      leadDays: 3,
      source: 'cron',
      refDate,
    });
    assert.equal(firstSweep.checkedActiveCount, 2);
    assert.equal(firstSweep.dueCount, 1);
    assert.equal(firstSweep.loggedUnconfiguredCount + firstSweep.sentCount, 1);
    assert.equal(firstSweep.results[0].subscriptionCode, 'AKY-SUB-101');
    assert.equal(firstSweep.results[0].customerEmail, 'ananya@craftstudio.example');
    assert.equal(db.subscriptions[0].lastReminderForBillingDate, '2026-06-17');

    // Second sweep on the same cycle must skip without sending duplicate reminders
    const secondSweep = await runSubscriptionRenewalReminderSweepOnDb(db, {
      leadDays: 3,
      source: 'cron',
      refDate,
    });
    assert.equal(secondSweep.dueCount, 1);
    assert.equal(secondSweep.skippedAlreadyRemindedCount, 1);
    assert.equal(secondSweep.results.length, 0);

    // Verify Creative MRR Insights accurately totals the 2 active creative subs (8000 + 10000 = 18000)
    const insights = computeRecurringRevenueInsights(db, 6, refDate);
    assert.equal(insights.summary.activeCreativeSubscribers, 2);
    assert.equal(insights.summary.pausedCreativeSubscribers, 1);
    assert.equal(insights.summary.activeCreativeMrr, 18000);
    assert.equal(insights.summary.activeCreativeMrrWithGst, 21240);
    assert.equal(insights.summary.creativeSharePercent, 100);
    assert.equal(insights.monthlyTrend[insights.monthlyTrend.length - 1].creativeMrr, 18000);
  });

  it('renders route-accurate SSR SEO HTML (og:title === title, unique <h1>, JSON-LD, noindex) and dynamic XML sitemap', () => {
    const db = readDb();
    const baseHtml = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf8');

    for (const route of ['/', '/ventures/marketing', '/pricing', '/services/bulk-sms', '/services/logo-design']) {
      const rendered = renderSeoHtml(baseHtml, route, db);
      const titleMatch = rendered.match(/<title>([\s\S]*?)<\/title>/i);
      const ogTitleMatch = rendered.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i);
      assert.ok(titleMatch?.[1], `Missing <title> for ${route}`);
      assert.ok(ogTitleMatch?.[1], `Missing og:title for ${route}`);
      assert.equal(ogTitleMatch![1], titleMatch![1], `og:title must match <title> on ${route}`);

      const h1Matches = rendered.match(/<h1>[\s\S]*?<\/h1>/gi) || [];
      assert.equal(h1Matches.length, 1, `Expected unique <h1> for ${route}`);

      const jsonLdMatch = rendered.match(
        /<script\s+id="akyin-schema-jsonld"\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i
      );
      assert.ok(jsonLdMatch?.[1], `Missing JSON-LD script for ${route}`);
      assert.doesNotThrow(() => JSON.parse(jsonLdMatch![1]));
    }

    const bulkSmsHtml = renderSeoHtml(baseHtml, '/services/bulk-sms', db);
    assert.ok(bulkSmsHtml.includes('10,000 SMS credits'));
    assert.ok(bulkSmsHtml.includes('Messaging rates are subject to provider charges'));

    const adminHtml = renderSeoHtml(baseHtml, '/admin', db);
    assert.ok(/<meta\s+name="robots"\s+content="noindex,\s*nofollow"/i.test(adminHtml));

    const quoteHtml = renderSeoHtml(baseHtml, '/quote', db);
    assert.ok(/<meta\s+name="robots"\s+content="noindex,\s*nofollow"/i.test(quoteHtml));

    const sitemapXml = buildDynamicSitemapXml(db);
    assert.ok(sitemapXml.includes('<loc>https://akyin.com/</loc>'));
    assert.ok(sitemapXml.includes('<loc>https://akyin.com/services/logo-design</loc>'));
    assert.ok(sitemapXml.includes('<loc>https://akyin.com/services/bulk-sms</loc>'));
    assert.ok(sitemapXml.includes('<loc>https://akyin.com/services/whatsapp-business-setup</loc>'));
    assert.ok(
      sitemapXml.includes('<loc>https://akyin.com/services/commercial-dealership-sales-training</loc>')
    );
    assert.equal(sitemapXml.includes('/admin</loc>'), false);
    assert.equal(sitemapXml.includes('/quote</loc>'), false);
  });
});
