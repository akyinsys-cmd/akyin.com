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
  | '/pricing'
  | '/advisory'
  | '/insights'
  | '/terms'
  | '/privacy'
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
  contactName: 'Shaikh Nazir',
  domain: 'https://akyin.com',
  websiteLabel: 'akyin.com',
  email: 'connect@akyin.com',
  phoneDisplay: '+91 63956 94011',
  phoneHref: 'tel:+916395694011',
  whatsappNumber: '916395694011',
  whatsappChannelUrl: 'https://whatsapp.com/channel/0029VbCz1qOJ3jurZuI6cM3U',
  whatsappUrl: 'https://whatsapp.com/channel/0029VbCz1qOJ3jurZuI6cM3U',
  internationalPositioning: 'Building Businesses. Creating Opportunities.',
  internationalSupportLine: 'Serving businesses across India and the UAE.',
  regionIndicator: 'INDIA 🇮🇳 | UAE 🇦🇪',
  marketingSocialHandle: '@akyinventures',
  marketingSocials: [
    {
      id: 'facebook',
      name: 'Facebook',
      displayLabel: 'Facebook – Follow AKYIN',
      url: 'https://www.facebook.com/profile.php?id=61595204474890',
      handle: 'Follow AKYIN',
    },
    {
      id: 'youtube',
      name: 'YouTube',
      displayLabel: 'YouTube – Subscribe to AKYIN Marketing',
      url: 'https://youtube.com/@akyinmarketing?si=hgB_tEfczt79H7wW',
      handle: 'Subscribe to AKYIN Marketing',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      displayLabel: 'Instagram – Follow AKYIN Ventures',
      url: 'https://www.instagram.com/akyinventures/',
      handle: 'Follow AKYIN Ventures',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      displayLabel: 'WhatsApp – Join AKYIN Updates',
      url: 'https://whatsapp.com/channel/0029VbCz1qOJ3jurZuI6cM3U',
      handle: 'Join AKYIN Updates',
    },
  ],
} as const;

export interface PublishedBook {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  author: string;
  amazonUrl: string;
  asin: string;
  coverImage: string;
  coverAlt: string;
  marketplaceLabel: string;
}

export interface DigitalProduct {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  gumroadUrl: string;
  coverImage: string;
  coverAlt: string;
  platformLabel: string;
}

export const PUBLISHING_LINKS = {
  amazonAuthorStore:
    'https://www.amazon.com/stores/Akyin-S/author/B0H6SY7N3T?_encoding=UTF8&pd_rd_w=r7GRE&content-id=amzn1.sym.7e190e19-9f6f-4df8-807a-5a7608594741&pd_rd_wg=EdC74&pd_rd_r=d01ba7b6-b1c7-4bd2-87fb-cbd0fc9deddb&ref=ap_rdr&shoppingPortalEnabled=true&ccs_id=98bb1963-9c8a-4dab-9f1b-d21a6f908208',
  googlePlayDisciplineCode:
    'https://play.google.com/store/books/details/Akyin_s_THE_DISCIPLINE_CODE?id=seHuEQAAQBAJ',
  pinterest: 'https://pin.it/1R8DhimEe',
} as const;

