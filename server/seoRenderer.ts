import type { ServiceCatalogItem, SuiteDatabase } from './types';

export interface ServerRouteSeoMeta {
  title: string;
  description: string;
  ogType?: 'website' | 'article';
  robots?: string;
  h1: string;
  summary: string;
  highlights?: Array<{ label: string; href: string }>;
  structuredData: Record<string, unknown>;
}

const DOMAIN = 'https://akyin.com';
const DEFAULT_ROBOTS =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

export function escapeHtml(value: string): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

function formatInr(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export const ROUTE_SEO_META: Record<string, ServerRouteSeoMeta> = {
  '/': {
    title: 'AKYIN Ventures — Multi-Business Group & Marketing Agency',
    description:
      'AKYIN Ventures is a diversified multi-business group & marketing agency spanning publishing, automotive growth, retail, AI tools, B2B trade, and advisory.',
    h1: 'AKYIN Ventures — Multi-Business Group & Full-Service Standalone Marketing Agency',
    summary:
      'AKYIN Ventures operates core divisions across digital marketing, automotive dealership growth, publishing, and fashion retail while offering modular standalone services for businesses across India and the UAE.',
    highlights: [
      { label: 'Explore Standalone Marketing Services', href: '/ventures/marketing' },
      { label: 'Automotive Dealership Marketing', href: '/marketing/automotive' },
      { label: 'Transparent INR Pricing & Quotation Builder', href: '/pricing' },
      { label: 'Book 1-on-1 Business Advisory', href: '/advisory' },
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': 'https://akyin.com/#organization',
          name: 'AKYIN Ventures',
          alternateName: ['AKYIN', 'AKYIN MARKETINGS'],
          url: 'https://akyin.com/',
          logo: 'https://akyin.com/assets/aistudio/akyin_logo_clean.png',
          description:
            'Multi-business parent group and full-service marketing agency operating core ventures in publishing, performance marketing, and fashion retail while supporting 58+ client businesses across AI utilities, B2B wholesale trade, automotive growth, and business consulting.',
          email: 'connect@akyin.com',
          founder: { '@type': 'Person', name: 'Shaikh Nazir' },
          areaServed: ['IN', 'AE'],
          sameAs: [
            'https://www.facebook.com/profile.php?id=61595204474890',
            'https://youtube.com/@akyinmarketing?si=hgB_tEfczt79H7wW',
            'https://www.instagram.com/akyinventures/',
            'https://whatsapp.com/channel/0029VbCz1qOJ3jurZuI6cM3U',
            'https://www.amazon.com/stores/author/B0DT3L2T15/allbooks',
            'https://play.google.com/store/books/details/Akyin_s_THE_DISCIPLINE_CODE?id=seHuEQAAQBAJ',
            'https://aicalc.in',
          ],
          contactPoint: [
            {
              '@type': 'ContactPoint',
              url: 'https://whatsapp.com/channel/0029VbCz1qOJ3jurZuI6cM3U',
              email: 'connect@akyin.com',
              contactType: 'customer service',
              availableLanguage: ['English', 'Hindi', 'Telugu'],
            },
          ],
        },
        {
          '@type': 'LocalBusiness',
          '@id': 'https://akyin.com/#localbusiness',
          name: 'AKYIN Ventures & Marketing Agency',
          image: 'https://akyin.com/assets/aistudio/akyin_logo_clean.png',
          url: 'https://akyin.com/',
          email: 'connect@akyin.com',
          priceRange: '₹3,000 - ₹99,998',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'IN',
          },
          sameAs: [
            'https://www.facebook.com/profile.php?id=61595204474890',
            'https://youtube.com/@akyinmarketing?si=hgB_tEfczt79H7wW',
            'https://www.instagram.com/akyinventures/',
            'https://whatsapp.com/channel/0029VbCz1qOJ3jurZuI6cM3U',
          ],
        },
        {
          '@type': 'WebSite',
          '@id': 'https://akyin.com/#website',
          url: 'https://akyin.com/',
          name: 'AKYIN Ventures',
          publisher: { '@id': 'https://akyin.com/#organization' },
        },
        {
          '@type': 'Service',
          name: 'AKYIN Standalone Marketing, Lead Qualification & Business Services',
          provider: { '@id': 'https://akyin.com/#organization' },
          serviceType: 'Performance Marketing, Creative Design & Lead Qualification',
          areaServed: ['IN', 'AE', 'US', 'GB'],
          offers: [
            {
              '@type': 'Offer',
              name: 'Meta Ads Management',
              price: '40000',
              priceCurrency: 'INR',
              url: 'https://akyin.com/services/meta-ads-management',
            },
            {
              '@type': 'Offer',
              name: 'Lead Filtering & Qualification',
              price: '24000',
              priceCurrency: 'INR',
              url: 'https://akyin.com/services/lead-filtering',
            },
            {
              '@type': 'Offer',
              name: 'Bulk SMS Marketing (10,000 Credits)',
              price: '3000',
              priceCurrency: 'INR',
              url: 'https://akyin.com/services/bulk-sms',
            },
            {
              '@type': 'Offer',
              name: 'WhatsApp Business Messaging Setup (One-Time Setup)',
              price: '4999',
              priceCurrency: 'INR',
              url: 'https://akyin.com/services/whatsapp-business-setup',
            },
            {
              '@type': 'Offer',
              name: 'Commercial & Dealership Sales Training Workshop',
              price: '50000',
              priceCurrency: 'INR',
              url: 'https://akyin.com/services/commercial-dealership-sales-training',
            },
            {
              '@type': 'Offer',
              name: '1-on-1 Business Advisory Consultation (30 min IST)',
              price: '3998',
              priceCurrency: 'INR',
              url: 'https://akyin.com/advisory',
            },
          ],
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What businesses operate under AKYIN Ventures?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'AKYIN Ventures operates core ventures including AKYIN Publishing, AKYIN MARKETINGS (Agency), and AKYIN Store / AKYIN Thrift, alongside client showcases including AICalc.in, Kartigo.online, BizNXT.online, and Budget Bazaar.',
              },
            },
            {
              '@type': 'Question',
              name: 'Are AKYIN Marketing services sold as forced bundles or standalone options?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Every AKYIN Marketing service across all 10 service categories—from Automotive Marketing, Google & Meta Ads, and Lead Filtering to Logo Design, PPT Decks, Excel Reporting, Bulk SMS, and WhatsApp Business Setup—is strictly standalone and selectable individually.',
              },
            },
            {
              '@type': 'Question',
              name: 'How does ad billing work with AKYIN Marketing?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Advertising budgets are paid directly by clients to Meta or Google. AKYIN fees cover strategy, campaign setup, creative production, lead qualification, and showroom sales training.',
              },
            },
          ],
        },
      ],
    },
  },
  '/about': {
    title: 'About AKYIN Ventures — Vision, Ventures & Track Record',
    description:
      'Corporate profile of AKYIN Ventures: 16+ years across marketing, publishing, retail, AI tools, and B2B commerce serving India and UAE businesses.',
    h1: 'About AKYIN Ventures — 16+ Years of Commercial, Automotive & Digital Execution',
    summary:
      'Founded by Shaikh Nazir, AKYIN Ventures unites practical commercial leadership with independent ventures spanning performance marketing, automotive sales training, publishing, retail, and B2B trade.',
    highlights: [
      { label: 'Explore Our Ventures', href: '/ventures' },
      { label: 'Standalone Marketing Services', href: '/ventures/marketing' },
      { label: 'Contact AKYIN Ventures', href: '/contact' },
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About AKYIN Ventures',
      url: 'https://akyin.com/about',
      description:
        'Corporate profile of AKYIN Ventures: 16+ years across marketing, publishing, retail, AI tools, and B2B commerce serving India and UAE businesses.',
      mainEntity: {
        '@type': 'Corporation',
        name: 'AKYIN Ventures',
        url: 'https://akyin.com',
      },
    },
  },
  '/ventures': {
    title: 'Our Ventures & Client Ecosystem | AKYIN Ventures',
    description:
      'Explore AKYIN Publishing, AKYIN Marketing Agency, AKYIN Store, and showcased platforms AICalc.in, Kartigo.online, BizNXT.online, and Budget Bazaar.',
    h1: 'AKYIN Ventures Portfolio & Client Business Ecosystem',
    summary:
      'Discover operating ventures owned and incubated by AKYIN Ventures alongside digital commerce and business platforms we actively support.',
    highlights: [
      { label: 'AKYIN MARKETINGS (Agency)', href: '/ventures/marketing' },
      { label: 'AKYIN Publishing', href: '/ventures/publishing' },
      { label: 'AKYIN Store / Thrift', href: '/ventures/store' },
      { label: 'AICalc.in', href: '/ventures/aicalc' },
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Our Ventures & Client Ecosystem — AKYIN Ventures',
      url: 'https://akyin.com/ventures',
      description: 'Explore core operating ventures under AKYIN Ventures and featured client showcases.',
    },
  },
  '/ventures/publishing': {
    title: 'AKYIN Publishing — Books & Digital Guides | AKYIN.com',
    description:
      'Explore eight published books on Amazon and three digital productivity & finance kits including The Discipline Code and The Money OS by AKYIN Publishing.',
    h1: 'AKYIN Publishing — Books, Practical Guides & Productivity Systems',
    summary:
      'Independent publishing house by Akyin S. featuring titles on execution discipline, resilience, dopamine recovery, and personal finance toolkits across Amazon, Google Play Books, and Gumroad.',
    highlights: [
      { label: 'Back to Our Ventures', href: '/ventures' },
      { label: '1-on-1 Business Advisory', href: '/advisory' },
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'AKYIN Publishing',
      url: 'https://akyin.com/ventures/publishing',
      parentOrganization: { '@type': 'Corporation', name: 'AKYIN Ventures' },
    },
  },
  '/ventures/marketing': {
    title: 'AKYIN MARKETINGS — Standalone Marketing & Business Services',
    description:
      'Full-service standalone agency catalogue across 10 specialized categories: Automotive Marketing, Digital Ads, Social Media, Creative Design, Video, PPT, Excel, Bulk SMS, WhatsApp Setup, CRM & Training.',
    h1: 'AKYIN MARKETINGS — 10-Category Standalone Service Marketplace',
    summary:
      'Every marketing, creative, messaging, reporting, and advisory capability at AKYIN MARKETINGS is offered strictly standalone—zero forced bundles—so businesses select only what drives measurable outcomes.',
    highlights: [
      { label: 'Automotive Marketing Division', href: '/marketing/automotive' },
      { label: 'Logo Design Service', href: '/services/logo-design' },
      { label: 'Bulk SMS Marketing', href: '/services/bulk-sms' },
      { label: 'WhatsApp Business Setup', href: '/services/whatsapp-business-setup' },
      { label: 'Interactive Quotation Builder', href: '/pricing#quotation-builder' },
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ProfessionalService',
          '@id': 'https://akyin.com/ventures/marketing#service',
          name: 'AKYIN Marketing Agency',
          alternateName: 'AKYIN MARKETINGS',
          url: 'https://akyin.com/ventures/marketing',
          parentOrganization: { '@type': 'Corporation', name: 'AKYIN Ventures' },
          description:
            'Standalone agency marketplace spanning 10 categories: Automotive Marketing, Digital Marketing, Social Media Management, Creative & Graphic Design, Video & Content, Business Documents, Excel Reporting, Messaging, Lead Management & CRM, and Consulting & Training.',
          priceRange: '₹3,000 - ₹99,998',
          areaServed: ['IN', 'AE', 'US', 'GB'],
          email: 'connect@akyin.com',
        },
        {
          '@type': 'FAQPage',
          '@id': 'https://akyin.com/ventures/marketing#agency-faq',
          name: 'AKYIN MARKETINGS — Standalone Agency Services, Messaging & Pricing FAQ',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What service categories does AKYIN MARKETINGS offer?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'AKYIN MARKETINGS organizes all services cleanly across 10 standalone categories: Automotive Marketing, Digital Marketing, Social Media Management, Creative and Graphic Design, Video and Content Services, Business Documents and Presentations, Excel and Reporting Services, Messaging and Communication, Lead Management and CRM, and Business Consulting and Training.',
              },
            },
            {
              '@type': 'Question',
              name: 'Can clients purchase individual services without mandatory bundles?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Every service is 100% standalone. There are no compulsory combined packages—clients can commission a single logo design, presentation deck, Meta Ads retainer, lead qualification workflow, Bulk SMS pack, or WhatsApp setup independently.',
              },
            },
            {
              '@type': 'Question',
              name: 'How are Bulk SMS Marketing and WhatsApp Business Messaging priced?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Bulk SMS Marketing is offered as a ₹3,000 package including 10,000 SMS credits (₹0.30 effective per SMS, additional usage at admin-configured rate). WhatsApp Business Messaging separates the ₹4,999 one-time setup fee from ₹1.50 per message usage. Messaging rates are subject to provider charges, applicable taxes, message category, destination, and delivery conditions confirmed in the written quotation.',
              },
            },
            {
              '@type': 'Question',
              name: 'How are Lead Generation and Lead Filtering separated?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Online Lead Generation captures fresh buyer enquiries via Meta or Google Ads (ad spend paid directly by clients to platforms), while Lead Filtering and Qualification vets existing incoming enquiries by phone and intent scoring as a separate standalone service.',
              },
            },
          ],
        },
      ],
    },
  },
  '/marketing/automotive': {
    title: 'Car Dealership Marketing & Test-Drive Leads | AKYIN',
    description:
      'Book qualified showroom test drives, not cold clicks. Targeted Meta & Google auto ads, lead vetting, and floor sales coaching for dealers. Get a quote.',
    h1: 'Car Dealership Marketing, Test-Drive Lead Generation & Showroom Sales Coaching',
    summary:
      'Built on 16 years of frontline showroom and dealership commercial experience—choose standalone automotive marketing, test-drive acquisition, lead filtering, exchange event drives, or sales team coaching.',
    highlights: [
      { label: 'Automotive Dealership Strategy', href: '/services/automotive-marketing' },
      { label: 'Test-Drive Lead Generation', href: '/services/test-drive-lead-generation' },
      { label: 'Lead Filtering & Qualification', href: '/services/lead-filtering' },
      { label: 'Build Automotive Quotation', href: '/pricing#quotation-builder' },
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ProfessionalService',
          '@id': 'https://akyin.com/marketing/automotive#service',
          name: 'AKYIN Marketing — Automotive Division',
          url: 'https://akyin.com/marketing/automotive',
          parentOrganization: { '@type': 'Corporation', name: 'AKYIN Ventures' },
          description:
            'Book qualified showroom test drives, not cold clicks. Targeted Meta & Google auto ads, lead vetting, and floor sales coaching for dealers.',
          priceRange: '₹15,000 - ₹50,000',
          areaServed: ['IN', 'AE', 'US', 'GB'],
          email: 'connect@akyin.com',
        },
        {
          '@type': 'FAQPage',
          '@id': 'https://akyin.com/marketing/automotive#lead-qualification-faq',
          name: 'Lead Qualification FAQ — AKYIN Automotive Marketing',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'How does AKYIN filter high-intent automotive test-drive leads?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'AKYIN enforces strict separation between Meta/Google lead generation and multi-tier lead qualification so dealership sales executives receive vetted test-drive appointments classified as Hot, Warm, Future Follow-up, Unreachable, or Not Interested.',
              },
            },
          ],
        },
        {
          '@type': 'FAQPage',
          '@id': 'https://akyin.com/marketing/automotive#lead-impact-tracker-faq',
          name: 'Lead Impact Tracker FAQ — AKYIN Automotive Marketing',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What does the AKYIN Lead Impact Tracker measure for automotive dealerships?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'The Lead Impact Tracker lets dealerships simulate monthly ad budgets (₹30,000 to ₹5,00,000) across Hatchback/Compact Sedan, Midsize/Compact SUV, and Luxury/EV tiers to forecast Cost Per Test Drive (CPTD), showroom conversion rate, projected monthly test drives, and estimated car bookings.',
              },
            },
            {
              '@type': 'Question',
              name: 'Can auto dealers download CSV reports from the Lead Impact Tracker?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Clicking Export CSV Report downloads a structured 30-day performance CSV containing daily Cost Per Test Drive (INR), estimated inbound leads, monthly ad budget, and selected vehicle tier for internal dealership records and management review.',
              },
            },
            {
              '@type': 'Question',
              name: 'How do the Cost Per Test Drive trend chart and zoom controls work?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'The interactive Recharts trend chart visualizes 30-day Cost Per Test Drive performance with 7D, 14D, and 30D zoom-in toggles and a draggable range brush in the 30-day view so dealers can inspect daily acquisition efficiency closely.',
              },
            },
            {
              '@type': 'Question',
              name: 'What does the 30-day moving average alert badge in the Lead Impact Tracker indicate?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'The benchmark alert badge automatically compares current Cost Per Test Drive against the 30-day moving average, notifying the dealership whenever CPTD exceeds the 30-day benchmark or confirming when efficiency is running below average.',
              },
            },
          ],
        },
      ],
    },
  },
  '/ventures/store': {
    title: 'AKYIN Store & AKYIN Thrift — Value Fashion Retail',
    description:
      'Shop curated men’s and women’s everyday fashion, apparel, and seasonal wardrobe collections at accessible discounted prices through AKYIN Thrift.',
    h1: 'AKYIN Store & AKYIN Thrift — Value-First Apparel & Wardrobe Retail',
    summary:
      'Accessible everyday fashion and curated wardrobe staples designed for shoppers seeking reliable quality at practical prices.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ClothingStore',
      name: 'AKYIN STORE · AKYIN THRIFT',
      url: 'https://akyin.com/ventures/store',
      parentOrganization: { '@type': 'Corporation', name: 'AKYIN Ventures' },
    },
  },
  '/ventures/aicalc': {
    title: 'AICalc.in — Smart AI & Manual Calculators | AKYIN',
    description:
      'Explore AICalc.in: combining natural-language AI calculation queries with classic manual financial, business, and everyday calculators online.',
    h1: 'AICalc.in — AI-Assisted & Manual Financial Calculation Platform',
    summary:
      'Built to simplify financial, commercial, and everyday math through both natural-language queries and precision deterministic calculators.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'AICalc.in',
      url: 'https://aicalc.in',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
  },
  '/ventures/kartigo': {
    title: 'Kartigo — B2B Stock Supply & Wholesale Trade',
    description:
      'Connect with wholesale commercial inventory, bulk stock lots, and reliable B2B trade distribution opportunities across categories with Kartigo.',
    h1: 'Kartigo — B2B Wholesale Inventory & Commercial Stock Supply',
    summary:
      'Structured B2B wholesale supply desk connecting distributors, bulk traders, and retail merchants with curated commercial stock lots.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WholesaleStore',
      name: 'Kartigo',
      url: 'https://akyin.com/ventures/kartigo',
    },
  },
  '/ventures/biznxt': {
    title: 'BizNXT — Business Clarity & Consulting',
    description:
      'Practical business clarity, commercial feasibility analysis, and structured opportunity exploration for founders and SMEs with BizNXT.',
    h1: 'BizNXT — Founder Feasibility, Unit Economics & Business Clarity',
    summary:
      'Advisory and feasibility exploration helping emerging entrepreneurs evaluate commercial viability before deploying capital.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ConsultingService',
      name: 'BizNXT',
      url: 'https://akyin.com/ventures/biznxt',
    },
  },
  '/ventures/budget-bazaar': {
    title: 'Budget Bazaar — Everyday Value Retail | AKYIN Ventures',
    description:
      'Discover affordable household goods, everyday essentials, and value-first consumer retail selections curated by Budget Bazaar.',
    h1: 'Budget Bazaar — Affordable Household Essentials & Consumer Retail',
    summary:
      'Value-focused retail selection offering practical everyday household items directly to cost-conscious shoppers.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: 'Budget Bazaar',
      url: 'https://akyin.com/ventures/budget-bazaar',
    },
  },
  '/pricing': {
    title: 'Standalone Service Pricing & Quotation Builder (INR) | AKYIN Ventures',
    description:
      'Transparent INR pricing across every standalone AKYIN service—digital marketing, lead filtering, design, documents, Excel, Bulk SMS, WhatsApp setup, and training.',
    h1: 'Transparent Standalone Service Pricing (INR) & Interactive Quotation Builder',
    summary:
      'Select only the exact standalone services your business requires, review transparent INR project and monthly pricing, and generate an itemized quotation with GST clarity.',
    highlights: [
      { label: 'Full 10-Category Service Catalogue', href: '/ventures/marketing' },
      { label: 'Bulk SMS Marketing (₹3,000 / 10,000 SMS)', href: '/services/bulk-sms' },
      { label: 'WhatsApp Business Setup (₹4,999 Setup)', href: '/services/whatsapp-business-setup' },
      { label: 'Book Business Advisory (₹3,998)', href: '/advisory' },
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Standalone Service Pricing & Quotation Builder — AKYIN Ventures',
      url: 'https://akyin.com/pricing',
    },
  },
  '/tools': {
    title: '20 Free Business, Marketing & Sales Tools | AKYIN.com',
    description:
      'Calculate marketing ROI, ROAS, CAC, CPL, break-even, GST, margins, commissions, and campaign quotes with 20 free interactive AKYIN business tools.',
    h1: '20 Free Interactive Business, Marketing & Sales Calculators',
    summary:
      'Instant calculators for marketing ROI, ROAS, CAC, cost per qualified lead, GST breakdown, margin math, sales commission, and break-even planning.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'AKYIN Business, Marketing & Sales Calculators Suite',
      url: 'https://akyin.com/tools',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    },
  },
  '/quote': {
    title: 'Official Quotation & Invoice Portal | AKYIN Ventures',
    description:
      'Review your AKYIN Ventures itemized commercial quotation, approve online, print an A4 PDF dossier, and complete verified Razorpay invoice payments.',
    robots: 'noindex, nofollow',
    h1: 'AKYIN Ventures — Client Quotation & Invoice Portal',
    summary:
      'Private itemized commercial quotation approval, PDF dossier generation, and verified Razorpay invoice checkout.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'AKYIN Ventures Quotation Portal',
      url: 'https://akyin.com/quote',
    },
  },
  '/advisory': {
    title: 'Book 1-on-1 Business Advisory (IST) | AKYIN Ventures',
    description:
      'Schedule a private 30-minute IST business advisory consultation with AKYIN Ventures for strategy, unit economics, feasibility, and sales conversion.',
    h1: 'Book 1-on-1 Business Advisory Consultation (30 Min IST — ₹3,998)',
    summary:
      'Focused executive consultation on commercial feasibility, marketing unit economics, dealership processes, and growth execution.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'AKYIN Business Advisory & Consultation',
      url: 'https://akyin.com/advisory',
      provider: { '@type': 'Organization', name: 'AKYIN Ventures' },
      offers: { '@type': 'Offer', price: '3998', priceCurrency: 'INR' },
    },
  },
  '/insights': {
    title: 'Business Insights & Automotive Trends | AKYIN Ventures',
    description:
      'Read practical perspectives on performance marketing, dealership test-drive conversion, publishing, retail positioning, and digital commerce from AKYIN.',
    ogType: 'article',
    h1: 'AKYIN Insights — Performance Marketing, Dealership Conversion & Commerce',
    summary:
      'Practical notes and live automotive retail intelligence spanning lead quality control, floor sales execution, and B2B commerce.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Insights & Business Philosophy — AKYIN Ventures',
      url: 'https://akyin.com/insights',
    },
  },
  '/terms': {
    title: 'Terms of Service & Billing Policy | AKYIN Ventures',
    description:
      'Read AKYIN Ventures Terms of Service, direct Meta & Google ad billing transparency, scope separation rules, and international commercial policies.',
    h1: 'Terms of Service, Ad Billing Transparency & Scope Separation Policy',
    summary:
      'Commercial engagement rules governing standalone services, direct client payment to Meta/Google ad platforms, and written quotation scope.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Terms of Service — AKYIN Ventures',
      url: 'https://akyin.com/terms',
    },
  },
  '/privacy': {
    title: 'Privacy Policy & Data Protection | AKYIN Ventures',
    description:
      'Learn how AKYIN Ventures protects enquiry data with strict CSP rules, zero data-broker sharing, and verified security standards across akyin.com.',
    h1: 'Privacy Policy & Enquiry Data Protection Standards',
    summary:
      'How AKYIN Ventures safeguards client contact records, enforces strict Content Security Policy rules, and prohibits third-party broker sharing.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Privacy Policy — AKYIN Ventures',
      url: 'https://akyin.com/privacy',
    },
  },
  '/contact': {
    title: 'Contact AKYIN Ventures — Enquiry & Advisory Desk',
    description:
      'Connect directly with AKYIN Ventures for standalone marketing services, automotive lead systems, creative work, B2B commerce, and advisory across India and the UAE.',
    h1: 'Contact AKYIN Ventures — Direct Enquiry & Proposal Desk',
    summary:
      'Submit your exact service requirements for fast commercial follow-up via email (connect@akyin.com) or official WhatsApp Connect.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact AKYIN Ventures',
      url: 'https://akyin.com/contact',
      mainEntity: {
        '@type': 'Corporation',
        name: 'AKYIN Ventures',
        url: 'https://whatsapp.com/channel/0029VbCz1qOJ3jurZuI6cM3U',
        email: 'connect@akyin.com',
      },
    },
  },
  '/sitemap': {
    title: 'Site Map & Complete Service Directory | AKYIN Ventures',
    description:
      'Browse all corporate pages, standalone marketing service pages across 10 categories, business calculators, venture showcases, and pricing schedules.',
    h1: 'AKYIN Ventures Site Map & Complete Standalone Service Directory',
    summary:
      'Unified HTML directory of every public corporate route, operating venture page, free calculator, and individual /services/:slug offering.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ItemPage',
      name: 'Site Map & Directory — AKYIN Ventures',
      url: 'https://akyin.com/sitemap',
    },
  },
  '/admin': {
    title: 'AKYIN Ventures — Admin Management Console',
    description:
      'Restricted internal CRM, quotation, payment, and operational administration console for authorized AKYIN Ventures personnel.',
    robots: 'noindex, nofollow',
    h1: 'AKYIN Ventures — Restricted Management Console',
    summary: 'Authorized internal operations portal.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'AKYIN Ventures Admin Console',
      url: 'https://akyin.com/admin',
    },
  },
};

