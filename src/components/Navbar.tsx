import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, Search, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { AppRoute, OFFICIAL_CONTACT, VENTURES_PORTFOLIO } from '../data/akyinData';
import { useSiteConfig } from '../context/SiteConfigContext';
import { isSafeImageSrc } from '../utils/security';
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

export function Navbar({
  currentRoute,
  onNavigate,
  onNavigateEcosystem,
}: NavbarProps) {
  const { settings } = useSiteConfig();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

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
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setDropdownOpen(false);
        setMobileMenuOpen(false);
        setSearchOpen((prev) => !prev);
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
    setMobileMenuOpen(false);
    onNavigate(route);
  };

  const handleClientsClick = () => {
    setDropdownOpen(false);
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

  const isVentureActive =
    currentRoute === '/ventures' ||
    currentRoute === '/ventures/publishing' ||
    currentRoute === '/ventures/marketing' ||
    currentRoute === '/ventures/store';

  const isServicesActive =
    currentRoute === '/ventures/marketing' ||
    currentRoute === '/marketing/automotive' ||
    currentRoute === '/pricing';

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

          {/* Center: Desktop Liquid Glass Navigation (Exact user hierarchy) */}
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
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                type="button"
                aria-expanded={dropdownOpen}
                aria-haspopup="menu"
                onClick={() => setDropdownOpen((prev) => !prev)}
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

                        {venture.id === 'marketing' && (
                          <a
                            role="menuitem"
                            href="/marketing/automotive"
                            onClick={(e) => {
                              e.preventDefault();
                              navigateTo('/marketing/automotive');
                            }}
                            className={`block ml-3 px-3.5 py-1.5 rounded-xl transition-all ${
                              currentRoute === '/marketing/automotive'
                                ? 'frosted-glass text-[#1D1D1F] font-semibold shadow-xs'
                                : 'hover:bg-white/85 text-[#6E6E73] hover:text-[#1D1D1F]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-semibold">
                                Automotive Marketing
                              </span>
                              <span className="text-[10px] text-[#0071E3] font-medium">
                                Division
                              </span>
                            </div>
                          </a>
                        )}
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

            <a
              href="/ventures/marketing"
              aria-current={isServicesActive ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/ventures/marketing');
              }}
              className={linkClass(isServicesActive)}
            >
              Services
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

          {/* Right: Search & Primary Let's Connect CTA */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false);
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

        {/* Responsive Mobile Liquid Glass Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden liquid-glass-dropdown border-t border-[#E8E8ED] px-4 py-5 space-y-1.5 text-[#1D1D1F] max-h-[85vh] overflow-y-auto"
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
                href="/ventures/marketing"
                aria-current={isServicesActive ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/ventures/marketing');
                }}
                className="block px-3.5 py-2.5 text-sm font-semibold rounded-xl hover:bg-white/85"
              >
                Services
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
