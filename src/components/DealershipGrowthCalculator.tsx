import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Calculator,
  Car,
  CheckCircle2,
  Filter,
  IndianRupee,
  Sparkles,
  Users,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { GlassButton, GlassCard, GlassPanel } from './liquid-glass';

type SegmentKey = 'mass-market' | 'suv-mid' | 'luxury-ev';

interface SegmentBenchmark {
  id: SegmentKey;
  label: string;
  subtitle: string;
  avgCplInr: number; // Cost per raw enquiry in INR
  qualificationRate: number; // % passing lead filtering
  testDriveRate: number; // % of qualified leads completing test drive
  bookingRateFromTd: number; // % of test drives turning into bookings
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
  onRequestAudit: (summary: {
    budget: number;
    segmentLabel: string;
    totalEnquiries: number;
    qualifiedLeads: number;
    testDrives: number;
    projectedBookings: number;
  }) => void;
}

export function DealershipGrowthCalculator({
  onRequestAudit,
}: DealershipGrowthCalculatorProps) {
  const shouldReduceMotion = useReducedMotion();
  const [monthlyBudget, setMonthlyBudget] = useState<number>(150000);
  const [segmentId, setSegmentId] = useState<SegmentKey>('suv-mid');

  const segment =
    SEGMENT_BENCHMARKS.find((s) => s.id === segmentId) ?? SEGMENT_BENCHMARKS[1];

  const estimates = useMemo(() => {
    const safeBudget = Math.max(25000, Math.min(2000000, monthlyBudget || 0));
    const totalEnquiries = Math.round(safeBudget / segment.avgCplInr);
    const qualifiedLeads = Math.round(totalEnquiries * segment.qualificationRate);
    const testDrives = Math.round(qualifiedLeads * segment.testDriveRate);
    const projectedBookings = Math.max(
      1,
      Math.round(testDrives * segment.bookingRateFromTd)
    );
    const costPerQualifiedLead =
      qualifiedLeads > 0 ? Math.round(safeBudget / qualifiedLeads) : 0;

    return {
      safeBudget,
      totalEnquiries,
      qualifiedLeads,
      testDrives,
      projectedBookings,
      costPerQualifiedLead,
    };
  }, [monthlyBudget, segment]);

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
            <span>Interactive Dealership Estimator</span>
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
              {/* Vehicle Segment Selector */}
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

              {/* Monthly Ad Budget Input & Slider */}
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

                {/* Preset Chips */}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassCard className="p-5 sm:p-6 bg-white/95" tilt={true}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                      Total Ad Enquiries
                    </span>
                    <Sparkles className="w-4 h-4 text-purple-700" aria-hidden="true" />
                  </div>
                  <motion.p
                    key={estimates.totalEnquiries}
                    initial={shouldReduceMotion ? false : { opacity: 0.5, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-mono-num text-3xl sm:text-4xl font-bold text-[#1D1D1F] mt-2"
                  >
                    {estimates.totalEnquiries.toLocaleString('en-IN')}
                  </motion.p>
                  <p className="text-xs text-[#6E6E73] mt-1">
                    Estimated monthly raw Meta &amp; Google buyer inquiries
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
                    key={estimates.qualifiedLeads}
                    initial={shouldReduceMotion ? false : { opacity: 0.5, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-mono-num text-3xl sm:text-4xl font-bold text-purple-700 mt-2"
                  >
                    {estimates.qualifiedLeads.toLocaleString('en-IN')}
                  </motion.p>
                  <p className="text-xs text-[#6E6E73] mt-1">
                    Filtered by budget, timeline &amp; model (~{Math.round(segment.qualificationRate * 100)}% pass rate)
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
                    key={estimates.testDrives}
                    initial={shouldReduceMotion ? false : { opacity: 0.5, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-mono-num text-3xl sm:text-4xl font-bold text-[#1D1D1F] mt-2"
                  >
                    {estimates.testDrives.toLocaleString('en-IN')}
                  </motion.p>
                  <p className="text-xs text-[#6E6E73] mt-1">
                    Showroom &amp; doorstep test drives (~{Math.round(segment.testDriveRate * 100)}% of qualified)
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
                    key={estimates.projectedBookings}
                    initial={shouldReduceMotion ? false : { opacity: 0.5, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-mono-num text-3xl sm:text-4xl font-bold text-emerald-700 mt-2"
                  >
                    {estimates.projectedBookings.toLocaleString('en-IN')}
                  </motion.p>
                  <p className="text-xs text-[#6E6E73] mt-1">
                    Est. cost per qualified lead:{' '}
                    <strong className="text-[#1D1D1F] font-mono-num">
                      {formatInr(estimates.costPerQualifiedLead)}
                    </strong>
                  </p>
                </GlassCard>
              </div>

              {/* Action Bar */}
              <div className="frosted-glass rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#E8E8ED]">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
                    <span>
                      Benchmark projection for {formatInr(estimates.safeBudget)}/mo ({segment.label})
                    </span>
                  </p>
                  <p className="text-[11px] text-[#6E6E73]">
                    Illustrative estimate based on AKYIN dealership models, not a fixed guarantee.
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