function buildBreadcrumbList(routePath: string, titleLabel: string, extraParent?: { name: string; url: string }) {
  const items: Array<Record<string, unknown>> = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${DOMAIN}/`,
    },
  ];
  if (extraParent) {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: extraParent.name,
      item: extraParent.url,
    });
  }
  items.push({
    '@type': 'ListItem',
    position: items.length + 1,
    name: titleLabel,
    item: `${DOMAIN}${routePath}`,
  });
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

function resolveServicePriceSummary(service: ServiceCatalogItem): string {
  if (service.id === 'srv-bulk-sms') {
    const base = service.packagePrice || service.oneTimePrice || service.setupFee || 3000;
    const credits = service.includedUnits || 10000;
    const rate = service.unitRate ?? service.additionalUnitRate ?? 0.3;
    return `${formatInr(base)} package (${credits.toLocaleString('en-IN')} SMS credits included · ₹${rate.toFixed(2)} effective/SMS)`;
  }
  if (service.id === 'srv-whatsapp-messaging') {
    const setup = service.setupFee || service.oneTimePrice || 4999;
    const perMsg = service.unitRate ?? service.additionalUnitRate ?? 1.5;
    return `${formatInr(setup)} one-time setup fee (strictly separate from ₹${perMsg.toFixed(2)}/message usage)`;
  }
  const oneTime = (service.oneTimePrice ?? 0) > 0 ? (service.oneTimePrice ?? 0) : service.setupFee;
  const monthly = (service.monthlyPrice ?? 0) > 0 ? (service.monthlyPrice ?? 0) : service.recurringFee;
  const parts: string[] = [];
  if (oneTime > 0) parts.push(`${formatInr(oneTime)} one-time`);
  if (monthly > 0) parts.push(`${formatInr(monthly)}/month`);
  if (parts.length === 0) return 'Custom Quote on Request';
  return parts.join(' + ');
}

function buildServiceSeoPayload(service: ServiceCatalogItem): {
  title: string;
  description: string;
  canonicalUrl: string;
  robots: string;
  ogType: 'website';
  structuredData: Record<string, unknown>;
  rootHtml: string;
} {
  const title = `${service.name} — ${service.category} | AKYIN MARKETINGS`;
  const description = service.description.slice(0, 220);
  const canonicalUrl = `${DOMAIN}/services/${encodeURIComponent(service.slug)}`;
  const priceLabel = resolveServicePriceSummary(service);

  const primaryOfferPrice =
    (service.monthlyPrice ?? 0) > 0
      ? (service.monthlyPrice ?? 0)
      : service.recurringFee > 0
        ? service.recurringFee
        : (service.oneTimePrice ?? 0) > 0
          ? (service.oneTimePrice ?? 0)
          : service.setupFee > 0
            ? service.setupFee
            : 0;

  const offerSchema: Record<string, unknown> =
    primaryOfferPrice > 0
      ? {
          '@type': 'Offer',
          name: service.name,
          price: String(primaryOfferPrice),
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: canonicalUrl,
        }
      : {
          '@type': 'Offer',
          name: `${service.name} (Custom Quote on Request)`,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: canonicalUrl,
        };

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${canonicalUrl}#service`,
        name: service.name,
        category: service.category,
        serviceType: service.category,
        description: service.description,
        url: canonicalUrl,
        provider: {
          '@type': 'Organization',
          name: 'AKYIN Ventures',
          url: `${DOMAIN}/`,
        },
        areaServed: ['IN', 'AE', 'US', 'GB'],
        offers: offerSchema,
      },
      buildBreadcrumbList(`/services/${service.slug}`, service.name, {
        name: 'Marketing Services',
        url: `${DOMAIN}/ventures/marketing`,
      }),
    ],
  };

  const benefitsHtml = (service.benefits || [])
    .map((b) => `<li>${escapeHtml(b)}</li>`)
    .join('');
  const deliverablesHtml = (service.deliverables || [])
    .map((d) => `<li>${escapeHtml(d)}</li>`)
    .join('');
  const processHtml = (service.workProcess || [])
    .map((step) => `<li>${escapeHtml(step)}</li>`)
    .join('');

  const rootHtml = buildShellRootHtml({
    h1: service.name,
    categoryEyebrow: `${service.category} · Standalone Service`,
    summary: service.description,
    bodyExtra: `
      <section>
        <h2>Pricing &amp; Commercial Terms</h2>
        <p><strong>${escapeHtml(priceLabel)}</strong>${service.gstEnabled ? ` · Applicable ${escapeHtml(String(service.gstRate))}% GST extra` : ''}</p>
        ${service.deliveryPeriod ? `<p>Turnaround / Duration: ${escapeHtml(service.deliveryPeriod)}</p>` : ''}
        ${service.revisionLimit ? `<p>Revisions Included: ${escapeHtml(String(service.revisionLimit))}</p>` : ''}
        ${
          service.id === 'srv-bulk-sms' || service.id === 'srv-whatsapp-messaging'
            ? '<p><em>Messaging rates are subject to provider charges, applicable taxes, message category, destination and delivery conditions. Final charges are confirmed in the quotation.</em></p>'
            : ''
        }
      </section>
      ${benefitsHtml ? `<section><h2>Key Benefits</h2><ul>${benefitsHtml}</ul></section>` : ''}
      ${deliverablesHtml ? `<section><h2>Included Deliverables</h2><ul>${deliverablesHtml}</ul></section>` : ''}
      ${processHtml ? `<section><h2>Execution Process</h2><ol>${processHtml}</ol></section>` : ''}
    `,
    highlights: [
      { label: 'Customize in Quotation Builder', href: '/pricing#quotation-builder' },
      { label: 'All 10 Service Categories', href: '/ventures/marketing' },
      { label: 'Submit Enquiry', href: '/contact' },
    ],
  });

  return {
    title,
    description,
    canonicalUrl,
    robots: DEFAULT_ROBOTS,
    ogType: 'website',
    structuredData,
    rootHtml,
  };
}

