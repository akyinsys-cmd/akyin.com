import { useCallback, useEffect, useState } from 'react';
import { ArrowUpRight, RefreshCw, Sparkles, TrendingUp, Users } from 'lucide-react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { RecurringRevenueInsightsSummary, suiteApi } from '../../services/suiteApi';
import { GlassButton } from '../liquid-glass';

interface AdminRecurringRevenueInsightsPanelProps {
  onJumpToRecurring?: () => void;
}

function fmtInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export function AdminRecurringRevenueInsightsPanel({
  onJumpToRecurring,
}: AdminRecurringRevenueInsightsPanelProps) {
  const [monthsWindow, setMonthsWindow] = useState<6 | 12>(12);
  const [data, setData] = useState<RecurringRevenueInsightsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadInsights = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await suiteApi.getRecurringRevenueInsights(monthsWindow);
      setData(res);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to load recurring revenue insights.'
      );
    } finally {
      setLoading(false);
    }
  }, [monthsWindow]);

  useEffect(() => {
    void loadInsights();
  }, [loadInsights]);

  const hasChartActivity = Boolean(
    data?.monthlyTrend.some(
      (pt) => pt.creativeMrr > 0 || pt.realizedCreativeCollections > 0 || pt.allActiveMrr > 0
    )
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F]">
            Recurring Revenue Insights
          </h2>
          <p className="text-xs text-[#6E6E73] mt-0.5">
            Monthly Recurring Revenue (MRR) trend and service breakdown for subscribed Business Creative &amp; Documentation Services.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div
            role="tablist"
            aria-label="MRR trend window"
            className="inline-flex p-1 rounded-xl bg-white border border-[#E8E8ED] gap-1"
          >
            {([6, 12] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={monthsWindow === m}
                onClick={() => setMonthsWindow(m)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  monthsWindow === m
                    ? 'bg-[#1D1D1F] text-white'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                {m} Months
              </button>
            ))}
          </div>

          <GlassButton variant="subtle" size="sm" onClick={() => void loadInsights()}>
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Refresh</span>
          </GlassButton>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-[#FEF3F2] border border-[#FECDCA] px-4 py-3 text-xs font-semibold text-[#B42318]">
          {error}
        </div>
      )}

      {loading && !data ? (
        <div className="liquid-glass-card rounded-3xl p-12 text-center text-xs text-[#6E6E73]">
          Calculating recurring creative service MRR insights...
        </div>
      ) : data ? (
        <>
          {/* KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="liquid-glass-card rounded-2xl p-4 space-y-1">
              <p className="text-[11px] font-semibold text-[#6E6E73]">Creative Services MRR</p>
              <p className="font-mono-num text-2xl font-bold text-[#0071E3] tabular-nums">
                {fmtInr(data.summary.activeCreativeMrr)}
              </p>
              <p className="text-[11px] text-[#6E6E73]">Base monthly recurring (INR)</p>
            </div>

            <div className="liquid-glass-card rounded-2xl p-4 space-y-1">
              <p className="text-[11px] font-semibold text-[#6E6E73]">Creative MRR (incl. GST)</p>
              <p className="font-mono-num text-2xl font-bold text-[#1D1D1F] tabular-nums">
                {fmtInr(data.summary.activeCreativeMrrWithGst)}
              </p>
              <p className="text-[11px] text-[#067647] font-medium">
                Avg {fmtInr(data.summary.averageRevenuePerCreativeSubscriber)} / subscriber
              </p>
            </div>

            <div className="liquid-glass-card rounded-2xl p-4 space-y-1">
              <p className="text-[11px] font-semibold text-[#6E6E73]">Active Creative Subscribers</p>
              <p className="font-mono-num text-2xl font-bold text-[#1D1D1F] tabular-nums">
                {data.summary.activeCreativeSubscribers}
              </p>
              <p className="text-[11px] text-[#6E6E73]">
                {data.summary.pausedCreativeSubscribers} paused ·{' '}
                {data.summary.cancelledCreativeSubscribers} cancelled
              </p>
            </div>

            <div className="liquid-glass-card rounded-2xl p-4 space-y-1">
              <p className="text-[11px] font-semibold text-[#6E6E73]">Share of Total Active MRR</p>
              <p className="font-mono-num text-2xl font-bold text-[#1D1D1F] tabular-nums">
                {data.summary.creativeSharePercent}%
              </p>
              <p className="text-[11px] text-[#6E6E73]">
                Total active MRR: {fmtInr(data.summary.totalActiveMrr)}
              </p>
            </div>
          </div>

          {data.summary.nonInrCreativeSubscriptions.length > 0 && (
            <div className="rounded-2xl liquid-glass-panel px-4 py-3 text-xs text-[#1D1D1F] flex flex-wrap items-center gap-3">
              <span className="font-bold">International Creative Subscriptions:</span>
              {data.summary.nonInrCreativeSubscriptions.map((row) => (
                <span key={row.currency} className="font-mono-num text-[#6E6E73] tabular-nums">
                  {row.count} active in {row.currency} ({row.currency}{' '}
                  {row.monthlyTotal.toLocaleString('en-US')}/mo)
                </span>
              ))}
            </div>
          )}

          {/* Recharts Trend Line Chart */}
          <div className="liquid-glass-card rounded-3xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-base font-bold text-[#1D1D1F] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#0071E3]" aria-hidden="true" />
                  <span>Monthly Recurring Revenue (MRR) Trend — Subscribed Creative Services</span>
                </h3>
                <p className="text-[11px] text-[#6E6E73] mt-0.5">
                  Tracks contracted Creative Services MRR (INR), GST-inclusive MRR, and realized live collections across the trailing {data.monthsWindow} IST months.
                </p>
              </div>
              <span className="font-mono-num text-[11px] text-[#6E6E73]">
                Updated {new Date(data.generatedAt).toLocaleTimeString('en-IN', { timeStyle: 'short' })}
              </span>
            </div>

            {!hasChartActivity && (
              <div className="rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED] p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#0071E3] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-bold text-[#1D1D1F]">
                      No active creative subscriptions enrolled yet
                    </p>
                    <p className="text-[#6E6E73]">
                      Once customers subscribe to monthly Business Creative &amp; Documentation Services, their contracted MRR and realized renewal payments populate this trend chart automatically.
                    </p>
                  </div>
                </div>
                {onJumpToRecurring && (
                  <GlassButton variant="primary" size="sm" onClick={onJumpToRecurring}>
                    <span>Enroll Subscription</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </GlassButton>
                )}
              </div>
            )}

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data.monthlyTrend}
                  margin={{ top: 10, right: 18, left: 6, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E8ED" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6E6E73' }} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#6E6E73' }}
                    tickFormatter={(v: number) =>
                      v >= 1000 ? `₹${Math.round(v / 1000)}k` : `₹${v}`
                    }
                  />
                  <Tooltip
                    formatter={(val, name) => [fmtInr(Number(val ?? 0) || 0), String(name ?? '')]}
                    contentStyle={{
                      borderRadius: '14px',
                      border: '1px solid #E8E8ED',
                      backgroundColor: 'rgba(255,255,255,0.96)',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line
                    type="monotone"
                    dataKey="creativeMrr"
                    name="Creative Services MRR (Base)"
                    stroke="#0071E3"
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: '#0071E3' }}
                    activeDot={{ r: 5.5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="creativeMrrWithGst"
                    name="Creative MRR (incl. GST)"
                    stroke="#6E6E73"
                    strokeWidth={1.75}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="realizedCreativeCollections"
                    name="Realized Creative Collections"
                    stroke="#067647"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#067647' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Service-Level MRR Breakdown */}
          <div className="liquid-glass-card rounded-3xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E8E8ED] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#0071E3]" aria-hidden="true" />
                <h3 className="font-display text-base font-bold text-[#1D1D1F]">
                  Subscribed Creative Services Breakdown ({data.byCreativeService.length})
                </h3>
              </div>
              {onJumpToRecurring && (
                <button
                  type="button"
                  onClick={onJumpToRecurring}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#0071E3] hover:underline cursor-pointer whitespace-nowrap"
                >
                  <span>Manage Subscriptions</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F5F5F7]/85 border-b border-[#E8E8ED] text-[#6E6E73] font-semibold">
                    <th className="py-3 px-4">Creative Service</th>
                    <th className="py-3 px-4 text-right">Catalogue Monthly Rate</th>
                    <th className="py-3 px-4 text-right">Active Subscribers</th>
                    <th className="py-3 px-4 text-right">Paused</th>
                    <th className="py-3 px-4 text-right">Active MRR (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8ED]">
                  {data.byCreativeService.map((row) => (
                    <tr key={row.serviceId} className="hover:bg-white/75 transition-colors">
                      <td className="py-3 px-4 font-semibold text-[#1D1D1F]">
                        {row.serviceName}
                      </td>
                      <td className="py-3 px-4 text-right font-mono-num text-[#6E6E73] tabular-nums">
                        {fmtInr(row.listMonthlyPrice)}/mo
                      </td>
                      <td className="py-3 px-4 text-right font-mono-num font-bold text-[#1D1D1F] tabular-nums">
                        {row.activeCount}
                      </td>
                      <td className="py-3 px-4 text-right font-mono-num text-[#6E6E73] tabular-nums">
                        {row.pausedCount}
                      </td>
                      <td className="py-3 px-4 text-right font-mono-num font-bold text-[#0071E3] tabular-nums">
                        {fmtInr(row.mrrInr)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
