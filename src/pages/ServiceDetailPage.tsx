import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileCheck2,
  Layers,
  Mail,
  MessageCircle,
  RefreshCw,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { AppRoute, OFFICIAL_CONTACT } from '../data/akyinData';
import { PaymentSku } from '../data/paymentCatalog';
import { ServiceCategoryRecord, SuiteServiceItem, suiteApi } from '../services/suiteApi';
import { sanitizeHref } from '../utils/security';
import { RazorpayCheckoutButton } from '../components/RazorpayCheckoutButton';
import { ServiceBillingDisclaimer } from '../components/ServiceBillingDisclaimer';
import { GlassButton, GlassCard } from '../components/liquid-glass';

interface ServiceDetailPageProps {
  slug: string;
  onNavigate: (route: AppRoute) => void;
}

const SERVICE_PAYMENT_SKU_MAP: Record<string, PaymentSku> = {
  'srv-bulk-sms': 'bulk-sms-starter',
  'srv-whatsapp-messaging': 'whatsapp-business-setup',
  'srv-consulting': 'advisory-session',
  'srv-sales-training': 'sales-training',
  'srv-personality': 'sales-training',
  'srv-automotive': 'sales-training',
  'srv-digital-marketing': 'growth-marketing-setup',
  'srv-lead-gen': 'lead-filtering-setup',
};

