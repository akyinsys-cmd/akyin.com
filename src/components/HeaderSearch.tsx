import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Briefcase,
  FileText,
  Search,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  AppRoute,
  GUMROAD_DIGITAL_PRODUCTS,
  PUBLISHING_BOOKS,
  VENTURES_PORTFOLIO,
} from '../data/akyinData';
import { sanitizeHref } from '../utils/security';

type SearchCategory = 'all' | 'venture' | 'page' | 'book';

interface SearchEntry {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<SearchCategory, 'all'>;
  categoryLabel: string;
  route?: AppRoute;
  externalUrl?: string;
  keywords: string;
}

const CORPORATE_SEARCH_ENTRIES: SearchEntry[] = [
  {
    id: 'page-home',
    title: 'Home — AKYIN Ventures',
    subtitle: 'Corporate overview, 58+ business ecosystem, ROI tools & 7 operating verticals',
    category: 'page',
    categoryLabel: 'Information Page',
    route: '/',
    keywords: 'home corporate group overview ecosystem reviews pricing summary akyin ventures roi calculator budget planner service finder autoclub arosco mei krutika nyika ns traders',
  },
  {
    id: 'page-about',
    title: 'About Us & Corporate Profile',
    subtitle: 'Diversified business architecture, 16-year track record & FAQs',
    category: 'page',
    categoryLabel: 'Information Page',
    route: '/about',
    keywords: 'about us corporate profile history faq timeline security standards',
  },
  {
    id: 'page-ventures',
    title: 'Our Businesses Directory',
    subtitle: 'Compare all seven operating ventures under AKYIN Ventures',
    category: 'page',
    categoryLabel: 'Directory',
    route: '/ventures',
    keywords: 'businesses portfolio directory verticals ventures comparison',
  },
  {
    id: 'venture-automotive',
    title: 'AKYIN Automotive Marketing Division',
    subtitle: '16 dealership growth services, lead vetting, ROI calculator & sales coaching',
    category: 'venture',
    categoryLabel: 'Agency Division',
    route: '/marketing/automotive',
    keywords: 'automotive marketing car dealership test drive leads roi calculator showroom coaching',
  },
  {
    id: 'page-pricing',
    title: 'Pricing & 21-Item Rate Card',
    subtitle: 'Transparent INR retainers (Package A & B), sales training & advisory fees',
    category: 'page',
    categoryLabel: 'Pricing',
    route: '/pricing',
    keywords: 'pricing rate card cost fees package a package b 49999 19999 25000 razorpay payment',
  },
  {
    id: 'page-advisory',
    title: 'Business Advisory Booking',
    subtitle: 'Schedule a 1-on-1 30-minute IST strategy consultation (₹1,999)',
    category: 'page',
    categoryLabel: 'Consultation',
    route: '/advisory',
    keywords: 'business advisory booking consultation schedule calendar 1-on-1 ist strategy',
  },
  {
    id: 'page-insights',
    title: 'Insights & Business Philosophy',
    subtitle: 'Editorial essays on publishing, dealership lead vetting & retail',
    category: 'page',
    categoryLabel: 'Insights',
    route: '/insights',
    keywords: 'insights philosophy articles editorial trends marketing analysis',
  },
  {
    id: 'page-contact',
    title: 'Contact AKYIN Ventures',
    subtitle: 'Shaikh Nazir · connect@akyin.com · +91 63956 94011 (India & UAE)',
    category: 'page',
    categoryLabel: 'Contact',
    route: '/contact',
    keywords: 'contact enquiry email phone shaikh nazir india uae 63956 94011 connect',
  },
  {
    id: 'page-terms',
    title: 'Terms of Service',
    subtitle: 'Direct ad platform billing rules, service scope separation & governance',
    category: 'page',
    categoryLabel: 'Legal',
    route: '/terms',
    keywords: 'terms of service policy billing rules legal governance',
  },
  {
    id: 'page-privacy',
    title: 'Privacy Policy',
    subtitle: 'Zero-broker data privacy, validation & security protections',
    category: 'page',
    categoryLabel: 'Legal',
    route: '/privacy',
    keywords: 'privacy policy data protection security zero broker',
  },
  {
    id: 'page-sitemap',
    title: 'Site Map & Full Index',
    subtitle: 'Complete directory of internal pages, divisions & external platforms',
    category: 'page',
    categoryLabel: 'Directory',
    route: '/sitemap',
    keywords: 'sitemap directory all pages links index',
  },
];

const VENTURE_SEARCH_ENTRIES: SearchEntry[] = VENTURES_PORTFOLIO.map((venture) => ({
  id: `venture-${venture.id}`,
  title: venture.name,
  subtitle: `${venture.sector} — ${venture.positioning}`,
  category: 'venture',
  categoryLabel: 'Business Venture',
  route: venture.route,
  keywords: `${venture.name} ${venture.shortName} ${venture.sector} ${venture.positioning} ${venture.description} ${venture.externalLabel ?? ''}`.toLowerCase(),
}));