function buildShellRootHtml(opts: {
  h1: string;
  categoryEyebrow?: string;
  summary: string;
  bodyExtra?: string;
  highlights?: Array<{ label: string; href: string }>;
}): string {
  const linksHtml = (opts.highlights || [])
    .map((item) => `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`)
    .join('');

  return `
      <main style="max-width:960px;margin:0 auto;padding:32px 20px;font-family:system-ui,sans-serif;line-height:1.6;">
        <header style="border-bottom:1px solid #E8E8ED;padding-bottom:16px;margin-bottom:24px;">
          <p><strong>AKYIN Ventures</strong> — Building Ideas Into Businesses</p>
          <nav aria-label="Primary links">
            <a href="/">Home</a> ·
            <a href="/about">About</a> ·
            <a href="/ventures">Our Ventures</a> ·
            <a href="/ventures/marketing">Marketing Services</a> ·
            <a href="/marketing/automotive">Automotive Marketing</a> ·
            <a href="/pricing">Pricing</a> ·
            <a href="/tools">Business Tools</a> ·
            <a href="/advisory">Advisory</a> ·
            <a href="/insights">Insights</a> ·
            <a href="/contact">Contact</a> ·
            <a href="/terms">Terms</a> ·
            <a href="/privacy">Privacy</a> ·
            <a href="/sitemap">Sitemap</a>
          </nav>
        </header>
        ${opts.categoryEyebrow ? `<p style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#6E6E73;margin-bottom:8px;">${escapeHtml(opts.categoryEyebrow)}</p>` : ''}
        <h1>${escapeHtml(opts.h1)}</h1>
        <p>${escapeHtml(opts.summary)}</p>
        ${opts.bodyExtra || ''}
        ${linksHtml ? `<section><h2>Explore Next</h2><ul>${linksHtml}</ul></section>` : ''}
        <footer style="margin-top:32px;border-top:1px solid #E8E8ED;padding-top:16px;">
          <p>Email: <a href="mailto:connect@akyin.com">connect@akyin.com</a> | <a href="https://whatsapp.com/channel/0029VbCz1qOJ3jurZuI6cM3U" target="_blank" rel="noopener noreferrer">WhatsApp Connect</a></p>
          <p><a href="/ventures/marketing">Service Catalogue</a> · <a href="/pricing">Pricing</a> · <a href="/terms">Terms of Service</a> · <a href="/privacy">Privacy Policy</a></p>
        </footer>
      </main>`;
}

export function renderSeoHtml(baseHtml: string, rawPath: string, db?: SuiteDatabase): string {
  const cleaned = rawPath.split('?')[0].replace(/\/+$/, '') || '/';

  // 1. Check /services/:slug
  if (cleaned.startsWith('/services/') && db) {
    const requestedSlug = decodeURIComponent(cleaned.slice('/services/'.length)).trim().toLowerCase();
    const matchedService = db.services.find(
      (s) => s.active && (s.slug || '').trim().toLowerCase() === requestedSlug
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
        rootHtml: payload.rootHtml,
      });
    }
  }

  // 2. Check static routes
  const meta = ROUTE_SEO_META[cleaned] || ROUTE_SEO_META['/'];
  const canonicalUrl = `${DOMAIN}${cleaned === '/' ? '/' : cleaned}`;
  const robotsValue = meta.robots || DEFAULT_ROBOTS;
  const ogType = meta.ogType || 'website';

  let structuredData = meta.structuredData;
  if (cleaned !== '/' && cleaned !== '/admin' && ROUTE_SEO_META[cleaned]) {
    const label = meta.title.split('—')[0].split('|')[0].trim();
    const breadcrumb = buildBreadcrumbList(cleaned, label);
    if (Array.isArray((structuredData as { '@graph'?: unknown[] })['@graph'])) {
      structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
          ...((structuredData as { '@graph': unknown[] })['@graph'] || []),
          breadcrumb,
        ],
      };
    } else {
      const { ['@context']: _ctx, ...rest } = structuredData;
      structuredData = {
        '@context': 'https://schema.org',
        '@graph': [rest, breadcrumb],
      };
    }
  }

  // For /sitemap or /ventures/marketing include SSR directory links for active standalone services
  let bodyExtra = '';
  if ((cleaned === '/ventures/marketing' || cleaned === '/sitemap') && db) {
    const activeServices = db.services
      .filter((s) => s.active && s.slug)
      .slice()
      .sort((a, b) => (a.menuOrder ?? a.sortOrder) - (b.menuOrder ?? b.sortOrder));
    if (activeServices.length > 0) {
      const itemsHtml = activeServices
        .map(
          (s) =>
            `<li><a href="/services/${encodeURIComponent(s.slug)}">${escapeHtml(s.name)}</a> — ${escapeHtml(s.category)} (${escapeHtml(resolveServicePriceSummary(s))})</li>`
        )
        .join('');
      bodyExtra = `<section><h2>Standalone Services Directory</h2><ul>${itemsHtml}</ul></section>`;
    }
  }

  const rootHtml = buildShellRootHtml({
    h1: meta.h1,
    summary: meta.summary,
    bodyExtra,
    highlights: meta.highlights,
  });

  return injectSeoIntoTemplate(baseHtml, {
    title: meta.title,
    description: meta.description,
    canonicalUrl,
    robotsValue,
    ogType,
    structuredData,
    rootHtml,
  });
}

function injectSeoIntoTemplate(
  baseHtml: string,
  opts: {
    title: string;
    description: string;
    canonicalUrl: string;
    robotsValue: string;
    ogType: string;
    structuredData: Record<string, unknown>;
    rootHtml: string;
  }
): string {
  // Strictly keep og:title & twitter:title identical to <title>
  const exactTitle = opts.title;
  const exactDesc = opts.description;

  let html = baseHtml
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(exactTitle)}</title>`)
    .replace(
      /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="robots" content="${escapeHtml(opts.robotsValue)}" />`
    )
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${escapeHtml(exactDesc)}" />`
    )
    .replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
      `<link rel="canonical" href="${escapeHtml(opts.canonicalUrl)}" />`
    )
    .replace(
      /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:type" content="${escapeHtml(opts.ogType)}" />`
    )
    .replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:title" content="${escapeHtml(exactTitle)}" />`
    )
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:description" content="${escapeHtml(exactDesc)}" />`
    )
    .replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:url" content="${escapeHtml(opts.canonicalUrl)}" />`
    )
    .replace(
      /<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:image:alt" content="${escapeHtml(exactTitle)}" />`
    )
    .replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:title" content="${escapeHtml(exactTitle)}" />`
    )
    .replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:description" content="${escapeHtml(exactDesc)}" />`
    )
    .replace(
      /<meta\s+name="twitter:image:alt"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:image:alt" content="${escapeHtml(exactTitle)}" />`
    )
    .replace(
      /<script\s+id="akyin-schema-jsonld"\s+type="application\/ld\+json">[\s\S]*?<\/script>/i,
      `<script id="akyin-schema-jsonld" type="application/ld+json">${safeJsonLd(opts.structuredData)}</script>`
    );

  // Replace server-rendered fallback HTML inside <div id="root">...</div> cleanly (dev & Vite prod builds)
  html = html.replace(
    /<div id="root">[\s\S]*?<\/div>(?=\s*(?:<script|<!--|<\/body>))/i,
    `<div id="root">${opts.rootHtml}\n    </div>`
  );

  return html;
}