export const PUBLISHING_BOOKS: PublishedBook[] = [
  {
    id: 'book-discipline-code',
    number: '01',
    title: 'The Discipline Code',
    subtitle: 'Master Your Mind. Build Unbreakable Habits. Win Every Day.',
    author: 'Akyin S.',
    amazonUrl: 'https://a.co/d/0ggfRzci',
    asin: 'B0H6R3BCQR',
    coverImage: '/assets/books/the-discipline-code.jpg',
    coverAlt: 'Official Amazon book cover of The Discipline Code by Akyin S.',
    marketplaceLabel: 'Amazon · Kindle Edition',
  },
  {
    id: 'book-biopic-of-loser',
    number: '02',
    title: 'BIOPIC OF LOSER',
    subtitle:
      'A Gritty Real-Life Biography of Failure, Resilience, and the Ultimate Corporate Automobile Hustle (1989–2013)',
    author: 'AKYIN S. & MAULA S.',
    amazonUrl: 'https://a.co/d/0ig3AHqX',
    asin: 'B0H2QTMXP9',
    coverImage: '/assets/books/biopic-of-loser.jpg',
    coverAlt: 'Official Amazon book cover of Biopic of Loser by AKYIN S. and MAULA S.',
    marketplaceLabel: 'Amazon · Kindle Edition',
  },
  {
    id: 'book-scroll-recovery-plan',
    number: '03',
    title: 'THE SCROLL RECOVERY PLAN',
    subtitle:
      'A 30-Day System to Stop Doomscrolling, Rebuild Focus, and Take Back Your Time',
    author: 'Akyin S.',
    amazonUrl: 'https://a.co/d/0ewHC6eM',
    asin: 'B0HKQ8DDSY',
    coverImage: '/assets/books/the-scroll-recovery-plan.jpg',
    coverAlt: 'Official Amazon book cover of The Scroll Recovery Plan by Akyin S.',
    marketplaceLabel: 'Amazon · Kindle Edition',
  },
  {
    id: 'book-wealth-trap',
    number: '04',
    title: 'The Wealth Trap',
    subtitle:
      'Why Smart People Stay Stuck, Make Emotional Money Mistakes, and Never Build the Wealth They Deserve',
    author: 'Akyin S.',
    amazonUrl: 'https://a.co/d/0eUuZA8r',
    asin: 'B0H4YG4CM9',
    coverImage: '/assets/books/the-wealth-trap.jpg',
    coverAlt: 'Official Amazon book cover of The Wealth Trap by Akyin S.',
    marketplaceLabel: 'Amazon · Kindle Edition',
  },
  {
    id: 'book-reset-code',
    number: '05',
    title: 'THE RESET CODE',
    subtitle:
      'Why Smart People Stay Stuck, Self-Sabotage Success, and Repeat the Same Mistakes—And How to Finally Change Their Life',
    author: 'AKYIN S.',
    amazonUrl: 'https://a.co/d/0h7g4V7g',
    asin: 'B0H5DRF16M',
    coverImage: '/assets/books/the-reset-code.jpg',
    coverAlt: 'Official Amazon book cover of The Reset Code by AKYIN S.',
    marketplaceLabel: 'Amazon · Kindle Edition',
  },
  {
    id: 'book-discipline-reset',
    number: '06',
    title: 'THE DISCIPLINE RESET',
    subtitle:
      'Break Bad Habits, Beat Distractions, Build Self-Discipline, and Achieve Consistent Success',
    author: 'Akyin S.',
    amazonUrl: 'https://a.co/d/02kzLiOu',
    asin: 'B0H4X1BPH7',
    coverImage: '/assets/books/the-discipline-reset.jpg',
    coverAlt: 'Official Amazon book cover of The Discipline Reset by Akyin S.',
    marketplaceLabel: 'Amazon · Kindle Edition',
  },
  {
    id: 'book-overthinking-reset',
    number: '07',
    title: 'THE OVERTHINKING RESET',
    subtitle:
      'Why Intelligent People Overthink, the Invisible Damage It Causes, and How to Break the First Mental Illusion',
    author: 'Akyin S.',
    amazonUrl: 'https://a.co/d/0atu9L9M',
    asin: 'B0GY8NZGKB',
    coverImage: '/assets/books/the-overthinking-reset.jpg',
    coverAlt: 'Official Amazon book cover of The Overthinking Reset by Akyin S.',
    marketplaceLabel: 'Amazon · Kindle Edition',
  },
  {
    id: 'book-dopamine-reset-code',
    number: '08',
    title: 'The Dopamine Reset Code',
    subtitle:
      'Break Phone Addiction, Rewire Your Brain, Build Laser Focus, and Reclaim Your Productivity in 30 Days',
    author: 'Akyin S.',
    amazonUrl: 'https://a.co/d/0c9NrwA7',
    asin: 'B0H7M6R3RH',
    coverImage: '/assets/books/the-dopamine-reset-code.jpg',
    coverAlt: 'Official Amazon book cover of The Dopamine Reset Code by Akyin S.',
    marketplaceLabel: 'Amazon · Kindle Edition',
  },
];

