export type AppRoute =
  | '/'
  | '/about'
  | '/ventures'
  | '/ventures/publishing'
  | '/ventures/marketing'
  | '/marketing/automotive'
  | '/ventures/store'
  | '/ventures/aicalc'
  | '/ventures/kartigo'
  | '/ventures/biznxt'
  | '/ventures/budget-bazaar'
  | '/advisory'
  | '/insights'
  | '/contact'
  | '/sitemap'
  | '/admin';

export interface VentureOverview {
  id: string;
  code: string;
  name: string;
  shortName: string;
  route: AppRoute;
  sector: string;
  positioning: string;
  description: string;
  externalUrl?: string;
  externalLabel?: string;
  image: string;
  imageAlt: string;
}

export type ServiceCategory =
  | 'all'
  | 'lead-crm'
  | 'creative-media'
  | 'campaigns-local'
  | 'sales-training';

export interface MarketingService {
  id: string;
  number: string;
  title: string;
  category: Exclude<ServiceCategory, 'all'>;
  categoryLabel: string;
  scopeNote?: string;
  summary: string;
  deliverables: string[];
  rateCardMatch: string;
}

export interface ExperienceMilestone {
  number: string;
  title: string;
  spectrum: string;
  description: string;
}

export interface PricingPackage {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  setupFee: string;
  monthlyFee: string;
  includes: string[];
  excludes: string[];
  enquiryServiceValue: string;
  featured?: boolean;
}

export interface RateCardItem {
  id: string;
  service: string;
  category: string;
  fee: string;
  unit: string;
  notes: string;
}

export const OFFICIAL_CONTACT = {
  parentBrand: 'AKYIN VENTURES',
  domain: 'https://akyin.com',
  email: 'connect@akyin.com',
  phoneDisplay: '+91-6305694011',
  whatsappNumber: '916305694011',
  whatsappUrl: 'https://wa.me/916305694011',
  marketingSocialHandle: '@akyinmarketing',
  marketingSocials: [
    {
      id: 'instagram',
      name: 'Instagram',
      url: 'https://www.instagram.com/akyinmarketing/',
      handle: '@akyinmarketing',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      url: 'https://www.facebook.com/akyinmarketing/',
      handle: '@akyinmarketing',
    },
    {
      id: 'x',
      name: 'X',
      url: 'https://x.com/akyinmarketing',
      handle: '@akyinmarketing',
    },
    {
      id: 'youtube',
      name: 'YouTube',
      url: 'https://www.youtube.com/@akyinmarketing',
      handle: '@akyinmarketing',
    },
  ],
} as const;

export const PUBLISHING_LINKS = {
  amazonAuthorStore:
    'https://www.amazon.com/stores/Akyin-S/author/B0H6SY7N3T?_encoding=UTF8&pd_rd_w=r7GRE&content-id=amzn1.sym.7e190e19-9f6f-4df8-807a-5a7608594741&pd_rd_wg=EdC74&pd_rd_r=d01ba7b6-b1c7-4bd2-87fb-cbd0fc9deddb&ref=ap_rdr&shoppingPortalEnabled=true&ccs_id=98bb1963-9c8a-4dab-9f1b-d21a6f908208',
  googlePlayDisciplineCode:
    'https://play.google.com/store/books/details/Akyin_s_THE_DISCIPLINE_CODE?id=seHuEQAAQBAJ',
} as const;

export const EXTERNAL_VERTICAL_URLS = {
  aicalc: 'https://aicalc.in',
  kartigo: 'https://kartigo.online',
  biznxt: 'https://biznxt.online',
  budgetBazaar: 'https://budgetbazaar.org',
} as const;

export const IMAGES = {
  liquidGlassHero: '/src/assets/images/apple_hero_glass_monolith_1795345424385.jpg',
  liquidGlassVentures: '/src/assets/images/apple_ventures_stack_1795345421049.jpg',
  liquidGlassAdvisory: '/src/assets/images/apple_advisory_console_1795345421545.jpg',
  warmCorporateHero: '/src/assets/images/apple_hero_glass_monolith_1795345424385.jpg',
  warmEditorialStudio: '/src/assets/images/apple_ventures_stack_1795345421049.jpg',
  aicalcWorkspace: '/src/assets/images/apple_aicalc_hardware_1795345421860.jpg',
  publishingHero: '/src/assets/images/apple_publishing_edition_1795345421531.jpg',
  disciplineCodeBook: '/src/assets/images/apple_discipline_book_1795345421096.jpg',
  heroShowroom: '/src/assets/images/apple_sales_coaching_1795345420916.jpg',
  salesTraining: '/src/assets/images/apple_marketing_agency_1795345421802.jpg',
  automotiveHeritage: '/src/assets/images/apple_agency_heritage_1795345553029.jpg',
  thriftHero: '/src/assets/images/apple_store_thrift_hanger_1795345421581.jpg',
  thriftFlatlay: '/src/assets/images/apple_store_thrift_stack_1795345421794.jpg',
  kartigoWarehouse: '/src/assets/images/apple_kartigo_cubes_1795345421779.jpg',
  biznxtConsulting: '/src/assets/images/apple_biznxt_compass_1795345424719.jpg',
  biznxtStrategy: '/src/assets/images/apple_biznxt_playbook_1795345421019.jpg',
  budgetBazaarRetail: '/src/assets/images/apple_budget_bazaar_goods_1795345421332.jpg',
} as const;