const BOOK_SEARCH_ENTRIES: SearchEntry[] = PUBLISHING_BOOKS.map((book) => ({
  id: book.id,
  title: book.title,
  subtitle: `By ${book.author} · ${book.subtitle}`,
  category: 'book',
  categoryLabel: 'AKYIN Publishing · Amazon',
  externalUrl: book.amazonUrl,
  keywords: `${book.title} ${book.subtitle} ${book.author} amazon book ebook kindle publishing`.toLowerCase(),
}));

const DIGITAL_PRODUCT_SEARCH_ENTRIES: SearchEntry[] = GUMROAD_DIGITAL_PRODUCTS.map((product) => ({
  id: product.id,
  title: product.shortTitle,
  subtitle: product.description,
  category: 'book',
  categoryLabel: 'AKYIN Publishing · Gumroad',
  externalUrl: product.gumroadUrl,
  keywords: `${product.shortTitle} ${product.title} ${product.description} gumroad digital guide tool resume money scroll`.toLowerCase(),
}));

const ALL_SEARCH_ENTRIES: SearchEntry[] = [
  ...VENTURE_SEARCH_ENTRIES,
  ...CORPORATE_SEARCH_ENTRIES,
  ...BOOK_SEARCH_ENTRIES,
  ...DIGITAL_PRODUCT_SEARCH_ENTRIES,
];

const QUICK_FEATURED_IDS = [
  'venture-publishing',
  'venture-marketing',
  'venture-automotive',
  'page-pricing',
  'page-advisory',
  'page-about',
];

const CATEGORY_TABS: { id: SearchCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'venture', label: 'Ventures' },
  { id: 'page', label: 'Info Pages' },
  { id: 'book', label: 'Books' },
];

interface HeaderSearchProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (route: AppRoute) => void;
}

