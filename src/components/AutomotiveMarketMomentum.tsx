import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Pause,
  Play,
  ShieldCheck,
  TrendingUp,
  Zap,
} from 'lucide-react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { GlassPanel } from './liquid-glass';

type QualificationMaturity = 'unfiltered' | 'ai-screening' | 'full-two-tier';
type MomentumHorizon = 6 | 12;

interface MomentumDatum {
  month: string;
  leadQualityIndex: number;
  unfilteredBaselineIndex: number;
  leadRoiMultiple: number;
  showroomVisitRate: number;
  roiImprovementPct: number;
}

const MATURITY_STAGES: Record<
  QualificationMaturity,
  {
    label: string;
    description: string;
    baseLqi: number;
    monthlyLqiLift: number;
    maxLqi: number;
    baseRoi: number;
    monthlyRoiLift: number;
    slaRate: number;
  }
> = {
  unfiltered: {
    label: 'Unfiltered Ads Only',
    description: 'Raw social & search form-fills sent straight to showroom sales executives',
    baseLqi: 38,
    monthlyLqiLift: 0.6,
    maxLqi: 44,
    baseRoi: 1.6,
    monthlyRoiLift: 0.04,
    slaRate: 42,
  },
  'ai-screening': {
    label: '+ AI Lead Screening',
    description: 'Automated WhatsApp verification for budget window, vehicle model & city radius',
    baseLqi: 56,
    monthlyLqiLift: 3.4,
    maxLqi: 78,
    baseRoi: 2.4,
    monthlyRoiLift: 0.22,
    slaRate: 84,
  },
  'full-two-tier': {
    label: '+ Two-Tier Vetting & Coaching',
    description: 'AI + human telephonic qualification paired with CRM coaching & slot reminders',
    baseLqi: 66,
    monthlyLqiLift: 4.5,
    maxLqi: 92,
    baseRoi: 2.9,
    monthlyRoiLift: 0.34,
    slaRate: 94.6,
  },
};

const LIVE_SIGNALS = [
  {
    region: 'Bengaluru South · SUV Campaign',
    deltaLqi: 0.4,
    deltaRoi: 0.08,
    note: 'Two-tier telephonic budget verification raised test-drive readiness',
  },
  {
    region: 'Mumbai · Luxury EV Funnel',
    deltaLqi: 0.7,
    deltaRoi: 0.12,
    note: 'Sub-3 min WhatsApp confirmation locked weekend doorstep drive',
  },
  {
    region: 'Delhi NCR · Festive Exchange',
    deltaLqi: 0.3,
    deltaRoi: 0.05,
    note: 'Duplicate & out-of-radius leads filtered prior to CRM assignment',
  },
  {
    region: 'Hyderabad · Mid-SUV Launch',
    deltaLqi: 0.6,
    deltaRoi: 0.1,
    note: 'Sales team script calibration lifted showroom visit completion',
  },
];