function formatInr(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function ServiceDetailPage({ slug, onNavigate }: ServiceDetailPageProps) {
  const shouldReduceMotion = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [service, setService] = useState<SuiteServiceItem | null>(null);
  const [categoryRecord, setCategoryRecord] = useState<ServiceCategoryRecord | null>(null);
  const [relatedServices, setRelatedServices] = useState<SuiteServiceItem[]>([]);

  // Inline enquiry form state
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');
  const [monthlyMarketingBudget, setMonthlyMarketingBudget] = useState('Custom Quote / Standalone');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setErrorMsg('');
    setSubmittedLeadId(null);
    setFormError('');

    suiteApi
      .fetchPublicServiceBySlug(slug)
      .then((res) => {
        if (!active) return;
        setService(res.service);
        setCategoryRecord(res.categoryRecord);
        setRelatedServices(res.relatedServices || []);
        setMessage(
          `Requesting scope, timeline, and formal quotation for standalone service: ${res.service.name} (${res.service.category}).`
        );

        // Sync client-side head metadata dynamically for loaded service
        const pageTitle = `${res.service.name} — ${res.service.category} | AKYIN MARKETINGS`;
        document.title = pageTitle;
        const canonicalUrl = `https://akyin.com/services/${res.service.slug}`;
        document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl);
        document.querySelector('meta[name="description"]')?.setAttribute('content', res.service.description);
        document.querySelector('meta[property="og:title"]')?.setAttribute('content', pageTitle);
        document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonicalUrl);
        document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', pageTitle);
      })
      .catch((err) => {
        if (!active) return;
        setService(null);
        setErrorMsg(err instanceof Error ? err.message : 'Service not found.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  const paymentSku = useMemo(() => {
    if (!service) return null;
    return SERVICE_PAYMENT_SKU_MAP[service.id] || null;
  }, [service]);

  const isBulkSms = service?.id === 'srv-bulk-sms';
  const isWhatsApp = service?.id === 'srv-whatsapp-messaging';
  const isMessagingService = Boolean(isBulkSms || isWhatsApp);

  const oneTimeFee = service ? (service.oneTimePrice || service.setupFee || 0) : 0;
  const monthlyFee = service ? (service.monthlyPrice || service.recurringFee || 0) : 0;
  const hasConfiguredPrice = oneTimeFee > 0 || monthlyFee > 0;

  const handleSubmitEnquiry = async (e: FormEvent) => {
    e.preventDefault();
    if (!service) return;
    setFormError('');

    if (!fullName.trim() || !mobileNumber.trim() || !email.trim() || !city.trim() || !message.trim()) {
      setFormError('Please fill in your name, phone number, email, city, and requirement notes.');
      return;
    }

    setSubmitting(true);
    try {
      const resp = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          businessName: businessName.trim(),
          mobileNumber: mobileNumber.trim(),
          email: email.trim(),
          city: city.trim(),
          country: country.trim() || 'India',
          businessCategory: service.category,
          requiredService: service.name,
          monthlyMarketingBudget,
          preferredContactMethod: 'Phone / WhatsApp / Email',
          message: message.trim(),
          consentAccepted: true,
          honeypot: '',
          source: `/services/${service.slug}`,
          campaignSource: 'Service Detail Page',
        }),
      });
      const data = (await resp.json().catch(() => ({}))) as { leadId?: string; error?: string };
      if (!resp.ok) {
        throw new Error(data.error || 'Unable to submit enquiry right now.');
      }
      setSubmittedLeadId(data.leadId || 'RECEIVED');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 space-y-6">
        <div className="h-5 w-44 rounded bg-[#E8E8ED] animate-pulse" />
        <div className="h-12 w-3/4 rounded bg-[#E8E8ED] animate-pulse" />
        <div className="h-5 w-2/3 rounded bg-[#E8E8ED] animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          <div className="lg:col-span-7 h-80 rounded-3xl bg-white/80 border border-[#E8E8ED] animate-pulse" />
          <div className="lg:col-span-5 h-80 rounded-3xl bg-white/80 border border-[#E8E8ED] animate-pulse" />
        </div>
      </div>
    );
  }

  if (!service || errorMsg) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6E73]">
          Service Catalogue
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1D1D1F]">
          Standalone Service Not Found
        </h1>
        <p className="text-sm sm:text-base text-[#6E6E73]">
          The requested service page (<span className="font-mono-num">/services/{slug}</span>) is unavailable or archived. Explore all 10 active service categories below.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <GlassButton variant="primary" size="md" onClick={() => onNavigate('/ventures/marketing')}>
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Browse All 10 Categories</span>
          </GlassButton>
          <GlassButton variant="glass" size="md" onClick={() => onNavigate('/pricing')}>
            <span>Open Pricing &amp; Quotation Builder</span>
          </GlassButton>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Header */}
        <motion.header
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4 max-w-4xl"
        >
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#6E6E73]">
            <button
              type="button"
              onClick={() => onNavigate('/ventures/marketing')}
              className="inline-flex items-center gap-1.5 text-[#0071E3] hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>All Services</span>
            </button>
            <span aria-hidden="true">·</span>
            <span>{service.category}</span>
            <span aria-hidden="true">·</span>
            <span>Standalone Service</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-[46px] font-bold tracking-tight text-[#1D1D1F] leading-[1.1]">
            {service.name}
          </h1>

          <p className="text-base sm:text-lg text-[#4A4A4F] leading-relaxed">
            {service.description}
          </p>

          {categoryRecord?.description && (
            <p className="text-xs text-[#6E6E73]">
              Category scope: {categoryRecord.description}
            </p>
          )}
        </motion.header>

        {/* Main 2-Column Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Benefits, Deliverables, Process */}
          <div className="lg:col-span-7 space-y-6">
            {service.benefits && service.benefits.length > 0 && (
              <GlassCard className="p-6 sm:p-7 space-y-4">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#0071E3]" aria-hidden="true" />
                  <h2 className="font-display text-xl font-bold text-[#1D1D1F]">
                    Key Business Benefits
                  </h2>
                </div>
                <ul className="space-y-3">
                  {service.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-[#3A3A3F] leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[#0071E3] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            )}

            <GlassCard className="p-6 sm:p-7 space-y-4">
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="w-5 h-5 text-[#1D1D1F]" aria-hidden="true" />
                <h2 className="font-display text-xl font-bold text-[#1D1D1F]">
                  Included Deliverables
                </h2>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(service.deliverables || []).map((item, idx) => (
                  <li
                    key={idx}
                    className="rounded-xl border border-[#E8E8ED] bg-[#F5F5F7]/70 px-3.5 py-2.5 text-sm text-[#1D1D1F] flex items-start gap-2.5"
                  >
                    <span className="font-mono-num text-[11px] font-bold text-[#6E6E73] mt-0.5">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>

            {service.workProcess && service.workProcess.length > 0 && (
              <GlassCard className="p-6 sm:p-7 space-y-4">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-5 h-5 text-[#1D1D1F]" aria-hidden="true" />
                  <h2 className="font-display text-xl font-bold text-[#1D1D1F]">
                    Execution Workflow
                  </h2>
                </div>
                <ol className="space-y-3.5">
                  {service.workProcess.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3.5 text-sm text-[#3A3A3F]">
                      <span className="w-6 h-6 rounded-lg bg-[#1D1D1F] text-white font-mono-num text-xs font-bold inline-flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="pt-0.5 leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </GlassCard>
            )}

            <GlassCard className="p-5 bg-white/75 space-y-2 text-xs text-[#4A4A4F]">
              <p className="font-semibold text-[#1D1D1F]">
                100% Standalone Commercial Guarantee
              </p>
              <p className="leading-relaxed">
                This service is commissioned independently with no mandatory bundles or combined contracts. If your campaign includes paid media spend (Meta Ads or Google Ads), platform ad budgets are paid directly by you to the ad platform.
              </p>
            </GlassCard>
          </div>

          {/* Right Column: Pricing Card + Checkout + Inline Enquiry */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard className="p-6 sm:p-7 space-y-5 border-[#1D1D1F]/15">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6E6E73]">
                  Standalone Commercial Rate
                </p>
                {isBulkSms ? (
                  <div className="space-y-1.5 pt-1">
                    <p className="font-mono-num text-3xl font-bold text-[#1D1D1F]">
                      {formatInr(service.packagePrice || service.oneTimePrice || 3000)}
                    </p>
                    <p className="text-xs text-[#4A4A4F]">
                      Includes <strong className="text-[#1D1D1F]">{(service.smsPackageCredits || service.includedUnits || 10000).toLocaleString('en-IN')} SMS credits</strong> · Effective rate{' '}
                      <strong className="font-mono-num text-[#1D1D1F]">
                        ₹{(service.smsRatePerCredit ?? service.unitRate ?? 0.3).toFixed(2)}/SMS
                      </strong>{' '}
                      (extra credits configurable by admin).
                    </p>
                  </div>
                ) : isWhatsApp ? (
                  <div className="space-y-2 pt-1">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] p-3">
                        <p className="text-[11px] text-[#6E6E73] font-medium">One-Time Setup Fee</p>
                        <p className="font-mono-num text-xl font-bold text-[#1D1D1F] mt-0.5">
                          {formatInr(service.whatsappSetupFee || service.setupFee || 4999)}
                        </p>
                      </div>
                      <div className="rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] p-3">
                        <p className="text-[11px] text-[#6E6E73] font-medium">Per-Message Usage</p>
                        <p className="font-mono-num text-xl font-bold text-[#1D1D1F] mt-0.5">
                          ₹{(service.whatsappPerMessageRate ?? service.unitRate ?? 1.5).toFixed(2)}
                          <span className="text-xs font-normal text-[#6E6E73]">/msg</span>
                        </p>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#6E6E73]">
                      One-time onboarding setup fee is billed strictly separate from per-message usage charges.
                    </p>
                  </div>
                ) : hasConfiguredPrice ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {oneTimeFee > 0 && (
                      <div className="rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] p-3">
                        <p className="text-[11px] text-[#6E6E73] font-medium">One-Time / Project</p>
                        <p className="font-mono-num text-2xl font-bold text-[#1D1D1F] mt-0.5">
                          {formatInr(oneTimeFee)}
                        </p>
                      </div>
                    )}
                    {monthlyFee > 0 && (
                      <div className="rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] p-3">
                        <p className="text-[11px] text-[#6E6E73] font-medium">Monthly Option</p>
                        <p className="font-mono-num text-2xl font-bold text-[#1D1D1F] mt-0.5">
                          {formatInr(monthlyFee)}
                          <span className="text-xs font-normal text-[#6E6E73]">/mo</span>
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="pt-1">
                    <p className="font-display text-2xl font-bold text-[#1D1D1F]">
                      Custom Quote on Request
                    </p>
                    <p className="text-xs text-[#6E6E73] mt-1">
                      Scoped specifically around your channel mix, deliverable count, and geography.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2 border-t border-[#E8E8ED] pt-4 text-xs text-[#4A4A4F]">
                {service.deliveryPeriod && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[#6E6E73]">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      Turnaround / Duration
                    </span>
                    <span className="font-semibold text-[#1D1D1F] text-right">{service.deliveryPeriod}</span>
                  </div>
                )}
                {service.revisionLimit && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[#6E6E73]">
                      <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                      Revisions Included
                    </span>
                    <span className="font-semibold text-[#1D1D1F] text-right">
                      {String(service.revisionLimit)}
                    </span>
                  </div>
                )}
                {typeof service.additionalDeliverableCharge === 'number' &&
                  service.additionalDeliverableCharge > 0 && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[#6E6E73]">Additional Deliverable</span>
                      <span className="font-mono-num font-semibold text-[#1D1D1F]">
                        {formatInr(service.additionalDeliverableCharge)}
                      </span>
                    </div>
                  )}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#6E6E73]">GST Treatment</span>
                  <span className="font-semibold text-[#1D1D1F]">
                    {service.gstEnabled ? `${service.gstRate}% GST applicable extra` : 'Per invoice schedule'}
                  </span>
                </div>
              </div>

              {isMessagingService && (
                <ServiceBillingDisclaimer variant="full" showSeparationNote />
              )}

              <div className="space-y-3 pt-1">
                {paymentSku && (
                  <RazorpayCheckoutButton
                    sku={paymentSku}
                    variant="primary"
                    size="md"
                    className="w-full justify-center"
                  />
                )}

                <GlassButton
                  variant={paymentSku ? 'glass' : 'primary'}
                  size="md"
                  className="w-full justify-center"
                  onClick={() => {
                    onNavigate('/pricing');
                    window.setTimeout(() => {
                      document.getElementById('quotation-builder')?.scrollIntoView({ behavior: 'smooth' });
                    }, 120);
                  }}
                >
                  <span>Customize in Quotation Builder</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </GlassButton>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <a
                    href={sanitizeHref(OFFICIAL_CONTACT.whatsappUrl, OFFICIAL_CONTACT.whatsappChannelUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#E8E8ED] bg-white hover:bg-[#F5F5F7] font-semibold text-[#1D1D1F] transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#0071E3]" aria-hidden="true" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`mailto:${OFFICIAL_CONTACT.email}?subject=${encodeURIComponent(`Enquiry: ${service.name}`)}`}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#E8E8ED] bg-white hover:bg-[#F5F5F7] font-semibold text-[#1D1D1F] transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#1D1D1F]" aria-hidden="true" />
                    <span>Email Desk</span>
                  </a>
                </div>
              </div>
            </GlassCard>

            {/* Inline Service Enquiry Form */}
            <GlassCard className="p-6 sm:p-7 space-y-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6E6E73]">
                  Direct Enquiry
                </p>
                <h2 className="font-display text-lg font-bold text-[#1D1D1F] mt-0.5">
                  Request Proposal for {service.name}
                </h2>
              </div>

              {submittedLeadId ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 space-y-2 text-xs text-emerald-900">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
                    <span>Enquiry Submitted Successfully</span>
                  </div>
                  <p>
                    Reference <span className="font-mono-num font-bold">{submittedLeadId}</span> has been logged for{' '}
                    <strong>{service.name}</strong>. Our desk responds promptly via phone, WhatsApp, or email.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitEnquiry} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="sd-name" className="block font-semibold text-[#1D1D1F] mb-1">
                        Full Name *
                      </label>
                      <input
                        id="sd-name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full rounded-xl border border-[#D2D2D7] bg-white px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                      />
                    </div>
                    <div>
                      <label htmlFor="sd-phone" className="block font-semibold text-[#1D1D1F] mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        id="sd-phone"
                        type="tel"
                        required
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="+91 98..."
                        className="w-full rounded-xl border border-[#D2D2D7] bg-white px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="sd-email" className="block font-semibold text-[#1D1D1F] mb-1">
                        Email *
                      </label>
                      <input
                        id="sd-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full rounded-xl border border-[#D2D2D7] bg-white px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                      />
                    </div>
                    <div>
                      <label htmlFor="sd-business" className="block font-semibold text-[#1D1D1F] mb-1">
                        Business / Dealership
                      </label>
                      <input
                        id="sd-business"
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Company name"
                        className="w-full rounded-xl border border-[#D2D2D7] bg-white px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="sd-city" className="block font-semibold text-[#1D1D1F] mb-1">
                        City *
                      </label>
                      <input
                        id="sd-city"
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Hyderabad / Dubai / ..."
                        className="w-full rounded-xl border border-[#D2D2D7] bg-white px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                      />
                    </div>
                    <div>
                      <label htmlFor="sd-country" className="block font-semibold text-[#1D1D1F] mb-1">
                        Country
                      </label>
                      <select
                        id="sd-country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full rounded-xl border border-[#D2D2D7] bg-white px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                      >
                        <option value="India">India</option>
                        <option value="UAE">UAE</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="sd-budget" className="block font-semibold text-[#1D1D1F] mb-1">
                      Preferred Engagement Model
                    </label>
                    <select
                      id="sd-budget"
                      value={monthlyMarketingBudget}
                      onChange={(e) => setMonthlyMarketingBudget(e.target.value)}
                      className="w-full rounded-xl border border-[#D2D2D7] bg-white px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                    >
                      <option value="Custom Quote / Standalone">Standalone One-Time / Custom Quote</option>
                      <option value="Under ₹25,000 / month">Monthly Retainer · Under ₹25,000</option>
                      <option value="₹25,000 – ₹75,000 / month">Monthly Retainer · ₹25,000 – ₹75,000</option>
                      <option value="₹75,000+ / month">Monthly Retainer · ₹75,000+</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="sd-message" className="block font-semibold text-[#1D1D1F] mb-1">
                      Project Brief *
                    </label>
                    <textarea
                      id="sd-message"
                      rows={3}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full rounded-xl border border-[#D2D2D7] bg-white px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                    />
                  </div>

                  {formError && (
                    <p role="alert" className="text-xs font-medium text-[#B42318]">
                      {formError}
                    </p>
                  )}

                  <GlassButton
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={submitting}
                    className="w-full justify-center"
                  >
                    <Send className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{submitting ? 'Submitting...' : 'Submit Standalone Enquiry'}</span>
                  </GlassButton>
                </form>
              )}
            </GlassCard>
          </div>
        </div>

        {/* Related Services in Same Category */}
        {relatedServices.length > 0 && (
          <section className="pt-8 border-t border-[#E8E8ED] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6E6E73]">
                  More in {service.category}
                </p>
                <h2 className="font-display text-2xl font-bold text-[#1D1D1F]">
                  Related Standalone Services
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('/ventures/marketing')}
                className="text-xs font-semibold text-[#0071E3] hover:underline self-start sm:self-auto cursor-pointer"
              >
                Explore All 10 Categories &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedServices.map((rel) => {
                const relOneTime = rel.oneTimePrice || rel.setupFee || 0;
                const relMonthly = rel.monthlyPrice || rel.recurringFee || 0;
                const relPriceLabel =
                  rel.id === 'srv-bulk-sms'
                    ? '₹3,000 / 10,000 SMS'
                    : rel.id === 'srv-whatsapp-messaging'
                      ? '₹4,999 Setup (+ ₹1.50/msg)'
                      : relMonthly > 0
                        ? `${formatInr(relMonthly)}/mo`
                        : relOneTime > 0
                          ? formatInr(relOneTime)
                          : 'Custom Quote';

                return (
                  <GlassCard key={rel.id} className="p-5 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-[11px] font-medium text-[#6E6E73]">
                        {rel.category} · {relPriceLabel}
                      </p>
                      <h3 className="font-display text-lg font-bold text-[#1D1D1F] leading-snug">
                        {rel.name}
                      </h3>
                      <p className="text-xs text-[#4A4A4F] line-clamp-3 leading-relaxed">
                        {rel.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#E8E8ED] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => onNavigate(`/services/${rel.slug}` as AppRoute)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0071E3] hover:underline cursor-pointer"
                      >
                        <span>View Service Details</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate('/pricing');
                          window.setTimeout(() => {
                            document
                              .getElementById('quotation-builder')
                              ?.scrollIntoView({ behavior: 'smooth' });
                          }, 120);
                        }}
                        className="text-[11px] font-medium text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
                      >
                        Get Quote
                      </button>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
