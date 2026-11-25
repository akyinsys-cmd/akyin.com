import {
  AlertCircle,
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  CreditCard,
  FileText,
  Inbox,
  ShieldCheck,
  TrendingUp,
  Users,
} from 'lucide-react';
import { CrmLead, DashboardKpis, SuitePayment, SuiteQuotation } from '../../services/suiteApi';
import { GlassButton } from '../liquid-glass';

interface AdminSuiteOverviewProps {
  loading: boolean;
  error: string;
  data: {
    kpis: DashboardKpis;
    recentLeads: CrmLead[];
    recentAppointments: Array<{
      bookingId: string;
      customerName: string;
      appointmentDate: string;
      startTime: string;
      endTime: string;
      bookingStatus: string;
      consultationTopic: string;
    }>;
    recentPayments: SuitePayment[];
    recentQuotations: SuiteQuotation[];
    razorpayMode: 'test' | 'live';
    razorpayConfigured: boolean;
    smtpConfigured: boolean;
  } | null;
  onRefresh: () => void;
  onJumpToTab: (tab: string) => void;
}

function fmtInr(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value || 0);
}

export function AdminSuiteOverview({
  loading,
  error,
  data,
  onRefresh,
  onJumpToTab,
}: AdminSuiteOverviewProps) {
  if (error) {
    return (
      <div className="rounded-3xl bg-[#FEF3F2] border border-[#FECDCA] p-6 text-xs text-[#B42318] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
        <GlassButton variant="subtle" size="sm" onClick={onRefresh}>
          Retry
        </GlassButton>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className="liquid-glass-card rounded-3xl p-12 text-center text-sm text-[#6E6E73]">
        Loading live AKYIN Business Suite metrics...
      </div>
    );
  }

  if (!data) return null;

  const { kpis } = data;

  const kpiCards = [
    {
      label: 'Total clients',
      value: String(kpis.totalClients),
      sub: `${kpis.reportedClientsHandled} Clients Currently Handled`,
      tab: 'Clients',
    },
    {
      label: 'New enquiries',
      value: String(kpis.newEnquiries),
      sub: 'Stage: NEW',
      tab: 'Leads and Enquiries',
    },
    {
      label: 'Qualified leads',
      value: String(kpis.qualifiedLeads),
      sub: 'Qualified / Proposal / Negotiation / Won',
      tab: 'Leads and Enquiries',
    },
    {
      label: 'Pending follow-ups',
      value: String(kpis.pendingFollowUps),
      sub: 'Scheduled or tagged follow-ups',
      tab: 'Leads and Enquiries',
    },
    {
      label: 'Quotations sent',
      value: String(kpis.quotationsSent),
      sub: 'Awaiting client response',
      tab: 'Quotations',
    },
    {
      label: 'Quotations accepted',
      value: String(kpis.quotationsAccepted),
      sub: 'Explicitly approved by clients',
      tab: 'Quotations',
    },
    {
      label: 'Payments pending',
      value: String(kpis.paymentsPending),
      sub: 'Unpaid / partial invoices',
      tab: 'Payments',
    },
    {
      label: 'Payments received',
      value: String(kpis.paymentsReceived),
      sub: 'Verified live settlements',
      tab: 'Payments',
    },
    {
      label: 'Monthly revenue collected',
      value: fmtInr(kpis.monthlyRevenueCollected),
      sub: 'Net live verified collections (this month IST)',
      tab: 'Revenue Reports',
    },
    {
      label: 'Outstanding receivables',
      value: fmtInr(kpis.outstandingReceivables),
      sub: 'Unpaid balance across active invoices',
      tab: 'Payments',
    },
    {
      label: 'Appointments booked',
      value: String(kpis.appointmentsBooked),
      sub: 'Active non-cancelled IST consultations',
      tab: 'Appointments',
    },
    {
      label: 'Conversion rate',
      value: `${kpis.conversionRate}%`,
      sub: 'WON leads / total enquiries',
      tab: 'Revenue Reports',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F]">
            Executive Overview
          </h2>
          <p className="text-xs text-[#6E6E73] mt-0.5">
            Live database metrics only — zero placeholder revenue or synthetic client identities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${
              data.razorpayMode === 'live'
                ? 'bg-[#ECFDF3] border-[#ABEFC6] text-[#067647]'
                : 'bg-[#FFF7ED] border-[#FED7AA] text-[#C2410C]'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" aria-hidden="true" />
            Razorpay: {data.razorpayMode.toUpperCase()}
            {!data.razorpayConfigured && ' (Keys unset)'}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${
              data.smtpConfigured
                ? 'bg-[#ECFDF3] border-[#ABEFC6] text-[#067647]'
                : 'bg-white border-[#E8E8ED] text-[#6E6E73]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            SMTP Alerts: {data.smtpConfigured ? 'Live' : 'Log-only (SMTP unset)'}
          </span>
          <GlassButton variant="subtle" size="sm" onClick={onRefresh}>
            Refresh
          </GlassButton>
        </div>
      </div>

      {/* 12 Required KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <button
            key={card.label}
            type="button"
            onClick={() => onJumpToTab(card.tab)}
            className="liquid-glass-card rounded-2xl p-5 text-left space-y-1.5 hover:border-[#0071E3]/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-[#6E6E73]">{card.label}</p>
              <ArrowRight
                className="w-3.5 h-3.5 text-[#A1A1A6] group-hover:text-[#0071E3] transition-colors"
                aria-hidden="true"
              />
            </div>
            <p className="font-mono-num text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight">
              {card.value}
            </p>
            <p className="text-[11px] text-[#6E6E73] truncate">{card.sub}</p>
          </button>
        ))}
      </div>

      {/* Recent Activity Quadrants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="liquid-glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 font-display text-base font-bold text-[#1D1D1F]">
              <Inbox className="w-4 h-4 text-[#0071E3]" aria-hidden="true" />
              <span>Recent Leads &amp; Enquiries</span>
            </div>
            <button
              type="button"
              onClick={() => onJumpToTab('Leads and Enquiries')}
              className="text-xs font-semibold text-[#0071E3] hover:underline cursor-pointer"
            >
              Open CRM
            </button>
          </div>
          {data.recentLeads.length === 0 ? (
            <p className="text-xs text-[#6E6E73] py-4">No enquiries recorded yet.</p>
          ) : (
            <ul className="divide-y divide-[#E8E8ED] text-xs">
              {data.recentLeads.slice(0, 5).map((lead) => (
                <li key={lead.leadId} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-[#1D1D1F] truncate">
                      {lead.fullName} · {lead.companyName || 'Direct'}
                    </p>
                    <p className="text-[11px] text-[#6E6E73] truncate">
                      {lead.requiredService} ({lead.campaignSource})
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-[#F5F5F7] border border-[#E8E8ED] font-mono-num text-[10px] font-bold text-[#1D1D1F] shrink-0">
                    {lead.stage}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="liquid-glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 font-display text-base font-bold text-[#1D1D1F]">
              <FileText className="w-4 h-4 text-[#0071E3]" aria-hidden="true" />
              <span>Recent Quotations</span>
            </div>
            <button
              type="button"
              onClick={() => onJumpToTab('Quotations')}
              className="text-xs font-semibold text-[#0071E3] hover:underline cursor-pointer"
            >
              Manage Quotes
            </button>
          </div>
          {data.recentQuotations.length === 0 ? (
            <p className="text-xs text-[#6E6E73] py-4">No quotations issued yet.</p>
          ) : (
            <ul className="divide-y divide-[#E8E8ED] text-xs">
              {data.recentQuotations.slice(0, 5).map((qt) => (
                <li key={qt.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-[#1D1D1F] truncate">
                      <span className="font-mono-num">{qt.quoteNumber}</span> · {qt.companyName || qt.customerName}
                    </p>
                    <p className="font-mono-num text-[11px] text-[#6E6E73]">
                      {qt.currency} {qt.grandTotal.toLocaleString('en-IN')} · v{qt.version}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-[#E8E8ED] text-[10px] font-bold text-[#1D1D1F] shrink-0">
                    {qt.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="liquid-glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 font-display text-base font-bold text-[#1D1D1F]">
              <CalendarCheck2 className="w-4 h-4 text-[#0071E3]" aria-hidden="true" />
              <span>Recent Consultations</span>
            </div>
            <button
              type="button"
              onClick={() => onJumpToTab('Appointments')}
              className="text-xs font-semibold text-[#0071E3] hover:underline cursor-pointer"
            >
              Open Calendar
            </button>
          </div>
          {data.recentAppointments.length === 0 ? (
            <p className="text-xs text-[#6E6E73] py-4">No advisory appointments booked yet.</p>
          ) : (
            <ul className="divide-y divide-[#E8E8ED] text-xs">
              {data.recentAppointments.slice(0, 5).map((appt) => (
                <li key={appt.bookingId} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-[#1D1D1F] truncate">
                      {appt.customerName} ({appt.bookingId})
                    </p>
                    <p className="font-mono-num text-[11px] text-[#6E6E73] truncate">
                      {appt.appointmentDate} · {appt.startTime}–{appt.endTime} IST
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-[#E8E8ED] text-[10px] font-bold text-[#1D1D1F] shrink-0">
                    {appt.bookingStatus}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="liquid-glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 font-display text-base font-bold text-[#1D1D1F]">
              <TrendingUp className="w-4 h-4 text-[#0071E3]" aria-hidden="true" />
              <span>Recent Payment Activity</span>
            </div>
            <button
              type="button"
              onClick={() => onJumpToTab('Payments')}
              className="text-xs font-semibold text-[#0071E3] hover:underline cursor-pointer"
            >
              Open Payments
            </button>
          </div>
          {data.recentPayments.length === 0 ? (
            <p className="text-xs text-[#6E6E73] py-4">No payments recorded yet.</p>
          ) : (
            <ul className="divide-y divide-[#E8E8ED] text-xs">
              {data.recentPayments.slice(0, 5).map((pay) => (
                <li key={pay.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-[#1D1D1F] truncate">
                      {pay.customerName} · {pay.currency} {pay.amount.toLocaleString('en-IN')}
                    </p>
                    <p className="font-mono-num text-[11px] text-[#6E6E73]">
                      {pay.gateway} ({pay.mode.toUpperCase()}) · {pay.verified ? 'Verified' : 'Unverified'}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold shrink-0 ${
                      pay.verified && pay.mode === 'live'
                        ? 'bg-[#ECFDF3] border-[#ABEFC6] text-[#067647]'
                        : 'bg-[#F5F5F7] border-[#E8E8ED] text-[#6E6E73]'
                    }`}
                  >
                    {pay.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Integrity Banner */}
      <div className="rounded-2xl bg-white/80 border border-[#E8E8ED] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-[#6E6E73]">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#0071E3]" aria-hidden="true" />
          <span>
            Client Portfolio Integrity: Displays{' '}
            <strong className="text-[#1D1D1F]">{kpis.reportedClientsHandled} Clients Currently Handled</strong>{' '}
            while listing strictly verified directory records ({kpis.totalClients} verified).
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#067647]">
          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Zero fabricated metrics</span>
        </div>
      </div>
    </div>
  );
}