export function HeaderSearch({ open, onClose, onNavigate }: HeaderSearchProps) {
  const shouldReduceMotion = useReducedMotion();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 40);
    return () => window.clearTimeout(focusTimer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();

    const pool =
      activeCategory === 'all'
        ? ALL_SEARCH_ENTRIES
        : ALL_SEARCH_ENTRIES.filter((entry) => entry.category === activeCategory);

    if (!trimmed) {
      if (activeCategory === 'all') {
        return QUICK_FEATURED_IDS.map((id) =>
          ALL_SEARCH_ENTRIES.find((item) => item.id === id)
        ).filter((item): item is SearchEntry => Boolean(item));
      }
      return pool.slice(0, 8);
    }

    const terms = trimmed.split(/\s+/).filter(Boolean);

    return pool
      .map((entry) => {
        const titleLower = entry.title.toLowerCase();
        const subtitleLower = entry.subtitle.toLowerCase();
        const hay = `${titleLower} ${subtitleLower} ${entry.keywords}`;

        const allMatch = terms.every((term) => hay.includes(term));
        if (!allMatch) return null;

        let score = 0;
        for (const term of terms) {
          if (titleLower.startsWith(term)) score += 10;
          else if (titleLower.includes(term)) score += 6;
          else if (subtitleLower.includes(term)) score += 3;
          else score += 1;
        }
        return { entry, score };
      })
      .filter((item): item is { entry: SearchEntry; score: number } => item !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((item) => item.entry);
  }, [query, activeCategory]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [query, activeCategory, open]);

  const handleSelectEntry = (entry: SearchEntry) => {
    setQuery('');
    onClose();
    if (entry.route) {
      onNavigate(entry.route);
    } else if (entry.externalUrl) {
      window.open(sanitizeHref(entry.externalUrl, 'https://akyin.com'), '_blank', 'noopener,noreferrer');
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = results[highlightedIndex];
      if (target) handleSelectEntry(target);
    }
  };

  const renderIcon = (category: Exclude<SearchCategory, 'all'>) => {
    if (category === 'venture') {
      return <Briefcase className="w-4 h-4 text-[#0071E3]" aria-hidden="true" />;
    }
    if (category === 'book') {
      return <BookOpen className="w-4 h-4 text-[#0071E3]" aria-hidden="true" />;
    }
    return <FileText className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />;
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search AKYIN Ventures and site pages"
          className="fixed inset-0 z-[60] bg-[#1D1D1F]/30 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 pb-6"
          onClick={onClose}
        >
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="liquid-glass-modal rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
          >
            {/* Search Input Bar */}
            <div className="p-4 sm:p-5 border-b border-[#1D1D1F]/10 flex items-center gap-3">
              <Search className="w-5 h-5 text-[#6E6E73] shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Search ventures, automotive, pricing, advisory, books..."
                aria-label="Search ventures and information pages"
                className="w-full bg-transparent text-sm sm:text-base text-[#1D1D1F] placeholder:text-[#6E6E73]/80 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear search query"
                  className="px-2 py-1 rounded-lg text-[11px] font-semibold text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-white/70 transition-colors cursor-pointer shrink-0"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="w-8 h-8 rounded-full bg-white/85 hover:bg-[#E8E8ED] border border-[#E8E8ED] flex items-center justify-center text-[#1D1D1F] transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Category Filter Controls */}
            <div className="px-4 sm:px-5 py-2.5 bg-white/40 border-b border-[#1D1D1F]/8 flex items-center justify-between gap-3 overflow-x-auto">
              <div
                role="group"
                aria-label="Filter search results by category"
                className="flex items-center gap-1.5"
              >
                {CATEGORY_TABS.map((tab) => {
                  const active = activeCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setActiveCategory(tab.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-[#1D1D1F] text-white shadow-xs'
                          : 'bg-white/75 text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <span className="hidden sm:inline font-mono-num text-[11px] text-[#6E6E73] whitespace-nowrap shrink-0">
                {query.trim() ? `${results.length} matches` : 'Quick destinations'}
              </span>
            </div>

            {/* Results List */}
            <div className="max-h-[58vh] overflow-y-auto p-2.5 sm:p-3 space-y-1">
              {results.length > 0 ? (
                results.map((entry, idx) => {
                  const isHighlighted = idx === highlightedIndex;
                  const keyHandlers = {
                    onMouseEnter: () => setHighlightedIndex(idx),
                  };

                  if (entry.externalUrl) {
                    return (
                      <a
                        key={entry.id}
                        href={sanitizeHref(entry.externalUrl, 'https://akyin.com')}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          setQuery('');
                          onClose();
                        }}
                        {...keyHandlers}
                        className={`flex items-center justify-between gap-3 px-3.5 py-3 rounded-2xl transition-all text-left ${
                          isHighlighted
                            ? 'bg-white shadow-xs border border-[#0071E3]/25'
                            : 'hover:bg-white/75 border border-transparent'
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-white/90 border border-[#E8E8ED] flex items-center justify-center shrink-0 mt-0.5">
                            {renderIcon(entry.category)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 text-[11px] text-[#6E6E73]">
                              <span className="font-semibold text-[#0071E3]">
                                {entry.categoryLabel}
                              </span>
                            </div>
                            <p className="text-sm font-bold text-[#1D1D1F] truncate">
                              {entry.title}
                            </p>
                            <p className="text-xs text-[#6E6E73] truncate">
                              {entry.subtitle}
                            </p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-[#0071E3] shrink-0" aria-hidden="true" />
                      </a>
                    );
                  }

                  return (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => handleSelectEntry(entry)}
                      {...keyHandlers}
                      className={`w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-2xl transition-all text-left cursor-pointer ${
                        isHighlighted
                          ? 'bg-white shadow-xs border border-[#1D1D1F]/15'
                          : 'hover:bg-white/75 border border-transparent'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-white/90 border border-[#E8E8ED] flex items-center justify-center shrink-0 mt-0.5">
                          {renderIcon(entry.category)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-[11px] text-[#6E6E73]">
                            <span className="font-semibold text-[#6E6E73]">
                              {entry.categoryLabel}
                            </span>
                            {entry.route && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="font-mono-num">{entry.route}</span>
                              </>
                            )}
                          </div>
                          <p className="text-sm font-bold text-[#1D1D1F] truncate">
                            {entry.title}
                          </p>
                          <p className="text-xs text-[#6E6E73] truncate">
                            {entry.subtitle}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#6E6E73] shrink-0" aria-hidden="true" />
                    </button>
                  );
                })
              ) : (
                <div className="py-10 px-4 text-center space-y-3">
                  <p className="text-sm font-semibold text-[#1D1D1F]">
                    No results found for &ldquo;{query.trim()}&rdquo;
                  </p>
                  <p className="text-xs text-[#6E6E73]">
                    Try searching for a venture name (Publishing, Marketing, Thrift, AICalc, Kartigo, BizNXT, Budget Bazaar) or a page like Pricing, Advisory, or Contact.
                  </p>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setQuery('');
                        setActiveCategory('all');
                        inputRef.current?.focus();
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-white border border-[#E8E8ED] text-xs font-semibold text-[#1D1D1F] hover:bg-[#F5F5F7] cursor-pointer"
                    >
                      Reset Search
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setQuery('');
                        onClose();
                        onNavigate('/sitemap');
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-[#1D1D1F] text-xs font-semibold text-white hover:opacity-90 cursor-pointer"
                    >
                      Open Sitemap
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Keyboard Navigation Hint Footer */}
            <div className="px-4 sm:px-5 py-2.5 bg-white/40 border-t border-[#1D1D1F]/8 flex items-center justify-between text-[11px] text-[#6E6E73]">
              <span className="hidden sm:inline">
                Use ↑↓ arrows to select · Enter to open · Esc to close
              </span>
              <span className="sm:hidden">Tap any result to navigate</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigate('/sitemap');
                }}
                className="font-semibold text-[#1D1D1F] hover:underline cursor-pointer"
              >
                View Full Sitemap
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
