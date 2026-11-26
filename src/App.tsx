import {
  ComponentType,
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  AppRoute,
  BUSINESS_VERTICAL_OPTIONS,
  ENQUIRY_CATEGORIES,
  ENQUIRY_TYPE_OPTIONS,
} from './data/akyinData';
import { BreadcrumbBar } from './components/BreadcrumbBar';
import { CopyToast } from './components/CopyToast';
import { FloatingContactWidget } from './components/FloatingContactWidget';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { ReadingProgressBar } from './components/ReadingProgressBar';
import { GlobalLoadingSkeleton } from './components/GlobalLoadingSkeleton';
import { PageErrorBoundary } from './components/PageErrorBoundary';
import { HomePage } from './pages/HomePage';
import { RouteMetaProvider, useRouteMeta } from './context/RouteMetaContext';
import { SiteConfigProvider } from './context/SiteConfigContext';
import { registerAkyinWebMcpTools } from './utils/webmcp';

function lazyPage<T extends ComponentType<any>>(
  loader: () => Promise<T>
) {
  return lazy(async () => ({ default: await loader() }));
}

const AboutPage = lazyPage(() => import('./pages/AboutPage').then((m) => m.AboutPage));
const AdminPage = lazyPage(() => import('./pages/AdminPage').then((m) => m.AdminPage));
const AdvisoryPage = lazyPage(() => import('./pages/AdvisoryPage').then((m) => m.AdvisoryPage));
const AICalcPage = lazyPage(() => import('./pages/AICalcPage').then((m) => m.AICalcPage));
const BizNXTPage = lazyPage(() => import('./pages/BizNXTPage').then((m) => m.BizNXTPage));
const BudgetBazaarPage = lazyPage(() =>
  import('./pages/BudgetBazaarPage').then((m) => m.BudgetBazaarPage)
);
const BusinessesPage = lazyPage(() =>
  import('./pages/BusinessesPage').then((m) => m.BusinessesPage)
);
const ContactPage = lazyPage(() => import('./pages/ContactPage').then((m) => m.ContactPage));
const InsightsPage = lazyPage(() => import('./pages/InsightsPage').then((m) => m.InsightsPage));
const KartigoPage = lazyPage(() => import('./pages/KartigoPage').then((m) => m.KartigoPage));
const MarketingPage = lazyPage(() => import('./pages/MarketingPage').then((m) => m.MarketingPage));
const AutomotiveMarketingPage = lazyPage(() =>
  import('./pages/AutomotiveMarketingPage').then((m) => m.AutomotiveMarketingPage)
);
const PricingPage = lazyPage(() => import('./pages/PricingPage').then((m) => m.PricingPage));
const PublishingPage = lazyPage(() =>
  import('./pages/PublishingPage').then((m) => m.PublishingPage)
);
const QuotePortalPage = lazyPage(() =>
  import('./pages/QuotePortalPage').then((m) => m.QuotePortalPage)
);
const ServiceDetailPage = lazyPage(() =>
  import('./pages/ServiceDetailPage').then((m) => m.ServiceDetailPage)
);
const SitemapPage = lazyPage(() => import('./pages/SitemapPage').then((m) => m.SitemapPage));
const StorePage = lazyPage(() => import('./pages/StorePage').then((m) => m.StorePage));
const TermsPage = lazyPage(() => import('./pages/TermsPage').then((m) => m.TermsPage));
const ToolsPage = lazyPage(() => import('./pages/ToolsPage').then((m) => m.ToolsPage));

type StaticRoute = Exclude<AppRoute, `/services/${string}`>;

const VALID_ROUTES: StaticRoute[] = [
  '/',
  '/about',
  '/ventures',
  '/ventures/publishing',
  '/ventures/marketing',
  '/marketing/automotive',
  '/ventures/store',
  '/ventures/aicalc',
  '/ventures/kartigo',
  '/ventures/biznxt',
  '/ventures/budget-bazaar',
  '/pricing',
  '/tools',
  '/quote',
  '/advisory',
  '/insights',
  '/terms',
  '/privacy',
  '/contact',
  '/sitemap',
  '/admin',
];

export interface RouteMetadata {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  structuredData: Record<string, unknown>;
}