export const VENTURES_PORTFOLIO: VentureOverview[] = [
  {
    id: 'publishing',
    code: '01',
    name: 'AKYIN Publishing',
    shortName: 'Akyin Publishing',
    route: '/ventures/publishing',
    sector: 'Book & Digital Publishing',
    positioning: 'Ideas Worth Reading. Knowledge Worth Sharing.',
    description:
      'Independent book and digital publishing initiative creating and distributing titles for readers across international marketplaces including Amazon and Google Play Books.',
    externalUrl: PUBLISHING_LINKS.amazonAuthorStore,
    externalLabel: 'Amazon Author Store',
    image: IMAGES.publishingHero,
    imageAlt: 'Isolated matte hardcover edition and glass e-reader stamped with AKYIN emblem',
  },
  {
    id: 'marketing',
    code: '02',
    name: 'AKYIN Marketing',
    shortName: 'Akyin Marketing',
    route: '/ventures/marketing',
    sector: 'Full-Service Marketing Agency & Growth Strategy',
    positioning: 'Build Brand Demand. Convert Better Enquiries.',
    description:
      'Full-service performance marketing agency helping retail, service businesses, commercial brands, and automotive dealers acquire buyers, qualify existing enquiries, and strengthen sales execution.',
    image: IMAGES.salesTraining,
    imageAlt: 'Isolated brushed aluminum analytics slate, glass prism, and AKYIN emblem block',
  },
  {
    id: 'store',
    code: '03',
    name: 'AKYIN Store · AKYIN Thrift',
    shortName: 'Akyin Store',
    route: '/ventures/store',
    sector: 'Clothing & Fashion Retail',
    positioning: 'Affordable Fashion. Exceptional Discounts.',
    description:
      'Consumer clothing retail brand featuring fashion sub-brand AKYIN THRIFT, focused on offering carefully selected men’s and women’s apparel at exceptional discounted prices.',
    image: IMAGES.thriftHero,
    imageAlt: 'Tailored monochrome jacket on brushed titanium hanger with AKYIN metal tag',
  },
  {
    id: 'aicalc',
    code: '04',
    name: 'AICalc.in',
    shortName: 'AICalc',
    route: '/ventures/aicalc',
    sector: 'AI Utility & Calculator Technology',
    positioning: 'Smart Calculations. Powered by AI.',
    description:
      'Independent web platform enabling users to solve mathematical and practical calculation problems using natural-language queries alongside traditional calculator functions.',
    externalUrl: EXTERNAL_VERTICAL_URLS.aicalc,
    externalLabel: 'aicalc.in',
    image: IMAGES.aicalcWorkspace,
    imageAlt: 'Frosted liquid-glass smart calculator hardware tablet with AKYIN engraved emblem',
  },
  {
    id: 'kartigo',
    code: '05',
    name: 'Kartigo.online',
    shortName: 'Kartigo',
    route: '/ventures/kartigo',
    sector: 'B2B Stock Supply & Commerce',
    positioning: 'Connecting Businesses With Stock Opportunities.',
    description:
      'Dedicated B2B-oriented stock supply platform designed to support business buyers and wholesale stock suppliers within a structured commercial environment.',
    externalUrl: EXTERNAL_VERTICAL_URLS.kartigo,
    externalLabel: 'kartigo.online',
    image: IMAGES.kartigoWarehouse,
    imageAlt: 'Modular frosted-glass and brushed titanium supply cubes stamped with AKYIN emblem',
  },
  {
    id: 'biznxt',
    code: '06',
    name: 'BizNXT.online',
    shortName: 'BizNXT',
    route: '/ventures/biznxt',
    sector: 'Business Guidance & Consulting',
    positioning: 'Business Clarity. Smarter Decisions. Better Direction.',
    description:
      'BizNXT focuses on business guidance, consulting and helping entrepreneurs explore business opportunities and make informed business decisions.',
    externalUrl: EXTERNAL_VERTICAL_URLS.biznxt,
    externalLabel: 'biznxt.online',
    image: IMAGES.biznxtConsulting,
    imageAlt: 'Crystal compass, matte black chess rook, and brushed aluminum tablet with AKYIN emblem',
  },
  {
    id: 'budget-bazaar',
    code: '07',
    name: 'Budget Bazaar',
    shortName: 'Budget Bazaar',
    route: '/ventures/budget-bazaar',
    sector: 'Affordable Retail & Everyday Goods',
    positioning: 'Everyday Essentials. Value-First Retail.',
    description:
      'Value-driven consumer retail venture offering practical everyday essentials, household goods, and affordable lifestyle products through budgetbazaar.org.',
    externalUrl: EXTERNAL_VERTICAL_URLS.budgetBazaar,
    externalLabel: 'budgetbazaar.org',
    image: IMAGES.budgetBazaarRetail,
    imageAlt: 'Isolated pearl-grey canvas tote, frosted canisters, and aluminum bottle with AKYIN tag',
  },
];

