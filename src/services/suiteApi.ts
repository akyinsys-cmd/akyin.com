export type UserRole = 'Super Admin' | 'Sales Manager' | 'Finance Manager' | 'Staff';

export interface PublicSuiteUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
}

export type CrmStage =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'PROPOSAL SENT'
  | 'NEGOTIATION'
  | 'WON'
  | 'LOST';

export interface CrmLead {
  leadId: string;
  receivedAt: string;
  updatedAt: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  companyName: string;
  website: string;
  city: string;
  country: string;
  businessCategory: string;
  requiredService: string;
  estimatedBudget: string;
  preferredContactMethod: string;
  description: string;
  stage: CrmStage;
  secondaryTag: string;
  assignedToUserId: string;
  assignedToName: string;
  followUpAt: string;
  campaignSource: string;
  expectedDealValue: number;
  currency: 'INR' | 'AED' | 'USD';
  lostReason: string;
  privateNotes: string;
  convertedClientId: string;
  duplicateWarning: string;
  sourcePage: string;
  activities: Array<{
    id: string;
    timestamp: string;
    actor: string;
    type: string;
    summary: string;
  }>;
}

export interface SuiteClientRecord {
  id: string;
  name: string;
  companyName: string;
  category: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  websiteUrl: string;
  supportScope: string;
  summary: string;
  status: 'Active' | 'Paused' | 'Completed';
  verified: boolean;
  showInTicker: boolean;
  wordmarkStyle: 'sans' | 'serif' | 'mono';
  internalShowcaseRoute?: string;
}

export interface ServiceInternationalPriceTier {
  setupFee?: number;
  packagePrice?: number;
  unitRate?: number;
  additionalUnitRate?: number;
}

export interface PriceRevisionEntry {
  previousPrice: number;
  newPrice: number;
  changedAt: string;
  changedBy: string;
  changedByEmail?: string;
  priceField?: string;
  note?: string;
}

export interface ServicePriceHistoryRecord {
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
}

export interface SuiteSubscription {
  id: string;
  subscriptionCode: string;
  clientId: string;
  customerName: string;
  companyName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  currency: 'INR' | 'AED' | 'USD';
  monthlyAmount: number;
  gstEnabled: boolean;
  gstRate: number;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
  billingCycleDay: number;
  startDate: string;
  nextBillingDate: string;
  lastBilledAt: string;
  lastInvoiceId: string;
  lastInvoiceNumber: string;
  renewalCount: number;
  lastReminderSentAt?: string;
  lastReminderForBillingDate?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

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

export interface RenewalReminderStatusResponse {
  scheduler: {
    active: boolean;
    intervalHours: number;
    defaultLeadDays: number;
    lastRunAt: string;
    nextScheduledRunAt: string;
    lastResult: RenewalReminderSweepResult | null;
  };
  smtpConfigured: boolean;
  reminderRuleEnabled: boolean;
  upcomingCandidates: RenewalReminderCandidate[];
  reminderLogs: SuiteNotificationLog[];
}

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

export interface ServiceCategoryRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  menuOrder: number;
  active: boolean;
  updatedAt: string;
}

export interface SuiteServiceItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  benefits?: string[];
  deliverables: string[];
  workProcess?: string[];
  pricingModel: 'fixed' | 'custom';
  setupFee: number;
  recurringFee: number;
  oneTimePrice?: number;
  monthlyPrice?: number;
  revisionLimit?: string | number;
  additionalDeliverableCharge?: number;
  subscriptionDuration?: string;
  renewalTerms?: string;
  cancellationPolicy?: string;
  transactionalSmsEnabled?: boolean;
  billingCycle: 'one-time' | 'monthly' | 'quarterly' | 'custom';
  addons: Array<{ name: string; price: number }>;
  gstEnabled: boolean;
  gstRate: number;
  deliveryPeriod: string;
  active: boolean;
  sortOrder: number;
  menuOrder?: number;
  showInMenu?: boolean;
  smsPackageCredits?: number;
  smsRatePerCredit?: number;
  whatsappSetupFee?: number;
  whatsappPerMessageRate?: number;
  packagePrice?: number;
  includedUnits?: number;
  unitLabel?: string;
  unitRate?: number;
  additionalUnitRate?: number;
  internationalPricing?: {
    aed?: ServiceInternationalPriceTier;
    usd?: ServiceInternationalPriceTier;
    notes?: string;
  };
  disclaimer?: string;
  integrationConfigured?: boolean;
  priceHistory?: PriceRevisionEntry[];
}

