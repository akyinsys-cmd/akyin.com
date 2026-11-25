import { AppRoute, EXTERNAL_VERTICAL_URLS } from './akyinData';

export type EcosystemRelationshipType =
  | 'AKYIN Venture'
  | 'Client'
  | 'Business Ecosystem';

export type EcosystemWordmarkStyle = 'sans' | 'serif' | 'mono';

export interface ClientEcosystemRecord {
  id: string;
  name: string;
  relationshipType: EcosystemRelationshipType;
  industryCategory: string;
  summary: string;
  /** Only populated for owned AKYIN ventures or verified supplied domains; never fabricated. */
  externalUrl?: string;
  externalLabel?: string;
  internalRoute?: AppRoute;
  wordmarkStyle: EcosystemWordmarkStyle;
}

export const ECOSYSTEM_STATS = {
  heading: 'Businesses Growing With AKYIN',
  subheading:
    'Building relationships, enabling growth and supporting businesses across multiple industries.',
  tickerHeading: 'OUR CLIENTS & BUSINESS ECOSYSTEM',
  clientsHandledCount: '58 Clients Currently Handled',
  clientsHandledLabel: 'Verified Client Portfolio & Growth Mandates',
  clientsHandledFootnote:
    'Displaying 11 identified client brands; remaining 47 client records managed privately by AKYIN admin.',
} as const;

/**
 * Central Client & Ecosystem Configuration
 * Website owners can add, update, or reorder entries here without editing UI components.
 * Note: Only supply real logos or verified URLs. External client names without a supplied
 * website intentionally remain unlinked typographic brand identifiers.
 */
export const CLIENT_ECOSYSTEM_RECORDS: ClientEcosystemRecord[] = [
  {
    id: 'eco-aicalc',
    name: 'AICalc',
    relationshipType: 'Client',
    industryCategory: 'AI & Technology',
    summary:
      'AI-assisted and natural-language calculation suite for business, finance, and daily math.',
    externalUrl: 'https://ais-dev-iwemnrdjpbl2zz7yzoxiyv-71845396109.asia-east1.run.app/ventures/aicalc',
    externalLabel: 'Visit Website',
    internalRoute: '/ventures/aicalc',
    wordmarkStyle: 'mono',
  },
  {
    id: 'eco-kartigo',
    name: 'Kartigo.online',
    relationshipType: 'Client',
    industryCategory: 'B2B Stock Supply',
    summary:
      'B2B wholesale commerce and commercial stock supply platform connecting trade buyers and suppliers.',
    internalRoute: '/ventures/kartigo',
    wordmarkStyle: 'sans',
  },
  {
    id: 'eco-biznxt',
    name: 'BizNXT.online',
    relationshipType: 'Client',
    industryCategory: 'Business Guidance & Consulting',
    summary:
      'Business guidance, feasibility clarity, and growth advisory platform for entrepreneurs.',
    internalRoute: '/ventures/biznxt',
    wordmarkStyle: 'sans',
  },
  {
    id: 'eco-thrift-client',
    name: 'Thrift Store',
    relationshipType: 'Client',
    industryCategory: 'Fashion Retail & Thrift',
    summary:
      'Curated consumer apparel and thrift retail client supported for digital positioning and growth.',
    internalRoute: '/ventures/store',
    wordmarkStyle: 'serif',
  },
  {
    id: 'eco-budget-bazaar',
    name: 'Budget Bazaar',
    relationshipType: 'Client',
    industryCategory: 'B2C E-commerce',
    summary:
      'Value-first household essentials and everyday goods storefront.',
    internalRoute: '/ventures/budget-bazaar',
    wordmarkStyle: 'sans',
  },
  {
    id: 'eco-publishing-venture',
    name: 'AKYIN Publishing',
    relationshipType: 'AKYIN Venture',
    industryCategory: 'Book & Digital Publishing',
    summary:
      'Core AKYIN publishing division with eight books on Amazon and digital productivity products.',
    internalRoute: '/ventures/publishing',
    wordmarkStyle: 'serif',
  },
  {
    id: 'eco-marketing-venture',
    name: 'AKYIN Marketing',
    relationshipType: 'AKYIN Venture',
    industryCategory: 'Digital Marketing & Growth',
    summary:
      'Full-service growth, creative, digital marketing, and dealership performance agency.',
    internalRoute: '/ventures/marketing',
    wordmarkStyle: 'sans',
  },
  {
    id: 'eco-thrift-store',
    name: 'AKYIN Store',
    relationshipType: 'AKYIN Venture',
    industryCategory: 'Fashion Retail & Thrift',
    summary:
      'AKYIN Store · AKYIN Thrift curated value fashion and discounted apparel retail division.',
    internalRoute: '/ventures/store',
    wordmarkStyle: 'serif',
  },
  {
    id: 'eco-autoclub',
    name: 'AutoClub',
    relationshipType: 'Client',
    industryCategory: 'Automotive',
    summary:
      'Multi-brand automotive retail relationship supported with showroom demand generation and buyer qualification.',
    wordmarkStyle: 'sans',
  },
  {
    id: 'eco-arosco',
    name: 'Arosco Ventures',
    relationshipType: 'Client',
    industryCategory: 'Digital Business Solutions',
    summary:
      'Business growth and digital positioning collaboration supporting commercial expansion initiatives.',
    wordmarkStyle: 'sans',
  },
  {
    id: 'eco-mei-cosmetics',
    name: 'MEI Cosmetics',
    relationshipType: 'Client',
    industryCategory: 'Cosmetics & Beauty',
    summary:
      'Beauty and personal care consumer brand relationship supported across digital marketing and brand assets.',
    wordmarkStyle: 'serif',
  },
  {
    id: 'eco-krutika-cosmetics',
    name: 'Krutika Cosmetics',
    relationshipType: 'Client',
    industryCategory: 'Cosmetics & Beauty',
    summary:
      'Cosmetics and retail brand engagement focused on consumer discovery and structured social demand.',
    wordmarkStyle: 'serif',
  },
  {
    id: 'eco-nyika-traders',
    name: 'Nyika Traders',
    relationshipType: 'Business Ecosystem',
    industryCategory: 'Trading & Distribution',
    summary:
      'Commercial trading and merchandise supply relationship connected across B2B sourcing workflows.',
    wordmarkStyle: 'sans',
  },
  {
    id: 'eco-ns-traders',
    name: 'NS Traders',
    relationshipType: 'Business Ecosystem',
    industryCategory: 'Trading & Distribution',
    summary:
      'Trade and distribution ecosystem partner collaborating across commercial stock movement and enquiries.',
    wordmarkStyle: 'sans',
  },
];