export interface EcosystemBrandEntry {
  id: string;
  name: string;
  relationshipLabel: string;
  category: 'venture' | 'client' | 'platform';
  iconKey?: 'amazon' | 'google-play' | 'shopify' | 'instagram' | 'facebook' | 'x' | 'youtube';
  externalUrl?: string;
  internalRoute?: AppRoute;
  wordmarkStyle?: 'serif' | 'sans' | 'mono';
}

export const ECOSYSTEM_VENTURES_TICKER: EcosystemBrandEntry[] = [
  {
    id: 'eco-akyin-ventures',
    name: 'AKYIN Ventures',
    relationshipLabel: 'Parent Group',
    category: 'venture',
    externalUrl: 'https://akyin.com',
    internalRoute: '/',
    wordmarkStyle: 'sans',
  },
  {
    id: 'eco-publishing',
    name: 'AKYIN Publishing',
    relationshipLabel: 'AKYIN Venture',
    category: 'venture',
    externalUrl: PUBLISHING_LINKS.amazonAuthorStore,
    internalRoute: '/ventures/publishing',
    wordmarkStyle: 'serif',
  },
  {
    id: 'eco-marketing',
    name: 'AKYIN Marketing',
    relationshipLabel: 'Marketing Agency',
    category: 'venture',
    internalRoute: '/ventures/marketing',
    wordmarkStyle: 'sans',
  },
  {
    id: 'eco-store',
    name: 'AKYIN Store',
    relationshipLabel: 'AKYIN Venture',
    category: 'venture',
    internalRoute: '/ventures/store',
    wordmarkStyle: 'sans',
  },
  {
    id: 'eco-budget-bazaar',
    name: 'Budget Bazaar',
    relationshipLabel: 'AKYIN Venture',
    category: 'venture',
    externalUrl: EXTERNAL_VERTICAL_URLS.budgetBazaar,
    internalRoute: '/ventures/budget-bazaar',
    wordmarkStyle: 'sans',
  },
  {
    id: 'eco-aicalc',
    name: 'AICalc',
    relationshipLabel: 'AKYIN Venture',
    category: 'venture',
    externalUrl: EXTERNAL_VERTICAL_URLS.aicalc,
    internalRoute: '/ventures/aicalc',
    wordmarkStyle: 'mono',
  },
  {
    id: 'eco-kartigo',
    name: 'Kartigo',
    relationshipLabel: 'AKYIN Venture',
    category: 'venture',
    externalUrl: EXTERNAL_VERTICAL_URLS.kartigo,
    internalRoute: '/ventures/kartigo',
    wordmarkStyle: 'sans',
  },
  {
    id: 'eco-biznxt',
    name: 'BizNXT',
    relationshipLabel: 'AKYIN Venture',
    category: 'venture',
    externalUrl: EXTERNAL_VERTICAL_URLS.biznxt,
    internalRoute: '/ventures/biznxt',
    wordmarkStyle: 'sans',
  },
];

export const ECOSYSTEM_CLIENT: EcosystemBrandEntry = {
  id: 'eco-autoclub',
  name: 'AutoClub',
  relationshipLabel: 'Client',
  category: 'client',
  wordmarkStyle: 'sans',
};

export const ECOSYSTEM_PLATFORMS_TICKER: EcosystemBrandEntry[] = [
  {
    id: 'eco-amazon',
    name: 'Amazon',
    relationshipLabel: 'Publishing marketplace',
    category: 'platform',
    iconKey: 'amazon',
    externalUrl: PUBLISHING_LINKS.amazonAuthorStore,
  },
  {
    id: 'eco-google-play-books',
    name: 'Google Play Books',
    relationshipLabel: 'Digital publishing and distribution platform',
    category: 'platform',
    iconKey: 'google-play',
    externalUrl: PUBLISHING_LINKS.googlePlayDisciplineCode,
  },
  {
    id: 'eco-shopify',
    name: 'Shopify',
    relationshipLabel: 'Commerce platform',
    category: 'platform',
    iconKey: 'shopify',
    externalUrl: 'https://www.shopify.com',
  },
  {
    id: 'eco-instagram',
    name: 'Instagram',
    relationshipLabel: 'Social media channel',
    category: 'platform',
    iconKey: 'instagram',
    externalUrl: 'https://www.instagram.com/akyinmarketing/',
  },
  {
    id: 'eco-facebook',
    name: 'Facebook',
    relationshipLabel: 'Social media channel',
    category: 'platform',
    iconKey: 'facebook',
    externalUrl: 'https://www.facebook.com/akyinmarketing/',
  },
  {
    id: 'eco-x',
    name: 'X',
    relationshipLabel: 'Social media channel',
    category: 'platform',
    iconKey: 'x',
    externalUrl: 'https://x.com/akyinmarketing',
  },
  {
    id: 'eco-youtube',
    name: 'YouTube',
    relationshipLabel: 'Video publishing and social media channel',
    category: 'platform',
    iconKey: 'youtube',
    externalUrl: 'https://www.youtube.com/@akyinmarketing',
  },
];

