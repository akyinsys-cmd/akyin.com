import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { AppRoute, VENTURES_PORTFOLIO } from '../data/akyinData';
import { useSiteConfig } from '../context/SiteConfigContext';
import { EditorialReveal } from '../components/EditorialReveal';
import { GlassButton } from '../components/liquid-glass';
import { ResilientImage } from '../components/ResilientImage';
import { OurClientsSection } from '../components/OurClientsSection';

interface BusinessesPageProps {
  onNavigate: (route: AppRoute) => void;
  onStartEnquiry: (options: {
    category: string;
    vertical: string;
    enquiryType?: string;
  }) => void;
}

export function BusinessesPage({ onNavigate, onStartEnquiry }: BusinessesPageProps) {
  const { ventures: ventureOverrides } = useSiteConfig();
  const displayVentures = VENTURES_PORTFOLIO.map((baseVenture) => {
    const override = ventureOverrides.find((v) => v.id === baseVenture.id);
    if (override && !override.active) return null;
    return {
      ...baseVenture,
      name: override?.title || baseVenture.name,
      sector: override?.category || baseVenture.sector,
      description: override?.description || baseVenture.description,
      externalUrl: override?.externalUrl || baseVenture.externalUrl,
    };
  }).filter((v): v is NonNullable<typeof v> => Boolean(v));

  return (
    <div>
      <section className="surface-silver-gradient text-[#1D1D1F] pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-[#E8E8ED]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
            AKYIN Ventures · Portfolio Directory
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-[-0.025em] text-balance">
            Our Businesses &amp; Operating Verticals.
          </h1>
          <p className="text-base sm:text-lg text-[#6E6E73] max-w-2xl leading-relaxed">
            Explore the three core operating ventures under AKYIN Ventures—including publishing, our full-service marketing agency (with dedicated automotive growth), and fashion retail.
          </p>
        </EditorialReveal>
      </section>

      <section className="py-20 bg-[#F5F5F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayVentures.map((venture, idx) => (
            <EditorialReveal key={venture.id} delay={(idx % 2) * 0.08} className="h-full">
              <article className="h-full group liquid-glass-card rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5">
                <div>
                  <div className="aspect-[4/3] bg-[#FFFFFF] overflow-hidden border-b border-[#E8E8ED]/70">
                    <ResilientImage
                      src={venture.image}
                      alt={venture.imageAlt}
                      loading="lazy"
                      fallbackTitle={venture.name}
                      className="w-full h-full bg-[#FFFFFF]"
                      imageClassName="object-contain p-3 sm:p-4 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-7 sm:p-8 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[#6E6E73]">
                      <span className="font-mono-num font-bold text-[#1D1D1F]">
                        {venture.code}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{venture.sector}</span>
                    </div>
                    <h2 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F] group-hover:text-[#3A3A3F] transition-colors">
                      {venture.name}
                    </h2>
                    <p className="text-sm font-semibold text-[#1D1D1F]/80">
                      {venture.positioning}
                    </p>
                    <p className="text-sm text-[#6E6E73] leading-relaxed">
                      {venture.description}
                    </p>
                  </div>
                </div>

                <div className="px-7 sm:px-8 pb-7 pt-4 border-t border-[#1D1D1F]/8 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <GlassButton
                      variant="primary"
                      size="sm"
                      onClick={() => onNavigate(venture.route)}
                    >
                      <span>Open Page</span>
                      <ArrowRight
                        className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </GlassButton>
                    <GlassButton
                      variant="subtle"
                      size="sm"
                      onClick={() =>
                        onStartEnquiry({
                          category:
                            venture.id === 'publishing'
                              ? 'Publishing Enquiry'
                              : venture.id === 'marketing'
                                ? 'Marketing Services Enquiry'
                                : 'Retail and Store Enquiry',
                          vertical:
                            venture.id === 'publishing'
                              ? 'Akyin Publishing'
                              : venture.id === 'marketing'
                                ? 'Akyin Marketing'
                                : 'Akyin Store / AKYIN THRIFT',
                        })
                      }
                    >
                      Enquire
                    </GlassButton>
                  </div>

                  {venture.externalUrl && (
                    <a
                      href={venture.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
                    >
                      {venture.externalLabel}
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </article>
            </EditorialReveal>
          ))}
        </div>
      </section>

      {/* Dedicated Client Ecosystem Section */}
      <OurClientsSection onNavigate={onNavigate} backgroundClass="bg-[#FFFFFF]" />
    </div>
  );
}
