import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, Menu, Search, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  AppRoute,
  OFFICIAL_CONTACT,
  SERVICE_MARKETPLACE_CATEGORIES,
  VENTURES_PORTFOLIO,
} from '../data/akyinData';
import { ServiceCategoryRecord, SuiteServiceItem, suiteApi } from '../services/suiteApi';
import { useSiteConfig } from '../context/SiteConfigContext';
import { isSafeImageSrc } from '../utils/security';
import {
  generateServiceSearchIndex,
  HighlightText,
  ServiceSearchItem,
} from '../utils/serviceSearchIndex';
import { useSearch } from '../hooks/useSearch';
import { AkyinLogo } from './AkyinLogo';
import { HeaderSearch } from './HeaderSearch';
import {
  GlassButton,
  GlassDropdown,
  GlassNavigation,
  LiquidGlassHeader,
} from './liquid-glass';
import { SocialLinks } from './SocialLinks';

interface NavbarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  onNavigateEcosystem: () => void;
}

const VENTURES_DROPDOWN_LABELS: Record<string, string> = {
  publishing: 'AKYIN Publishing',
  marketing: 'AKYIN Marketing',
  store: 'AKYIN Store',
};

const FALLBACK_MENU_SERVICES: Array<{ slug: string; name: string; category: string }> = [
  { slug: 'automotive-marketing', name: 'Automotive Dealership Marketing & Sales Strategy', category: 'Automotive Marketing' },
  { slug: 'test-drive-lead-generation', name: 'Test-Drive Lead Generation', category: 'Automotive Marketing' },
  { slug: 'lead-generation', name: 'Online Lead Generation Campaigns', category: 'Digital Marketing' },
  { slug: 'meta-ads-management', name: 'Meta Ads Management', category: 'Digital Marketing' },
  { slug: 'google-ads-management', name: 'Google Ads Management', category: 'Digital Marketing' },
  { slug: 'social-media-management', name: 'Instagram & Facebook Management', category: 'Social Media Management' },
  { slug: 'logo-design', name: 'Logo Design', category: 'Creative and Graphic Design' },
  { slug: 'youtube-thumbnail-design', name: 'YouTube & Social Media Thumbnail Design', category: 'Creative and Graphic Design' },
  { slug: 'script-writing', name: 'Script Writing', category: 'Video and Content Services' },
  { slug: 'presentation-design', name: 'PowerPoint Presentation Design', category: 'Business Documents and Presentations' },
  { slug: 'excel-reporting', name: 'Excel Reports & Automation', category: 'Excel and Reporting Services' },
  { slug: 'bulk-sms', name: 'Bulk SMS Marketing', category: 'Messaging and Communication' },
  { slug: 'whatsapp-business-setup', name: 'WhatsApp Business Messaging Setup', category: 'Messaging and Communication' },
  { slug: 'lead-filtering', name: 'Lead Filtering & Qualification', category: 'Lead Management and CRM' },
  { slug: 'business-advisory-session', name: '1-on-1 Business Advisory Session', category: 'Business Consulting and Training' },
  { slug: 'commercial-dealership-sales-training', name: 'Commercial & Dealership Sales Training', category: 'Business Consulting and Training' },
];

