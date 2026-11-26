// server.ts
import "dotenv/config";
import express from "express";
import fs2 from "fs";
import path2 from "path";
import { fileURLToPath } from "url";

// src/data/akyinData.ts
var SERVICE_MARKETPLACE_CATEGORIES = [
  "Automotive Marketing",
  "Digital Marketing",
  "Social Media Management",
  "Creative and Graphic Design",
  "Video and Content Services",
  "Business Documents and Presentations",
  "Excel and Reporting Services",
  "Messaging and Communication",
  "Lead Management and CRM",
  "Business Consulting and Training"
];
var OFFICIAL_CONTACT = {
  parentBrand: "AKYIN VENTURES",
  contactName: "Shaikh Nazir",
  domain: "https://akyin.com",
  websiteLabel: "akyin.com",
  email: "connect@akyin.com",
  whatsappLabel: "WhatsApp Connect",
  whatsappChannelUrl: "https://whatsapp.com/channel/0029VbCz1qOJ3jurZuI6cM3U",
  whatsappUrl: "https://whatsapp.com/channel/0029VbCz1qOJ3jurZuI6cM3U",
  internationalPositioning: "Building Businesses. Creating Opportunities.",
  internationalSupportLine: "Serving businesses across India and the UAE.",
  regionIndicator: "INDIA \u{1F1EE}\u{1F1F3} | UAE \u{1F1E6}\u{1F1EA}",
  marketingSocialHandle: "@akyinventures",
  marketingSocials: [
    {
      id: "facebook",
      name: "Facebook",
      displayLabel: "Facebook \u2013 Follow AKYIN",
      url: "https://www.facebook.com/profile.php?id=61595204474890",
      handle: "Follow AKYIN"
    },
    {
      id: "youtube",
      name: "YouTube",
      displayLabel: "YouTube \u2013 Subscribe to AKYIN Marketing",
      url: "https://youtube.com/@akyinmarketing?si=hgB_tEfczt79H7wW",
      handle: "Subscribe to AKYIN Marketing"
    },
    {
      id: "instagram",
      name: "Instagram",
      displayLabel: "Instagram \u2013 Follow AKYIN Ventures",
      url: "https://www.instagram.com/akyinventures/",
      handle: "Follow AKYIN Ventures"
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      displayLabel: "WhatsApp \u2013 Join AKYIN Updates",
      url: "https://whatsapp.com/channel/0029VbCz1qOJ3jurZuI6cM3U",
      handle: "Join AKYIN Updates"
    }
  ]
};
var PUBLISHING_LINKS = {
  amazonAuthorStore: "https://www.amazon.com/stores/Akyin-S/author/B0H6SY7N3T?_encoding=UTF8&pd_rd_w=r7GRE&content-id=amzn1.sym.7e190e19-9f6f-4df8-807a-5a7608594741&pd_rd_wg=EdC74&pd_rd_r=d01ba7b6-b1c7-4bd2-87fb-cbd0fc9deddb&ref=ap_rdr&shoppingPortalEnabled=true&ccs_id=98bb1963-9c8a-4dab-9f1b-d21a6f908208",
  googlePlayDisciplineCode: "https://play.google.com/store/books/details/Akyin_s_THE_DISCIPLINE_CODE?id=seHuEQAAQBAJ",
  pinterest: "https://pin.it/1R8DhimEe"
};
var PUBLISHING_BOOKS = [
  {
    id: "book-discipline-code",
    number: "01",
    title: "The Discipline Code",
    subtitle: "Master Your Mind. Build Unbreakable Habits. Win Every Day.",
    author: "Akyin S.",
    amazonUrl: "https://a.co/d/0ggfRzci",
    asin: "B0H6R3BCQR",
    coverImage: "/assets/books/the-discipline-code.jpg",
    coverAlt: "Official Amazon book cover of The Discipline Code by Akyin S.",
    marketplaceLabel: "Amazon \xB7 Kindle Edition"
  },
  {
    id: "book-biopic-of-loser",
    number: "02",
    title: "BIOPIC OF LOSER",
    subtitle: "A Gritty Real-Life Biography of Failure, Resilience, and the Ultimate Corporate Automobile Hustle (1989\u20132013)",
    author: "AKYIN S. & MAULA S.",
    amazonUrl: "https://a.co/d/0ig3AHqX",
    asin: "B0H2QTMXP9",
    coverImage: "/assets/books/biopic-of-loser.jpg",
    coverAlt: "Official Amazon book cover of Biopic of Loser by AKYIN S. and MAULA S.",
    marketplaceLabel: "Amazon \xB7 Kindle Edition"
  },
  {
    id: "book-scroll-recovery-plan",
    number: "03",
    title: "THE SCROLL RECOVERY PLAN",
    subtitle: "A 30-Day System to Stop Doomscrolling, Rebuild Focus, and Take Back Your Time",
    author: "Akyin S.",
    amazonUrl: "https://a.co/d/0ewHC6eM",
    asin: "B0HKQ8DDSY",
    coverImage: "/assets/books/the-scroll-recovery-plan.jpg",
    coverAlt: "Official Amazon book cover of The Scroll Recovery Plan by Akyin S.",
    marketplaceLabel: "Amazon \xB7 Kindle Edition"
  },
  {
    id: "book-wealth-trap",
    number: "04",
    title: "The Wealth Trap",
    subtitle: "Why Smart People Stay Stuck, Make Emotional Money Mistakes, and Never Build the Wealth They Deserve",
    author: "Akyin S.",
    amazonUrl: "https://a.co/d/0eUuZA8r",
    asin: "B0H4YG4CM9",
    coverImage: "/assets/books/the-wealth-trap.jpg",
    coverAlt: "Official Amazon book cover of The Wealth Trap by Akyin S.",
    marketplaceLabel: "Amazon \xB7 Kindle Edition"
  },
  {
    id: "book-reset-code",
    number: "05",
    title: "THE RESET CODE",
    subtitle: "Why Smart People Stay Stuck, Self-Sabotage Success, and Repeat the Same Mistakes\u2014And How to Finally Change Their Life",
    author: "AKYIN S.",
    amazonUrl: "https://a.co/d/0h7g4V7g",
    asin: "B0H5DRF16M",
    coverImage: "/assets/books/the-reset-code.jpg",
    coverAlt: "Official Amazon book cover of The Reset Code by AKYIN S.",
    marketplaceLabel: "Amazon \xB7 Kindle Edition"
  },
  {
    id: "book-discipline-reset",
    number: "06",
    title: "THE DISCIPLINE RESET",
    subtitle: "Break Bad Habits, Beat Distractions, Build Self-Discipline, and Achieve Consistent Success",
    author: "Akyin S.",
    amazonUrl: "https://a.co/d/02kzLiOu",
    asin: "B0H4X1BPH7",
    coverImage: "/assets/books/the-discipline-reset.jpg",
    coverAlt: "Official Amazon book cover of The Discipline Reset by Akyin S.",
    marketplaceLabel: "Amazon \xB7 Kindle Edition"
  },
  {
    id: "book-overthinking-reset",
    number: "07",
    title: "THE OVERTHINKING RESET",
    subtitle: "Why Intelligent People Overthink, the Invisible Damage It Causes, and How to Break the First Mental Illusion",
    author: "Akyin S.",
    amazonUrl: "https://a.co/d/0atu9L9M",
    asin: "B0GY8NZGKB",
    coverImage: "/assets/books/the-overthinking-reset.jpg",
    coverAlt: "Official Amazon book cover of The Overthinking Reset by Akyin S.",
    marketplaceLabel: "Amazon \xB7 Kindle Edition"
  },
  {
    id: "book-dopamine-reset-code",
    number: "08",
    title: "The Dopamine Reset Code",
    subtitle: "Break Phone Addiction, Rewire Your Brain, Build Laser Focus, and Reclaim Your Productivity in 30 Days",
    author: "Akyin S.",
    amazonUrl: "https://a.co/d/0c9NrwA7",
    asin: "B0H7M6R3RH",
    coverImage: "/assets/books/the-dopamine-reset-code.jpg",
    coverAlt: "Official Amazon book cover of The Dopamine Reset Code by Akyin S.",
    marketplaceLabel: "Amazon \xB7 Kindle Edition"
  }
];
var GUMROAD_DIGITAL_PRODUCTS = [
  {
    id: "digital-ats-resume-kit",
    number: "01",
    title: "India ATS Resume & Job Search Kit",
    shortTitle: "ATS Resume Kit",
    description: "Land your next opportunity with a smarter job-search system. The India ATS Resume & Job Search Kit by Akyin is a complete digital career toolkit.",
    gumroadUrl: "https://akyinspire.gumroad.com/l/atsresumekit",
    coverImage: "/assets/digital-products/ats-resume-kit.png",
    coverAlt: "Official cover artwork for India ATS Resume & Job Search Kit on Gumroad",
    platformLabel: "Gumroad \xB7 Digital Career Toolkit"
  },
  {
    id: "digital-scroll-recovery-plan",
    number: "02",
    title: "THE SCROLL RECOVERY PLAN",
    shortTitle: "The Scroll Recovery Plan",
    description: "A 30-Day System to Stop Doomscrolling, Rebuild Focus, and Take Back Your Time.",
    gumroadUrl: "https://akyinspire.gumroad.com/l/THESCROLLRECOVERYPLAN?wanted=true",
    coverImage: "/assets/digital-products/scroll-recovery-plan.png",
    coverAlt: "Official cover artwork for The Scroll Recovery Plan digital guide on Gumroad",
    platformLabel: "Gumroad \xB7 30-Day Focus System"
  },
  {
    id: "digital-money-os",
    number: "03",
    title: "THE MONEY OS\u2122 | Complete Personal Finance Planner & Budgeting System",
    shortTitle: "The Money OS",
    description: "Take control of your money with a system you\u2019ll actually use. THE MONEY OS\u2122 is a practical personal finance planner designed to organize your personal finances.",
    gumroadUrl: "https://akyinspire.gumroad.com/l/the-money-os?wanted=true",
    coverImage: "/assets/digital-products/the-money-os.png",
    coverAlt: "Official cover artwork for THE MONEY OS Complete Personal Finance Planner on Gumroad",
    platformLabel: "Gumroad \xB7 Personal Finance OS"
  }
];
var EXTERNAL_VERTICAL_URLS = {
  aicalc: "https://aicalc.in"
};
var IMAGES = {
  liquidGlassHero: "/src/assets/images/apple_hero_glass_monolith_1795345424385.jpg",
  liquidGlassVentures: "/src/assets/images/apple_ventures_stack_1795345421049.jpg",
  liquidGlassAdvisory: "/src/assets/images/apple_advisory_console_1795345421545.jpg",
  warmCorporateHero: "/src/assets/images/apple_hero_glass_monolith_1795345424385.jpg",
  warmEditorialStudio: "/src/assets/images/apple_ventures_stack_1795345421049.jpg",
  aicalcWorkspace: "/src/assets/images/apple_aicalc_hardware_1795345421860.jpg",
  publishingHero: "/src/assets/images/apple_publishing_edition_1795345421531.jpg",
  disciplineCodeBook: "/src/assets/images/apple_discipline_book_1795345421096.jpg",
  heroShowroom: "/src/assets/images/apple_sales_coaching_1795345420916.jpg",
  salesTraining: "/src/assets/images/apple_marketing_agency_1795345421802.jpg",
  automotiveHeritage: "/src/assets/images/apple_agency_heritage_1795345553029.jpg",
  thriftHero: "/src/assets/images/apple_store_thrift_hanger_1795345421581.jpg",
  thriftFlatlay: "/src/assets/images/apple_store_thrift_stack_1795345421794.jpg",
  kartigoWarehouse: "/src/assets/images/apple_kartigo_cubes_1795345421779.jpg",
  biznxtConsulting: "/src/assets/images/apple_biznxt_compass_1795345424719.jpg",
  biznxtStrategy: "/src/assets/images/apple_biznxt_playbook_1795345421019.jpg",
  budgetBazaarRetail: "/src/assets/images/apple_budget_bazaar_goods_1795345421332.jpg"
};
var VENTURES_PORTFOLIO = [
  {
    id: "publishing",
    code: "01",
    name: "AKYIN Publishing",
    shortName: "Akyin Publishing",
    route: "/ventures/publishing",
    sector: "Book & Digital Publishing \xB7 5 Books",
    positioning: "Stories, Knowledge & Ideas Worth Sharing.",
    description: "Discover books published by AKYIN, created to inspire learning, personal development and new perspectives across Amazon and Google Play Books.",
    externalUrl: PUBLISHING_LINKS.amazonAuthorStore,
    externalLabel: "Amazon Author Store",
    image: IMAGES.publishingHero,
    imageAlt: "Isolated matte hardcover edition and glass e-reader stamped with AKYIN emblem"
  },
  {
    id: "marketing",
    code: "02",
    name: "AKYIN Marketing",
    shortName: "Akyin Marketing",
    route: "/ventures/marketing",
    sector: "Full-Service Marketing Agency & Growth Strategy",
    positioning: "Build Brand Demand. Convert Better Enquiries.",
    description: "Full-service performance marketing agency helping retail, service businesses, commercial brands, and automotive dealers acquire buyers, qualify existing enquiries, and strengthen sales execution.",
    image: IMAGES.salesTraining,
    imageAlt: "Isolated brushed aluminum analytics slate, glass prism, and AKYIN emblem block"
  },
  {
    id: "store",
    code: "03",
    name: "AKYIN Store \xB7 AKYIN Thrift",
    shortName: "Akyin Store",
    route: "/ventures/store",
    sector: "Clothing & Fashion Retail",
    positioning: "Affordable Fashion. Exceptional Discounts.",
    description: "Consumer clothing retail brand featuring fashion sub-brand AKYIN THRIFT, focused on offering carefully selected men\u2019s and women\u2019s apparel at exceptional discounted prices.",
    image: IMAGES.thriftHero,
    imageAlt: "Tailored monochrome jacket on brushed titanium hanger with AKYIN metal tag"
  }
];
var ECOSYSTEM_VENTURES_TICKER = [
  {
    id: "eco-akyin-ventures",
    name: "AKYIN Ventures",
    relationshipLabel: "Parent Group",
    category: "venture",
    externalUrl: "https://akyin.com",
    internalRoute: "/",
    wordmarkStyle: "sans"
  },
  {
    id: "eco-publishing",
    name: "AKYIN Publishing",
    relationshipLabel: "AKYIN Venture",
    category: "venture",
    externalUrl: PUBLISHING_LINKS.amazonAuthorStore,
    internalRoute: "/ventures/publishing",
    wordmarkStyle: "serif"
  },
  {
    id: "eco-marketing",
    name: "AKYIN Marketing",
    relationshipLabel: "Marketing Agency",
    category: "venture",
    internalRoute: "/ventures/marketing",
    wordmarkStyle: "sans"
  },
  {
    id: "eco-store",
    name: "AKYIN Store",
    relationshipLabel: "AKYIN Venture",
    category: "venture",
    internalRoute: "/ventures/store",
    wordmarkStyle: "sans"
  }
];
var ECOSYSTEM_CLIENTS_TICKER = [
  {
    id: "eco-biznxt",
    name: "BizNXT.online",
    relationshipLabel: "Client",
    category: "client",
    internalRoute: "/ventures/biznxt",
    wordmarkStyle: "sans"
  },
  {
    id: "eco-kartigo",
    name: "Kartigo.online",
    relationshipLabel: "Client",
    category: "client",
    internalRoute: "/ventures/kartigo",
    wordmarkStyle: "sans"
  },
  {
    id: "eco-thrift-store",
    name: "Thrift Store",
    relationshipLabel: "Client",
    category: "client",
    internalRoute: "/ventures/store",
    wordmarkStyle: "serif"
  },
  {
    id: "eco-budget-bazaar",
    name: "Budget Bazaar",
    relationshipLabel: "Client",
    category: "client",
    internalRoute: "/ventures/budget-bazaar",
    wordmarkStyle: "sans"
  },
  {
    id: "eco-autoclub",
    name: "AutoClub",
    relationshipLabel: "Client",
    category: "client",
    wordmarkStyle: "sans"
  },
  {
    id: "eco-arosco",
    name: "Arosco Ventures",
    relationshipLabel: "Client",
    category: "client",
    wordmarkStyle: "sans"
  },
  {
    id: "eco-mei-cosmetics",
    name: "MEI Cosmetics",
    relationshipLabel: "Client",
    category: "client",
    wordmarkStyle: "serif"
  },
  {
    id: "eco-krutika-cosmetics",
    name: "Krutika Cosmetics",
    relationshipLabel: "Client",
    category: "client",
    wordmarkStyle: "serif"
  },
  {
    id: "eco-nyika-traders",
    name: "Nyika Traders",
    relationshipLabel: "Client",
    category: "client",
    wordmarkStyle: "sans"
  },
  {
    id: "eco-ns-traders",
    name: "NS Traders",
    relationshipLabel: "Client",
    category: "client",
    wordmarkStyle: "sans"
  },
  {
    id: "eco-aicalc",
    name: "AICalc",
    relationshipLabel: "Client",
    category: "client",
    internalRoute: "/ventures/aicalc",
    wordmarkStyle: "mono"
  }
];
var ECOSYSTEM_PLATFORMS_TICKER = [
  {
    id: "eco-amazon",
    name: "Amazon",
    relationshipLabel: "Publishing marketplace",
    category: "platform",
    iconKey: "amazon",
    externalUrl: PUBLISHING_LINKS.amazonAuthorStore
  },
  {
    id: "eco-google-play-books",
    name: "Google Play Books",
    relationshipLabel: "Digital publishing and distribution platform",
    category: "platform",
    iconKey: "google-play",
    externalUrl: PUBLISHING_LINKS.googlePlayDisciplineCode
  },
  {
    id: "eco-shopify",
    name: "Shopify",
    relationshipLabel: "Commerce platform",
    category: "platform",
    iconKey: "shopify",
    externalUrl: "https://www.shopify.com"
  },
  {
    id: "eco-facebook",
    name: "Facebook",
    relationshipLabel: "Follow AKYIN",
    category: "platform",
    iconKey: "facebook",
    externalUrl: "https://www.facebook.com/profile.php?id=61595204474890"
  },
  {
    id: "eco-youtube",
    name: "YouTube",
    relationshipLabel: "Subscribe to AKYIN Marketing",
    category: "platform",
    iconKey: "youtube",
    externalUrl: "https://youtube.com/@akyinmarketing?si=hgB_tEfczt79H7wW"
  },
  {
    id: "eco-instagram",
    name: "Instagram",
    relationshipLabel: "Follow AKYIN Ventures",
    category: "platform",
    iconKey: "instagram",
    externalUrl: "https://www.instagram.com/akyinventures/"
  },
  {
    id: "eco-whatsapp-channel",
    name: "WhatsApp Channel",
    relationshipLabel: "Join AKYIN Updates",
    category: "platform",
    iconKey: "whatsapp",
    externalUrl: "https://whatsapp.com/channel/0029VbCz1qOJ3jurZuI6cM3U"
  }
];
var ECOSYSTEM_CLIENT = ECOSYSTEM_CLIENTS_TICKER[4];
var FULL_ECOSYSTEM_TICKER = [
  ...ECOSYSTEM_VENTURES_TICKER,
  ...ECOSYSTEM_CLIENTS_TICKER,
  ...ECOSYSTEM_PLATFORMS_TICKER
];
var RATE_CARD_ITEMS = [
  {
    id: "rc-1",
    service: "Meta lead generation management",
    category: "Lead Generation",
    fee: "\u20B940,000",
    unit: "/month",
    notes: "Campaign strategy, ad setup & optimization (ad spend extra)"
  },
  {
    id: "rc-2",
    service: "Lead filtering and qualification",
    category: "Qualification",
    fee: "\u20B924,000",
    unit: "/month",
    notes: "Existing enquiry calling & Hot/Warm/Future classification"
  },
  {
    id: "rc-3",
    service: "AI calling workflow management",
    category: "Qualification",
    fee: "\u20B910,000",
    unit: "/month",
    notes: "Managed internally by AKYIN (not standalone software)"
  },
  {
    id: "rc-4",
    service: "CRM and lead pipeline management",
    category: "Operations",
    fee: "\u20B910,000",
    unit: "/month",
    notes: "Pipeline hygiene, status tracking & Excel/summary reporting"
  },
  {
    id: "rc-5",
    service: "Social media management",
    category: "Creative & Social",
    fee: "\u20B916,000",
    unit: "/month",
    notes: "Scheduled brand content & page hygiene"
  },
  {
    id: "rc-6",
    service: "8 promotional reels",
    category: "Creative & Social",
    fee: "\u20B920,000",
    unit: "/month",
    notes: "Edited vertical reels from client or curated footage"
  },
  {
    id: "rc-7",
    service: "10 graphic creatives",
    category: "Creative & Social",
    fee: "\u20B98,000",
    unit: "/month",
    notes: "Static offer, product highlight & festive templates"
  },
  {
    id: "rc-8",
    service: "Influencer campaign coordination",
    category: "Influencer",
    fee: "\u20B95,000",
    unit: "/campaign",
    notes: "Creator shortlisting, brief & shoot scheduling"
  },
  {
    id: "rc-9",
    service: "Influencer video and upload",
    category: "Influencer",
    fee: "\u20B912,000",
    unit: "/creator",
    notes: "Coordination & content publishing workflow (creator fees separate)"
  },
  {
    id: "rc-10",
    service: "Product / model launch campaign",
    category: "Campaigns",
    fee: "\u20B920,000",
    unit: "/campaign",
    notes: "Dedicated new product/model unveiling & booking promotion"
  },
  {
    id: "rc-11",
    service: "Demo / visit booking campaign",
    category: "Campaigns",
    fee: "\u20B915,000",
    unit: "/campaign",
    notes: "Targeted local appointment, demo or test-drive booking drive"
  },
  {
    id: "rc-12",
    service: "Upgrade / exchange event campaign",
    category: "Campaigns",
    fee: "\u20B920,000",
    unit: "/campaign",
    notes: "Promotional weekend event & upgrade valuation push"
  },
  {
    id: "rc-13",
    service: "Festive campaign",
    category: "Campaigns",
    fee: "\u20B920,000",
    unit: "/campaign",
    notes: "Seasonal offer rollout & customer footfall drive"
  },
  {
    id: "rc-14",
    service: "Catalog & stock rotation marketing",
    category: "Campaigns",
    fee: "\u20B916,000",
    unit: "/month",
    notes: "Specialty inventory & pre-owned stock promotion"
  },
  {
    id: "rc-15",
    service: "Google Business Profile management",
    category: "Local Search",
    fee: "\u20B96,000",
    unit: "/month",
    notes: "Listing hygiene, updates & local Maps discovery"
  },
  {
    id: "rc-16",
    service: "Local SEO management",
    category: "Local Search",
    fee: "\u20B912,000",
    unit: "/month",
    notes: "Catchment keyword & regional search visibility"
  },
  {
    id: "rc-17",
    service: "Customer retention campaign",
    category: "Retention",
    fee: "\u20B916,000",
    unit: "/month",
    notes: "Repeat customer & service centre booking outreach"
  },
  {
    id: "rc-18",
    service: "Corporate / B2B campaign",
    category: "B2B / Institutional",
    fee: "\u20B920,000",
    unit: "/campaign",
    notes: "Institutional, corporate & commercial buyer acquisition"
  },
  {
    id: "rc-19",
    service: "Product & pitch presentation PPT",
    category: "Sales Enablement",
    fee: "\u20B96,000",
    unit: "/presentation",
    notes: "Structured offering, product & pricing sales deck"
  },
  {
    id: "rc-20",
    service: "Sales training",
    category: "Training",
    fee: "\u20B950,000",
    unit: "/session",
    notes: "Product presentation, objection handling & deal closing"
  },
  {
    id: "rc-21",
    service: "Personality development training",
    category: "Training",
    fee: "\u20B950,000",
    unit: "/session",
    notes: "Grooming, communication & executive frontline etiquette"
  },
  {
    id: "rc-22",
    service: "Bulk SMS Marketing (10,000 SMS Package)",
    category: "Direct Messaging",
    fee: "\u20B93,000",
    unit: "/10,000 SMS (\u20B90.30/SMS)",
    notes: "Promotional/provider-supported transactional SMS; additional credits billed at admin-configured rate"
  },
  {
    id: "rc-23",
    service: "Additional Bulk SMS Credits",
    category: "Direct Messaging",
    fee: "\u20B90.30",
    unit: "/SMS (admin configurable)",
    notes: "Calculated using admin-configured per-SMS rate; subject to provider & DLT conditions"
  },
  {
    id: "rc-24",
    service: "WhatsApp Business Messaging Setup (One-Time Fee)",
    category: "WhatsApp Messaging",
    fee: "\u20B94,999",
    unit: "/one-time setup",
    notes: "Setup & workflow configuration ONLY \u2014 strictly separate from per-message usage charges"
  },
  {
    id: "rc-25",
    service: "WhatsApp Business Message Usage",
    category: "WhatsApp Messaging",
    fee: "\u20B91.50",
    unit: "/message (billed separately)",
    notes: "Metered per message according to configured billing unit; provider API activated per client credentials"
  },
  {
    id: "rc-26",
    service: "Logo and Branding Design (Standalone Project)",
    category: "Creative & Documentation",
    fee: "\u20B96,000",
    unit: "/project",
    notes: "Vector logo, mark variations, palette & high-res production files"
  },
  {
    id: "rc-27",
    service: "Logo and Branding Design (Monthly Retainer)",
    category: "Creative & Documentation",
    fee: "\u20B910,000",
    unit: "/month",
    notes: "Continuous brand collateral, graphic asset updates & guidelines"
  },
  {
    id: "rc-28",
    service: "Social Media Thumbnail Design (5-Pack)",
    category: "Creative & Documentation",
    fee: "\u20B93,000",
    unit: "/pack (5 creatives)",
    notes: "High-CTR YouTube, Instagram & Facebook promotional creatives"
  },
  {
    id: "rc-29",
    service: "Social Media Thumbnail Retainer",
    category: "Creative & Documentation",
    fee: "\u20B98,000",
    unit: "/month (15 creatives)",
    notes: "Monthly continuous video thumbnail and social asset production"
  },
  {
    id: "rc-30",
    service: "Script Writing (3-Pack)",
    category: "Creative & Documentation",
    fee: "\u20B94,000",
    unit: "/pack (3 scripts)",
    notes: "Commercial video, reels, explainer & presentation scripts"
  },
  {
    id: "rc-31",
    service: "Script Writing Retainer",
    category: "Creative & Documentation",
    fee: "\u20B912,000",
    unit: "/month (12 scripts)",
    notes: "Ongoing monthly video scripts, ad copy & commercial scripting"
  },
  {
    id: "rc-32",
    service: "PowerPoint Presentation (12 Slides)",
    category: "Creative & Documentation",
    fee: "\u20B96,000",
    unit: "/presentation",
    notes: "Company profiles, pitch decks, sales presentations & proposals"
  },
  {
    id: "rc-33",
    service: "PowerPoint Deck Maintenance Retainer",
    category: "Creative & Documentation",
    fee: "\u20B914,000",
    unit: "/month",
    notes: "Monthly presentation updates, client pitch decks & revision support"
  },
  {
    id: "rc-34",
    service: "Excel Reports (Custom Automated Sheet)",
    category: "Creative & Documentation",
    fee: "\u20B95,000",
    unit: "/report sheet",
    notes: "Custom sales tracking, lead pipeline & inventory formula sheets"
  },
  {
    id: "rc-35",
    service: "Excel Reporting Retainer",
    category: "Creative & Documentation",
    fee: "\u20B910,000",
    unit: "/month",
    notes: "Weekly data refresh, automated models & custom business calculations"
  },
  {
    id: "rc-36",
    service: "Additional Business Support (Task Sprint)",
    category: "Creative & Documentation",
    fee: "\u20B94,000",
    unit: "/10-hour sprint",
    notes: "Data entry, document formatting, CRM hygiene & customer enquiry sorting"
  },
  {
    id: "rc-37",
    service: "Additional Business Support Retainer",
    category: "Creative & Documentation",
    fee: "\u20B98,000",
    unit: "/month (25 hours)",
    notes: "Dedicated monthly operational and administrative business assistance"
  }
];
var ENQUIRY_TYPE_OPTIONS = [
  "General Consultation / Proposal",
  "Automotive Dealership Marketing & Sales Strategy",
  "Meta Ads Management",
  "Online Lead Generation Campaigns",
  "Lead Filtering & Qualification",
  "Bulk SMS Marketing",
  "WhatsApp Business Messaging Setup",
  "Logo Design",
  "PowerPoint Presentation Design",
  "Excel Reports & Automation",
  ...RATE_CARD_ITEMS.map((item) => item.service),
  "Book Distribution / Publishing Rights",
  "AKYIN THRIFT Wholesale / Shopping Enquiry",
  "AICalc Platform / Integration Enquiry",
  "Kartigo B2B Buyer / Supplier Onboarding",
  "BizNXT Business Guidance & Consulting Enquiry",
  "Budget Bazaar Retail & Product Enquiry",
  "Strategic Business Partnership"
];

// src/utils/agentMarkdown.ts
function buildMarkdownForRoute(pathname) {
  const cleaned = pathname.replace(/\/+$/, "") || "/";
  const commonFooter = `
---
## Official Contact & Links
- **Website**: ${OFFICIAL_CONTACT.domain}
- **Contact Lead**: ${OFFICIAL_CONTACT.contactName}
- **Email**: [${OFFICIAL_CONTACT.email}](mailto:${OFFICIAL_CONTACT.email})
- **WhatsApp Connect**: [Join Official AKYIN Channel](${OFFICIAL_CONTACT.whatsappUrl})
- **Service Availability**: ${OFFICIAL_CONTACT.regionIndicator} \u2014 ${OFFICIAL_CONTACT.internationalSupportLine}
- **Follow AKYIN**: [Facebook \u2013 Follow AKYIN](${OFFICIAL_CONTACT.marketingSocials[0].url}) | [YouTube \u2013 Subscribe to AKYIN Marketing](${OFFICIAL_CONTACT.marketingSocials[1].url}) | [Instagram \u2013 Follow AKYIN Ventures](${OFFICIAL_CONTACT.marketingSocials[2].url}) | [WhatsApp \u2013 Join AKYIN Updates](${OFFICIAL_CONTACT.marketingSocials[3].url})
- **Key Pages**: [About](/about) | [Ventures](/ventures) | [Services](/ventures/marketing) | [Pricing](/pricing) | [Advisory](/advisory) | [Contact](/contact) | [Terms](/terms) | [Privacy](/privacy) | [Sitemap](/sitemap)
- **Agent Endpoints**: [/llms.txt](/llms.txt) | [/.well-known/mcp/server-card.json](/.well-known/mcp/server-card.json) | [/robots.txt](/robots.txt)
`;
  if (cleaned === "/pricing") {
    const rateLines = RATE_CARD_ITEMS.map(
      (r) => `| ${r.service} | ${r.category} | ${r.fee}${r.unit} INR | ${r.notes} |`
    ).join("\n");
    return `# AKYIN Ventures \u2014 Transparent Standalone Service Pricing (INR)

> Every AKYIN MARKETINGS service is 100% standalone\u2014select only what you need with zero compulsory bundles. Advertising budgets are paid directly to Meta or Google by clients.

## Key Standalone Service Highlights
- **Meta Ads Management**: \u20B940,000 / month ([/services/meta-ads-management](/services/meta-ads-management))
- **Lead Filtering & Qualification**: \u20B924,000 / month ([/services/lead-filtering](/services/lead-filtering))
- **Bulk SMS Marketing**: \u20B93,000 for 10,000 SMS credits \xB7 \u20B90.30/SMS ([/services/bulk-sms](/services/bulk-sms))
- **WhatsApp Business Messaging Setup**: \u20B94,999 one-time setup \xB7 Usage billed separately at \u20B91.50/msg ([/services/whatsapp-business-setup](/services/whatsapp-business-setup))
- **Commercial & Dealership Sales Training**: \u20B950,000 / session ([/services/commercial-dealership-sales-training](/services/commercial-dealership-sales-training))
- **1-on-1 Business Advisory Consultation**: \u20B93,998 / 30-min IST session ([Book Advisory](/advisory))

## Standalone Service Rate Schedule
| Service | Category | Fee (INR) | Scope Notes |
|---|---|---|---|
${rateLines}
${commonFooter}`;
  }
  if (cleaned === "/marketing/automotive") {
    return `# AKYIN Marketing \u2014 Automotive Dealership Growth Division

> Standalone showroom marketing, test-drive acquisition, two-tier lead qualification, and floor sales coaching engineered for automotive dealerships.

## Core Standalone Automotive Capabilities
- **Online Lead Generation** ([/services/lead-generation](/services/lead-generation)) & **Lead Filtering & Qualification** ([/services/lead-filtering](/services/lead-filtering)) delivered independently for clean showroom accountability.
- **Test-Drive Lead Generation** ([/services/test-drive-lead-generation](/services/test-drive-lead-generation)) & **Showroom Launch / Exchange Event Campaigns** ([/services/dealer-launch-exchange-campaigns](/services/dealer-launch-exchange-campaigns)).
- **Commercial & Dealership Sales Training**: \u20B950,000 / session ([View Full Pricing](/pricing)).
${commonFooter}`;
  }
  if (cleaned === "/ventures/publishing") {
    const bookLines = PUBLISHING_BOOKS.map(
      (b) => `- **${b.number}. ${b.title}** \u2014 *${b.subtitle}* by ${b.author} ([View on Amazon](${b.amazonUrl}))`
    ).join("\n");
    const digitalLines = GUMROAD_DIGITAL_PRODUCTS.map(
      (p) => `- **${p.number}. ${p.shortTitle}** \u2014 ${p.description} ([Get This Product](${p.gumroadUrl}))`
    ).join("\n");
    return `# AKYIN Publishing \u2014 Ideas That Inspire. Knowledge That Empowers.

> Explore books, practical guides and digital resources published by AKYIN.

## Explore Our Books on Amazon
${bookLines}

## Digital Guides & Productivity Tools
${digitalLines}

## Explore More & Storefronts
- [Explore AKYIN on Pinterest](${PUBLISHING_LINKS.pinterest})
- [Amazon Author Store](${PUBLISHING_LINKS.amazonAuthorStore})
- [Google Play Books \u2014 THE DISCIPLINE CODE](${PUBLISHING_LINKS.googlePlayDisciplineCode})
${commonFooter}`;
  }
  if (cleaned === "/ventures/marketing") {
    const catLines = SERVICE_MARKETPLACE_CATEGORIES.map((c, idx) => `${idx + 1}. **${c}**`).join("\n");
    return `# AKYIN MARKETINGS \u2014 10-Category Standalone Service Marketplace

> Choose individual marketing, design, documentation, reporting, messaging, CRM, and training services\u2014zero forced bundles.

## 10 Standalone Service Categories
${catLines}

- **Automotive Division**: [AKYIN Automotive Marketing](/marketing/automotive)
- **Pricing & Quotation Builder**: [View Transparent Standalone Pricing](/pricing)
${commonFooter}`;
  }
  if (cleaned === "/terms" || cleaned === "/privacy") {
    return `# AKYIN Ventures \u2014 Terms of Service & Privacy Policy

## Terms of Service
1. **Parent Group Attribution**: akyin.com represents AKYIN Ventures and its seven operating verticals. Third-party marketplaces (Amazon, Google Play Books, Shopify) and clients (AutoClub) are explicitly distinguished.
2. **Direct Platform Ad Billing**: Clients pay Meta and Google advertising spend directly to those platforms. Agency fees cover strategy, setup, management, and qualification only.
3. **Standalone Service Separation**: Every service is strictly standalone. Lead Generation and Lead Filtering are independently selectable. Bulk SMS and WhatsApp setup vs. per-message charges remain transparently itemized.

## Privacy Policy
- Visitor enquiries are validated client-side and transmitted directly to AKYIN Ventures' authorized workspace desk or user-selected WhatsApp/Email apps.
- AKYIN Ventures never sells or brokers contact data to third parties.
- Contact [connect@akyin.com](mailto:connect@akyin.com) or [WhatsApp Connect](${OFFICIAL_CONTACT.whatsappUrl}) for data requests.
${commonFooter}`;
  }
  if (cleaned === "/about") {
    return `# About AKYIN Ventures \u2014 One Vision. Multiple Business Ventures.

AKYIN Ventures operates specialized operating businesses alongside a 10-category standalone marketing marketplace grounded in 16 years of commercial & automotive industry experience (mass-market to luxury retail).

- **Owned Verticals**: AKYIN Publishing, AKYIN MARKETINGS, AKYIN Store (AKYIN Thrift), AICalc.in, Kartigo.online, BizNXT.online, Budget Bazaar.
- **Security & Integrity**: Strict CSP rules, URI allowlisting, schema-validated forms, and zero-broker enquiry routing.
${commonFooter}`;
  }
  if (cleaned === "/advisory") {
    return `# AKYIN Business Advisory \u2014 Consultation Booking

> Your Business. Your Vision. A Clearer Direction.

- **Format**: 1-on-1 Strategic Consultation (30-minute slots, Asia/Kolkata IST).
- **Consultation Fee**: \u20B93,998 INR per session (confirmed before slot lock).
- **Focus Areas**: Business feasibility, sales team conversion, agency growth roadmap, and venture planning.
${commonFooter}`;
  }
  if (cleaned === "/contact") {
    return `# Contact AKYIN Ventures \u2014 Central Enquiry Desk

Reach our corporate desk or any operating vertical directly:

- **Corporate Email**: [connect@akyin.com](mailto:connect@akyin.com)
- **WhatsApp Connect**: [Join Official AKYIN Channel](${OFFICIAL_CONTACT.whatsappUrl})
- **Booking Desk**: [Schedule Business Advisory](/advisory)
${commonFooter}`;
  }
  if (cleaned === "/tools") {
    return `# AKYIN Business, Marketing & Sales Calculators Suite (20 Free Tools)

> Interactive marketing ROI, ROAS, CAC, CPL, break-even, GST, pricing, margin, commission, and consultation workflow tools by AKYIN Ventures.

- **Marketing Calculators**: ROAS, CPL, CAC, Conversion Rate, Agency Value ROI, Ad Budget Planner
- **Sales & Finance Calculators**: Profit Margin, Break-Even Units, Discount Impact, Sales Commission, GST Calculator (India 5%/12%/18%/28%)
- **Growth & Lead Ops Tools**: Follow-up SLA Estimator, Quotation Estimator, Service Finder, Appointment Slot Finder (/advisory), and Direct Enquiry Dispatcher (/contact)
${commonFooter}`;
  }
  if (cleaned === "/insights") {
    return `# AKYIN Ventures \u2014 Insights & Business Philosophy

> Operational perspectives across performance marketing, automotive dealership test-drive conversion, publishing, retail positioning, and B2B digital commerce.

- Explore structured growth essays and real-time automotive dealership industry trends at [Insights](/insights).
- For 1-on-1 execution advice, schedule an [IST Business Advisory session](/advisory).
${commonFooter}`;
  }
  const ventureList = VENTURES_PORTFOLIO.map(
    (v) => `- **${v.code}. ${v.name}** (${v.sector}): ${v.description} \u2014 [Internal Page](${OFFICIAL_CONTACT.domain}${v.route})${v.externalUrl ? ` | [Live Platform](${v.externalUrl})` : ""}`
  ).join("\n");
  return `# AKYIN Ventures \u2014 Building Ideas Into Businesses

> Multi-business corporate group and standalone marketing service marketplace operating across digital marketing, publishing, fashion retail, AI tools, B2B supply, value retail, and consulting.

## Operating Verticals
${ventureList}

## Standalone Agency & Consultation Highlights (INR)
- **Meta Ads Management**: \u20B940,000 / month
- **Lead Filtering & Qualification**: \u20B924,000 / month
- **Bulk SMS Marketing**: \u20B93,000 (10,000 SMS credits \xB7 \u20B90.30/SMS)
- **WhatsApp Business Setup**: \u20B94,999 one-time setup (separate from \u20B91.50/msg usage)
- **Commercial & Dealership Sales Training**: \u20B950,000 / session
- **Business Advisory Session (30 min IST)**: \u20B93,998 / session
- See full standalone service marketplace on [Services](/ventures/marketing) & [Pricing Page](/pricing)

## External Platforms & Publishing
- [AICalc.in](${EXTERNAL_VERTICAL_URLS.aicalc})
- [Google Play Books \u2014 THE DISCIPLINE CODE](${PUBLISHING_LINKS.googlePlayDisciplineCode}) | [Amazon Author Store](${PUBLISHING_LINKS.amazonAuthorStore})
${commonFooter}`;
}

// server/routes.ts
import crypto4 from "crypto";
import { z as z2 } from "zod";

// src/data/paymentCatalog.ts
var PAYMENT_CATALOG_LIST = [
  {
    sku: "advisory-session",
    title: "1-on-1 Business Advisory Consultation (30 min IST)",
    shortLabel: "Advisory Session",
    category: "Business Consulting and Training",
    amountPaise: 399800,
    amountInr: 3998,
    displayPrice: "\u20B93,998",
    description: "30-minute private strategy consultation on India Standard Time (Asia/Kolkata)."
  },
  {
    sku: "growth-marketing-setup",
    title: "Full-Service Growth Marketing & Lead Management Setup Fee",
    shortLabel: "Growth Marketing Setup",
    category: "Digital Marketing",
    amountPaise: 7999800,
    amountInr: 79998,
    displayPrice: "\u20B979,998",
    description: "One-time onboarding, Meta & Google campaign architecture, and qualification workflow setup."
  },
  {
    sku: "lead-filtering-setup",
    title: "Lead Filtering & Qualification Onboarding Setup Fee",
    shortLabel: "Lead Filtering Setup",
    category: "Lead Management and CRM",
    amountPaise: 2999800,
    amountInr: 29998,
    displayPrice: "\u20B929,998",
    description: "One-time onboarding, AI-assisted calling workflow & daily Excel pipeline sheet setup."
  },
  {
    sku: "sales-training",
    title: "Commercial & Dealership Sales Training Workshop",
    shortLabel: "Sales Training",
    category: "Business Consulting and Training",
    amountPaise: 5e6,
    amountInr: 5e4,
    displayPrice: "\u20B950,000",
    description: "Per-session commercial sales, walkthrough & closing workshop for teams."
  },
  {
    sku: "bulk-sms-starter",
    title: "Bulk SMS Marketing (10,000 SMS Credits Package)",
    shortLabel: "Bulk SMS (10k)",
    category: "Messaging and Communication",
    amountPaise: 3e5,
    amountInr: 3e3,
    displayPrice: "\u20B93,000",
    description: "10,000 SMS credits package (\u20B90.30/SMS effective rate). Additional SMS credits billed per quotation. Subject to provider & DLT conditions."
  },
  {
    sku: "whatsapp-business-setup",
    title: "WhatsApp Business Messaging Setup (One-Time Setup Fee)",
    shortLabel: "WhatsApp Setup",
    category: "Messaging and Communication",
    amountPaise: 499900,
    amountInr: 4999,
    displayPrice: "\u20B94,999",
    description: "One-time WhatsApp Business setup, profile & workflow configuration fee only. Message usage (\u20B91.50/msg) is billed separately."
  }
];
var PAYMENT_CATALOG_BY_SKU = {
  "advisory-session": PAYMENT_CATALOG_LIST[0],
  "growth-marketing-setup": PAYMENT_CATALOG_LIST[1],
  "lead-filtering-setup": PAYMENT_CATALOG_LIST[2],
  "sales-training": PAYMENT_CATALOG_LIST[3],
  "bulk-sms-starter": PAYMENT_CATALOG_LIST[4],
  "whatsapp-business-setup": PAYMENT_CATALOG_LIST[5]
};

// server/auth.ts
import crypto from "crypto";
var SESSION_TTL_MS = 8 * 60 * 60 * 1e3;
var SCRYPT_KEYLEN = 64;
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
  return `scrypt$${salt}$${derived}`;
}
function verifyPassword(password, storedHash) {
  const parts = storedHash.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const [, salt, expectedHex] = parts;
  if (!salt || !expectedHex) return false;
  try {
    const derived = crypto.scryptSync(password, salt, SCRYPT_KEYLEN);
    const expected = Buffer.from(expectedHex, "hex");
    if (derived.length !== expected.length) return false;
    return crypto.timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}
function hashSessionToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}
function toPublicUser(user) {
  const { passwordHash: _ignored, ...safe } = user;
  return safe;
}
var ROLE_PERMISSIONS = {
  "Super Admin": /* @__PURE__ */ new Set([
    "overview",
    "leads",
    "clients",
    "services",
    "quotations",
    "appointments",
    "payments",
    "reports",
    "marketing_tools",
    "website_settings",
    "social_media",
    "users",
    "security_audit"
  ]),
  "Sales Manager": /* @__PURE__ */ new Set([
    "overview",
    "leads",
    "clients",
    "services",
    "quotations",
    "appointments",
    "marketing_tools"
  ]),
  "Finance Manager": /* @__PURE__ */ new Set([
    "overview",
    "clients",
    "services",
    "quotations",
    "payments",
    "reports"
  ]),
  Staff: /* @__PURE__ */ new Set(["overview", "leads", "clients", "appointments"])
};
function hasPermission(role, resource) {
  return ROLE_PERMISSIONS[role]?.has(resource) ?? false;
}
function createSessionForUser(db, user) {
  const now = Date.now();
  db.sessions = (db.sessions || []).filter((s) => Date.parse(s.expiresAt) > now);
  const rawToken = `aky_${crypto.randomBytes(32).toString("hex")}`;
  const session = {
    tokenHash: hashSessionToken(rawToken),
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + SESSION_TTL_MS).toISOString()
  };
  db.sessions.push(session);
  user.lastLoginAt = new Date(now).toISOString();
  return { rawToken, session };
}
function extractBearerToken(req) {
  const authHeader = String(req.headers.authorization || "").trim();
  if (!authHeader.toLowerCase().startsWith("bearer ")) return "";
  return authHeader.slice(7).trim();
}
function makeAuthMiddleware(readDbFn) {
  return (req, res, next) => {
    const rawToken = extractBearerToken(req);
    if (!rawToken) {
      res.status(401).json({
        error: "Authentication required. Sign in at /admin to continue.",
        code: "AUTH_REQUIRED"
      });
      return;
    }
    const tokenHash = hashSessionToken(rawToken);
    const db = readDbFn();
    const now = Date.now();
    const session = (db.sessions || []).find(
      (s) => s.tokenHash === tokenHash && Date.parse(s.expiresAt) > now
    );
    if (!session) {
      res.status(401).json({
        error: "Session expired or invalid. Please sign in again.",
        code: "SESSION_INVALID"
      });
      return;
    }
    const user = (db.users || []).find((u) => u.id === session.userId && u.active);
    if (!user) {
      res.status(403).json({
        error: "User account is inactive or no longer exists.",
        code: "ACCOUNT_DISABLED"
      });
      return;
    }
    req.suiteUser = toPublicUser(user);
    req.suiteTokenHash = tokenHash;
    next();
  };
}
function requirePermission(resource) {
  return (req, res, next) => {
    if (!req.suiteUser) {
      res.status(401).json({ error: "Authentication required.", code: "AUTH_REQUIRED" });
      return;
    }
    if (!hasPermission(req.suiteUser.role, resource)) {
      res.status(403).json({
        error: `Role '${req.suiteUser.role}' does not have permission for '${resource}'.`,
        code: "FORBIDDEN_ROLE"
      });
      return;
    }
    next();
  };
}
function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.suiteUser) {
      res.status(401).json({ error: "Authentication required.", code: "AUTH_REQUIRED" });
      return;
    }
    if (!allowedRoles.includes(req.suiteUser.role)) {
      res.status(403).json({
        error: `This action requires one of: ${allowedRoles.join(", ")}.`,
        code: "FORBIDDEN_ROLE"
      });
      return;
    }
    next();
  };
}

// server/finance.ts
function round2(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
function clampNumber(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}
function inferBillingType(item) {
  const text = `${item.title} ${item.description || ""}`.toLowerCase();
  if (text.includes("monthly") || text.includes("/month") || text.includes("recurring") || text.includes("retainer")) {
    return "monthly";
  }
  if (text.includes("usage") || text.includes("per message") || text.includes("additional credit") || text.includes("/sms")) {
    return "usage";
  }
  return "one-time";
}
function calculateQuotationTotals(rawItems, configuredDiscount, gstEnabled, gstRate) {
  const items = rawItems.map((item) => {
    const qty = Math.max(0, Number.isFinite(item.qty) ? item.qty : 0);
    const unitPrice = Math.max(0, Number.isFinite(item.unitPrice) ? item.unitPrice : 0);
    const lineTotal = round2(qty * unitPrice);
    const billingType = item.billingType || inferBillingType(item);
    return {
      id: item.id,
      serviceId: item.serviceId,
      title: item.title,
      description: item.description || "",
      qty,
      unitPrice: round2(unitPrice),
      lineTotal,
      billingType
    };
  });
  const subtotal = round2(items.reduce((acc, item) => acc + item.lineTotal, 0));
  const oneTimeSubtotal = round2(
    items.filter((it) => it.billingType === "one-time").reduce((acc, it) => acc + it.lineTotal, 0)
  );
  const monthlySubtotal = round2(
    items.filter((it) => it.billingType === "monthly").reduce((acc, it) => acc + it.lineTotal, 0)
  );
  const usageSubtotal = round2(
    items.filter((it) => it.billingType === "usage").reduce((acc, it) => acc + it.lineTotal, 0)
  );
  const discountAmount = round2(clampNumber(configuredDiscount, 0, subtotal));
  const taxableAmount = round2(Math.max(0, subtotal - discountAmount));
  const effectiveGstRate = gstEnabled ? clampNumber(gstRate, 0, 100) : 0;
  const gstAmount = gstEnabled ? round2(taxableAmount * (effectiveGstRate / 100)) : 0;
  const grandTotal = round2(taxableAmount + gstAmount);
  const futureRecurringAmount = round2(
    monthlySubtotal + (gstEnabled ? monthlySubtotal * (effectiveGstRate / 100) : 0)
  );
  const payableNow = grandTotal;
  return {
    items,
    subtotal,
    oneTimeSubtotal,
    monthlySubtotal,
    usageSubtotal,
    discountAmount,
    taxableAmount,
    gstAmount,
    grandTotal,
    payableNow,
    futureRecurringAmount
  };
}
function getIstDateParts(date = /* @__PURE__ */ new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const year = Number(parts.find((p) => p.type === "year")?.value || date.getUTCFullYear());
  const month = Number(parts.find((p) => p.type === "month")?.value || date.getUTCMonth() + 1);
  const day = Number(parts.find((p) => p.type === "day")?.value || date.getUTCDate());
  const isoDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return { year, month, day, isoDate };
}
function getIndiaFinancialYearBounds(refDate = /* @__PURE__ */ new Date()) {
  const { year, month } = getIstDateParts(refDate);
  const startYear = month >= 4 ? year : year - 1;
  const endYear = startYear + 1;
  return {
    startDate: `${startYear}-04-01`,
    endDate: `${endYear}-03-31`,
    label: `FY ${startYear}-${String(endYear).slice(-2)}`
  };
}
function resolveDateRange(preset = "this_month", customStart, customEnd, now = /* @__PURE__ */ new Date()) {
  const { year, month, day, isoDate } = getIstDateParts(now);
  if (preset === "today") {
    return { startDate: isoDate, endDate: isoDate };
  }
  if (preset === "this_week") {
    const dt = new Date(Date.UTC(year, month - 1, day));
    const weekday = (dt.getUTCDay() + 6) % 7;
    dt.setUTCDate(dt.getUTCDate() - weekday);
    const startDate = dt.toISOString().slice(0, 10);
    return { startDate, endDate: isoDate };
  }
  if (preset === "this_month") {
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    return { startDate, endDate: isoDate };
  }
  if (preset === "previous_month") {
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const lastDay = new Date(Date.UTC(prevYear, prevMonth, 0)).getUTCDate();
    return {
      startDate: `${prevYear}-${String(prevMonth).padStart(2, "0")}-01`,
      endDate: `${prevYear}-${String(prevMonth).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`
    };
  }
  if (preset === "financial_year") {
    const bounds = getIndiaFinancialYearBounds(now);
    return { startDate: bounds.startDate, endDate: bounds.endDate };
  }
  if (preset === "custom") {
    return {
      startDate: customStart || "1970-01-01",
      endDate: customEnd || "2099-12-31"
    };
  }
  return { startDate: "1970-01-01", endDate: "2099-12-31" };
}
function inIsoRange(isoTimestamp, startDate, endDate) {
  if (!isoTimestamp) return false;
  const datePart = isoTimestamp.slice(0, 10);
  return datePart >= startDate && datePart <= endDate;
}
function isVerifiedLivePayment(p) {
  if (p.mode !== "live") return false;
  if (!p.verified) return false;
  return p.status === "captured" || p.status === "manual_recorded" || p.status === "refunded";
}
function computeDashboardKpis(db, now = /* @__PURE__ */ new Date()) {
  const { startDate: monthStart, endDate: todayIso } = resolveDateRange(
    "this_month",
    void 0,
    void 0,
    now
  );
  const leads = db.leads || [];
  const clients = db.clients || [];
  const quotations = db.quotations || [];
  const invoices = db.invoices || [];
  const payments = db.payments || [];
  const appointments = db.appointments || [];
  const totalClients = clients.length;
  const newEnquiries = leads.filter((l) => l.stage === "NEW").length;
  const qualifiedLeads = leads.filter(
    (l) => l.stage === "QUALIFIED" || l.stage === "PROPOSAL SENT" || l.stage === "NEGOTIATION"
  ).length;
  const pendingFollowUps = leads.filter(
    (l) => l.stage !== "WON" && l.stage !== "LOST" && (l.secondaryTag === "Follow-up required" || Boolean(l.followUpAt) && l.followUpAt.slice(0, 10) <= todayIso)
  ).length;
  const quotationsSent = quotations.filter((q) => q.status === "SENT").length;
  const quotationsAccepted = quotations.filter((q) => q.status === "ACCEPTED").length;
  const paymentsPending = invoices.filter(
    (inv) => inv.status === "UNPAID" || inv.status === "PARTIAL"
  ).length;
  const liveVerifiedPayments = payments.filter((p) => isVerifiedLivePayment(p));
  const paymentsReceived = liveVerifiedPayments.length;
  const monthlyRevenueCollected = round2(
    liveVerifiedPayments.filter((p) => inIsoRange(p.capturedAt || p.createdAt, monthStart, todayIso)).reduce((acc, p) => acc + Math.max(0, p.amount - p.refundedAmount), 0)
  );
  const outstandingReceivables = round2(
    invoices.filter((inv) => inv.status === "UNPAID" || inv.status === "PARTIAL").reduce((acc, inv) => acc + Math.max(0, inv.totalAmount - inv.paidAmount), 0)
  );
  const appointmentsBooked = appointments.filter(
    (a) => a.bookingStatus !== "Cancelled"
  ).length;
  const wonLeads = leads.filter((l) => l.stage === "WON").length;
  const conversionRate = leads.length > 0 ? round2(wonLeads / leads.length * 100) : 0;
  return {
    totalClients,
    reportedClientsHandled: db.websiteSettings?.reportedClientsCount || 58,
    newEnquiries,
    qualifiedLeads,
    pendingFollowUps,
    quotationsSent,
    quotationsAccepted,
    paymentsPending,
    paymentsReceived,
    monthlyRevenueCollected,
    outstandingReceivables,
    appointmentsBooked,
    conversionRate
  };
}
function computeRevenueReport(db, filter = {}, now = /* @__PURE__ */ new Date()) {
  const preset = filter.preset || "this_month";
  const { startDate, endDate } = resolveDateRange(preset, filter.startDate, filter.endDate, now);
  const filterQuote = (q) => {
    if (!inIsoRange(q.createdAt, startDate, endDate)) return false;
    if (filter.clientId && q.clientId !== filter.clientId) return false;
    return true;
  };
  const filterInvoice = (inv) => {
    if (!inIsoRange(inv.createdAt, startDate, endDate)) return false;
    if (filter.clientId && inv.clientId !== filter.clientId) return false;
    if (filter.serviceCategory && inv.serviceCategory !== filter.serviceCategory) return false;
    if (filter.leadSource && inv.leadSource !== filter.leadSource) return false;
    return true;
  };
  const filterPaymentBase = (p) => {
    const ts = p.capturedAt || p.createdAt;
    if (!inIsoRange(ts, startDate, endDate)) return false;
    if (filter.clientId && p.clientId !== filter.clientId) return false;
    if (filter.serviceCategory && p.serviceCategory !== filter.serviceCategory) return false;
    if (filter.leadSource && p.leadSource !== filter.leadSource) return false;
    if (filter.paymentMethod && p.method !== filter.paymentMethod) return false;
    return true;
  };
  const quotes = (db.quotations || []).filter(filterQuote);
  const invoices = (db.invoices || []).filter(filterInvoice);
  const allPeriodPayments = (db.payments || []).filter(filterPaymentBase);
  const quotedValue = round2(
    quotes.filter((q) => q.status !== "DRAFT").reduce((acc, q) => acc + q.grandTotal, 0)
  );
  const acceptedQuotationValue = round2(
    quotes.filter((q) => q.status === "ACCEPTED").reduce((acc, q) => acc + q.grandTotal, 0)
  );
  const invoicedAmount = round2(
    invoices.filter((inv) => inv.status !== "CANCELLED").reduce((acc, inv) => acc + inv.totalAmount, 0)
  );
  const outstandingReceivables = round2(
    invoices.filter((inv) => inv.status === "UNPAID" || inv.status === "PARTIAL").reduce((acc, inv) => acc + Math.max(0, inv.totalAmount - inv.paidAmount), 0)
  );
  const liveVerifiedPayments = allPeriodPayments.filter((p) => isVerifiedLivePayment(p));
  const authorizedLivePayments = allPeriodPayments.filter(
    (p) => p.mode === "live" && p.status === "authorized"
  );
  const testModePayments = allPeriodPayments.filter((p) => p.mode === "test");
  const excludedFailedOrUnverified = allPeriodPayments.filter(
    (p) => p.mode === "test" || !p.verified || p.status === "failed" || p.status === "abandoned" || p.status === "created"
  );
  const paymentAuthorised = round2(
    authorizedLivePayments.reduce((acc, p) => acc + p.amount, 0)
  );
  const grossCollections = round2(
    liveVerifiedPayments.reduce((acc, p) => acc + p.amount, 0)
  );
  const refunds = round2(
    liveVerifiedPayments.reduce((acc, p) => acc + p.refundedAmount, 0)
  );
  const netCollections = round2(Math.max(0, grossCollections - refunds));
  const gstCollected = round2(
    liveVerifiedPayments.reduce((acc, p) => {
      if (p.amount <= 0) return acc;
      const ratio = Math.max(0, p.amount - p.refundedAmount) / p.amount;
      return acc + p.gstPortion * ratio;
    }, 0)
  );
  const gatewayFees = round2(
    liveVerifiedPayments.reduce((acc, p) => acc + p.gatewayFeeAmount, 0)
  );
  const netRevenueAfterFeesAndRefunds = round2(
    Math.max(0, netCollections - gatewayFees)
  );
  const testModeTotal = round2(
    testModePayments.filter((p) => p.status === "captured" || p.status === "manual_recorded").reduce((acc, p) => acc + p.amount, 0)
  );
  const monthMap = /* @__PURE__ */ new Map();
  for (const p of liveVerifiedPayments) {
    const month = (p.capturedAt || p.createdAt).slice(0, 7);
    const cur = monthMap.get(month) || { gross: 0, refunds: 0, net: 0, gst: 0 };
    cur.gross = round2(cur.gross + p.amount);
    cur.refunds = round2(cur.refunds + p.refundedAmount);
    cur.net = round2(cur.gross - cur.refunds);
    const ratio = p.amount > 0 ? Math.max(0, p.amount - p.refundedAmount) / p.amount : 0;
    cur.gst = round2(cur.gst + p.gstPortion * ratio);
    monthMap.set(month, cur);
  }
  const byMonth = Array.from(monthMap.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([month, v]) => ({ month, ...v }));
  const serviceMap = /* @__PURE__ */ new Map();
  for (const inv of invoices.filter((i) => i.status !== "CANCELLED")) {
    const key = inv.serviceCategory || "Uncategorized";
    const cur = serviceMap.get(key) || { invoiced: 0, collected: 0, count: 0 };
    cur.invoiced = round2(cur.invoiced + inv.totalAmount);
    cur.count += 1;
    serviceMap.set(key, cur);
  }
  for (const p of liveVerifiedPayments) {
    const key = p.serviceCategory || "Uncategorized";
    const cur = serviceMap.get(key) || { invoiced: 0, collected: 0, count: 0 };
    cur.collected = round2(cur.collected + Math.max(0, p.amount - p.refundedAmount));
    serviceMap.set(key, cur);
  }
  const byService = Array.from(serviceMap.entries()).map(([service, v]) => ({ service, ...v })).sort((a, b) => b.collected - a.collected || b.invoiced - a.invoiced);
  const sourceMap = /* @__PURE__ */ new Map();
  for (const lead of (db.leads || []).filter((l) => inIsoRange(l.receivedAt, startDate, endDate))) {
    const src = lead.campaignSource || "Website";
    const cur = sourceMap.get(src) || { leads: 0, won: 0, collected: 0 };
    cur.leads += 1;
    if (lead.stage === "WON") cur.won += 1;
    sourceMap.set(src, cur);
  }
  for (const p of liveVerifiedPayments) {
    const src = p.leadSource || "Website";
    const cur = sourceMap.get(src) || { leads: 0, won: 0, collected: 0 };
    cur.collected = round2(cur.collected + Math.max(0, p.amount - p.refundedAmount));
    sourceMap.set(src, cur);
  }
  const byLeadSource = Array.from(sourceMap.entries()).map(([source, v]) => ({ source, ...v })).sort((a, b) => b.collected - a.collected || b.leads - a.leads);
  const methodMap = /* @__PURE__ */ new Map();
  for (const p of liveVerifiedPayments) {
    const m = p.method || p.gateway;
    const cur = methodMap.get(m) || { gross: 0, count: 0 };
    cur.gross = round2(cur.gross + Math.max(0, p.amount - p.refundedAmount));
    cur.count += 1;
    methodMap.set(m, cur);
  }
  const byPaymentMethod = Array.from(methodMap.entries()).map(([method, v]) => ({
    method,
    ...v
  }));
  const clientMap = /* @__PURE__ */ new Map();
  for (const inv of invoices.filter((i) => i.status !== "CANCELLED")) {
    const key = inv.clientId || inv.companyName || inv.customerName || "Direct Client";
    const cur = clientMap.get(key) || {
      clientName: inv.companyName || inv.customerName || key,
      invoiced: 0,
      collected: 0,
      outstanding: 0
    };
    cur.invoiced = round2(cur.invoiced + inv.totalAmount);
    if (inv.status === "UNPAID" || inv.status === "PARTIAL") {
      cur.outstanding = round2(cur.outstanding + Math.max(0, inv.totalAmount - inv.paidAmount));
    }
    clientMap.set(key, cur);
  }
  for (const p of liveVerifiedPayments) {
    const key = p.clientId || p.customerName || "Direct Client";
    const cur = clientMap.get(key) || {
      clientName: p.customerName || key,
      invoiced: 0,
      collected: 0,
      outstanding: 0
    };
    cur.collected = round2(cur.collected + Math.max(0, p.amount - p.refundedAmount));
    clientMap.set(key, cur);
  }
  const byClient = Array.from(clientMap.values()).sort(
    (a, b) => b.collected - a.collected || b.invoiced - a.invoiced
  );
  return {
    period: { preset, startDate, endDate },
    metrics: {
      quotedValue,
      acceptedQuotationValue,
      invoicedAmount,
      paymentAuthorised,
      grossCollections,
      refunds,
      netCollections,
      outstandingReceivables,
      gstCollected,
      gatewayFees,
      netRevenueAfterFeesAndRefunds,
      testModeTotal,
      excludedFailedOrUnverifiedCount: excludedFailedOrUnverified.length
    },
    byMonth,
    byService,
    byLeadSource,
    byPaymentMethod,
    byClient,
    matchingPayments: allPeriodPayments
  };
}
var CREATIVE_SERVICE_CATEGORY = "Business Creative & Documentation Services";
function computeRecurringRevenueInsights(db, monthsWindow = 12, now = /* @__PURE__ */ new Date()) {
  const safeWindow = Math.min(24, Math.max(3, Math.floor(monthsWindow || 12)));
  const { year: curYear, month: curMonth } = getIstDateParts(now);
  const subscriptions = db.subscriptions || [];
  const creativeSubs = subscriptions.filter(
    (s) => s.serviceCategory === CREATIVE_SERVICE_CATEGORY
  );
  const activeCreativeInr = creativeSubs.filter(
    (s) => s.status === "ACTIVE" && s.currency === "INR"
  );
  const activeAllInr = subscriptions.filter(
    (s) => s.status === "ACTIVE" && s.currency === "INR"
  );
  const activeCreativeMrr = round2(
    activeCreativeInr.reduce((acc, s) => acc + (Number(s.monthlyAmount) || 0), 0)
  );
  const activeCreativeMrrWithGst = round2(
    activeCreativeInr.reduce((acc, s) => {
      const mult = s.gstEnabled ? 1 + (s.gstRate || 0) / 100 : 1;
      return acc + (Number(s.monthlyAmount) || 0) * mult;
    }, 0)
  );
  const totalActiveMrr = round2(
    activeAllInr.reduce((acc, s) => acc + (Number(s.monthlyAmount) || 0), 0)
  );
  const activeCreativeSubscribers = creativeSubs.filter((s) => s.status === "ACTIVE").length;
  const pausedCreativeSubscribers = creativeSubs.filter((s) => s.status === "PAUSED").length;
  const cancelledCreativeSubscribers = creativeSubs.filter((s) => s.status === "CANCELLED").length;
  const creativeSharePercent = totalActiveMrr > 0 ? round2(activeCreativeMrr / totalActiveMrr * 100) : 0;
  const averageRevenuePerCreativeSubscriber = activeCreativeInr.length > 0 ? round2(activeCreativeMrr / activeCreativeInr.length) : 0;
  const nonInrMap = /* @__PURE__ */ new Map();
  for (const s of creativeSubs.filter((sub) => sub.status === "ACTIVE" && sub.currency !== "INR")) {
    const cur = s.currency;
    const existing = nonInrMap.get(cur) || { count: 0, monthlyTotal: 0 };
    existing.count += 1;
    existing.monthlyTotal = round2(existing.monthlyTotal + (Number(s.monthlyAmount) || 0));
    nonInrMap.set(cur, existing);
  }
  const nonInrCreativeSubscriptions = Array.from(nonInrMap.entries()).map(([currency, v]) => ({
    currency,
    ...v
  }));
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonthKey = `${curYear}-${String(curMonth).padStart(2, "0")}`;
  const realizedByMonth = /* @__PURE__ */ new Map();
  for (const p of db.payments || []) {
    if (!isVerifiedLivePayment(p)) continue;
    if (p.currency !== "INR") continue;
    if (p.serviceCategory !== CREATIVE_SERVICE_CATEGORY) continue;
    const mKey = (p.capturedAt || p.createdAt || "").slice(0, 7);
    if (!mKey) continue;
    realizedByMonth.set(
      mKey,
      round2((realizedByMonth.get(mKey) || 0) + Math.max(0, p.amount - p.refundedAmount))
    );
  }
  const monthlyTrend = [];
  for (let offset = safeWindow - 1; offset >= 0; offset -= 1) {
    const d = new Date(Date.UTC(curYear, curMonth - 1 - offset, 1));
    const y = d.getUTCFullYear();
    const m = d.getUTCMonth() + 1;
    const mKey = `${y}-${String(m).padStart(2, "0")}`;
    const label = `${monthNames[m - 1]} ${String(y).slice(-2)}`;
    let monthCreativeMrr = 0;
    let monthCreativeMrrWithGst = 0;
    let monthAllActiveMrr = 0;
    let monthCreativeCount = 0;
    for (const s of subscriptions) {
      if (s.currency !== "INR") continue;
      const startMonth = (s.startDate || s.createdAt || "").slice(0, 7);
      if (!startMonth || startMonth > mKey) continue;
      const updatedMonth = (s.updatedAt || "").slice(0, 7);
      const activeInMonth = s.status === "ACTIVE" || mKey < currentMonthKey && updatedMonth > mKey && (s.status === "PAUSED" || s.status === "CANCELLED");
      if (!activeInMonth) continue;
      const amt = Number(s.monthlyAmount) || 0;
      monthAllActiveMrr += amt;
      if (s.serviceCategory === CREATIVE_SERVICE_CATEGORY) {
        monthCreativeMrr += amt;
        monthCreativeMrrWithGst += amt * (s.gstEnabled ? 1 + (s.gstRate || 0) / 100 : 1);
        monthCreativeCount += 1;
      }
    }
    monthlyTrend.push({
      month: mKey,
      label,
      creativeMrr: round2(monthCreativeMrr),
      creativeMrrWithGst: round2(monthCreativeMrrWithGst),
      allActiveMrr: round2(monthAllActiveMrr),
      activeCreativeCount: monthCreativeCount,
      realizedCreativeCollections: round2(realizedByMonth.get(mKey) || 0)
    });
  }
  const creativeCatalog = (db.services || []).filter((s) => s.category === CREATIVE_SERVICE_CATEGORY).sort((a, b) => a.sortOrder - b.sortOrder);
  const byServiceMap = /* @__PURE__ */ new Map();
  for (const srv of creativeCatalog) {
    byServiceMap.set(srv.id, {
      serviceId: srv.id,
      serviceName: srv.name,
      listMonthlyPrice: Number(srv.monthlyPrice ?? srv.recurringFee ?? 0) || 0,
      activeCount: 0,
      pausedCount: 0,
      mrrInr: 0
    });
  }
  for (const sub of creativeSubs) {
    const existing = byServiceMap.get(sub.serviceId) || {
      serviceId: sub.serviceId,
      serviceName: sub.serviceName,
      listMonthlyPrice: Number(sub.monthlyAmount) || 0,
      activeCount: 0,
      pausedCount: 0,
      mrrInr: 0
    };
    if (sub.status === "ACTIVE") {
      existing.activeCount += 1;
      if (sub.currency === "INR") {
        existing.mrrInr = round2(existing.mrrInr + (Number(sub.monthlyAmount) || 0));
      }
    } else if (sub.status === "PAUSED") {
      existing.pausedCount += 1;
    }
    byServiceMap.set(sub.serviceId, existing);
  }
  const byCreativeService = Array.from(byServiceMap.values()).sort(
    (a, b) => b.mrrInr - a.mrrInr || b.activeCount - a.activeCount || a.serviceName.localeCompare(b.serviceName)
  );
  return {
    monthsWindow: safeWindow,
    generatedAt: now.toISOString(),
    summary: {
      activeCreativeMrr,
      activeCreativeMrrWithGst,
      totalActiveMrr,
      activeCreativeSubscribers,
      pausedCreativeSubscribers,
      cancelledCreativeSubscribers,
      creativeSharePercent,
      averageRevenuePerCreativeSubscriber,
      nonInrCreativeSubscriptions
    },
    monthlyTrend,
    byCreativeService
  };
}

// server/notifications.ts
import crypto2 from "crypto";
import net from "net";
import tls from "tls";
function getSmtpConfig() {
  const host = (process.env.SMTP_HOST || "").trim();
  const port = Number(process.env.SMTP_PORT || 465);
  const user = (process.env.SMTP_USER || "").trim();
  const pass = (process.env.SMTP_PASS || "").trim();
  const from = (process.env.SMTP_FROM || user || "connect@akyin.com").trim();
  if (!host || !user || !pass) return null;
  return {
    host,
    port: Number.isFinite(port) && port > 0 ? port : 465,
    user,
    pass,
    from
  };
}
function sanitizeHeaderValue(val) {
  return val.replace(/[\r\n]+/g, " ").trim();
}
async function sendViaSmtp(cfg, to, subject, textBody) {
  return new Promise((resolve, reject) => {
    const cleanTo = sanitizeHeaderValue(to);
    const cleanFrom = sanitizeHeaderValue(cfg.from);
    const cleanSubject = sanitizeHeaderValue(subject);
    const connectTls = () => tls.connect({
      host: cfg.host,
      port: cfg.port,
      servername: cfg.host,
      timeout: 1e4
    });
    let socket = cfg.port === 465 ? tls.connect({
      host: cfg.host,
      port: cfg.port,
      servername: cfg.host,
      timeout: 1e4
    }) : net.connect({ host: cfg.host, port: cfg.port, timeout: 1e4 });
    let step = "greeting";
    let buffer = "";
    let settled = false;
    let tlsUpgraded = cfg.port === 465;
    let ehloSupportsStarttls = false;
    const finish = (err) => {
      if (settled) return;
      settled = true;
      try {
        socket.end();
        socket.destroy();
      } catch {
      }
      if (err) reject(err);
      else resolve();
    };
    const sendCmd = (cmd) => {
      socket.write(`${cmd}\r
`);
    };
    const attachSocketListeners = (sock) => {
      sock.on("timeout", () => finish(new Error("SMTP connection timed out")));
      sock.on("error", (err) => finish(err));
      sock.on("data", (chunk) => {
        buffer += chunk.toString("utf8");
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line) continue;
          if (step === "ehlo_plain" && /STARTTLS/i.test(line)) {
            ehloSupportsStarttls = true;
          }
          if (line.length >= 4 && line[3] === "-") continue;
          const code = Number(line.slice(0, 3));
          if (Number.isFinite(code)) {
            handleLine(code, line);
          }
        }
      });
    };
    const handleLine = (code, line) => {
      if (code >= 400) {
        finish(new Error(`SMTP ${code}: ${line}`));
        return;
      }
      if (step === "greeting" && code === 220) {
        if (tlsUpgraded) {
          step = "ehlo_tls";
        } else {
          step = "ehlo_plain";
        }
        sendCmd("EHLO akyin.com");
      } else if (step === "ehlo_plain" && code === 250) {
        if (!tlsUpgraded && (ehloSupportsStarttls || cfg.port === 587)) {
          step = "starttls";
          sendCmd("STARTTLS");
        } else {
          step = "auth_user";
          sendCmd("AUTH LOGIN");
        }
      } else if (step === "starttls" && code === 220) {
        const plainSock = socket;
        plainSock.removeAllListeners("data");
        plainSock.removeAllListeners("error");
        plainSock.removeAllListeners("timeout");
        buffer = "";
        const tlsSock = tls.connect(
          {
            socket: plainSock,
            servername: cfg.host,
            timeout: 1e4
          },
          () => {
            tlsUpgraded = true;
            step = "ehlo_tls";
            sendCmd("EHLO akyin.com");
          }
        );
        socket = tlsSock;
        attachSocketListeners(tlsSock);
      } else if (step === "ehlo_tls" && code === 250) {
        step = "auth_user";
        sendCmd("AUTH LOGIN");
      } else if (step === "auth_user" && code === 334) {
        step = "auth_pass";
        sendCmd(Buffer.from(cfg.user, "utf8").toString("base64"));
      } else if (step === "auth_pass" && code === 334) {
        step = "auth_done";
        sendCmd(Buffer.from(cfg.pass, "utf8").toString("base64"));
      } else if (step === "auth_done" && code === 235) {
        step = "mail_from";
        sendCmd(`MAIL FROM:<${cleanFrom}>`);
      } else if (step === "mail_from" && code === 250) {
        step = "rcpt_to";
        sendCmd(`RCPT TO:<${cleanTo}>`);
      } else if (step === "rcpt_to" && (code === 250 || code === 251)) {
        step = "data_cmd";
        sendCmd("DATA");
      } else if (step === "data_cmd" && code === 354) {
        step = "data_body";
        const safeText = textBody.replace(/^\./gm, "..");
        const message = [
          `From: AKYIN Ventures <${cleanFrom}>`,
          `To: <${cleanTo}>`,
          `Subject: ${cleanSubject}`,
          `Date: ${(/* @__PURE__ */ new Date()).toUTCString()}`,
          "MIME-Version: 1.0",
          "Content-Type: text/plain; charset=utf-8",
          "",
          safeText,
          "."
        ].join("\r\n");
        socket.write(`${message}\r
`);
      } else if (step === "data_body" && code === 250) {
        step = "quit";
        sendCmd("QUIT");
      } else if (step === "quit") {
        finish();
      }
    };
    attachSocketListeners(socket);
  });
}
async function dispatchNotification(db, options) {
  const targetEmail = options.recipient?.trim() || db.notificationSettings?.ownerNotificationEmail || db.websiteSettings?.notificationEmail || "connect@akyin.com";
  const enabled = Boolean(db.notificationSettings?.events?.[options.event]);
  const entry = {
    id: `NTF-${crypto2.randomBytes(4).toString("hex").toUpperCase()}`,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    event: options.event,
    recipient: targetEmail,
    subject: options.subject,
    deliveryStatus: "logged_unconfigured"
  };
  if (!enabled) {
    entry.deliveryStatus = "skipped_disabled";
    db.notificationLogs.unshift(entry);
    db.notificationLogs = db.notificationLogs.slice(0, 500);
    return entry;
  }
  const smtp = getSmtpConfig();
  if (!smtp) {
    entry.deliveryStatus = "logged_unconfigured";
    db.notificationLogs.unshift(entry);
    db.notificationLogs = db.notificationLogs.slice(0, 500);
    return entry;
  }
  try {
    await sendViaSmtp(smtp, targetEmail, options.subject, options.body);
    entry.deliveryStatus = "sent";
  } catch (err) {
    entry.deliveryStatus = "failed";
    entry.errorMessage = err instanceof Error ? err.message : "SMTP delivery failed";
  }
  db.notificationLogs.unshift(entry);
  db.notificationLogs = db.notificationLogs.slice(0, 500);
  return entry;
}

// server/storage.ts
import crypto3 from "crypto";
import fs from "fs";
import path from "path";

// server/types.ts
import { z } from "zod";
var USER_ROLES = [
  "Super Admin",
  "Sales Manager",
  "Finance Manager",
  "Staff"
];
var CRM_STAGES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL SENT",
  "NEGOTIATION",
  "WON",
  "LOST"
];
var LEAD_SOURCES = [
  "Website",
  "Google Ads",
  "Facebook",
  "Instagram",
  "YouTube",
  "WhatsApp",
  "Referral",
  "Direct contact",
  "Other"
];
var DEFAULT_SERVICE_CATEGORIES = [
  "Automotive Marketing",
  "Digital Marketing",
  "Social Media Management",
  "Creative and Graphic Design",
  "Video and Content Services",
  "Business Documents and Presentations",
  "Excel and Reporting Services",
  "Messaging and Communication",
  "Lead Management and CRM",
  "Business Consulting and Training"
];
var SERVICE_CATEGORIES = DEFAULT_SERVICE_CATEGORIES;
var quotationLineItemSchema = z.object({
  id: z.string().trim().min(1).max(60),
  serviceId: z.string().trim().max(60).optional(),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(500).default(""),
  qty: z.number().finite().positive().max(1e7),
  unitPrice: z.number().finite().min(0).max(1e8),
  billingType: z.enum(["one-time", "monthly", "usage"]).optional()
});

// server/storage.ts
var CURRENT_SCHEMA_VERSION = 4;
var MESSAGING_DISCLAIMER = "Messaging rates are subject to provider charges, applicable taxes, message category, destination and delivery conditions. Final charges are confirmed in the quotation.";
function slugifyServiceName(value) {
  return String(value || "").toLowerCase().trim().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "service";
}
function getDataDir() {
  return process.env.AKYIN_DATA_DIR ? path.resolve(process.env.AKYIN_DATA_DIR) : path.resolve(process.cwd(), ".akyin-data");
}
function getDbFilePath() {
  return path.join(getDataDir(), "suite-db.json");
}
function getLegacyLeadsPath() {
  return path.join(getDataDir(), "leads.json");
}
var DEFAULT_AVAILABILITY = [
  { day: "Monday", enabled: true, startTime: "18:00", endTime: "19:00", slotDuration: 30, maximumBookings: 2 },
  { day: "Tuesday", enabled: true, startTime: "18:00", endTime: "19:00", slotDuration: 30, maximumBookings: 2 },
  { day: "Wednesday", enabled: true, startTime: "18:00", endTime: "19:00", slotDuration: 30, maximumBookings: 2 },
  { day: "Thursday", enabled: true, startTime: "18:00", endTime: "19:00", slotDuration: 30, maximumBookings: 2 },
  { day: "Friday", enabled: true, startTime: "18:00", endTime: "19:00", slotDuration: 30, maximumBookings: 2 },
  { day: "Saturday", enabled: true, startTime: "18:00", endTime: "19:00", slotDuration: 30, maximumBookings: 2 },
  { day: "Sunday", enabled: true, startTime: "18:00", endTime: "19:00", slotDuration: 30, maximumBookings: 2 }
];
var DEFAULT_NOTIFICATION_SETTINGS = {
  ownerNotificationEmail: process.env.OWNER_NOTIFICATION_EMAIL || "connect@akyin.com",
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
    subscription_renewal_reminder: true
  }
};
var DEFAULT_WEBSITE_SETTINGS = {
  reportedClientsCount: 58,
  advisoryHeadline: "Your Business. Your Vision. A Clearer Direction.",
  advisorySubheadline: "Focused 1-on-1 commercial advisory and business direction sessions with AKYIN Ventures\u2014structured around clarity, unit economics, and practical execution.",
  consultationFee: "\u20B93,998 (30-min IST Session)",
  advisorySlotDuration: "30",
  advisoryMaxBookings: "2",
  notificationEmail: process.env.OWNER_NOTIFICATION_EMAIL || "connect@akyin.com",
  contactEmail: "connect@akyin.com",
  contactPhone: "",
  whatsappNumber: "",
  heroHeadline: "Building Ideas Into Businesses.",
  heroSubheadline: "AKYIN Ventures brings together diverse business initiatives across publishing, marketing, retail, digital technology, B2B commerce and business consulting.",
  footerTagline: "A diversified business group working across marketing, publishing, technology, commerce and business solutions.",
  brandWordmark: "AKYIN",
  logoUrl: "",
  instagramUrl: "https://www.instagram.com/akyinventures/",
  facebookUrl: "https://www.facebook.com/profile.php?id=61595204474890",
  xUrl: "",
  youtubeUrl: "https://youtube.com/@akyinmarketing?si=hgB_tEfczt79H7wW",
  amazonUrl: "https://www.amazon.com/stores/Akyin-S/author/B0H6SY7N3T?_encoding=UTF8&pd_rd_w=r7GRE&content-id=amzn1.sym.7e190e19-9f6f-4df8-807a-5a7608594741&pd_rd_wg=EdC74&pd_rd_r=d01ba7b6-b1c7-4bd2-87fb-cbd0fc9deddb&ref=ap_rdr&shoppingPortalEnabled=true&ccs_id=98bb1963-9c8a-4dab-9f1b-d21a6f908208",
  googlePlayBooksUrl: "https://play.google.com/store/books/details/Akyin_s_THE_DISCIPLINE_CODE?id=seHuEQAAQBAJ",
  uaeGatewayEnabled: false,
  uaeGatewayNote: "UAE / AED international invoices settle via bank transfer or custom payment invoice until AED online checkout is enabled."
};
function buildInitialClients(nowIso) {
  const seed = [
    {
      id: "client-biznxt",
      name: "BizNXT.online",
      companyName: "BizNXT.online",
      category: "Business Guidance & Consulting",
      contactPerson: "",
      email: "",
      phone: "",
      city: "",
      country: "India",
      websiteUrl: "",
      supportScope: "Advisory Funnels, Commercial Structure & Digital Positioning",
      summary: "Entrepreneurial consulting and strategic guidance platform assisting business founders in evaluating commercial opportunities.",
      wordmarkStyle: "sans",
      internalShowcaseRoute: "/ventures/biznxt"
    },
    {
      id: "client-kartigo",
      name: "Kartigo.online",
      companyName: "Kartigo.online",
      category: "B2B Stock Supply",
      contactPerson: "",
      email: "",
      phone: "",
      city: "",
      country: "India",
      websiteUrl: "",
      supportScope: "B2B Growth, Buyer Qualification & Platform Strategy",
      summary: "Wholesale commercial stock supply and B2B trade marketplace connecting volume buyers with verified inventory.",
      wordmarkStyle: "sans",
      internalShowcaseRoute: "/ventures/kartigo"
    },
    {
      id: "client-thrift-store",
      name: "Thrift Store",
      companyName: "Thrift Store",
      category: "Fashion Retail & Thrift",
      contactPerson: "",
      email: "",
      phone: "",
      city: "",
      country: "India",
      websiteUrl: "/ventures/store",
      supportScope: "Retail Positioning, Merchandising & Demand Generation",
      summary: "Curated value fashion and thrift retail brand supported for digital storefronts and customer acquisition.",
      wordmarkStyle: "serif",
      internalShowcaseRoute: "/ventures/store"
    },
    {
      id: "client-budget-bazaar",
      name: "Budget Bazaar",
      companyName: "Budget Bazaar",
      category: "B2C E-commerce",
      contactPerson: "",
      email: "",
      phone: "",
      city: "",
      country: "India",
      websiteUrl: "",
      supportScope: "E-commerce Marketing & Customer Demand Campaigns",
      summary: "Value-driven consumer retail storefront providing everyday essentials and household goods.",
      wordmarkStyle: "sans",
      internalShowcaseRoute: "/ventures/budget-bazaar"
    },
    {
      id: "client-autoclub",
      name: "AutoClub",
      companyName: "AutoClub",
      category: "Automotive Network",
      contactPerson: "",
      email: "",
      phone: "",
      city: "",
      country: "India",
      websiteUrl: "",
      supportScope: "Dealership Lead Generation & Sales Team Coaching",
      summary: "Multi-brand automotive dealership network supported with test-drive lead generation and floor sales coaching.",
      wordmarkStyle: "sans"
    },
    {
      id: "client-arosco",
      name: "Arosco Ventures",
      companyName: "Arosco Ventures",
      category: "Digital Business Solutions",
      contactPerson: "",
      email: "",
      phone: "",
      city: "",
      country: "India",
      websiteUrl: "",
      supportScope: "Digital Solutions & Market Positioning",
      summary: "Commercial enterprise collaboration focused on digital business solutions and strategic market presence.",
      wordmarkStyle: "sans"
    },
    {
      id: "client-mei-cosmetics",
      name: "MEI Cosmetics",
      companyName: "MEI Cosmetics",
      category: "Beauty & Personal Care",
      contactPerson: "",
      email: "",
      phone: "",
      city: "",
      country: "India",
      websiteUrl: "",
      supportScope: "Creative Design & Social Media Acquisition",
      summary: "Beauty, cosmetics, and personal care brand supported across digital marketing and creative collateral.",
      wordmarkStyle: "serif"
    },
    {
      id: "client-krutika-cosmetics",
      name: "Krutika Cosmetics",
      companyName: "Krutika Cosmetics",
      category: "Cosmetics & Beauty",
      contactPerson: "",
      email: "",
      phone: "",
      city: "",
      country: "India",
      websiteUrl: "",
      supportScope: "Social Media Management & Paid Campaigns",
      summary: "Skincare and cosmetic brand collaboration driving audience reach and structured social media engagement.",
      wordmarkStyle: "serif"
    },
    {
      id: "client-nyika-traders",
      name: "Nyika Traders",
      companyName: "Nyika Traders",
      category: "Trading & Distribution",
      contactPerson: "",
      email: "",
      phone: "",
      city: "",
      country: "India",
      websiteUrl: "",
      supportScope: "Lead Filtering & Trade Operations",
      summary: "Commercial trading enterprise supported with business enquiry vetting and B2B distributor communications.",
      wordmarkStyle: "sans"
    },
    {
      id: "client-ns-traders",
      name: "NS Traders",
      companyName: "NS Traders",
      category: "Wholesale & Retail Supply",
      contactPerson: "",
      email: "",
      phone: "",
      city: "",
      country: "India",
      websiteUrl: "",
      supportScope: "Enquiry Management & Business Collateral",
      summary: "Commercial supply partner collaborating on trade distribution, customer enquiry management, and collateral.",
      wordmarkStyle: "sans"
    },
    {
      id: "client-aicalc",
      name: "AICalc",
      companyName: "AICalc",
      category: "AI & Technology",
      contactPerson: "",
      email: "",
      phone: "",
      city: "",
      country: "India",
      websiteUrl: "/ventures/aicalc",
      supportScope: "Digital Infrastructure, Technology & Marketing",
      summary: "AI-assisted calculation platform solving complex business, finance, and commercial unit math.",
      wordmarkStyle: "mono",
      internalShowcaseRoute: "/ventures/aicalc"
    }
  ];
  return seed.map((item) => ({
    ...item,
    status: "Active",
    verified: true,
    showInTicker: true,
    createdAt: nowIso,
    updatedAt: nowIso
  }));
}
function buildInitialServiceCategories(nowIso) {
  const descriptions = {
    "Automotive Marketing": "Showroom lead acquisition, test-drive bookings, dealership campaigns, and commercial automotive sales consulting.",
    "Digital Marketing": "Performance advertising across Google Ads & Meta Ads, SEO, landing page conversion optimisation, and digital lead growth.",
    "Social Media Management": "Ongoing Instagram, Facebook, and YouTube management, editorial calendars, and social account optimisation.",
    "Creative and Graphic Design": "Standalone logo design, brand identity stationery, brochures, catalogues, carousels, and high-CTR thumbnails.",
    "Video and Content Services": "Promotional reels production, commercial script writing, copywriting, and creator campaign coordination.",
    "Business Documents and Presentations": "Executive PowerPoint decks, investor pitch decks, business reports, Word/PDF formatting, templates, and ATS resumes.",
    "Excel and Reporting Services": "Automated Excel workbooks, KPI dashboards, spreadsheet cleaning, and structured monthly reporting.",
    "Messaging and Communication": "Transparent Bulk SMS credit packages and WhatsApp Business setup with clear separation from usage charges.",
    "Lead Management and CRM": "Standalone enquiry filtering, AI-assisted outbound calling workflows, pipeline management, and callback discipline.",
    "Business Consulting and Training": "1-on-1 business advisory sessions, commercial & dealership sales training, personality development, and custom solutions."
  };
  return DEFAULT_SERVICE_CATEGORIES.map((name, idx) => ({
    id: `cat-${slugifyServiceName(name)}`,
    name,
    slug: slugifyServiceName(name),
    description: descriptions[name] || `${name} standalone commercial services.`,
    sortOrder: idx + 1,
    menuOrder: idx + 1,
    active: true,
    updatedAt: nowIso
  }));
}
function buildInitialServices(nowIso) {
  const list = [
    // =========================================================================
    // 1. AUTOMOTIVE MARKETING
    // =========================================================================
    {
      id: "srv-automotive",
      slug: "automotive-marketing",
      name: "Automotive Dealership Marketing & Sales Strategy",
      category: "Automotive Marketing",
      description: "Specialized showroom marketing, dealer campaign management, automotive sales consulting, and dealership growth strategy backed by 16 years of automotive industry experience.",
      benefits: [
        "Unifies showroom enquiry capture with floor conversion discipline",
        "Separates media acquisition from buyer qualification so sales desks focus on test-drive ready prospects",
        "Grounded in direct showroom experience across mass-market to luxury badges"
      ],
      deliverables: [
        "Showroom marketing & catchment audit",
        "Dealer campaign management roadmap",
        "Automotive sales consulting & follow-up playbook",
        "Dealership growth strategy workshop"
      ],
      workProcess: [
        "Audit current dealership enquiries, ad spend & showroom walk-in ratios",
        "Structure catchment-level vehicle offer & campaign architecture",
        "Align floor executives on test-drive conversion & follow-up SLAs"
      ],
      pricingModel: "fixed",
      setupFee: 5e4,
      recurringFee: 0,
      oneTimePrice: 5e4,
      monthlyPrice: 0,
      billingCycle: "one-time",
      addons: [
        { name: "Festive / Exchange event campaign", price: 2e4 },
        { name: "Catalog & pre-owned stock rotation", price: 16e3 }
      ],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "On-site / virtual workshop + campaign sprint",
      revisionLimit: "2 post-training coaching review calls",
      additionalDeliverableCharge: 1e4,
      subscriptionDuration: "One-time dealership growth engagement",
      renewalTerms: "Optional monthly dealer retainer scoped separately",
      cancellationPolicy: "7 days written notice prior to scheduled workshop",
      menuOrder: 1,
      showInMenu: true
    },
    {
      id: "srv-test-drive-leads",
      slug: "test-drive-lead-generation",
      name: "Test-Drive Lead Generation",
      category: "Automotive Marketing",
      description: "Geo-fenced dealership campaigns structured specifically to capture confirmed showroom and doorstep test-drive enquiries within your city catchment.",
      benefits: [
        "Captures preferred model, variant & booking date upfront",
        "Targets local vehicle buyers inside showroom driving radius",
        "Direct ad spend stays inside your dealership billing account"
      ],
      deliverables: [
        "Catchment-targeted test-drive ad creative suite",
        "Dedicated model & booking slot lead form",
        "Weekly cost-per-booking attribution log"
      ],
      workProcess: [
        "Select priority models, catchment radius & offer hooks",
        "Launch geo-fenced test-drive creatives & booking capture",
        "Deliver live enquiry notifications to showroom sales desk"
      ],
      pricingModel: "fixed",
      setupFee: 15e3,
      recurringFee: 0,
      oneTimePrice: 15e3,
      monthlyPrice: 0,
      billingCycle: "one-time",
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "4\u20135 business days",
      revisionLimit: "Up to 2 revision rounds",
      additionalDeliverableCharge: 3e3,
      subscriptionDuration: "Standalone campaign setup",
      renewalTerms: "Optional monthly management",
      cancellationPolicy: "Prior to campaign publishing",
      menuOrder: 2,
      showInMenu: true
    },
    {
      id: "srv-auto-launch-exchange",
      slug: "dealer-launch-exchange-campaigns",
      name: "Showroom Launch & Exchange Event Campaigns",
      category: "Automotive Marketing",
      description: "Focused dealership promotion for new model unveilings, weekend exchange melas, and limited-window upgrade bonus drives.",
      benefits: [
        "Builds concentrated footfall ahead of model launches or weekend camps",
        "Captures existing vehicle details for exchange valuation readiness"
      ],
      deliverables: [
        "Pre-launch teaser & exchange bonus creatives",
        "Event-week local awareness & RSVP lead capture",
        "Post-event enquiry summary sheet"
      ],
      workProcess: [
        "Finalize event dates, exchange incentives & OEM creative guidelines",
        "Deploy countdown awareness and RSVP lead forms 10 days prior",
        "Hand over daily confirmed RSVP lists for showroom calling"
      ],
      pricingModel: "fixed",
      setupFee: 2e4,
      recurringFee: 0,
      oneTimePrice: 2e4,
      monthlyPrice: 0,
      billingCycle: "one-time",
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "5 business days",
      revisionLimit: "Up to 2 revision rounds",
      additionalDeliverableCharge: 4e3,
      subscriptionDuration: "Standalone event campaign",
      renewalTerms: "Per event schedule",
      cancellationPolicy: "72 hours prior to campaign kickoff",
      menuOrder: 3,
      showInMenu: true
    },
    {
      id: "srv-automotive-retention",
      slug: "customer-follow-up-management",
      name: "Customer Follow-Up & Retention Campaigns",
      category: "Automotive Marketing",
      description: "Structured outreach for dealerships and service centers covering periodic service due reminders, catalog stock rotation, and post-enquiry customer follow-up.",
      benefits: [
        "Re-engages dormant buyers and service center databases systematically",
        "Reduces showroom lead leakage through scheduled follow-up cadences"
      ],
      deliverables: [
        "Follow-up messaging templates & campaign cadence",
        "Pre-owned / priority stock highlight ads",
        "Monthly retention & reactivation tracking sheet"
      ],
      workProcess: [
        "Segment existing dealership or service database cleanly",
        "Configure scheduled reminder and offer outreach waves",
        "Track repeat bookings and re-opened enquiries monthly"
      ],
      pricingModel: "fixed",
      setupFee: 0,
      recurringFee: 16e3,
      oneTimePrice: 0,
      monthlyPrice: 16e3,
      billingCycle: "monthly",
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "5\u20137 business days rollout",
      revisionLimit: "Monthly cadence refinement",
      additionalDeliverableCharge: 3e3,
      subscriptionDuration: "Monthly standalone service",
      renewalTerms: "Auto-renews monthly",
      cancellationPolicy: "7 business days notice",
      menuOrder: 4,
      showInMenu: true
    },
    // =========================================================================
    // 2. DIGITAL MARKETING
    // =========================================================================
    {
      id: "srv-lead-generation",
      slug: "lead-generation",
      name: "Online Lead Generation Campaigns",
      category: "Digital Marketing",
      description: "Dedicated digital customer acquisition focused strictly on generating fresh, high-intent inbound buyer enquiries across search and social channels.",
      benefits: [
        "Built strictly around measurable cost-per-enquiry and buyer quality",
        "Zero forced retainer bundling\u2014select Meta, Google, or both independently",
        "Full transparency: ad spend stays directly in your own ad account"
      ],
      deliverables: [
        "Audience & keyword intent targeting plan",
        "Conversion ad creative & instant lead form setup",
        "Retargeting funnel & lead source attribution report"
      ],
      workProcess: [
        "Define ideal buyer profile, unit economics & daily enquiry target",
        "Launch segmented ad sets, instant forms & tracking pixels",
        "Optimize weekly bids, creatives & cost per qualified enquiry"
      ],
      pricingModel: "custom",
      setupFee: 0,
      recurringFee: 0,
      oneTimePrice: 0,
      monthlyPrice: 0,
      billingCycle: "monthly",
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "5\u20137 business days launch",
      revisionLimit: "Weekly campaign optimization",
      additionalDeliverableCharge: 0,
      subscriptionDuration: "Quoted per channel & geography",
      renewalTerms: "Monthly or campaign sprint",
      cancellationPolicy: "7 days notice",
      menuOrder: 5,
      showInMenu: true
    },
    {
      id: "srv-meta-ads",
      slug: "meta-ads-management",
      name: "Meta Ads Management",
      category: "Digital Marketing",
      description: "Targeted Facebook & Instagram lead generation, instant lead forms, and WhatsApp click-to-chat campaigns with direct client ad billing.",
      benefits: [
        "Continuous A/B testing of hooks, formats & buyer segments",
        "Direct WhatsApp & instant lead form capture without middlemen"
      ],
      deliverables: [
        "Meta Business Manager & pixel audit",
        "Instant lead forms & retargeting audiences",
        "Creative rotation & weekly CPL optimization report"
      ],
      workProcess: [
        "Configure Meta conversion events & custom audiences",
        "Launch cold acquisition and warm retargeting ad sets",
        "Review cost-per-lead and refresh fatigued creatives weekly"
      ],
      pricingModel: "fixed",
      setupFee: 0,
      recurringFee: 4e4,
      oneTimePrice: 0,
      monthlyPrice: 4e4,
      billingCycle: "monthly",
      addons: [{ name: "Demo / visit booking micro-campaign", price: 15e3 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "5 business days launch",
      revisionLimit: "Continuous weekly ad set rotation",
      additionalDeliverableCharge: 5e3,
      subscriptionDuration: "Monthly management service",
      renewalTerms: "Auto-renews monthly",
      cancellationPolicy: "7 days notice before cycle end",
      menuOrder: 6,
      showInMenu: true
    },
    {
      id: "srv-google-ads",
      slug: "google-ads-management",
      name: "Google Ads Management",
      category: "Digital Marketing",
      description: "High-intent Google Search, Performance Max, and local discovery campaigns capturing prospects actively searching for your products or services.",
      benefits: [
        "Captures ready-to-buy search intent with negative keyword hygiene",
        "Direct Google Ads billing ensures complete spend control"
      ],
      deliverables: [
        "Keyword intent research & negative keyword exclusion list",
        "Search & Performance Max campaign architecture",
        "Conversion tracking & weekly search term optimization"
      ],
      workProcess: [
        "Map commercial buyer keywords & city catchment filters",
        "Configure call, form & WhatsApp conversion tags",
        "Prune wasted clicks weekly and scale top-converting ad groups"
      ],
      pricingModel: "custom",
      setupFee: 0,
      recurringFee: 0,
      oneTimePrice: 0,
      monthlyPrice: 0,
      billingCycle: "monthly",
      addons: [{ name: "Google Business Profile management", price: 6e3 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "5\u20137 business days launch",
      revisionLimit: "Weekly keyword & ad copy adjustments",
      additionalDeliverableCharge: 3e3,
      subscriptionDuration: "Monthly management",
      renewalTerms: "Monthly renewal",
      cancellationPolicy: "7 days notice",
      menuOrder: 7,
      showInMenu: true
    },
    {
      id: "srv-seo",
      slug: "search-engine-optimisation",
      name: "Search Engine Optimisation & Local SEO",
      category: "Digital Marketing",
      description: "On-page search optimisation, catchment keyword positioning, and Google Business Profile management for sustained organic discovery.",
      benefits: [
        "Improves local Maps visibility and high-intent organic traffic",
        "Aligns page metadata, headings & schema with search intent"
      ],
      deliverables: [
        "Technical & local catchment SEO optimization",
        "Google Business Profile hygiene & weekly updates",
        "Monthly ranking & organic call intent report"
      ],
      workProcess: [
        "Audit crawlability, local citations & page metadata",
        "Optimize priority service URLs & Google Maps profile",
        "Publish updates and monitor search impressions monthly"
      ],
      pricingModel: "fixed",
      setupFee: 0,
      recurringFee: 12e3,
      oneTimePrice: 0,
      monthlyPrice: 12e3,
      billingCycle: "monthly",
      addons: [{ name: "Google Business Profile add-on", price: 6e3 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "Ongoing monthly",
      revisionLimit: "Monthly keyword set expansion",
      additionalDeliverableCharge: 2e3,
      subscriptionDuration: "Monthly service",
      renewalTerms: "Monthly renewal",
      cancellationPolicy: "7 days notice before cycle renewal",
      menuOrder: 8,
      showInMenu: true
    },
    {
      id: "srv-website-dev",
      slug: "landing-page-optimisation",
      name: "Landing Page Optimisation & Conversion Websites",
      category: "Digital Marketing",
      description: "Fast, mobile-first conversion landing pages and website architecture engineered to convert paid and organic visitors into structured enquiries.",
      benefits: [
        "Eliminates slow page drop-offs across mobile ad clicks",
        "Connects enquiry forms cleanly with WhatsApp & CRM tracking"
      ],
      deliverables: [
        "Responsive conversion-focused layout & copy hierarchy",
        "Lead capture form, WhatsApp & analytics event setup",
        "Core Web Vitals & clean metadata verification"
      ],
      workProcess: [
        "Review offer, audience objection points & traffic source",
        "Build clean high-contrast landing flow & mobile CTAs",
        "Verify form telemetry & launch speed before campaign kickoff"
      ],
      pricingModel: "custom",
      setupFee: 0,
      recurringFee: 0,
      oneTimePrice: 0,
      monthlyPrice: 0,
      billingCycle: "one-time",
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "2\u20134 weeks (scope dependent)",
      revisionLimit: "3 full rounds of UI revision",
      additionalDeliverableCharge: 5e3,
      subscriptionDuration: "Project milestone basis",
      renewalTerms: "Optional monthly maintenance contract",
      cancellationPolicy: "Milestone pro-rata settlement",
      menuOrder: 9,
      showInMenu: true
    },
    {
      id: "srv-digital-marketing",
      slug: "full-service-growth-marketing",
      name: "Full-Service Growth Marketing & Lead Management",
      category: "Digital Marketing",
      description: "Standalone full-funnel digital acquisition and ongoing campaign optimisation paired with structured enquiry tracking (ad spend paid directly to Meta/Google).",
      benefits: [
        "Combines acquisition campaigns, creative refreshes & structured pipeline reporting",
        "Selectable independently without compulsory add-ons"
      ],
      deliverables: [
        "Meta & Google campaign architecture",
        "Monthly creative refresh & ad optimisation",
        "Structured enquiry pipeline sheet & executive summary"
      ],
      workProcess: [
        "Onboard brand, ad accounts & target CPA goals in 7\u201310 business days",
        "Deploy acquisition campaigns and refresh creatives monthly",
        "Deliver executive performance review every month"
      ],
      pricingModel: "fixed",
      setupFee: 79998,
      recurringFee: 6e4,
      oneTimePrice: 79998,
      monthlyPrice: 6e4,
      billingCycle: "monthly",
      addons: [{ name: "Ad creative boost pack (6 additional creatives)", price: 8e3 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "7\u201310 business days onboarding",
      revisionLimit: "Unlimited campaign optimizations",
      additionalDeliverableCharge: 8e3,
      subscriptionDuration: "Monthly service",
      renewalTerms: "Auto-renews monthly; 15 days notice",
      cancellationPolicy: "15 business days prior to cycle renewal",
      menuOrder: 10,
      showInMenu: true
    },
    {
      id: "srv-customer-acquisition",
      slug: "digital-advertising-campaigns",
      name: "Digital Advertising & B2B Acquisition Campaigns",
      category: "Digital Marketing",
      description: "Targeted buyer acquisition sprints for commercial services, institutional B2B offers, and regional product launches.",
      benefits: [
        "Focused sprint execution for time-bound offers or new city rollouts",
        "Separates campaign management fees from media budget"
      ],
      deliverables: [
        "Offer positioning & campaign targeting build",
        "Lead capture form & weekly performance tracker"
      ],
      workProcess: [
        "Scope campaign objective, target cities & offer creatives",
        "Publish ads & track initial 7-day lead quality metrics",
        "Refine targeting and close campaign sprint with full report"
      ],
      pricingModel: "fixed",
      setupFee: 0,
      recurringFee: 16e3,
      oneTimePrice: 0,
      monthlyPrice: 16e3,
      billingCycle: "monthly",
      addons: [{ name: "Corporate / B2B campaign sprint", price: 2e4 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "7 business days rollout",
      revisionLimit: "Weekly messaging adjustments",
      additionalDeliverableCharge: 3e3,
      subscriptionDuration: "Monthly campaign management",
      renewalTerms: "Auto-renews monthly",
      cancellationPolicy: "7 business days notice",
      menuOrder: 11,
      showInMenu: false
    },
    // =========================================================================
    // 3. SOCIAL MEDIA MANAGEMENT
    // =========================================================================
    {
      id: "srv-social-media",
      slug: "social-media-management",
      name: "Instagram & Facebook Management",
      category: "Social Media Management",
      description: "Consistent Instagram and Facebook brand presence covering content calendar planning, post publishing, and account optimisation.",
      benefits: [
        "Maintains active social credibility for inbound buyers checking your brand",
        "Structured monthly calendar approved ahead of scheduling"
      ],
      deliverables: [
        "Monthly content calendar & caption copy",
        "Scheduled Instagram & Facebook posting",
        "Monthly reach & engagement summary"
      ],
      workProcess: [
        "Align visual tone, product priorities & monthly calendar pillars",
        "Prepare posts and obtain streamlined approval",
        "Schedule publishing and deliver monthly performance summary"
      ],
      pricingModel: "fixed",
      setupFee: 0,
      recurringFee: 16e3,
      oneTimePrice: 0,
      monthlyPrice: 16e3,
      billingCycle: "monthly",
      addons: [
        { name: "8 promotional reels/month", price: 2e4 },
        { name: "10 graphic creatives/month", price: 8e3 }
      ],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "Monthly cycle",
      revisionLimit: "2 feedback rounds per calendar",
      additionalDeliverableCharge: 2e3,
      subscriptionDuration: "Monthly service",
      renewalTerms: "Auto-renews monthly",
      cancellationPolicy: "7 days prior to next month billing",
      menuOrder: 12,
      showInMenu: true
    },
    {
      id: "srv-youtube-management",
      slug: "youtube-channel-management",
      name: "YouTube Channel Management",
      category: "Social Media Management",
      description: "End-to-end YouTube channel optimisation, video SEO titles/descriptions, playlist architecture, and consistent upload cadence.",
      benefits: [
        "Turns product walkthroughs and founder insights into searchable evergreen video assets",
        "Pairs seamlessly with YouTube Thumbnail Design and Script Writing"
      ],
      deliverables: [
        "Channel metadata, keywords & playlist structuring",
        "Video upload formatting, tags & end-screen setup",
        "Monthly watch-time & CTR review"
      ],
      workProcess: [
        "Audit channel structure, search keywords & audience retention gaps",
        "Standardize upload checklists, descriptions & CTA links",
        "Publish consistently and track CTR and subscriber trends monthly"
      ],
      pricingModel: "custom",
      setupFee: 0,
      recurringFee: 0,
      oneTimePrice: 0,
      monthlyPrice: 0,
      billingCycle: "monthly",
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "Ongoing monthly or setup sprint",
      revisionLimit: "Per publishing schedule",
      additionalDeliverableCharge: 0,
      subscriptionDuration: "Scoped per upload frequency",
      renewalTerms: "Monthly",
      cancellationPolicy: "7 days notice",
      menuOrder: 13,
      showInMenu: true
    },
    {
      id: "srv-social-content-planning",
      slug: "social-media-content-planning",
      name: "Content Calendar & Social Post Planning",
      category: "Social Media Management",
      description: "Strategic monthly content calendar management, topic ideation, post creation briefs, and bio/account optimisation.",
      benefits: [
        "Gives internal teams a crisp roadmap of what to shoot and publish every week",
        "Eliminates inconsistent ad-hoc posting across social handles"
      ],
      deliverables: [
        "30-day multi-platform content calendar",
        "Post topic hooks, format specs & caption angles",
        "Profile bio & highlight optimization checklist"
      ],
      workProcess: [
        "Audit business priorities, offers & seasonal dates",
        "Build a 30-day structured posting calendar with creative briefs",
        "Refine next month plan based on top-performing formats"
      ],
      pricingModel: "custom",
      setupFee: 0,
      recurringFee: 0,
      oneTimePrice: 0,
      monthlyPrice: 0,
      billingCycle: "monthly",
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "3\u20135 business days",
      revisionLimit: "2 calendar adjustment rounds",
      additionalDeliverableCharge: 0,
      subscriptionDuration: "One-time or monthly",
      renewalTerms: "Monthly",
      cancellationPolicy: "7 days notice",
      menuOrder: 14,
      showInMenu: true
    },
    // =========================================================================
    // 4. CREATIVE AND GRAPHIC DESIGN
    // =========================================================================
    {
      id: "srv-creative-logo",
      slug: "logo-design",
      name: "Logo and Branding Design",
      category: "Creative and Graphic Design",
      description: "Business logo design, clean vector variations, basic brand identity guidelines, brand colour & typography suggestions, and export-ready files.",
      benefits: [
        "Clean, scalable vector branding tailored for digital storefronts and print stationery",
        "Order as a single one-time project or ongoing brand creative support"
      ],
      deliverables: [
        "Business logo design",
        "Logo variations",
        "Basic brand identity",
        "Brand colour and typography suggestions",
        "Export-ready files (SVG, PNG, PDF)"
      ],
      workProcess: [
        "Collect brand brief, target market positioning & style references",
        "Present initial logo directions and colour/font pairings",
        "Refine selected mark across revisions and deliver export-ready files"
      ],
      pricingModel: "fixed",
      setupFee: 6e3,
      recurringFee: 1e4,
      oneTimePrice: 6e3,
      monthlyPrice: 1e4,
      billingCycle: "one-time",
      addons: [{ name: "Additional concept direction & vector master pack", price: 2e3 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "3\u20135 business days",
      revisionLimit: "3 rounds of design revisions included",
      additionalDeliverableCharge: 1e3,
      subscriptionDuration: "Standalone project or monthly brand creative retainer",
      renewalTerms: "Monthly subscription auto-renews; cancel anytime 7 days prior",
      cancellationPolicy: "Cancel subscription anytime with 7 days notice",
      menuOrder: 15,
      showInMenu: true
    },
    {
      id: "srv-creative-thumbnails",
      slug: "youtube-thumbnail-design",
      name: "YouTube Thumbnail & Social Creative Design",
      category: "Creative and Graphic Design",
      description: "High-CTR YouTube thumbnails, Instagram promotional thumbnails, Facebook creatives, and sharp advertising graphics built for click performance.",
      benefits: [
        "Designed for instant mobile legibility and strong visual contrast",
        "Flexible 5-pack standalone order or 15-creative monthly plan"
      ],
      deliverables: [
        "YouTube thumbnails",
        "Instagram promotional thumbnails",
        "Facebook creatives",
        "Advertising creatives",
        "Custom promotional graphics"
      ],
      workProcess: [
        "Receive video title, hook text, brand assets & photos",
        "Design high-contrast compositions optimized for small viewports",
        "Deliver final PNG/JPG creatives with requested revision tweaks"
      ],
      pricingModel: "fixed",
      setupFee: 3e3,
      recurringFee: 8e3,
      oneTimePrice: 3e3,
      monthlyPrice: 8e3,
      billingCycle: "one-time",
      addons: [{ name: "Express 12-hour turnaround add-on", price: 1500 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "24\u201348 hours per batch",
      revisionLimit: "2 revisions per creative",
      additionalDeliverableCharge: 500,
      subscriptionDuration: "Standalone 5-pack or monthly 15-creative plan",
      renewalTerms: "Auto-renews monthly on renewal date",
      cancellationPolicy: "Cancel anytime before monthly renewal",
      menuOrder: 16,
      showInMenu: true
    },
    {
      id: "srv-branding",
      slug: "brand-identity-stationery-design",
      name: "Business Card, Letterhead & Brand Stationery Design",
      category: "Creative and Graphic Design",
      description: "Print-ready business card design, official corporate letterhead design, and cohesive visual brand identity templates.",
      benefits: [
        "Print-ready CMYK & digital PDF deliverables ready for local offset or digital printing",
        "Consistent typography and layout across sales cards and correspondence"
      ],
      deliverables: [
        "Business card design (print & digital)",
        "Official letterhead design (Word & PDF)",
        "Brand visual typography & palette kit"
      ],
      workProcess: [
        "Align existing logo, contact details & brand colours",
        "Draft clean minimalist front/back business card & letterhead layouts",
        "Finalize revisions and export press-ready files"
      ],
      pricingModel: "fixed",
      setupFee: 6e3,
      recurringFee: 0,
      oneTimePrice: 6e3,
      monthlyPrice: 0,
      billingCycle: "one-time",
      addons: [{ name: "10 branded graphic templates", price: 8e3 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "5\u20137 business days",
      revisionLimit: "3 revision rounds included",
      additionalDeliverableCharge: 1500,
      subscriptionDuration: "One-time project delivery",
      renewalTerms: "N/A (One-time)",
      cancellationPolicy: "Cancellation prior to second proofing round",
      menuOrder: 17,
      showInMenu: true
    },
    {
      id: "srv-company-profile-brochure",
      slug: "brochure-company-profile-design",
      name: "Company Profile, Brochure, Flyer & Product Catalogue Design",
      category: "Creative and Graphic Design",
      description: "Structured graphic layout for corporate company profiles, multi-fold brochures, promotional flyers, posters, and multi-SKU product catalogues.",
      benefits: [
        "Turns complex SKU specs or company credentials into effortless visual reading",
        "Supplied in both print-ready high-DPI PDF and lightweight WhatsApp share PDF"
      ],
      deliverables: [
        "Company profile or multi-page brochure design",
        "Flyer, poster or product catalogue layout",
        "Print & WhatsApp-optimized PDF exports"
      ],
      workProcess: [
        "Organize company copy, product specs & high-res imagery",
        "Design clean grid typography and product hierarchy",
        "Proof pages across revision cycles and deliver print & web PDFs"
      ],
      pricingModel: "custom",
      setupFee: 0,
      recurringFee: 0,
      oneTimePrice: 0,
      monthlyPrice: 0,
      billingCycle: "one-time",
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "5\u201310 business days (page count dependent)",
      revisionLimit: "2\u20133 proofing cycles",
      additionalDeliverableCharge: 0,
      subscriptionDuration: "Scoped by page count",
      renewalTerms: "N/A (One-time)",
      cancellationPolicy: "Milestone basis",
      menuOrder: 18,
      showInMenu: true
    },
    {
      id: "srv-social-post-carousel",
      slug: "social-media-post-carousel-design",
      name: "Social Media Post, Carousel & YouTube Channel Branding",
      category: "Creative and Graphic Design",
      description: "Custom social media post design, multi-slide educational carousel posts, ad creative design, and unified YouTube channel banner branding.",
      benefits: [
        "Boosts saves and shares with structured swipeable carousel storytelling",
        "Consistent channel art across social profiles and ad placements"
      ],
      deliverables: [
        "Custom social media static & carousel post designs",
        "Ad creative banners sized for feed & story placements",
        "YouTube channel banner, avatar & watermark branding"
      ],
      workProcess: [
        "Review offer message, copy points & target placement dimensions",
        "Design cohesive post, carousel or channel branding pack",
        "Deliver layered exports sized for Instagram, Facebook & YouTube"
      ],
      pricingModel: "custom",
      setupFee: 0,
      recurringFee: 0,
      oneTimePrice: 0,
      monthlyPrice: 0,
      billingCycle: "one-time",
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "3\u20135 business days",
      revisionLimit: "2 revision rounds per creative batch",
      additionalDeliverableCharge: 0,
      subscriptionDuration: "One-time batch or monthly",
      renewalTerms: "Optional monthly",
      cancellationPolicy: "Prior to final batch sign-off",
      menuOrder: 19,
      showInMenu: true
    },
    // =========================================================================
    // 5. VIDEO AND CONTENT SERVICES
    // =========================================================================
    {
      id: "srv-creative-scriptwriting",
      slug: "script-writing",
      name: "Script Writing",
      category: "Video and Content Services",
      description: "Strategic conversion scripts for promotional videos, vertical reels, YouTube explainers, paid advertisements, and business presentations.",
      benefits: [
        "Hooks viewers inside the first 3 seconds with clear commercial storytelling",
        "Structured voiceover cues and scene beats ready for effortless shooting"
      ],
      deliverables: [
        "Promotional video scripts",
        "Reels and short-video scripts",
        "YouTube scripts",
        "Advertisement scripts",
        "Business presentation scripts"
      ],
      workProcess: [
        "Define product benefits, target audience & video runtime",
        "Draft structured hook, proof points & closing CTA script",
        "Refine pacing and phrasing across included revision passes"
      ],
      pricingModel: "fixed",
      setupFee: 4e3,
      recurringFee: 12e3,
      oneTimePrice: 4e3,
      monthlyPrice: 12e3,
      billingCycle: "one-time",
      addons: [{ name: "Teleprompter cues & voiceover pacing guide", price: 1e3 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "2\u20133 business days",
      revisionLimit: "2 revisions per script",
      additionalDeliverableCharge: 800,
      subscriptionDuration: "Standalone 3-script pack or monthly 12-script retainer",
      renewalTerms: "Renews monthly; roll-over unused scripts within 30 days",
      cancellationPolicy: "Cancel anytime with 7 days advance notice",
      menuOrder: 20,
      showInMenu: true
    },
    {
      id: "srv-reels-video-production",
      slug: "promotional-video-reels",
      name: "Promotional Video & Reels Production",
      category: "Video and Content Services",
      description: "High-retention vertical promotional reels, dynamic captions, product cutdowns, and multi-ratio social video edits.",
      benefits: [
        "Turns raw showroom or studio clips into polished vertical brand stories",
        "Formatted natively for Instagram Reels, YouTube Shorts & Meta video ads"
      ],
      deliverables: [
        "Promotional reels edit suite (up to 8 reels/pack)",
        "Motion typography captions & clean sound pacing",
        "Multi-aspect ratio exports (9:16 & 1:1)"
      ],
      workProcess: [
        "Receive raw product footage or shoot brief & hook script",
        "Edit tight vertical cutdowns with visual callouts and captions",
        "Review timing/text revisions and deliver export-ready MP4 files"
      ],
      pricingModel: "fixed",
      setupFee: 2e4,
      recurringFee: 0,
      oneTimePrice: 2e4,
      monthlyPrice: 0,
      billingCycle: "one-time",
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "5\u20137 business days per batch",
      revisionLimit: "2 edit cut revisions per video",
      additionalDeliverableCharge: 2500,
      subscriptionDuration: "Standalone video edit batch",
      renewalTerms: "Optional monthly batch",
      cancellationPolicy: "Prior to assembly cut delivery",
      menuOrder: 21,
      showInMenu: true
    },
    {
      id: "srv-content-copywriting",
      slug: "content-copywriting",
      name: "Content Copywriting & Video Creative Coordination",
      category: "Video and Content Services",
      description: "Persuasive commercial copywriting for web pages, brochures, email campaigns, plus end-to-end creator and video shoot coordination.",
      benefits: [
        "Sharp, jargon-free B2B and consumer copywriting tailored to Indian & UAE buyers",
        "Coordinates creators, talking points & shoot deliverables cleanly"
      ],
      deliverables: [
        "Website, landing page & ad copywriting",
        "Creator brief & video shoot coordination plan",
        "Proofed publication-ready copy deck"
      ],
      workProcess: [
        "Gather product USP, objections & buyer tone requirements",
        "Draft structured headlines, body copy & creator briefs",
        "Coordinate feedback edits and approve final messaging"
      ],
      pricingModel: "custom",
      setupFee: 0,
      recurringFee: 0,
      oneTimePrice: 0,
      monthlyPrice: 0,
      billingCycle: "one-time",
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "3\u20135 business days",
      revisionLimit: "2 copy revision passes",
      additionalDeliverableCharge: 0,
      subscriptionDuration: "Quoted by scope & shoot volume",
      renewalTerms: "Per project or monthly",
      cancellationPolicy: "Milestone basis",
      menuOrder: 22,
      showInMenu: true
    },
    // =========================================================================
    // 6. BUSINESS DOCUMENTS AND PRESENTATIONS
    // =========================================================================
    {
      id: "srv-creative-ppt",
      slug: "presentation-design",
      name: "PowerPoint Presentation & Pitch Deck Design",
      category: "Business Documents and Presentations",
      description: "Basic PPT, Professional PPT, Investor pitch decks, Company profile PPTs, and Sales presentations structured with crisp executive hierarchy.",
      benefits: [
        "Transforms dense raw notes into boardroom-ready slide storytelling",
        "Editable PowerPoint (.pptx) + clean shareable PDF included"
      ],
      deliverables: [
        "Basic or Professional PowerPoint presentation",
        "Investor pitch deck & Company profile PPT",
        "Sales & marketing presentation slides",
        "Editable PPTX + print/email PDF formats"
      ],
      workProcess: [
        "Review raw outline, financial points & brand identity",
        "Structure slide narrative flow and key visual layouts",
        "Refine data callouts across 3 review cycles and export master files"
      ],
      pricingModel: "fixed",
      setupFee: 6e3,
      recurringFee: 14e3,
      oneTimePrice: 6e3,
      monthlyPrice: 14e3,
      billingCycle: "one-time",
      addons: [{ name: "Animated slide transitions & interactive PDF deck", price: 2500 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "3\u20135 business days",
      revisionLimit: "3 slide deck review cycles",
      additionalDeliverableCharge: 600,
      subscriptionDuration: "Standalone 12-slide deck or monthly slide update retainer",
      renewalTerms: "Renews monthly for active sales & investor updates",
      cancellationPolicy: "Cancel anytime before next billing date",
      menuOrder: 23,
      showInMenu: true
    },
    {
      id: "srv-business-reports-docs",
      slug: "business-reports-formatting",
      name: "Business Reports, Word & PDF Formatting",
      category: "Business Documents and Presentations",
      description: "Clean formatting and layout engineering for corporate business reports, Word documents (.docx), executive dossiers, and interactive PDFs.",
      benefits: [
        "Standardizes headings, tables, page numbers & visual alignment effortlessly",
        "Eliminates broken layouts across Word and PDF viewers"
      ],
      deliverables: [
        "Structured business report layout",
        "Word document (.docx) style & template cleanup",
        "Clean bookmarked PDF formatting"
      ],
      workProcess: [
        "Inspect raw draft documents, tables & brand style preferences",
        "Apply consistent typographic hierarchy, tables & headers",
        "Deliver both editable DOCX and clean finalized PDF"
      ],
      pricingModel: "custom",
      setupFee: 0,
      recurringFee: 0,
      oneTimePrice: 0,
      monthlyPrice: 0,
      billingCycle: "one-time",
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "2\u20134 business days",
      revisionLimit: "2 layout proofing rounds",
      additionalDeliverableCharge: 0,
      subscriptionDuration: "Scoped by page count",
      renewalTerms: "N/A (One-time)",
      cancellationPolicy: "Prior to final export",
      menuOrder: 24,
      showInMenu: true
    },
    {
      id: "srv-quotation-invoice-templates",
      slug: "quotation-invoice-templates",
      name: "Quotation & Invoice Templates",
      category: "Business Documents and Presentations",
      description: "Custom-branded commercial quotation and GST/UAE tax invoice templates built cleanly in Excel, Word, or fillable PDF.",
      benefits: [
        "Automatic subtotal, discount & tax formulas reduce manual billing errors",
        "Projects immediate commercial credibility with corporate buyers"
      ],
      deliverables: [
        "Custom branded Quotation template (with GST/VAT toggles)",
        "Automated commercial Invoice layout (Excel / Word / PDF)"
      ],
      workProcess: [
        "Collect company logo, bank details, tax rules & payment terms",
        "Build clean layout with automatic calculation fields",
        "Test printout margins & PDF export formatting before handover"
      ],
      pricingModel: "custom",
      setupFee: 0,
      recurringFee: 0,
      oneTimePrice: 0,
      monthlyPrice: 0,
      billingCycle: "one-time",
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "2\u20133 business days",
      revisionLimit: "2 template adjustments",
      additionalDeliverableCharge: 0,
      subscriptionDuration: "One-time deliverable",
      renewalTerms: "N/A (One-time)",
      cancellationPolicy: "Prior to final template delivery",
      menuOrder: 25,
      showInMenu: true
    },
    {
      id: "srv-resume-ats-formatting",
      slug: "ats-resume-formatting",
      name: "Resume & ATS Resume Formatting",
      category: "Business Documents and Presentations",
      description: "Clean, recruiter-readable executive resumes and Applicant Tracking System (ATS) compliant CV formatting tailored for clarity and impact.",
      benefits: [
        "ATS-safe clean structure without broken multi-column parser traps",
        "Highlights measurable business outcomes & crisp role progression"
      ],
      deliverables: [
        "ATS-friendly formatted Resume (.docx + .pdf)",
        "Executive headline & achievement bullet structuring"
      ],
      workProcess: [
        "Review current CV, career target roles & key achievements",
        "Reformat typography, section keywords & impact phrasing",
        "Deliver ATS-tested Word and PDF editions"
      ],
      pricingModel: "custom",
      setupFee: 0,
      recurringFee: 0,
      oneTimePrice: 0,
      monthlyPrice: 0,
      billingCycle: "one-time",
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "2\u20133 business days",
      revisionLimit: "2 content & layout revisions",
      additionalDeliverableCharge: 0,
      subscriptionDuration: "One-time career service",
      renewalTerms: "N/A (One-time)",
      cancellationPolicy: "Prior to finalized draft delivery",
      menuOrder: 26,
      showInMenu: true
    },
    {
      id: "srv-creative-support",
      slug: "business-documentation-support",
      name: "Additional Business Documentation Support",
      category: "Business Documents and Presentations",
      description: "Flexible operational assistance for commercial data entry, business document formatting, basic customer enquiry handling, and custom documentation.",
      benefits: [
        "Offloads repetitive commercial documentation onto structured specialists",
        "Bookable as a 10-hour sprint or 25-hour monthly support allocation"
      ],
      deliverables: [
        "Structured data entry & cleanup",
        "Commercial document formatting",
        "Basic customer enquiry sorting & CRM entry",
        "Custom business documentation"
      ],
      workProcess: [
        "Define task checklist, turnaround expectations & file formats",
        "Execute tasks with QA checks in 10-hr sprints or monthly blocks",
        "Deliver verified spreadsheets & formatted documentation"
      ],
      pricingModel: "fixed",
      setupFee: 4e3,
      recurringFee: 8e3,
      oneTimePrice: 4e3,
      monthlyPrice: 8e3,
      billingCycle: "one-time",
      addons: [{ name: "Priority weekend operational coverage block", price: 3e3 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "Ongoing according to agreed schedule",
      revisionLimit: "Quality-checked output with 2 correction rounds",
      additionalDeliverableCharge: 500,
      subscriptionDuration: "Standalone 10-hr sprint or 25-hr monthly retainer",
      renewalTerms: "Renews monthly; unused hours do not roll over",
      cancellationPolicy: "Cancel anytime before monthly renewal",
      menuOrder: 27,
      showInMenu: false
    },
    // =========================================================================
    // 7. EXCEL AND REPORTING SERVICES
    // =========================================================================
    {
      id: "srv-creative-excel",
      slug: "excel-reporting",
      name: "Excel Workbooks, Dashboards & Automation",
      category: "Excel and Reporting Services",
      description: "Basic & Professional Excel workbooks, executive Excel dashboards, automated calculation formulas, sales trackers, and inventory sheets.",
      benefits: [
        "Replaces error-prone manual totals with dynamic XLOOKUP/Pivot/formula models",
        "Built cleanly for non-technical managers to filter daily numbers immediately"
      ],
      deliverables: [
        "Basic or Professional Excel workbook",
        "Interactive Excel KPI dashboard",
        "Sales, lead & inventory tracking templates",
        "Custom automated calculation formulas"
      ],
      workProcess: [
        "Review source data layout, KPI definitions & team workflow",
        "Engineer clean formulas, data validation dropdowns & visual charts",
        "Walk through usage and complete 2 formula/layout adjustments"
      ],
      pricingModel: "fixed",
      setupFee: 5e3,
      recurringFee: 1e4,
      oneTimePrice: 5e3,
      monthlyPrice: 1e4,
      billingCycle: "one-time",
      addons: [{ name: "Google Sheets & CSV automated sync integration", price: 3e3 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "3\u20134 business days",
      revisionLimit: "2 post-delivery formula / layout adjustments",
      additionalDeliverableCharge: 1e3,
      subscriptionDuration: "Standalone custom workbook or monthly maintenance retainer",
      renewalTerms: "Renews monthly for weekly report refreshes",
      cancellationPolicy: "Cancel anytime with 7 days notice",
      menuOrder: 28,
      showInMenu: true
    },
    {
      id: "srv-data-cleaning",
      slug: "data-cleaning-structuring",
      name: "Data Cleaning & Spreadsheet Structuring",
      category: "Excel and Reporting Services",
      description: "Thorough deduplication, phone/email standardization, scattered tab consolidation, and structured spreadsheet hygiene.",
      benefits: [
        "Prepares messy historical lead or customer exports for accurate campaigns and reporting",
        "Eliminates duplicate rows, inconsistent date formats & broken formulas"
      ],
      deliverables: [
        "Deduplicated & standardized XLSX / CSV master file",
        "Data validation rules & clean column taxonomy"
      ],
      workProcess: [
        "Inspect raw exports for duplicates, formatting drift & missing keys",
        "Clean, normalize and verify record accuracy",
        "Deliver structured master file ready for CRM or reporting"
      ],
      pricingModel: "custom",
      setupFee: 0,
      recurringFee: 0,
      oneTimePrice: 0,
      monthlyPrice: 0,
      billingCycle: "one-time",
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "2\u20135 business days (volume dependent)",
      revisionLimit: "1 verification & correction pass",
      additionalDeliverableCharge: 0,
      subscriptionDuration: "Scoped per record volume",
      renewalTerms: "N/A (One-time)",
      cancellationPolicy: "Prior to final workbook handover",
      menuOrder: 29,
      showInMenu: true
    },
    {
      id: "srv-monthly-performance-reporting",
      slug: "monthly-performance-reporting",
      name: "Monthly Performance & MIS Reporting",
      category: "Excel and Reporting Services",
      description: "Recurring executive MIS & commercial performance reporting consolidating lead flow, campaign spend, conversion ratios, and unit margins.",
      benefits: [
        "Gives founders one trustworthy monthly scorecard across sales & marketing",
        "Reduces weekly manual spreadsheet compilation time"
      ],
      deliverables: [
        "Standardized monthly MIS workbook & summary deck",
        "Lead-to-sale funnel conversion & ROI breakdown"
      ],
      workProcess: [
        "Connect monthly CSV exports from CRM, ads & billing sheets",
        "Compile clean KPI views, variance notes & action highlights",
        "Deliver verified monthly report on a fixed calendar date"
      ],
      pricingModel: "custom",
      setupFee: 0,
      recurringFee: 0,
      oneTimePrice: 0,
      monthlyPrice: 0,
      billingCycle: "monthly",
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "Monthly fixed calendar delivery",
      revisionLimit: "Monthly KPI layout refinement",
      additionalDeliverableCharge: 0,
      subscriptionDuration: "Monthly service",
      renewalTerms: "Monthly",
      cancellationPolicy: "7 days notice",
      menuOrder: 30,
      showInMenu: true
    },
    // =========================================================================
    // 8. MESSAGING AND COMMUNICATION
    // =========================================================================
    {
      id: "srv-bulk-sms",
      slug: "bulk-sms",
      name: "Bulk SMS Marketing",
      category: "Messaging and Communication",
      description: "Promotional & transactional bulk SMS campaigns (\u20B93,000 for 10,000 SMS credits; \u20B90.30 effective rate; additional credits calculated using admin-configured rate). Provider API integration is configured per client upon provider credential activation.",
      benefits: [
        "Clear credit transparency: \u20B93,000 fixed starter bundle includes 10,000 SMS credits (\u20B90.30/SMS)",
        "Additional SMS usage calculated dynamically using admin-configured rate",
        "Supports scheduled broadcasts, contact uploads & provider delivery logs"
      ],
      deliverables: [
        "Bulk promotional SMS",
        "Transactional SMS, if supported by the selected provider",
        "Contact list upload",
        "Campaign scheduling",
        "Delivery reports, where supported",
        "SMS credit usage tracking",
        "Campaign history"
      ],
      workProcess: [
        "Complete DLT / telecom sender ID & template compliance review",
        "Provision 10,000 starter SMS credits upon quotation approval",
        "Upload recipient lists, schedule campaigns & monitor usage reports"
      ],
      pricingModel: "fixed",
      setupFee: 0,
      recurringFee: 3e3,
      packagePrice: 3e3,
      oneTimePrice: 3e3,
      monthlyPrice: 0,
      includedUnits: 1e4,
      unitLabel: "SMS",
      unitRate: 0.3,
      additionalUnitRate: 0.3,
      billingCycle: "one-time",
      addons: [{ name: "Additional 10,000 SMS credit block", price: 3e3 }],
      internationalPricing: {
        aed: { setupFee: 0, packagePrice: 140, unitRate: 0.015, additionalUnitRate: 0.015 },
        usd: { setupFee: 0, packagePrice: 39, unitRate: 4e-3, additionalUnitRate: 4e-3 },
        notes: "Configurable international SMS pricing per destination route."
      },
      disclaimer: MESSAGING_DISCLAIMER,
      integrationConfigured: false,
      transactionalSmsEnabled: false,
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "Upon DLT/provider onboarding & credential setup",
      revisionLimit: "Sender ID and template approval guidance",
      additionalDeliverableCharge: 3e3,
      subscriptionDuration: "Credit bundle (validity subject to provider terms)",
      renewalTerms: "Recharge as needed",
      cancellationPolicy: "Non-refundable once credits are provisioned with telecom operator",
      menuOrder: 31,
      showInMenu: true
    },
    {
      id: "srv-whatsapp-messaging",
      slug: "whatsapp-business-setup",
      name: "WhatsApp Business Messaging Setup",
      category: "Messaging and Communication",
      description: "Structured WhatsApp Business Messaging onboarding and workflow configuration. One-time setup fee (\u20B94,999) is billed strictly separate from message usage charges (\u20B91.50 per message). Provider API integration is pending client provider credentials & verification.",
      benefits: [
        "100% transparent billing separation: \u20B94,999 one-time setup fee kept distinct from \u20B91.50/message usage",
        "Clean business profile configuration & structured customer reply workflows",
        "Trackable campaign and per-message billing visibility"
      ],
      deliverables: [
        "WhatsApp Business setup assistance",
        "Business profile configuration",
        "Messaging workflow setup",
        "Customer communication setup",
        "Campaign and message tracking, where supported",
        "Usage and billing reports"
      ],
      workProcess: [
        "Verify Meta Business Manager & phone number eligibility",
        "Configure official business profile, catalog & message workflows",
        "Activate tracked messaging usage billed strictly separately at \u20B91.50/msg"
      ],
      pricingModel: "fixed",
      setupFee: 4999,
      recurringFee: 0,
      packagePrice: 0,
      oneTimePrice: 4999,
      monthlyPrice: 0,
      includedUnits: 0,
      unitLabel: "message",
      unitRate: 1.5,
      additionalUnitRate: 1.5,
      billingCycle: "one-time",
      addons: [{ name: "1,000 WhatsApp messages usage allocation", price: 1500 }],
      internationalPricing: {
        aed: { setupFee: 225, packagePrice: 0, unitRate: 0.07, additionalUnitRate: 0.07 },
        usd: { setupFee: 65, packagePrice: 0, unitRate: 0.02, additionalUnitRate: 0.02 },
        notes: "Setup fee remains separate from per-message international Meta/BSP rates."
      },
      disclaimer: MESSAGING_DISCLAIMER,
      integrationConfigured: false,
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "5\u20137 business days setup (subject to Meta/BSP verification)",
      revisionLimit: "2 workflow revision cycles",
      additionalDeliverableCharge: 1500,
      subscriptionDuration: "One-time onboarding + pay-as-you-go message usage",
      renewalTerms: "Usage billed as consumed or prepaid per campaign quota",
      cancellationPolicy: "Setup fee non-refundable once BSP onboarding initiated",
      menuOrder: 32,
      showInMenu: true
    },
    // =========================================================================
    // 9. LEAD MANAGEMENT AND CRM
    // =========================================================================
    {
      id: "srv-lead-gen",
      slug: "lead-filtering",
      name: "Lead Filtering & Qualification",
      category: "Lead Management and CRM",
      description: "Structured telephonic and AI-assisted vetting of existing inbound leads before sales floor handover so sales executives spend time exclusively with verified buyers.",
      benefits: [
        "Screens out cold clicks & wrong numbers before they reach your sales team",
        "Captures product interest, budget readiness, purchase window & booking slot",
        "Delivers structured Hot, Warm & Future Follow-up classification daily"
      ],
      deliverables: [
        "AI-assisted & human outbound vetting of existing enquiries (up to 1,000 mins/month)",
        "Budget, timeline & intent verification",
        "Hot / Warm / Future Lead status tagging & daily Excel reports"
      ],
      workProcess: [
        "Configure custom qualification criteria, script & callback routing in 5 business days",
        "Initiate outbound verification calls on incoming enquiries immediately",
        "Deliver Daily Excel pipeline log & Hot buyer escalations"
      ],
      pricingModel: "fixed",
      setupFee: 29998,
      recurringFee: 24e3,
      oneTimePrice: 29998,
      monthlyPrice: 24e3,
      billingCycle: "monthly",
      addons: [{ name: "CRM pipeline reporting management", price: 1e4 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "5 business days setup",
      revisionLimit: "Continuous qualification playbook updates",
      additionalDeliverableCharge: 6e3,
      subscriptionDuration: "Monthly service",
      renewalTerms: "Auto-renews monthly",
      cancellationPolicy: "15 business days notice",
      menuOrder: 33,
      showInMenu: true
    },
    {
      id: "srv-crm-pipeline",
      slug: "crm-lead-pipeline-management",
      name: "CRM & Lead Pipeline Management",
      category: "Lead Management and CRM",
      description: "Disciplined enquiry tracking, duplicate cleanup, stage updates, and daily Excel / pipeline summaries operated internally by AKYIN.",
      benefits: [
        "Eliminates forgotten callbacks and scattered Excel sheets",
        "Operated as a managed agency service\u2014zero SaaS software overhead"
      ],
      deliverables: [
        "Enquiry stage hygiene & duplicate cleanup",
        "Priority callback routing for Hot & scheduled demos",
        "Daily Excel reporting sheets & monthly pipeline audit"
      ],
      workProcess: [
        "Standardize enquiry stages & ownership rules across channels",
        "Clean duplicates and update buyer progression statuses daily",
        "Deliver executive stage breakdown at end of month"
      ],
      pricingModel: "fixed",
      setupFee: 0,
      recurringFee: 1e4,
      oneTimePrice: 0,
      monthlyPrice: 1e4,
      billingCycle: "monthly",
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "3\u20135 business days setup",
      revisionLimit: "Weekly pipeline schema adjustment",
      additionalDeliverableCharge: 2e3,
      subscriptionDuration: "Monthly managed service",
      renewalTerms: "Auto-renews monthly",
      cancellationPolicy: "7 days notice",
      menuOrder: 34,
      showInMenu: true
    },
    {
      id: "srv-ai-outbound-workflows",
      slug: "ai-outbound-calling-workflows",
      name: "AI-Assisted Outbound Calling & Inquiry Follow-Up Workflows",
      category: "Lead Management and CRM",
      description: "Agency-operated AI-assisted outbound enquiry calling scripts and multi-attempt callback workflows designed to keep response times under minutes.",
      benefits: [
        "Structured script logic tailored to your buyer objections and language mix",
        "Zero client-side software setup\u2014managed directly by AKYIN operations"
      ],
      deliverables: [
        "Custom outbound calling script & qualification decision tree",
        "Multi-attempt inquiry follow-up cadence",
        "Call outcome disposition log & priority escalation rules"
      ],
      workProcess: [
        "Map common prospect FAQs, eligibility checks & language preferences",
        "Configure and test calling workflow scripts internally",
        "Deploy live follow-up cadence with structured outcome reporting"
      ],
      pricingModel: "custom",
      setupFee: 0,
      recurringFee: 0,
      oneTimePrice: 0,
      monthlyPrice: 0,
      billingCycle: "monthly",
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "5\u20137 business days configuration",
      revisionLimit: "Iterative script calibration",
      additionalDeliverableCharge: 0,
      subscriptionDuration: "Scoped by call volume",
      renewalTerms: "Monthly",
      cancellationPolicy: "7 days notice",
      menuOrder: 35,
      showInMenu: true
    },
    // =========================================================================
    // 10. BUSINESS CONSULTING AND TRAINING
    // =========================================================================
    {
      id: "srv-consulting",
      slug: "business-advisory-session",
      name: "1-on-1 Business Advisory Session (30 min IST)",
      category: "Business Consulting and Training",
      description: "Private commercial strategy, feasibility, and unit-economics diagnostic session directly with AKYIN Ventures on India Standard Time.",
      benefits: [
        "Direct 1-on-1 founder clarity without multi-month retainer commitments",
        "Pinpoints acquisition bottlenecks, pricing margin leaks & next steps in 30 minutes"
      ],
      deliverables: [
        "30-minute private IST video consultation",
        "Unit economics & funnel bottleneck audit",
        "Actionable next-step priorities summary"
      ],
      workProcess: [
        "Select your preferred 30-min IST slot and submit business context",
        "Join focused live diagnostic review directly with AKYIN",
        "Leave with clear commercial action priorities"
      ],
      pricingModel: "fixed",
      setupFee: 3998,
      recurringFee: 0,
      oneTimePrice: 3998,
      monthlyPrice: 0,
      billingCycle: "one-time",
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "Scheduled 6:00 PM \u2013 7:00 PM IST slot",
      revisionLimit: "Single dedicated session",
      additionalDeliverableCharge: 3998,
      subscriptionDuration: "One-time 30-min advisory session",
      renewalTerms: "N/A (One-time)",
      cancellationPolicy: "Reschedule permitted up to 4 hours prior",
      menuOrder: 36,
      showInMenu: true
    },
    {
      id: "srv-sales-strategy",
      slug: "commercial-dealership-sales-training",
      name: "Commercial & Dealership Sales Training Workshop",
      category: "Business Consulting and Training",
      description: "Practical frontline sales and showroom coaching backed by 16 years of high-trust commercial experience from Maruti Suzuki to Audi.",
      benefits: [
        "Equips sales executives with structured product walkthroughs & calm objection handling",
        "Builds consistent follow-up discipline that increases enquiry-to-closing conversion"
      ],
      deliverables: [
        "Customer greeting & structured discovery walkaround framework",
        "Objection handling & value-based negotiation drills",
        "Follow-up cadence & deal closing workbook"
      ],
      workProcess: [
        "Review current team call/floor handling gaps & target conversion goals",
        "Deliver intensive interactive team workshop (on-site or virtual)",
        "Follow up with customized closing script summary"
      ],
      pricingModel: "fixed",
      setupFee: 5e4,
      recurringFee: 0,
      oneTimePrice: 5e4,
      monthlyPrice: 0,
      billingCycle: "one-time",
      addons: [{ name: "Post-workshop follow-up audit session", price: 15e3 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "Scheduled intensive session",
      revisionLimit: "Includes customized sales playbook workbook",
      additionalDeliverableCharge: 15e3,
      subscriptionDuration: "Single comprehensive workshop session",
      renewalTerms: "N/A (One-time)",
      cancellationPolicy: "Reschedule permitted with 5 days advance notice",
      menuOrder: 37,
      showInMenu: true
    },
    {
      id: "srv-personality-development",
      slug: "personality-development-workshop",
      name: "Personality Development & Executive Etiquette Workshop",
      category: "Business Consulting and Training",
      description: "Dedicated grooming, verbal clarity, consultative body language, and executive presence training tailored for customer-facing sales and advisory teams.",
      benefits: [
        "Elevates first-impression trust during high-ticket showroom and B2B meetings",
        "Coaches active listening, voice tone & composed client posture"
      ],
      deliverables: [
        "Executive grooming & showroom hospitality standards",
        "Verbal clarity, listening & confidence roleplay sessions",
        "Consistent client representation checklist"
      ],
      workProcess: [
        "Align workshop agenda to team seniority and customer tier",
        "Conduct hands-on communication & posture coaching drills",
        "Provide practical daily etiquette scorecard for managers"
      ],
      pricingModel: "fixed",
      setupFee: 5e4,
      recurringFee: 0,
      oneTimePrice: 5e4,
      monthlyPrice: 0,
      billingCycle: "one-time",
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "Scheduled per mutually agreed calendar date",
      revisionLimit: "Pre-session agenda alignment included",
      additionalDeliverableCharge: 15e3,
      subscriptionDuration: "Single workshop session",
      renewalTerms: "N/A (One-time)",
      cancellationPolicy: "Reschedule permitted with 5 days advance notice",
      menuOrder: 38,
      showInMenu: true
    },
    {
      id: "srv-custom-solutions",
      slug: "custom-international-business-solutions",
      name: "Custom International Business Solutions (India / UAE)",
      category: "Business Consulting and Training",
      description: "Bespoke multi-market operations, commercial feasibility, cross-border India\u2013UAE go-to-market planning, and custom advisory retainers.",
      benefits: [
        "Designed for organizations operating or expanding across India and the UAE",
        "Transparent custom scoping\u2014pay strictly for agreed project milestones"
      ],
      deliverables: [
        "Tailored technical & commercial scoping dossier",
        "Custom milestone schedule & deliverable SLAs",
        "Dedicated cross-border advisory coordination"
      ],
      workProcess: [
        "Conduct discovery call covering India/UAE market goals & constraints",
        "Prepare milestone-based commercial proposal & deliverables",
        "Execute agreed sprints with regular leadership check-ins"
      ],
      pricingModel: "custom",
      setupFee: 0,
      recurringFee: 0,
      oneTimePrice: 0,
      monthlyPrice: 0,
      billingCycle: "custom",
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "Custom milestone timeline",
      revisionLimit: "Milestone-based review cycles",
      additionalDeliverableCharge: 0,
      subscriptionDuration: "Project or bespoke retainer",
      renewalTerms: "Per signed service agreement",
      cancellationPolicy: "Per signed contract terms",
      menuOrder: 39,
      showInMenu: true
    }
  ];
  return list.map((item, idx) => ({
    ...item,
    active: true,
    sortOrder: idx + 1,
    menuOrder: item.menuOrder ?? idx + 1,
    showInMenu: item.showInMenu ?? true,
    updatedAt: nowIso
  }));
}
function importLegacyLeads(nowIso) {
  const legacyFile = getLegacyLeadsPath();
  if (!fs.existsSync(legacyFile)) return [];
  try {
    const raw = fs.readFileSync(legacyFile, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const results = [];
    for (const entry of parsed) {
      if (!entry || typeof entry !== "object") continue;
      const rec = entry;
      const leadId = typeof rec.leadId === "string" && rec.leadId ? rec.leadId : `AKY-LEAD-${crypto3.randomBytes(4).toString("hex").toUpperCase()}`;
      const receivedAt = typeof rec.receivedAt === "string" && rec.receivedAt ? rec.receivedAt : nowIso;
      results.push({
        leadId,
        receivedAt,
        updatedAt: receivedAt,
        fullName: String(rec.fullName || "Imported Lead"),
        mobileNumber: String(rec.mobileNumber || ""),
        email: String(rec.email || ""),
        companyName: String(rec.businessName || rec.companyName || ""),
        website: String(rec.website || ""),
        city: String(rec.city || ""),
        country: String(rec.country || ""),
        businessCategory: String(rec.businessCategory || ""),
        requiredService: String(rec.requiredService || ""),
        estimatedBudget: String(rec.monthlyMarketingBudget || rec.estimatedBudget || ""),
        preferredContactMethod: String(rec.preferredContactMethod || "Phone / WhatsApp"),
        description: String(rec.message || rec.description || ""),
        consentAccepted: Boolean(rec.consentAccepted ?? true),
        stage: "NEW",
        secondaryTag: "",
        assignedToUserId: "",
        assignedToName: "",
        followUpAt: "",
        campaignSource: "Website",
        expectedDealValue: 0,
        currency: "INR",
        lostReason: "",
        privateNotes: "",
        convertedClientId: "",
        duplicateWarning: "",
        sourcePage: String(rec.source || "Legacy Import"),
        activities: [
          {
            id: `act_${crypto3.randomBytes(4).toString("hex")}`,
            timestamp: receivedAt,
            actor: "System Migration",
            type: "system",
            summary: "Imported existing enquiry from .akyin-data/leads.json without data loss."
          }
        ]
      });
    }
    return results;
  } catch {
    return [];
  }
}
function buildEmptyDatabase() {
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  const initialUsers = [];
  const envAdminPw = (process.env.ADMIN_PASSWORD || "").trim();
  if (envAdminPw.length >= 8) {
    initialUsers.push({
      id: "usr-super-admin",
      name: "Shaikh Nazir",
      email: process.env.OWNER_NOTIFICATION_EMAIL || "connect@akyin.com",
      role: "Super Admin",
      active: true,
      passwordHash: hashPassword(envAdminPw),
      createdAt: nowIso,
      updatedAt: nowIso,
      lastLoginAt: ""
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
      events: { ...DEFAULT_NOTIFICATION_SETTINGS.events }
    },
    notificationLogs: [],
    auditLogs: [
      {
        logId: `LOG-${crypto3.randomBytes(3).toString("hex").toUpperCase()}`,
        timestamp: nowIso,
        actorId: "system",
        actorName: "System",
        actorRole: "System",
        action: "DB_INITIALIZED",
        targetId: "SUITE_DB",
        summary: "Initialized AKYIN Business Management Suite database schema v1."
      }
    ],
    processedWebhookEvents: []
  };
}
function backupDatabaseFile(filePath, reasonTag) {
  if (!fs.existsSync(filePath)) return;
  const backupsDir = path.join(getDataDir(), "backups");
  fs.mkdirSync(backupsDir, { recursive: true });
  const stamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(backupsDir, `suite-db-${reasonTag}-${stamp}.json`);
  fs.copyFileSync(filePath, backupPath);
}
function migrateDatabaseIfNeeded(raw, dbFilePath) {
  const oldVersion = typeof raw.schemaVersion === "number" ? raw.schemaVersion : 0;
  if (oldVersion < CURRENT_SCHEMA_VERSION) {
    backupDatabaseFile(dbFilePath, `pre-v${CURRENT_SCHEMA_VERSION}`);
  }
  const defaults = buildEmptyDatabase();
  const merged = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    users: Array.isArray(raw.users) ? raw.users : defaults.users,
    sessions: Array.isArray(raw.sessions) ? raw.sessions : [],
    leads: Array.isArray(raw.leads) ? raw.leads : defaults.leads,
    clients: Array.isArray(raw.clients) && raw.clients.length > 0 ? raw.clients : defaults.clients,
    serviceCategories: oldVersion >= 4 && Array.isArray(raw.serviceCategories) && raw.serviceCategories.length > 0 ? raw.serviceCategories : defaults.serviceCategories,
    services: Array.isArray(raw.services) && raw.services.length > 0 ? raw.services : defaults.services,
    quotations: Array.isArray(raw.quotations) ? raw.quotations : [],
    invoices: Array.isArray(raw.invoices) ? raw.invoices : [],
    subscriptions: Array.isArray(raw.subscriptions) ? raw.subscriptions : [],
    payments: Array.isArray(raw.payments) ? raw.payments : [],
    appointments: Array.isArray(raw.appointments) ? raw.appointments : [],
    availability: Array.isArray(raw.availability) && raw.availability.length > 0 ? raw.availability : defaults.availability,
    blockedDates: Array.isArray(raw.blockedDates) ? raw.blockedDates : [],
    websiteSettings: {
      ...DEFAULT_WEBSITE_SETTINGS,
      ...raw.websiteSettings || {}
    },
    notificationSettings: {
      ...DEFAULT_NOTIFICATION_SETTINGS,
      ...raw.notificationSettings || {},
      events: {
        ...DEFAULT_NOTIFICATION_SETTINGS.events,
        ...raw.notificationSettings?.events || {}
      }
    },
    notificationLogs: Array.isArray(raw.notificationLogs) ? raw.notificationLogs : [],
    auditLogs: Array.isArray(raw.auditLogs) ? raw.auditLogs : defaults.auditLogs,
    processedWebhookEvents: Array.isArray(raw.processedWebhookEvents) ? raw.processedWebhookEvents : []
  };
  if (oldVersion < 3) {
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    for (const srv of merged.services) {
      if (srv.id === "srv-bulk-sms" || srv.id === "srv-whatsapp-messaging") {
        continue;
      }
      const alreadyDoubled = srv.priceHistory?.some(
        (h) => h.changedBy === "System Migration (v3 pricing revision)"
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
            changedBy: "System Migration (v3 pricing revision)",
            note: "AKYIN commercial price doubling applied"
          });
        }
      }
    }
  }
  const defaultsById = new Map(defaults.services.map((s) => [s.id, s]));
  const legacyCategoryMap = {
    "Digital marketing": "Digital Marketing",
    "Google Ads management": "Digital Marketing",
    "Meta Ads management": "Digital Marketing",
    "Website development": "Digital Marketing",
    SEO: "Digital Marketing",
    "Customer acquisition": "Digital Marketing",
    "Lead generation": "Lead Management and CRM",
    "Social media management": "Social Media Management",
    Branding: "Creative and Graphic Design",
    "Business consulting": "Business Consulting and Training",
    "Sales and marketing strategy": "Business Consulting and Training",
    "Custom business solutions": "Business Consulting and Training",
    "Automotive dealership marketing": "Automotive Marketing",
    "Bulk SMS Marketing": "Messaging and Communication",
    "WhatsApp Business Messaging": "Messaging and Communication"
  };
  if (oldVersion < 4) {
    merged.serviceCategories = defaults.serviceCategories;
    const seenIds = /* @__PURE__ */ new Set();
    const seenSlugs = /* @__PURE__ */ new Set();
    const migratedServices = [];
    for (const srv of merged.services) {
      if (seenIds.has(srv.id)) continue;
      const def = defaultsById.get(srv.id);
      if (def) {
        srv.category = def.category;
        srv.slug = srv.slug || def.slug;
        srv.benefits = srv.benefits && srv.benefits.length > 0 ? srv.benefits : def.benefits;
        srv.workProcess = srv.workProcess && srv.workProcess.length > 0 ? srv.workProcess : def.workProcess;
        srv.menuOrder = srv.menuOrder ?? def.menuOrder ?? srv.sortOrder;
        srv.showInMenu = srv.showInMenu ?? def.showInMenu ?? true;
        if (srv.id === "srv-digital-marketing" && /package\s*[abc]/i.test(srv.name)) {
          srv.name = def.name;
          srv.description = def.description;
        }
        if (srv.id === "srv-lead-gen" && /package\s*[abc]/i.test(srv.name)) {
          srv.name = def.name;
          srv.description = def.description;
        }
      } else {
        if (legacyCategoryMap[srv.category]) {
          srv.category = legacyCategoryMap[srv.category];
        } else if (srv.category === "Business Creative & Documentation Services") {
          srv.category = "Creative and Graphic Design";
        }
        srv.name = srv.name.replace(/^Package\s+[A-Z]\s*[—–-]\s*/i, "").trim();
      }
      let candidateSlug = srv.slug ? slugifyServiceName(srv.slug) : slugifyServiceName(srv.name);
      if (seenSlugs.has(candidateSlug)) {
        candidateSlug = `${candidateSlug}-${srv.id.replace(/^srv-/, "").slice(0, 6)}`;
      }
      srv.slug = candidateSlug;
      seenIds.add(srv.id);
      seenSlugs.add(candidateSlug);
      migratedServices.push(srv);
    }
    merged.services = migratedServices;
  }
  const existingServiceIds = new Set(merged.services.map((s) => s.id));
  const existingSlugs = new Set(
    merged.services.map((s) => s.slug ? slugifyServiceName(s.slug) : slugifyServiceName(s.name))
  );
  const existingNames = new Set(merged.services.map((s) => s.name.trim().toLowerCase()));
  for (const srv of merged.services) {
    if (!srv.slug) {
      srv.slug = slugifyServiceName(srv.name);
    }
    if (srv.menuOrder === void 0) srv.menuOrder = srv.sortOrder;
    if (srv.showInMenu === void 0) srv.showInMenu = true;
  }
  for (const defSrv of defaults.services) {
    if (!existingServiceIds.has(defSrv.id) && !existingSlugs.has(defSrv.slug) && !existingNames.has(defSrv.name.trim().toLowerCase())) {
      merged.services.push({
        ...defSrv,
        sortOrder: merged.services.length + 1
      });
      existingServiceIds.add(defSrv.id);
      existingSlugs.add(defSrv.slug);
      existingNames.add(defSrv.name.trim().toLowerCase());
    }
  }
  const envAdminPw = (process.env.ADMIN_PASSWORD || "").trim();
  if (merged.users.length === 0 && envAdminPw.length >= 8) {
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    merged.users.push({
      id: "usr-super-admin",
      name: "Shaikh Nazir",
      email: process.env.OWNER_NOTIFICATION_EMAIL || "connect@akyin.com",
      role: "Super Admin",
      active: true,
      passwordHash: hashPassword(envAdminPw),
      createdAt: nowIso,
      updatedAt: nowIso,
      lastLoginAt: ""
    });
  }
  return merged;
}
var writeQueue = Promise.resolve();
function readDb() {
  const dataDir = getDataDir();
  const dbPath = getDbFilePath();
  fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dbPath)) {
    const fresh = buildEmptyDatabase();
    writeDbAtomic(fresh);
    return fresh;
  }
  try {
    const rawText = fs.readFileSync(dbPath, "utf8");
    const parsed = JSON.parse(rawText);
    const migrated = migrateDatabaseIfNeeded(parsed, dbPath);
    if ((parsed.schemaVersion || 0) < CURRENT_SCHEMA_VERSION) {
      writeDbAtomic(migrated);
    }
    return migrated;
  } catch (err) {
    console.error("[suite-storage] Failed parsing suite-db.json, backing up and reinitializing:", err);
    backupDatabaseFile(dbPath, "corrupt");
    const fresh = buildEmptyDatabase();
    writeDbAtomic(fresh);
    return fresh;
  }
}
function writeDbAtomic(db) {
  const dataDir = getDataDir();
  const dbPath = getDbFilePath();
  fs.mkdirSync(dataDir, { recursive: true });
  const tempPath = path.join(
    dataDir,
    `suite-db.${process.pid}.${Date.now()}.${crypto3.randomBytes(3).toString("hex")}.tmp`
  );
  fs.writeFileSync(tempPath, JSON.stringify(db, null, 2), "utf8");
  fs.renameSync(tempPath, dbPath);
}
function withDbMutation(mutator) {
  const task = writeQueue.then(async () => {
    const db = readDb();
    const result = await mutator(db);
    writeDbAtomic(db);
    return result;
  });
  writeQueue = task.catch(() => void 0);
  return task;
}
function appendAuditLog(db, entry) {
  db.auditLogs.unshift({
    logId: `LOG-${crypto3.randomBytes(4).toString("hex").toUpperCase()}`,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    ...entry
  });
  if (db.auditLogs.length > 2e3) {
    db.auditLogs = db.auditLogs.slice(0, 2e3);
  }
}

// server/scheduler.ts
var DEFAULT_RENEWAL_REMINDER_LEAD_DAYS = 3;
var RENEWAL_SCHEDULER_INTERVAL_MS = 6 * 60 * 60 * 1e3;
var schedulerInterval = null;
var initialSweepTimeout = null;
var lastRunAt = "";
var nextScheduledRunAt = "";
var lastResult = null;
function parseIsoDateUtcMs(isoDate) {
  const parts = String(isoDate || "").split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) {
    return NaN;
  }
  return Date.UTC(parts[0], parts[1] - 1, parts[2]);
}
function getDaysUntilRenewalIst(nextBillingDate, refDate = /* @__PURE__ */ new Date()) {
  const todayIso = getIstDateParts(refDate).isoDate;
  const todayMs = parseIsoDateUtcMs(todayIso);
  const dueMs = parseIsoDateUtcMs(nextBillingDate);
  if (!Number.isFinite(todayMs) || !Number.isFinite(dueMs)) return null;
  return Math.round((dueMs - todayMs) / 864e5);
}
function computeRenewalTotals(sub) {
  return calculateQuotationTotals(
    [
      {
        id: "reminder-line",
        serviceId: sub.serviceId,
        title: `${sub.serviceName} \u2014 Monthly Subscription Renewal`,
        qty: 1,
        unitPrice: sub.monthlyAmount,
        billingType: "monthly"
      }
    ],
    0,
    sub.gstEnabled,
    sub.gstRate
  );
}
function findUpcomingRenewals(db, leadDays = DEFAULT_RENEWAL_REMINDER_LEAD_DAYS, refDate = /* @__PURE__ */ new Date()) {
  const maxDays = Math.min(30, Math.max(0, Math.floor(leadDays)));
  const candidates = [];
  for (const sub of db.subscriptions || []) {
    if (sub.status !== "ACTIVE") continue;
    if (!sub.customerEmail || !sub.customerEmail.includes("@")) continue;
    const daysUntil = getDaysUntilRenewalIst(sub.nextBillingDate, refDate);
    if (daysUntil === null || daysUntil < 0 || daysUntil > maxDays) continue;
    const totals = computeRenewalTotals(sub);
    candidates.push({
      subscriptionId: sub.id,
      subscriptionCode: sub.subscriptionCode,
      customerName: sub.customerName,
      companyName: sub.companyName,
      customerEmail: sub.customerEmail,
      serviceName: sub.serviceName,
      serviceCategory: sub.serviceCategory,
      nextBillingDate: sub.nextBillingDate,
      daysUntilRenewal: daysUntil,
      currency: sub.currency,
      monthlyAmount: totals.subtotal,
      gstAmount: totals.gstAmount,
      totalAmountWithGst: totals.grandTotal,
      alreadyRemindedForCycle: sub.lastReminderForBillingDate === sub.nextBillingDate,
      lastReminderSentAt: sub.lastReminderSentAt || ""
    });
  }
  return candidates.sort((a, b) => a.daysUntilRenewal - b.daysUntilRenewal);
}
async function runSubscriptionRenewalReminderSweepOnDb(db, options = {}) {
  const leadDays = Math.min(30, Math.max(0, Math.floor(options.leadDays ?? DEFAULT_RENEWAL_REMINDER_LEAD_DAYS)));
  const source = options.source || "cron";
  const refDate = options.refDate || /* @__PURE__ */ new Date();
  const nowIso = refDate.toISOString();
  const activeSubs = (db.subscriptions || []).filter((s) => s.status === "ACTIVE");
  const candidates = findUpcomingRenewals(db, leadDays, refDate);
  let sentCount = 0;
  let loggedUnconfiguredCount = 0;
  let skippedAlreadyRemindedCount = 0;
  let skippedDisabledCount = 0;
  let failedCount = 0;
  const results = [];
  for (const candidate of candidates) {
    const sub = (db.subscriptions || []).find((s) => s.id === candidate.subscriptionId);
    if (!sub) continue;
    if (!options.forceResend && sub.lastReminderForBillingDate === sub.nextBillingDate) {
      skippedAlreadyRemindedCount += 1;
      continue;
    }
    const dueLabel = candidate.daysUntilRenewal === 0 ? "today" : candidate.daysUntilRenewal === 1 ? "tomorrow (1 day)" : `in ${candidate.daysUntilRenewal} days`;
    const taxSummary = sub.gstEnabled ? `${sub.currency} ${candidate.monthlyAmount.toLocaleString("en-IN")} + ${sub.gstRate}% GST (${sub.currency} ${candidate.gstAmount.toLocaleString("en-IN")}) = ${sub.currency} ${candidate.totalAmountWithGst.toLocaleString("en-IN")}` : `${sub.currency} ${candidate.totalAmountWithGst.toLocaleString("en-IN")} (No GST)`;
    const logEntry = await dispatchNotification(db, {
      event: "subscription_renewal_reminder",
      recipient: sub.customerEmail,
      subject: `Subscription Renewal Reminder: ${sub.serviceName} (${sub.subscriptionCode})`,
      body: [
        `Hello ${sub.customerName},`,
        "",
        `This is an automated Subscription Renewal Reminder for your active monthly service with AKYIN Ventures.`,
        "",
        `Subscription Reference: ${sub.subscriptionCode}`,
        `Service Name: ${sub.serviceName}`,
        `Category: ${sub.serviceCategory}`,
        `Upcoming Renewal Date: ${sub.nextBillingDate} (${dueLabel})`,
        `Renewal Amount: ${taxSummary}`,
        "",
        "If you wish to adjust your deliverables, pause billing, or settle this cycle early, please reply to this email or contact connect@akyin.com.",
        "",
        "Warm regards,",
        "AKYIN Ventures Billing Desk"
      ].join("\n")
    });
    if (logEntry.deliveryStatus === "sent") {
      sentCount += 1;
      sub.lastReminderSentAt = nowIso;
      sub.lastReminderForBillingDate = sub.nextBillingDate;
      sub.updatedAt = nowIso;
    } else if (logEntry.deliveryStatus === "logged_unconfigured") {
      loggedUnconfiguredCount += 1;
      sub.lastReminderSentAt = nowIso;
      sub.lastReminderForBillingDate = sub.nextBillingDate;
      sub.updatedAt = nowIso;
    } else if (logEntry.deliveryStatus === "skipped_disabled") {
      skippedDisabledCount += 1;
    } else {
      failedCount += 1;
    }
    results.push({
      subscriptionCode: sub.subscriptionCode,
      customerEmail: sub.customerEmail,
      serviceName: sub.serviceName,
      nextBillingDate: sub.nextBillingDate,
      deliveryStatus: logEntry.deliveryStatus,
      errorMessage: logEntry.errorMessage
    });
  }
  if (results.length > 0 || source === "manual") {
    appendAuditLog(db, {
      actorId: source === "cron" ? "SYSTEM_CRON" : "ADMIN_MANUAL",
      actorName: options.actorName || (source === "cron" ? "Subscription Reminder Cron" : "Admin"),
      actorRole: source === "cron" ? "System" : "Super Admin",
      action: "SUBSCRIPTION_REMINDER_SWEEP",
      targetId: "SUBSCRIPTIONS",
      summary: `${source === "cron" ? "Scheduled" : "Manual"} renewal reminder check (${leadDays}d window): ${candidates.length} due, ${sentCount} sent via SMTP, ${loggedUnconfiguredCount} queued (SMTP unconfigured), ${skippedAlreadyRemindedCount} already reminded.`
    });
  }
  return {
    runAt: nowIso,
    source,
    leadDays,
    checkedActiveCount: activeSubs.length,
    dueCount: candidates.length,
    sentCount,
    loggedUnconfiguredCount,
    skippedAlreadyRemindedCount,
    skippedDisabledCount,
    failedCount,
    smtpConfigured: Boolean(getSmtpConfig()),
    results
  };
}
async function runSubscriptionRenewalReminderSweep(options = {}) {
  const result = await withDbMutation(
    (db) => runSubscriptionRenewalReminderSweepOnDb(db, options)
  );
  lastRunAt = result.runAt;
  lastResult = result;
  return result;
}
function getSchedulerStatus() {
  return {
    active: Boolean(schedulerInterval),
    intervalHours: RENEWAL_SCHEDULER_INTERVAL_MS / 36e5,
    defaultLeadDays: DEFAULT_RENEWAL_REMINDER_LEAD_DAYS,
    lastRunAt,
    nextScheduledRunAt,
    lastResult
  };
}
function startSubscriptionReminderScheduler() {
  if (schedulerInterval) return;
  const updateNextRunTimestamp = () => {
    nextScheduledRunAt = new Date(Date.now() + RENEWAL_SCHEDULER_INTERVAL_MS).toISOString();
  };
  updateNextRunTimestamp();
  initialSweepTimeout = setTimeout(() => {
    void runSubscriptionRenewalReminderSweep({ source: "cron" }).catch((err) => {
      console.error("[renewal-scheduler] Initial sweep error:", err);
    });
  }, 12e3);
  initialSweepTimeout.unref();
  schedulerInterval = setInterval(() => {
    updateNextRunTimestamp();
    void runSubscriptionRenewalReminderSweep({ source: "cron" }).catch((err) => {
      console.error("[renewal-scheduler] Periodic sweep error:", err);
    });
  }, RENEWAL_SCHEDULER_INTERVAL_MS);
  schedulerInterval.unref();
}

// server/routes.ts
function stripControls(value) {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
}
function sanitizeCsvCell(raw) {
  const str = String(raw ?? "");
  const trimmedLeading = str.replace(/[\r\n]+/g, " ");
  const neutralized = /^[=+\-@\t]/.test(trimmedLeading) ? `'${trimmedLeading}` : trimmedLeading;
  return `"${neutralized.replace(/"/g, '""')}"`;
}
function getRazorpayCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!keyId || !keySecret || keyId === "MY_RAZORPAY_KEY_ID" || keySecret === "MY_RAZORPAY_KEY_SECRET") {
    return null;
  }
  const explicitMode = (process.env.RAZORPAY_MODE || "").trim().toLowerCase();
  const mode = explicitMode === "live" && keyId.startsWith("rzp_live_") ? "live" : "test";
  const webhookSecret = (process.env.RAZORPAY_WEBHOOK_SECRET || "").trim();
  return { keyId, keySecret, mode, webhookSecret };
}
function verifyRazorpayCheckoutSignature(orderId, paymentId, signature, keySecret) {
  if (!/^[a-f0-9]{64}$/i.test(signature)) return false;
  const expectedHex = crypto4.createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex");
  const expectedBuf = Buffer.from(expectedHex, "hex");
  const actualBuf = Buffer.from(signature.toLowerCase(), "hex");
  return expectedBuf.length === actualBuf.length && crypto4.timingSafeEqual(expectedBuf, actualBuf);
}
function verifyRazorpayWebhookSignature(rawBody, signatureHeader, webhookSecret) {
  if (!webhookSecret || !signatureHeader || !/^[a-f0-9]{64}$/i.test(signatureHeader)) {
    return false;
  }
  const expectedHex = crypto4.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");
  const expectedBuf = Buffer.from(expectedHex, "hex");
  const actualBuf = Buffer.from(signatureHeader.toLowerCase(), "hex");
  return expectedBuf.length === actualBuf.length && crypto4.timingSafeEqual(expectedBuf, actualBuf);
}
function getDayNameIst(dateStr) {
  const dt = /* @__PURE__ */ new Date(`${dateStr}T12:00:00+05:30`);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "long"
  }).format(dt);
}
function parseHm(hm) {
  const [h, m] = hm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}
function formatHm(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
function formatSlotRangeIst(start, end) {
  const to12 = (hm) => {
    const [hh, mm] = hm.split(":").map(Number);
    const suffix = hh >= 12 ? "PM" : "AM";
    const h12 = hh % 12 === 0 ? 12 : hh % 12;
    return `${h12}:${String(mm).padStart(2, "0")} ${suffix}`;
  };
  return `${to12(start)} \u2013 ${to12(end)} IST`;
}
function getCurrentMinutesIst() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(/* @__PURE__ */ new Date());
  const h = Number(parts.find((p) => p.type === "hour")?.value || 0);
  const m = Number(parts.find((p) => p.type === "minute")?.value || 0);
  return h * 60 + m;
}
function computeDateAvailability(db, dateStr) {
  const todayIst = getIstDateParts().isoDate;
  const fee = db.websiteSettings?.consultationFee || "\u20B91,999 (30-min IST Session)";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return {
      date: dateStr,
      blocked: true,
      reason: "Please choose a valid date (YYYY-MM-DD).",
      slots: [],
      consultationFee: fee
    };
  }
  if (dateStr < todayIst) {
    return {
      date: dateStr,
      blocked: true,
      reason: "Past dates cannot be booked.",
      slots: [],
      consultationFee: fee
    };
  }
  const blocked = (db.blockedDates || []).find((b) => b.date === dateStr);
  if (blocked) {
    return {
      date: dateStr,
      blocked: true,
      reason: blocked.reason || "This date is currently blocked.",
      slots: [],
      consultationFee: fee
    };
  }
  const dayName = getDayNameIst(dateStr);
  const rule = (db.availability || []).find((r) => r.day === dayName);
  if (!rule || !rule.enabled) {
    return {
      date: dateStr,
      blocked: true,
      reason: `Advisory consultations are not scheduled on ${dayName}.`,
      slots: [],
      consultationFee: fee
    };
  }
  const startMin = parseHm(rule.startTime);
  const endMin = parseHm(rule.endTime);
  const duration = Math.max(15, rule.slotDuration || 30);
  const intervals = [];
  for (let cur = startMin; cur + duration <= endMin; cur += duration) {
    intervals.push({ startTime: formatHm(cur), endTime: formatHm(cur + duration) });
  }
  const dayAppointments = (db.appointments || []).filter(
    (a) => a.appointmentDate === dateStr && a.bookingStatus !== "Cancelled"
  );
  if (dayAppointments.length >= Math.max(1, rule.maximumBookings)) {
    return {
      date: dateStr,
      blocked: false,
      reason: "Daily consultation capacity reached for this date.",
      slots: intervals.map((s) => ({
        startTime: s.startTime,
        endTime: s.endTime,
        label: formatSlotRangeIst(s.startTime, s.endTime),
        available: false,
        reason: "Booked"
      })),
      consultationFee: fee
    };
  }
  const nowMinIst = getCurrentMinutesIst();
  return {
    date: dateStr,
    blocked: false,
    reason: "",
    slots: intervals.map((s) => {
      const slotStartMin = parseHm(s.startTime);
      if (dateStr === todayIst && slotStartMin <= nowMinIst + 15) {
        return {
          startTime: s.startTime,
          endTime: s.endTime,
          label: formatSlotRangeIst(s.startTime, s.endTime),
          available: false,
          reason: "Elapsed"
        };
      }
      const taken = dayAppointments.some((a) => a.startTime === s.startTime);
      return {
        startTime: s.startTime,
        endTime: s.endTime,
        label: formatSlotRangeIst(s.startTime, s.endTime),
        available: !taken,
        reason: taken ? "Reserved" : "Available"
      };
    }),
    consultationFee: fee
  };
}
function recalculateInvoiceStatus(inv) {
  const netPaid = round2(Math.max(0, inv.paidAmount));
  if (inv.refundedAmount >= inv.totalAmount && inv.totalAmount > 0) {
    inv.status = "REFUNDED";
  } else if (netPaid >= inv.totalAmount && inv.totalAmount > 0) {
    inv.status = "PAID";
  } else if (netPaid > 0) {
    inv.status = "PARTIAL";
  } else {
    inv.status = "UNPAID";
  }
  inv.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
}
async function handleRazorpayWebhook(req, res) {
  const creds = getRazorpayCredentials();
  const webhookSecret = creds?.webhookSecret || (process.env.RAZORPAY_WEBHOOK_SECRET || "").trim();
  if (!webhookSecret) {
    res.status(503).json({ error: "Webhook secret not configured.", code: "WEBHOOK_UNCONFIGURED" });
    return;
  }
  const signature = String(req.headers["x-razorpay-signature"] || "").trim();
  const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body || {}));
  if (!verifyRazorpayWebhookSignature(rawBody, signature, webhookSecret)) {
    res.status(400).json({ error: "Invalid webhook signature.", code: "INVALID_WEBHOOK_SIGNATURE" });
    return;
  }
  let payload;
  try {
    payload = JSON.parse(rawBody.toString("utf8"));
  } catch {
    res.status(400).json({ error: "Invalid JSON webhook body." });
    return;
  }
  const eventName = String(payload.event || "");
  const eventIdHeader = String(req.headers["x-razorpay-event-id"] || "").trim();
  const paymentEntity = payload.payload?.payment?.entity;
  const refundEntity = payload.payload?.refund?.entity;
  const orderId = String(paymentEntity?.order_id || "");
  const paymentId = String(paymentEntity?.id || refundEntity?.payment_id || "");
  const dedupeKey = eventIdHeader || `${eventName}:${paymentId || orderId}:${rawBody.length}`;
  const outcome = await withDbMutation(async (db) => {
    if (db.processedWebhookEvents.includes(dedupeKey)) {
      return { duplicate: true };
    }
    db.processedWebhookEvents.unshift(dedupeKey);
    db.processedWebhookEvents = db.processedWebhookEvents.slice(0, 1e3);
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    const targetPayment = db.payments.find(
      (p) => paymentId && p.razorpayPaymentId === paymentId || orderId && p.razorpayOrderId === orderId
    );
    if (eventName === "payment.captured" || eventName === "order.paid") {
      const amountInMajor = paymentEntity?.amount ? round2(Number(paymentEntity.amount) / 100) : 0;
      const feeInMajor = paymentEntity?.fee ? round2(Number(paymentEntity.fee) / 100) : 0;
      if (targetPayment) {
        if (!targetPayment.webhookEventIds.includes(dedupeKey)) {
          targetPayment.webhookEventIds.push(dedupeKey);
        }
        const alreadyCounted = targetPayment.status === "captured" && targetPayment.verified;
        targetPayment.razorpayPaymentId = paymentId || targetPayment.razorpayPaymentId;
        targetPayment.method = String(paymentEntity?.method || targetPayment.method || "razorpay");
        targetPayment.gatewayFeeAmount = feeInMajor || targetPayment.gatewayFeeAmount;
        targetPayment.status = "captured";
        targetPayment.verified = true;
        targetPayment.capturedAt = targetPayment.capturedAt || nowIso;
        targetPayment.updatedAt = nowIso;
        if (!alreadyCounted && targetPayment.invoiceId) {
          const inv = db.invoices.find((i) => i.id === targetPayment.invoiceId);
          if (inv) {
            inv.paidAmount = round2(inv.paidAmount + (amountInMajor || targetPayment.amount));
            recalculateInvoiceStatus(inv);
          }
        }
      }
      appendAuditLog(db, {
        actorId: "razorpay_webhook",
        actorName: "Razorpay Webhook",
        actorRole: "Webhook",
        action: "WEBHOOK_PAYMENT_CAPTURED",
        targetId: paymentId || orderId || dedupeKey,
        summary: `Webhook ${eventName} verified and settled (${amountInMajor || "matched"} ${paymentEntity?.currency || "INR"}).`
      });
      await dispatchNotification(db, {
        event: "payment_received",
        subject: `Razorpay payment captured: ${paymentId || orderId}`,
        body: `Event: ${eventName}
Order: ${orderId}
Payment: ${paymentId}
Amount: ${amountInMajor}
Mode: ${creds?.mode || "test"}`
      });
    } else if (eventName === "payment.failed") {
      if (targetPayment && targetPayment.status !== "captured") {
        targetPayment.status = "failed";
        targetPayment.verified = false;
        targetPayment.updatedAt = nowIso;
      }
      appendAuditLog(db, {
        actorId: "razorpay_webhook",
        actorName: "Razorpay Webhook",
        actorRole: "Webhook",
        action: "WEBHOOK_PAYMENT_FAILED",
        targetId: paymentId || orderId || dedupeKey,
        summary: `Webhook reported payment.failed for ${orderId || paymentId}.`
      });
      await dispatchNotification(db, {
        event: "payment_failed",
        subject: `Payment failed alert: ${orderId || paymentId}`,
        body: `Razorpay reported payment.failed for order ${orderId}, payment ${paymentId}.`
      });
    } else if (eventName === "refund.processed" && targetPayment) {
      const refundAmt = refundEntity?.amount ? round2(Number(refundEntity.amount) / 100) : 0;
      if (refundAmt > 0) {
        targetPayment.refundedAmount = round2(
          Math.min(targetPayment.amount, targetPayment.refundedAmount + refundAmt)
        );
        if (targetPayment.refundedAmount >= targetPayment.amount) {
          targetPayment.status = "refunded";
        }
        targetPayment.updatedAt = nowIso;
        if (targetPayment.invoiceId) {
          const inv = db.invoices.find((i) => i.id === targetPayment.invoiceId);
          if (inv) {
            inv.refundedAmount = round2(inv.refundedAmount + refundAmt);
            inv.paidAmount = round2(Math.max(0, inv.paidAmount - refundAmt));
            recalculateInvoiceStatus(inv);
          }
        }
        appendAuditLog(db, {
          actorId: "razorpay_webhook",
          actorName: "Razorpay Webhook",
          actorRole: "Webhook",
          action: "WEBHOOK_REFUND_PROCESSED",
          targetId: paymentId,
          summary: `Refund of ${refundAmt} processed via Razorpay webhook.`
        });
      }
    }
    return { duplicate: false };
  });
  res.json({ ok: true, duplicate: outcome.duplicate });
}
function createSimpleRateLimiter(windowMs, max, code, message) {
  const buckets = /* @__PURE__ */ new Map();
  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const cur = buckets.get(key);
    if (!cur || cur.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }
    if (cur.count >= max) {
      res.status(429).json({ error: message, code });
      return;
    }
    cur.count += 1;
    next();
  };
}
function registerSuiteRoutes(app) {
  const requireAuth = makeAuthMiddleware(() => readDb());
  const authRateLimiter = createSimpleRateLimiter(
    6e4,
    12,
    "AUTH_RATE_LIMITED",
    "Too many authentication attempts. Wait 60 seconds and try again."
  );
  const publicLeadLimiter = createSimpleRateLimiter(
    6e4,
    12,
    "LEAD_RATE_LIMITED",
    "Too many enquiry submissions. Wait 60 seconds and retry."
  );
  const bookingLimiter = createSimpleRateLimiter(
    6e4,
    10,
    "BOOKING_RATE_LIMITED",
    "Too many booking requests. Please wait a minute and retry."
  );
  app.get("/api/auth/status", (_req, res) => {
    const db = readDb();
    res.json({
      configured: db.users.length > 0,
      hasSuperAdmin: db.users.some((u) => u.role === "Super Admin" && u.active),
      publicRegistrationAllowed: false
    });
  });
  app.post("/api/auth/setup", authRateLimiter, async (req, res) => {
    const schema = z2.object({
      name: z2.string().trim().min(2).max(100),
      email: z2.string().trim().email().max(160),
      password: z2.string().min(8).max(128)
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid setup data." });
      return;
    }
    try {
      const result = await withDbMutation((db) => {
        if (db.users.length > 0) {
          const err = new Error("Initial Super Admin is already configured.");
          err.statusCode = 409;
          throw err;
        }
        const nowIso = (/* @__PURE__ */ new Date()).toISOString();
        const user = {
          id: `usr-${crypto4.randomBytes(4).toString("hex")}`,
          name: stripControls(parsed.data.name),
          email: stripControls(parsed.data.email).toLowerCase(),
          role: "Super Admin",
          active: true,
          passwordHash: hashPassword(parsed.data.password),
          createdAt: nowIso,
          updatedAt: nowIso,
          lastLoginAt: nowIso
        };
        db.users.push(user);
        const { rawToken, session } = createSessionForUser(db, user);
        appendAuditLog(db, {
          actorId: user.id,
          actorName: user.name,
          actorRole: user.role,
          action: "INITIAL_SUPER_ADMIN_SETUP",
          targetId: user.id,
          summary: `Created initial Super Admin account (${user.email}).`
        });
        return {
          token: rawToken,
          expiresAt: session.expiresAt,
          user: toPublicUser(user)
        };
      });
      res.status(201).json(result);
    } catch (err) {
      res.status(err?.statusCode || 500).json({ error: err?.message || "Setup failed." });
    }
  });
  app.post("/api/auth/login", authRateLimiter, async (req, res) => {
    const schema = z2.object({
      email: z2.string().trim().max(160).optional().default(""),
      password: z2.string().min(1).max(128)
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Provide email and password." });
      return;
    }
    try {
      const result = await withDbMutation((db) => {
        if (db.users.length === 0) {
          const err = new Error("No admin user configured yet. Complete initial owner setup.");
          err.statusCode = 400;
          throw err;
        }
        const cleanEmail = parsed.data.email.trim().toLowerCase();
        const user = cleanEmail ? db.users.find((u) => u.email.toLowerCase() === cleanEmail) : db.users.find((u) => u.role === "Super Admin");
        if (!user || !user.active || !verifyPassword(parsed.data.password, user.passwordHash)) {
          appendAuditLog(db, {
            actorId: "unknown",
            actorName: cleanEmail || "Anonymous",
            actorRole: "Public",
            action: "FAILED_LOGIN",
            targetId: cleanEmail || "admin",
            summary: "Rejected invalid admin login attempt."
          });
          const err = new Error("Invalid credentials or inactive account.");
          err.statusCode = 401;
          throw err;
        }
        const { rawToken, session } = createSessionForUser(db, user);
        appendAuditLog(db, {
          actorId: user.id,
          actorName: user.name,
          actorRole: user.role,
          action: "ADMIN_LOGIN",
          targetId: user.id,
          summary: `Signed in as ${user.role}.`
        });
        return {
          token: rawToken,
          expiresAt: session.expiresAt,
          user: toPublicUser(user)
        };
      });
      res.json(result);
    } catch (err) {
      res.status(err?.statusCode || 401).json({ error: err?.message || "Authentication failed." });
    }
  });
  app.get("/api/auth/me", requireAuth, (req, res) => {
    res.json({ user: req.suiteUser });
  });
  app.post("/api/auth/logout", requireAuth, async (req, res) => {
    await withDbMutation((db) => {
      db.sessions = db.sessions.filter((s) => s.tokenHash !== req.suiteTokenHash);
      if (req.suiteUser) {
        appendAuditLog(db, {
          actorId: req.suiteUser.id,
          actorName: req.suiteUser.name,
          actorRole: req.suiteUser.role,
          action: "ADMIN_LOGOUT",
          targetId: req.suiteUser.id,
          summary: "Signed out cleanly."
        });
      }
    });
    res.json({ ok: true });
  });
  app.post("/api/auth/change-password", requireAuth, async (req, res) => {
    const schema = z2.object({
      currentPassword: z2.string().min(1),
      newPassword: z2.string().min(8).max(128)
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "New password must be at least 8 characters." });
      return;
    }
    try {
      await withDbMutation((db) => {
        const user = db.users.find((u) => u.id === req.suiteUser?.id);
        if (!user || !verifyPassword(parsed.data.currentPassword, user.passwordHash)) {
          const err = new Error("Current password does not match.");
          err.statusCode = 400;
          throw err;
        }
        user.passwordHash = hashPassword(parsed.data.newPassword);
        user.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
        appendAuditLog(db, {
          actorId: user.id,
          actorName: user.name,
          actorRole: user.role,
          action: "PASSWORD_ROTATED",
          targetId: user.id,
          summary: "Updated account password."
        });
      });
      res.json({ ok: true });
    } catch (err) {
      res.status(err?.statusCode || 400).json({ error: err?.message || "Unable to update password." });
    }
  });
  app.get("/api/public/ticker", (_req, res) => {
    const db = readDb();
    const visibleClients = (db.clients || []).filter((c) => c.showInTicker).map((c) => ({
      id: c.id,
      name: c.name,
      category: c.category,
      websiteUrl: c.websiteUrl || "",
      internalShowcaseRoute: c.internalShowcaseRoute || "",
      wordmarkStyle: c.wordmarkStyle || "sans",
      verified: c.verified,
      summary: c.summary,
      supportScope: c.supportScope
    }));
    res.json({
      reportedClientsHandled: db.websiteSettings?.reportedClientsCount || 58,
      verifiedCount: db.clients.filter((c) => c.verified).length,
      clients: visibleClients
    });
  });
  const handlePublicServices = (_req, res) => {
    const db = readDb();
    const categoryRecords = (db.serviceCategories || []).filter((c) => c.active).slice().sort((a, b) => (a.menuOrder ?? a.sortOrder) - (b.menuOrder ?? b.sortOrder));
    const categories = categoryRecords.length > 0 ? categoryRecords.map((c) => c.name) : [...SERVICE_CATEGORIES];
    const services = (db.services || []).filter((s) => s.active).slice().sort((a, b) => (a.menuOrder ?? a.sortOrder) - (b.menuOrder ?? b.sortOrder));
    res.json({
      categories,
      categoryRecords,
      services
    });
  };
  app.get("/api/public/services", handlePublicServices);
  app.get("/api/public/catalog", handlePublicServices);
  app.get("/api/public/services/:slug", (req, res) => {
    const rawSlug = String(req.params.slug || "").trim().toLowerCase();
    const db = readDb();
    const activeServices = (db.services || []).filter((s) => s.active);
    const service = activeServices.find(
      (s) => s.slug.toLowerCase() === rawSlug || s.id.toLowerCase() === rawSlug
    );
    if (!service) {
      res.status(404).json({ error: "Standalone service not found.", code: "SERVICE_NOT_FOUND" });
      return;
    }
    const categoryRecord = (db.serviceCategories || []).find(
      (c) => c.name.toLowerCase() === service.category.toLowerCase()
    ) || null;
    const relatedServices = activeServices.filter((s) => s.category === service.category && s.id !== service.id).sort((a, b) => (a.menuOrder ?? a.sortOrder) - (b.menuOrder ?? b.sortOrder)).slice(0, 6);
    res.json({
      service,
      categoryRecord,
      relatedServices
    });
  });
  app.get("/api/public/availability", (req, res) => {
    const dateStr = String(req.query.date || "").trim();
    const db = readDb();
    res.json(computeDateAvailability(db, dateStr));
  });
  app.post("/api/public/appointments", bookingLimiter, async (req, res) => {
    const schema = z2.object({
      customerName: z2.string().trim().min(2).max(100),
      phone: z2.string().trim().min(7).max(28),
      email: z2.string().trim().email().max(160),
      city: z2.string().trim().min(2).max(80),
      country: z2.string().trim().min(2).max(80),
      businessName: z2.string().trim().max(120).optional().default(""),
      website: z2.string().trim().max(240).optional().default(""),
      businessStage: z2.string().trim().min(2).max(80),
      consultationTopic: z2.string().trim().min(2).max(140),
      businessChallenge: z2.string().trim().min(8).max(1500),
      appointmentDate: z2.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      startTime: z2.string().regex(/^\d{2}:\d{2}$/),
      endTime: z2.string().regex(/^\d{2}:\d{2}$/)
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid booking details." });
      return;
    }
    try {
      const confirmation = await withDbMutation(async (db) => {
        const avail = computeDateAvailability(db, parsed.data.appointmentDate);
        if (avail.blocked) {
          const err = new Error(avail.reason || "Selected date is unavailable.");
          err.statusCode = 409;
          throw err;
        }
        const slot = avail.slots.find(
          (s) => s.startTime === parsed.data.startTime && s.endTime === parsed.data.endTime
        );
        if (!slot || !slot.available) {
          const err = new Error("Selected consultation slot is no longer available.");
          err.statusCode = 409;
          throw err;
        }
        const nowIso = (/* @__PURE__ */ new Date()).toISOString();
        const bookingId = `AKY-${crypto4.randomBytes(3).toString("hex").toUpperCase()}`;
        const record = {
          bookingId,
          createdAt: nowIso,
          updatedAt: nowIso,
          customerName: stripControls(parsed.data.customerName),
          phone: stripControls(parsed.data.phone),
          email: stripControls(parsed.data.email),
          city: stripControls(parsed.data.city),
          country: stripControls(parsed.data.country),
          businessName: stripControls(parsed.data.businessName),
          website: stripControls(parsed.data.website),
          businessStage: stripControls(parsed.data.businessStage),
          consultationTopic: stripControls(parsed.data.consultationTopic),
          businessChallenge: stripControls(parsed.data.businessChallenge),
          appointmentDate: parsed.data.appointmentDate,
          startTime: parsed.data.startTime,
          endTime: parsed.data.endTime,
          paymentStatus: "Payment Awaited",
          bookingStatus: "Pending",
          adminNotes: "",
          calendarEventId: ""
        };
        db.appointments.unshift(record);
        appendAuditLog(db, {
          actorId: "public_booking",
          actorName: record.customerName,
          actorRole: "Public",
          action: "APPOINTMENT_BOOKED",
          targetId: bookingId,
          summary: `Booked ${record.appointmentDate} ${slot.label}.`
        });
        await dispatchNotification(db, {
          event: "appointment_booked",
          subject: `New Consultation Request ${bookingId} \u2014 ${record.appointmentDate}`,
          body: `Customer: ${record.customerName}
Email: ${record.email}
Phone: ${record.phone}
Slot: ${record.appointmentDate} ${slot.label}
Topic: ${record.consultationTopic}`
        });
        return {
          bookingId,
          bookingStatus: record.bookingStatus,
          paymentStatus: record.paymentStatus,
          slotLabel: slot.label,
          appointmentDate: record.appointmentDate,
          startTime: record.startTime,
          endTime: record.endTime,
          calendarEventCreated: false,
          confirmationNotice: "Your appointment slot is reserved provisionally. Our team will confirm after consultation fee verification."
        };
      });
      res.status(201).json(confirmation);
    } catch (err) {
      res.status(err?.statusCode || 400).json({ error: err?.message || "Booking failed." });
    }
  });
  app.post("/api/leads", publicLeadLimiter, async (req, res) => {
    const schema = z2.object({
      fullName: z2.string().trim().min(2).max(100),
      businessName: z2.string().trim().min(2).max(120),
      mobileNumber: z2.string().trim().min(7).max(28).refine((v) => /^[+\d\s\-()]{7,28}$/.test(v), "Enter a valid mobile number."),
      email: z2.string().trim().email().max(160),
      website: z2.string().trim().max(240).optional().default(""),
      city: z2.string().trim().min(2).max(80),
      country: z2.string().trim().min(2).max(80),
      businessCategory: z2.string().trim().max(120).optional().default(""),
      requiredService: z2.string().trim().min(2).max(140),
      monthlyMarketingBudget: z2.string().trim().min(2).max(80),
      preferredContactMethod: z2.string().trim().max(60).optional().default("Phone / WhatsApp"),
      message: z2.string().trim().min(8).max(1500),
      consentAccepted: z2.boolean().refine((v) => v === true, "Privacy consent is required."),
      honeypot: z2.string().max(60).optional().default(""),
      source: z2.string().trim().max(80).optional().default("Website"),
      campaignSource: z2.string().trim().max(40).optional().default("Website")
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        ok: false,
        error: parsed.error.issues[0]?.message || "Invalid lead enquiry payload.",
        code: "INVALID_LEAD_PAYLOAD"
      });
      return;
    }
    if (parsed.data.honeypot.trim().length > 0) {
      res.status(400).json({ ok: false, error: "Submission rejected.", code: "INVALID_LEAD_PAYLOAD" });
      return;
    }
    const result = await withDbMutation(async (db) => {
      const nowIso = (/* @__PURE__ */ new Date()).toISOString();
      const leadId = `AKY-LEAD-${crypto4.randomBytes(4).toString("hex").toUpperCase()}`;
      const cleanEmail = stripControls(parsed.data.email).toLowerCase();
      const cleanPhoneDigits = parsed.data.mobileNumber.replace(/\D/g, "");
      const duplicate = db.leads.find(
        (l) => l.email.toLowerCase() === cleanEmail || cleanPhoneDigits.length >= 7 && l.mobileNumber.replace(/\D/g, "") === cleanPhoneDigits
      );
      const srcCandidate = parsed.data.campaignSource;
      const campaignSource = LEAD_SOURCES.includes(srcCandidate) ? srcCandidate : "Website";
      const lead = {
        leadId,
        receivedAt: nowIso,
        updatedAt: nowIso,
        fullName: stripControls(parsed.data.fullName),
        mobileNumber: stripControls(parsed.data.mobileNumber),
        email: cleanEmail,
        companyName: stripControls(parsed.data.businessName),
        website: stripControls(parsed.data.website),
        city: stripControls(parsed.data.city),
        country: stripControls(parsed.data.country),
        businessCategory: stripControls(parsed.data.businessCategory),
        requiredService: stripControls(parsed.data.requiredService),
        estimatedBudget: stripControls(parsed.data.monthlyMarketingBudget),
        preferredContactMethod: stripControls(parsed.data.preferredContactMethod),
        description: stripControls(parsed.data.message),
        consentAccepted: true,
        stage: "NEW",
        secondaryTag: "",
        assignedToUserId: "",
        assignedToName: "",
        followUpAt: "",
        campaignSource,
        expectedDealValue: 0,
        currency: "INR",
        lostReason: "",
        privateNotes: "",
        convertedClientId: "",
        duplicateWarning: duplicate ? `Matches existing enquiry ${duplicate.leadId}` : "",
        sourcePage: stripControls(parsed.data.source),
        activities: [
          {
            id: `act_${crypto4.randomBytes(4).toString("hex")}`,
            timestamp: nowIso,
            actor: "Public Enquiry Form",
            type: "system",
            summary: `Submitted via ${stripControls(parsed.data.source)} (${parsed.data.requiredService}).`
          }
        ]
      };
      db.leads.unshift(lead);
      appendAuditLog(db, {
        actorId: "public_form",
        actorName: lead.fullName,
        actorRole: "Public",
        action: "LEAD_SUBMITTED",
        targetId: leadId,
        summary: `New enquiry from ${lead.companyName} (${lead.requiredService}).`
      });
      await dispatchNotification(db, {
        event: "enquiry_received",
        subject: `New Enquiry ${leadId}: ${lead.companyName} (${lead.requiredService})`,
        body: `Name: ${lead.fullName}
Company: ${lead.companyName}
Phone: ${lead.mobileNumber}
Email: ${lead.email}
Service: ${lead.requiredService}
Budget: ${lead.estimatedBudget}
Notes: ${lead.description}`
      });
      return { leadId, receivedAt: nowIso };
    });
    res.status(201).json({ ok: true, ...result });
  });
  app.get("/api/leads", (_req, res) => {
    res.setHeader("Allow", "POST");
    res.status(405).json({ ok: false, error: "Method not allowed.", code: "METHOD_NOT_ALLOWED" });
  });
  app.get("/api/public/quote/:token", (req, res) => {
    const token = String(req.params.token || "").trim();
    const db = readDb();
    const quote = db.quotations.find((q) => q.shareToken === token);
    if (!quote) {
      res.status(404).json({ error: "Quotation link is invalid or expired." });
      return;
    }
    const linkedInvoice = quote.convertedInvoiceId ? db.invoices.find((i) => i.id === quote.convertedInvoiceId) || null : null;
    res.json({
      quotation: {
        quoteNumber: quote.quoteNumber,
        version: quote.version,
        customerName: quote.customerName,
        companyName: quote.companyName,
        cityCountry: quote.cityCountry,
        currency: quote.currency,
        items: quote.items,
        subtotal: quote.subtotal,
        discountAmount: quote.discountAmount,
        taxableAmount: quote.taxableAmount,
        gstEnabled: quote.gstEnabled,
        gstRate: quote.gstRate,
        gstAmount: quote.gstAmount,
        grandTotal: quote.grandTotal,
        paymentTerms: quote.paymentTerms,
        expiryDate: quote.expiryDate,
        scopeOfWork: quote.scopeOfWork,
        exclusions: quote.exclusions,
        notes: quote.notes,
        status: quote.status,
        customerResponseNote: quote.customerResponseNote,
        respondedAt: quote.respondedAt,
        createdAt: quote.createdAt
      },
      invoice: linkedInvoice ? {
        id: linkedInvoice.id,
        invoiceNumber: linkedInvoice.invoiceNumber,
        currency: linkedInvoice.currency,
        totalAmount: linkedInvoice.totalAmount,
        paidAmount: linkedInvoice.paidAmount,
        status: linkedInvoice.status,
        dueDate: linkedInvoice.dueDate
      } : null,
      uaeGatewayEnabled: Boolean(db.websiteSettings?.uaeGatewayEnabled),
      uaeGatewayNote: db.websiteSettings?.uaeGatewayNote || ""
    });
  });
  app.post("/api/public/quote/:token/respond", async (req, res) => {
    const token = String(req.params.token || "").trim();
    const schema = z2.object({
      decision: z2.enum(["ACCEPTED", "REJECTED"]),
      note: z2.string().trim().max(600).optional().default("")
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid response decision." });
      return;
    }
    try {
      const updated = await withDbMutation(async (db) => {
        const quote = db.quotations.find((q) => q.shareToken === token);
        if (!quote) {
          const err = new Error("Quotation not found.");
          err.statusCode = 404;
          throw err;
        }
        if (quote.status === "ACCEPTED" || quote.status === "REJECTED") {
          const err = new Error(`Quotation is already marked as ${quote.status}.`);
          err.statusCode = 409;
          throw err;
        }
        const nowIso = (/* @__PURE__ */ new Date()).toISOString();
        quote.status = parsed.data.decision;
        quote.customerResponseNote = stripControls(parsed.data.note);
        quote.respondedAt = nowIso;
        quote.updatedAt = nowIso;
        appendAuditLog(db, {
          actorId: "customer_portal",
          actorName: quote.customerName,
          actorRole: "Public",
          action: `QUOTATION_${parsed.data.decision}`,
          targetId: quote.quoteNumber,
          summary: `Customer explicitly marked quotation ${quote.quoteNumber} as ${parsed.data.decision}.`
        });
        await dispatchNotification(db, {
          event: parsed.data.decision === "ACCEPTED" ? "quotation_accepted" : "quotation_rejected",
          subject: `Quotation ${quote.quoteNumber} ${parsed.data.decision} by ${quote.companyName || quote.customerName}`,
          body: `Quotation: ${quote.quoteNumber}
Customer: ${quote.customerName}
Decision: ${parsed.data.decision}
Note: ${quote.customerResponseNote || "None"}`
        });
        return quote;
      });
      res.json({ ok: true, status: updated.status, respondedAt: updated.respondedAt });
    } catch (err) {
      res.status(err?.statusCode || 400).json({ error: err?.message || "Unable to save response." });
    }
  });
  app.get("/api/razorpay/config", (_req, res) => {
    const creds = getRazorpayCredentials();
    const db = readDb();
    res.json({
      configured: Boolean(creds),
      mode: creds?.mode || "test",
      keyId: creds ? creds.keyId : null,
      currency: "INR",
      catalog: PAYMENT_CATALOG_LIST,
      uaeGatewayEnabled: Boolean(db.websiteSettings?.uaeGatewayEnabled),
      uaeGatewayNote: db.websiteSettings?.uaeGatewayNote || ""
    });
  });
  app.post("/api/razorpay/create-order", async (req, res) => {
    const creds = getRazorpayCredentials();
    if (!creds) {
      res.status(503).json({
        error: "Online Razorpay checkout requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment secrets.",
        code: "RAZORPAY_NOT_CONFIGURED"
      });
      return;
    }
    const bodySchema = z2.object({
      sku: z2.enum([
        "advisory-session",
        "growth-marketing-setup",
        "lead-filtering-setup",
        "sales-training",
        "bulk-sms-starter",
        "whatsapp-business-setup"
      ]).optional(),
      invoiceId: z2.string().trim().max(80).optional(),
      quotationToken: z2.string().trim().max(120).optional(),
      customerName: z2.string().trim().max(120).optional().default(""),
      customerEmail: z2.union([z2.string().trim().email().max(160), z2.literal("")]).optional().default(""),
      customerPhone: z2.string().trim().max(30).optional().default(""),
      referenceId: z2.string().trim().max(80).optional().default("")
    });
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid payment order request.", code: "INVALID_REQUEST" });
      return;
    }
    const dbSnapshot = readDb();
    let amountMajor = 0;
    let currency = "INR";
    let title = "AKYIN Commercial Payment";
    let description = "Verified payment via AKYIN.com";
    let invoiceId = "";
    let invoiceNumber = "";
    let quotationId = "";
    let clientId = "";
    let serviceCategory = "Business consulting";
    let gstPortion = 0;
    let leadSource = "Website";
    if (parsed.data.invoiceId) {
      const inv = dbSnapshot.invoices.find((i) => i.id === parsed.data.invoiceId);
      if (!inv) {
        res.status(404).json({ error: "Invoice not found." });
        return;
      }
      if (inv.currency !== "INR") {
        res.status(400).json({
          error: `Online Razorpay order only supports INR settlement right now (${inv.currency} invoices use manual transfer).`,
          code: "CURRENCY_MANUAL_FALLBACK"
        });
        return;
      }
      amountMajor = round2(Math.max(0, inv.totalAmount - inv.paidAmount));
      if (amountMajor <= 0) {
        res.status(409).json({ error: "Invoice balance is already settled." });
        return;
      }
      title = `Invoice ${inv.invoiceNumber}`;
      description = `${inv.companyName || inv.customerName} (${inv.paymentType})`;
      invoiceId = inv.id;
      invoiceNumber = inv.invoiceNumber;
      quotationId = inv.quotationId;
      clientId = inv.clientId;
      serviceCategory = inv.serviceCategory;
      gstPortion = inv.gstAmount;
      leadSource = inv.leadSource;
    } else if (parsed.data.sku) {
      const item = PAYMENT_CATALOG_BY_SKU[parsed.data.sku];
      if (!item) {
        res.status(404).json({ error: "Catalog item not found." });
        return;
      }
      amountMajor = item.amountInr;
      title = item.title;
      description = item.description;
      serviceCategory = item.category;
    } else {
      res.status(400).json({ error: "Provide either sku or invoiceId." });
      return;
    }
    const amountPaise = Math.round(amountMajor * 100);
    const receipt = `aky_${Date.now().toString(36)}_${crypto4.randomBytes(2).toString("hex")}`;
    try {
      const authHeader = Buffer.from(`${creds.keyId}:${creds.keySecret}`).toString("base64");
      const rzpResponse = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: amountPaise,
          currency,
          receipt,
          notes: {
            invoiceId: invoiceId || "",
            sku: parsed.data.sku || "",
            mode: creds.mode,
            customerName: parsed.data.customerName || "Client"
          }
        })
      });
      const rzpBody = await rzpResponse.json().catch(() => ({}));
      if (!rzpResponse.ok || !rzpBody.id) {
        res.status(502).json({
          error: rzpBody?.error?.description || "Razorpay refused order creation.",
          code: "RAZORPAY_UPSTREAM_ERROR"
        });
        return;
      }
      const orderId = rzpBody.id;
      await withDbMutation((db) => {
        const nowIso = (/* @__PURE__ */ new Date()).toISOString();
        const paymentRec = {
          id: `PAY-${crypto4.randomBytes(4).toString("hex").toUpperCase()}`,
          invoiceId,
          invoiceNumber,
          quotationId,
          clientId,
          customerName: parsed.data.customerName || "Web Client",
          customerEmail: parsed.data.customerEmail || "",
          serviceCategory,
          leadSource,
          mode: creds.mode,
          gateway: "razorpay",
          method: "razorpay_checkout",
          currency,
          amount: amountMajor,
          gstPortion,
          gatewayFeeAmount: 0,
          refundedAmount: 0,
          status: "created",
          verified: false,
          razorpayOrderId: orderId,
          razorpayPaymentId: "",
          razorpaySignatureVerified: false,
          webhookEventIds: [],
          idempotencyKey: `order:${orderId}`,
          notes: description,
          createdAt: nowIso,
          capturedAt: "",
          updatedAt: nowIso
        };
        db.payments.unshift(paymentRec);
      });
      res.json({
        orderId,
        amount: amountPaise,
        currency,
        keyId: creds.keyId,
        mode: creds.mode,
        sku: parsed.data.sku || null,
        invoiceId: invoiceId || null,
        title,
        displayPrice: `\u20B9${amountMajor.toLocaleString("en-IN")}`,
        description,
        receipt: rzpBody.receipt || receipt
      });
    } catch (err) {
      res.status(502).json({
        error: err instanceof Error ? err.message : "Unable to reach Razorpay Orders API.",
        code: "RAZORPAY_NETWORK_ERROR"
      });
    }
  });
  app.post("/api/razorpay/verify-payment", async (req, res) => {
    const creds = getRazorpayCredentials();
    if (!creds) {
      res.status(503).json({ verified: false, error: "Razorpay not configured." });
      return;
    }
    const schema = z2.object({
      razorpay_order_id: z2.string().trim().min(4).max(100),
      razorpay_payment_id: z2.string().trim().min(4).max(100),
      razorpay_signature: z2.string().trim().regex(/^[a-f0-9]{64}$/i),
      sku: z2.enum([
        "advisory-session",
        "growth-marketing-setup",
        "lead-filtering-setup",
        "sales-training",
        "bulk-sms-starter",
        "whatsapp-business-setup"
      ]).optional(),
      invoiceId: z2.string().trim().optional()
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ verified: false, error: "Invalid payment verification payload." });
      return;
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, sku } = parsed.data;
    if (!verifyRazorpayCheckoutSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      creds.keySecret
    )) {
      res.status(400).json({
        verified: false,
        error: "Payment signature mismatch.",
        code: "SIGNATURE_MISMATCH"
      });
      return;
    }
    const settled = await withDbMutation(async (db) => {
      const nowIso = (/* @__PURE__ */ new Date()).toISOString();
      const paymentRec = db.payments.find(
        (p) => p.razorpayOrderId === razorpay_order_id || razorpay_payment_id && p.razorpayPaymentId === razorpay_payment_id
      );
      if (paymentRec) {
        const wasSettled = paymentRec.status === "captured" && paymentRec.verified;
        paymentRec.razorpayPaymentId = razorpay_payment_id;
        paymentRec.razorpaySignatureVerified = true;
        paymentRec.verified = true;
        paymentRec.status = "captured";
        paymentRec.capturedAt = paymentRec.capturedAt || nowIso;
        paymentRec.updatedAt = nowIso;
        if (!wasSettled && paymentRec.invoiceId) {
          const inv = db.invoices.find((i) => i.id === paymentRec.invoiceId);
          if (inv) {
            inv.paidAmount = round2(inv.paidAmount + paymentRec.amount);
            recalculateInvoiceStatus(inv);
          }
        }
      }
      appendAuditLog(db, {
        actorId: "razorpay_verify",
        actorName: "Razorpay Checkout",
        actorRole: "System",
        action: "PAYMENT_VERIFIED",
        targetId: razorpay_payment_id,
        summary: `Verified HMAC-SHA256 Razorpay payment ${razorpay_payment_id} (${creds.mode} mode).`
      });
      await dispatchNotification(db, {
        event: "payment_received",
        subject: `Verified Razorpay Payment ${razorpay_payment_id} (${creds.mode.toUpperCase()})`,
        body: `Order ID: ${razorpay_order_id}
Payment ID: ${razorpay_payment_id}
Mode: ${creds.mode}`
      });
      return paymentRec;
    });
    const item = sku ? PAYMENT_CATALOG_BY_SKU[sku] : void 0;
    res.json({
      verified: true,
      mode: creds.mode,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      sku: sku || null,
      title: item?.title || settled?.notes || "AKYIN Commercial Payment",
      displayPrice: item?.displayPrice || null,
      verifiedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app.get(
    "/api/suite/overview",
    requireAuth,
    requirePermission("overview"),
    (_req, res) => {
      const db = readDb();
      const kpis = computeDashboardKpis(db);
      res.json({
        kpis,
        recentLeads: db.leads.slice(0, 8),
        recentAppointments: db.appointments.slice(0, 8),
        recentPayments: db.payments.slice(0, 8),
        recentQuotations: db.quotations.slice(0, 8),
        razorpayMode: getRazorpayCredentials()?.mode || "test",
        razorpayConfigured: Boolean(getRazorpayCredentials()),
        smtpConfigured: Boolean(getSmtpConfig())
      });
    }
  );
  app.get(
    "/api/suite/leads",
    requireAuth,
    requirePermission("leads"),
    (req, res) => {
      const db = readDb();
      const q = String(req.query.q || "").trim().toLowerCase();
      const stage = String(req.query.stage || "").trim();
      const source = String(req.query.source || "").trim();
      let list = db.leads || [];
      if (stage && stage !== "ALL") {
        list = list.filter((l) => l.stage === stage);
      }
      if (source && source !== "ALL") {
        list = list.filter((l) => l.campaignSource === source);
      }
      if (q) {
        list = list.filter(
          (l) => l.leadId.toLowerCase().includes(q) || l.fullName.toLowerCase().includes(q) || l.companyName.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.mobileNumber.toLowerCase().includes(q) || l.requiredService.toLowerCase().includes(q)
        );
      }
      res.json({ leads: list, stages: CRM_STAGES, sources: LEAD_SOURCES });
    }
  );
  app.get(
    "/api/suite/leads/export.csv",
    requireAuth,
    requirePermission("leads"),
    (_req, res) => {
      const db = readDb();
      const header = [
        "Lead ID",
        "Received At",
        "Full Name",
        "Company",
        "Email",
        "Mobile",
        "City",
        "Country",
        "Service",
        "Budget",
        "Stage",
        "Source",
        "Expected Value"
      ].map(sanitizeCsvCell).join(",");
      const rows = (db.leads || []).map(
        (l) => [
          l.leadId,
          l.receivedAt,
          l.fullName,
          l.companyName,
          l.email,
          l.mobileNumber,
          l.city,
          l.country,
          l.requiredService,
          l.estimatedBudget,
          l.stage,
          l.campaignSource,
          l.expectedDealValue
        ].map(sanitizeCsvCell).join(",")
      );
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", 'attachment; filename="akyin-leads-crm.csv"');
      res.send([header, ...rows].join("\n"));
    }
  );
  app.post(
    "/api/suite/leads",
    requireAuth,
    requirePermission("leads"),
    async (req, res) => {
      const schema = z2.object({
        fullName: z2.string().trim().min(2).max(100),
        companyName: z2.string().trim().max(120).default(""),
        mobileNumber: z2.string().trim().min(7).max(28),
        email: z2.string().trim().email().max(160),
        city: z2.string().trim().max(80).default(""),
        country: z2.string().trim().max(80).default("India"),
        businessCategory: z2.string().trim().max(120).default(""),
        requiredService: z2.string().trim().min(2).max(140),
        estimatedBudget: z2.string().trim().max(80).default(""),
        campaignSource: z2.string().trim().max(40).default("Direct contact"),
        expectedDealValue: z2.number().finite().min(0).default(0),
        description: z2.string().trim().max(1500).default("")
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid lead data." });
        return;
      }
      const lead = await withDbMutation((db) => {
        const nowIso = (/* @__PURE__ */ new Date()).toISOString();
        const leadId = `AKY-LEAD-${crypto4.randomBytes(4).toString("hex").toUpperCase()}`;
        const srcCandidate = parsed.data.campaignSource;
        const created = {
          leadId,
          receivedAt: nowIso,
          updatedAt: nowIso,
          fullName: stripControls(parsed.data.fullName),
          mobileNumber: stripControls(parsed.data.mobileNumber),
          email: stripControls(parsed.data.email).toLowerCase(),
          companyName: stripControls(parsed.data.companyName),
          website: "",
          city: stripControls(parsed.data.city),
          country: stripControls(parsed.data.country),
          businessCategory: stripControls(parsed.data.businessCategory),
          requiredService: stripControls(parsed.data.requiredService),
          estimatedBudget: stripControls(parsed.data.estimatedBudget),
          preferredContactMethod: "Phone / WhatsApp",
          description: stripControls(parsed.data.description),
          consentAccepted: true,
          stage: "NEW",
          secondaryTag: "",
          assignedToUserId: req.suiteUser?.id || "",
          assignedToName: req.suiteUser?.name || "",
          followUpAt: "",
          campaignSource: LEAD_SOURCES.includes(srcCandidate) ? srcCandidate : "Direct contact",
          expectedDealValue: round2(parsed.data.expectedDealValue),
          currency: "INR",
          lostReason: "",
          privateNotes: "",
          convertedClientId: "",
          duplicateWarning: "",
          sourcePage: "Admin Manual Entry",
          activities: [
            {
              id: `act_${crypto4.randomBytes(4).toString("hex")}`,
              timestamp: nowIso,
              actor: req.suiteUser?.name || "Admin",
              type: "system",
              summary: "Created manually inside CRM."
            }
          ]
        };
        db.leads.unshift(created);
        appendAuditLog(db, {
          actorId: req.suiteUser.id,
          actorName: req.suiteUser.name,
          actorRole: req.suiteUser.role,
          action: "CREATE_CRM_LEAD",
          targetId: leadId,
          summary: `Added lead ${created.fullName} (${created.companyName}).`
        });
        return created;
      });
      res.status(201).json({ lead });
    }
  );
  app.patch(
    "/api/suite/leads/:leadId",
    requireAuth,
    requirePermission("leads"),
    async (req, res) => {
      const leadId = String(req.params.leadId || "");
      try {
        const updated = await withDbMutation(async (db) => {
          const lead = db.leads.find((l) => l.leadId === leadId);
          if (!lead) {
            const err = new Error("Lead not found.");
            err.statusCode = 404;
            throw err;
          }
          const body = req.body || {};
          const prevStage = lead.stage;
          const prevAssignee = lead.assignedToUserId;
          const nowIso = (/* @__PURE__ */ new Date()).toISOString();
          if (typeof body.stage === "string" && CRM_STAGES.includes(body.stage)) {
            lead.stage = body.stage;
          }
          if (typeof body.secondaryTag === "string") {
            lead.secondaryTag = body.secondaryTag;
          }
          if (typeof body.assignedToUserId === "string") {
            lead.assignedToUserId = body.assignedToUserId;
            const targetUser = db.users.find((u) => u.id === body.assignedToUserId);
            lead.assignedToName = targetUser ? targetUser.name : body.assignedToName || "";
          }
          if (typeof body.followUpAt === "string") lead.followUpAt = body.followUpAt;
          if (typeof body.campaignSource === "string" && LEAD_SOURCES.includes(body.campaignSource)) {
            lead.campaignSource = body.campaignSource;
          }
          if (typeof body.expectedDealValue === "number" && Number.isFinite(body.expectedDealValue)) {
            lead.expectedDealValue = round2(Math.max(0, body.expectedDealValue));
          }
          if (typeof body.lostReason === "string") lead.lostReason = stripControls(body.lostReason);
          if (typeof body.privateNotes === "string") lead.privateNotes = stripControls(body.privateNotes);
          lead.updatedAt = nowIso;
          if (prevStage !== lead.stage) {
            lead.activities.unshift({
              id: `act_${crypto4.randomBytes(4).toString("hex")}`,
              timestamp: nowIso,
              actor: req.suiteUser.name,
              type: "stage_change",
              summary: `Moved stage from ${prevStage} to ${lead.stage}.`
            });
          }
          if (prevAssignee !== lead.assignedToUserId && lead.assignedToName) {
            await dispatchNotification(db, {
              event: "lead_assigned",
              subject: `Lead ${lead.leadId} assigned to ${lead.assignedToName}`,
              body: `Lead: ${lead.fullName} (${lead.companyName})
Assigned to: ${lead.assignedToName}
Stage: ${lead.stage}`
            });
          }
          appendAuditLog(db, {
            actorId: req.suiteUser.id,
            actorName: req.suiteUser.name,
            actorRole: req.suiteUser.role,
            action: "UPDATE_CRM_LEAD",
            targetId: lead.leadId,
            summary: `Updated lead stage=${lead.stage}, followUp=${lead.followUpAt || "none"}.`
          });
          return lead;
        });
        res.json({ lead: updated });
      } catch (err) {
        res.status(err?.statusCode || 400).json({ error: err?.message || "Update failed." });
      }
    }
  );
  app.post(
    "/api/suite/leads/:leadId/activity",
    requireAuth,
    requirePermission("leads"),
    async (req, res) => {
      const leadId = String(req.params.leadId || "");
      const schema = z2.object({
        type: z2.enum(["note", "call", "email", "whatsapp"]),
        summary: z2.string().trim().min(2).max(1e3)
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Provide activity summary." });
        return;
      }
      try {
        const updated = await withDbMutation((db) => {
          const lead = db.leads.find((l) => l.leadId === leadId);
          if (!lead) {
            const err = new Error("Lead not found.");
            err.statusCode = 404;
            throw err;
          }
          const nowIso = (/* @__PURE__ */ new Date()).toISOString();
          lead.activities.unshift({
            id: `act_${crypto4.randomBytes(4).toString("hex")}`,
            timestamp: nowIso,
            actor: req.suiteUser.name,
            type: parsed.data.type,
            summary: stripControls(parsed.data.summary)
          });
          lead.updatedAt = nowIso;
          return lead;
        });
        res.json({ lead: updated });
      } catch (err) {
        res.status(err?.statusCode || 400).json({ error: err?.message || "Activity log failed." });
      }
    }
  );
  app.post(
    "/api/suite/leads/:leadId/convert-client",
    requireAuth,
    requirePermission("clients"),
    async (req, res) => {
      const leadId = String(req.params.leadId || "");
      try {
        const result = await withDbMutation((db) => {
          const lead = db.leads.find((l) => l.leadId === leadId);
          if (!lead) {
            const err = new Error("Lead not found.");
            err.statusCode = 404;
            throw err;
          }
          if (lead.convertedClientId) {
            const existing = db.clients.find((c) => c.id === lead.convertedClientId);
            if (existing) return { client: existing, lead };
          }
          const nowIso = (/* @__PURE__ */ new Date()).toISOString();
          const clientId = `client-${crypto4.randomBytes(4).toString("hex")}`;
          const newClient = {
            id: clientId,
            name: lead.companyName || lead.fullName,
            companyName: lead.companyName || lead.fullName,
            category: lead.businessCategory || lead.requiredService || "Commercial Client",
            contactPerson: lead.fullName,
            email: lead.email,
            phone: lead.mobileNumber,
            city: lead.city,
            country: lead.country,
            websiteUrl: lead.website,
            supportScope: lead.requiredService,
            summary: lead.description.slice(0, 220),
            status: "Active",
            verified: true,
            showInTicker: false,
            wordmarkStyle: "sans",
            sourceLeadId: lead.leadId,
            createdAt: nowIso,
            updatedAt: nowIso
          };
          db.clients.unshift(newClient);
          lead.stage = "WON";
          lead.convertedClientId = clientId;
          lead.updatedAt = nowIso;
          lead.activities.unshift({
            id: `act_${crypto4.randomBytes(4).toString("hex")}`,
            timestamp: nowIso,
            actor: req.suiteUser.name,
            type: "system",
            summary: `Converted WON lead to verified client record (${clientId}).`
          });
          appendAuditLog(db, {
            actorId: req.suiteUser.id,
            actorName: req.suiteUser.name,
            actorRole: req.suiteUser.role,
            action: "CONVERT_LEAD_TO_CLIENT",
            targetId: clientId,
            summary: `Converted lead ${lead.leadId} to client ${newClient.name}.`
          });
          return { client: newClient, lead };
        });
        res.status(201).json(result);
      } catch (err) {
        res.status(err?.statusCode || 400).json({ error: err?.message || "Conversion failed." });
      }
    }
  );
  app.get(
    "/api/suite/clients",
    requireAuth,
    requirePermission("clients"),
    (_req, res) => {
      const db = readDb();
      res.json({
        clients: db.clients,
        reportedClientsHandled: db.websiteSettings?.reportedClientsCount || 58
      });
    }
  );
  app.get(
    "/api/suite/clients/export.csv",
    requireAuth,
    requirePermission("clients"),
    (_req, res) => {
      const db = readDb();
      const header = [
        "Client ID",
        "Name",
        "Category",
        "Contact Person",
        "Email",
        "Phone",
        "City",
        "Country",
        "Support Scope",
        "Status",
        "Verified",
        "In Ticker"
      ].map(sanitizeCsvCell).join(",");
      const rows = (db.clients || []).map(
        (c) => [
          c.id,
          c.name,
          c.category,
          c.contactPerson,
          c.email,
          c.phone,
          c.city,
          c.country,
          c.supportScope,
          c.status,
          c.verified ? "Yes" : "No",
          c.showInTicker ? "Visible" : "Hidden"
        ].map(sanitizeCsvCell).join(",")
      );
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", 'attachment; filename="akyin-clients.csv"');
      res.send([header, ...rows].join("\n"));
    }
  );
  app.post(
    "/api/suite/clients",
    requireAuth,
    requirePermission("clients"),
    async (req, res) => {
      const schema = z2.object({
        name: z2.string().trim().min(2).max(120),
        companyName: z2.string().trim().max(120).optional().default(""),
        category: z2.string().trim().min(2).max(100),
        contactPerson: z2.string().trim().max(100).optional().default(""),
        email: z2.string().trim().max(160).optional().default(""),
        phone: z2.string().trim().max(30).optional().default(""),
        city: z2.string().trim().max(80).optional().default(""),
        country: z2.string().trim().max(80).optional().default("India"),
        websiteUrl: z2.string().trim().max(240).optional().default(""),
        supportScope: z2.string().trim().max(200).optional().default(""),
        summary: z2.string().trim().max(500).optional().default(""),
        verified: z2.boolean().optional().default(true),
        showInTicker: z2.boolean().optional().default(false),
        wordmarkStyle: z2.enum(["sans", "serif", "mono"]).optional().default("sans")
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid client payload." });
        return;
      }
      const client = await withDbMutation((db) => {
        const nowIso = (/* @__PURE__ */ new Date()).toISOString();
        const id = `client-${crypto4.randomBytes(4).toString("hex")}`;
        const record = {
          id,
          name: stripControls(parsed.data.name),
          companyName: stripControls(parsed.data.companyName || parsed.data.name),
          category: stripControls(parsed.data.category),
          contactPerson: stripControls(parsed.data.contactPerson),
          email: stripControls(parsed.data.email),
          phone: stripControls(parsed.data.phone),
          city: stripControls(parsed.data.city),
          country: stripControls(parsed.data.country),
          websiteUrl: stripControls(parsed.data.websiteUrl),
          supportScope: stripControls(parsed.data.supportScope),
          summary: stripControls(parsed.data.summary),
          status: "Active",
          verified: parsed.data.verified,
          showInTicker: parsed.data.showInTicker,
          wordmarkStyle: parsed.data.wordmarkStyle,
          createdAt: nowIso,
          updatedAt: nowIso
        };
        db.clients.push(record);
        appendAuditLog(db, {
          actorId: req.suiteUser.id,
          actorName: req.suiteUser.name,
          actorRole: req.suiteUser.role,
          action: "ADD_CLIENT_RECORD",
          targetId: id,
          summary: `Added client '${record.name}' (ticker=${record.showInTicker}).`
        });
        return record;
      });
      res.status(201).json({ client });
    }
  );
  app.patch(
    "/api/suite/clients/:clientId",
    requireAuth,
    requirePermission("clients"),
    async (req, res) => {
      const clientId = String(req.params.clientId || "");
      try {
        const updated = await withDbMutation((db) => {
          const client = db.clients.find((c) => c.id === clientId);
          if (!client) {
            const err = new Error("Client not found.");
            err.statusCode = 404;
            throw err;
          }
          const b = req.body || {};
          if (typeof b.name === "string" && b.name.trim()) client.name = stripControls(b.name);
          if (typeof b.companyName === "string") client.companyName = stripControls(b.companyName);
          if (typeof b.category === "string") client.category = stripControls(b.category);
          if (typeof b.contactPerson === "string") client.contactPerson = stripControls(b.contactPerson);
          if (typeof b.email === "string") client.email = stripControls(b.email);
          if (typeof b.phone === "string") client.phone = stripControls(b.phone);
          if (typeof b.city === "string") client.city = stripControls(b.city);
          if (typeof b.country === "string") client.country = stripControls(b.country);
          if (typeof b.websiteUrl === "string") client.websiteUrl = stripControls(b.websiteUrl);
          if (typeof b.supportScope === "string") client.supportScope = stripControls(b.supportScope);
          if (typeof b.summary === "string") client.summary = stripControls(b.summary);
          if (typeof b.verified === "boolean") client.verified = b.verified;
          if (typeof b.showInTicker === "boolean") client.showInTicker = b.showInTicker;
          if (b.status === "Active" || b.status === "Paused" || b.status === "Completed") {
            client.status = b.status;
          }
          client.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
          appendAuditLog(db, {
            actorId: req.suiteUser.id,
            actorName: req.suiteUser.name,
            actorRole: req.suiteUser.role,
            action: "UPDATE_CLIENT_RECORD",
            targetId: client.id,
            summary: `Updated client '${client.name}' (ticker=${client.showInTicker}).`
          });
          return client;
        });
        res.json({ client: updated });
      } catch (err) {
        res.status(err?.statusCode || 400).json({ error: err?.message || "Client update failed." });
      }
    }
  );
  app.delete(
    "/api/suite/clients/:clientId",
    requireAuth,
    requirePermission("clients"),
    async (req, res) => {
      const clientId = String(req.params.clientId || "");
      await withDbMutation((db) => {
        const before = db.clients.length;
        db.clients = db.clients.filter((c) => c.id !== clientId);
        if (db.clients.length !== before) {
          appendAuditLog(db, {
            actorId: req.suiteUser.id,
            actorName: req.suiteUser.name,
            actorRole: req.suiteUser.role,
            action: "DELETE_CLIENT_RECORD",
            targetId: clientId,
            summary: `Removed client entry ${clientId}.`
          });
        }
      });
      res.json({ ok: true });
    }
  );
  app.get(
    "/api/suite/service-categories",
    requireAuth,
    requirePermission("services"),
    (_req, res) => {
      const db = readDb();
      const categoryRecords = (db.serviceCategories || []).slice().sort((a, b) => (a.menuOrder ?? a.sortOrder) - (b.menuOrder ?? b.sortOrder));
      res.json({ categoryRecords });
    }
  );
  app.post(
    "/api/suite/service-categories",
    requireAuth,
    requirePermission("services"),
    async (req, res) => {
      const schema = z2.object({
        name: z2.string().trim().min(2).max(80),
        slug: z2.string().trim().max(100).optional(),
        description: z2.string().trim().max(400).optional().default(""),
        menuOrder: z2.number().finite().int().min(1).max(1e3).optional(),
        active: z2.boolean().optional().default(true)
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid category data." });
        return;
      }
      try {
        const created = await withDbMutation((db) => {
          if (!Array.isArray(db.serviceCategories)) db.serviceCategories = [];
          const cleanName = stripControls(parsed.data.name);
          const cleanSlug = slugifyServiceName(parsed.data.slug || cleanName);
          const duplicate = db.serviceCategories.find(
            (c) => c.name.trim().toLowerCase() === cleanName.toLowerCase() || c.slug.toLowerCase() === cleanSlug
          );
          if (duplicate) {
            const err = new Error(`Category '${duplicate.name}' already exists.`);
            err.statusCode = 409;
            throw err;
          }
          const nowIso = (/* @__PURE__ */ new Date()).toISOString();
          const nextOrder = db.serviceCategories.length + 1;
          const record = {
            id: `cat-${crypto4.randomBytes(4).toString("hex")}`,
            name: cleanName,
            slug: cleanSlug,
            description: stripControls(parsed.data.description),
            sortOrder: nextOrder,
            menuOrder: parsed.data.menuOrder ?? nextOrder,
            active: parsed.data.active,
            updatedAt: nowIso
          };
          db.serviceCategories.push(record);
          appendAuditLog(db, {
            actorId: req.suiteUser.id,
            actorName: req.suiteUser.name,
            actorRole: req.suiteUser.role,
            action: "CREATE_SERVICE_CATEGORY",
            targetId: record.id,
            summary: `Added service category '${record.name}'.`
          });
          return record;
        });
        res.status(201).json({ category: created });
      } catch (err) {
        res.status(err?.statusCode || 400).json({ error: err?.message || "Category creation failed." });
      }
    }
  );
  app.put(
    "/api/suite/service-categories/reorder",
    requireAuth,
    requirePermission("services"),
    async (req, res) => {
      const schema = z2.object({
        categoryIds: z2.array(z2.string().trim().min(1)).min(1)
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Provide ordered categoryIds." });
        return;
      }
      const ordered = await withDbMutation((db) => {
        const orderMap = new Map(parsed.data.categoryIds.map((id, idx) => [id, idx + 1]));
        const nowIso = (/* @__PURE__ */ new Date()).toISOString();
        for (const cat of db.serviceCategories || []) {
          const pos = orderMap.get(cat.id);
          if (pos !== void 0) {
            cat.menuOrder = pos;
            cat.sortOrder = pos;
            cat.updatedAt = nowIso;
          }
        }
        db.serviceCategories.sort((a, b) => (a.menuOrder ?? a.sortOrder) - (b.menuOrder ?? b.sortOrder));
        appendAuditLog(db, {
          actorId: req.suiteUser.id,
          actorName: req.suiteUser.name,
          actorRole: req.suiteUser.role,
          action: "REORDER_SERVICE_CATEGORIES",
          targetId: "CATEGORIES",
          summary: `Updated menu order across ${db.serviceCategories.length} categories.`
        });
        return db.serviceCategories;
      });
      res.json({ categoryRecords: ordered });
    }
  );
  app.patch(
    "/api/suite/service-categories/:catId",
    requireAuth,
    requirePermission("services"),
    async (req, res) => {
      const catId = String(req.params.catId || "").trim();
      try {
        const updated = await withDbMutation((db) => {
          const cat = (db.serviceCategories || []).find((c) => c.id === catId);
          if (!cat) {
            const err = new Error("Service category not found.");
            err.statusCode = 404;
            throw err;
          }
          const b = req.body || {};
          const prevName = cat.name;
          if (typeof b.name === "string" && b.name.trim()) {
            const cleanName = stripControls(b.name);
            const dup = db.serviceCategories.find(
              (c) => c.id !== catId && c.name.trim().toLowerCase() === cleanName.toLowerCase()
            );
            if (dup) {
              const err = new Error(`Category name '${cleanName}' already exists.`);
              err.statusCode = 409;
              throw err;
            }
            cat.name = cleanName;
          }
          if (typeof b.slug === "string" && b.slug.trim()) {
            const cleanSlug = slugifyServiceName(b.slug);
            const dupSlug = db.serviceCategories.find(
              (c) => c.id !== catId && c.slug.toLowerCase() === cleanSlug
            );
            if (dupSlug) {
              const err = new Error(`Category slug '${cleanSlug}' already exists.`);
              err.statusCode = 409;
              throw err;
            }
            cat.slug = cleanSlug;
          }
          if (typeof b.description === "string") cat.description = stripControls(b.description);
          if (typeof b.menuOrder === "number" && Number.isFinite(b.menuOrder)) {
            cat.menuOrder = Math.max(1, Math.floor(b.menuOrder));
            cat.sortOrder = cat.menuOrder;
          }
          if (typeof b.active === "boolean") cat.active = b.active;
          cat.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
          if (cat.name !== prevName) {
            for (const srv of db.services) {
              if (srv.category === prevName) {
                srv.category = cat.name;
              }
            }
          }
          appendAuditLog(db, {
            actorId: req.suiteUser.id,
            actorName: req.suiteUser.name,
            actorRole: req.suiteUser.role,
            action: "UPDATE_SERVICE_CATEGORY",
            targetId: cat.id,
            summary: `Updated category '${cat.name}' (active=${cat.active}, order=${cat.menuOrder}).`
          });
          return cat;
        });
        res.json({ category: updated });
      } catch (err) {
        res.status(err?.statusCode || 400).json({ error: err?.message || "Category update failed." });
      }
    }
  );
  app.delete(
    "/api/suite/service-categories/:catId",
    requireAuth,
    requirePermission("services"),
    async (req, res) => {
      const catId = String(req.params.catId || "").trim();
      try {
        await withDbMutation((db) => {
          const cat = (db.serviceCategories || []).find((c) => c.id === catId);
          if (!cat) {
            const err = new Error("Category not found.");
            err.statusCode = 404;
            throw err;
          }
          const linkedCount = db.services.filter((s) => s.category === cat.name).length;
          if (linkedCount > 0) {
            const err = new Error(
              `Cannot delete '${cat.name}' while ${linkedCount} service(s) belong to it. Reassign services first.`
            );
            err.statusCode = 409;
            throw err;
          }
          db.serviceCategories = db.serviceCategories.filter((c) => c.id !== catId);
          appendAuditLog(db, {
            actorId: req.suiteUser.id,
            actorName: req.suiteUser.name,
            actorRole: req.suiteUser.role,
            action: "DELETE_SERVICE_CATEGORY",
            targetId: catId,
            summary: `Removed category '${cat.name}'.`
          });
        });
        res.json({ ok: true });
      } catch (err) {
        res.status(err?.statusCode || 400).json({ error: err?.message || "Delete failed." });
      }
    }
  );
  app.get(
    "/api/suite/services",
    requireAuth,
    requirePermission("services"),
    (_req, res) => {
      const db = readDb();
      const categoryRecords = (db.serviceCategories || []).slice().sort((a, b) => (a.menuOrder ?? a.sortOrder) - (b.menuOrder ?? b.sortOrder));
      const categories = categoryRecords.length > 0 ? categoryRecords.map((c) => c.name) : [...SERVICE_CATEGORIES];
      res.json({
        categories,
        categoryRecords,
        services: (db.services || []).slice().sort((a, b) => (a.menuOrder ?? a.sortOrder) - (b.menuOrder ?? b.sortOrder))
      });
    }
  );
  app.get(
    "/api/suite/services/price-history",
    requireAuth,
    requirePermission("services"),
    (_req, res) => {
      const db = readDb();
      const sortedServices = (db.services || []).slice().sort((a, b) => a.sortOrder - b.sortOrder);
      const revisions = [];
      for (const srv of sortedServices) {
        const currentPrice = srv.oneTimePrice ?? srv.setupFee ?? srv.monthlyPrice ?? srv.recurringFee ?? srv.packagePrice ?? 0;
        const history = Array.isArray(srv.priceHistory) ? srv.priceHistory : [];
        history.forEach((h, index) => {
          revisions.push({
            id: `${srv.id}-rev-${index}`,
            serviceId: srv.id,
            serviceName: srv.name,
            category: srv.category,
            currentPrice,
            previousPrice: Number(h.previousPrice) || 0,
            newPrice: Number(h.newPrice) || 0,
            effectiveDate: h.changedAt,
            changedBy: h.changedBy || "Admin",
            changedByEmail: h.changedByEmail || "",
            priceField: h.priceField || "Service Rate",
            note: h.note || ""
          });
        });
      }
      revisions.sort((a, b) => Date.parse(b.effectiveDate || "") - Date.parse(a.effectiveDate || ""));
      res.json({
        revisions,
        totalRevisions: revisions.length,
        services: sortedServices.map((s) => ({
          id: s.id,
          name: s.name,
          category: s.category,
          revisionCount: s.priceHistory?.length || 0
        }))
      });
    }
  );
  app.post(
    "/api/suite/services",
    requireAuth,
    requirePermission("services"),
    async (req, res) => {
      const tierSchema = z2.object({
        setupFee: z2.number().finite().min(0).optional(),
        packagePrice: z2.number().finite().min(0).optional(),
        unitRate: z2.number().finite().min(0).optional(),
        additionalUnitRate: z2.number().finite().min(0).optional()
      }).optional();
      const schema = z2.object({
        name: z2.string().trim().min(2).max(140),
        slug: z2.string().trim().max(140).optional(),
        category: z2.string().trim().min(2).max(80),
        description: z2.string().trim().max(800).default(""),
        benefits: z2.array(z2.string().trim().max(220)).optional().default([]),
        deliverables: z2.array(z2.string().trim().max(200)).default([]),
        workProcess: z2.array(z2.string().trim().max(220)).optional().default([]),
        pricingModel: z2.enum(["fixed", "custom"]).default("fixed"),
        setupFee: z2.number().finite().min(0).default(0),
        recurringFee: z2.number().finite().min(0).default(0),
        oneTimePrice: z2.number().finite().min(0).optional(),
        monthlyPrice: z2.number().finite().min(0).optional(),
        revisionLimit: z2.union([z2.string().trim().max(120), z2.number()]).optional(),
        additionalDeliverableCharge: z2.number().finite().min(0).optional(),
        subscriptionDuration: z2.string().trim().max(120).optional(),
        renewalTerms: z2.string().trim().max(160).optional(),
        cancellationPolicy: z2.string().trim().max(160).optional(),
        transactionalSmsEnabled: z2.boolean().optional(),
        billingCycle: z2.enum(["one-time", "monthly", "quarterly", "custom"]).default("monthly"),
        gstEnabled: z2.boolean().default(true),
        gstRate: z2.number().finite().min(0).max(100).default(18),
        deliveryPeriod: z2.string().trim().max(120).default("7 business days"),
        active: z2.boolean().default(true),
        menuOrder: z2.number().finite().int().min(1).max(2e3).optional(),
        showInMenu: z2.boolean().optional().default(true),
        packagePrice: z2.number().finite().min(0).optional(),
        includedUnits: z2.number().finite().min(0).optional(),
        unitLabel: z2.string().trim().max(40).optional(),
        unitRate: z2.number().finite().min(0).optional(),
        additionalUnitRate: z2.number().finite().min(0).optional(),
        internationalPricing: z2.object({
          aed: tierSchema,
          usd: tierSchema,
          notes: z2.string().trim().max(300).optional()
        }).optional(),
        disclaimer: z2.string().trim().max(600).optional(),
        integrationConfigured: z2.boolean().optional()
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid service item." });
        return;
      }
      try {
        const result = await withDbMutation(async (db) => {
          const validCats = /* @__PURE__ */ new Set([
            ...SERVICE_CATEGORIES,
            ...(db.serviceCategories || []).map((c) => c.name)
          ]);
          const cleanCategory = stripControls(parsed.data.category);
          if (!validCats.has(cleanCategory)) {
            const err = new Error(`Category '${cleanCategory}' is not configured in Service Categories.`);
            err.statusCode = 400;
            throw err;
          }
          const cleanName = stripControls(parsed.data.name);
          const cleanSlug = slugifyServiceName(parsed.data.slug || cleanName);
          const duplicate = db.services.find(
            (s) => s.name.trim().toLowerCase() === cleanName.toLowerCase() || (s.slug || slugifyServiceName(s.name)).toLowerCase() === cleanSlug
          );
          if (duplicate) {
            const err = new Error(
              `Duplicate service prevented: '${duplicate.name}' (/${duplicate.slug}) already exists in the standalone catalogue.`
            );
            err.statusCode = 409;
            throw err;
          }
          const nowIso = (/* @__PURE__ */ new Date()).toISOString();
          const basePrice = parsed.data.oneTimePrice ?? parsed.data.setupFee ?? parsed.data.recurringFee ?? parsed.data.packagePrice ?? 0;
          const srv = {
            id: `srv-${crypto4.randomBytes(4).toString("hex")}`,
            ...parsed.data,
            name: cleanName,
            slug: cleanSlug,
            category: cleanCategory,
            benefits: parsed.data.benefits.map(stripControls).filter(Boolean),
            deliverables: parsed.data.deliverables.map(stripControls).filter(Boolean),
            workProcess: parsed.data.workProcess.map(stripControls).filter(Boolean),
            oneTimePrice: parsed.data.oneTimePrice ?? parsed.data.setupFee,
            monthlyPrice: parsed.data.monthlyPrice ?? parsed.data.recurringFee,
            addons: [],
            sortOrder: db.services.length + 1,
            menuOrder: parsed.data.menuOrder ?? db.services.length + 1,
            showInMenu: parsed.data.showInMenu ?? true,
            updatedAt: nowIso,
            priceHistory: [
              {
                previousPrice: 0,
                newPrice: basePrice,
                changedAt: nowIso,
                changedBy: req.suiteUser.name,
                changedByEmail: req.suiteUser.email,
                priceField: "Initial Base Rate",
                note: "Initial service creation"
              }
            ]
          };
          db.services.push(srv);
          appendAuditLog(db, {
            actorId: req.suiteUser.id,
            actorName: req.suiteUser.name,
            actorRole: req.suiteUser.role,
            action: "CREATE_SERVICE_ITEM",
            targetId: srv.id,
            summary: `Added standalone service '${srv.name}' (/${srv.slug}) under ${srv.category}.`
          });
          const oneTimeVal = srv.oneTimePrice ?? srv.setupFee ?? 0;
          const monthlyVal = srv.monthlyPrice ?? srv.recurringFee ?? srv.packagePrice ?? 0;
          const alertEntry = await dispatchNotification(db, {
            event: "service_added",
            subject: `[AKYIN Admin Alert] New Service Added: ${srv.name}`,
            body: [
              "AKYIN Service Catalogue Alert \u2014 New Service Added",
              "",
              `Service Name: ${srv.name} (${srv.id})`,
              `Slug: /services/${srv.slug}`,
              `Category: ${srv.category}`,
              `Pricing Model: ${srv.pricingModel} | Billing Cycle: ${srv.billingCycle}`,
              `One-Time / Setup Fee: INR ${oneTimeVal.toLocaleString("en-IN")}`,
              `Monthly / Package Price: INR ${monthlyVal.toLocaleString("en-IN")}`,
              srv.unitRate ? `Usage Rate: INR ${srv.unitRate.toFixed(2)}/${srv.unitLabel || "unit"}` : "Usage Rate: N/A",
              `GST: ${srv.gstEnabled ? `${srv.gstRate}%` : "Exempt"}`,
              `Status: ${srv.active ? "Active" : "Disabled"}`,
              "",
              `Authorizing Admin: ${req.suiteUser.name} (${req.suiteUser.role})`,
              `Authorizing Admin Email: ${req.suiteUser.email}`,
              `Timestamp: ${nowIso}`
            ].join("\n")
          });
          return { service: srv, notification: alertEntry };
        });
        res.status(201).json(result);
      } catch (err) {
        res.status(err?.statusCode || 400).json({ error: err?.message || "Service creation failed." });
      }
    }
  );
  app.post(
    "/api/suite/services/:serviceId/duplicate",
    requireAuth,
    requirePermission("services"),
    async (req, res) => {
      const serviceId = String(req.params.serviceId || "");
      try {
        const result = await withDbMutation(async (db) => {
          const original = db.services.find((s) => s.id === serviceId);
          if (!original) {
            const err = new Error("Service item not found.");
            err.statusCode = 404;
            throw err;
          }
          const nowIso = (/* @__PURE__ */ new Date()).toISOString();
          const copyId = `srv-${crypto4.randomBytes(4).toString("hex")}`;
          const copySuffix = copyId.replace(/^srv-/, "").slice(0, 4);
          const currentPrice = original.oneTimePrice ?? original.setupFee ?? original.recurringFee ?? original.packagePrice ?? 0;
          const duplicated = {
            ...JSON.parse(JSON.stringify(original)),
            id: copyId,
            name: `${original.name} (Draft ${copySuffix})`,
            slug: `${original.slug || slugifyServiceName(original.name)}-draft-${copySuffix}`,
            active: false,
            showInMenu: false,
            sortOrder: db.services.length + 1,
            menuOrder: db.services.length + 1,
            updatedAt: nowIso,
            priceHistory: [
              {
                previousPrice: 0,
                newPrice: currentPrice,
                changedAt: nowIso,
                changedBy: req.suiteUser.name,
                changedByEmail: req.suiteUser.email,
                priceField: "Duplicated Base Rate",
                note: `Duplicated from '${original.name}' (${original.id})`
              }
            ]
          };
          db.services.push(duplicated);
          appendAuditLog(db, {
            actorId: req.suiteUser.id,
            actorName: req.suiteUser.name,
            actorRole: req.suiteUser.role,
            action: "DUPLICATE_SERVICE_ITEM",
            targetId: copyId,
            summary: `Duplicated service '${original.name}' as '${duplicated.name}'.`
          });
          const alertEntry = await dispatchNotification(db, {
            event: "service_added",
            subject: `[AKYIN Admin Alert] New Service Duplicated: ${duplicated.name}`,
            body: [
              "AKYIN Service Catalogue Alert \u2014 Service Duplicated & Added",
              "",
              `New Service Name: ${duplicated.name} (${duplicated.id})`,
              `Duplicated From: ${original.name} (${original.id})`,
              `Category: ${duplicated.category}`,
              `One-Time / Setup Fee: INR ${(duplicated.oneTimePrice ?? duplicated.setupFee ?? 0).toLocaleString("en-IN")}`,
              `Monthly / Package Price: INR ${(duplicated.monthlyPrice ?? duplicated.recurringFee ?? duplicated.packagePrice ?? 0).toLocaleString("en-IN")}`,
              "",
              `Authorizing Admin: ${req.suiteUser.name} (${req.suiteUser.role})`,
              `Authorizing Admin Email: ${req.suiteUser.email}`,
              `Timestamp: ${nowIso}`
            ].join("\n")
          });
          return { service: duplicated, notification: alertEntry };
        });
        res.status(201).json(result);
      } catch (err) {
        res.status(err?.statusCode || 400).json({ error: err?.message || "Duplication failed." });
      }
    }
  );
  app.patch(
    "/api/suite/services/:serviceId",
    requireAuth,
    requirePermission("services"),
    async (req, res) => {
      const serviceId = String(req.params.serviceId || "");
      try {
        const result = await withDbMutation(async (db) => {
          const srv = db.services.find((s) => s.id === serviceId);
          if (!srv) {
            const err = new Error("Service item not found.");
            err.statusCode = 404;
            throw err;
          }
          const b = req.body || {};
          const oldPrimaryPrice = srv.oneTimePrice ?? srv.setupFee ?? srv.recurringFee ?? srv.packagePrice ?? 0;
          const beforePrices = {
            oneTime: srv.oneTimePrice ?? srv.setupFee ?? 0,
            monthly: srv.monthlyPrice ?? srv.recurringFee ?? srv.packagePrice ?? 0,
            packagePrice: srv.packagePrice ?? 0,
            includedUnits: srv.includedUnits ?? 0,
            unitRate: srv.unitRate ?? 0,
            additionalUnitRate: srv.additionalUnitRate ?? 0,
            additionalDeliverableCharge: srv.additionalDeliverableCharge ?? 0,
            gstEnabled: Boolean(srv.gstEnabled),
            gstRate: srv.gstRate ?? 18,
            aed: JSON.stringify(srv.internationalPricing?.aed || {}),
            usd: JSON.stringify(srv.internationalPricing?.usd || {})
          };
          if (typeof b.name === "string" && b.name.trim()) {
            const cleanName = stripControls(b.name);
            const dupName = db.services.find(
              (s) => s.id !== serviceId && s.name.trim().toLowerCase() === cleanName.toLowerCase()
            );
            if (dupName) {
              const err = new Error(`Service name '${cleanName}' is already assigned to another service.`);
              err.statusCode = 409;
              throw err;
            }
            srv.name = cleanName;
          }
          if (typeof b.slug === "string" && b.slug.trim()) {
            const cleanSlug = slugifyServiceName(b.slug);
            const dupSlug = db.services.find(
              (s) => s.id !== serviceId && (s.slug || "").toLowerCase() === cleanSlug
            );
            if (dupSlug) {
              const err = new Error(`Service URL slug '${cleanSlug}' is already in use.`);
              err.statusCode = 409;
              throw err;
            }
            srv.slug = cleanSlug;
          }
          if (typeof b.category === "string" && b.category.trim()) {
            const validCats = /* @__PURE__ */ new Set([
              ...SERVICE_CATEGORIES,
              ...(db.serviceCategories || []).map((c) => c.name)
            ]);
            const cleanCat = stripControls(b.category);
            if (validCats.has(cleanCat)) {
              srv.category = cleanCat;
            }
          }
          if (typeof b.description === "string") srv.description = stripControls(b.description);
          if (Array.isArray(b.benefits)) {
            srv.benefits = b.benefits.map((d) => stripControls(String(d))).filter(Boolean);
          }
          if (Array.isArray(b.deliverables)) {
            srv.deliverables = b.deliverables.map((d) => stripControls(String(d))).filter(Boolean);
          }
          if (Array.isArray(b.workProcess)) {
            srv.workProcess = b.workProcess.map((d) => stripControls(String(d))).filter(Boolean);
          }
          if (typeof b.menuOrder === "number" && Number.isFinite(b.menuOrder)) {
            srv.menuOrder = Math.max(1, Math.floor(b.menuOrder));
          }
          if (typeof b.showInMenu === "boolean") {
            srv.showInMenu = b.showInMenu;
          }
          if (b.pricingModel === "fixed" || b.pricingModel === "custom") {
            srv.pricingModel = b.pricingModel;
          }
          if (typeof b.setupFee === "number" && Number.isFinite(b.setupFee)) {
            srv.setupFee = round2(Math.max(0, b.setupFee));
          }
          if (typeof b.recurringFee === "number" && Number.isFinite(b.recurringFee)) {
            srv.recurringFee = round2(Math.max(0, b.recurringFee));
          }
          if (typeof b.oneTimePrice === "number" && Number.isFinite(b.oneTimePrice)) {
            srv.oneTimePrice = round2(Math.max(0, b.oneTimePrice));
            if (b.setupFee === void 0 && srv.setupFee !== void 0) {
              srv.setupFee = srv.oneTimePrice;
            }
          }
          if (typeof b.monthlyPrice === "number" && Number.isFinite(b.monthlyPrice)) {
            srv.monthlyPrice = round2(Math.max(0, b.monthlyPrice));
            if (b.recurringFee === void 0 && srv.recurringFee !== void 0) {
              srv.recurringFee = srv.monthlyPrice;
            }
          }
          if (b.revisionLimit !== void 0) {
            srv.revisionLimit = typeof b.revisionLimit === "number" ? b.revisionLimit : stripControls(String(b.revisionLimit));
          }
          if (typeof b.additionalDeliverableCharge === "number" && Number.isFinite(b.additionalDeliverableCharge)) {
            srv.additionalDeliverableCharge = round2(Math.max(0, b.additionalDeliverableCharge));
          }
          if (typeof b.subscriptionDuration === "string") {
            srv.subscriptionDuration = stripControls(b.subscriptionDuration);
          }
          if (typeof b.renewalTerms === "string") {
            srv.renewalTerms = stripControls(b.renewalTerms);
          }
          if (typeof b.cancellationPolicy === "string") {
            srv.cancellationPolicy = stripControls(b.cancellationPolicy);
          }
          if (typeof b.transactionalSmsEnabled === "boolean") {
            srv.transactionalSmsEnabled = b.transactionalSmsEnabled;
          }
          if (b.billingCycle === "one-time" || b.billingCycle === "monthly" || b.billingCycle === "quarterly" || b.billingCycle === "custom") {
            srv.billingCycle = b.billingCycle;
          }
          if (typeof b.packagePrice === "number" && Number.isFinite(b.packagePrice)) {
            srv.packagePrice = round2(Math.max(0, b.packagePrice));
            if (b.recurringFee === void 0) {
              srv.recurringFee = srv.packagePrice;
            }
          }
          if (typeof b.includedUnits === "number" && Number.isFinite(b.includedUnits)) {
            srv.includedUnits = Math.max(0, Math.floor(b.includedUnits));
          }
          if (typeof b.unitLabel === "string") {
            srv.unitLabel = stripControls(b.unitLabel);
          }
          if (typeof b.unitRate === "number" && Number.isFinite(b.unitRate)) {
            srv.unitRate = round2(Math.max(0, b.unitRate));
          }
          if (typeof b.additionalUnitRate === "number" && Number.isFinite(b.additionalUnitRate)) {
            srv.additionalUnitRate = round2(Math.max(0, b.additionalUnitRate));
          }
          if (b.internationalPricing && typeof b.internationalPricing === "object") {
            const nextIntl = {
              ...srv.internationalPricing || {}
            };
            for (const curKey of ["aed", "usd"]) {
              const tier = b.internationalPricing[curKey];
              if (tier && typeof tier === "object") {
                nextIntl[curKey] = {
                  ...nextIntl[curKey] || {},
                  ...typeof tier.setupFee === "number" && Number.isFinite(tier.setupFee) ? { setupFee: round2(Math.max(0, tier.setupFee)) } : {},
                  ...typeof tier.packagePrice === "number" && Number.isFinite(tier.packagePrice) ? { packagePrice: round2(Math.max(0, tier.packagePrice)) } : {},
                  ...typeof tier.unitRate === "number" && Number.isFinite(tier.unitRate) ? { unitRate: round2(Math.max(0, tier.unitRate)) } : {},
                  ...typeof tier.additionalUnitRate === "number" && Number.isFinite(tier.additionalUnitRate) ? { additionalUnitRate: round2(Math.max(0, tier.additionalUnitRate)) } : {}
                };
              }
            }
            if (typeof b.internationalPricing.notes === "string") {
              nextIntl.notes = stripControls(b.internationalPricing.notes);
            }
            srv.internationalPricing = nextIntl;
          }
          if (typeof b.disclaimer === "string") {
            srv.disclaimer = stripControls(b.disclaimer);
          }
          if (typeof b.integrationConfigured === "boolean") {
            srv.integrationConfigured = b.integrationConfigured;
          }
          if (typeof b.gstEnabled === "boolean") srv.gstEnabled = b.gstEnabled;
          if (typeof b.gstRate === "number" && Number.isFinite(b.gstRate)) {
            srv.gstRate = Math.min(100, Math.max(0, b.gstRate));
          }
          if (typeof b.deliveryPeriod === "string") srv.deliveryPeriod = stripControls(b.deliveryPeriod);
          if (typeof b.active === "boolean") srv.active = b.active;
          const afterPrices = {
            oneTime: srv.oneTimePrice ?? srv.setupFee ?? 0,
            monthly: srv.monthlyPrice ?? srv.recurringFee ?? srv.packagePrice ?? 0,
            packagePrice: srv.packagePrice ?? 0,
            includedUnits: srv.includedUnits ?? 0,
            unitRate: srv.unitRate ?? 0,
            additionalUnitRate: srv.additionalUnitRate ?? 0,
            additionalDeliverableCharge: srv.additionalDeliverableCharge ?? 0,
            gstEnabled: Boolean(srv.gstEnabled),
            gstRate: srv.gstRate ?? 18,
            aed: JSON.stringify(srv.internationalPricing?.aed || {}),
            usd: JSON.stringify(srv.internationalPricing?.usd || {})
          };
          const priceChanges = [];
          if (beforePrices.oneTime !== afterPrices.oneTime) {
            priceChanges.push(
              `One-Time / Setup Price: INR ${beforePrices.oneTime.toLocaleString("en-IN")} -> INR ${afterPrices.oneTime.toLocaleString("en-IN")}`
            );
          }
          if (beforePrices.monthly !== afterPrices.monthly) {
            priceChanges.push(
              `Monthly / Package Price: INR ${beforePrices.monthly.toLocaleString("en-IN")} -> INR ${afterPrices.monthly.toLocaleString("en-IN")}`
            );
          }
          if (beforePrices.packagePrice !== afterPrices.packagePrice && beforePrices.monthly === afterPrices.monthly) {
            priceChanges.push(
              `Package Price: INR ${beforePrices.packagePrice.toLocaleString("en-IN")} -> INR ${afterPrices.packagePrice.toLocaleString("en-IN")}`
            );
          }
          if (beforePrices.includedUnits !== afterPrices.includedUnits) {
            priceChanges.push(
              `Included Units (${srv.unitLabel || "units"}): ${beforePrices.includedUnits.toLocaleString("en-IN")} -> ${afterPrices.includedUnits.toLocaleString("en-IN")}`
            );
          }
          if (beforePrices.unitRate !== afterPrices.unitRate) {
            priceChanges.push(
              `Per-Unit Usage Rate: INR ${beforePrices.unitRate.toFixed(2)} -> INR ${afterPrices.unitRate.toFixed(2)}`
            );
          }
          if (beforePrices.additionalUnitRate !== afterPrices.additionalUnitRate) {
            priceChanges.push(
              `Additional Unit Rate: INR ${beforePrices.additionalUnitRate.toFixed(2)} -> INR ${afterPrices.additionalUnitRate.toFixed(2)}`
            );
          }
          if (beforePrices.additionalDeliverableCharge !== afterPrices.additionalDeliverableCharge) {
            priceChanges.push(
              `Additional Deliverable Charge: INR ${beforePrices.additionalDeliverableCharge.toLocaleString("en-IN")} -> INR ${afterPrices.additionalDeliverableCharge.toLocaleString("en-IN")}`
            );
          }
          if (beforePrices.gstEnabled !== afterPrices.gstEnabled || beforePrices.gstRate !== afterPrices.gstRate) {
            priceChanges.push(
              `GST Configuration: ${beforePrices.gstEnabled ? `${beforePrices.gstRate}%` : "Exempt"} -> ${afterPrices.gstEnabled ? `${afterPrices.gstRate}%` : "Exempt"}`
            );
          }
          if (beforePrices.aed !== afterPrices.aed) {
            priceChanges.push("AED International Tier Pricing updated");
          }
          if (beforePrices.usd !== afterPrices.usd) {
            priceChanges.push("USD International Tier Pricing updated");
          }
          const nowIso = (/* @__PURE__ */ new Date()).toISOString();
          const newPrimaryPrice = srv.oneTimePrice ?? srv.setupFee ?? srv.recurringFee ?? srv.packagePrice ?? 0;
          const auditNote = typeof b.priceChangeNote === "string" && b.priceChangeNote.trim() ? stripControls(b.priceChangeNote) : priceChanges.length > 0 ? priceChanges.join("; ") : "Service price updated via admin catalogue";
          if (oldPrimaryPrice !== newPrimaryPrice || priceChanges.length > 0) {
            if (!srv.priceHistory) srv.priceHistory = [];
            const prevHistPrice = oldPrimaryPrice !== newPrimaryPrice ? oldPrimaryPrice : beforePrices.monthly !== afterPrices.monthly ? beforePrices.monthly : beforePrices.unitRate !== afterPrices.unitRate ? beforePrices.unitRate : oldPrimaryPrice;
            const nextHistPrice = oldPrimaryPrice !== newPrimaryPrice ? newPrimaryPrice : beforePrices.monthly !== afterPrices.monthly ? afterPrices.monthly : beforePrices.unitRate !== afterPrices.unitRate ? afterPrices.unitRate : newPrimaryPrice;
            srv.priceHistory.push({
              previousPrice: prevHistPrice,
              newPrice: nextHistPrice,
              changedAt: nowIso,
              changedBy: req.suiteUser.name,
              changedByEmail: req.suiteUser.email,
              priceField: oldPrimaryPrice !== newPrimaryPrice ? "One-Time / Setup Price" : beforePrices.monthly !== afterPrices.monthly ? "Monthly Subscription Price" : beforePrices.unitRate !== afterPrices.unitRate ? "Per-Unit Rate" : "Service Pricing",
              note: auditNote
            });
          }
          srv.updatedAt = nowIso;
          appendAuditLog(db, {
            actorId: req.suiteUser.id,
            actorName: req.suiteUser.name,
            actorRole: req.suiteUser.role,
            action: "UPDATE_SERVICE_ITEM",
            targetId: srv.id,
            summary: priceChanges.length > 0 ? `Updated '${srv.name}' pricing: ${priceChanges.join("; ")}.` : `Updated '${srv.name}' (active=${srv.active}).`
          });
          let alertEntry;
          if (priceChanges.length > 0) {
            alertEntry = await dispatchNotification(db, {
              event: "service_price_updated",
              subject: `[AKYIN Admin Alert] Service Price Updated: ${srv.name}`,
              body: [
                "AKYIN Service Catalogue Alert \u2014 Manual Price Update",
                "",
                `Service Name: ${srv.name} (${srv.id})`,
                `Category: ${srv.category}`,
                "",
                "Summary of Changes:",
                ...priceChanges.map((line) => `- ${line}`),
                "",
                `Audit Note: ${auditNote}`,
                `Authorizing Admin: ${req.suiteUser.name} (${req.suiteUser.role})`,
                `Authorizing Admin Email: ${req.suiteUser.email}`,
                `Timestamp: ${nowIso}`
              ].join("\n")
            });
          }
          return { service: srv, notification: alertEntry };
        });
        res.json(result);
      } catch (err) {
        res.status(err?.statusCode || 400).json({ error: err?.message || "Service update failed." });
      }
    }
  );
  app.post(
    "/api/suite/services/bulk-update",
    requireAuth,
    requirePermission("services"),
    async (req, res) => {
      const schema = z2.object({
        serviceIds: z2.array(z2.string().trim().min(1).max(80)).min(1).max(200),
        action: z2.enum(["activate", "archive", "adjust_gst"]),
        gstEnabled: z2.boolean().optional(),
        gstRate: z2.number().finite().min(0).max(100).optional(),
        note: z2.string().trim().max(300).optional()
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid bulk service update payload." });
        return;
      }
      if (parsed.data.action === "adjust_gst" && parsed.data.gstRate === void 0 && parsed.data.gstEnabled === void 0) {
        res.status(400).json({ error: "Specify gstEnabled or gstRate when adjusting GST rates." });
        return;
      }
      try {
        const result = await withDbMutation(async (db) => {
          const targetSet = new Set(parsed.data.serviceIds);
          const nowIso = (/* @__PURE__ */ new Date()).toISOString();
          const updatedServices = [];
          const gstChangeSummaries = [];
          for (const srv of db.services) {
            if (!targetSet.has(srv.id)) continue;
            if (parsed.data.action === "activate") {
              srv.active = true;
              srv.updatedAt = nowIso;
              updatedServices.push(srv);
            } else if (parsed.data.action === "archive") {
              srv.active = false;
              srv.updatedAt = nowIso;
              updatedServices.push(srv);
            } else if (parsed.data.action === "adjust_gst") {
              const prevGstEnabled = srv.gstEnabled;
              const prevGstRate = srv.gstRate;
              const nextGstRate = parsed.data.gstRate !== void 0 ? round2(parsed.data.gstRate) : srv.gstRate;
              const nextGstEnabled = parsed.data.gstEnabled !== void 0 ? parsed.data.gstEnabled : nextGstRate > 0;
              srv.gstEnabled = nextGstEnabled;
              srv.gstRate = nextGstEnabled ? nextGstRate : 0;
              srv.updatedAt = nowIso;
              if (prevGstEnabled !== srv.gstEnabled || prevGstRate !== srv.gstRate) {
                if (!srv.priceHistory) srv.priceHistory = [];
                const beforeLabel = prevGstEnabled ? `${prevGstRate}%` : "Exempt";
                const afterLabel = srv.gstEnabled ? `${srv.gstRate}%` : "Exempt";
                const noteText = parsed.data.note ? stripControls(parsed.data.note) : `Bulk GST adjustment: ${beforeLabel} -> ${afterLabel}`;
                srv.priceHistory.push({
                  previousPrice: prevGstEnabled ? prevGstRate : 0,
                  newPrice: srv.gstEnabled ? srv.gstRate : 0,
                  changedAt: nowIso,
                  changedBy: req.suiteUser.name,
                  changedByEmail: req.suiteUser.email,
                  priceField: "GST Rate (%)",
                  note: noteText
                });
                gstChangeSummaries.push(`${srv.name} (${beforeLabel} -> ${afterLabel})`);
              }
              updatedServices.push(srv);
            }
          }
          if (updatedServices.length === 0) {
            const err = new Error("No matching services found for bulk update.");
            err.statusCode = 404;
            throw err;
          }
          const actionSummary = parsed.data.action === "activate" ? `Bulk activated ${updatedServices.length} service(s).` : parsed.data.action === "archive" ? `Bulk archived ${updatedServices.length} service(s).` : `Bulk adjusted GST on ${updatedServices.length} service(s): ${gstChangeSummaries.join(", ") || "rate confirmed"}.`;
          appendAuditLog(db, {
            actorId: req.suiteUser.id,
            actorName: req.suiteUser.name,
            actorRole: req.suiteUser.role,
            action: "BULK_UPDATE_SERVICES",
            targetId: `${updatedServices.length}_SERVICES`,
            summary: actionSummary
          });
          let alertEntry;
          if (parsed.data.action === "adjust_gst" && gstChangeSummaries.length > 0) {
            alertEntry = await dispatchNotification(db, {
              event: "service_price_updated",
              subject: `[AKYIN Admin Alert] Bulk GST Update Applied to ${gstChangeSummaries.length} Service(s)`,
              body: [
                "AKYIN Service Catalogue Alert \u2014 Bulk GST Adjustment",
                "",
                `Updated Services (${gstChangeSummaries.length}):`,
                ...gstChangeSummaries.map((line) => `- ${line}`),
                "",
                `Authorizing Admin: ${req.suiteUser.name} (${req.suiteUser.role})`,
                `Authorizing Admin Email: ${req.suiteUser.email}`,
                `Timestamp: ${nowIso}`
              ].join("\n")
            });
          }
          return {
            updatedCount: updatedServices.length,
            services: updatedServices,
            notification: alertEntry
          };
        });
        res.json(result);
      } catch (err) {
        res.status(err?.statusCode || 400).json({ error: err?.message || "Bulk service update failed." });
      }
    }
  );
  app.delete(
    "/api/suite/services/:serviceId",
    requireAuth,
    requirePermission("services"),
    async (req, res) => {
      const serviceId = String(req.params.serviceId || "");
      await withDbMutation((db) => {
        db.services = db.services.filter((s) => s.id !== serviceId);
        appendAuditLog(db, {
          actorId: req.suiteUser.id,
          actorName: req.suiteUser.name,
          actorRole: req.suiteUser.role,
          action: "DELETE_SERVICE_ITEM",
          targetId: serviceId,
          summary: `Removed service ${serviceId}.`
        });
      });
      res.json({ ok: true });
    }
  );
  app.get(
    "/api/suite/quotations",
    requireAuth,
    requirePermission("quotations"),
    (_req, res) => {
      const db = readDb();
      res.json({ quotations: db.quotations });
    }
  );
  app.post(
    "/api/suite/quotations",
    requireAuth,
    requirePermission("quotations"),
    async (req, res) => {
      const schema = z2.object({
        leadId: z2.string().trim().max(80).optional().default(""),
        clientId: z2.string().trim().max(80).optional().default(""),
        customerName: z2.string().trim().min(2).max(120),
        companyName: z2.string().trim().max(120).optional().default(""),
        customerEmail: z2.string().trim().email().max(160),
        customerPhone: z2.string().trim().max(30).optional().default(""),
        cityCountry: z2.string().trim().max(120).optional().default(""),
        currency: z2.enum(["INR", "AED", "USD"]).default("INR"),
        items: z2.array(quotationLineItemSchema).min(1),
        discountAmount: z2.number().finite().min(0).default(0),
        gstEnabled: z2.boolean().default(true),
        gstRate: z2.number().finite().min(0).max(100).default(18),
        paymentTerms: z2.string().trim().max(500).default("50% advance on acceptance, 50% on delivery."),
        expiryDate: z2.string().trim().max(20).optional().default(""),
        scopeOfWork: z2.string().trim().max(3e3).default(""),
        exclusions: z2.string().trim().max(2e3).default("Ad spend paid directly to Meta/Google by client."),
        notes: z2.string().trim().max(2e3).default(""),
        status: z2.enum(["DRAFT", "SENT"]).default("SENT")
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid quotation." });
        return;
      }
      const totals = calculateQuotationTotals(
        parsed.data.items,
        parsed.data.discountAmount,
        parsed.data.gstEnabled,
        parsed.data.gstRate
      );
      const quote = await withDbMutation(async (db) => {
        const nowIso = (/* @__PURE__ */ new Date()).toISOString();
        const id = `QT-${crypto4.randomBytes(4).toString("hex").toUpperCase()}`;
        const seq = String(db.quotations.length + 1).padStart(4, "0");
        const quoteNumber = `AKY-QT-${(/* @__PURE__ */ new Date()).getUTCFullYear()}-${seq}`;
        const shareToken = crypto4.randomBytes(16).toString("hex");
        const created = {
          id,
          quoteNumber,
          version: 1,
          shareToken,
          leadId: parsed.data.leadId,
          clientId: parsed.data.clientId,
          customerName: stripControls(parsed.data.customerName),
          companyName: stripControls(parsed.data.companyName),
          customerEmail: stripControls(parsed.data.customerEmail),
          customerPhone: stripControls(parsed.data.customerPhone),
          cityCountry: stripControls(parsed.data.cityCountry),
          currency: parsed.data.currency,
          items: totals.items,
          subtotal: totals.subtotal,
          discountAmount: totals.discountAmount,
          taxableAmount: totals.taxableAmount,
          gstEnabled: parsed.data.gstEnabled,
          gstRate: parsed.data.gstEnabled ? parsed.data.gstRate : 0,
          gstAmount: totals.gstAmount,
          grandTotal: totals.grandTotal,
          paymentTerms: stripControls(parsed.data.paymentTerms),
          expiryDate: parsed.data.expiryDate || new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10),
          scopeOfWork: stripControls(parsed.data.scopeOfWork),
          exclusions: stripControls(parsed.data.exclusions),
          notes: stripControls(parsed.data.notes),
          status: parsed.data.status,
          customerResponseNote: "",
          respondedAt: "",
          convertedInvoiceId: "",
          revisions: [
            {
              version: 1,
              savedAt: nowIso,
              savedBy: req.suiteUser.name,
              grandTotal: totals.grandTotal,
              note: "Initial quotation created"
            }
          ],
          createdBy: req.suiteUser.name,
          createdAt: nowIso,
          updatedAt: nowIso
        };
        db.quotations.unshift(created);
        if (created.leadId) {
          const lead = db.leads.find((l) => l.leadId === created.leadId);
          if (lead && (lead.stage === "NEW" || lead.stage === "CONTACTED" || lead.stage === "QUALIFIED")) {
            lead.stage = "PROPOSAL SENT";
            lead.expectedDealValue = created.grandTotal;
            lead.updatedAt = nowIso;
          }
        }
        appendAuditLog(db, {
          actorId: req.suiteUser.id,
          actorName: req.suiteUser.name,
          actorRole: req.suiteUser.role,
          action: "CREATE_QUOTATION",
          targetId: quoteNumber,
          summary: `Created ${quoteNumber} (${created.currency} ${created.grandTotal}).`
        });
        await dispatchNotification(db, {
          event: "quotation_created",
          recipient: created.customerEmail,
          subject: `AKYIN Ventures Quotation ${quoteNumber} for ${created.companyName || created.customerName}`,
          body: `Quotation ${quoteNumber} (${created.currency} ${created.grandTotal}) is ready for review.
Public Portal Link: https://akyin.com/quote?token=${shareToken}`
        });
        return created;
      });
      res.status(201).json({ quotation: quote });
    }
  );
  app.patch(
    "/api/suite/quotations/:id",
    requireAuth,
    requirePermission("quotations"),
    async (req, res) => {
      const id = String(req.params.id || "");
      try {
        const updated = await withDbMutation((db) => {
          const qt = db.quotations.find((q) => q.id === id);
          if (!qt) {
            const err = new Error("Quotation not found.");
            err.statusCode = 404;
            throw err;
          }
          const b = req.body || {};
          const nowIso = (/* @__PURE__ */ new Date()).toISOString();
          if (Array.isArray(b.items) && b.items.length > 0) {
            const totals = calculateQuotationTotals(
              b.items,
              typeof b.discountAmount === "number" ? b.discountAmount : qt.discountAmount,
              typeof b.gstEnabled === "boolean" ? b.gstEnabled : qt.gstEnabled,
              typeof b.gstRate === "number" ? b.gstRate : qt.gstRate
            );
            qt.items = totals.items;
            qt.subtotal = totals.subtotal;
            qt.discountAmount = totals.discountAmount;
            qt.taxableAmount = totals.taxableAmount;
            qt.gstAmount = totals.gstAmount;
            qt.grandTotal = totals.grandTotal;
            qt.version += 1;
            qt.revisions.unshift({
              version: qt.version,
              savedAt: nowIso,
              savedBy: req.suiteUser.name,
              grandTotal: qt.grandTotal,
              note: stripControls(String(b.revisionNote || `Updated v${qt.version}`))
            });
          }
          if (typeof b.status === "string") qt.status = b.status;
          if (typeof b.notes === "string") qt.notes = stripControls(b.notes);
          if (typeof b.paymentTerms === "string") qt.paymentTerms = stripControls(b.paymentTerms);
          if (typeof b.expiryDate === "string") qt.expiryDate = b.expiryDate;
          qt.updatedAt = nowIso;
          appendAuditLog(db, {
            actorId: req.suiteUser.id,
            actorName: req.suiteUser.name,
            actorRole: req.suiteUser.role,
            action: "UPDATE_QUOTATION",
            targetId: qt.quoteNumber,
            summary: `Updated ${qt.quoteNumber} v${qt.version} (status=${qt.status}).`
          });
          return qt;
        });
        res.json({ quotation: updated });
      } catch (err) {
        res.status(err?.statusCode || 400).json({ error: err?.message || "Quotation update failed." });
      }
    }
  );
  app.post(
    "/api/suite/quotations/:id/convert-invoice",
    requireAuth,
    requirePermission("quotations"),
    async (req, res) => {
      const id = String(req.params.id || "");
      const paymentTypeSchema = z2.object({
        paymentType: z2.enum(["advance", "full", "balance"]).default("full"),
        dueDate: z2.string().trim().max(20).optional().default(""),
        serviceCategory: z2.string().trim().max(100).optional()
      });
      const parsed = paymentTypeSchema.safeParse(req.body || {});
      const opts = parsed.success ? parsed.data : { paymentType: "full", dueDate: "", serviceCategory: void 0 };
      try {
        const result = await withDbMutation((db) => {
          const qt = db.quotations.find((q) => q.id === id);
          if (!qt) {
            const err = new Error("Quotation not found.");
            err.statusCode = 404;
            throw err;
          }
          if (qt.convertedInvoiceId) {
            const existing = db.invoices.find((i) => i.id === qt.convertedInvoiceId);
            if (existing) return { invoice: existing, quotation: qt };
          }
          const nowIso = (/* @__PURE__ */ new Date()).toISOString();
          const invId = `INV-${crypto4.randomBytes(4).toString("hex").toUpperCase()}`;
          const seq = String(db.invoices.length + 1).padStart(4, "0");
          const invoiceNumber = `AKY-INV-${(/* @__PURE__ */ new Date()).getUTCFullYear()}-${seq}`;
          const linkedLead = qt.leadId ? db.leads.find((l) => l.leadId === qt.leadId) : void 0;
          let resolvedCategory = opts.serviceCategory?.trim() || "";
          if (!resolvedCategory) {
            const firstMatchedService = qt.items.map((item) => db.services.find((s) => s.id === item.serviceId)).find(Boolean);
            if (firstMatchedService) {
              resolvedCategory = firstMatchedService.category;
            } else {
              const joinedTitles = qt.items.map((i) => i.title.toLowerCase()).join(" ");
              if (joinedTitles.includes("whatsapp")) {
                resolvedCategory = "WhatsApp Business Messaging";
              } else if (joinedTitles.includes("bulk sms") || joinedTitles.includes("sms credit")) {
                resolvedCategory = "Bulk SMS Marketing";
              } else {
                resolvedCategory = "Digital marketing";
              }
            }
          }
          const inv = {
            id: invId,
            invoiceNumber,
            quotationId: qt.id,
            quotationNumber: qt.quoteNumber,
            leadId: qt.leadId,
            clientId: qt.clientId,
            serviceCategory: resolvedCategory,
            leadSource: linkedLead?.campaignSource || "Website",
            customerName: qt.customerName,
            companyName: qt.companyName,
            customerEmail: qt.customerEmail,
            customerPhone: qt.customerPhone,
            currency: qt.currency,
            paymentType: opts.paymentType,
            subtotal: qt.subtotal,
            discountAmount: qt.discountAmount,
            taxableAmount: qt.taxableAmount,
            gstEnabled: qt.gstEnabled,
            gstRate: qt.gstRate,
            gstAmount: qt.gstAmount,
            totalAmount: qt.grandTotal,
            paidAmount: 0,
            refundedAmount: 0,
            status: "UNPAID",
            dueDate: opts.dueDate || new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10),
            notes: `Generated from ${qt.quoteNumber}`,
            createdAt: nowIso,
            updatedAt: nowIso
          };
          db.invoices.unshift(inv);
          qt.convertedInvoiceId = invId;
          qt.updatedAt = nowIso;
          appendAuditLog(db, {
            actorId: req.suiteUser.id,
            actorName: req.suiteUser.name,
            actorRole: req.suiteUser.role,
            action: "CONVERT_QUOTE_TO_INVOICE",
            targetId: invoiceNumber,
            summary: `Generated ${invoiceNumber} (${inv.currency} ${inv.totalAmount}) from ${qt.quoteNumber}.`
          });
          return { invoice: inv, quotation: qt };
        });
        res.status(201).json(result);
      } catch (err) {
        res.status(err?.statusCode || 400).json({ error: err?.message || "Conversion failed." });
      }
    }
  );
  app.get(
    "/api/suite/appointments",
    requireAuth,
    requirePermission("appointments"),
    (_req, res) => {
      const db = readDb();
      res.json({
        appointments: db.appointments,
        availability: db.availability,
        blockedDates: db.blockedDates
      });
    }
  );
  app.post(
    "/api/suite/appointments",
    requireAuth,
    requirePermission("appointments"),
    async (req, res) => {
      const b = req.body || {};
      const resData = await withDbMutation((db) => {
        const nowIso = (/* @__PURE__ */ new Date()).toISOString();
        const existingIdx = b.bookingId ? db.appointments.findIndex((a) => a.bookingId === b.bookingId) : -1;
        if (existingIdx === -1) {
          const bookingId = `AKY-${crypto4.randomBytes(3).toString("hex").toUpperCase()}`;
          const rec = {
            bookingId,
            createdAt: nowIso,
            updatedAt: nowIso,
            customerName: stripControls(String(b.customerName || "Client")),
            phone: stripControls(String(b.phone || "")),
            email: stripControls(String(b.email || "")),
            city: stripControls(String(b.city || "")),
            country: stripControls(String(b.country || "India")),
            businessName: stripControls(String(b.businessName || "")),
            website: stripControls(String(b.website || "")),
            businessStage: stripControls(String(b.businessStage || "Early Stage (0\u20132 Years)")),
            consultationTopic: stripControls(
              String(b.consultationTopic || "Business Clarity & Strategic Direction")
            ),
            businessChallenge: stripControls(String(b.businessChallenge || "")),
            appointmentDate: String(b.appointmentDate || getIstDateParts().isoDate),
            startTime: String(b.startTime || "18:00"),
            endTime: String(b.endTime || "18:30"),
            paymentStatus: b.paymentStatus || "Payment Awaited",
            bookingStatus: b.bookingStatus || "Pending",
            adminNotes: stripControls(String(b.adminNotes || "")),
            calendarEventId: stripControls(String(b.calendarEventId || ""))
          };
          db.appointments.unshift(rec);
          appendAuditLog(db, {
            actorId: req.suiteUser.id,
            actorName: req.suiteUser.name,
            actorRole: req.suiteUser.role,
            action: "CREATE_APPOINTMENT",
            targetId: bookingId,
            summary: `Created appointment ${bookingId}.`
          });
          return { appointment: rec };
        }
        const cur = db.appointments[existingIdx];
        db.appointments[existingIdx] = {
          ...cur,
          ...b,
          updatedAt: nowIso
        };
        appendAuditLog(db, {
          actorId: req.suiteUser.id,
          actorName: req.suiteUser.name,
          actorRole: req.suiteUser.role,
          action: "UPDATE_APPOINTMENT",
          targetId: cur.bookingId,
          summary: `Status=${b.bookingStatus || cur.bookingStatus}, Payment=${b.paymentStatus || cur.paymentStatus}.`
        });
        return { appointment: db.appointments[existingIdx] };
      });
      res.json(resData);
    }
  );
  app.put(
    "/api/suite/availability",
    requireAuth,
    requirePermission("appointments"),
    async (req, res) => {
      const rules = Array.isArray(req.body?.rules) ? req.body.rules : [];
      const activeCount = await withDbMutation((db) => {
        db.availability = rules;
        appendAuditLog(db, {
          actorId: req.suiteUser.id,
          actorName: req.suiteUser.name,
          actorRole: req.suiteUser.role,
          action: "UPDATE_AVAILABILITY",
          targetId: "WEEKLY_SCHEDULE",
          summary: `Updated ${rules.length} weekly consultation schedule rules.`
        });
        return db.appointments.filter(
          (a) => a.bookingStatus === "Confirmed" || a.bookingStatus === "Pending"
        ).length;
      });
      res.json({ updated: rules.length, activeBookingsProtected: activeCount });
    }
  );
  app.post(
    "/api/suite/blocked-dates",
    requireAuth,
    requirePermission("appointments"),
    async (req, res) => {
      const date = String(req.body?.date || "");
      const reason = stripControls(String(req.body?.reason || "Unavailable"));
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        res.status(400).json({ error: "Valid YYYY-MM-DD date required." });
        return;
      }
      const conflicts = await withDbMutation((db) => {
        if (!db.blockedDates.some((b) => b.date === date)) {
          db.blockedDates.push({
            date,
            reason,
            createdBy: req.suiteUser.name,
            createdAt: (/* @__PURE__ */ new Date()).toISOString()
          });
        }
        appendAuditLog(db, {
          actorId: req.suiteUser.id,
          actorName: req.suiteUser.name,
          actorRole: req.suiteUser.role,
          action: "BLOCK_DATE",
          targetId: date,
          summary: reason
        });
        return db.appointments.filter(
          (a) => a.appointmentDate === date && (a.bookingStatus === "Confirmed" || a.bookingStatus === "Pending")
        ).length;
      });
      res.json({ blocked: date, conflictWarningCount: conflicts });
    }
  );
  app.delete(
    "/api/suite/blocked-dates/:date",
    requireAuth,
    requirePermission("appointments"),
    async (req, res) => {
      const date = String(req.params.date || "");
      await withDbMutation((db) => {
        db.blockedDates = db.blockedDates.filter((b) => b.date !== date);
        appendAuditLog(db, {
          actorId: req.suiteUser.id,
          actorName: req.suiteUser.name,
          actorRole: req.suiteUser.role,
          action: "UNBLOCK_DATE",
          targetId: date,
          summary: "Unblocked consultation date."
        });
      });
      res.json({ unblocked: date });
    }
  );
  app.get(
    "/api/suite/payments",
    requireAuth,
    requirePermission("payments"),
    (_req, res) => {
      const db = readDb();
      const creds = getRazorpayCredentials();
      res.json({
        invoices: db.invoices,
        payments: db.payments,
        razorpayConfigured: Boolean(creds),
        razorpayMode: creds?.mode || "test",
        webhookConfigured: Boolean(
          creds?.webhookSecret || (process.env.RAZORPAY_WEBHOOK_SECRET || "").trim()
        ),
        uaeGatewayEnabled: Boolean(db.websiteSettings?.uaeGatewayEnabled)
      });
    }
  );
  app.post(
    "/api/suite/invoices",
    requireAuth,
    requirePermission("payments"),
    async (req, res) => {
      const schema = z2.object({
        clientId: z2.string().trim().max(80).optional().default(""),
        customerName: z2.string().trim().min(2).max(120),
        companyName: z2.string().trim().max(120).optional().default(""),
        customerEmail: z2.string().trim().email().max(160),
        customerPhone: z2.string().trim().max(30).optional().default(""),
        serviceCategory: z2.string().trim().min(2).max(100),
        leadSource: z2.string().trim().max(40).optional().default("Website"),
        currency: z2.enum(["INR", "AED", "USD"]).default("INR"),
        paymentType: z2.enum(["advance", "full", "consultation", "recurring", "balance"]).default("full"),
        amount: z2.number().finite().positive().max(1e8),
        gstEnabled: z2.boolean().default(true),
        gstRate: z2.number().finite().min(0).max(100).default(18),
        dueDate: z2.string().trim().max(20).optional().default(""),
        notes: z2.string().trim().max(1e3).optional().default("")
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid invoice payload." });
        return;
      }
      const totals = calculateQuotationTotals(
        [
          {
            id: "line-1",
            title: parsed.data.serviceCategory,
            qty: 1,
            unitPrice: parsed.data.amount
          }
        ],
        0,
        parsed.data.gstEnabled,
        parsed.data.gstRate
      );
      const invoice = await withDbMutation((db) => {
        const nowIso = (/* @__PURE__ */ new Date()).toISOString();
        const invId = `INV-${crypto4.randomBytes(4).toString("hex").toUpperCase()}`;
        const seq = String(db.invoices.length + 1).padStart(4, "0");
        const invoiceNumber = `AKY-INV-${(/* @__PURE__ */ new Date()).getUTCFullYear()}-${seq}`;
        const src = parsed.data.leadSource;
        const created = {
          id: invId,
          invoiceNumber,
          quotationId: "",
          quotationNumber: "",
          leadId: "",
          clientId: parsed.data.clientId,
          serviceCategory: stripControls(parsed.data.serviceCategory),
          leadSource: LEAD_SOURCES.includes(src) ? src : "Website",
          customerName: stripControls(parsed.data.customerName),
          companyName: stripControls(parsed.data.companyName),
          customerEmail: stripControls(parsed.data.customerEmail),
          customerPhone: stripControls(parsed.data.customerPhone),
          currency: parsed.data.currency,
          paymentType: parsed.data.paymentType,
          subtotal: totals.subtotal,
          discountAmount: 0,
          taxableAmount: totals.taxableAmount,
          gstEnabled: parsed.data.gstEnabled,
          gstRate: parsed.data.gstEnabled ? parsed.data.gstRate : 0,
          gstAmount: totals.gstAmount,
          totalAmount: totals.grandTotal,
          paidAmount: 0,
          refundedAmount: 0,
          status: "UNPAID",
          dueDate: parsed.data.dueDate || new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10),
          notes: stripControls(parsed.data.notes),
          createdAt: nowIso,
          updatedAt: nowIso
        };
        db.invoices.unshift(created);
        appendAuditLog(db, {
          actorId: req.suiteUser.id,
          actorName: req.suiteUser.name,
          actorRole: req.suiteUser.role,
          action: "CREATE_INVOICE",
          targetId: invoiceNumber,
          summary: `Issued invoice ${invoiceNumber} for ${created.currency} ${created.totalAmount}.`
        });
        return created;
      });
      res.status(201).json({ invoice });
    }
  );
  app.get(
    "/api/suite/subscriptions",
    requireAuth,
    requirePermission("payments"),
    (_req, res) => {
      const db = readDb();
      const monthlyServices = (db.services || []).filter((s) => {
        const monthlyVal = Number(s.monthlyPrice ?? s.recurringFee ?? 0) || 0;
        return s.active && (monthlyVal > 0 || s.billingCycle === "monthly" || s.category === "Business Creative & Documentation Services");
      }).sort((a, b) => a.sortOrder - b.sortOrder);
      const renewalInvoices = (db.invoices || []).filter((inv) => inv.paymentType === "recurring");
      res.json({
        subscriptions: db.subscriptions || [],
        monthlyServices,
        clients: db.clients || [],
        renewalInvoices
      });
    }
  );
  app.post(
    "/api/suite/subscriptions",
    requireAuth,
    requirePermission("payments"),
    async (req, res) => {
      const schema = z2.object({
        clientId: z2.string().trim().max(80).optional().default(""),
        customerName: z2.string().trim().min(2).max(120),
        companyName: z2.string().trim().max(120).optional().default(""),
        customerEmail: z2.string().trim().email().max(160),
        customerPhone: z2.string().trim().max(30).optional().default(""),
        serviceId: z2.string().trim().min(2).max(80),
        currency: z2.enum(["INR", "AED", "USD"]).default("INR"),
        monthlyAmount: z2.number().finite().positive().max(1e8).optional(),
        gstEnabled: z2.boolean().optional(),
        gstRate: z2.number().finite().min(0).max(100).optional(),
        billingCycleDay: z2.number().int().min(1).max(28).default(1),
        startDate: z2.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        nextBillingDate: z2.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        notes: z2.string().trim().max(600).optional().default("")
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid subscription payload." });
        return;
      }
      try {
        const created = await withDbMutation((db) => {
          const srv = db.services.find((s) => s.id === parsed.data.serviceId);
          if (!srv) {
            const err = new Error("Selected monthly service not found.");
            err.statusCode = 404;
            throw err;
          }
          const tierKey = parsed.data.currency === "AED" ? "aed" : parsed.data.currency === "USD" ? "usd" : null;
          const catalogMonthly = (tierKey && srv.internationalPricing?.[tierKey]?.packagePrice !== void 0 ? Number(srv.internationalPricing[tierKey].packagePrice) : void 0) ?? (Number(srv.monthlyPrice ?? srv.recurringFee ?? srv.packagePrice ?? 0) || 0);
          const monthlyAmount = round2(
            parsed.data.monthlyAmount && parsed.data.monthlyAmount > 0 ? parsed.data.monthlyAmount : catalogMonthly
          );
          if (monthlyAmount <= 0) {
            const err = new Error("Monthly billing amount must be greater than zero.");
            err.statusCode = 400;
            throw err;
          }
          const nowIso = (/* @__PURE__ */ new Date()).toISOString();
          const todayIso = getIstDateParts().isoDate;
          const startDate = parsed.data.startDate || todayIso;
          const nextBillingDate = parsed.data.nextBillingDate || startDate;
          const seq = String((db.subscriptions?.length || 0) + 1).padStart(4, "0");
          const sub = {
            id: `SUB-${crypto4.randomBytes(4).toString("hex").toUpperCase()}`,
            subscriptionCode: `AKY-SUB-${(/* @__PURE__ */ new Date()).getUTCFullYear()}-${seq}`,
            clientId: stripControls(parsed.data.clientId),
            customerName: stripControls(parsed.data.customerName),
            companyName: stripControls(parsed.data.companyName),
            customerEmail: stripControls(parsed.data.customerEmail).toLowerCase(),
            customerPhone: stripControls(parsed.data.customerPhone),
            serviceId: srv.id,
            serviceName: srv.name,
            serviceCategory: srv.category,
            currency: parsed.data.currency,
            monthlyAmount,
            gstEnabled: parsed.data.gstEnabled ?? srv.gstEnabled,
            gstRate: parsed.data.gstEnabled ?? srv.gstEnabled ? parsed.data.gstRate ?? srv.gstRate ?? 18 : 0,
            status: "ACTIVE",
            billingCycleDay: parsed.data.billingCycleDay,
            startDate,
            nextBillingDate,
            lastBilledAt: "",
            lastInvoiceId: "",
            lastInvoiceNumber: "",
            renewalCount: 0,
            notes: stripControls(parsed.data.notes),
            createdAt: nowIso,
            updatedAt: nowIso
          };
          if (!Array.isArray(db.subscriptions)) db.subscriptions = [];
          db.subscriptions.unshift(sub);
          appendAuditLog(db, {
            actorId: req.suiteUser.id,
            actorName: req.suiteUser.name,
            actorRole: req.suiteUser.role,
            action: "CREATE_SUBSCRIPTION",
            targetId: sub.subscriptionCode,
            summary: `Started recurring billing for ${sub.companyName || sub.customerName} on '${sub.serviceName}' (${sub.currency} ${sub.monthlyAmount}/mo).`
          });
          return sub;
        });
        res.status(201).json({ subscription: created });
      } catch (err) {
        res.status(err?.statusCode || 400).json({ error: err?.message || "Unable to create subscription." });
      }
    }
  );
  app.patch(
    "/api/suite/subscriptions/:subId/status",
    requireAuth,
    requirePermission("payments"),
    async (req, res) => {
      const subId = String(req.params.subId || "");
      const schema = z2.object({
        status: z2.enum(["ACTIVE", "PAUSED", "CANCELLED"]),
        note: z2.string().trim().max(300).optional()
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid status payload." });
        return;
      }
      try {
        const updated = await withDbMutation((db) => {
          const sub = (db.subscriptions || []).find((s) => s.id === subId);
          if (!sub) {
            const err = new Error("Subscription not found.");
            err.statusCode = 404;
            throw err;
          }
          const prevStatus = sub.status;
          sub.status = parsed.data.status;
          sub.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
          if (parsed.data.note) {
            sub.notes = stripControls(parsed.data.note);
          }
          appendAuditLog(db, {
            actorId: req.suiteUser.id,
            actorName: req.suiteUser.name,
            actorRole: req.suiteUser.role,
            action: "UPDATE_SUBSCRIPTION_STATUS",
            targetId: sub.subscriptionCode,
            summary: `Changed ${sub.customerName} (${sub.serviceName}) recurring billing status from ${prevStatus} to ${sub.status}.`
          });
          return sub;
        });
        res.json({ subscription: updated });
      } catch (err) {
        res.status(err?.statusCode || 400).json({ error: err?.message || "Unable to update subscription status." });
      }
    }
  );
  app.post(
    "/api/suite/subscriptions/:subId/trigger-renewal",
    requireAuth,
    requirePermission("payments"),
    async (req, res) => {
      const subId = String(req.params.subId || "");
      try {
        const result = await withDbMutation(async (db) => {
          const sub = (db.subscriptions || []).find((s) => s.id === subId);
          if (!sub) {
            const err = new Error("Subscription not found.");
            err.statusCode = 404;
            throw err;
          }
          if (sub.status !== "ACTIVE") {
            const err = new Error(
              `Cannot trigger renewal invoice while subscription is ${sub.status}. Resume billing first.`
            );
            err.statusCode = 400;
            throw err;
          }
          const totals = calculateQuotationTotals(
            [
              {
                id: "renewal-line-1",
                serviceId: sub.serviceId,
                title: `${sub.serviceName} \u2014 Monthly Renewal`,
                qty: 1,
                unitPrice: sub.monthlyAmount,
                billingType: "monthly"
              }
            ],
            0,
            sub.gstEnabled,
            sub.gstRate
          );
          const nowIso = (/* @__PURE__ */ new Date()).toISOString();
          const invId = `INV-${crypto4.randomBytes(4).toString("hex").toUpperCase()}`;
          const seq = String(db.invoices.length + 1).padStart(4, "0");
          const invoiceNumber = `AKY-INV-${(/* @__PURE__ */ new Date()).getUTCFullYear()}-${seq}`;
          const renewalCycleNumber = sub.renewalCount + 1;
          const createdInvoice = {
            id: invId,
            invoiceNumber,
            quotationId: "",
            quotationNumber: sub.subscriptionCode,
            leadId: "",
            clientId: sub.clientId,
            serviceCategory: sub.serviceCategory,
            leadSource: "Direct contact",
            customerName: sub.customerName,
            companyName: sub.companyName,
            customerEmail: sub.customerEmail,
            customerPhone: sub.customerPhone,
            currency: sub.currency,
            paymentType: "recurring",
            subtotal: totals.subtotal,
            discountAmount: 0,
            taxableAmount: totals.taxableAmount,
            gstEnabled: sub.gstEnabled,
            gstRate: sub.gstEnabled ? sub.gstRate : 0,
            gstAmount: totals.gstAmount,
            totalAmount: totals.grandTotal,
            paidAmount: 0,
            refundedAmount: 0,
            status: "UNPAID",
            dueDate: new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10),
            notes: `Manual renewal #${renewalCycleNumber} triggered for ${sub.serviceName} (${sub.subscriptionCode}) by ${req.suiteUser.name}.`,
            createdAt: nowIso,
            updatedAt: nowIso
          };
          db.invoices.unshift(createdInvoice);
          const baseParts = sub.nextBillingDate.split("-").map(Number);
          const baseDate = baseParts.length === 3 ? new Date(Date.UTC(baseParts[0], baseParts[1] - 1, baseParts[2])) : /* @__PURE__ */ new Date();
          const targetMonth = baseDate.getUTCMonth() + 1;
          const targetYear = baseDate.getUTCFullYear() + Math.floor(targetMonth / 12);
          const normMonth = targetMonth % 12;
          const maxDayInMonth = new Date(Date.UTC(targetYear, normMonth + 1, 0)).getUTCDate();
          const clampedDay = Math.min(sub.billingCycleDay || 1, maxDayInMonth);
          const nextIsoDate = new Date(Date.UTC(targetYear, normMonth, clampedDay)).toISOString().slice(0, 10);
          sub.renewalCount = renewalCycleNumber;
          sub.lastBilledAt = nowIso;
          sub.lastInvoiceId = createdInvoice.id;
          sub.lastInvoiceNumber = createdInvoice.invoiceNumber;
          sub.nextBillingDate = nextIsoDate;
          sub.updatedAt = nowIso;
          appendAuditLog(db, {
            actorId: req.suiteUser.id,
            actorName: req.suiteUser.name,
            actorRole: req.suiteUser.role,
            action: "TRIGGER_RENEWAL_INVOICE",
            targetId: createdInvoice.invoiceNumber,
            summary: `Triggered renewal invoice ${createdInvoice.invoiceNumber} (${createdInvoice.currency} ${createdInvoice.totalAmount}) for ${sub.subscriptionCode} (${sub.serviceName}).`
          });
          if (db.notificationSettings?.sendClientReceipts && sub.customerEmail) {
            await dispatchNotification(db, {
              event: "quotation_created",
              recipient: sub.customerEmail,
              subject: `[AKYIN Invoice] Monthly Renewal ${createdInvoice.invoiceNumber} \u2014 ${sub.serviceName}`,
              body: [
                `Hello ${sub.customerName},`,
                "",
                `A monthly renewal invoice (${createdInvoice.invoiceNumber}) has been generated for your recurring service:`,
                `Service: ${sub.serviceName}`,
                `Subscription Reference: ${sub.subscriptionCode}`,
                `Total Due (incl. taxes): ${createdInvoice.currency} ${createdInvoice.totalAmount.toLocaleString("en-IN")}`,
                `Due Date: ${createdInvoice.dueDate}`,
                "",
                "Thank you for working with AKYIN Ventures."
              ].join("\n")
            });
          }
          return { subscription: sub, invoice: createdInvoice };
        });
        res.status(201).json(result);
      } catch (err) {
        res.status(err?.statusCode || 400).json({ error: err?.message || "Unable to trigger renewal invoice." });
      }
    }
  );
  app.get(
    "/api/suite/subscriptions/reminders/status",
    requireAuth,
    requirePermission("payments"),
    (_req, res) => {
      const db = readDb();
      const scheduler = getSchedulerStatus();
      const upcomingCandidates = findUpcomingRenewals(db, 7);
      const reminderLogs = (db.notificationLogs || []).filter((l) => l.event === "subscription_renewal_reminder").slice(0, 20);
      res.json({
        scheduler,
        smtpConfigured: Boolean(getSmtpConfig()),
        reminderRuleEnabled: Boolean(db.notificationSettings?.events?.subscription_renewal_reminder),
        upcomingCandidates,
        reminderLogs
      });
    }
  );
  app.post(
    "/api/suite/subscriptions/reminders/run",
    requireAuth,
    requirePermission("payments"),
    async (req, res) => {
      const schema = z2.object({
        leadDays: z2.number().int().min(0).max(30).optional(),
        forceResend: z2.boolean().optional()
      });
      const parsed = schema.safeParse(req.body || {});
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid reminder run parameters." });
        return;
      }
      const result = await runSubscriptionRenewalReminderSweep({
        leadDays: parsed.data.leadDays,
        forceResend: parsed.data.forceResend,
        source: "manual",
        actorName: req.suiteUser.name
      });
      res.json(result);
    }
  );
  app.post(
    "/api/suite/invoices/:invoiceId/record-manual",
    requireAuth,
    requirePermission("payments"),
    async (req, res) => {
      const invoiceId = String(req.params.invoiceId || "");
      const schema = z2.object({
        amount: z2.number().finite().positive(),
        gateway: z2.enum(["manual_bank", "manual_uae_transfer", "cash"]).default("manual_bank"),
        mode: z2.enum(["live", "test"]).default("live"),
        gatewayFeeAmount: z2.number().finite().min(0).default(0),
        referenceNote: z2.string().trim().max(400).optional().default("")
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid manual payment." });
        return;
      }
      try {
        const result = await withDbMutation(async (db) => {
          const inv = db.invoices.find((i) => i.id === invoiceId);
          if (!inv) {
            const err = new Error("Invoice not found.");
            err.statusCode = 404;
            throw err;
          }
          const nowIso = (/* @__PURE__ */ new Date()).toISOString();
          const remaining = round2(Math.max(0, inv.totalAmount - inv.paidAmount));
          const appliedAmount = round2(Math.min(parsed.data.amount, remaining || parsed.data.amount));
          const gstRatio = inv.totalAmount > 0 ? inv.gstAmount / inv.totalAmount : 0;
          const payRec = {
            id: `PAY-${crypto4.randomBytes(4).toString("hex").toUpperCase()}`,
            invoiceId: inv.id,
            invoiceNumber: inv.invoiceNumber,
            quotationId: inv.quotationId,
            clientId: inv.clientId,
            customerName: inv.companyName || inv.customerName,
            customerEmail: inv.customerEmail,
            serviceCategory: inv.serviceCategory,
            leadSource: inv.leadSource,
            mode: parsed.data.mode,
            gateway: parsed.data.gateway,
            method: parsed.data.gateway,
            currency: inv.currency,
            amount: appliedAmount,
            gstPortion: round2(appliedAmount * gstRatio),
            gatewayFeeAmount: round2(parsed.data.gatewayFeeAmount),
            refundedAmount: 0,
            status: "manual_recorded",
            verified: true,
            razorpayOrderId: "",
            razorpayPaymentId: "",
            razorpaySignatureVerified: false,
            webhookEventIds: [],
            idempotencyKey: `manual:${crypto4.randomBytes(8).toString("hex")}`,
            notes: stripControls(parsed.data.referenceNote),
            createdAt: nowIso,
            capturedAt: nowIso,
            updatedAt: nowIso
          };
          db.payments.unshift(payRec);
          if (parsed.data.mode === "live") {
            inv.paidAmount = round2(inv.paidAmount + appliedAmount);
            recalculateInvoiceStatus(inv);
          }
          appendAuditLog(db, {
            actorId: req.suiteUser.id,
            actorName: req.suiteUser.name,
            actorRole: req.suiteUser.role,
            action: "RECORD_MANUAL_PAYMENT",
            targetId: inv.invoiceNumber,
            summary: `Recorded ${parsed.data.mode} ${parsed.data.gateway} settlement (${inv.currency} ${appliedAmount}).`
          });
          await dispatchNotification(db, {
            event: "payment_received",
            subject: `Manual Settlement Recorded: ${inv.invoiceNumber}`,
            body: `Invoice: ${inv.invoiceNumber}
Amount: ${inv.currency} ${appliedAmount}
Method: ${parsed.data.gateway}
Mode: ${parsed.data.mode}`
          });
          return { invoice: inv, payment: payRec };
        });
        res.status(201).json(result);
      } catch (err) {
        res.status(err?.statusCode || 400).json({ error: err?.message || "Manual settlement failed." });
      }
    }
  );
  app.post(
    "/api/suite/payments/:paymentId/refund",
    requireAuth,
    requirePermission("payments"),
    async (req, res) => {
      const paymentId = String(req.params.paymentId || "");
      const schema = z2.object({
        refundAmount: z2.number().finite().positive(),
        reason: z2.string().trim().max(300).optional().default("Client refund")
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Provide a valid positive refund amount." });
        return;
      }
      try {
        const result = await withDbMutation(async (db) => {
          const pay = db.payments.find((p) => p.id === paymentId);
          if (!pay) {
            const err = new Error("Payment record not found.");
            err.statusCode = 404;
            throw err;
          }
          const refundable = round2(Math.max(0, pay.amount - pay.refundedAmount));
          if (parsed.data.refundAmount > refundable) {
            const err = new Error(`Maximum refundable balance is ${refundable}.`);
            err.statusCode = 400;
            throw err;
          }
          const appliedRefund = round2(parsed.data.refundAmount);
          pay.refundedAmount = round2(pay.refundedAmount + appliedRefund);
          if (pay.refundedAmount >= pay.amount) {
            pay.status = "refunded";
          }
          pay.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
          if (pay.invoiceId && pay.mode === "live") {
            const inv = db.invoices.find((i) => i.id === pay.invoiceId);
            if (inv) {
              inv.refundedAmount = round2(inv.refundedAmount + appliedRefund);
              inv.paidAmount = round2(Math.max(0, inv.paidAmount - appliedRefund));
              recalculateInvoiceStatus(inv);
            }
          }
          appendAuditLog(db, {
            actorId: req.suiteUser.id,
            actorName: req.suiteUser.name,
            actorRole: req.suiteUser.role,
            action: "PROCESS_REFUND",
            targetId: pay.id,
            summary: `Refunded ${pay.currency} ${appliedRefund}: ${stripControls(parsed.data.reason)}.`
          });
          await dispatchNotification(db, {
            event: "refund_processed",
            subject: `Refund Issued: ${pay.id} (${pay.currency} ${appliedRefund})`,
            body: `Payment: ${pay.id}
Refund: ${pay.currency} ${appliedRefund}
Reason: ${parsed.data.reason}`
          });
          return { payment: pay };
        });
        res.json(result);
      } catch (err) {
        res.status(err?.statusCode || 400).json({ error: err?.message || "Refund failed." });
      }
    }
  );
  app.get(
    "/api/suite/reports/revenue",
    requireAuth,
    requirePermission("reports"),
    (req, res) => {
      const db = readDb();
      const preset = String(req.query.preset || "this_month");
      const report = computeRevenueReport(db, {
        preset,
        startDate: typeof req.query.startDate === "string" ? req.query.startDate : void 0,
        endDate: typeof req.query.endDate === "string" ? req.query.endDate : void 0,
        clientId: typeof req.query.clientId === "string" ? req.query.clientId : void 0,
        serviceCategory: typeof req.query.serviceCategory === "string" ? req.query.serviceCategory : void 0,
        leadSource: typeof req.query.leadSource === "string" ? req.query.leadSource : void 0,
        paymentMethod: typeof req.query.paymentMethod === "string" ? req.query.paymentMethod : void 0
      });
      res.json(report);
    }
  );
  app.get(
    "/api/suite/reports/export.csv",
    requireAuth,
    requirePermission("reports"),
    (req, res) => {
      const db = readDb();
      const preset = String(req.query.preset || "this_month");
      const report = computeRevenueReport(db, {
        preset,
        startDate: typeof req.query.startDate === "string" ? req.query.startDate : void 0,
        endDate: typeof req.query.endDate === "string" ? req.query.endDate : void 0
      });
      const header = [
        "Payment ID",
        "Captured At",
        "Invoice",
        "Customer",
        "Service Category",
        "Lead Source",
        "Mode",
        "Method",
        "Status",
        "Verified",
        "Currency",
        "Amount",
        "GST Portion",
        "Gateway Fee",
        "Refunded"
      ].map(sanitizeCsvCell).join(",");
      const rows = report.matchingPayments.map(
        (p) => [
          p.id,
          p.capturedAt || p.createdAt,
          p.invoiceNumber,
          p.customerName,
          p.serviceCategory,
          p.leadSource,
          p.mode,
          p.method,
          p.status,
          p.verified ? "Yes" : "No",
          p.currency,
          p.amount,
          p.gstPortion,
          p.gatewayFeeAmount,
          p.refundedAmount
        ].map(sanitizeCsvCell).join(",")
      );
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="akyin-revenue-${preset}.csv"`);
      res.send([header, ...rows].join("\n"));
    }
  );
  app.get(
    "/api/suite/reports/recurring-insights",
    requireAuth,
    requirePermission("reports"),
    (req, res) => {
      const rawMonths = Number(req.query.months || 12);
      const monthsWindow = Number.isFinite(rawMonths) ? Math.min(24, Math.max(3, Math.floor(rawMonths))) : 12;
      const db = readDb();
      const insights = computeRecurringRevenueInsights(db, monthsWindow);
      res.json(insights);
    }
  );
  app.get(
    "/api/suite/settings",
    requireAuth,
    requirePermission("overview"),
    (_req, res) => {
      const db = readDb();
      res.json({
        websiteSettings: db.websiteSettings,
        notificationSettings: db.notificationSettings,
        notificationLogs: db.notificationLogs.slice(0, 80),
        smtpConfigured: Boolean(getSmtpConfig())
      });
    }
  );
  app.put(
    "/api/suite/settings",
    requireAuth,
    async (req, res) => {
      if (req.suiteUser.role !== "Super Admin" && req.suiteUser.role !== "Sales Manager") {
        res.status(403).json({ error: "Insufficient permission to edit website settings." });
        return;
      }
      const patch = req.body || {};
      const updated = await withDbMutation((db) => {
        for (const [k, v] of Object.entries(patch)) {
          if (k === "reportedClientsCount") {
            const num = Number(v);
            if (Number.isFinite(num) && num >= 0) {
              db.websiteSettings.reportedClientsCount = Math.round(num);
            }
          } else if (k === "uaeGatewayEnabled") {
            db.websiteSettings.uaeGatewayEnabled = Boolean(v);
          } else if (typeof v === "string") {
            db.websiteSettings[k] = stripControls(v);
          }
        }
        appendAuditLog(db, {
          actorId: req.suiteUser.id,
          actorName: req.suiteUser.name,
          actorRole: req.suiteUser.role,
          action: "UPDATE_WEBSITE_SETTINGS",
          targetId: "WEBSITE_SETTINGS",
          summary: `Updated keys: ${Object.keys(patch).join(", ")}`
        });
        return db.websiteSettings;
      });
      res.json({ websiteSettings: updated });
    }
  );
  app.get(
    "/api/suite/users",
    requireAuth,
    requireRole(["Super Admin"]),
    (_req, res) => {
      const db = readDb();
      res.json({
        users: db.users.map(toPublicUser),
        roles: USER_ROLES
      });
    }
  );
  app.post(
    "/api/suite/users",
    requireAuth,
    requireRole(["Super Admin"]),
    async (req, res) => {
      const schema = z2.object({
        name: z2.string().trim().min(2).max(100),
        email: z2.string().trim().email().max(160),
        role: z2.enum(["Super Admin", "Sales Manager", "Finance Manager", "Staff"]),
        password: z2.string().min(8).max(128)
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid user payload." });
        return;
      }
      try {
        const user = await withDbMutation((db) => {
          const cleanEmail = parsed.data.email.toLowerCase();
          if (db.users.some((u) => u.email.toLowerCase() === cleanEmail)) {
            const err = new Error("A user with this email already exists.");
            err.statusCode = 409;
            throw err;
          }
          const nowIso = (/* @__PURE__ */ new Date()).toISOString();
          const created = {
            id: `usr-${crypto4.randomBytes(4).toString("hex")}`,
            name: stripControls(parsed.data.name),
            email: cleanEmail,
            role: parsed.data.role,
            active: true,
            passwordHash: hashPassword(parsed.data.password),
            createdAt: nowIso,
            updatedAt: nowIso,
            lastLoginAt: ""
          };
          db.users.push(created);
          appendAuditLog(db, {
            actorId: req.suiteUser.id,
            actorName: req.suiteUser.name,
            actorRole: req.suiteUser.role,
            action: "CREATE_USER",
            targetId: created.id,
            summary: `Created ${created.role} account for ${created.email}.`
          });
          return toPublicUser(created);
        });
        res.status(201).json({ user });
      } catch (err) {
        res.status(err?.statusCode || 400).json({ error: err?.message || "Unable to create user." });
      }
    }
  );
  app.patch(
    "/api/suite/users/:userId",
    requireAuth,
    requireRole(["Super Admin"]),
    async (req, res) => {
      const userId = String(req.params.userId || "");
      try {
        const updated = await withDbMutation((db) => {
          const user = db.users.find((u) => u.id === userId);
          if (!user) {
            const err = new Error("User not found.");
            err.statusCode = 404;
            throw err;
          }
          const b = req.body || {};
          if (typeof b.active === "boolean") {
            if (!b.active && user.id === req.suiteUser.id) {
              const err = new Error("You cannot deactivate your own active session.");
              err.statusCode = 400;
              throw err;
            }
            user.active = b.active;
          }
          if (typeof b.role === "string" && USER_ROLES.includes(b.role)) {
            user.role = b.role;
          }
          if (typeof b.resetPassword === "string" && b.resetPassword.length >= 8) {
            user.passwordHash = hashPassword(b.resetPassword);
          }
          user.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
          appendAuditLog(db, {
            actorId: req.suiteUser.id,
            actorName: req.suiteUser.name,
            actorRole: req.suiteUser.role,
            action: "UPDATE_USER",
            targetId: user.id,
            summary: `Updated user ${user.email}: role=${user.role}, active=${user.active}.`
          });
          return toPublicUser(user);
        });
        res.json({ user: updated });
      } catch (err) {
        res.status(err?.statusCode || 400).json({ error: err?.message || "User update failed." });
      }
    }
  );
  app.get(
    "/api/suite/audit-logs",
    requireAuth,
    requirePermission("security_audit"),
    (_req, res) => {
      const db = readDb();
      res.json({
        auditLogs: db.auditLogs,
        notificationSettings: db.notificationSettings,
        notificationLogs: db.notificationLogs,
        smtpConfigured: Boolean(getSmtpConfig())
      });
    }
  );
  app.put(
    "/api/suite/notifications",
    requireAuth,
    requirePermission("security_audit"),
    async (req, res) => {
      const b = req.body || {};
      if (typeof b.ownerNotificationEmail === "string" && b.ownerNotificationEmail.trim()) {
        const emailCheck = z2.string().trim().email().max(160).safeParse(b.ownerNotificationEmail);
        if (!emailCheck.success) {
          res.status(400).json({ error: "Please provide a valid administrator notification email." });
          return;
        }
      }
      const updated = await withDbMutation((db) => {
        if (typeof b.ownerNotificationEmail === "string") {
          db.notificationSettings.ownerNotificationEmail = stripControls(b.ownerNotificationEmail).toLowerCase();
        }
        if (typeof b.sendClientReceipts === "boolean") {
          db.notificationSettings.sendClientReceipts = b.sendClientReceipts;
        }
        if (b.events && typeof b.events === "object") {
          for (const [k, val] of Object.entries(b.events)) {
            if (k in db.notificationSettings.events && typeof val === "boolean") {
              db.notificationSettings.events[k] = val;
            }
          }
        }
        appendAuditLog(db, {
          actorId: req.suiteUser.id,
          actorName: req.suiteUser.name,
          actorRole: req.suiteUser.role,
          action: "UPDATE_NOTIFICATIONS",
          targetId: "NOTIFICATION_SETTINGS",
          summary: "Updated automated email notification toggles."
        });
        return db.notificationSettings;
      });
      res.json({ notificationSettings: updated });
    }
  );
  app.post(
    "/api/suite/notifications/test",
    requireAuth,
    requirePermission("security_audit"),
    async (req, res) => {
      const result = await withDbMutation(async (db) => {
        const nowIso = (/* @__PURE__ */ new Date()).toISOString();
        const log = await dispatchNotification(db, {
          event: "service_price_updated",
          subject: "[AKYIN SMTP Test] Automated Admin Price & Service Notification Verified",
          body: [
            "This is a live SMTP configuration test from AKYIN Business Suite.",
            "",
            `Triggered By: ${req.suiteUser.name} (${req.suiteUser.role})`,
            `Authorizing Admin Email: ${req.suiteUser.email}`,
            `Owner Notification Recipient: ${db.notificationSettings.ownerNotificationEmail || "connect@akyin.com"}`,
            `Timestamp: ${nowIso}`
          ].join("\n")
        });
        return {
          notification: log,
          smtpConfigured: Boolean(getSmtpConfig())
        };
      });
      res.json(result);
    }
  );
}

// server/seoRenderer.ts
var DOMAIN = "https://akyin.com";
var DEFAULT_ROBOTS = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
function escapeHtml(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function safeJsonLd(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}
function formatInr(amount) {
  return `\u20B9${Math.round(amount).toLocaleString("en-IN")}`;
}
var ROUTE_SEO_META = {
  "/": {
    title: "AKYIN Ventures \u2014 Multi-Business Group & Marketing Agency",
    description: "AKYIN Ventures is a diversified multi-business group & marketing agency spanning publishing, automotive growth, retail, AI tools, B2B trade, and advisory.",
    h1: "AKYIN Ventures \u2014 Multi-Business Group & Full-Service Standalone Marketing Agency",
    summary: "AKYIN Ventures operates core divisions across digital marketing, automotive dealership growth, publishing, and fashion retail while offering modular standalone services for businesses across India and the UAE.",
    highlights: [
      { label: "Explore Standalone Marketing Services", href: "/ventures/marketing" },
      { label: "Automotive Dealership Marketing", href: "/marketing/automotive" },
      { label: "Transparent INR Pricing & Quotation Builder", href: "/pricing" },
      { label: "Book 1-on-1 Business Advisory", href: "/advisory" }
    ],
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://akyin.com/#organization",
          name: "AKYIN Ventures",
          alternateName: ["AKYIN", "AKYIN MARKETINGS"],
          url: "https://akyin.com/",
          logo: "https://akyin.com/assets/aistudio/akyin_logo_clean.png",
          description: "Multi-business parent group and full-service marketing agency operating core ventures in publishing, performance marketing, and fashion retail while supporting 58+ client businesses across AI utilities, B2B wholesale trade, automotive growth, and business consulting.",
          email: "connect@akyin.com",
          founder: { "@type": "Person", name: "Shaikh Nazir" },
          areaServed: ["IN", "AE"],
          sameAs: [
            "https://www.facebook.com/profile.php?id=61595204474890",
            "https://youtube.com/@akyinmarketing?si=hgB_tEfczt79H7wW",
            "https://www.instagram.com/akyinventures/",
            "https://whatsapp.com/channel/0029VbCz1qOJ3jurZuI6cM3U",
            "https://www.amazon.com/stores/author/B0DT3L2T15/allbooks",
            "https://play.google.com/store/books/details/Akyin_s_THE_DISCIPLINE_CODE?id=seHuEQAAQBAJ",
            "https://aicalc.in"
          ],
          contactPoint: [
            {
              "@type": "ContactPoint",
              url: "https://whatsapp.com/channel/0029VbCz1qOJ3jurZuI6cM3U",
              email: "connect@akyin.com",
              contactType: "customer service",
              availableLanguage: ["English", "Hindi", "Telugu"]
            }
          ]
        },
        {
          "@type": "LocalBusiness",
          "@id": "https://akyin.com/#localbusiness",
          name: "AKYIN Ventures & Marketing Agency",
          image: "https://akyin.com/assets/aistudio/akyin_logo_clean.png",
          url: "https://akyin.com/",
          email: "connect@akyin.com",
          priceRange: "\u20B93,000 - \u20B999,998",
          address: {
            "@type": "PostalAddress",
            addressCountry: "IN"
          },
          sameAs: [
            "https://www.facebook.com/profile.php?id=61595204474890",
            "https://youtube.com/@akyinmarketing?si=hgB_tEfczt79H7wW",
            "https://www.instagram.com/akyinventures/",
            "https://whatsapp.com/channel/0029VbCz1qOJ3jurZuI6cM3U"
          ]
        },
        {
          "@type": "WebSite",
          "@id": "https://akyin.com/#website",
          url: "https://akyin.com/",
          name: "AKYIN Ventures",
          publisher: { "@id": "https://akyin.com/#organization" }
        },
        {
          "@type": "Service",
          name: "AKYIN Standalone Marketing, Lead Qualification & Business Services",
          provider: { "@id": "https://akyin.com/#organization" },
          serviceType: "Performance Marketing, Creative Design & Lead Qualification",
          areaServed: ["IN", "AE", "US", "GB"],
          offers: [
            {
              "@type": "Offer",
              name: "Meta Ads Management",
              price: "40000",
              priceCurrency: "INR",
              url: "https://akyin.com/services/meta-ads-management"
            },
            {
              "@type": "Offer",
              name: "Lead Filtering & Qualification",
              price: "24000",
              priceCurrency: "INR",
              url: "https://akyin.com/services/lead-filtering"
            },
            {
              "@type": "Offer",
              name: "Bulk SMS Marketing (10,000 Credits)",
              price: "3000",
              priceCurrency: "INR",
              url: "https://akyin.com/services/bulk-sms"
            },
            {
              "@type": "Offer",
              name: "WhatsApp Business Messaging Setup (One-Time Setup)",
              price: "4999",
              priceCurrency: "INR",
              url: "https://akyin.com/services/whatsapp-business-setup"
            },
            {
              "@type": "Offer",
              name: "Commercial & Dealership Sales Training Workshop",
              price: "50000",
              priceCurrency: "INR",
              url: "https://akyin.com/services/commercial-dealership-sales-training"
            },
            {
              "@type": "Offer",
              name: "1-on-1 Business Advisory Consultation (30 min IST)",
              price: "3998",
              priceCurrency: "INR",
              url: "https://akyin.com/advisory"
            }
          ]
        },
        {
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What businesses operate under AKYIN Ventures?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "AKYIN Ventures operates core ventures including AKYIN Publishing, AKYIN MARKETINGS (Agency), and AKYIN Store / AKYIN Thrift, alongside client showcases including AICalc.in, Kartigo.online, BizNXT.online, and Budget Bazaar."
              }
            },
            {
              "@type": "Question",
              name: "Are AKYIN Marketing services sold as forced bundles or standalone options?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Every AKYIN Marketing service across all 10 service categories\u2014from Automotive Marketing, Google & Meta Ads, and Lead Filtering to Logo Design, PPT Decks, Excel Reporting, Bulk SMS, and WhatsApp Business Setup\u2014is strictly standalone and selectable individually."
              }
            },
            {
              "@type": "Question",
              name: "How does ad billing work with AKYIN Marketing?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Advertising budgets are paid directly by clients to Meta or Google. AKYIN fees cover strategy, campaign setup, creative production, lead qualification, and showroom sales training."
              }
            }
          ]
        }
      ]
    }
  },
  "/about": {
    title: "About AKYIN Ventures \u2014 Vision, Ventures & Track Record",
    description: "Corporate profile of AKYIN Ventures: 16+ years across marketing, publishing, retail, AI tools, and B2B commerce serving India and UAE businesses.",
    h1: "About AKYIN Ventures \u2014 16+ Years of Commercial, Automotive & Digital Execution",
    summary: "Founded by Shaikh Nazir, AKYIN Ventures unites practical commercial leadership with independent ventures spanning performance marketing, automotive sales training, publishing, retail, and B2B trade.",
    highlights: [
      { label: "Explore Our Ventures", href: "/ventures" },
      { label: "Standalone Marketing Services", href: "/ventures/marketing" },
      { label: "Contact AKYIN Ventures", href: "/contact" }
    ],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "About AKYIN Ventures",
      url: "https://akyin.com/about",
      description: "Corporate profile of AKYIN Ventures: 16+ years across marketing, publishing, retail, AI tools, and B2B commerce serving India and UAE businesses.",
      mainEntity: {
        "@type": "Corporation",
        name: "AKYIN Ventures",
        url: "https://akyin.com"
      }
    }
  },
  "/ventures": {
    title: "Our Ventures & Client Ecosystem | AKYIN Ventures",
    description: "Explore AKYIN Publishing, AKYIN Marketing Agency, AKYIN Store, and showcased platforms AICalc.in, Kartigo.online, BizNXT.online, and Budget Bazaar.",
    h1: "AKYIN Ventures Portfolio & Client Business Ecosystem",
    summary: "Discover operating ventures owned and incubated by AKYIN Ventures alongside digital commerce and business platforms we actively support.",
    highlights: [
      { label: "AKYIN MARKETINGS (Agency)", href: "/ventures/marketing" },
      { label: "AKYIN Publishing", href: "/ventures/publishing" },
      { label: "AKYIN Store / Thrift", href: "/ventures/store" },
      { label: "AICalc.in", href: "/ventures/aicalc" }
    ],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Our Ventures & Client Ecosystem \u2014 AKYIN Ventures",
      url: "https://akyin.com/ventures",
      description: "Explore core operating ventures under AKYIN Ventures and featured client showcases."
    }
  },
  "/ventures/publishing": {
    title: "AKYIN Publishing \u2014 Books & Digital Guides | AKYIN.com",
    description: "Explore eight published books on Amazon and three digital productivity & finance kits including The Discipline Code and The Money OS by AKYIN Publishing.",
    h1: "AKYIN Publishing \u2014 Books, Practical Guides & Productivity Systems",
    summary: "Independent publishing house by Akyin S. featuring titles on execution discipline, resilience, dopamine recovery, and personal finance toolkits across Amazon, Google Play Books, and Gumroad.",
    highlights: [
      { label: "Back to Our Ventures", href: "/ventures" },
      { label: "1-on-1 Business Advisory", href: "/advisory" }
    ],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "AKYIN Publishing",
      url: "https://akyin.com/ventures/publishing",
      parentOrganization: { "@type": "Corporation", name: "AKYIN Ventures" }
    }
  },
  "/ventures/marketing": {
    title: "AKYIN MARKETINGS \u2014 Standalone Marketing & Business Services",
    description: "Full-service standalone agency catalogue across 10 specialized categories: Automotive Marketing, Digital Ads, Social Media, Creative Design, Video, PPT, Excel, Bulk SMS, WhatsApp Setup, CRM & Training.",
    h1: "AKYIN MARKETINGS \u2014 10-Category Standalone Service Marketplace",
    summary: "Every marketing, creative, messaging, reporting, and advisory capability at AKYIN MARKETINGS is offered strictly standalone\u2014zero forced bundles\u2014so businesses select only what drives measurable outcomes.",
    highlights: [
      { label: "Automotive Marketing Division", href: "/marketing/automotive" },
      { label: "Logo Design Service", href: "/services/logo-design" },
      { label: "Bulk SMS Marketing", href: "/services/bulk-sms" },
      { label: "WhatsApp Business Setup", href: "/services/whatsapp-business-setup" },
      { label: "Interactive Quotation Builder", href: "/pricing#quotation-builder" }
    ],
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ProfessionalService",
          "@id": "https://akyin.com/ventures/marketing#service",
          name: "AKYIN Marketing Agency",
          alternateName: "AKYIN MARKETINGS",
          url: "https://akyin.com/ventures/marketing",
          parentOrganization: { "@type": "Corporation", name: "AKYIN Ventures" },
          description: "Standalone agency marketplace spanning 10 categories: Automotive Marketing, Digital Marketing, Social Media Management, Creative & Graphic Design, Video & Content, Business Documents, Excel Reporting, Messaging, Lead Management & CRM, and Consulting & Training.",
          priceRange: "\u20B93,000 - \u20B999,998",
          areaServed: ["IN", "AE", "US", "GB"],
          email: "connect@akyin.com"
        },
        {
          "@type": "FAQPage",
          "@id": "https://akyin.com/ventures/marketing#agency-faq",
          name: "AKYIN MARKETINGS \u2014 Standalone Agency Services, Messaging & Pricing FAQ",
          mainEntity: [
            {
              "@type": "Question",
              name: "What service categories does AKYIN MARKETINGS offer?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "AKYIN MARKETINGS organizes all services cleanly across 10 standalone categories: Automotive Marketing, Digital Marketing, Social Media Management, Creative and Graphic Design, Video and Content Services, Business Documents and Presentations, Excel and Reporting Services, Messaging and Communication, Lead Management and CRM, and Business Consulting and Training."
              }
            },
            {
              "@type": "Question",
              name: "Can clients purchase individual services without mandatory bundles?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Every service is 100% standalone. There are no compulsory combined packages\u2014clients can commission a single logo design, presentation deck, Meta Ads retainer, lead qualification workflow, Bulk SMS pack, or WhatsApp setup independently."
              }
            },
            {
              "@type": "Question",
              name: "How are Bulk SMS Marketing and WhatsApp Business Messaging priced?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Bulk SMS Marketing is offered as a \u20B93,000 package including 10,000 SMS credits (\u20B90.30 effective per SMS, additional usage at admin-configured rate). WhatsApp Business Messaging separates the \u20B94,999 one-time setup fee from \u20B91.50 per message usage. Messaging rates are subject to provider charges, applicable taxes, message category, destination, and delivery conditions confirmed in the written quotation."
              }
            },
            {
              "@type": "Question",
              name: "How are Lead Generation and Lead Filtering separated?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Online Lead Generation captures fresh buyer enquiries via Meta or Google Ads (ad spend paid directly by clients to platforms), while Lead Filtering and Qualification vets existing incoming enquiries by phone and intent scoring as a separate standalone service."
              }
            }
          ]
        }
      ]
    }
  },
  "/marketing/automotive": {
    title: "Car Dealership Marketing & Test-Drive Leads | AKYIN",
    description: "Book qualified showroom test drives, not cold clicks. Targeted Meta & Google auto ads, lead vetting, and floor sales coaching for dealers. Get a quote.",
    h1: "Car Dealership Marketing, Test-Drive Lead Generation & Showroom Sales Coaching",
    summary: "Built on 16 years of frontline showroom and dealership commercial experience\u2014choose standalone automotive marketing, test-drive acquisition, lead filtering, exchange event drives, or sales team coaching.",
    highlights: [
      { label: "Automotive Dealership Strategy", href: "/services/automotive-marketing" },
      { label: "Test-Drive Lead Generation", href: "/services/test-drive-lead-generation" },
      { label: "Lead Filtering & Qualification", href: "/services/lead-filtering" },
      { label: "Build Automotive Quotation", href: "/pricing#quotation-builder" }
    ],
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ProfessionalService",
          "@id": "https://akyin.com/marketing/automotive#service",
          name: "AKYIN Marketing \u2014 Automotive Division",
          url: "https://akyin.com/marketing/automotive",
          parentOrganization: { "@type": "Corporation", name: "AKYIN Ventures" },
          description: "Book qualified showroom test drives, not cold clicks. Targeted Meta & Google auto ads, lead vetting, and floor sales coaching for dealers.",
          priceRange: "\u20B915,000 - \u20B950,000",
          areaServed: ["IN", "AE", "US", "GB"],
          email: "connect@akyin.com"
        },
        {
          "@type": "FAQPage",
          "@id": "https://akyin.com/marketing/automotive#lead-qualification-faq",
          name: "Lead Qualification FAQ \u2014 AKYIN Automotive Marketing",
          mainEntity: [
            {
              "@type": "Question",
              name: "How does AKYIN filter high-intent automotive test-drive leads?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "AKYIN enforces strict separation between Meta/Google lead generation and multi-tier lead qualification so dealership sales executives receive vetted test-drive appointments classified as Hot, Warm, Future Follow-up, Unreachable, or Not Interested."
              }
            }
          ]
        },
        {
          "@type": "FAQPage",
          "@id": "https://akyin.com/marketing/automotive#lead-impact-tracker-faq",
          name: "Lead Impact Tracker FAQ \u2014 AKYIN Automotive Marketing",
          mainEntity: [
            {
              "@type": "Question",
              name: "What does the AKYIN Lead Impact Tracker measure for automotive dealerships?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The Lead Impact Tracker lets dealerships simulate monthly ad budgets (\u20B930,000 to \u20B95,00,000) across Hatchback/Compact Sedan, Midsize/Compact SUV, and Luxury/EV tiers to forecast Cost Per Test Drive (CPTD), showroom conversion rate, projected monthly test drives, and estimated car bookings."
              }
            },
            {
              "@type": "Question",
              name: "Can auto dealers download CSV reports from the Lead Impact Tracker?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Clicking Export CSV Report downloads a structured 30-day performance CSV containing daily Cost Per Test Drive (INR), estimated inbound leads, monthly ad budget, and selected vehicle tier for internal dealership records and management review."
              }
            },
            {
              "@type": "Question",
              name: "How do the Cost Per Test Drive trend chart and zoom controls work?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The interactive Recharts trend chart visualizes 30-day Cost Per Test Drive performance with 7D, 14D, and 30D zoom-in toggles and a draggable range brush in the 30-day view so dealers can inspect daily acquisition efficiency closely."
              }
            },
            {
              "@type": "Question",
              name: "What does the 30-day moving average alert badge in the Lead Impact Tracker indicate?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The benchmark alert badge automatically compares current Cost Per Test Drive against the 30-day moving average, notifying the dealership whenever CPTD exceeds the 30-day benchmark or confirming when efficiency is running below average."
              }
            }
          ]
        }
      ]
    }
  },
  "/ventures/store": {
    title: "AKYIN Store & AKYIN Thrift \u2014 Value Fashion Retail",
    description: "Shop curated men\u2019s and women\u2019s everyday fashion, apparel, and seasonal wardrobe collections at accessible discounted prices through AKYIN Thrift.",
    h1: "AKYIN Store & AKYIN Thrift \u2014 Value-First Apparel & Wardrobe Retail",
    summary: "Accessible everyday fashion and curated wardrobe staples designed for shoppers seeking reliable quality at practical prices.",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ClothingStore",
      name: "AKYIN STORE \xB7 AKYIN THRIFT",
      url: "https://akyin.com/ventures/store",
      parentOrganization: { "@type": "Corporation", name: "AKYIN Ventures" }
    }
  },
  "/ventures/aicalc": {
    title: "AICalc.in \u2014 Smart AI & Manual Calculators | AKYIN",
    description: "Explore AICalc.in: combining natural-language AI calculation queries with classic manual financial, business, and everyday calculators online.",
    h1: "AICalc.in \u2014 AI-Assisted & Manual Financial Calculation Platform",
    summary: "Built to simplify financial, commercial, and everyday math through both natural-language queries and precision deterministic calculators.",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "AICalc.in",
      url: "https://aicalc.in",
      applicationCategory: "BusinessApplication",
      operatingSystem: "All",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
    }
  },
  "/ventures/kartigo": {
    title: "Kartigo \u2014 B2B Stock Supply & Wholesale Trade",
    description: "Connect with wholesale commercial inventory, bulk stock lots, and reliable B2B trade distribution opportunities across categories with Kartigo.",
    h1: "Kartigo \u2014 B2B Wholesale Inventory & Commercial Stock Supply",
    summary: "Structured B2B wholesale supply desk connecting distributors, bulk traders, and retail merchants with curated commercial stock lots.",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WholesaleStore",
      name: "Kartigo",
      url: "https://akyin.com/ventures/kartigo"
    }
  },
  "/ventures/biznxt": {
    title: "BizNXT \u2014 Business Clarity & Consulting",
    description: "Practical business clarity, commercial feasibility analysis, and structured opportunity exploration for founders and SMEs with BizNXT.",
    h1: "BizNXT \u2014 Founder Feasibility, Unit Economics & Business Clarity",
    summary: "Advisory and feasibility exploration helping emerging entrepreneurs evaluate commercial viability before deploying capital.",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ConsultingService",
      name: "BizNXT",
      url: "https://akyin.com/ventures/biznxt"
    }
  },
  "/ventures/budget-bazaar": {
    title: "Budget Bazaar \u2014 Everyday Value Retail | AKYIN Ventures",
    description: "Discover affordable household goods, everyday essentials, and value-first consumer retail selections curated by Budget Bazaar.",
    h1: "Budget Bazaar \u2014 Affordable Household Essentials & Consumer Retail",
    summary: "Value-focused retail selection offering practical everyday household items directly to cost-conscious shoppers.",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Store",
      name: "Budget Bazaar",
      url: "https://akyin.com/ventures/budget-bazaar"
    }
  },
  "/pricing": {
    title: "Standalone Service Pricing & Quotation Builder (INR) | AKYIN Ventures",
    description: "Transparent INR pricing across every standalone AKYIN service\u2014digital marketing, lead filtering, design, documents, Excel, Bulk SMS, WhatsApp setup, and training.",
    h1: "Transparent Standalone Service Pricing (INR) & Interactive Quotation Builder",
    summary: "Select only the exact standalone services your business requires, review transparent INR project and monthly pricing, and generate an itemized quotation with GST clarity.",
    highlights: [
      { label: "Full 10-Category Service Catalogue", href: "/ventures/marketing" },
      { label: "Bulk SMS Marketing (\u20B93,000 / 10,000 SMS)", href: "/services/bulk-sms" },
      { label: "WhatsApp Business Setup (\u20B94,999 Setup)", href: "/services/whatsapp-business-setup" },
      { label: "Book Business Advisory (\u20B93,998)", href: "/advisory" }
    ],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Standalone Service Pricing & Quotation Builder \u2014 AKYIN Ventures",
      url: "https://akyin.com/pricing"
    }
  },
  "/tools": {
    title: "20 Free Business, Marketing & Sales Tools | AKYIN.com",
    description: "Calculate marketing ROI, ROAS, CAC, CPL, break-even, GST, margins, commissions, and campaign quotes with 20 free interactive AKYIN business tools.",
    h1: "20 Free Interactive Business, Marketing & Sales Calculators",
    summary: "Instant calculators for marketing ROI, ROAS, CAC, cost per qualified lead, GST breakdown, margin math, sales commission, and break-even planning.",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "AKYIN Business, Marketing & Sales Calculators Suite",
      url: "https://akyin.com/tools",
      applicationCategory: "BusinessApplication",
      operatingSystem: "All",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" }
    }
  },
  "/quote": {
    title: "Official Quotation & Invoice Portal | AKYIN Ventures",
    description: "Review your AKYIN Ventures itemized commercial quotation, approve online, print an A4 PDF dossier, and complete verified Razorpay invoice payments.",
    robots: "noindex, nofollow",
    h1: "AKYIN Ventures \u2014 Client Quotation & Invoice Portal",
    summary: "Private itemized commercial quotation approval, PDF dossier generation, and verified Razorpay invoice checkout.",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "AKYIN Ventures Quotation Portal",
      url: "https://akyin.com/quote"
    }
  },
  "/advisory": {
    title: "Book 1-on-1 Business Advisory (IST) | AKYIN Ventures",
    description: "Schedule a private 30-minute IST business advisory consultation with AKYIN Ventures for strategy, unit economics, feasibility, and sales conversion.",
    h1: "Book 1-on-1 Business Advisory Consultation (30 Min IST \u2014 \u20B93,998)",
    summary: "Focused executive consultation on commercial feasibility, marketing unit economics, dealership processes, and growth execution.",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "AKYIN Business Advisory & Consultation",
      url: "https://akyin.com/advisory",
      provider: { "@type": "Organization", name: "AKYIN Ventures" },
      offers: { "@type": "Offer", price: "3998", priceCurrency: "INR" }
    }
  },
  "/insights": {
    title: "Business Insights & Automotive Trends | AKYIN Ventures",
    description: "Read practical perspectives on performance marketing, dealership test-drive conversion, publishing, retail positioning, and digital commerce from AKYIN.",
    ogType: "article",
    h1: "AKYIN Insights \u2014 Performance Marketing, Dealership Conversion & Commerce",
    summary: "Practical notes and live automotive retail intelligence spanning lead quality control, floor sales execution, and B2B commerce.",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Insights & Business Philosophy \u2014 AKYIN Ventures",
      url: "https://akyin.com/insights"
    }
  },
  "/terms": {
    title: "Terms of Service & Billing Policy | AKYIN Ventures",
    description: "Read AKYIN Ventures Terms of Service, direct Meta & Google ad billing transparency, scope separation rules, and international commercial policies.",
    h1: "Terms of Service, Ad Billing Transparency & Scope Separation Policy",
    summary: "Commercial engagement rules governing standalone services, direct client payment to Meta/Google ad platforms, and written quotation scope.",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Terms of Service \u2014 AKYIN Ventures",
      url: "https://akyin.com/terms"
    }
  },
  "/privacy": {
    title: "Privacy Policy & Data Protection | AKYIN Ventures",
    description: "Learn how AKYIN Ventures protects enquiry data with strict CSP rules, zero data-broker sharing, and verified security standards across akyin.com.",
    h1: "Privacy Policy & Enquiry Data Protection Standards",
    summary: "How AKYIN Ventures safeguards client contact records, enforces strict Content Security Policy rules, and prohibits third-party broker sharing.",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Privacy Policy \u2014 AKYIN Ventures",
      url: "https://akyin.com/privacy"
    }
  },
  "/contact": {
    title: "Contact AKYIN Ventures \u2014 Enquiry & Advisory Desk",
    description: "Connect directly with AKYIN Ventures for standalone marketing services, automotive lead systems, creative work, B2B commerce, and advisory across India and the UAE.",
    h1: "Contact AKYIN Ventures \u2014 Direct Enquiry & Proposal Desk",
    summary: "Submit your exact service requirements for fast commercial follow-up via email (connect@akyin.com) or official WhatsApp Connect.",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Contact AKYIN Ventures",
      url: "https://akyin.com/contact",
      mainEntity: {
        "@type": "Corporation",
        name: "AKYIN Ventures",
        url: "https://whatsapp.com/channel/0029VbCz1qOJ3jurZuI6cM3U",
        email: "connect@akyin.com"
      }
    }
  },
  "/sitemap": {
    title: "Site Map & Complete Service Directory | AKYIN Ventures",
    description: "Browse all corporate pages, standalone marketing service pages across 10 categories, business calculators, venture showcases, and pricing schedules.",
    h1: "AKYIN Ventures Site Map & Complete Standalone Service Directory",
    summary: "Unified HTML directory of every public corporate route, operating venture page, free calculator, and individual /services/:slug offering.",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ItemPage",
      name: "Site Map & Directory \u2014 AKYIN Ventures",
      url: "https://akyin.com/sitemap"
    }
  },
  "/admin": {
    title: "AKYIN Ventures \u2014 Admin Management Console",
    description: "Restricted internal CRM, quotation, payment, and operational administration console for authorized AKYIN Ventures personnel.",
    robots: "noindex, nofollow",
    h1: "AKYIN Ventures \u2014 Restricted Management Console",
    summary: "Authorized internal operations portal.",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "AKYIN Ventures Admin Console",
      url: "https://akyin.com/admin"
    }
  }
};
function buildBreadcrumbList(routePath, titleLabel, extraParent) {
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${DOMAIN}/`
    }
  ];
  if (extraParent) {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: extraParent.name,
      item: extraParent.url
    });
  }
  items.push({
    "@type": "ListItem",
    position: items.length + 1,
    name: titleLabel,
    item: `${DOMAIN}${routePath}`
  });
  return {
    "@type": "BreadcrumbList",
    itemListElement: items
  };
}
function resolveServicePriceSummary(service) {
  if (service.id === "srv-bulk-sms") {
    const base = service.packagePrice || service.oneTimePrice || service.setupFee || 3e3;
    const credits = service.includedUnits || 1e4;
    const rate = service.unitRate ?? service.additionalUnitRate ?? 0.3;
    return `${formatInr(base)} package (${credits.toLocaleString("en-IN")} SMS credits included \xB7 \u20B9${rate.toFixed(2)} effective/SMS)`;
  }
  if (service.id === "srv-whatsapp-messaging") {
    const setup = service.setupFee || service.oneTimePrice || 4999;
    const perMsg = service.unitRate ?? service.additionalUnitRate ?? 1.5;
    return `${formatInr(setup)} one-time setup fee (strictly separate from \u20B9${perMsg.toFixed(2)}/message usage)`;
  }
  const oneTime = (service.oneTimePrice ?? 0) > 0 ? service.oneTimePrice ?? 0 : service.setupFee;
  const monthly = (service.monthlyPrice ?? 0) > 0 ? service.monthlyPrice ?? 0 : service.recurringFee;
  const parts = [];
  if (oneTime > 0) parts.push(`${formatInr(oneTime)} one-time`);
  if (monthly > 0) parts.push(`${formatInr(monthly)}/month`);
  if (parts.length === 0) return "Custom Quote on Request";
  return parts.join(" + ");
}
function buildServiceSeoPayload(service) {
  const title = `${service.name} \u2014 ${service.category} | AKYIN MARKETINGS`;
  const description = service.description.slice(0, 220);
  const canonicalUrl = `${DOMAIN}/services/${encodeURIComponent(service.slug)}`;
  const priceLabel = resolveServicePriceSummary(service);
  const primaryOfferPrice = (service.monthlyPrice ?? 0) > 0 ? service.monthlyPrice ?? 0 : service.recurringFee > 0 ? service.recurringFee : (service.oneTimePrice ?? 0) > 0 ? service.oneTimePrice ?? 0 : service.setupFee > 0 ? service.setupFee : 0;
  const offerSchema = primaryOfferPrice > 0 ? {
    "@type": "Offer",
    name: service.name,
    price: String(primaryOfferPrice),
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    url: canonicalUrl
  } : {
    "@type": "Offer",
    name: `${service.name} (Custom Quote on Request)`,
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    url: canonicalUrl
  };
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${canonicalUrl}#service`,
        name: service.name,
        category: service.category,
        serviceType: service.category,
        description: service.description,
        url: canonicalUrl,
        provider: {
          "@type": "Organization",
          name: "AKYIN Ventures",
          url: `${DOMAIN}/`
        },
        areaServed: ["IN", "AE", "US", "GB"],
        offers: offerSchema
      },
      buildBreadcrumbList(`/services/${service.slug}`, service.name, {
        name: "Marketing Services",
        url: `${DOMAIN}/ventures/marketing`
      })
    ]
  };
  const benefitsHtml = (service.benefits || []).map((b) => `<li>${escapeHtml(b)}</li>`).join("");
  const deliverablesHtml = (service.deliverables || []).map((d) => `<li>${escapeHtml(d)}</li>`).join("");
  const processHtml = (service.workProcess || []).map((step) => `<li>${escapeHtml(step)}</li>`).join("");
  const rootHtml = buildShellRootHtml({
    h1: service.name,
    categoryEyebrow: `${service.category} \xB7 Standalone Service`,
    summary: service.description,
    bodyExtra: `
      <section>
        <h2>Pricing &amp; Commercial Terms</h2>
        <p><strong>${escapeHtml(priceLabel)}</strong>${service.gstEnabled ? ` \xB7 Applicable ${escapeHtml(String(service.gstRate))}% GST extra` : ""}</p>
        ${service.deliveryPeriod ? `<p>Turnaround / Duration: ${escapeHtml(service.deliveryPeriod)}</p>` : ""}
        ${service.revisionLimit ? `<p>Revisions Included: ${escapeHtml(String(service.revisionLimit))}</p>` : ""}
        ${service.id === "srv-bulk-sms" || service.id === "srv-whatsapp-messaging" ? "<p><em>Messaging rates are subject to provider charges, applicable taxes, message category, destination and delivery conditions. Final charges are confirmed in the quotation.</em></p>" : ""}
      </section>
      ${benefitsHtml ? `<section><h2>Key Benefits</h2><ul>${benefitsHtml}</ul></section>` : ""}
      ${deliverablesHtml ? `<section><h2>Included Deliverables</h2><ul>${deliverablesHtml}</ul></section>` : ""}
      ${processHtml ? `<section><h2>Execution Process</h2><ol>${processHtml}</ol></section>` : ""}
    `,
    highlights: [
      { label: "Customize in Quotation Builder", href: "/pricing#quotation-builder" },
      { label: "All 10 Service Categories", href: "/ventures/marketing" },
      { label: "Submit Enquiry", href: "/contact" }
    ]
  });
  return {
    title,
    description,
    canonicalUrl,
    robots: DEFAULT_ROBOTS,
    ogType: "website",
    structuredData,
    rootHtml
  };
}
function buildShellRootHtml(opts) {
  const linksHtml = (opts.highlights || []).map((item) => `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`).join("");
  return `
      <main style="max-width:960px;margin:0 auto;padding:32px 20px;font-family:system-ui,sans-serif;line-height:1.6;">
        <header style="border-bottom:1px solid #E8E8ED;padding-bottom:16px;margin-bottom:24px;">
          <p><strong>AKYIN Ventures</strong> \u2014 Building Ideas Into Businesses</p>
          <nav aria-label="Primary links">
            <a href="/">Home</a> \xB7
            <a href="/about">About</a> \xB7
            <a href="/ventures">Our Ventures</a> \xB7
            <a href="/ventures/marketing">Marketing Services</a> \xB7
            <a href="/marketing/automotive">Automotive Marketing</a> \xB7
            <a href="/pricing">Pricing</a> \xB7
            <a href="/tools">Business Tools</a> \xB7
            <a href="/advisory">Advisory</a> \xB7
            <a href="/insights">Insights</a> \xB7
            <a href="/contact">Contact</a> \xB7
            <a href="/terms">Terms</a> \xB7
            <a href="/privacy">Privacy</a> \xB7
            <a href="/sitemap">Sitemap</a>
          </nav>
        </header>
        ${opts.categoryEyebrow ? `<p style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#6E6E73;margin-bottom:8px;">${escapeHtml(opts.categoryEyebrow)}</p>` : ""}
        <h1>${escapeHtml(opts.h1)}</h1>
        <p>${escapeHtml(opts.summary)}</p>
        ${opts.bodyExtra || ""}
        ${linksHtml ? `<section><h2>Explore Next</h2><ul>${linksHtml}</ul></section>` : ""}
        <footer style="margin-top:32px;border-top:1px solid #E8E8ED;padding-top:16px;">
          <p>Email: <a href="mailto:connect@akyin.com">connect@akyin.com</a> | <a href="https://whatsapp.com/channel/0029VbCz1qOJ3jurZuI6cM3U" target="_blank" rel="noopener noreferrer">WhatsApp Connect</a></p>
          <p><a href="/ventures/marketing">Service Catalogue</a> \xB7 <a href="/pricing">Pricing</a> \xB7 <a href="/terms">Terms of Service</a> \xB7 <a href="/privacy">Privacy Policy</a></p>
        </footer>
      </main>`;
}
function renderSeoHtml(baseHtml, rawPath, db) {
  const cleaned = rawPath.split("?")[0].replace(/\/+$/, "") || "/";
  if (cleaned.startsWith("/services/") && db) {
    const requestedSlug = decodeURIComponent(cleaned.slice("/services/".length)).trim().toLowerCase();
    const matchedService = db.services.find(
      (s) => s.active && (s.slug || "").trim().toLowerCase() === requestedSlug
    );
    if (matchedService) {
      const payload = buildServiceSeoPayload(matchedService);
      return injectSeoIntoTemplate(baseHtml, {
        title: payload.title,
        description: payload.description,
        canonicalUrl: payload.canonicalUrl,
        robotsValue: payload.robots,
        ogType: payload.ogType,
        structuredData: payload.structuredData,
        rootHtml: payload.rootHtml
      });
    }
  }
  const meta = ROUTE_SEO_META[cleaned] || ROUTE_SEO_META["/"];
  const canonicalUrl = `${DOMAIN}${cleaned === "/" ? "/" : cleaned}`;
  const robotsValue = meta.robots || DEFAULT_ROBOTS;
  const ogType = meta.ogType || "website";
  let structuredData = meta.structuredData;
  if (cleaned !== "/" && cleaned !== "/admin" && ROUTE_SEO_META[cleaned]) {
    const label = meta.title.split("\u2014")[0].split("|")[0].trim();
    const breadcrumb = buildBreadcrumbList(cleaned, label);
    if (Array.isArray(structuredData["@graph"])) {
      structuredData = {
        "@context": "https://schema.org",
        "@graph": [
          ...structuredData["@graph"] || [],
          breadcrumb
        ]
      };
    } else {
      const { ["@context"]: _ctx, ...rest } = structuredData;
      structuredData = {
        "@context": "https://schema.org",
        "@graph": [rest, breadcrumb]
      };
    }
  }
  let bodyExtra = "";
  if ((cleaned === "/ventures/marketing" || cleaned === "/sitemap") && db) {
    const activeServices = db.services.filter((s) => s.active && s.slug).slice().sort((a, b) => (a.menuOrder ?? a.sortOrder) - (b.menuOrder ?? b.sortOrder));
    if (activeServices.length > 0) {
      const itemsHtml = activeServices.map(
        (s) => `<li><a href="/services/${encodeURIComponent(s.slug)}">${escapeHtml(s.name)}</a> \u2014 ${escapeHtml(s.category)} (${escapeHtml(resolveServicePriceSummary(s))})</li>`
      ).join("");
      bodyExtra = `<section><h2>Standalone Services Directory</h2><ul>${itemsHtml}</ul></section>`;
    }
  }
  const rootHtml = buildShellRootHtml({
    h1: meta.h1,
    summary: meta.summary,
    bodyExtra,
    highlights: meta.highlights
  });
  return injectSeoIntoTemplate(baseHtml, {
    title: meta.title,
    description: meta.description,
    canonicalUrl,
    robotsValue,
    ogType,
    structuredData,
    rootHtml
  });
}
function injectSeoIntoTemplate(baseHtml, opts) {
  const exactTitle = opts.title;
  const exactDesc = opts.description;
  let html = baseHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(exactTitle)}</title>`).replace(
    /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="robots" content="${escapeHtml(opts.robotsValue)}" />`
  ).replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(exactDesc)}" />`
  ).replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${escapeHtml(opts.canonicalUrl)}" />`
  ).replace(
    /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:type" content="${escapeHtml(opts.ogType)}" />`
  ).replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(exactTitle)}" />`
  ).replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtml(exactDesc)}" />`
  ).replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${escapeHtml(opts.canonicalUrl)}" />`
  ).replace(
    /<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image:alt" content="${escapeHtml(exactTitle)}" />`
  ).replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeHtml(exactTitle)}" />`
  ).replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeHtml(exactDesc)}" />`
  ).replace(
    /<meta\s+name="twitter:image:alt"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:image:alt" content="${escapeHtml(exactTitle)}" />`
  ).replace(
    /<script\s+id="akyin-schema-jsonld"\s+type="application\/ld\+json">[\s\S]*?<\/script>/i,
    `<script id="akyin-schema-jsonld" type="application/ld+json">${safeJsonLd(opts.structuredData)}</script>`
  );
  html = html.replace(
    /<div id="root">[\s\S]*?<\/div>(?=\s*(?:<script|<!--|<\/body>))/i,
    `<div id="root">${opts.rootHtml}
    </div>`
  );
  return html;
}
function buildDynamicSitemapXml(db) {
  const fallbackDate = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const staticEntries = [
    { path: "/", changefreq: "weekly", priority: "1.0" },
    { path: "/about", changefreq: "monthly", priority: "0.9" },
    { path: "/ventures", changefreq: "weekly", priority: "0.9" },
    { path: "/ventures/publishing", changefreq: "monthly", priority: "0.8" },
    { path: "/ventures/marketing", changefreq: "weekly", priority: "0.95" },
    { path: "/marketing/automotive", changefreq: "weekly", priority: "0.95" },
    { path: "/ventures/store", changefreq: "monthly", priority: "0.8" },
    { path: "/ventures/aicalc", changefreq: "monthly", priority: "0.8" },
    { path: "/ventures/kartigo", changefreq: "monthly", priority: "0.8" },
    { path: "/ventures/biznxt", changefreq: "monthly", priority: "0.8" },
    { path: "/ventures/budget-bazaar", changefreq: "monthly", priority: "0.8" },
    { path: "/pricing", changefreq: "weekly", priority: "0.9" },
    { path: "/tools", changefreq: "weekly", priority: "0.9" },
    { path: "/advisory", changefreq: "weekly", priority: "0.9" },
    { path: "/insights", changefreq: "weekly", priority: "0.8" },
    { path: "/contact", changefreq: "monthly", priority: "0.9" },
    { path: "/terms", changefreq: "monthly", priority: "0.7" },
    { path: "/privacy", changefreq: "monthly", priority: "0.7" },
    { path: "/sitemap", changefreq: "weekly", priority: "0.7" }
  ];
  const seenUrls = /* @__PURE__ */ new Set();
  const urlNodes = [];
  for (const entry of staticEntries) {
    if (entry.path === "/admin" || entry.path === "/quote") continue;
    const loc = `${DOMAIN}${entry.path === "/" ? "/" : entry.path}`;
    seenUrls.add(loc);
    urlNodes.push(
      `  <url>
    <loc>${escapeHtml(loc)}</loc>
    <lastmod>${fallbackDate}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    );
  }
  const activeServices = (db?.services || []).filter((s) => s.active && Boolean(s.slug)).slice().sort((a, b) => (a.menuOrder ?? a.sortOrder) - (b.menuOrder ?? b.sortOrder));
  for (const service of activeServices) {
    const cleanSlug = service.slug.trim();
    if (!cleanSlug) continue;
    const loc = `${DOMAIN}/services/${encodeURIComponent(cleanSlug)}`;
    if (seenUrls.has(loc)) continue;
    seenUrls.add(loc);
    const lastmod = typeof service.updatedAt === "string" && /^\d{4}-\d{2}-\d{2}/.test(service.updatedAt) ? service.updatedAt.slice(0, 10) : fallbackDate;
    urlNodes.push(
      `  <url>
    <loc>${escapeHtml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`
    );
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlNodes.join("\n")}
</urlset>
`;
}

// server.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path2.dirname(__filename);
var PORT = process.env.PORT || 3e3;
var TOPIC_PROMPTS = {
  all: "latest automotive dealership sales trends, digital marketing strategies, meta and search lead generation, and showroom conversion benchmarks in 2025 and 2026",
  leadgen: "latest automotive dealership digital lead generation trends, Meta and Google vehicle ads, cost per lead optimization, and automotive marketing campaigns in 2025 and 2026",
  ev: "latest electric vehicle EV dealership marketing trends, online car buying journeys, digital showroom tools, and customer acquisition strategies in 2025 and 2026",
  crm: "latest automotive dealership CRM automation, AI lead qualification, WhatsApp showroom follow-up, and automotive sales training trends in 2025 and 2026"
};
async function createGeminiClient() {
  let apiKey = (process.env.GEMINI_API_KEY ?? "").trim().replace(/^(['"])(.*)\1$/, "$2").trim().replace(/^Bearer\s+/i, "").trim();
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || /^(your_|replace_|test_|changeme|<.*>)/i.test(apiKey)) {
    return { client: null, ThinkingLevel: null, reason: "API_KEY_MISSING" };
  }
  if (/\s/.test(apiKey) || apiKey.startsWith("ya29.")) {
    return { client: null, ThinkingLevel: null, reason: "API_KEY_INVALID_FORMAT" };
  }
  const { GoogleGenAI: GenAIClient, ThinkingLevel } = await import("@google/genai");
  return {
    client: new GenAIClient({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    }),
    ThinkingLevel,
    reason: null
  };
}
function classifyGeminiError(err) {
  const rawMessage = err instanceof Error ? err.message : String(err ?? "");
  const statusProp = typeof err === "object" && err !== null && "status" in err ? Number(err.status) : NaN;
  const isAuthError = statusProp === 401 || statusProp === 403 || /"code"\s*:\s*(401|403)/.test(rawMessage) || /API_KEY_INVALID|ACCESS_TOKEN_TYPE_UNSUPPORTED|API key not valid|UNAUTHENTICATED|PERMISSION_DENIED/i.test(
    rawMessage
  );
  if (isAuthError) {
    return {
      httpStatus: 401,
      code: "API_KEY_INVALID",
      clientMessage: "Live Google Search headlines require a valid Gemini API key in Settings > Secrets.",
      retryable: false,
      isAuthError: true
    };
  }
  const isQuotaError = statusProp === 429 || /"code"\s*:\s*429/.test(rawMessage) || /RESOURCE_EXHAUSTED/i.test(rawMessage);
  if (isQuotaError) {
    return {
      httpStatus: 429,
      code: "QUOTA_EXCEEDED",
      clientMessage: "Live Google Search headline quota is temporarily exhausted. Please check your Gemini API plan or retry shortly.",
      retryable: true,
      isAuthError: false
    };
  }
  const isModelNotFound = statusProp === 404 || /"code"\s*:\s*404/.test(rawMessage) || /NOT_FOUND/i.test(rawMessage);
  if (isModelNotFound) {
    return {
      httpStatus: 502,
      code: "MODEL_NOT_FOUND",
      clientMessage: "The configured headline search model is currently unavailable.",
      retryable: false,
      isAuthError: false
    };
  }
  const isClientBadRequest = statusProp === 400 || /"code"\s*:\s*400/.test(rawMessage);
  if (isClientBadRequest) {
    return {
      httpStatus: 502,
      code: "INVALID_UPSTREAM_REQUEST",
      clientMessage: "Unable to complete live Google Search headline lookup right now.",
      retryable: false,
      isAuthError: false
    };
  }
  return {
    httpStatus: 502,
    code: "UPSTREAM_ERROR",
    clientMessage: "Live Google Search headlines are temporarily unavailable. Please try again shortly.",
    retryable: true,
    isAuthError: false
  };
}
function extractJsonArray(rawText) {
  const cleaned = rawText.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  const startIdx = cleaned.indexOf("[");
  const endIdx = cleaned.lastIndexOf("]");
  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
    return [];
  }
  try {
    const parsed = JSON.parse(cleaned.slice(startIdx, endIdx + 1));
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => Boolean(item && typeof item === "object")).map((item) => ({
      headline: typeof item.headline === "string" ? item.headline.trim() : "",
      summary: typeof item.summary === "string" ? item.summary.trim() : "",
      category: typeof item.category === "string" ? item.category.trim() : "Dealership Growth",
      publisher: typeof item.publisher === "string" ? item.publisher.trim() : "Automotive Press",
      publishedHint: typeof item.publishedHint === "string" ? item.publishedHint.trim() : "Recent",
      url: typeof item.url === "string" ? item.url.trim() : ""
    })).filter((item) => item.headline.length > 0 && item.summary.length > 0).slice(0, 6);
  } catch {
    return [];
  }
}
function resolvePublicOrDistFile(relPath) {
  const distCandidate = path2.resolve(__dirname, "dist", relPath);
  if (fs2.existsSync(distCandidate)) return distCandidate;
  const publicCandidate = path2.resolve(__dirname, "public", relPath);
  if (fs2.existsSync(publicCandidate)) return publicCandidate;
  return null;
}
function wantsMarkdown(req) {
  if (req.method !== "GET" && req.method !== "HEAD") return false;
  const accept = (req.headers.accept || "").toLowerCase();
  if (!accept.includes("text/markdown")) return false;
  if (req.path.startsWith("/api/") || req.path.startsWith("/assets/") || req.path.startsWith("/downloads/") || req.path.startsWith("/.well-known/")) {
    return false;
  }
  if (/\.[a-z0-9]{2,6}$/i.test(req.path)) return false;
  return true;
}
function createRateLimiter(options) {
  const buckets = /* @__PURE__ */ new Map();
  let lastPrune = Date.now();
  return (req, res, next) => {
    const now = Date.now();
    if (now - lastPrune > options.windowMs || buckets.size > 2e3) {
      for (const [k, entry] of buckets.entries()) {
        if (entry.resetAt <= now) {
          buckets.delete(k);
        }
      }
      lastPrune = now;
    }
    const clientIp = req.ip || req.socket.remoteAddress || "unknown";
    const existing = buckets.get(clientIp);
    if (!existing || existing.resetAt <= now) {
      buckets.set(clientIp, { count: 1, resetAt: now + options.windowMs });
      next();
      return;
    }
    if (existing.count >= options.max) {
      const retryAfterSec = Math.max(1, Math.ceil((existing.resetAt - now) / 1e3));
      res.setHeader("Retry-After", String(retryAfterSec));
      res.status(429).json({
        error: options.message,
        code: options.code
      });
      return;
    }
    existing.count += 1;
    next();
  };
}
var automotiveNewsCache = /* @__PURE__ */ new Map();
var AUTOMOTIVE_NEWS_CACHE_TTL_MS = 5 * 60 * 1e3;
async function startServer() {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader(
      "Permissions-Policy",
      'camera=(), geolocation=(), microphone=(self), payment=(self "https://checkout.razorpay.com")'
    );
    res.setHeader("Content-Signal", "search=yes, ai-input=yes, ai-train=no");
    if (req.path.startsWith("/api/") || req.path === "/admin" || req.path.startsWith("/admin/") || req.path === "/quote" || req.path.startsWith("/quote/")) {
      res.setHeader("X-Robots-Tag", "noindex, nofollow");
    }
    if (process.env.NODE_ENV === "production" && (req.secure || req.headers["x-forwarded-proto"] === "https")) {
      res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    }
    next();
  });
  app.post(
    "/api/razorpay/webhook",
    express.raw({ type: "application/json", limit: "256kb" }),
    (req, res) => {
      void handleRazorpayWebhook(req, res);
    }
  );
  app.use(express.json({ limit: "128kb" }));
  app.use((err, _req, res, next) => {
    if (err instanceof SyntaxError && "status" in err && err.status === 400) {
      res.status(400).json({ error: "Invalid JSON request payload.", code: "INVALID_JSON" });
      return;
    }
    next(err);
  });
  const mcpRateLimiter = createRateLimiter({
    windowMs: 6e4,
    max: 60,
    code: "MCP_RATE_LIMITED",
    message: "Too many MCP requests. Please wait a minute before retrying."
  });
  const newsRateLimiter = createRateLimiter({
    windowMs: 6e4,
    max: 20,
    code: "NEWS_RATE_LIMITED",
    message: "Too many headline sync requests. Please wait a minute before refreshing."
  });
  app.get("/robots.txt", (_req, res) => {
    const file = resolvePublicOrDistFile("robots.txt");
    if (file) {
      res.type("text/plain; charset=utf-8").sendFile(file);
      return;
    }
    res.type("text/plain; charset=utf-8").send("User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /quote\nDisallow: /api/\nContent-Signal: search=yes, ai-input=yes, ai-train=no\nSitemap: https://akyin.com/sitemap.xml\n");
  });
  app.get("/llms.txt", (_req, res) => {
    const file = resolvePublicOrDistFile("llms.txt");
    if (file) {
      res.type("text/markdown; charset=utf-8").sendFile(file);
      return;
    }
    res.type("text/markdown; charset=utf-8").send(buildMarkdownForRoute("/"));
  });
  app.get("/sitemap.xml", (_req, res) => {
    try {
      const db = readDb();
      const xml = buildDynamicSitemapXml(db);
      res.type("application/xml; charset=utf-8").send(xml);
    } catch {
      const file = resolvePublicOrDistFile("sitemap.xml");
      if (file) {
        res.type("application/xml; charset=utf-8").sendFile(file);
        return;
      }
      res.status(404).send("Sitemap not found.");
    }
  });
  app.get("/.well-known/mcp/server-card.json", (_req, res) => {
    const file = resolvePublicOrDistFile(path2.join(".well-known", "mcp", "server-card.json"));
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (file) {
      res.type("application/json; charset=utf-8").sendFile(file);
      return;
    }
    res.status(404).json({ error: "MCP server card not found." });
  });
  const DOWNLOAD_PDF_ALIASES = {
    "AKYIN_All_Businesses_Presentation_Updated.pdf": "assets/aistudio/All_Businesses_Presentation_72c79302.pdf",
    "AKYIN_Marketing_All_Businesses_Presentation.pdf": "assets/aistudio/All_Businesses_Presentation_72c79302.pdf",
    "AKYIN_Automotive_Marketing_Presentation_Updated.pdf": "assets/aistudio/Automotive_Presentation_4a4e967e.pdf"
  };
  app.get("/downloads/:filename", (req, res) => {
    const rawFilename = req.params.filename;
    const sanitizedFilename = path2.basename(rawFilename);
    const aliasRelPath = DOWNLOAD_PDF_ALIASES[sanitizedFilename];
    const resolvedPath = resolvePublicOrDistFile(path2.join("downloads", sanitizedFilename)) || (aliasRelPath ? resolvePublicOrDistFile(aliasRelPath) : null);
    if (resolvedPath && fs2.existsSync(resolvedPath)) {
      if (sanitizedFilename.toLowerCase().endsWith(".pdf")) {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="${sanitizedFilename}"`);
      }
      res.setHeader("Cache-Control", "public, max-age=86400");
      return res.sendFile(resolvedPath);
    }
    res.status(404).json({ error: "Download file not found.", code: "DOWNLOAD_NOT_FOUND" });
  });
  app.use((req, res, next) => {
    if (wantsMarkdown(req)) {
      const markdown = buildMarkdownForRoute(req.path);
      res.setHeader("Vary", "Accept");
      res.setHeader("Content-Type", "text/markdown; charset=utf-8");
      res.status(200).send(markdown);
      return;
    }
    next();
  });
  app.get("/api/mcp", (_req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({
      name: "akyin-ventures",
      version: "1.0.0",
      protocol: "mcp-streamable-http",
      protocolVersion: "2024-11-05",
      endpoint: `${OFFICIAL_CONTACT.domain}/api/mcp`,
      capabilities: {
        tools: { listChanged: false },
        resources: { listChanged: false }
      }
    });
  });
  app.post("/api/mcp", mcpRateLimiter, (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const body = req.body;
    const id = body?.id ?? null;
    const method = body?.method || "";
    if (method === "initialize") {
      res.json({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: { listChanged: false },
            resources: { listChanged: false }
          },
          serverInfo: {
            name: "akyin-ventures",
            version: "1.0.0"
          }
        }
      });
      return;
    }
    if (method === "tools/list") {
      res.json({
        jsonrpc: "2.0",
        id,
        result: {
          tools: [
            {
              name: "get_ventures",
              description: "List all seven operating ventures under AKYIN Ventures with descriptions, domains, and internal routes.",
              inputSchema: {
                type: "object",
                properties: {
                  sector: { type: "string", description: "Optional sector filter." }
                }
              }
            },
            {
              name: "get_marketing_pricing",
              description: "Retrieve transparent INR standalone service catalogue and pricing across all 10 AKYIN MARKETINGS categories.",
              inputSchema: {
                type: "object",
                properties: {
                  category: { type: "string", description: "Optional service category." }
                }
              }
            },
            {
              name: "get_contact_channels",
              description: "Get official corporate email, WhatsApp Connect, legal links, and social handles for AKYIN Ventures.",
              inputSchema: {
                type: "object",
                properties: {}
              }
            }
          ]
        }
      });
      return;
    }
    if (method === "tools/call") {
      const toolName = String(body?.params?.name || "");
      const args = body?.params?.arguments || {};
      if (toolName === "get_ventures") {
        const sector = typeof args.sector === "string" ? args.sector.trim().toLowerCase() : "";
        const list = sector ? VENTURES_PORTFOLIO.filter(
          (v) => v.sector.toLowerCase().includes(sector) || v.name.toLowerCase().includes(sector)
        ) : VENTURES_PORTFOLIO;
        res.json({
          jsonrpc: "2.0",
          id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  list.map((v) => ({
                    code: v.code,
                    name: v.name,
                    sector: v.sector,
                    positioning: v.positioning,
                    url: `${OFFICIAL_CONTACT.domain}${v.route}`,
                    externalUrl: v.externalUrl || null
                  })),
                  null,
                  2
                )
              }
            ]
          }
        });
        return;
      }
      if (toolName === "get_marketing_pricing") {
        const db = readDb();
        const cat = typeof args.category === "string" ? args.category.trim().toLowerCase() : "";
        const activeServices = db.services.filter((s) => s.active).filter((s) => !cat || s.category.toLowerCase().includes(cat)).sort((a, b) => (a.menuOrder ?? a.sortOrder) - (b.menuOrder ?? b.sortOrder)).map((s) => ({
          id: s.id,
          slug: s.slug,
          name: s.name,
          category: s.category,
          pricingModel: s.pricingModel,
          oneTimePrice: s.oneTimePrice,
          monthlyPrice: s.monthlyPrice,
          billingCycle: s.billingCycle,
          url: `${OFFICIAL_CONTACT.domain}/services/${s.slug}`
        }));
        res.json({
          jsonrpc: "2.0",
          id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    currency: "INR",
                    pricingUrl: `${OFFICIAL_CONTACT.domain}/pricing`,
                    categories: (db.serviceCategories || []).filter((c) => c.active).map((c) => c.name),
                    services: activeServices
                  },
                  null,
                  2
                )
              }
            ]
          }
        });
        return;
      }
      if (toolName === "get_contact_channels") {
        res.json({
          jsonrpc: "2.0",
          id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    organization: OFFICIAL_CONTACT.parentBrand,
                    email: OFFICIAL_CONTACT.email,
                    whatsappConnect: OFFICIAL_CONTACT.whatsappUrl,
                    whatsappUrl: OFFICIAL_CONTACT.whatsappUrl,
                    socials: OFFICIAL_CONTACT.marketingSocials,
                    termsUrl: `${OFFICIAL_CONTACT.domain}/terms`,
                    privacyUrl: `${OFFICIAL_CONTACT.domain}/privacy`
                  },
                  null,
                  2
                )
              }
            ]
          }
        });
        return;
      }
      res.status(404).json({
        jsonrpc: "2.0",
        id,
        error: { code: -32601, message: `Unknown tool: ${toolName}` }
      });
      return;
    }
    if (method === "resources/list") {
      res.json({
        jsonrpc: "2.0",
        id,
        result: {
          resources: [
            {
              uri: "https://akyin.com/llms.txt",
              name: "AKYIN Ventures LLMs Summary",
              mimeType: "text/markdown"
            },
            {
              uri: "https://akyin.com/pricing",
              name: "AKYIN Ventures INR Pricing & Rate Card",
              mimeType: "text/markdown"
            }
          ]
        }
      });
      return;
    }
    res.status(400).json({
      jsonrpc: "2.0",
      id,
      error: { code: -32601, message: `Unsupported MCP method: ${method}` }
    });
  });
  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      status: "healthy",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  registerSuiteRoutes(app);
  startSubscriptionReminderScheduler();
  app.get("/api/automotive-news", newsRateLimiter, async (req, res) => {
    const topicKey = typeof req.query.topic === "string" && req.query.topic in TOPIC_PROMPTS ? req.query.topic : "all";
    const cached = automotiveNewsCache.get(topicKey);
    if (cached && cached.expiresAt > Date.now()) {
      res.json(cached.payload);
      return;
    }
    const { client: ai, ThinkingLevel, reason } = await createGeminiClient();
    if (!ai || !ThinkingLevel) {
      res.status(503).json({
        error: reason === "API_KEY_INVALID_FORMAT" ? "Configured GEMINI_API_KEY is not a valid API key format. Please update GEMINI_API_KEY in Settings > Secrets." : "Live Google Search headlines require GEMINI_API_KEY to be configured in Settings > Secrets.",
        code: reason
      });
      return;
    }
    const topicFocus = TOPIC_PROMPTS[topicKey];
    try {
      const requestParams = {
        model: "gemini-4-hydrogen",
        contents: `Use Google Search to find 4 to 6 current, real-world industry news headlines and trends about ${topicFocus}.

Return ONLY a valid JSON array (no extra commentary) where each object contains:
- "headline": concise, factual headline (max 110 characters)
- "summary": 1-2 sentence practical takeaway for automotive dealership marketing & sales leaders (max 240 characters)
- "category": short category label such as "Lead Generation", "EV Retail", "CRM & AI", or "Showroom Sales"
- "publisher": publication or organization name
- "publishedHint": month/year or timeframe (e.g. "2026" or "Nov 2026")
- "url": source URL if found in search results, otherwise empty string ""`,
        config: {
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
        }
      };
      let response;
      const maxAttempts = 3;
      for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        try {
          response = await ai.models.generateContent(requestParams);
          break;
        } catch (attemptErr) {
          const classified = classifyGeminiError(attemptErr);
          if (!classified.retryable || attempt === maxAttempts) {
            throw attemptErr;
          }
          const delayMs = 300 * 2 ** (attempt - 1);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
      if (!response) {
        throw new Error("Empty response from Gemini API.");
      }
      const rawText = response.text ?? "";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
      const groundingSources = [];
      const seenUrls = /* @__PURE__ */ new Set();
      for (const chunk of chunks) {
        const uri = chunk.web?.uri?.trim();
        const title = chunk.web?.title?.trim();
        if (uri && !seenUrls.has(uri)) {
          seenUrls.add(uri);
          groundingSources.push({
            title: title || uri,
            url: uri
          });
        }
      }
      let articles = extractJsonArray(rawText);
      articles = articles.map((article, idx) => ({
        ...article,
        url: article.url || groundingSources[idx]?.url || groundingSources[0]?.url || ""
      }));
      if (articles.length === 0 && groundingSources.length > 0) {
        articles = groundingSources.slice(0, 6).map((src) => ({
          headline: src.title,
          summary: rawText.slice(0, 220).trim() || "Recent industry coverage surfaced via Google Search grounding for automotive dealership marketing.",
          category: "Industry Coverage",
          publisher: new URL(src.url).hostname.replace(/^www\./, ""),
          publishedHint: "Google Search",
          url: src.url
        }));
      }
      if (articles.length === 0) {
        res.status(502).json({
          error: "Search completed but returned no structured automotive headlines. Please try syncing again.",
          code: "EMPTY_RESULTS"
        });
        return;
      }
      const payload = {
        topic: topicKey,
        fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
        articles,
        sources: groundingSources.slice(0, 8)
      };
      automotiveNewsCache.set(topicKey, {
        expiresAt: Date.now() + AUTOMOTIVE_NEWS_CACHE_TTL_MS,
        payload
      });
      res.json(payload);
    } catch (err) {
      const classified = classifyGeminiError(err);
      if (classified.isAuthError) {
        console.warn(
          "[/api/automotive-news] Gemini API key rejected by upstream (401/403). Check GEMINI_API_KEY in Settings > Secrets."
        );
      } else {
        const message = err instanceof Error ? err.message : "Unable to fetch grounded automotive headlines.";
        console.warn(`[/api/automotive-news] ${classified.code}:`, message);
      }
      res.status(classified.httpStatus).json({
        error: classified.clientMessage,
        code: classified.code
      });
    }
  });
  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "API route not found.", code: "NOT_FOUND" });
  });
  if (process.env.NODE_ENV === "production") {
    const distDir = path2.resolve(__dirname, "dist");
    const indexFile = path2.join(distDir, "index.html");
    const cachedIndexHtml = fs2.existsSync(indexFile) ? fs2.readFileSync(indexFile, "utf8") : null;
    app.use(express.static(distDir, { dotfiles: "ignore" }));
    app.get("*", (req, res) => {
      const reqPath = req.path || "/";
      if (reqPath.startsWith("/api/") || reqPath.startsWith("/assets/") || reqPath.startsWith("/downloads/") || /\.[a-z0-9]{1,8}$/i.test(reqPath)) {
        res.status(404).end("Resource not found.");
        return;
      }
      if (!cachedIndexHtml) {
        res.status(404).send("Build output not found.");
        return;
      }
      const renderedHtml = renderSeoHtml(cachedIndexHtml, req.path, readDb());
      res.setHeader("Vary", "Accept");
      res.type("text/html; charset=utf-8").send(renderedHtml);
    });
  } else {
    const vitePromise = import("vite").then(
      ({ createServer: createViteServer }) => createViteServer({
        server: {
          middlewareMode: true,
          hmr: false,
          watch: null
        },
        appType: "spa"
      })
    );
    vitePromise.catch((err) => {
      console.error("[Vite initialization error]", err);
    });
    const devIndexPath = path2.resolve(__dirname, "index.html");
    app.use(async (req, res, next) => {
      try {
        const reqPath = req.path || "/";
        if (reqPath.startsWith("/assets/")) {
          const publicAssetPath = path2.resolve(__dirname, "public", reqPath.slice(1));
          if (!fs2.existsSync(publicAssetPath)) {
            res.status(404).end("Asset not found.");
            return;
          }
        }
        const vite = await vitePromise;
        const isPageNavigation = (req.method === "GET" || req.method === "HEAD") && !reqPath.startsWith("/api/") && !reqPath.startsWith("/assets/") && !reqPath.startsWith("/downloads/") && !reqPath.startsWith("/@") && !reqPath.startsWith("/src/") && !reqPath.startsWith("/node_modules/") && !reqPath.startsWith("/.well-known/") && !/\.[a-z0-9]{1,8}$/i.test(reqPath);
        if (isPageNavigation && fs2.existsSync(devIndexPath)) {
          const baseTemplate = fs2.readFileSync(devIndexPath, "utf8");
          const ssrHtml = renderSeoHtml(baseTemplate, req.originalUrl, readDb());
          const transformedHtml = await vite.transformIndexHtml(req.originalUrl, ssrHtml);
          res.setHeader("Vary", "Accept");
          res.status(200).type("text/html; charset=utf-8").end(transformedHtml);
          return;
        }
        vite.middlewares(req, res, next);
      } catch (err) {
        next(err);
      }
    });
  }
  app.use((err, _req, res, _next) => {
    console.error("[Server Error]", err instanceof Error ? err.message : err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error.", code: "INTERNAL_ERROR" });
    }
  });
  const isNumericPort = typeof PORT === "number" || typeof PORT === "string" && /^\d+$/.test(PORT);
  if (isNumericPort) {
    const portNumber = Number(PORT);
    app.listen(portNumber, "0.0.0.0", () => {
      console.log(`AKYIN server listening on port ${portNumber}`);
    });
  } else {
    app.listen(PORT, () => {
      console.log(`AKYIN server listening on socket ${PORT}`);
    });
  }
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
