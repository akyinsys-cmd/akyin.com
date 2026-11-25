import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { hashPassword } from './auth';
import {
  AuditLogEntry,
  AvailabilityRule,
  ClientRecord,
  CrmLead,
  DEFAULT_SERVICE_CATEGORIES,
  NotificationSettings,
  ServiceCatalogItem,
  ServiceCategoryRecord,
  SuiteDatabase,
  SuiteUser,
  SuiteWebsiteSettings,
} from './types';

export const CURRENT_SCHEMA_VERSION = 4;

export const MESSAGING_DISCLAIMER =
  'Messaging rates are subject to provider charges, applicable taxes, message category, destination and delivery conditions. Final charges are confirmed in the quotation.';

export function slugifyServiceName(value: string): string {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'service';
}

export function getDataDir(): string {
  return process.env.AKYIN_DATA_DIR
    ? path.resolve(process.env.AKYIN_DATA_DIR)
    : path.resolve(process.cwd(), '.akyin-data');
}

function getDbFilePath(): string {
  return path.join(getDataDir(), 'suite-db.json');
}

function getLegacyLeadsPath(): string {
  return path.join(getDataDir(), 'leads.json');
}

const DEFAULT_AVAILABILITY: AvailabilityRule[] = [
  { day: 'Monday', enabled: true, startTime: '18:00', endTime: '19:00', slotDuration: 30, maximumBookings: 2 },
  { day: 'Tuesday', enabled: true, startTime: '18:00', endTime: '19:00', slotDuration: 30, maximumBookings: 2 },
  { day: 'Wednesday', enabled: true, startTime: '18:00', endTime: '19:00', slotDuration: 30, maximumBookings: 2 },
  { day: 'Thursday', enabled: true, startTime: '18:00', endTime: '19:00', slotDuration: 30, maximumBookings: 2 },
  { day: 'Friday', enabled: true, startTime: '18:00', endTime: '19:00', slotDuration: 30, maximumBookings: 2 },
  { day: 'Saturday', enabled: true, startTime: '18:00', endTime: '19:00', slotDuration: 30, maximumBookings: 2 },
  { day: 'Sunday', enabled: true, startTime: '18:00', endTime: '19:00', slotDuration: 30, maximumBookings: 2 },
];

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  ownerNotificationEmail: process.env.OWNER_NOTIFICATION_EMAIL || 'connect@akyin.com',
  sendClientReceipts: true,
  events: {
    enquiry_received: true,
    lead_assigned: true,
    followup_due: true,
    quotation_created: true,
    quotation_accepted: true,
    quotation_rejected: true,
    payment_received: true,
    payment_failed: true,
    appointment_booked: true,
    appointment_cancelled: true,
    refund_processed: true,
    service_price_updated: true,
    service_added: true,
    subscription_renewal_reminder: true,
  },
};

const DEFAULT_WEBSITE_SETTINGS: SuiteWebsiteSettings = {
  reportedClientsCount: 58,
  advisoryHeadline: 'Your Business. Your Vision. A Clearer Direction.',
  advisorySubheadline:
    'Focused 1-on-1 commercial advisory and business direction sessions with AKYIN Ventures—structured around clarity, unit economics, and practical execution.',
  consultationFee: '₹3,998 (30-min IST Session)',
  advisorySlotDuration: '30',
  advisoryMaxBookings: '2',
  notificationEmail: process.env.OWNER_NOTIFICATION_EMAIL || 'connect@akyin.com',
  contactEmail: 'connect@akyin.com',
  contactPhone: '',
  whatsappNumber: '',
  heroHeadline: 'Building Ideas Into Businesses.',
  heroSubheadline:
    'AKYIN Ventures brings together diverse business initiatives across publishing, marketing, retail, digital technology, B2B commerce and business consulting.',
  footerTagline:
    'A diversified business group working across marketing, publishing, technology, commerce and business solutions.',
  brandWordmark: 'AKYIN',
  logoUrl: '',
  instagramUrl: 'https://www.instagram.com/akyinventures/',
  facebookUrl: 'https://www.facebook.com/profile.php?id=61595204474890',
  xUrl: '',
  youtubeUrl: 'https://youtube.com/@akyinmarketing?si=hgB_tEfczt79H7wW',
  amazonUrl:
    'https://www.amazon.com/stores/Akyin-S/author/B0H6SY7N3T?_encoding=UTF8&pd_rd_w=r7GRE&content-id=amzn1.sym.7e190e19-9f6f-4df8-807a-5a7608594741&pd_rd_wg=EdC74&pd_rd_r=d01ba7b6-b1c7-4bd2-87fb-cbd0fc9deddb&ref=ap_rdr&shoppingPortalEnabled=true&ccs_id=98bb1963-9c8a-4dab-9f1b-d21a6f908208',
  googlePlayBooksUrl:
    'https://play.google.com/store/books/details/Akyin_s_THE_DISCIPLINE_CODE?id=seHuEQAAQBAJ',
  uaeGatewayEnabled: false,
  uaeGatewayNote:
    'UAE / AED international invoices settle via bank transfer or custom payment invoice until AED online checkout is enabled.',
};

/**
 * Exact 11 supplied verified client brands.
 * Never invent names for the remaining 47 clients of the 58 handled.
 */
export function buildInitialClients(nowIso: string): ClientRecord[] {
  const seed: Array<
    Omit<ClientRecord, 'createdAt' | 'updatedAt' | 'status' | 'verified' | 'showInTicker'>
  > = [
    {
      id: 'client-biznxt',
      name: 'BizNXT.online',
      companyName: 'BizNXT.online',
      category: 'Business Guidance & Consulting',
      contactPerson: '',
      email: '',
      phone: '',
      city: '',
      country: 'India',
      websiteUrl: '/ventures/biznxt',
      supportScope: 'Advisory Funnels, Commercial Structure & Digital Positioning',
      summary:
        'Entrepreneurial consulting and strategic guidance platform assisting business founders in evaluating commercial opportunities.',
      wordmarkStyle: 'sans',
      internalShowcaseRoute: '/ventures/biznxt',
    },
    {
      id: 'client-kartigo',
      name: 'Kartigo.online',
      companyName: 'Kartigo.online',
      category: 'B2B Stock Supply',
      contactPerson: '',
      email: '',
      phone: '',
      city: '',
      country: 'India',
      websiteUrl: '/ventures/kartigo',
      supportScope: 'B2B Growth, Buyer Qualification & Platform Strategy',
      summary:
        'Wholesale commercial stock supply and B2B trade marketplace connecting volume buyers with verified inventory.',
      wordmarkStyle: 'sans',
      internalShowcaseRoute: '/ventures/kartigo',
    },
    {
      id: 'client-thrift-store',
      name: 'Thrift Store',
      companyName: 'Thrift Store',
      category: 'Fashion Retail & Thrift',
      contactPerson: '',
      email: '',
      phone: '',
      city: '',
      country: 'India',
      websiteUrl: '/ventures/store',
      supportScope: 'Retail Positioning, Merchandising & Demand Generation',
      summary:
        'Curated value fashion and thrift retail brand supported for digital storefronts and customer acquisition.',
      wordmarkStyle: 'serif',
      internalShowcaseRoute: '/ventures/store',
    },
    {
      id: 'client-budget-bazaar',
      name: 'Budget Bazaar',
      companyName: 'Budget Bazaar',
      category: 'B2C E-commerce',
      contactPerson: '',
      email: '',
      phone: '',
      city: '',
      country: 'India',
      websiteUrl: '/ventures/budget-bazaar',
      supportScope: 'E-commerce Marketing & Customer Demand Campaigns',
      summary:
        'Value-driven consumer retail storefront providing everyday essentials and household goods.',
      wordmarkStyle: 'sans',
      internalShowcaseRoute: '/ventures/budget-bazaar',
    },
    {
      id: 'client-autoclub',
      name: 'AutoClub',
      companyName: 'AutoClub',
      category: 'Automotive Network',
      contactPerson: '',
      email: '',
      phone: '',
      city: '',
      country: 'India',
      websiteUrl: '',
      supportScope: 'Dealership Lead Generation & Sales Team Coaching',
      summary:
        'Multi-brand automotive dealership network supported with test-drive lead generation and floor sales coaching.',
      wordmarkStyle: 'sans',
    },
    {
      id: 'client-arosco',
      name: 'Arosco Ventures',
      companyName: 'Arosco Ventures',
      category: 'Digital Business Solutions',
      contactPerson: '',
      email: '',
      phone: '',
      city: '',
      country: 'India',
      websiteUrl: '',
      supportScope: 'Digital Solutions & Market Positioning',
      summary:
        'Commercial enterprise collaboration focused on digital business solutions and strategic market presence.',
      wordmarkStyle: 'sans',
    },
    {
      id: 'client-mei-cosmetics',
      name: 'MEI Cosmetics',
      companyName: 'MEI Cosmetics',
      category: 'Beauty & Personal Care',
      contactPerson: '',
      email: '',
      phone: '',
      city: '',
      country: 'India',
      websiteUrl: '',
      supportScope: 'Creative Design & Social Media Acquisition',
      summary:
        'Beauty, cosmetics, and personal care brand supported across digital marketing and creative collateral.',
      wordmarkStyle: 'serif',
    },
    {
      id: 'client-krutika-cosmetics',
      name: 'Krutika Cosmetics',
      companyName: 'Krutika Cosmetics',
      category: 'Cosmetics & Beauty',
      contactPerson: '',
      email: '',
      phone: '',
      city: '',
      country: 'India',
      websiteUrl: '',
      supportScope: 'Social Media Management & Paid Campaigns',
      summary:
        'Skincare and cosmetic brand collaboration driving audience reach and structured social media engagement.',
      wordmarkStyle: 'serif',
    },
    {
      id: 'client-nyika-traders',
      name: 'Nyika Traders',
      companyName: 'Nyika Traders',
      category: 'Trading & Distribution',
      contactPerson: '',
      email: '',
      phone: '',
      city: '',
      country: 'India',
      websiteUrl: '',
      supportScope: 'Lead Filtering & Trade Operations',
      summary:
        'Commercial trading enterprise supported with business enquiry vetting and B2B distributor communications.',
      wordmarkStyle: 'sans',
    },
    {
      id: 'client-ns-traders',
      name: 'NS Traders',
      companyName: 'NS Traders',
      category: 'Wholesale & Retail Supply',
      contactPerson: '',
      email: '',
      phone: '',
      city: '',
      country: 'India',
      websiteUrl: '',
      supportScope: 'Enquiry Management & Business Collateral',
      summary:
        'Commercial supply partner collaborating on trade distribution, customer enquiry management, and collateral.',
      wordmarkStyle: 'sans',
    },
    {
      id: 'client-aicalc',
      name: 'AICalc',
      companyName: 'AICalc',
      category: 'AI & Technology',
      contactPerson: '',
      email: '',
      phone: '',
      city: '',
      country: 'India',
      websiteUrl: '/ventures/aicalc',
      supportScope: 'Digital Infrastructure, Technology & Marketing',
      summary:
        'AI-assisted calculation platform solving complex business, finance, and commercial unit math.',
      wordmarkStyle: 'mono',
      internalShowcaseRoute: '/ventures/aicalc',
    },
  ];

  return seed.map((item) => ({
    ...item,
    status: 'Active',
    verified: true,
    showInTicker: true,
    createdAt: nowIso,
    updatedAt: nowIso,
  }));
}

