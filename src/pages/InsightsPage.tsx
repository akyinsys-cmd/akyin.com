import { ArrowRight } from 'lucide-react';
import { AppRoute } from '../data/akyinData';
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
    vertical: 'AKYIN Marketing · Automotive Retail',
    route: '/ventures/marketing' as AppRoute,
    title: 'Why Lead Generation and Lead Qualification Must Be Measured Separately',
    summary:
      'Automobile dealerships often lose clarity when ad agencies bundle campaign clicks with enquiry qualification under one opaque retainer. Separating Meta buyer acquisition from structured AI-assisted qualification of existing showroom enquiries gives dealership principals transparent visibility into Hot, Warm, and Future Follow-up prospects.',
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
];

export function InsightsPage({ onNavigate }: InsightsPageProps) {
  return (
    <div>
      <section className="bg-[#EFE9DE] text-[#292722] pt-28 pb-16 lg:pt-36 lg:pb-20 border-b border-[#D9CCB9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <p className="text-xs font-semibold tracking-wide text-[#B66A50]">
            AKYIN Ventures · Perspectives &amp; Business Philosophy
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-balance">
            Operating Perspectives Across Our Five Verticals.
          </h1>
          <p className="text-base sm:text-lg text-[#77736C] max-w-2xl leading-relaxed">
            Practical principles guiding how AKYIN Ventures builds, separates, and operates businesses across publishing, automotive marketing, fashion retail, AI utilities, and B2B stock commerce.
          </p>
        </div>
      </section>

      <section className="py-20 bg-[#F7F5F0]">
        <EditorialReveal className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {VENTURE_PERSPECTIVES.map((item) => (
            <article
              key={item.number}
              className="bg-[#FFFFFF] rounded-2xl border border-[#D9CCB9] p-7 sm:p-9 space-y-4"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#77736C]">
                <span className="font-mono-num font-bold text-[#B66A50]">{item.number}</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-[#83866A]">{item.vertical}</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-[#292722] text-balance">
                {item.title}
              </h2>
              <p className="text-sm sm:text-base text-[#77736C] leading-relaxed">
                {item.summary}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate(item.route)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B66A50] hover:underline transition-colors cursor-pointer"
                >
                  Explore Related Venture
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </EditorialReveal>
      </section>
    </div>
  );
}
