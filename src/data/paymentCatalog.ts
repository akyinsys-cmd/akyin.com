export type PaymentSku =
  | 'advisory-session'
  | 'growth-marketing-setup'
  | 'lead-filtering-setup'
  | 'sales-training'
  | 'bulk-sms-starter'
  | 'whatsapp-business-setup';

export interface PaymentCatalogItem {
  sku: PaymentSku;
  title: string;
  shortLabel: string;
  category: string;
  amountPaise: number;
  amountInr: number;
  displayPrice: string;
  description: string;
}

export const PAYMENT_CATALOG_LIST: PaymentCatalogItem[] = [
  {
    sku: 'advisory-session',
    title: '1-on-1 Business Advisory Consultation (30 min IST)',
    shortLabel: 'Advisory Session',
    category: 'Business Consulting and Training',
    amountPaise: 399800,
    amountInr: 3998,
    displayPrice: '₹3,998',
    description:
      '30-minute private strategy consultation on India Standard Time (Asia/Kolkata).',
  },
  {
    sku: 'growth-marketing-setup',
    title: 'Full-Service Growth Marketing & Lead Management Setup Fee',
    shortLabel: 'Growth Marketing Setup',
    category: 'Digital Marketing',
    amountPaise: 7999800,
    amountInr: 79998,
    displayPrice: '₹79,998',
    description:
      'One-time onboarding, Meta & Google campaign architecture, and qualification workflow setup.',
  },
  {
    sku: 'lead-filtering-setup',
    title: 'Lead Filtering & Qualification Onboarding Setup Fee',
    shortLabel: 'Lead Filtering Setup',
    category: 'Lead Management and CRM',
    amountPaise: 2999800,
    amountInr: 29998,
    displayPrice: '₹29,998',
    description:
      'One-time onboarding, AI-assisted calling workflow & daily Excel pipeline sheet setup.',
  },
  {
    sku: 'sales-training',
    title: 'Commercial & Dealership Sales Training Workshop',
    shortLabel: 'Sales Training',
    category: 'Business Consulting and Training',
    amountPaise: 5000000,
    amountInr: 50000,
    displayPrice: '₹50,000',
    description:
      'Per-session commercial sales, walkthrough & closing workshop for teams.',
  },
  {
    sku: 'bulk-sms-starter',
    title: 'Bulk SMS Marketing (10,000 SMS Credits Package)',
    shortLabel: 'Bulk SMS (10k)',
    category: 'Messaging and Communication',
    amountPaise: 300000,
    amountInr: 3000,
    displayPrice: '₹3,000',
    description:
      '10,000 SMS credits package (₹0.30/SMS effective rate). Additional SMS credits billed per quotation. Subject to provider & DLT conditions.',
  },
  {
    sku: 'whatsapp-business-setup',
    title: 'WhatsApp Business Messaging Setup (One-Time Setup Fee)',
    shortLabel: 'WhatsApp Setup',
    category: 'Messaging and Communication',
    amountPaise: 499900,
    amountInr: 4999,
    displayPrice: '₹4,999',
    description:
      'One-time WhatsApp Business setup, profile & workflow configuration fee only. Message usage (₹1.50/msg) is billed separately.',
  },
];

export const PAYMENT_CATALOG_BY_SKU: Record<PaymentSku, PaymentCatalogItem> = {
  'advisory-session': PAYMENT_CATALOG_LIST[0],
  'growth-marketing-setup': PAYMENT_CATALOG_LIST[1],
  'lead-filtering-setup': PAYMENT_CATALOG_LIST[2],
  'sales-training': PAYMENT_CATALOG_LIST[3],
  'bulk-sms-starter': PAYMENT_CATALOG_LIST[4],
  'whatsapp-business-setup': PAYMENT_CATALOG_LIST[5],
};
