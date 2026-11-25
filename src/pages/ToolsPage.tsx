import { useEffect, useMemo, useState } from 'react';
import {
  Calculator,
  Check,
  CheckCircle2,
  Compass,
  Copy,
  Info,
  RotateCcw,
  TrendingUp,
} from 'lucide-react';
import { AppRoute } from '../data/akyinData';
import { SERVICE_FINDER_OPTIONS } from '../data/ecosystemConfig';
import { suiteApi, SuiteServiceItem } from '../services/suiteApi';
import { AdvisoryBookingForm } from '../components/AdvisoryBookingForm';
import { ContactDispatcher } from '../components/ContactDispatcher';
import { GlassButton, GlassPanel } from '../components/liquid-glass';

interface ToolsPageProps {
  onNavigate: (route: AppRoute) => void;
}

type ToolGroup = 'marketing' | 'sales' | 'business';

function fmtCurrency(n: number, currency: 'INR' | 'AED' | 'USD' = 'INR'): string {
  if (!Number.isFinite(n)) return '0';
  return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(n);
}

function num(v: string, fallback = 0): number {
  const parsed = Number(v);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function CopyResetBar({
  resultSummary,
  onReset,
}: {
  resultSummary: string;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#E8E8ED]">
      <span className="inline-flex items-center gap-1.5 text-[11px] text-[#6E6E73]">
        <Info className="w-3.5 h-3.5 text-[#0071E3]" aria-hidden="true" />
        Estimate · Planning benchmark only
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E8E8ED] bg-[#F5F5F7] hover:bg-white text-[11px] font-semibold text-[#1D1D1F] cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(resultSummary);
              setCopied(true);
              setTimeout(() => setCopied(false), 1800);
            } catch {
              // ignore clipboard errors
            }
          }}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#1D1D1F] text-white text-[11px] font-semibold cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy Result'}
        </button>
      </div>
    </div>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  step = 'any',
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  step?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-[#6E6E73] mb-1">{label}</label>
      <input
        type="number"
        min="0"
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[#E8E8ED] bg-white px-3 py-2 font-mono-num text-sm text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]"
      />
    </div>
  );
}

