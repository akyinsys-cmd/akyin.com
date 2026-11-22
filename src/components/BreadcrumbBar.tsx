import { Check, ChevronRight, Home, Link2 } from 'lucide-react';
import { AppRoute } from '../data/akyinData';

interface BreadcrumbItem {
  label: string;
  route?: AppRoute;
}

const ROUTE_BREADCRUMBS: Record<Exclude<AppRoute, '/'>, BreadcrumbItem[]> = {
  '/about': [{ label: 'About Us' }],
  '/ventures': [{ label: 'Our Ventures' }],
  '/ventures/publishing': [
    { label: 'Our Ventures', route: '/ventures' },
    { label: 'AKYIN Publishing' },
  ],
  '/ventures/marketing': [
    { label: 'Our Ventures', route: '/ventures' },
    { label: 'AKYIN Marketing' },
  ],
  '/marketing/automotive': [
    { label: 'AKYIN Marketing', route: '/ventures/marketing' },
    { label: 'Automotive Marketing' },
  ],
  '/ventures/store': [
    { label: 'Our Ventures', route: '/ventures' },
    { label: 'AKYIN Store' },
  ],
  '/ventures/aicalc': [
    { label: 'Our Ventures', route: '/ventures' },
    { label: 'AICalc.in' },
  ],
  '/ventures/kartigo': [
    { label: 'Our Ventures', route: '/ventures' },
    { label: 'Kartigo.online' },
  ],
  '/ventures/biznxt': [
    { label: 'Our Ventures', route: '/ventures' },
    { label: 'BizNXT.online' },
  ],
  '/ventures/budget-bazaar': [
    { label: 'Our Ventures', route: '/ventures' },
    { label: 'Budget Bazaar' },
  ],
  '/advisory': [{ label: 'Business Advisory' }],
  '/insights': [{ label: 'Insights' }],
  '/contact': [{ label: 'Contact' }],
  '/sitemap': [{ label: 'Sitemap' }],
  '/admin': [{ label: 'Admin' }],
};

interface BreadcrumbBarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  onCopyLink: () => void;
  copied: boolean;
}

export function BreadcrumbBar({
  currentRoute,
  onNavigate,
  onCopyLink,
  copied,
}: BreadcrumbBarProps) {
  if (currentRoute === '/' || currentRoute === '/admin') {
    return null;
  }

  const trail = ROUTE_BREADCRUMBS[currentRoute];

  return (
      <div className="pt-14 lg:pt-16 liquid-glass-nav border-b border-white/80 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center justify-between gap-4">
          <nav aria-label="Breadcrumb" className="min-w-0">
            <ol className="flex items-center gap-1.5 text-xs text-[#6E6E73] overflow-x-auto whitespace-nowrap">
              <li className="inline-flex items-center shrink-0">
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/');
                  }}
                  className="inline-flex items-center gap-1.5 font-medium text-[#6E6E73] hover:text-[#1D1D1F] transition-colors rounded-md px-1.5 py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1D1F]"
                >
                  <Home className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Home</span>
                </a>
              </li>

              {trail.map((item, idx) => {
                const isLast = idx === trail.length - 1;
                return (
                  <li key={item.label} className="inline-flex items-center gap-1.5 shrink-0">
                    <ChevronRight className="w-3.5 h-3.5 text-[#A1A1A6]" aria-hidden="true" />
                    {item.route && !isLast ? (
                      <a
                        href={item.route}
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigate(item.route!);
                        }}
                        className="font-medium text-[#6E6E73] hover:text-[#1D1D1F] transition-colors rounded-md px-1.5 py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1D1F]"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <span
                        aria-current="page"
                        className="font-semibold text-[#1D1D1F] px-1 py-0.5"
                      >
                        {item.label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          <button
            type="button"
            onClick={onCopyLink}
            aria-label="Copy current page link to clipboard"
            className="liquid-glass-cta inline-flex items-center gap-1.5 px-3 py-1 rounded-full hover:border-[#1D1D1F]/40 text-[11px] font-semibold text-[#1D1D1F] transition-colors shrink-0 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-[#1D1D1F]" aria-hidden="true" />
                <span className="text-[#1D1D1F]">Copied</span>
              </>
            ) : (
              <>
                <Link2 className="w-3 h-3 text-[#1D1D1F]" aria-hidden="true" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
  );
}
