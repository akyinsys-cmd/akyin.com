import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  CheckCircle2,
  Columns2,
  Layers,
  Minus,
  Plus,
  Send,
  Trash2,
} from 'lucide-react';
import { SuiteServiceItem, suiteApi } from '../services/suiteApi';
import { GlassButton, GlassPanel } from './liquid-glass';
import { ServiceBillingDisclaimer } from './ServiceBillingDisclaimer';

type PlanViewMode = 'one-time' | 'monthly';
type CurrencyCode = 'INR' | 'AED' | 'USD';

interface SelectedQuoteItem {
  service: SuiteServiceItem;
  mode: 'one-time' | 'monthly' | 'usage';
  qty: number;
  whatsappMsgQty?: number;
  extraSmsQty?: number;
}

function fmtCurrency(amount: number, currency: CurrencyCode): string {
  return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'INR' ? 0 : 2,
  }).format(amount || 0);
}

function fmtExact(amount: number, currency: CurrencyCode): string {
  return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: amount % 1 !== 0 ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

function resolveTierPrice(
  srv: SuiteServiceItem,
  currency: CurrencyCode,
  field: 'setupFee' | 'packagePrice' | 'unitRate' | 'additionalUnitRate'
): number {
  const tierKey = currency === 'AED' ? 'aed' : currency === 'USD' ? 'usd' : null;
  if (tierKey && srv.internationalPricing?.[tierKey]?.[field] !== undefined) {
    return Number(srv.internationalPricing[tierKey]![field]) || 0;
  }
  if (field === 'setupFee') return Number(srv.oneTimePrice ?? srv.setupFee ?? 0) || 0;
  if (field === 'packagePrice')
    return Number(srv.monthlyPrice ?? srv.packagePrice ?? srv.recurringFee ?? 0) || 0;
  if (field === 'unitRate') return Number(srv.unitRate ?? 0) || 0;
  return Number(srv.additionalUnitRate ?? srv.unitRate ?? 0) || 0;
}

function getOneTimePrice(srv: SuiteServiceItem, currency: CurrencyCode): number {
  if (srv.id === 'srv-bulk-sms') {
    return resolveTierPrice(srv, currency, 'packagePrice');
  }
  return resolveTierPrice(srv, currency, 'setupFee');
}

function getMonthlyPrice(srv: SuiteServiceItem, currency: CurrencyCode): number {
  if (srv.id === 'srv-bulk-sms' || srv.id === 'srv-whatsapp-messaging') {
    return 0;
  }
  return resolveTierPrice(srv, currency, 'packagePrice');
}

function supportsBothPlans(srv: SuiteServiceItem, currency: CurrencyCode): boolean {
  if (srv.pricingModel === 'custom') return false;
  if (srv.id === 'srv-bulk-sms' || srv.id === 'srv-whatsapp-messaging') return false;
  return getOneTimePrice(srv, currency) > 0 && getMonthlyPrice(srv, currency) > 0;
}

interface InteractiveQuotationBuilderProps {
  onSuccessLeadId?: (leadId: string) => void;
}

export function InteractiveQuotationBuilder({
  onSuccessLeadId,
}: InteractiveQuotationBuilderProps) {
  const [services, setServices] = useState<SuiteServiceItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Filters & toggles
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [planView, setPlanView] = useState<PlanViewMode>('one-time');
  const [comparePlans, setComparePlans] = useState<boolean>(false);
  const [includeGst, setIncludeGst] = useState<boolean>(true);

  // Selected standalone line items keyed by service id
  const [selections, setSelections] = useState<Record<string, SelectedQuoteItem>>({});

  // Request formal quote submission state
  const [requestOpen, setRequestOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submittedLeadId, setSubmittedLeadId] = useState('');

  const loadCatalogue = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const res = await suiteApi.fetchPublicServices();
      setServices(res.services || []);
      setCategories(res.categories || []);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Unable to load service pricing.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCatalogue();
  }, [loadCatalogue]);

  // Dynamically recalibrate all applicable selected services when switching global plan view
  const handleGlobalPlanSwitch = (nextPlan: PlanViewMode) => {
    setPlanView(nextPlan);
    setSelections((prev) => {
      const next: Record<string, SelectedQuoteItem> = {};
      for (const [id, entry] of Object.entries(prev)) {
        const srv = entry.service;
        if (supportsBothPlans(srv, currency)) {
          next[id] = { ...entry, mode: nextPlan };
        } else {
          next[id] = entry;
        }
      }
      return next;
    });
  };

  const toggleServiceSelection = (srv: SuiteServiceItem, preferredMode?: 'one-time' | 'monthly') => {
    setSelections((prev) => {
      const existing = prev[srv.id];
      if (existing && (!preferredMode || existing.mode === preferredMode)) {
        const copy = { ...prev };
        delete copy[srv.id];
        return copy;
      }
      const oneTime = getOneTimePrice(srv, currency);
      const monthly = getMonthlyPrice(srv, currency);
      let resolvedMode: 'one-time' | 'monthly' = preferredMode || planView;
      if (resolvedMode === 'monthly' && monthly <= 0 && oneTime > 0) resolvedMode = 'one-time';
      if (resolvedMode === 'one-time' && oneTime <= 0 && monthly > 0) resolvedMode = 'monthly';

      return {
        ...prev,
        [srv.id]: {
          service: srv,
          mode: resolvedMode,
          qty: existing?.qty || 1,
          whatsappMsgQty: existing?.whatsappMsgQty ?? (srv.id === 'srv-whatsapp-messaging' ? 1000 : 0),
          extraSmsQty: existing?.extraSmsQty ?? 0,
        },
      };
    });
  };

  const updateSelectionMode = (serviceId: string, mode: 'one-time' | 'monthly') => {
    setSelections((prev) => {
      const cur = prev[serviceId];
      if (!cur) return prev;
      return { ...prev, [serviceId]: { ...cur, mode } };
    });
  };

  const updateSelectionQty = (serviceId: string, delta: number) => {
    setSelections((prev) => {
      const cur = prev[serviceId];
      if (!cur) return prev;
      return { ...prev, [serviceId]: { ...cur, qty: Math.max(1, cur.qty + delta) } };
    });
  };

  const updateUsageUnits = (
    serviceId: string,
    field: 'whatsappMsgQty' | 'extraSmsQty',
    val: number
  ) => {
    setSelections((prev) => {
      const cur = prev[serviceId];
      if (!cur) return prev;
      return { ...prev, [serviceId]: { ...cur, [field]: Math.max(0, Math.floor(val || 0)) } };
    });
  };

  const filteredServices = useMemo(() => {
    const q = search.trim().toLowerCase();
    return services.filter((srv) => {
      if (srv.pricingModel === 'custom') return false;
      if (selectedCategory !== 'ALL' && srv.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        srv.name.toLowerCase().includes(q) ||
        srv.category.toLowerCase().includes(q) ||
        srv.description.toLowerCase().includes(q)
      );
    });
  }, [services, selectedCategory, search]);

  const computeTotals = useCallback(
    (forcedPlan?: 'one-time' | 'monthly') => {
      let oneTimeSubtotal = 0;
      let monthlySubtotal = 0;
      let usageSubtotal = 0;

      for (const entry of Object.values(selections)) {
        const srv = entry.service;
        const oneTimePrice = getOneTimePrice(srv, currency);
        const monthlyPrice = getMonthlyPrice(srv, currency);
        const unitRate = resolveTierPrice(srv, currency, 'unitRate');
        const additionalRate = resolveTierPrice(srv, currency, 'additionalUnitRate');

        if (srv.id === 'srv-whatsapp-messaging') {
          oneTimeSubtotal += oneTimePrice * entry.qty;
          usageSubtotal += (entry.whatsappMsgQty || 0) * unitRate;
        } else if (srv.id === 'srv-bulk-sms') {
          oneTimeSubtotal += oneTimePrice * entry.qty;
          usageSubtotal += (entry.extraSmsQty || 0) * additionalRate;
        } else {
          let activeMode = entry.mode;
          if (forcedPlan && supportsBothPlans(srv, currency)) {
            activeMode = forcedPlan;
          }
          if (activeMode === 'monthly' && monthlyPrice > 0) {
            monthlySubtotal += monthlyPrice * entry.qty;
          } else if (oneTimePrice > 0) {
            oneTimeSubtotal += oneTimePrice * entry.qty;
          } else if (monthlyPrice > 0) {
            monthlySubtotal += monthlyPrice * entry.qty;
          }
        }
      }

      const subtotal = oneTimeSubtotal + monthlySubtotal + usageSubtotal;
      const gstAmount = includeGst ? Math.round(subtotal * 0.18 * 100) / 100 : 0;
      const payableNow = Math.round((subtotal + gstAmount) * 100) / 100;
      const futureRecurringAmount = includeGst
        ? Math.round(monthlySubtotal * 1.18 * 100) / 100
        : monthlySubtotal;

      return {
        oneTimeSubtotal,
        monthlySubtotal,
        usageSubtotal,
        subtotal,
        gstAmount,
        payableNow,
        futureRecurringAmount,
      };
    },
    [selections, currency, includeGst]
  );

  const activeTotals = useMemo(() => computeTotals(), [computeTotals]);
  const allOneTimeComparison = useMemo(() => computeTotals('one-time'), [computeTotals]);
  const allMonthlyComparison = useMemo(() => computeTotals('monthly'), [computeTotals]);

  const selectedEntries = useMemo(() => Object.values(selections), [selections]);
  const hasDualPlanSelection = useMemo(
    () => selectedEntries.some((e) => supportsBothPlans(e.service, currency)),
    [selectedEntries, currency]
  );

  const handleSubmitQuoteRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEntries.length === 0) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const summaryLines = selectedEntries.map((entry) => {
        const srv = entry.service;
        const oneTime = getOneTimePrice(srv, currency);
        const monthly = getMonthlyPrice(srv, currency);
        if (srv.id === 'srv-whatsapp-messaging') {
          const unitRate = resolveTierPrice(srv, currency, 'unitRate');
          return `- ${srv.name}: ${fmtExact(oneTime, currency)} Setup x ${entry.qty} + ${(entry.whatsappMsgQty || 0).toLocaleString('en-IN')} WhatsApp msgs @ ${fmtExact(unitRate, currency)}/msg`;
        }
        if (srv.id === 'srv-bulk-sms') {
          const extraRate = resolveTierPrice(srv, currency, 'additionalUnitRate');
          return `- ${srv.name}: ${fmtExact(oneTime, currency)} Package x ${entry.qty}${entry.extraSmsQty ? ` + ${entry.extraSmsQty.toLocaleString('en-IN')} extra SMS @ ${fmtExact(extraRate, currency)}/SMS` : ''}`;
        }
        const price = entry.mode === 'monthly' && monthly > 0 ? monthly : oneTime || monthly;
        const label = entry.mode === 'monthly' && monthly > 0 ? 'Monthly Subscription' : 'One-Time Project';
        return `- ${srv.name} (${label}) x ${entry.qty}: ${fmtExact(price * entry.qty, currency)}`;
      });

      const res = await fetch('/api/public/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          businessName,
          email,
          mobileNumber,
          city,
          country,
          businessCategory: selectedEntries[0]?.service.category || 'Marketing Services',
          requiredService:
            selectedEntries.length === 1
              ? selectedEntries[0].service.name
              : `Custom Quote (${selectedEntries.length} Standalone Services)`,
          monthlyMarketingBudget: fmtExact(activeTotals.payableNow, currency),
          preferredContactMethod: 'Email & WhatsApp',
          message: [
            `Interactive Quotation Builder Request (${currency}) — View Mode: ${planView === 'monthly' ? 'Monthly Subscription' : 'One-Time Project'}`,
            ...summaryLines,
            `One-Time Subtotal: ${fmtExact(activeTotals.oneTimeSubtotal, currency)}`,
            `Monthly Recurring Subtotal: ${fmtExact(activeTotals.monthlySubtotal, currency)}/mo`,
            `Usage Metered Charges: ${fmtExact(activeTotals.usageSubtotal, currency)}`,
            `Total Payable Now (${includeGst ? 'incl. 18% GST' : 'excl. GST'}): ${fmtExact(activeTotals.payableNow, currency)}`,
            notes ? `Client Notes: ${notes}` : '',
          ]
            .filter(Boolean)
            .join('\n'),
          consentAccepted: true,
          source: 'Interactive Quotation Builder (/quote)',
          campaignSource: 'Website',
          honeypot: '',
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        leadId?: string;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Unable to submit quotation request.');
      }
      setSubmittedLeadId(data.leadId || 'CONFIRMED');
      setRequestOpen(false);
      onSuccessLeadId?.(data.leadId || '');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Unable to submit quotation request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="quotation-builder" className="space-y-8">
      {/* Header + Compare Plans Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
            Standalone Service Estimator · Dynamic Recalibration
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
            Interactive Quotation Builder.
          </h2>
          <p className="text-sm text-[#6E6E73] leading-relaxed">
            Every AKYIN service is standalone—no forced bundles. Toggle between viewing applicable services as a One-Time Project or a Monthly Subscription, or turn on Compare Plans to inspect both side-by-side.
          </p>
        </div>

        {/* Compare Plans & Global Billing Switch */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            aria-pressed={comparePlans}
            onClick={() => setComparePlans((prev) => !prev)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              comparePlans
                ? 'bg-[#0071E3] text-white border-[#0071E3] shadow-sm'
                : 'bg-white text-[#1D1D1F] border-[#E8E8ED] hover:border-[#1D1D1F]'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Compare Plans: {comparePlans ? 'ON' : 'OFF'}</span>
          </button>

          <div
            role="group"
            aria-label="Select service billing view"
            className="inline-flex items-center p-1 rounded-xl bg-[#E8E8ED]/70 border border-[#E8E8ED]"
          >
            <button
              type="button"
              aria-pressed={planView === 'one-time'}
              onClick={() => handleGlobalPlanSwitch('one-time')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                planView === 'one-time'
                  ? 'bg-white text-[#1D1D1F] shadow-sm'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              One-Time Project
            </button>
            <button
              type="button"
              aria-pressed={planView === 'monthly'}
              onClick={() => handleGlobalPlanSwitch('monthly')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                planView === 'monthly'
                  ? 'bg-white text-[#1D1D1F] shadow-sm'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              Monthly Subscription
            </button>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="rounded-2xl border border-[#E8E8ED] bg-white p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-1 flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter services (e.g. Logo, Reels, Bulk SMS, WhatsApp, SEO)..."
            className="flex-1 rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] px-3.5 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:bg-white focus:border-[#0071E3]"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] px-3 py-2 text-xs font-semibold text-[#1D1D1F]"
          >
            <option value="ALL">All Categories ({services.filter((s) => s.pricingModel !== 'custom').length})</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <select
            aria-label="Quotation currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] px-3 py-2 text-xs font-mono-num font-semibold text-[#1D1D1F]"
          >
            <option value="INR">INR (₹)</option>
            <option value="AED">AED</option>
            <option value="USD">USD ($)</option>
          </select>

          <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#1D1D1F] cursor-pointer whitespace-nowrap">
            <input
              type="checkbox"
              checked={includeGst}
              onChange={(e) => setIncludeGst(e.target.checked)}
              className="accent-[#0071E3]"
            />
            <span>Include 18% GST</span>
          </label>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Service Selection & Compare Plans Matrix */}
        <div className="lg:col-span-7 space-y-4">
          {loading ? (
            <div className="rounded-2xl border border-[#E8E8ED] bg-white p-10 text-center text-xs text-[#6E6E73]">
              Loading live service catalogue...
            </div>
          ) : loadError ? (
            <div className="rounded-2xl border border-[#FECDCA] bg-[#FEF3F2] p-6 text-center space-y-3">
              <p className="text-xs font-semibold text-[#B42318]">{loadError}</p>
              <GlassButton variant="subtle" size="sm" onClick={() => void loadCatalogue()}>
                Retry
              </GlassButton>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="rounded-2xl border border-[#E8E8ED] bg-white p-10 text-center text-xs text-[#6E6E73]">
              No matching fixed-price services found for the selected filter.
            </div>
          ) : comparePlans ? (
            /* SIDE-BY-SIDE COMPARE PLANS VIEW */
            <div className="space-y-3">
              {filteredServices.map((srv) => {
                const oneTime = getOneTimePrice(srv, currency);
                const monthly = getMonthlyPrice(srv, currency);
                const unitRate = resolveTierPrice(srv, currency, 'unitRate');
                const both = supportsBothPlans(srv, currency);
                const selected = selections[srv.id];

                return (
                  <article
                    key={srv.id}
                    className={`rounded-2xl border bg-white p-5 space-y-4 transition-colors ${
                      selected ? 'border-[#0071E3]' : 'border-[#E8E8ED]'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-[11px] text-[#6E6E73]">{srv.category}</p>
                        <h3 className="font-display text-base font-bold text-[#1D1D1F]">{srv.name}</h3>
                      </div>
                      {selected && (
                        <button
                          type="button"
                          onClick={() => toggleServiceSelection(srv)}
                          className="text-[11px] font-semibold text-[#B42318] hover:underline cursor-pointer"
                        >
                          Remove from Quote
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-[#6E6E73] leading-relaxed">{srv.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {/* One-Time Project Column */}
                      <div
                        className={`rounded-xl border p-3.5 flex flex-col justify-between space-y-3 ${
                          selected?.mode === 'one-time'
                            ? 'border-[#0071E3] bg-[#0071E3]/[0.03]'
                            : 'border-[#E8E8ED] bg-[#F5F5F7]/60'
                        }`}
                      >
                        <div className="space-y-1">
                          <p className="text-[11px] font-semibold text-[#6E6E73]">
                            {srv.id === 'srv-whatsapp-messaging'
                              ? 'One-Time Setup + Usage'
                              : srv.id === 'srv-bulk-sms'
                                ? 'Starter Credit Package'
                                : 'One-Time Project'}
                          </p>
                          <p className="font-mono-num text-lg font-bold text-[#1D1D1F]">
                            {oneTime > 0 ? fmtExact(oneTime, currency) : 'Monthly Only'}
                          </p>
                          {srv.id === 'srv-whatsapp-messaging' && unitRate > 0 && (
                            <p className="text-[11px] font-mono-num text-[#6E6E73]">
                              + {fmtExact(unitRate, currency)}/{srv.unitLabel || 'msg'} separate
                            </p>
                          )}
                          {srv.id === 'srv-bulk-sms' && srv.includedUnits && (
                            <p className="text-[11px] font-mono-num text-[#6E6E73]">
                              Includes {srv.includedUnits.toLocaleString('en-IN')} SMS
                            </p>
                          )}
                          <p className="text-[11px] text-[#6E6E73]">
                            Turnaround: {srv.deliveryPeriod || 'Standard'}
                            {srv.revisionLimit ? ` · ${srv.revisionLimit}` : ''}
                          </p>
                        </div>

                        {oneTime > 0 && (
                          <button
                            type="button"
                            onClick={() => toggleServiceSelection(srv, 'one-time')}
                            className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                              selected?.mode === 'one-time'
                                ? 'bg-[#0071E3] text-white'
                                : 'bg-white border border-[#E8E8ED] text-[#1D1D1F] hover:border-[#1D1D1F]'
                            }`}
                          >
                            {selected?.mode === 'one-time' ? 'Selected (One-Time)' : 'Choose One-Time'}
                          </button>
                        )}
                      </div>

                      {/* Monthly Subscription Column */}
                      <div
                        className={`rounded-xl border p-3.5 flex flex-col justify-between space-y-3 ${
                          selected?.mode === 'monthly'
                            ? 'border-[#0071E3] bg-[#0071E3]/[0.03]'
                            : 'border-[#E8E8ED] bg-[#F5F5F7]/60'
                        }`}
                      >
                        <div className="space-y-1">
                          <p className="text-[11px] font-semibold text-[#6E6E73]">Monthly Subscription</p>
                          <p className="font-mono-num text-lg font-bold text-[#1D1D1F]">
                            {monthly > 0 ? `${fmtExact(monthly, currency)}/mo` : 'One-Time Only'}
                          </p>
                          {monthly > 0 && (
                            <p className="text-[11px] text-[#6E6E73]">
                              {srv.subscriptionDuration || 'Monthly retainer'}
                              {srv.cancellationPolicy ? ` · ${srv.cancellationPolicy}` : ''}
                            </p>
                          )}
                          {both && (
                            <p className="text-[11px] font-mono-num text-[#0071E3]">
                              {monthly > oneTime
                                ? `+${fmtExact(monthly - oneTime, currency)} vs single project for ongoing deliverables`
                                : `${fmtExact(oneTime - monthly, currency)} lower monthly commitment`}
                            </p>
                          )}
                        </div>

                        {monthly > 0 && (
                          <button
                            type="button"
                            onClick={() => toggleServiceSelection(srv, 'monthly')}
                            className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                              selected?.mode === 'monthly'
                                ? 'bg-[#0071E3] text-white'
                                : 'bg-white border border-[#E8E8ED] text-[#1D1D1F] hover:border-[#1D1D1F]'
                            }`}
                          >
                            {selected?.mode === 'monthly' ? 'Selected (Monthly)' : 'Choose Monthly'}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            /* STANDARD DYNAMIC PLAN VIEW (SWITCHED BY ONE-TIME VS MONTHLY TOGGLE) */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredServices.map((srv) => {
                const oneTime = getOneTimePrice(srv, currency);
                const monthly = getMonthlyPrice(srv, currency);
                const unitRate = resolveTierPrice(srv, currency, 'unitRate');
                const both = supportsBothPlans(srv, currency);
                const selected = selections[srv.id];

                // Active displayed price recalibrates based on planView (or selection override)
                const activeMode = selected?.mode || (planView === 'monthly' && monthly > 0 ? 'monthly' : oneTime > 0 ? 'one-time' : 'monthly');
                const displayedPrice = activeMode === 'monthly' && monthly > 0 ? monthly : oneTime || monthly;

                return (
                  <article
                    key={srv.id}
                    className={`rounded-2xl border bg-white p-5 flex flex-col justify-between space-y-4 transition-colors ${
                      selected ? 'border-[#0071E3]' : 'border-[#E8E8ED]'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 text-[11px] text-[#6E6E73]">
                        <span className="truncate">{srv.category}</span>
                        {both && (
                          <span className="font-mono-num text-[#0071E3] shrink-0">
                            Dual Plan
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-base font-bold text-[#1D1D1F] leading-snug">
                        {srv.name}
                      </h3>
                      <p className="text-xs text-[#6E6E73] line-clamp-2 leading-relaxed">
                        {srv.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-[#E8E8ED]">
                      <div className="flex items-baseline justify-between gap-2">
                        <div>
                          <p className="font-mono-num text-lg font-bold text-[#1D1D1F]">
                            {fmtExact(displayedPrice, currency)}
                            {activeMode === 'monthly' && monthly > 0 ? (
                              <span className="text-xs font-normal text-[#6E6E73]">/mo</span>
                            ) : null}
                          </p>
                          <p className="text-[11px] text-[#6E6E73]">
                            {srv.id === 'srv-whatsapp-messaging'
                              ? `One-time setup + ${fmtExact(unitRate, currency)}/msg`
                              : srv.id === 'srv-bulk-sms'
                                ? `${(srv.includedUnits || 10000).toLocaleString('en-IN')} SMS credits included`
                                : activeMode === 'monthly' && monthly > 0
                                  ? `Monthly subscription${oneTime > 0 ? ` · One-time: ${fmtExact(oneTime, currency)}` : ''}`
                                  : `One-time project${monthly > 0 ? ` · Monthly: ${fmtExact(monthly, currency)}/mo` : ''}`}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleServiceSelection(srv)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            selected
                              ? 'bg-[#0071E3] text-white'
                              : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#1D1D1F] hover:text-white'
                          }`}
                        >
                          {selected ? 'Selected' : '+ Add Service'}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Dynamic Quotation Summary & Plan Comparison Totals */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <GlassPanel className="p-6 bg-white space-y-5">
            <div className="flex items-center justify-between gap-2 border-b border-[#E8E8ED] pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0071E3]" aria-hidden="true" />
                <h3 className="font-display text-lg font-bold text-[#1D1D1F]">
                  Your Quotation Estimate
                </h3>
              </div>
              <span className="font-mono-num text-xs font-semibold text-[#6E6E73]">
                {selectedEntries.length} selected
              </span>
            </div>

            {selectedEntries.length === 0 ? (
              <div className="py-8 text-center space-y-2 text-xs text-[#6E6E73]">
                <p>Select any standalone service on the left to build a live quotation.</p>
                <p>Use the Compare Plans toggle above to inspect One-Time Project vs. Monthly Subscription pricing.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {selectedEntries.map((entry) => {
                  const srv = entry.service;
                  const oneTime = getOneTimePrice(srv, currency);
                  const monthly = getMonthlyPrice(srv, currency);
                  const unitRate = resolveTierPrice(srv, currency, 'unitRate');
                  const extraSmsRate = resolveTierPrice(srv, currency, 'additionalUnitRate');
                  const both = supportsBothPlans(srv, currency);
                  const rowPrice =
                    entry.mode === 'monthly' && monthly > 0 ? monthly : oneTime || monthly;

                  return (
                    <div
                      key={srv.id}
                      className="rounded-xl border border-[#E8E8ED] bg-[#F5F5F7]/70 p-3 space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-[#1D1D1F] truncate">{srv.name}</p>
                          <p className="font-mono-num text-[11px] text-[#6E6E73]">
                            {fmtExact(rowPrice * entry.qty, currency)}
                            {entry.mode === 'monthly' && monthly > 0 ? '/mo' : ''}
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${srv.name}`}
                          onClick={() => toggleServiceSelection(srv)}
                          className="text-[#B42318] p-1 hover:bg-white rounded-lg cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        {both ? (
                          <button
                            type="button"
                            onClick={() =>
                              updateSelectionMode(
                                srv.id,
                                entry.mode === 'monthly' ? 'one-time' : 'monthly'
                              )
                            }
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#E8E8ED] hover:border-[#0071E3] text-[11px] font-semibold text-[#0071E3] cursor-pointer whitespace-nowrap"
                          >
                            <ArrowLeftRight className="w-3 h-3" aria-hidden="true" />
                            <span>
                              {entry.mode === 'monthly' ? 'Monthly Plan' : 'One-Time Project'}
                            </span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#6E6E73]">
                            {srv.id === 'srv-whatsapp-messaging'
                              ? 'Setup + Metered Usage'
                              : entry.mode === 'monthly'
                                ? 'Monthly Subscription'
                                : 'One-Time Standalone'}
                          </span>
                        )}

                        <div className="inline-flex items-center gap-1.5 bg-white border border-[#E8E8ED] rounded-lg px-1.5 py-0.5">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => updateSelectionQty(srv.id, -1)}
                            className="p-1 text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono-num text-[11px] font-semibold px-1">
                            {entry.qty}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateSelectionQty(srv.id, 1)}
                            className="p-1 text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {srv.id === 'srv-whatsapp-messaging' && (
                        <div className="pt-2 border-t border-[#E8E8ED] flex items-center justify-between gap-2 text-[11px]">
                          <label className="text-[#6E6E73]">
                            Est. Messages ({fmtExact(unitRate, currency)}/msg):
                          </label>
                          <input
                            type="number"
                            min={0}
                            step={100}
                            value={entry.whatsappMsgQty || 0}
                            onChange={(e) =>
                              updateUsageUnits(srv.id, 'whatsappMsgQty', Number(e.target.value))
                            }
                            className="w-24 rounded-lg border border-[#E8E8ED] bg-white px-2 py-1 font-mono-num text-right"
                          />
                        </div>
                      )}

                      {srv.id === 'srv-bulk-sms' && (
                        <div className="pt-2 border-t border-[#E8E8ED] flex items-center justify-between gap-2 text-[11px]">
                          <label className="text-[#6E6E73]">
                            Extra SMS ({fmtExact(extraSmsRate, currency)}/SMS):
                          </label>
                          <input
                            type="number"
                            min={0}
                            step={500}
                            value={entry.extraSmsQty || 0}
                            onChange={(e) =>
                              updateUsageUnits(srv.id, 'extraSmsQty', Number(e.target.value))
                            }
                            className="w-24 rounded-lg border border-[#E8E8ED] bg-white px-2 py-1 font-mono-num text-right"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Side-by-Side Total Recalibration when Compare Plans is ON & dual-plan services exist */}
            {comparePlans && selectedEntries.length > 0 && hasDualPlanSelection && (
              <div className="rounded-xl border border-[#0071E3]/25 bg-[#0071E3]/[0.04] p-3.5 space-y-2 text-xs">
                <p className="font-semibold text-[#1D1D1F]">
                  Plan Comparison Summary ({includeGst ? 'Incl. 18% GST' : 'Excl. GST'})
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleGlobalPlanSwitch('one-time')}
                    className={`rounded-lg border p-2.5 text-left transition-colors cursor-pointer ${
                      planView === 'one-time'
                        ? 'border-[#0071E3] bg-white'
                        : 'border-[#E8E8ED] bg-white/70 hover:bg-white'
                    }`}
                  >
                    <span className="text-[10px] font-semibold text-[#6E6E73] block">
                      As One-Time Projects
                    </span>
                    <span className="font-mono-num font-bold text-sm text-[#1D1D1F]">
                      {fmtCurrency(allOneTimeComparison.payableNow, currency)}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGlobalPlanSwitch('monthly')}
                    className={`rounded-lg border p-2.5 text-left transition-colors cursor-pointer ${
                      planView === 'monthly'
                        ? 'border-[#0071E3] bg-white'
                        : 'border-[#E8E8ED] bg-white/70 hover:bg-white'
                    }`}
                  >
                    <span className="text-[10px] font-semibold text-[#6E6E73] block">
                      As Monthly Retainers
                    </span>
                    <span className="font-mono-num font-bold text-sm text-[#0071E3]">
                      {fmtCurrency(allMonthlyComparison.payableNow, currency)}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Financial Subtotals */}
            <div className="rounded-xl bg-[#F5F5F7] p-4 space-y-2 text-xs font-mono-num">
              <div className="flex justify-between">
                <span className="text-[#6E6E73]">One-Time Subtotal</span>
                <span>{fmtExact(activeTotals.oneTimeSubtotal, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E6E73]">Monthly Recurring Subtotal</span>
                <span>{fmtExact(activeTotals.monthlySubtotal, currency)}</span>
              </div>
              {activeTotals.usageSubtotal > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#6E6E73]">Usage-Based Metering</span>
                  <span>{fmtExact(activeTotals.usageSubtotal, currency)}</span>
                </div>
              )}
              {includeGst && (
                <div className="flex justify-between">
                  <span className="text-[#6E6E73]">GST (18%)</span>
                  <span>{fmtExact(activeTotals.gstAmount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-[#1D1D1F] pt-2 border-t border-[#E8E8ED]">
                <span>Payable Upfront Now</span>
                <span className="text-[#0071E3]">{fmtExact(activeTotals.payableNow, currency)}</span>
              </div>
              {activeTotals.futureRecurringAmount > 0 && (
                <div className="flex justify-between text-[11px] font-sans font-semibold text-[#0071E3] pt-1 border-t border-[#E8E8ED]">
                  <span>Future Monthly Commitment:</span>
                  <span className="font-mono-num">
                    {fmtExact(activeTotals.futureRecurringAmount, currency)}/mo
                  </span>
                </div>
              )}
            </div>

            <ServiceBillingDisclaimer variant="compact" />

            {submittedLeadId ? (
              <div className="rounded-xl border border-[#ABEFC6] bg-[#ECFDF3] p-4 space-y-1 text-xs">
                <div className="flex items-center gap-2 font-bold text-[#067647]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Quotation Request Logged ({submittedLeadId})</span>
                </div>
                <p className="text-[#067647]">
                  Our commercial desk has received your itemized breakdown and will send your formal portal link shortly.
                </p>
              </div>
            ) : requestOpen ? (
              <form onSubmit={handleSubmitQuoteRequest} className="space-y-3 pt-2 border-t border-[#E8E8ED] text-xs">
                <p className="font-bold text-[#1D1D1F]">Send Itemized Estimate for Formal Quote</p>
                {submitError && (
                  <p className="text-[#B42318] font-semibold">{submitError}</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your Full Name *"
                    className="rounded-xl border border-[#E8E8ED] bg-white px-3 py-2"
                  />
                  <input
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Business / Company *"
                    className="rounded-xl border border-[#E8E8ED] bg-white px-3 py-2"
                  />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address *"
                    className="rounded-xl border border-[#E8E8ED] bg-white px-3 py-2"
                  />
                  <input
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="WhatsApp / Mobile *"
                    className="rounded-xl border border-[#E8E8ED] bg-white px-3 py-2 font-mono-num"
                  />
                  <input
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City *"
                    className="rounded-xl border border-[#E8E8ED] bg-white px-3 py-2"
                  />
                  <input
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country *"
                    className="rounded-xl border border-[#E8E8ED] bg-white px-3 py-2"
                  />
                </div>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional timeline or scope notes..."
                  className="w-full rounded-xl border border-[#E8E8ED] bg-white px-3 py-2"
                />
                <div className="flex items-center justify-end gap-2">
                  <GlassButton variant="subtle" size="sm" onClick={() => setRequestOpen(false)}>
                    Cancel
                  </GlassButton>
                  <GlassButton type="submit" disabled={submitting} variant="primary" size="sm">
                    <Send className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{submitting ? 'Submitting...' : 'Request Official Quotation'}</span>
                  </GlassButton>
                </div>
              </form>
            ) : (
              <GlassButton
                variant="primary"
                size="lg"
                className="w-full"
                disabled={selectedEntries.length === 0}
                onClick={() => setRequestOpen(true)}
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                <span>Request Official Written Quotation</span>
              </GlassButton>
            )}
          </GlassPanel>
        </div>
      </div>
    </section>
  );
}
