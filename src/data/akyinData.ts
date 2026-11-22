export type AppRoute =
  | '/'
  | '/about'
  | '/ventures'
  | '/ventures/publishing'
  | '/ventures/marketing'
  | '/ventures/store'
  | '/ventures/aicalc'
  | '/ventures/kartigo'
  | '/ventures/biznxt'
  | '/ventures/budget-bazaar'
  | '/insights'
  | '/contact'
  | '/sitemap';

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
  warmCorporateHero: '/src/assets/images/akyin_warm_corporate_hero_1795332556147.jpg',
  warmEditorialStudio: '/src/assets/images/akyin_ventures_editorial_1795332556079.jpg',
  aicalcWorkspace: '/src/assets/images/aicalc_bright_workspace_1795332556304.jpg',
  publishingHero: '/src/assets/images/publishing_editorial_hero_1795331975752.jpg',
  disciplineCodeBook: '/src/assets/images/discipline_code_book_1795331975194.jpg',
  heroShowroom: '/src/assets/images/hero_automotive_showroom_1795330448365.jpg',
  salesTraining: '/src/assets/images/showroom_sales_training_1795330450860.jpg',
  automotiveHeritage: '/src/assets/images/automotive_heritage_timeline_1795330450722.jpg',
  thriftHero: '/src/assets/images/thrift_fashion_hero_1795331975049.jpg',
  thriftFlatlay: '/src/assets/images/thrift_apparel_flatlay_1795331975547.jpg',
  kartigoWarehouse: '/src/assets/images/kartigo_warehouse_b2b_1795331975536.jpg',
  biznxtConsulting: '/src/assets/images/biznxt_consulting_workspace_1795333858437.jpg',
  biznxtStrategy: '/src/assets/images/biznxt_strategy_table_1795333858580.jpg',
  budgetBazaarRetail: '/src/assets/images/budget_bazaar_retail_1795333859087.jpg',
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
    imageAlt: 'Hardcover editions and brass lamp in an editorial study',
  },
  {
    id: 'marketing',
    code: '02',
    name: 'AKYIN Marketing',
    shortName: 'Akyin Marketing',
    route: '/ventures/marketing',
    sector: 'Automotive Marketing & Sales Training',
    positioning: 'Drive More Enquiries. Build Stronger Dealerships.',
    description:
      'Specialized automotive marketing division helping dealerships attract buyers, qualify existing enquiries via managed AI-assisted calling, and train showroom sales teams—backed by 16 years of automobile industry experience.',
    image: IMAGES.salesTraining,
    imageAlt: 'Automobile dealership consultants conducting a showroom vehicle walkaround',
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
    imageAlt: 'Curated clothing racks in a warm sunlit boutique showroom',
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
    imageAlt: 'Bright minimalist desk with laptop and tablet for AICalc technology',
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
    imageAlt: 'Organized commercial warehouse and wholesale stock shelving',
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
    imageAlt: 'Sunlit oak conference workspace for BizNXT business consulting',
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
    imageAlt: 'Bright contemporary Budget Bazaar retail store shelves with everyday household items',
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
    relationshipLabel: 'AKYIN Venture',
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
    title: 'Automotive Industry Experience',
    meta: '16 Years · Maruti Suzuki to Audi',
    description:
      'Sixteen years of direct, practical automobile industry exposure across volume showrooms and luxury automotive brands—understanding how buyers compare variants, negotiate, and take delivery.',
  },
  {
    number: '02',
    title: 'Digital Marketing',
    meta: 'Enquiry Generation · Local Reach',
    description:
      'Structured Meta lead campaigns, vehicle launch creatives, and hyper-local search visibility designed specifically to generate dealership enquiries.',
  },
  {
    number: '03',
    title: 'Sales Team Development',
    meta: 'Showroom Discipline · Closing Craft',
    description:
      'Practical personality development, grooming, walkaround presentation, test-drive execution, and follow-up coaching for automobile sales executives.',
  },
];

export const SERVICE_CATEGORIES: { id: ServiceCategory; label: string }[] = [
  { id: 'all', label: 'All Services (18)' },
  { id: 'lead-crm', label: 'Lead Gen, Filtering & CRM' },
  { id: 'creative-media', label: 'Creative, Video & Social' },
  { id: 'campaigns-local', label: 'Campaigns & Local Growth' },
  { id: 'sales-training', label: 'Sales Training & Development' },
];

