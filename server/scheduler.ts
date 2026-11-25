import { calculateQuotationTotals, getIstDateParts } from './finance';
import { dispatchNotification, getSmtpConfig } from './notifications';
import { appendAuditLog, withDbMutation } from './storage';
import { SuiteDatabase, SubscriptionRecord } from './types';

export const DEFAULT_RENEWAL_REMINDER_LEAD_DAYS = 3;
export const RENEWAL_SCHEDULER_INTERVAL_MS = 6 * 60 * 60 * 1000; // Every 6 hours

export interface RenewalReminderCandidate {
  subscriptionId: string;
  subscriptionCode: string;
  customerName: string;
  companyName: string;
  customerEmail: string;
  serviceName: string;
  serviceCategory: string;
  nextBillingDate: string;
  daysUntilRenewal: number;
  currency: 'INR' | 'AED' | 'USD';
  monthlyAmount: number;
  gstAmount: number;
  totalAmountWithGst: number;
  alreadyRemindedForCycle: boolean;
  lastReminderSentAt: string;
}

export interface RenewalReminderSweepResult {
  runAt: string;
  source: 'cron' | 'manual';
  leadDays: number;
  checkedActiveCount: number;
  dueCount: number;
  sentCount: number;
  loggedUnconfiguredCount: number;
  skippedAlreadyRemindedCount: number;
  skippedDisabledCount: number;
  failedCount: number;
  smtpConfigured: boolean;
  results: Array<{
    subscriptionCode: string;
    customerEmail: string;
    serviceName: string;
    nextBillingDate: string;
    deliveryStatus: string;
    errorMessage?: string;
  }>;
}

let schedulerInterval: ReturnType<typeof setInterval> | null = null;
let initialSweepTimeout: ReturnType<typeof setTimeout> | null = null;
let lastRunAt = '';
let nextScheduledRunAt = '';
let lastResult: RenewalReminderSweepResult | null = null;

function parseIsoDateUtcMs(isoDate: string): number {
  const parts = String(isoDate || '').split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) {
    return NaN;
  }
  return Date.UTC(parts[0], parts[1] - 1, parts[2]);
}

function getDaysUntilRenewalIst(nextBillingDate: string, refDate: Date = new Date()): number | null {
  const todayIso = getIstDateParts(refDate).isoDate;
  const todayMs = parseIsoDateUtcMs(todayIso);
  const dueMs = parseIsoDateUtcMs(nextBillingDate);
  if (!Number.isFinite(todayMs) || !Number.isFinite(dueMs)) return null;
  return Math.round((dueMs - todayMs) / 86_400_000);
}

function computeRenewalTotals(sub: SubscriptionRecord) {
  return calculateQuotationTotals(
    [
      {
        id: 'reminder-line',
        serviceId: sub.serviceId,
        title: `${sub.serviceName} — Monthly Subscription Renewal`,
        qty: 1,
        unitPrice: sub.monthlyAmount,
        billingType: 'monthly',
      },
    ],
    0,
    sub.gstEnabled,
    sub.gstRate
  );
}

export function findUpcomingRenewals(
  db: SuiteDatabase,
  leadDays = DEFAULT_RENEWAL_REMINDER_LEAD_DAYS,
  refDate: Date = new Date()
): RenewalReminderCandidate[] {
  const maxDays = Math.min(30, Math.max(0, Math.floor(leadDays)));
  const candidates: RenewalReminderCandidate[] = [];

  for (const sub of db.subscriptions || []) {
    if (sub.status !== 'ACTIVE') continue;
    if (!sub.customerEmail || !sub.customerEmail.includes('@')) continue;

    const daysUntil = getDaysUntilRenewalIst(sub.nextBillingDate, refDate);
    if (daysUntil === null || daysUntil < 0 || daysUntil > maxDays) continue;

    const totals = computeRenewalTotals(sub);
    candidates.push({
      subscriptionId: sub.id,
      subscriptionCode: sub.subscriptionCode,
      customerName: sub.customerName,
      companyName: sub.companyName,
      customerEmail: sub.customerEmail,
      serviceName: sub.serviceName,
      serviceCategory: sub.serviceCategory,
      nextBillingDate: sub.nextBillingDate,
      daysUntilRenewal: daysUntil,
      currency: sub.currency,
      monthlyAmount: totals.subtotal,
      gstAmount: totals.gstAmount,
      totalAmountWithGst: totals.grandTotal,
      alreadyRemindedForCycle: sub.lastReminderForBillingDate === sub.nextBillingDate,
      lastReminderSentAt: sub.lastReminderSentAt || '',
    });
  }

  return candidates.sort((a, b) => a.daysUntilRenewal - b.daysUntilRenewal);
}

