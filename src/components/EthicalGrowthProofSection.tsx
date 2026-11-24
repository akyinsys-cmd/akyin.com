import { useEffect, useState } from 'react';
import { ArrowRight, CalendarCheck2, Globe2, Layers3, Users2 } from 'lucide-react';
import { AppRoute, OFFICIAL_CONTACT } from '../data/akyinData';
import { ECOSYSTEM_INDUSTRY_CATEGORIES, ECOSYSTEM_STATS } from '../data/ecosystemConfig';
import { useSiteConfig } from '../context/SiteConfigContext';
import { akyinApiClient } from '../utils/AkyinApiClient';
import { addDaysIst, formatFriendlyDateIst, getTodayIstDate } from '../utils/advisoryHelpers';
import { EditorialReveal } from './EditorialReveal';
import { GlassButton, GlassPanel } from './liquid-glass';

interface EthicalGrowthProofSectionProps {
  onNavigate: (route: AppRoute) => void;
  onJumpToConsultationWidget?: () => void;
  onJumpToLeadWidget?: () => void;
  backgroundClass?: string;
}

interface NextOpenSlotSummary {
  loading: boolean;
  dateLabel: string;
  openSlotsCount: number;
  firstSlotLabel: string;
  statusText: string;
}

export function EthicalGrowthProofSection({
  onNavigate,
  onJumpToConsultationWidget,
  onJumpToLeadWidget,
  backgroundClass = 'bg-[#FFFFFF]',
}: EthicalGrowthProofSectionProps) {
  const { availability, blockedDates } = useSiteConfig();
  const [slotSummary, setSlotSummary] = useState<NextOpenSlotSummary>({
    loading: true,
    dateLabel: '',
    openSlotsCount: 0,
    firstSlotLabel: '',
    statusText: 'Checking configured IST schedule...',
  });

  useEffect(() => {
    let active = true;

    async function inspectNextAvailableSlot() {
      const todayIst = getTodayIstDate();
      for (let offset = 0; offset <= 7; offset += 1) {
        const candidateDate = addDaysIst(todayIst, offset);
        if (blockedDates.includes(candidateDate)) {
          continue;
        }
        try {
          const res = await akyinApiClient.fetchAvailability(candidateDate);
          if (!res.blocked) {
            const openSlots = res.slots.filter((s) => s.available);
            if (openSlots.length > 0) {
              if (!active) return;
              const friendly = formatFriendlyDateIst(candidateDate);
              setSlotSummary({
                loading: false,
                dateLabel: friendly,
                openSlotsCount: openSlots.length,
                firstSlotLabel: openSlots[0]?.label || '',
                statusText: `${openSlots.length} configured IST slot${openSlots.length === 1 ? '' : 's'} available on ${friendly}`,
              });
              return;
            }
          }
        } catch {
          // Continue scanning next upcoming day
        }
      }

      if (!active) return;
      setSlotSummary({
        loading: false,
        dateLabel: '',
        openSlotsCount: 0,
        firstSlotLabel: '',
        statusText: 'Direct consultation requests open via IST booking calendar',
      });
    }

    inspectNextAvailableSlot();
    return () => {
      active = false;
    };
  }, [availability, blockedDates]);

  const handleBookConsultation = () => {
    if (onJumpToConsultationWidget) {
      onJumpToConsultationWidget();
      return;
    }
    onNavigate('/advisory');
  };

  const handleDirectEnquiry = () => {
    if (onJumpToLeadWidget) {
      onJumpToLeadWidget();
      return;
    }
    onNavigate('/contact');
  };

  return (
    <section className={`py-20 lg:py-24 border-t border-[#E8E8ED] ${backgroundClass}`}>
      <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GlassPanel className="rounded-3xl p-8 sm:p-10 lg:p-12 border border-[#E8E8ED] space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#0071E3]">
                {OFFICIAL_CONTACT.regionIndicator} · Strategic Advisory &amp; Growth Execution
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-[-0.025em] text-[#1D1D1F] text-balance leading-[1.08]">
                Your Next Growth Opportunity Starts Here.
              </h2>
              <div className="space-y-1.5 text-base sm:text-lg text-[#1D1D1F] font-medium">
                <p>Ready to take your business to the next level?</p>
                <p className="text-[#6E6E73]">Start with a conversation. Build with a strategy.</p>
                <p className="text-[#6E6E73]">Let’s explore what your business can achieve.</p>
              </div>
            </div>

            {/* Real Configurable Consultation Availability Indicator */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-white/90 border border-[#E8E8ED] p-6 space-y-4 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#6E6E73]">
                      Consultation Availability (IST)
                    </p>
                    <p className="font-display text-lg font-bold text-[#1D1D1F]">
                      {slotSummary.loading
                        ? 'Checking open IST schedule...'
                        : slotSummary.statusText}
                    </p>
                  </div>
                  <CalendarCheck2 className="w-5 h-5 text-[#0071E3] shrink-0 mt-0.5" aria-hidden="true" />
                </div>

                {slotSummary.firstSlotLabel && (
                  <p className="text-xs text-[#6E6E73] leading-relaxed">
                    Next open window starts at{' '}
                    <span className="font-mono-num font-semibold text-[#1D1D1F]">
                      {slotSummary.firstSlotLabel}
                    </span>{' '}
                    (sourced live from the AKYIN advisory schedule).
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <GlassButton variant="primary" size="md" onClick={handleBookConsultation}>
                    <span>Book Consultation</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </GlassButton>
                  <GlassButton variant="glass" size="md" onClick={handleDirectEnquiry}>
                    <span>Send Direct Enquiry</span>
                  </GlassButton>
                </div>
              </div>
            </div>
          </div>

          {/* Grounded Proof Strip (Only authentic business data & capabilities) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-8 border-t border-[#1D1D1F]/8">
            <div className="rounded-2xl bg-[#F5F5F7]/85 border border-[#E8E8ED] p-5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#6E6E73]">
                <Users2 className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
                <span>Business Relationships</span>
              </div>
              <p className="font-mono-num text-2xl font-bold text-[#1D1D1F]">
                {ECOSYSTEM_STATS.clientsHandledCount} Businesses Handled
              </p>
              <p className="text-xs text-[#6E6E73]">
                Active and historical commercial engagements across marketing, advisory, and trade.
              </p>
            </div>

            <div className="rounded-2xl bg-[#F5F5F7]/85 border border-[#E8E8ED] p-5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#6E6E73]">
                <Globe2 className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
                <span>Regional Service Coverage</span>
              </div>
              <p className="font-display text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                {OFFICIAL_CONTACT.regionIndicator}
              </p>
              <p className="text-xs text-[#6E6E73]">
                {OFFICIAL_CONTACT.internationalSupportLine}
              </p>
            </div>

            <div className="rounded-2xl bg-[#F5F5F7]/85 border border-[#E8E8ED] p-5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#6E6E73]">
                <Layers3 className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
                <span>Multi-Sector Expertise</span>
              </div>
              <p className="font-mono-num text-2xl font-bold text-[#1D1D1F]">
                {ECOSYSTEM_INDUSTRY_CATEGORIES.length} Industry Categories
              </p>
              <p className="text-xs text-[#6E6E73]">
                Automotive, retail, cosmetics, B2B supply, publishing, consulting &amp; SaaS.
              </p>
            </div>
          </div>
        </GlassPanel>
      </EditorialReveal>
    </section>
  );
}