export const MARKETING_SERVICES: MarketingService[] = [
  {
    id: 'lead-generation',
    number: '01',
    title: 'Lead Generation',
    category: 'lead-crm',
    categoryLabel: 'New Buyer Acquisition',
    scopeNote: 'Focused strictly on generating new dealership enquiries',
    summary:
      'Meta Ads, vehicle promotions, instant lead forms, conversion landing pages, retargeting, and lead source reporting engineered to attract active buyers.',
    deliverables: [
      'Meta Ads setup & ongoing campaign management',
      'Vehicle-specific promotions & offer creatives',
      'Lead forms & dedicated landing pages',
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
    scopeNote: 'Qualifies existing dealership enquiries — does NOT generate new leads',
    summary:
      'Managed AI-assisted calling of existing dealership enquiries to capture buyer readiness before showroom follow-up.',
    deliverables: [
      'Identifies model/variant, budget, purchase timeline, exchange, finance & test-drive interest',
      'Captures preferred callback timing',
      'Classifies leads: Hot, Warm, Future Follow-up, Unreachable & Not Interested',
      'Delivers Daily Excel reports, call summaries, classification & monthly report',
    ],
    rateCardMatch: 'Lead filtering and qualification',
  },
  {
    id: 'ai-assisted-calling',
    number: '03',
    title: 'AI-Assisted Calling',
    category: 'lead-crm',
    categoryLabel: 'Managed Operations',
    scopeNote: 'Operated internally by AKYIN — not sold as standalone software',
    summary:
      'Structured AI-assisted outbound enquiry calling workflows operated directly by the AKYIN MARKETINGS team to maintain fast response discipline.',
    deliverables: [
      'Calling script & dealership workflow alignment',
      'Up to 1,000 mins/month included in retainer packages (subject to vendor plan)',
      'Structured call outcome logging & escalation',
      'Zero client-side software management overhead',
    ],
    rateCardMatch: 'AI calling workflow management',
  },
  {
    id: 'crm-pipeline-management',
    number: '04',
    title: 'CRM & Lead Pipeline Management',
    category: 'lead-crm',
    categoryLabel: 'Enquiry Hygiene',
    scopeNote: 'AKYIN manages pipeline tracking internally — we do NOT sell proprietary CRM software',
    summary:
      'Disciplined enquiry tracking, stage updates, and daily Excel / pipeline summaries so showroom managers see every open prospect clearly.',
    deliverables: [
      'Enquiry stage hygiene & duplicate cleanup',
      'Priority routing for Hot & Test-Drive callbacks',
      'Daily Excel reporting sheets for dealership BDC',
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
      'Consistent dealership social presence across Instagram and Facebook showcasing vehicle highlights, delivery stories, and showroom credibility.',
    deliverables: [
      'Monthly dealership content calendar & posting',
      'Model highlights & showroom updates',
      'Consistent dealership visual standards',
      'Monthly content & reach overview',
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
      'Coordinating regional automotive and lifestyle creators for authentic showroom walkarounds, test-drive features, and model spotlights.',
    deliverables: [
      'Creator shortlisting & campaign briefing',
      'Showroom shoot scheduling & coordination',
      'Influencer video & upload workflow',
      'Dealership enquiry link & CTA alignment',
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
      'Automotive reels and static graphic creatives designed for Meta feeds, stories, and regional vehicle promotions.',
    deliverables: [
      '8 promotional reels packages',
      '10 graphic creatives packages',
      'Offer, EMI & model feature visual layouts',
      'Multi-placement aspect ratio formatting',
    ],
    rateCardMatch: '8 promotional reels',
  },
  {
    id: 'vehicle-product-presentations',
    number: '08',
    title: 'Vehicle Product Presentations',
    category: 'creative-media',
    categoryLabel: 'Sales Enablement',
    summary:
      'Structured vehicle presentation PPT decks equipping sales consultants to communicate variant differences and key features clearly.',
    deliverables: [
      'Model & trim comparison presentation PPTs',
      'Key safety, powertrain & comfort callouts',
      'Clean showroom tablet & digital share format',
      'Corporate & fleet pitch adaptation',
    ],
    rateCardMatch: 'Vehicle presentation PPT',
  },
  {
    id: 'vehicle-launch-campaigns',
    number: '09',
    title: 'Vehicle Launch Campaigns',
    category: 'campaigns-local',
    categoryLabel: 'New Model Rollouts',
    summary:
      'Focused digital promotion and early-booking enquiry funnels built around new vehicle launches, facelifts, and showroom unveilings.',
    deliverables: [
      'Pre-launch teaser & booking enquiry campaign',
      'Launch event promotional creatives',
      'Showroom unveiling invite assets',
      'Priority lead capture for early bookings',
    ],
    rateCardMatch: 'Vehicle launch campaign',
  },
  {
    id: 'test-drive-campaigns',
    number: '10',
    title: 'Test Drive Campaigns',
    category: 'campaigns-local',
    categoryLabel: 'Showroom Footfall',
    summary:
      'Hyper-local conversion campaigns structured to move interested buyers from online enquiry into scheduled showroom or doorstep test drives.',
    deliverables: [
      'Model-specific test-drive booking ads',
      'Dealership catchment radius targeting',
      'Preferred date & time slot capture',
      'BDC handover for test-drive confirmation',
    ],
    rateCardMatch: 'Test-drive campaign',
  },
  {
    id: 'exchange-mela-campaigns',
    number: '11',
    title: 'Exchange Mela Campaigns',
    category: 'campaigns-local',
    categoryLabel: 'Trade-In Events',
    summary:
      'Event-driven lead generation campaigns promoting dealership Exchange Melas, old-car valuation camps, and upgrade bonus offers.',
    deliverables: [
      'Exchange bonus & valuation offer creatives',
      'Event-week local awareness & lead forms',
      'Current vehicle details capture on enquiry',
      'Weekend showroom footfall support',
    ],
    rateCardMatch: 'Exchange mela campaign',
  },
  {
    id: 'festive-campaigns',
    number: '12',
    title: 'Festive Campaigns',
    category: 'campaigns-local',
    categoryLabel: 'Seasonal Peaks',
    summary:
      'High-intent seasonal campaigns aligned with Navratri, Diwali, Dussehra, and year-end booking windows when buyer demand accelerates.',
    deliverables: [
      'Festive offer creative suite',
      'Time-bound seasonal lead capture',
      'Retargeting of active showroom enquiries',
      'Delivery-slot & booking urgency messaging',
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
      'Optimizing dealership discovery across Google Search and Maps so nearby buyers find accurate showroom details, directions, and phone links.',
    deliverables: [
      'Google Business Profile management & hygiene',
      'Local SEO management for catchment searches',
      'Showroom visual & model update posts',
      'Call & direction intent visibility',
    ],
    rateCardMatch: 'Google Business Profile management',
  },
  {
    id: 'pre-owned-vehicle-marketing',
    number: '14',
    title: 'Pre-Owned Vehicle Marketing',
    category: 'campaigns-local',
    categoryLabel: 'Used Car Division',
    summary:
      'Dedicated inventory campaigns for certified pre-owned dealerships to showcase available stock and attract value-focused buyers.',
    deliverables: [
      'Pre-owned inventory showcase creatives',
      'Budget & segment-targeted buyer ads',
      'Trade-in & upgrade enquiry capture',
      'Consistent monthly stock rotation support',
    ],
    rateCardMatch: 'Pre-owned vehicle marketing',
  },
  {
    id: 'customer-retention-campaigns',
    number: '15',
    title: 'Customer Retention Campaigns',
    category: 'campaigns-local',
    categoryLabel: 'After-Sales Growth',
    summary:
      'Service centre and existing-owner outreach campaigns designed to drive periodic maintenance bookings, check-up camps, and repeat visits.',
    deliverables: [
      'Service centre retention campaign creatives',
      'Seasonal inspection & workshop promotions',
      'Extended warranty & accessory awareness',
      'Structured owner re-engagement cadence',
    ],
    rateCardMatch: 'Service centre retention campaign',
  },
  {
    id: 'corporate-fleet-marketing',
    number: '16',
    title: 'Corporate & Fleet Marketing',
    category: 'campaigns-local',
    categoryLabel: 'B2B Institutional',
    summary:
      'Targeted B2B outreach and campaign support focused on corporate buyers, institutional accounts, and commercial fleet enquiries.',
    deliverables: [
      'Corporate & fleet buyer campaign outreach',
      'Institutional value & ownership framing',
      'Bulk enquiry capture & qualification',
      'Dedicated presentation alignment',
    ],
    rateCardMatch: 'Corporate/fleet campaign',
  },
  {
    id: 'automotive-sales-training',
    number: '17',
    title: 'Automotive Sales Training',
    category: 'sales-training',
    categoryLabel: '16 Years Industry Experience',
    scopeNote: '₹25,000 per session · Scope, duration & location agreed before booking',
    summary:
      'Practical dealership showroom sales training backed by 16 years of automotive experience spanning Maruti Suzuki to Audi.',
    deliverables: [
      'Showroom etiquette & customer greeting standards',
      'Structured vehicle walkaround & test-drive presentation',
      'Objection handling & value-based negotiation',
      'Follow-up discipline & booking closing craft',
    ],
    rateCardMatch: 'Sales training',
  },
  {
    id: 'personality-development',
    number: '18',
    title: 'Personality Development',
    category: 'sales-training',
    categoryLabel: 'Executive Readiness',
    scopeNote: '₹25,000 per session · Tailored for dealership frontline teams',
    summary:
      'Dedicated grooming, communication clarity, body language, and executive presence workshops for automobile sales consultants.',
    deliverables: [
      'Professional showroom grooming & posture',
      'Verbal clarity, listening & consultative tone',
      'Confidence building for premium buyer conversations',
      'Consistent team-wide customer experience standards',
    ],
    rateCardMatch: 'Personality development training',
  },
];

export const EXPERIENCE_MILESTONES: ExperienceMilestone[] = [
  {
    number: '01',
    title: 'Dealership Operations',
    spectrum: 'Mass-Market Volume to Luxury Flagships',
    description:
      'Understanding showroom floor cadence, daily BDC coordination, stock-to-enquiry alignment, and how marketing fits into real dealership targets.',
  },
  {
    number: '02',
    title: 'Showroom Customer Behaviour',
    spectrum: 'Maruti Suzuki to Audi Buyer Psychology',
    description:
      'Practical insight into how first-time hatchback families, SUV upgraders, and luxury sedan buyers research, shortlist, and evaluate trust.',
  },
  {
    number: '03',
    title: 'Vehicle Delivery & Presentation',
    spectrum: 'First Impression to Handover Ceremony',
    description:
      'Structuring memorable walkarounds, feature storytelling, and delivery-day experiences that generate organic referrals.',
  },
  {
    number: '04',
    title: 'CRM & Enquiry Discipline',
    spectrum: 'Zero-Leakage Pipeline Hygiene',
    description:
      'Eliminating missed callbacks through clean lead classification (Hot, Warm, Future Follow-up), structured notes, and daily accountability.',
  },
  {
    number: '05',
    title: 'Showroom Sales Processes',
    spectrum: 'Enquiry → Test Drive → Negotiation → Delivery',
    description:
      'Bridging the gap between digital ad clicks and physical showroom test drives so marketing investment translates into actual bookings.',
  },
  {
    number: '06',
    title: 'Sales Executive Development',
    spectrum: 'Grooming, Etiquette & Closing Confidence',
    description:
      'Hands-on coaching for frontline consultants on communication clarity, body language, objection handling, and disciplined follow-up.',
  },
];

export const TRAINING_CURRICULUM = [
  'Personality development & executive mindset',
  'Professional grooming & showroom readiness',
  'Structured verbal & non-verbal communication',
  'Showroom floor etiquette & greeting standards',
  '6-point vehicle walkaround presentation',
  'Purposeful test-drive presentation & route framing',
  'Calm, factual objection handling',
  'Value-anchored price & exchange negotiation',
  'Daily CRM & multi-touch follow-up discipline',
  'Confident booking & closing techniques',
];

export const PRICING_PACKAGES: PricingPackage[] = [
  {
    id: 'package-a',
    code: 'PACKAGE A',
    name: 'Full Dealership Marketing & Lead Management',
    subtitle:
      'Complete end-to-end digital buyer acquisition paired with managed AI-assisted calling and enquiry qualification.',
    setupFee: '₹39,999',
    monthlyFee: '₹49,999',
    featured: true,
    includes: [
      'Meta ads management & campaign optimization',
      'Lead generation forms & vehicle promotion creatives',
      'AI-assisted calling up to 1,000 mins/month (subject to vendor plan)',
      'Structured lead filtering & buyer intent capture',
      'Hot / Warm / Future Follow-up / Unreachable / Not Interested classification',
      'Daily Excel enquiry reports & monthly performance review',
    ],
    excludes: [
      'Meta ad spend (paid directly to Meta by dealership)',
      'Extra AI calling minutes beyond 1,000 mins/month',
      'Influencer / creator fees',
      'Special on-location video shoots & third-party production',
    ],
    enquiryServiceValue: 'Package A — Full Dealership Marketing & Lead Management',
  },
  {
    id: 'package-b',
    code: 'PACKAGE B',
    name: 'Lead Filtering & Qualification Only',
    subtitle:
      'Dedicated managed calling and classification for dealerships that already have incoming enquiries and need disciplined qualification.',
    setupFee: '₹14,999',
    monthlyFee: '₹19,999',
    featured: false,
    includes: [
      'AI-assisted calling of existing dealership enquiries (up to 1,000 mins/month)',
      'Model/variant, budget, timeline, exchange, finance & test-drive capture',
      'Hot / Warm / Future Follow-up / Unreachable / Not Interested classification',
      'Daily Excel qualification sheets & call summaries',
      'Monthly qualification & conversion insight report',
    ],
    excludes: [
      'Meta advertising & paid campaign management',
      'New lead generation (qualifies existing dealership enquiries only)',
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
    notes: 'Scheduled dealership content & page hygiene',
  },
  {
    id: 'rc-6',
    service: '8 promotional reels',
    category: 'Creative & Social',
    fee: '₹10,000',
    unit: '/month',
    notes: 'Edited vertical reels from dealership or stock footage',
  },
  {
    id: 'rc-7',
    service: '10 graphic creatives',
    category: 'Creative & Social',
    fee: '₹4,000',
    unit: '/month',
    notes: 'Static offer, model highlight & festive templates',
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
    service: 'Vehicle launch campaign',
    category: 'Campaigns',
    fee: '₹10,000',
    unit: '/campaign',
    notes: 'Dedicated new model unveiling & booking promotion',
  },
  {
    id: 'rc-11',
    service: 'Test-drive campaign',
    category: 'Campaigns',
    fee: '₹7,500',
    unit: '/campaign',
    notes: 'Targeted local test-drive booking drive',
  },
  {
    id: 'rc-12',
    service: 'Exchange mela campaign',
    category: 'Campaigns',
    fee: '₹10,000',
    unit: '/campaign',
    notes: 'Trade-in & weekend valuation event push',
  },
  {
    id: 'rc-13',
    service: 'Festive campaign',
    category: 'Campaigns',
    fee: '₹10,000',
    unit: '/campaign',
    notes: 'Seasonal offer rollout & showroom footfall drive',
  },
  {
    id: 'rc-14',
    service: 'Pre-owned vehicle marketing',
    category: 'Campaigns',
    fee: '₹8,000',
    unit: '/month',
    notes: 'Certified used-car stock promotion',
  },
  {
    id: 'rc-15',
    service: 'Google Business Profile management',
    category: 'Local Search',
    fee: '₹3,000',
    unit: '/month',
    notes: 'Listing hygiene, updates & local showroom discovery',
  },
  {
    id: 'rc-16',
    service: 'Local SEO management',
    category: 'Local Search',
    fee: '₹6,000',
    unit: '/month',
    notes: 'Catchment keyword & local search visibility',
  },
  {
    id: 'rc-17',
    service: 'Service centre retention campaign',
    category: 'After-Sales',
    fee: '₹8,000',
    unit: '/month',
    notes: 'Periodic service & workshop booking outreach',
  },
  {
    id: 'rc-18',
    service: 'Corporate/fleet campaign',
    category: 'B2B / Fleet',
    fee: '₹10,000',
    unit: '/campaign',
    notes: 'Institutional & fleet buyer acquisition drive',
  },
  {
    id: 'rc-19',
    service: 'Vehicle presentation PPT',
    category: 'Sales Enablement',
    fee: '₹3,000',
    unit: '/presentation',
    notes: 'Structured model & variant sales deck',
  },
  {
    id: 'rc-20',
    service: 'Sales training',
    category: 'Training',
    fee: '₹25,000',
    unit: '/session',
    notes: 'Showroom walkaround, test-drive, objection & closing',
  },
  {
    id: 'rc-21',
    service: 'Personality development training',
    category: 'Training',
    fee: '₹25,000',
    unit: '/session',
    notes: 'Grooming, communication & executive showroom etiquette',
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
  'Package A — Full Dealership Marketing & Lead Management',
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