export async function runSubscriptionRenewalReminderSweepOnDb(
  db: SuiteDatabase,
  options: {
    leadDays?: number;
    source?: 'cron' | 'manual';
    forceResend?: boolean;
    actorName?: string;
    refDate?: Date;
  } = {}
): Promise<RenewalReminderSweepResult> {
  const leadDays = Math.min(30, Math.max(0, Math.floor(options.leadDays ?? DEFAULT_RENEWAL_REMINDER_LEAD_DAYS)));
  const source = options.source || 'cron';
  const refDate = options.refDate || new Date();
  const nowIso = refDate.toISOString();

  const activeSubs = (db.subscriptions || []).filter((s) => s.status === 'ACTIVE');
  const candidates = findUpcomingRenewals(db, leadDays, refDate);

  let sentCount = 0;
  let loggedUnconfiguredCount = 0;
  let skippedAlreadyRemindedCount = 0;
  let skippedDisabledCount = 0;
  let failedCount = 0;

  const results: RenewalReminderSweepResult['results'] = [];

  for (const candidate of candidates) {
    const sub = (db.subscriptions || []).find((s) => s.id === candidate.subscriptionId);
    if (!sub) continue;

    if (!options.forceResend && sub.lastReminderForBillingDate === sub.nextBillingDate) {
      skippedAlreadyRemindedCount += 1;
      continue;
    }

    const dueLabel =
      candidate.daysUntilRenewal === 0
        ? 'today'
        : candidate.daysUntilRenewal === 1
          ? 'tomorrow (1 day)'
          : `in ${candidate.daysUntilRenewal} days`;

    const taxSummary = sub.gstEnabled
      ? `${sub.currency} ${candidate.monthlyAmount.toLocaleString('en-IN')} + ${sub.gstRate}% GST (${sub.currency} ${candidate.gstAmount.toLocaleString('en-IN')}) = ${sub.currency} ${candidate.totalAmountWithGst.toLocaleString('en-IN')}`
      : `${sub.currency} ${candidate.totalAmountWithGst.toLocaleString('en-IN')} (No GST)`;

    const logEntry = await dispatchNotification(db, {
      event: 'subscription_renewal_reminder',
      recipient: sub.customerEmail,
      subject: `Subscription Renewal Reminder: ${sub.serviceName} (${sub.subscriptionCode})`,
      body: [
        `Hello ${sub.customerName},`,
        '',
        `This is an automated Subscription Renewal Reminder for your active monthly service with AKYIN Ventures.`,
        '',
        `Subscription Reference: ${sub.subscriptionCode}`,
        `Service Name: ${sub.serviceName}`,
        `Category: ${sub.serviceCategory}`,
        `Upcoming Renewal Date: ${sub.nextBillingDate} (${dueLabel})`,
        `Renewal Amount: ${taxSummary}`,
        '',
        'If you wish to adjust your deliverables, pause billing, or settle this cycle early, please reply to this email or contact connect@akyin.com.',
        '',
        'Warm regards,',
        'AKYIN Ventures Billing Desk',
      ].join('\n'),
    });

    if (logEntry.deliveryStatus === 'sent') {
      sentCount += 1;
      sub.lastReminderSentAt = nowIso;
      sub.lastReminderForBillingDate = sub.nextBillingDate;
      sub.updatedAt = nowIso;
    } else if (logEntry.deliveryStatus === 'logged_unconfigured') {
      loggedUnconfiguredCount += 1;
      sub.lastReminderSentAt = nowIso;
      sub.lastReminderForBillingDate = sub.nextBillingDate;
      sub.updatedAt = nowIso;
    } else if (logEntry.deliveryStatus === 'skipped_disabled') {
      skippedDisabledCount += 1;
    } else {
      failedCount += 1;
    }

    results.push({
      subscriptionCode: sub.subscriptionCode,
      customerEmail: sub.customerEmail,
      serviceName: sub.serviceName,
      nextBillingDate: sub.nextBillingDate,
      deliveryStatus: logEntry.deliveryStatus,
      errorMessage: logEntry.errorMessage,
    });
  }

  if (results.length > 0 || source === 'manual') {
    appendAuditLog(db, {
      actorId: source === 'cron' ? 'SYSTEM_CRON' : 'ADMIN_MANUAL',
      actorName: options.actorName || (source === 'cron' ? 'Subscription Reminder Cron' : 'Admin'),
      actorRole: source === 'cron' ? 'System' : 'Super Admin',
      action: 'SUBSCRIPTION_REMINDER_SWEEP',
      targetId: 'SUBSCRIPTIONS',
      summary: `${source === 'cron' ? 'Scheduled' : 'Manual'} renewal reminder check (${leadDays}d window): ${candidates.length} due, ${sentCount} sent via SMTP, ${loggedUnconfiguredCount} queued (SMTP unconfigured), ${skippedAlreadyRemindedCount} already reminded.`,
    });
  }

  return {
    runAt: nowIso,
    source,
    leadDays,
    checkedActiveCount: activeSubs.length,
    dueCount: candidates.length,
    sentCount,
    loggedUnconfiguredCount,
    skippedAlreadyRemindedCount,
    skippedDisabledCount,
    failedCount,
    smtpConfigured: Boolean(getSmtpConfig()),
    results,
  };
}

