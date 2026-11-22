import { useCallback, useEffect, useState } from 'react';
import {
  AppRoute,
  BUSINESS_VERTICAL_OPTIONS,
  ENQUIRY_CATEGORIES,
  ENQUIRY_TYPE_OPTIONS,
} from './data/akyinData';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { AboutPage } from './pages/AboutPage';
import { AICalcPage } from './pages/AICalcPage';
import { BizNXTPage } from './pages/BizNXTPage';
import { BudgetBazaarPage } from './pages/BudgetBazaarPage';
import { BusinessesPage } from './pages/BusinessesPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { InsightsPage } from './pages/InsightsPage';
import { KartigoPage } from './pages/KartigoPage';
import { MarketingPage } from './pages/MarketingPage';
import { PublishingPage } from './pages/PublishingPage';
import { SitemapPage } from './pages/SitemapPage';
import { StorePage } from './pages/StorePage';

const VALID_ROUTES: AppRoute[] = [
  '/',
  '/about',
  '/ventures',
  '/ventures/publishing',
  '/ventures/marketing',
  '/ventures/store',
  '/ventures/aicalc',
  '/ventures/kartigo',
  '/ventures/biznxt',
  '/ventures/budget-bazaar',
  '/insights',
  '/contact',
  '/sitemap',
];

const ROUTE_META: Record<AppRoute, { title: string; description: string }> = {
  '/': {
    title: 'AKYIN Ventures — Building Ideas Into Businesses | akyin.com',
    description:
      'AKYIN Ventures brings together diverse business initiatives across publishing, marketing, digital technology, fashion retail and B2B commerce.',
  },
  '/about': {
    title: 'About AKYIN Ventures — One Vision. Multiple Business Ventures.',
    description:
      'Corporate profile of AKYIN Ventures and its operating divisions across publishing, dealership marketing, fashion retail, digital utilities, and B2B commerce.',
  },
  '/ventures': {
    title: 'Our Businesses — AKYIN Ventures Portfolio',
    description:
      'Explore Akyin Publishing, Akyin Marketing, Akyin Store (AKYIN THRIFT), AICalc.in, and Kartigo.online.',
  },
  '/ventures/publishing': {
    title: 'AKYIN Publishing — Ideas Worth Reading | akyin.com',
    description:
      'Independent book and digital publishing by AKYIN Publishing. Featuring THE DISCIPLINE CODE on Google Play Books and our Amazon Author Store.',
  },
  '/ventures/marketing': {
    title: 'AKYIN MARKETINGS — Automotive Dealership Marketing & Sales Training',
    description:
      'Automotive dealership lead generation, managed AI-assisted lead qualification, and showroom sales training backed by 16 years of automotive industry experience.',
  },
  '/ventures/store': {
    title: 'AKYIN STORE · AKYIN THRIFT — Affordable Fashion. Exceptional Discounts.',
    description:
      'Discover curated men’s and women’s fashion and clothing at exceptional discounted prices through AKYIN THRIFT under AKYIN STORE.',
  },
  '/ventures/aicalc': {
    title: 'AICalc.in — Smart Calculations. Powered by AI. | AKYIN Ventures',
    description:
      'AICalc combines natural-language AI calculation queries with traditional manual calculator tools at aicalc.in.',
  },
  '/ventures/kartigo': {
    title: 'Kartigo.online — B2B Stock Supply & Commerce | AKYIN Ventures',
    description:
      'Connecting businesses with wholesale and commercial stock supply opportunities on Kartigo.online.',
  },
  '/ventures/biznxt': {
    title: 'BizNXT.online — Business Guidance & Consulting | AKYIN Ventures',
    description:
      'Business clarity, consulting, and opportunity exploration for entrepreneurs at biznxt.online.',
  },
  '/ventures/budget-bazaar': {
    title: 'Budget Bazaar — Affordable Retail & Everyday Goods | AKYIN Ventures',
    description:
      'Everyday household essentials and value-first consumer retail at budgetbazaar.org.',
  },
  '/insights': {
    title: 'Insights & Business Philosophy — AKYIN Ventures',
    description:
      'Operational perspectives across publishing, automotive marketing, discounted fashion retail, AI tools, and B2B commerce.',
  },
  '/contact': {
    title: 'Contact AKYIN Ventures — Let’s Start a Conversation',
    description:
      'Direct enquiry desk for AKYIN Ventures, AKYIN Publishing, AKYIN MARKETINGS, AKYIN STORE, AICalc.in, and Kartigo.online.',
  },
  '/sitemap': {
    title: 'Site Map & Directory — AKYIN Ventures | akyin.com',
    description:
      'Complete website directory of AKYIN Ventures corporate pages, five operating verticals, key sections, and official external platforms.',
  },
};

function parseRoute(pathname: string): AppRoute {
  const cleaned = pathname.replace(/\/+$/, '') || '/';
  if (VALID_ROUTES.includes(cleaned as AppRoute)) {
    return cleaned as AppRoute;
  }
  return '/';
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() =>
    typeof window !== 'undefined' ? parseRoute(window.location.pathname) : '/'
  );

  const [contactDefaults, setContactDefaults] = useState({
    category: ENQUIRY_CATEGORIES[0] as string,
    vertical: BUSINESS_VERTICAL_OPTIONS[0] as string,
    enquiryType: ENQUIRY_TYPE_OPTIONS[0] as string,
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(parseRoute(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const meta = ROUTE_META[currentRoute];
    document.title = meta.title;
    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) {
      descTag.setAttribute('content', meta.description);
    }
  }, [currentRoute]);

  const navigate = useCallback((route: AppRoute) => {
    setCurrentRoute(route);
    if (window.location.pathname !== route) {
      window.history.pushState({}, '', route);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateEcosystem = useCallback(() => {
    setCurrentRoute('/');
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    window.setTimeout(() => {
      const el = document.getElementById('our-ecosystem');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  }, []);

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
      case '/ventures/store':
        return <StorePage />;
      case '/ventures/aicalc':
        return <AICalcPage />;
      case '/ventures/kartigo':
        return <KartigoPage />;
      case '/ventures/biznxt':
        return <BizNXTPage />;
      case '/ventures/budget-bazaar':
        return <BudgetBazaarPage />;
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
    <div className="min-h-screen flex flex-col bg-[#F7F5F0] text-[#292722]">
      <Navbar
        currentRoute={currentRoute}
        onNavigate={navigate}
        onNavigateEcosystem={navigateEcosystem}
      />

      <main className="flex-1">{renderPage()}</main>

      <Footer onNavigate={navigate} onStartEnquiry={handleStartEnquiry} />
    </div>
  );
}
