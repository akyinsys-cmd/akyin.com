// server.ts
import "dotenv/config";
import crypto from "crypto";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { z } from "zod";

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
    id: "eco-aicalc",
    name: "AICalc",
    relationshipLabel: "Client",
    category: "client",
    externalUrl: "https://ais-dev-iwemnrdjpbl2zz7yzoxiyv-71845396109.asia-east1.run.app/ventures/aicalc",
    internalRoute: "/ventures/aicalc",
    wordmarkStyle: "mono"
  },
  {
    id: "eco-kartigo",
    name: "Kartigo",
    relationshipLabel: "Client",
    category: "client",
    externalUrl: "https://ais-dev-iwemnrdjpbl2zz7yzoxiyv-71845396109.asia-east1.run.app/ventures/kartigo",
    internalRoute: "/ventures/kartigo",
    wordmarkStyle: "sans"
  },
  {
    id: "eco-biznxt",
    name: "BizNXT",
    relationshipLabel: "Client",
    category: "client",
    externalUrl: "https://ais-dev-iwemnrdjpbl2zz7yzoxiyv-71845396109.asia-east1.run.app/ventures/biznxt",
    internalRoute: "/ventures/biznxt",
    wordmarkStyle: "sans"
  },
  {
    id: "eco-budget-bazaar",
    name: "Budget Bazaar",
    relationshipLabel: "Client",
    category: "client",
    externalUrl: "https://ais-dev-iwemnrdjpbl2zz7yzoxiyv-71845396109.asia-east1.run.app/ventures/budget-bazaar",
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

// server.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
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
function getRazorpayCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!keyId || !keySecret || keyId === "MY_RAZORPAY_KEY_ID" || keySecret === "MY_RAZORPAY_KEY_SECRET") {
    return null;
  }
  return { keyId, keySecret };
}
var createOrderBodySchema = z.object({
  sku: z.enum([
    "advisory-session",
    "package-a-setup",
    "package-b-setup",
    "sales-training"
  ]),
  customerName: z.string().trim().max(120).optional().default(""),
  customerEmail: z.union([z.string().trim().email().max(160), z.literal("")]).optional().default(""),
  customerPhone: z.string().trim().max(30).refine((val) => val === "" || /^[+\d\s\-()]{6,30}$/.test(val), "Invalid phone format.").optional().default(""),
  referenceId: z.string().trim().max(80).optional().default("")
}).strict();
var verifyPaymentBodySchema = z.object({
  razorpay_order_id: z.string().trim().min(4).max(100),
  razorpay_payment_id: z.string().trim().min(4).max(100),
  razorpay_signature: z.string().trim().regex(/^[a-f0-9]{64}$/i, "Invalid Razorpay signature format."),
  sku: z.enum([
    "advisory-session",
    "package-a-setup",
    "package-b-setup",
    "sales-training"
  ]).optional()
}).strict();
function stripDangerousControls(value) {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
}
var leadSubmissionBodySchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required.").max(100),
  businessName: z.string().trim().min(2, "Business name is required.").max(120),
  mobileNumber: z.string().trim().min(7, "Please provide a valid mobile number.").max(28).refine((val) => /^[+\d\s\-()]{7,28}$/.test(val), "Enter a valid mobile number with country or area code."),
  email: z.string().trim().email("Enter a valid email address.").max(160),
  city: z.string().trim().min(2, "City is required.").max(80),
  country: z.string().trim().min(2, "Country is required.").max(80),
  requiredService: z.string().trim().min(2, "Please select a required service.").max(140),
  monthlyMarketingBudget: z.string().trim().min(2, "Please select a monthly marketing budget range.").max(80),
  message: z.string().trim().min(8, "Please enter a brief requirement summary (at least 8 characters).").max(1500),
  consentAccepted: z.boolean().refine((val) => val === true, "Please accept the privacy consent before submitting."),
  honeypot: z.string().max(60).optional().default(""),
  source: z.string().trim().max(80).optional().default("Interactive Lead Enquiry Widget")
}).strict();
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
  const distCandidate = path.resolve(__dirname, "dist", relPath);
  if (fs.existsSync(distCandidate)) return distCandidate;
  const publicCandidate = path.resolve(__dirname, "public", relPath);
  if (fs.existsSync(publicCandidate)) return publicCandidate;
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
  app.use(express.json({ limit: "64kb" }));
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
  const paymentOrderRateLimiter = createRateLimiter({
    windowMs: 6e4,
    max: 20,
    code: "PAYMENT_RATE_LIMITED",
    message: "Too many checkout requests from this network. Please wait a minute and retry."
  });
  const paymentVerifyRateLimiter = createRateLimiter({
    windowMs: 6e4,
    max: 30,
    code: "PAYMENT_VERIFY_RATE_LIMITED",
    message: "Too many verification attempts. Please wait a minute and retry."
  });
  const newsRateLimiter = createRateLimiter({
    windowMs: 6e4,
    max: 20,
    code: "NEWS_RATE_LIMITED",
    message: "Too many headline sync requests. Please wait a minute before refreshing."
  });
  const leadRateLimiter = createRateLimiter({
    windowMs: 6e4,
    max: 12,
    code: "LEAD_RATE_LIMITED",
    message: "Too many enquiry submissions. Please wait a minute before trying again."
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
    const file = resolvePublicOrDistFile(path.join(".well-known", "mcp", "server-card.json"));
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (file) {
      res.type("application/json; charset=utf-8").sendFile(file);
      return;
    }
    res.status(404).json({ error: "MCP server card not found." });
  });
  app.get("/downloads/:filename", (req, res, next) => {
    const rawFilename = req.params.filename;
    const sanitizedFilename = path.basename(rawFilename);
    const resolvedPath = resolvePublicOrDistFile(path.join("downloads", sanitizedFilename));
    if (resolvedPath && fs.existsSync(resolvedPath)) {
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
  app.get("/api/razorpay/config", (_req, res) => {
    const creds = getRazorpayCredentials();
    res.json({
      configured: Boolean(creds),
      keyId: creds ? creds.keyId : null,
      currency: "INR",
      catalog: PAYMENT_CATALOG_LIST
    });
  });
  app.post("/api/razorpay/create-order", paymentOrderRateLimiter, async (req, res) => {
    const creds = getRazorpayCredentials();
    if (!creds) {
      res.status(503).json({
        error: "Online Razorpay checkout requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to be configured in Settings > Secrets.",
        code: "RAZORPAY_NOT_CONFIGURED"
      });
      return;
    }
    const parsed = createOrderBodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "Invalid payment order request parameters.",
        code: "INVALID_REQUEST",
        issues: parsed.error.issues.map((i) => i.message)
      });
      return;
    }
    const sku = parsed.data.sku;
    const item = PAYMENT_CATALOG_BY_SKU[sku];
    if (!item) {
      res.status(404).json({
        error: "Selected payment item was not found in catalog.",
        code: "SKU_NOT_FOUND"
      });
      return;
    }
    const receiptSuffix = parsed.data.referenceId ? parsed.data.referenceId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 16) : Date.now().toString(36);
    const receipt = `akyin_${sku.replace(/[^a-z0-9]/g, "").slice(0, 10)}_${receiptSuffix}`.slice(
      0,
      40
    );
    try {
      const authHeader = Buffer.from(`${creds.keyId}:${creds.keySecret}`).toString("base64");
      const rzpResponse = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: item.amountPaise,
          currency: "INR",
          receipt,
          notes: {
            sku: item.sku,
            title: item.shortLabel,
            referenceId: parsed.data.referenceId || "direct-web",
            customerName: parsed.data.customerName || "Guest",
            customerEmail: parsed.data.customerEmail || ""
          }
        })
      });
      const rzpBody = await rzpResponse.json().catch(() => ({}));
      if (!rzpResponse.ok || !rzpBody.id) {
        const msg = rzpBody?.error?.description || "Razorpay refused order creation. Verify API credentials.";
        res.status(502).json({
          error: msg,
          code: "RAZORPAY_UPSTREAM_ERROR"
        });
        return;
      }
      res.json({
        orderId: rzpBody.id,
        amount: item.amountPaise,
        currency: "INR",
        keyId: creds.keyId,
        sku: item.sku,
        title: item.title,
        displayPrice: item.displayPrice,
        description: item.description,
        receipt: rzpBody.receipt || receipt
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unable to reach Razorpay Orders API.";
      console.error("[/api/razorpay/create-order] Error:", msg);
      res.status(502).json({
        error: "Unable to reach Razorpay gateway right now. Please try again shortly.",
        code: "RAZORPAY_NETWORK_ERROR"
      });
    }
  });
  app.post("/api/razorpay/verify-payment", paymentVerifyRateLimiter, (req, res) => {
    const creds = getRazorpayCredentials();
    if (!creds) {
      res.status(503).json({
        verified: false,
        error: "Razorpay verification requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Settings > Secrets.",
        code: "RAZORPAY_NOT_CONFIGURED"
      });
      return;
    }
    const parsed = verifyPaymentBodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        verified: false,
        error: "Invalid payment verification payload.",
        code: "INVALID_VERIFICATION_PAYLOAD"
      });
      return;
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, sku } = parsed.data;
    const expectedHex = crypto.createHmac("sha256", creds.keySecret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
    const expectedBuf = Buffer.from(expectedHex, "hex");
    const actualBuf = Buffer.from(razorpay_signature.toLowerCase(), "hex");
    if (expectedBuf.length !== actualBuf.length || !crypto.timingSafeEqual(expectedBuf, actualBuf)) {
      res.status(400).json({
        verified: false,
        error: "Payment signature mismatch. Please contact connect@akyin.com if your account was debited.",
        code: "SIGNATURE_MISMATCH"
      });
      return;
    }
    const item = sku ? PAYMENT_CATALOG_BY_SKU[sku] : void 0;
    res.json({
      verified: true,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      sku: sku || null,
      title: item?.title || "AKYIN Commercial Payment",
      displayPrice: item?.displayPrice || null,
      verifiedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app.post("/api/leads", leadRateLimiter, (req, res) => {
    const parsed = leadSubmissionBodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        ok: false,
        error: parsed.error.issues[0]?.message || "Invalid lead enquiry submission.",
        code: "INVALID_LEAD_PAYLOAD",
        issues: parsed.error.issues.map((issue) => issue.message)
      });
      return;
    }
    const data = parsed.data;
    if (data.honeypot && data.honeypot.trim().length > 0) {
      res.status(400).json({
        ok: false,
        error: "Submission rejected.",
        code: "INVALID_LEAD_PAYLOAD"
      });
      return;
    }
    const leadId = `AKY-LEAD-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    const receivedAt = (/* @__PURE__ */ new Date()).toISOString();
    const record = {
      leadId,
      receivedAt,
      fullName: stripDangerousControls(data.fullName),
      businessName: stripDangerousControls(data.businessName),
      mobileNumber: stripDangerousControls(data.mobileNumber),
      email: stripDangerousControls(data.email),
      city: stripDangerousControls(data.city),
      country: stripDangerousControls(data.country),
      requiredService: stripDangerousControls(data.requiredService),
      monthlyMarketingBudget: stripDangerousControls(data.monthlyMarketingBudget),
      message: stripDangerousControls(data.message),
      consentAccepted: true,
      source: stripDangerousControls(data.source || "Interactive Lead Enquiry Widget")
    };
    try {
      const dataDir = path.resolve(__dirname, ".akyin-data");
      const leadsFile = path.join(dataDir, "leads.json");
      fs.mkdirSync(dataDir, { recursive: true });
      let existing = [];
      if (fs.existsSync(leadsFile)) {
        try {
          const raw = fs.readFileSync(leadsFile, "utf8");
          const parsedFile = JSON.parse(raw);
          if (Array.isArray(parsedFile)) {
            existing = parsedFile;
          }
        } catch {
          existing = [];
        }
      }
      existing.unshift(record);
      const tempFile = path.join(dataDir, `leads.${process.pid}.${Date.now()}.tmp`);
      fs.writeFileSync(tempFile, JSON.stringify(existing.slice(0, 1e3), null, 2), "utf8");
      fs.renameSync(tempFile, leadsFile);
      res.status(201).json({
        ok: true,
        leadId,
        receivedAt
      });
    } catch (err) {
      console.error("[/api/leads] Failed to persist submission:", err instanceof Error ? err.message : err);
      res.status(500).json({
        ok: false,
        error: "Unable to record enquiry right now. Please contact connect@akyin.com directly.",
        code: "LEAD_STORAGE_ERROR"
      });
    }
  });
  app.get("/api/leads", (_req, res) => {
    res.setHeader("Allow", "POST");
    res.status(405).json({
      ok: false,
      error: "Method not allowed. Lead enquiries must be submitted via POST.",
      code: "METHOD_NOT_ALLOWED"
    });
  });
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
    const distDir = path.resolve(__dirname, "dist");
    const indexFile = path.join(distDir, "index.html");
    const cachedIndexHtml = fs.existsSync(indexFile) ? fs.readFileSync(indexFile, "utf8") : null;
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