export function ToolsPage({ onNavigate }: ToolsPageProps) {
  const [group, setGroup] = useState<ToolGroup>('marketing');

  // --- Marketing Tools (7) ---
  const [roiCost, setRoiCost] = useState('50000');
  const [roiRev, setRoiRev] = useState('180000');

  const [roasSpend, setRoasSpend] = useState('40000');
  const [roasRev, setRoasRev] = useState('220000');

  const [cplSpend, setCplSpend] = useState('30000');
  const [cplLeads, setCplLeads] = useState('120');

  const [cacSpend, setCacSpend] = useState('60000');
  const [cacSalesCost, setCacSalesCost] = useState('20000');
  const [cacCustomers, setCacCustomers] = useState('16');

  const [convVisits, setConvVisits] = useState('4000');
  const [convActions, setConvActions] = useState('180');

  const [planBudget, setPlanBudget] = useState('100000');
  const [planMetaPct, setPlanMetaPct] = useState('40');
  const [planGooglePct, setPlanGooglePct] = useState('35');
  const [planCreativePct, setPlanCreativePct] = useState('25');

  const [cpRev, setCpRev] = useState('240000');
  const [cpCogs, setCpCogs] = useState('110000');
  const [cpAdSpend, setCpAdSpend] = useState('45000');
  const [cpAgencyFee, setCpAgencyFee] = useState('25000');

  // --- Sales Tools (7) ---
  const [stTarget, setStTarget] = useState('1000000');
  const [stDealSize, setStDealSize] = useState('50000');
  const [stCloseRate, setStCloseRate] = useState('20');

  const [fcLeads, setFcLeads] = useState('150');
  const [fcConv, setFcConv] = useState('12');
  const [fcAvgOrder, setFcAvgOrder] = useState('28000');

  const [qtBase, setQtBase] = useState('40000');
  const [qtQty, setQtQty] = useState('1');
  const [qtDiscount, setQtDiscount] = useState('2000');
  const [qtGst, setQtGst] = useState('18');

  const [discPrice, setDiscPrice] = useState('25000');
  const [discPct, setDiscPct] = useState('15');

  const [gstAmount, setGstAmount] = useState('30000');
  const [gstRate, setGstRate] = useState('18');
  const [gstMode, setGstMode] = useState<'exclusive' | 'inclusive'>('exclusive');

  const [pmRev, setPmRev] = useState('50000');
  const [pmCost, setPmCost] = useState('31000');

  const [beFixed, setBeFixed] = useState('150000');
  const [bePrice, setBePrice] = useState('5000');
  const [beVar, setBeVar] = useState('2500');

  // --- Business Tools (6) ---
  const [scoreBudgetReady, setScoreBudgetReady] = useState(25);
  const [scoreNeedUrgency, setScoreNeedUrgency] = useState(25);
  const [scoreAuthority, setScoreAuthority] = useState(20);
  const [scoreFit, setScoreFit] = useState(20);

  const [campGoal, setCampGoal] = useState('Generate Qualified Showroom / Sales Calls');
  const [campDays, setCampDays] = useState('30');
  const [campBudget, setCampBudget] = useState('75000');
  const [campChannel, setCampChannel] = useState('Meta Ads + AI Lead Filtering');

  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    website: true,
    gbp: true,
    pixel: false,
    leadCrm: false,
    followupSla: false,
    monthlyPnl: true,
  });

  const [publicServices, setPublicServices] = useState<SuiteServiceItem[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');

  useEffect(() => {
    suiteApi
      .fetchPublicServices()
      .then((res) => {
        if (res?.services?.length) {
          setPublicServices(res.services);
          setSelectedServiceId(res.services[0].id);
        }
      })
      .catch(() => undefined);
  }, []);

  // Derived Calculations
  const roiVal = useMemo(() => {
    const c = num(roiCost);
    const r = num(roiRev);
    const net = r - c;
    const pct = c > 0 ? (net / c) * 100 : 0;
    return { net, pct };
  }, [roiCost, roiRev]);

  const roasVal = useMemo(() => {
    const s = num(roasSpend);
    const r = num(roasRev);
    return s > 0 ? r / s : 0;
  }, [roasSpend, roasRev]);

  const cplVal = useMemo(() => {
    const s = num(cplSpend);
    const l = num(cplLeads);
    return l > 0 ? s / l : 0;
  }, [cplSpend, cplLeads]);

  const cacVal = useMemo(() => {
    const total = num(cacSpend) + num(cacSalesCost);
    const cust = num(cacCustomers);
    return cust > 0 ? total / cust : 0;
  }, [cacSpend, cacSalesCost, cacCustomers]);

  const convVal = useMemo(() => {
    const v = num(convVisits);
    const a = num(convActions);
    return v > 0 ? (a / v) * 100 : 0;
  }, [convVisits, convActions]);

  const budgetSplit = useMemo(() => {
    const b = num(planBudget);
    const m = num(planMetaPct);
    const g = num(planGooglePct);
    const c = num(planCreativePct);
    const sum = m + g + c || 1;
    return {
      meta: (b * m) / sum,
      google: (b * g) / sum,
      creative: (b * c) / sum,
      totalPct: m + g + c,
    };
  }, [planBudget, planMetaPct, planGooglePct, planCreativePct]);

  const campProfit = useMemo(() => {
    const net = num(cpRev) - num(cpCogs) - num(cpAdSpend) - num(cpAgencyFee);
    const rev = num(cpRev);
    const margin = rev > 0 ? (net / rev) * 100 : 0;
    return { net, margin };
  }, [cpRev, cpCogs, cpAdSpend, cpAgencyFee]);

  const salesTargetCalc = useMemo(() => {
    const deals = num(stDealSize) > 0 ? Math.ceil(num(stTarget) / num(stDealSize)) : 0;
    const rate = num(stCloseRate);
    const leadsNeeded = rate > 0 ? Math.ceil(deals / (rate / 100)) : 0;
    return { deals, leadsNeeded };
  }, [stTarget, stDealSize, stCloseRate]);

  const revForecast = useMemo(() => {
    const customers = (num(fcLeads) * num(fcConv)) / 100;
    const rev = customers * num(fcAvgOrder);
    return { customers, rev };
  }, [fcLeads, fcConv, fcAvgOrder]);

  const quoteCalc = useMemo(() => {
    const sub = num(qtBase) * num(qtQty);
    const disc = Math.min(num(qtDiscount), sub);
    const taxable = Math.max(0, sub - disc);
    const gst = taxable * (num(qtGst) / 100);
    return { sub, disc, taxable, gst, total: taxable + gst };
  }, [qtBase, qtQty, qtDiscount, qtGst]);

  const discCalc = useMemo(() => {
    const p = num(discPrice);
    const pct = Math.min(100, num(discPct));
    const saved = (p * pct) / 100;
    return { saved, finalPrice: p - saved };
  }, [discPrice, discPct]);

  const gstCalc = useMemo(() => {
    const amt = num(gstAmount);
    const r = num(gstRate);
    if (gstMode === 'exclusive') {
      const gst = (amt * r) / 100;
      return { base: amt, gst, total: amt + gst };
    }
    const base = amt / (1 + r / 100);
    return { base, gst: amt - base, total: amt };
  }, [gstAmount, gstRate, gstMode]);

  const marginCalc = useMemo(() => {
    const r = num(pmRev);
    const c = num(pmCost);
    const profit = r - c;
    const marginPct = r > 0 ? (profit / r) * 100 : 0;
    const markupPct = c > 0 ? (profit / c) * 100 : 0;
    return { profit, marginPct, markupPct };
  }, [pmRev, pmCost]);

  const breakEvenCalc = useMemo(() => {
    const contrib = num(bePrice) - num(beVar);
    const units = contrib > 0 ? Math.ceil(num(beFixed) / contrib) : 0;
    const revenue = units * num(bePrice);
    return { contrib, units, revenue };
  }, [beFixed, bePrice, beVar]);

  const totalLeadScore = scoreBudgetReady + scoreNeedUrgency + scoreAuthority + scoreFit;
  const completedChecks = Object.values(checklist).filter(Boolean).length;
  const activeService =
    publicServices.find((s) => s.id === selectedServiceId) || publicServices[0] || null;

  return (
    <div className="bg-[#F5F5F7] text-[#1D1D1F] min-h-screen">
      {/* Header */}
      <section className="pt-16 pb-12 bg-white border-b border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#0071E3]">
              AKYIN.COM · Interactive Business Suite
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-[-0.025em] text-[#1D1D1F]">
              20 Marketing, Sales &amp; Business Planning Tools.
            </h1>
            <p className="text-base text-[#6E6E73] leading-relaxed">
              Transparent mathematical calculators, qualification scorecards, service selectors, and direct booking tools built for India and UAE businesses. All formulas are visible for verification.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Tool Suite Categories"
            className="inline-flex flex-wrap gap-2 p-1.5 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED]"
          >
            {[
              { id: 'marketing' as const, label: 'Marketing Calculators (7)', icon: TrendingUp },
              { id: 'sales' as const, label: 'Sales & Pricing Calculators (7)', icon: Calculator },
              { id: 'business' as const, label: 'Business Workflow Tools (6)', icon: Compass },
            ].map((t) => {
              const Icon = t.icon;
              const active = group === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setGroup(t.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    active ? 'bg-[#1D1D1F] text-white shadow-xs' : 'text-[#1D1D1F] hover:bg-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* GROUP A: 7 MARKETING TOOLS */}
          {group === 'marketing' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 1. ROI */}
              <GlassPanel className="p-6 space-y-4">
                <h2 className="font-display text-lg font-bold">1. Marketing ROI Calculator</h2>
                <p className="text-[11px] font-mono-num text-[#6E6E73]">
                  Formula: ((Revenue − Cost) / Cost) × 100
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <FieldInput label="Total Campaign Cost (₹)" value={roiCost} onChange={setRoiCost} />
                  <FieldInput label="Attributed Revenue (₹)" value={roiRev} onChange={setRoiRev} />
                </div>
                <div className="rounded-2xl bg-[#F5F5F7] p-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] text-[#6E6E73]">Net Return</p>
                    <p className="font-mono-num text-lg font-bold">{fmtCurrency(roiVal.net)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6E6E73]">ROI %</p>
                    <p className="font-mono-num text-lg font-bold text-[#0071E3]">
                      {roiVal.pct.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <CopyResetBar
                  resultSummary={`Marketing ROI: ${roiVal.pct.toFixed(1)}% (Net ${fmtCurrency(roiVal.net)})`}
                  onReset={() => {
                    setRoiCost('50000');
                    setRoiRev('180000');
                  }}
                />
              </GlassPanel>

              {/* 2. ROAS */}
              <GlassPanel className="p-6 space-y-4">
                <h2 className="font-display text-lg font-bold">2. ROAS Calculator</h2>
                <p className="text-[11px] font-mono-num text-[#6E6E73]">
                  Formula: Ad Attributed Revenue ÷ Ad Spend
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <FieldInput label="Ad Spend (₹)" value={roasSpend} onChange={setRoasSpend} />
                  <FieldInput label="Revenue Generated (₹)" value={roasRev} onChange={setRoasRev} />
                </div>
                <div className="rounded-2xl bg-[#F5F5F7] p-4">
                  <p className="text-[11px] text-[#6E6E73]">Return on Ad Spend</p>
                  <p className="font-mono-num text-2xl font-bold text-[#0071E3]">
                    {roasVal.toFixed(2)}x
                  </p>
                </div>
                <CopyResetBar
                  resultSummary={`ROAS: ${roasVal.toFixed(2)}x on ${fmtCurrency(num(roasSpend))} spend`}
                  onReset={() => {
                    setRoasSpend('40000');
                    setRoasRev('220000');
                  }}
                />
              </GlassPanel>

              {/* 3. CPL */}
              <GlassPanel className="p-6 space-y-4">
                <h2 className="font-display text-lg font-bold">3. Cost Per Lead (CPL)</h2>
                <p className="text-[11px] font-mono-num text-[#6E6E73]">
                  Formula: Campaign Spend ÷ Total Leads Captured
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <FieldInput label="Campaign Spend (₹)" value={cplSpend} onChange={setCplSpend} />
                  <FieldInput label="Total Leads" value={cplLeads} onChange={setCplLeads} />
                </div>
                <div className="rounded-2xl bg-[#F5F5F7] p-4">
                  <p className="text-[11px] text-[#6E6E73]">Cost Per Lead</p>
                  <p className="font-mono-num text-2xl font-bold text-[#1D1D1F]">
                    {fmtCurrency(cplVal)}
                  </p>
                </div>
                <CopyResetBar
                  resultSummary={`CPL: ${fmtCurrency(cplVal)} across ${cplLeads} leads`}
                  onReset={() => {
                    setCplSpend('30000');
                    setCplLeads('120');
                  }}
                />
              </GlassPanel>

              {/* 4. CAC */}
              <GlassPanel className="p-6 space-y-4">
                <h2 className="font-display text-lg font-bold">4. Customer Acquisition Cost (CAC)</h2>
                <p className="text-[11px] font-mono-num text-[#6E6E73]">
                  Formula: (Marketing + Sales Cost) ÷ Customers Won
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <FieldInput label="Marketing (₹)" value={cacSpend} onChange={setCacSpend} />
                  <FieldInput label="Sales Cost (₹)" value={cacSalesCost} onChange={setCacSalesCost} />
                  <FieldInput label="New Clients" value={cacCustomers} onChange={setCacCustomers} />
                </div>
                <div className="rounded-2xl bg-[#F5F5F7] p-4">
                  <p className="text-[11px] text-[#6E6E73]">Blended CAC</p>
                  <p className="font-mono-num text-2xl font-bold text-[#1D1D1F]">
                    {fmtCurrency(cacVal)}
                  </p>
                </div>
                <CopyResetBar
                  resultSummary={`Blended CAC: ${fmtCurrency(cacVal)} per customer`}
                  onReset={() => {
                    setCacSpend('60000');
                    setCacSalesCost('20000');
                    setCacCustomers('16');
                  }}
                />
              </GlassPanel>

              {/* 5. Conversion Rate */}
              <GlassPanel className="p-6 space-y-4">
                <h2 className="font-display text-lg font-bold">5. Conversion Rate Calculator</h2>
                <p className="text-[11px] font-mono-num text-[#6E6E73]">
                  Formula: (Conversions ÷ Total Visits or Leads) × 100
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <FieldInput label="Visits / Leads" value={convVisits} onChange={setConvVisits} />
                  <FieldInput label="Conversions" value={convActions} onChange={setConvActions} />
                </div>
                <div className="rounded-2xl bg-[#F5F5F7] p-4">
                  <p className="text-[11px] text-[#6E6E73]">Conversion Rate</p>
                  <p className="font-mono-num text-2xl font-bold text-[#0071E3]">
                    {convVal.toFixed(2)}%
                  </p>
                </div>
                <CopyResetBar
                  resultSummary={`Conversion Rate: ${convVal.toFixed(2)}% (${convActions}/${convVisits})`}
                  onReset={() => {
                    setConvVisits('4000');
                    setConvActions('180');
                  }}
                />
              </GlassPanel>

              {/* 6. Ad Budget Planner */}
              <GlassPanel className="p-6 space-y-4">
                <h2 className="font-display text-lg font-bold">6. Ad Budget Planner</h2>
                <p className="text-[11px] font-mono-num text-[#6E6E73]">
                  Normalized split across Meta, Google &amp; Creative
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <FieldInput label="Monthly Budget (₹)" value={planBudget} onChange={setPlanBudget} />
                  <FieldInput label="Meta Share" value={planMetaPct} onChange={setPlanMetaPct} />
                  <FieldInput label="Google Share" value={planGooglePct} onChange={setPlanGooglePct} />
                  <FieldInput label="Creative Share" value={planCreativePct} onChange={setPlanCreativePct} />
                </div>
                <div className="rounded-2xl bg-[#F5F5F7] p-3.5 space-y-1 text-xs font-mono-num">
                  <div className="flex justify-between">
                    <span>Meta Ads:</span>
                    <span className="font-bold">{fmtCurrency(budgetSplit.meta)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Google Ads:</span>
                    <span className="font-bold">{fmtCurrency(budgetSplit.google)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Creatives &amp; Reels:</span>
                    <span className="font-bold">{fmtCurrency(budgetSplit.creative)}</span>
                  </div>
                </div>
                <CopyResetBar
                  resultSummary={`Budget Split (${fmtCurrency(num(planBudget))}): Meta ${fmtCurrency(budgetSplit.meta)}, Google ${fmtCurrency(budgetSplit.google)}, Creative ${fmtCurrency(budgetSplit.creative)}`}
                  onReset={() => {
                    setPlanBudget('100000');
                    setPlanMetaPct('40');
                    setPlanGooglePct('35');
                    setPlanCreativePct('25');
                  }}
                />
              </GlassPanel>

              {/* 7. Campaign Profit */}
              <GlassPanel className="p-6 space-y-4 md:col-span-2 lg:col-span-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-display text-lg font-bold">7. Campaign Net Profit Calculator</h2>
                  <p className="text-[11px] font-mono-num text-[#6E6E73]">
                    Formula: Revenue − COGS − Ad Spend − Management Fee
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <FieldInput label="Gross Revenue (₹)" value={cpRev} onChange={setCpRev} />
                  <FieldInput label="Product / Delivery Cost (₹)" value={cpCogs} onChange={setCpCogs} />
                  <FieldInput label="Ad Spend (₹)" value={cpAdSpend} onChange={setCpAdSpend} />
                  <FieldInput label="Agency / Ops Fee (₹)" value={cpAgencyFee} onChange={setCpAgencyFee} />
                </div>
                <div className="rounded-2xl bg-[#F5F5F7] p-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#6E6E73]">Net Campaign Profit</p>
                    <p className="font-mono-num text-2xl font-bold">{fmtCurrency(campProfit.net)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6E6E73]">Net Contribution Margin</p>
                    <p className="font-mono-num text-2xl font-bold text-[#0071E3]">
                      {campProfit.margin.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <CopyResetBar
                  resultSummary={`Campaign Net Profit: ${fmtCurrency(campProfit.net)} (${campProfit.margin.toFixed(1)}% margin)`}
                  onReset={() => {
                    setCpRev('240000');
                    setCpCogs('110000');
                    setCpAdSpend('45000');
                    setCpAgencyFee('25000');
                  }}
                />
              </GlassPanel>
            </div>
          )}

          {/* GROUP B: 7 SALES TOOLS */}
          {group === 'sales' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 8. Sales Target */}
              <GlassPanel className="p-6 space-y-4">
                <h2 className="font-display text-lg font-bold">8. Sales Target Reverse Planner</h2>
                <p className="text-[11px] font-mono-num text-[#6E6E73]">
                  Deals = Target ÷ Avg Deal | Leads = Deals ÷ Close%
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <FieldInput label="Target (₹)" value={stTarget} onChange={setStTarget} />
                  <FieldInput label="Deal Size (₹)" value={stDealSize} onChange={setStDealSize} />
                  <FieldInput label="Close %" value={stCloseRate} onChange={setStCloseRate} />
                </div>
                <div className="rounded-2xl bg-[#F5F5F7] p-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] text-[#6E6E73]">Deals Required</p>
                    <p className="font-mono-num text-xl font-bold">{salesTargetCalc.deals}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6E6E73]">Qualified Leads Needed</p>
                    <p className="font-mono-num text-xl font-bold text-[#0071E3]">
                      {salesTargetCalc.leadsNeeded}
                    </p>
                  </div>
                </div>
                <CopyResetBar
                  resultSummary={`Target ${fmtCurrency(num(stTarget))}: Need ${salesTargetCalc.deals} deals & ${salesTargetCalc.leadsNeeded} leads`}
                  onReset={() => {
                    setStTarget('1000000');
                    setStDealSize('50000');
                    setStCloseRate('20');
                  }}
                />
              </GlassPanel>

              {/* 9. Monthly Revenue Forecast */}
              <GlassPanel className="p-6 space-y-4">
                <h2 className="font-display text-lg font-bold">9. Monthly Revenue Forecast</h2>
                <p className="text-[11px] font-mono-num text-[#6E6E73]">
                  Forecast = Leads × (Conv% / 100) × Avg Order Value
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <FieldInput label="Leads/Mo" value={fcLeads} onChange={setFcLeads} />
                  <FieldInput label="Conv %" value={fcConv} onChange={setFcConv} />
                  <FieldInput label="Avg Order (₹)" value={fcAvgOrder} onChange={setFcAvgOrder} />
                </div>
                <div className="rounded-2xl bg-[#F5F5F7] p-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] text-[#6E6E73]">Projected Clients</p>
                    <p className="font-mono-num text-xl font-bold">
                      {revForecast.customers.toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6E6E73]">Forecast Revenue</p>
                    <p className="font-mono-num text-xl font-bold text-[#0071E3]">
                      {fmtCurrency(revForecast.rev)}
                    </p>
                  </div>
                </div>
                <CopyResetBar
                  resultSummary={`Monthly Forecast: ${fmtCurrency(revForecast.rev)} (${revForecast.customers.toFixed(1)} clients)`}
                  onReset={() => {
                    setFcLeads('150');
                    setFcConv('12');
                    setFcAvgOrder('28000');
                  }}
                />
              </GlassPanel>

              {/* 10. Quotation Calculator */}
              <GlassPanel className="p-6 space-y-4">
                <h2 className="font-display text-lg font-bold">10. Quotation Estimator</h2>
                <p className="text-[11px] font-mono-num text-[#6E6E73]">
                  Grand Total = (Subtotal − Discount) × (1 + GST%)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <FieldInput label="Unit Price (₹)" value={qtBase} onChange={setQtBase} />
                  <FieldInput label="Qty" value={qtQty} onChange={setQtQty} />
                  <FieldInput label="Discount (₹)" value={qtDiscount} onChange={setQtDiscount} />
                  <FieldInput label="GST %" value={qtGst} onChange={setQtGst} />
                </div>
                <div className="rounded-2xl bg-[#F5F5F7] p-3.5 space-y-1 text-xs font-mono-num">
                  <div className="flex justify-between">
                    <span>Taxable Value:</span>
                    <span>{fmtCurrency(quoteCalc.taxable)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST ({qtGst}%):</span>
                    <span>{fmtCurrency(quoteCalc.gst)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-[#0071E3] pt-1 border-t border-[#E8E8ED]">
                    <span>Grand Total:</span>
                    <span>{fmtCurrency(quoteCalc.total)}</span>
                  </div>
                </div>
                <CopyResetBar
                  resultSummary={`Quotation Total: ${fmtCurrency(quoteCalc.total)} (Taxable ${fmtCurrency(quoteCalc.taxable)} + GST ${fmtCurrency(quoteCalc.gst)})`}
                  onReset={() => {
                    setQtBase('40000');
                    setQtQty('1');
                    setQtDiscount('2000');
                    setQtGst('18');
                  }}
                />
              </GlassPanel>

              {/* 11. Discount Calculator */}
              <GlassPanel className="p-6 space-y-4">
                <h2 className="font-display text-lg font-bold">11. Discount Calculator</h2>
                <p className="text-[11px] font-mono-num text-[#6E6E73]">
                  Final Price = List Price × (1 − Discount% / 100)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <FieldInput label="Original Price (₹)" value={discPrice} onChange={setDiscPrice} />
                  <FieldInput label="Discount %" value={discPct} onChange={setDiscPct} />
                </div>
                <div className="rounded-2xl bg-[#F5F5F7] p-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] text-[#6E6E73]">Savings</p>
                    <p className="font-mono-num text-lg font-bold">{fmtCurrency(discCalc.saved)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6E6E73]">Final Price</p>
                    <p className="font-mono-num text-lg font-bold text-[#0071E3]">
                      {fmtCurrency(discCalc.finalPrice)}
                    </p>
                  </div>
                </div>
                <CopyResetBar
                  resultSummary={`Final Price after ${discPct}% off: ${fmtCurrency(discCalc.finalPrice)} (Saved ${fmtCurrency(discCalc.saved)})`}
                  onReset={() => {
                    setDiscPrice('25000');
                    setDiscPct('15');
                  }}
                />
              </GlassPanel>

              {/* 12. GST Calculator */}
              <GlassPanel className="p-6 space-y-4">
                <h2 className="font-display text-lg font-bold">12. India GST Calculator</h2>
                <div className="flex gap-1.5">
                  {(['exclusive', 'inclusive'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setGstMode(m)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-semibold capitalize cursor-pointer ${
                        gstMode === m ? 'bg-[#1D1D1F] text-white' : 'bg-[#F5F5F7] text-[#6E6E73]'
                      }`}
                    >
                      GST {m}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FieldInput label="Amount (₹)" value={gstAmount} onChange={setGstAmount} />
                  <FieldInput label="GST Slab %" value={gstRate} onChange={setGstRate} />
                </div>
                <div className="rounded-2xl bg-[#F5F5F7] p-3.5 text-xs font-mono-num space-y-1">
                  <div className="flex justify-between">
                    <span>Base Value:</span>
                    <span>{fmtCurrency(gstCalc.base)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CGST + SGST ({gstRate}%):</span>
                    <span>{fmtCurrency(gstCalc.gst)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-[#0071E3]">
                    <span>Total Invoice:</span>
                    <span>{fmtCurrency(gstCalc.total)}</span>
                  </div>
                </div>
                <CopyResetBar
                  resultSummary={`GST (${gstMode} @ ${gstRate}%): Base ${fmtCurrency(gstCalc.base)}, Tax ${fmtCurrency(gstCalc.gst)}, Total ${fmtCurrency(gstCalc.total)}`}
                  onReset={() => {
                    setGstAmount('30000');
                    setGstRate('18');
                    setGstMode('exclusive');
                  }}
                />
              </GlassPanel>

              {/* 13. Profit Margin */}
              <GlassPanel className="p-6 space-y-4">
                <h2 className="font-display text-lg font-bold">13. Profit Margin &amp; Markup</h2>
                <p className="text-[11px] font-mono-num text-[#6E6E73]">
                  Margin = (Price − Cost) ÷ Price | Markup = Profit ÷ Cost
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <FieldInput label="Selling Price (₹)" value={pmRev} onChange={setPmRev} />
                  <FieldInput label="Direct Cost (₹)" value={pmCost} onChange={setPmCost} />
                </div>
                <div className="rounded-2xl bg-[#F5F5F7] p-4 grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-[11px] text-[#6E6E73]">Profit</p>
                    <p className="font-mono-num text-sm font-bold">{fmtCurrency(marginCalc.profit)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6E6E73]">Margin</p>
                    <p className="font-mono-num text-sm font-bold text-[#0071E3]">
                      {marginCalc.marginPct.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6E6E73]">Markup</p>
                    <p className="font-mono-num text-sm font-bold">
                      {marginCalc.markupPct.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <CopyResetBar
                  resultSummary={`Profit ${fmtCurrency(marginCalc.profit)} · Margin ${marginCalc.marginPct.toFixed(1)}% · Markup ${marginCalc.markupPct.toFixed(1)}%`}
                  onReset={() => {
                    setPmRev('50000');
                    setPmCost('31000');
                  }}
                />
              </GlassPanel>

              {/* 14. Break-even */}
              <GlassPanel className="p-6 space-y-4 md:col-span-2 lg:col-span-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-display text-lg font-bold">14. Break-Even Calculator</h2>
                  <p className="text-[11px] font-mono-num text-[#6E6E73]">
                    Units = Fixed Costs ÷ (Unit Price − Variable Cost Per Unit)
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <FieldInput label="Monthly Fixed Costs (₹)" value={beFixed} onChange={setBeFixed} />
                  <FieldInput label="Unit Selling Price (₹)" value={bePrice} onChange={setBePrice} />
                  <FieldInput label="Variable Cost / Unit (₹)" value={beVar} onChange={setBeVar} />
                </div>
                <div className="rounded-2xl bg-[#F5F5F7] p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-[#6E6E73]">Contribution / Unit</p>
                    <p className="font-mono-num text-xl font-bold">{fmtCurrency(breakEvenCalc.contrib)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6E6E73]">Break-Even Units</p>
                    <p className="font-mono-num text-xl font-bold text-[#0071E3]">
                      {breakEvenCalc.units} units
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6E6E73]">Break-Even Revenue</p>
                    <p className="font-mono-num text-xl font-bold">{fmtCurrency(breakEvenCalc.revenue)}</p>
                  </div>
                </div>
                <CopyResetBar
                  resultSummary={`Break-Even: ${breakEvenCalc.units} units (${fmtCurrency(breakEvenCalc.revenue)} revenue)`}
                  onReset={() => {
                    setBeFixed('150000');
                    setBePrice('5000');
                    setBeVar('2500');
                  }}
                />
              </GlassPanel>
            </div>
          )}

          {/* GROUP C: 6 BUSINESS TOOLS */}
          {group === 'business' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 15. Lead Qualification Scorecard */}
                <GlassPanel className="p-6 space-y-4">
                  <h2 className="font-display text-lg font-bold">15. Lead Qualification Scorecard</h2>
                  <p className="text-xs text-[#6E6E73]">
                    Score prospects out of 100 across BANT criteria before floor handover.
                  </p>
                  <div className="space-y-3 text-xs">
                    {[
                      { label: 'Budget Readiness (0–25)', val: scoreBudgetReady, set: setScoreBudgetReady },
                      { label: 'Purchase Urgency (0–25)', val: scoreNeedUrgency, set: setScoreNeedUrgency },
                      { label: 'Decision Authority (0–25)', val: scoreAuthority, set: setScoreAuthority },
                      { label: 'Ideal Segment Fit (0–25)', val: scoreFit, set: setScoreFit },
                    ].map((row) => (
                      <div key={row.label} className="space-y-1">
                        <div className="flex justify-between font-semibold">
                          <span>{row.label}</span>
                          <span className="font-mono-num">{row.val}/25</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={25}
                          step={5}
                          value={row.val}
                          onChange={(e) => row.set(Number(e.target.value))}
                          className="w-full accent-[#0071E3]"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="rounded-2xl bg-[#F5F5F7] p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-[#6E6E73]">Priority Tier</p>
                      <p className="font-display font-bold text-base text-[#0071E3]">
                        {totalLeadScore >= 75
                          ? 'HOT — Immediate Proposal'
                          : totalLeadScore >= 50
                            ? 'WARM — Discovery Follow-Up'
                            : 'NURTURE — Future Pipeline'}
                      </p>
                    </div>
                    <span className="font-mono-num text-2xl font-bold">{totalLeadScore}/100</span>
                  </div>
                  <CopyResetBar
                    resultSummary={`Lead Score: ${totalLeadScore}/100 (${totalLeadScore >= 75 ? 'HOT' : totalLeadScore >= 50 ? 'WARM' : 'NURTURE'})`}
                    onReset={() => {
                      setScoreBudgetReady(25);
                      setScoreNeedUrgency(25);
                      setScoreAuthority(20);
                      setScoreFit(20);
                    }}
                  />
                </GlassPanel>

                {/* 16. Marketing Campaign Planner */}
                <GlassPanel className="p-6 space-y-4">
                  <h2 className="font-display text-lg font-bold">16. Marketing Campaign Planner</h2>
                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label className="block font-semibold text-[#6E6E73] mb-1">Primary Objective</label>
                      <select
                        value={campGoal}
                        onChange={(e) => setCampGoal(e.target.value)}
                        className="w-full rounded-xl border border-[#E8E8ED] bg-white px-3 py-2 text-xs text-[#1D1D1F]"
                      >
                        <option>Generate Qualified Showroom / Sales Calls</option>
                        <option>New Product / Store Launch</option>
                        <option>B2B Wholesale Buyer Acquisition</option>
                        <option>Repeat Customer Retention Sprint</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <FieldInput label="Duration (Days)" value={campDays} onChange={setCampDays} />
                      <FieldInput label="Ad Budget (₹)" value={campBudget} onChange={setCampBudget} />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#6E6E73] mb-1">Execution Mix</label>
                      <input
                        type="text"
                        value={campChannel}
                        onChange={(e) => setCampChannel(e.target.value)}
                        className="w-full rounded-xl border border-[#E8E8ED] bg-white px-3 py-2 text-xs text-[#1D1D1F]"
                      />
                    </div>
                  </div>
                  <div className="rounded-2xl bg-[#F5F5F7] p-4 space-y-1 text-xs">
                    <p className="font-semibold text-[#1D1D1F]">Daily Pacing Plan</p>
                    <p className="font-mono-num text-lg font-bold text-[#0071E3]">
                      {fmtCurrency(num(campDays) > 0 ? num(campBudget) / num(campDays) : 0)} / day
                    </p>
                    <p className="text-[#6E6E73]">
                      {campGoal} via {campChannel} over {campDays} days.
                    </p>
                  </div>
                  <CopyResetBar
                    resultSummary={`Campaign Plan (${campDays}d): ${campGoal} · ${fmtCurrency(num(campBudget))} (${campChannel})`}
                    onReset={() => {
                      setCampGoal('Generate Qualified Showroom / Sales Calls');
                      setCampDays('30');
                      setCampBudget('75000');
                      setCampChannel('Meta Ads + AI Lead Filtering');
                    }}
                  />
                </GlassPanel>

                {/* 17. Business Growth Checklist */}
                <GlassPanel className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-lg font-bold">17. Business Growth Checklist</h2>
                    <span className="font-mono-num text-xs font-bold text-[#0071E3]">
                      {completedChecks}/6 Done
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    {[
                      { k: 'website', label: 'Conversion landing page & fast mobile enquiry capture' },
                      { k: 'gbp', label: 'Google Business Profile & local catchment SEO verified' },
                      { k: 'pixel', label: 'Meta Pixel / Google Ads conversion events tracked' },
                      { k: 'leadCrm', label: 'Every enquiry tagged & tracked inside central CRM' },
                      { k: 'followupSla', label: 'Strict <24h follow-up SLA & call vetting active' },
                      { k: 'monthlyPnl', label: 'Monthly GST, refunds & net unit revenue reconciled' },
                    ].map((item) => (
                      <label
                        key={item.k}
                        className="flex items-start gap-2.5 p-2 rounded-xl bg-[#F5F5F7] cursor-pointer hover:bg-white border border-transparent hover:border-[#E8E8ED]"
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(checklist[item.k])}
                          onChange={(e) =>
                            setChecklist((prev) => ({ ...prev, [item.k]: e.target.checked }))
                          }
                          className="mt-0.5 accent-[#0071E3]"
                        />
                        <span className="text-[#1D1D1F]">{item.label}</span>
                      </label>
                    ))}
                  </div>
                  <CopyResetBar
                    resultSummary={`Business Growth Readiness: ${completedChecks}/6 milestones completed.`}
                    onReset={() =>
                      setChecklist({
                        website: true,
                        gbp: true,
                        pixel: false,
                        leadCrm: false,
                        followupSla: false,
                        monthlyPnl: true,
                      })
                    }
                  />
                </GlassPanel>
              </div>

              {/* 18. Service Selection Tool */}
              <GlassPanel className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl font-bold">18. Service Selection Tool</h2>
                    <p className="text-xs text-[#6E6E73]">
                      Explore AKYIN’s 13-category live service catalogue, published fees, GST rules, and deliverables.
                    </p>
                  </div>
                  <GlassButton variant="subtle" size="sm" onClick={() => onNavigate('/pricing')}>
                    View Rate Card
                  </GlassButton>
                </div>

                {publicServices.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-5 space-y-2 max-h-[360px] overflow-y-auto pr-1">
                      {publicServices.map((srv) => {
                        const active = activeService?.id === srv.id;
                        return (
                          <button
                            key={srv.id}
                            type="button"
                            onClick={() => setSelectedServiceId(srv.id)}
                            className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                              active
                                ? 'bg-[#1D1D1F] text-white border-[#1D1D1F]'
                                : 'bg-[#F5F5F7] text-[#1D1D1F] border-[#E8E8ED] hover:bg-white'
                            }`}
                          >
                            <p className="text-[11px] font-semibold opacity-75">{srv.category}</p>
                            <p className="text-sm font-bold">{srv.name}</p>
                          </button>
                        );
                      })}
                    </div>
                    {activeService && (
                      <div className="lg:col-span-7 rounded-3xl bg-[#F5F5F7] border border-[#E8E8ED] p-6 space-y-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold text-[#0071E3]">
                              {activeService.category}
                            </p>
                            <h3 className="font-display text-xl font-bold">{activeService.name}</h3>
                          </div>
                          <div className="text-right font-mono-num">
                            {activeService.pricingModel === 'custom' ? (
                              <span className="text-sm font-bold text-[#1D1D1F]">
                                Custom Quotation
                              </span>
                            ) : (
                              <div className="text-xs space-y-0.5">
                                {activeService.setupFee > 0 && (
                                  <p>Setup: {fmtCurrency(activeService.setupFee)}</p>
                                )}
                                {activeService.recurringFee > 0 && (
                                  <p className="font-bold text-sm">
                                    {fmtCurrency(activeService.recurringFee)} / {activeService.billingCycle}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-[#6E6E73]">{activeService.description}</p>
                        <ul className="space-y-1.5 text-xs text-[#1D1D1F]">
                          {activeService.deliverables.map((d) => (
                            <li key={d} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#0071E3] shrink-0 mt-0.5" />
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="text-[11px] text-[#6E6E73]">
                          Delivery: {activeService.deliveryPeriod} · GST:{' '}
                          {activeService.gstEnabled ? `${activeService.gstRate}% applicable` : 'Not applicable'}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {SERVICE_FINDER_OPTIONS.slice(0, 3).map((opt) => (
                      <div key={opt.id} className="rounded-2xl bg-[#F5F5F7] p-4 border border-[#E8E8ED]">
                        <p className="font-bold text-sm">{opt.label}</p>
                        <p className="text-xs text-[#6E6E73] mt-1">{opt.tagline}</p>
                      </div>
                    ))}
                  </div>
                )}
              </GlassPanel>

              {/* 19. Appointment Booking Widget */}
              <div className="space-y-4">
                <h2 className="font-display text-2xl font-bold">
                  19. Appointment Booking Widget (6:00 PM – 7:00 PM IST)
                </h2>
                <AdvisoryBookingForm />
              </div>

              {/* 20. Direct Enquiry Submission Tool */}
              <div className="space-y-4">
                <h2 className="font-display text-2xl font-bold">
                  20. Enquiry Submission Tool
                </h2>
                <ContactDispatcher
                  sectionId="tools-enquiry-dispatcher"
                  heading="Request a Custom Quotation or Strategy Call."
                  subheading="Every enquiry logged here creates a tracked CRM ticket with a guaranteed 24-hour turnaround."
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
