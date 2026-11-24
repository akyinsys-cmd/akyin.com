export type AgencyServiceCategory =
  | 'Creative & Design'
  | 'Presentation & Office Productivity'
  | 'Digital Marketing'
  | 'Website & Digital Solutions'
  | 'Business Support'
  | 'Lead Generation & Sales'
  | 'Automotive Dealership Marketing'
  | 'Business Advisory';

export type ServiceFilterGroup =
  | 'All Services'
  | 'One-Time Services'
  | 'Monthly Services'
  | 'Creative'
  | 'Marketing'
  | 'Business Support'
  | 'Technology';

export type BillingCycle = 'one-time' | 'monthly';

export type GstTreatment =
  | 'GST_EXTRA_18'
  | 'GST_INCLUSIVE_18'
  | 'EXPORT_ZERO_RATED';

export type QuotationStatus =
  | 'New'
  | 'Under Review'
  | 'Additional Information Required'
  | 'Quotation Prepared'
  | 'Quotation Sent'
  | 'Accepted'
  | 'Rejected'
  | 'Expired';

export const QUOTATION_STATUS_LIST: QuotationStatus[] = [
  'New',
  'Under Review',
  'Additional Information Required',
  'Quotation Prepared',
  'Quotation Sent',
  'Accepted',
  'Rejected',
  'Expired',
];

export type SupportedCountry = 'India' | 'UAE' | 'International';
export type SupportedCurrency = 'INR' | 'AED';

export interface AgencyServiceItem {
  id: string;
  name: string;
  category: AgencyServiceCategory;
  filterGroups: Exclude<ServiceFilterGroup, 'All Services'>[];
  shortDescription: string;
  priceInr: number | null; // null => Custom Quote
  priceAed: number | null; // null unless Admin configures UAE AED price
  unitLabel?: string; // e.g., '/session', '/month', or ''
  startingFrom: boolean;
  isCustomQuote: boolean;
  billingCycle: BillingCycle;
  scopeDetails: string;
  deliverables: string[];
  revisionLimit: string;
  deliveryTimeline: string;
  expressEligible: boolean;
  expressTimeline: string;
  active: boolean;
  preserved?: boolean;
}

export interface MonthlyGrowthPackage {
  id: 'starter' | 'growth' | 'business-plus';
  name: string;
  tagline: string;
  priceInr: number;
  priceAed: number | null;
  popular: boolean;
  billingCycle: 'monthly';
  deliverables: string[];
  revisions: string;
  approvalProcess: string;
  postingFrequency: string;
  includedPlatforms: string;
  minimumCommitment: string;
  excludes: string[];
  active: boolean;
}

export interface PreservedPackageConfig {
  id: 'package-a' | 'package-b' | 'sales-training' | 'business-advisory';
  code: string;
  name: string;
  setupInr: number;
  recurringOrSessionInr: number;
  setupAed: number | null;
  recurringOrSessionAed: number | null;
  unitLabel: string;
  lockedByDefault: boolean;
  adminApprovedOverride: boolean;
}

export interface PricingRulesConfig {
  defaultCountry: SupportedCountry;
  defaultCurrency: SupportedCurrency;
  uaePricingEnabled: boolean;
  uaePricingMode: 'disabled' | 'custom-list' | 'admin-rate';
  aedExchangeRate: number | null; // Only applied if admin explicitly configures & approves
  gstTreatment: GstTreatment;
  gstRatePercent: number;
  gstLabel: string;
  globalDiscountPercent: number;
  globalDiscountFlatInr: number;
  globalDiscountFlatAed: number;
  discountLabel: string;
  quotationValidityDays: number;
  expressDeliverySurchargePercent: number;
  expressDeliveryNote: string;
  updatedAt: string;
}

export interface AgencyPricingCatalog {
  services: AgencyServiceItem[];
  monthlyPackages: MonthlyGrowthPackage[];
  preservedPackages: PreservedPackageConfig[];
  rules: PricingRulesConfig;
}

export interface QuotationLineItem {
  itemType: 'service' | 'monthly-package' | 'custom';
  id: string;
  name: string;
  category?: string;
  billingCycle: BillingCycle;
  quantity: number;
  unitPriceInr: number | null;
  unitPriceAed: number | null;
  isCustomQuote: boolean;
}

export interface CustomQuotationInput {
  // Step 1
  items: QuotationLineItem[];
  // Step 2
  companyName: string;
  industry: string;
  projectDescription: string;
  deliverablesCount: string;
  preferredDeliveryDate: string;
  billingPreference: 'one-time' | 'monthly' | 'mixed';
  budgetRange: string;
  additionalRequirements: string;
  expressDelivery: boolean;
  complexityLevel: 'standard' | 'complex';
  // Step 3
  customerName: string;
  email: string;
  phone: string;
  city: string;
  country: SupportedCountry;
  website: string;
}

export interface CustomQuotationRecord {
  quotationId: string;
  createdAt: string;
  updatedAt: string;
  status: QuotationStatus;
  items: QuotationLineItem[];
  companyName: string;
  industry: string;
  projectDescription: string;
  deliverablesCount: string;
  preferredDeliveryDate: string;
  billingPreference: 'one-time' | 'monthly' | 'mixed';
  budgetRange: string;
  additionalRequirements: string;
  expressDelivery: boolean;
  complexityLevel: 'standard' | 'complex';
  customerName: string;
  email: string;
  phone: string;
  city: string;
  country: SupportedCountry;
  website: string;
  indicativeOneTimeInr: number;
  indicativeMonthlyInr: number;
  hasCustomQuoteItems: boolean;
  // Admin workflow & final approved quotation fields
  adminCurrency: SupportedCurrency;
  adminTaxPercent: number;
  adminTaxLabel: string;
  adminDiscountPercent: number;
  adminDiscountFlat: number;
  adminFinalSubtotal: number | null;
  adminFinalTotal: number | null;
  adminProjectTimeline: string;
  adminPaymentMilestones: string;
  adminValidityDays: number;
  adminFollowUpDate: string;
  adminPublicNotes: string;
  adminInternalNotes: string;
  sentAt: string;
}

export interface PublicQuotationStatusSummary {
  quotationId: string;
  createdAt: string;
  updatedAt: string;
  status: QuotationStatus;
  customerName: string;
  companyName: string;
  country: SupportedCountry;
  items: QuotationLineItem[];
  indicativeOneTimeInr: number;
  indicativeMonthlyInr: number;
  hasCustomQuoteItems: boolean;
  adminCurrency: SupportedCurrency;
  adminTaxLabel: string;
  adminFinalTotal: number | null;
  adminProjectTimeline: string;
  adminPaymentMilestones: string;
  adminValidityDays: number;
  adminPublicNotes: string;
}
