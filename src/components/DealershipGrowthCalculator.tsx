import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Calculator,
  Car,
  CheckCircle2,
  Filter,
  IndianRupee,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { VehicleSegmentKey } from './AutomotiveResultsSection';
import { GlassButton, GlassCard, GlassPanel } from './liquid-glass';

type EstimationMode = 'aggressive' | 'conservative';

interface SegmentBenchmark {
  id: VehicleSegmentKey;
  label: string;
  subtitle: string;
  avgCplInr: number;
  qualificationRate: number;
  testDriveRate: number;
  bookingRateFromTd: number;
}

const SEGMENT_BENCHMARKS: SegmentBenchmark[] = [
  {
    id: 'mass-market',
    label: 'Volume & Hatchbacks',
    subtitle: 'High-volume commuter & compact cars',
    avgCplInr: 220,
    qualificationRate: 0.62,
    testDriveRate: 0.42,
    bookingRateFromTd: 0.28,
  },
  {
    id: 'suv-mid',
    label: 'Mid-Segment & SUVs',
    subtitle: 'Family SUVs, crossovers & sedans',
    avgCplInr: 340,
    qualificationRate: 0.64,
    testDriveRate: 0.46,
    bookingRateFromTd: 0.25,
  },
  {
    id: 'luxury-ev',
    label: 'Luxury & Premium EVs',
    subtitle: 'High-ticket luxury & electric flagships',
    avgCplInr: 720,
    qualificationRate: 0.58,
    testDriveRate: 0.48,
    bookingRateFromTd: 0.22,
  },
];

const BUDGET_PRESETS = [75000, 150000, 300000, 500000];

interface DealershipGrowthCalculatorProps {
  monthlyBudget?: number;
  onChangeBudget?: (budget: number) => void;
  segmentId?: VehicleSegmentKey;
  onChangeSegment?: (segmentId: VehicleSegmentKey) => void;
  onRequestAudit: (summary: {
    budget: number;
    segmentLabel: string;
    totalEnquiries: number;
    qualifiedLeads: number;
    testDrives: number;
    projectedBookings: number;
    scenarioLabel?: string;
  }) => void;
}

const ESTIMATION_SCENARIOS: Record<
  EstimationMode,
  {
    label: string;
    subtitle: string;
    cplMultiplier: number;
    qualDelta: number;
    tdDelta: number;
    bookingDelta: number;
  }
> = {
  aggressive: {
    label: 'Aggressive Growth',
    subtitle: 'Optimized lead volume via AKYIN two-tier vetting & WhatsApp booking workflows',
    cplMultiplier: 0.85,
    qualDelta: 0.08,
    tdDelta: 0.08,
    bookingDelta: 0.05,
  },
  conservative: {
    label: 'Conservative Baseline',
    subtitle: 'Standard industry conversion without compounding creative or CRM optimization',
    cplMultiplier: 1.16,
    qualDelta: -0.16,
    tdDelta: -0.12,
    bookingDelta: -0.06,
  },
};

function computeScenarioEstimates(
  safeBudget: number,
  segment: SegmentBenchmark,
  mode: EstimationMode
) {
  const cfg = ESTIMATION_SCENARIOS[mode];
  const effectiveCpl = Math.max(90, Math.round(segment.avgCplInr * cfg.cplMultiplier));
  const qualRate = Math.min(0.76, Math.max(0.36, segment.qualificationRate + cfg.qualDelta));
  const tdRate = Math.min(0.58, Math.max(0.24, segment.testDriveRate + cfg.tdDelta));
  const bookingRate = Math.min(0.36, Math.max(0.14, segment.bookingRateFromTd + cfg.bookingDelta));

  const totalEnquiries = Math.round(safeBudget / effectiveCpl);
  const qualifiedLeads = Math.round(totalEnquiries * qualRate);
  const testDrives = Math.round(qualifiedLeads * tdRate);
  const projectedBookings = Math.max(1, Math.round(testDrives * bookingRate));
  const costPerQualifiedLead =
    qualifiedLeads > 0 ? Math.round(safeBudget / qualifiedLeads) : 0;

  return {
    safeBudget,
    effectiveCpl,
    qualRate,
    tdRate,
    bookingRate,
    totalEnquiries,
    qualifiedLeads,
    testDrives,
    projectedBookings,
    costPerQualifiedLead,
  };
}

