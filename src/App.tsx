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
import { PublishingPage } from './pages/PublishingPage';
import { SitemapPage } from './pages/SitemapPage';
import { StorePage } from './pages/StorePage';
import { SiteConfigProvider } from './context/SiteConfigContext';

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
  '/advisory',
  '/insights',
  '/contact',
  '/sitemap',
  '/admin',
];

export interface RouteMetadata {
  title: string;
  description: string;
  structuredData: Record<string, unknown>;
}

const ROUTE_META: Record<AppRoute, RouteMetadata> = {
  '/': {
    title: 'AKYIN Ventures — Multi-Business Group & Full-Service Marketing Agency | akyin.com',
    description:
      'AKYIN Ventures is a multi-business parent group operating across full-service marketing agency solutions, publishing, AI tools, fashion retail, B2B stock commerce, value retail, and business consulting.',
    structuredData: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Corporation',
          '@id': 'https://akyin.com/#corporation',
          name: 'AKYIN Ventures',
          alternateName: 'AKYIN',
          url: 'https://akyin.com',
          logo: 'https://akyin.com/assets/aistudio/akyin_logo_clean.png',
          description:
            'Multi-business parent group and full-service marketing agency overseeing seven operating verticals across publishing, performance marketing, fashion retail, AI utilities, B2B wholesale trade, and business consulting.',
          email: 'connect@akyin.com',
          telephone: '+91-6305694011',
          sameAs: [
            'https://www.instagram.com/akyinmarketing/',
            'https://www.facebook.com/akyinmarketing/',
            'https://x.com/akyinmarketing',
            'https://www.youtube.com/@akyinmarketing',
          ],
          contactPoint: [
            {
              '@type': 'ContactPoint',
              telephone: '+91-6305694011',
              contactType: 'customer service',
              email: 'connect@akyin.com',
              availableLanguage: ['English', 'Hindi', 'Telugu'],
            },
          ],
          department: [
            {
              '@type': 'Organization',
              name: 'AKYIN Publishing',
              url: 'https://akyin.com/ventures/publishing',
            },
            {
              '@type': 'ProfessionalService',
              name: 'AKYIN Marketing Agency',
              url: 'https://akyin.com/ventures/marketing',
            },
            {
              '@type': 'ClothingStore',
              name: 'AKYIN Store / AKYIN THRIFT',
              url: 'https://akyin.com/ventures/store',
            },
            {
              '@type': 'SoftwareApplication',
              name: 'AICalc.in',
              url: 'https://aicalc.in',
            },
            {
              '@type': 'WholesaleStore',
              name: 'Kartigo.online',
              url: 'https://kartigo.online',
            },
            {
              '@type': 'ConsultingService',
              name: 'BizNXT.online',
              url: 'https://biznxt.online',
            },
            {
              '@type': 'Store',
              name: 'Budget Bazaar',
              url: 'https://budgetbazaar.org',
            },
          ],
        },
        {
          '@type': 'WebSite',
          '@id': 'https://akyin.com/#website',
          url: 'https://akyin.com',
          name: 'AKYIN Ventures',
          publisher: { '@id': 'https://akyin.com/#corporation' },
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
    title: 'AKYIN Publishing — Ideas Worth Reading | akyin.com',
    description:
      'Independent book and digital publishing by AKYIN Publishing. Featuring THE DISCIPLINE CODE on Google Play Books and our Amazon Author Store.',
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
          name: 'THE DISCIPLINE CODE',
          author: { '@type': 'Person', name: 'Akyin S.' },
          publisher: { '@type': 'Organization', name: 'AKYIN Publishing' },
          'inLanguage': 'en',
          bookFormat: 'https://schema.org/EBook',
          url: 'https://play.google.com/store/books/details/Akyin_s_THE_DISCIPLINE_CODE?id=seHuEQAAQBAJ',
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
      telephone: '+91-6305694011',
      email: 'connect@akyin.com',
    },
  },
  '/marketing/automotive': {
    title: 'AKYIN Marketing — Automotive Marketing & Dealership Growth | akyin.com',
    description:
      'From customer enquiries to showroom performance, AKYIN helps automotive dealerships improve visibility, organise leads and strengthen their sales teams.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'AKYIN Marketing — Automotive Division',
      url: 'https://akyin.com/marketing/automotive',
      parentOrganization: { '@type': 'Corporation', name: 'AKYIN Ventures' },
      description:
        'Specialised automotive marketing and dealership growth solutions covering lead generation, lead qualification, test drive campaigns, and sales training.',
      priceRange: '$$',
      areaServed: ['IN', 'AE', 'US', 'GB'],
      telephone: '+91-6305694011',
      email: 'connect@akyin.com',
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
  '/advisory': {
    title: 'Business Advisory & Consultation Booking — AKYIN Ventures',
    description:
      'Your Business. Your Vision. A Clearer Direction. Schedule a 1-on-1 Business Advisory consultation with AKYIN Ventures.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'AKYIN Business Advisory & Consultation',
      url: 'https://akyin.com/advisory',
      provider: { '@type': 'Corporation', name: 'AKYIN Ventures' },
      serviceType: 'Executive Business Advisory Session',
      description:
        '1-on-1 strategic consultation addressing business feasibility, sales conversion discipline, and venture execution on India Standard Time (Asia/Kolkata).',
      areaServed: 'Global',
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
        telephone: '+91-6305694011',
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

      const descTag = document.querySelector('meta[name="description"]');
      if (descTag) {
        descTag.setAttribute('content', meta.description);
      }

      // Update OpenGraph & Twitter tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', meta.title);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', meta.description);
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl && typeof window !== 'undefined') {
        ogUrl.setAttribute('content', `${window.location.origin}${currentRoute}`);
      }

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
        return <PublishingPage />;
      case '/ventures/marketing':
        return <MarketingPage />;
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
      case '/advisory':
        return <AdvisoryPage onNavigate={navigate} />;
      case '/insights':
        return <InsightsPage onNavigate={navigate} />;
      case '/contact':
        return (
          <ContactPage
            defaultCategory={contactDefaults.category}
            defaultVertical={contactDefaults.vertical}
            defaultEnquiryType={contactDefaults.enquiryType}
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
