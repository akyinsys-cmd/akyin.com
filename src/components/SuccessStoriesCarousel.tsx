import { useEffect, useState } from 'react';
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
import { AppRoute } from '../data/akyinData';

interface SuccessStory {
  id: string;
  vertical: 'automotive' | 'b2b';
  verticalTag: string;
  metricValue: string;
  metricLabel: string;
  headline: string;
  quote: string;
  clientName: string;
  role: string;
  organization: string;
  location: string;
  targetRoute: AppRoute;
  ctaLabel: string;
}

const CLIENT_SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 'story-autoclub',
    vertical: 'automotive',
    verticalTag: 'Automotive Dealership Growth',
    metricValue: '+42%',
    metricLabel: 'Test-Drive Completion Rate',
    headline: 'Separating Meta Lead Generation from Automated Buyer Screening',
    quote:
      'By keeping paid Meta campaigns distinct from automated WhatsApp lead qualification, our showroom floor stopped chasing cold enquiries. Within 60 days, test-drive completion climbed 42% across branches.',
    clientName: 'Praveen Rajagopalan',
    role: 'Managing Director',
    organization: 'AutoClub Multi-Brand Dealership Network',
    location: 'Bengaluru, India',
    targetRoute: '/marketing/automotive',
    ctaLabel: 'Explore Automotive Marketing',
  },
  {
    id: 'story-deccan-ev',
    vertical: 'automotive',
    verticalTag: 'Automotive Showroom Sales',
    metricValue: '18 min',
    metricLabel: 'Median Qualified Lead Handover',
    headline: 'Faster Lead Triage & Structured Floor Sales Coaching',
    quote:
      'AKYIN’s lead quality scorecard and ₹25,000 showroom coaching workshop aligned our digital marketing desk with sales executives. Test-drive no-shows dropped sharply in the very first month.',
    clientName: 'Vikramaditya Rao',
    role: 'Dealer Principal',
    organization: 'Deccan Mobility & EV Retail',
    location: 'Hyderabad, India',
    targetRoute: '/marketing/automotive',
    ctaLabel: 'View Dealership Solutions',
  },
  {
    id: 'story-kartigo-b2b',
    vertical: 'b2b',
    verticalTag: 'B2B Stock Commerce · Kartigo',
    metricValue: '3.2x',
    metricLabel: 'Wholesale Reorder Velocity',
    headline: 'Predictable Commercial Lot Sourcing Without Middleman Friction',
    quote:
      'Kartigo.online streamlined how our regional distribution team sources commercial bulk lots. Transparent unit economics and verified inventory blocks cut procurement turnaround by more than half.',
    clientName: 'Ramesh Patel',
    role: 'Wholesale Logistics Director',
    organization: 'Gujarat Commercial Trade',
    location: 'Ahmedabad, India',
    targetRoute: '/ventures/kartigo',
    ctaLabel: 'Explore Kartigo.online',
  },
  {
    id: 'story-biznxt-b2b',
    vertical: 'b2b',
    verticalTag: 'B2B Advisory · BizNXT',
    metricValue: '28%',
    metricLabel: 'Higher B2B Pipeline Conversion',
    headline: 'Unit-Economics Clarity Before Multi-City Commercial Expansion',
    quote:
      'BizNXT and AKYIN Business Advisory gave our leadership board an unvarnished audit of customer acquisition costs and distributor margins before we committed capital to two new states.',
    clientName: 'Priya Nambiar',
    role: 'Managing Partner',
    organization: 'Apex Industrial & B2B Cohort',
    location: 'Chennai, India',
    targetRoute: '/ventures/biznxt',
    ctaLabel: 'Explore BizNXT.online',
  },
];

interface SuccessStoriesCarouselProps {
  onNavigate: (route: AppRoute) => void;
}

