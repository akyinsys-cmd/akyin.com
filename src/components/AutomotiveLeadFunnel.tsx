import { useState } from 'react';
import {
  ArrowRight,
  Car,
  CheckCircle2,
  Filter,
  Megaphone,
  PhoneCall,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { GlassButton, GlassPanel } from './liquid-glass';

interface FunnelStage {
  id: string;
  step: string;
  label: string;
  discipline: 'Lead Generation' | 'Rapid Response' | 'Lead Filtering & Qualification' | 'Showroom Scheduling' | 'Sales Enablement';
  retentionPercent: number;
  barWidthPercent: number;
  icon: typeof Megaphone;
  accentBg: string;
  accentText: string;
  headline: string;
  description: string;
  controls: string[];
  outputMetric: string;
}

const FUNNEL_STAGES: FunnelStage[] = [
  {
    id: 'stage-1',
    step: '01',
    label: 'Lead Generation & Demand Capture',
    discipline: 'Lead Generation',
    retentionPercent: 100,
    barWidthPercent: 100,
    icon: Megaphone,
    accentBg: 'bg-purple-100',
    accentText: 'text-purple-700',
    headline: 'Geo-Fenced Meta, Google & YouTube Buyer Acquisition',
    description:
      'Strictly separate from lead filtering, this first layer focuses purely on attracting local car buyers searching for specific models, festive exchange schemes, and financing options within your dealership catchment area.',
    controls: [
      'Hyper-local radius targeting around your showroom & rival hubs',
      'Model-specific Reels, vehicle walkthroughs & dynamic lead forms',
      'Negative keyword & audience exclusions to curb non-local clicks',
    ],
    outputMetric: '100% Raw Verified Form Submissions',
  },
  {
    id: 'stage-2',
    step: '02',
    label: 'Instant Speed-to-Lead Acknowledgement',
    discipline: 'Rapid Response',
    retentionPercent: 86,
    barWidthPercent: 88,
    icon: PhoneCall,
    accentBg: 'bg-indigo-100',
    accentText: 'text-indigo-700',
    headline: '90-Second Automated WhatsApp & OTP Verification',
    description:
      'Car buyers typically contact 2–3 nearby showrooms in the same hour. Instant automated engagement locks in buyer attention while validating genuine phone numbers before human screening begins.',
    controls: [
      'Sub-90-second WhatsApp brochure & showroom pin dispatch',
      'Automatic filtering of duplicate, invalid, or unreachable numbers',
      'Immediate buyer intent prompt (model variant & purchase window)',
    ],
    outputMetric: '86% Reachable Active Prospects',
  },
  {
    id: 'stage-3',
    step: '03',
    label: 'Lead Filtering & Qualification Layer',
    discipline: 'Lead Filtering & Qualification',
    retentionPercent: 62,
    barWidthPercent: 74,
    icon: Filter,
    accentBg: 'bg-amber-100',
    accentText: 'text-amber-800',
    headline: 'Dedicated AI + Human Telephonic Screening',
    description:
      'Our dedicated qualification desk separates serious in-market buyers from casual price browsers. Your sales executives never waste showroom floor time dialing cold or out-of-budget contacts.',
    controls: [
      'Budget & down-payment alignment verification',
      'Purchase timeline tagging: Hot (0–15 days), Warm (30 days), Cold',
      'Existing vehicle trade-in & financing pre-check capture',
    ],
    outputMetric: '62% Qualified Showroom-Ready Leads',
  },
  {
    id: 'stage-4',
    step: '04',
    label: 'CRM Dispatch & Test Drive Scheduling',
    discipline: 'Showroom Scheduling',
    retentionPercent: 34,
    barWidthPercent: 58,
    icon: Car,
    accentBg: 'bg-rose-100',
    accentText: 'text-rose-700',
    headline: 'Confirmed Showroom & Home Test-Drive Slots',
    description:
      'Qualified prospects are routed immediately into your dealership CRM or custom AKYIN tracking portal with confirmed test-drive appointment windows and automated reminders.',
    controls: [
      'Instant executive alert with full qualification notes',
      'Confirmed date, time & model preference for test drive',
      'Automated T-24h and T-2h WhatsApp visit reminders',
    ],
    outputMetric: '34% Confirmed Test-Drive Appointments',
  },
  {
    id: 'stage-5',
    step: '05',
    label: 'Sales Team Conversion & Analytics',
    discipline: 'Sales Enablement',
    retentionPercent: 14,
    barWidthPercent: 44,
    icon: TrendingUp,
    accentBg: 'bg-emerald-100',
    accentText: 'text-emerald-700',
    headline: 'Executive Follow-Up Coaching & Retail Attribution',
    description:
      'Trained showroom consultants follow structured test-drive hospitality and objection-handling playbooks while management monitors daily target attainment and cost-per-booking metrics.',
    controls: [
      'Post-test-drive structured objection & financing close script',
      'Daily manager target tracker for pending hot follow-ups',
      'Full delivery attribution back to campaign & creative level',
    ],
    outputMetric: 'High-Confidence Retail Vehicle Deliveries',
  },
];

interface AutomotiveLeadFunnelProps {
  onEnquireStage?: (stageTitle: string) => void;
}

export function AutomotiveLeadFunnel({ onEnquireStage }: AutomotiveLeadFunnelProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeStageId, setActiveStageId] = useState<string>(FUNNEL_STAGES[2].id);

  const activeStage =
    FUNNEL_STAGES.find((stage) => stage.id === activeStageId) ?? FUNNEL_STAGES[0];

  return (
    <section
      id="lead-funnel"
      className="py-20 lg:py-28 bg-[#F5F5F7] border-t border-[#E8E8ED]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full frosted-glass-pill text-xs font-semibold text-[#1D1D1F]">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
            <span>Two-Tier Quality Architecture · Interactive Process Flow</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
            How AKYIN Turns Raw Ad Clicks into Verified Showroom Visits.
          </h2>
          <p className="text-base text-[#6E6E73] leading-relaxed">
            Explore each stage of our interactive funnel below. We strictly separate{' '}
            <strong className="text-[#1D1D1F]">Lead Generation</strong> from{' '}
            <strong className="text-[#1D1D1F]">Lead Filtering &amp; Qualification</strong> so your sales executives focus exclusively on genuine buyers.
          </p>
        </div>

        {/* Interactive Funnel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Animated Funnel Stack */}
          <GlassPanel className="lg:col-span-6 p-6 sm:p-8 space-y-3.5 bg-gradient-to-b from-white/95 via-purple-50/25 to-amber-50/20">
            <div className="flex items-center justify-between text-xs text-[#6E6E73] pb-2 border-b border-[#E8E8ED]">
              <span className="font-semibold uppercase tracking-wider">
                Click or Hover Any Funnel Stage
              </span>
              <span className="font-mono-num font-semibold text-[#1D1D1F]">
                Pipeline Yield %
              </span>
            </div>

            <div className="space-y-3 flex flex-col items-center pt-1">
              {FUNNEL_STAGES.map((stage, idx) => {
                const isSelected = stage.id === activeStageId;
                const Icon = stage.icon;
                return (
                  <motion.button
                    key={stage.id}
                    type="button"
                    onClick={() => setActiveStageId(stage.id)}
                    onMouseEnter={() => setActiveStageId(stage.id)}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.35,
                      delay: idx * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.015 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
                    style={{ width: `${stage.barWidthPercent}%` }}
                    className={`min-w-[260px] rounded-2xl px-4 py-3.5 text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 border ${
                      isSelected
                        ? 'liquid-glass-pill-dark text-white border-[#1D1D1F] shadow-lg'
                        : 'bg-white/85 hover:bg-white text-[#1D1D1F] border-[#E8E8ED] shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-white/15 text-white'
                            : `${stage.accentBg} ${stage.accentText}`
                        }`}
                      >
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <span
                          className={`block text-[10px] font-mono-num font-bold uppercase tracking-wider ${
                            isSelected ? 'text-purple-200' : 'text-[#6E6E73]'
                          }`}
                        >
                          Stage {stage.step} · {stage.discipline}
                        </span>
                        <span className="block text-xs sm:text-sm font-bold truncate">
                          {stage.label}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`font-mono-num text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
                        isSelected
                          ? 'bg-white/15 text-white'
                          : 'bg-[#F5F5F7] text-[#1D1D1F]'
                      }`}
                    >
                      {stage.retentionPercent}%
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <p className="text-[11px] text-[#6E6E73] text-center pt-2">
              Progressive filtering isolates high-intent showroom prospects before CRM assignment.
            </p>
          </GlassPanel>

          {/* Right: Animated Stage Detail Inspector */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <GlassPanel className="p-7 sm:p-9 space-y-6 bg-white/90">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${activeStage.accentBg} ${activeStage.accentText}`}
                    >
                      <span>Stage {activeStage.step}</span>
                      <span aria-hidden="true">·</span>
                      <span>{activeStage.discipline}</span>
                    </span>
                    <span className="font-mono-num text-xs font-bold text-[#1D1D1F] bg-[#F5F5F7] px-3 py-1 rounded-full border border-[#E8E8ED]">
                      Funnel Yield: {activeStage.retentionPercent}%
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#1D1D1F] tracking-tight">
                      {activeStage.headline}
                    </h3>
                    <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed">
                      {activeStage.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-[#E8E8ED]">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1F]">
                      Quality Controls Applied at This Stage
                    </p>
                    <ul className="space-y-2.5">
                      {activeStage.controls.map((control) => (
                        <li
                          key={control}
                          className="flex items-start gap-2.5 text-sm text-[#1D1D1F]/90"
                        >
                          <CheckCircle2
                            className="w-4 h-4 text-purple-700 shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span>{control}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="frosted-glass-pill rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73]">
                        Stage Outcome
                      </p>
                      <p className="text-sm font-bold text-[#1D1D1F] mt-0.5">
                        {activeStage.outputMetric}
                      </p>
                    </div>

                    {onEnquireStage && (
                      <GlassButton
                        variant="primary"
                        size="sm"
                        onClick={() => onEnquireStage(activeStage.label)}
                      >
                        <span>Discuss This Layer</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </GlassButton>
                    )}
                  </div>
                </GlassPanel>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
