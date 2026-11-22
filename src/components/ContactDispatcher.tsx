import { useEffect, useState } from 'react';
import { Check, Copy, Mail, MessageCircle, Send } from 'lucide-react';
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
  validateEnquiryPayload,
} from '../utils/dispatchEnquiry';
import { SocialLinks } from './SocialLinks';

interface ContactDispatcherProps {
  defaultCategory?: string;
  defaultVertical?: string;
  defaultEnquiryType?: string;
  sectionId?: string;
  heading?: string;
  subheading?: string;
}

export function ContactDispatcher({
  defaultCategory = ENQUIRY_CATEGORIES[0],
  defaultVertical = BUSINESS_VERTICAL_OPTIONS[0],
  defaultEnquiryType = ENQUIRY_TYPE_OPTIONS[0],
  sectionId = 'contact-form',
  heading = "Let's Start a Conversation.",
  subheading = 'Select your enquiry category and complete the details below to prepare a structured WhatsApp or Email draft directly to AKYIN Ventures.',
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
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dispatchReady, setDispatchReady] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handlePrepareDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateEnquiryPayload(payload);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setDispatchReady(true);
    } else {
      setDispatchReady(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildFormattedEnquiryText(payload));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Direct links remain available
    }
  };

  const whatsappHref = buildWhatsAppDispatchUrl(payload);
  const emailHref = buildEmailDispatchUrl(payload);

  const inputBaseClass =
    'w-full rounded-lg border border-[#D9CCB9] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#292722] placeholder:text-[#A99C8B] transition-colors focus:outline-none focus:border-[#B66A50] focus:ring-2 focus:ring-[#B66A50]/15';

  return (
    <section
      id={sectionId}
      className="py-20 lg:py-24 bg-[#F7F5F0] border-t border-[#D9CCB9]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Editorial Contact & Social Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-xs font-semibold tracking-wide text-[#B66A50] mb-2">
                Direct Business &amp; Venture Enquiries
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#292722] text-balance">
                {heading}
              </h2>
              <p className="mt-4 text-base text-[#77736C] leading-relaxed">
                {subheading}
              </p>
            </div>

            <div className="bg-[#FFFFFF] rounded-2xl border border-[#D9CCB9] p-6 sm:p-7 space-y-5">
              <div>
                <p className="text-xs font-medium text-[#77736C]">Configurable Email Destination</p>
                <a
                  href={`mailto:${OFFICIAL_CONTACT.email}`}
                  className="mt-1 inline-flex items-center gap-2 text-base font-semibold text-[#292722] hover:text-[#B66A50] transition-colors"
                >
                  {OFFICIAL_CONTACT.email}
                </a>
              </div>
              <div className="h-px bg-[#EFE9DE]" />
              <div>
                <p className="text-xs font-medium text-[#77736C]">Official WhatsApp / Phone</p>
                <a
                  href={OFFICIAL_CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-2 font-mono-num text-base font-semibold text-[#292722] hover:text-[#B66A50] transition-colors"
                >
                  {OFFICIAL_CONTACT.phoneDisplay}
                </a>
              </div>
              <div className="h-px bg-[#EFE9DE]" />
              <div className="space-y-3">
                <p className="text-xs font-medium text-[#77736C]">
                  Official Social Channels ({OFFICIAL_CONTACT.marketingSocialHandle})
                </p>
                <SocialLinks variant="inline" />
              </div>
              <div className="h-px bg-[#EFE9DE]" />
              <p className="text-xs text-[#77736C] leading-relaxed">
                Enquiries are prepared directly in your browser and opened in your chosen WhatsApp or Email client—no intermediate database or third-party form broker is used.
              </p>
            </div>
          </div>

          {/* Right Form & Dispatcher */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handlePrepareDispatch}
              noValidate
              className="bg-[#FFFFFF] rounded-2xl border border-[#D9CCB9] shadow-sm p-6 sm:p-8 space-y-6"
            >
              {/* 7 Enquiry Category Buttons */}
              <div>
                <label className="block text-xs font-semibold text-[#292722] mb-2.5">
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
                          if (cat === 'Publishing Enquiry') setVertical('Akyin Publishing');
                          else if (cat === 'Marketing Services Enquiry') setVertical('Akyin Marketing');
                          else if (cat === 'Retail and Store Enquiry')
                            setVertical('Akyin Store / AKYIN THRIFT');
                          else if (cat === 'AICalc Enquiry') setVertical('AICalc (aicalc.in)');
                          else if (cat === 'Kartigo Business Enquiry')
                            setVertical('Kartigo (kartigo.online)');
                          else setVertical('AKYIN Ventures (Corporate Group)');
                          setDispatchReady(false);
                        }}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                          isActive
                            ? 'bg-[#B66A50] text-white'
                            : 'bg-[#F7F5F0] text-[#292722] border border-[#D9CCB9]/70 hover:bg-[#EFE9DE]'
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
                  <label htmlFor={`${sectionId}-name`} className="block text-xs font-semibold text-[#292722] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    id={`${sectionId}-name`}
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setDispatchReady(false);
                    }}
                    placeholder="Your full name"
                    className={inputBaseClass}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-[#B66A50] font-semibold">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor={`${sectionId}-company`} className="block text-xs font-semibold text-[#292722] mb-1.5">
                    Business / Company Name
                  </label>
                  <input
                    id={`${sectionId}-company`}
                    type="text"
                    value={company}
                    onChange={(e) => {
                      setCompany(e.target.value);
                      setDispatchReady(false);
                    }}
                    placeholder="Company, dealership, or organization"
                    className={inputBaseClass}
                  />
                </div>

                <div>
                  <label htmlFor={`${sectionId}-email`} className="block text-xs font-semibold text-[#292722] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    id={`${sectionId}-email`}
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setDispatchReady(false);
                    }}
                    placeholder="name@company.com"
                    className={inputBaseClass}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-[#B66A50] font-semibold">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor={`${sectionId}-phone`} className="block text-xs font-semibold text-[#292722] mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    id={`${sectionId}-phone`}
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setDispatchReady(false);
                    }}
                    placeholder="+91 98XXXXXXXX"
                    className={inputBaseClass}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-[#B66A50] font-semibold">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor={`${sectionId}-country`} className="block text-xs font-semibold text-[#292722] mb-1.5">
                    Country *
                  </label>
                  <input
                    id={`${sectionId}-country`}
                    type="text"
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      setDispatchReady(false);
                    }}
                    placeholder="e.g. India, UAE, United Kingdom"
                    className={inputBaseClass}
                  />
                  {errors.country && (
                    <p className="mt-1 text-xs text-[#B66A50] font-semibold">{errors.country}</p>
                  )}
                </div>

                <div>
                  <label htmlFor={`${sectionId}-city`} className="block text-xs font-semibold text-[#292722] mb-1.5">
                    City *
                  </label>
                  <input
                    id={`${sectionId}-city`}
                    type="text"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      setDispatchReady(false);
                    }}
                    placeholder="e.g. Hyderabad, Mumbai, London"
                    className={inputBaseClass}
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-[#B66A50] font-semibold">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label htmlFor={`${sectionId}-vertical`} className="block text-xs font-semibold text-[#292722] mb-1.5">
                    Business Vertical
                  </label>
                  <select
                    id={`${sectionId}-vertical`}
                    value={vertical}
                    onChange={(e) => {
                      setVertical(e.target.value);
                      setDispatchReady(false);
                    }}
                    className={inputBaseClass}
                  >
                    {BUSINESS_VERTICAL_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor={`${sectionId}-type`} className="block text-xs font-semibold text-[#292722] mb-1.5">
                    Enquiry Type
                  </label>
                  <select
                    id={`${sectionId}-type`}
                    value={enquiryType}
                    onChange={(e) => {
                      setEnquiryType(e.target.value);
                      setDispatchReady(false);
                    }}
                    className={inputBaseClass}
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
                <label htmlFor={`${sectionId}-message`} className="block text-xs font-semibold text-[#292722] mb-1.5">
                  Message
                </label>
                <textarea
                  id={`${sectionId}-message`}
                  rows={4}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    setDispatchReady(false);
                  }}
                  placeholder="Share context about your enquiry, publishing request, marketing requirement, retail interest, or B2B collaboration..."
                  className={inputBaseClass}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#B66A50] hover:bg-[#9E5740] text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  Generate Enquiry Message
                </button>
                <span className="text-xs text-[#77736C]">
                  Opens a pre-filled WhatsApp or Email draft
                </span>
              </div>

              {dispatchReady && (
                <div className="rounded-xl bg-[#EFE9DE] border border-[#D9CCB9] text-[#292722] p-5 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-[#292722]">
                        Structured Enquiry Ready
                      </p>
                      <p className="text-xs text-[#77736C] mt-1">
                        Choose WhatsApp or Email below to open your pre-filled message draft. Nothing is stored or sent silently in the background.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#D9CCB9] hover:border-[#B66A50] text-xs font-semibold text-[#292722] transition-colors cursor-pointer shrink-0"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#83866A]" aria-hidden="true" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#77736C]" aria-hidden="true" />
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
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#B66A50] hover:bg-[#9E5740] text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap"
                    >
                      <MessageCircle className="w-4 h-4" aria-hidden="true" />
                      Open WhatsApp ({OFFICIAL_CONTACT.phoneDisplay})
                    </a>
                    <a
                      href={emailHref}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#FFFFFF] border border-[#D9CCB9] text-[#292722] hover:border-[#B66A50] text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap"
                    >
                      <Mail className="w-4 h-4 text-[#B66A50]" aria-hidden="true" />
                      Open Email Draft ({OFFICIAL_CONTACT.email})
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