export const FULL_ECOSYSTEM_TICKER: EcosystemBrandEntry[] = [
  ...ECOSYSTEM_VENTURES_TICKER,
  ECOSYSTEM_CLIENT,
  ...ECOSYSTEM_PLATFORMS_TICKER,
];

export const ABOUT_PILLARS = [
  {
    number: '01',
    title: 'Multi-Sector Performance Marketing',
    meta: 'Lead Generation · Creative Strategy',
    description:
      'Structured Meta lead campaigns, launch creatives, creator collaborations, and local SEO engineered for retail, service enterprises, consumer brands, and automotive dealers.',
  },
  {
    number: '02',
    title: 'Managed Lead Qualification & CRM',
    meta: 'AI-Assisted Calling · Zero Leakage',
    description:
      'Disciplined qualification of existing inbound enquiries through structured AI-assisted outbound calling, buyer readiness classification, and daily Excel pipeline reports.',
  },
  {
    number: '03',
    title: '16 Years Commercial & Sales Coaching',
    meta: 'Maruti Suzuki to Audi Pedigree · Team Training',
    description:
      'Grounded in sixteen years of direct commercial and automotive retail leadership—equipping sales executives with practical presentation, communication, and closing craft.',
  },
];

export const SERVICE_CATEGORIES: { id: ServiceCategory; label: string }[] = [
  { id: 'all', label: 'All Services (18)' },
  { id: 'lead-crm', label: 'Lead Gen, Filtering & CRM' },
  { id: 'creative-media', label: 'Creative, Video & Social' },
  { id: 'campaigns-local', label: 'Campaigns & Local Growth' },
  { id: 'sales-training', label: 'Sales Training & Coaching' },
];