export function DealershipGrowthCalculator({
  monthlyBudget: controlledBudget,
  onChangeBudget,
  segmentId: controlledSegment,
  onChangeSegment,
  onRequestAudit,
}: DealershipGrowthCalculatorProps) {
  const shouldReduceMotion = useReducedMotion();
  const [internalBudget, setInternalBudget] = useState<number>(150000);
  const [internalSegment, setInternalSegment] = useState<VehicleSegmentKey>('suv-mid');
  const [estimationMode, setEstimationMode] = useState<EstimationMode>('aggressive');

  const monthlyBudget = controlledBudget ?? internalBudget;
  const segmentId = controlledSegment ?? internalSegment;

  const setMonthlyBudget = (val: number) => {
    if (onChangeBudget) onChangeBudget(val);
    else setInternalBudget(val);
  };

  const setSegmentId = (val: VehicleSegmentKey) => {
    if (onChangeSegment) onChangeSegment(val);
    else setInternalSegment(val);
  };

  const segment =
    SEGMENT_BENCHMARKS.find((s) => s.id === segmentId) ?? SEGMENT_BENCHMARKS[1];

  const { estimates, conservativeEstimates, aggressiveEstimates } = useMemo(() => {
    const safeBudget = Math.max(25000, Math.min(2000000, monthlyBudget || 0));
    const conservative = computeScenarioEstimates(safeBudget, segment, 'conservative');
    const aggressive = computeScenarioEstimates(safeBudget, segment, 'aggressive');

    return {
      estimates: estimationMode === 'aggressive' ? aggressive : conservative,
      conservativeEstimates: conservative,
      aggressiveEstimates: aggressive,
    };
  }, [monthlyBudget, segment, estimationMode]);

  const activeScenario = ESTIMATION_SCENARIOS[estimationMode];

  const formatInr = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);

  const handleBudgetInputChange = (raw: string) => {
    const numeric = Number(raw.replace(/[^0-9]/g, ''));
    if (!Number.isNaN(numeric)) {
      setMonthlyBudget(Math.min(2000000, numeric));
    }
  };

  return (
    <section
      id="growth-calculator"
      className="py-20 lg:py-28 bg-[#FFFFFF] border-t border-[#E8E8ED]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full frosted-glass-pill text-xs font-semibold text-[#1D1D1F]">
            <Calculator className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
            <span>Interactive Dealership Estimator · Synced with Forecast Chart</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
            Dealership Growth Calculator.
          </h2>
          <p className="text-base text-[#6E6E73] leading-relaxed">
            Adjust your monthly digital advertising budget and vehicle segment to estimate potential enquiry volume, qualified leads, and showroom test drives using AKYIN benchmarks.
          </p>
        </div>

        <GlassPanel className="p-6 sm:p-10 bg-gradient-to-br from-white via-purple-50/25 to-amber-50/25">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Controls */}
            <div className="lg:col-span-5 space-y-7">
              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                  1. Select Dealership Vehicle Segment
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {SEGMENT_BENCHMARKS.map((seg) => {
                    const active = seg.id === segmentId;
                    return (
                      <button
                        key={seg.id}
                        type="button"
                        onClick={() => setSegmentId(seg.id)}
                        className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer border flex items-center justify-between gap-3 ${
                          active
                            ? 'liquid-glass-pill-dark text-white border-[#1D1D1F] shadow-md'
                            : 'bg-white/85 hover:bg-white text-[#1D1D1F] border-[#E8E8ED]'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-bold">{seg.label}</p>
                          <p
                            className={`text-xs mt-0.5 ${
                              active ? 'text-white/75' : 'text-[#6E6E73]'
                            }`}
                          >
                            {seg.subtitle}
                          </p>
                        </div>
                        <span
                          className={`font-mono-num text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                            active
                              ? 'bg-white/15 text-white'
                              : 'bg-[#F5F5F7] text-[#1D1D1F]'
                          }`}
                        >
                          ~₹{seg.avgCplInr}/lead
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-[#E8E8ED]">
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="dealer-budget-input"
                    className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]"
                  >
                    2. Monthly Ad Budget (INR)
                  </label>
                  <div className="relative w-40">
                    <IndianRupee
                      className="w-3.5 h-3.5 text-[#6E6E73] absolute left-3 top-1/2 -translate-y-1/2"
                      aria-hidden="true"
                    />
                    <input
                      id="dealer-budget-input"
                      type="text"
                      inputMode="numeric"
                      value={monthlyBudget}
                      onChange={(e) => handleBudgetInputChange(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#E8E8ED] bg-white font-mono-num text-sm font-bold text-[#1D1D1F] focus:outline-none focus:border-[#1D1D1F]"
                    />
                  </div>
                </div>

                <input
                  aria-label="Monthly advertising budget slider"
                  type="range"
                  min={50000}
                  max={1000000}
                  step={25000}
                  value={Math.min(1000000, Math.max(50000, monthlyBudget))}
                  onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                  className="w-full accent-[#1D1D1F] cursor-pointer"
                />

                <div className="flex items-center justify-between text-[11px] font-mono-num text-[#6E6E73]">
                  <span>₹50,000</span>
                  <span>₹5,00,000</span>
                  <span>₹10,00,000</span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {BUDGET_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setMonthlyBudget(preset)}
                      className={`px-3 py-1.5 rounded-full font-mono-num text-xs font-semibold transition-all cursor-pointer ${
                        monthlyBudget === preset
                          ? 'bg-[#1D1D1F] text-white'
                          : 'bg-white border border-[#E8E8ED] text-[#1D1D1F] hover:bg-[#F5F5F7]'
                      }`}
                    >
                      {formatInr(preset)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Estimated Funnel Outputs */}
            <div className="lg:col-span-7 space-y-6">
              {/* Scenario Mode Switcher */}
              <div className="rounded-2xl border border-[#E8E8ED] bg-white/85 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-[#1D1D1F]">
                    Estimation Model · {activeScenario.label}
                  </p>
                  <p className="text-[11px] text-[#6E6E73]">
                    {activeScenario.subtitle}
                  </p>
                </div>

                <div
                  role="group"
                  aria-label="Switch estimation between Aggressive Growth and Conservative Baseline"
                  className="inline-flex p-1 rounded-xl bg-[#F5F5F7] border border-[#E8E8ED] self-start sm:self-auto shrink-0"
                >
                  <button
                    type="button"
                    aria-pressed={estimationMode === 'aggressive'}
                    onClick={() => setEstimationMode('aggressive')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      estimationMode === 'aggressive'
                        ? 'liquid-glass-pill-dark text-white shadow-xs'
                        : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Aggressive Growth</span>
                  </button>
                  <button
                    type="button"
                    aria-pressed={estimationMode === 'conservative'}
                    onClick={() => setEstimationMode('conservative')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      estimationMode === 'conservative'
                        ? 'liquid-glass-pill-dark text-white shadow-xs'
                        : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Conservative Baseline</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassCard className="p-5 sm:p-6 bg-white/95" tilt={true}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                      Total Ad Enquiries
                    </span>
                    <Sparkles className="w-4 h-4 text-purple-700" aria-hidden="true" />
                  </div>
                  <motion.p
                    key={`enq-${estimationMode}-${estimates.totalEnquiries}`}
                    initial={shouldReduceMotion ? false : { opacity: 0.5, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-mono-num tabular-nums text-3xl sm:text-4xl font-bold text-[#1D1D1F] mt-2"
                  >
                    {estimates.totalEnquiries.toLocaleString('en-IN')}
                  </motion.p>
                  <p className="text-xs text-[#6E6E73] mt-1">
                    Est. CPL{' '}
                    <span className="font-mono-num tabular-nums font-semibold text-[#1D1D1F]">
                      {formatInr(estimates.effectiveCpl)}
                    </span>{' '}
                    across Meta &amp; Google buyer intent
                  </p>
                </GlassCard>

                <GlassCard className="p-5 sm:p-6 bg-white/95" tilt={true}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                      Qualified Showroom Leads
                    </span>
                    <Filter className="w-4 h-4 text-amber-700" aria-hidden="true" />
                  </div>
                  <motion.p
                    key={`qual-${estimationMode}-${estimates.qualifiedLeads}`}
                    initial={shouldReduceMotion ? false : { opacity: 0.5, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-mono-num tabular-nums text-3xl sm:text-4xl font-bold text-purple-700 mt-2"
                  >
                    {estimates.qualifiedLeads.toLocaleString('en-IN')}
                  </motion.p>
                  <p className="text-xs text-[#6E6E73] mt-1">
                    Filtered by budget, timeline &amp; model (~{Math.round(estimates.qualRate * 100)}% pass rate)
                  </p>
                </GlassCard>

                <GlassCard className="p-5 sm:p-6 bg-white/95" tilt={true}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                      Estimated Test Drives
                    </span>
                    <Car className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                  </div>
                  <motion.p
                    key={`td-${estimationMode}-${estimates.testDrives}`}
                    initial={shouldReduceMotion ? false : { opacity: 0.5, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-mono-num tabular-nums text-3xl sm:text-4xl font-bold text-[#1D1D1F] mt-2"
                  >
                    {estimates.testDrives.toLocaleString('en-IN')}
                  </motion.p>
                  <p className="text-xs text-[#6E6E73] mt-1">
                    Showroom &amp; doorstep test drives (~{Math.round(estimates.tdRate * 100)}% of qualified)
                  </p>
                </GlassCard>

                <GlassCard className="p-5 sm:p-6 bg-white/95" tilt={true}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                      Projected Vehicle Bookings
                    </span>
                    <Users className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
                  </div>
                  <motion.p
                    key={`bk-${estimationMode}-${estimates.projectedBookings}`}
                    initial={shouldReduceMotion ? false : { opacity: 0.5, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-mono-num tabular-nums text-3xl sm:text-4xl font-bold text-emerald-700 mt-2"
                  >
                    {estimates.projectedBookings.toLocaleString('en-IN')}
                  </motion.p>
                  <p className="text-xs text-[#6E6E73] mt-1">
                    Est. cost per qualified lead:{' '}
                    <strong className="text-[#1D1D1F] font-mono-num tabular-nums">
                      {formatInr(estimates.costPerQualifiedLead)}
                    </strong>
                  </p>
                </GlassCard>
              </div>

              <div className="frosted-glass rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#E8E8ED]">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
                    <span>
                      {activeScenario.label} for {formatInr(estimates.safeBudget)}/mo ({segment.label})
                    </span>
                  </p>
                  <p className="text-[11px] text-[#6E6E73]">
                    Outcome range across scenarios:{' '}
                    <span className="font-mono-num tabular-nums font-semibold text-[#1D1D1F]">
                      {conservativeEstimates.qualifiedLeads.toLocaleString('en-IN')}–
                      {aggressiveEstimates.qualifiedLeads.toLocaleString('en-IN')}
                    </span>{' '}
                    qualified leads &amp;{' '}
                    <span className="font-mono-num tabular-nums font-semibold text-[#1D1D1F]">
                      {conservativeEstimates.projectedBookings.toLocaleString('en-IN')}–
                      {aggressiveEstimates.projectedBookings.toLocaleString('en-IN')}
                    </span>{' '}
                    bookings/mo.
                  </p>
                </div>

                <GlassButton
                  variant="primary"
                  size="md"
                  className="shrink-0"
                  onClick={() =>
                    onRequestAudit({
                      budget: estimates.safeBudget,
                      segmentLabel: segment.label,
                      totalEnquiries: estimates.totalEnquiries,
                      qualifiedLeads: estimates.qualifiedLeads,
                      testDrives: estimates.testDrives,
                      projectedBookings: estimates.projectedBookings,
                      scenarioLabel: activeScenario.label,
                    })
                  }
                >
                  <span>Request Custom Audit</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </GlassButton>
              </div>
            </div>
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}