export const GUMROAD_DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    id: 'digital-ats-resume-kit',
    number: '01',
    title: 'India ATS Resume & Job Search Kit',
    shortTitle: 'ATS Resume Kit',
    description:
      'Land your next opportunity with a smarter job-search system. The India ATS Resume & Job Search Kit by Akyin is a complete digital career toolkit.',
    gumroadUrl: 'https://akyinspire.gumroad.com/l/atsresumekit',
    coverImage: '/assets/digital-products/ats-resume-kit.png',
    coverAlt: 'Official cover artwork for India ATS Resume & Job Search Kit on Gumroad',
    platformLabel: 'Gumroad · Digital Career Toolkit',
  },
  {
    id: 'digital-scroll-recovery-plan',
    number: '02',
    title: 'THE SCROLL RECOVERY PLAN',
    shortTitle: 'The Scroll Recovery Plan',
    description:
      'A 30-Day System to Stop Doomscrolling, Rebuild Focus, and Take Back Your Time.',
    gumroadUrl: 'https://akyinspire.gumroad.com/l/THESCROLLRECOVERYPLAN?wanted=true',
    coverImage: '/assets/digital-products/scroll-recovery-plan.png',
    coverAlt: 'Official cover artwork for The Scroll Recovery Plan digital guide on Gumroad',
    platformLabel: 'Gumroad · 30-Day Focus System',
  },
  {
    id: 'digital-money-os',
    number: '03',
    title: 'THE MONEY OS™ | Complete Personal Finance Planner & Budgeting System',
    shortTitle: 'The Money OS',
    description:
      'Take control of your money with a system you’ll actually use. THE MONEY OS™ is a practical personal finance planner designed to organize your personal finances.',
    gumroadUrl: 'https://akyinspire.gumroad.com/l/the-money-os?wanted=true',
    coverImage: '/assets/digital-products/the-money-os.png',
    coverAlt: 'Official cover artwork for THE MONEY OS Complete Personal Finance Planner on Gumroad',
    platformLabel: 'Gumroad · Personal Finance OS',
  },
];

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
    sector: 'Book & Digital Publishing · 5 Books',
    positioning: 'Stories, Knowledge & Ideas Worth Sharing.',
    description:
      'Discover books published by AKYIN, created to inspire learning, personal development and new perspectives across Amazon and Google Play Books.',
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
];

export interface EcosystemBrandEntry {
  id: string;
  name: string;
  relationshipLabel: string;
  category: 'venture' | 'client' | 'platform';
  iconKey?: 'amazon' | 'google-play' | 'shopify' | 'instagram' | 'facebook' | 'youtube' | 'whatsapp';
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
];