export const MARKETING_SERVICES: MarketingService[] = [
  {
    id: 'lead-generation',
    number: '01',
    title: 'Lead Generation',
    category: 'lead-crm',
    categoryLabel: 'New Customer Acquisition',
    scopeNote: 'Focused strictly on generating new high-intent buyer enquiries',
    summary:
      'Meta Ads, targeted brand and product promotions, instant lead forms, conversion landing pages, retargeting, and attribution reporting for growth-focused businesses.',
    deliverables: [
      'Meta Ads setup & ongoing campaign management',
      'Product, service & seasonal offer creatives',
      'Instant lead forms & dedicated conversion landing pages',
      'Audience retargeting & lead source reporting',
    ],
    rateCardMatch: 'Meta lead generation management',
  },
  {
    id: 'lead-filtering-qualification',
    number: '02',
    title: 'Lead Filtering & Qualification',
    category: 'lead-crm',
    categoryLabel: 'Existing Enquiry Qualification',
    scopeNote: 'Qualifies existing inbound enquiries — does NOT generate new leads',
    summary:
      'Managed AI-assisted calling of existing business enquiries to verify buyer readiness, budget, and timeline before sales team follow-up.',
    deliverables: [
      'Captures product/service interest, budget, purchase timeline & booking intent',
      'Logs preferred callback timing for sales teams',
      'Classifies leads: Hot, Warm, Future Follow-up, Unreachable & Not Interested',
      'Delivers Daily Excel reports, call summaries, classification & monthly review',
    ],
    rateCardMatch: 'Lead filtering and qualification',
  },
  {
    id: 'ai-assisted-calling',
    number: '03',
    title: 'AI-Assisted Calling',
    category: 'lead-crm',
    categoryLabel: 'Managed Agency Operations',
    scopeNote: 'Operated internally by AKYIN — not sold as standalone software',
    summary:
      'Structured AI-assisted outbound enquiry calling workflows operated directly by the AKYIN Marketing Agency team to maintain rapid response discipline.',
    deliverables: [
      'Custom calling script & commercial workflow alignment',
      'Up to 1,000 mins/month included in retainer packages (subject to vendor plan)',
      'Structured call outcome logging & priority escalation',
      'Zero client-side software management overhead',
    ],
    rateCardMatch: 'AI calling workflow management',
  },
  {
    id: 'crm-pipeline-management',
    number: '04',
    title: 'CRM & Lead Pipeline Management',
    category: 'lead-crm',
    categoryLabel: 'Pipeline Hygiene',
    scopeNote: 'AKYIN manages pipeline tracking internally — we do NOT sell CRM software',
    summary:
      'Disciplined enquiry tracking, stage updates, and daily Excel / pipeline summaries so business leaders see every open prospect clearly.',
    deliverables: [
      'Enquiry stage hygiene & duplicate cleanup',
      'Priority routing for Hot & scheduled demo/visit callbacks',
      'Daily Excel reporting sheets for sales desks',
      'Monthly qualification & stage breakdown summary',
    ],
    rateCardMatch: 'CRM and lead pipeline management',
  },
  {
    id: 'social-media-marketing',
    number: '05',
    title: 'Social Media Marketing',
    category: 'creative-media',
    categoryLabel: 'Brand Presence',
    summary:
      'Consistent brand social presence across Instagram and Facebook showcasing products, customer stories, operational highlights, and market credibility.',
    deliverables: [
      'Monthly brand content calendar & scheduled posting',
      'Product spotlights & company milestones',
      'Unified visual art direction & tone standards',
      'Monthly content & engagement overview',
    ],
    rateCardMatch: 'Social media management',
  },
  {
    id: 'influencer-marketing',
    number: '06',
    title: 'Influencer Marketing',
    category: 'creative-media',
    categoryLabel: 'Creator Collaborations',
    summary:
      'Coordinating regional and niche creators for authentic product walkthroughs, brand reviews, lifestyle reels, and audience reach.',
    deliverables: [
      'Creator shortlisting & campaign briefing',
      'Shoot scheduling & on-brand production coordination',
      'Influencer video editing & upload workflow',
      'Enquiry link & conversion CTA alignment',
    ],
    rateCardMatch: 'Influencer campaign coordination',
  },
  {
    id: 'video-creative-production',
    number: '07',
    title: 'Video & Creative Production',
    category: 'creative-media',
    categoryLabel: 'Visual Assets',
    summary:
      'High-retention vertical reels and crisp static graphic creatives designed for Meta feeds, stories, and regional digital campaigns.',
    deliverables: [
      '8 promotional reels packages',
      '10 graphic creatives packages',
      'Offer, pricing & product feature visual layouts',
      'Multi-placement aspect ratio formatting',
    ],
    rateCardMatch: '8 promotional reels',
  },
  {
    id: 'product-brand-presentations',
    number: '08',
    title: 'Product & Brand Pitch Presentations',
    category: 'creative-media',
    categoryLabel: 'Sales Enablement',
    summary:
      'Structured commercial presentation PPT decks equipping sales teams to communicate product tiers, key advantages, and brand value clearly.',
    deliverables: [
      'Product, service & package comparison PPT decks',
      'Key value, capability & ROI callout slides',
      'Clean tablet, desktop & digital share format',
      'B2B, retail & specialty dealership pitch adaptation',
    ],
    rateCardMatch: 'Product & pitch presentation PPT',
  },
  {
    id: 'product-launch-campaigns',
    number: '09',
    title: 'Product & Model Launch Campaigns',
    category: 'campaigns-local',
    categoryLabel: 'Go-To-Market Rollouts',
    summary:
      'Focused digital promotion and early-booking enquiry funnels built around new product launches, flagship rollouts, and store unveilings.',
    deliverables: [
      'Pre-launch teaser & early enquiry campaign',
      'Launch event promotional creatives',
      'VIP preview & store unveiling invite assets',
      'Priority lead capture for launch-week buyers',
    ],
    rateCardMatch: 'Product / model launch campaign',
  },
  {
    id: 'appointment-visit-campaigns',
    number: '10',
    title: 'Store Visit & Demo Booking Campaigns',
    category: 'campaigns-local',
    categoryLabel: 'Customer Footfall',
    summary:
      'Hyper-local conversion campaigns structured to move interested prospects from digital ads into scheduled showroom visits, consultations, or product demos.',
    deliverables: [
      'Local visit, demo & test-drive booking ads',
      'City catchment radius audience targeting',
      'Preferred date & time slot capture',
      'Team handover for confirmed appointment scheduling',
    ],
    rateCardMatch: 'Demo / visit booking campaign',
  },
  {
    id: 'upgrade-exchange-campaigns',
    number: '11',
    title: 'Upgrade & Trade-In Event Campaigns',
    category: 'campaigns-local',
    categoryLabel: 'Promotional Camps',
    summary:
      'Event-driven lead generation campaigns promoting weekend pop-ups, customer exchange camps, and limited-time upgrade bonus offers.',
    deliverables: [
      'Upgrade bonus & trade-in offer creatives',
      'Event-week local awareness & instant lead forms',
      'Buyer qualification details captured on entry',
      'Weekend footfall & callout support',
    ],
    rateCardMatch: 'Upgrade / exchange event campaign',
  },
  {
    id: 'festive-campaigns',
    number: '12',
    title: 'Festive Campaigns',
    category: 'campaigns-local',
    categoryLabel: 'Seasonal Peaks',
    summary:
      'High-intent seasonal campaigns aligned with major festive buying calendars and year-end retail peaks when consumer demand accelerates.',
    deliverables: [
      'Festive offer creative suite',
      'Time-bound seasonal lead capture',
      'Retargeting of active pipeline enquiries',
      'Limited-window booking urgency messaging',
    ],
    rateCardMatch: 'Festive campaign',
  },
  {
    id: 'google-business-local-marketing',
    number: '13',
    title: 'Google Business Profile & Local Marketing',
    category: 'campaigns-local',
    categoryLabel: 'Local Discovery',
    summary:
      'Optimizing brand discovery across Google Search and Maps so nearby customers find accurate locations, hours, services, and click-to-call links.',
    deliverables: [
      'Google Business Profile management & hygiene',
      'Local SEO management for city catchment searches',
      'Visual showcase & seasonal offer updates',
      'Call & direction intent tracking',
    ],
    rateCardMatch: 'Google Business Profile management',
  },
  {
    id: 'specialty-inventory-campaigns',
    number: '14',
    title: 'Catalog & Specialty Stock Campaigns',
    category: 'campaigns-local',
    categoryLabel: 'Inventory Rotation',
    summary:
      'Dedicated catalog advertising for retail collections, certified pre-owned divisions, and high-margin stock lines to accelerate monthly inventory movement.',
    deliverables: [
      'Catalog & stock highlight creatives',
      'Budget & buyer-segment targeted ads',
      'Direct inventory enquiry capture',
      'Consistent monthly catalog rotation support',
    ],
    rateCardMatch: 'Catalog & stock rotation marketing',
  },
  {
    id: 'customer-retention-campaigns',
    number: '15',
    title: 'Customer Retention Campaigns',
    category: 'campaigns-local',
    categoryLabel: 'Repeat Business',
    summary:
      'Existing-customer outreach campaigns designed to drive repeat purchases, service centre visits, maintenance bookings, and loyalty engagement.',
    deliverables: [
      'Retention & repeat-visit campaign creatives',
      'Seasonal check-up & VIP customer promotions',
      'Add-on, subscription & accessory awareness',
      'Structured customer re-engagement cadence',
    ],
    rateCardMatch: 'Customer retention campaign',
  },
  {
    id: 'corporate-b2b-marketing',
    number: '16',
    title: 'Corporate & B2B Institutional Marketing',
    category: 'campaigns-local',
    categoryLabel: 'B2B & Enterprise',
    summary:
      'Targeted B2B outreach and campaign support focused on corporate procurement, institutional buyers, and commercial fleet or bulk accounts.',
    deliverables: [
      'Corporate & B2B buyer campaign outreach',
      'Institutional ROI & commercial value framing',
      'Bulk enquiry capture & qualification',
      'Dedicated pitch deck & sales alignment',
    ],
    rateCardMatch: 'Corporate / B2B campaign',
  },
  {
    id: 'commercial-sales-training',
    number: '17',
    title: 'Sales Team & Showroom Training',
    category: 'sales-training',
    categoryLabel: '16 Years Commercial Pedigree',
    scopeNote: '₹25,000 per session · Scope, duration & location agreed before booking',
    summary:
      'Practical frontline sales and retail coaching backed by 16 years of high-trust selling experience from Maruti Suzuki to Audi.',
    deliverables: [
      'Customer greeting & hospitality etiquette standards',
      'Structured product discovery & demonstration walkarounds',
      'Calm objection handling & value-based negotiation',
      'Follow-up discipline & deal closing craft',
    ],
    rateCardMatch: 'Sales training',
  },
  {
    id: 'personality-development',
    number: '18',
    title: 'Personality Development',
    category: 'sales-training',
    categoryLabel: 'Executive Readiness',
    scopeNote: '₹25,000 per session · Tailored for customer-facing teams',
    summary:
      'Dedicated grooming, communication clarity, body language, and executive presence workshops for client-facing sales and advisory staff.',
    deliverables: [
      'Professional grooming & poised body language',
      'Verbal clarity, active listening & consultative tone',
      'Confidence building for high-value client conversations',
      'Consistent team-wide brand representation standards',
    ],
    rateCardMatch: 'Personality development training',
  },
];

