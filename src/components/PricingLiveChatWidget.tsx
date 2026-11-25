import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  MessageCircle,
  MessageSquare,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ENQUIRY_TYPE_OPTIONS, OFFICIAL_CONTACT } from '../data/akyinData';
import { submitEnquiryRecord } from '../services/appsScriptClient';
import {
  buildEmailDispatchUrl,
  buildWhatsAppDispatchUrl,
  EnquiryPayload,
  validateEnquiryPayload,
} from '../utils/dispatchEnquiry';

interface PricingLiveChatWidgetProps {
  onStartEnquiry: (options: {
    category: string;
    vertical: string;
    enquiryType?: string;
  }) => void;
}

interface ChatMessage {
  id: string;
  sender: 'agent' | 'visitor';
  text: string;
}

interface QuickIntentOption {
  id: string;
  label: string;
  reply: string;
  enquiryType: string;
  vertical: string;
  defaultNote: string;
}

const QUICK_INTENTS: QuickIntentOption[] = [
  {
    id: 'meta-ads',
    label: 'Meta & Google Ads Management',
    reply:
      'Meta lead generation management is priced standalone at ₹40,000/month (with optional ₹79,998 onboarding setup; ad spend paid directly to Meta/Google). Share your details below to receive a customized standalone proposal:',
    enquiryType: 'Meta Ads Management',
    vertical: 'Akyin Marketing',
    defaultNote: 'Interested in standalone Meta & Google Ads management.',
  },
  {
    id: 'lead-filtering',
    label: 'Lead Filtering & Qualification',
    reply:
      'Lead Filtering & Qualification (₹24,000/month, strictly separate from ad generation) vets existing enquiries into Hot, Warm, and Follow-up priorities. Complete the quick enquiry below for workflow details:',
    enquiryType: 'Lead Filtering & Qualification',
    vertical: 'Akyin Marketing',
    defaultNote: 'Looking for standalone Lead Filtering & Qualification support.',
  },
  {
    id: 'sms-whatsapp',
    label: 'Bulk SMS & WhatsApp Setup',
    reply:
      'Bulk SMS Marketing starts at ₹3,000 for 10,000 SMS (₹0.30/SMS). WhatsApp Business Messaging Setup is ₹4,999 one-time setup with ₹1.50/message usage billed separately. Submit below to configure your quote:',
    enquiryType: 'Bulk SMS Marketing',
    vertical: 'Akyin Marketing',
    defaultNote: 'Enquiring about Bulk SMS (₹3,000) / WhatsApp Business Setup (₹4,999 + usage separate).',
  },
  {
    id: 'sales-training',
    label: 'Sales Team Training (₹50,000)',
    reply:
      'On-site & live floor sales training workshops are priced at ₹50,000 per session. Enter your city and team size below so our team can confirm available dates:',
    enquiryType: 'Commercial & Dealership Sales Training Workshop',
    vertical: 'Akyin Marketing',
    defaultNote: 'Enquiring about Commercial / Dealership Sales Training (₹50,000 per session).',
  },
];

