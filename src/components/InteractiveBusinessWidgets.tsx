import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Calculator,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  Info,
  PieChart,
  RefreshCw,
  Send,
} from 'lucide-react';
import { AppRoute, OFFICIAL_CONTACT } from '../data/akyinData';
import { SERVICE_FINDER_OPTIONS, ServiceFinderOption } from '../data/ecosystemConfig';
import { submitValidatedLead } from '../services/leadApi';
import { canTriggerAction } from '../utils/security';
import { AdvisoryBookingForm } from './AdvisoryBookingForm';
import { EditorialReveal } from './EditorialReveal';
import { GlassButton, GlassPanel } from './liquid-glass';

export type BusinessWidgetTabId =
  | 'roi'
  | 'budget'
  | 'assessment'
  | 'finder'
  | 'enquiry'
  | 'booking';

interface InteractiveBusinessWidgetsProps {
  sectionId?: string;
  onNavigate: (route: AppRoute) => void;
  activeTab: BusinessWidgetTabId;
  onTabChange: (tab: BusinessWidgetTabId) => void;
  backgroundClass?: string;
}

const WIDGET_TABS: {
  id: BusinessWidgetTabId;
  shortLabel: string;
  title: string;
  icon: typeof Calculator;
}[] = [
  { id: 'roi', shortLabel: 'ROI Calculator', title: 'Marketing ROI Calculator', icon: Calculator },
  { id: 'budget', shortLabel: 'Budget Planner', title: 'Marketing Budget Planner', icon: PieChart },
  {
    id: 'assessment',
    shortLabel: 'Growth Assessment',
    title: 'Business Growth Assessment',
    icon: ClipboardCheck,
  },
  { id: 'finder', shortLabel: 'Service Finder', title: 'AKYIN Service Finder', icon: Compass },
  { id: 'enquiry', shortLabel: 'Lead Enquiry', title: 'Direct Lead Enquiry', icon: Send },
  {
    id: 'booking',
    shortLabel: 'Book Consultation',
    title: 'Consultation Booking',
    icon: CalendarClock,
  },
];

interface BudgetChannel {
  id: 'googleAds' | 'metaAds' | 'seo' | 'content' | 'webLanding';
  label: string;
  suggestedPct: number;
  note: string;
}

const DEFAULT_BUDGET_CHANNELS: BudgetChannel[] = [
  {
    id: 'googleAds',
    label: 'Google Ads',
    suggestedPct: 25,
    note: 'High-intent search capture for active buyers',
  },
  {
    id: 'metaAds',
    label: 'Meta Ads',
    suggestedPct: 35,
    note: 'Targeted demand generation, reels & lead forms',
  },
  {
    id: 'seo',
    label: 'SEO',
    suggestedPct: 15,
    note: 'Google Business Profile & regional search visibility',
  },
  {
    id: 'content',
    label: 'Content Marketing',
    suggestedPct: 15,
    note: 'Short-form video, graphics & brand storytelling',
  },
  {
    id: 'webLanding',
    label: 'Website & Landing Pages',
    suggestedPct: 10,
    note: 'Conversion pages & lead capture improvements',
  },
];