export const EXPERIENCE_MILESTONES: ExperienceMilestone[] = [
  {
    number: '01',
    title: 'Cross-Industry Agency Execution',
    spectrum: 'Retail, D2C, B2B & Dealerships',
    description:
      'Uniting paid acquisition, short-form video, social media, and search visibility into measurable lead pipelines tailored to each sector.',
  },
  {
    number: '02',
    title: 'High-Trust Buyer Psychology',
    spectrum: 'Mass-Market to Luxury Segment Insights',
    description:
      'Sixteen years of frontline commercial exposure (from Maruti Suzuki to Audi) reveals how everyday consumers and premium buyers compare options and decide trust.',
  },
  {
    number: '03',
    title: 'Product Story & Presentation',
    spectrum: 'First Impression to Customer Handover',
    description:
      'Structuring memorable demonstrations, clear benefit storytelling, and customer experiences that convert first-time enquiries into referrals.',
  },
  {
    number: '04',
    title: 'CRM & Enquiry Discipline',
    spectrum: 'Zero-Leakage Pipeline Hygiene',
    description:
      'Eliminating missed callbacks through clean lead classification (Hot, Warm, Future Follow-up), structured notes, and daily reporting accountability.',
  },
  {
    number: '05',
    title: 'Full-Funnel Sales Alignment',
    spectrum: 'Ad Click → Qualification → Visit → Close',
    description:
      'Bridging digital ad impressions and frontline sales desks so marketing investment translates directly into qualified meetings and closed revenue.',
  },
  {
    number: '06',
    title: 'Executive Team Development',
    spectrum: 'Grooming, Etiquette & Closing Confidence',
    description:
      'Hands-on coaching for frontline consultants and sales executives on communication clarity, body language, objection handling, and disciplined follow-up.',
  },
];

