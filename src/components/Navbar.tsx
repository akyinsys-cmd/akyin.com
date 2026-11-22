import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { AppRoute, VENTURES_PORTFOLIO } from '../data/akyinData';
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

  const navBarStyle = scrolled ? 'glass-nav-white' : 'glass-nav-warm';
  const isVentureActive =
    currentRoute === '/ventures' || currentRoute.startsWith('/ventures/');

  const linkClass = (isActive: boolean) =>
    `group relative py-1 text-[13px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
      isActive ? 'text-[#B66A50]' : 'text-[#292722] hover:text-[#B66A50]'
    }`;

  const underlineClass = (isActive: boolean) =>
    `pointer-events-none absolute left-0 right-0 -bottom-0.5 h-[2px] rounded-full bg-[#B66A50] origin-left transition-transform duration-200 ease-out ${
      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
    }`;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 text-[#292722] ${navBarStyle}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 lg:h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single Brand Wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('/');
          }}
          className="font-display text-lg font-extrabold tracking-tight text-[#292722] hover:text-[#B66A50] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B66A50] rounded px-1"
        >
          AKYIN
        </a>

        {/* Zone 2: Refined 6-Item Single-Line Navigation */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-6"
        >
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/');
            }}
            className={linkClass(currentRoute === '/')}
          >
            <span>Home</span>
            <span className={underlineClass(currentRoute === '/')} aria-hidden="true" />
          </a>

          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/about');
            }}
            className={linkClass(currentRoute === '/about')}
          >
            <span>About</span>
            <span className={underlineClass(currentRoute === '/about')} aria-hidden="true" />
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
              <span className={underlineClass(isVentureActive)} aria-hidden="true" />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  role="menu"
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: 4 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-0 top-full pt-2.5 w-80 z-50"
                >
                  <div className="glass-dropdown-warm rounded-xl p-2 space-y-0.5 text-[#292722]">
                    {VENTURES_PORTFOLIO.map((venture) => (
                      <a
                        key={venture.id}
                        role="menuitem"
                        href={venture.route}
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo(venture.route);
                        }}
                        className={`block px-3.5 py-2 rounded-lg transition-colors ${
                          currentRoute === venture.route
                            ? 'bg-[#EFE9DE] text-[#B66A50]'
                            : 'hover:bg-[#F7F5F0] text-[#292722]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold">{venture.shortName}</span>
                          <span className="font-mono-num text-[11px] text-[#77736C]">
                            {venture.code}
                          </span>
                        </div>
                        <p className="text-[11px] mt-0.5 truncate text-[#77736C]">
                          {venture.sector}
                        </p>
                      </a>
                    ))}

                    <div className="pt-1.5 mt-1.5 border-t border-[#EFE9DE]">
                      <a
                        href="/ventures"
                        role="menuitem"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo('/ventures');
                        }}
                        className="block px-3.5 py-2 rounded-lg text-xs font-bold text-[#B66A50] hover:bg-[#F7F5F0] transition-colors"
                      >
                        View All 7 Ventures Directory
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href="/#our-ecosystem"
            onClick={(e) => {
              e.preventDefault();
              handleEcosystemClick();
            }}
            className={linkClass(false)}
          >
            <span>Our Ecosystem</span>
            <span className={underlineClass(false)} aria-hidden="true" />
          </a>

          <a
            href="/insights"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/insights');
            }}
            className={linkClass(currentRoute === '/insights')}
          >
            <span>Insights</span>
            <span className={underlineClass(currentRoute === '/insights')} aria-hidden="true" />
          </a>

          <a
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/contact');
            }}
            className={linkClass(currentRoute === '/contact')}
          >
            <span>Contact</span>
            <span className={underlineClass(currentRoute === '/contact')} aria-hidden="true" />
          </a>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/contact');
            }}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-[#B66A50] hover:bg-[#9E5740] rounded-lg transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap shrink-0"
          >
            Connect With Us
          </a>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-[#292722] hover:bg-[#EFE9DE] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden bg-[#F7F5F0] border-t border-[#D9CCB9] px-4 py-5 space-y-1.5 text-[#292722] max-h-[84vh] overflow-y-auto shadow-lg"
          >
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/');
              }}
              className="block px-3 py-2.5 text-sm font-semibold rounded-lg hover:bg-[#EFE9DE]"
            >
              Home
            </a>
            <a
              href="/about"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/about');
              }}
              className="block px-3 py-2.5 text-sm font-semibold rounded-lg hover:bg-[#EFE9DE]"
            >
              About
            </a>

            <div className="pt-2 pb-1 px-3">
              <p className="text-[11px] font-semibold tracking-wide text-[#77736C]">
                Our Ventures
              </p>
            </div>
            <div className="pl-3 space-y-1">
              {VENTURES_PORTFOLIO.map((venture) => (
                <a
                  key={venture.id}
                  href={venture.route}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo(venture.route);
                  }}
                  className="block px-3 py-2 text-sm text-[#292722] rounded-lg hover:bg-[#EFE9DE]"
                >
                  {venture.shortName}
                </a>
              ))}
            </div>

            <a
              href="/#our-ecosystem"
              onClick={(e) => {
                e.preventDefault();
                handleEcosystemClick();
              }}
              className="block px-3 py-2.5 text-sm font-semibold rounded-lg hover:bg-[#EFE9DE]"
            >
              Our Ecosystem
            </a>
            <a
              href="/insights"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/insights');
              }}
              className="block px-3 py-2.5 text-sm font-semibold rounded-lg hover:bg-[#EFE9DE]"
            >
              Insights
            </a>
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/contact');
              }}
              className="block px-3 py-2.5 text-sm font-semibold rounded-lg hover:bg-[#EFE9DE]"
            >
              Contact
            </a>

            <div className="pt-3 border-t border-[#D9CCB9]">
              <p className="px-3 text-[11px] font-semibold text-[#77736C] mb-2">
                Follow @akyinmarketing
              </p>
              <div className="px-3">
                <SocialLinks variant="inline" />
              </div>
            </div>

            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/contact');
              }}
              className="block w-full text-center mt-3 px-4 py-3 text-sm font-semibold text-white bg-[#B66A50] hover:bg-[#9E5740] rounded-lg"
            >
              Connect With Us
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