/**
 * Industry categories served across AKYIN Ventures and AKYIN Marketing.
 * Kept strictly separate from client brand names in all UI displays and tickers.
 */
export const ECOSYSTEM_INDUSTRY_CATEGORIES: string[] = [
  'Digital Business Solutions',
  'E-commerce',
  'Fashion & Retail',
  'Automotive',
  'Cosmetics & Beauty',
  'Trading & Distribution',
  'Publishing',
  'SaaS & Technology',
  'Business Consulting',
  'Digital Marketing',
  'Consumer Products',
  'Online Retail',
];

export interface ServiceFinderOption {
  id: string;
  label: string;
  tagline: string;
  recommendedDivision: string;
  outcomeSummary: string;
  includedCapabilities: string[];
  route: AppRoute;
  ctaLabel: string;
  enquiryServiceValue: string;
}

export const SERVICE_FINDER_OPTIONS: ServiceFinderOption[] = [
  {
    id: 'sf-lead-gen',
    label: 'Lead Generation',
    tagline: 'Consistent inbound customer enquiries from paid acquisition',
    recommendedDivision: 'AKYIN MARKETINGS · Performance Acquisition',
    outcomeSummary:
      'Structured Meta & Search campaigns paired with dedicated conversion creatives and instant lead capture.',
    includedCapabilities: [
      'Geo-targeted Meta & Google campaign architecture',
      'Instant lead forms & conversion landing flows',
      'Audience retargeting & weekly optimization',
    ],
    route: '/ventures/marketing',
    ctaLabel: 'Explore Marketing Agency',
    enquiryServiceValue: 'Lead Generation (Meta & Google Ads)',
  },
  {
    id: 'sf-digital-marketing',
    label: 'Digital Marketing',
    tagline: 'Modular performance ads, SEO & campaign optimization',
    recommendedDivision: 'AKYIN MARKETINGS · Digital Marketing',
    outcomeSummary:
      'Standalone Meta Ads, Google Ads, SEO, and landing page conversion services tailored independently to your goals.',
    includedCapabilities: [
      'Standalone Meta Ads & Google Ads management',
      'SEO & landing page conversion optimization',
      'Transparent platform billing directly by client',
    ],
    route: '/pricing',
    ctaLabel: 'Explore Standalone Pricing',
    enquiryServiceValue: 'Meta Ads Management',
  },
  {
    id: 'sf-website-dev',
    label: 'Website Development',
    tagline: 'Conversion-ready business websites & landing pages',
    recommendedDivision: 'AKYIN MARKETINGS · Web & Digital Solutions',
    outcomeSummary:
      'Responsive, fast-loading websites and dedicated service landing pages engineered to convert visitors into qualified enquiries.',
    includedCapabilities: [
      'Mobile-first UI & clean technical SEO structure',
      'Direct enquiry routing & consultation forms',
      'Service catalogue, pricing & trust architecture',
    ],
    route: '/ventures/marketing',
    ctaLabel: 'View Web Solutions',
    enquiryServiceValue: 'Website Development & Conversion Landing Pages',
  },
  {
    id: 'sf-business-strategy',
    label: 'Business Strategy',
    tagline: 'Feasibility, unit economics & structured growth sequencing',
    recommendedDivision: 'AKYIN Ventures · BizNXT & Executive Advisory',
    outcomeSummary:
      'Pragmatic commercial structuring to clarify offers, target markets, sales workflows, and expansion milestones.',
    includedCapabilities: [
      '1-on-1 30-minute IST advisory sessions',
      'Commercial model & funnel diagnostics',
      'Written roadmap of next operational priorities',
    ],
    route: '/advisory',
    ctaLabel: 'Book Strategy Advisory',
    enquiryServiceValue: 'Business Strategy & Commercial Advisory',
  },
  {
    id: 'sf-branding',
    label: 'Branding',
    tagline: 'Identity systems, sales decks & cohesive market positioning',
    recommendedDivision: 'AKYIN MARKETINGS · Creative & Design',
    outcomeSummary:
      'Cohesive visual presentation, brand tone, graphic templates, and commercial pitch decks tailored for India and UAE audiences.',
    includedCapabilities: [
      'Brand visual guidelines & offer creatives',
      'Commercial & investor PPT pitch decks',
      'Catalog, brochure & launch visual kits',
    ],
    route: '/ventures/marketing',
    ctaLabel: 'Explore Creative Scope',
    enquiryServiceValue: 'Branding, Creatives & Pitch Presentations',
  },
  {
    id: 'sf-social-media',
    label: 'Social Media Management',
    tagline: 'Consistent reels, editorial posts & active brand presence',
    recommendedDivision: 'AKYIN MARKETINGS · Creative & Social',
    outcomeSummary:
      'Planned monthly content calendars across Instagram, Facebook, and short-form video to strengthen brand credibility.',
    includedCapabilities: [
      'Monthly content planning & scheduled publishing',
      'Vertical reels & graphic campaign packs',
      'Page hygiene & audience engagement alignment',
    ],
    route: '/ventures/marketing',
    ctaLabel: 'View Social Services',
    enquiryServiceValue: 'Social media management',
  },
  {
    id: 'sf-automotive',
    label: 'Automotive Dealership Marketing',
    tagline: 'Qualified showroom visits & test-drive pipeline engineering',
    recommendedDivision: 'AKYIN Automotive Marketing Division',
    outcomeSummary:
      'Dedicated dealership growth uniting geo-fenced vehicle ads, telephonic/AI lead vetting, and floor sales coaching.',
    includedCapabilities: [
      '16 specialized dealership marketing capabilities',
      'Hot / Warm / Future lead filtering before floor handover',
      '16-year Maruti Suzuki to Audi industry pedigree',
    ],
    route: '/marketing/automotive',
    ctaLabel: 'Visit Automotive Division',
    enquiryServiceValue: 'Automotive Dealership Marketing & Test-Drive Leads',
  },
  {
    id: 'sf-publishing',
    label: 'Publishing & Digital Products',
    tagline: 'Books on Amazon, Google Play & structured digital toolkits',
    recommendedDivision: 'AKYIN Publishing',
    outcomeSummary:
      'Explore published titles on Amazon and practical productivity & finance kits hosted via Gumroad.',
    includedCapabilities: [
      '8 published Amazon book editions',
      '3 Gumroad digital kits & planners',
      'Bulk or institutional publishing enquiries',
    ],
    route: '/ventures/publishing',
    ctaLabel: 'Explore AKYIN Publishing',
    enquiryServiceValue: 'Publishing & Digital Products Enquiry',
  },
  {
    id: 'sf-consulting',
    label: 'Business Consulting',
    tagline: 'Entrepreneurial clarity across India & UAE markets',
    recommendedDivision: 'AKYIN Business Advisory · BizNXT.online',
    outcomeSummary:
      'Direct one-on-one consultations and ongoing operational guidance for founders, dealerships, and trade enterprises.',
    includedCapabilities: [
      'Live IST consultation booking calendar',
      'Direct founder-led commercial review',
      'Cross-sector B2B, retail & marketing insight',
    ],
    route: '/advisory',
    ctaLabel: 'Open Advisory Booking',
    enquiryServiceValue: 'Business Consulting (1-on-1 Advisory)',
  },
  {
    id: 'sf-messaging',
    label: 'Bulk SMS & WhatsApp Business Messaging',
    tagline: 'Direct customer messaging workflows & campaign setup',
    recommendedDivision: 'AKYIN MARKETINGS · Business Messaging',
    outcomeSummary:
      'Bulk SMS Marketing (₹3,000 for 10,000 SMS; ₹0.30/SMS) and WhatsApp Business Messaging Setup (₹4,999 one-time setup + ₹1.50/message billed separately). Provider API activated once credentials are tested.',
    includedCapabilities: [
      'Bulk SMS: ₹3,000 / 10,000 SMS (₹0.30/SMS effective rate)',
      'WhatsApp Setup: ₹4,999 one-time setup fee (separate from ₹1.50/msg usage)',
      'Configurable INR & international quotation pricing',
    ],
    route: '/pricing',
    ctaLabel: 'View Messaging Pricing',
    enquiryServiceValue: 'WhatsApp Business Messaging Setup',
  },
];
