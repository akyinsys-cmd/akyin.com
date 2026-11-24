import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
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
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';
import { AdvisoryPage } from './pages/AdvisoryPage';
import { AICalcPage } from './pages/AICalcPage';
import { BizNXTPage } from './pages/BizNXTPage';
import { BudgetBazaarPage } from './pages/BudgetBazaarPage';
import { BusinessesPage } from './pages/BusinessesPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { InsightsPage } from './pages/InsightsPage';
import { KartigoPage } from './pages/KartigoPage';
import { MarketingPage } from './pages/MarketingPage';
import { AutomotiveMarketingPage } from './pages/AutomotiveMarketingPage';
import { PricingPage } from './pages/PricingPage';
import { PublishingPage } from './pages/PublishingPage';
import { SitemapPage } from './pages/SitemapPage';
import { StorePage } from './pages/StorePage';
import { TermsPage } from './pages/TermsPage';
import { SiteConfigProvider } from './context/SiteConfigContext';
import { registerAkyinWebMcpTools } from './utils/webmcp';

const VALID_ROUTES: AppRoute[] = [
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

const ROUTE_META: Record<AppRoute, RouteMetadata> = {
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
            'Multi-business parent group and full-service marketing agency overseeing seven operating verticals across publishing, performance marketing, fashion retail, AI utilities, B2B wholesale trade, and business consulting.',
          email: 'connect@akyin.com',
          telephone: '+91-6395694011',
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
            'https://kartigo.online',
            'https://biznxt.online',
            'https://budgetbazaar.org',
          ],
          contactPoint: [
            {
              '@type': 'ContactPoint',
              telephone: '+91-6395694011',
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
          telephone: '+91-6395694011',
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
          name: 'AKYIN Full-Service Growth Marketing & Automotive Retainer',
          provider: { '@id': 'https://akyin.com/#organization' },
          serviceType: 'Performance Marketing & Lead Qualification',
          areaServed: ['IN', 'AE', 'US', 'GB'],
          offers: [
            {
              '@type': 'Offer',
              name: 'Package A — Complete Marketing Growth & Lead Qualification',
              price: '49999',
              priceCurrency: 'INR',
              url: 'https://akyin.com/pricing',
            },
            {
              '@type': 'Offer',
              name: 'Package B — Lead Filtering & Qualification Only',
              price: '19999',
              priceCurrency: 'INR',
              url: 'https://akyin.com/pricing',
            },
            {
              '@type': 'Offer',
              name: 'Commercial & Dealership Sales Training Workshop',
              price: '25000',
              priceCurrency: 'INR',
              url: 'https://akyin.com/pricing',
            },
            {
              '@type': 'Offer',
              name: '1-on-1 Business Advisory Consultation (30 min IST)',
              price: '1999',
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
                text: 'AKYIN Ventures operates seven verticals: AKYIN Publishing, AKYIN MARKETINGS (Agency), AKYIN Store / AKYIN Thrift, AICalc.in, Kartigo.online, BizNXT.online, and Budget Bazaar.',
              },
            },
            {
              '@type': 'Question',
              name: 'How much do AKYIN Marketing retainers and advisory sessions cost?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Package A is ₹39,999 one-time setup plus ₹49,999/month, Package B (Lead Qualification Only) is ₹14,999 setup plus ₹19,999/month, Sales Training is ₹25,000/session, and 1-on-1 Business Advisory is ₹1,999 per 30-minute IST session.',
              },
            },
            {
              '@type': 'Question',
              name: 'What are AKYIN Marketing Agency service timelines and deliverables?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Campaign onboarding and architecture launch within 7 to 14 business days after setup. Deliverables cover Meta and Google ad setup, independent lead filtering and qualification, CRM pipeline tracking, creative assets, and optional sales team training, with media spend paid directly to ad platforms.',
              },
            },
          ],
        },
      ],
    },
  },
  '/about': {
    title: 'About AKYIN Ventures — One Vision. Multiple Business Ventures.',
    description:
      'Corporate profile of AKYIN Ventures and its operating divisions across full-service marketing agency services, publishing, fashion retail, digital utilities, and B2B commerce.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About AKYIN Ventures',
      url: 'https://akyin.com/about',
      description:
        'Corporate profile of AKYIN Ventures and its operating divisions across full-service marketing agency services, publishing, fashion retail, digital utilities, and B2B commerce.',
      mainEntity: {
        '@type': 'Corporation',
        name: 'AKYIN Ventures',
        url: 'https://akyin.com',
      },
    },
  },
  '/ventures': {
    title: 'Our Businesses — AKYIN Ventures Portfolio',
    description:
      'Explore Akyin Publishing, Akyin Marketing Agency, Akyin Store (AKYIN THRIFT), AICalc.in, Kartigo.online, BizNXT.online, and Budget Bazaar.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Our Businesses — AKYIN Ventures Portfolio',
      url: 'https://akyin.com/ventures',
      description: 'Explore the seven independent business initiatives under AKYIN Ventures.',
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
    title: 'AKYIN Publishing — Ideas That Inspire. Knowledge That Empowers. | akyin.com',
    description:
      'Explore eight books on Amazon and three digital guides & productivity tools published by AKYIN.',
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
    title: 'AKYIN MARKETINGS — Full-Service Marketing Agency & Growth Solutions',
    description:
      'Full-service digital marketing agency delivering Meta lead generation, brand campaigns, AI-assisted lead qualification, and commercial sales training across retail, B2B, services, and automotive.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'AKYIN Marketing Agency',
      alternateName: 'AKYIN MARKETINGS',
      url: 'https://akyin.com/ventures/marketing',
      parentOrganization: { '@type': 'Corporation', name: 'AKYIN Ventures' },
      description:
        'Full-service digital marketing agency delivering Meta lead generation, brand campaigns, AI-assisted lead qualification, and commercial sales training across retail, B2B, services, and automotive.',
      priceRange: '$$',
      areaServed: ['IN', 'AE', 'US', 'GB'],
      telephone: '+91-6395694011',
      email: 'connect@akyin.com',
    },
  },
  '/marketing/automotive': {
    title: 'Car Dealership Marketing & Test-Drive Leads | AKYIN',
    description:
      'Book qualified showroom test drives, not cold clicks. Targeted Meta & Google auto ads, lead vetting, and floor sales coaching. Get a quote.',
    ogTitle: 'More Showroom Test Drives. Zero Cold Leads. | AKYIN',
    ogDescription:
      'High-intent Meta & Google auto ads, automated lead vetting, and dealer sales coaching built to fill your showroom floor faster.',
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
            'Book qualified showroom test drives, not cold clicks. Targeted Meta & Google auto ads, lead vetting, and floor sales coaching. Get a quote.',
          priceRange: '$$',
          areaServed: ['IN', 'AE', 'US', 'GB'],
          telephone: '+91-6395694011',
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
      ],
    },
  },
  '/ventures/store': {
    title: 'AKYIN STORE · AKYIN THRIFT — Affordable Fashion. Exceptional Discounts.',
    description:
      'Discover curated men’s and women’s fashion and clothing at exceptional discounted prices through AKYIN THRIFT under AKYIN STORE.',
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
    title: 'AICalc.in — Smart Calculations. Powered by AI. | AKYIN Ventures',
    description:
      'AICalc combines natural-language AI calculation queries with traditional manual calculator tools at aicalc.in.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'AICalc.in',
      url: 'https://aicalc.in',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      description:
        'AICalc combines natural-language AI calculation queries with traditional manual calculator tools at aicalc.in.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
  },
  '/ventures/kartigo': {
    title: 'Kartigo.online — B2B Stock Supply & Commerce | AKYIN Ventures',
    description:
      'Connecting businesses with wholesale and commercial stock supply opportunities on Kartigo.online.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WholesaleStore',
      name: 'Kartigo.online',
      url: 'https://kartigo.online',
      description:
        'B2B stock commerce and wholesale inventory supply platform connecting manufacturers, distributors, and retail buyers.',
    },
  },
  '/ventures/biznxt': {
    title: 'BizNXT.online — Business Guidance & Consulting | AKYIN Ventures',
    description:
      'Business clarity, consulting, and opportunity exploration for entrepreneurs at biznxt.online.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ConsultingService',
      name: 'BizNXT.online',
      url: 'https://biznxt.online',
      description:
        'Business guidance, feasibility analysis, and opportunity consulting for entrepreneurs and founders.',
    },
  },
  '/ventures/budget-bazaar': {
    title: 'Budget Bazaar — Affordable Retail & Everyday Goods | AKYIN Ventures',
    description:
      'Everyday household essentials and value-first consumer retail at budgetbazaar.org.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: 'Budget Bazaar',
      url: 'https://budgetbazaar.org',
      description:
        'Value-oriented retail storefront bringing affordable household goods and everyday essentials directly to shoppers.',
    },
  },
  '/pricing': {
    title: 'Pricing & Rate Card — AKYIN Ventures & Marketing Agency',
    description:
      'Transparent INR pricing for AKYIN Marketing Agency packages, lead filtering retainers, dealership sales training, and 1-on-1 business advisory.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Pricing & Rate Card — AKYIN Ventures',
      url: 'https://akyin.com/pricing',
      mainEntity: {
        '@type': 'OfferCatalog',
        name: 'AKYIN Ventures Commercial Rate Card',
        itemListElement: [
          {
            '@type': 'Offer',
            name: 'Package A — Complete Marketing Growth & Lead Qualification',
            price: '49999',
            priceCurrency: 'INR',
          },
          {
            '@type': 'Offer',
            name: 'Package B — Lead Filtering & Qualification Only',
            price: '19999',
            priceCurrency: 'INR',
          },
          {
            '@type': 'Offer',
            name: 'Commercial & Dealership Sales Training',
            price: '25000',
            priceCurrency: 'INR',
          },
          {
            '@type': 'Offer',
            name: '1-on-1 Business Advisory (30 min IST)',
            price: '1999',
            priceCurrency: 'INR',
          },
        ],
      },
    },
  },
  '/advisory': {
    title: 'Business Advisory & Consultation Booking — AKYIN Ventures',
    description:
      'Your Business. Your Vision. A Clearer Direction. Schedule a 1-on-1 Business Advisory consultation with AKYIN Ventures.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'AKYIN Business Advisory & Consultation',
      url: 'https://akyin.com/advisory',
      provider: { '@type': 'Organization', name: 'AKYIN Ventures' },
      serviceType: 'Executive Business Advisory Session',
      description:
        '1-on-1 strategic consultation addressing business feasibility, sales conversion discipline, and venture execution on India Standard Time (Asia/Kolkata).',
      areaServed: 'Global',
      offers: {
        '@type': 'Offer',
        price: '1999',
        priceCurrency: 'INR',
      },
    },
  },
  '/insights': {
    title: 'Insights & Business Philosophy — AKYIN Ventures',
    description:
      'Operational perspectives across publishing, full-service agency marketing, automotive dealership growth trends, fashion retail, AI tools, and B2B commerce.',
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
    title: 'Terms of Service — AKYIN Ventures | akyin.com',
    description:
      'Terms of Service, direct ad platform billing rules, service scope separation, and governance policies for AKYIN Ventures.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Terms of Service — AKYIN Ventures',
      url: 'https://akyin.com/terms',
    },
  },
  '/privacy': {
    title: 'Privacy Policy — AKYIN Ventures | akyin.com',
    description:
      'Zero-broker data privacy, enquiry validation, and security standards across AKYIN Ventures.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Privacy Policy — AKYIN Ventures',
      url: 'https://akyin.com/privacy',
    },
  },
  '/contact': {
    title: 'Contact AKYIN Ventures — Let’s Start a Conversation',
    description:
      'Direct enquiry desk for AKYIN Ventures, AKYIN Publishing, AKYIN MARKETINGS Agency, AKYIN STORE, AICalc.in, Kartigo.online, BizNXT.online, and Budget Bazaar.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact AKYIN Ventures',
      url: 'https://akyin.com/contact',
      mainEntity: {
        '@type': 'Corporation',
        name: 'AKYIN Ventures',
        telephone: '+91-6395694011',
        email: 'connect@akyin.com',
      },
    },
  },
  '/sitemap': {
    title: 'Site Map & Directory — AKYIN Ventures | akyin.com',
    description:
      'Complete website directory of AKYIN Ventures corporate pages, operating verticals, key sections, and official external platforms.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ItemPage',
      name: 'Site Map & Directory — AKYIN Ventures',
      url: 'https://akyin.com/sitemap',
    },
  },
  '/admin': {
    title: 'AKYIN Ventures — Admin Management Console',
    description: 'Restricted operations and calendar administration console for AKYIN Ventures.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'AKYIN Ventures Admin Console',
      url: 'https://akyin.com/admin',
    },
  },
};