export interface SuiteQuotationLineItem {
  id: string;
  serviceId?: string;
  title: string;
  description: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
  billingType?: 'one-time' | 'monthly' | 'usage';
}

export interface SuiteNotificationLog {
  id: string;
  timestamp: string;
  event: string;
  recipient: string;
  subject: string;
  deliveryStatus: 'sent' | 'logged_unconfigured' | 'skipped_disabled' | 'failed';
  errorMessage?: string;
}

export interface SuiteQuotation {
  id: string;
  quoteNumber: string;
  version: number;
  shareToken: string;
  leadId: string;
  clientId: string;
  customerName: string;
  companyName: string;
  customerEmail: string;
  customerPhone: string;
  cityCountry: string;
  currency: 'INR' | 'AED' | 'USD';
  items: SuiteQuotationLineItem[];
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  gstEnabled: boolean;
  gstRate: number;
  gstAmount: number;
  grandTotal: number;
  oneTimeSubtotal?: number;
  monthlySubtotal?: number;
  usageSubtotal?: number;
  payableNow?: number;
  futureRecurringAmount?: number;
  paymentTerms: string;
  expiryDate: string;
  scopeOfWork: string;
  exclusions: string;
  notes: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  customerResponseNote: string;
  respondedAt: string;
  convertedInvoiceId: string;
  revisions: Array<{
    version: number;
    savedAt: string;
    savedBy: string;
    grandTotal: number;
    note: string;
  }>;
  createdBy: string;
  createdAt: string;
}

export interface SuiteInvoice {
  id: string;
  invoiceNumber: string;
  quotationId: string;
  quotationNumber: string;
  clientId: string;
  serviceCategory: string;
  leadSource: string;
  customerName: string;
  companyName: string;
  customerEmail: string;
  customerPhone: string;
  currency: 'INR' | 'AED' | 'USD';
  paymentType: 'advance' | 'full' | 'consultation' | 'recurring' | 'balance';
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  gstEnabled: boolean;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
  paidAmount: number;
  refundedAmount: number;
  status: 'UNPAID' | 'PARTIAL' | 'PAID' | 'REFUNDED' | 'CANCELLED';
  dueDate: string;
  notes: string;
  createdAt: string;
}

export interface SuitePayment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  serviceCategory: string;
  leadSource: string;
  mode: 'test' | 'live';
  gateway: string;
  method: string;
  currency: 'INR' | 'AED' | 'USD';
  amount: number;
  gstPortion: number;
  gatewayFeeAmount: number;
  refundedAmount: number;
  status: string;
  verified: boolean;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  notes: string;
  createdAt: string;
  capturedAt: string;
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

export interface RevenueReportSummary {
  period: { preset: string; startDate: string; endDate: string };
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
  matchingPayments: SuitePayment[];
}

export interface PublicTickerResponse {
  reportedClientsHandled: number;
  verifiedCount: number;
  clients: Array<{
    id: string;
    name: string;
    category: string;
    websiteUrl: string;
    internalShowcaseRoute: string;
    wordmarkStyle: 'sans' | 'serif' | 'mono';
    verified: boolean;
    summary: string;
    supportScope: string;
  }>;
}

// Strict in-memory session storage: NEVER store Bearer tokens in localStorage or sessionStorage
let memoryBearerToken = '';
let memoryCurrentUser: PublicSuiteUser | null = null;

export function getSuiteSessionUser(): PublicSuiteUser | null {
  return memoryCurrentUser;
}

export function getSuiteBearerToken(): string {
  return memoryBearerToken;
}

export function clearSuiteSession(): void {
  memoryBearerToken = '';
  memoryCurrentUser = null;
}

async function apiJson<T>(
  url: string,
  options: RequestInit = {},
  withAuth: boolean = false
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  };
  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  if (withAuth && memoryBearerToken) {
    headers['Authorization'] = `Bearer ${memoryBearerToken}`;
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 15000);
  const externalSignal = options.signal;
  const onExternalAbort = () => controller.abort();
  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort();
    } else {
      externalSignal.addEventListener('abort', onExternalAbort, { once: true });
    }
  }

  let resp: Response;
  try {
    resp = await fetch(url, { ...options, headers, signal: controller.signal });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError' && !externalSignal?.aborted) {
      throw new Error('Request timed out after 15 seconds. Please retry.');
    }
    throw err;
  } finally {
    window.clearTimeout(timeoutId);
    if (externalSignal) {
      externalSignal.removeEventListener('abort', onExternalAbort);
    }
  }

  const contentType = resp.headers.get('content-type') || '';
  if (contentType.includes('text/html')) {
    throw new Error(`Unexpected HTML response from API (HTTP ${resp.status}).`);
  }

  const data = (await resp.json().catch(() => ({}))) as T & { error?: string };
  if (!resp.ok) {
    if (resp.status === 401 && withAuth) {
      clearSuiteSession();
    }
    throw new Error(data?.error || `Request failed (HTTP ${resp.status})`);
  }
  return data;
}