export const TRAINING_CURRICULUM = [
  'Personality development & executive mindset',
  'Professional grooming & frontline readiness',
  'Structured verbal & non-verbal communication',
  'Client hospitality etiquette & greeting standards',
  '6-point product walkthrough & presentation',
  'Purposeful live demonstration & value framing',
  'Calm, factual objection handling',
  'Value-anchored commercial negotiation',
  'Daily CRM & multi-touch follow-up discipline',
  'Confident booking & closing techniques',
];

export const PRICING_PACKAGES: PricingPackage[] = [
  {
    id: 'package-a',
    code: 'PACKAGE A',
    name: 'Full-Service Growth Marketing & Lead Management',
    subtitle:
      'Complete end-to-end digital customer acquisition paired with managed AI-assisted calling and enquiry qualification.',
    setupFee: '₹39,999',
    monthlyFee: '₹49,999',
    featured: true,
    includes: [
      'Meta ads management & campaign optimization',
      'Lead generation forms & conversion creatives',
      'AI-assisted calling up to 1,000 mins/month (subject to vendor plan)',
      'Structured lead filtering & buyer intent capture',
      'Hot / Warm / Future Follow-up / Unreachable / Not Interested classification',
      'Daily Excel enquiry reports & monthly performance review',
    ],
    excludes: [
      'Meta ad spend (paid directly to Meta by client)',
      'Extra AI calling minutes beyond 1,000 mins/month',
      'Influencer / creator fees',
      'Special on-location video shoots & third-party production',
    ],
    enquiryServiceValue: 'Package A — Full-Service Growth Marketing & Lead Management',
  },
  {
    id: 'package-b',
    code: 'PACKAGE B',
    name: 'Lead Filtering & Qualification Only',
    subtitle:
      'Dedicated managed calling and classification for businesses that already receive incoming enquiries and need disciplined qualification.',
    setupFee: '₹14,999',
    monthlyFee: '₹19,999',
    featured: false,
    includes: [
      'AI-assisted calling of existing inbound enquiries (up to 1,000 mins/month)',
      'Requirement, budget, timeline & appointment intent capture',
      'Hot / Warm / Future Follow-up / Unreachable / Not Interested classification',
      'Daily Excel qualification sheets & call summaries',
      'Monthly qualification & conversion insight report',
    ],
    excludes: [
      'Meta advertising & paid campaign management',
      'New lead generation (qualifies existing enquiries only)',
      'Extra AI calling minutes beyond 1,000 mins/month',
    ],
    enquiryServiceValue: 'Package B — Lead Filtering & Qualification Only',
  },
];