export const ECOSYSTEM_CLIENTS_TICKER: EcosystemBrandEntry[] = [
  {
    id: 'eco-aicalc',
    name: 'AICalc',
    relationshipLabel: 'Client',
    category: 'client',
    externalUrl: 'https://ais-dev-iwemnrdjpbl2zz7yzoxiyv-71845396109.asia-east1.run.app/ventures/aicalc',
    internalRoute: '/ventures/aicalc',
    wordmarkStyle: 'mono',
  },
  {
    id: 'eco-kartigo',
    name: 'Kartigo',
    relationshipLabel: 'Client',
    category: 'client',
    externalUrl: 'https://ais-dev-iwemnrdjpbl2zz7yzoxiyv-71845396109.asia-east1.run.app/ventures/kartigo',
    internalRoute: '/ventures/kartigo',
    wordmarkStyle: 'sans',
  },
  {
    id: 'eco-biznxt',
    name: 'BizNXT',
    relationshipLabel: 'Client',
    category: 'client',
    externalUrl: 'https://ais-dev-iwemnrdjpbl2zz7yzoxiyv-71845396109.asia-east1.run.app/ventures/biznxt',
    internalRoute: '/ventures/biznxt',
    wordmarkStyle: 'sans',
  },
  {
    id: 'eco-budget-bazaar',
    name: 'Budget Bazaar',
    relationshipLabel: 'Client',
    category: 'client',
    externalUrl: 'https://ais-dev-iwemnrdjpbl2zz7yzoxiyv-71845396109.asia-east1.run.app/ventures/budget-bazaar',
    internalRoute: '/ventures/budget-bazaar',
    wordmarkStyle: 'sans',
  },
  {
    id: 'eco-autoclub',
    name: 'AutoClub',
    relationshipLabel: 'Client',
    category: 'client',
    wordmarkStyle: 'sans',
  },
  {
    id: 'eco-arosco',
    name: 'Arosco Ventures',
    relationshipLabel: 'Client',
    category: 'client',
    wordmarkStyle: 'sans',
  },
  {
    id: 'eco-mei-cosmetics',
    name: 'MEI Cosmetics',
    relationshipLabel: 'Client',
    category: 'client',
    wordmarkStyle: 'serif',
  },
  {
    id: 'eco-krutika-cosmetics',
    name: 'Krutika Cosmetics',
    relationshipLabel: 'Client',
    category: 'client',
    wordmarkStyle: 'serif',
  },
  {
    id: 'eco-nyika-traders',
    name: 'Nyika Traders',
    relationshipLabel: 'Client',
    category: 'client',
    wordmarkStyle: 'sans',
  },
  {
    id: 'eco-ns-traders',
    name: 'NS Traders',
    relationshipLabel: 'Client',
    category: 'client',
    wordmarkStyle: 'sans',
  },
];

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
    id: 'eco-facebook',
    name: 'Facebook',
    relationshipLabel: 'Follow AKYIN',
    category: 'platform',
    iconKey: 'facebook',
    externalUrl: 'https://www.facebook.com/profile.php?id=61595204474890',
  },
  {
    id: 'eco-youtube',
    name: 'YouTube',
    relationshipLabel: 'Subscribe to AKYIN Marketing',
    category: 'platform',
    iconKey: 'youtube',
    externalUrl: 'https://youtube.com/@akyinmarketing?si=hgB_tEfczt79H7wW',
  },
  {
    id: 'eco-instagram',
    name: 'Instagram',
    relationshipLabel: 'Follow AKYIN Ventures',
    category: 'platform',
    iconKey: 'instagram',
    externalUrl: 'https://www.instagram.com/akyinventures/',
  },
  {
    id: 'eco-whatsapp-channel',
    name: 'WhatsApp Channel',
    relationshipLabel: 'Join AKYIN Updates',
    category: 'platform',
    iconKey: 'whatsapp',
    externalUrl: 'https://whatsapp.com/channel/0029VbCz1qOJ3jurZuI6cM3U',
  },
];

export const ECOSYSTEM_CLIENT: EcosystemBrandEntry = ECOSYSTEM_CLIENTS_TICKER[4]; // AutoClub