function parseRoute(pathname: string): AppRoute {
  const cleaned = pathname.replace(/\/+$/, '') || '/';
  if (VALID_ROUTES.includes(cleaned as AppRoute)) {
    return cleaned as AppRoute;
  }
  return '/';
}

function AppShell() {
  const shouldReduceMotion = useReducedMotion();
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() =>
    typeof window !== 'undefined' ? parseRoute(window.location.pathname) : '/'
  );
  const scrollTimerRef = useRef<number | null>(null);
  const copyToastTimerRef = useRef<number | null>(null);
  const [copyToastVisible, setCopyToastVisible] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState('');

  const [contactDefaults, setContactDefaults] = useState({
    category: ENQUIRY_CATEGORIES[0] as string,
    vertical: BUSINESS_VERTICAL_OPTIONS[0] as string,
    enquiryType: ENQUIRY_TYPE_OPTIONS[0] as string,
  });

  const scrollToEcosystem = useCallback(() => {
    if (scrollTimerRef.current !== null) {
      window.clearTimeout(scrollTimerRef.current);
    }
    scrollTimerRef.current = window.setTimeout(() => {
      const el = document.getElementById('our-ecosystem');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      scrollTimerRef.current = null;
    }, 80);
  }, []);

  useEffect(() => {
    if (
      parseRoute(window.location.pathname) === '/' &&
      window.location.hash === '#our-ecosystem'
    ) {
      scrollToEcosystem();
    }

    const handlePopState = () => {
      const nextRoute = parseRoute(window.location.pathname);
      setCurrentRoute(nextRoute);
      if (nextRoute === '/' && window.location.hash === '#our-ecosystem') {
        scrollToEcosystem();
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (scrollTimerRef.current !== null) {
        window.clearTimeout(scrollTimerRef.current);
      }
      if (copyToastTimerRef.current !== null) {
        window.clearTimeout(copyToastTimerRef.current);
      }
    };
  }, [scrollToEcosystem]);

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
    const meta = ROUTE_META[currentRoute];
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

      // Update OpenGraph & Twitter tags
      const ogTitleValue = meta.ogTitle || meta.title;
      const ogDescValue = meta.ogDescription || meta.description;

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', ogTitleValue);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', ogDescValue);
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);

      const twTitle = document.querySelector('meta[name="twitter:title"]');
      if (twTitle) twTitle.setAttribute('content', ogTitleValue);
      const twDesc = document.querySelector('meta[name="twitter:description"]');
      if (twDesc) twDesc.setAttribute('content', ogDescValue);

      // Inject / update Schema.org structured data (JSON-LD)
      if (meta.structuredData) {
        let scriptTag = document.getElementById('akyin-schema-jsonld') as HTMLScriptElement | null;
        if (!scriptTag) {
          scriptTag = document.createElement('script');
          scriptTag.id = 'akyin-schema-jsonld';
          scriptTag.type = 'application/ld+json';
          document.head.appendChild(scriptTag);
        }
        scriptTag.textContent = JSON.stringify(meta.structuredData);
      }
    }
  }, [currentRoute]);

  const navigate = useCallback((route: AppRoute) => {
    setCurrentRoute(route);
    if (window.location.pathname !== route || window.location.hash) {
      window.history.pushState({}, '', route);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    registerAkyinWebMcpTools(navigate);
  }, [navigate]);

  const navigateEcosystem = useCallback(() => {
    setCurrentRoute('/');
    if (window.location.pathname !== '/' || window.location.hash !== '#our-ecosystem') {
      window.history.pushState({}, '', '/#our-ecosystem');
    }
    scrollToEcosystem();
  }, [scrollToEcosystem]);

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

  if (currentRoute === '/admin') {
    return <AdminPage onNavigate={navigate} />;
  }

  const renderPage = () => {
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
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7] text-[#1D1D1F]">
      <ReadingProgressBar />

      <Navbar
        currentRoute={currentRoute}
        onNavigate={navigate}
        onNavigateEcosystem={navigateEcosystem}
      />

      <main className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentRoute}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <BreadcrumbBar
              currentRoute={currentRoute}
              onNavigate={navigate}
              onCopyLink={handleCopyLink}
              copied={copyToastVisible}
            />
            {renderPage()}
          </motion.div>
        </AnimatePresence>
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
      <AppShell />
    </SiteConfigProvider>
  );
}
