export type PaymentSku =
  | 'advisory-session'
  | 'package-a-setup'
  | 'package-b-setup'
  | 'sales-training';

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
    category: 'Executive Consultation',
    amountPaise: 199900,
    amountInr: 1999,
    displayPrice: '₹1,999',
    description:
      '30-minute private strategy consultation on India Standard Time (Asia/Kolkata).',
  },
  {
    sku: 'package-a-setup',
    title: 'Package A — Full-Service Growth Marketing Setup Fee',
    shortLabel: 'Package A Setup',
    category: 'Agency Retainer Setup',
    amountPaise: 3999900,
    amountInr: 39999,
    displayPrice: '₹39,999',
    description:
      'One-time onboarding, ad architecture & AI qualification script setup for Package A.',
  },
  {
    sku: 'package-b-setup',
    title: 'Package B — Lead Filtering & Qualification Setup Fee',
    shortLabel: 'Package B Setup',
    category: 'Agency Retainer Setup',
    amountPaise: 1499900,
    amountInr: 14999,
    displayPrice: '₹14,999',
    description:
      'One-time onboarding, calling workflow & pipeline sheet setup for Package B.',
  },
  {
    sku: 'sales-training',
    title: 'Commercial & Dealership Sales Training Workshop',
    shortLabel: 'Sales Training',
    category: 'Showroom & Team Coaching',
    amountPaise: 2500000,
    amountInr: 25000,
    displayPrice: '₹25,000',
    description:
      'Per-session commercial sales, walkthrough & closing workshop for teams.',
  },
];

export const PAYMENT_CATALOG_BY_SKU: Record<PaymentSku, PaymentCatalogItem> = {
  'advisory-session': PAYMENT_CATALOG_LIST[0],
  'package-a-setup': PAYMENT_CATALOG_LIST[1],
  'package-b-setup': PAYMENT_CATALOG_LIST[2],
  'sales-training': PAYMENT_CATALOG_LIST[3],
};
