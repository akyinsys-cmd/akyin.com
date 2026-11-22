import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { AppRoute, VENTURES_PORTFOLIO } from '../data/akyinData';
import { EditorialReveal } from '../components/EditorialReveal';
import { ResilientImage } from '../components/ResilientImage';

interface BusinessesPageProps {
  onNavigate: (route: AppRoute) => void;
  onStartEnquiry: (options: {
    category: string;
    vertical: string;
    enquiryType?: string;
  }) => void;
}

export function BusinessesPage({ onNavigate, onStartEnquiry }: BusinessesPageProps) {
  return (
    <div>
      <section className="bg-[#EFE9DE] text-[#292722] pt-28 pb-16 lg:pt-36 lg:pb-20 border-b border-[#D9CCB9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <p className="text-xs font-semibold tracking-wide text-[#B66A50]">
            AKYIN Ventures · Portfolio Directory
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-balance">
            Our Businesses &amp; Operating Verticals.
          </h1>
          <p className="text-base sm:text-lg text-[#77736C] max-w-2xl leading-relaxed">
            Explore each dedicated venture under AKYIN Ventures, visit independent platforms, or initiate a direct vertical enquiry.
          </p>
        </div>
      </section>

      <section className="py-20 bg-[#F7F5F0]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {VENTURES_PORTFOLIO.map((venture) => (
            <article
              key={venture.id}
              className="group bg-[#FFFFFF] rounded-2xl border border-[#D9CCB9] overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div>
                <div className="aspect-[16/9] bg-[#EFE9DE] overflow-hidden">
                  <ResilientImage
                    src={venture.image}
                    alt={venture.imageAlt}
                    loading="lazy"
                    fallbackTitle={venture.name}
                    className="w-full h-full"
                    imageClassName="group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-7 sm:p-8 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-[#77736C]">
                    <span className="font-mono-num font-bold text-[#B66A50]">
                      {venture.code}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{venture.sector}</span>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-[#292722] group-hover:text-[#B66A50] transition-colors">
                    {venture.name}
                  </h2>
                  <p className="text-sm font-semibold text-[#83866A]">
                    {venture.positioning}
                  </p>
                  <p className="text-sm text-[#77736C] leading-relaxed">
                    {venture.description}
                  </p>
                </div>
              </div>

              <div className="px-7 sm:px-8 pb-7 pt-4 border-t border-[#EFE9DE] flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigate(venture.route)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#B66A50] hover:bg-[#9E5740] text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>Open Page</span>
                    <ArrowRight
                      className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onStartEnquiry({
                        category:
                          venture.id === 'publishing'
                            ? 'Publishing Enquiry'
                            : venture.id === 'marketing'
                              ? 'Marketing Services Enquiry'
                              : venture.id === 'store'
                                ? 'Retail and Store Enquiry'
                                : venture.id === 'aicalc'
                                  ? 'AICalc Enquiry'
                                  : venture.id === 'kartigo'
                                    ? 'Kartigo Business Enquiry'
                                    : venture.id === 'biznxt'
                                      ? 'BizNXT Consulting Enquiry'
                                      : 'Budget Bazaar Enquiry',
                        vertical:
                          venture.id === 'publishing'
                            ? 'Akyin Publishing'
                            : venture.id === 'marketing'
                              ? 'Akyin Marketing'
                              : venture.id === 'store'
                                ? 'Akyin Store / AKYIN THRIFT'
                                : venture.id === 'aicalc'
                                  ? 'AICalc (aicalc.in)'
                                  : venture.id === 'kartigo'
                                    ? 'Kartigo (kartigo.online)'
                                    : venture.id === 'biznxt'
                                      ? 'BizNXT (biznxt.online)'
                                      : 'Budget Bazaar (budgetbazaar.org)',
                      })
                    }
                    className="px-4 py-2 rounded-lg border border-[#D9CCB9] hover:border-[#B66A50] text-xs font-semibold text-[#292722] transition-colors cursor-pointer"
                  >
                    Enquire
                  </button>
                </div>

                {venture.externalUrl && (
                  <a
                    href={venture.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#77736C] hover:text-[#B66A50]"
                  >
                    {venture.externalLabel}
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </EditorialReveal>
      </section>
    </div>
  );
}