export async function runSubscriptionRenewalReminderSweep(
  options: {
    leadDays?: number;
    source?: 'cron' | 'manual';
    forceResend?: boolean;
    actorName?: string;
    refDate?: Date;
  } = {}
): Promise<RenewalReminderSweepResult> {
  const result = await withDbMutation((db) =>
    runSubscriptionRenewalReminderSweepOnDb(db, options)
  );
  lastRunAt = result.runAt;
  lastResult = result;
  return result;
}

export function getSchedulerStatus() {
  return {
    active: Boolean(schedulerInterval),
    intervalHours: RENEWAL_SCHEDULER_INTERVAL_MS / 3_600_000,
    defaultLeadDays: DEFAULT_RENEWAL_REMINDER_LEAD_DAYS,
    lastRunAt,
    nextScheduledRunAt,
    lastResult,
  };
}

export function startSubscriptionReminderScheduler() {
  if (schedulerInterval) return;

  const updateNextRunTimestamp = () => {
    nextScheduledRunAt = new Date(Date.now() + RENEWAL_SCHEDULER_INTERVAL_MS).toISOString();
  };

  updateNextRunTimestamp();

  // Run an initial sweep shortly after server boot
  initialSweepTimeout = setTimeout(() => {
    void runSubscriptionRenewalReminderSweep({ source: 'cron' }).catch((err) => {
      console.error('[renewal-scheduler] Initial sweep error:', err);
    });
  }, 12_000);
  initialSweepTimeout.unref();

  schedulerInterval = setInterval(() => {
    updateNextRunTimestamp();
    void runSubscriptionRenewalReminderSweep({ source: 'cron' }).catch((err) => {
      console.error('[renewal-scheduler] Periodic sweep error:', err);
    });
  }, RENEWAL_SCHEDULER_INTERVAL_MS);
  schedulerInterval.unref();
}
