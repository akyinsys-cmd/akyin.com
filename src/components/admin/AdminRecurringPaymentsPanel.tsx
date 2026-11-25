import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BellRing,
  CheckCircle2,
  Clock,
  Mail,
  PauseCircle,
  Play,
  PlayCircle,
  Plus,
  Receipt,
  RefreshCw,
  Search,
  XCircle,
} from 'lucide-react';
import {
  RenewalReminderStatusResponse,
  SuiteClientRecord,
  SuiteInvoice,
  SuiteServiceItem,
  SuiteSubscription,
  suiteApi,
} from '../../services/suiteApi';
import { GlassButton, GlassModal } from '../liquid-glass';

interface AdminRecurringPaymentsPanelProps {
  onChanged?: () => void;
}

function fmtMoney(amount: number, currency: 'INR' | 'AED' | 'USD' = 'INR'): string {
  return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'INR' ? 0 : 2,
  }).format(amount || 0);
}

export function AdminRecurringPaymentsPanel({ onChanged }: AdminRecurringPaymentsPanelProps) {
  const [subscriptions, setSubscriptions] = useState<SuiteSubscription[]>([]);
  const [monthlyServices, setMonthlyServices] = useState<SuiteServiceItem[]>([]);
  const [clients, setClients] = useState<SuiteClientRecord[]>([]);
  const [renewalInvoices, setRenewalInvoices] = useState<SuiteInvoice[]>([]);

  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');
  const [creating, setCreating] = useState(false);
  const [reminderStatus, setReminderStatus] = useState<RenewalReminderStatusResponse | null>(null);
  const [runningSweep, setRunningSweep] = useState(false);
  const [showReminderPreview, setShowReminderPreview] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'PAUSED' | 'CANCELLED'>('ALL');
  const [creativeOnly, setCreativeOnly] = useState(false);

  // Create Subscription Modal
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [currency, setCurrency] = useState<'INR' | 'AED' | 'USD'>('INR');
  const [monthlyAmount, setMonthlyAmount] = useState('0');
  const [gstEnabled, setGstEnabled] = useState(true);
  const [gstRate, setGstRate] = useState('18');
  const [billingCycleDay, setBillingCycleDay] = useState('1');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');

  const loadRecurringData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [res, remStatus] = await Promise.all([
        suiteApi.getSubscriptions(),
        suiteApi.getRenewalReminderStatus().catch(() => null),
      ]);
      setSubscriptions(res.subscriptions || []);
      setMonthlyServices(res.monthlyServices || []);
      setClients(res.clients || []);
      setRenewalInvoices(res.renewalInvoices || []);
      if (remStatus) {
        setReminderStatus(remStatus);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load recurring billing records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRecurringData();
  }, [loadRecurringData]);

  const prioritizedServices = useMemo(() => {
    const creative = monthlyServices.filter(
      (s) => s.category === 'Business Creative & Documentation Services'
    );
    const others = monthlyServices.filter(
      (s) => s.category !== 'Business Creative & Documentation Services'
    );
    return { creative, others };
  }, [monthlyServices]);

  const applyServiceDefaults = useCallback(
    (srvId: string, cur: 'INR' | 'AED' | 'USD') => {
      const srv = monthlyServices.find((s) => s.id === srvId);
      if (!srv) return;
      const tierKey = cur === 'AED' ? 'aed' : cur === 'USD' ? 'usd' : null;
      const tierPrice =
        tierKey && srv.internationalPricing?.[tierKey]?.packagePrice !== undefined
          ? Number(srv.internationalPricing[tierKey]!.packagePrice)
          : undefined;
      const resolved =
        tierPrice ?? (Number(srv.monthlyPrice ?? srv.recurringFee ?? srv.packagePrice ?? 0) || 0);
      setMonthlyAmount(String(resolved));
      setGstEnabled(Boolean(srv.gstEnabled));
      setGstRate(String(srv.gstRate ?? 18));
    },
    [monthlyServices]
  );

  const openCreateModal = () => {
    const defaultSrv = prioritizedServices.creative[0] || monthlyServices[0];
    setSelectedClientId('');
    setCustomerName('');
    setCompanyName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setCurrency('INR');
    setBillingCycleDay('1');
    setStartDate(new Date().toISOString().slice(0, 10));
    setNotes('');
    if (defaultSrv) {
      setSelectedServiceId(defaultSrv.id);
      const amt =
        Number(defaultSrv.monthlyPrice ?? defaultSrv.recurringFee ?? defaultSrv.packagePrice ?? 0) || 0;
      setMonthlyAmount(String(amt));
      setGstEnabled(Boolean(defaultSrv.gstEnabled));
      setGstRate(String(defaultSrv.gstRate ?? 18));
    } else {
      setSelectedServiceId('');
      setMonthlyAmount('0');
    }
    setCreateOpen(true);
  };

  const handlePrefillClient = (clientId: string) => {
    setSelectedClientId(clientId);
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;
    setCustomerName(client.contactPerson || client.name);
    setCompanyName(client.companyName || client.name);
    if (client.email) setCustomerEmail(client.email);
    if (client.phone) setCustomerPhone(client.phone);
  };

  const handleCreateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServiceId) {
      setError('Please select a monthly service plan.');
      return;
    }
    setCreating(true);
    setError('');
    setNotice('');
    try {
      const res = await suiteApi.createSubscription({
        clientId: selectedClientId,
        customerName,
        companyName,
        customerEmail,
        customerPhone,
        serviceId: selectedServiceId,
        currency,
        monthlyAmount: Number(monthlyAmount) || 0,
        gstEnabled,
        gstRate: Number(gstRate) || 18,
        billingCycleDay: Number(billingCycleDay) || 1,
        startDate,
        nextBillingDate: startDate,
        notes,
      });
      setCreateOpen(false);
      setNotice(
        `Created subscription ${res.subscription.subscriptionCode} for ${res.subscription.companyName || res.subscription.customerName} (${res.subscription.serviceName}).`
      );
      await loadRecurringData();
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create recurring subscription.');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (sub: SuiteSubscription, nextStatus: 'ACTIVE' | 'PAUSED' | 'CANCELLED') => {
    setSavingId(sub.id);
    setError('');
    setNotice('');
    try {
      const res = await suiteApi.updateSubscriptionStatus(sub.id, nextStatus);
      setNotice(
        `Subscription ${res.subscription.subscriptionCode} (${res.subscription.serviceName}) is now ${res.subscription.status}.`
      );
      await loadRecurringData();
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update subscription status.');
    } finally {
      setSavingId('');
    }
  };

  const handleTriggerRenewal = async (sub: SuiteSubscription) => {
    setSavingId(sub.id);
    setError('');
    setNotice('');
    try {
      const res = await suiteApi.triggerSubscriptionRenewal(sub.id);
      setNotice(
        `Generated monthly renewal invoice ${res.invoice.invoiceNumber} (${res.invoice.currency} ${res.invoice.totalAmount.toLocaleString('en-IN')}) for ${sub.companyName || sub.customerName}. Next billing date updated to ${res.subscription.nextBillingDate}.`
      );
      await loadRecurringData();
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to trigger renewal invoice.');
    } finally {
      setSavingId('');
    }
  };

  const handleRunReminderSweep = async () => {
    setRunningSweep(true);
    setError('');
    setNotice('');
    try {
      const res = await suiteApi.runRenewalReminderSweep({ leadDays: 3 });
      setNotice(
        `Renewal reminder check complete (${res.leadDays}-day window): ${res.dueCount} due subscription(s), ${res.sentCount} sent via SMTP, ${res.loggedUnconfiguredCount} queued/logged (SMTP not configured), ${res.skippedAlreadyRemindedCount} already notified for this cycle.`
      );
      await loadRecurringData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to run renewal reminder sweep.');
    } finally {
      setRunningSweep(false);
    }
  };

  const filteredSubscriptions = useMemo(() => {
    const q = search.trim().toLowerCase();
    return subscriptions.filter((sub) => {
      if (statusFilter !== 'ALL' && sub.status !== statusFilter) return false;
      if (
        creativeOnly &&
        sub.serviceCategory !== 'Business Creative & Documentation Services'
      ) {
        return false;
      }
      if (!q) return true;
      return (
        sub.subscriptionCode.toLowerCase().includes(q) ||
        sub.customerName.toLowerCase().includes(q) ||
        sub.companyName.toLowerCase().includes(q) ||
        sub.customerEmail.toLowerCase().includes(q) ||
        sub.serviceName.toLowerCase().includes(q)
      );
    });
  }, [subscriptions, search, statusFilter, creativeOnly]);

  const metrics = useMemo(() => {
    const active = subscriptions.filter((s) => s.status === 'ACTIVE');
    const paused = subscriptions.filter((s) => s.status === 'PAUSED');
    const activeInrMrr = active
      .filter((s) => s.currency === 'INR')
      .reduce((sum, s) => {
        const taxMult = s.gstEnabled ? 1 + (s.gstRate || 0) / 100 : 1;
        return sum + s.monthlyAmount * taxMult;
      }, 0);
    return {
      activeCount: active.length,
      pausedCount: paused.length,
      activeInrMrr: Math.round(activeInrMrr),
      renewalInvoicesCount: renewalInvoices.length,
    };
  }, [subscriptions, renewalInvoices]);

  const inputCls =
    'w-full rounded-xl border border-[#E8E8ED] bg-white px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F]">
            Manage Recurring Payments
          </h2>
          <p className="text-xs text-[#6E6E73] mt-0.5">
            Track active monthly creative &amp; retainer subscriptions, pause or resume billing, and manually trigger renewal invoices.
          </p>
        </div>

        <GlassButton variant="primary" size="sm" onClick={openCreateModal}>
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          <span>New Monthly Subscription</span>
        </GlassButton>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="liquid-glass-card rounded-2xl p-4 space-y-1">
          <p className="text-[11px] font-semibold text-[#6E6E73]">Active Subscriptions</p>
          <p className="font-mono-num text-2xl font-bold text-[#1D1D1F] tabular-nums">
            {metrics.activeCount}
          </p>
          <p className="text-[11px] text-[#067647] font-medium">Billing enabled</p>
        </div>

        <div className="liquid-glass-card rounded-2xl p-4 space-y-1">
          <p className="text-[11px] font-semibold text-[#6E6E73]">Active Monthly Value (INR)</p>
          <p className="font-mono-num text-2xl font-bold text-[#0071E3] tabular-nums">
            {fmtMoney(metrics.activeInrMrr, 'INR')}
          </p>
          <p className="text-[11px] text-[#6E6E73]">Includes applicable GST</p>
        </div>

        <div className="liquid-glass-card rounded-2xl p-4 space-y-1">
          <p className="text-[11px] font-semibold text-[#6E6E73]">Paused Subscriptions</p>
          <p className="font-mono-num text-2xl font-bold text-[#1D1D1F] tabular-nums">
            {metrics.pausedCount}
          </p>
          <p className="text-[11px] text-[#6E6E73]">Hold until resumed</p>
        </div>

        <div className="liquid-glass-card rounded-2xl p-4 space-y-1">
          <p className="text-[11px] font-semibold text-[#6E6E73]">Renewal Invoices Issued</p>
          <p className="font-mono-num text-2xl font-bold text-[#1D1D1F] tabular-nums">
            {metrics.renewalInvoicesCount}
          </p>
          <p className="text-[11px] text-[#6E6E73]">Recurring billing ledger</p>
        </div>
      </div>

      {/* Automated Subscription Renewal Reminder Cron Service */}
      {reminderStatus && (
        <div className="liquid-glass-card rounded-3xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EEF6FF] border border-[#CBE2FF] flex items-center justify-center shrink-0">
                <BellRing className="w-4 h-4 text-[#0071E3]" aria-hidden="true" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-base font-bold text-[#1D1D1F]">
                    Automated Subscription Renewal Reminder Service
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-md font-mono-num text-[10px] font-bold border ${
                      reminderStatus.scheduler.active
                        ? 'bg-[#ECFDF3] border-[#ABEFC6] text-[#067647]'
                        : 'bg-[#F5F5F7] border-[#E8E8ED] text-[#6E6E73]'
                    }`}
                  >
                    {reminderStatus.scheduler.active
                      ? `Cron Active · Every ${reminderStatus.scheduler.intervalHours}h · ${reminderStatus.scheduler.defaultLeadDays}d Lead`
                      : 'Cron Standby'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md font-mono-num text-[10px] font-bold border ${
                      reminderStatus.smtpConfigured
                        ? 'bg-[#ECFDF3] border-[#ABEFC6] text-[#067647]'
                        : 'bg-[#FFFAEB] border-[#FEDF89] text-[#B54708]'
                    }`}
                  >
                    {reminderStatus.smtpConfigured ? 'SMTP Ready' : 'SMTP Unconfigured (Audit Log Mode)'}
                  </span>
                </div>
                <p className="text-xs text-[#6E6E73] mt-0.5">
                  Automatically identifies active monthly services within {reminderStatus.scheduler.defaultLeadDays} IST days of renewal and emails customers via configured SMTP credentials (deduplicated once per billing cycle).
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowReminderPreview((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E8ED] bg-white hover:bg-[#F5F5F7] text-[11px] font-semibold text-[#1D1D1F] cursor-pointer whitespace-nowrap shrink-0"
              >
                <Clock className="w-3.5 h-3.5 text-[#6E6E73]" aria-hidden="true" />
                <span>
                  {showReminderPreview
                    ? 'Hide Schedule & Logs'
                    : `7-Day Queue (${reminderStatus.upcomingCandidates.length}) & Logs`}
                </span>
              </button>
              <GlassButton
                variant="primary"
                size="sm"
                disabled={runningSweep}
                onClick={() => void handleRunReminderSweep()}
              >
                <Play className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{runningSweep ? 'Running Sweep...' : 'Run Reminder Sweep Now'}</span>
              </GlassButton>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-[11px]">
            <div className="rounded-xl bg-[#F5F5F7] border border-[#E8E8ED] px-3.5 py-2.5">
              <span className="text-[#6E6E73] font-semibold block">Due in Next 7 Days</span>
              <span className="font-mono-num font-bold text-[#1D1D1F] text-sm tabular-nums">
                {reminderStatus.upcomingCandidates.length} subscription(s)
              </span>
            </div>
            <div className="rounded-xl bg-[#F5F5F7] border border-[#E8E8ED] px-3.5 py-2.5">
              <span className="text-[#6E6E73] font-semibold block">Last Automated Sweep</span>
              <span className="font-mono-num font-bold text-[#1D1D1F] tabular-nums">
                {reminderStatus.scheduler.lastRunAt
                  ? new Date(reminderStatus.scheduler.lastRunAt).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })
                  : 'Pending initial run'}
              </span>
            </div>
            <div className="rounded-xl bg-[#F5F5F7] border border-[#E8E8ED] px-3.5 py-2.5">
              <span className="text-[#6E6E73] font-semibold block">Next Scheduled Sweep</span>
              <span className="font-mono-num font-bold text-[#1D1D1F] tabular-nums">
                {reminderStatus.scheduler.nextScheduledRunAt
                  ? new Date(reminderStatus.scheduler.nextScheduledRunAt).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })
                  : 'Scheduled'}
              </span>
            </div>
            <div className="rounded-xl bg-[#F5F5F7] border border-[#E8E8ED] px-3.5 py-2.5">
              <span className="text-[#6E6E73] font-semibold block">Recent Reminder Emails</span>
              <span className="font-mono-num font-bold text-[#1D1D1F] text-sm tabular-nums">
                {reminderStatus.reminderLogs.length} dispatched / logged
              </span>
            </div>
          </div>

          {showReminderPreview && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2 border-t border-[#E8E8ED] text-xs">
              <div className="space-y-2">
                <p className="font-bold text-[#1D1D1F] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#0071E3]" aria-hidden="true" />
                  <span>Upcoming Renewals (Next 7 IST Days)</span>
                </p>
                {reminderStatus.upcomingCandidates.length === 0 ? (
                  <p className="text-[11px] text-[#6E6E73] bg-[#F5F5F7] rounded-xl px-3.5 py-3">
                    No active subscriptions are due for renewal within the next 7 days.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {reminderStatus.upcomingCandidates.map((cand) => (
                      <div
                        key={cand.subscriptionId}
                        className="rounded-xl border border-[#E8E8ED] bg-white px-3.5 py-2.5 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-[#1D1D1F] truncate">
                            {cand.companyName || cand.customerName} · {cand.serviceName}
                          </p>
                          <p className="text-[11px] text-[#6E6E73] font-mono-num truncate">
                            {cand.customerEmail} · Due {cand.nextBillingDate} (
                            {cand.daysUntilRenewal === 0
                              ? 'Today'
                              : `${cand.daysUntilRenewal}d`}
                            )
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-mono-num font-bold text-[#1D1D1F] tabular-nums">
                            {fmtMoney(cand.totalAmountWithGst, cand.currency)}
                          </p>
                          <p
                            className={`text-[10px] font-bold ${
                              cand.alreadyRemindedForCycle ? 'text-[#067647]' : 'text-[#0071E3]'
                            }`}
                          >
                            {cand.alreadyRemindedForCycle ? 'Reminded' : 'Pending'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="font-bold text-[#1D1D1F] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#0071E3]" aria-hidden="true" />
                  <span>Recent Subscription Renewal Reminder Emails</span>
                </p>
                {reminderStatus.reminderLogs.length === 0 ? (
                  <p className="text-[11px] text-[#6E6E73] bg-[#F5F5F7] rounded-xl px-3.5 py-3">
                    No subscription renewal reminder emails have been triggered yet.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {reminderStatus.reminderLogs.slice(0, 8).map((log) => (
                      <div
                        key={log.id}
                        className="rounded-xl border border-[#E8E8ED] bg-white px-3.5 py-2.5 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-[#1D1D1F] truncate">{log.subject}</p>
                          <p className="text-[11px] text-[#6E6E73] font-mono-num truncate">
                            To: {log.recipient} ·{' '}
                            {new Date(log.timestamp).toLocaleString('en-IN', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-md font-mono-num text-[10px] font-bold shrink-0 ${
                            log.deliveryStatus === 'sent'
                              ? 'bg-[#ECFDF3] text-[#067647]'
                              : log.deliveryStatus === 'failed'
                                ? 'bg-[#FEF3F2] text-[#B42318]'
                                : 'bg-[#F5F5F7] text-[#6E6E73]'
                          }`}
                        >
                          {log.deliveryStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="liquid-glass-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[260px]">
          <div className="relative flex-1 max-w-sm">
            <Search
              className="w-4 h-4 text-[#A1A1A6] absolute left-3 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subscription, client, creative service..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E8ED] bg-white text-xs"
            />
          </div>

          <div
            role="tablist"
            aria-label="Subscription status filter"
            className="inline-flex p-1 rounded-xl bg-[#F5F5F7] border border-[#E8E8ED] gap-1"
          >
            {(['ALL', 'ACTIVE', 'PAUSED', 'CANCELLED'] as const).map((st) => (
              <button
                key={st}
                type="button"
                role="tab"
                aria-selected={statusFilter === st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-white text-[#1D1D1F] shadow-xs'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                {st === 'ALL' ? 'All' : st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#1D1D1F] cursor-pointer whitespace-nowrap">
          <input
            type="checkbox"
            checked={creativeOnly}
            onChange={(e) => setCreativeOnly(e.target.checked)}
            className="accent-[#0071E3]"
          />
          <span>Monthly Creative Services Only</span>
        </label>
      </div>

      {notice && (
        <div className="rounded-2xl liquid-glass-panel px-4 py-3 text-xs font-semibold text-[#1D1D1F] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#067647] shrink-0" aria-hidden="true" />
          <span>{notice}</span>
        </div>
      )}
      {error && (
        <div className="rounded-2xl bg-[#FEF3F2] border border-[#FECDCA] px-4 py-3 text-xs font-semibold text-[#B42318]">
          {error}
        </div>
      )}

      {/* Subscriptions Table */}
      <div className="liquid-glass-card rounded-3xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8E8ED] flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-base font-bold text-[#1D1D1F]">
            Customer Subscriptions ({filteredSubscriptions.length})
          </h3>
          <button
            type="button"
            onClick={() => void loadRecurringData()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E8ED] bg-white hover:bg-[#F5F5F7] text-[11px] font-semibold text-[#1D1D1F] cursor-pointer whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center text-xs text-[#6E6E73]">
            Loading customer subscriptions...
          </div>
        ) : filteredSubscriptions.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <p className="text-sm font-semibold text-[#1D1D1F]">
              {subscriptions.length === 0
                ? 'No customer recurring subscriptions enrolled yet'
                : 'No subscriptions match your current filters'}
            </p>
            <p className="text-xs text-[#6E6E73] max-w-md mx-auto">
              Enroll customers in monthly retainers or Business Creative &amp; Documentation Services (such as Social Media Thumbnails, PowerPoint Presentations, Excel Reports, or Logo Design) to pause/resume billing and trigger monthly renewal invoices.
            </p>
            {subscriptions.length === 0 && (
              <div className="pt-1">
                <GlassButton variant="primary" size="sm" onClick={openCreateModal}>
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Enroll First Customer Subscription</span>
                </GlassButton>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5F5F7]/85 border-b border-[#E8E8ED] text-[#6E6E73] font-semibold">
                  <th className="py-3 px-4">Subscription</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Monthly Service</th>
                  <th className="py-3 px-4">Recurring Rate</th>
                  <th className="py-3 px-4">Billing Schedule</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8ED]">
                {filteredSubscriptions.map((sub) => {
                  const isBusy = savingId === sub.id;
                  const totalWithTax = sub.gstEnabled
                    ? Math.round(sub.monthlyAmount * (1 + (sub.gstRate || 0) / 100) * 100) / 100
                    : sub.monthlyAmount;

                  return (
                    <tr key={sub.id} className="hover:bg-white/75 transition-colors">
                      <td className="py-3.5 px-4 font-mono-num whitespace-nowrap">
                        <p className="font-bold text-[#1D1D1F]">{sub.subscriptionCode}</p>
                        <p className="text-[11px] text-[#6E6E73]">Started {sub.startDate}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-[#1D1D1F]">
                          {sub.companyName || sub.customerName}
                        </p>
                        <p className="text-[11px] text-[#6E6E73]">
                          {sub.customerName} · {sub.customerEmail}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-[#1D1D1F]">{sub.serviceName}</p>
                        <p className="text-[11px] text-[#6E6E73]">{sub.serviceCategory}</p>
                      </td>
                      <td className="py-3.5 px-4 font-mono-num whitespace-nowrap tabular-nums">
                        <p className="font-bold text-[#1D1D1F]">
                          {fmtMoney(totalWithTax, sub.currency)}/mo
                        </p>
                        <p className="text-[11px] text-[#6E6E73]">
                          Base {fmtMoney(sub.monthlyAmount, sub.currency)}{' '}
                          {sub.gstEnabled ? `+ ${sub.gstRate}% GST` : '(No GST)'}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 font-mono-num whitespace-nowrap tabular-nums">
                        <p className="font-semibold text-[#1D1D1F]">Next: {sub.nextBillingDate}</p>
                        <p className="text-[11px] text-[#6E6E73]">
                          {sub.lastInvoiceNumber
                            ? `Last: ${sub.lastInvoiceNumber} (${sub.renewalCount}x)`
                            : 'No renewal triggered yet'}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-bold ${
                            sub.status === 'ACTIVE'
                              ? 'text-[#067647]'
                              : sub.status === 'PAUSED'
                                ? 'text-[#B45309]'
                                : 'text-[#B42318]'
                          }`}
                        >
                          {sub.status === 'ACTIVE' ? (
                            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                          ) : sub.status === 'PAUSED' ? (
                            <PauseCircle className="w-3.5 h-3.5" aria-hidden="true" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                          )}
                          <span>{sub.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {sub.status === 'ACTIVE' && (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => void handleTriggerRenewal(sub)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0071E3] hover:bg-[#0062C4] text-white text-[11px] font-semibold cursor-pointer disabled:opacity-50 whitespace-nowrap"
                            >
                              <Receipt className="w-3 h-3" aria-hidden="true" />
                              <span>Trigger Renewal Invoice</span>
                            </button>
                          )}

                          {sub.status === 'ACTIVE' ? (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => void handleToggleStatus(sub, 'PAUSED')}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E8E8ED] bg-white hover:border-[#B45309] text-[#B45309] text-[11px] font-semibold cursor-pointer disabled:opacity-50 whitespace-nowrap"
                            >
                              <PauseCircle className="w-3 h-3" aria-hidden="true" />
                              <span>Pause Billing</span>
                            </button>
                          ) : sub.status === 'PAUSED' ? (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => void handleToggleStatus(sub, 'ACTIVE')}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#ABEFC6] bg-[#ECFDF3] hover:bg-[#D1FADF] text-[#067647] text-[11px] font-semibold cursor-pointer disabled:opacity-50 whitespace-nowrap"
                            >
                              <PlayCircle className="w-3 h-3" aria-hidden="true" />
                              <span>Resume Billing</span>
                            </button>
                          ) : null}

                          {sub.status !== 'CANCELLED' && (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Cancel recurring billing for ${sub.companyName || sub.customerName} (${sub.serviceName})?`
                                  )
                                ) {
                                  void handleToggleStatus(sub, 'CANCELLED');
                                }
                              }}
                              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-[#E8E8ED] bg-white hover:border-[#D92D20] text-[#B42318] text-[11px] font-semibold cursor-pointer disabled:opacity-50 whitespace-nowrap"
                            >
                              <XCircle className="w-3 h-3" aria-hidden="true" />
                              <span>Cancel</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Generated Renewal Invoices Ledger */}
      <div className="liquid-glass-card rounded-3xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8E8ED]">
          <h3 className="font-display text-base font-bold text-[#1D1D1F]">
            Generated Monthly Renewal Invoices ({renewalInvoices.length})
          </h3>
        </div>
        {renewalInvoices.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#6E6E73]">
            No renewal invoices generated yet. Use &ldquo;Trigger Renewal Invoice&rdquo; on an active subscription above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5F5F7]/85 border-b border-[#E8E8ED] text-[#6E6E73] font-semibold">
                  <th className="py-3 px-4">Invoice</th>
                  <th className="py-3 px-4">Subscription Ref</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Service Category</th>
                  <th className="py-3 px-4 text-right">Total Due</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8ED]">
                {renewalInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/75">
                    <td className="py-3 px-4 font-mono-num font-bold text-[#1D1D1F]">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3 px-4 font-mono-num text-[#6E6E73]">
                      {inv.quotationNumber || 'Direct Recurring'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#1D1D1F]">
                        {inv.companyName || inv.customerName}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#6E6E73]">{inv.serviceCategory}</td>
                    <td className="py-3 px-4 text-right font-mono-num font-bold text-[#1D1D1F] tabular-nums">
                      {fmtMoney(inv.totalAmount, inv.currency)}
                    </td>
                    <td className="py-3 px-4 font-mono-num text-[#6E6E73]">{inv.dueDate}</td>
                    <td className="py-3 px-4 font-semibold text-[#1D1D1F]">{inv.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Subscription Modal */}
      <GlassModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        subtitle="MONTHLY CREATIVE & RETAINER BILLING"
        title="Enroll Customer in Recurring Billing"
      >
        <form onSubmit={handleCreateSubscription} className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#1D1D1F] mb-1">
                Prefill from Client Portfolio (Optional)
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => handlePrefillClient(e.target.value)}
                className={inputCls}
              >
                <option value="">-- Enter client details manually --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Customer Name *</label>
              <input
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Contact person name"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Company Name</label>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Business / brand name"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Customer Email *</label>
              <input
                required
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="billing@company.com"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Phone (Optional)</label>
              <input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className={`${inputCls} font-mono-num`}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#1D1D1F] mb-1">
                Monthly Service Plan *
              </label>
              <select
                required
                value={selectedServiceId}
                onChange={(e) => {
                  setSelectedServiceId(e.target.value);
                  applyServiceDefaults(e.target.value, currency);
                }}
                className={inputCls}
              >
                <option value="">-- Select Monthly Service --</option>
                {prioritizedServices.creative.length > 0 && (
                  <optgroup label="Business Creative & Documentation Services (Monthly)">
                    {prioritizedServices.creative.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (₹{(s.monthlyPrice ?? s.recurringFee ?? 0).toLocaleString('en-IN')}/mo)
                      </option>
                    ))}
                  </optgroup>
                )}
                {prioritizedServices.others.length > 0 && (
                  <optgroup label="Monthly Retainers & Agency Subscriptions">
                    {prioritizedServices.others.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (₹{(s.monthlyPrice ?? s.recurringFee ?? s.packagePrice ?? 0).toLocaleString('en-IN')}/mo)
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => {
                  const nextCur = e.target.value as 'INR' | 'AED' | 'USD';
                  setCurrency(nextCur);
                  if (selectedServiceId) applyServiceDefaults(selectedServiceId, nextCur);
                }}
                className={inputCls}
              >
                <option value="INR">INR (₹)</option>
                <option value="AED">AED</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">
                Monthly Base Rate ({currency}) *
              </label>
              <input
                required
                type="number"
                min={1}
                step="0.01"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(e.target.value)}
                className={`${inputCls} font-mono-num`}
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">
                First / Next Billing Date *
              </label>
              <input
                required
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`${inputCls} font-mono-num`}
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">
                Monthly Cycle Day (1–28)
              </label>
              <input
                required
                type="number"
                min={1}
                max={28}
                value={billingCycleDay}
                onChange={(e) => setBillingCycleDay(e.target.value)}
                className={`${inputCls} font-mono-num`}
              />
            </div>

            <div className="flex items-center gap-4 pt-1">
              <label className="inline-flex items-center gap-2 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={gstEnabled}
                  onChange={(e) => setGstEnabled(e.target.checked)}
                  className="accent-[#0071E3]"
                />
                <span>Apply GST</span>
              </label>
              {gstEnabled && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[#6E6E73]">Rate %:</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={gstRate}
                    onChange={(e) => setGstRate(e.target.value)}
                    className="w-16 rounded-lg border border-[#E8E8ED] bg-white px-2 py-1 font-mono-num"
                  />
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#1D1D1F] mb-1">Notes</label>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Deliverable cadence, monthly quota, or PO reference..."
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E8ED]">
            <GlassButton variant="subtle" size="sm" onClick={() => setCreateOpen(false)}>
              Cancel
            </GlassButton>
            <GlassButton type="submit" disabled={creating} variant="primary" size="sm">
              {creating ? 'Creating...' : 'Start Active Subscription'}
            </GlassButton>
          </div>
        </form>
      </GlassModal>
    </div>
  );
}
