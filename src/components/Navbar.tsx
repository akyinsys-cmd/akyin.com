import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { AppRoute, VENTURES_PORTFOLIO } from '../data/akyinData';
import { useSiteConfig } from '../context/SiteConfigContext';
import { isSafeImageSrc } from '../utils/security';
import { AkyinLogo } from './AkyinLogo';
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

export function Navbar({
  currentRoute,
  onNavigate,
  onNavigateEcosystem,
}: NavbarProps) {
  const { settings } = useSiteConfig();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
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

  const handleEcosystemClick = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    onNavigateEcosystem();
  };

  const isVentureActive =
    currentRoute === '/ventures' || currentRoute.startsWith('/ventures/');

  const linkClass = (isActive: boolean) =>
    `relative px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1D1F]/35 ${
      isActive
        ? 'frosted-glass-pill text-[#1D1D1F] font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,1)] border border-white/95'
        : 'text-[#1D1D1F] hover:text-[#1D1D1F] hover:bg-white/60'
    }`;

  return (
    <LiquidGlassHeader scrolled={scrolled}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 lg:h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Custom AKYIN Mark & Wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('/');
          }}
          className="inline-flex items-center whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1D1F]/35 rounded-xl px-1 py-0.5 transition-opacity hover:opacity-85"
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

        {/* Zone 2: Floating Glass Navigation Pill */}
        <GlassNavigation ariaLabel="Primary navigation">
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
            About
          </a>

          {/* Ventures Dropdown */}
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
              <span>Ventures</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            <GlassDropdown open={dropdownOpen} className="w-80">
              <div className="space-y-0.5">
                {VENTURES_PORTFOLIO.map((venture) => (
                  <a
                    key={venture.id}
                    role="menuitem"
                    href={venture.route}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo(venture.route);
                    }}
                    className={`block px-3.5 py-2.5 rounded-xl transition-all ${
                      currentRoute === venture.route
                        ? 'frosted-glass text-[#1D1D1F] font-semibold shadow-xs'
                        : 'hover:bg-white/80 text-[#1D1D1F]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold">{venture.shortName}</span>
                      <span
                        className={`font-mono-num text-[11px] ${
                          currentRoute === venture.route ? 'text-[#1D1D1F]/70 font-bold' : 'text-[#6E6E73]'
                        }`}
                      >
                        {venture.code}
                      </span>
                    </div>
                    <p
                      className={`text-[11px] mt-0.5 truncate ${
                        currentRoute === venture.route ? 'text-[#1D1D1F]/80 font-medium' : 'text-[#6E6E73]'
                      }`}
                    >
                      {venture.sector}
                    </p>
                  </a>
                ))}

                <div className="pt-1.5 mt-1.5 border-t border-[#1D1D1F]/8">
                  <a
                    href="/ventures"
                    role="menuitem"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('/ventures');
                    }}
                    className="block px-3.5 py-2 rounded-xl text-xs font-semibold text-[#1D1D1F] hover:bg-white/90 transition-colors"
                  >
                    View All 7 Ventures Directory
                  </a>
                </div>
              </div>
            </GlassDropdown>
          </div>

          <a
            href="/#our-ecosystem"
            onClick={(e) => {
              e.preventDefault();
              handleEcosystemClick();
            }}
            className={linkClass(false)}
          >
            Ecosystem
          </a>

          <a
            href="/advisory"
            aria-current={currentRoute === '/advisory' ? 'page' : undefined}
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/advisory');
            }}
            className={linkClass(currentRoute === '/advisory')}
          >
            Advisory
          </a>

          <a
            href="/insights"
            aria-current={currentRoute === '/insights' ? 'page' : undefined}
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/insights');
            }}
            className={linkClass(currentRoute === '/insights')}
          >
            Insights
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

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <GlassButton
            variant="primary"
            size="sm"
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/contact');
            }}
            className="hidden sm:inline-flex"
          >
            Let&apos;s Connect
          </GlassButton>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-full liquid-glass-cta text-[#1D1D1F] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Liquid Glass Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden liquid-glass-dropdown border-t border-white/80 px-4 py-5 space-y-1 text-[#1D1D1F] max-h-[84vh] overflow-y-auto"
          >
            <a
              href="/"
              aria-current={currentRoute === '/' ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/');
              }}
              className="block px-3.5 py-2.5 text-sm font-semibold rounded-xl hover:bg-white/80"
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
              className="block px-3.5 py-2.5 text-sm font-semibold rounded-xl hover:bg-white/80"
            >
              About
            </a>

            <div className="pt-2 pb-1 px-3.5">
              <p className="text-[11px] font-semibold tracking-wide text-[#6E6E73]">
                Our Ventures
              </p>
            </div>
            <div className="pl-3 space-y-0.5">
              {VENTURES_PORTFOLIO.map((venture) => (
                <a
                  key={venture.id}
                  href={venture.route}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo(venture.route);
                  }}
                  className="block px-3.5 py-2 text-sm text-[#1D1D1F] rounded-xl hover:bg-white/80"
                >
                  {venture.shortName}
                </a>
              ))}
            </div>

            <a
              href="/advisory"
              aria-current={currentRoute === '/advisory' ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/advisory');
              }}
              className="block px-3.5 py-2.5 text-sm font-semibold rounded-xl hover:bg-white/80"
            >
              Advisory
            </a>
            <a
              href="/#our-ecosystem"
              onClick={(e) => {
                e.preventDefault();
                handleEcosystemClick();
              }}
              className="block px-3.5 py-2.5 text-sm font-semibold rounded-xl hover:bg-white/80"
            >
              Ecosystem
            </a>
            <a
              href="/insights"
              aria-current={currentRoute === '/insights' ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/insights');
              }}
              className="block px-3.5 py-2.5 text-sm font-semibold rounded-xl hover:bg-white/80"
            >
              Insights
            </a>
            <a
              href="/contact"
              aria-current={currentRoute === '/contact' ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/contact');
              }}
              className="block px-3.5 py-2.5 text-sm font-semibold rounded-xl hover:bg-white/80"
            >
              Contact
            </a>

            <div className="pt-3 border-t border-[#1D1D1F]/10">
              <p className="px-3.5 text-[11px] font-semibold text-[#6E6E73] mb-2">
                Follow @akyinmarketing
              </p>
              <div className="px-3.5">
                <SocialLinks variant="inline" />
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
  );
}
