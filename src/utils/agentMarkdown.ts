import {
  EXTERNAL_VERTICAL_URLS,
  GUMROAD_DIGITAL_PRODUCTS,
  OFFICIAL_CONTACT,
  PUBLISHING_BOOKS,
  PUBLISHING_LINKS,
  RATE_CARD_ITEMS,
  SERVICE_MARKETPLACE_CATEGORIES,
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
- **WhatsApp Connect**: [Join Official AKYIN Channel](${OFFICIAL_CONTACT.whatsappUrl})
- **Service Availability**: ${OFFICIAL_CONTACT.regionIndicator} — ${OFFICIAL_CONTACT.internationalSupportLine}
- **Follow AKYIN**: [Facebook – Follow AKYIN](${OFFICIAL_CONTACT.marketingSocials[0].url}) | [YouTube – Subscribe to AKYIN Marketing](${OFFICIAL_CONTACT.marketingSocials[1].url}) | [Instagram – Follow AKYIN Ventures](${OFFICIAL_CONTACT.marketingSocials[2].url}) | [WhatsApp – Join AKYIN Updates](${OFFICIAL_CONTACT.marketingSocials[3].url})
- **Key Pages**: [About](/about) | [Ventures](/ventures) | [Services](/ventures/marketing) | [Pricing](/pricing) | [Advisory](/advisory) | [Contact](/contact) | [Terms](/terms) | [Privacy](/privacy) | [Sitemap](/sitemap)
- **Agent Endpoints**: [/llms.txt](/llms.txt) | [/.well-known/mcp/server-card.json](/.well-known/mcp/server-card.json) | [/robots.txt](/robots.txt)
`;

  if (cleaned === '/pricing') {
    const rateLines = RATE_CARD_ITEMS.map(
      (r) => `| ${r.service} | ${r.category} | ${r.fee}${r.unit} INR | ${r.notes} |`
    ).join('\n');

    return `# AKYIN Ventures — Transparent Standalone Service Pricing (INR)

> Every AKYIN MARKETINGS service is 100% standalone—select only what you need with zero compulsory bundles. Advertising budgets are paid directly to Meta or Google by clients.

## Key Standalone Service Highlights
- **Meta Ads Management**: ₹40,000 / month ([/services/meta-ads-management](/services/meta-ads-management))
- **Lead Filtering & Qualification**: ₹24,000 / month ([/services/lead-filtering](/services/lead-filtering))
- **Bulk SMS Marketing**: ₹3,000 for 10,000 SMS credits · ₹0.30/SMS ([/services/bulk-sms](/services/bulk-sms))
- **WhatsApp Business Messaging Setup**: ₹4,999 one-time setup · Usage billed separately at ₹1.50/msg ([/services/whatsapp-business-setup](/services/whatsapp-business-setup))
- **Commercial & Dealership Sales Training**: ₹50,000 / session ([/services/commercial-dealership-sales-training](/services/commercial-dealership-sales-training))
- **1-on-1 Business Advisory Consultation**: ₹3,998 / 30-min IST session ([Book Advisory](/advisory))

## Standalone Service Rate Schedule
| Service | Category | Fee (INR) | Scope Notes |
|---|---|---|---|
${rateLines}
${commonFooter}`;
  }

  if (cleaned === '/marketing/automotive') {
    return `# AKYIN Marketing — Automotive Dealership Growth Division

> Standalone showroom marketing, test-drive acquisition, two-tier lead qualification, and floor sales coaching engineered for automotive dealerships.

## Core Standalone Automotive Capabilities
- **Online Lead Generation** ([/services/lead-generation](/services/lead-generation)) & **Lead Filtering & Qualification** ([/services/lead-filtering](/services/lead-filtering)) delivered independently for clean showroom accountability.
- **Test-Drive Lead Generation** ([/services/test-drive-lead-generation](/services/test-drive-lead-generation)) & **Showroom Launch / Exchange Event Campaigns** ([/services/dealer-launch-exchange-campaigns](/services/dealer-launch-exchange-campaigns)).
- **Commercial & Dealership Sales Training**: ₹50,000 / session ([View Full Pricing](/pricing)).
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
    const catLines = SERVICE_MARKETPLACE_CATEGORIES.map((c, idx) => `${idx + 1}. **${c}**`).join('\n');
    return `# AKYIN MARKETINGS — 10-Category Standalone Service Marketplace

> Choose individual marketing, design, documentation, reporting, messaging, CRM, and training services—zero forced bundles.

## 10 Standalone Service Categories
${catLines}

- **Automotive Division**: [AKYIN Automotive Marketing](/marketing/automotive)
- **Pricing & Quotation Builder**: [View Transparent Standalone Pricing](/pricing)
${commonFooter}`;
  }

  if (cleaned === '/terms' || cleaned === '/privacy') {
    return `# AKYIN Ventures — Terms of Service & Privacy Policy

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

  if (cleaned === '/about') {
    return `# About AKYIN Ventures — One Vision. Multiple Business Ventures.

AKYIN Ventures operates specialized operating businesses alongside a 10-category standalone marketing marketplace grounded in 16 years of commercial & automotive industry experience (mass-market to luxury retail).

- **Owned Verticals**: AKYIN Publishing, AKYIN MARKETINGS, AKYIN Store (AKYIN Thrift), AICalc.in, Kartigo.online, BizNXT.online, Budget Bazaar.
- **Security & Integrity**: Strict CSP rules, URI allowlisting, schema-validated forms, and zero-broker enquiry routing.
${commonFooter}`;
  }

  if (cleaned === '/advisory') {
    return `# AKYIN Business Advisory — Consultation Booking

> Your Business. Your Vision. A Clearer Direction.

- **Format**: 1-on-1 Strategic Consultation (30-minute slots, Asia/Kolkata IST).
- **Consultation Fee**: ₹3,998 INR per session (confirmed before slot lock).
- **Focus Areas**: Business feasibility, sales team conversion, agency growth roadmap, and venture planning.
${commonFooter}`;
  }

  if (cleaned === '/contact') {
    return `# Contact AKYIN Ventures — Central Enquiry Desk

Reach our corporate desk or any operating vertical directly:

- **Corporate Email**: [connect@akyin.com](mailto:connect@akyin.com)
- **WhatsApp Connect**: [Join Official AKYIN Channel](${OFFICIAL_CONTACT.whatsappUrl})
- **Booking Desk**: [Schedule Business Advisory](/advisory)
${commonFooter}`;
  }

  if (cleaned === '/tools') {
    return `# AKYIN Business, Marketing & Sales Calculators Suite (20 Free Tools)

> Interactive marketing ROI, ROAS, CAC, CPL, break-even, GST, pricing, margin, commission, and consultation workflow tools by AKYIN Ventures.

- **Marketing Calculators**: ROAS, CPL, CAC, Conversion Rate, Agency Value ROI, Ad Budget Planner
- **Sales & Finance Calculators**: Profit Margin, Break-Even Units, Discount Impact, Sales Commission, GST Calculator (India 5%/12%/18%/28%)
- **Growth & Lead Ops Tools**: Follow-up SLA Estimator, Quotation Estimator, Service Finder, Appointment Slot Finder (/advisory), and Direct Enquiry Dispatcher (/contact)
${commonFooter}`;
  }

  if (cleaned === '/insights') {
    return `# AKYIN Ventures — Insights & Business Philosophy

> Operational perspectives across performance marketing, automotive dealership test-drive conversion, publishing, retail positioning, and B2B digital commerce.

- Explore structured growth essays and real-time automotive dealership industry trends at [Insights](/insights).
- For 1-on-1 execution advice, schedule an [IST Business Advisory session](/advisory).
${commonFooter}`;
  }

  // Default Home (/) and general route Markdown
  const ventureList = VENTURES_PORTFOLIO.map(
    (v) =>
      `- **${v.code}. ${v.name}** (${v.sector}): ${v.description} — [Internal Page](${OFFICIAL_CONTACT.domain}${v.route})${v.externalUrl ? ` | [Live Platform](${v.externalUrl})` : ''}`
  ).join('\n');

  return `# AKYIN Ventures — Building Ideas Into Businesses

> Multi-business corporate group and standalone marketing service marketplace operating across digital marketing, publishing, fashion retail, AI tools, B2B supply, value retail, and consulting.

## Operating Verticals
${ventureList}

## Standalone Agency & Consultation Highlights (INR)
- **Meta Ads Management**: ₹40,000 / month
- **Lead Filtering & Qualification**: ₹24,000 / month
- **Bulk SMS Marketing**: ₹3,000 (10,000 SMS credits · ₹0.30/SMS)
- **WhatsApp Business Setup**: ₹4,999 one-time setup (separate from ₹1.50/msg usage)
- **Commercial & Dealership Sales Training**: ₹50,000 / session
- **Business Advisory Session (30 min IST)**: ₹3,998 / session
- See full standalone service marketplace on [Services](/ventures/marketing) & [Pricing Page](/pricing)

## External Platforms & Publishing
- [AICalc.in](${EXTERNAL_VERTICAL_URLS.aicalc}) | [Kartigo.online](${EXTERNAL_VERTICAL_URLS.kartigo}) | [BizNXT.online](${EXTERNAL_VERTICAL_URLS.biznxt}) | [BudgetBazaar.org](${EXTERNAL_VERTICAL_URLS.budgetBazaar})
- [Google Play Books — THE DISCIPLINE CODE](${PUBLISHING_LINKS.googlePlayDisciplineCode}) | [Amazon Author Store](${PUBLISHING_LINKS.amazonAuthorStore})
${commonFooter}`;
}
