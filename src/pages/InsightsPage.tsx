import { ArrowRight } from 'lucide-react';
import { AppRoute } from '../data/akyinData';
import { AutomotiveMarketingTrends } from '../components/AutomotiveMarketingTrends';
import { EditorialReveal } from '../components/EditorialReveal';

interface InsightsPageProps {
  onNavigate: (route: AppRoute) => void;
}

const VENTURE_PERSPECTIVES = [
  {
    number: '01',
    vertical: 'AKYIN Publishing · Global Distribution',
    route: '/ventures/publishing' as AppRoute,
    title: 'Independent Publishing Through International Digital Storefronts',
    summary:
      'By publishing directly onto global marketplaces like Amazon and Google Play Books, independent houses can place practical titles such as THE DISCIPLINE CODE directly in front of international readers without geographical bottlenecks.',
  },
  {
    number: '02',
    vertical: 'AKYIN Marketing Agency · Performance & Qualification',
    route: '/ventures/marketing' as AppRoute,
    title: 'Why Lead Generation and Lead Qualification Must Be Measured Separately',
    summary:
      'Growing brands, service providers, and retail teams often lose clarity when marketing agencies bundle campaign clicks with enquiry qualification under one opaque retainer. Separating paid acquisition from structured AI-assisted qualification gives business leaders transparent visibility into Hot, Warm, and Future Follow-up prospects.',
  },
  {
    number: '03',
    vertical: 'AKYIN Store · Value Fashion Retail',
    route: '/ventures/store' as AppRoute,
    title: 'Accessible Contemporary Clothing Through Curated Discount Merchandising',
    summary:
      'AKYIN THRIFT focuses on wearable men’s and women’s fashion offered at exceptional discounts—keeping merchandising focused on fabric quality, fit, and honest value rather than artificial flash-sale clutter.',
  },
  {
    number: '04',
    vertical: 'AICalc & Kartigo · Digital Utility & B2B Trade',
    route: '/ventures/kartigo' as AppRoute,
    title: 'Building Dedicated Purpose-Built Platforms Rather Than Generic Portals',
    summary:
      'Natural-language calculation queries on AICalc.in and B2B wholesale stock opportunities on Kartigo.online operate best in clean, specialized environments tailored directly to each user workflow.',
  },
  {
    number: '05',
    vertical: 'BizNXT & Budget Bazaar · Advisory & Everyday Value Retail',
    route: '/ventures/biznxt' as AppRoute,
    title: 'Clarity in Entrepreneurial Strategy and Discipline in Household Value Retail',
    summary:
      'Whether guiding founders through early-stage business decisions at BizNXT.online or delivering everyday household essentials at budgetbazaar.org, transparent unit economics and straightforward execution matter more than inflated promises.',
  },
];

export function InsightsPage({ onNavigate }: InsightsPageProps) {
  return (
    <div>
      <section className="surface-silver-gradient text-[#1D1D1F] pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
            AKYIN Ventures · Perspectives &amp; Business Philosophy
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-[-0.025em] text-balance">
            Operating Perspectives Across Seven Verticals.
          </h1>
          <p className="text-base sm:text-lg text-[#6E6E73] max-w-2xl leading-relaxed">
            Practical principles guiding how AKYIN Ventures builds, separates, and operates businesses across publishing, full-service marketing agency growth, fashion retail, AI utilities, B2B stock commerce, consulting, and value retail.
          </p>
        </div>
      </section>

      <section className="py-20 bg-[#F5F5F7]">
        <EditorialReveal className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {VENTURE_PERSPECTIVES.map((item) => (
            <article
              key={item.number}
              className="liquid-glass-card rounded-3xl p-7 sm:p-9 space-y-4"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E6E73]">
                <span className="font-mono-num font-bold text-[#1D1D1F]">{item.number}</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-[#1D1D1F]">{item.vertical}</span>
              </div>
              <h2 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F] text-balance">
                {item.title}
              </h2>
              <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed">
                {item.summary}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate(item.route)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D1D1F] hover:underline transition-colors cursor-pointer"
                >
                  Explore Related Venture
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </EditorialReveal>
      </section>

      {/* Dynamic Automotive Marketing Trends & Benchmark Section */}
      <EditorialReveal>
        <AutomotiveMarketingTrends onNavigate={onNavigate} />
      </EditorialReveal>
    </div>
  );
}