export const ROUTE_META: Record<StaticRoute, RouteMetadata> = {
  '/': {
    title: 'AKYIN Ventures — Multi-Business Group & Marketing Agency',
    description:
      'AKYIN Ventures is a diversified multi-business group and marketing agency spanning publishing, automotive growth, retail, AI tools, B2B trade, and advisory.',
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
            'Multi-business parent group and full-service marketing agency operating core ventures in publishing, performance marketing, and fashion retail while supporting 58+ independent client businesses across AI utilities, B2B wholesale trade, automotive growth, and business consulting.',
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
              contactType: 'customer service',
              email: 'connect@akyin.com',
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
          priceRange: '₹1,999 - ₹49,999',
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
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '8',
            bestRating: '5',
          },
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
          '@type': 'Product',
          name: 'THE DISCIPLINE CODE by Akyin S.',
          brand: { '@type': 'Brand', name: 'AKYIN Publishing' },
          description:
            'Independent book published by AKYIN Publishing on practical business and personal execution.',
          offers: {
            '@type': 'Offer',
            price: '299',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            url: 'https://play.google.com/store/books/details/Akyin_s_THE_DISCIPLINE_CODE?id=seHuEQAAQBAJ',
          },
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What businesses operate under AKYIN Ventures?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'AKYIN Ventures operates three core ventures: AKYIN Publishing, AKYIN MARKETINGS (Agency), and AKYIN Store / AKYIN Thrift, while supporting 58+ client businesses including AICalc.in, Kartigo.online, BizNXT.online, and Budget Bazaar.',
              },
            },
            {
              '@type': 'Question',
              name: 'Are AKYIN Marketing services offered standalone or as combined packages?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Every service across all 10 categories is strictly standalone with zero compulsory bundles—clients can select Meta Ads Management (₹40,000/month), Lead Filtering (₹24,000/month), Logo Design (₹6,000), Bulk SMS (₹3,000 for 10,000 credits), WhatsApp Business Setup (₹4,999 one-time setup), Sales Training (₹50,000/session), or Business Advisory (₹3,998/session) independently.',
              },
            },
            {
              '@type': 'Question',
              name: 'How does ad billing work with AKYIN Marketing?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Advertising budgets are paid directly by clients to Meta or Google. AKYIN fees cover strategy, campaign setup, independent lead qualification, creative assets, and optional sales team training.',
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
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Our Ventures & Client Ecosystem — AKYIN Ventures',
      url: 'https://akyin.com/ventures',
      description: 'Explore core operating ventures under AKYIN Ventures and featured client showcases.',
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'AKYIN Publishing',
            url: 'https://akyin.com/ventures/publishing',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'AKYIN Marketing Agency',
            url: 'https://akyin.com/ventures/marketing',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'AKYIN Store / AKYIN THRIFT',
            url: 'https://akyin.com/ventures/store',
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: 'AICalc.in',
            url: 'https://akyin.com/ventures/aicalc',
          },
          {
            '@type': 'ListItem',
            position: 5,
            name: 'Kartigo.online',
            url: 'https://akyin.com/ventures/kartigo',
          },
          {
            '@type': 'ListItem',
            position: 6,
            name: 'BizNXT.online',
            url: 'https://akyin.com/ventures/biznxt',
          },
          {
            '@type': 'ListItem',
            position: 7,
            name: 'Budget Bazaar',
            url: 'https://akyin.com/ventures/budget-bazaar',
          },
        ],
      },
    },
  },
  '/ventures/publishing': {
    title: 'AKYIN Publishing — Books & Digital Guides | AKYIN.com',
    description:
      'Explore eight published books on Amazon and three digital productivity & finance kits including The Discipline Code and The Money OS by AKYIN Publishing.',
    structuredData: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          name: 'AKYIN Publishing',
          url: 'https://akyin.com/ventures/publishing',
          parentOrganization: { '@type': 'Corporation', name: 'AKYIN Ventures' },
        },
        {
          '@type': 'Book',
          name: 'The Discipline Code: Master Your Mind. Build Unbreakable Habits. Win Every Day.',
          author: { '@type': 'Person', name: 'Akyin S.' },
          publisher: { '@type': 'Organization', name: 'AKYIN Publishing' },
          inLanguage: 'en',
          bookFormat: 'https://schema.org/EBook',
          url: 'https://a.co/d/0ggfRzci',
        },
        {
          '@type': 'Book',
          name: 'BIOPIC OF LOSER: A Gritty Real-Life Biography of Failure, Resilience, and the Ultimate Corporate Automobile Hustle (1989–2013)',
          author: { '@type': 'Person', name: 'AKYIN S.' },
          publisher: { '@type': 'Organization', name: 'AKYIN Publishing' },
          inLanguage: 'en',
          bookFormat: 'https://schema.org/EBook',
          url: 'https://a.co/d/0ig3AHqX',
        },
        {
          '@type': 'Book',
          name: 'THE SCROLL RECOVERY PLAN: A 30-Day System to Stop Doomscrolling, Rebuild Focus, and Take Back Your Time',
          author: { '@type': 'Person', name: 'Akyin S.' },
          publisher: { '@type': 'Organization', name: 'AKYIN Publishing' },
          inLanguage: 'en',
          bookFormat: 'https://schema.org/EBook',
          url: 'https://a.co/d/0ewHC6eM',
        },
        {
          '@type': 'Book',
          name: 'The Wealth Trap: Why Smart People Stay Stuck, Make Emotional Money Mistakes, and Never Build the Wealth They Deserve',
          author: { '@type': 'Person', name: 'Akyin S.' },
          publisher: { '@type': 'Organization', name: 'AKYIN Publishing' },
          inLanguage: 'en',
          bookFormat: 'https://schema.org/EBook',
          url: 'https://a.co/d/0eUuZA8r',
        },
        {
          '@type': 'Book',
          name: 'THE RESET CODE: Why Smart People Stay Stuck, Self-Sabotage Success, and Repeat the Same Mistakes—And How to Finally Change Their Life',
          author: { '@type': 'Person', name: 'AKYIN S.' },
          publisher: { '@type': 'Organization', name: 'AKYIN Publishing' },
          inLanguage: 'en',
          bookFormat: 'https://schema.org/EBook',
          url: 'https://a.co/d/0h7g4V7g',
        },
        {
          '@type': 'Book',
          name: 'THE DISCIPLINE RESET: Break Bad Habits, Beat Distractions, Build Self-Discipline, and Achieve Consistent Success',
          author: { '@type': 'Person', name: 'Akyin S.' },
          publisher: { '@type': 'Organization', name: 'AKYIN Publishing' },
          inLanguage: 'en',
          bookFormat: 'https://schema.org/EBook',
          url: 'https://a.co/d/02kzLiOu',
        },
        {
          '@type': 'Book',
          name: 'THE OVERTHINKING RESET: Why Intelligent People Overthink, the Invisible Damage It Causes, and How to Break the First Mental Illusion',
          author: { '@type': 'Person', name: 'Akyin S.' },
          publisher: { '@type': 'Organization', name: 'AKYIN Publishing' },
          inLanguage: 'en',
          bookFormat: 'https://schema.org/EBook',
          url: 'https://a.co/d/0atu9L9M',
        },
        {
          '@type': 'Book',
          name: 'The Dopamine Reset Code: Break Phone Addiction, Rewire Your Brain, Build Laser Focus, and Reclaim Your Productivity in 30 Days',
          author: { '@type': 'Person', name: 'Akyin S.' },
          publisher: { '@type': 'Organization', name: 'AKYIN Publishing' },
          inLanguage: 'en',
          bookFormat: 'https://schema.org/EBook',
          url: 'https://a.co/d/0c9NrwA7',
        },
        {
          '@type': 'DigitalDocument',
          name: 'India ATS Resume & Job Search Kit',
          publisher: { '@type': 'Organization', name: 'AKYIN Publishing' },
          url: 'https://akyinspire.gumroad.com/l/atsresumekit',
        },
        {
          '@type': 'DigitalDocument',
          name: 'THE SCROLL RECOVERY PLAN',
          publisher: { '@type': 'Organization', name: 'AKYIN Publishing' },
          url: 'https://akyinspire.gumroad.com/l/THESCROLLRECOVERYPLAN?wanted=true',
        },
        {
          '@type': 'DigitalDocument',
          name: 'THE MONEY OS™ | Complete Personal Finance Planner & Budgeting System',
          publisher: { '@type': 'Organization', name: 'AKYIN Publishing' },
          url: 'https://akyinspire.gumroad.com/l/the-money-os?wanted=true',
        },
      ],
    },
  },
  '/ventures/marketing': {
    title: 'AKYIN MARKETINGS — Full-Service Growth Marketing Agency',
    description:
      'Full-service digital marketing agency delivering Meta & Google lead generation, AI-assisted lead qualification, creative suites, and showroom sales training.',
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
            'Full-service digital marketing agency delivering Meta & Google lead generation, AI-assisted lead qualification, creative suites, and showroom sales training.',
          priceRange: '$$',
          areaServed: ['IN', 'AE', 'US', 'GB'],
          email: 'connect@akyin.com',
        },
        {
          '@type': 'FAQPage',
          '@id': 'https://akyin.com/ventures/marketing#agency-faq',
          name: 'AKYIN MARKETINGS — Agency Services, Messaging & Pricing FAQ',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What marketing services does AKYIN MARKETINGS provide?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'AKYIN MARKETINGS provides 26 standalone agency and business-support services across Meta and Google lead generation, independent lead filtering and qualification, AI-assisted outbound calling, Bulk SMS Marketing, WhatsApp Business Messaging Setup, local SEO, influencer coordination, commercial sales training, and Business Creative & Documentation Services.',
              },
            },
            {
              '@type': 'Question',
              name: 'How are Lead Generation and Lead Filtering & Qualification separated?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Lead Generation and Lead Filtering & Qualification are strictly standalone deliverables. Lead Generation focuses on acquiring fresh buyer enquiries through targeted Meta and Google campaigns, while Lead Filtering & Qualification vets existing inbound enquiries via AI-assisted and human follow-up to deliver prioritized buyer sheets.',
              },
            },
            {
              '@type': 'Question',
              name: 'How are standalone agency services and advertising budgets billed?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Clients pay Meta and Google advertising spend directly from their own billing accounts. Agency fees apply independently per chosen service—for example Meta Ads Management is ₹40,000/month, Lead Filtering is ₹24,000/month, and Commercial Sales Training is ₹50,000 per session (applicable GST extra).',
              },
            },
            {
              '@type': 'Question',
              name: 'How are Bulk SMS Marketing and WhatsApp Business Messaging priced?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Bulk SMS Marketing is offered as a ₹3,000 package including 10,000 SMS credits (₹0.30 effective per SMS, with additional credits billed at the admin-configured rate). WhatsApp Business Messaging separates the ₹4,999 one-time setup fee from per-message usage billed at ₹1.50 per message. Messaging rates are subject to provider charges, applicable taxes, message category, destination, and delivery conditions confirmed in the written quotation.',
              },
            },
            {
              '@type': 'Question',
              name: 'Can small businesses order creative and documentation services without an agency retainer?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Every service in Creative and Graphic Design, Business Documents and Presentations, and Excel and Reporting Services—including Logo Design, Thumbnail Design, Script Writing, PowerPoint Presentations, and Excel Reports—is available standalone as either a one-time project or a monthly option.',
              },
            },
            {
              '@type': 'Question',
              name: 'Does AKYIN sell standalone CRM software or operate as a managed service?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'AKYIN operates AI-assisted calling, lead qualification, and pipeline tracking internally as a managed agency service tailored to your campaign workflow rather than selling standalone SaaS CRM licenses.',
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
            'Book qualified showroom test drives, not cold clicks. Targeted Meta & Google auto ads, lead vetting, and floor sales coaching for dealers. Get a quote.',
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
                text: 'AKYIN enforces strict separation between Meta/Google lead generation and multi-tier lead qualification. Every raw enquiry undergoes automated phone verification and AI-assisted plus human telephonic vetting to confirm vehicle model interest, budget readiness, purchase timeline, and preferred showroom or doorstep test-drive slot before routing.',
              },
            },
            {
              '@type': 'Question',
              name: 'What buyer signals are checked before routing a test-drive lead to dealership sales executives?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Each prospect is screened for target vehicle model and variant, on-road budget or financing readiness, purchase window (immediate vs. 30–90 days), local catchment proximity, and confirmed test-drive appointment intent, then classified as Hot, Warm, Future Follow-up, Unreachable, or Not Interested.',
              },
            },
            {
              '@type': 'Question',
              name: 'How quickly are qualified test-drive leads delivered to showroom teams?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Hot test-drive buyers are pushed within seconds via dealership CRM integrations and instant WhatsApp alerts to floor executives, backed by structured daily Excel qualification logs to eliminate follow-up leakage.',
              },
            },
            {
              '@type': 'Question',
              name: 'What is the difference between AKYIN lead generation and lead qualification?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Lead generation captures buyer demand through geo-fenced Meta and Google ads (with ad spend paid directly to platforms), while lead qualification vets incoming enquiries by phone and intent scoring so dealership sales teams focus exclusively on ready-to-visit test-drive buyers.',
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
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ClothingStore',
      name: 'AKYIN STORE · AKYIN THRIFT',
      url: 'https://akyin.com/ventures/store',
      parentOrganization: { '@type': 'Corporation', name: 'AKYIN Ventures' },
      description:
        'Curated men’s and women’s fashion and clothing at exceptional discounted prices through AKYIN THRIFT under AKYIN STORE.',
      priceRange: '$',
    },
  },
  '/ventures/aicalc': {
    title: 'AICalc.in — Smart AI & Manual Calculators | AKYIN',
    description:
      'Explore AICalc.in: combining natural-language AI calculation queries with classic manual financial, business, and everyday calculators online.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'AICalc.in',
      url: 'https://aicalc.in',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      description:
        'Explore AICalc.in: combining natural-language AI calculation queries with classic manual financial, business, and everyday calculators online.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
  },
  '/ventures/kartigo': {
    title: 'Kartigo — B2B Stock Supply & Wholesale Trade',
    description:
      'Connect with wholesale commercial inventory, bulk stock lots, and reliable B2B trade distribution opportunities across categories with Kartigo.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WholesaleStore',
      name: 'Kartigo',
      url: 'https://akyin.com/ventures/kartigo',
      description:
        'B2B stock commerce and wholesale inventory supply platform connecting manufacturers, distributors, and retail buyers.',
    },
  },
  '/ventures/biznxt': {
    title: 'BizNXT — Business Clarity & Consulting',
    description:
      'Practical business clarity, commercial feasibility analysis, and structured opportunity exploration for founders and SMEs with BizNXT.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ConsultingService',
      name: 'BizNXT',
      url: 'https://akyin.com/ventures/biznxt',
      description:
        'Business guidance, feasibility analysis, and opportunity consulting for entrepreneurs and founders.',
    },
  },
  '/ventures/budget-bazaar': {
    title: 'Budget Bazaar — Everyday Value Retail | AKYIN Ventures',
    description:
      'Discover affordable household goods, everyday essentials, and value-first consumer retail selections curated by Budget Bazaar.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: 'Budget Bazaar',
      url: 'https://akyin.com/ventures/budget-bazaar',
      description:
        'Value-oriented retail brand bringing affordable household goods and everyday essentials directly to shoppers.',
    },
  },
  '/pricing': {
    title: 'Standalone Service Pricing & Quotation Builder (INR) | AKYIN Ventures',
    description:
      'Transparent INR pricing across every standalone AKYIN service—digital marketing, lead filtering, design, documents, Excel, Bulk SMS, WhatsApp setup, and training.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Standalone Service Pricing & Quotation Builder — AKYIN Ventures',
      url: 'https://akyin.com/pricing',
      mainEntity: {
        '@type': 'OfferCatalog',
        name: 'AKYIN Ventures Commercial Standalone Rate Card',
        itemListElement: [
          {
            '@type': 'Offer',
            name: 'Meta Ads Management',
            price: '40000',
            priceCurrency: 'INR',
          },
          {
            '@type': 'Offer',
            name: 'Lead Filtering & Qualification',
            price: '24000',
            priceCurrency: 'INR',
          },
          {
            '@type': 'Offer',
            name: 'Bulk SMS Marketing (10,000 Credits)',
            price: '3000',
            priceCurrency: 'INR',
          },
          {
            '@type': 'Offer',
            name: 'WhatsApp Business Messaging Setup (One-Time Setup)',
            price: '4999',
            priceCurrency: 'INR',
          },
          {
            '@type': 'Offer',
            name: 'Commercial & Dealership Sales Training',
            price: '50000',
            priceCurrency: 'INR',
          },
          {
            '@type': 'Offer',
            name: '1-on-1 Business Advisory (30 min IST)',
            price: '3998',
            priceCurrency: 'INR',
          },
        ],
      },
    },
  },
  '/tools': {
    title: '20 Free Business, Marketing & Sales Tools | AKYIN.com',
    description:
      'Calculate marketing ROI, ROAS, CAC, CPL, break-even, GST, margins, commissions, and campaign quotes with 20 free interactive AKYIN business tools.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'AKYIN Business, Marketing & Sales Calculators Suite',
      url: 'https://akyin.com/tools',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      description:
        'Suite of 20 free interactive calculators covering marketing ROI, ROAS, CAC, CPL, conversion rates, profit margins, break-even units, GST, sales commissions, and quotation estimates.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
      },
      provider: { '@id': 'https://akyin.com/#organization' },
    },
  },
  '/quote': {
    title: 'Official Quotation & Invoice Portal | AKYIN Ventures',
    description:
      'Review your AKYIN Ventures itemized commercial quotation, approve online, print an A4 PDF dossier, and complete verified Razorpay invoice payments.',
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
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'AKYIN Business Advisory & Consultation',
      url: 'https://akyin.com/advisory',
      provider: { '@type': 'Organization', name: 'AKYIN Ventures' },
      serviceType: 'Executive Business Advisory Session',
      description:
        '1-on-1 strategic consultation addressing business feasibility, sales conversion discipline, and venture execution on India Standard Time (Asia/Kolkata).',
      areaServed: ['IN', 'AE', 'Global'],
      offers: {
        '@type': 'Offer',
        price: '3998',
        priceCurrency: 'INR',
      },
    },
  },
  '/insights': {
    title: 'Business Insights & Automotive Trends | AKYIN Ventures',
    description:
      'Read practical perspectives on performance marketing, dealership test-drive conversion, publishing, retail positioning, and digital commerce from AKYIN.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Insights & Business Philosophy — AKYIN Ventures',
      url: 'https://akyin.com/insights',
      description:
        'Operational perspectives and automotive marketing trends across publishing, full-service agency marketing, discounted fashion retail, AI tools, and B2B commerce.',
    },
  },
  '/terms': {
    title: 'Terms of Service & Billing Policy | AKYIN Ventures',
    description:
      'Read AKYIN Ventures Terms of Service, direct Meta & Google ad billing transparency, scope separation rules, and international commercial policies.',
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
      'Connect directly with AKYIN Ventures for marketing retainers, automotive lead systems, publishing, B2B commerce, and advisory across India and the UAE.',
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
    title: 'Site Map & Complete Page Directory | AKYIN Ventures',
    description:
      'Browse all corporate pages, business calculators, operating venture showcases, pricing schedules, and official AKYIN Ventures channels in one directory.',
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
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'AKYIN Ventures Admin Console',
      url: 'https://akyin.com/admin',
    },
  },
};

