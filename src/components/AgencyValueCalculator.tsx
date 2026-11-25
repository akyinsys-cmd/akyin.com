import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Building2,
  Calculator,
  CheckCircle2,
  PiggyBank,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { GlassButton, GlassPanel } from './liquid-glass';

type DealershipScaleId = 'single' | 'multi' | 'enterprise';
type RoiForecastPeriod = 12 | 24;

interface ScalePreset {
  id: DealershipScaleId;
  label: string;
  rooftops: string;
  akyinTierName: string;
  akyinMonthlyRetainer: number;
  defaultStaff: {
    mediaBuyerSalary: number;
    creativeSalary: number;
    bdcQualifiersCost: number;
    toolsAndOverhead: number;
  };
}

const SCALE_PRESETS: Record<DealershipScaleId, ScalePreset> = {
  single: {
    id: 'single',
    label: 'Single Showroom',
    rooftops: '1 Rooftop · Compact Team',
    akyinTierName: 'Single-Showroom Modular Scope',
    akyinMonthlyRetainer: 55000,
    defaultStaff: {
      mediaBuyerSalary: 55000,
      creativeSalary: 45000,
      bdcQualifiersCost: 36000,
      toolsAndOverhead: 24000,
    },
  },
  multi: {
    id: 'multi',
    label: 'Multi-Location Dealer',
    rooftops: '2–4 Showrooms · Regional Group',
    akyinTierName: 'Multi-Rooftop Performance',
    akyinMonthlyRetainer: 95000,
    defaultStaff: {
      mediaBuyerSalary: 85000,
      creativeSalary: 75000,
      bdcQualifiersCost: 68000,
      toolsAndOverhead: 42000,
    },
  },
  enterprise: {
    id: 'enterprise',
    label: 'Enterprise Auto Group',
    rooftops: '5+ Showrooms · Multi-Brand',
    akyinTierName: 'Multi-Brand Modular Scope',
    akyinMonthlyRetainer: 155000,
    defaultStaff: {
      mediaBuyerSalary: 140000,
      creativeSalary: 115000,
      bdcQualifiersCost: 110000,
      toolsAndOverhead: 75000,
    },
  },
};

interface CostBarDatum {
  category: string;
  shortCategory: string;
  inHouseCost: number;
  akyinCost: number;
  savings: number;
}

interface AgencyValueCalculatorProps {
  onRequestBreakdown?: (summaryText: string) => void;
}

const formatInr = (val: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);

