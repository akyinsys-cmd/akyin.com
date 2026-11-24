import { useCallback, useEffect, useState } from 'react';
import {
  ArrowRight,
  Building2,
  Car,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Quote,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { AppRoute, CLIENT_TESTIMONIALS } from '../data/akyinData';
import { GlassPanel } from './liquid-glass';

type ClientSegmentFilter = 'all' | 'automotive' | 'business';

interface ClientSuccessCarouselProps {
  onNavigate?: (route: AppRoute) => void;
  defaultSegment?: ClientSegmentFilter;
  sectionId?: string;
  backgroundClass?: string;
}

const SEGMENT_TABS: ReadonlyArray<{ id: ClientSegmentFilter; label: string }> = [
  { id: 'all', label: 'All Clients' },
  { id: 'automotive', label: 'Automotive Clients' },
  { id: 'business', label: 'Business & B2B' },
];

export function ClientSuccessCarousel({
  onNavigate,
  defaultSegment = 'all',
  sectionId = 'client-success',
  backgroundClass = 'bg-[#FFFFFF]',
}: ClientSuccessCarouselProps) {
  const shouldReduceMotion = useReducedMotion();
  const [segment, setSegment] = useState<ClientSegmentFilter>(defaultSegment);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const visibleTestimonials =
    segment === 'all'
      ? CLIENT_TESTIMONIALS
      : CLIENT_TESTIMONIALS.filter((item) => item.segment === segment);

  useEffect(() => {
    setSegment(defaultSegment);
  }, [defaultSegment]);

  useEffect(() => {
    setActiveIndex(0);
  }, [segment]);

  useEffect(() => {
    if (shouldReduceMotion || isPaused || visibleTestimonials.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % visibleTestimonials.length);
    }, 6800);
    return () => window.clearInterval(timer);
  }, [isPaused, shouldReduceMotion, visibleTestimonials.length]);

  const safeIndex =
    visibleTestimonials.length > 0 ? activeIndex % visibleTestimonials.length : 0;
  const current = visibleTestimonials[safeIndex];

  const handlePrev = useCallback(() => {
    if (visibleTestimonials.length === 0) return;
    setActiveIndex(
      (prev) => (prev - 1 + visibleTestimonials.length) % visibleTestimonials.length
    );
  }, [visibleTestimonials.length]);

  const handleNext = useCallback(() => {
    if (visibleTestimonials.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % visibleTestimonials.length);
  }, [visibleTestimonials.length]);

  const handleNavigateRoute = (route: AppRoute) => {
    if (onNavigate) {
      onNavigate(route);
      return;
    }
    window.history.pushState({}, '', route);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!current) return null;

  return (
    <section
      id={sectionId}
      aria-labelledby={`${sectionId}-heading`}
      className={`py-20 lg:py-24 ${backgroundClass} border-t border-[#E8E8ED]`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header & Interactive Segment Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              Verified Client Outcomes · Automotive &amp; Business
            </p>
            <h2
              id={`${sectionId}-heading`}
              className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.025em] text-[#1D1D1F] text-balance"
            >
              Client Success Across Dealerships &amp; Commercial Ventures.
            </h2>
          </div>

          <div
            role="group"
            aria-label="Filter client success testimonials by sector"
            className="flex flex-wrap items-center gap-2"
          >
            {SEGMENT_TABS.map((tab) => {
              const isSelected = segment === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSegment(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[40px] ${
                    isSelected
                      ? 'liquid-glass-pill-dark text-white shadow-xs'
                      : 'frosted-glass-pill text-[#1D1D1F] hover:bg-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Liquid Glass Carousel Stage */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Client Success Testimonials"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              handlePrev();
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              handleNext();
            }
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
          className="space-y-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1D1F]/25 rounded-3xl"
        >
          <AnimatePresence mode="wait">
            <motion.article
              key={current.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            >
              <GlassPanel className="rounded-3xl p-7 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Left Measured Outcome Pillar */}
                <div className="lg:col-span-4 frosted-glass rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1D1D1F]">
                      {current.segment === 'automotive' ? (
                        <Car className="w-4 h-4 text-[#0071E3] shrink-0" aria-hidden="true" />
                      ) : (
                        <Building2 className="w-4 h-4 text-[#1D1D1F] shrink-0" aria-hidden="true" />
                      )}
                      <span>{current.verticalLabel}</span>
                    </div>

                    <div>
                      <p className="font-mono-num tabular-nums text-4xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F]">
                        {current.metricValue}
                      </p>
                      <p className="text-sm font-semibold text-[#1D1D1F] mt-1.5">
                        {current.metricLabel}
                      </p>
                      <p className="text-xs text-[#6E6E73] mt-1">{current.timeframe}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleNavigateRoute(current.route)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D1D1F] hover:text-[#0071E3] transition-colors cursor-pointer pt-2 border-t border-[#1D1D1F]/8 whitespace-nowrap"
                  >
                    <span>{current.ctaLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  </button>
                </div>

                {/* Right Client Quote & Attribution */}
                <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <Quote className="w-8 h-8 text-[#1D1D1F]/15 shrink-0" aria-hidden="true" />
                      <span className="text-xs font-medium text-[#6E6E73]">
                        {current.segment === 'automotive' ? 'Automotive Client' : 'Business Client'} ·{' '}
                        {current.location}
                      </span>
                    </div>

                    <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F] text-balance">
                      {current.headline}
                    </h3>

                    <blockquote className="text-sm sm:text-base text-[#3A3A3F] leading-relaxed">
                      &ldquo;{current.quote}&rdquo;
                    </blockquote>
                  </div>

                  <div className="pt-5 border-t border-[#1D1D1F]/10 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-display text-base font-bold text-[#1D1D1F]">
                        {current.clientName}
                      </p>
                      <p className="text-xs text-[#6E6E73]">
                        {current.role} · {current.organization}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsPaused((p) => !p)}
                        aria-label={
                          isPaused ? 'Resume testimonial rotation' : 'Pause testimonial rotation'
                        }
                        className="w-10 h-10 rounded-full frosted-glass-pill flex items-center justify-center text-[#1D1D1F] hover:bg-white transition-colors cursor-pointer"
                      >
                        {isPaused ? (
                          <Play className="w-3.5 h-3.5" aria-hidden="true" />
                        ) : (
                          <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handlePrev}
                        aria-label="Previous client testimonial"
                        className="w-10 h-10 rounded-full frosted-glass-pill flex items-center justify-center text-[#1D1D1F] hover:bg-white transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <span className="font-mono-num tabular-nums text-xs font-semibold text-[#6E6E73] px-1.5">
                        {safeIndex + 1} / {visibleTestimonials.length}
                      </span>
                      <button
                        type="button"
                        onClick={handleNext}
                        aria-label="Next client testimonial"
                        className="w-10 h-10 rounded-full frosted-glass-pill flex items-center justify-center text-[#1D1D1F] hover:bg-white transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </GlassPanel>
            </motion.article>
          </AnimatePresence>

          {/* Quick-Select Client Switcher Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {visibleTestimonials.map((item, idx) => {
              const isSelected = idx === safeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-current={isSelected ? 'true' : undefined}
                  className={`text-left rounded-2xl p-4 transition-all duration-200 cursor-pointer border ${
                    isSelected
                      ? 'frosted-glass bg-white/95 border-[#1D1D1F]/25 shadow-sm'
                      : 'frosted-glass-card border-white/80 hover:bg-white/85'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs text-[#6E6E73]">
                    <span className="truncate font-medium">{item.organization}</span>
                    <span className="font-mono-num tabular-nums font-bold text-[#1D1D1F] shrink-0">
                      {item.metricValue}
                    </span>
                  </div>
                  <p className="font-display text-sm font-bold text-[#1D1D1F] mt-1 truncate">
                    {item.clientName}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
