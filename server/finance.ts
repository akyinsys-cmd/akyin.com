import {
  ClientRecord,
  CrmLead,
  InvoiceRecord,
  LeadSource,
  PaymentRecord,
  QuotationLineItem,
  QuotationRecord,
  SuiteAppointmentRecord,
  SuiteDatabase,
} from './types';

export function round2(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export interface CalculatedQuotationTotals {
  items: QuotationLineItem[];
  subtotal: number;
  oneTimeSubtotal: number;
  monthlySubtotal: number;
  usageSubtotal: number;
  discountAmount: number;
  taxableAmount: number;
  gstAmount: number;
  grandTotal: number;
  payableNow: number;
  futureRecurringAmount: number;
}

function inferBillingType(item: { title: string; description?: string }): 'one-time' | 'monthly' | 'usage' {
  const text = `${item.title} ${item.description || ''}`.toLowerCase();
  if (text.includes('monthly') || text.includes('/month') || text.includes('recurring') || text.includes('retainer')) {
    return 'monthly';
  }
  if (
    text.includes('usage') ||
    text.includes('per message') ||
    text.includes('additional credit') ||
    text.includes('/sms')
  ) {
    return 'usage';
  }
  return 'one-time';
}

export function calculateQuotationTotals(
  rawItems: Array<{
    id: string;
    serviceId?: string;
    title: string;
    description?: string;
    qty: number;
    unitPrice: number;
    billingType?: 'one-time' | 'monthly' | 'usage';
  }>,
  configuredDiscount: number,
  gstEnabled: boolean,
  gstRate: number
): CalculatedQuotationTotals {
  const items: QuotationLineItem[] = rawItems.map((item) => {
    const qty = Math.max(0, Number.isFinite(item.qty) ? item.qty : 0);
    const unitPrice = Math.max(0, Number.isFinite(item.unitPrice) ? item.unitPrice : 0);
    const lineTotal = round2(qty * unitPrice);
    const billingType = item.billingType || inferBillingType(item);
    return {
      id: item.id,
      serviceId: item.serviceId,
      title: item.title,
      description: item.description || '',
      qty,
      unitPrice: round2(unitPrice),
      lineTotal,
      billingType,
    };
  });

  const subtotal = round2(items.reduce((acc, item) => acc + item.lineTotal, 0));
  const oneTimeSubtotal = round2(
    items.filter((it) => it.billingType === 'one-time').reduce((acc, it) => acc + it.lineTotal, 0)
  );
  const monthlySubtotal = round2(
    items.filter((it) => it.billingType === 'monthly').reduce((acc, it) => acc + it.lineTotal, 0)
  );
  const usageSubtotal = round2(
    items.filter((it) => it.billingType === 'usage').reduce((acc, it) => acc + it.lineTotal, 0)
  );

  const discountAmount = round2(clampNumber(configuredDiscount, 0, subtotal));
  const taxableAmount = round2(Math.max(0, subtotal - discountAmount));
  const effectiveGstRate = gstEnabled ? clampNumber(gstRate, 0, 100) : 0;
  const gstAmount = gstEnabled ? round2(taxableAmount * (effectiveGstRate / 100)) : 0;
  const grandTotal = round2(taxableAmount + gstAmount);
  const futureRecurringAmount = round2(
    monthlySubtotal + (gstEnabled ? monthlySubtotal * (effectiveGstRate / 100) : 0)
  );
  const payableNow = grandTotal;

  return {
    items,
    subtotal,
    oneTimeSubtotal,
    monthlySubtotal,
    usageSubtotal,
    discountAmount,
    taxableAmount,
    gstAmount,
    grandTotal,
    payableNow,
    futureRecurringAmount,
  };
}

export function calculateBulkSmsBreakdown(params: {
  packagePrice?: number;
  includedUnits?: number;
  totalSmsRequested?: number;
  additionalSmsRequested?: number;
  additionalUnitRate?: number;
}) {
  const packagePrice = round2(Math.max(0, params.packagePrice ?? 3000));
  const includedUnits = Math.max(0, Math.floor(params.includedUnits ?? 10000));
  const additionalUnitRate = round2(Math.max(0, params.additionalUnitRate ?? 0.3));
  const extraUnits =
    typeof params.additionalSmsRequested === 'number'
      ? Math.max(0, Math.floor(params.additionalSmsRequested))
      : Math.max(0, Math.floor((params.totalSmsRequested ?? includedUnits) - includedUnits));
  const additionalCost = round2(extraUnits * additionalUnitRate);
  const totalBeforeTax = round2(packagePrice + additionalCost);
  const totalCredits = includedUnits + extraUnits;
  return {
    packagePrice,
    includedUnits,
    extraUnits,
    additionalUnitRate,
    additionalCost,
    totalCredits,
    totalBeforeTax,
  };
}

export function calculateWhatsAppBreakdown(params: {
  setupFee?: number;
  messageCount?: number;
  unitRate?: number;
}) {
  const oneTimeSetupFee = round2(Math.max(0, params.setupFee ?? 4999));
  const messageCount = Math.max(0, Math.floor(params.messageCount ?? 0));
  const perMessageRate = round2(Math.max(0, params.unitRate ?? 1.5));
  const messageUsageTotal = round2(messageCount * perMessageRate);
  const combinedSubtotalBeforeTax = round2(oneTimeSetupFee + messageUsageTotal);
  return {
    oneTimeSetupFee,
    messageCount,
    perMessageRate,
    messageUsageTotal,
    combinedSubtotalBeforeTax,
  };
}

export function getIstDateParts(date: Date = new Date()): {
  year: number;
  month: number;
  day: number;
  isoDate: string;
} {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const year = Number(parts.find((p) => p.type === 'year')?.value || date.getUTCFullYear());
  const month = Number(parts.find((p) => p.type === 'month')?.value || date.getUTCMonth() + 1);
  const day = Number(parts.find((p) => p.type === 'day')?.value || date.getUTCDate());
  const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return { year, month, day, isoDate };
}

export function getIndiaFinancialYearBounds(refDate: Date = new Date()): {
  startDate: string;
  endDate: string;
  label: string;
} {
  const { year, month } = getIstDateParts(refDate);
  const startYear = month >= 4 ? year : year - 1;
  const endYear = startYear + 1;
  return {
    startDate: `${startYear}-04-01`,
    endDate: `${endYear}-03-31`,
    label: `FY ${startYear}-${String(endYear).slice(-2)}`,
  };
}

export type RevenuePeriodPreset =
  | 'today'
  | 'this_week'
  | 'this_month'
  | 'previous_month'
  | 'financial_year'
  | 'all_time'
  | 'custom';

export interface RevenueFilterOptions {
  preset?: RevenuePeriodPreset;
  startDate?: string;
  endDate?: string;
  clientId?: string;
  serviceCategory?: string;
  leadSource?: string;
  paymentMethod?: string;
  includeTestMode?: boolean;
}

export function resolveDateRange(
  preset: RevenuePeriodPreset = 'this_month',
  customStart?: string,
  customEnd?: string,
  now: Date = new Date()
): { startDate: string; endDate: string } {
  const { year, month, day, isoDate } = getIstDateParts(now);

  if (preset === 'today') {
    return { startDate: isoDate, endDate: isoDate };
  }
  if (preset === 'this_week') {
    const dt = new Date(Date.UTC(year, month - 1, day));
    const weekday = (dt.getUTCDay() + 6) % 7; // Monday = 0
    dt.setUTCDate(dt.getUTCDate() - weekday);
    const startDate = dt.toISOString().slice(0, 10);
    return { startDate, endDate: isoDate };
  }
  if (preset === 'this_month') {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    return { startDate, endDate: isoDate };
  }
  if (preset === 'previous_month') {
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const lastDay = new Date(Date.UTC(prevYear, prevMonth, 0)).getUTCDate();
    return {
      startDate: `${prevYear}-${String(prevMonth).padStart(2, '0')}-01`,
      endDate: `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`,
    };
  }
  if (preset === 'financial_year') {
    const bounds = getIndiaFinancialYearBounds(now);
    return { startDate: bounds.startDate, endDate: bounds.endDate };
  }
  if (preset === 'custom') {
    return {
      startDate: customStart || '1970-01-01',
      endDate: customEnd || '2099-12-31',
    };
  }
  return { startDate: '1970-01-01', endDate: '2099-12-31' };
}

function inIsoRange(isoTimestamp: string, startDate: string, endDate: string): boolean {
  if (!isoTimestamp) return false;
  const datePart = isoTimestamp.slice(0, 10);
  return datePart >= startDate && datePart <= endDate;
}

export function isVerifiedLivePayment(p: PaymentRecord): boolean {
  if (p.mode !== 'live') return false;
  if (!p.verified) return false;
  return p.status === 'captured' || p.status === 'manual_recorded' || p.status === 'refunded';
}

export interface DashboardKpis {
  totalClients: number;
  reportedClientsHandled: number;
  newEnquiries: number;
  qualifiedLeads: number;
  pendingFollowUps: number;
  quotationsSent: number;
  quotationsAccepted: number;
  paymentsPending: number;
  paymentsReceived: number;
  monthlyRevenueCollected: number;
  outstandingReceivables: number;
  appointmentsBooked: number;
  conversionRate: number;
}

export function computeDashboardKpis(db: SuiteDatabase, now: Date = new Date()): DashboardKpis {
  const { startDate: monthStart, endDate: todayIso } = resolveDateRange(
    'this_month',
    undefined,
    undefined,
    now
  );

  const leads = db.leads || [];
  const clients = db.clients || [];
  const quotations = db.quotations || [];
  const invoices = db.invoices || [];
  const payments = db.payments || [];
  const appointments = db.appointments || [];

  const totalClients = clients.length;
  const newEnquiries = leads.filter((l) => l.stage === 'NEW').length;
  const qualifiedLeads = leads.filter(
    (l) =>
      l.stage === 'QUALIFIED' ||
      l.stage === 'PROPOSAL SENT' ||
      l.stage === 'NEGOTIATION'
  ).length;
  const pendingFollowUps = leads.filter(
    (l) =>
      l.stage !== 'WON' &&
      l.stage !== 'LOST' &&
      (l.secondaryTag === 'Follow-up required' ||
        (Boolean(l.followUpAt) && l.followUpAt.slice(0, 10) <= todayIso))
  ).length;

  const quotationsSent = quotations.filter((q) => q.status === 'SENT').length;
  const quotationsAccepted = quotations.filter((q) => q.status === 'ACCEPTED').length;

  const paymentsPending = invoices.filter(
    (inv) => inv.status === 'UNPAID' || inv.status === 'PARTIAL'
  ).length;

  const liveVerifiedPayments = payments.filter((p) => isVerifiedLivePayment(p));
  const paymentsReceived = liveVerifiedPayments.length;

  const monthlyRevenueCollected = round2(
    liveVerifiedPayments
      .filter((p) => inIsoRange(p.capturedAt || p.createdAt, monthStart, todayIso))
      .reduce((acc, p) => acc + Math.max(0, p.amount - p.refundedAmount), 0)
  );

  const outstandingReceivables = round2(
    invoices
      .filter((inv) => inv.status === 'UNPAID' || inv.status === 'PARTIAL')
      .reduce((acc, inv) => acc + Math.max(0, inv.totalAmount - inv.paidAmount), 0)
  );

  const appointmentsBooked = appointments.filter(
    (a) => a.bookingStatus !== 'Cancelled'
  ).length;

  const wonLeads = leads.filter((l) => l.stage === 'WON').length;
  const conversionRate = leads.length > 0 ? round2((wonLeads / leads.length) * 100) : 0;

  return {
    totalClients,
    reportedClientsHandled: db.websiteSettings?.reportedClientsCount || 58,
    newEnquiries,
    qualifiedLeads,
    pendingFollowUps,
    quotationsSent,
    quotationsAccepted,
    paymentsPending,
    paymentsReceived,
    monthlyRevenueCollected,
    outstandingReceivables,
    appointmentsBooked,
    conversionRate,
  };
}

export interface RevenueReportSummary {
  period: { preset: RevenuePeriodPreset; startDate: string; endDate: string };
  metrics: {
    quotedValue: number;
    acceptedQuotationValue: number;
    invoicedAmount: number;
    paymentAuthorised: number;
    grossCollections: number;
    refunds: number;
    netCollections: number;
    outstandingReceivables: number;
    gstCollected: number;
    gatewayFees: number;
    netRevenueAfterFeesAndRefunds: number;
    testModeTotal: number;
    excludedFailedOrUnverifiedCount: number;
  };
  byMonth: Array<{ month: string; gross: number; refunds: number; net: number; gst: number }>;
  byService: Array<{ service: string; invoiced: number; collected: number; count: number }>;
  byLeadSource: Array<{ source: string; leads: number; won: number; collected: number }>;
  byPaymentMethod: Array<{ method: string; gross: number; count: number }>;
  byClient: Array<{
    clientName: string;
    invoiced: number;
    collected: number;
    outstanding: number;
  }>;
  matchingPayments: PaymentRecord[];
}

export function computeRevenueReport(
  db: SuiteDatabase,
  filter: RevenueFilterOptions = {},
  now: Date = new Date()
): RevenueReportSummary {
  const preset = filter.preset || 'this_month';
  const { startDate, endDate } = resolveDateRange(preset, filter.startDate, filter.endDate, now);

  const filterQuote = (q: QuotationRecord) => {
    if (!inIsoRange(q.createdAt, startDate, endDate)) return false;
    if (filter.clientId && q.clientId !== filter.clientId) return false;
    return true;
  };

  const filterInvoice = (inv: InvoiceRecord) => {
    if (!inIsoRange(inv.createdAt, startDate, endDate)) return false;
    if (filter.clientId && inv.clientId !== filter.clientId) return false;
    if (filter.serviceCategory && inv.serviceCategory !== filter.serviceCategory) return false;
    if (filter.leadSource && inv.leadSource !== filter.leadSource) return false;
    return true;
  };

  const filterPaymentBase = (p: PaymentRecord) => {
    const ts = p.capturedAt || p.createdAt;
    if (!inIsoRange(ts, startDate, endDate)) return false;
    if (filter.clientId && p.clientId !== filter.clientId) return false;
    if (filter.serviceCategory && p.serviceCategory !== filter.serviceCategory) return false;
    if (filter.leadSource && p.leadSource !== filter.leadSource) return false;
    if (filter.paymentMethod && p.method !== filter.paymentMethod) return false;
    return true;
  };

  const quotes = (db.quotations || []).filter(filterQuote);
  const invoices = (db.invoices || []).filter(filterInvoice);
  const allPeriodPayments = (db.payments || []).filter(filterPaymentBase);

  const quotedValue = round2(
    quotes
      .filter((q) => q.status !== 'DRAFT')
      .reduce((acc, q) => acc + q.grandTotal, 0)
  );
  const acceptedQuotationValue = round2(
    quotes
      .filter((q) => q.status === 'ACCEPTED')
      .reduce((acc, q) => acc + q.grandTotal, 0)
  );
  const invoicedAmount = round2(
    invoices
      .filter((inv) => inv.status !== 'CANCELLED')
      .reduce((acc, inv) => acc + inv.totalAmount, 0)
  );
  const outstandingReceivables = round2(
    invoices
      .filter((inv) => inv.status === 'UNPAID' || inv.status === 'PARTIAL')
      .reduce((acc, inv) => acc + Math.max(0, inv.totalAmount - inv.paidAmount), 0)
  );

  // Strictly separate live verified captured collections from test/failed/abandoned/unverified
  const liveVerifiedPayments = allPeriodPayments.filter((p) => isVerifiedLivePayment(p));
  const authorizedLivePayments = allPeriodPayments.filter(
    (p) => p.mode === 'live' && p.status === 'authorized'
  );
  const testModePayments = allPeriodPayments.filter((p) => p.mode === 'test');
  const excludedFailedOrUnverified = allPeriodPayments.filter(
    (p) =>
      p.mode === 'test' ||
      !p.verified ||
      p.status === 'failed' ||
      p.status === 'abandoned' ||
      p.status === 'created'
  );

  const paymentAuthorised = round2(
    authorizedLivePayments.reduce((acc, p) => acc + p.amount, 0)
  );
  const grossCollections = round2(
    liveVerifiedPayments.reduce((acc, p) => acc + p.amount, 0)
  );
  const refunds = round2(
    liveVerifiedPayments.reduce((acc, p) => acc + p.refundedAmount, 0)
  );
  const netCollections = round2(Math.max(0, grossCollections - refunds));
  const gstCollected = round2(
    liveVerifiedPayments.reduce((acc, p) => {
      if (p.amount <= 0) return acc;
      const ratio = Math.max(0, p.amount - p.refundedAmount) / p.amount;
      return acc + p.gstPortion * ratio;
    }, 0)
  );
  const gatewayFees = round2(
    liveVerifiedPayments.reduce((acc, p) => acc + p.gatewayFeeAmount, 0)
  );
  const netRevenueAfterFeesAndRefunds = round2(
    Math.max(0, netCollections - gatewayFees)
  );
  const testModeTotal = round2(
    testModePayments
      .filter((p) => p.status === 'captured' || p.status === 'manual_recorded')
      .reduce((acc, p) => acc + p.amount, 0)
  );

  // Aggregations
  const monthMap = new Map<
    string,
    { gross: number; refunds: number; net: number; gst: number }
  >();
  for (const p of liveVerifiedPayments) {
    const month = (p.capturedAt || p.createdAt).slice(0, 7);
    const cur = monthMap.get(month) || { gross: 0, refunds: 0, net: 0, gst: 0 };
    cur.gross = round2(cur.gross + p.amount);
    cur.refunds = round2(cur.refunds + p.refundedAmount);
    cur.net = round2(cur.gross - cur.refunds);
    const ratio = p.amount > 0 ? Math.max(0, p.amount - p.refundedAmount) / p.amount : 0;
    cur.gst = round2(cur.gst + p.gstPortion * ratio);
    monthMap.set(month, cur);
  }
  const byMonth = Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, v]) => ({ month, ...v }));

  const serviceMap = new Map<string, { invoiced: number; collected: number; count: number }>();
  for (const inv of invoices.filter((i) => i.status !== 'CANCELLED')) {
    const key = inv.serviceCategory || 'Uncategorized';
    const cur = serviceMap.get(key) || { invoiced: 0, collected: 0, count: 0 };
    cur.invoiced = round2(cur.invoiced + inv.totalAmount);
    cur.count += 1;
    serviceMap.set(key, cur);
  }
  for (const p of liveVerifiedPayments) {
    const key = p.serviceCategory || 'Uncategorized';
    const cur = serviceMap.get(key) || { invoiced: 0, collected: 0, count: 0 };
    cur.collected = round2(cur.collected + Math.max(0, p.amount - p.refundedAmount));
    serviceMap.set(key, cur);
  }
  const byService = Array.from(serviceMap.entries())
    .map(([service, v]) => ({ service, ...v }))
    .sort((a, b) => b.collected - a.collected || b.invoiced - a.invoiced);

  const sourceMap = new Map<string, { leads: number; won: number; collected: number }>();
  for (const lead of (db.leads || []).filter((l) => inIsoRange(l.receivedAt, startDate, endDate))) {
    const src = lead.campaignSource || 'Website';
    const cur = sourceMap.get(src) || { leads: 0, won: 0, collected: 0 };
    cur.leads += 1;
    if (lead.stage === 'WON') cur.won += 1;
    sourceMap.set(src, cur);
  }
  for (const p of liveVerifiedPayments) {
    const src: LeadSource | string = p.leadSource || 'Website';
    const cur = sourceMap.get(src) || { leads: 0, won: 0, collected: 0 };
    cur.collected = round2(cur.collected + Math.max(0, p.amount - p.refundedAmount));
    sourceMap.set(src, cur);
  }
  const byLeadSource = Array.from(sourceMap.entries())
    .map(([source, v]) => ({ source, ...v }))
    .sort((a, b) => b.collected - a.collected || b.leads - a.leads);

  const methodMap = new Map<string, { gross: number; count: number }>();
  for (const p of liveVerifiedPayments) {
    const m = p.method || p.gateway;
    const cur = methodMap.get(m) || { gross: 0, count: 0 };
    cur.gross = round2(cur.gross + Math.max(0, p.amount - p.refundedAmount));
    cur.count += 1;
    methodMap.set(m, cur);
  }
  const byPaymentMethod = Array.from(methodMap.entries()).map(([method, v]) => ({
    method,
    ...v,
  }));

  const clientMap = new Map<
    string,
    { clientName: string; invoiced: number; collected: number; outstanding: number }
  >();
  for (const inv of invoices.filter((i) => i.status !== 'CANCELLED')) {
    const key = inv.clientId || inv.companyName || inv.customerName || 'Direct Client';
    const cur = clientMap.get(key) || {
      clientName: inv.companyName || inv.customerName || key,
      invoiced: 0,
      collected: 0,
      outstanding: 0,
    };
    cur.invoiced = round2(cur.invoiced + inv.totalAmount);
    if (inv.status === 'UNPAID' || inv.status === 'PARTIAL') {
      cur.outstanding = round2(cur.outstanding + Math.max(0, inv.totalAmount - inv.paidAmount));
    }
    clientMap.set(key, cur);
  }
  for (const p of liveVerifiedPayments) {
    const key = p.clientId || p.customerName || 'Direct Client';
    const cur = clientMap.get(key) || {
      clientName: p.customerName || key,
      invoiced: 0,
      collected: 0,
      outstanding: 0,
    };
    cur.collected = round2(cur.collected + Math.max(0, p.amount - p.refundedAmount));
    clientMap.set(key, cur);
  }
  const byClient = Array.from(clientMap.values()).sort(
    (a, b) => b.collected - a.collected || b.invoiced - a.invoiced
  );

  return {
    period: { preset, startDate, endDate },
    metrics: {
      quotedValue,
      acceptedQuotationValue,
      invoicedAmount,
      paymentAuthorised,
      grossCollections,
      refunds,
      netCollections,
      outstandingReceivables,
      gstCollected,
      gatewayFees,
      netRevenueAfterFeesAndRefunds,
      testModeTotal,
      excludedFailedOrUnverifiedCount: excludedFailedOrUnverified.length,
    },
    byMonth,
    byService,
    byLeadSource,
    byPaymentMethod,
    byClient,
    matchingPayments: allPeriodPayments,
  };
}

