// server.ts
import "dotenv/config";
import express from "express";
import fs2 from "fs";
import path2 from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

// src/data/akyinData.ts
var OFFICIAL_CONTACT = {
  parentBrand: "AKYIN VENTURES",
  contactName: "Shaikh Nazir",
  domain: "https://akyin.com",
  websiteLabel: "akyin.com",
  email: "connect@akyin.com",
  phoneDisplay: "+91 63956 94011",
  phoneHref: "tel:+916395694011",
  whatsappNumber: "916395694011",
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
  aicalc: "https://aicalc.in",
  kartigo: "https://kartigo.online",
  biznxt: "https://biznxt.online",
  budgetBazaar: "https://budgetbazaar.org"
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
var PRICING_PACKAGES = [
  {
    id: "package-a",
    code: "PACKAGE A",
    name: "Full-Service Growth Marketing & Lead Management",
    subtitle: "Complete end-to-end digital customer acquisition paired with managed AI-assisted calling and enquiry qualification.",
    setupFee: "\u20B939,999",
    monthlyFee: "\u20B949,999",
    featured: true,
    includes: [
      "Meta ads management & campaign optimization",
      "Lead generation forms & conversion creatives",
      "AI-assisted calling up to 1,000 mins/month (subject to vendor plan)",
      "Structured lead filtering & buyer intent capture",
      "Hot / Warm / Future Follow-up / Unreachable / Not Interested classification",
      "Daily Excel enquiry reports & monthly performance review"
    ],
    excludes: [
      "Meta ad spend (paid directly to Meta by client)",
      "Extra AI calling minutes beyond 1,000 mins/month",
      "Influencer / creator fees",
      "Special on-location video shoots & third-party production"
    ],
    enquiryServiceValue: "Package A \u2014 Full-Service Growth Marketing & Lead Management"
  },
  {
    id: "package-b",
    code: "PACKAGE B",
    name: "Lead Filtering & Qualification Only",
    subtitle: "Dedicated managed calling and classification for businesses that already receive incoming enquiries and need disciplined qualification.",
    setupFee: "\u20B914,999",
    monthlyFee: "\u20B919,999",
    featured: false,
    includes: [
      "AI-assisted calling of existing inbound enquiries (up to 1,000 mins/month)",
      "Requirement, budget, timeline & appointment intent capture",
      "Hot / Warm / Future Follow-up / Unreachable / Not Interested classification",
      "Daily Excel qualification sheets & call summaries",
      "Monthly qualification & conversion insight report"
    ],
    excludes: [
      "Meta advertising & paid campaign management",
      "New lead generation (qualifies existing enquiries only)",
      "Extra AI calling minutes beyond 1,000 mins/month"
    ],
    enquiryServiceValue: "Package B \u2014 Lead Filtering & Qualification Only"
  }
];
var RATE_CARD_ITEMS = [
  {
    id: "rc-1",
    service: "Meta lead generation management",
    category: "Lead Generation",
    fee: "\u20B920,000",
    unit: "/month",
    notes: "Campaign strategy, ad setup & optimization (ad spend extra)"
  },
  {
    id: "rc-2",
    service: "Lead filtering and qualification",
    category: "Qualification",
    fee: "\u20B912,000",
    unit: "/month",
    notes: "Existing enquiry calling & Hot/Warm/Future classification"
  },
  {
    id: "rc-3",
    service: "AI calling workflow management",
    category: "Qualification",
    fee: "\u20B95,000",
    unit: "/month",
    notes: "Managed internally by AKYIN (not standalone software)"
  },
  {
    id: "rc-4",
    service: "CRM and lead pipeline management",
    category: "Operations",
    fee: "\u20B95,000",
    unit: "/month",
    notes: "Pipeline hygiene, status tracking & Excel/summary reporting"
  },
  {
    id: "rc-5",
    service: "Social media management",
    category: "Creative & Social",
    fee: "\u20B98,000",
    unit: "/month",
    notes: "Scheduled brand content & page hygiene"
  },
  {
    id: "rc-6",
    service: "8 promotional reels",
    category: "Creative & Social",
    fee: "\u20B910,000",
    unit: "/month",
    notes: "Edited vertical reels from client or curated footage"
  },
  {
    id: "rc-7",
    service: "10 graphic creatives",
    category: "Creative & Social",
    fee: "\u20B94,000",
    unit: "/month",
    notes: "Static offer, product highlight & festive templates"
  },
  {
    id: "rc-8",
    service: "Influencer campaign coordination",
    category: "Influencer",
    fee: "\u20B92,500",
    unit: "/campaign",
    notes: "Creator shortlisting, brief & shoot scheduling"
  },
  {
    id: "rc-9",
    service: "Influencer video and upload",
    category: "Influencer",
    fee: "\u20B96,000",
    unit: "/creator",
    notes: "Coordination & content publishing workflow (creator fees separate)"
  },
  {
    id: "rc-10",
    service: "Product / model launch campaign",
    category: "Campaigns",
    fee: "\u20B910,000",
    unit: "/campaign",
    notes: "Dedicated new product/model unveiling & booking promotion"
  },
  {
    id: "rc-11",
    service: "Demo / visit booking campaign",
    category: "Campaigns",
    fee: "\u20B97,500",
    unit: "/campaign",
    notes: "Targeted local appointment, demo or test-drive booking drive"
  },
  {
    id: "rc-12",
    service: "Upgrade / exchange event campaign",
    category: "Campaigns",
    fee: "\u20B910,000",
    unit: "/campaign",
    notes: "Promotional weekend event & upgrade valuation push"
  },
  {
    id: "rc-13",
    service: "Festive campaign",
    category: "Campaigns",
    fee: "\u20B910,000",
    unit: "/campaign",
    notes: "Seasonal offer rollout & customer footfall drive"
  },
  {
    id: "rc-14",
    service: "Catalog & stock rotation marketing",
    category: "Campaigns",
    fee: "\u20B98,000",
    unit: "/month",
    notes: "Specialty inventory & pre-owned stock promotion"
  },
  {
    id: "rc-15",
    service: "Google Business Profile management",
    category: "Local Search",
    fee: "\u20B93,000",
    unit: "/month",
    notes: "Listing hygiene, updates & local Maps discovery"
  },
  {
    id: "rc-16",
    service: "Local SEO management",
    category: "Local Search",
    fee: "\u20B96,000",
    unit: "/month",
    notes: "Catchment keyword & regional search visibility"
  },
  {
    id: "rc-17",
    service: "Customer retention campaign",
    category: "Retention",
    fee: "\u20B98,000",
    unit: "/month",
    notes: "Repeat customer & service centre booking outreach"
  },
  {
    id: "rc-18",
    service: "Corporate / B2B campaign",
    category: "B2B / Institutional",
    fee: "\u20B910,000",
    unit: "/campaign",
    notes: "Institutional, corporate & commercial buyer acquisition"
  },
  {
    id: "rc-19",
    service: "Product & pitch presentation PPT",
    category: "Sales Enablement",
    fee: "\u20B93,000",
    unit: "/presentation",
    notes: "Structured offering, product & pricing sales deck"
  },
  {
    id: "rc-20",
    service: "Sales training",
    category: "Training",
    fee: "\u20B925,000",
    unit: "/session",
    notes: "Product presentation, objection handling & deal closing"
  },
  {
    id: "rc-21",
    service: "Personality development training",
    category: "Training",
    fee: "\u20B925,000",
    unit: "/session",
    notes: "Grooming, communication & executive frontline etiquette"
  }
];
var ENQUIRY_TYPE_OPTIONS = [
  "General Consultation / Proposal",
  "Package A \u2014 Full-Service Growth Marketing & Lead Management",
  "Package B \u2014 Lead Filtering & Qualification Only",
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
- **Phone**: [${OFFICIAL_CONTACT.phoneDisplay}](${OFFICIAL_CONTACT.phoneHref})
- **Service Availability**: ${OFFICIAL_CONTACT.regionIndicator} \u2014 ${OFFICIAL_CONTACT.internationalSupportLine}
- **Follow AKYIN**: [Facebook \u2013 Follow AKYIN](${OFFICIAL_CONTACT.marketingSocials[0].url}) | [YouTube \u2013 Subscribe to AKYIN Marketing](${OFFICIAL_CONTACT.marketingSocials[1].url}) | [Instagram \u2013 Follow AKYIN Ventures](${OFFICIAL_CONTACT.marketingSocials[2].url}) | [WhatsApp \u2013 Join AKYIN Updates](${OFFICIAL_CONTACT.marketingSocials[3].url})
- **Key Pages**: [About](/about) | [Ventures](/ventures) | [Pricing](/pricing) | [Advisory](/advisory) | [Contact](/contact) | [Terms](/terms) | [Privacy](/privacy) | [Sitemap](/sitemap)
- **Agent Endpoints**: [/llms.txt](/llms.txt) | [/.well-known/mcp/server-card.json](/.well-known/mcp/server-card.json) | [/robots.txt](/robots.txt)
`;
  if (cleaned === "/pricing") {
    const pkgLines = PRICING_PACKAGES.map(
      (p) => `### ${p.code}: ${p.name}
- **One-Time Setup**: ${p.setupFee} INR
- **Monthly Retainer**: ${p.monthlyFee} INR
- **Includes**: ${p.includes.join("; ")}
- **Excludes**: ${p.excludes.join("; ")}`
    ).join("\n\n");
    const rateLines = RATE_CARD_ITEMS.map(
      (r) => `| ${r.service} | ${r.category} | ${r.fee}${r.unit} INR | ${r.notes} |`
    ).join("\n");
    return `# AKYIN Ventures \u2014 Transparent Pricing & Rate Card

> All commercial retainers, training workshops, and individual services are priced transparently in INR. Ad spend is paid directly to Meta or Google by clients.

${pkgLines}

## Business Advisory & Training
- **Sales Team & Showroom Training**: \u20B925,000 / session
- **Personality Development Workshop**: \u20B925,000 / session
- **1-on-1 Business Advisory Consultation**: \u20B91,999 / 30-min IST session ([Book Advisory](/advisory))

## 21-Item Individual Service Rate Card
| Service | Category | Fee (INR) | Scope Notes |
|---|---|---|---|
${rateLines}
${commonFooter}`;
  }
  if (cleaned === "/marketing/automotive") {
    return `# AKYIN Marketing \u2014 Automotive Dealership Growth Division

> Specialized 16-service marketing, lead filtering, and floor sales coaching division engineered for automotive dealerships.

## Core Capabilities
- **Lead Generation (01)** & **Lead Filtering & Qualification (02)** managed independently for clean showroom accountability.
- Interactive Tools: **Agency Value Calculator (12/24 Month ROI)**, **Lead Quality Index**, **Lead Density Heatmap**, **Performance Radar Benchmark**, and **Executive A4 Dealership Dossier (PDF & PNG)**.
- **Transparent Retainers**: Package A (\u20B939,999 setup + \u20B949,999/mo), Package B (\u20B914,999 setup + \u20B919,999/mo), Sales Training (\u20B925,000/session). [Full Pricing](/pricing).
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
    return `# AKYIN MARKETINGS \u2014 Full-Service Marketing Agency
    
> Drive qualified demand and strengthen commercial sales execution across retail, B2B, services, and automotive dealerships.

- **18 Specialized Agency Services** across Lead Gen & Filtering, AI-Assisted Calling, Creative & Video Production, Local Growth, and Commercial Sales Training.
- **Automotive Division**: [AKYIN Automotive Marketing](/marketing/automotive)
- **Pricing**: Package A (\u20B939,999 setup + \u20B949,999/mo) \xB7 Package B (\u20B914,999 setup + \u20B919,999/mo) \xB7 Sales Training (\u20B925,000/session). [View Full Rate Card](/pricing).
${commonFooter}`;
  }
  if (cleaned === "/terms" || cleaned === "/privacy") {
    return `# AKYIN Ventures \u2014 Terms of Service & Privacy Policy

## Terms of Service
1. **Parent Group Attribution**: akyin.com represents AKYIN Ventures and its seven operating verticals. Third-party marketplaces (Amazon, Google Play Books, Shopify) and clients (AutoClub) are explicitly distinguished.
2. **Direct Platform Ad Billing**: Clients pay Meta and Google advertising spend directly to those platforms. Agency fees cover strategy, setup, management, and qualification only.
3. **Service Separation**: Lead Generation and Lead Filtering are strictly separated. AI-assisted calling and CRM pipeline tracking are internal managed services, not standalone SaaS licenses.

## Privacy Policy
- Visitor enquiries are validated client-side and transmitted directly to AKYIN Ventures' authorized workspace desk or user-selected WhatsApp/Email apps.
- AKYIN Ventures never sells or brokers contact data to third parties.
- Contact [connect@akyin.com](mailto:connect@akyin.com) or [+91 63956 94011](tel:+916395694011) for data requests.
${commonFooter}`;
  }
  if (cleaned === "/about") {
    return `# About AKYIN Ventures \u2014 One Vision. Multiple Business Ventures.

AKYIN Ventures operates seven specialized operating businesses alongside a full-service marketing agency grounded in 16 years of commercial & automotive industry experience (mass-market to luxury retail).

- **Owned Verticals**: AKYIN Publishing, AKYIN MARKETINGS, AKYIN Store (AKYIN Thrift), AICalc.in, Kartigo.online, BizNXT.online, Budget Bazaar.
- **Security & Integrity**: Strict CSP rules, URI allowlisting, schema-validated forms, and zero-broker enquiry routing.
- **FAQs**: Clear boundaries between owned ventures, external clients (AutoClub), and distribution platforms.
${commonFooter}`;
  }
  if (cleaned === "/advisory") {
    return `# AKYIN Business Advisory \u2014 Consultation Booking

> Your Business. Your Vision. A Clearer Direction.

- **Format**: 1-on-1 Strategic Consultation (30-minute slots, Asia/Kolkata IST).
- **Indicative Consultation Fee**: \u20B91,999 INR per session (confirmed before slot lock; no automated online gateway charge).
- **Focus Areas**: Business feasibility, sales team conversion, agency growth roadmap, and venture planning.
${commonFooter}`;
  }
  if (cleaned === "/contact") {
    return `# Contact AKYIN Ventures \u2014 Central Enquiry Desk

Reach our corporate desk or any of the seven operating verticals directly:

- **Corporate Email**: [connect@akyin.com](mailto:connect@akyin.com)
- **Phone**: [+91 63956 94011](tel:+916395694011)
- **Booking Desk**: [Schedule Business Advisory](/advisory)
${commonFooter}`;
  }
  const ventureList = VENTURES_PORTFOLIO.map(
    (v) => `- **${v.code}. ${v.name}** (${v.sector}): ${v.description} \u2014 [Internal Page](${OFFICIAL_CONTACT.domain}${v.route})${v.externalUrl ? ` | [Live Platform](${v.externalUrl})` : ""}`
  ).join("\n");
  return `# AKYIN Ventures \u2014 Building Ideas Into Businesses

> Multi-business corporate group and full-service marketing agency operating seven independent verticals across digital marketing, publishing, fashion retail, AI tools, B2B supply, value retail, and consulting.

## Seven Operating Verticals
${ventureList}

## Transparent Agency & Consultation Pricing (INR)
- **Package A (Full-Service Growth Marketing & Lead Management)**: \u20B939,999 setup + \u20B949,999/month
- **Package B (Lead Filtering & Qualification Only)**: \u20B914,999 setup + \u20B919,999/month
- **Commercial & Dealership Sales Training**: \u20B925,000 / session
- **Business Advisory Session (30 min IST)**: \u20B91,999 / session
- See complete 21-item schedule on [Pricing Page](/pricing)

## External Platforms & Publishing
- [AICalc.in](${EXTERNAL_VERTICAL_URLS.aicalc}) | [Kartigo.online](${EXTERNAL_VERTICAL_URLS.kartigo}) | [BizNXT.online](${EXTERNAL_VERTICAL_URLS.biznxt}) | [BudgetBazaar.org](${EXTERNAL_VERTICAL_URLS.budgetBazaar})
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
    category: "Executive Consultation",
    amountPaise: 199900,
    amountInr: 1999,
    displayPrice: "\u20B91,999",
    description: "30-minute private strategy consultation on India Standard Time (Asia/Kolkata)."
  },
  {
    sku: "package-a-setup",
    title: "Package A \u2014 Full-Service Growth Marketing Setup Fee",
    shortLabel: "Package A Setup",
    category: "Agency Retainer Setup",
    amountPaise: 3999900,
    amountInr: 39999,
    displayPrice: "\u20B939,999",
    description: "One-time onboarding, ad architecture & AI qualification script setup for Package A."
  },
  {
    sku: "package-b-setup",
    title: "Package B \u2014 Lead Filtering & Qualification Setup Fee",
    shortLabel: "Package B Setup",
    category: "Agency Retainer Setup",
    amountPaise: 1499900,
    amountInr: 14999,
    displayPrice: "\u20B914,999",
    description: "One-time onboarding, calling workflow & pipeline sheet setup for Package B."
  },
  {
    sku: "sales-training",
    title: "Commercial & Dealership Sales Training Workshop",
    shortLabel: "Sales Training",
    category: "Showroom & Team Coaching",
    amountPaise: 25e5,
    amountInr: 25e3,
    displayPrice: "\u20B925,000",
    description: "Per-session commercial sales, walkthrough & closing workshop for teams."
  }
];
var PAYMENT_CATALOG_BY_SKU = {
  "advisory-session": PAYMENT_CATALOG_LIST[0],
  "package-a-setup": PAYMENT_CATALOG_LIST[1],
  "package-b-setup": PAYMENT_CATALOG_LIST[2],
  "sales-training": PAYMENT_CATALOG_LIST[3]
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
function calculateQuotationTotals(rawItems, configuredDiscount, gstEnabled, gstRate) {
  const items = rawItems.map((item) => {
    const qty = Math.max(0, Number.isFinite(item.qty) ? item.qty : 0);
    const unitPrice = Math.max(0, Number.isFinite(item.unitPrice) ? item.unitPrice : 0);
    const lineTotal = round2(qty * unitPrice);
    return {
      id: item.id,
      serviceId: item.serviceId,
      title: item.title,
      description: item.description || "",
      qty,
      unitPrice: round2(unitPrice),
      lineTotal
    };
  });
  const subtotal = round2(items.reduce((acc, item) => acc + item.lineTotal, 0));
  const discountAmount = round2(clampNumber(configuredDiscount, 0, subtotal));
  const taxableAmount = round2(Math.max(0, subtotal - discountAmount));
  const effectiveGstRate = gstEnabled ? clampNumber(gstRate, 0, 100) : 0;
  const gstAmount = gstEnabled ? round2(taxableAmount * (effectiveGstRate / 100)) : 0;
  const grandTotal = round2(taxableAmount + gstAmount);
  return {
    items,
    subtotal,
    discountAmount,
    taxableAmount,
    gstAmount,
    grandTotal
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
    const socket = cfg.port === 465 ? connectTls() : net.connect({ host: cfg.host, port: cfg.port, timeout: 1e4 });
    let step = 0;
    let buffer = "";
    let settled = false;
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
    socket.on("timeout", () => finish(new Error("SMTP connection timed out")));
    socket.on("error", (err) => finish(err));
    const sendCmd = (cmd) => {
      socket.write(`${cmd}\r
`);
    };
    const handleLine = (code, line) => {
      if (code >= 400) {
        finish(new Error(`SMTP ${code}: ${line}`));
        return;
      }
      if (step === 0 && code === 220) {
        step = 1;
        sendCmd("EHLO akyin.com");
      } else if (step === 1 && code === 250) {
        step = 2;
        sendCmd("AUTH LOGIN");
      } else if (step === 2 && code === 334) {
        step = 3;
        sendCmd(Buffer.from(cfg.user, "utf8").toString("base64"));
      } else if (step === 3 && code === 334) {
        step = 4;
        sendCmd(Buffer.from(cfg.pass, "utf8").toString("base64"));
      } else if (step === 4 && code === 235) {
        step = 5;
        sendCmd(`MAIL FROM:<${cleanFrom}>`);
      } else if (step === 5 && code === 250) {
        step = 6;
        sendCmd(`RCPT TO:<${cleanTo}>`);
      } else if (step === 6 && (code === 250 || code === 251)) {
        step = 7;
        sendCmd("DATA");
      } else if (step === 7 && code === 354) {
        step = 8;
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
      } else if (step === 8 && code === 250) {
        step = 9;
        sendCmd("QUIT");
      } else if (step === 9) {
        finish();
      }
    };
    socket.on("data", (chunk) => {
      buffer += chunk.toString("utf8");
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (!line) continue;
        if (line.length >= 4 && line[3] === "-") continue;
        const code = Number(line.slice(0, 3));
        if (Number.isFinite(code)) {
          handleLine(code, line);
        }
      }
    });
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
var CURRENT_SCHEMA_VERSION = 1;
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
    refund_processed: true
  }
};
var DEFAULT_WEBSITE_SETTINGS = {
  reportedClientsCount: 58,
  advisoryHeadline: "Your Business. Your Vision. A Clearer Direction.",
  advisorySubheadline: "Focused 1-on-1 commercial advisory and business direction sessions with AKYIN Ventures\u2014structured around clarity, unit economics, and practical execution.",
  consultationFee: "\u20B91,999 (30-min IST Session)",
  advisorySlotDuration: "30",
  advisoryMaxBookings: "2",
  notificationEmail: process.env.OWNER_NOTIFICATION_EMAIL || "connect@akyin.com",
  contactEmail: "connect@akyin.com",
  contactPhone: "+91 63956 94011",
  whatsappNumber: "916395694011",
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
      websiteUrl: "/ventures/biznxt",
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
      websiteUrl: "/ventures/kartigo",
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
      websiteUrl: "/ventures/budget-bazaar",
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
function buildInitialServices(nowIso) {
  const list = [
    {
      id: "srv-digital-marketing",
      name: "Package A \u2014 Full-Service Growth Marketing & Lead Management",
      category: "Digital marketing",
      description: "End-to-end paid acquisition, creative suite, AI-assisted enquiry qualification, and daily CRM tracking.",
      deliverables: [
        "Meta & Google campaign architecture",
        "8 promotional reels + 10 graphic creatives/month",
        "Two-tier lead vetting & Hot/Warm/Future handover",
        "Daily pipeline sheet & monthly executive summary"
      ],
      pricingModel: "fixed",
      setupFee: 39999,
      recurringFee: 3e4,
      billingCycle: "monthly",
      addons: [{ name: "Ad creative boost pack (6 additional creatives)", price: 4e3 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "7\u201310 business days onboarding"
    },
    {
      id: "srv-lead-gen",
      name: "Package B \u2014 Lead Filtering & Qualification Retainer",
      category: "Lead generation",
      description: "Structured telephonic and AI-assisted vetting of existing inbound leads before sales floor handover.",
      deliverables: [
        "AI-assisted outbound calling (up to 1,000 mins/month)",
        "Budget, timeline & intent verification",
        "Hot / Warm / Future Lead status tagging"
      ],
      pricingModel: "fixed",
      setupFee: 14999,
      recurringFee: 12e3,
      billingCycle: "monthly",
      addons: [{ name: "CRM pipeline reporting management", price: 5e3 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "5 business days setup"
    },
    {
      id: "srv-social-media",
      name: "Social Media Management & Reels Suite",
      category: "Social media management",
      description: "Monthly brand editorial calendar, scheduled publishing, and community hygiene across Instagram & Facebook.",
      deliverables: [
        "Scheduled monthly content calendar",
        "Page hygiene & response playbooks",
        "Performance summary report"
      ],
      pricingModel: "fixed",
      setupFee: 0,
      recurringFee: 8e3,
      billingCycle: "monthly",
      addons: [
        { name: "8 promotional reels/month", price: 1e4 },
        { name: "10 graphic creatives/month", price: 4e3 }
      ],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "Monthly cycle"
    },
    {
      id: "srv-google-ads",
      name: "Google Ads & Search Acquisition Management",
      category: "Google Ads management",
      description: "High-intent Search, Performance Max, and local Google Maps lead campaigns with direct client ad billing.",
      deliverables: [
        "Keyword intent research & negative keyword hygiene",
        "Conversion tracking & landing page alignment",
        "Weekly bid & CPL optimization"
      ],
      pricingModel: "custom",
      setupFee: 0,
      recurringFee: 0,
      billingCycle: "monthly",
      addons: [{ name: "Google Business Profile management", price: 3e3 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "5\u20137 business days launch"
    },
    {
      id: "srv-meta-ads",
      name: "Meta Ads Lead Generation Management",
      category: "Meta Ads management",
      description: "Targeted Facebook & Instagram lead forms and WhatsApp click-to-chat acquisition (ad spend billed directly to client).",
      deliverables: [
        "Campaign strategy & audience segmentation",
        "Instant lead forms & retargeting flows",
        "Creative A/B testing & CPL optimization"
      ],
      pricingModel: "fixed",
      setupFee: 0,
      recurringFee: 2e4,
      billingCycle: "monthly",
      addons: [{ name: "Demo / visit booking micro-campaign", price: 7500 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "5 business days launch"
    },
    {
      id: "srv-website-dev",
      name: "Website Development & Conversion Landing Pages",
      category: "Website development",
      description: "Fast, mobile-first business websites and conversion landing pages tailored for lead capture.",
      deliverables: [
        "Responsive UI & clean information architecture",
        "Integrated enquiry & WhatsApp/booking capture",
        "Technical SEO metadata & analytics setup"
      ],
      pricingModel: "custom",
      setupFee: 0,
      recurringFee: 0,
      billingCycle: "one-time",
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "2\u20134 weeks (scope dependent)"
    },
    {
      id: "srv-seo",
      name: "Local SEO & Google Business Profile Management",
      category: "SEO",
      description: "Regional search visibility, catchment keyword positioning, and Google Maps listing optimization.",
      deliverables: [
        "Local catchment keyword optimization",
        "Google Business Profile weekly updates",
        "Monthly organic ranking & call click report"
      ],
      pricingModel: "fixed",
      setupFee: 0,
      recurringFee: 6e3,
      billingCycle: "monthly",
      addons: [{ name: "Google Business Profile add-on", price: 3e3 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "Ongoing monthly"
    },
    {
      id: "srv-branding",
      name: "Branding, Collateral & Sales Pitch Presentation",
      category: "Branding",
      description: "Cohesive corporate brand positioning, visual templates, and structured commercial pitch PPTs.",
      deliverables: [
        "Structured product & pricing pitch PPT deck",
        "Brand visual typography & palette alignment",
        "Print-ready brochure & digital share kit"
      ],
      pricingModel: "fixed",
      setupFee: 3e3,
      recurringFee: 0,
      billingCycle: "one-time",
      addons: [{ name: "10 branded graphic templates", price: 4e3 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "5\u20137 business days"
    },
    {
      id: "srv-consulting",
      name: "1-on-1 Business Advisory Consultation (30 min IST)",
      category: "Business consulting",
      description: "Private commercial strategy, feasibility, and unit-economics diagnostic session directly with AKYIN Ventures.",
      deliverables: [
        "30-minute private IST video consultation",
        "Unit economics & funnel bottleneck audit",
        "Actionable next-step priorities summary"
      ],
      pricingModel: "fixed",
      setupFee: 1999,
      recurringFee: 0,
      billingCycle: "one-time",
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "Scheduled 6:00 PM \u2013 7:00 PM IST slot"
    },
    {
      id: "srv-automotive",
      name: "Automotive Dealership Test-Drive & Floor Sales Program",
      category: "Automotive dealership marketing",
      description: "Specialized multi-brand car & EV dealership growth uniting vehicle lead ads, buyer vetting, and showroom floor sales coaching.",
      deliverables: [
        "Geo-fenced model & exchange carnival lead drives",
        "Telephonic & AI buyer readiness qualification",
        "Showroom floor sales & closing training workshop"
      ],
      pricingModel: "fixed",
      setupFee: 25e3,
      recurringFee: 0,
      billingCycle: "one-time",
      addons: [
        { name: "Festive / Exchange event campaign", price: 1e4 },
        { name: "Catalog & pre-owned stock rotation", price: 8e3 }
      ],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "On-site / virtual workshop + campaign sprint"
    },
    {
      id: "srv-customer-acquisition",
      name: "Customer Acquisition & Retention Campaigns",
      category: "Customer acquisition",
      description: "Targeted buyer reactivation, B2B outreach campaigns, and seasonal promotion sprints.",
      deliverables: [
        "Database reactivation & repeat-visit messaging",
        "Corporate / institutional B2B buyer acquisition",
        "Weekly conversion & booking log"
      ],
      pricingModel: "fixed",
      setupFee: 0,
      recurringFee: 8e3,
      billingCycle: "monthly",
      addons: [{ name: "Corporate / B2B campaign sprint", price: 1e4 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "7 business days rollout"
    },
    {
      id: "srv-sales-strategy",
      name: "Commercial Sales & Marketing Strategy Workshop",
      category: "Sales and marketing strategy",
      description: "Hands-on sales playbook, objection handling, personality development, and conversion scripting for commercial teams.",
      deliverables: [
        "Showroom / inside-sales closing script framework",
        "Objection handling & follow-up cadence training",
        "Team communication & executive etiquette workshop"
      ],
      pricingModel: "fixed",
      setupFee: 25e3,
      recurringFee: 0,
      billingCycle: "one-time",
      addons: [{ name: "Personality development module", price: 25e3 }],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "Scheduled intensive session"
    },
    {
      id: "srv-custom-solutions",
      name: "Custom International Business & Digital Solutions (India / UAE)",
      category: "Custom business solutions",
      description: "Bespoke multi-market operations, CRM automation, B2B trade setup, and custom commercial retainers scoped per requirement.",
      deliverables: [
        "Tailored technical & commercial scoping dossier",
        "Custom milestone schedule & deliverable SLAs",
        "Dedicated project lead across India & UAE time zones"
      ],
      pricingModel: "custom",
      setupFee: 0,
      recurringFee: 0,
      billingCycle: "custom",
      addons: [],
      gstEnabled: true,
      gstRate: 18,
      deliveryPeriod: "Custom milestone timeline"
    }
  ];
  return list.map((item, idx) => ({
    ...item,
    active: true,
    sortOrder: idx + 1,
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
    services: buildInitialServices(nowIso),
    quotations: [],
    invoices: [],
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
    services: Array.isArray(raw.services) && raw.services.length > 0 ? raw.services : defaults.services,
    quotations: Array.isArray(raw.quotations) ? raw.quotations : [],
    invoices: Array.isArray(raw.invoices) ? raw.invoices : [],
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
var SERVICE_CATEGORIES = [
  "Digital marketing",
  "Lead generation",
  "Social media management",
  "Google Ads management",
  "Meta Ads management",
  "Website development",
  "SEO",
  "Branding",
  "Business consulting",
  "Automotive dealership marketing",
  "Customer acquisition",
  "Sales and marketing strategy",
  "Custom business solutions"
];
var quotationLineItemSchema = z.object({
  id: z.string().trim().min(1).max(60),
  serviceId: z.string().trim().max(60).optional(),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(500).default(""),
  qty: z.number().finite().positive().max(1e4),
  unitPrice: z.number().finite().min(0).max(1e8)
});

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
  app.get("/api/public/services", (_req, res) => {
    const db = readDb();
    res.json({
      categories: SERVICE_CATEGORIES,
      services: (db.services || []).filter((s) => s.active).sort((a, b) => a.sortOrder - b.sortOrder)
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
      sku: z2.enum(["advisory-session", "package-a-setup", "package-b-setup", "sales-training"]).optional(),
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
      sku: z2.enum(["advisory-session", "package-a-setup", "package-b-setup", "sales-training"]).optional(),
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
    "/api/suite/services",
    requireAuth,
    requirePermission("services"),
    (_req, res) => {
      const db = readDb();
      res.json({
        categories: SERVICE_CATEGORIES,
        services: (db.services || []).sort((a, b) => a.sortOrder - b.sortOrder)
      });
    }
  );
  app.post(
    "/api/suite/services",
    requireAuth,
    requirePermission("services"),
    async (req, res) => {
      const schema = z2.object({
        name: z2.string().trim().min(2).max(140),
        category: z2.enum(SERVICE_CATEGORIES),
        description: z2.string().trim().max(800).default(""),
        deliverables: z2.array(z2.string().trim().max(200)).default([]),
        pricingModel: z2.enum(["fixed", "custom"]).default("fixed"),
        setupFee: z2.number().finite().min(0).default(0),
        recurringFee: z2.number().finite().min(0).default(0),
        billingCycle: z2.enum(["one-time", "monthly", "quarterly", "custom"]).default("monthly"),
        gstEnabled: z2.boolean().default(true),
        gstRate: z2.number().finite().min(0).max(100).default(18),
        deliveryPeriod: z2.string().trim().max(120).default("7 business days"),
        active: z2.boolean().default(true)
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid service item." });
        return;
      }
      const item = await withDbMutation((db) => {
        const nowIso = (/* @__PURE__ */ new Date()).toISOString();
        const srv = {
          id: `srv-${crypto4.randomBytes(4).toString("hex")}`,
          ...parsed.data,
          addons: [],
          sortOrder: db.services.length + 1,
          updatedAt: nowIso
        };
        db.services.push(srv);
        appendAuditLog(db, {
          actorId: req.suiteUser.id,
          actorName: req.suiteUser.name,
          actorRole: req.suiteUser.role,
          action: "CREATE_SERVICE_ITEM",
          targetId: srv.id,
          summary: `Added service '${srv.name}' under ${srv.category}.`
        });
        return srv;
      });
      res.status(201).json({ service: item });
    }
  );
  app.patch(
    "/api/suite/services/:serviceId",
    requireAuth,
    requirePermission("services"),
    async (req, res) => {
      const serviceId = String(req.params.serviceId || "");
      try {
        const updated = await withDbMutation((db) => {
          const srv = db.services.find((s) => s.id === serviceId);
          if (!srv) {
            const err = new Error("Service item not found.");
            err.statusCode = 404;
            throw err;
          }
          const b = req.body || {};
          if (typeof b.name === "string" && b.name.trim()) srv.name = stripControls(b.name);
          if (typeof b.category === "string" && SERVICE_CATEGORIES.includes(b.category)) {
            srv.category = b.category;
          }
          if (typeof b.description === "string") srv.description = stripControls(b.description);
          if (Array.isArray(b.deliverables)) {
            srv.deliverables = b.deliverables.map((d) => stripControls(String(d))).filter(Boolean);
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
          if (typeof b.gstEnabled === "boolean") srv.gstEnabled = b.gstEnabled;
          if (typeof b.gstRate === "number" && Number.isFinite(b.gstRate)) {
            srv.gstRate = Math.min(100, Math.max(0, b.gstRate));
          }
          if (typeof b.deliveryPeriod === "string") srv.deliveryPeriod = stripControls(b.deliveryPeriod);
          if (typeof b.active === "boolean") srv.active = b.active;
          srv.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
          appendAuditLog(db, {
            actorId: req.suiteUser.id,
            actorName: req.suiteUser.name,
            actorRole: req.suiteUser.role,
            action: "UPDATE_SERVICE_ITEM",
            targetId: srv.id,
            summary: `Updated '${srv.name}' (active=${srv.active}).`
          });
          return srv;
        });
        res.json({ service: updated });
      } catch (err) {
        res.status(err?.statusCode || 400).json({ error: err?.message || "Service update failed." });
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
        serviceCategory: z2.string().trim().max(100).optional().default("Digital marketing")
      });
      const parsed = paymentTypeSchema.safeParse(req.body || {});
      const opts = parsed.success ? parsed.data : { paymentType: "full", dueDate: "", serviceCategory: "Digital marketing" };
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
          const inv = {
            id: invId,
            invoiceNumber,
            quotationId: qt.id,
            quotationNumber: qt.quoteNumber,
            leadId: qt.leadId,
            clientId: qt.clientId,
            serviceCategory: opts.serviceCategory,
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
      const updated = await withDbMutation((db) => {
        if (typeof b.ownerNotificationEmail === "string") {
          db.notificationSettings.ownerNotificationEmail = stripControls(b.ownerNotificationEmail);
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
var ROUTE_SEO_META = {
  "/": {
    title: "AKYIN Ventures \u2014 Multi-Business Group & Marketing Agency",
    description: "AKYIN Ventures is a diversified multi-business group and marketing agency spanning publishing, automotive growth, retail, AI tools, B2B trade, and advisory."
  },
  "/about": {
    title: "About AKYIN Ventures \u2014 One Vision. Multiple Business Ventures.",
    description: "Corporate profile of AKYIN Ventures and its seven operating divisions across publishing, performance marketing, retail, AI tools, and B2B commerce."
  },
  "/ventures": {
    title: "Our Businesses \u2014 AKYIN Ventures Portfolio",
    description: "Explore Akyin Publishing, Akyin Marketing Agency, Akyin Store, AICalc.in, Kartigo.online, BizNXT.online, and Budget Bazaar."
  },
  "/ventures/publishing": {
    title: "AKYIN Publishing \u2014 Ideas That Inspire. Knowledge That Empowers. | akyin.com",
    description: "Explore eight books on Amazon and three digital guides & productivity tools published by AKYIN."
  },
  "/ventures/marketing": {
    title: "AKYIN MARKETINGS \u2014 Full-Service Marketing Agency & Growth Solutions",
    description: "Full-service digital marketing agency delivering Meta lead generation, brand campaigns, AI-assisted lead qualification, and commercial sales training."
  },
  "/marketing/automotive": {
    title: "Car Dealership Marketing & Test-Drive Leads | AKYIN",
    description: "Book qualified showroom test drives, not cold clicks. Targeted Meta & Google auto ads, lead vetting, and floor sales coaching. Get a quote.",
    ogTitle: "More Showroom Test Drives. Zero Cold Leads. | AKYIN",
    ogDescription: "High-intent Meta & Google auto ads, automated lead vetting, and dealer sales coaching built to fill your showroom floor faster."
  },
  "/pricing": {
    title: "Pricing & Rate Card \u2014 AKYIN Ventures & Marketing Agency",
    description: "Transparent INR pricing for AKYIN Marketing Agency packages, lead filtering retainers, dealership sales training, and 1-on-1 business advisory."
  },
  "/advisory": {
    title: "Business Advisory & Consultation Booking \u2014 AKYIN Ventures",
    description: "Schedule a 1-on-1 30-minute IST Business Advisory consultation with AKYIN Ventures."
  },
  "/terms": {
    title: "Terms of Service \u2014 AKYIN Ventures | akyin.com",
    description: "Terms of Service, direct ad platform billing rules, service scope separation, and governance policies for AKYIN Ventures."
  },
  "/privacy": {
    title: "Privacy Policy \u2014 AKYIN Ventures | akyin.com",
    description: "Zero-broker data privacy, enquiry validation, and security standards across AKYIN Ventures."
  },
  "/contact": {
    title: "Contact AKYIN Ventures \u2014 Let\u2019s Start a Conversation",
    description: "Direct enquiry desk for AKYIN Ventures and all seven operating verticals."
  },
  "/tools": {
    title: "Business, Marketing & Sales Calculators Suite | AKYIN.com",
    description: "20 free transparent interactive marketing ROI, ROAS, CPL, CAC, sales forecast, quotation, GST, and business growth tools by AKYIN Ventures."
  },
  "/quote": {
    title: "Client Quotation & Payment Portal \u2014 AKYIN Ventures",
    description: "Review, accept, print A4 dossier, or settle your AKYIN Ventures commercial quotation online."
  }
};
function escapeHtmlAttr(value) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function createGeminiClient() {
  let apiKey = (process.env.GEMINI_API_KEY ?? "").trim().replace(/^(['"])(.*)\1$/, "$2").trim().replace(/^Bearer\s+/i, "").trim();
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || /^(your_|replace_|test_|changeme|<.*>)/i.test(apiKey)) {
    return { client: null, reason: "API_KEY_MISSING" };
  }
  if (/\s/.test(apiKey) || apiKey.startsWith("ya29.")) {
    return { client: null, reason: "API_KEY_INVALID_FORMAT" };
  }
  return {
    client: new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    }),
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
    res.type("text/plain; charset=utf-8").send("User-agent: *\nAllow: /\nDisallow: /admin\nContent-Signal: search=yes, ai-input=yes, ai-train=no\nSitemap: https://akyin.com/sitemap.xml\n");
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
    const file = resolvePublicOrDistFile("sitemap.xml");
    if (file) {
      res.type("application/xml; charset=utf-8").sendFile(file);
      return;
    }
    res.status(404).send("Sitemap not found.");
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
  app.get("/downloads/:filename", (req, res, next) => {
    const rawFilename = req.params.filename;
    const sanitizedFilename = path2.basename(rawFilename);
    const resolvedPath = resolvePublicOrDistFile(path2.join("downloads", sanitizedFilename));
    if (resolvedPath && fs2.existsSync(resolvedPath)) {
      if (sanitizedFilename.toLowerCase().endsWith(".pdf")) {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="${sanitizedFilename}"`);
      }
      res.setHeader("Cache-Control", "public, max-age=86400");
      return res.sendFile(resolvedPath);
    }
    next();
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
              description: "Retrieve transparent INR pricing for AKYIN MARKETINGS retainers (Package A & B), sales training, and the 21-item rate card.",
              inputSchema: {
                type: "object",
                properties: {
                  category: { type: "string", description: "Optional service category." }
                }
              }
            },
            {
              name: "get_contact_channels",
              description: "Get official corporate email, telephone, WhatsApp, legal links, and social handles for AKYIN Ventures.",
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
        const cat = typeof args.category === "string" ? args.category.trim().toLowerCase() : "";
        const items = cat ? RATE_CARD_ITEMS.filter((i) => i.category.toLowerCase().includes(cat)) : RATE_CARD_ITEMS;
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
                    packages: PRICING_PACKAGES,
                    rateCard: items
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
                    telephone: OFFICIAL_CONTACT.phoneDisplay,
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
  registerSuiteRoutes(app);
  app.get("/api/automotive-news", newsRateLimiter, async (req, res) => {
    const topicKey = typeof req.query.topic === "string" && req.query.topic in TOPIC_PROMPTS ? req.query.topic : "all";
    const cached = automotiveNewsCache.get(topicKey);
    if (cached && cached.expiresAt > Date.now()) {
      res.json(cached.payload);
      return;
    }
    const { client: ai, reason } = createGeminiClient();
    if (!ai) {
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
  if (process.env.NODE_ENV === "production") {
    const distDir = path2.resolve(__dirname, "dist");
    const indexFile = path2.join(distDir, "index.html");
    const cachedIndexHtml = fs2.existsSync(indexFile) ? fs2.readFileSync(indexFile, "utf8") : null;
    app.use(express.static(distDir, { dotfiles: "ignore" }));
    app.get("*", (req, res) => {
      if (!cachedIndexHtml) {
        res.status(404).send("Build output not found.");
        return;
      }
      const cleaned = req.path.replace(/\/+$/, "") || "/";
      const routeMeta = ROUTE_SEO_META[cleaned];
      if (!routeMeta) {
        res.type("text/html; charset=utf-8").send(cachedIndexHtml);
        return;
      }
      const canonicalUrl = `https://akyin.com${cleaned === "/" ? "/" : cleaned}`;
      const ogTitleValue = routeMeta.ogTitle || routeMeta.title;
      const ogDescValue = routeMeta.ogDescription || routeMeta.description;
      let html = cachedIndexHtml;
      html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtmlAttr(routeMeta.title)}</title>`).replace(
        /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
        `<meta name="description" content="${escapeHtmlAttr(routeMeta.description)}" />`
      ).replace(
        /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
        `<link rel="canonical" href="${escapeHtmlAttr(canonicalUrl)}" />`
      ).replace(
        /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
        `<meta property="og:title" content="${escapeHtmlAttr(ogTitleValue)}" />`
      ).replace(
        /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
        `<meta property="og:description" content="${escapeHtmlAttr(ogDescValue)}" />`
      ).replace(
        /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
        `<meta property="og:url" content="${escapeHtmlAttr(canonicalUrl)}" />`
      ).replace(
        /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
        `<meta name="twitter:title" content="${escapeHtmlAttr(ogTitleValue)}" />`
      ).replace(
        /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
        `<meta name="twitter:description" content="${escapeHtmlAttr(ogDescValue)}" />`
      );
      res.setHeader("Vary", "Accept");
      res.type("text/html; charset=utf-8").send(html);
    });
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
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
