import {
  EXTERNAL_VERTICAL_URLS,
  GUMROAD_DIGITAL_PRODUCTS,
  OFFICIAL_CONTACT,
  PRICING_PACKAGES,
  PUBLISHING_BOOKS,
  PUBLISHING_LINKS,
  RATE_CARD_ITEMS,
  VENTURES_PORTFOLIO,
} from '../data/akyinData';

export function buildMarkdownForRoute(pathname: string): string {
  const cleaned = pathname.replace(/\/+$/, '') || '/';

  const commonFooter = `
---
## Official Contact & Links
- **Website**: ${OFFICIAL_CONTACT.domain}
- **Contact Lead**: ${OFFICIAL_CONTACT.contactName}
- **Email**: [${OFFICIAL_CONTACT.email}](mailto:${OFFICIAL_CONTACT.email})
- **Phone**: [${OFFICIAL_CONTACT.phoneDisplay}](${OFFICIAL_CONTACT.phoneHref})
- **Service Availability**: ${OFFICIAL_CONTACT.regionIndicator} — ${OFFICIAL_CONTACT.internationalSupportLine}
- **Follow AKYIN**: [Facebook – Follow AKYIN](${OFFICIAL_CONTACT.marketingSocials[0].url}) | [YouTube – Subscribe to AKYIN Marketing](${OFFICIAL_CONTACT.marketingSocials[1].url}) | [Instagram – Follow AKYIN Ventures](${OFFICIAL_CONTACT.marketingSocials[2].url}) | [WhatsApp – Join AKYIN Updates](${OFFICIAL_CONTACT.marketingSocials[3].url})
- **Key Pages**: [About](/about) | [Ventures](/ventures) | [Pricing](/pricing) | [Advisory](/advisory) | [Contact](/contact) | [Terms](/terms) | [Privacy](/privacy) | [Sitemap](/sitemap)
- **Agent Endpoints**: [/llms.txt](/llms.txt) | [/.well-known/mcp/server-card.json](/.well-known/mcp/server-card.json) | [/robots.txt](/robots.txt)
`;

  if (cleaned === '/pricing') {
    const pkgLines = PRICING_PACKAGES.map(
      (p) =>
        `### ${p.code}: ${p.name}\n- **One-Time Setup**: ${p.setupFee} INR\n- **Monthly Retainer**: ${p.monthlyFee} INR\n- **Includes**: ${p.includes.join('; ')}\n- **Excludes**: ${p.excludes.join('; ')}`
    ).join('\n\n');

    const rateLines = RATE_CARD_ITEMS.map(
      (r) => `| ${r.service} | ${r.category} | ${r.fee}${r.unit} INR | ${r.notes} |`
    ).join('\n');

    return `# AKYIN Ventures — Transparent Pricing & Rate Card

> All commercial retainers, training workshops, and individual services are priced transparently in INR. Ad spend is paid directly to Meta or Google by clients.

${pkgLines}

## Business Advisory & Training
- **Sales Team & Showroom Training**: ₹25,000 / session
- **Personality Development Workshop**: ₹25,000 / session
- **1-on-1 Business Advisory Consultation**: ₹1,999 / 30-min IST session ([Book Advisory](/advisory))

## 21-Item Individual Service Rate Card
| Service | Category | Fee (INR) | Scope Notes |
|---|---|---|---|
${rateLines}
${commonFooter}`;
  }

  if (cleaned === '/marketing/automotive') {
    return `# AKYIN Marketing — Automotive Dealership Growth Division

> Specialized 16-service marketing, lead filtering, and floor sales coaching division engineered for automotive dealerships.

## Core Capabilities
- **Lead Generation (01)** & **Lead Filtering & Qualification (02)** managed independently for clean showroom accountability.
- Interactive Tools: **Agency Value Calculator (12/24 Month ROI)**, **Lead Quality Index**, **Lead Density Heatmap**, **Performance Radar Benchmark**, and **Executive A4 Dealership Dossier (PDF & PNG)**.
- **Transparent Retainers**: Package A (₹39,999 setup + ₹49,999/mo), Package B (₹14,999 setup + ₹19,999/mo), Sales Training (₹25,000/session). [Full Pricing](/pricing).
${commonFooter}`;
  }

  if (cleaned === '/ventures/publishing') {
    const bookLines = PUBLISHING_BOOKS.map(
      (b) =>
        `- **${b.number}. ${b.title}** — *${b.subtitle}* by ${b.author} ([View on Amazon](${b.amazonUrl}))`
    ).join('\n');

    const digitalLines = GUMROAD_DIGITAL_PRODUCTS.map(
      (p) =>
        `- **${p.number}. ${p.shortTitle}** — ${p.description} ([Get This Product](${p.gumroadUrl}))`
    ).join('\n');

    return `# AKYIN Publishing — Ideas That Inspire. Knowledge That Empowers.

> Explore books, practical guides and digital resources published by AKYIN.

## Explore Our Books on Amazon
${bookLines}

## Digital Guides & Productivity Tools
${digitalLines}

## Explore More & Storefronts
- [Explore AKYIN on Pinterest](${PUBLISHING_LINKS.pinterest})
- [Amazon Author Store](${PUBLISHING_LINKS.amazonAuthorStore})
- [Google Play Books — THE DISCIPLINE CODE](${PUBLISHING_LINKS.googlePlayDisciplineCode})
${commonFooter}`;
  }

  if (cleaned === '/ventures/marketing') {
    return `# AKYIN MARKETINGS — Full-Service Marketing Agency
    
> Drive qualified demand and strengthen commercial sales execution across retail, B2B, services, and automotive dealerships.

- **18 Specialized Agency Services** across Lead Gen & Filtering, AI-Assisted Calling, Creative & Video Production, Local Growth, and Commercial Sales Training.
- **Automotive Division**: [AKYIN Automotive Marketing](/marketing/automotive)
- **Pricing**: Package A (₹39,999 setup + ₹49,999/mo) · Package B (₹14,999 setup + ₹19,999/mo) · Sales Training (₹25,000/session). [View Full Rate Card](/pricing).
${commonFooter}`;
  }

  if (cleaned === '/terms' || cleaned === '/privacy') {
    return `# AKYIN Ventures — Terms of Service & Privacy Policy

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

  if (cleaned === '/about') {
    return `# About AKYIN Ventures — One Vision. Multiple Business Ventures.

AKYIN Ventures operates seven specialized operating businesses alongside a full-service marketing agency grounded in 16 years of commercial & automotive industry experience (mass-market to luxury retail).

- **Owned Verticals**: AKYIN Publishing, AKYIN MARKETINGS, AKYIN Store (AKYIN Thrift), AICalc.in, Kartigo.online, BizNXT.online, Budget Bazaar.
- **Security & Integrity**: Strict CSP rules, URI allowlisting, schema-validated forms, and zero-broker enquiry routing.
- **FAQs**: Clear boundaries between owned ventures, external clients (AutoClub), and distribution platforms.
${commonFooter}`;
  }

  if (cleaned === '/advisory') {
    return `# AKYIN Business Advisory — Consultation Booking

> Your Business. Your Vision. A Clearer Direction.

- **Format**: 1-on-1 Strategic Consultation (30-minute slots, Asia/Kolkata IST).
- **Indicative Consultation Fee**: ₹1,999 INR per session (confirmed before slot lock; no automated online gateway charge).
- **Focus Areas**: Business feasibility, sales team conversion, agency growth roadmap, and venture planning.
${commonFooter}`;
  }

  if (cleaned === '/contact') {
    return `# Contact AKYIN Ventures — Central Enquiry Desk

Reach our corporate desk or any of the seven operating verticals directly:

- **Corporate Email**: [connect@akyin.com](mailto:connect@akyin.com)
- **Phone**: [+91 63956 94011](tel:+916395694011)
- **Booking Desk**: [Schedule Business Advisory](/advisory)
${commonFooter}`;
  }

  // Default Home (/) and general route Markdown
  const ventureList = VENTURES_PORTFOLIO.map(
    (v) =>
      `- **${v.code}. ${v.name}** (${v.sector}): ${v.description} — [Internal Page](${OFFICIAL_CONTACT.domain}${v.route})${v.externalUrl ? ` | [Live Platform](${v.externalUrl})` : ''}`
  ).join('\n');

  return `# AKYIN Ventures — Building Ideas Into Businesses

> Multi-business corporate group and full-service marketing agency operating seven independent verticals across digital marketing, publishing, fashion retail, AI tools, B2B supply, value retail, and consulting.

## Seven Operating Verticals
${ventureList}

## Transparent Agency & Consultation Pricing (INR)
- **Package A (Full-Service Growth Marketing & Lead Management)**: ₹39,999 setup + ₹49,999/month
- **Package B (Lead Filtering & Qualification Only)**: ₹14,999 setup + ₹19,999/month
- **Commercial & Dealership Sales Training**: ₹25,000 / session
- **Business Advisory Session (30 min IST)**: ₹1,999 / session
- See complete 21-item schedule on [Pricing Page](/pricing)

## External Platforms & Publishing
- [AICalc.in](${EXTERNAL_VERTICAL_URLS.aicalc}) | [Kartigo.online](${EXTERNAL_VERTICAL_URLS.kartigo}) | [BizNXT.online](${EXTERNAL_VERTICAL_URLS.biznxt}) | [BudgetBazaar.org](${EXTERNAL_VERTICAL_URLS.budgetBazaar})
- [Google Play Books — THE DISCIPLINE CODE](${PUBLISHING_LINKS.googlePlayDisciplineCode}) | [Amazon Author Store](${PUBLISHING_LINKS.amazonAuthorStore})
${commonFooter}`;
}
