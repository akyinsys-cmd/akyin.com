import { useEffect, useRef, useState } from 'react';
import { Check, CheckCircle2, Copy, Mail, MessageCircle, Send } from 'lucide-react';
import {
  BUSINESS_VERTICAL_OPTIONS,
  ENQUIRY_CATEGORIES,
  ENQUIRY_TYPE_OPTIONS,
  OFFICIAL_CONTACT,
} from '../data/akyinData';
import {
  buildEmailDispatchUrl,
  buildFormattedEnquiryText,
  buildWhatsAppDispatchUrl,
  EnquiryPayload,
  FIELD_LIMITS,
  validateEnquiryField,
  validateEnquiryPayload,
} from '../utils/dispatchEnquiry';
import { canTriggerAction, sanitizeHref } from '../utils/security';
import { useSiteConfig } from '../context/SiteConfigContext';
import { submitEnquiryRecord } from '../services/appsScriptClient';
import { GlassButton, GlassPanel } from './liquid-glass';
import { SocialLinks } from './SocialLinks';

interface ContactDispatcherProps {
  defaultCategory?: string;
  defaultVertical?: string;
  defaultEnquiryType?: string;
  defaultMessage?: string;
  sectionId?: string;
  heading?: string;
  subheading?: string;
}

const CATEGORY_TO_VERTICAL: Record<string, string> = {
  'General Business Enquiry': 'AKYIN Ventures (Corporate Group)',
  'Publishing Enquiry': 'Akyin Publishing',
  'Marketing Services Enquiry': 'Akyin Marketing',
  'Retail and Store Enquiry': 'Akyin Store / AKYIN THRIFT',
  'AICalc Enquiry': 'AICalc (aicalc.in)',
  'Kartigo Business Enquiry': 'Kartigo (kartigo.online)',
  'BizNXT Consulting Enquiry': 'BizNXT (biznxt.online)',
  'Budget Bazaar Enquiry': 'Budget Bazaar (budgetbazaar.org)',
  'Partnership Enquiry': 'AKYIN Ventures (Corporate Group)',
};

type ValidatedFieldKey = 'name' | 'company' | 'email' | 'phone' | 'country' | 'city' | 'message';