export function AutomotiveMarketMomentum() {
  const [maturity, setMaturity] = useState<QualificationMaturity>('full-two-tier');
  const [horizon, setHorizon] = useState<MomentumHorizon>(6);
  const [liveStreaming, setLiveStreaming] = useState<boolean>(true);
  const [signalIndex, setSignalIndex] = useState<number>(0);

  useEffect(() => {
    if (!liveStreaming) return;
    const timer = window.setInterval(() => {
      setSignalIndex((prev) => (prev + 1) % LIVE_SIGNALS.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [liveStreaming]);

  const activeStage = MATURITY_STAGES[maturity];
  const liveSignal = LIVE_SIGNALS[signalIndex];

  const momentumData = useMemo<MomentumDatum[]>(() => {
    const rows: MomentumDatum[] = [];
    const baseRoi = activeStage.baseRoi;

    for (let m = 1; m <= horizon; m++) {
      const rawLqi = Math.min(
        activeStage.maxLqi,
        activeStage.baseLqi + (m - 1) * activeStage.monthlyLqiLift
      );
      const isLast = m === horizon;
      const adjustedLqi = Number(
        Math.min(96, rawLqi + (isLast ? liveSignal.deltaLqi : 0)).toFixed(1)
      );
      const unfilteredBaseline = Number((38 + Math.min(5, (m - 1) * 0.5)).toFixed(1));
      const roiMultiple = Number(
        (
          baseRoi +
          (m - 1) * activeStage.monthlyRoiLift +
          (isLast ? liveSignal.deltaRoi : 0)
        ).toFixed(2)
      );
      const showroomVisitRate = Number(
        Math.min(36, 12.5 + (adjustedLqi - 38) * 0.38).toFixed(1)
      );
      const roiImprovementPct = Math.max(
        0,
        Math.round(((roiMultiple - baseRoi) / Math.max(0.5, baseRoi)) * 100)
      );

      rows.push({
        month: `M${m}`,
        leadQualityIndex: adjustedLqi,
        unfilteredBaselineIndex: unfilteredBaseline,
        leadRoiMultiple: roiMultiple,
        showroomVisitRate,
        roiImprovementPct,
      });
    }
    return rows;
  }, [activeStage, horizon, liveSignal]);

  const latestPoint = momentumData[momentumData.length - 1];
  const firstPoint = momentumData[0];
  const lqiGainPoints = Number(
    ((latestPoint?.leadQualityIndex ?? 0) - (firstPoint?.leadQualityIndex ?? 0)).toFixed(1)
  );

  return (
    <section
      id="market-momentum"
      className="py-20 lg:py-28 bg-[#FFFFFF] border-t border-[#E8E8ED]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-purple-700">
              <Activity className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Market Momentum</span>
              <span aria-hidden="true">·</span>
              <span>Real-Time Lead Quality Index &amp; ROI Progression</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-[-0.025em] text-[#1D1D1F] text-balance">
              Lead Quality Index &amp; ROI Trajectory.
            </h2>
            <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed">
              Watch how AKYIN&apos;s two-tier verification compounds buyer intent quality and showroom ROI month over month compared with unfiltered social and search leads.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setLiveStreaming((prev) => !prev)}
              aria-pressed={liveStreaming}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E8E8ED] hover:border-[#1D1D1F]/35 text-xs font-semibold text-[#1D1D1F] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {liveStreaming ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
                  <span>Pause Live Index</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                  <span>Resume Live Index</span>
                </>
              )}
            </button>

            <div
              role="group"
              aria-label="Select Market Momentum horizon"
              className="inline-flex p-1 rounded-xl frosted-glass border border-[#E8E8ED]"
            >
              {([6, 12] as MomentumHorizon[]).map((months) => (
                <button
                  key={months}
                  type="button"
                  aria-pressed={horizon === months}
                  onClick={() => setHorizon(months)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-num font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    horizon === months
                      ? 'liquid-glass-pill-dark text-white shadow-xs'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  {months} Months
                </button>
              ))}
            </div>
          </div>
        </div>

        <GlassPanel className="p-6 sm:p-8 lg:p-10 space-y-8 bg-gradient-to-br from-purple-50/30 via-white to-amber-50/25">
          {/* Qualification Process Stage Switcher */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E8E8ED] pb-5">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-[#1D1D1F]">
                Qualification Layer: <span className="text-purple-700">{activeStage.label}</span>
              </p>
              <p className="text-xs text-[#6E6E73]">{activeStage.description}</p>
            </div>

            <div
              role="group"
              aria-label="Select qualification maturity level"
              className="flex flex-wrap gap-1.5 p-1 rounded-xl frosted-glass border border-[#E8E8ED] self-start lg:self-auto"
            >
              {(Object.keys(MATURITY_STAGES) as QualificationMaturity[]).map((key) => {
                const isSelected = maturity === key;
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setMaturity(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'liquid-glass-pill-dark text-white shadow-xs'
                        : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                    }`}
                  >
                    {MATURITY_STAGES[key].label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real-Time KPI Summary Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl p-5 bg-white border border-purple-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-purple-900 font-medium">
                <span>Live Lead Quality Index</span>
                <Zap className="w-4 h-4 text-purple-700" aria-hidden="true" />
              </div>
              <p className="font-mono-num tabular-nums text-3xl font-bold text-purple-700 mt-1.5">
                {latestPoint?.leadQualityIndex.toFixed(1)}
                <span className="text-sm font-medium text-[#6E6E73]"> / 100</span>
              </p>
              <p className="text-[11px] font-mono-num tabular-nums text-emerald-700 font-semibold mt-1">
                +{lqiGainPoints} pts gain over {horizon} months
              </p>
            </div>

            <div className="rounded-2xl p-5 bg-white border border-[#E8E8ED]">
              <div className="flex items-center justify-between text-xs text-[#6E6E73]">
                <span>Lead ROI Multiple</span>
                <TrendingUp className="w-4 h-4 text-emerald-700" aria-hidden="true" />
              </div>
              <p className="font-mono-num tabular-nums text-3xl font-bold text-[#1D1D1F] mt-1.5">
                {latestPoint?.leadRoiMultiple.toFixed(2)}x
              </p>
              <p className="text-[11px] font-mono-num tabular-nums text-[#6E6E73] mt-1">
                +{latestPoint?.roiImprovementPct ?? 0}% ROI growth from Month 1
              </p>
            </div>

            <div className="rounded-2xl p-5 bg-white border border-[#E8E8ED]">
              <div className="flex items-center justify-between text-xs text-[#6E6E73]">
                <span>Showroom Visit Rate</span>
                <ShieldCheck className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
              </div>
              <p className="font-mono-num tabular-nums text-3xl font-bold text-[#1D1D1F] mt-1.5">
                {latestPoint?.showroomVisitRate.toFixed(1)}%
              </p>
              <p className="text-[11px] font-mono-num tabular-nums text-[#6E6E73] mt-1">
                Sub-5 min SLA coverage: {activeStage.slaRate}%
              </p>
            </div>

            <div className="rounded-2xl p-5 bg-[#F5F5F7]/70 border border-[#E8E8ED]">
              <p className="text-xs font-semibold text-[#1D1D1F]">Active Pulse Signal</p>
              <p className="text-xs font-semibold text-purple-700 mt-1.5 truncate">
                {liveSignal.region}
              </p>
              <p className="text-[11px] text-[#6E6E73] leading-snug mt-1">
                {liveSignal.note}
              </p>
            </div>
          </div>

          {/* Recharts ComposedChart: Lead Quality Index & ROI Multiple */}
          <div className="w-full h-[330px] sm:h-[370px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={momentumData}
                margin={{ top: 16, right: 20, left: 4, bottom: 8 }}
              >
                <defs>
                  <linearGradient id="lqiAreaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.34} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E8ED" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#6E6E73' }}
                  axisLine={{ stroke: '#E8E8ED' }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="lqi"
                  domain={[25, 100]}
                  tick={{ fontSize: 12, fill: '#6D28D9' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="roi"
                  orientation="right"
                  domain={[1, 8]}
                  tickFormatter={(v) => `${v}x`}
                  tick={{ fontSize: 12, fill: '#047857' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || payload.length === 0) return null;
                    const row = payload[0].payload as MomentumDatum;
                    const gapVsBaseline = Number(
                      (row.leadQualityIndex - row.unfilteredBaselineIndex).toFixed(1)
                    );
                    return (
                      <div className="liquid-glass-dropdown rounded-2xl p-4 text-xs text-[#1D1D1F] shadow-xl space-y-2 min-w-[245px]">
                        <p className="font-display text-sm font-bold text-[#1D1D1F] border-b border-[#1D1D1F]/10 pb-1.5">
                          {row.month} · {activeStage.label}
                        </p>
                        <div className="flex justify-between gap-4">
                          <span className="text-purple-700 font-semibold">Lead Quality Index</span>
                          <span className="font-mono-num tabular-nums font-bold text-purple-700">
                            {row.leadQualityIndex} / 100
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-emerald-700 font-semibold">Lead ROI Multiple</span>
                          <span className="font-mono-num tabular-nums font-bold text-emerald-700">
                            {row.leadRoiMultiple}x
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-[#6E6E73]">Showroom Visit Rate</span>
                          <span className="font-mono-num tabular-nums font-semibold text-[#1D1D1F]">
                            {row.showroomVisitRate}%
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-[#6E6E73]">Unfiltered Baseline LQI</span>
                          <span className="font-mono-num tabular-nums font-semibold text-slate-600">
                            {row.unfilteredBaselineIndex} / 100
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-emerald-700 pt-1.5 border-t border-[#1D1D1F]/10">
                          +{gapVsBaseline} LQI pts above unfiltered leads
                        </p>
                      </div>
                    );
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                <Area
                  yAxisId="lqi"
                  type="monotone"
                  dataKey="leadQualityIndex"
                  name="Lead Quality Index (0–100)"
                  stroke="#7C3AED"
                  strokeWidth={3}
                  fill="url(#lqiAreaFill)"
                />
                <Line
                  yAxisId="lqi"
                  type="monotone"
                  dataKey="unfilteredBaselineIndex"
                  name="Unfiltered Baseline LQI"
                  stroke="#94A3B8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
                <Line
                  yAxisId="roi"
                  type="monotone"
                  dataKey="leadRoiMultiple"
                  name="Lead ROI Multiple (x)"
                  stroke="#047857"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#047857', stroke: '#FFFFFF', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}
