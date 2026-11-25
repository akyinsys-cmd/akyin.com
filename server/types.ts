import { z } from 'zod';

export type UserRole = 'Super Admin' | 'Sales Manager' | 'Finance Manager' | 'Staff';

export const USER_ROLES: UserRole[] = [
  'Super Admin',
  'Sales Manager',
  'Finance Manager',
  'Staff',
];

export type CrmStage =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'PROPOSAL SENT'
  | 'NEGOTIATION'
  | 'WON'
  | 'LOST';

export const CRM_STAGES: CrmStage[] = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'PROPOSAL SENT',
  'NEGOTIATION',
  'WON',
  'LOST',
];

export type CrmSecondaryTag = 'Follow-up required' | 'On hold' | 'Not interested' | '';

export type LeadSource =
  | 'Website'
  | 'Google Ads'
  | 'Facebook'
  | 'Instagram'
  | 'YouTube'
  | 'WhatsApp'
  | 'Referral'
  | 'Direct contact'
  | 'Other';

export const LEAD_SOURCES: LeadSource[] = [
  'Website',
  'Google Ads',
  'Facebook',
  'Instagram',
  'YouTube',
  'WhatsApp',
  'Referral',
  'Direct contact',
  'Other',
];

export const DEFAULT_SERVICE_CATEGORIES = [
  'Automotive Marketing',
  'Digital Marketing',
  'Social Media Management',
  'Creative and Graphic Design',
  'Video and Content Services',
  'Business Documents and Presentations',
  'Excel and Reporting Services',
  'Messaging and Communication',
  'Lead Management and CRM',
  'Business Consulting and Training',
] as const;

export const SERVICE_CATEGORIES = DEFAULT_SERVICE_CATEGORIES;

export type ServiceCategoryName = string;

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

export interface SuiteUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
}

export type PublicSuiteUser = Omit<SuiteUser, 'passwordHash'>;

export interface SessionRecord {
  tokenHash: string;
  userId: string;
  role: UserRole;
  name: string;
  email: string;
  createdAt: string;
  expiresAt: string;
}

export interface LeadActivityEntry {
  id: string;
  timestamp: string;
  actor: string;
  type: 'note' | 'call' | 'stage_change' | 'email' | 'whatsapp' | 'system';
  summary: string;
}

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
  consentAccepted: boolean;
  stage: CrmStage;
  secondaryTag: CrmSecondaryTag;
  assignedToUserId: string;
  assignedToName: string;
  followUpAt: string;
  campaignSource: LeadSource;
  expectedDealValue: number;
  currency: 'INR' | 'AED' | 'USD';
  lostReason: string;
  privateNotes: string;
  convertedClientId: string;
  duplicateWarning: string;
  sourcePage: string;
  activities: LeadActivityEntry[];
}