export function buildDynamicSitemapXml(db: SuiteDatabase): string {
  const fallbackDate = new Date().toISOString().slice(0, 10);

  const staticEntries: Array<{ path: string; changefreq: string; priority: string }> = [
    { path: '/', changefreq: 'weekly', priority: '1.0' },
    { path: '/about', changefreq: 'monthly', priority: '0.9' },
    { path: '/ventures', changefreq: 'weekly', priority: '0.9' },
    { path: '/ventures/publishing', changefreq: 'monthly', priority: '0.8' },
    { path: '/ventures/marketing', changefreq: 'weekly', priority: '0.95' },
    { path: '/marketing/automotive', changefreq: 'weekly', priority: '0.95' },
    { path: '/ventures/store', changefreq: 'monthly', priority: '0.8' },
    { path: '/ventures/aicalc', changefreq: 'monthly', priority: '0.8' },
    { path: '/ventures/kartigo', changefreq: 'monthly', priority: '0.8' },
    { path: '/ventures/biznxt', changefreq: 'monthly', priority: '0.8' },
    { path: '/ventures/budget-bazaar', changefreq: 'monthly', priority: '0.8' },
    { path: '/pricing', changefreq: 'weekly', priority: '0.9' },
    { path: '/tools', changefreq: 'weekly', priority: '0.9' },
    { path: '/advisory', changefreq: 'weekly', priority: '0.9' },
    { path: '/insights', changefreq: 'weekly', priority: '0.8' },
    { path: '/contact', changefreq: 'monthly', priority: '0.9' },
    { path: '/terms', changefreq: 'monthly', priority: '0.7' },
    { path: '/privacy', changefreq: 'monthly', priority: '0.7' },
    { path: '/sitemap', changefreq: 'weekly', priority: '0.7' },
  ];

  const seenUrls = new Set<string>();
  const urlNodes: string[] = [];

  for (const entry of staticEntries) {
    // Safety guard: never allow private routes into sitemap
    if (entry.path === '/admin' || entry.path === '/quote') continue;
    const loc = `${DOMAIN}${entry.path === '/' ? '/' : entry.path}`;
    seenUrls.add(loc);
    urlNodes.push(
      `  <url>\n    <loc>${escapeHtml(loc)}</loc>\n    <lastmod>${fallbackDate}</lastmod>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`
    );
  }

  const activeServices = (db?.services || [])
    .filter((s) => s.active && Boolean(s.slug))
    .slice()
    .sort((a, b) => (a.menuOrder ?? a.sortOrder) - (b.menuOrder ?? b.sortOrder));

  for (const service of activeServices) {
    const cleanSlug = service.slug.trim();
    if (!cleanSlug) continue;
    const loc = `${DOMAIN}/services/${encodeURIComponent(cleanSlug)}`;
    if (seenUrls.has(loc)) continue;
    seenUrls.add(loc);
    const lastmod =
      typeof service.updatedAt === 'string' && /^\d{4}-\d{2}-\d{2}/.test(service.updatedAt)
        ? service.updatedAt.slice(0, 10)
        : fallbackDate;
    urlNodes.push(
      `  <url>\n    <loc>${escapeHtml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.85</priority>\n  </url>`
    );
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlNodes.join('\n')}\n</urlset>\n`;
}