function formatInr(value: number): string {
  if (!Number.isFinite(value)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function InteractiveBusinessWidgets({
  sectionId = 'business-growth-tools',
  onNavigate,
  activeTab,
  onTabChange,
  backgroundClass = 'surface-silver-gradient',
}: InteractiveBusinessWidgetsProps) {
  // A. Marketing ROI Calculator State
  const [roiBudget, setRoiBudget] = useState(50000);
  const [avgCustomerValue, setAvgCustomerValue] = useState(18000);
  const [expectedLeads, setExpectedLeads] = useState(140);
  const [leadConversionRate, setLeadConversionRate] = useState(8);

  const roiMetrics = useMemo(() => {
    const estimatedCustomers = Math.max(0, Math.round((expectedLeads * leadConversionRate) / 100));
    const estimatedRevenue = estimatedCustomers * avgCustomerValue;
    const roas = roiBudget > 0 ? estimatedRevenue / roiBudget : 0;
    const roiPercent = roiBudget > 0 ? ((estimatedRevenue - roiBudget) / roiBudget) * 100 : 0;
    return {
      estimatedCustomers,
      estimatedRevenue,
      adSpend: roiBudget,
      roas,
      roiPercent,
    };
  }, [roiBudget, avgCustomerValue, expectedLeads, leadConversionRate]);

  // B. Marketing Budget Planner State
  const [monthlyBudgetInput, setMonthlyBudgetInput] = useState(75000);
  const [allocations, setAllocations] = useState<Record<BudgetChannel['id'], number>>({
    googleAds: 25,
    metaAds: 35,
    seo: 15,
    content: 15,
    webLanding: 10,
  });

  const totalAllocationPct = useMemo(
    () => Object.values(allocations).reduce((acc, val) => acc + val, 0),
    [allocations]
  );

  const normalizeBudgetTo100 = () => {
    const total = totalAllocationPct;
    if (total === 0) {
      setAllocations({ googleAds: 25, metaAds: 35, seo: 15, content: 15, webLanding: 10 });
      return;
    }
    const keys = Object.keys(allocations) as BudgetChannel['id'][];
    const scaled = keys.map((k) => Math.floor((allocations[k] / total) * 100));
    const remainder = 100 - scaled.reduce((a, b) => a + b, 0);
    scaled[0] += remainder;
    setAllocations({
      googleAds: scaled[0],
      metaAds: scaled[1],
      seo: scaled[2],
      content: scaled[3],
      webLanding: scaled[4],
    });
  };

  // C. Business Growth Assessment State
  const [assessBusinessType, setAssessBusinessType] = useState('Retail / D2C Brand');
  const [assessLocation, setAssessLocation] = useState('India');
  const [assessHasWebsite, setAssessHasWebsite] = useState<'yes' | 'no' | 'outdated'>('yes');
  const [assessRunningAds, setAssessRunningAds] = useState<'yes' | 'no'>('no');
  const [assessRegularEnquiries, setAssessRegularEnquiries] = useState<'yes' | 'inconsistent' | 'no'>('inconsistent');
  const [assessChallenge, setAssessChallenge] = useState('Generating consistent qualified leads');
  const [assessSubmitted, setAssessSubmitted] = useState(false);

  const assessmentSummary = useMemo(() => {
    const recommendations: string[] = [];
    if (assessHasWebsite !== 'yes') {
      recommendations.push('Website & Conversion Landing Page Build');
    }
    if (assessRunningAds === 'no' || assessChallenge === 'Generating consistent qualified leads') {
      recommendations.push('Performance Lead Generation (Meta & Google Ads)');
    }
    if (assessRegularEnquiries !== 'yes' || assessChallenge === 'Filtering cold enquiries & improving sales conversion') {
      recommendations.push('Lead Filtering & Qualification Workflow');
    }
    if (assessBusinessType === 'Automotive Dealership') {
      recommendations.push('Automotive Test-Drive Campaign & Floor Sales Training');
    }
    if (recommendations.length < 2) {
      recommendations.push('Starter / Growth Monthly Marketing Retainer');
    }

    const readinessStage =
      assessHasWebsite === 'yes' && assessRunningAds === 'yes'
        ? 'Scale & Qualification Stage'
        : assessHasWebsite === 'yes'
          ? 'Customer Acquisition Activation Stage'
          : 'Digital Foundation & Launch Stage';

    return {
      readinessStage,
      recommendations: recommendations.slice(0, 3),
      summaryText: `Business Type: ${assessBusinessType} (${assessLocation}) | Website: ${assessHasWebsite} | Paid Ads: ${assessRunningAds} | Regular Enquiries: ${assessRegularEnquiries} | Primary Challenge: ${assessChallenge}`,
    };
  }, [
    assessBusinessType,
    assessLocation,
    assessHasWebsite,
    assessRunningAds,
    assessRegularEnquiries,
    assessChallenge,
  ]);

  // D. Service Finder State
  const [selectedServiceFinder, setSelectedServiceFinder] = useState<ServiceFinderOption>(
    SERVICE_FINDER_OPTIONS[0]
  );

  // E. Lead Enquiry Widget State (Server-validated POST /api/leads; zero localStorage PII)
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');
  const [requiredService, setRequiredService] = useState(SERVICE_FINDER_OPTIONS[0].enquiryServiceValue);
  const [monthlyMarketingBudget, setMonthlyMarketingBudget] = useState('₹25,000 – ₹75,000 / month');
  const [message, setMessage] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [leadError, setLeadError] = useState('');
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState<{
    leadId: string;
    receivedAt: string;
    syncedToLiveSheet: boolean;
  } | null>(null);

  const openEnquiryPrefilled = (serviceValue: string, prefillNote?: string) => {
    setRequiredService(serviceValue);
    if (prefillNote) {
      setMessage(prefillNote);
    }
    setLeadSuccess(null);
    setLeadError('');
    onTabChange('enquiry');
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot.trim().length > 0) return;
    if (!canTriggerAction('lead-widget-submit', 1500)) return;

    setLeadError('');
    setLeadSubmitting(true);

    try {
      const result = await submitValidatedLead({
        fullName,
        businessName,
        mobileNumber,
        email,
        city,
        country,
        requiredService,
        monthlyMarketingBudget,
        message,
        consentAccepted,
        honeypot,
        source: 'AKYIN Interactive Lead Enquiry Widget',
      });
      setLeadSuccess({
        leadId: result.leadId,
        receivedAt: result.receivedAt,
        syncedToLiveSheet: result.syncedToLiveSheet,
      });
    } catch (err) {
      setLeadError(err instanceof Error ? err.message : 'Please check all fields and consent before submitting.');
    } finally {
      setLeadSubmitting(false);
    }
  };

  const resetLeadForm = () => {
    setLeadSuccess(null);
    setLeadError('');
    setFullName('');
    setBusinessName('');
    setMobileNumber('');
    setEmail('');
    setCity('');
    setMessage('');
    setConsentAccepted(false);
  };

  const inputCls =
    'w-full rounded-xl border border-[#E8E8ED] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#1D1D1F] placeholder:text-[#A1A1A6] focus:outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/15';

  return (
    <section id={sectionId} className={`py-20 lg:py-28 border-t border-[#E8E8ED] ${backgroundClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <EditorialReveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#0071E3]">
                Interactive Business Toolkit · {OFFICIAL_CONTACT.regionIndicator}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-[-0.025em] text-[#1D1D1F] text-balance">
                Plan Budgets, Estimate ROI &amp; Connect Directly.
              </h2>
              <p className="text-base text-[#6E6E73] leading-relaxed">
                Practical interactive planning calculators, growth diagnostics, and direct enquiry tools designed for founders, marketing teams, and dealerships.
              </p>
            </div>
          </div>
        </EditorialReveal>

        {/* Segmented Tab Switcher */}
        <div
          role="tablist"
          aria-label="Interactive business growth widgets"
          className="flex flex-wrap gap-1.5 p-1.5 liquid-glass-nav rounded-2xl border border-[#E8E8ED]"
        >
          {WIDGET_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onTabChange(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-[#1D1D1F] text-white shadow-xs'
                    : 'text-[#1D1D1F] hover:bg-white/85'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Active Widget Surface */}
        <GlassPanel className="rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#E8E8ED]">
          {/* A. MARKETING ROI CALCULATOR */}
          {activeTab === 'roi' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#6E6E73]">
                    Widget A · Projection Model
                  </p>
                  <h3 className="font-display text-2xl font-bold text-[#1D1D1F]">
                    Marketing ROI Calculator
                  </h3>
                  <p className="text-sm text-[#6E6E73]">
                    Adjust your monthly ad budget, average customer value, expected leads, and sales conversion rate to model indicative commercial outcomes.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#1D1D1F]">
                      <label htmlFor="roi-budget">Monthly Advertising Budget (INR)</label>
                      <span className="font-mono-num">{formatInr(roiBudget)}</span>
                    </div>
                    <input
                      id="roi-budget"
                      type="range"
                      min={10000}
                      max={1000000}
                      step={5000}
                      value={roiBudget}
                      onChange={(e) => setRoiBudget(Number(e.target.value))}
                      className="w-full accent-[#1D1D1F] cursor-pointer"
                    />
                    <input
                      type="number"
                      min={1000}
                      max={50000000}
                      value={roiBudget}
                      onChange={(e) => setRoiBudget(Math.max(0, Number(e.target.value) || 0))}
                      aria-label="Monthly advertising budget amount"
                      className={`${inputCls} font-mono-num`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#1D1D1F]">
                      <label htmlFor="roi-customer-value">Average Customer Value (INR)</label>
                      <span className="font-mono-num">{formatInr(avgCustomerValue)}</span>
                    </div>
                    <input
                      id="roi-customer-value"
                      type="range"
                      min={1000}
                      max={250000}
                      step={1000}
                      value={avgCustomerValue}
                      onChange={(e) => setAvgCustomerValue(Number(e.target.value))}
                      className="w-full accent-[#1D1D1F] cursor-pointer"
                    />
                    <input
                      type="number"
                      min={100}
                      max={50000000}
                      value={avgCustomerValue}
                      onChange={(e) => setAvgCustomerValue(Math.max(0, Number(e.target.value) || 0))}
                      aria-label="Average customer value amount"
                      className={`${inputCls} font-mono-num`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="roi-leads" className="block text-xs font-semibold text-[#1D1D1F]">
                        Expected Monthly Leads
                      </label>
                      <input
                        id="roi-leads"
                        type="number"
                        min={1}
                        max={100000}
                        value={expectedLeads}
                        onChange={(e) => setExpectedLeads(Math.max(0, Number(e.target.value) || 0))}
                        className={`${inputCls} font-mono-num`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="roi-conv" className="block text-xs font-semibold text-[#1D1D1F]">
                        Lead Conversion Rate (%)
                      </label>
                      <input
                        id="roi-conv"
                        type="number"
                        min={0.5}
                        max={100}
                        step={0.5}
                        value={leadConversionRate}
                        onChange={(e) =>
                          setLeadConversionRate(Math.min(100, Math.max(0, Number(e.target.value) || 0)))
                        }
                        className={`${inputCls} font-mono-num`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white border border-[#E8E8ED] p-5 space-y-1">
                    <p className="text-xs text-[#6E6E73]">Estimated Customers</p>
                    <p className="font-mono-num text-2xl sm:text-3xl font-bold text-[#1D1D1F]">
                      {roiMetrics.estimatedCustomers}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white border border-[#E8E8ED] p-5 space-y-1">
                    <p className="text-xs text-[#6E6E73]">Estimated Revenue</p>
                    <p className="font-mono-num text-2xl sm:text-3xl font-bold text-[#1D1D1F]">
                      {formatInr(roiMetrics.estimatedRevenue)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white border border-[#E8E8ED] p-5 space-y-1">
                    <p className="text-xs text-[#6E6E73]">Advertising Spend</p>
                    <p className="font-mono-num text-2xl sm:text-3xl font-bold text-[#1D1D1F]">
                      {formatInr(roiMetrics.adSpend)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#1D1D1F] text-white p-5 space-y-1">
                    <p className="text-xs text-white/75">Estimated ROAS / Marketing ROI</p>
                    <p className="font-mono-num text-2xl sm:text-3xl font-bold">
                      {roiMetrics.roas.toFixed(1)}x{' '}
                      <span className="text-sm font-semibold text-white/80">
                        ({roiMetrics.roiPercent >= 0 ? '+' : ''}
                        {Math.round(roiMetrics.roiPercent)}%)
                      </span>
                    </p>
                  </div>
                </div>

                {/* Comparison Bar */}
                <div className="rounded-2xl bg-white border border-[#E8E8ED] p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#1D1D1F]">
                    <span className="inline-flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4 text-[#0071E3]" aria-hidden="true" />
                      <span>Spend vs. Estimated Revenue Ratio</span>
                    </span>
                    <span className="font-mono-num">{roiMetrics.roas.toFixed(2)}x ROAS</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[#6E6E73]">
                        <span>Ad Spend</span>
                        <span className="font-mono-num text-[#1D1D1F]">{formatInr(roiMetrics.adSpend)}</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-[#ECECF0] overflow-hidden">
                        <div
                          className="h-full bg-[#6E6E73] rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(
                                4,
                                Math.round(
                                  (roiMetrics.adSpend /
                                    Math.max(1, roiMetrics.estimatedRevenue, roiMetrics.adSpend)) *
                                    100
                                )
                              )
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[#6E6E73]">
                        <span>Estimated Revenue</span>
                        <span className="font-mono-num text-[#1D1D1F]">
                          {formatInr(roiMetrics.estimatedRevenue)}
                        </span>
                      </div>
                      <div className="h-2.5 rounded-full bg-[#ECECF0] overflow-hidden">
                        <div
                          className="h-full bg-[#0071E3] rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(
                                4,
                                Math.round(
                                  (roiMetrics.estimatedRevenue /
                                    Math.max(1, roiMetrics.estimatedRevenue, roiMetrics.adSpend)) *
                                    100
                                )
                              )
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED] p-4 flex items-start gap-2.5 text-xs text-[#6E6E73]">
                  <Info className="w-4 h-4 text-[#1D1D1F] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <strong className="text-[#1D1D1F]">Estimates only:</strong> These numbers illustrate mathematical projections from your entered inputs and are not guaranteed advertising results. Actual outcomes depend on offer competitiveness, market pricing, and sales follow-up discipline.
                  </span>
                </div>

                <GlassButton
                  variant="primary"
                  size="md"
                  onClick={() =>
                    openEnquiryPrefilled(
                      'Package A — Full-Service Growth Marketing & Lead Management',
                      `ROI Model Inputs — Monthly Ad Budget: ${formatInr(roiBudget)}, Avg Customer Value: ${formatInr(avgCustomerValue)}, Expected Leads: ${expectedLeads}, Conversion Rate: ${leadConversionRate}%. Requesting campaign feasibility review.`
                    )
                  }
                >
                  <span>Discuss Campaign Strategy</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </GlassButton>
              </div>
            </div>
          )}

          {/* B. MARKETING BUDGET PLANNER */}
          {activeTab === 'budget' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#6E6E73]">
                    Widget B · Channel Allocation
                  </p>
                  <h3 className="font-display text-2xl font-bold text-[#1D1D1F]">
                    Marketing Budget Planner
                  </h3>
                  <p className="text-sm text-[#6E6E73]">
                    Enter your total monthly marketing budget and customize the allocation percentages across search, social, SEO, content, and web conversion.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="planner-total" className="block text-xs font-semibold text-[#1D1D1F]">
                    Monthly Marketing Budget (INR)
                  </label>
                  <input
                    id="planner-total"
                    type="number"
                    min={5000}
                    max={50000000}
                    step={2500}
                    value={monthlyBudgetInput}
                    onChange={(e) => setMonthlyBudgetInput(Math.max(0, Number(e.target.value) || 0))}
                    className={`${inputCls} font-mono-num`}
                  />
                </div>

                <div className="space-y-4">
                  {DEFAULT_BUDGET_CHANNELS.map((ch) => (
                    <div key={ch.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#1D1D1F]">
                        <label htmlFor={`alloc-${ch.id}`}>{ch.label}</label>
                        <span className="font-mono-num">
                          {allocations[ch.id]}% ·{' '}
                          {formatInr((monthlyBudgetInput * allocations[ch.id]) / 100)}
                        </span>
                      </div>
                      <input
                        id={`alloc-${ch.id}`}
                        type="range"
                        min={0}
                        max={80}
                        step={5}
                        value={allocations[ch.id]}
                        onChange={(e) =>
                          setAllocations((prev) => ({
                            ...prev,
                            [ch.id]: Number(e.target.value),
                          }))
                        }
                        className="w-full accent-[#0071E3] cursor-pointer"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={normalizeBudgetTo100}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E8E8ED] text-xs font-semibold text-[#1D1D1F] hover:border-[#1D1D1F] cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Auto-Balance to 100%</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setAllocations({
                        googleAds: 25,
                        metaAds: 35,
                        seo: 15,
                        content: 15,
                        webLanding: 10,
                      })
                    }
                    className="text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
                  >
                    Reset Suggested Split
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-5">
                <div className="rounded-2xl bg-white border border-[#E8E8ED] p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E8E8ED] pb-3">
                    <div>
                      <p className="text-xs text-[#6E6E73]">Monthly Breakdown</p>
                      <p className="font-mono-num text-2xl font-bold text-[#1D1D1F]">
                        {formatInr(monthlyBudgetInput)}
                      </p>
                    </div>
                    <span
                      className={`font-mono-num text-xs font-bold px-3 py-1 rounded-lg ${
                        totalAllocationPct === 100
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      Total: {totalAllocationPct}%
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    {DEFAULT_BUDGET_CHANNELS.map((ch) => {
                      const pct = allocations[ch.id];
                      const amount = (monthlyBudgetInput * pct) / 100;
                      return (
                        <div key={ch.id} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-[#1D1D1F]">{ch.label}</span>
                            <span className="font-mono-num font-bold text-[#1D1D1F]">
                              {formatInr(amount)} ({pct}%)
                            </span>
                          </div>
                          <div className="h-2.5 rounded-full bg-[#ECECF0] overflow-hidden">
                            <div
                              className="h-full bg-[#1D1D1F] rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(100, pct)}%` }}
                            />
                          </div>
                          <p className="text-[11px] text-[#6E6E73]">{ch.note}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {totalAllocationPct !== 100 && (
                  <p className="text-xs font-medium text-amber-800">
                    Current channel split sums to {totalAllocationPct}%. Click “Auto-Balance to 100%” to normalize proportionally.
                  </p>
                )}

                <GlassButton
                  variant="primary"
                  size="md"
                  onClick={() =>
                    openEnquiryPrefilled(
                      'Digital Marketing Budget Proposal',
                      `Planned Monthly Budget: ${formatInr(monthlyBudgetInput)} | Split — Google Ads: ${allocations.googleAds}%, Meta Ads: ${allocations.metaAds}%, SEO: ${allocations.seo}%, Content Marketing: ${allocations.content}%, Website & Landing Pages: ${allocations.webLanding}%.`
                    )
                  }
                >
                  <span>Request Channel Plan Review</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </GlassButton>
              </div>
            </div>
          )}

          {/* C. BUSINESS GROWTH ASSESSMENT */}
          {activeTab === 'assessment' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-5">
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#6E6E73]">
                    Widget C · 6-Question Diagnostic
                  </p>
                  <h3 className="font-display text-2xl font-bold text-[#1D1D1F]">
                    Business Growth Assessment
                  </h3>
                  <p className="text-sm text-[#6E6E73]">
                    Answer six quick operational questions to generate a tailored AKYIN growth recommendation.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ga-type" className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                      1. Business Type
                    </label>
                    <select
                      id="ga-type"
                      value={assessBusinessType}
                      onChange={(e) => setAssessBusinessType(e.target.value)}
                      className={inputCls}
                    >
                      <option>Retail / D2C Brand</option>
                      <option>Automotive Dealership</option>
                      <option>B2B / Trading &amp; Distribution</option>
                      <option>Cosmetics &amp; Consumer Products</option>
                      <option>Local Services / Clinic / Real Estate</option>
                      <option>Early-Stage Startup</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="ga-location" className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                      2. Primary Market Location
                    </label>
                    <select
                      id="ga-location"
                      value={assessLocation}
                      onChange={(e) => setAssessLocation(e.target.value)}
                      className={inputCls}
                    >
                      <option value="India">India</option>
                      <option value="UAE">UAE</option>
                      <option value="India & UAE">India &amp; UAE</option>
                      <option value="International">Other / International</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="ga-web" className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                      3. Currently has a website?
                    </label>
                    <select
                      id="ga-web"
                      value={assessHasWebsite}
                      onChange={(e) => setAssessHasWebsite(e.target.value as 'yes' | 'no' | 'outdated')}
                      className={inputCls}
                    >
                      <option value="yes">Yes — active &amp; conversion ready</option>
                      <option value="outdated">Yes — needs refresh / landing pages</option>
                      <option value="no">No website yet</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="ga-ads" className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                      4. Currently running paid ads?
                    </label>
                    <select
                      id="ga-ads"
                      value={assessRunningAds}
                      onChange={(e) => setAssessRunningAds(e.target.value as 'yes' | 'no')}
                      className={inputCls}
                    >
                      <option value="yes">Yes — running Meta or Google Ads</option>
                      <option value="no">No paid campaigns currently</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="ga-enq" className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                      5. Receiving regular customer enquiries?
                    </label>
                    <select
                      id="ga-enq"
                      value={assessRegularEnquiries}
                      onChange={(e) =>
                        setAssessRegularEnquiries(e.target.value as 'yes' | 'inconsistent' | 'no')
                      }
                      className={inputCls}
                    >
                      <option value="yes">Yes — consistent daily flow</option>
                      <option value="inconsistent">Inconsistent / seasonal spikes</option>
                      <option value="no">Very few inbound enquiries</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="ga-challenge" className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                      6. Biggest growth challenge
                    </label>
                    <select
                      id="ga-challenge"
                      value={assessChallenge}
                      onChange={(e) => setAssessChallenge(e.target.value)}
                      className={inputCls}
                    >
                      <option>Generating consistent qualified leads</option>
                      <option>Filtering cold enquiries &amp; improving sales conversion</option>
                      <option>Building brand credibility &amp; creative quality</option>
                      <option>Structuring strategy before scaling spend</option>
                    </select>
                  </div>
                </div>

                <GlassButton
                  variant="primary"
                  size="md"
                  onClick={() => setAssessSubmitted(true)}
                >
                  <span>Generate Assessment Summary</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </GlassButton>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl bg-white border border-[#E8E8ED] p-6 space-y-4">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#0071E3]">
                      {assessSubmitted ? 'Tailored Assessment Brief' : 'Live Diagnostic Preview'}
                    </p>
                    <h4 className="font-display text-xl font-bold text-[#1D1D1F]">
                      {assessmentSummary.readinessStage}
                    </h4>
                    <p className="text-xs text-[#6E6E73]">
                      {assessBusinessType} · {assessLocation}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#E8E8ED]">
                    <p className="text-xs font-semibold text-[#1D1D1F]">
                      Recommended Next Priorities
                    </p>
                    <ul className="space-y-2 text-xs sm:text-sm text-[#1D1D1F]">
                      {assessmentSummary.recommendations.map((rec) => (
                        <li key={rec} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#0071E3] shrink-0 mt-0.5" aria-hidden="true" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 flex flex-wrap gap-3">
                    <GlassButton
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        openEnquiryPrefilled(
                          assessmentSummary.recommendations[0] || 'Business Growth Assessment',
                          `Growth Assessment Summary (${assessmentSummary.readinessStage}): ${assessmentSummary.summaryText}`
                        )
                      }
                    >
                      <span>Send Assessment Enquiry</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </GlassButton>
                    <button
                      type="button"
                      onClick={() => onTabChange('booking')}
                      className="text-xs font-semibold text-[#1D1D1F] hover:underline cursor-pointer"
                    >
                      Or book 1-on-1 advisory
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* D. SERVICE FINDER */}
          {activeTab === 'finder' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6 space-y-4">
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#6E6E73]">
                    Widget D · Guided Matching
                  </p>
                  <h3 className="font-display text-2xl font-bold text-[#1D1D1F]">
                    AKYIN Service Finder
                  </h3>
                  <p className="text-sm text-[#6E6E73]">
                    Select your primary business goal to identify the exact AKYIN service division and scope.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SERVICE_FINDER_OPTIONS.map((option) => {
                    const selected = option.id === selectedServiceFinder.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedServiceFinder(option)}
                        className={`text-left rounded-xl px-4 py-3 border transition-all cursor-pointer ${
                          selected
                            ? 'bg-[#1D1D1F] text-white border-[#1D1D1F] shadow-xs'
                            : 'bg-white text-[#1D1D1F] border-[#E8E8ED] hover:border-[#1D1D1F]/40'
                        }`}
                      >
                        <p className="text-xs sm:text-sm font-bold">{option.label}</p>
                        <p
                          className={`text-[11px] mt-0.5 line-clamp-1 ${
                            selected ? 'text-white/75' : 'text-[#6E6E73]'
                          }`}
                        >
                          {option.tagline}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="rounded-2xl bg-white border border-[#E8E8ED] p-6 sm:p-7 space-y-5">
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#0071E3]">
                      {selectedServiceFinder.recommendedDivision}
                    </p>
                    <h4 className="font-display text-2xl font-bold text-[#1D1D1F]">
                      {selectedServiceFinder.label}
                    </h4>
                    <p className="text-sm text-[#6E6E73] leading-relaxed">
                      {selectedServiceFinder.outcomeSummary}
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-[#E8E8ED]">
                    <p className="text-xs font-semibold text-[#1D1D1F]">Key Scope &amp; Deliverables</p>
                    <ul className="space-y-2 text-xs sm:text-sm text-[#1D1D1F]">
                      {selectedServiceFinder.includedCapabilities.map((cap) => (
                        <li key={cap} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#1D1D1F] shrink-0 mt-0.5" aria-hidden="true" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <GlassButton
                      variant="primary"
                      size="md"
                      onClick={() =>
                        openEnquiryPrefilled(
                          selectedServiceFinder.enquiryServiceValue,
                          `Service Finder Selection: ${selectedServiceFinder.label} (${selectedServiceFinder.recommendedDivision})`
                        )
                      }
                    >
                      <span>Request Proposal</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </GlassButton>
                    <GlassButton
                      variant="glass"
                      size="md"
                      onClick={() => onNavigate(selectedServiceFinder.route)}
                    >
                      <span>{selectedServiceFinder.ctaLabel}</span>
                    </GlassButton>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* E. LEAD ENQUIRY WIDGET (Server-side validation, zero localStorage PII) */}
          {activeTab === 'enquiry' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#0071E3]">
                  Widget E · Server-Validated Direct Enquiry
                </p>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#1D1D1F]">
                  Submit Your Business Requirement.
                </h3>
                <p className="text-sm text-[#6E6E73] leading-relaxed">
                  Your enquiry is validated server-side and routed directly to the AKYIN Ventures advisory and marketing team—never sold to lead brokers or persisted in browser local storage.
                </p>
                <div className="rounded-2xl bg-white border border-[#E8E8ED] p-5 space-y-2 text-xs text-[#6E6E73]">
                  <p className="font-semibold text-[#1D1D1F]">Direct Contact Desk</p>
                  <p>Email: <span className="font-semibold text-[#1D1D1F]">{OFFICIAL_CONTACT.email}</span></p>
                  <p>Phone: <span className="font-mono-num font-semibold text-[#1D1D1F]">{OFFICIAL_CONTACT.phoneDisplay}</span></p>
                  <p>Service Regions: <span className="font-semibold text-[#1D1D1F]">{OFFICIAL_CONTACT.regionIndicator}</span></p>
                </div>
              </div>

              <div className="lg:col-span-7">
                {leadSuccess ? (
                  <div className="rounded-2xl bg-white border border-emerald-200 p-6 sm:p-8 space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                      <div className="space-y-1">
                        <h4 className="font-display text-xl font-bold text-[#1D1D1F]">
                          Enquiry Recorded Successfully
                        </h4>
                        <p className="font-mono-num text-xs text-[#6E6E73]">
                          Reference ID: {leadSuccess.leadId}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-[#6E6E73] leading-relaxed">
                      Thank you, <strong className="text-[#1D1D1F]">{fullName}</strong>. Our team will review your brief for{' '}
                      <strong className="text-[#1D1D1F]">{requiredService}</strong> and respond via email or phone.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <GlassButton variant="primary" size="sm" onClick={resetLeadForm}>
                        Submit Another Enquiry
                      </GlassButton>
                      <button
                        type="button"
                        onClick={() => onTabChange('booking')}
                        className="text-xs font-semibold text-[#0071E3] hover:underline cursor-pointer"
                      >
                        Schedule 1-on-1 Advisory Slot
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} noValidate className="space-y-4">
                    <div className="sr-only" aria-hidden="true">
                      <label htmlFor="lead-widget-hp">Website</label>
                      <input
                        id="lead-widget-hp"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="lw-name" className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                          Full Name *
                        </label>
                        <input
                          id="lw-name"
                          type="text"
                          required
                          maxLength={100}
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Your full name"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label htmlFor="lw-business" className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                          Business Name *
                        </label>
                        <input
                          id="lw-business"
                          type="text"
                          required
                          maxLength={120}
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="Company or brand name"
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="lw-mobile" className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                          Mobile Number *
                        </label>
                        <input
                          id="lw-mobile"
                          type="tel"
                          required
                          maxLength={28}
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          placeholder="+91 98XXX XXXXX or +971..."
                          className={`${inputCls} font-mono-num`}
                        />
                      </div>
                      <div>
                        <label htmlFor="lw-email" className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                          Email *
                        </label>
                        <input
                          id="lw-email"
                          type="email"
                          required
                          maxLength={160}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@company.com"
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="lw-city" className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                          City *
                        </label>
                        <input
                          id="lw-city"
                          type="text"
                          required
                          maxLength={80}
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Mumbai, Bengaluru, Dubai"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label htmlFor="lw-country" className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                          Country *
                        </label>
                        <select
                          id="lw-country"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className={inputCls}
                        >
                          <option value="India">India</option>
                          <option value="UAE">UAE</option>
                          <option value="India & UAE">India &amp; UAE</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="United States">United States</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="lw-service" className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                          Required Service *
                        </label>
                        <select
                          id="lw-service"
                          value={requiredService}
                          onChange={(e) => setRequiredService(e.target.value)}
                          className={inputCls}
                        >
                          {SERVICE_FINDER_OPTIONS.map((opt) => (
                            <option key={opt.id} value={opt.enquiryServiceValue}>
                              {opt.label}
                            </option>
                          ))}
                          <option value="Package A — Full-Service Growth Marketing & Lead Management">
                            Package A — Complete Growth Marketing
                          </option>
                          <option value="Package B — Lead Filtering & Qualification Only">
                            Package B — Lead Filtering Only
                          </option>
                          <option value="Digital Marketing Budget Proposal">
                            Digital Marketing Budget Proposal
                          </option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="lw-budget" className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                          Monthly Marketing Budget *
                        </label>
                        <select
                          id="lw-budget"
                          value={monthlyMarketingBudget}
                          onChange={(e) => setMonthlyMarketingBudget(e.target.value)}
                          className={inputCls}
                        >
                          <option value="Under ₹25,000 / month">Under ₹25,000 / month</option>
                          <option value="₹25,000 – ₹75,000 / month">₹25,000 – ₹75,000 / month</option>
                          <option value="₹75,000 – ₹2,00,000 / month">₹75,000 – ₹2,00,000 / month</option>
                          <option value="₹2,00,000+ / month">₹2,00,000+ / month</option>
                          <option value="One-Time Project / Advisory">One-Time Project / Advisory</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="lw-message" className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                        Message *
                      </label>
                      <textarea
                        id="lw-message"
                        rows={3}
                        required
                        maxLength={1500}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Briefly describe your goals, timeline, and current sales setup..."
                        className={`${inputCls} resize-none`}
                      />
                    </div>

                    <div className="flex items-start gap-2.5 pt-1">
                      <input
                        id="lw-consent"
                        type="checkbox"
                        checked={consentAccepted}
                        onChange={(e) => setConsentAccepted(e.target.checked)}
                        className="mt-1 w-4 h-4 accent-[#1D1D1F] cursor-pointer"
                      />
                      <label htmlFor="lw-consent" className="text-xs text-[#6E6E73] leading-relaxed cursor-pointer">
                        I agree to share these details directly with AKYIN Ventures for enquiry response in accordance with the{' '}
                        <button
                          type="button"
                          onClick={() => onNavigate('/privacy')}
                          className="font-semibold text-[#1D1D1F] underline cursor-pointer"
                        >
                          Privacy Policy
                        </button>
                        .
                      </label>
                    </div>

                    {leadError && (
                      <p role="alert" className="text-xs font-semibold text-[#D92D20]">
                        {leadError}
                      </p>
                    )}

                    <div className="pt-1">
                      <GlassButton
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={leadSubmitting}
                      >
                        <Send className="w-4 h-4" aria-hidden="true" />
                        <span>{leadSubmitting ? 'Submitting...' : 'Submit Validated Enquiry'}</span>
                      </GlassButton>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* F. CONSULTATION BOOKING WIDGET (Integrates existing AdvisoryBookingForm directly) */}
          {activeTab === 'booking' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E8ED] pb-5">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#0071E3]">
                    Widget F · Live IST Appointment Calendar
                  </p>
                  <h3 className="font-display text-2xl font-bold text-[#1D1D1F]">
                    Book a 1-on-1 Business Advisory Consultation
                  </h3>
                  <p className="text-sm text-[#6E6E73]">
                    Real-time availability from the AKYIN advisory schedule (Asia/Kolkata IST).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('/advisory')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D1D1F] hover:underline whitespace-nowrap cursor-pointer"
                >
                  <span>Open Full Advisory Page</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
              <AdvisoryBookingForm />
            </div>
          )}
        </GlassPanel>
      </div>
    </section>
  );
}