export const RATE_CARD_ITEMS: RateCardItem[] = [
  {
    id: 'rc-1',
    service: 'Meta lead generation management',
    category: 'Lead Generation',
    fee: '₹20,000',
    unit: '/month',
    notes: 'Campaign strategy, ad setup & optimization (ad spend extra)',
  },
  {
    id: 'rc-2',
    service: 'Lead filtering and qualification',
    category: 'Qualification',
    fee: '₹12,000',
    unit: '/month',
    notes: 'Existing enquiry calling & Hot/Warm/Future classification',
  },
  {
    id: 'rc-3',
    service: 'AI calling workflow management',
    category: 'Qualification',
    fee: '₹5,000',
    unit: '/month',
    notes: 'Managed internally by AKYIN (not standalone software)',
  },
  {
    id: 'rc-4',
    service: 'CRM and lead pipeline management',
    category: 'Operations',
    fee: '₹5,000',
    unit: '/month',
    notes: 'Pipeline hygiene, status tracking & Excel/summary reporting',
  },
  {
    id: 'rc-5',
    service: 'Social media management',
    category: 'Creative & Social',
    fee: '₹8,000',
    unit: '/month',
    notes: 'Scheduled brand content & page hygiene',
  },
  {
    id: 'rc-6',
    service: '8 promotional reels',
    category: 'Creative & Social',
    fee: '₹10,000',
    unit: '/month',
    notes: 'Edited vertical reels from client or curated footage',
  },
  {
    id: 'rc-7',
    service: '10 graphic creatives',
    category: 'Creative & Social',
    fee: '₹4,000',
    unit: '/month',
    notes: 'Static offer, product highlight & festive templates',
  },
  {
    id: 'rc-8',
    service: 'Influencer campaign coordination',
    category: 'Influencer',
    fee: '₹2,500',
    unit: '/campaign',
    notes: 'Creator shortlisting, brief & shoot scheduling',
  },
  {
    id: 'rc-9',
    service: 'Influencer video and upload',
    category: 'Influencer',
    fee: '₹6,000',
    unit: '/creator',
    notes: 'Coordination & content publishing workflow (creator fees separate)',
  },
  {
    id: 'rc-10',
    service: 'Product / model launch campaign',
    category: 'Campaigns',
    fee: '₹10,000',
    unit: '/campaign',
    notes: 'Dedicated new product/model unveiling & booking promotion',
  },
  {
    id: 'rc-11',
    service: 'Demo / visit booking campaign',
    category: 'Campaigns',
    fee: '₹7,500',
    unit: '/campaign',
    notes: 'Targeted local appointment, demo or test-drive booking drive',
  },
  {
    id: 'rc-12',
    service: 'Upgrade / exchange event campaign',
    category: 'Campaigns',
    fee: '₹10,000',
    unit: '/campaign',
    notes: 'Promotional weekend event & upgrade valuation push',
  },
  {
    id: 'rc-13',
    service: 'Festive campaign',
    category: 'Campaigns',
    fee: '₹10,000',
    unit: '/campaign',
    notes: 'Seasonal offer rollout & customer footfall drive',
  },
  {
    id: 'rc-14',
    service: 'Catalog & stock rotation marketing',
    category: 'Campaigns',
    fee: '₹8,000',
    unit: '/month',
    notes: 'Specialty inventory & pre-owned stock promotion',
  },
  {
    id: 'rc-15',
    service: 'Google Business Profile management',
    category: 'Local Search',
    fee: '₹3,000',
    unit: '/month',
    notes: 'Listing hygiene, updates & local Maps discovery',
  },
  {
    id: 'rc-16',
    service: 'Local SEO management',
    category: 'Local Search',
    fee: '₹6,000',
    unit: '/month',
    notes: 'Catchment keyword & regional search visibility',
  },
  {
    id: 'rc-17',
    service: 'Customer retention campaign',
    category: 'Retention',
    fee: '₹8,000',
    unit: '/month',
    notes: 'Repeat customer & service centre booking outreach',
  },
  {
    id: 'rc-18',
    service: 'Corporate / B2B campaign',
    category: 'B2B / Institutional',
    fee: '₹10,000',
    unit: '/campaign',
    notes: 'Institutional, corporate & commercial buyer acquisition',
  },
  {
    id: 'rc-19',
    service: 'Product & pitch presentation PPT',
    category: 'Sales Enablement',
    fee: '₹3,000',
    unit: '/presentation',
    notes: 'Structured offering, product & pricing sales deck',
  },
  {
    id: 'rc-20',
    service: 'Sales training',
    category: 'Training',
    fee: '₹25,000',
    unit: '/session',
    notes: 'Product presentation, objection handling & deal closing',
  },
  {
    id: 'rc-21',
    service: 'Personality development training',
    category: 'Training',
    fee: '₹25,000',
    unit: '/session',
    notes: 'Grooming, communication & executive frontline etiquette',
  },
];

export const ENQUIRY_CATEGORIES = [
  'General Business Enquiry',
  'Publishing Enquiry',
  'Marketing Services Enquiry',
  'Retail and Store Enquiry',
  'AICalc Enquiry',
  'Kartigo Business Enquiry',
  'BizNXT Consulting Enquiry',
  'Budget Bazaar Enquiry',
  'Partnership Enquiry',
] as const;

export const BUSINESS_VERTICAL_OPTIONS = [
  'AKYIN Ventures (Corporate Group)',
  'Akyin Publishing',
  'Akyin Marketing',
  'Akyin Store / AKYIN THRIFT',
  'AICalc (aicalc.in)',
  'Kartigo (kartigo.online)',
  'BizNXT (biznxt.online)',
  'Budget Bazaar (budgetbazaar.org)',
] as const;

export const ENQUIRY_TYPE_OPTIONS: string[] = [
  'General Consultation / Proposal',
  'Package A — Full-Service Growth Marketing & Lead Management',
  'Package B — Lead Filtering & Qualification Only',
  ...RATE_CARD_ITEMS.map((item) => item.service),
  'Book Distribution / Publishing Rights',
  'AKYIN THRIFT Wholesale / Shopping Enquiry',
  'AICalc Platform / Integration Enquiry',
  'Kartigo B2B Buyer / Supplier Onboarding',
  'BizNXT Business Guidance & Consulting Enquiry',
  'Budget Bazaar Retail & Product Enquiry',
  'Strategic Business Partnership',
];
