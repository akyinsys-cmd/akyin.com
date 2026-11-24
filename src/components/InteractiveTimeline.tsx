import { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { AppRoute } from '../data/akyinData';
import { GlassButton } from './liquid-glass';

interface TimelineMilestone {
  step: string;
  phase: string;
  title: string;
  domain: string;
  summary: string;
  highlights: string[];
  route: AppRoute;
  routeLabel: string;
}

const MILESTONES: TimelineMilestone[] = [
  {
    step: '01',
    phase: 'Phase 01 · Industry & Commercial Foundation',
    title: '16 Years of Multi-Sector & Automotive Industry Experience',
    domain: 'Commercial Operations · Maruti Suzuki to Audi',
    summary:
      'Sixteen years of practical sales, showroom, and enterprise customer operations experience—spanning high-volume passenger showrooms through luxury automotive brands—established a disciplined understanding of buyer behavior, lead follow-up, and high-trust conversion.',
    highlights: [
      'Deep commercial discipline built across competitive retail & luxury brands',
      'Root-cause insight into enquiry leakage and lead conversion gaps',
      'Practical framework applied today across all AKYIN Marketing Agency clients',
    ],
    route: '/ventures/marketing',
    routeLabel: 'Explore AKYIN Marketing Agency',
  },
  {
    step: '02',
    phase: 'Phase 02 · Global Publishing',
    title: 'Launch of AKYIN Publishing & THE DISCIPLINE CODE',
    domain: 'Amazon Author Store · Google Play Books',
    summary:
      'AKYIN Publishing established an independent publishing initiative distributing original titles internationally on digital and print marketplaces, anchored by THE DISCIPLINE CODE by Akyin.',
    highlights: [
      'International availability across Amazon and Google Play Books',
      'Focused non-fiction and practical mindset publishing',
      'Direct author storefront presence for global readers',
    ],
    route: '/ventures/publishing',
    routeLabel: 'Explore AKYIN Publishing',
  },
  {
    step: '03',
    phase: 'Phase 03 · Full-Service Marketing Agency',
    title: 'Scaling AKYIN Marketing Agency & Client Retainers',
    domain: 'Performance Ads · Creative · AI Qualification · Training',
    summary:
      'Digital campaign management, content production, managed AI-assisted enquiry qualification, and executive sales training consolidated into AKYIN Marketing—delivering measurable growth retainers across business sectors alongside client engagements including AutoClub.',
    highlights: [
      '18 structured performance marketing, creative & consulting services',
      'Transparent retainer packages and published ₹25,000 sales training workshops',
      'Active multi-sector client work with clear Client attribution for AutoClub',
    ],
    route: '/ventures/marketing',
    routeLabel: 'View Agency Services & Rate Card',
  },
  {
    step: '04',
    phase: 'Phase 04 · Fashion Retail & Retail Clients',
    title: 'Curated Fashion Retail & Value Commerce Solutions',
    domain: 'AKYIN Thrift · budgetbazaar.org',
    summary:
      'Consumer commerce expanded with our owned fashion venture AKYIN THRIFT under AKYIN STORE, alongside retail performance marketing support for clients such as Budget Bazaar.',
    highlights: [
      'Accessible discounted fashion merchandising under AKYIN THRIFT',
      'Performance marketing & customer demand solutions for client Budget Bazaar',
      'Direct retail enquiry channels alongside online storefront access',
    ],
    route: '/ventures/store',
    routeLabel: 'Explore Fashion Retail',
  },
  {
    step: '05',
    phase: 'Phase 05 · Tech & B2B Client Solutions',
    title: 'Digital Solutions for AICalc.in & Kartigo.online',
    domain: 'aicalc.in · kartigo.online',
    summary:
      'Extended digital marketing and infrastructure capabilities to support key client platforms including AICalc.in (natural-language AI calculator) and Kartigo.online (structured B2B wholesale stock supply).',
    highlights: [
      'Digital infrastructure support for natural-language computation tool AICalc.in',
      'Buyer qualification and B2B growth solutions for client platform Kartigo.online',
      'Purpose-built independent digital environments tailored to client audiences',
    ],
    route: '/ventures/aicalc',
    routeLabel: 'Explore Client Showcases',
  },
  {
    step: '06',
    phase: 'Phase 06 · Corporate Hub & 58+ Client Relationships',
    title: 'Strategic Growth Advisory & Unifying AKYIN.com',
    domain: 'biznxt.online · akyin.com',
    summary:
      'AKYIN.com unified our 3 core operating ventures with our expanding portfolio of 58+ client businesses, including advisory support for BizNXT.online, high-impact marketing packages, and Google-integrated scheduling.',
    highlights: [
      'Three core group divisions unified at akyin.com with 58+ client engagements',
      'Business guidance and advisory positioning for client platform BizNXT.online',
      'Client-side schema validation, zero-broker privacy, and streamlined advisory booking',
    ],
    route: '/ventures/biznxt',
    routeLabel: 'Explore Client Consulting Showcase',
  },
];

interface InteractiveTimelineProps {
  onNavigate: (route: AppRoute) => void;
}

export function InteractiveTimeline({ onNavigate }: InteractiveTimelineProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const activeMilestone = MILESTONES[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(MILESTONES.length - 1, prev + 1));
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold tracking-wide text-[#6E6E73]">
            Growth Trajectory · Step-by-Step Progression
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
            Milestones Across Our Diversified Ventures.
          </h2>
          <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed">
            Select any milestone in the vertical stepper to inspect how AKYIN Ventures evolved from frontline industry expertise into a seven-vertical business group and full-service marketing agency.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 print:hidden">
          <button
            type="button"
            onClick={handlePrev}
            disabled={activeIndex === 0}
            aria-label="Previous milestone"
            className="liquid-glass-cta inline-flex items-center justify-center w-10 h-10 rounded-full text-[#1D1D1F] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <span className="font-mono-num text-xs font-semibold text-[#6E6E73] px-2">
            {activeMilestone.step} / 0{MILESTONES.length}
          </span>
          <button
            type="button"
            onClick={handleNext}
            disabled={activeIndex === MILESTONES.length - 1}
            aria-label="Next milestone"
            className="liquid-glass-cta inline-flex items-center justify-center w-10 h-10 rounded-full text-[#1D1D1F] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Vertical Stepper Navigation */}
        <ol
          aria-label="AKYIN Ventures growth milestones"
          className="lg:col-span-5 relative pl-4 space-y-2 print:hidden"
        >
          <div
            aria-hidden="true"
            className="absolute left-[29px] top-6 bottom-6 w-[1.5px] bg-[#E8E8ED]"
          />

          {MILESTONES.map((item, idx) => {
            const isActive = idx === activeIndex;
            const isCompleted = idx < activeIndex;
            return (
              <li key={item.step} className="relative">
                <button
                  type="button"
                  aria-current={isActive ? 'step' : undefined}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-full text-left flex items-start gap-4 p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'liquid-glass-card border-white shadow-[0_12px_32px_rgba(0,0,0,0.06)]'
                      : 'bg-transparent border-transparent hover:bg-white/60 hover:border-white/80'
                  }`}
                >
                  <span
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-mono-num text-xs font-bold shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[#1D1D1F] text-white ring-4 ring-[#1D1D1F]/12'
                        : isCompleted
                          ? 'bg-[#3A3A3F] text-white'
                          : 'bg-[#FFFFFF] text-[#6E6E73] border border-[#E8E8ED]'
                    }`}
                  >
                    {item.step}
                  </span>

                  <div className="min-w-0 pt-0.5 space-y-0.5">
                    <p
                      className={`text-[11px] font-semibold tracking-wide ${
                        isActive ? 'text-[#1D1D1F]' : 'text-[#6E6E73]'
                      }`}
                    >
                      {item.phase}
                    </p>
                    <p className="font-display text-sm sm:text-[15px] font-semibold text-[#1D1D1F] leading-snug">
                      {item.title}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Right Interactive Active Step Detail Panel */}
        <div className="lg:col-span-7 print:hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={activeMilestone.step}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="liquid-glass-panel rounded-3xl p-7 sm:p-10 space-y-6"
            >
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-semibold tracking-wide text-[#1D1D1F]">
                    {activeMilestone.phase}
                  </span>
                  <span className="font-mono-num text-[#6E6E73]">
                    {activeMilestone.domain}
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
                  {activeMilestone.title}
                </h3>
              </div>

              <p className="text-base text-[#6E6E73] leading-relaxed">
                {activeMilestone.summary}
              </p>

              <div className="pt-4 border-t border-[#1D1D1F]/10 space-y-3">
                <p className="text-xs font-semibold tracking-wide text-[#1D1D1F]">
                  Key Milestone Outcomes
                </p>
                <ul className="space-y-2.5 text-sm text-[#1D1D1F]">
                  {activeMilestone.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2.5">
                      <span className="text-[#1D1D1F] font-bold mt-0.5" aria-hidden="true">
                        ·
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[#1D1D1F]/10 flex flex-wrap items-center justify-between gap-4">
                <GlassButton
                  variant="primary"
                  size="sm"
                  onClick={() => onNavigate(activeMilestone.route)}
                >
                  <span>{activeMilestone.routeLabel}</span>
                  <ArrowRight
                    className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </GlassButton>

                <span className="font-mono-num text-xs text-[#6E6E73]">
                  Milestone {activeMilestone.step} of 0{MILESTONES.length}
                </span>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="hidden print:block space-y-4">
          {MILESTONES.map((item) => (
            <div
              key={`print-${item.step}`}
              className="border border-[#E8E8ED] rounded-xl p-4 space-y-1.5"
            >
              <p className="text-xs font-semibold text-[#1D1D1F]">
                {item.phase} · {item.domain}
              </p>
              <h3 className="font-display text-base font-bold text-[#1D1D1F]">{item.title}</h3>
              <p className="text-xs text-[#6E6E73] leading-relaxed">{item.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
