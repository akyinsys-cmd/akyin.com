import { ArrowRight, Globe2 } from 'lucide-react';
import { AppRoute, OFFICIAL_CONTACT } from '../data/akyinData';
import { EditorialReveal } from './EditorialReveal';
import { GlassButton, GlassPanel } from './liquid-glass';

interface InternationalAvailabilitySectionProps {
  onNavigate: (route: AppRoute) => void;
  sectionId?: string;
}

export function InternationalAvailabilitySection({
  onNavigate,
  sectionId = 'business-across-borders',
}: InternationalAvailabilitySectionProps) {
  return (
    <section
      id={sectionId}
      className="py-20 lg:py-24 bg-[#F5F5F7] border-t border-[#E8E8ED]"
    >
      <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GlassPanel className="p-8 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-[0.08em] uppercase text-[#0071E3]">
              <Globe2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{OFFICIAL_CONTACT.regionIndicator}</span>
              <span aria-hidden="true" className="text-[#A1A1A6]">·</span>
              <span className="text-[#6E6E73] normal-case tracking-normal font-medium">
                {OFFICIAL_CONTACT.internationalSupportLine}
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.025em] leading-[1.1] text-[#1D1D1F] text-balance">
              Business Across Borders.
            </h2>

            <p className="text-base sm:text-lg font-medium text-[#1D1D1F]">
              {OFFICIAL_CONTACT.internationalPositioning}
            </p>

            <p className="text-base text-[#6E6E73] leading-relaxed max-w-2xl">
              AKYIN works with businesses and entrepreneurs across India and the UAE, offering business growth, digital solutions, marketing and publishing initiatives.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="rounded-2xl bg-[#FFFFFF] border border-[#E8E8ED] p-4 shadow-2xs space-y-1">
                <p className="text-base font-semibold text-[#1D1D1F]">
                  India 🇮🇳
                </p>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  Direct client delivery, marketing retainers, publishing &amp; consulting.
                </p>
              </div>
              <div className="rounded-2xl bg-[#FFFFFF] border border-[#E8E8ED] p-4 shadow-2xs space-y-1">
                <p className="text-base font-semibold text-[#1D1D1F]">
                  United Arab Emirates 🇦🇪
                </p>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  Cross-border digital growth, automotive marketing &amp; advisory support.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <p className="text-[11px] text-[#6E6E73]">
                Cross-border service availability across India and the UAE.
              </p>
              <GlassButton
                variant="primary"
                size="md"
                href="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/contact');
                }}
              >
                <span>Connect With AKYIN</span>
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </GlassButton>
            </div>
          </div>
        </GlassPanel>
      </EditorialReveal>
    </section>
  );
}
