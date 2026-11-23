import { useState } from 'react';
import {
  BarChart3,
  Car,
  CheckCircle2,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { GlassCard, GlassPanel } from './liquid-glass';

type ChartView = 'trajectory' | 'comparison';

interface TrajectoryDatum {
  month: string;
  totalEnquiries: number;
  qualifiedEnquiries: number;
  testDrives: number;
  conversionRate: number;
}

interface ComparisonDatum {
  kpi: string;
  standardAgency: number;
  withAkyin: number;
  unit: string;
  liftLabel: string;
}

const SIX_MONTH_TRAJECTORY: TrajectoryDatum[] = [
  {
    month: 'Month 1',
    totalEnquiries: 320,
    qualifiedEnquiries: 118,
    testDrives: 42,
    conversionRate: 13.1,
  },
  {
    month: 'Month 2',
    totalEnquiries: 410,
    qualifiedEnquiries: 196,
    testDrives: 76,
    conversionRate: 18.5,
  },
  {
    month: 'Month 3',
    totalEnquiries: 525,
    qualifiedEnquiries: 294,
    testDrives: 118,
    conversionRate: 22.4,
  },
  {
    month: 'Month 4',
    totalEnquiries: 640,
    qualifiedEnquiries: 384,
    testDrives: 164,
    conversionRate: 25.6,
  },
  {
    month: 'Month 5',
    totalEnquiries: 745,
    qualifiedEnquiries: 470,
    testDrives: 212,
    conversionRate: 28.4,
  },
  {
    month: 'Month 6',
    totalEnquiries: 860,
    qualifiedEnquiries: 568,
    testDrives: 268,
    conversionRate: 31.2,
  },
];

const PIPELINE_COMPARISON: ComparisonDatum[] = [
  {
    kpi: 'Lead-to-Showroom Visit',
    standardAgency: 12,
    withAkyin: 31,
    unit: '%',
    liftLabel: '+19 pts conversion lift',
  },
  {
    kpi: 'Test Drive Completion',
    standardAgency: 34,
    withAkyin: 72,
    unit: '%',
    liftLabel: '2.1x showroom test drives',
  },
  {
    kpi: 'Qualified Lead Share',
    standardAgency: 36,
    withAkyin: 66,
    unit: '%',
    liftLabel: 'Eliminates window-shopper noise',
  },
  {
    kpi: 'Executive Follow-Up SLA',
    standardAgency: 42,
    withAkyin: 91,
    unit: '%',
    liftLabel: 'Under 5-min speed-to-lead',
  },
];

const KPI_HIGHLIGHTS = [
  {
    label: 'Lead-to-Showroom Rate',
    value: '31.2%',
    detail: 'Up from 13.1% baseline via two-tier lead qualification',
    icon: Users,
    accentClass: 'bg-purple-100/80 text-purple-700',
  },
  {
    label: 'Test Drive Volume Growth',
    value: '6.3x',
    detail: 'Dedicated test-drive booking & WhatsApp slot reminders',
    icon: Car,
    accentClass: 'bg-amber-100/80 text-amber-800',
  },
  {
    label: 'Qualified Enquiry Growth',
    value: '+168%',
    detail: 'Geo-fenced Meta & Search capture scaled over 6 months',
    icon: TrendingUp,
    accentClass: 'bg-emerald-100/80 text-emerald-700',
  },
];

export function AutomotiveResultsSection() {
  const [chartView, setChartView] = useState<ChartView>('trajectory');

  return (
    <section
      id="automotive-results"
      className="py-20 lg:py-28 bg-[#FFFFFF] border-t border-[#E8E8ED]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full frosted-glass-pill text-xs font-semibold text-[#1D1D1F]">
              <BarChart3 className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
              <span>Dealership Benchmark Performance · Recharts Analytics</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
              Automotive Results Across the Showroom Funnel.
            </h2>
            <p className="text-base text-[#6E6E73] leading-relaxed">
              Visualizing how structured lead generation, dedicated qualification filtering, and sales team coaching work together to raise showroom visits and test-drive volume.
            </p>
          </div>

          {/* Interactive Chart Mode Switcher */}
          <div
            role="tablist"
            aria-label="Automotive results visualization mode"
            className="inline-flex p-1.5 rounded-2xl frosted-glass border border-[#E8E8ED] self-start lg:self-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={chartView === 'trajectory'}
              onClick={() => setChartView('trajectory')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                chartView === 'trajectory'
                  ? 'liquid-glass-pill-dark text-white shadow-xs'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              6-Month KPI Trajectory
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={chartView === 'comparison'}
              onClick={() => setChartView('comparison')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                chartView === 'comparison'
                  ? 'liquid-glass-pill-dark text-white shadow-xs'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              Standard vs. AKYIN Funnel
            </button>
          </div>
        </div>

        {/* Summary KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {KPI_HIGHLIGHTS.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <GlassCard key={kpi.label} className="p-6 sm:p-7 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                    {kpi.label}
                  </span>
                  <span
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${kpi.accentClass}`}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </span>
                </div>
                <p className="font-mono-num text-3xl sm:text-4xl font-bold text-[#1D1D1F] tracking-tight">
                  {kpi.value}
                </p>
                <p className="text-xs text-[#6E6E73] leading-relaxed">{kpi.detail}</p>
              </GlassCard>
            );
          })}
        </div>

        {/* Main Recharts Panel */}
        <GlassPanel className="p-6 sm:p-8 space-y-6 bg-gradient-to-br from-white via-purple-50/25 to-amber-50/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E8ED] pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                {chartView === 'trajectory'
                  ? 'Monthly Showroom Volume & Conversion Lift'
                  : 'Operational Efficiency Benchmark (%)'}
              </p>
              <h3 className="font-display text-xl font-bold text-[#1D1D1F] mt-0.5">
                {chartView === 'trajectory'
                  ? 'Enquiry Growth, Test Drives & Lead-to-Showroom Conversion Rate'
                  : 'Unfiltered Ad Leads vs. AKYIN Two-Tier Qualified Dealership Pipeline'}
              </h3>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6E6E73] bg-white/80 px-3 py-1.5 rounded-full border border-[#E8E8ED]">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
              <span>Dealership Reference Model</span>
            </span>
          </div>

          <div className="w-full h-[340px] sm:h-[390px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartView === 'trajectory' ? (
                <ComposedChart
                  data={SIX_MONTH_TRAJECTORY}
                  margin={{ top: 16, right: 20, left: 4, bottom: 8 }}
                >
                  <defs>
                    <linearGradient id="akyinEnquiryGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.02} />
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
                    yAxisId="left"
                    tick={{ fontSize: 12, fill: '#6E6E73' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    unit="%"
                    domain={[0, 40]}
                    tick={{ fontSize: 12, fill: '#7C3AED' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload || payload.length === 0) return null;
                      const datum = payload[0].payload as TrajectoryDatum;
                      return (
                        <div className="liquid-glass-dropdown rounded-2xl p-4 text-xs text-[#1D1D1F] shadow-xl space-y-2 min-w-[220px]">
                          <p className="font-display text-sm font-bold text-[#1D1D1F] border-b border-[#1D1D1F]/10 pb-1.5">
                            {label} Dealership KPIs
                          </p>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-[#6E6E73]">Total Ad Enquiries</span>
                            <span className="font-mono-num font-bold">{datum.totalEnquiries}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-[#6E6E73]">Qualified Leads</span>
                            <span className="font-mono-num font-bold text-purple-700">
                              {datum.qualifiedEnquiries}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-[#6E6E73]">Completed Test Drives</span>
                            <span className="font-mono-num font-bold text-amber-700">
                              {datum.testDrives}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4 pt-1.5 border-t border-[#1D1D1F]/10">
                            <span className="font-semibold">Lead-to-Showroom Rate</span>
                            <span className="font-mono-num font-bold text-emerald-700">
                              {datum.conversionRate}%
                            </span>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="totalEnquiries"
                    name="Total Ad Enquiries"
                    fill="url(#akyinEnquiryGrad)"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="qualifiedEnquiries"
                    name="Qualified Enquiries"
                    fill="#1D1D1F"
                    radius={[6, 6, 0, 0]}
                    barSize={24}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="testDrives"
                    name="Test Drive Volume"
                    fill="#F59E0B"
                    radius={[6, 6, 0, 0]}
                    barSize={24}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="conversionRate"
                    name="Lead-to-Showroom Rate (%)"
                    stroke="#7C3AED"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#7C3AED', strokeWidth: 2, stroke: '#FFFFFF' }}
                    activeDot={{ r: 6 }}
                  />
                </ComposedChart>
              ) : (
                <BarChart
                  data={PIPELINE_COMPARISON}
                  margin={{ top: 16, right: 20, left: 4, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E8ED" vertical={false} />
                  <XAxis
                    dataKey="kpi"
                    tick={{ fontSize: 12, fill: '#6E6E73' }}
                    axisLine={{ stroke: '#E8E8ED' }}
                    tickLine={false}
                  />
                  <YAxis
                    unit="%"
                    domain={[0, 100]}
                    tick={{ fontSize: 12, fill: '#6E6E73' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || payload.length === 0) return null;
                      const datum = payload[0].payload as ComparisonDatum;
                      return (
                        <div className="liquid-glass-dropdown rounded-2xl p-4 text-xs text-[#1D1D1F] shadow-xl space-y-2 min-w-[230px]">
                          <p className="font-display text-sm font-bold text-[#1D1D1F]">
                            {datum.kpi}
                          </p>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-[#6E6E73]">Standard Unfiltered Ads</span>
                            <span className="font-mono-num font-semibold">
                              {datum.standardAgency}
                              {datum.unit}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-purple-700 font-semibold">With AKYIN Pipeline</span>
                            <span className="font-mono-num font-bold text-purple-700">
                              {datum.withAkyin}
                              {datum.unit}
                            </span>
                          </div>
                          <p className="text-[11px] font-semibold text-emerald-700 pt-1 border-t border-[#1D1D1F]/10">
                            {datum.liftLabel}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                  <Bar
                    dataKey="standardAgency"
                    name="Unfiltered Agency Campaigns (%)"
                    fill="#D1D1D6"
                    radius={[8, 8, 0, 0]}
                    barSize={36}
                  />
                  <Bar
                    dataKey="withAkyin"
                    name="AKYIN Two-Tier Dealership Model (%)"
                    fill="#7C3AED"
                    radius={[8, 8, 0, 0]}
                    barSize={36}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-[#6E6E73] text-center sm:text-left">
            Note: Visualizations reflect illustrative multi-location automotive dealership benchmark patterns across AKYIN engagements; actual campaign metrics vary by OEM brand, city tier, inventory availability, and showroom follow-up speed.
          </p>
        </GlassPanel>
      </div>
    </section>
  );
}