export function PricingLiveChatWidget({ onStartEnquiry }: PricingLiveChatWidgetProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: 'Welcome to the AKYIN Commercial Desk. All services are 100% standalone—choose a service below (Meta Ads, Lead Filtering, Bulk SMS ₹3,000, WhatsApp Setup ₹4,999, Sales Training ₹50,000) or ask for a tailored quotation.',
    },
  ]);

  // Enquiry Form State
  const [selectedVertical, setSelectedVertical] = useState('Akyin Marketing');
  const [selectedEnquiryType, setSelectedEnquiryType] = useState<string>(ENQUIRY_TYPE_OPTIONS[0]);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedPayload, setSubmittedPayload] = useState<EnquiryPayload | null>(null);
  const [recordedId, setRecordedId] = useState('');

  const handleSelectIntent = (intent: QuickIntentOption) => {
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, sender: 'visitor', text: intent.label },
      { id: `a-${Date.now() + 1}`, sender: 'agent', text: intent.reply },
    ]);
    setSelectedVertical(intent.vertical);
    setSelectedEnquiryType(intent.enquiryType);
    setMessage((prev) => (prev.trim() ? prev : intent.defaultNote));
    setShowForm(true);
    setSubmittedPayload(null);
  };

  const handleSendChatPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed) {
      setShowForm(true);
      return;
    }
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, sender: 'visitor', text: trimmed },
      {
        id: `a-${Date.now() + 1}`,
        sender: 'agent',
        text: 'Thanks for sharing that. Please complete your contact details below so our team can send your written INR quotation & scope breakdown directly.',
      },
    ]);
    setMessage(trimmed);
    setChatInput('');
    setShowForm(true);
    setSubmittedPayload(null);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: EnquiryPayload = {
      category: 'Marketing Services Enquiry',
      vertical: selectedVertical,
      enquiryType: selectedEnquiryType,
      name,
      company,
      email,
      phone,
      country: country.trim() || 'India',
      city: city.trim() || 'Hyderabad',
      message,
    };

    const validationErrors = validateEnquiryPayload(payload);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const res = await submitEnquiryRecord({
        name: payload.name,
        company: payload.company,
        phone: payload.phone,
        email: payload.email,
        city: payload.city,
        country: payload.country,
        vertical: payload.vertical,
        enquiryType: payload.enquiryType,
        message: payload.message,
      });
      setRecordedId(res.enquiryId);
    } catch {
      setRecordedId('');
    } finally {
      setSubmitting(false);
      setSubmittedPayload(payload);
    }
  };

  const resetWidgetForm = () => {
    setSubmittedPayload(null);
    setErrors({});
    setMessage('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 print:hidden flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="AKYIN Pricing Concierge Live Chat"
            className="w-[calc(100vw-2.5rem)] sm:w-[395px] max-h-[82vh] flex flex-col liquid-glass-modal rounded-3xl overflow-hidden shadow-[0_28px_72px_rgba(0,0,0,0.18)]"
          >
            {/* Widget Header */}
            <div className="px-5 py-4 bg-[#1D1D1F] text-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="font-display text-sm font-bold leading-tight truncate">
                    AKYIN Pricing Concierge
                  </p>
                  <p className="text-[11px] text-white/75">
                    Fast Quote &amp; Enquiry Desk
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close pricing live chat"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#F5F5F7]/75">
              {/* Messages */}
              <div className="space-y-2.5">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        msg.sender === 'visitor'
                          ? 'bg-[#1D1D1F] text-white rounded-br-sm'
                          : 'bg-white border border-[#E8E8ED] text-[#1D1D1F] rounded-bl-sm shadow-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Reply Prompts */}
              {!submittedPayload && (
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6E6E73]">
                    Quick Topics
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_INTENTS.map((intent) => (
                      <button
                        key={intent.id}
                        type="button"
                        onClick={() => handleSelectIntent(intent)}
                        className="px-2.5 py-1.5 rounded-full bg-white border border-[#E8E8ED] hover:border-[#1D1D1F] text-[11px] font-semibold text-[#1D1D1F] transition-colors cursor-pointer text-left"
                      >
                        {intent.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Triggered Lead Capture Enquiry Form */}
              {showForm && !submittedPayload && (
                <form
                  onSubmit={handleSubmitForm}
                  noValidate
                  toolname="pricing_concierge_enquiry"
                  tooldescription="Submit a fast pricing quote enquiry from the AKYIN Pricing page live chat widget."
                  className="bg-white rounded-2xl border border-[#E8E8ED] p-4 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#E8E8ED]">
                    <p className="text-xs font-bold text-[#1D1D1F]">
                      Fast Quote &amp; Proposal Request
                    </p>
                    <span className="font-mono-num text-[10px] font-semibold text-[#6E6E73]">
                      INR Desk
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name *"
                        aria-label="Full Name"
                        className="w-full rounded-xl border border-[#E8E8ED] bg-[#F5F5F7]/70 px-3 py-2 text-xs text-[#1D1D1F] focus:bg-white focus:outline-none focus:border-[#1D1D1F]"
                      />
                      {errors.name && (
                        <p className="mt-0.5 text-[11px] text-[#D93025] font-semibold">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Business / Dealership Name"
                        aria-label="Business or Dealership Name"
                        className="w-full rounded-xl border border-[#E8E8ED] bg-[#F5F5F7]/70 px-3 py-2 text-xs text-[#1D1D1F] focus:bg-white focus:outline-none focus:border-[#1D1D1F]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email *"
                          aria-label="Email Address"
                          className="w-full rounded-xl border border-[#E8E8ED] bg-[#F5F5F7]/70 px-3 py-2 text-xs text-[#1D1D1F] focus:bg-white focus:outline-none focus:border-[#1D1D1F]"
                        />
                        {errors.email && (
                          <p className="mt-0.5 text-[11px] text-[#D93025] font-semibold">{errors.email}</p>
                        )}
                      </div>
                      <div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Phone / WhatsApp *"
                          aria-label="Phone Number"
                          className="w-full rounded-xl border border-[#E8E8ED] bg-[#F5F5F7]/70 px-3 py-2 text-xs text-[#1D1D1F] focus:bg-white focus:outline-none focus:border-[#1D1D1F]"
                        />
                        {errors.phone && (
                          <p className="mt-0.5 text-[11px] text-[#D93025] font-semibold">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City (e.g. Hyderabad, Mumbai)"
                        aria-label="City"
                        className="w-full rounded-xl border border-[#E8E8ED] bg-[#F5F5F7]/70 px-3 py-2 text-xs text-[#1D1D1F] focus:bg-white focus:outline-none focus:border-[#1D1D1F]"
                      />
                    </div>

                    <div>
                      <textarea
                        rows={2}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Which package or services are you interested in? *"
                        aria-label="Requirement Details"
                        className="w-full rounded-xl border border-[#E8E8ED] bg-[#F5F5F7]/70 px-3 py-2 text-xs text-[#1D1D1F] focus:bg-white focus:outline-none focus:border-[#1D1D1F]"
                      />
                      {errors.message && (
                        <p className="mt-0.5 text-[11px] text-[#D93025] font-semibold">{errors.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-[#1D1D1F] hover:bg-[#3A3A3F] text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60"
                    >
                      <Send className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{submitting ? 'Sending...' : 'Request Proposal'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        onStartEnquiry({
                          category: 'Marketing Services Enquiry',
                          vertical: selectedVertical,
                          enquiryType: selectedEnquiryType,
                        });
                      }}
                      className="px-3 py-2 text-[11px] font-semibold text-[#6E6E73] hover:text-[#1D1D1F] underline cursor-pointer shrink-0"
                    >
                      Full Form
                    </button>
                  </div>
                </form>
              )}

              {/* Confirmation Card after submission */}
              {submittedPayload && (
                <div className="bg-white rounded-2xl border border-[#E8E8ED] p-4 space-y-3 shadow-xs">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-bold text-[#1D1D1F]">
                        {recordedId ? `Enquiry Logged (${recordedId})` : 'Quote Request Ready'}
                      </p>
                      <p className="text-[11px] text-[#6E6E73] mt-0.5">
                        Send directly via WhatsApp or Email for immediate priority response:
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={buildWhatsAppDispatchUrl(submittedPayload)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-[#1D1D1F] text-white text-[11px] font-semibold"
                    >
                      <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={buildEmailDispatchUrl(submittedPayload)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-[#F5F5F7] border border-[#E8E8ED] text-[#1D1D1F] text-[11px] font-semibold"
                    >
                      <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Email Draft</span>
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={resetWidgetForm}
                    className="text-[11px] font-semibold text-[#6E6E73] hover:text-[#1D1D1F] underline cursor-pointer"
                  >
                    Ask another pricing question
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Chat Input Bar (Triggers Enquiry Form when clicked/submitted) */}
            {!showForm && !submittedPayload && (
              <form
                onSubmit={handleSendChatPrompt}
                className="p-3 bg-white border-t border-[#E8E8ED] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about packages or click to enquire..."
                  aria-label="Ask a pricing question"
                  className="flex-1 rounded-full border border-[#E8E8ED] bg-[#F5F5F7] px-3.5 py-2 text-xs text-[#1D1D1F] focus:bg-white focus:outline-none focus:border-[#1D1D1F]"
                />
                <button
                  type="submit"
                  aria-label="Start pricing enquiry"
                  className="w-8 h-8 rounded-full bg-[#1D1D1F] text-white flex items-center justify-center hover:bg-[#3A3A3F] transition-colors cursor-pointer shrink-0"
                >
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Launcher Pill */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close Pricing Concierge chat' : 'Open Pricing Concierge live chat'}
        className="liquid-glass-pill-dark inline-flex items-center gap-2.5 px-4 py-3 rounded-full text-white text-xs sm:text-sm font-semibold shadow-[0_14px_34px_rgba(0,0,0,0.22)] transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer"
      >
        <MessageSquare className="w-4 h-4" aria-hidden="true" />
        <span>{isOpen ? 'Close Concierge' : 'Pricing Chat · WhatsApp Connect'}</span>
      </button>
    </div>
  );
}
