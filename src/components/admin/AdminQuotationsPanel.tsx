import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  Check,
  CheckCircle2,
  Copy,
  FilePlus2,
  Plus,
  Printer,
  Search,
  Trash2,
} from 'lucide-react';
import {
  CrmLead,
  SuiteClientRecord,
  SuiteQuotation,
  SuiteQuotationLineItem,
  SuiteServiceItem,
  suiteApi,
} from '../../services/suiteApi';
import { GlassButton, GlassModal } from '../liquid-glass';
import { ServiceBillingDisclaimer } from '../ServiceBillingDisclaimer';

interface AdminQuotationsPanelProps {
  onChanged?: () => void;
}

export function AdminQuotationsPanel({ onChanged }: AdminQuotationsPanelProps) {
  const [quotations, setQuotations] = useState<SuiteQuotation[]>([]);
  const [services, setServices] = useState<SuiteServiceItem[]>([]);
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [clients, setClients] = useState<SuiteClientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState('');

  // Builder Modal
  const [builderOpen, setBuilderOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [leadId, setLeadId] = useState('');
  const [clientId, setClientId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [cityCountry, setCityCountry] = useState('India');
  const [currency, setCurrency] = useState<'INR' | 'AED' | 'USD'>('INR');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [gstEnabled, setGstEnabled] = useState(true);
  const [gstRate, setGstRate] = useState(18);
  const [paymentTerms, setPaymentTerms] = useState('50% advance on acceptance, 50% on delivery.');
  const [scopeOfWork, setScopeOfWork] = useState('');
  const [exclusions, setExclusions] = useState(
    'Paid media budgets are paid directly to Meta / Google by client.'
  );
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<SuiteQuotationLineItem[]>([
    {
      id: 'item-1',
      title: 'Marketing Growth Strategy & Campaign Setup',
      description: '',
      qty: 1,
      unitPrice: 79998,
      lineTotal: 79998,
    },
  ]);

  const [printPreview, setPrintPreview] = useState<SuiteQuotation | null>(null);
  const [extraSmsQty, setExtraSmsQty] = useState(5000);
  const [whatsappMsgQty, setWhatsappMsgQty] = useState(1000);
  const [builderComparePlans, setBuilderComparePlans] = useState(false);
  const [builderPlanMode, setBuilderPlanMode] = useState<'one-time' | 'monthly'>('one-time');

  const hasMessagingLine = useMemo(
    () =>
      items.some((it) => {
        const t = it.title.toLowerCase();
        return (
          it.serviceId === 'srv-bulk-sms' ||
          it.serviceId === 'srv-whatsapp-messaging' ||
          t.includes('sms') ||
          t.includes('whatsapp')
        );
      }),
    [items]
  );

  const inferCategoryForQuote = (qt: SuiteQuotation): string => {
    const firstMatchedService = qt.items
      .map((item) => services.find((s) => s.id === item.serviceId))
      .find(Boolean);
    if (firstMatchedService) return firstMatchedService.category;
    const text = qt.items.map((i) => i.title.toLowerCase()).join(' ');
    if (text.includes('whatsapp')) return 'WhatsApp Business Messaging';
    if (text.includes('bulk sms') || text.includes('sms')) return 'Bulk SMS Marketing';
    return 'Digital marketing';
  };

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [qtRes, srvRes, leadRes, clientRes] = await Promise.all([
        suiteApi.getQuotations(),
        suiteApi.getServices(),
        suiteApi.getLeads().catch(() => ({ leads: [] })),
        suiteApi.getClients().catch(() => ({ clients: [] })),
      ]);
      setQuotations(qtRes.quotations);
      setServices(srvRes.services);
      setLeads(leadRes.leads);
      setClients(clientRes.clients);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load quotations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return quotations;
    return quotations.filter(
      (qt) =>
        qt.quoteNumber.toLowerCase().includes(q) ||
        qt.customerName.toLowerCase().includes(q) ||
        qt.companyName.toLowerCase().includes(q) ||
        qt.status.toLowerCase().includes(q)
    );
  }, [quotations, search]);

  const inferLineBillingType = (it: SuiteQuotationLineItem): 'one-time' | 'monthly' | 'usage' => {
    if (it.billingType) return it.billingType;
    const t = (it.title + ' ' + (it.description || '')).toLowerCase();
    if (
      t.includes('/message') ||
      t.includes('per-message') ||
      t.includes('per message') ||
      t.includes('extra sms') ||
      t.includes('additional bulk sms') ||
      t.includes('usage charge')
    ) {
      return 'usage';
    }
    if (
      t.includes('monthly') ||
      t.includes('/month') ||
      t.includes('retainer') ||
      t.includes('subscription') ||
      t.includes('reels suite') ||
      t.includes('management & reels')
    ) {
      return 'monthly';
    }
    return 'one-time';
  };

  const calcPreview = useMemo(() => {
    let oneTimeSubtotal = 0;
    let monthlySubtotal = 0;
    let usageSubtotal = 0;

    for (const it of items) {
      const lineTotal = (Number(it.qty) || 0) * (Number(it.unitPrice) || 0);
      const bType = inferLineBillingType(it);
      if (bType === 'monthly') monthlySubtotal += lineTotal;
      else if (bType === 'usage') usageSubtotal += lineTotal;
      else oneTimeSubtotal += lineTotal;
    }

    const subtotal = oneTimeSubtotal + monthlySubtotal + usageSubtotal;
    const clampedDiscount = Math.min(subtotal, Math.max(0, Number(discountAmount) || 0));
    const taxable = Math.max(0, subtotal - clampedDiscount);
    const gstRateNum = Number(gstRate) || 0;
    const gstAmount = gstEnabled ? Math.round(taxable * (gstRateNum / 100) * 100) / 100 : 0;
    const grandTotal = Math.round((taxable + gstAmount) * 100) / 100;
    const payableNow = grandTotal;
    const futureRecurringAmount = gstEnabled
      ? Math.round(monthlySubtotal * (1 + gstRateNum / 100) * 100) / 100
      : monthlySubtotal;

    return {
      subtotal,
      oneTimeSubtotal,
      monthlySubtotal,
      usageSubtotal,
      clampedDiscount,
      taxable,
      gstAmount,
      grandTotal,
      payableNow,
      futureRecurringAmount,
    };
  }, [items, discountAmount, gstEnabled, gstRate]);

  const handleSelectLead = (id: string) => {
    setLeadId(id);
    const found = leads.find((l) => l.leadId === id);
    if (found) {
      setCustomerName(found.fullName);
      setCompanyName(found.companyName);
      setCustomerEmail(found.email);
      setCustomerPhone(found.mobileNumber);
      setCityCountry([found.city, found.country].filter(Boolean).join(', '));
    }
  };

  const handleSelectClient = (id: string) => {
    setClientId(id);
    const found = clients.find((c) => c.id === id);
    if (found) {
      setCustomerName(found.contactPerson || found.name);
      setCompanyName(found.companyName || found.name);
      if (found.email) setCustomerEmail(found.email);
      if (found.phone) setCustomerPhone(found.phone);
      setCityCountry([found.city, found.country].filter(Boolean).join(', '));
    }
  };

  const resolveServiceTierPrice = (
    srv: SuiteServiceItem,
    field: 'setupFee' | 'packagePrice' | 'unitRate' | 'additionalUnitRate'
  ): number => {
    const tierKey = currency === 'AED' ? 'aed' : currency === 'USD' ? 'usd' : null;
    if (tierKey && srv.internationalPricing?.[tierKey]?.[field] !== undefined) {
      return Number(srv.internationalPricing[tierKey]![field]) || 0;
    }
    if (field === 'setupFee') return srv.oneTimePrice ?? srv.setupFee ?? 0;
    if (field === 'packagePrice') return srv.monthlyPrice ?? srv.packagePrice ?? srv.recurringFee ?? 0;
    if (field === 'unitRate') return srv.unitRate || 0;
    return srv.additionalUnitRate ?? srv.unitRate ?? 0;
  };

  const supportsBothPlansForBuilder = useCallback(
    (srv: SuiteServiceItem): boolean => {
      if (srv.pricingModel === 'custom') return false;
      if (srv.id === 'srv-bulk-sms' || srv.id === 'srv-whatsapp-messaging') return false;
      const oneTime = resolveServiceTierPrice(srv, 'setupFee');
      const monthly = resolveServiceTierPrice(srv, 'packagePrice');
      return oneTime > 0 && monthly > 0;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currency]
  );

  const dualPlanServices = useMemo(
    () => services.filter((s) => s.active && supportsBothPlansForBuilder(s)),
    [services, supportsBothPlansForBuilder]
  );

  const dualPlanComparisonTotals = useMemo(() => {
    let oneTimeIfAllOneTime = 0;
    let oneTimeIfAllMonthly = 0;
    let monthlyIfAllMonthly = 0;
    let dualCount = 0;

    for (const it of items) {
      const qty = Math.max(1, Number(it.qty) || 1);
      const srv = it.serviceId ? services.find((s) => s.id === it.serviceId) : undefined;
      if (srv && supportsBothPlansForBuilder(srv)) {
        dualCount += 1;
        oneTimeIfAllOneTime += resolveServiceTierPrice(srv, 'setupFee') * qty;
        monthlyIfAllMonthly += resolveServiceTierPrice(srv, 'packagePrice') * qty;
      } else {
        const lineTotal = qty * (Number(it.unitPrice) || 0);
        const bType = inferLineBillingType(it);
        if (bType === 'monthly') {
          monthlyIfAllMonthly += lineTotal;
        } else {
          oneTimeIfAllOneTime += lineTotal;
          oneTimeIfAllMonthly += lineTotal;
        }
      }
    }

    return {
      dualCount,
      oneTimeIfAllOneTime,
      oneTimeIfAllMonthly,
      monthlyIfAllMonthly,
    };
  }, [items, services, supportsBothPlansForBuilder, currency]);

  const handleSwitchBuilderPlanMode = (mode: 'one-time' | 'monthly') => {
    setBuilderPlanMode(mode);
    setItems((prev) =>
      prev.map((row) => {
        if (!row.serviceId) return row;
        const srv = services.find((s) => s.id === row.serviceId);
        if (!srv || !supportsBothPlansForBuilder(srv)) return row;
        const newPrice = resolveServiceTierPrice(
          srv,
          mode === 'one-time' ? 'setupFee' : 'packagePrice'
        );
        const qty = Math.max(1, Number(row.qty) || 1);
        return {
          ...row,
          title:
            mode === 'one-time'
              ? `${srv.name} — One-Time Project`
              : `${srv.name} — Monthly Subscription`,
          unitPrice: newPrice,
          lineTotal: Math.round(qty * newPrice * 100) / 100,
          billingType: mode,
        };
      })
    );
  };

  const handleToggleRowPlan = (idx: number) => {
    setItems((prev) =>
      prev.map((row, i) => {
        if (i !== idx || !row.serviceId) return row;
        const srv = services.find((s) => s.id === row.serviceId);
        if (!srv || !supportsBothPlansForBuilder(srv)) return row;
        const current = inferLineBillingType(row) === 'monthly' ? 'monthly' : 'one-time';
        const nextMode: 'one-time' | 'monthly' = current === 'one-time' ? 'monthly' : 'one-time';
        const nextPrice = resolveServiceTierPrice(
          srv,
          nextMode === 'one-time' ? 'setupFee' : 'packagePrice'
        );
        const qty = Math.max(1, Number(row.qty) || 1);
        return {
          ...row,
          title:
            nextMode === 'one-time'
              ? `${srv.name} — One-Time Project`
              : `${srv.name} — Monthly Subscription`,
          unitPrice: nextPrice,
          lineTotal: Math.round(qty * nextPrice * 100) / 100,
          billingType: nextMode,
        };
      })
    );
  };

  const handleAddServiceWithPlan = (srv: SuiteServiceItem, mode: 'one-time' | 'monthly') => {
    const unitPrice = resolveServiceTierPrice(
      srv,
      mode === 'one-time' ? 'setupFee' : 'packagePrice'
    );
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}-${mode}`,
        serviceId: srv.id,
        title:
          mode === 'one-time'
            ? `${srv.name} — One-Time Project`
            : `${srv.name} — Monthly Subscription`,
        description: srv.description.slice(0, 140),
        qty: 1,
        unitPrice,
        lineTotal: unitPrice,
        billingType: mode,
      },
    ]);
  };

  const handleAddServiceLine = (serviceId: string) => {
    const srv = services.find((s) => s.id === serviceId);
    if (!srv) return;
    const setupFee = resolveServiceTierPrice(srv, 'setupFee');
    const packagePrice = resolveServiceTierPrice(srv, 'packagePrice');
    const unitRate = resolveServiceTierPrice(srv, 'unitRate');
    const newRows: SuiteQuotationLineItem[] = [];
    const stamp = Date.now();

    if (srv.id === 'srv-whatsapp-messaging' || (setupFee > 0 && unitRate > 0)) {
      newRows.push({
        id: `item-${stamp}-setup`,
        serviceId: srv.id,
        title: `${srv.name} (One-Time Setup Fee)`,
        description: 'Business profile configuration, messaging workflow & onboarding setup.',
        qty: 1,
        unitPrice: setupFee,
        lineTotal: setupFee,
        billingType: 'one-time',
      });
      if (unitRate > 0) {
        const qty = Math.max(1, whatsappMsgQty || 1000);
        newRows.push({
          id: `item-${stamp}-usage`,
          serviceId: srv.id,
          title: `WhatsApp Business Message Usage (${currency} ${unitRate.toFixed(2)}/${srv.unitLabel || 'message'})`,
          description: 'Metered per-message usage charge billed strictly separate from one-time setup fee.',
          qty,
          unitPrice: unitRate,
          lineTotal: Math.round(qty * unitRate * 100) / 100,
          billingType: 'usage',
        });
      }
    } else if (srv.id === 'srv-bulk-sms' || (packagePrice > 0 && (srv.includedUnits || 0) > 0)) {
      const units = srv.includedUnits || 10000;
      newRows.push({
        id: `item-${stamp}-pkg`,
        serviceId: srv.id,
        title: `${srv.name} — ${units.toLocaleString('en-IN')} ${srv.unitLabel || 'SMS'} Credits Package`,
        description: `Includes ${units.toLocaleString('en-IN')} ${srv.unitLabel || 'SMS'} credits (${currency} ${unitRate.toFixed(2)}/${srv.unitLabel || 'SMS'} effective rate).`,
        qty: 1,
        unitPrice: packagePrice,
        lineTotal: packagePrice,
        billingType: 'one-time',
      });
    } else if (setupFee > 0 && packagePrice > 0) {
      const chosenPrice = builderPlanMode === 'one-time' ? setupFee : packagePrice;
      newRows.push({
        id: `item-${stamp}-${builderPlanMode}`,
        serviceId: srv.id,
        title:
          builderPlanMode === 'one-time'
            ? `${srv.name} — One-Time Project`
            : `${srv.name} — Monthly Subscription`,
        description: srv.description.slice(0, 140),
        qty: 1,
        unitPrice: chosenPrice,
        lineTotal: chosenPrice,
        billingType: builderPlanMode,
      });
    } else {
      if (setupFee > 0) {
        newRows.push({
          id: `item-${stamp}-s`,
          serviceId: srv.id,
          title: `${srv.name} — Standalone / Setup`,
          description: srv.description.slice(0, 140),
          qty: 1,
          unitPrice: setupFee,
          lineTotal: setupFee,
          billingType: 'one-time',
        });
      }
      if (packagePrice > 0 || setupFee === 0) {
        newRows.push({
          id: `item-${stamp}-b`,
          serviceId: srv.id,
          title: setupFee > 0 ? `${srv.name} — Monthly Subscription` : srv.name,
          description: srv.description.slice(0, 140),
          qty: 1,
          unitPrice: packagePrice,
          lineTotal: packagePrice,
          billingType: srv.billingCycle === 'monthly' ? 'monthly' : 'one-time',
        });
      }
    }

    setItems((prev) => [...prev, ...newRows]);
  };

  const handleAddBulkSmsExtraRow = () => {
    const srv = services.find((s) => s.id === 'srv-bulk-sms');
    const rate = srv ? resolveServiceTierPrice(srv, 'additionalUnitRate') : 0.3;
    const qty = Math.max(1, Number(extraSmsQty) || 1000);
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}-extra-sms`,
        serviceId: srv?.id || 'srv-bulk-sms',
        title: `Additional Bulk SMS Credits (${currency} ${rate.toFixed(2)}/SMS)`,
        description: 'Additional SMS volume calculated using admin-configured per-SMS rate.',
        qty,
        unitPrice: rate,
        lineTotal: Math.round(qty * rate * 100) / 100,
        billingType: 'usage',
      },
    ]);
  };

  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const res = await suiteApi.createQuotation({
        leadId,
        clientId,
        customerName,
        companyName,
        customerEmail,
        customerPhone,
        cityCountry,
        currency,
        items: items.map((it) => ({
          id: it.id,
          serviceId: it.serviceId,
          title: it.title,
          description: it.description,
          qty: Number(it.qty) || 1,
          unitPrice: Number(it.unitPrice) || 0,
          billingType: it.billingType,
        })),
        discountAmount: Number(discountAmount) || 0,
        gstEnabled,
        gstRate: Number(gstRate) || 0,
        paymentTerms,
        scopeOfWork,
        exclusions,
        notes,
        status: 'SENT',
      });
      setBuilderOpen(false);
      setNotice(`Issued quotation ${res.quotation.quoteNumber}.`);
      await loadAll();
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create quotation.');
    } finally {
      setSaving(false);
    }
  };

  const handleConvertToInvoice = async (
    qt: SuiteQuotation,
    paymentType: 'advance' | 'full' | 'balance'
  ) => {
    setSaving(true);
    setError('');
    try {
      const serviceCategory = inferCategoryForQuote(qt);
      const res = await suiteApi.convertQuotationToInvoice(qt.id, {
        paymentType,
        serviceCategory,
      });
      setNotice(
        `Generated invoice ${res.invoice.invoiceNumber} (${serviceCategory}) from ${qt.quoteNumber}.`
      );
      await loadAll();
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed.');
    } finally {
      setSaving(false);
    }
  };

  const copyPortalLink = async (qt: SuiteQuotation) => {
    const url = `${window.location.origin}/quote?token=${qt.shareToken}`;
    await navigator.clipboard?.writeText(url).catch(() => undefined);
    setCopiedId(qt.id);
    window.setTimeout(() => setCopiedId(''), 2000);
  };

  const inputCls =
    'w-full rounded-xl border border-[#E8E8ED] bg-white px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F]">
            Quotations &amp; Proposal Builder
          </h2>
          <p className="text-xs text-[#6E6E73] mt-0.5">
            Create itemized proposals with server-verified GST math, shareable /quote portals, A4 PDF printouts, and 1-click invoice conversion.
          </p>
        </div>
        <GlassButton variant="primary" size="sm" onClick={() => setBuilderOpen(true)}>
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          <span>New Quotation</span>
        </GlassButton>
      </div>

      <div className="liquid-glass-card rounded-2xl p-4 flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            className="w-4 h-4 text-[#A1A1A6] absolute left-3 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search quote number, customer, company, status..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E8ED] bg-white text-xs"
          />
        </div>
        <span className="font-mono-num text-xs text-[#6E6E73]">{filtered.length} quotations</span>
      </div>

      {notice && (
        <div className="rounded-2xl liquid-glass-panel px-4 py-3 text-xs font-semibold text-[#1D1D1F] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#067647]" aria-hidden="true" />
          <span>{notice}</span>
        </div>
      )}
      {error && (
        <div className="rounded-2xl bg-[#FEF3F2] border border-[#FECDCA] px-4 py-3 text-xs font-semibold text-[#B42318]">
          {error}
        </div>
      )}

      <div className="liquid-glass-card rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-xs text-[#6E6E73]">Loading quotations...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-xs text-[#6E6E73]">
            No quotations created yet. Click &ldquo;New Quotation&rdquo; to build one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5F5F7]/85 border-b border-[#E8E8ED] text-[#6E6E73] font-semibold">
                  <th className="py-3 px-4">Quote #</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Totals</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8ED]">
                {filtered.map((qt) => (
                  <tr key={qt.id} className="hover:bg-white/75 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <p className="font-mono-num font-bold text-[#1D1D1F]">{qt.quoteNumber}</p>
                      <p className="font-mono-num text-[10px] text-[#6E6E73]">
                        v{qt.version} · Expires {qt.expiryDate}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-[#1D1D1F]">
                        {qt.companyName || qt.customerName}
                      </p>
                      <p className="text-[11px] text-[#6E6E73]">
                        {qt.customerName} · {qt.customerEmail}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 font-mono-num whitespace-nowrap">
                      <p className="font-bold text-[#1D1D1F]">
                        {qt.currency} {qt.grandTotal.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] text-[#6E6E73]">
                        {qt.gstEnabled ? `Incl. GST (${qt.gstRate}%)` : 'No GST'}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold ${
                          qt.status === 'ACCEPTED'
                            ? 'bg-[#ECFDF3] border-[#ABEFC6] text-[#067647]'
                            : qt.status === 'REJECTED'
                              ? 'bg-[#FEF3F2] border-[#FECDCA] text-[#B42318]'
                              : 'bg-white border-[#E8E8ED] text-[#1D1D1F]'
                        }`}
                      >
                        {qt.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => void copyPortalLink(qt)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E8E8ED] bg-white hover:border-[#0071E3] text-[11px] font-semibold cursor-pointer"
                        >
                          {copiedId === qt.id ? (
                            <>
                              <Check className="w-3 h-3 text-[#067647]" /> Copied URL
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Portal Link
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPrintPreview(qt)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E8E8ED] bg-white hover:border-[#1D1D1F] text-[11px] font-semibold cursor-pointer"
                        >
                          <Printer className="w-3 h-3" /> A4
                        </button>
                        {!qt.convertedInvoiceId ? (
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => void handleConvertToInvoice(qt, 'full')}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#1D1D1F] text-white hover:bg-[#0071E3] text-[11px] font-semibold cursor-pointer"
                          >
                            <FilePlus2 className="w-3 h-3" /> Invoice
                          </button>
                        ) : (
                          <span className="font-mono-num text-[10px] font-semibold text-[#067647] px-2">
                            Invoiced
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quotation Builder Modal */}
      <GlassModal
        open={builderOpen}
        onClose={() => setBuilderOpen(false)}
        subtitle="PROPOSAL BUILDER"
        title="Create Itemized Quotation"
      >
        <form onSubmit={handleCreateQuotation} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">
                Prefill from CRM Lead (Optional)
              </label>
              <select
                value={leadId}
                onChange={(e) => handleSelectLead(e.target.value)}
                className={inputCls}
              >
                <option value="">-- Select Lead --</option>
                {leads.map((l) => (
                  <option key={l.leadId} value={l.leadId}>
                    {l.fullName} ({l.companyName || l.leadId})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">
                Prefill from Client (Optional)
              </label>
              <select
                value={clientId}
                onChange={(e) => handleSelectClient(e.target.value)}
                className={inputCls}
              >
                <option value="">-- Select Client --</option>
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
                className={inputCls}
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Company Name</label>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
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
                className={inputCls}
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Phone</label>
              <input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className={`${inputCls} font-mono-num`}
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">City / Country</label>
              <input
                value={cityCountry}
                onChange={(e) => setCityCountry(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className={inputCls}
              >
                <option value="INR">INR (₹)</option>
                <option value="AED">AED (UAE)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>

          {/* Add Service Item & Messaging Calculator */}
          <div className="pt-2 border-t border-[#E8E8ED] space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-[#1D1D1F]">Line Items</p>
                <div className="inline-flex items-center rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] p-0.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleSwitchBuilderPlanMode('one-time')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      builderPlanMode === 'one-time'
                        ? 'bg-white text-[#1D1D1F] shadow-xs'
                        : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                    }`}
                  >
                    One-Time Project
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSwitchBuilderPlanMode('monthly')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      builderPlanMode === 'monthly'
                        ? 'bg-white text-[#1D1D1F] shadow-xs'
                        : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                    }`}
                  >
                    Monthly Subscription
                  </button>
                </div>
                <button
                  type="button"
                  aria-pressed={builderComparePlans}
                  onClick={() => setBuilderComparePlans((v) => !v)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    builderComparePlans
                      ? 'border-[#0071E3] bg-[#0071E3] text-white'
                      : 'border-[#E8E8ED] bg-white text-[#1D1D1F] hover:border-[#0071E3]'
                  }`}
                >
                  <ArrowLeftRight className="w-3 h-3" aria-hidden="true" />
                  <span>Compare Plans {builderComparePlans ? 'ON' : 'OFF'}</span>
                </button>
              </div>
              <select
                value=""
                onChange={(e) => handleAddServiceLine(e.target.value)}
                className="rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] px-3 py-1.5 text-xs font-semibold"
              >
                <option value="">+ Insert from Service Catalogue ({currency})...</option>
                {services
                  .filter((s) => s.active)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (
                      {s.pricingModel === 'custom'
                        ? 'Custom'
                        : s.id === 'srv-whatsapp-messaging'
                          ? `₹${s.setupFee} Setup + ₹${(s.unitRate || 1.5).toFixed(2)}/msg`
                          : s.id === 'srv-bulk-sms'
                            ? `₹${s.packagePrice || s.recurringFee} / ${(s.includedUnits || 10000).toLocaleString('en-IN')} SMS`
                            : supportsBothPlansForBuilder(s)
                              ? builderPlanMode === 'one-time'
                                ? `${currency} ${resolveServiceTierPrice(s, 'setupFee').toLocaleString('en-IN')} One-Time`
                                : `${currency} ${resolveServiceTierPrice(s, 'packagePrice').toLocaleString('en-IN')}/mo`
                              : `${currency} ${(resolveServiceTierPrice(s, 'setupFee') || resolveServiceTierPrice(s, 'packagePrice')).toLocaleString('en-IN')}`}
                      )
                    </option>
                  ))}
              </select>
            </div>

            {builderComparePlans && (
              <div className="rounded-2xl border border-[#0071E3]/25 bg-white p-3 space-y-2.5 text-[11px]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold text-[#1D1D1F]">
                    Compare Plans — Dual-Option Services ({dualPlanServices.length})
                  </p>
                  <p className="text-[#6E6E73]">
                    Switch plan mode above to recalibrate all dual-plan line items simultaneously, or add either option below.
                  </p>
                </div>
                {dualPlanComparisonTotals.dualCount > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-xl bg-[#F5F5F7] p-2.5 font-mono-num">
                    <div>
                      <span className="font-sans text-[#6E6E73] block text-[10px]">
                        If Dual-Plan Items Are One-Time Project
                      </span>
                      <span className="font-bold text-[#1D1D1F]">
                        {currency} {dualPlanComparisonTotals.oneTimeIfAllOneTime.toLocaleString('en-IN')} one-time
                      </span>
                    </div>
                    <div>
                      <span className="font-sans text-[#6E6E73] block text-[10px]">
                        If Dual-Plan Items Are Monthly Subscription
                      </span>
                      <span className="font-bold text-[#0071E3]">
                        {currency} {dualPlanComparisonTotals.monthlyIfAllMonthly.toLocaleString('en-IN')}/mo
                        {dualPlanComparisonTotals.oneTimeIfAllMonthly > 0
                          ? ` + ${currency} ${dualPlanComparisonTotals.oneTimeIfAllMonthly.toLocaleString('en-IN')} one-time`
                          : ''}
                      </span>
                    </div>
                  </div>
                )}
                <div className="max-h-44 overflow-y-auto divide-y divide-[#E8E8ED] border border-[#E8E8ED] rounded-xl">
                  {dualPlanServices.map((srv) => {
                    const oneTimeVal = resolveServiceTierPrice(srv, 'setupFee');
                    const monthlyVal = resolveServiceTierPrice(srv, 'packagePrice');
                    return (
                      <div
                        key={srv.id}
                        className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 hover:bg-[#F5F5F7]/60"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-[#1D1D1F] truncate">{srv.name}</p>
                          <p className="text-[10px] text-[#6E6E73]">{srv.category}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 font-mono-num">
                          <button
                            type="button"
                            onClick={() => handleAddServiceWithPlan(srv, 'one-time')}
                            className={`px-2 py-1 rounded-lg border text-[11px] font-semibold cursor-pointer ${
                              builderPlanMode === 'one-time'
                                ? 'border-[#1D1D1F] bg-[#1D1D1F] text-white'
                                : 'border-[#E8E8ED] bg-[#F5F5F7] text-[#1D1D1F] hover:border-[#0071E3]'
                            }`}
                          >
                            + {currency} {oneTimeVal.toLocaleString('en-IN')} One-Time
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddServiceWithPlan(srv, 'monthly')}
                            className={`px-2 py-1 rounded-lg border text-[11px] font-semibold cursor-pointer ${
                              builderPlanMode === 'monthly'
                                ? 'border-[#0071E3] bg-[#0071E3] text-white'
                                : 'border-[#E8E8ED] bg-[#F5F5F7] text-[#1D1D1F] hover:border-[#0071E3]'
                            }`}
                          >
                            + {currency} {monthlyVal.toLocaleString('en-IN')}/mo
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Messaging Unit Helpers */}
            <div className="rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7]/70 p-2.5 flex flex-wrap items-center gap-3 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[#1D1D1F]">Extra SMS Credits:</span>
                <input
                  type="number"
                  min={1}
                  step="1"
                  value={extraSmsQty}
                  onChange={(e) => setExtraSmsQty(Number(e.target.value) || 0)}
                  className="w-24 rounded-lg border border-[#E8E8ED] bg-white px-2 py-1 font-mono-num"
                />
                <button
                  type="button"
                  onClick={handleAddBulkSmsExtraRow}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#E8E8ED] hover:border-[#0071E3] font-semibold text-[#0071E3] cursor-pointer"
                >
                  + Add SMS Credits
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[#1D1D1F]">WhatsApp Usage Qty:</span>
                <input
                  type="number"
                  min={1}
                  step="1"
                  value={whatsappMsgQty}
                  onChange={(e) => setWhatsappMsgQty(Number(e.target.value) || 0)}
                  className="w-24 rounded-lg border border-[#E8E8ED] bg-white px-2 py-1 font-mono-num"
                />
                <button
                  type="button"
                  onClick={() => handleAddServiceLine('srv-whatsapp-messaging')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#E8E8ED] hover:border-[#0071E3] font-semibold text-[#0071E3] cursor-pointer"
                >
                  + Add WA Setup + Usage
                </button>
              </div>
            </div>

            {items.map((it, idx) => {
              const linkedSrv = it.serviceId ? services.find((s) => s.id === it.serviceId) : undefined;
              const rowDual = linkedSrv ? supportsBothPlansForBuilder(linkedSrv) : false;
              const rowPlan = inferLineBillingType(it);
              return (
                <div
                  key={it.id}
                  className="grid grid-cols-12 gap-2 items-center rounded-xl border border-[#E8E8ED] bg-[#F5F5F7]/60 p-2.5"
                >
                  <div className="col-span-6 space-y-1">
                    <input
                      required
                      value={it.title}
                      onChange={(e) =>
                        setItems((prev) =>
                          prev.map((row, i) => (i === idx ? { ...row, title: e.target.value } : row))
                        )
                      }
                      placeholder="Line item title"
                      className="w-full rounded-lg border border-[#E8E8ED] bg-white px-2.5 py-1.5 text-xs"
                    />
                    {rowDual && (
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="text-[#6E6E73] font-semibold uppercase tracking-wider">
                          {rowPlan === 'monthly' ? 'Monthly Plan' : 'One-Time Project'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleRowPlan(idx)}
                          className="inline-flex items-center gap-1 text-[#0071E3] font-semibold hover:underline cursor-pointer"
                        >
                          <ArrowLeftRight className="w-3 h-3" aria-hidden="true" />
                          <span>
                            Switch to {rowPlan === 'monthly' ? 'One-Time' : 'Monthly'}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                  <input
                    type="number"
                    min={1}
                    step="1"
                    value={it.qty}
                    onChange={(e) =>
                      setItems((prev) =>
                        prev.map((row, i) =>
                          i === idx ? { ...row, qty: Number(e.target.value) || 1 } : row
                        )
                      )
                    }
                    className="col-span-2 rounded-lg border border-[#E8E8ED] bg-white px-2 py-1.5 font-mono-num text-xs"
                  />
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={it.unitPrice}
                    onChange={(e) =>
                      setItems((prev) =>
                        prev.map((row, i) =>
                          i === idx ? { ...row, unitPrice: Number(e.target.value) || 0 } : row
                        )
                      )
                    }
                    className="col-span-3 rounded-lg border border-[#E8E8ED] bg-white px-2 py-1.5 font-mono-num text-xs"
                  />
                  <button
                    type="button"
                    disabled={items.length <= 1}
                    onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}
                    className="col-span-1 text-[#B42318] flex justify-center cursor-pointer disabled:opacity-30"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}

            <button
              type="button"
              onClick={() =>
                setItems((prev) => [
                  ...prev,
                  {
                    id: `item-${Date.now()}`,
                    title: '',
                    description: '',
                    qty: 1,
                    unitPrice: 0,
                    lineTotal: 0,
                  },
                ])
              }
              className="text-[11px] font-semibold text-[#0071E3] hover:underline cursor-pointer"
            >
              + Add Custom Row
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Discount ({currency})</label>
              <input
                type="number"
                min={0}
                value={discountAmount}
                onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                className={`${inputCls} font-mono-num`}
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">GST Rate (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                disabled={!gstEnabled}
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value) || 0)}
                className={`${inputCls} font-mono-num`}
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="inline-flex items-center gap-2 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={gstEnabled}
                  onChange={(e) => setGstEnabled(e.target.checked)}
                  className="accent-[#0071E3]"
                />
                <span>Include GST</span>
              </label>
            </div>
          </div>

          <div className="rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED] p-4 space-y-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[#6E6E73] font-mono-num">
              <span>One-Time Subtotal: {currency} {calcPreview.oneTimeSubtotal.toLocaleString('en-IN')}</span>
              <span>Monthly Recurring: {currency} {calcPreview.monthlySubtotal.toLocaleString('en-IN')}</span>
              <span>Usage Metered: {currency} {calcPreview.usageSubtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E8E8ED] font-mono-num">
              <span>Taxable: {currency} {calcPreview.taxable.toLocaleString('en-IN')}</span>
              <span>GST ({gstEnabled ? gstRate : 0}%): {currency} {calcPreview.gstAmount.toLocaleString('en-IN')}</span>
              <span className="font-bold text-[#067647] text-sm">
                Payable Upfront Now: {currency} {calcPreview.payableNow.toLocaleString('en-IN')}
              </span>
            </div>
            {calcPreview.monthlySubtotal > 0 && (
              <p className="text-[11px] text-[#0071E3] font-semibold pt-1 border-t border-[#E8E8ED]">
                Future Recurring Amount: {currency} {calcPreview.futureRecurringAmount.toLocaleString('en-IN')} / month (includes applicable taxes)
              </p>
            )}
          </div>

          <ServiceBillingDisclaimer variant="compact" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Payment Terms</label>
              <input
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Exclusions</label>
              <input
                value={exclusions}
                onChange={(e) => setExclusions(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#1D1D1F] mb-1">Scope &amp; Notes</label>
            <textarea
              rows={2}
              value={scopeOfWork}
              onChange={(e) => setScopeOfWork(e.target.value)}
              placeholder="Deliverables timeline, milestones, reporting cadence..."
              className={inputCls}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <GlassButton variant="subtle" size="sm" onClick={() => setBuilderOpen(false)}>
              Cancel
            </GlassButton>
            <GlassButton type="submit" disabled={saving} variant="primary" size="sm">
              {saving ? 'Generating...' : 'Issue Quotation & Share Link'}
            </GlassButton>
          </div>
        </form>
      </GlassModal>

      {/* Print Preview Modal */}
      <GlassModal
        open={Boolean(printPreview)}
        onClose={() => setPrintPreview(null)}
        subtitle={printPreview?.quoteNumber}
        title="A4 Quotation Summary"
      >
        {printPreview && (
          <div className="space-y-4 text-xs">
            <div className="border border-[#E8E8ED] rounded-2xl p-4 bg-white space-y-2">
              <div className="flex justify-between font-bold text-[#1D1D1F]">
                <span>{printPreview.companyName || printPreview.customerName}</span>
                <span className="font-mono-num">
                  {printPreview.currency} {printPreview.grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[#6E6E73]">
                {printPreview.customerEmail} · Valid until {printPreview.expiryDate}
              </p>
              <ul className="divide-y divide-[#E8E8ED] pt-2">
                {printPreview.items.map((it) => (
                  <li key={it.id} className="py-1.5 flex justify-between">
                    <span>
                      {it.title} × {it.qty.toLocaleString('en-IN')}
                    </span>
                    <span className="font-mono-num">
                      {printPreview.currency} {it.lineTotal.toLocaleString('en-IN')}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <ServiceBillingDisclaimer variant="compact" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <a
                href={`/quote?token=${encodeURIComponent(printPreview.shareToken)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold liquid-glass-pill-dark text-white"
              >
                <Printer className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Open Printable /quote Portal</span>
              </a>
            </div>
          </div>
        )}
      </GlassModal>
    </div>
  );
}
