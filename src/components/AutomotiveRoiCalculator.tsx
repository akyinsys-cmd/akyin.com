import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Calculator,
  Car,
  CheckCircle2,
  IndianRupee,
  TrendingUp,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { GlassButton, GlassCard, GlassPanel } from './liquid-glass';

type VehicleClassKey = 'volume' | 'suv' | 'luxury';

interface VehicleClassConfig {
  id: VehicleClassKey;
  label: string;
  shortLabel: string;
  avgCplInr: number;
  qualifyRate: number;
  testDriveRate: number;
  closeRateFromTd: number;
  avgGrossMarginPerUnitInr: number;
  avgVehicleTicketInr: number;
}

const VEHICLE_CLASSES: VehicleClassConfig[] = [
  {
    id: 'volume',
    label: 'Hatchbacks & Compacts',
    shortLabel: 'Volume',
    avgCplInr: 220,
    qualifyRate: 0.62,
    testDriveRate: 0.42,
    closeRateFromTd: 0.28,
    avgGrossMarginPerUnitInr: 42000,
    avgVehicleTicketInr: 850000,
  },
  {
    id: 'suv',
    label: 'Mid-Size SUVs & Crossovers',
    shortLabel: 'Mid-SUV',
    avgCplInr: 340,
    qualifyRate: 0.64,
    testDriveRate: 0.46,
    closeRateFromTd: 0.25,
    avgGrossMarginPerUnitInr: 72000,
    avgVehicleTicketInr: 1550000,
  },
  {
    id: 'luxury',
    label: 'Luxury & Electric Flagships',
    shortLabel: 'Luxury / EV',
    avgCplInr: 720,
    qualifyRate: 0.58,
    testDriveRate: 0.48,
    closeRateFromTd: 0.22,
    avgGrossMarginPerUnitInr: 215000,
    avgVehicleTicketInr: 5200000,
  },
];

const MEDIA_BUDGET_PRESETS = [50000, 100000, 200000, 350000, 500000];
const AKYIN_MONTHLY_RETAINER_INR = 49999;

interface AutomotiveRoiCalculatorProps {
  onApplyPlan?: (summaryText: string) => void;
}