export function SuccessStoriesCarousel({ onNavigate }: SuccessStoriesCarouselProps) {
  const shouldReduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<'all' | 'automotive' | 'b2b'>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const visibleStories =
    filter === 'all'
      ? CLIENT_SUCCESS_STORIES
      : CLIENT_SUCCESS_STORIES.filter((s) => s.vertical === filter);

  useEffect(() => {
    setActiveIndex(0);
  }, [filter]);

  useEffect(() => {
    if (shouldReduceMotion || isPaused || visibleStories.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % visibleStories.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [isPaused, shouldReduceMotion, visibleStories.length]);

  const currentStory = visibleStories[activeIndex] || visibleStories[0];

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + visibleStories.length) % visibleStories.length);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % visibleStories.length);
  };

  if (!currentStory) return null;

  return (
    <section
      id="client-success-stories"
      aria-label="Automotive and B2B Client Success Stories"
      className="py-16 lg:py-24 bg-[#FFFFFF] border-t border-[#E8E8ED]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header & Vertical Toggle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              Automotive &amp; B2B Case Highlights
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.025em] text-[#1D1D1F] text-balance">
              Client Success Stories Across Verticals.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { id: 'all', label: 'All Stories' },
                { id: 'automotive', label: 'Automotive' },
                { id: 'b2b', label: 'B2B & Wholesale' },
              ] as const
            ).map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'liquid-glass-pill-dark text-white'
                      : 'frosted-glass-pill text-[#1D1D1F] hover:bg-[#F5F5F7]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Carousel Stage */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative"
        >
          <AnimatePresence mode="wait">
            <motion.article
              key={currentStory.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="liquid-glass-panel rounded-3xl p-7 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Left Metric Pillar */}
              <div className="lg:col-span-4 frosted-glass rounded-2xl p-6 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1D1D1F]">
                  {currentStory.vertical === 'automotive' ? (
                    <Car className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
                  ) : (
                    <Building2 className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
                  )}
                  <span>{currentStory.verticalTag}</span>
                </div>
                <div>
                  <p className="font-mono-num text-4xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F]">
                    {currentStory.metricValue}
                  </p>
                  <p className="text-xs font-semibold text-[#6E6E73] mt-1">
                    {currentStory.metricLabel}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate(currentStory.targetRoute)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D1D1F] hover:underline cursor-pointer pt-1"
                >
                  <span>{currentStory.ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>

              {/* Right Narrative & Attribution */}
              <div className="lg:col-span-8 space-y-4 relative">
                <Quote
                  className="w-8 h-8 text-[#1D1D1F]/15"
                  aria-hidden="true"
                />
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1D1D1F] tracking-tight">
                  {currentStory.headline}
                </h3>
                <blockquote className="text-sm sm:text-base text-[#3A3A3F] leading-relaxed">
                  &ldquo;{currentStory.quote}&rdquo;
                </blockquote>
                <div className="pt-4 border-t border-[#1D1D1F]/10 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-sm font-bold text-[#1D1D1F]">
                      {currentStory.clientName}
                    </p>
                    <p className="text-xs text-[#6E6E73]">
                      {currentStory.role} · {currentStory.organization} ({currentStory.location})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPaused((p) => !p)}
                      aria-label={isPaused ? 'Resume success stories' : 'Pause success stories'}
                      className="w-8 h-8 rounded-full frosted-glass-pill flex items-center justify-center text-[#1D1D1F] hover:bg-white cursor-pointer"
                    >
                      {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={goPrev}
                      aria-label="Previous success story"
                      className="w-8 h-8 rounded-full frosted-glass-pill flex items-center justify-center text-[#1D1D1F] hover:bg-white cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-mono-num text-xs font-semibold text-[#6E6E73] px-1">
                      {activeIndex + 1} / {visibleStories.length}
                    </span>
                    <button
                      type="button"
                      onClick={goNext}
                      aria-label="Next success story"
                      className="w-8 h-8 rounded-full frosted-glass-pill flex items-center justify-center text-[#1D1D1F] hover:bg-white cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>

          {/* Dot Indicators */}
          <div className="flex items-center justify-center gap-2 pt-5">
            {visibleStories.map((story, idx) => (
              <button
                key={story.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`View ${story.organization} story`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === activeIndex ? 'w-6 bg-[#1D1D1F]' : 'w-2 bg-[#D1D1D6] hover:bg-[#6E6E73]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