export function ContactDispatcher({
  defaultCategory = ENQUIRY_CATEGORIES[0],
  defaultVertical = BUSINESS_VERTICAL_OPTIONS[0],
  defaultEnquiryType = ENQUIRY_TYPE_OPTIONS[0],
  defaultMessage = '',
  sectionId = 'contact-form',
  heading = "Let's Start a Conversation.",
  subheading = 'Select your enquiry category and complete the details below to record your enquiry and prepare a structured WhatsApp or Email draft directly to AKYIN Ventures.',
}: ContactDispatcherProps) {
  const [category, setCategory] = useState<string>(defaultCategory);
  const [vertical, setVertical] = useState<string>(defaultVertical);
  const [enquiryType, setEnquiryType] = useState<string>(defaultEnquiryType);

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [message, setMessage] = useState(defaultMessage);
  const [honeypot, setHoneypot] = useState('');

  const { settings } = useSiteConfig();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Partial<Record<ValidatedFieldKey, boolean>>>({});
  const [throttleNotice, setThrottleNotice] = useState('');
  const [dispatchReady, setDispatchReady] = useState(false);
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);
  const [recordedEnquiryId, setRecordedEnquiryId] = useState('');
  const [savedToLiveSheet, setSavedToLiveSheet] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (defaultCategory) {
      setCategory(defaultCategory);
      setDispatchReady(false);
    }
  }, [defaultCategory]);

  useEffect(() => {
    if (defaultVertical) {
      setVertical(defaultVertical);
      setDispatchReady(false);
    }
  }, [defaultVertical]);

  useEffect(() => {
    if (defaultEnquiryType) {
      setEnquiryType(defaultEnquiryType);
      setDispatchReady(false);
    }
  }, [defaultEnquiryType]);

  useEffect(() => {
    if (defaultMessage) {
      setMessage(defaultMessage);
      setDispatchReady(false);
    }
  }, [defaultMessage]);

  const payload: EnquiryPayload = {
    category,
    vertical,
    enquiryType,
    name,
    company,
    email,
    phone,
    country,
    city,
    message,
  };

  const runLiveFieldValidation = (field: ValidatedFieldKey, value: string, forceTouch = false) => {
    const isFieldTouched = forceTouch || Boolean(touched[field]) || Boolean(errors[field]);
    if (forceTouch && !touched[field]) {
      setTouched((prev) => ({ ...prev, [field]: true }));
    }

    const fieldError = validateEnquiryField(field, value);

    if (isFieldTouched || !fieldError) {
      setErrors((prev) => {
        if (!fieldError && !prev[field]) return prev;
        const next = { ...prev };
        if (fieldError) {
          next[field] = fieldError;
        } else {
          delete next[field];
        }
        return next;
      });
    }
  };

  const handleFieldChange = (
    field: ValidatedFieldKey,
    setter: (value: string) => void,
    value: string
  ) => {
    setter(value);
    setDispatchReady(false);
    runLiveFieldValidation(field, value, false);
  };

  const handleFieldBlur = (field: ValidatedFieldKey, value: string) => {
    runLiveFieldValidation(field, value, true);
  };

  const handlePrepareDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setThrottleNotice('');

    if (honeypot.trim().length > 0) {
      setDispatchReady(false);
      return;
    }

    if (!canTriggerAction(`prepare-enquiry-${sectionId}`, 1200)) {
      setThrottleNotice('Please wait a moment before regenerating your enquiry.');
      return;
    }

    setTouched({
      name: true,
      company: true,
      email: true,
      phone: true,
      country: true,
      city: true,
      message: true,
    });

    const validationErrors = validateEnquiryPayload(payload);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setSubmittingEnquiry(true);
      try {
        const res = await submitEnquiryRecord({
          name,
          company,
          phone,
          email,
          city,
          country,
          vertical,
          enquiryType,
          message,
        });
        setRecordedEnquiryId(res.enquiryId);
        setSavedToLiveSheet(res.savedToLiveSheet);
      } catch {
        setRecordedEnquiryId('');
        setSavedToLiveSheet(false);
      } finally {
        setSubmittingEnquiry(false);
      }
      setDispatchReady(true);
    } else {
      setDispatchReady(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildFormattedEnquiryText(payload));
      setCopied(true);
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Direct links remain available
    }
  };

  const displayEmail = settings.contactEmail || OFFICIAL_CONTACT.email;
  const displayPhone = settings.contactPhone || OFFICIAL_CONTACT.phoneDisplay;
  const displayWhatsappNum = settings.whatsappNumber || OFFICIAL_CONTACT.whatsappNumber;
  const whatsappHref = buildWhatsAppDispatchUrl(payload);
  const emailHref = buildEmailDispatchUrl(payload);
  const safeOfficialWhatsapp = sanitizeHref(
    `https://wa.me/${displayWhatsappNum}`,
    OFFICIAL_CONTACT.whatsappUrl
  );
  const safeOfficialMailto = sanitizeHref(`mailto:${displayEmail}`, '#', true);

  const getFieldClass = (field: ValidatedFieldKey, value: string) => {
    const hasError = Boolean(errors[field]);
    const isValidAfterTouch = Boolean(touched[field]) && !hasError && value.trim().length > 0;
    const stateClasses = hasError
      ? 'border-[#D93025] focus:border-[#D93025] focus:ring-2 focus:ring-[#D93025]/20'
      : isValidAfterTouch
        ? 'border-[#1D1D1F]/50 focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/12'
        : 'border-[#E8E8ED] focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/12';
    return `w-full rounded-xl border bg-[#F5F5F7]/65 px-3.5 py-2.5 text-sm text-[#1D1D1F] placeholder:text-[#A1A1A6] transition-all focus:bg-[#FFFFFF] focus:outline-none ${stateClasses}`;
  };

  const isFieldValidIndicator = (field: ValidatedFieldKey, value: string) =>
    Boolean(touched[field]) && !errors[field] && value.trim().length > 0;

  return (
    <section
      id={sectionId}
      className="py-20 lg:py-28 bg-[#F5F5F7] border-t border-[#E8E8ED]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Contact & Social Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-xs font-semibold tracking-wide text-[#6E6E73] mb-2">
                Direct Business &amp; Venture Enquiries
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
                {heading}
              </h2>
              <p className="mt-4 text-base text-[#6E6E73] leading-relaxed">
                {subheading}
              </p>
            </div>

            <GlassPanel className="p-6 sm:p-7 space-y-5">
              <div>
                <p className="text-xs font-medium text-[#6E6E73]">Official Email</p>
                <a
                  href={safeOfficialMailto}
                  className="mt-1 inline-flex items-center gap-2 text-base font-semibold text-[#1D1D1F] hover:underline transition-colors"
                >
                  {displayEmail}
                </a>
              </div>
              <div className="h-px bg-[#1D1D1F]/10" />
              <div>
                <p className="text-xs font-medium text-[#6E6E73]">Official Phone &amp; WhatsApp</p>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <a
                    href={`tel:+${displayWhatsappNum}`}
                    className="inline-flex items-center gap-2 font-mono-num text-base font-semibold text-[#1D1D1F] hover:underline transition-colors"
                  >
                    {displayPhone}
                  </a>
                  <a
                    href={safeOfficialWhatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] underline"
                  >
                    Message on WhatsApp
                  </a>
                </div>
              </div>
              <div className="h-px bg-[#1D1D1F]/10" />
              <div className="space-y-3">
                <p className="text-xs font-medium text-[#6E6E73]">
                  Official Social Channels ({OFFICIAL_CONTACT.marketingSocialHandle})
                </p>
                <SocialLinks variant="inline" />
              </div>
              <div className="h-px bg-[#1D1D1F]/10" />
              <p className="text-xs text-[#6E6E73] leading-relaxed">
                Enquiries are validated locally, logged to AKYIN Enquiries when connected, and prepared for direct WhatsApp or Email transmission.
              </p>
            </GlassPanel>
          </div>

          {/* Right Form & Dispatcher */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handlePrepareDispatch}
              noValidate
              toolname="submit_akyin_enquiry"
              tooldescription="Validate and dispatch a business, marketing agency, automotive dealership, publishing, or partnership enquiry to AKYIN Ventures."
              className="frosted-glass-panel rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
            >
              <div className="sr-only" aria-hidden="true">
                <label htmlFor={`${sectionId}-org-url`}>Organization Website</label>
                <input
                  id={`${sectionId}-org-url`}
                  type="text"
                  name="org_url_verification"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* Enquiry Category Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] mb-2.5">
                  Enquiry Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {ENQUIRY_CATEGORIES.map((cat) => {
                    const isActive = category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setCategory(cat);
                          setVertical(
                            CATEGORY_TO_VERTICAL[cat] || 'AKYIN Ventures (Corporate Group)'
                          );
                          setDispatchReady(false);
                        }}
                        className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                          isActive
                            ? 'liquid-glass-pill-dark text-white'
                            : 'frosted-glass-pill text-[#1D1D1F] hover:bg-white'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <label htmlFor={`${sectionId}-name`} className="block text-xs font-semibold text-[#1D1D1F]">
                      Full Name *
                    </label>
                    {isFieldValidIndicator('name', name) && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1D1D1F]" aria-hidden="true" />
                    )}
                  </div>
                  <input
                    id={`${sectionId}-name`}
                    type="text"
                    maxLength={FIELD_LIMITS.name}
                    value={name}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? `${sectionId}-name-error` : undefined}
                    onChange={(e) => handleFieldChange('name', setName, e.target.value)}
                    onBlur={(e) => handleFieldBlur('name', e.target.value)}
                    placeholder="Your full name"
                    className={getFieldClass('name', name)}
                  />
                  {errors.name && (
                    <p
                      id={`${sectionId}-name-error`}
                      role="alert"
                      className="mt-1 text-xs text-[#D93025] font-semibold"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <label htmlFor={`${sectionId}-company`} className="block text-xs font-semibold text-[#1D1D1F]">
                      Business / Company Name
                    </label>
                    {isFieldValidIndicator('company', company) && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1D1D1F]" aria-hidden="true" />
                    )}
                  </div>
                  <input
                    id={`${sectionId}-company`}
                    type="text"
                    maxLength={FIELD_LIMITS.company}
                    value={company}
                    aria-invalid={Boolean(errors.company)}
                    aria-describedby={errors.company ? `${sectionId}-company-error` : undefined}
                    onChange={(e) => handleFieldChange('company', setCompany, e.target.value)}
                    onBlur={(e) => handleFieldBlur('company', e.target.value)}
                    placeholder="Company, brand, or organization"
                    className={getFieldClass('company', company)}
                  />
                  {errors.company && (
                    <p
                      id={`${sectionId}-company-error`}
                      role="alert"
                      className="mt-1 text-xs text-[#D93025] font-semibold"
                    >
                      {errors.company}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <label htmlFor={`${sectionId}-email`} className="block text-xs font-semibold text-[#1D1D1F]">
                      Email Address *
                    </label>
                    {isFieldValidIndicator('email', email) && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1D1D1F]" aria-hidden="true" />
                    )}
                  </div>
                  <input
                    id={`${sectionId}-email`}
                    type="email"
                    maxLength={FIELD_LIMITS.email}
                    value={email}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? `${sectionId}-email-error` : undefined}
                    onChange={(e) => handleFieldChange('email', setEmail, e.target.value)}
                    onBlur={(e) => handleFieldBlur('email', e.target.value)}
                    placeholder="name@company.com"
                    className={getFieldClass('email', email)}
                  />
                  {errors.email && (
                    <p
                      id={`${sectionId}-email-error`}
                      role="alert"
                      className="mt-1 text-xs text-[#D93025] font-semibold"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <label htmlFor={`${sectionId}-phone`} className="block text-xs font-semibold text-[#1D1D1F]">
                      Phone Number *
                    </label>
                    {isFieldValidIndicator('phone', phone) && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1D1D1F]" aria-hidden="true" />
                    )}
                  </div>
                  <input
                    id={`${sectionId}-phone`}
                    type="tel"
                    maxLength={FIELD_LIMITS.phone}
                    value={phone}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? `${sectionId}-phone-error` : undefined}
                    onChange={(e) => handleFieldChange('phone', setPhone, e.target.value)}
                    onBlur={(e) => handleFieldBlur('phone', e.target.value)}
                    placeholder="+91 98XXXXXXXX"
                    className={getFieldClass('phone', phone)}
                  />
                  {errors.phone && (
                    <p
                      id={`${sectionId}-phone-error`}
                      role="alert"
                      className="mt-1 text-xs text-[#D93025] font-semibold"
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <label htmlFor={`${sectionId}-country`} className="block text-xs font-semibold text-[#1D1D1F]">
                      Country *
                    </label>
                    {isFieldValidIndicator('country', country) && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1D1D1F]" aria-hidden="true" />
                    )}
                  </div>
                  <input
                    id={`${sectionId}-country`}
                    type="text"
                    maxLength={FIELD_LIMITS.country}
                    value={country}
                    aria-invalid={Boolean(errors.country)}
                    aria-describedby={errors.country ? `${sectionId}-country-error` : undefined}
                    onChange={(e) => handleFieldChange('country', setCountry, e.target.value)}
                    onBlur={(e) => handleFieldBlur('country', e.target.value)}
                    placeholder="e.g. India, UAE, United Kingdom"
                    className={getFieldClass('country', country)}
                  />
                  {errors.country && (
                    <p
                      id={`${sectionId}-country-error`}
                      role="alert"
                      className="mt-1 text-xs text-[#D93025] font-semibold"
                    >
                      {errors.country}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <label htmlFor={`${sectionId}-city`} className="block text-xs font-semibold text-[#1D1D1F]">
                      City *
                    </label>
                    {isFieldValidIndicator('city', city) && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1D1D1F]" aria-hidden="true" />
                    )}
                  </div>
                  <input
                    id={`${sectionId}-city`}
                    type="text"
                    maxLength={FIELD_LIMITS.city}
                    value={city}
                    aria-invalid={Boolean(errors.city)}
                    aria-describedby={errors.city ? `${sectionId}-city-error` : undefined}
                    onChange={(e) => handleFieldChange('city', setCity, e.target.value)}
                    onBlur={(e) => handleFieldBlur('city', e.target.value)}
                    placeholder="e.g. Hyderabad, Mumbai, London"
                    className={getFieldClass('city', city)}
                  />
                  {errors.city && (
                    <p
                      id={`${sectionId}-city-error`}
                      role="alert"
                      className="mt-1 text-xs text-[#D93025] font-semibold"
                    >
                      {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor={`${sectionId}-vertical`} className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
                    Business Vertical
                  </label>
                  <select
                    id={`${sectionId}-vertical`}
                    value={vertical}
                    onChange={(e) => {
                      setVertical(e.target.value);
                      setDispatchReady(false);
                    }}
                    className="w-full rounded-xl border border-[#E8E8ED] bg-[#F5F5F7]/65 px-3.5 py-2.5 text-sm text-[#1D1D1F] transition-all focus:bg-[#FFFFFF] focus:outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/12"
                  >
                    {BUSINESS_VERTICAL_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor={`${sectionId}-type`} className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
                    Enquiry Type
                  </label>
                  <select
                    id={`${sectionId}-type`}
                    value={enquiryType}
                    onChange={(e) => {
                      setEnquiryType(e.target.value);
                      setDispatchReady(false);
                    }}
                    className="w-full rounded-xl border border-[#E8E8ED] bg-[#F5F5F7]/65 px-3.5 py-2.5 text-sm text-[#1D1D1F] transition-all focus:bg-[#FFFFFF] focus:outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/12"
                  >
                    {ENQUIRY_TYPE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <label htmlFor={`${sectionId}-message`} className="block text-xs font-semibold text-[#1D1D1F]">
                    Message
                  </label>
                  <span className="font-mono-num text-[11px] text-[#6E6E73]">
                    {message.length}/{FIELD_LIMITS.message}
                  </span>
                </div>
                <textarea
                  id={`${sectionId}-message`}
                  rows={4}
                  maxLength={FIELD_LIMITS.message}
                  value={message}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? `${sectionId}-message-error` : undefined}
                  onChange={(e) => handleFieldChange('message', setMessage, e.target.value)}
                  onBlur={(e) => handleFieldBlur('message', e.target.value)}
                  placeholder="Share context about your enquiry, publishing request, marketing requirement, retail interest, or B2B collaboration..."
                  className={getFieldClass('message', message)}
                />
                {errors.message && (
                  <p
                    id={`${sectionId}-message-error`}
                    role="alert"
                    className="mt-1 text-xs text-[#D93025] font-semibold"
                  >
                    {errors.message}
                  </p>
                )}
              </div>

              {throttleNotice && (
                <p role="status" className="text-xs font-semibold text-[#D93025]">
                  {throttleNotice}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <GlassButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={submittingEnquiry}
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  <span>{submittingEnquiry ? 'Recording Enquiry...' : 'Submit & Prepare Enquiry'}</span>
                </GlassButton>
                <span className="text-xs text-[#6E6E73]">
                  Records enquiry &amp; prepares WhatsApp or Email draft
                </span>
              </div>

              {dispatchReady && (
                <div className="liquid-glass-card rounded-2xl text-[#1D1D1F] p-5 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-[#1D1D1F]">
                        {recordedEnquiryId
                          ? `Enquiry Recorded (${recordedEnquiryId})`
                          : 'Structured Enquiry Ready'}
                      </p>
                      <p className="text-xs text-[#6E6E73] mt-1">
                        {savedToLiveSheet
                          ? 'Your enquiry has been saved to the AKYIN Enquiries desk. You can also open a pre-filled WhatsApp or Email draft below.'
                          : 'Choose WhatsApp or Email below to open your pre-filled message draft.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E8E8ED] hover:border-[#1D1D1F] text-xs font-semibold text-[#1D1D1F] transition-colors cursor-pointer shrink-0"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#1D1D1F]" aria-hidden="true" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#6E6E73]" aria-hidden="true" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="liquid-glass-pill-dark inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-white text-xs sm:text-sm font-semibold transition-all whitespace-nowrap"
                    >
                      <MessageCircle className="w-4 h-4" aria-hidden="true" />
                      Open WhatsApp ({displayPhone})
                    </a>
                    <a
                      href={emailHref}
                      className="liquid-glass-cta inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-[#1D1D1F] hover:border-[#1D1D1F]/35 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap"
                    >
                      <Mail className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
                      Open Email Draft ({displayEmail})
                    </a>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