export interface ClientRecord {
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
  sourceLeadId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceInternationalPriceTier {
  setupFee?: number;
  packagePrice?: number;
  unitRate?: number;
  additionalUnitRate?: number;
}

export interface ServiceInternationalPricing {
  aed?: ServiceInternationalPriceTier;
  usd?: ServiceInternationalPriceTier;
  notes?: string;
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

export interface ServiceCatalogItem {
  id: string;
  slug: string;
  name: string;
  category: ServiceCategoryName;
  description: string;
  benefits?: string[];
  deliverables: string[];
  workProcess?: string[];
  pricingModel: 'fixed' | 'custom';
  setupFee: number;
  recurringFee: number;
  billingCycle: 'one-time' | 'monthly' | 'quarterly' | 'custom';
  addons: Array<{ name: string; price: number }>;
  gstEnabled: boolean;
  gstRate: number;
  deliveryPeriod: string;
  active: boolean;
  sortOrder: number;
  menuOrder?: number;
  showInMenu?: boolean;
  updatedAt: string;
  packagePrice?: number;
  includedUnits?: number;
  unitLabel?: string;
  unitRate?: number;
  additionalUnitRate?: number;
  internationalPricing?: ServiceInternationalPricing;
  disclaimer?: string;
  integrationConfigured?: boolean;
  // Standalone and monthly service model fields
  oneTimePrice?: number;
  monthlyPrice?: number;
  revisionLimit?: string | number;
  additionalDeliverableCharge?: number;
  subscriptionDuration?: string;
  renewalTerms?: string;
  cancellationPolicy?: string;
  transactionalSmsEnabled?: boolean;
  priceHistory?: PriceRevisionEntry[];
}

export interface QuotationLineItem {
  id: string;
  serviceId?: string;
  title: string;
  description: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
  billingType?: 'one-time' | 'monthly' | 'usage';
}

export type QuotationStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

export interface QuotationRevision {
  version: number;
  savedAt: string;
  savedBy: string;
  grandTotal: number;
  note: string;
}

export interface QuotationRecord {
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
  items: QuotationLineItem[];
  subtotal: number;
  oneTimeSubtotal?: number;
  monthlySubtotal?: number;
  usageSubtotal?: number;
  payableNow?: number;
  futureRecurringAmount?: number;
  discountAmount: number;
  taxableAmount: number;
  gstEnabled: boolean;
  gstRate: number;
  gstAmount: number;
  grandTotal: number;
  paymentTerms: string;
  expiryDate: string;
  scopeOfWork: string;
  exclusions: string;
  notes: string;
  status: QuotationStatus;
  customerResponseNote: string;
  respondedAt: string;
  convertedInvoiceId: string;
  revisions: QuotationRevision[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type InvoiceStatus = 'UNPAID' | 'PARTIAL' | 'PAID' | 'REFUNDED' | 'CANCELLED';

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  quotationId: string;
  quotationNumber: string;
  leadId: string;
  clientId: string;
  serviceCategory: string;
  leadSource: LeadSource;
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
  status: InvoiceStatus;
  dueDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED';

export interface SubscriptionRecord {
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
  status: SubscriptionStatus;
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

export type PaymentRecordStatus =
  | 'created'
  | 'authorized'
  | 'captured'
  | 'failed'
  | 'abandoned'
  | 'refunded'
  | 'manual_recorded';

export interface PaymentRecord {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  quotationId: string;
  clientId: string;
  customerName: string;
  customerEmail: string;
  serviceCategory: string;
  leadSource: LeadSource;
  mode: 'test' | 'live';
  gateway: 'razorpay' | 'manual_bank' | 'manual_uae_transfer' | 'cash';
  method: string;
  currency: 'INR' | 'AED' | 'USD';
  amount: number;
  gstPortion: number;
  gatewayFeeAmount: number;
  refundedAmount: number;
  status: PaymentRecordStatus;
  verified: boolean;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignatureVerified: boolean;
  webhookEventIds: string[];
  idempotencyKey: string;
  notes: string;
  createdAt: string;
  capturedAt: string;
  updatedAt: string;
}

export interface SuiteAppointmentRecord {
  bookingId: string;
  createdAt: string;
  customerName: string;
  phone: string;
  email: string;
  city: string;
  country: string;
  businessName: string;
  website: string;
  businessStage: string;
  consultationTopic: string;
  businessChallenge: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  paymentStatus: 'Payment Awaited' | 'Payment Received' | 'Not Required' | 'Refunded';
  bookingStatus:
    | 'Pending'
    | 'Contact Required'
    | 'Payment Awaited'
    | 'Payment Received'
    | 'Confirmed'
    | 'Completed'
    | 'Cancelled'
    | 'Rescheduled';
  adminNotes: string;
  calendarEventId: string;
  linkedLeadId?: string;
  invoiceId?: string;
  updatedAt: string;
}

export interface AvailabilityRule {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
  slotDuration: number;
  maximumBookings: number;
}

export interface BlockedDateRecord {
  date: string;
  reason: string;
  createdBy: string;
  createdAt: string;
}

export interface AuditLogEntry {
  logId: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole | 'Public' | 'System' | 'Webhook';
  action: string;
  targetId: string;
  summary: string;
}

export type NotificationEventKey =
  | 'enquiry_received'
  | 'lead_assigned'
  | 'followup_due'
  | 'quotation_created'
  | 'quotation_accepted'
  | 'quotation_rejected'
  | 'payment_received'
  | 'payment_failed'
  | 'appointment_booked'
  | 'appointment_cancelled'
  | 'refund_processed'
  | 'service_price_updated'
  | 'service_added'
  | 'subscription_renewal_reminder';

export interface NotificationSettings {
  ownerNotificationEmail: string;
  sendClientReceipts: boolean;
  events: Record<NotificationEventKey, boolean>;
}

export interface NotificationLogEntry {
  id: string;
  timestamp: string;
  event: NotificationEventKey;
  recipient: string;
  subject: string;
  deliveryStatus: 'sent' | 'logged_unconfigured' | 'skipped_disabled' | 'failed';
  errorMessage?: string;
}

export interface SuiteWebsiteSettings {
  reportedClientsCount: number;
  advisoryHeadline: string;
  advisorySubheadline: string;
  consultationFee: string;
  advisorySlotDuration: string;
  advisoryMaxBookings: string;
  notificationEmail: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  heroHeadline: string;
  heroSubheadline: string;
  footerTagline: string;
  brandWordmark: string;
  logoUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  xUrl: string;
  youtubeUrl: string;
  amazonUrl: string;
  googlePlayBooksUrl: string;
  uaeGatewayEnabled: boolean;
  uaeGatewayNote: string;
  [key: string]: string | number | boolean;
}

export interface SuiteDatabase {
  schemaVersion: number;
  users: SuiteUser[];
  sessions: SessionRecord[];
  leads: CrmLead[];
  clients: ClientRecord[];
  serviceCategories: ServiceCategoryRecord[];
  services: ServiceCatalogItem[];
  quotations: QuotationRecord[];
  invoices: InvoiceRecord[];
  subscriptions: SubscriptionRecord[];
  payments: PaymentRecord[];
  appointments: SuiteAppointmentRecord[];
  availability: AvailabilityRule[];
  blockedDates: BlockedDateRecord[];
  websiteSettings: SuiteWebsiteSettings;
  notificationSettings: NotificationSettings;
  notificationLogs: NotificationLogEntry[];
  auditLogs: AuditLogEntry[];
  processedWebhookEvents: string[];
}

export const quotationLineItemSchema = z.object({
  id: z.string().trim().min(1).max(60),
  serviceId: z.string().trim().max(60).optional(),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(500).default(''),
  qty: z.number().finite().positive().max(10_000_000),
  unitPrice: z.number().finite().min(0).max(100_000_000),
  billingType: z.enum(['one-time', 'monthly', 'usage']).optional(),
});