export const CREATIVE_SERVICE_CATEGORY = 'Business Creative & Documentation Services';

export interface RecurringRevenueInsightsSummary {
  monthsWindow: number;
  generatedAt: string;
  summary: {
    activeCreativeMrr: number;
    activeCreativeMrrWithGst: number;
    totalActiveMrr: number;
    activeCreativeSubscribers: number;
    pausedCreativeSubscribers: number;
    cancelledCreativeSubscribers: number;
    creativeSharePercent: number;
    averageRevenuePerCreativeSubscriber: number;
    nonInrCreativeSubscriptions: Array<{ currency: 'AED' | 'USD'; count: number; monthlyTotal: number }>;
  };
  monthlyTrend: Array<{
    month: string;
    label: string;
    creativeMrr: number;
    creativeMrrWithGst: number;
    allActiveMrr: number;
    activeCreativeCount: number;
    realizedCreativeCollections: number;
  }>;
  byCreativeService: Array<{
    serviceId: string;
    serviceName: string;
    listMonthlyPrice: number;
    activeCount: number;
    pausedCount: number;
    mrrInr: number;
  }>;
}

export function computeRecurringRevenueInsights(
  db: SuiteDatabase,
  monthsWindow = 12,
  now: Date = new Date()
): RecurringRevenueInsightsSummary {
  const safeWindow = Math.min(24, Math.max(3, Math.floor(monthsWindow || 12)));
  const { year: curYear, month: curMonth } = getIstDateParts(now);

  const subscriptions = db.subscriptions || [];
  const creativeSubs = subscriptions.filter(
    (s) => s.serviceCategory === CREATIVE_SERVICE_CATEGORY
  );

  const activeCreativeInr = creativeSubs.filter(
    (s) => s.status === 'ACTIVE' && s.currency === 'INR'
  );
  const activeAllInr = subscriptions.filter(
    (s) => s.status === 'ACTIVE' && s.currency === 'INR'
  );

  const activeCreativeMrr = round2(
    activeCreativeInr.reduce((acc, s) => acc + (Number(s.monthlyAmount) || 0), 0)
  );
  const activeCreativeMrrWithGst = round2(
    activeCreativeInr.reduce((acc, s) => {
      const mult = s.gstEnabled ? 1 + (s.gstRate || 0) / 100 : 1;
      return acc + (Number(s.monthlyAmount) || 0) * mult;
    }, 0)
  );
  const totalActiveMrr = round2(
    activeAllInr.reduce((acc, s) => acc + (Number(s.monthlyAmount) || 0), 0)
  );

  const activeCreativeSubscribers = creativeSubs.filter((s) => s.status === 'ACTIVE').length;
  const pausedCreativeSubscribers = creativeSubs.filter((s) => s.status === 'PAUSED').length;
  const cancelledCreativeSubscribers = creativeSubs.filter((s) => s.status === 'CANCELLED').length;
  const creativeSharePercent =
    totalActiveMrr > 0 ? round2((activeCreativeMrr / totalActiveMrr) * 100) : 0;
  const averageRevenuePerCreativeSubscriber =
    activeCreativeInr.length > 0 ? round2(activeCreativeMrr / activeCreativeInr.length) : 0;

  const nonInrMap = new Map<'AED' | 'USD', { count: number; monthlyTotal: number }>();
  for (const s of creativeSubs.filter((sub) => sub.status === 'ACTIVE' && sub.currency !== 'INR')) {
    const cur = s.currency as 'AED' | 'USD';
    const existing = nonInrMap.get(cur) || { count: 0, monthlyTotal: 0 };
    existing.count += 1;
    existing.monthlyTotal = round2(existing.monthlyTotal + (Number(s.monthlyAmount) || 0));
    nonInrMap.set(cur, existing);
  }
  const nonInrCreativeSubscriptions = Array.from(nonInrMap.entries()).map(([currency, v]) => ({
    currency,
    ...v,
  }));

  // Build chronological monthly window ending at current IST month
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthKey = `${curYear}-${String(curMonth).padStart(2, '0')}`;
  const realizedByMonth = new Map<string, number>();

  for (const p of db.payments || []) {
    if (!isVerifiedLivePayment(p)) continue;
    if (p.currency !== 'INR') continue;
    if (p.serviceCategory !== CREATIVE_SERVICE_CATEGORY) continue;
    const mKey = (p.capturedAt || p.createdAt || '').slice(0, 7);
    if (!mKey) continue;
    realizedByMonth.set(
      mKey,
      round2((realizedByMonth.get(mKey) || 0) + Math.max(0, p.amount - p.refundedAmount))
    );
  }

  const monthlyTrend: RecurringRevenueInsightsSummary['monthlyTrend'] = [];
  for (let offset = safeWindow - 1; offset >= 0; offset -= 1) {
    const d = new Date(Date.UTC(curYear, curMonth - 1 - offset, 1));
    const y = d.getUTCFullYear();
    const m = d.getUTCMonth() + 1;
    const mKey = `${y}-${String(m).padStart(2, '0')}`;
    const label = `${monthNames[m - 1]} ${String(y).slice(-2)}`;

    let monthCreativeMrr = 0;
    let monthCreativeMrrWithGst = 0;
    let monthAllActiveMrr = 0;
    let monthCreativeCount = 0;

    for (const s of subscriptions) {
      if (s.currency !== 'INR') continue;
      const startMonth = (s.startDate || s.createdAt || '').slice(0, 7);
      if (!startMonth || startMonth > mKey) continue;

      const updatedMonth = (s.updatedAt || '').slice(0, 7);
      const activeInMonth =
        s.status === 'ACTIVE' ||
        (mKey < currentMonthKey && updatedMonth > mKey && (s.status === 'PAUSED' || s.status === 'CANCELLED'));

      if (!activeInMonth) continue;

      const amt = Number(s.monthlyAmount) || 0;
      monthAllActiveMrr += amt;
      if (s.serviceCategory === CREATIVE_SERVICE_CATEGORY) {
        monthCreativeMrr += amt;
        monthCreativeMrrWithGst += amt * (s.gstEnabled ? 1 + (s.gstRate || 0) / 100 : 1);
        monthCreativeCount += 1;
      }
    }

    monthlyTrend.push({
      month: mKey,
      label,
      creativeMrr: round2(monthCreativeMrr),
      creativeMrrWithGst: round2(monthCreativeMrrWithGst),
      allActiveMrr: round2(monthAllActiveMrr),
      activeCreativeCount: monthCreativeCount,
      realizedCreativeCollections: round2(realizedByMonth.get(mKey) || 0),
    });
  }

  // Breakdown across creative catalog services
  const creativeCatalog = (db.services || [])
    .filter((s) => s.category === CREATIVE_SERVICE_CATEGORY)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const byServiceMap = new Map<
    string,
    {
      serviceId: string;
      serviceName: string;
      listMonthlyPrice: number;
      activeCount: number;
      pausedCount: number;
      mrrInr: number;
    }
  >();

  for (const srv of creativeCatalog) {
    byServiceMap.set(srv.id, {
      serviceId: srv.id,
      serviceName: srv.name,
      listMonthlyPrice: Number(srv.monthlyPrice ?? srv.recurringFee ?? 0) || 0,
      activeCount: 0,
      pausedCount: 0,
      mrrInr: 0,
    });
  }

  for (const sub of creativeSubs) {
    const existing = byServiceMap.get(sub.serviceId) || {
      serviceId: sub.serviceId,
      serviceName: sub.serviceName,
      listMonthlyPrice: Number(sub.monthlyAmount) || 0,
      activeCount: 0,
      pausedCount: 0,
      mrrInr: 0,
    };
    if (sub.status === 'ACTIVE') {
      existing.activeCount += 1;
      if (sub.currency === 'INR') {
        existing.mrrInr = round2(existing.mrrInr + (Number(sub.monthlyAmount) || 0));
      }
    } else if (sub.status === 'PAUSED') {
      existing.pausedCount += 1;
    }
    byServiceMap.set(sub.serviceId, existing);
  }

  const byCreativeService = Array.from(byServiceMap.values()).sort(
    (a, b) => b.mrrInr - a.mrrInr || b.activeCount - a.activeCount || a.serviceName.localeCompare(b.serviceName)
  );

  return {
    monthsWindow: safeWindow,
    generatedAt: now.toISOString(),
    summary: {
      activeCreativeMrr,
      activeCreativeMrrWithGst,
      totalActiveMrr,
      activeCreativeSubscribers,
      pausedCreativeSubscribers,
      cancelledCreativeSubscribers,
      creativeSharePercent,
      averageRevenuePerCreativeSubscriber,
      nonInrCreativeSubscriptions,
    },
    monthlyTrend,
    byCreativeService,
  };
}

