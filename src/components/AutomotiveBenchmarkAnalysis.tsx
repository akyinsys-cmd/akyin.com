import { useMemo, useState } from 'react';
import { BarChart2, Compass, TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { GlassPanel } from './liquid-glass';

type MetricKey = 'conversion' | 'qualification' | 'testDrive' | 'followUpSla';

interface RegionalBenchmarkRow {
  id: string;
  region: string;
  shortRegion: string;
  showroomProfile: string;
  conversion: { akyin: number; industry: number };
  qualification: { akyin: number; industry: number };
  testDrive: { akyin: number; industry: number };
  followUpSla: { akyin: number; industry: number };
  cplReductionPct: number;
}

const REGIONAL_BENCHMARKS: RegionalBenchmarkRow[] = [
  {
    id: 'metro-west',
    region: 'Metro West (Mumbai · Pune)',
    shortRegion: 'Metro West',
    showroomProfile: 'High-volume SUV, sedan & EV flagship showrooms',
    conversion: { akyin: 33.4, industry: 13.8 },
    qualification: { akyin: 68.5, industry: 37.0 },
    testDrive: { akyin: 74.0, industry: 35.5 },
    followUpSla: { akyin: 93.0, industry: 44.0 },
    cplReductionPct: 38,
  },
  {
    id: 'south-corridor',
    region: 'South Corridor (Bengaluru · Chennai · Hyderabad)',
    shortRegion: 'South Metro',
    showroomProfile: 'Tech-forward buyers & digital test-drive bookings',
    conversion: { akyin: 31.8, industry: 12.9 },
    qualification: { akyin: 66.2, industry: 36.4 },
    testDrive: { akyin: 72.5, industry: 34.0 },
    followUpSla: { akyin: 91.5, industry: 43.0 },
    cplReductionPct: 35,
  },
  {
    id: 'north-ncr',
    region: 'North & NCR (Delhi · Gurugram · Chandigarh)',
    shortRegion: 'North & NCR',
    showroomProfile: 'Competitive multi-dealer clusters & festive volume',
    conversion: { akyin: 29.6, industry: 12.1 },
    qualification: { akyin: 64.0, industry: 34.5 },
    testDrive: { akyin: 70.0, industry: 32.5 },
    followUpSla: { akyin: 89.0, industry: 40.5 },
    cplReductionPct: 33,
  },
  {
    id: 'tier2-growth',
    region: 'Tier-2 Hubs (Jaipur · Indore · Kochi · Lucknow)',
    shortRegion: 'Tier-2 Hubs',
    showroomProfile: 'Regional dominance, exchange carnivals & local search',
    conversion: { akyin: 30.4, industry: 11.4 },
    qualification: { akyin: 65.5, industry: 33.0 },
    testDrive: { akyin: 71.0, industry: 31.0 },
    followUpSla: { akyin: 90.0, industry: 38.0 },
    cplReductionPct: 41,
  },
  {
    id: 'east-cluster',
    region: 'East Cluster (Kolkata · Bhubaneswar · Guwahati)',
    shortRegion: 'East Cluster',
    showroomProfile: 'Emerging hatchback, compact SUV & fleet demand',
    conversion: { akyin: 28.9, industry: 11.0 },
    qualification: { akyin: 63.0, industry: 32.0 },
    testDrive: { akyin: 68.5, industry: 30.0 },
    followUpSla: { akyin: 88.5, industry: 37.5 },
    cplReductionPct: 36,
  },
];

const METRIC_META: Record<
  MetricKey,
  {
    label: string;
    shortLabel: string;
    description: string;
    unit: string;
  }
> = {
  conversion: {
    label: 'Lead-to-Showroom Conversion',
    shortLabel: 'Showroom Visit %',
    description: 'Percentage of verified campaign enquiries converting into tracked showroom visits.',
    unit: '%',
  },
  qualification: {
    label: 'Qualified Lead Share',
    shortLabel: 'Qualified Share %',
    description: 'Share of generated leads passing AKYIN budget, timeline, and model intent filtering.',
    unit: '%',
  },
  testDrive: {
    label: 'Test Drive Completion Rate',
    shortLabel: 'Test Drive %',
    description: 'Scheduled test-drive bookings successfully completed on the showroom floor.',
    unit: '%',
  },
  followUpSla: {
    label: 'Under-5-Min Executive SLA',
    shortLabel: 'Follow-Up SLA %',
    description: 'Leads routed and contacted by trained sales executives within the golden 5-minute window.',
    unit: '%',
  },
};

export function AutomotiveBenchmarkAnalysis() {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('conversion');
  const [selectedRegionId, setSelectedRegionId] = useState<string>(REGIONAL_BENCHMARKS[0].id);

  const metricInfo = METRIC_META[selectedMetric];

  const regionalBarData = useMemo(
    () =>
      REGIONAL_BENCHMARKS.map((row) => {
        const akyinVal = row[selectedMetric].akyin;
        const industryVal = row[selectedMetric].industry;
        return {
          region: row.shortRegion,
          fullRegion: row.region,
          industryAverage: industryVal,
          akyinPartner: akyinVal,
          delta: Number((akyinVal - industryVal).toFixed(1)),
        };
      }),
    [selectedMetric]
  );

  const activeRegion = useMemo(
    () =>
      REGIONAL_BENCHMARKS.find((r) => r.id === selectedRegionId) ?? REGIONAL_BENCHMARKS[0],
    [selectedRegionId]
  );

  const radarData = useMemo(
    () => [
      {
        axis: 'Showroom Visit',
        akyin: activeRegion.conversion.akyin * 2.5,
        industry: activeRegion.conversion.industry * 2.5,
        rawAkyin: `${activeRegion.conversion.akyin}%`,
        rawIndustry: `${activeRegion.conversion.industry}%`,
      },
      {
        axis: 'Lead Quality',
        akyin: activeRegion.qualification.akyin,
        industry: activeRegion.qualification.industry,
        rawAkyin: `${activeRegion.qualification.akyin}%`,
        rawIndustry: `${activeRegion.qualification.industry}%`,
      },
      {
        axis: 'Test Drives',
        akyin: activeRegion.testDrive.akyin,
        industry: activeRegion.testDrive.industry,
        rawAkyin: `${activeRegion.testDrive.akyin}%`,
        rawIndustry: `${activeRegion.testDrive.industry}%`,
      },
      {
        axis: 'Follow-Up SLA',
        akyin: activeRegion.followUpSla.akyin,
        industry: activeRegion.followUpSla.industry,
        rawAkyin: `${activeRegion.followUpSla.akyin}%`,
        rawIndustry: `${activeRegion.followUpSla.industry}%`,
      },
      {
        axis: 'CPL Savings',
        akyin: 45 + activeRegion.cplReductionPct,
        industry: 35,
        rawAkyin: `-${activeRegion.cplReductionPct}% Cost`,
        rawIndustry: 'Baseline CPL',
      },
    ],
    [activeRegion]
  );

  const avgDelta = useMemo(() => {
    const sum = regionalBarData.reduce((acc, item) => acc + item.delta, 0);
    return (sum / regionalBarData.length).toFixed(1);
  }, [regionalBarData]);

  return (
    <section
      id="benchmark-analysis"
      className="py-20 lg:py-28 bg-[#F5F5F7] border-t border-[#E8E8ED]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-purple-700">
              Regional Dealership Intelligence · Market Comparison
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
              Benchmark Analysis: Regional Performance vs. Industry Average.
            </h2>
            <p className="text-base text-[#6E6E73] leading-relaxed">
              Compare how AKYIN partner showrooms outperform conventional regional baselines across five core automotive markets in India.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#6E6E73] shrink-0">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#1D1D1F]">
              <TrendingUp className="w-4 h-4 text-purple-700" aria-hidden="true" />
              Avg. Regional Uplift:{' '}
              <span className="font-mono-num tabular-nums text-purple-700">+{avgDelta} pts</span>
            </span>
          </div>
        </div>

        {/* Interactive Metric Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(METRIC_META) as MetricKey[]).map((key) => {
            const active = selectedMetric === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedMetric(key)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  active
                    ? 'liquid-glass-pill-dark text-white shadow-xs'
                    : 'bg-white text-[#6E6E73] hover:text-[#1D1D1F] border border-[#E8E8ED]'
                }`}
              >
                {METRIC_META[key].shortLabel}
              </button>
            );
          })}
        </div>

        {/* Dual Recharts Visualization Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Regional BarChart Comparison */}
          <GlassPanel className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#E8E8ED] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#6E6E73]">
                  <BarChart2 className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
                  <span className="font-semibold text-[#1D1D1F]">{metricInfo.label}</span>
                  <span aria-hidden="true">·</span>
                  <span>Regional Breakdown</span>
                </div>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  {metricInfo.description}
                </p>
              </div>
              <span className="font-mono-num tabular-nums text-xs font-bold text-purple-700 whitespace-nowrap shrink-0">
                5 Regions Tracked
              </span>
            </div>

            <div className="w-full h-[320px] sm:h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={regionalBarData}
                  margin={{ top: 12, right: 16, left: 0, bottom: 8 }}
                  barGap={6}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E8ED" vertical={false} />
                  <XAxis
                    dataKey="region"
                    tick={{ fontSize: 11, fill: '#6E6E73' }}
                    axisLine={{ stroke: '#E8E8ED' }}
                    tickLine={false}
                  />
                  <YAxis
                    unit="%"
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: '#6E6E73' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || payload.length === 0) return null;
                      const datum = payload[0].payload as (typeof regionalBarData)[number];
                      return (
                        <div className="liquid-glass-dropdown rounded-2xl p-4 text-xs text-[#1D1D1F] shadow-xl space-y-2 min-w-[230px]">
                          <p className="font-display text-sm font-bold text-[#1D1D1F] border-b border-[#1D1D1F]/10 pb-1.5">
                            {datum.fullRegion}
                          </p>
                          <div className="flex justify-between gap-4">
                            <span className="text-[#6E6E73]">Industry Average</span>
                            <span className="font-mono-num tabular-nums font-semibold">
                              {datum.industryAverage}%
                            </span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="font-semibold text-purple-700">AKYIN Partner</span>
                            <span className="font-mono-num tabular-nums font-bold text-purple-700">
                              {datum.akyinPartner}%
                            </span>
                          </div>
                          <div className="flex justify-between gap-4 pt-1.5 border-t border-[#1D1D1F]/10">
                            <span className="font-semibold text-emerald-700">Partner Advantage</span>
                            <span className="font-mono-num tabular-nums font-bold text-emerald-700">
                              +{datum.delta} pts
                            </span>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar
                    dataKey="industryAverage"
                    name="Industry Average (%)"
                    fill="#D1D1D6"
                    radius={[6, 6, 0, 0]}
                    barSize={22}
                  />
                  <Bar
                    dataKey="akyinPartner"
                    name="AKYIN Partner (%)"
                    fill="#7C3AED"
                    radius={[6, 6, 0, 0]}
                    barSize={22}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassPanel>

          {/* Right: Regional Multi-Metric RadarChart */}
          <GlassPanel className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-5 bg-gradient-to-br from-white via-purple-50/25 to-amber-50/20">
            <div className="space-y-3 border-b border-[#E8E8ED] pb-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-[#6E6E73]">
                  <Compass className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
                  <span className="font-semibold text-[#1D1D1F]">Regional Capability Radar</span>
                </div>
                <span className="font-mono-num tabular-nums text-xs font-bold text-emerald-700 whitespace-nowrap">
                  -{activeRegion.cplReductionPct}% Avg CPL
                </span>
              </div>

              <div>
                <label htmlFor="benchmark-region-select" className="sr-only">
                  Select dealership region for radar comparison
                </label>
                <select
                  id="benchmark-region-select"
                  value={selectedRegionId}
                  onChange={(e) => setSelectedRegionId(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E8ED] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#1D1D1F] focus:outline-none focus:border-purple-700 cursor-pointer"
                >
                  {REGIONAL_BENCHMARKS.map((row) => (
                    <option key={row.id} value={row.id}>
                      {row.region}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#6E6E73] mt-2">{activeRegion.showroomProfile}</p>
              </div>
            </div>

            <div className="w-full h-[290px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
                  <PolarGrid stroke="#E8E8ED" />
                  <PolarAngleAxis
                    dataKey="axis"
                    tick={{ fontSize: 11, fill: '#1D1D1F', fontWeight: 600 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || payload.length === 0) return null;
                      const datum = payload[0].payload as (typeof radarData)[number];
                      return (
                        <div className="liquid-glass-dropdown rounded-xl p-3 text-xs text-[#1D1D1F] shadow-xl space-y-1">
                          <p className="font-bold">{datum.axis}</p>
                          <div className="flex justify-between gap-4">
                            <span className="text-[#6E6E73]">Industry Avg</span>
                            <span className="font-mono-num tabular-nums font-semibold">
                              {datum.rawIndustry}
                            </span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-purple-700 font-semibold">AKYIN Partner</span>
                            <span className="font-mono-num tabular-nums font-bold text-purple-700">
                              {datum.rawAkyin}
                            </span>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Radar
                    name="Industry Average"
                    dataKey="industry"
                    stroke="#94A3B8"
                    fill="#CBD5E1"
                    fillOpacity={0.35}
                  />
                  <Radar
                    name="AKYIN Partner"
                    dataKey="akyin"
                    stroke="#7C3AED"
                    strokeWidth={2.5}
                    fill="#8B5CF6"
                    fillOpacity={0.28}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </GlassPanel>
        </div>

        {/* Clean Tabular Summary Matrix */}
        <GlassPanel className="overflow-hidden bg-white">
          <div className="px-6 py-4 border-b border-[#E8E8ED] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="font-display text-base font-bold text-[#1D1D1F]">
              Regional Performance Matrix — {metricInfo.label}
            </h3>
            <span className="text-xs text-[#6E6E73]">
              AKYIN Partner Benchmark vs. Unfiltered Dealership Average
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#E8E8ED] text-[#6E6E73] text-xs uppercase tracking-wider bg-[#F5F5F7]/60">
                  <th className="py-3.5 px-6 font-semibold">Dealership Region</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Industry Avg</th>
                  <th className="py-3.5 px-4 font-semibold text-right">AKYIN Partner</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Net Uplift</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Est. CPL Reduction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8ED]">
                {REGIONAL_BENCHMARKS.map((row) => {
                  const ind = row[selectedMetric].industry;
                  const aky = row[selectedMetric].akyin;
                  const diff = (aky - ind).toFixed(1);
                  const isActiveRow = row.id === selectedRegionId;
                  return (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedRegionId(row.id)}
                      className={`transition-colors cursor-pointer ${
                        isActiveRow ? 'bg-purple-50/45' : 'hover:bg-[#F5F5F7]/50'
                      }`}
                    >
                      <td className="py-3.5 px-6">
                        <p className="font-semibold text-[#1D1D1F]">{row.region}</p>
                        <p className="text-xs text-[#6E6E73]">{row.showroomProfile}</p>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono-num tabular-nums text-[#6E6E73]">
                        {ind.toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono-num tabular-nums font-bold text-purple-700">
                        {aky.toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono-num tabular-nums font-bold text-emerald-700">
                        +{diff} pts
                      </td>
                      <td className="py-3.5 px-6 text-right font-mono-num tabular-nums font-semibold text-[#1D1D1F]">
                        -{row.cplReductionPct}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}