export function buildInitialServiceCategories(nowIso: string): ServiceCategoryRecord[] {
  const descriptions: Record<string, string> = {
    'Automotive Marketing':
      'Showroom lead acquisition, test-drive bookings, dealership campaigns, and commercial automotive sales consulting.',
    'Digital Marketing':
      'Performance advertising across Google Ads & Meta Ads, SEO, landing page conversion optimisation, and digital lead growth.',
    'Social Media Management':
      'Ongoing Instagram, Facebook, and YouTube management, editorial calendars, and social account optimisation.',
    'Creative and Graphic Design':
      'Standalone logo design, brand identity stationery, brochures, catalogues, carousels, and high-CTR thumbnails.',
    'Video and Content Services':
      'Promotional reels production, commercial script writing, copywriting, and creator campaign coordination.',
    'Business Documents and Presentations':
      'Executive PowerPoint decks, investor pitch decks, business reports, Word/PDF formatting, templates, and ATS resumes.',
    'Excel and Reporting Services':
      'Automated Excel workbooks, KPI dashboards, spreadsheet cleaning, and structured monthly reporting.',
    'Messaging and Communication':
      'Transparent Bulk SMS credit packages and WhatsApp Business setup with clear separation from usage charges.',
    'Lead Management and CRM':
      'Standalone enquiry filtering, AI-assisted outbound calling workflows, pipeline management, and callback discipline.',
    'Business Consulting and Training':
      '1-on-1 business advisory sessions, commercial & dealership sales training, personality development, and custom solutions.',
  };

  return DEFAULT_SERVICE_CATEGORIES.map((name, idx) => ({
    id: `cat-${slugifyServiceName(name)}`,
    name,
    slug: slugifyServiceName(name),
    description: descriptions[name] || `${name} standalone commercial services.`,
    sortOrder: idx + 1,
    menuOrder: idx + 1,
    active: true,
    updatedAt: nowIso,
  }));
}

/**
 * Standalone AKYIN Service Marketplace Catalogue across 10 Categories.
 * Every service is standalone (zero Package A/B/C or forced bundles), deduplicated,
 * preserves finalized 2x pricing and exact Bulk SMS & WhatsApp pricing exceptions,
 * and marks unconfigured services as 'custom' without inventing prices.
 */
