import { AppRoute } from './akyinData';

export interface ClientItem {
  id: string;
  name: string;
  category: string;
  websiteUrl?: string;
  websiteLabel?: string;
  isPreviewUrl?: boolean;
  featured: boolean;
  summary: string;
  supportScope: string;
  status: 'Client Relationship' | 'Client';
  wordmarkStyle?: 'sans' | 'serif' | 'mono';
  internalShowcaseRoute?: AppRoute;
}

/**
 * Central Client Website & Development Preview URLs
 * Note: These are development-preview URLs and can easily be replaced
 * with official production domains in this central configuration.
 */
export const CLIENT_PREVIEW_URLS = {
  aicalc:
    'https://ais-dev-iwemnrdjpbl2zz7yzoxiyv-71845396109.asia-east1.run.app/ventures/aicalc',
  kartigo:
    'https://ais-dev-iwemnrdjpbl2zz7yzoxiyv-71845396109.asia-east1.run.app/ventures/kartigo',
  biznxt:
    'https://ais-dev-iwemnrdjpbl2zz7yzoxiyv-71845396109.asia-east1.run.app/ventures/biznxt',
  budgetBazaar:
    'https://ais-dev-iwemnrdjpbl2zz7yzoxiyv-71845396109.asia-east1.run.app/ventures/budget-bazaar',
} as const;

export const CLIENT_STATS = {
  sectionTitle: 'OUR CLIENTS',
  sectionHeading: 'Businesses That Trust AKYIN for Their Growth.',
  clientCount: '58 Clients',
  clientSupportText: 'Supporting businesses across multiple industries.',
  clientDisclaimer:
    'Clients are independent businesses supported by AKYIN for marketing, technology, or commercial growth; they are not owned subsidiaries or internal brands.',
} as const;

/**
 * Verified Client Directory:
 * Contains the four newly reclassified clients (AICalc, Kartigo, BizNXT, Budget Bazaar)
 * alongside all existing client relationships. No extra clients invented.
 */
export const AKYIN_CLIENTS: ClientItem[] = [
  {
    id: 'aicalc',
    name: 'AICalc',
    category: 'AI & Technology',
    websiteUrl: CLIENT_PREVIEW_URLS.aicalc,
    websiteLabel: 'Visit Website',
    isPreviewUrl: true,
    featured: true,
    summary:
      'AI-assisted and natural-language calculation platform solving complex business and daily calculations.',
    supportScope: 'Digital Infrastructure, Technology & Marketing',
    status: 'Client Relationship',
    wordmarkStyle: 'mono',
    internalShowcaseRoute: '/ventures/aicalc',
  },
  {
    id: 'kartigo',
    name: 'Kartigo',
    category: 'B2B Stock Supply',
    websiteUrl: CLIENT_PREVIEW_URLS.kartigo,
    websiteLabel: 'Visit Website',
    isPreviewUrl: true,
    featured: true,
    summary:
      'Wholesale commercial stock supply and B2B trade marketplace connecting volume buyers with verified inventory.',
    supportScope: 'B2B Growth, Buyer Qualification & Platform Strategy',
    status: 'Client Relationship',
    wordmarkStyle: 'sans',
    internalShowcaseRoute: '/ventures/kartigo',
  },
  {
    id: 'biznxt',
    name: 'BizNXT',
    category: 'Business Guidance & Consulting',
    websiteUrl: CLIENT_PREVIEW_URLS.biznxt,
    websiteLabel: 'Visit Website',
    isPreviewUrl: true,
    featured: true,
    summary:
      'Entrepreneurial consulting and strategic guidance platform assisting business founders in evaluating commercial opportunities.',
    supportScope: 'Advisory Funnels, Commercial Structure & Digital Positioning',
    status: 'Client Relationship',
    wordmarkStyle: 'sans',
    internalShowcaseRoute: '/ventures/biznxt',
  },
  {
    id: 'budget-bazaar',
    name: 'Budget Bazaar',
    category: 'B2C E-commerce',
    websiteUrl: CLIENT_PREVIEW_URLS.budgetBazaar,
    websiteLabel: 'Visit Website',
    isPreviewUrl: true,
    featured: true,
    summary:
      'Value-driven consumer retail storefront providing everyday essentials and household goods at accessible price points.',
    supportScope: 'E-commerce Marketing & Customer Demand Campaigns',
    status: 'Client Relationship',
    wordmarkStyle: 'sans',
    internalShowcaseRoute: '/ventures/budget-bazaar',
  },
  {
    id: 'autoclub',
    name: 'AutoClub',
    category: 'Automotive Network',
    featured: true,
    summary:
      'Automotive enthusiast and multi-brand dealership network supported with test-drive lead generation and floor sales coaching.',
    supportScope: 'Dealership Lead Generation & Sales Team Coaching',
    status: 'Client Relationship',
    wordmarkStyle: 'sans',
  },
  {
    id: 'arosco-ventures',
    name: 'Arosco Ventures',
    category: 'Digital Business Solutions',
    featured: true,
    summary:
      'Commercial enterprise collaboration focused on digital business solutions and strategic market presence.',
    supportScope: 'Digital Solutions & Market Positioning',
    status: 'Client Relationship',
    wordmarkStyle: 'sans',
  },
  {
    id: 'mei-cosmetics',
    name: 'MEI Cosmetics',
    category: 'Beauty & Personal Care',
    featured: true,
    summary:
      'Beauty, cosmetics, and personal care brand supported across digital marketing, creative collateral, and social demand.',
    supportScope: 'Creative Design & Social Media Acquisition',
    status: 'Client Relationship',
    wordmarkStyle: 'serif',
  },
  {
    id: 'krutika-cosmetics',
    name: 'Krutika Cosmetics',
    category: 'Cosmetics & Beauty',
    featured: true,
    summary:
      'Skincare and cosmetic brand collaboration driving audience reach and structured social media engagement.',
    supportScope: 'Social Media Management & Paid Campaigns',
    status: 'Client Relationship',
    wordmarkStyle: 'serif',
  },
  {
    id: 'nyika-traders',
    name: 'Nyika Traders',
    category: 'Trading & Distribution',
    featured: true,
    summary:
      'Commercial trading enterprise supported with business enquiry vetting and regional B2B distributor communications.',
    supportScope: 'Lead Filtering & Trade Operations',
    status: 'Client Relationship',
    wordmarkStyle: 'sans',
  },
  {
    id: 'ns-traders',
    name: 'NS Traders',
    category: 'Wholesale & Retail Supply',
    featured: true,
    summary:
      'Commercial supply partner collaborating on trade distribution, customer enquiry management, and collateral.',
    supportScope: 'Enquiry Management & Business Collateral',
    status: 'Client Relationship',
    wordmarkStyle: 'sans',
  },
];