export function Navbar({
  currentRoute,
  onNavigate,
}: NavbarProps) {
  const { settings } = useSiteConfig();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const [catalogServices, setCatalogServices] = useState<SuiteServiceItem[]>([]);
  const [catalogCategories, setCatalogCategories] = useState<ServiceCategoryRecord[]>([]);

  // Client-side instant service search indexing & hooks
  const serviceSearchIndex = useMemo(
    () => generateServiceSearchIndex(catalogServices.length > 0 ? catalogServices : null),
    [catalogServices]
  );
  const navHeaderSearch = useSearch(serviceSearchIndex, { limit: 8 });
  const megaSearch = useSearch(serviceSearchIndex, { limit: 12 });
  const mobileSearch = useSearch(serviceSearchIndex, { limit: 8 });

  const [navDropdownOpen, setNavDropdownOpen] = useState(false);
  const [megaDropdownOpen, setMegaDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const servicesButtonRef = useRef<HTMLDivElement>(null);
  const megaMenuPanelRef = useRef<HTMLDivElement>(null);
  const megaSearchInputRef = useRef<HTMLInputElement>(null);
  const navSearchContainerRef = useRef<HTMLDivElement>(null);
  const navSearchInputRef = useRef<HTMLInputElement>(null);
  const megaSearchContainerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    let active = true;
    suiteApi
      .fetchPublicServices()
      .then((res) => {
        if (!active) return;
        setCatalogServices(res.services || []);
        setCatalogCategories(res.categoryRecords || []);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false);
      }
      if (navSearchContainerRef.current && !navSearchContainerRef.current.contains(target)) {
        setNavDropdownOpen(false);
      }
      if (megaSearchContainerRef.current && !megaSearchContainerRef.current.contains(target)) {
        setMegaDropdownOpen(false);
      }
      const insideServicesBtn = servicesButtonRef.current?.contains(target);
      const insideMegaPanel = megaMenuPanelRef.current?.contains(target);
      if (!insideServicesBtn && !insideMegaPanel) {
        setServicesMenuOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        setServicesMenuOpen(false);
        setMobileMenuOpen(false);
        setSearchOpen(false);
        setNavDropdownOpen(false);
        setMegaDropdownOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setDropdownOpen(false);
        setServicesMenuOpen(false);
        setMobileMenuOpen(false);
        setNavDropdownOpen(true);
        navSearchInputRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const navigateTo = (route: AppRoute) => {
    setDropdownOpen(false);
    setServicesMenuOpen(false);
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
    setNavDropdownOpen(false);
    setMegaDropdownOpen(false);
    navHeaderSearch.clearQuery();
    megaSearch.clearQuery();
    mobileSearch.clearQuery();
    onNavigate(route);
  };

  const navigateToQuote = (serviceName?: string) => {
    setDropdownOpen(false);
    setServicesMenuOpen(false);
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
    setNavDropdownOpen(false);
    setMegaDropdownOpen(false);
    onNavigate('/pricing');
    setTimeout(() => {
      const el = document.getElementById('quotation-builder');
      if (el) {
        el.scrollIntoView({
          behavior: shouldReduceMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      }
    }, 180);
  };

  const handleClientsClick = () => {
    setDropdownOpen(false);
    setServicesMenuOpen(false);
    setMobileMenuOpen(false);
    if (window.location.pathname !== '/') {
      onNavigate('/');
      setTimeout(() => {
        document.getElementById('our-clients')?.scrollIntoView({
          behavior: shouldReduceMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      }, 300);
    } else {
      document.getElementById('our-clients')?.scrollIntoView({
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  };

  const orderedCategories = useMemo(() => {
    if (catalogCategories.length > 0) {
      return catalogCategories
        .filter((c) => c.active)
        .slice()
        .sort((a, b) => (a.menuOrder ?? a.sortOrder) - (b.menuOrder ?? b.sortOrder))
        .map((c) => c.name);
    }
    return [...SERVICE_MARKETPLACE_CATEGORIES];
  }, [catalogCategories]);

  const menuServicesPool = useMemo(() => {
    if (catalogServices.length > 0) {
      return catalogServices
        .filter((s) => s.active && s.showInMenu !== false && Boolean(s.slug))
        .slice()
        .sort((a, b) => (a.menuOrder ?? a.sortOrder) - (b.menuOrder ?? b.sortOrder))
        .map((s) => ({
          slug: s.slug,
          name: s.name,
          category: s.category,
          description: s.description,
        }));
    }
    return FALLBACK_MENU_SERVICES.map((item) => ({ ...item, description: '' }));
  }, [catalogServices]);

  const servicesByCategory = useMemo(() => {
    const grouped: Record<string, Array<{ slug: string; name: string; category: string }>> = {};
    for (const cat of orderedCategories) {
      grouped[cat] = [];
    }
    for (const svc of menuServicesPool) {
      if (!grouped[svc.category]) grouped[svc.category] = [];
      grouped[svc.category].push(svc);
    }
    return grouped;
  }, [orderedCategories, menuServicesPool]);

  const searchResults = megaSearch.results;

  const isVentureActive =
    currentRoute === '/ventures' ||
    currentRoute === '/ventures/publishing' ||
    currentRoute === '/ventures/store';

  const isServicesActive =
    currentRoute === '/ventures/marketing' ||
    currentRoute === '/marketing/automotive' ||
    currentRoute === '/pricing' ||
    currentRoute.startsWith('/services/');

  const linkClass = (isActive: boolean) =>
    `relative px-2.5 xl:px-3 py-1.5 rounded-full text-[12px] xl:text-[13px] font-medium transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] ${
      isActive
        ? 'frosted-glass-pill text-[#1D1D1F] font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,1)] border border-white/95'
        : 'text-[#1D1D1F]/85 hover:text-[#1D1D1F] hover:bg-white/70'
    }`;

  return (
    <>
      <LiquidGlassHeader
        scrolled={scrolled}
        className="border-b border-[#E8E8ED]/90"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 lg:h-16 flex items-center justify-between gap-4">
          {/* Left: Original AKYIN Logo */}
          <a
            href="/"
            aria-label="AKYIN Ventures Home"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/');
            }}
            className="inline-flex items-center whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] rounded-xl px-1 py-0.5 transition-opacity hover:opacity-85"
          >
            {settings.logoUrl && isSafeImageSrc(settings.logoUrl) ? (
              <img
                src={settings.logoUrl}
                alt={settings.brandWordmark || 'AKYIN'}
                className="h-7 w-auto object-contain"
              />
            ) : (
              <AkyinLogo wordmark={settings.brandWordmark || 'AKYIN'} size="sm" />
            )}
          </a>

          {/* Center: Desktop Liquid Glass Navigation */}
          <GlassNavigation ariaLabel="Primary navigation" className="gap-0.5 xl:gap-1">
            <a
              href="/"
              aria-current={currentRoute === '/' ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/');
              }}
              className={linkClass(currentRoute === '/')}
            >
              Home
            </a>

            <a
              href="/about"
              aria-current={currentRoute === '/about' ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/about');
              }}
              className={linkClass(currentRoute === '/about')}
            >
              About AKYIN
            </a>

            {/* Our Ventures Dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => {
                setDropdownOpen(true);
                setServicesMenuOpen(false);
              }}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                type="button"
                aria-expanded={dropdownOpen}
                aria-haspopup="menu"
                onClick={() => {
                  setDropdownOpen((prev) => !prev);
                  setServicesMenuOpen(false);
                }}
                className={`inline-flex items-center gap-1 ${linkClass(isVentureActive)}`}
              >
                <span>Our Ventures</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              <GlassDropdown open={dropdownOpen} className="w-76">
                <div className="space-y-0.5">
                  {VENTURES_PORTFOLIO.map((venture) => {
                    const label = VENTURES_DROPDOWN_LABELS[venture.id] || venture.shortName;
                    return (
                      <div key={venture.id} className="space-y-0.5">
                        <a
                          role="menuitem"
                          href={venture.route}
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo(venture.route);
                          }}
                          className={`block px-3.5 py-2 rounded-xl transition-all ${
                            currentRoute === venture.route
                              ? 'frosted-glass text-[#1D1D1F] font-semibold shadow-xs'
                              : 'hover:bg-white/85 text-[#1D1D1F]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold">{label}</span>
                            <span
                              className={`font-mono-num text-[11px] ${
                                currentRoute === venture.route
                                  ? 'text-[#0071E3] font-bold'
                                  : 'text-[#6E6E73]'
                              }`}
                            >
                              {venture.code}
                            </span>
                          </div>
                          <p className="text-[11px] mt-0.5 truncate text-[#6E6E73]">
                            {venture.sector}
                          </p>
                        </a>
                      </div>
                    );
                  })}

                  <div className="pt-1.5 mt-1.5 border-t border-[#E8E8ED]">
                    <a
                      href="/ventures"
                      role="menuitem"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('/ventures');
                      }}
                      className="block px-3.5 py-2 rounded-xl text-xs font-semibold text-[#0071E3] hover:bg-white/90 transition-colors"
                    >
                      All Ventures Overview →
                    </a>
                  </div>
                </div>
              </GlassDropdown>
            </div>

            <a
              href="/#our-clients"
              onClick={(e) => {
                e.preventDefault();
                handleClientsClick();
              }}
              className={linkClass(false)}
            >
              Our Clients
            </a>

            {/* Services Searchable 10-Category Mega-Menu Trigger */}
            <div
              ref={servicesButtonRef}
              className="relative"
              onMouseEnter={() => {
                setServicesMenuOpen(true);
                setDropdownOpen(false);
              }}
            >
              <button
                type="button"
                aria-expanded={servicesMenuOpen}
                aria-haspopup="menu"
                onClick={() => {
                  setServicesMenuOpen((prev) => {
                    const next = !prev;
                    if (next) {
                      setTimeout(() => megaSearchInputRef.current?.focus(), 40);
                    }
                    return next;
                  });
                  setDropdownOpen(false);
                }}
                className={`inline-flex items-center gap-1 ${linkClass(isServicesActive)}`}
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    servicesMenuOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
            </div>

            <a
              href="/tools"
              aria-current={currentRoute === '/tools' ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/tools');
              }}
              className={linkClass(currentRoute === '/tools')}
            >
              Tools
            </a>

            <a
              href="/contact"
              aria-current={currentRoute === '/contact' ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/contact');
              }}
              className={linkClass(currentRoute === '/contact')}
            >
              Contact
            </a>
          </GlassNavigation>

          {/* Right: Integrated Search Bar + Primary Let's Connect CTA */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Integrated Desktop Navbar Search Bar with Absolute liquid-glass-dropdown */}
            <div ref={navSearchContainerRef} className="relative hidden md:block">
              <div className="relative flex items-center">
                <Search
                  className="w-3.5 h-3.5 text-[#6E6E73] absolute left-3 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  ref={navSearchInputRef}
                  type="search"
                  value={navHeaderSearch.query}
                  onChange={(e) => {
                    navHeaderSearch.setQuery(e.target.value);
                    setNavDropdownOpen(true);
                  }}
                  onFocus={() => {
                    setNavDropdownOpen(true);
                    setDropdownOpen(false);
                    setServicesMenuOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setNavDropdownOpen(false);
                      navSearchInputRef.current?.blur();
                    } else if (e.key === 'Enter' && navHeaderSearch.results.length > 0) {
                      const first = navHeaderSearch.results[0];
                      setNavDropdownOpen(false);
                      navigateTo(first.url as AppRoute);
                    }
                  }}
                  placeholder="Search services or quotes..."
                  aria-label="Search standalone services"
                  className="w-44 lg:w-56 xl:w-64 pl-8 pr-7 py-1.5 text-xs rounded-full border border-black/10 bg-white/75 hover:bg-white/95 focus:bg-white focus:w-56 lg:focus:w-64 xl:focus:w-72 focus:outline-none focus:ring-2 focus:ring-[#0071E3] transition-all text-[#1D1D1F] placeholder:text-[#86868B] shadow-xs"
                />
                {navHeaderSearch.hasQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      navHeaderSearch.clearQuery();
                      navSearchInputRef.current?.focus();
                    }}
                    aria-label="Clear search"
                    className="absolute right-2.5 text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                ) : (
                  <kbd className="hidden xl:inline-flex items-center absolute right-2.5 px-1.5 py-0.5 text-[10px] font-mono text-[#86868B] bg-black/5 rounded pointer-events-none">
                    ⌘K
                  </kbd>
                )}
              </div>

              {/* Absolute liquid-glass-dropdown below input */}
              <AnimatePresence>
                {navDropdownOpen && navHeaderSearch.hasQuery && (
                  <motion.div
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-84 sm:w-92 xl:w-96 rounded-2xl liquid-glass-dropdown p-2.5 shadow-2xl z-50 border border-white/80 max-h-[75vh] overflow-y-auto"
                  >
                    <div className="px-2.5 py-1.5 border-b border-black/5 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73]">
                        Services Matching ({navHeaderSearch.resultCount})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          megaSearch.setQuery(navHeaderSearch.query);
                          setServicesMenuOpen(true);
                          setNavDropdownOpen(false);
                        }}
                        className="text-[11px] font-semibold text-[#0071E3] hover:underline cursor-pointer"
                      >
                        Filter in Mega Menu &rarr;
                      </button>
                    </div>

                    {navHeaderSearch.resultCount === 0 ? (
                      <div className="p-4 text-center space-y-2">
                        <p className="text-xs text-[#6E6E73]">
                          No services found matching &ldquo;{navHeaderSearch.query}&rdquo;.
                        </p>
                        <button
                          type="button"
                          onClick={() => navigateToQuote()}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0071E3] hover:underline cursor-pointer"
                        >
                          <span>Request Custom Quotation</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="py-1 space-y-1">
                        {navHeaderSearch.results.map((item) => (
                          <div
                            key={item.id}
                            className="group rounded-xl p-2 hover:bg-white/90 border border-transparent hover:border-[#0071E3]/20 transition-all flex items-center justify-between gap-2"
                          >
                            <a
                              href={item.url}
                              onClick={(e) => {
                                e.preventDefault();
                                setNavDropdownOpen(false);
                                navigateTo(item.url as AppRoute);
                              }}
                              className="min-w-0 flex-1 block"
                            >
                              <p className="text-xs font-semibold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors truncate">
                                <HighlightText
                                  text={item.name}
                                  query={navHeaderSearch.query}
                                  highlightClassName="bg-amber-200 text-[#1D1D1F] font-bold rounded-xs px-0.5"
                                />
                              </p>
                              <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-[#6E6E73]">
                                <span className="truncate">
                                  <HighlightText
                                    text={item.category}
                                    query={navHeaderSearch.query}
                                    highlightClassName="bg-amber-100 text-[#1D1D1F] font-semibold rounded-xs px-0.5"
                                  />
                                </span>
                                {(item.oneTimePrice || item.monthlyPrice || item.packagePrice) && (
                                  <>
                                    <span>·</span>
                                    <span className="font-mono-num font-medium text-[#1D1D1F]">
                                      {item.oneTimePrice
                                        ? `₹${item.oneTimePrice.toLocaleString('en-IN')}`
                                        : item.monthlyPrice
                                        ? `₹${item.monthlyPrice.toLocaleString('en-IN')}/mo`
                                        : `₹${(item.packagePrice || 0).toLocaleString('en-IN')}`}
                                    </span>
                                  </>
                                )}
                              </div>
                            </a>
                            <button
                              type="button"
                              onClick={() => navigateToQuote(item.name)}
                              title={`Request Quote for ${item.name}`}
                              className="shrink-0 px-2.5 py-1 text-[11px] font-semibold text-[#0071E3] bg-blue-50/80 hover:bg-[#0071E3] hover:text-white rounded-lg border border-[#0071E3]/25 transition-all cursor-pointer shadow-2xs"
                            >
                              Quote
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 px-2.5 pb-1 border-t border-black/5 flex items-center justify-between text-[11px] text-[#86868B]">
                      <span>Standalone Services · No Bundles</span>
                      <button
                        type="button"
                        onClick={() => navigateToQuote()}
                        className="font-medium text-[#0071E3] hover:underline cursor-pointer"
                      >
                        Build Quotation &rarr;
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false);
                setServicesMenuOpen(false);
                setMobileMenuOpen(false);
                setSearchOpen(true);
              }}
              aria-label="Search AKYIN Ventures and pages (Ctrl+K)"
              aria-expanded={searchOpen}
              aria-haspopup="dialog"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full liquid-glass-cta text-[#1D1D1F] hover:border-[#0071E3]/35 hover:text-[#0071E3] transition-all cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3]"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
            </button>

            <GlassButton
              variant="primary"
              size="sm"
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/contact');
              }}
              className="hidden sm:inline-flex hover:bg-[#0071E3]"
            >
              Let&apos;s Connect
            </GlassButton>

            <button
              type="button"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full liquid-glass-cta text-[#1D1D1F] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Desktop Searchable 10-Category Services Mega-Menu */}
        <AnimatePresence>
          {servicesMenuOpen && (
            <motion.div
              ref={megaMenuPanelRef}
              onMouseLeave={() => setServicesMenuOpen(false)}
              initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:block fixed top-14 lg:top-16 inset-x-0 z-50 px-4 sm:px-6 lg:px-8 pt-2 pointer-events-none"
            >
              <div className="max-w-6xl mx-auto pointer-events-auto rounded-3xl border border-[#E8E8ED] bg-white/95 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.14)] overflow-hidden">
                {/* Mega-Menu Search Bar Header with absolute liquid-glass-dropdown */}
                <div className="p-4 sm:px-6 border-b border-[#E8E8ED] flex items-center justify-between gap-4 bg-[#F5F5F7]/70">
                  <div ref={megaSearchContainerRef} className="relative flex-1 max-w-xl">
                    <Search
                      className="w-4 h-4 text-[#6E6E73] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      ref={megaSearchInputRef}
                      type="search"
                      value={megaSearch.query}
                      onChange={(e) => {
                        megaSearch.setQuery(e.target.value);
                        setMegaDropdownOpen(true);
                      }}
                      onFocus={() => setMegaDropdownOpen(true)}
                      placeholder="Search services, e.g. logo, leads, PPT..."
                      aria-label="Search standalone services"
                      className="w-full pl-10 pr-8 py-2 rounded-xl border border-[#D2D2D7] bg-white text-xs text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                    />
                    {megaSearch.hasQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          megaSearch.clearQuery();
                          megaSearchInputRef.current?.focus();
                        }}
                        aria-label="Clear service search"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    )}

                    {/* Absolute liquid-glass-dropdown below mega search input */}
                    <AnimatePresence>
                      {megaDropdownOpen && megaSearch.hasQuery && (
                        <motion.div
                          initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={shouldReduceMotion ? undefined : { opacity: 0, y: 4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 right-0 top-full mt-2 rounded-2xl liquid-glass-dropdown p-2 shadow-2xl z-50 border border-white/90 max-h-[50vh] overflow-y-auto"
                        >
                          <div className="px-3 py-1.5 border-b border-black/5 flex items-center justify-between text-[11px] font-semibold text-[#6E6E73]">
                            <span>Instant Matches ({megaSearch.resultCount})</span>
                            <span className="text-[#86868B]">Also highlighted across 10 categories below</span>
                          </div>
                          {megaSearch.resultCount === 0 ? (
                            <div className="p-3 text-center text-xs text-[#6E6E73] space-y-1.5">
                              <p>No matching services found for &ldquo;{megaSearch.query}&rdquo;.</p>
                              <button
                                type="button"
                                onClick={() => {
                                  setMegaDropdownOpen(false);
                                  navigateToQuote();
                                }}
                                className="text-xs font-semibold text-[#0071E3] hover:underline cursor-pointer"
                              >
                                Request Custom Service Quote &rarr;
                              </button>
                            </div>
                          ) : (
                            <div className="py-1 space-y-1">
                              {megaSearch.results.slice(0, 6).map((svc) => (
                                <div
                                  key={svc.id}
                                  className="flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-white/90 border border-transparent hover:border-[#0071E3]/20 transition-all"
                                >
                                  <a
                                    href={svc.url}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setMegaDropdownOpen(false);
                                      navigateTo(svc.url as AppRoute);
                                    }}
                                    className="min-w-0 flex-1 block"
                                  >
                                    <p className="text-xs font-semibold text-[#1D1D1F] truncate">
                                      <HighlightText
                                        text={svc.name}
                                        query={megaSearch.query}
                                        highlightClassName="bg-amber-200 text-[#1D1D1F] font-bold rounded-xs px-0.5"
                                      />
                                    </p>
                                    <p className="text-[11px] text-[#6E6E73] truncate">
                                      <HighlightText
                                        text={svc.category}
                                        query={megaSearch.query}
                                        highlightClassName="bg-amber-100 text-[#1D1D1F] font-semibold rounded-xs px-0.5"
                                      />
                                    </p>
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setMegaDropdownOpen(false);
                                      navigateToQuote(svc.name);
                                    }}
                                    className="shrink-0 px-2.5 py-1 text-[11px] font-semibold text-[#0071E3] bg-blue-50/90 hover:bg-[#0071E3] hover:text-white rounded-lg border border-[#0071E3]/30 transition-all cursor-pointer shadow-2xs"
                                  >
                                    Quote
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex items-center gap-4 text-xs shrink-0">
                    <button
                      type="button"
                      onClick={() => navigateTo('/marketing/automotive')}
                      className="font-semibold text-[#1D1D1F] hover:text-[#0071E3] transition-colors cursor-pointer"
                    >
                      Automotive Division
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateToQuote()}
                      className="font-semibold text-[#0071E3] hover:underline cursor-pointer"
                    >
                      Pricing &amp; Quotation &rarr;
                    </button>
                  </div>
                </div>

                {/* Live Search Results OR Full 10-Category Directory */}
                <div className="p-5 sm:p-6 max-h-[62vh] overflow-y-auto">
                  {megaSearch.hasQuery && megaSearch.resultCount === 0 && (
                    <div className="mb-4 rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7] p-4 text-xs text-[#6E6E73] flex items-center justify-between gap-4">
                      <span>No matching services found for &ldquo;{megaSearch.query}&rdquo;.</span>
                      <button
                        type="button"
                        onClick={() => navigateToQuote()}
                        className="font-semibold text-[#0071E3] hover:underline cursor-pointer shrink-0"
                      >
                        Request Custom Service Quote &rarr;
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-5 gap-y-6">
                    {orderedCategories.map((categoryName) => {
                      const items = servicesByCategory[categoryName] || [];
                      const matchingInCategory = items.filter((svc) =>
                        megaSearch.isMatchingItem(svc)
                      );
                      const hasMatches = matchingInCategory.length > 0;

                      return (
                        <div key={categoryName} className="space-y-2 min-w-0">
                          <div className="flex items-center justify-between border-b border-[#E8E8ED] pb-1.5 gap-1">
                            <p className={`text-[11px] font-bold uppercase tracking-[0.08em] leading-tight truncate ${
                              hasMatches ? 'text-[#0071E3]' : 'text-[#1D1D1F]'
                            }`}>
                              {categoryName}
                            </p>
                            {megaSearch.hasQuery && hasMatches && (
                              <span className="text-[10px] font-bold text-[#0071E3] bg-blue-50 border border-[#0071E3]/30 px-1.5 py-0.2 rounded-full shrink-0">
                                {matchingInCategory.length} match{matchingInCategory.length === 1 ? '' : 'es'}
                              </span>
                            )}
                          </div>
                          <ul className="space-y-1">
                            {items.slice(0, 5).map((svc) => {
                              const isMatch = megaSearch.hasQuery && megaSearch.isMatchingItem(svc);
                              const isDimmed = megaSearch.hasQuery && !isMatch;

                              return (
                                <li key={svc.slug} className="transition-all duration-200">
                                  <div
                                    className={`group rounded-lg px-2 py-1 transition-all ${
                                      isMatch
                                        ? 'bg-gradient-to-r from-blue-50/95 via-sky-50/80 to-white border border-[#0071E3]/50 ring-2 ring-[#0071E3]/20 shadow-xs'
                                        : isDimmed
                                        ? 'opacity-40 hover:opacity-100'
                                        : 'hover:bg-[#F5F5F7]/80'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between gap-1.5">
                                      <a
                                        href={`/services/${svc.slug}`}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          navigateTo(`/services/${svc.slug}` as AppRoute);
                                        }}
                                        className={`block text-[12px] leading-snug truncate flex-1 ${
                                          isMatch
                                            ? 'text-[#0071E3] font-semibold'
                                            : currentRoute === `/services/${svc.slug}`
                                            ? 'text-[#0071E3] font-semibold'
                                            : 'text-[#4A4A4F] hover:text-[#0071E3]'
                                        }`}
                                      >
                                        <HighlightText
                                          text={svc.name}
                                          query={megaSearch.query}
                                          highlightClassName="bg-amber-200 text-[#1D1D1F] font-bold px-0.5 rounded-xs"
                                        />
                                      </a>

                                      {isMatch ? (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            navigateToQuote(svc.name);
                                          }}
                                          title={`Request quote for ${svc.name}`}
                                          className="shrink-0 text-[10px] font-bold text-[#0071E3] bg-white border border-[#0071E3]/40 hover:bg-[#0071E3] hover:text-white px-1.5 py-0.5 rounded shadow-2xs transition-colors cursor-pointer"
                                        >
                                          Quote
                                        </button>
                                      ) : null}
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                            {items.length > 5 && (
                              <li>
                                <a
                                  href="/ventures/marketing"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    navigateTo('/ventures/marketing');
                                  }}
                                  className="inline-block text-[11px] font-semibold text-[#0071E3] hover:underline pt-0.5 px-2"
                                >
                                  +{items.length - 5} more in catalogue
                                </a>
                              </li>
                            )}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mega-Menu Footer Bar */}
                <div className="px-6 py-3 border-t border-[#E8E8ED] bg-[#F5F5F7]/90 flex items-center justify-between gap-4 text-xs">
                  <p className="text-[#6E6E73]">
                    100% Standalone Services · No compulsory bundles or hidden contracts.
                  </p>
                  <div className="flex items-center gap-5 shrink-0 font-semibold">
                    <a
                      href="/ventures/marketing"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('/ventures/marketing');
                      }}
                      className="text-[#1D1D1F] hover:text-[#0071E3] transition-colors"
                    >
                      View All Services
                    </a>
                    <a
                      href="/pricing#quotation-builder"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('/pricing#quotation-builder' as AppRoute);
                      }}
                      className="text-[#0071E3] hover:underline"
                    >
                      Request a Quotation
                    </a>
                    <a
                      href="/contact"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('/contact');
                      }}
                      className="text-[#1D1D1F] hover:text-[#0071E3] transition-colors"
                    >
                      Contact AKYIN
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Responsive Mobile Liquid Glass Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden liquid-glass-dropdown border-t border-[#E8E8ED] px-4 py-5 space-y-1.5 text-[#1D1D1F] max-h-[85vh] overflow-y-auto overflow-x-hidden"
            >
              <a
                href="/"
                aria-current={currentRoute === '/' ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/');
                }}
                className="block px-3.5 py-2.5 text-sm font-semibold rounded-xl hover:bg-white/85"
              >
                Home
              </a>
              <a
                href="/about"
                aria-current={currentRoute === '/about' ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/about');
                }}
                className="block px-3.5 py-2.5 text-sm font-semibold rounded-xl hover:bg-white/85"
              >
                About AKYIN
              </a>

              {/* Expandable Mobile Services Marketplace */}
              <div className="rounded-2xl border border-[#E8E8ED]/80 bg-white/55 overflow-hidden">
                <button
                  type="button"
                  aria-expanded={mobileServicesOpen}
                  onClick={() => setMobileServicesOpen((prev) => !prev)}
                  className="w-full px-3.5 py-2.5 text-sm font-semibold flex items-center justify-between text-left cursor-pointer"
                >
                  <span>Services (10 Categories)</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileServicesOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {mobileServicesOpen && (
                  <div className="px-3 pb-3 space-y-2.5 border-t border-[#E8E8ED]/80 pt-2.5">
                    <div className="relative">
                      <Search
                        className="w-3.5 h-3.5 text-[#6E6E73] absolute left-3 top-1/2 -translate-y-1/2"
                        aria-hidden="true"
                      />
                      <input
                        type="search"
                        value={mobileSearch.query}
                        onChange={(e) => mobileSearch.setQuery(e.target.value)}
                        placeholder="Search services..."
                        className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#D2D2D7] bg-white text-xs text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                      />
                    </div>

                    {mobileSearch.hasQuery ? (
                      <div className="space-y-1">
                        {mobileSearch.results.map((svc) => (
                          <a
                            key={svc.slug}
                            href={svc.url}
                            onClick={(e) => {
                              e.preventDefault();
                              navigateTo(svc.url as AppRoute);
                            }}
                            className="block px-2.5 py-2 rounded-xl bg-white/85 text-xs"
                          >
                            <span className="font-semibold text-[#1D1D1F] block truncate">
                              <HighlightText text={svc.name} query={mobileSearch.query} />
                            </span>
                            <span className="text-[11px] text-[#6E6E73] block truncate">{svc.category}</span>
                          </a>
                        ))}
                        {mobileSearch.resultCount === 0 && (
                          <p className="text-xs text-[#6E6E73] px-1 py-1">No matching services found.</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {orderedCategories.map((cat) => {
                          const items = servicesByCategory[cat] || [];
                          const expanded = mobileExpandedCategory === cat;
                          return (
                            <div key={cat} className="rounded-xl bg-white/75 border border-[#E8E8ED]/70">
                              <button
                                type="button"
                                onClick={() =>
                                  setMobileExpandedCategory((prev) => (prev === cat ? null : cat))
                                }
                                className="w-full px-3 py-2 text-xs font-semibold flex items-center justify-between text-left cursor-pointer"
                              >
                                <span className="truncate pr-2">{cat}</span>
                                <ChevronDown
                                  className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                                    expanded ? 'rotate-180' : ''
                                  }`}
                                  aria-hidden="true"
                                />
                              </button>
                              {expanded && items.length > 0 && (
                                <div className="px-3 pb-2 space-y-1 border-t border-[#E8E8ED]/60 pt-1.5">
                                  {items.map((svc) => (
                                    <a
                                      key={svc.slug}
                                      href={`/services/${svc.slug}`}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        navigateTo(`/services/${svc.slug}` as AppRoute);
                                      }}
                                      className="block py-1 text-xs text-[#4A4A4F] hover:text-[#0071E3]"
                                    >
                                      {svc.name}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2 pt-1 text-xs font-semibold">
                      <a
                        href="/ventures/marketing"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo('/ventures/marketing');
                        }}
                        className="text-[#1D1D1F] hover:underline"
                      >
                        View All Services
                      </a>
                      <a
                        href="/pricing#quotation-builder"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo('/pricing#quotation-builder' as AppRoute);
                        }}
                        className="text-[#0071E3] hover:underline"
                      >
                        Request Quotation &rarr;
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 pb-1 px-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                  Our Ventures
                </p>
              </div>
              <div className="pl-3 space-y-0.5">
                {VENTURES_PORTFOLIO.map((venture) => {
                  const label = VENTURES_DROPDOWN_LABELS[venture.id] || venture.shortName;
                  return (
                    <a
                      key={venture.id}
                      href={venture.route}
                      aria-current={currentRoute === venture.route ? 'page' : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo(venture.route);
                      }}
                      className={`block px-3.5 py-2 text-sm rounded-xl transition-colors ${
                        currentRoute === venture.route
                          ? 'frosted-glass font-semibold text-[#1D1D1F]'
                          : 'text-[#1D1D1F] hover:bg-white/85'
                      }`}
                    >
                      {label}
                    </a>
                  );
                })}
                <a
                  href="/ventures"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/ventures');
                  }}
                  className="block px-3.5 py-1.5 text-xs font-semibold text-[#0071E3] hover:underline"
                >
                  All Ventures Overview →
                </a>
              </div>

              <a
                href="/#our-clients"
                onClick={(e) => {
                  e.preventDefault();
                  handleClientsClick();
                }}
                className="block px-3.5 py-2.5 text-sm font-semibold rounded-xl hover:bg-white/85"
              >
                Our Clients
              </a>

              <a
                href="/marketing/automotive"
                aria-current={currentRoute === '/marketing/automotive' ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/marketing/automotive');
                }}
                className="block px-3.5 py-2.5 text-sm font-semibold rounded-xl hover:bg-white/85"
              >
                Automotive Marketing
              </a>

              <a
                href="/pricing"
                aria-current={currentRoute === '/pricing' ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/pricing');
                }}
                className="block px-3.5 py-2.5 text-sm font-semibold rounded-xl hover:bg-white/85"
              >
                Pricing &amp; Quotation Builder
              </a>

              <a
                href="/tools"
                aria-current={currentRoute === '/tools' ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/tools');
                }}
                className="block px-3.5 py-2.5 text-sm font-semibold rounded-xl hover:bg-white/85"
              >
                Business Tools (20 Calculators)
              </a>

              <a
                href="/contact"
                aria-current={currentRoute === '/contact' ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/contact');
                }}
                className="block px-3.5 py-2.5 text-sm font-semibold rounded-xl hover:bg-white/85"
              >
                Contact
              </a>

              <div className="pt-3 border-t border-[#E8E8ED] space-y-2.5">
                <p className="px-3.5 text-[11px] font-semibold tracking-wide text-[#0071E3]">
                  {OFFICIAL_CONTACT.regionIndicator} · {OFFICIAL_CONTACT.internationalSupportLine}
                </p>
                <div className="px-3.5 space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                    Follow AKYIN
                  </p>
                  <SocialLinks variant="icon-row" />
                </div>
              </div>

              <div className="pt-3">
                <GlassButton
                  variant="primary"
                  size="lg"
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/contact');
                  }}
                  className="w-full"
                >
                  Let&apos;s Connect
                </GlassButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </LiquidGlassHeader>

      <HeaderSearch
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={navigateTo}
      />
    </>
  );
}