function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatCompactInr(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} L`;
  }
  return formatInr(amount);
}

export function AutomotiveRoiCalculator({ onApplyPlan }: AutomotiveRoiCalculatorProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mediaBudget, setMediaBudget] = useState<number>(150000);
  const [vehicleClassId, setVehicleClassId] = useState<VehicleClassKey>('suv');

  const activeClass =
    VEHICLE_CLASSES.find((item) => item.id === vehicleClassId) ?? VEHICLE_CLASSES[1];

  const metrics = useMemo(() => {
    const safeBudget = Math.max(30000, Math.min(1000000, mediaBudget || 30000));
    const monthlyLeads = Math.round(safeBudget / activeClass.avgCplInr);
    const qualifiedLeads = Math.round(monthlyLeads * activeClass.qualifyRate);
    const bookedTestDrives = Math.round(qualifiedLeads * activeClass.testDriveRate);
    const projectedDeliveries = Math.max(
      1,
      Math.round(bookedTestDrives * activeClass.closeRateFromTd)
    );

    const estGrossMargin = projectedDeliveries * activeClass.avgGrossMarginPerUnitInr;
    const estShowroomTurnover = projectedDeliveries * activeClass.avgVehicleTicketInr;
    const totalMonthlySpend = safeBudget + AKYIN_MONTHLY_RETAINER_INR;
    const marginRoiMultiple =
      totalMonthlySpend > 0 ? Number((estGrossMargin / totalMonthlySpend).toFixed(1)) : 0;
    const costPerTestDrive =
      bookedTestDrives > 0 ? Math.round(safeBudget / bookedTestDrives) : 0;

    return {
      safeBudget,
      monthlyLeads,
      qualifiedLeads,
      bookedTestDrives,
      projectedDeliveries,
      estGrossMargin,
      estShowroomTurnover,
      totalMonthlySpend,
      marginRoiMultiple,
      costPerTestDrive,
    };
  }, [mediaBudget, activeClass]);

  return (
    <section
      id="automotive-roi-calculator"
      className="py-20 lg:py-24 bg-[#F5F5F7] border-t border-[#E8E8ED]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-purple-700">
            <Calculator className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Dealership ROI Estimator</span>
            <span aria-hidden="true">·</span>
            <span>Monthly Media Budget Planner</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-[-0.025em] text-[#1D1D1F] text-balance">
            Estimate Monthly Leads &amp; Dealership ROI.
          </h2>

          <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed">
            Adjust your monthly Meta &amp; Google ad spend and showroom vehicle segment to preview projected enquiries, filtered test-drive leads, and indicative monthly return before media commitment.
          </p>
        </div>

        <GlassPanel className="p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-white/95 via-purple-50/20 to-white/90">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Budget & Segment Inputs */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="roi-media-budget-slider"
                    className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]"
                  >
                    Monthly Media Budget (Direct Ad Spend)
                  </label>
                  <span className="font-mono-num tabular-nums text-base sm:text-lg font-bold text-[#1D1D1F] flex items-center gap-0.5">
                    <IndianRupee className="w-4 h-4 text-purple-700 shrink-0" aria-hidden="true" />
                    <span>{metrics.safeBudget.toLocaleString('en-IN')}</span>
                  </span>
                </div>

                <input
                  id="roi-media-budget-slider"
                  type="range"
                  min={30000}
                  max={1000000}
                  step={10000}
                  value={metrics.safeBudget}
                  onChange={(e) => setMediaBudget(Number(e.target.value))}
                  aria-label="Monthly advertising media budget in INR"
                  className="w-full accent-[#1D1D1F] cursor-pointer"
                />

                <div className="flex justify-between text-[11px] font-mono-num tabular-nums text-[#6E6E73]">
                  <span>₹30,000</span>
                  <span>₹5,00,000</span>
                  <span>₹10,00,000</span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {MEDIA_BUDGET_PRESETS.map((preset) => {
                    const active = metrics.safeBudget === preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setMediaBudget(preset)}
                        className={`px-3 py-1.5 rounded-lg font-mono-num tabular-nums text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                          active
                            ? 'liquid-glass-pill-dark text-white border-[#1D1D1F]'
                            : 'bg-white/90 text-[#1D1D1F] border-[#E8E8ED] hover:bg-white'
                        }`}
                      >
                        {formatInr(preset)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2.5 pt-5 border-t border-[#E8E8ED]">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                  Showroom Inventory Category
                </p>
                <div
                  role="group"
                  aria-label="Select showroom vehicle category"
                  className="grid grid-cols-1 gap-2"
                >
                  {VEHICLE_CLASSES.map((item) => {
                    const active = item.id === vehicleClassId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setVehicleClassId(item.id)}
                        className={`px-4 py-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          active
                            ? 'liquid-glass-pill-dark text-white border-[#1D1D1F] shadow-sm'
                            : 'bg-white/85 text-[#1D1D1F] border-[#E8E8ED] hover:bg-white'
                        }`}
                      >
                        <span className="text-sm font-semibold">{item.label}</span>
                        <span
                          className={`font-mono-num tabular-nums text-xs font-semibold whitespace-nowrap shrink-0 ${
                            active ? 'text-white/85' : 'text-[#6E6E73]'
                          }`}
                        >
                          ~₹{item.avgCplInr} CPL
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live ROI & Monthly Lead Projections */}
            <div className="lg:col-span-7 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassCard className="p-5 sm:p-6 bg-white/95" tilt={false}>
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                    <span>Est. Monthly Leads</span>
                    <TrendingUp className="w-4 h-4 text-purple-700" aria-hidden="true" />
                  </div>
                  <motion.p
                    key={`roi-leads-${metrics.monthlyLeads}`}
                    initial={shouldReduceMotion ? false : { opacity: 0.6, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.16 }}
                    className="font-mono-num tabular-nums text-3xl sm:text-4xl font-bold text-[#1D1D1F] mt-2"
                  >
                    {metrics.monthlyLeads.toLocaleString('en-IN')}
                  </motion.p>
                  <p className="text-xs text-[#6E6E73] mt-1">
                    <span className="font-mono-num tabular-nums font-semibold text-purple-700">
                      {metrics.qualifiedLeads.toLocaleString('en-IN')} filtered leads
                    </span>{' '}
                    passed after AI &amp; telephonic vetting
                  </p>
                </GlassCard>

                <GlassCard className="p-5 sm:p-6 bg-white/95" tilt={false}>
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                    <span>Est. Test Drives</span>
                    <Car className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
                  </div>
                  <motion.p
                    key={`roi-td-${metrics.bookedTestDrives}`}
                    initial={shouldReduceMotion ? false : { opacity: 0.6, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.16 }}
                    className="font-mono-num tabular-nums text-3xl sm:text-4xl font-bold text-[#1D1D1F] mt-2"
                  >
                    {metrics.bookedTestDrives.toLocaleString('en-IN')}
                  </motion.p>
                  <p className="text-xs text-[#6E6E73] mt-1">
                    ~{formatInr(metrics.costPerTestDrive)} media cost per showroom test drive
                  </p>
                </GlassCard>

                <GlassCard className="p-5 sm:p-6 bg-white/95" tilt={false}>
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                    <span>Projected Deliveries</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                  </div>
                  <motion.p
                    key={`roi-del-${metrics.projectedDeliveries}`}
                    initial={shouldReduceMotion ? false : { opacity: 0.6, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.16 }}
                    className="font-mono-num tabular-nums text-3xl sm:text-4xl font-bold text-emerald-700 mt-2"
                  >
                    {metrics.projectedDeliveries.toLocaleString('en-IN')} cars
                  </motion.p>
                  <p className="text-xs text-[#6E6E73] mt-1">
                    ~{formatCompactInr(metrics.estShowroomTurnover)} gross vehicle sales value
                  </p>
                </GlassCard>

                <GlassCard className="p-5 sm:p-6 bg-white/95" tilt={false}>
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                    <span>Est. Margin ROI</span>
                    <IndianRupee className="w-4 h-4 text-purple-700" aria-hidden="true" />
                  </div>
                  <motion.p
                    key={`roi-mult-${metrics.marginRoiMultiple}`}
                    initial={shouldReduceMotion ? false : { opacity: 0.6, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.16 }}
                    className="font-mono-num tabular-nums text-3xl sm:text-4xl font-bold text-purple-700 mt-2"
                  >
                    {metrics.marginRoiMultiple}x
                  </motion.p>
                  <p className="text-xs text-[#6E6E73] mt-1">
                    ~{formatCompactInr(metrics.estGrossMargin)} est. dealer margin vs. media + ₹49,999 fee
                  </p>
                </GlassCard>
              </div>

              <div className="frosted-glass rounded-2xl p-4 sm:p-5 border border-[#E8E8ED] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  Planning estimates reflect regional Indian dealership benchmarks for {activeClass.label}. Actual CPL and showroom conversion depend on city competition, model stock, and floor follow-up speed.
                </p>

                {onApplyPlan && (
                  <GlassButton
                    variant="primary"
                    size="md"
                    className="shrink-0"
                    onClick={() =>
                      onApplyPlan(
                        `Automotive Media ROI Estimate (${activeClass.label}) — Media Budget: ${formatInr(metrics.safeBudget)}/mo | Projected: ~${metrics.monthlyLeads} leads, ~${metrics.qualifiedLeads} qualified leads, ~${metrics.bookedTestDrives} test drives & ~${metrics.projectedDeliveries} deliveries (${metrics.marginRoiMultiple}x est. dealer margin ROI).`
                      )
                    }
                  >
                    <span>Plan This Media Budget</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </GlassButton>
                )}
              </div>
            </div>
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}