export function buildInitialServices(nowIso: string): ServiceCatalogItem[] {
  const list: Array<Omit<ServiceCatalogItem, 'updatedAt' | 'active' | 'sortOrder'>> = [
    // =========================================================================
    // 1. AUTOMOTIVE MARKETING
    // =========================================================================
    {
      id: 'srv-automotive',
      slug: 'automotive-marketing',
      name: 'Automotive Dealership Marketing & Sales Strategy',
      category: 'Automotive Marketing',
      description:
        'Specialized showroom marketing, dealer campaign management, automotive sales consulting, and dealership growth strategy backed by 16 years of automotive industry experience.',
      benefits: [
        'Unifies showroom enquiry capture with floor conversion discipline',
        'Separates media acquisition from buyer qualification so sales desks focus on test-drive ready prospects',
        'Grounded in direct showroom experience across mass-market to luxury badges',
      ],
      deliverables: [
        'Showroom marketing & catchment audit',
        'Dealer campaign management roadmap',
        'Automotive sales consulting & follow-up playbook',
        'Dealership growth strategy workshop',
      ],
      workProcess: [
        'Audit current dealership enquiries, ad spend & showroom walk-in ratios',
        'Structure catchment-level vehicle offer & campaign architecture',
        'Align floor executives on test-drive conversion & follow-up SLAs',
      ],
      pricingModel: 'fixed',
      setupFee: 50000,
      recurringFee: 0,
      oneTimePrice: 50000,
      monthlyPrice: 0,
      billingCycle: 'one-time',
      addons: [
        { name: 'Festive / Exchange event campaign', price: 20000 },
        { name: 'Catalog & pre-owned stock rotation', price: 16000 },
      ],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: 'On-site / virtual workshop + campaign sprint',
      revisionLimit: '2 post-training coaching review calls',
      additionalDeliverableCharge: 10000,
      subscriptionDuration: 'One-time dealership growth engagement',
      renewalTerms: 'Optional monthly dealer retainer scoped separately',
      cancellationPolicy: '7 days written notice prior to scheduled workshop',
      menuOrder: 1,
      showInMenu: true,
    },
    {
      id: 'srv-test-drive-leads',
      slug: 'test-drive-lead-generation',
      name: 'Test-Drive Lead Generation',
      category: 'Automotive Marketing',
      description:
        'Geo-fenced dealership campaigns structured specifically to capture confirmed showroom and doorstep test-drive enquiries within your city catchment.',
      benefits: [
        'Captures preferred model, variant & booking date upfront',
        'Targets local vehicle buyers inside showroom driving radius',
        'Direct ad spend stays inside your dealership billing account',
      ],
      deliverables: [
        'Catchment-targeted test-drive ad creative suite',
        'Dedicated model & booking slot lead form',
        'Weekly cost-per-booking attribution log',
      ],
      workProcess: [
        'Select priority models, catchment radius & offer hooks',
        'Launch geo-fenced test-drive creatives & booking capture',
        'Deliver live enquiry notifications to showroom sales desk',
      ],
      pricingModel: 'fixed',
      setupFee: 15000,
      recurringFee: 0,
      oneTimePrice: 15000,
      monthlyPrice: 0,
      billingCycle: 'one-time',
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: '4–5 business days',
      revisionLimit: 'Up to 2 revision rounds',
      additionalDeliverableCharge: 3000,
      subscriptionDuration: 'Standalone campaign setup',
      renewalTerms: 'Optional monthly management',
      cancellationPolicy: 'Prior to campaign publishing',
      menuOrder: 2,
      showInMenu: true,
    },
    {
      id: 'srv-auto-launch-exchange',
      slug: 'dealer-launch-exchange-campaigns',
      name: 'Showroom Launch & Exchange Event Campaigns',
      category: 'Automotive Marketing',
      description:
        'Focused dealership promotion for new model unveilings, weekend exchange melas, and limited-window upgrade bonus drives.',
      benefits: [
        'Builds concentrated footfall ahead of model launches or weekend camps',
        'Captures existing vehicle details for exchange valuation readiness',
      ],
      deliverables: [
        'Pre-launch teaser & exchange bonus creatives',
        'Event-week local awareness & RSVP lead capture',
        'Post-event enquiry summary sheet',
      ],
      workProcess: [
        'Finalize event dates, exchange incentives & OEM creative guidelines',
        'Deploy countdown awareness and RSVP lead forms 10 days prior',
        'Hand over daily confirmed RSVP lists for showroom calling',
      ],
      pricingModel: 'fixed',
      setupFee: 20000,
      recurringFee: 0,
      oneTimePrice: 20000,
      monthlyPrice: 0,
      billingCycle: 'one-time',
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: '5 business days',
      revisionLimit: 'Up to 2 revision rounds',
      additionalDeliverableCharge: 4000,
      subscriptionDuration: 'Standalone event campaign',
      renewalTerms: 'Per event schedule',
      cancellationPolicy: '72 hours prior to campaign kickoff',
      menuOrder: 3,
      showInMenu: true,
    },
    {
      id: 'srv-automotive-retention',
      slug: 'customer-follow-up-management',
      name: 'Customer Follow-Up & Retention Campaigns',
      category: 'Automotive Marketing',
      description:
        'Structured outreach for dealerships and service centers covering periodic service due reminders, catalog stock rotation, and post-enquiry customer follow-up.',
      benefits: [
        'Re-engages dormant buyers and service center databases systematically',
        'Reduces showroom lead leakage through scheduled follow-up cadences',
      ],
      deliverables: [
        'Follow-up messaging templates & campaign cadence',
        'Pre-owned / priority stock highlight ads',
        'Monthly retention & reactivation tracking sheet',
      ],
      workProcess: [
        'Segment existing dealership or service database cleanly',
        'Configure scheduled reminder and offer outreach waves',
        'Track repeat bookings and re-opened enquiries monthly',
      ],
      pricingModel: 'fixed',
      setupFee: 0,
      recurringFee: 16000,
      oneTimePrice: 0,
      monthlyPrice: 16000,
      billingCycle: 'monthly',
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: '5–7 business days rollout',
      revisionLimit: 'Monthly cadence refinement',
      additionalDeliverableCharge: 3000,
      subscriptionDuration: 'Monthly standalone service',
      renewalTerms: 'Auto-renews monthly',
      cancellationPolicy: '7 business days notice',
      menuOrder: 4,
      showInMenu: true,
    },

    // =========================================================================
    // 2. DIGITAL MARKETING
    // =========================================================================
    {
      id: 'srv-lead-generation',
      slug: 'lead-generation',
      name: 'Online Lead Generation Campaigns',
      category: 'Digital Marketing',
      description:
        'Dedicated digital customer acquisition focused strictly on generating fresh, high-intent inbound buyer enquiries across search and social channels.',
      benefits: [
        'Built strictly around measurable cost-per-enquiry and buyer quality',
        'Zero forced retainer bundling—select Meta, Google, or both independently',
        'Full transparency: ad spend stays directly in your own ad account',
      ],
      deliverables: [
        'Audience & keyword intent targeting plan',
        'Conversion ad creative & instant lead form setup',
        'Retargeting funnel & lead source attribution report',
      ],
      workProcess: [
        'Define ideal buyer profile, unit economics & daily enquiry target',
        'Launch segmented ad sets, instant forms & tracking pixels',
        'Optimize weekly bids, creatives & cost per qualified enquiry',
      ],
      pricingModel: 'custom',
      setupFee: 0,
      recurringFee: 0,
      oneTimePrice: 0,
      monthlyPrice: 0,
      billingCycle: 'monthly',
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: '5–7 business days launch',
      revisionLimit: 'Weekly campaign optimization',
      additionalDeliverableCharge: 0,
      subscriptionDuration: 'Quoted per channel & geography',
      renewalTerms: 'Monthly or campaign sprint',
      cancellationPolicy: '7 days notice',
      menuOrder: 5,
      showInMenu: true,
    },
    {
      id: 'srv-meta-ads',
      slug: 'meta-ads-management',
      name: 'Meta Ads Management',
      category: 'Digital Marketing',
      description:
        'Targeted Facebook & Instagram lead generation, instant lead forms, and WhatsApp click-to-chat campaigns with direct client ad billing.',
      benefits: [
        'Continuous A/B testing of hooks, formats & buyer segments',
        'Direct WhatsApp & instant lead form capture without middlemen',
      ],
      deliverables: [
        'Meta Business Manager & pixel audit',
        'Instant lead forms & retargeting audiences',
        'Creative rotation & weekly CPL optimization report',
      ],
      workProcess: [
        'Configure Meta conversion events & custom audiences',
        'Launch cold acquisition and warm retargeting ad sets',
        'Review cost-per-lead and refresh fatigued creatives weekly',
      ],
      pricingModel: 'fixed',
      setupFee: 0,
      recurringFee: 40000,
      oneTimePrice: 0,
      monthlyPrice: 40000,
      billingCycle: 'monthly',
      addons: [{ name: 'Demo / visit booking micro-campaign', price: 15000 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: '5 business days launch',
      revisionLimit: 'Continuous weekly ad set rotation',
      additionalDeliverableCharge: 5000,
      subscriptionDuration: 'Monthly management service',
      renewalTerms: 'Auto-renews monthly',
      cancellationPolicy: '7 days notice before cycle end',
      menuOrder: 6,
      showInMenu: true,
    },
    {
      id: 'srv-google-ads',
      slug: 'google-ads-management',
      name: 'Google Ads Management',
      category: 'Digital Marketing',
      description:
        'High-intent Google Search, Performance Max, and local discovery campaigns capturing prospects actively searching for your products or services.',
      benefits: [
        'Captures ready-to-buy search intent with negative keyword hygiene',
        'Direct Google Ads billing ensures complete spend control',
      ],
      deliverables: [
        'Keyword intent research & negative keyword exclusion list',
        'Search & Performance Max campaign architecture',
        'Conversion tracking & weekly search term optimization',
      ],
      workProcess: [
        'Map commercial buyer keywords & city catchment filters',
        'Configure call, form & WhatsApp conversion tags',
        'Prune wasted clicks weekly and scale top-converting ad groups',
      ],
      pricingModel: 'custom',
      setupFee: 0,
      recurringFee: 0,
      oneTimePrice: 0,
      monthlyPrice: 0,
      billingCycle: 'monthly',
      addons: [{ name: 'Google Business Profile management', price: 6000 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: '5–7 business days launch',
      revisionLimit: 'Weekly keyword & ad copy adjustments',
      additionalDeliverableCharge: 3000,
      subscriptionDuration: 'Monthly management',
      renewalTerms: 'Monthly renewal',
      cancellationPolicy: '7 days notice',
      menuOrder: 7,
      showInMenu: true,
    },
    {
      id: 'srv-seo',
      slug: 'search-engine-optimisation',
      name: 'Search Engine Optimisation & Local SEO',
      category: 'Digital Marketing',
      description:
        'On-page search optimisation, catchment keyword positioning, and Google Business Profile management for sustained organic discovery.',
      benefits: [
        'Improves local Maps visibility and high-intent organic traffic',
        'Aligns page metadata, headings & schema with search intent',
      ],
      deliverables: [
        'Technical & local catchment SEO optimization',
        'Google Business Profile hygiene & weekly updates',
        'Monthly ranking & organic call intent report',
      ],
      workProcess: [
        'Audit crawlability, local citations & page metadata',
        'Optimize priority service URLs & Google Maps profile',
        'Publish updates and monitor search impressions monthly',
      ],
      pricingModel: 'fixed',
      setupFee: 0,
      recurringFee: 12000,
      oneTimePrice: 0,
      monthlyPrice: 12000,
      billingCycle: 'monthly',
      addons: [{ name: 'Google Business Profile add-on', price: 6000 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: 'Ongoing monthly',
      revisionLimit: 'Monthly keyword set expansion',
      additionalDeliverableCharge: 2000,
      subscriptionDuration: 'Monthly service',
      renewalTerms: 'Monthly renewal',
      cancellationPolicy: '7 days notice before cycle renewal',
      menuOrder: 8,
      showInMenu: true,
    },
    {
      id: 'srv-website-dev',
      slug: 'landing-page-optimisation',
      name: 'Landing Page Optimisation & Conversion Websites',
      category: 'Digital Marketing',
      description:
        'Fast, mobile-first conversion landing pages and website architecture engineered to convert paid and organic visitors into structured enquiries.',
      benefits: [
        'Eliminates slow page drop-offs across mobile ad clicks',
        'Connects enquiry forms cleanly with WhatsApp & CRM tracking',
      ],
      deliverables: [
        'Responsive conversion-focused layout & copy hierarchy',
        'Lead capture form, WhatsApp & analytics event setup',
        'Core Web Vitals & clean metadata verification',
      ],
      workProcess: [
        'Review offer, audience objection points & traffic source',
        'Build clean high-contrast landing flow & mobile CTAs',
        'Verify form telemetry & launch speed before campaign kickoff',
      ],
      pricingModel: 'custom',
      setupFee: 0,
      recurringFee: 0,
      oneTimePrice: 0,
      monthlyPrice: 0,
      billingCycle: 'one-time',
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: '2–4 weeks (scope dependent)',
      revisionLimit: '3 full rounds of UI revision',
      additionalDeliverableCharge: 5000,
      subscriptionDuration: 'Project milestone basis',
      renewalTerms: 'Optional monthly maintenance contract',
      cancellationPolicy: 'Milestone pro-rata settlement',
      menuOrder: 9,
      showInMenu: true,
    },
    {
      id: 'srv-digital-marketing',
      slug: 'full-service-growth-marketing',
      name: 'Full-Service Growth Marketing & Lead Management',
      category: 'Digital Marketing',
      description:
        'Standalone full-funnel digital acquisition and ongoing campaign optimisation paired with structured enquiry tracking (ad spend paid directly to Meta/Google).',
      benefits: [
        'Combines acquisition campaigns, creative refreshes & structured pipeline reporting',
        'Selectable independently without compulsory add-ons',
      ],
      deliverables: [
        'Meta & Google campaign architecture',
        'Monthly creative refresh & ad optimisation',
        'Structured enquiry pipeline sheet & executive summary',
      ],
      workProcess: [
        'Onboard brand, ad accounts & target CPA goals in 7–10 business days',
        'Deploy acquisition campaigns and refresh creatives monthly',
        'Deliver executive performance review every month',
      ],
      pricingModel: 'fixed',
      setupFee: 79998,
      recurringFee: 60000,
      oneTimePrice: 79998,
      monthlyPrice: 60000,
      billingCycle: 'monthly',
      addons: [{ name: 'Ad creative boost pack (6 additional creatives)', price: 8000 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: '7–10 business days onboarding',
      revisionLimit: 'Unlimited campaign optimizations',
      additionalDeliverableCharge: 8000,
      subscriptionDuration: 'Monthly service',
      renewalTerms: 'Auto-renews monthly; 15 days notice',
      cancellationPolicy: '15 business days prior to cycle renewal',
      menuOrder: 10,
      showInMenu: true,
    },
    {
      id: 'srv-customer-acquisition',
      slug: 'digital-advertising-campaigns',
      name: 'Digital Advertising & B2B Acquisition Campaigns',
      category: 'Digital Marketing',
      description:
        'Targeted buyer acquisition sprints for commercial services, institutional B2B offers, and regional product launches.',
      benefits: [
        'Focused sprint execution for time-bound offers or new city rollouts',
        'Separates campaign management fees from media budget',
      ],
      deliverables: [
        'Offer positioning & campaign targeting build',
        'Lead capture form & weekly performance tracker',
      ],
      workProcess: [
        'Scope campaign objective, target cities & offer creatives',
        'Publish ads & track initial 7-day lead quality metrics',
        'Refine targeting and close campaign sprint with full report',
      ],
      pricingModel: 'fixed',
      setupFee: 0,
      recurringFee: 16000,
      oneTimePrice: 0,
      monthlyPrice: 16000,
      billingCycle: 'monthly',
      addons: [{ name: 'Corporate / B2B campaign sprint', price: 20000 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: '7 business days rollout',
      revisionLimit: 'Weekly messaging adjustments',
      additionalDeliverableCharge: 3000,
      subscriptionDuration: 'Monthly campaign management',
      renewalTerms: 'Auto-renews monthly',
      cancellationPolicy: '7 business days notice',
      menuOrder: 11,
      showInMenu: false,
    },

    // =========================================================================
    // 3. SOCIAL MEDIA MANAGEMENT
    // =========================================================================
    {
      id: 'srv-social-media',
      slug: 'social-media-management',
      name: 'Instagram & Facebook Management',
      category: 'Social Media Management',
      description:
        'Consistent Instagram and Facebook brand presence covering content calendar planning, post publishing, and account optimisation.',
      benefits: [
        'Maintains active social credibility for inbound buyers checking your brand',
        'Structured monthly calendar approved ahead of scheduling',
      ],
      deliverables: [
        'Monthly content calendar & caption copy',
        'Scheduled Instagram & Facebook posting',
        'Monthly reach & engagement summary',
      ],
      workProcess: [
        'Align visual tone, product priorities & monthly calendar pillars',
        'Prepare posts and obtain streamlined approval',
        'Schedule publishing and deliver monthly performance summary',
      ],
      pricingModel: 'fixed',
      setupFee: 0,
      recurringFee: 16000,
      oneTimePrice: 0,
      monthlyPrice: 16000,
      billingCycle: 'monthly',
      addons: [
        { name: '8 promotional reels/month', price: 20000 },
        { name: '10 graphic creatives/month', price: 8000 },
      ],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: 'Monthly cycle',
      revisionLimit: '2 feedback rounds per calendar',
      additionalDeliverableCharge: 2000,
      subscriptionDuration: 'Monthly service',
      renewalTerms: 'Auto-renews monthly',
      cancellationPolicy: '7 days prior to next month billing',
      menuOrder: 12,
      showInMenu: true,
    },
    {
      id: 'srv-youtube-management',
      slug: 'youtube-channel-management',
      name: 'YouTube Channel Management',
      category: 'Social Media Management',
      description:
        'End-to-end YouTube channel optimisation, video SEO titles/descriptions, playlist architecture, and consistent upload cadence.',
      benefits: [
        'Turns product walkthroughs and founder insights into searchable evergreen video assets',
        'Pairs seamlessly with YouTube Thumbnail Design and Script Writing',
      ],
      deliverables: [
        'Channel metadata, keywords & playlist structuring',
        'Video upload formatting, tags & end-screen setup',
        'Monthly watch-time & CTR review',
      ],
      workProcess: [
        'Audit channel structure, search keywords & audience retention gaps',
        'Standardize upload checklists, descriptions & CTA links',
        'Publish consistently and track CTR and subscriber trends monthly',
      ],
      pricingModel: 'custom',
      setupFee: 0,
      recurringFee: 0,
      oneTimePrice: 0,
      monthlyPrice: 0,
      billingCycle: 'monthly',
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: 'Ongoing monthly or setup sprint',
      revisionLimit: 'Per publishing schedule',
      additionalDeliverableCharge: 0,
      subscriptionDuration: 'Scoped per upload frequency',
      renewalTerms: 'Monthly',
      cancellationPolicy: '7 days notice',
      menuOrder: 13,
      showInMenu: true,
    },
    {
      id: 'srv-social-content-planning',
      slug: 'social-media-content-planning',
      name: 'Content Calendar & Social Post Planning',
      category: 'Social Media Management',
      description:
        'Strategic monthly content calendar management, topic ideation, post creation briefs, and bio/account optimisation.',
      benefits: [
        'Gives internal teams a crisp roadmap of what to shoot and publish every week',
        'Eliminates inconsistent ad-hoc posting across social handles',
      ],
      deliverables: [
        '30-day multi-platform content calendar',
        'Post topic hooks, format specs & caption angles',
        'Profile bio & highlight optimization checklist',
      ],
      workProcess: [
        'Audit business priorities, offers & seasonal dates',
        'Build a 30-day structured posting calendar with creative briefs',
        'Refine next month plan based on top-performing formats',
      ],
      pricingModel: 'custom',
      setupFee: 0,
      recurringFee: 0,
      oneTimePrice: 0,
      monthlyPrice: 0,
      billingCycle: 'monthly',
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: '3–5 business days',
      revisionLimit: '2 calendar adjustment rounds',
      additionalDeliverableCharge: 0,
      subscriptionDuration: 'One-time or monthly',
      renewalTerms: 'Monthly',
      cancellationPolicy: '7 days notice',
      menuOrder: 14,
      showInMenu: true,
    },

    // =========================================================================
    // 4. CREATIVE AND GRAPHIC DESIGN
    // =========================================================================
    {
      id: 'srv-creative-logo',
      slug: 'logo-design',
      name: 'Logo and Branding Design',
      category: 'Creative and Graphic Design',
      description:
        'Business logo design, clean vector variations, basic brand identity guidelines, brand colour & typography suggestions, and export-ready files.',
      benefits: [
        'Clean, scalable vector branding tailored for digital storefronts and print stationery',
        'Order as a single one-time project or ongoing brand creative support',
      ],
      deliverables: [
        'Business logo design',
        'Logo variations',
        'Basic brand identity',
        'Brand colour and typography suggestions',
        'Export-ready files (SVG, PNG, PDF)',
      ],
      workProcess: [
        'Collect brand brief, target market positioning & style references',
        'Present initial logo directions and colour/font pairings',
        'Refine selected mark across revisions and deliver export-ready files',
      ],
      pricingModel: 'fixed',
      setupFee: 6000,
      recurringFee: 10000,
      oneTimePrice: 6000,
      monthlyPrice: 10000,
      billingCycle: 'one-time',
      addons: [{ name: 'Additional concept direction & vector master pack', price: 2000 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: '3–5 business days',
      revisionLimit: '3 rounds of design revisions included',
      additionalDeliverableCharge: 1000,
      subscriptionDuration: 'Standalone project or monthly brand creative retainer',
      renewalTerms: 'Monthly subscription auto-renews; cancel anytime 7 days prior',
      cancellationPolicy: 'Cancel subscription anytime with 7 days notice',
      menuOrder: 15,
      showInMenu: true,
    },
    {
      id: 'srv-creative-thumbnails',
      slug: 'youtube-thumbnail-design',
      name: 'YouTube Thumbnail & Social Creative Design',
      category: 'Creative and Graphic Design',
      description:
        'High-CTR YouTube thumbnails, Instagram promotional thumbnails, Facebook creatives, and sharp advertising graphics built for click performance.',
      benefits: [
        'Designed for instant mobile legibility and strong visual contrast',
        'Flexible 5-pack standalone order or 15-creative monthly plan',
      ],
      deliverables: [
        'YouTube thumbnails',
        'Instagram promotional thumbnails',
        'Facebook creatives',
        'Advertising creatives',
        'Custom promotional graphics',
      ],
      workProcess: [
        'Receive video title, hook text, brand assets & photos',
        'Design high-contrast compositions optimized for small viewports',
        'Deliver final PNG/JPG creatives with requested revision tweaks',
      ],
      pricingModel: 'fixed',
      setupFee: 3000,
      recurringFee: 8000,
      oneTimePrice: 3000,
      monthlyPrice: 8000,
      billingCycle: 'one-time',
      addons: [{ name: 'Express 12-hour turnaround add-on', price: 1500 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: '24–48 hours per batch',
      revisionLimit: '2 revisions per creative',
      additionalDeliverableCharge: 500,
      subscriptionDuration: 'Standalone 5-pack or monthly 15-creative plan',
      renewalTerms: 'Auto-renews monthly on renewal date',
      cancellationPolicy: 'Cancel anytime before monthly renewal',
      menuOrder: 16,
      showInMenu: true,
    },
    {
      id: 'srv-branding',
      slug: 'brand-identity-stationery-design',
      name: 'Business Card, Letterhead & Brand Stationery Design',
      category: 'Creative and Graphic Design',
      description:
        'Print-ready business card design, official corporate letterhead design, and cohesive visual brand identity templates.',
      benefits: [
        'Print-ready CMYK & digital PDF deliverables ready for local offset or digital printing',
        'Consistent typography and layout across sales cards and correspondence',
      ],
      deliverables: [
        'Business card design (print & digital)',
        'Official letterhead design (Word & PDF)',
        'Brand visual typography & palette kit',
      ],
      workProcess: [
        'Align existing logo, contact details & brand colours',
        'Draft clean minimalist front/back business card & letterhead layouts',
        'Finalize revisions and export press-ready files',
      ],
      pricingModel: 'fixed',
      setupFee: 6000,
      recurringFee: 0,
      oneTimePrice: 6000,
      monthlyPrice: 0,
      billingCycle: 'one-time',
      addons: [{ name: '10 branded graphic templates', price: 8000 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: '5–7 business days',
      revisionLimit: '3 revision rounds included',
      additionalDeliverableCharge: 1500,
      subscriptionDuration: 'One-time project delivery',
      renewalTerms: 'N/A (One-time)',
      cancellationPolicy: 'Cancellation prior to second proofing round',
      menuOrder: 17,
      showInMenu: true,
    },
    {
      id: 'srv-company-profile-brochure',
      slug: 'brochure-company-profile-design',
      name: 'Company Profile, Brochure, Flyer & Product Catalogue Design',
      category: 'Creative and Graphic Design',
      description:
        'Structured graphic layout for corporate company profiles, multi-fold brochures, promotional flyers, posters, and multi-SKU product catalogues.',
      benefits: [
        'Turns complex SKU specs or company credentials into effortless visual reading',
        'Supplied in both print-ready high-DPI PDF and lightweight WhatsApp share PDF',
      ],
      deliverables: [
        'Company profile or multi-page brochure design',
        'Flyer, poster or product catalogue layout',
        'Print & WhatsApp-optimized PDF exports',
      ],
      workProcess: [
        'Organize company copy, product specs & high-res imagery',
        'Design clean grid typography and product hierarchy',
        'Proof pages across revision cycles and deliver print & web PDFs',
      ],
      pricingModel: 'custom',
      setupFee: 0,
      recurringFee: 0,
      oneTimePrice: 0,
      monthlyPrice: 0,
      billingCycle: 'one-time',
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: '5–10 business days (page count dependent)',
      revisionLimit: '2–3 proofing cycles',
      additionalDeliverableCharge: 0,
      subscriptionDuration: 'Scoped by page count',
      renewalTerms: 'N/A (One-time)',
      cancellationPolicy: 'Milestone basis',
      menuOrder: 18,
      showInMenu: true,
    },
    {
      id: 'srv-social-post-carousel',
      slug: 'social-media-post-carousel-design',
      name: 'Social Media Post, Carousel & YouTube Channel Branding',
      category: 'Creative and Graphic Design',
      description:
        'Custom social media post design, multi-slide educational carousel posts, ad creative design, and unified YouTube channel banner branding.',
      benefits: [
        'Boosts saves and shares with structured swipeable carousel storytelling',
        'Consistent channel art across social profiles and ad placements',
      ],
      deliverables: [
        'Custom social media static & carousel post designs',
        'Ad creative banners sized for feed & story placements',
        'YouTube channel banner, avatar & watermark branding',
      ],
      workProcess: [
        'Review offer message, copy points & target placement dimensions',
        'Design cohesive post, carousel or channel branding pack',
        'Deliver layered exports sized for Instagram, Facebook & YouTube',
      ],
      pricingModel: 'custom',
      setupFee: 0,
      recurringFee: 0,
      oneTimePrice: 0,
      monthlyPrice: 0,
      billingCycle: 'one-time',
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: '3–5 business days',
      revisionLimit: '2 revision rounds per creative batch',
      additionalDeliverableCharge: 0,
      subscriptionDuration: 'One-time batch or monthly',
      renewalTerms: 'Optional monthly',
      cancellationPolicy: 'Prior to final batch sign-off',
      menuOrder: 19,
      showInMenu: true,
    },

    // =========================================================================
    // 5. VIDEO AND CONTENT SERVICES
    // =========================================================================
    {
      id: 'srv-creative-scriptwriting',
      slug: 'script-writing',
      name: 'Script Writing',
      category: 'Video and Content Services',
      description:
        'Strategic conversion scripts for promotional videos, vertical reels, YouTube explainers, paid advertisements, and business presentations.',
      benefits: [
        'Hooks viewers inside the first 3 seconds with clear commercial storytelling',
        'Structured voiceover cues and scene beats ready for effortless shooting',
      ],
      deliverables: [
        'Promotional video scripts',
        'Reels and short-video scripts',
        'YouTube scripts',
        'Advertisement scripts',
        'Business presentation scripts',
      ],
      workProcess: [
        'Define product benefits, target audience & video runtime',
        'Draft structured hook, proof points & closing CTA script',
        'Refine pacing and phrasing across included revision passes',
      ],
      pricingModel: 'fixed',
      setupFee: 4000,
      recurringFee: 12000,
      oneTimePrice: 4000,
      monthlyPrice: 12000,
      billingCycle: 'one-time',
      addons: [{ name: 'Teleprompter cues & voiceover pacing guide', price: 1000 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: '2–3 business days',
      revisionLimit: '2 revisions per script',
      additionalDeliverableCharge: 800,
      subscriptionDuration: 'Standalone 3-script pack or monthly 12-script retainer',
      renewalTerms: 'Renews monthly; roll-over unused scripts within 30 days',
      cancellationPolicy: 'Cancel anytime with 7 days advance notice',
      menuOrder: 20,
      showInMenu: true,
    },
    {
      id: 'srv-reels-video-production',
      slug: 'promotional-video-reels',
      name: 'Promotional Video & Reels Production',
      category: 'Video and Content Services',
      description:
        'High-retention vertical promotional reels, dynamic captions, product cutdowns, and multi-ratio social video edits.',
      benefits: [
        'Turns raw showroom or studio clips into polished vertical brand stories',
        'Formatted natively for Instagram Reels, YouTube Shorts & Meta video ads',
      ],
      deliverables: [
        'Promotional reels edit suite (up to 8 reels/pack)',
        'Motion typography captions & clean sound pacing',
        'Multi-aspect ratio exports (9:16 & 1:1)',
      ],
      workProcess: [
        'Receive raw product footage or shoot brief & hook script',
        'Edit tight vertical cutdowns with visual callouts and captions',
        'Review timing/text revisions and deliver export-ready MP4 files',
      ],
      pricingModel: 'fixed',
      setupFee: 20000,
      recurringFee: 0,
      oneTimePrice: 20000,
      monthlyPrice: 0,
      billingCycle: 'one-time',
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: '5–7 business days per batch',
      revisionLimit: '2 edit cut revisions per video',
      additionalDeliverableCharge: 2500,
      subscriptionDuration: 'Standalone video edit batch',
      renewalTerms: 'Optional monthly batch',
      cancellationPolicy: 'Prior to assembly cut delivery',
      menuOrder: 21,
      showInMenu: true,
    },
    {
      id: 'srv-content-copywriting',
      slug: 'content-copywriting',
      name: 'Content Copywriting & Video Creative Coordination',
      category: 'Video and Content Services',
      description:
        'Persuasive commercial copywriting for web pages, brochures, email campaigns, plus end-to-end creator and video shoot coordination.',
      benefits: [
        'Sharp, jargon-free B2B and consumer copywriting tailored to Indian & UAE buyers',
        'Coordinates creators, talking points & shoot deliverables cleanly',
      ],
      deliverables: [
        'Website, landing page & ad copywriting',
        'Creator brief & video shoot coordination plan',
        'Proofed publication-ready copy deck',
      ],
      workProcess: [
        'Gather product USP, objections & buyer tone requirements',
        'Draft structured headlines, body copy & creator briefs',
        'Coordinate feedback edits and approve final messaging',
      ],
      pricingModel: 'custom',
      setupFee: 0,
      recurringFee: 0,
      oneTimePrice: 0,
      monthlyPrice: 0,
      billingCycle: 'one-time',
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: '3–5 business days',
      revisionLimit: '2 copy revision passes',
      additionalDeliverableCharge: 0,
      subscriptionDuration: 'Quoted by scope & shoot volume',
      renewalTerms: 'Per project or monthly',
      cancellationPolicy: 'Milestone basis',
      menuOrder: 22,
      showInMenu: true,
    },

    // =========================================================================
    // 6. BUSINESS DOCUMENTS AND PRESENTATIONS
    // =========================================================================
    {
      id: 'srv-creative-ppt',
      slug: 'presentation-design',
      name: 'PowerPoint Presentation & Pitch Deck Design',
      category: 'Business Documents and Presentations',
      description:
        'Basic PPT, Professional PPT, Investor pitch decks, Company profile PPTs, and Sales presentations structured with crisp executive hierarchy.',
      benefits: [
        'Transforms dense raw notes into boardroom-ready slide storytelling',
        'Editable PowerPoint (.pptx) + clean shareable PDF included',
      ],
      deliverables: [
        'Basic or Professional PowerPoint presentation',
        'Investor pitch deck & Company profile PPT',
        'Sales & marketing presentation slides',
        'Editable PPTX + print/email PDF formats',
      ],
      workProcess: [
        'Review raw outline, financial points & brand identity',
        'Structure slide narrative flow and key visual layouts',
        'Refine data callouts across 3 review cycles and export master files',
      ],
      pricingModel: 'fixed',
      setupFee: 6000,
      recurringFee: 14000,
      oneTimePrice: 6000,
      monthlyPrice: 14000,
      billingCycle: 'one-time',
      addons: [{ name: 'Animated slide transitions & interactive PDF deck', price: 2500 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: '3–5 business days',
      revisionLimit: '3 slide deck review cycles',
      additionalDeliverableCharge: 600,
      subscriptionDuration: 'Standalone 12-slide deck or monthly slide update retainer',
      renewalTerms: 'Renews monthly for active sales & investor updates',
      cancellationPolicy: 'Cancel anytime before next billing date',
      menuOrder: 23,
      showInMenu: true,
    },
    {
      id: 'srv-business-reports-docs',
      slug: 'business-reports-formatting',
      name: 'Business Reports, Word & PDF Formatting',
      category: 'Business Documents and Presentations',
      description:
        'Clean formatting and layout engineering for corporate business reports, Word documents (.docx), executive dossiers, and interactive PDFs.',
      benefits: [
        'Standardizes headings, tables, page numbers & visual alignment effortlessly',
        'Eliminates broken layouts across Word and PDF viewers',
      ],
      deliverables: [
        'Structured business report layout',
        'Word document (.docx) style & template cleanup',
        'Clean bookmarked PDF formatting',
      ],
      workProcess: [
        'Inspect raw draft documents, tables & brand style preferences',
        'Apply consistent typographic hierarchy, tables & headers',
        'Deliver both editable DOCX and clean finalized PDF',
      ],
      pricingModel: 'custom',
      setupFee: 0,
      recurringFee: 0,
      oneTimePrice: 0,
      monthlyPrice: 0,
      billingCycle: 'one-time',
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: '2–4 business days',
      revisionLimit: '2 layout proofing rounds',
      additionalDeliverableCharge: 0,
      subscriptionDuration: 'Scoped by page count',
      renewalTerms: 'N/A (One-time)',
      cancellationPolicy: 'Prior to final export',
      menuOrder: 24,
      showInMenu: true,
    },
    {
      id: 'srv-quotation-invoice-templates',
      slug: 'quotation-invoice-templates',
      name: 'Quotation & Invoice Templates',
      category: 'Business Documents and Presentations',
      description:
        'Custom-branded commercial quotation and GST/UAE tax invoice templates built cleanly in Excel, Word, or fillable PDF.',
      benefits: [
        'Automatic subtotal, discount & tax formulas reduce manual billing errors',
        'Projects immediate commercial credibility with corporate buyers',
      ],
      deliverables: [
        'Custom branded Quotation template (with GST/VAT toggles)',
        'Automated commercial Invoice layout (Excel / Word / PDF)',
      ],
      workProcess: [
        'Collect company logo, bank details, tax rules & payment terms',
        'Build clean layout with automatic calculation fields',
        'Test printout margins & PDF export formatting before handover',
      ],
      pricingModel: 'custom',
      setupFee: 0,
      recurringFee: 0,
      oneTimePrice: 0,
      monthlyPrice: 0,
      billingCycle: 'one-time',
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: '2–3 business days',
      revisionLimit: '2 template adjustments',
      additionalDeliverableCharge: 0,
      subscriptionDuration: 'One-time deliverable',
      renewalTerms: 'N/A (One-time)',
      cancellationPolicy: 'Prior to final template delivery',
      menuOrder: 25,
      showInMenu: true,
    },
    {
      id: 'srv-resume-ats-formatting',
      slug: 'ats-resume-formatting',
      name: 'Resume & ATS Resume Formatting',
      category: 'Business Documents and Presentations',
      description:
        'Clean, recruiter-readable executive resumes and Applicant Tracking System (ATS) compliant CV formatting tailored for clarity and impact.',
      benefits: [
        'ATS-safe clean structure without broken multi-column parser traps',
        'Highlights measurable business outcomes & crisp role progression',
      ],
      deliverables: [
        'ATS-friendly formatted Resume (.docx + .pdf)',
        'Executive headline & achievement bullet structuring',
      ],
      workProcess: [
        'Review current CV, career target roles & key achievements',
        'Reformat typography, section keywords & impact phrasing',
        'Deliver ATS-tested Word and PDF editions',
      ],
      pricingModel: 'custom',
      setupFee: 0,
      recurringFee: 0,
      oneTimePrice: 0,
      monthlyPrice: 0,
      billingCycle: 'one-time',
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: '2–3 business days',
      revisionLimit: '2 content & layout revisions',
      additionalDeliverableCharge: 0,
      subscriptionDuration: 'One-time career service',
      renewalTerms: 'N/A (One-time)',
      cancellationPolicy: 'Prior to finalized draft delivery',
      menuOrder: 26,
      showInMenu: true,
    },
    {
      id: 'srv-creative-support',
      slug: 'business-documentation-support',
      name: 'Additional Business Documentation Support',
      category: 'Business Documents and Presentations',
      description:
        'Flexible operational assistance for commercial data entry, business document formatting, basic customer enquiry handling, and custom documentation.',
      benefits: [
        'Offloads repetitive commercial documentation onto structured specialists',
        'Bookable as a 10-hour sprint or 25-hour monthly support allocation',
      ],
      deliverables: [
        'Structured data entry & cleanup',
        'Commercial document formatting',
        'Basic customer enquiry sorting & CRM entry',
        'Custom business documentation',
      ],
      workProcess: [
        'Define task checklist, turnaround expectations & file formats',
        'Execute tasks with QA checks in 10-hr sprints or monthly blocks',
        'Deliver verified spreadsheets & formatted documentation',
      ],
      pricingModel: 'fixed',
      setupFee: 4000,
      recurringFee: 8000,
      oneTimePrice: 4000,
      monthlyPrice: 8000,
      billingCycle: 'one-time',
      addons: [{ name: 'Priority weekend operational coverage block', price: 3000 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: 'Ongoing according to agreed schedule',
      revisionLimit: 'Quality-checked output with 2 correction rounds',
      additionalDeliverableCharge: 500,
      subscriptionDuration: 'Standalone 10-hr sprint or 25-hr monthly retainer',
      renewalTerms: 'Renews monthly; unused hours do not roll over',
      cancellationPolicy: 'Cancel anytime before monthly renewal',
      menuOrder: 27,
      showInMenu: false,
    },

    // =========================================================================
    // 7. EXCEL AND REPORTING SERVICES
    // =========================================================================
    {
      id: 'srv-creative-excel',
      slug: 'excel-reporting',
      name: 'Excel Workbooks, Dashboards & Automation',
      category: 'Excel and Reporting Services',
      description:
        'Basic & Professional Excel workbooks, executive Excel dashboards, automated calculation formulas, sales trackers, and inventory sheets.',
      benefits: [
        'Replaces error-prone manual totals with dynamic XLOOKUP/Pivot/formula models',
        'Built cleanly for non-technical managers to filter daily numbers immediately',
      ],
      deliverables: [
        'Basic or Professional Excel workbook',
        'Interactive Excel KPI dashboard',
        'Sales, lead & inventory tracking templates',
        'Custom automated calculation formulas',
      ],
      workProcess: [
        'Review source data layout, KPI definitions & team workflow',
        'Engineer clean formulas, data validation dropdowns & visual charts',
        'Walk through usage and complete 2 formula/layout adjustments',
      ],
      pricingModel: 'fixed',
      setupFee: 5000,
      recurringFee: 10000,
      oneTimePrice: 5000,
      monthlyPrice: 10000,
      billingCycle: 'one-time',
      addons: [{ name: 'Google Sheets & CSV automated sync integration', price: 3000 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: '3–4 business days',
      revisionLimit: '2 post-delivery formula / layout adjustments',
      additionalDeliverableCharge: 1000,
      subscriptionDuration: 'Standalone custom workbook or monthly maintenance retainer',
      renewalTerms: 'Renews monthly for weekly report refreshes',
      cancellationPolicy: 'Cancel anytime with 7 days notice',
      menuOrder: 28,
      showInMenu: true,
    },
    {
      id: 'srv-data-cleaning',
      slug: 'data-cleaning-structuring',
      name: 'Data Cleaning & Spreadsheet Structuring',
      category: 'Excel and Reporting Services',
      description:
        'Thorough deduplication, phone/email standardization, scattered tab consolidation, and structured spreadsheet hygiene.',
      benefits: [
        'Prepares messy historical lead or customer exports for accurate campaigns and reporting',
        'Eliminates duplicate rows, inconsistent date formats & broken formulas',
      ],
      deliverables: [
        'Deduplicated & standardized XLSX / CSV master file',
        'Data validation rules & clean column taxonomy',
      ],
      workProcess: [
        'Inspect raw exports for duplicates, formatting drift & missing keys',
        'Clean, normalize and verify record accuracy',
        'Deliver structured master file ready for CRM or reporting',
      ],
      pricingModel: 'custom',
      setupFee: 0,
      recurringFee: 0,
      oneTimePrice: 0,
      monthlyPrice: 0,
      billingCycle: 'one-time',
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: '2–5 business days (volume dependent)',
      revisionLimit: '1 verification & correction pass',
      additionalDeliverableCharge: 0,
      subscriptionDuration: 'Scoped per record volume',
      renewalTerms: 'N/A (One-time)',
      cancellationPolicy: 'Prior to final workbook handover',
      menuOrder: 29,
      showInMenu: true,
    },
    {
      id: 'srv-monthly-performance-reporting',
      slug: 'monthly-performance-reporting',
      name: 'Monthly Performance & MIS Reporting',
      category: 'Excel and Reporting Services',
      description:
        'Recurring executive MIS & commercial performance reporting consolidating lead flow, campaign spend, conversion ratios, and unit margins.',
      benefits: [
        'Gives founders one trustworthy monthly scorecard across sales & marketing',
        'Reduces weekly manual spreadsheet compilation time',
      ],
      deliverables: [
        'Standardized monthly MIS workbook & summary deck',
        'Lead-to-sale funnel conversion & ROI breakdown',
      ],
      workProcess: [
        'Connect monthly CSV exports from CRM, ads & billing sheets',
        'Compile clean KPI views, variance notes & action highlights',
        'Deliver verified monthly report on a fixed calendar date',
      ],
      pricingModel: 'custom',
      setupFee: 0,
      recurringFee: 0,
      oneTimePrice: 0,
      monthlyPrice: 0,
      billingCycle: 'monthly',
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: 'Monthly fixed calendar delivery',
      revisionLimit: 'Monthly KPI layout refinement',
      additionalDeliverableCharge: 0,
      subscriptionDuration: 'Monthly service',
      renewalTerms: 'Monthly',
      cancellationPolicy: '7 days notice',
      menuOrder: 30,
      showInMenu: true,
    },

    // =========================================================================
    // 8. MESSAGING AND COMMUNICATION
    // =========================================================================
    {
      id: 'srv-bulk-sms',
      slug: 'bulk-sms',
      name: 'Bulk SMS Marketing',
      category: 'Messaging and Communication',
      description:
        'Promotional & transactional bulk SMS campaigns (₹3,000 for 10,000 SMS credits; ₹0.30 effective rate; additional credits calculated using admin-configured rate). Provider API integration is configured per client upon provider credential activation.',
      benefits: [
        'Clear credit transparency: ₹3,000 fixed starter bundle includes 10,000 SMS credits (₹0.30/SMS)',
        'Additional SMS usage calculated dynamically using admin-configured rate',
        'Supports scheduled broadcasts, contact uploads & provider delivery logs',
      ],
      deliverables: [
        'Bulk promotional SMS',
        'Transactional SMS, if supported by the selected provider',
        'Contact list upload',
        'Campaign scheduling',
        'Delivery reports, where supported',
        'SMS credit usage tracking',
        'Campaign history',
      ],
      workProcess: [
        'Complete DLT / telecom sender ID & template compliance review',
        'Provision 10,000 starter SMS credits upon quotation approval',
        'Upload recipient lists, schedule campaigns & monitor usage reports',
      ],
      pricingModel: 'fixed',
      setupFee: 0,
      recurringFee: 3000,
      packagePrice: 3000,
      oneTimePrice: 3000,
      monthlyPrice: 0,
      includedUnits: 10000,
      unitLabel: 'SMS',
      unitRate: 0.3,
      additionalUnitRate: 0.3,
      billingCycle: 'one-time',
      addons: [{ name: 'Additional 10,000 SMS credit block', price: 3000 }],
      internationalPricing: {
        aed: { setupFee: 0, packagePrice: 140, unitRate: 0.015, additionalUnitRate: 0.015 },
        usd: { setupFee: 0, packagePrice: 39, unitRate: 0.004, additionalUnitRate: 0.004 },
        notes: 'Configurable international SMS pricing per destination route.',
      },
      disclaimer: MESSAGING_DISCLAIMER,
      integrationConfigured: false,
      transactionalSmsEnabled: false,
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: 'Upon DLT/provider onboarding & credential setup',
      revisionLimit: 'Sender ID and template approval guidance',
      additionalDeliverableCharge: 3000,
      subscriptionDuration: 'Credit bundle (validity subject to provider terms)',
      renewalTerms: 'Recharge as needed',
      cancellationPolicy: 'Non-refundable once credits are provisioned with telecom operator',
      menuOrder: 31,
      showInMenu: true,
    },
    {
      id: 'srv-whatsapp-messaging',
      slug: 'whatsapp-business-setup',
      name: 'WhatsApp Business Messaging Setup',
      category: 'Messaging and Communication',
      description:
        'Structured WhatsApp Business Messaging onboarding and workflow configuration. One-time setup fee (₹4,999) is billed strictly separate from message usage charges (₹1.50 per message). Provider API integration is pending client provider credentials & verification.',
      benefits: [
        '100% transparent billing separation: ₹4,999 one-time setup fee kept distinct from ₹1.50/message usage',
        'Clean business profile configuration & structured customer reply workflows',
        'Trackable campaign and per-message billing visibility',
      ],
      deliverables: [
        'WhatsApp Business setup assistance',
        'Business profile configuration',
        'Messaging workflow setup',
        'Customer communication setup',
        'Campaign and message tracking, where supported',
        'Usage and billing reports',
      ],
      workProcess: [
        'Verify Meta Business Manager & phone number eligibility',
        'Configure official business profile, catalog & message workflows',
        'Activate tracked messaging usage billed strictly separately at ₹1.50/msg',
      ],
      pricingModel: 'fixed',
      setupFee: 4999,
      recurringFee: 0,
      packagePrice: 0,
      oneTimePrice: 4999,
      monthlyPrice: 0,
      includedUnits: 0,
      unitLabel: 'message',
      unitRate: 1.5,
      additionalUnitRate: 1.5,
      billingCycle: 'one-time',
      addons: [{ name: '1,000 WhatsApp messages usage allocation', price: 1500 }],
      internationalPricing: {
        aed: { setupFee: 225, packagePrice: 0, unitRate: 0.07, additionalUnitRate: 0.07 },
        usd: { setupFee: 65, packagePrice: 0, unitRate: 0.02, additionalUnitRate: 0.02 },
        notes: 'Setup fee remains separate from per-message international Meta/BSP rates.',
      },
      disclaimer: MESSAGING_DISCLAIMER,
      integrationConfigured: false,
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: '5–7 business days setup (subject to Meta/BSP verification)',
      revisionLimit: '2 workflow revision cycles',
      additionalDeliverableCharge: 1500,
      subscriptionDuration: 'One-time onboarding + pay-as-you-go message usage',
      renewalTerms: 'Usage billed as consumed or prepaid per campaign quota',
      cancellationPolicy: 'Setup fee non-refundable once BSP onboarding initiated',
      menuOrder: 32,
      showInMenu: true,
    },

    // =========================================================================
    // 9. LEAD MANAGEMENT AND CRM
    // =========================================================================
    {
      id: 'srv-lead-gen',
      slug: 'lead-filtering',
      name: 'Lead Filtering & Qualification',
      category: 'Lead Management and CRM',
      description:
        'Structured telephonic and AI-assisted vetting of existing inbound leads before sales floor handover so sales executives spend time exclusively with verified buyers.',
      benefits: [
        'Screens out cold clicks & wrong numbers before they reach your sales team',
        'Captures product interest, budget readiness, purchase window & booking slot',
        'Delivers structured Hot, Warm & Future Follow-up classification daily',
      ],
      deliverables: [
        'AI-assisted & human outbound vetting of existing enquiries (up to 1,000 mins/month)',
        'Budget, timeline & intent verification',
        'Hot / Warm / Future Lead status tagging & daily Excel reports',
      ],
      workProcess: [
        'Configure custom qualification criteria, script & callback routing in 5 business days',
        'Initiate outbound verification calls on incoming enquiries immediately',
        'Deliver Daily Excel pipeline log & Hot buyer escalations',
      ],
      pricingModel: 'fixed',
      setupFee: 29998,
      recurringFee: 24000,
      oneTimePrice: 29998,
      monthlyPrice: 24000,
      billingCycle: 'monthly',
      addons: [{ name: 'CRM pipeline reporting management', price: 10000 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: '5 business days setup',
      revisionLimit: 'Continuous qualification playbook updates',
      additionalDeliverableCharge: 6000,
      subscriptionDuration: 'Monthly service',
      renewalTerms: 'Auto-renews monthly',
      cancellationPolicy: '15 business days notice',
      menuOrder: 33,
      showInMenu: true,
    },
    {
      id: 'srv-crm-pipeline',
      slug: 'crm-lead-pipeline-management',
      name: 'CRM & Lead Pipeline Management',
      category: 'Lead Management and CRM',
      description:
        'Disciplined enquiry tracking, duplicate cleanup, stage updates, and daily Excel / pipeline summaries operated internally by AKYIN.',
      benefits: [
        'Eliminates forgotten callbacks and scattered Excel sheets',
        'Operated as a managed agency service—zero SaaS software overhead',
      ],
      deliverables: [
        'Enquiry stage hygiene & duplicate cleanup',
        'Priority callback routing for Hot & scheduled demos',
        'Daily Excel reporting sheets & monthly pipeline audit',
      ],
      workProcess: [
        'Standardize enquiry stages & ownership rules across channels',
        'Clean duplicates and update buyer progression statuses daily',
        'Deliver executive stage breakdown at end of month',
      ],
      pricingModel: 'fixed',
      setupFee: 0,
      recurringFee: 10000,
      oneTimePrice: 0,
      monthlyPrice: 10000,
      billingCycle: 'monthly',
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: '3–5 business days setup',
      revisionLimit: 'Weekly pipeline schema adjustment',
      additionalDeliverableCharge: 2000,
      subscriptionDuration: 'Monthly managed service',
      renewalTerms: 'Auto-renews monthly',
      cancellationPolicy: '7 days notice',
      menuOrder: 34,
      showInMenu: true,
    },
    {
      id: 'srv-ai-outbound-workflows',
      slug: 'ai-outbound-calling-workflows',
      name: 'AI-Assisted Outbound Calling & Inquiry Follow-Up Workflows',
      category: 'Lead Management and CRM',
      description:
        'Agency-operated AI-assisted outbound enquiry calling scripts and multi-attempt callback workflows designed to keep response times under minutes.',
      benefits: [
        'Structured script logic tailored to your buyer objections and language mix',
        'Zero client-side software setup—managed directly by AKYIN operations',
      ],
      deliverables: [
        'Custom outbound calling script & qualification decision tree',
        'Multi-attempt inquiry follow-up cadence',
        'Call outcome disposition log & priority escalation rules',
      ],
      workProcess: [
        'Map common prospect FAQs, eligibility checks & language preferences',
        'Configure and test calling workflow scripts internally',
        'Deploy live follow-up cadence with structured outcome reporting',
      ],
      pricingModel: 'custom',
      setupFee: 0,
      recurringFee: 0,
      oneTimePrice: 0,
      monthlyPrice: 0,
      billingCycle: 'monthly',
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: '5–7 business days configuration',
      revisionLimit: 'Iterative script calibration',
      additionalDeliverableCharge: 0,
      subscriptionDuration: 'Scoped by call volume',
      renewalTerms: 'Monthly',
      cancellationPolicy: '7 days notice',
      menuOrder: 35,
      showInMenu: true,
    },

    // =========================================================================
    // 10. BUSINESS CONSULTING AND TRAINING
    // =========================================================================
    {
      id: 'srv-consulting',
      slug: 'business-advisory-session',
      name: '1-on-1 Business Advisory Session (30 min IST)',
      category: 'Business Consulting and Training',
      description:
        'Private commercial strategy, feasibility, and unit-economics diagnostic session directly with AKYIN Ventures on India Standard Time.',
      benefits: [
        'Direct 1-on-1 founder clarity without multi-month retainer commitments',
        'Pinpoints acquisition bottlenecks, pricing margin leaks & next steps in 30 minutes',
      ],
      deliverables: [
        '30-minute private IST video consultation',
        'Unit economics & funnel bottleneck audit',
        'Actionable next-step priorities summary',
      ],
      workProcess: [
        'Select your preferred 30-min IST slot and submit business context',
        'Join focused live diagnostic review directly with AKYIN',
        'Leave with clear commercial action priorities',
      ],
      pricingModel: 'fixed',
      setupFee: 3998,
      recurringFee: 0,
      oneTimePrice: 3998,
      monthlyPrice: 0,
      billingCycle: 'one-time',
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: 'Scheduled 6:00 PM – 7:00 PM IST slot',
      revisionLimit: 'Single dedicated session',
      additionalDeliverableCharge: 3998,
      subscriptionDuration: 'One-time 30-min advisory session',
      renewalTerms: 'N/A (One-time)',
      cancellationPolicy: 'Reschedule permitted up to 4 hours prior',
      menuOrder: 36,
      showInMenu: true,
    },
    {
      id: 'srv-sales-strategy',
      slug: 'commercial-dealership-sales-training',
      name: 'Commercial & Dealership Sales Training Workshop',
      category: 'Business Consulting and Training',
      description:
        'Practical frontline sales and showroom coaching backed by 16 years of high-trust commercial experience from Maruti Suzuki to Audi.',
      benefits: [
        'Equips sales executives with structured product walkthroughs & calm objection handling',
        'Builds consistent follow-up discipline that increases enquiry-to-closing conversion',
      ],
      deliverables: [
        'Customer greeting & structured discovery walkaround framework',
        'Objection handling & value-based negotiation drills',
        'Follow-up cadence & deal closing workbook',
      ],
      workProcess: [
        'Review current team call/floor handling gaps & target conversion goals',
        'Deliver intensive interactive team workshop (on-site or virtual)',
        'Follow up with customized closing script summary',
      ],
      pricingModel: 'fixed',
      setupFee: 50000,
      recurringFee: 0,
      oneTimePrice: 50000,
      monthlyPrice: 0,
      billingCycle: 'one-time',
      addons: [{ name: 'Post-workshop follow-up audit session', price: 15000 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: 'Scheduled intensive session',
      revisionLimit: 'Includes customized sales playbook workbook',
      additionalDeliverableCharge: 15000,
      subscriptionDuration: 'Single comprehensive workshop session',
      renewalTerms: 'N/A (One-time)',
      cancellationPolicy: 'Reschedule permitted with 5 days advance notice',
      menuOrder: 37,
      showInMenu: true,
    },
    {
      id: 'srv-personality-development',
      slug: 'personality-development-workshop',
      name: 'Personality Development & Executive Etiquette Workshop',
      category: 'Business Consulting and Training',
      description:
        'Dedicated grooming, verbal clarity, consultative body language, and executive presence training tailored for customer-facing sales and advisory teams.',
      benefits: [
        'Elevates first-impression trust during high-ticket showroom and B2B meetings',
        'Coaches active listening, voice tone & composed client posture',
      ],
      deliverables: [
        'Executive grooming & showroom hospitality standards',
        'Verbal clarity, listening & confidence roleplay sessions',
        'Consistent client representation checklist',
      ],
      workProcess: [
        'Align workshop agenda to team seniority and customer tier',
        'Conduct hands-on communication & posture coaching drills',
        'Provide practical daily etiquette scorecard for managers',
      ],
      pricingModel: 'fixed',
      setupFee: 50000,
      recurringFee: 0,
      oneTimePrice: 50000,
      monthlyPrice: 0,
      billingCycle: 'one-time',
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: 'Scheduled per mutually agreed calendar date',
      revisionLimit: 'Pre-session agenda alignment included',
      additionalDeliverableCharge: 15000,
      subscriptionDuration: 'Single workshop session',
      renewalTerms: 'N/A (One-time)',
      cancellationPolicy: 'Reschedule permitted with 5 days advance notice',
      menuOrder: 38,
      showInMenu: true,
    },
    {
      id: 'srv-custom-solutions',
      slug: 'custom-international-business-solutions',
      name: 'Custom International Business Solutions (India / UAE)',
      category: 'Business Consulting and Training',
      description:
        'Bespoke multi-market operations, commercial feasibility, cross-border India–UAE go-to-market planning, and custom advisory retainers.',
      benefits: [
        'Designed for organizations operating or expanding across India and the UAE',
        'Transparent custom scoping—pay strictly for agreed project milestones',
      ],
      deliverables: [
        'Tailored technical & commercial scoping dossier',
        'Custom milestone schedule & deliverable SLAs',
        'Dedicated cross-border advisory coordination',
      ],
      workProcess: [
        'Conduct discovery call covering India/UAE market goals & constraints',
        'Prepare milestone-based commercial proposal & deliverables',
        'Execute agreed sprints with regular leadership check-ins',
      ],
      pricingModel: 'custom',
      setupFee: 0,
      recurringFee: 0,
      oneTimePrice: 0,
      monthlyPrice: 0,
      billingCycle: 'custom',
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: 'Custom milestone timeline',
      revisionLimit: 'Milestone-based review cycles',
      additionalDeliverableCharge: 0,
      subscriptionDuration: 'Project or bespoke retainer',
      renewalTerms: 'Per signed service agreement',
      cancellationPolicy: 'Per signed contract terms',
      menuOrder: 39,
      showInMenu: true,
    },
  ];

  return list.map((item, idx) => ({
    ...item,
    active: true,
    sortOrder: idx + 1,
    menuOrder: item.menuOrder ?? idx + 1,
    showInMenu: item.showInMenu ?? true,
    updatedAt: nowIso,
  }));
}

function importLegacyLeads(nowIso: string): CrmLead[] {
  const legacyFile = getLegacyLeadsPath();
  if (!fs.existsSync(legacyFile)) return [];
  try {
    const raw = fs.readFileSync(legacyFile, 'utf8');
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const results: CrmLead[] = [];
    for (const entry of parsed) {
      if (!entry || typeof entry !== 'object') continue;
      const rec = entry as Record<string, unknown>;
      const leadId =
        typeof rec.leadId === 'string' && rec.leadId
          ? rec.leadId
          : `AKY-LEAD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
      const receivedAt =
        typeof rec.receivedAt === 'string' && rec.receivedAt ? rec.receivedAt : nowIso;
      results.push({
        leadId,
        receivedAt,
        updatedAt: receivedAt,
        fullName: String(rec.fullName || 'Imported Lead'),
        mobileNumber: String(rec.mobileNumber || ''),
        email: String(rec.email || ''),
        companyName: String(rec.businessName || rec.companyName || ''),
        website: String(rec.website || ''),
        city: String(rec.city || ''),
        country: String(rec.country || ''),
        businessCategory: String(rec.businessCategory || ''),
        requiredService: String(rec.requiredService || ''),
        estimatedBudget: String(rec.monthlyMarketingBudget || rec.estimatedBudget || ''),
        preferredContactMethod: String(rec.preferredContactMethod || 'Phone / WhatsApp'),
        description: String(rec.message || rec.description || ''),
        consentAccepted: Boolean(rec.consentAccepted ?? true),
        stage: 'NEW',
        secondaryTag: '',
        assignedToUserId: '',
        assignedToName: '',
        followUpAt: '',
        campaignSource: 'Website',
        expectedDealValue: 0,
        currency: 'INR',
        lostReason: '',
        privateNotes: '',
        convertedClientId: '',
        duplicateWarning: '',
        sourcePage: String(rec.source || 'Legacy Import'),
        activities: [
          {
            id: `act_${crypto.randomBytes(4).toString('hex')}`,
            timestamp: receivedAt,
            actor: 'System Migration',
            type: 'system',
            summary: 'Imported existing enquiry from .akyin-data/leads.json without data loss.',
          },
        ],
      });
    }
    return results;
  } catch {
    return [];
  }
}

function buildEmptyDatabase(): SuiteDatabase {
  const nowIso = new Date().toISOString();
  const initialUsers: SuiteUser[] = [];
  const envAdminPw = (process.env.ADMIN_PASSWORD || '').trim();
  if (envAdminPw.length >= 8) {
    initialUsers.push({
      id: 'usr-super-admin',
      name: 'Shaikh Nazir',
      email: process.env.OWNER_NOTIFICATION_EMAIL || 'connect@akyin.com',
      role: 'Super Admin',
      active: true,
      passwordHash: hashPassword(envAdminPw),
      createdAt: nowIso,
      updatedAt: nowIso,
      lastLoginAt: '',
    });
  }

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    users: initialUsers,
    sessions: [],
    leads: importLegacyLeads(nowIso),
    clients: buildInitialClients(nowIso),
    serviceCategories: buildInitialServiceCategories(nowIso),
    services: buildInitialServices(nowIso),
    quotations: [],
    invoices: [],
    subscriptions: [],
    payments: [],
    appointments: [],
    availability: DEFAULT_AVAILABILITY.map((a) => ({ ...a })),
    blockedDates: [],
    websiteSettings: { ...DEFAULT_WEBSITE_SETTINGS },
    notificationSettings: {
      ...DEFAULT_NOTIFICATION_SETTINGS,
      events: { ...DEFAULT_NOTIFICATION_SETTINGS.events },
    },
    notificationLogs: [],
    auditLogs: [
      {
        logId: `LOG-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
        timestamp: nowIso,
        actorId: 'system',
        actorName: 'System',
        actorRole: 'System',
        action: 'DB_INITIALIZED',
        targetId: 'SUITE_DB',
        summary: 'Initialized AKYIN Business Management Suite database schema v1.',
      },
    ],
    processedWebhookEvents: [],
  };
}

function backupDatabaseFile(filePath: string, reasonTag: string): void {
  if (!fs.existsSync(filePath)) return;
  const backupsDir = path.join(getDataDir(), 'backups');
  fs.mkdirSync(backupsDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupsDir, `suite-db-${reasonTag}-${stamp}.json`);
  fs.copyFileSync(filePath, backupPath);
}

function migrateDatabaseIfNeeded(raw: Partial<SuiteDatabase>, dbFilePath: string): SuiteDatabase {
  const oldVersion = typeof raw.schemaVersion === 'number' ? raw.schemaVersion : 0;
  if (oldVersion < CURRENT_SCHEMA_VERSION) {
    backupDatabaseFile(dbFilePath, `pre-v${CURRENT_SCHEMA_VERSION}`);
  }
  const defaults = buildEmptyDatabase();
  const merged: SuiteDatabase = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    users: Array.isArray(raw.users) ? raw.users : defaults.users,
    sessions: Array.isArray(raw.sessions) ? raw.sessions : [],
    leads: Array.isArray(raw.leads) ? raw.leads : defaults.leads,
    clients:
      Array.isArray(raw.clients) && raw.clients.length > 0 ? raw.clients : defaults.clients,
    serviceCategories:
      oldVersion >= 4 && Array.isArray(raw.serviceCategories) && raw.serviceCategories.length > 0
        ? raw.serviceCategories
        : defaults.serviceCategories,
    services:
      Array.isArray(raw.services) && raw.services.length > 0 ? raw.services : defaults.services,
    quotations: Array.isArray(raw.quotations) ? raw.quotations : [],
    invoices: Array.isArray(raw.invoices) ? raw.invoices : [],
    subscriptions: Array.isArray(raw.subscriptions) ? raw.subscriptions : [],
    payments: Array.isArray(raw.payments) ? raw.payments : [],
    appointments: Array.isArray(raw.appointments) ? raw.appointments : [],
    availability:
      Array.isArray(raw.availability) && raw.availability.length > 0
        ? raw.availability
        : defaults.availability,
    blockedDates: Array.isArray(raw.blockedDates) ? raw.blockedDates : [],
    websiteSettings: {
      ...DEFAULT_WEBSITE_SETTINGS,
      ...(raw.websiteSettings || {}),
    },
    notificationSettings: {
      ...DEFAULT_NOTIFICATION_SETTINGS,
      ...(raw.notificationSettings || {}),
      events: {
        ...DEFAULT_NOTIFICATION_SETTINGS.events,
        ...(raw.notificationSettings?.events || {}),
      },
    },
    notificationLogs: Array.isArray(raw.notificationLogs) ? raw.notificationLogs : [],
    auditLogs: Array.isArray(raw.auditLogs) ? raw.auditLogs : defaults.auditLogs,
    processedWebhookEvents: Array.isArray(raw.processedWebhookEvents)
      ? raw.processedWebhookEvents
      : [],
  };

  // Migration to v3: Double existing service prices exactly once (excluding Bulk SMS and WhatsApp)
  if (oldVersion < 3) {
    const nowIso = new Date().toISOString();
    for (const srv of merged.services) {
      if (srv.id === 'srv-bulk-sms' || srv.id === 'srv-whatsapp-messaging') {
        continue;
      }
      const alreadyDoubled = srv.priceHistory?.some(
        (h) => h.changedBy === 'System Migration (v3 pricing revision)'
      );
      if (!alreadyDoubled) {
        const oldPrice = srv.setupFee || srv.recurringFee || srv.packagePrice || 0;
        if (srv.setupFee) srv.setupFee *= 2;
        if (srv.recurringFee) srv.recurringFee *= 2;
        if (srv.packagePrice) srv.packagePrice *= 2;
        if (srv.oneTimePrice) srv.oneTimePrice *= 2;
        if (srv.monthlyPrice) srv.monthlyPrice *= 2;
        if (Array.isArray(srv.addons)) {
          for (const addon of srv.addons) {
            addon.price = (addon.price || 0) * 2;
          }
        }
        const newPrice = srv.setupFee || srv.recurringFee || srv.packagePrice || 0;
        if (!srv.priceHistory) srv.priceHistory = [];
        if (oldPrice > 0 || newPrice > 0) {
          srv.priceHistory.push({
            previousPrice: oldPrice,
            newPrice,
            changedAt: nowIso,
            changedBy: 'System Migration (v3 pricing revision)',
            note: 'AKYIN commercial price doubling applied',
          });
        }
      }
    }
  }

  // Migration to v4: Standalone marketplace categories, unique slugs, remove Package A/B/C names, never re-multiply prices
  const defaultsById = new Map(defaults.services.map((s) => [s.id, s]));
  const legacyCategoryMap: Record<string, string> = {
    'Digital marketing': 'Digital Marketing',
    'Google Ads management': 'Digital Marketing',
    'Meta Ads management': 'Digital Marketing',
    'Website development': 'Digital Marketing',
    SEO: 'Digital Marketing',
    'Customer acquisition': 'Digital Marketing',
    'Lead generation': 'Lead Management and CRM',
    'Social media management': 'Social Media Management',
    Branding: 'Creative and Graphic Design',
    'Business consulting': 'Business Consulting and Training',
    'Sales and marketing strategy': 'Business Consulting and Training',
    'Custom business solutions': 'Business Consulting and Training',
    'Automotive dealership marketing': 'Automotive Marketing',
    'Bulk SMS Marketing': 'Messaging and Communication',
    'WhatsApp Business Messaging': 'Messaging and Communication',
  };

  if (oldVersion < 4) {
    merged.serviceCategories = defaults.serviceCategories;
    const seenIds = new Set<string>();
    const seenSlugs = new Set<string>();
    const migratedServices: ServiceCatalogItem[] = [];

    for (const srv of merged.services) {
      if (seenIds.has(srv.id)) continue;
      const def = defaultsById.get(srv.id);
      if (def) {
        // Map legacy category names to the new 10 categories while preserving admin-edited prices
        srv.category = def.category;
        srv.slug = srv.slug || def.slug;
        srv.benefits = srv.benefits && srv.benefits.length > 0 ? srv.benefits : def.benefits;
        srv.workProcess =
          srv.workProcess && srv.workProcess.length > 0 ? srv.workProcess : def.workProcess;
        srv.menuOrder = srv.menuOrder ?? def.menuOrder ?? srv.sortOrder;
        srv.showInMenu = srv.showInMenu ?? def.showInMenu ?? true;
        if (srv.id === 'srv-digital-marketing' && /package\s*[abc]/i.test(srv.name)) {
          srv.name = def.name;
          srv.description = def.description;
        }
        if (srv.id === 'srv-lead-gen' && /package\s*[abc]/i.test(srv.name)) {
          srv.name = def.name;
          srv.description = def.description;
        }
      } else {
        if (legacyCategoryMap[srv.category]) {
          srv.category = legacyCategoryMap[srv.category];
        } else if (srv.category === 'Business Creative & Documentation Services') {
          srv.category = 'Creative and Graphic Design';
        }
        srv.name = srv.name.replace(/^Package\s+[A-Z]\s*[—–-]\s*/i, '').trim();
      }

      let candidateSlug = srv.slug ? slugifyServiceName(srv.slug) : slugifyServiceName(srv.name);
      if (seenSlugs.has(candidateSlug)) {
        candidateSlug = `${candidateSlug}-${srv.id.replace(/^srv-/, '').slice(0, 6)}`;
      }
      srv.slug = candidateSlug;
      seenIds.add(srv.id);
      seenSlugs.add(candidateSlug);
      migratedServices.push(srv);
    }
    merged.services = migratedServices;
  }

  // Ensure every service has a unique valid slug & non-destructively backfill newly added standalone services
  const existingServiceIds = new Set(merged.services.map((s) => s.id));
  const existingSlugs = new Set(
    merged.services.map((s) => (s.slug ? slugifyServiceName(s.slug) : slugifyServiceName(s.name)))
  );
  const existingNames = new Set(merged.services.map((s) => s.name.trim().toLowerCase()));

  for (const srv of merged.services) {
    if (!srv.slug) {
      srv.slug = slugifyServiceName(srv.name);
    }
    if (srv.menuOrder === undefined) srv.menuOrder = srv.sortOrder;
    if (srv.showInMenu === undefined) srv.showInMenu = true;
  }

  for (const defSrv of defaults.services) {
    if (
      !existingServiceIds.has(defSrv.id) &&
      !existingSlugs.has(defSrv.slug) &&
      !existingNames.has(defSrv.name.trim().toLowerCase())
    ) {
      merged.services.push({
        ...defSrv,
        sortOrder: merged.services.length + 1,
      });
      existingServiceIds.add(defSrv.id);
      existingSlugs.add(defSrv.slug);
      existingNames.add(defSrv.name.trim().toLowerCase());
    }
  }

  // Ensure initial admin from env if still 0 users and env var provided
  const envAdminPw = (process.env.ADMIN_PASSWORD || '').trim();
  if (merged.users.length === 0 && envAdminPw.length >= 8) {
    const nowIso = new Date().toISOString();
    merged.users.push({
      id: 'usr-super-admin',
      name: 'Shaikh Nazir',
      email: process.env.OWNER_NOTIFICATION_EMAIL || 'connect@akyin.com',
      role: 'Super Admin',
      active: true,
      passwordHash: hashPassword(envAdminPw),
      createdAt: nowIso,
      updatedAt: nowIso,
      lastLoginAt: '',
    });
  }

  return merged;
}

let writeQueue: Promise<unknown> = Promise.resolve();

export function readDb(): SuiteDatabase {
  const dataDir = getDataDir();
  const dbPath = getDbFilePath();
  fs.mkdirSync(dataDir, { recursive: true });

  if (!fs.existsSync(dbPath)) {
    const fresh = buildEmptyDatabase();
    writeDbAtomic(fresh);
    return fresh;
  }

  try {
    const rawText = fs.readFileSync(dbPath, 'utf8');
    const parsed = JSON.parse(rawText) as Partial<SuiteDatabase>;
    const migrated = migrateDatabaseIfNeeded(parsed, dbPath);
    if ((parsed.schemaVersion || 0) < CURRENT_SCHEMA_VERSION) {
      writeDbAtomic(migrated);
    }
    return migrated;
  } catch (err) {
    console.error('[suite-storage] Failed parsing suite-db.json, backing up and reinitializing:', err);
    backupDatabaseFile(dbPath, 'corrupt');
    const fresh = buildEmptyDatabase();
    writeDbAtomic(fresh);
    return fresh;
  }
}

export function writeDbAtomic(db: SuiteDatabase): void {
  const dataDir = getDataDir();
  const dbPath = getDbFilePath();
  fs.mkdirSync(dataDir, { recursive: true });
  const tempPath = path.join(
    dataDir,
    `suite-db.${process.pid}.${Date.now()}.${crypto.randomBytes(3).toString('hex')}.tmp`
  );
  fs.writeFileSync(tempPath, JSON.stringify(db, null, 2), 'utf8');
  fs.renameSync(tempPath, dbPath);
}

/**
 * Serialized async mutex ensuring concurrent writes (appointments, webhooks, CRM mutations)
 * never interleave or clobber database state.
 */
export function withDbMutation<T>(mutator: (db: SuiteDatabase) => Promise<T> | T): Promise<T> {
  const task = writeQueue.then(async () => {
    const db = readDb();
    const result = await mutator(db);
    writeDbAtomic(db);
    return result;
  });
  writeQueue = task.catch(() => undefined);
  return task;
}

export function appendAuditLog(
  db: SuiteDatabase,
  entry: Omit<AuditLogEntry, 'logId' | 'timestamp'>
): void {
  db.auditLogs.unshift({
    logId: `LOG-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
    timestamp: new Date().toISOString(),
    ...entry,
  });
  if (db.auditLogs.length > 2000) {
    db.auditLogs = db.auditLogs.slice(0, 2000);
  }
}