export function AgencyValueCalculator({ onRequestBreakdown }: AgencyValueCalculatorProps) {
  const [scaleId, setScaleId] = useState<DealershipScaleId>('single');
  const [forecastMonths, setForecastMonths] = useState<RoiForecastPeriod>(12);
  const [includeVideoTeam, setIncludeVideoTeam] = useState<boolean>(true);
  const [includeBdcTeam, setIncludeBdcTeam] = useState<boolean>(true);
  const [mediaLeadSalary, setMediaLeadSalary] = useState<number>(
    SCALE_PRESETS.single.defaultStaff.mediaBuyerSalary
  );

  const preset = SCALE_PRESETS[scaleId];

  const handleScaleChange = (nextScale: DealershipScaleId) => {
    setScaleId(nextScale);
    setMediaLeadSalary(SCALE_PRESETS[nextScale].defaultStaff.mediaBuyerSalary);
  };

  const {
    chartData,
    totalInHouse,
    totalAkyin,
    netSavings,
    monthlySavingsAvg,
    savingsPct,
    extraLeadsUnlocked,
  } = useMemo(() => {
    const staff = preset.defaultStaff;
    // In a 24-month horizon, internal payroll reflects typical ~8% Year-2 appraisal & attrition backfill costs on year 2, while partner retainer remains fixed.
    const payrollMultiplier = forecastMonths === 24 ? 12 + 12 * 1.08 : 12;
    const retainerMultiplier = forecastMonths;

    const inHouseMedia = Math.round(mediaLeadSalary * payrollMultiplier);
    const inHouseCreative = Math.round(
      (includeVideoTeam ? staff.creativeSalary : 0) * payrollMultiplier
    );
    const inHouseBdc = Math.round(
      (includeBdcTeam ? staff.bdcQualifiersCost : 0) * payrollMultiplier
    );
    const inHouseTools = Math.round(staff.toolsAndOverhead * retainerMultiplier);

    const totalInHouseVal = inHouseMedia + inHouseCreative + inHouseBdc + inHouseTools;
    const totalAkyinVal = preset.akyinMonthlyRetainer * retainerMultiplier;

    // Allocate AKYIN turnkey retainer proportionally across the 4 functional pillars for transparent visual comparison
    const akyinMedia = Math.round(totalAkyinVal * 0.36);
    const akyinCreative = Math.round(totalAkyinVal * 0.28);
    const akyinBdc = Math.round(totalAkyinVal * 0.24);
    const akyinTools = totalAkyinVal - akyinMedia - akyinCreative - akyinBdc;

    const bars: CostBarDatum[] = [
      {
        category: 'Paid Media & Ad Ops',
        shortCategory: 'Paid Media',
        inHouseCost: inHouseMedia,
        akyinCost: akyinMedia,
        savings: Math.max(0, inHouseMedia - akyinMedia),
      },
      {
        category: 'Video & Reels Production',
        shortCategory: 'Creative & Video',
        inHouseCost: inHouseCreative,
        akyinCost: akyinCreative,
        savings: Math.max(0, inHouseCreative - akyinCreative),
      },
      {
        category: 'Tele-Qualification & BDC',
        shortCategory: 'Lead Filtering',
        inHouseCost: inHouseBdc,
        akyinCost: akyinBdc,
        savings: Math.max(0, inHouseBdc - akyinBdc),
      },
      {
        category: 'CRM Tools & Hiring Overhead',
        shortCategory: 'Tools & HR',
        inHouseCost: inHouseTools,
        akyinCost: akyinTools,
        savings: Math.max(0, inHouseTools - akyinTools),
      },
    ];

    const savingsVal = Math.max(0, totalInHouseVal - totalAkyinVal);
    const pct =
      totalInHouseVal > 0 ? Math.max(0, Math.round((savingsVal / totalInHouseVal) * 100)) : 0;
    const extraLeads = Math.round(savingsVal / 340);

    return {
      chartData: bars,
      totalInHouse: totalInHouseVal,
      totalAkyin: totalAkyinVal,
      netSavings: savingsVal,
      monthlySavingsAvg: Math.round(savingsVal / forecastMonths),
      savingsPct: pct,
      extraLeadsUnlocked: extraLeads,
    };
  }, [preset, mediaLeadSalary, includeVideoTeam, includeBdcTeam, forecastMonths]);

  return (
    <section
      id="agency-value-calculator"
      className="py-20 lg:py-28 bg-[#F5F5F7] border-t border-[#E8E8ED]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-700">
              <Calculator className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Operational Cost Comparison</span>
              <span aria-hidden="true">·</span>
              <span>In-House Payroll vs. Turnkey Partner</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-[-0.025em] text-[#1D1D1F] text-balance">
              Agency Value Calculator.
            </h2>
            <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed">
              Compare the total payroll, creative production, qualification staffing, and tool stack cost of building an in-house dealership marketing department versus partnering with AKYIN across 12-month and 24-month ROI horizons.
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-1.5 shrink-0">
            <span className="text-[11px] font-semibold text-[#6E6E73]">
              ROI Forecast Period
            </span>
            <div
              role="group"
              aria-label="Select ROI forecast period"
              className="inline-flex p-1 rounded-xl frosted-glass border border-[#E8E8ED]"
            >
              {([12, 24] as RoiForecastPeriod[]).map((months) => (
                <button
                  key={months}
                  type="button"
                  aria-pressed={forecastMonths === months}
                  onClick={() => setForecastMonths(months)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    forecastMonths === months
                      ? 'liquid-glass-pill-dark text-white shadow-xs'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  {months}-Month
                </button>
              ))}
            </div>
          </div>
        </div>

        <GlassPanel className="p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-white via-purple-50/25 to-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Controls Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-[#6E6E73]">
                  1. Dealership Organization Scale
                </p>
                <div className="grid grid-cols-1 gap-2.5">
                  {(Object.keys(SCALE_PRESETS) as DealershipScaleId[]).map((key) => {
                    const item = SCALE_PRESETS[key];
                    const active = scaleId === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        aria-pressed={active}
                        onClick={() => handleScaleChange(key)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          active
                            ? 'liquid-glass-pill-dark text-white border-[#1D1D1F] shadow-md'
                            : 'bg-white/90 text-[#1D1D1F] border-[#E8E8ED] hover:bg-white'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-bold">{item.label}</p>
                          <p
                            className={`text-xs mt-0.5 ${
                              active ? 'text-white/75' : 'text-[#6E6E73]'
                            }`}
                          >
                            {item.rooftops}
                          </p>
                        </div>
                        <span
                          className={`font-mono-num tabular-nums text-xs font-semibold shrink-0 ${
                            active ? 'text-white' : 'text-purple-700'
                          }`}
                        >
                          {formatInr(item.akyinMonthlyRetainer)}/mo
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Internal Payroll Sliders & Toggles */}
              <div className="space-y-4 pt-4 border-t border-[#E8E8ED]">
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="agency-val-salary"
                    className="text-xs font-semibold text-[#1D1D1F]"
                  >
                    2. In-House Paid Media Lead Salary
                  </label>
                  <span className="font-mono-num tabular-nums text-sm font-bold text-[#1D1D1F]">
                    {formatInr(mediaLeadSalary)}/mo
                  </span>
                </div>
                <input
                  id="agency-val-salary"
                  type="range"
                  min={35000}
                  max={180000}
                  step={5000}
                  value={mediaLeadSalary}
                  onChange={(e) => setMediaLeadSalary(Number(e.target.value))}
                  className="w-full accent-[#1D1D1F] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-mono-num tabular-nums text-[#6E6E73]">
                  <span>₹35,000</span>
                  <span>₹1,05,000</span>
                  <span>₹1,80,000</span>
                </div>

                <div className="space-y-2.5 pt-2">
                  <p className="text-xs font-semibold text-[#6E6E73]">
                    3. Include Additional In-House Roles
                  </p>
                  <label className="flex items-center justify-between gap-3 p-3 rounded-xl border border-[#E8E8ED] bg-white/85 cursor-pointer">
                    <div>
                      <p className="text-xs font-semibold text-[#1D1D1F]">
                        In-House Video &amp; Reels Creator
                      </p>
                      <p className="text-[11px] font-mono-num tabular-nums text-[#6E6E73]">
                        +{formatInr(preset.defaultStaff.creativeSalary)}/mo salary &amp; gear
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={includeVideoTeam}
                      onChange={(e) => setIncludeVideoTeam(e.target.checked)}
                      className="w-4 h-4 accent-[#7C3AED] rounded cursor-pointer shrink-0"
                    />
                  </label>

                  <label className="flex items-center justify-between gap-3 p-3 rounded-xl border border-[#E8E8ED] bg-white/85 cursor-pointer">
                    <div>
                      <p className="text-xs font-semibold text-[#1D1D1F]">
                        Dedicated Lead-Filtering BDC Staff
                      </p>
                      <p className="text-[11px] font-mono-num tabular-nums text-[#6E6E73]">
                        +{formatInr(preset.defaultStaff.bdcQualifiersCost)}/mo qualification payroll
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={includeBdcTeam}
                      onChange={(e) => setIncludeBdcTeam(e.target.checked)}
                      className="w-4 h-4 accent-[#7C3AED] rounded cursor-pointer shrink-0"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Right Recharts Comparison & Savings Summary */}
            <div className="lg:col-span-7 space-y-6">
              {/* Top 3 Financial KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl p-4 bg-white border border-[#E8E8ED]">
                  <div className="flex items-center justify-between text-xs text-[#6E6E73]">
                    <span>In-House Cost</span>
                    <Users className="w-3.5 h-3.5 text-[#6E6E73]" aria-hidden="true" />
                  </div>
                  <p className="font-mono-num tabular-nums text-2xl font-bold text-[#1D1D1F] mt-1">
                    {formatInr(totalInHouse)}
                  </p>
                  <p className="text-[11px] text-[#6E6E73] mt-0.5">
                    {forecastMonths}-month forecast{forecastMonths === 24 ? ' (incl. Yr-2 increment)' : ''}
                  </p>
                </div>

                <div className="rounded-2xl p-4 bg-purple-50/50 border border-purple-200/80">
                  <div className="flex items-center justify-between text-xs text-purple-900 font-medium">
                    <span>AKYIN Partner</span>
                    <Building2 className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
                  </div>
                  <p className="font-mono-num tabular-nums text-2xl font-bold text-purple-700 mt-1">
                    {formatInr(totalAkyin)}
                  </p>
                  <p className="text-[11px] text-purple-900/75 mt-0.5 truncate">
                    {preset.akyinTierName} ({forecastMonths} mo)
                  </p>
                </div>

                <div className="rounded-2xl p-4 bg-emerald-50/50 border border-emerald-200/80">
                  <div className="flex items-center justify-between text-xs text-emerald-900 font-medium">
                    <span>{forecastMonths}-Mo Net Savings</span>
                    <PiggyBank className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                  </div>
                  <p className="font-mono-num tabular-nums text-2xl font-bold text-emerald-700 mt-1">
                    {formatInr(netSavings)}
                  </p>
                  <p className="text-[11px] font-mono-num tabular-nums font-semibold text-emerald-800 mt-0.5">
                    {savingsPct}% lower · {formatInr(monthlySavingsAvg)}/mo avg
                  </p>
                </div>
              </div>

              {/* Recharts Grouped BarChart */}
              <div className="rounded-2xl border border-[#E8E8ED] bg-white p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E8ED] pb-3">
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#1D1D1F]">
                      Cost Breakdown: Internal Department vs. AKYIN ({forecastMonths}-Month ROI)
                    </h3>
                    <p className="text-xs text-[#6E6E73]">
                      Comparing cumulative {forecastMonths}-month investment across all four marketing pillars
                    </p>
                  </div>
                </div>

                <div className="w-full h-[290px] sm:h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 14, right: 12, left: 6, bottom: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E8E8ED" vertical={false} />
                      <XAxis
                        dataKey="shortCategory"
                        tick={{ fontSize: 11, fill: '#1D1D1F', fontWeight: 500 }}
                        axisLine={{ stroke: '#E8E8ED' }}
                        tickLine={false}
                      />
                      <YAxis
                        tickFormatter={(v) =>
                          v >= 100000
                            ? `₹${(v / 100000).toFixed(1)}L`
                            : `₹${Math.round(v / 1000)}k`
                        }
                        tick={{ fontSize: 11, fill: '#6E6E73' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload || payload.length === 0) return null;
                          const row = payload[0].payload as CostBarDatum;
                          return (
                            <div className="liquid-glass-dropdown rounded-2xl p-4 text-xs text-[#1D1D1F] shadow-xl space-y-2 min-w-[245px]">
                              <p className="font-display text-sm font-bold text-[#1D1D1F] border-b border-[#1D1D1F]/10 pb-1.5">
                                {row.category} ({forecastMonths}-Mo)
                              </p>
                              <div className="flex justify-between gap-4">
                                <span className="text-[#6E6E73]">In-House Cost</span>
                                <span className="font-mono-num tabular-nums font-bold text-[#1D1D1F]">
                                  {formatInr(row.inHouseCost)}
                                </span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span className="text-purple-700 font-semibold">
                                  AKYIN Included Value
                                </span>
                                <span className="font-mono-num tabular-nums font-bold text-purple-700">
                                  {formatInr(row.akyinCost)}
                                </span>
                              </div>
                              <div className="flex justify-between gap-4 pt-1.5 border-t border-[#1D1D1F]/10 text-emerald-700 font-semibold">
                                <span>{forecastMonths}-Mo Category Savings</span>
                                <span className="font-mono-num tabular-nums">
                                  {formatInr(row.savings)}
                                </span>
                              </div>
                            </div>
                          );
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar
                        dataKey="inHouseCost"
                        name="Internal Team Cost (₹)"
                        fill="#1D1D1F"
                        radius={[8, 8, 0, 0]}
                        barSize={30}
                      />
                      <Bar
                        dataKey="akyinCost"
                        name="AKYIN Partner Retainer Share (₹)"
                        fill="#7C3AED"
                        radius={[8, 8, 0, 0]}
                        barSize={30}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Savings Reinvestment Highlight Strip */}
              <div className="frosted-glass rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#E8E8ED]">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
                    <span>
                      {forecastMonths}-Month Reinvestment Capacity: ~
                      <strong className="font-mono-num tabular-nums text-purple-700">
                        {extraLeadsUnlocked.toLocaleString('en-IN')}
                      </strong>{' '}
                      additional buyer enquiries funded
                    </span>
                  </p>
                  <p className="text-[11px] text-[#6E6E73]">
                    Redirecting {formatInr(netSavings)} of {forecastMonths}-month fixed payroll overhead directly into high-intent test-drive ad spend accelerates showroom turnover.
                  </p>
                </div>

                {onRequestBreakdown && (
                  <GlassButton
                    variant="primary"
                    size="md"
                    className="shrink-0"
                    onClick={() =>
                      onRequestBreakdown(
                        `Agency Value Calculator (${preset.label}, ${forecastMonths}-Month ROI Horizon) — Estimated Savings: ${formatInr(netSavings)} (${savingsPct}% lower than in-house cost of ${formatInr(totalInHouse)}). Please share an itemized AKYIN partnership proposal.`
                      )
                    }
                  >
                    <span>Get Cost Breakdown</span>
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