function parseRoute(pathname: string): AppRoute {
  const pathWithoutQueryAndHash = (pathname || '/').split('?')[0].split('#')[0];
  const cleaned = pathWithoutQueryAndHash.replace(/\/+$/, '') || '/';
  if (VALID_ROUTES.includes(cleaned as StaticRoute)) {
    return cleaned as AppRoute;
  }
  if (/^\/services\/[a-z0-9-]+$/i.test(cleaned)) {
    return cleaned as AppRoute;
  }
  return '/';
}

function AppShell() {
  const shouldReduceMotion = useReducedMotion();
  const { routeMetaMap } = useRouteMeta();
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() =>
    typeof window !== 'undefined' ? parseRoute(window.location.pathname) : '/'
  );
  const [isRoutePending, startRouteTransition] = useTransition();
  const mainRef = useRef<HTMLElement | null>(null);
  const pendingHashRef = useRef<string | null>(
    typeof window !== 'undefined' && window.location.hash
      ? window.location.hash.replace(/^#/, '')
      : null
  );
  const scrollCleanupRef = useRef<(() => void) | null>(null);
  const copyToastTimerRef = useRef<number | null>(null);
  const [copyToastVisible, setCopyToastVisible] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState('');

  const [contactDefaults, setContactDefaults] = useState({
    category: ENQUIRY_CATEGORIES[0] as string,
    vertical: BUSINESS_VERTICAL_OPTIONS[0] as string,
    enquiryType: ENQUIRY_TYPE_OPTIONS[0] as string,
  });

  const cancelPendingScroll = useCallback(() => {
    if (scrollCleanupRef.current) {
      scrollCleanupRef.current();
      scrollCleanupRef.current = null;
    }
  }, []);

  const scheduleHashScroll = useCallback(
    (hashId: string | null) => {
      cancelPendingScroll();
      if (typeof window === 'undefined') return;

      const behavior: ScrollBehavior = shouldReduceMotion ? 'auto' : 'smooth';
      if (!hashId) {
        pendingHashRef.current = null;
        window.scrollTo({ top: 0, behavior });
        return;
      }

      pendingHashRef.current = hashId;

      const tryScroll = (): boolean => {
        const target = document.getElementById(hashId);
        if (target) {
          target.scrollIntoView({ behavior, block: 'start' });
          pendingHashRef.current = null;
          return true;
        }
        return false;
      };

      let observer: MutationObserver | null = null;
      let timeoutId: number | null = null;

      const cleanup = () => {
        if (observer) {
          observer.disconnect();
          observer = null;
        }
        if (timeoutId !== null) {
          window.clearTimeout(timeoutId);
          timeoutId = null;
        }
      };

      const rafId = window.requestAnimationFrame(() => {
        if (tryScroll()) {
          cleanup();
          return;
        }

        const root = mainRef.current || document.body;
        observer = new MutationObserver(() => {
          if (tryScroll()) {
            cleanup();
          }
        });
        observer.observe(root, { childList: true, subtree: true });

        timeoutId = window.setTimeout(() => {
          cleanup();
          pendingHashRef.current = null;
        }, 5000);
      });

      scrollCleanupRef.current = () => {
        window.cancelAnimationFrame(rafId);
        cleanup();
      };
    },
    [cancelPendingScroll, shouldReduceMotion]
  );

  useEffect(() => {
    const handlePopState = () => {
      const nextRoute = parseRoute(window.location.pathname);
      const nextHash = window.location.hash ? window.location.hash.replace(/^#/, '') : null;
      pendingHashRef.current = nextHash;
      startRouteTransition(() => {
        setCurrentRoute(nextRoute);
      });
      if (nextRoute === currentRoute) {
        scheduleHashScroll(nextHash);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      cancelPendingScroll();
      if (copyToastTimerRef.current !== null) {
        window.clearTimeout(copyToastTimerRef.current);
      }
    };
  }, [cancelPendingScroll, currentRoute, scheduleHashScroll]);

  const handleCopyLink = useCallback(async () => {
    const targetUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}${currentRoute}`
        : `https://akyin.com${currentRoute}`;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(targetUrl);
      }
      setCopiedUrl(targetUrl);
      setCopyToastVisible(true);
      if (copyToastTimerRef.current !== null) {
        window.clearTimeout(copyToastTimerRef.current);
      }
      copyToastTimerRef.current = window.setTimeout(() => {
        setCopyToastVisible(false);
        copyToastTimerRef.current = null;
      }, 2400);
    } catch {
      setCopiedUrl(targetUrl);
      setCopyToastVisible(true);
      if (copyToastTimerRef.current !== null) {
        window.clearTimeout(copyToastTimerRef.current);
      }
      copyToastTimerRef.current = window.setTimeout(() => {
        setCopyToastVisible(false);
        copyToastTimerRef.current = null;
      }, 2400);
    }
  }, [currentRoute]);

  useEffect(() => {
    const meta = !currentRoute.startsWith('/services/')
      ? (routeMetaMap[currentRoute] ?? ROUTE_META[currentRoute as StaticRoute])
      : null;

    if (meta) {
      document.title = meta.title;

      const canonicalUrl = `https://akyin.com${currentRoute === '/' ? '/' : currentRoute}`;
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonicalUrl);

      let descTag = document.querySelector('meta[name="description"]');
      if (!descTag) {
        descTag = document.createElement('meta');
        descTag.setAttribute('name', 'description');
        document.head.appendChild(descTag);
      }
      descTag.setAttribute('content', meta.description);

      // Enforce index/noindex directives per route
      const isPrivateRoute = currentRoute === '/admin' || currentRoute === '/quote';
      const robotsContent = isPrivateRoute
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
      let robotsTag = document.querySelector('meta[name="robots"]');
      if (!robotsTag) {
        robotsTag = document.createElement('meta');
        robotsTag.setAttribute('name', 'robots');
        document.head.appendChild(robotsTag);
      }
      robotsTag.setAttribute('content', robotsContent);

      // Update OpenGraph & Twitter tags (strictly keep og:title identical to <title>)
      const ogTitleValue = meta.title;
      const ogDescValue = meta.ogDescription || meta.description;
      const ogTypeValue = currentRoute === '/insights' ? 'article' : 'website';

      const ogType = document.querySelector('meta[property="og:type"]');
      if (ogType) ogType.setAttribute('content', ogTypeValue);
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', ogTitleValue);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', ogDescValue);
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);
      const ogImgAlt = document.querySelector('meta[property="og:image:alt"]');
      if (ogImgAlt) ogImgAlt.setAttribute('content', ogTitleValue);

      const twTitle = document.querySelector('meta[name="twitter:title"]');
      if (twTitle) twTitle.setAttribute('content', ogTitleValue);
      const twDesc = document.querySelector('meta[name="twitter:description"]');
      if (twDesc) twDesc.setAttribute('content', ogDescValue);
      const twImgAlt = document.querySelector('meta[name="twitter:image:alt"]');
      if (twImgAlt) twImgAlt.setAttribute('content', ogTitleValue);

      // Inject / update Schema.org structured data (JSON-LD) with automatic BreadcrumbList for sub-routes
      if (meta.structuredData) {
        let finalSchema: Record<string, unknown> = meta.structuredData;
        if (currentRoute !== '/' && currentRoute !== '/admin') {
          const segments = currentRoute.split('/').filter(Boolean);
          const breadcrumbItems = [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://akyin.com/',
            },
            ...segments.map((seg, idx) => {
              const segPath = `/${segments.slice(0, idx + 1).join('/')}`;
              const label =
                segPath === '/marketing'
                  ? 'AKYIN Marketing'
                  : segPath === '/ventures'
                    ? 'Our Ventures'
                    : meta.title.split('—')[0].split('|')[0].trim();
              return {
                '@type': 'ListItem',
                position: idx + 2,
                name: idx === segments.length - 1 ? meta.title.split('—')[0].split('|')[0].trim() : label,
                item: `https://akyin.com${segPath === '/marketing' ? '/ventures/marketing' : segPath}`,
              };
            }),
          ];
          const breadcrumbNode = {
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbItems,
          };
          if (Array.isArray((meta.structuredData as { '@graph'?: unknown[] })['@graph'])) {
            finalSchema = {
              '@context': 'https://schema.org',
              '@graph': [
                ...((meta.structuredData as { '@graph': unknown[] })['@graph'] || []),
                breadcrumbNode,
              ],
            };
          } else {
            const { ['@context']: _ctx, ...primaryNode } = meta.structuredData as Record<
              string,
              unknown
            >;
            finalSchema = {
              '@context': 'https://schema.org',
              '@graph': [primaryNode, breadcrumbNode],
            };
          }
        }

        let scriptTag = document.getElementById('akyin-schema-jsonld') as HTMLScriptElement | null;
        if (!scriptTag) {
          scriptTag = document.createElement('script');
          scriptTag.id = 'akyin-schema-jsonld';
          scriptTag.type = 'application/ld+json';
          document.head.appendChild(scriptTag);
        }
        scriptTag.textContent = JSON.stringify(finalSchema);
      }
    }
  }, [currentRoute, routeMetaMap]);

  const navigate = useCallback(
    (route: AppRoute) => {
      const [rawPath, hashPart] = route.split('#');
      const parsed = parseRoute(rawPath || '/');
      const cleanHash = hashPart ? hashPart.trim() : null;
      const fullTarget = cleanHash ? `${parsed}#${cleanHash}` : parsed;

      if (
        typeof window !== 'undefined' &&
        (window.location.pathname !== parsed ||
          (cleanHash && window.location.hash !== `#${cleanHash}`) ||
          (!cleanHash && window.location.hash))
      ) {
        window.history.pushState({}, '', fullTarget);
      }

      if (parsed === currentRoute) {
        scheduleHashScroll(cleanHash);
        return;
      }

      pendingHashRef.current = cleanHash;
      startRouteTransition(() => {
        setCurrentRoute(parsed);
      });
    },
    [currentRoute, scheduleHashScroll]
  );

  useEffect(() => {
    scheduleHashScroll(pendingHashRef.current);
  }, [currentRoute, scheduleHashScroll]);

  useEffect(() => {
    registerAkyinWebMcpTools(navigate);
  }, [navigate]);

  const navigateEcosystem = useCallback(() => {
    navigate('/#our-ecosystem' as AppRoute);
  }, [navigate]);

  const handleStartEnquiry = useCallback(
    (options: { category: string; vertical: string; enquiryType?: string }) => {
      setContactDefaults({
        category: options.category,
        vertical: options.vertical,
        enquiryType: options.enquiryType || ENQUIRY_TYPE_OPTIONS[0],
      });
      navigate('/contact');
    },
    [navigate]
  );

  const memoizedPageContent = useMemo(() => {
    if (currentRoute === '/admin') {
      return <AdminPage onNavigate={navigate} />;
    }

    if (currentRoute.startsWith('/services/')) {
      const slug = currentRoute.slice('/services/'.length);
      return <ServiceDetailPage slug={slug} onNavigate={navigate} />;
    }

    switch (currentRoute) {
      case '/':
        return <HomePage onNavigate={navigate} onStartEnquiry={handleStartEnquiry} />;
      case '/about':
        return <AboutPage onNavigate={navigate} />;
      case '/ventures':
        return (
          <BusinessesPage onNavigate={navigate} onStartEnquiry={handleStartEnquiry} />
        );
      case '/ventures/publishing':
        return <PublishingPage onNavigate={navigate} />;
      case '/ventures/marketing':
        return <MarketingPage onNavigate={navigate} />;
      case '/marketing/automotive':
        return <AutomotiveMarketingPage onNavigate={navigate} />;
      case '/ventures/store':
        return <StorePage />;
      case '/ventures/aicalc':
        return <AICalcPage />;
      case '/ventures/kartigo':
        return <KartigoPage />;
      case '/ventures/biznxt':
        return <BizNXTPage onNavigate={navigate} />;
      case '/ventures/budget-bazaar':
        return <BudgetBazaarPage />;
      case '/pricing':
        return <PricingPage onNavigate={navigate} onStartEnquiry={handleStartEnquiry} />;
      case '/tools':
        return <ToolsPage onNavigate={navigate} />;
      case '/quote':
        return <QuotePortalPage onNavigate={navigate} />;
      case '/advisory':
        return <AdvisoryPage onNavigate={navigate} />;
      case '/insights':
        return <InsightsPage onNavigate={navigate} />;
      case '/terms':
        return <TermsPage onNavigate={navigate} section="terms" />;
      case '/privacy':
        return <TermsPage onNavigate={navigate} section="privacy" />;
      case '/contact':
        return (
          <ContactPage
            defaultCategory={contactDefaults.category}
            defaultVertical={contactDefaults.vertical}
            defaultEnquiryType={contactDefaults.enquiryType}
            onNavigate={navigate}
          />
        );
      case '/sitemap':
        return <SitemapPage onNavigate={navigate} />;
      default:
        return <HomePage onNavigate={navigate} onStartEnquiry={handleStartEnquiry} />;
    }
  }, [currentRoute, contactDefaults, navigate, handleStartEnquiry]);

  const handleReturnHome = useCallback(() => navigate('/'), [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7] text-[#1D1D1F]">
      <ReadingProgressBar />

      {isRoutePending && (
        <div
          role="progressbar"
          aria-label="Loading next page"
          aria-busy="true"
          className="fixed top-0 left-0 right-0 h-0.5 z-[80] bg-[#0071E3] animate-pulse"
        />
      )}

      <Navbar
        currentRoute={currentRoute}
        onNavigate={navigate}
        onNavigateEcosystem={navigateEcosystem}
      />

      <main ref={mainRef} className="flex-1">
        <motion.div
          key={currentRoute}
          initial={shouldReduceMotion ? false : { opacity: 0.94 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
        >
          <BreadcrumbBar
            currentRoute={currentRoute}
            onNavigate={navigate}
            onCopyLink={handleCopyLink}
            copied={copyToastVisible}
          />
          <PageErrorBoundary resetKey={currentRoute} onReturnHome={handleReturnHome}>
            <Suspense fallback={<GlobalLoadingSkeleton />}>
              {memoizedPageContent}
            </Suspense>
          </PageErrorBoundary>
        </motion.div>
      </main>

      <Footer
        onNavigate={navigate}
        onStartEnquiry={handleStartEnquiry}
        onCopyLink={handleCopyLink}
        copied={copyToastVisible}
      />

      <FloatingContactWidget currentRoute={currentRoute} onNavigate={navigate} />

      <CopyToast visible={copyToastVisible} copiedUrl={copiedUrl} />
    </div>
  );
}

export default function App() {
  return (
    <SiteConfigProvider>
      <RouteMetaProvider defaultRouteMeta={ROUTE_META}>
        <AppShell />
      </RouteMetaProvider>
    </SiteConfigProvider>
  );
}