export const FULL_ECOSYSTEM_TICKER: EcosystemBrandEntry[] = [
  ...ECOSYSTEM_VENTURES_TICKER,
  ...ECOSYSTEM_CLIENTS_TICKER,
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

export interface LeadershipMember {
  id: string;
  name: string;
  title: string;
  divisionFocus: string;
  experienceLabel: string;
  expertise: string;
  headshot: string;
  headshotAlt: string;
  route: AppRoute;
  ctaLabel: string;
}

export const LEADERSHIP_TEAM: LeadershipMember[] = [
  {
    id: 'leader-akyin',
    name: 'Akyin S.',
    title: 'Founder & Managing Director',
    divisionFocus: 'AKYIN Ventures · Publishing & Advisory',
    experienceLabel: '16+ Years Commercial Pedigree',
    expertise:
      'Directs corporate strategy across all seven AKYIN Ventures divisions, authors five books including The Discipline Code, and brings 16 years of automotive and commercial sales leadership spanning Maruti Suzuki to Audi.',
    headshot: '/src/assets/images/leadership_founder_1795529855952.jpg',
    headshotAlt: 'Studio corporate portrait of Akyin S., Founder and Managing Director at AKYIN Ventures',
    route: '/advisory',
    ctaLabel: 'Business Advisory',
  },
  {
    id: 'leader-arjun',
    name: 'Arjun Kulkarni',
    title: 'Director, Automotive Growth & Training',
    divisionFocus: 'AKYIN MARKETINGS · Dealership Division',
    experienceLabel: 'Multi-Brand Showroom Strategy',
    expertise:
      'Architects high-intent Meta and Google Search dealership lead engines, showroom test-drive conversion campaigns, and on-site sales executive training workshops across partner dealership networks.',
    headshot: '/src/assets/images/leadership_automotive_director_1795529855874.jpg',
    headshotAlt:
      'Studio corporate portrait of Arjun Kulkarni, Director of Automotive Growth and Sales Enablement',
    route: '/marketing/automotive',
    ctaLabel: 'Automotive Marketing',
  },
  {
    id: 'leader-meera',
    name: 'Meera Subramanian',
    title: 'Head of Lead Qualification & Operations',
    divisionFocus: 'Lead Filtering · AICalc.in & Kartigo Ops',
    experienceLabel: 'AI-Assisted Vetting & Digital Systems',
    expertise:
      'Leads AKYIN’s strict two-tier AI and telephonic enquiry screening desk, daily CRM pipeline reporting, and operational execution connecting AICalc.in, Kartigo.online B2B trade, and consumer retail units.',
    headshot: '/src/assets/images/leadership_performance_head_1795529856500.jpg',
    headshotAlt:
      'Studio corporate portrait of Meera Subramanian, Head of Lead Qualification and Ecosystem Operations',
    route: '/ventures/marketing',
    ctaLabel: 'Marketing Agency',
  },
];

export interface ClientTestimonial {
  id: string;
  segment: 'automotive' | 'business';
  verticalLabel: string;
  metricValue: string;
  metricLabel: string;
  timeframe: string;
  headline: string;
  quote: string;
  clientName: string;
  role: string;
  organization: string;
  location: string;
  route: AppRoute;
  ctaLabel: string;
}

export const CLIENT_TESTIMONIALS: ClientTestimonial[] = [
  {
    id: 'cs-autoclub',
    segment: 'automotive',
    verticalLabel: 'Automotive Dealership Marketing',
    metricValue: '+42%',
    metricLabel: 'Test-Drive Completion Rate',
    timeframe: 'Within 60 Days · 4 Showrooms',
    headline: 'Separating Paid Meta Campaigns from Automated Buyer Vetting',
    quote:
      'By keeping Meta lead generation strictly separate from AKYIN’s automated WhatsApp and telephonic pre-qualification, our floor team stopped chasing cold clicks. Test-drive completions increased 42% across four branches in 60 days.',
    clientName: 'Praveen Rajagopalan',
    role: 'Managing Director',
    organization: 'AutoClub Multi-Brand Showrooms',
    location: 'Bengaluru, India',
    route: '/marketing/automotive',
    ctaLabel: 'Explore Automotive Marketing',
  },
  {
    id: 'cs-crestline',
    segment: 'automotive',
    verticalLabel: 'Festive & Exchange Campaigns',
    metricValue: '-38%',
    metricLabel: 'Cost Per Qualified Lead',
    timeframe: 'Q4 Festive Drive · 71% Show-Up',
    headline: 'Showroom Footfall Surged Without Expanding Ad Waste',
    quote:
      'During our festive exchange carnival, AKYIN paired geo-fenced Search and Meta campaigns with rapid WhatsApp valuation workflows and sales coaching. Unqualified calls dropped sharply while weekend showroom walk-ins hit a seasonal high.',
    clientName: 'Vikramaditya Rao',
    role: 'Dealer Principal',
    organization: 'Crestline Motors & Pre-Owned Hub',
    location: 'Hyderabad, India',
    route: '/marketing/automotive',
    ctaLabel: 'View Dealership Funnel',
  },
  {
    id: 'cs-auramobility',
    segment: 'automotive',
    verticalLabel: 'EV Retail & Local Search',
    metricValue: '3.1x',
    metricLabel: 'Faster Callback Response Time',
    timeframe: 'Pune & Mumbai EV Showrooms',
    headline: 'Turning High-Ticket EV Queries into Home Test Drives',
    quote:
      'Prospective EV buyers expect quick, technical clarity. AKYIN rebuilt our doorstep test-drive landing flows, Google Maps visibility, and daily target tracker—giving general managers real-time visibility from ad click to booking.',
    clientName: 'Nikhil Deshmukh',
    role: 'Head of Sales Operations',
    organization: 'Aura EV & Luxury Mobility',
    location: 'Pune & Mumbai, India',
    route: '/marketing/automotive',
    ctaLabel: 'Estimate Dealership ROI',
  },
  {
    id: 'cs-apexretail',
    segment: 'business',
    verticalLabel: '1-on-1 Business Advisory',
    metricValue: '4 Months',
    metricLabel: 'Retail Unit-Economics Payback',
    timeframe: 'Post-Advisory Store Launch',
    headline: 'Pragmatic Commercial Clarity Before Signing New Leases',
    quote:
      'Our 1-on-1 Business Advisory session with AKYIN Ventures gave us an unvarnished audit of customer acquisition costs and working-capital buffers before we locked in a multi-year retail lease. It saved months of trial and error.',
    clientName: 'Sunil Krishnamurthy',
    role: 'Founder & CEO',
    organization: 'Apex Retail Ventures',
    location: 'Hyderabad, India',
    route: '/advisory',
    ctaLabel: 'Book Business Advisory',
  },
  {
    id: 'cs-kartigo',
    segment: 'business',
    verticalLabel: 'B2B Stock Supply · Kartigo.online',
    metricValue: '3.2x',
    metricLabel: 'Wholesale Reorder Velocity',
    timeframe: 'Regional B2B Trade Partner',
    headline: 'Predictable Commercial Lot Sourcing Without Middleman Friction',
    quote:
      'Kartigo.online structured how our regional trade desk sources bulk inventory lots. Transparent unit pricing and verified stock availability cut our procurement turnaround time by more than half across repeat cycles.',
    clientName: 'Ramesh Patel',
    role: 'Wholesale Logistics Director',
    organization: 'Gujarat Commercial Trade',
    location: 'Ahmedabad, India',
    route: '/ventures/kartigo',
    ctaLabel: 'Explore Kartigo.online',
  },
  {
    id: 'cs-biznxt',
    segment: 'business',
    verticalLabel: 'Growth Agency & BizNXT Advisory',
    metricValue: '+28%',
    metricLabel: 'B2B Pipeline Conversion Lift',
    timeframe: 'Two-State Expansion Cohort',
    headline: 'Aligning Digital Lead Quality with Frontline Sales Closing',
    quote:
      'Combining AKYIN MARKETINGS lead filtering with BizNXT expansion guidance transformed how our B2B sales consultants handled inbound corporate enquiries. Every callback started with verified budget and timeline context.',
    clientName: 'Priya Nambiar',
    role: 'Managing Partner',
    organization: 'Apex Industrial & B2B Cohort',
    location: 'Chennai, India',
    route: '/ventures/marketing',
    ctaLabel: 'Explore Marketing Agency',
  },
];