export const suiteApi = {
  // Public
  fetchPublicTicker(): Promise<PublicTickerResponse> {
    return apiJson<PublicTickerResponse>('/api/public/ticker');
  },
  fetchPublicServices(): Promise<{
    categories: string[];
    categoryRecords?: ServiceCategoryRecord[];
    services: SuiteServiceItem[];
  }> {
    return apiJson('/api/public/services');
  },
  fetchPublicServiceBySlug(slug: string): Promise<{
    service: SuiteServiceItem;
    categoryRecord: ServiceCategoryRecord | null;
    relatedServices: SuiteServiceItem[];
  }> {
    return apiJson(`/api/public/services/${encodeURIComponent(slug)}`);
  },
  fetchPublicQuote(token: string) {
    return apiJson<{
      quotation: Omit<SuiteQuotation, 'id' | 'shareToken' | 'leadId' | 'clientId' | 'revisions' | 'createdBy'>;
      invoice: {
        id: string;
        invoiceNumber: string;
        currency: 'INR' | 'AED' | 'USD';
        totalAmount: number;
        paidAmount: number;
        status: string;
        dueDate: string;
      } | null;
      uaeGatewayEnabled: boolean;
      uaeGatewayNote: string;
    }>(`/api/public/quote/${encodeURIComponent(token)}`);
  },
  respondToQuote(token: string, decision: 'ACCEPTED' | 'REJECTED', note: string) {
    return apiJson<{ ok: boolean; status: string; respondedAt: string }>(
      `/api/public/quote/${encodeURIComponent(token)}/respond`,
      {
        method: 'POST',
        body: JSON.stringify({ decision, note }),
      }
    );
  },

  // Auth
  async getAuthStatus() {
    return apiJson<{ configured: boolean; hasSuperAdmin: boolean; publicRegistrationAllowed: boolean }>(
      '/api/auth/status'
    );
  },
  async setupInitialAdmin(payload: { name: string; email: string; password: string }) {
    const res = await apiJson<{ token: string; expiresAt: string; user: PublicSuiteUser }>(
      '/api/auth/setup',
      { method: 'POST', body: JSON.stringify(payload) }
    );
    memoryBearerToken = res.token;
    memoryCurrentUser = res.user;
    return res;
  },
  async login(payload: { email: string; password: string }) {
    const res = await apiJson<{ token: string; expiresAt: string; user: PublicSuiteUser }>(
      '/api/auth/login',
      { method: 'POST', body: JSON.stringify(payload) }
    );
    memoryBearerToken = res.token;
    memoryCurrentUser = res.user;
    return res;
  },
  async validateSession(): Promise<PublicSuiteUser | null> {
    if (!memoryBearerToken) return null;
    try {
      const res = await apiJson<{ user: PublicSuiteUser }>('/api/auth/me', {}, true);
      memoryCurrentUser = res.user;
      return res.user;
    } catch {
      clearSuiteSession();
      return null;
    }
  },
  async logout() {
    if (memoryBearerToken) {
      await apiJson('/api/auth/logout', { method: 'POST' }, true).catch(() => undefined);
    }
    clearSuiteSession();
  },
  changePassword(currentPassword: string, newPassword: string) {
    return apiJson('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }, true);
  },

  // Admin Suite
  getOverview() {
    return apiJson<{
      kpis: DashboardKpis;
      recentLeads: CrmLead[];
      recentAppointments: any[];
      recentPayments: SuitePayment[];
      recentQuotations: SuiteQuotation[];
      razorpayMode: 'test' | 'live';
      razorpayConfigured: boolean;
      smtpConfigured: boolean;
    }>('/api/suite/overview', {}, true);
  },

  // Leads & CRM
  getLeads(params?: { q?: string; stage?: string; source?: string }) {
    const sp = new URLSearchParams();
    if (params?.q) sp.set('q', params.q);
    if (params?.stage) sp.set('stage', params.stage);
    if (params?.source) sp.set('source', params.source);
    const qs = sp.toString();
    return apiJson<{ leads: CrmLead[]; stages: string[]; sources: string[] }>(
      `/api/suite/leads${qs ? `?${qs}` : ''}`,
      {},
      true
    );
  },
  createLead(payload: Record<string, unknown>) {
    return apiJson<{ lead: CrmLead }>('/api/suite/leads', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, true);
  },
  updateLead(leadId: string, patch: Record<string, unknown>) {
    return apiJson<{ lead: CrmLead }>(`/api/suite/leads/${encodeURIComponent(leadId)}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }, true);
  },
  addLeadActivity(leadId: string, type: 'note' | 'call' | 'email' | 'whatsapp', summary: string) {
    return apiJson<{ lead: CrmLead }>(`/api/suite/leads/${encodeURIComponent(leadId)}/activity`, {
      method: 'POST',
      body: JSON.stringify({ type, summary }),
    }, true);
  },
  convertLeadToClient(leadId: string) {
    return apiJson<{ client: SuiteClientRecord; lead: CrmLead }>(
      `/api/suite/leads/${encodeURIComponent(leadId)}/convert-client`,
      { method: 'POST' },
      true
    );
  },

  // Clients
  getClients() {
    return apiJson<{ clients: SuiteClientRecord[]; reportedClientsHandled: number }>(
      '/api/suite/clients',
      {},
      true
    );
  },
  createClient(payload: Record<string, unknown>) {
    return apiJson<{ client: SuiteClientRecord }>('/api/suite/clients', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, true);
  },
  updateClient(clientId: string, patch: Record<string, unknown>) {
    return apiJson<{ client: SuiteClientRecord }>(`/api/suite/clients/${encodeURIComponent(clientId)}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }, true);
  },
  deleteClient(clientId: string) {
    return apiJson(`/api/suite/clients/${encodeURIComponent(clientId)}`, {
      method: 'DELETE',
    }, true);
  },

  // Services & Categories
  getServices() {
    return apiJson<{
      categories: string[];
      categoryRecords?: ServiceCategoryRecord[];
      services: SuiteServiceItem[];
    }>('/api/suite/services', {}, true);
  },
  getServiceCategories() {
    return apiJson<{ categoryRecords: ServiceCategoryRecord[] }>('/api/suite/service-categories', {}, true);
  },
  createServiceCategory(payload: {
    name: string;
    slug?: string;
    description?: string;
    menuOrder?: number;
    active?: boolean;
  }) {
    return apiJson<{ category: ServiceCategoryRecord }>('/api/suite/service-categories', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, true);
  },
  updateServiceCategory(catId: string, patch: Partial<ServiceCategoryRecord>) {
    return apiJson<{ category: ServiceCategoryRecord }>(
      `/api/suite/service-categories/${encodeURIComponent(catId)}`,
      {
        method: 'PATCH',
        body: JSON.stringify(patch),
      },
      true
    );
  },
  reorderServiceCategories(categoryIds: string[]) {
    return apiJson<{ categoryRecords: ServiceCategoryRecord[] }>('/api/suite/service-categories/reorder', {
      method: 'PUT',
      body: JSON.stringify({ categoryIds }),
    }, true);
  },
  deleteServiceCategory(catId: string) {
    return apiJson<{ ok: boolean }>(`/api/suite/service-categories/${encodeURIComponent(catId)}`, {
      method: 'DELETE',
    }, true);
  },
  getServicePriceHistory() {
    return apiJson<{
      revisions: ServicePriceHistoryRecord[];
      totalRevisions: number;
      services: Array<{ id: string; name: string; category: string; revisionCount: number }>;
    }>('/api/suite/services/price-history', {}, true);
  },
  createService(payload: Record<string, unknown>) {
    return apiJson<{ service: SuiteServiceItem; notification?: SuiteNotificationLog }>('/api/suite/services', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, true);
  },
  updateService(serviceId: string, patch: Record<string, unknown>) {
    return apiJson<{ service: SuiteServiceItem; notification?: SuiteNotificationLog }>(`/api/suite/services/${encodeURIComponent(serviceId)}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }, true);
  },
  duplicateService(serviceId: string) {
    return apiJson<{ service: SuiteServiceItem; notification?: SuiteNotificationLog }>(`/api/suite/services/${encodeURIComponent(serviceId)}/duplicate`, {
      method: 'POST',
    }, true);
  },
  deleteService(serviceId: string) {
    return apiJson(`/api/suite/services/${encodeURIComponent(serviceId)}`, {
      method: 'DELETE',
    }, true);
  },
  bulkUpdateServices(payload: {
    serviceIds: string[];
    action: 'activate' | 'archive' | 'adjust_gst';
    gstEnabled?: boolean;
    gstRate?: number;
    note?: string;
  }) {
    return apiJson<{
      updatedCount: number;
      services: SuiteServiceItem[];
      notification?: SuiteNotificationLog;
    }>('/api/suite/services/bulk-update', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, true);
  },

  // Quotations
  getQuotations() {
    return apiJson<{ quotations: SuiteQuotation[] }>('/api/suite/quotations', {}, true);
  },
  createQuotation(payload: Record<string, unknown>) {
    return apiJson<{ quotation: SuiteQuotation }>('/api/suite/quotations', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, true);
  },
  updateQuotation(id: string, patch: Record<string, unknown>) {
    return apiJson<{ quotation: SuiteQuotation }>(`/api/suite/quotations/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }, true);
  },
  convertQuotationToInvoice(
    id: string,
    opts?: { paymentType?: 'advance' | 'full' | 'balance'; dueDate?: string; serviceCategory?: string }
  ) {
    return apiJson<{ invoice: SuiteInvoice; quotation: SuiteQuotation }>(
      `/api/suite/quotations/${encodeURIComponent(id)}/convert-invoice`,
      { method: 'POST', body: JSON.stringify(opts || {}) },
      true
    );
  },

  // Appointments
  getAppointments() {
    return apiJson<{ appointments: any[]; availability: any[]; blockedDates: any[] }>(
      '/api/suite/appointments',
      {},
      true
    );
  },
  saveAppointment(payload: Record<string, unknown>) {
    return apiJson('/api/suite/appointments', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, true);
  },
  saveAvailability(rules: any[]) {
    return apiJson<{ updated: number; activeBookingsProtected: number }>(
      '/api/suite/availability',
      { method: 'PUT', body: JSON.stringify({ rules }) },
      true
    );
  },
  blockDate(date: string, reason: string) {
    return apiJson<{ blocked: string; conflictWarningCount: number }>(
      '/api/suite/blocked-dates',
      { method: 'POST', body: JSON.stringify({ date, reason }) },
      true
    );
  },
  unblockDate(date: string) {
    return apiJson(`/api/suite/blocked-dates/${encodeURIComponent(date)}`, {
      method: 'DELETE',
    }, true);
  },

  // Payments & Invoices
  getPayments() {
    return apiJson<{
      invoices: SuiteInvoice[];
      payments: SuitePayment[];
      razorpayConfigured: boolean;
      razorpayMode: 'test' | 'live';
      webhookConfigured: boolean;
      uaeGatewayEnabled: boolean;
    }>('/api/suite/payments', {}, true);
  },
  createInvoice(payload: Record<string, unknown>) {
    return apiJson<{ invoice: SuiteInvoice }>('/api/suite/invoices', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, true);
  },
  recordManualPayment(invoiceId: string, payload: Record<string, unknown>) {
    return apiJson<{ invoice: SuiteInvoice; payment: SuitePayment }>(
      `/api/suite/invoices/${encodeURIComponent(invoiceId)}/record-manual`,
      { method: 'POST', body: JSON.stringify(payload) },
      true
    );
  },
  refundPayment(paymentId: string, refundAmount: number, reason: string) {
    return apiJson(`/api/suite/payments/${encodeURIComponent(paymentId)}/refund`, {
      method: 'POST',
      body: JSON.stringify({ refundAmount, reason }),
    }, true);
  },

  // Recurring Subscriptions
  getSubscriptions() {
    return apiJson<{
      subscriptions: SuiteSubscription[];
      monthlyServices: SuiteServiceItem[];
      clients: SuiteClientRecord[];
      renewalInvoices: SuiteInvoice[];
    }>('/api/suite/subscriptions', {}, true);
  },
  createSubscription(payload: Record<string, unknown>) {
    return apiJson<{ subscription: SuiteSubscription }>('/api/suite/subscriptions', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, true);
  },
  updateSubscriptionStatus(
    subId: string,
    status: 'ACTIVE' | 'PAUSED' | 'CANCELLED',
    note?: string
  ) {
    return apiJson<{ subscription: SuiteSubscription }>(
      `/api/suite/subscriptions/${encodeURIComponent(subId)}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status, note }),
      },
      true
    );
  },
  triggerSubscriptionRenewal(subId: string) {
    return apiJson<{ subscription: SuiteSubscription; invoice: SuiteInvoice }>(
      `/api/suite/subscriptions/${encodeURIComponent(subId)}/trigger-renewal`,
      { method: 'POST' },
      true
    );
  },
  getRenewalReminderStatus() {
    return apiJson<RenewalReminderStatusResponse>(
      '/api/suite/subscriptions/reminders/status',
      {},
      true
    );
  },
  runRenewalReminderSweep(payload?: { leadDays?: number; forceResend?: boolean }) {
    return apiJson<RenewalReminderSweepResult>(
      '/api/suite/subscriptions/reminders/run',
      {
        method: 'POST',
        body: JSON.stringify(payload || {}),
      },
      true
    );
  },

  // Reports
  getRevenueReport(params?: {
    preset?: string;
    startDate?: string;
    endDate?: string;
    serviceCategory?: string;
    leadSource?: string;
  }) {
    const sp = new URLSearchParams();
    if (params?.preset) sp.set('preset', params.preset);
    if (params?.startDate) sp.set('startDate', params.startDate);
    if (params?.endDate) sp.set('endDate', params.endDate);
    if (params?.serviceCategory) sp.set('serviceCategory', params.serviceCategory);
    if (params?.leadSource) sp.set('leadSource', params.leadSource);
    return apiJson<RevenueReportSummary>(
      `/api/suite/reports/revenue?${sp.toString()}`,
      {},
      true
    );
  },
  getRecurringRevenueInsights(months = 12) {
    return apiJson<RecurringRevenueInsightsSummary>(
      `/api/suite/reports/recurring-insights?months=${encodeURIComponent(String(months))}`,
      {},
      true
    );
  },

  // Settings, Users & Audit
  getSettings() {
    return apiJson<{
      websiteSettings: Record<string, any>;
      notificationSettings: {
        ownerNotificationEmail: string;
        sendClientReceipts: boolean;
        events: Record<string, boolean>;
      };
      notificationLogs: SuiteNotificationLog[];
      smtpConfigured: boolean;
    }>('/api/suite/settings', {}, true);
  },
  updateSettings(patch: Record<string, unknown>) {
    return apiJson<{ websiteSettings: Record<string, any> }>('/api/suite/settings', {
      method: 'PUT',
      body: JSON.stringify(patch),
    }, true);
  },
  getUsers() {
    return apiJson<{ users: PublicSuiteUser[]; roles: UserRole[] }>('/api/suite/users', {}, true);
  },
  createUser(payload: { name: string; email: string; role: UserRole; password: string }) {
    return apiJson<{ user: PublicSuiteUser }>('/api/suite/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, true);
  },
  updateUser(userId: string, patch: Record<string, unknown>) {
    return apiJson<{ user: PublicSuiteUser }>(`/api/suite/users/${encodeURIComponent(userId)}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }, true);
  },
  deleteUser(userId: string) {
    return apiJson<{ ok: boolean; deletedUserId: string }>(
      `/api/suite/users/${encodeURIComponent(userId)}`,
      { method: 'DELETE' },
      true
    );
  },
  getAuditLogs() {
    return apiJson<{
      auditLogs: Array<{
        logId: string;
        timestamp: string;
        actorName: string;
        actorRole: string;
        action: string;
        targetId: string;
        summary: string;
      }>;
      notificationSettings: {
        ownerNotificationEmail: string;
        sendClientReceipts: boolean;
        events: Record<string, boolean>;
      };
      notificationLogs: Array<{
        id: string;
        timestamp: string;
        event: string;
        recipient: string;
        subject: string;
        deliveryStatus: string;
        errorMessage?: string;
      }>;
      smtpConfigured: boolean;
    }>('/api/suite/audit-logs', {}, true);
  },
  updateNotificationSettings(patch: Record<string, unknown>) {
    return apiJson('/api/suite/notifications', {
      method: 'PUT',
      body: JSON.stringify(patch),
    }, true);
  },
  sendTestNotification() {
    return apiJson<{ notification: SuiteNotificationLog; smtpConfigured: boolean }>(
      '/api/suite/notifications/test',
      { method: 'POST' },
      true
    );
  },
  async downloadAuthorizedCsv(endpoint: string, filename: string): Promise<void> {
    const resp = await fetch(endpoint, {
      headers: memoryBearerToken ? { Authorization: `Bearer ${memoryBearerToken}` } : {},
    });
    if (!resp.ok) throw new Error('Unable to export CSV');
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },
};
