import { useCallback, useEffect, useState } from 'react';
import { Download, Printer, ShieldAlert } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { RevenueReportSummary, suiteApi } from '../../services/suiteApi';
import { GlassButton } from '../liquid-glass';

const PRESETS = [
  { id: 'today', label: 'Today (IST)' },
  { id: 'this_week', label: 'This Week' },
  { id: 'this_month', label: 'This Month' },
  { id: 'previous_month', label: 'Previous Month' },
  { id: 'financial_year', label: 'India FY (Apr–Mar)' },
  { id: 'custom', label: 'Custom Range' },
];

function fmtInr(v: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(v || 0);
}

export function AdminRevenueReportsPanel() {
  const [preset, setPreset] = useState('this_month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [leadSource, setLeadSource] = useState('');
  const [serviceCategories, setServiceCategories] = useState<string[]>([]);
  const [report, setReport] = useState<RevenueReportSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    suiteApi
      .getServices()
      .then((res) => setServiceCategories(res.categories || []))
      .catch(() => undefined);
  }, []);

  const loadReport = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await suiteApi.getRevenueReport({
        preset,
        startDate: preset === 'custom' && startDate ? startDate : undefined,
        endDate: preset === 'custom' && endDate ? endDate : undefined,
        serviceCategory: serviceCategory || undefined,
        leadSource: leadSource || undefined,
      });
      setReport(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to generate revenue report.');
    } finally {
      setLoading(false);
    }
  }, [preset, startDate, endDate, serviceCategory, leadSource]);

  useEffect(() => {
    void loadReport();
  }, [loadReport]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F]">
            Actual Revenue &amp; Financial Reports
          </h2>
          <p className="text-xs text-[#6E6E73] mt-0.5">
            Strictly separates quotes, invoices, authorised vs live verified captured collections, refunds, GST, and gateway fees.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <GlassButton
            variant="subtle"
            size="sm"
            onClick={() =>
              void suiteApi.downloadAuthorizedCsv(
                `/api/suite/reports/export.csv?preset=${encodeURIComponent(preset)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`,
                `akyin-revenue-${preset}.csv`
              )
            }
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Export CSV</span>
          </GlassButton>
          <GlassButton variant="primary" size="sm" onClick={() => window.print()}>
            <Printer className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Print A4 Report</span>
          </GlassButton>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="liquid-glass-card rounded-2xl p-4 flex flex-wrap items-end gap-3 text-xs print:hidden">
        <div>
          <label className="block font-semibold text-[#1D1D1F] mb-1">Period</label>
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value)}
            className="rounded-xl border border-[#E8E8ED] bg-white px-3 py-2 font-semibold"
          >
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {preset === 'custom' && (
          <>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-xl border border-[#E8E8ED] bg-white px-3 py-2 font-mono-num"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-xl border border-[#E8E8ED] bg-white px-3 py-2 font-mono-num"
              />
            </div>
          </>
        )}

        <div>
          <label className="block font-semibold text-[#1D1D1F] mb-1">Service Filter</label>
          <select
            value={serviceCategory}
            onChange={(e) => setServiceCategory(e.target.value)}
            className="rounded-xl border border-[#E8E8ED] bg-white px-3 py-2 font-semibold"
          >
            <option value="">All Service Categories</option>
            {serviceCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-[#1D1D1F] mb-1">Lead Source</label>
          <input
            type="text"
            value={leadSource}
            onChange={(e) => setLeadSource(e.target.value)}
            placeholder="All sources"
            className="rounded-xl border border-[#E8E8ED] bg-white px-3 py-2"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-[#FEF3F2] border border-[#FECDCA] px-4 py-3 text-xs font-semibold text-[#B42318]">
          {error}
        </div>
      )}

      {loading && !report ? (
        <div className="liquid-glass-card rounded-3xl p-10 text-center text-xs text-[#6E6E73]">
          Computing live financial breakdown...
        </div>
      ) : report ? (
        <>
          <div className="text-[11px] font-mono-num text-[#6E6E73]">
            Period Window (IST): {report.period.startDate} → {report.period.endDate}
          </div>

          {/* Separated Financial Stage Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Quoted Value', val: fmtInr(report.metrics.quotedValue), note: 'Pipeline proposals' },
              { label: 'Accepted Quotes', val: fmtInr(report.metrics.acceptedQuotationValue), note: 'Client signed off' },
              { label: 'Invoiced Amount', val: fmtInr(report.metrics.invoicedAmount), note: 'Issued invoices' },
              { label: 'Payment Authorised', val: fmtInr(report.metrics.paymentAuthorised), note: 'Pending capture' },
              { label: 'Gross Collections (Live)', val: fmtInr(report.metrics.grossCollections), note: 'Verified live captured' },
              { label: 'Refunds', val: fmtInr(report.metrics.refunds), note: 'Deducted from gross' },
              { label: 'Net Collections', val: fmtInr(report.metrics.netCollections), note: 'Gross minus refunds' },
              { label: 'Outstanding Receivables', val: fmtInr(report.metrics.outstandingReceivables), note: 'Remaining balance' },
              { label: 'GST Collected', val: fmtInr(report.metrics.gstCollected), note: 'Tax component' },
              { label: 'Gateway Fees', val: fmtInr(report.metrics.gatewayFees), note: 'Processor fees' },
              {
                label: 'Net Revenue After Fees & Refunds',
                val: fmtInr(report.metrics.netRevenueAfterFeesAndRefunds),
                note: 'Net realized cash',
              },
              {
                label: 'Test-Mode Excluded Total',
                val: fmtInr(report.metrics.testModeTotal),
                note: `${report.metrics.excludedFailedOrUnverifiedCount} failed/unverified excluded`,
              },
            ].map((m) => (
              <div key={m.label} className="liquid-glass-card rounded-2xl p-4 space-y-1">
                <p className="text-[11px] font-medium text-[#6E6E73]">{m.label}</p>
                <p className="font-mono-num text-xl font-extrabold text-[#1D1D1F]">{m.val}</p>
                <p className="text-[10px] text-[#6E6E73]">{m.note}</p>
              </div>
            ))}
          </div>

          {(report.metrics.testModeTotal > 0 || report.metrics.excludedFailedOrUnverifiedCount > 0) && (
            <div className="rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] px-4 py-3 text-xs text-[#92400E] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>
                Reporting Integrity Guard: Test payments ({fmtInr(report.metrics.testModeTotal)}) and{' '}
                {report.metrics.excludedFailedOrUnverifiedCount} failed/abandoned/unverified attempt(s)
                are excluded from live revenue totals.
              </span>
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="liquid-glass-card rounded-3xl p-6 space-y-4">
              <h3 className="font-display text-base font-bold text-[#1D1D1F]">
                Monthly Net Collections Trend
              </h3>
              {report.byMonth.length === 0 ? (
                <p className="text-xs text-[#6E6E73] py-8 text-center">
                  No captured live collections in this window yet.
                </p>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={report.byMonth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E8E8ED" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="net" name="Net Collections" fill="#0071E3" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="liquid-glass-card rounded-3xl p-6 space-y-4">
              <h3 className="font-display text-base font-bold text-[#1D1D1F]">
                Collected Revenue by Service Category
              </h3>
              {report.byService.length === 0 ? (
                <p className="text-xs text-[#6E6E73] py-8 text-center">
                  No service invoice or payment records in this period.
                </p>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={report.byService}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E8E8ED" />
                      <XAxis dataKey="service" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="collected" name="Collected" fill="#1D1D1F" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Client-Wise Breakdown Table */}
          <div className="liquid-glass-card rounded-3xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E8E8ED]">
              <h3 className="font-display text-base font-bold text-[#1D1D1F]">
                Client-Wise &amp; Source Breakdown
              </h3>
            </div>
            {report.byClient.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#6E6E73]">
                No invoiced or collected client activity in this range.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F5F5F7] border-b border-[#E8E8ED] text-[#6E6E73] font-semibold">
                      <th className="py-3 px-4">Client</th>
                      <th className="py-3 px-4">Invoiced</th>
                      <th className="py-3 px-4">Collected (Live)</th>
                      <th className="py-3 px-4">Outstanding</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E8ED]">
                    {report.byClient.map((row) => (
                      <tr key={row.clientName}>
                        <td className="py-3 px-4 font-semibold text-[#1D1D1F]">{row.clientName}</td>
                        <td className="py-3 px-4 font-mono-num">{fmtInr(row.invoiced)}</td>
                        <td className="py-3 px-4 font-mono-num font-bold text-[#067647]">
                          {fmtInr(row.collected)}
                        </td>
                        <td className="py-3 px-4 font-mono-num">{fmtInr(row.outstanding)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
