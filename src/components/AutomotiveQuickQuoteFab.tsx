import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Mail,
  MessageCircle,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Zap,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { z } from 'zod';
import { OFFICIAL_CONTACT } from '../data/akyinData';
import { useSiteConfig } from '../context/SiteConfigContext';
import { submitEnquiryRecord } from '../services/appsScriptClient';
import {
  buildEmailDispatchUrl,
  buildWhatsAppDispatchUrl,
  EnquiryPayload,
} from '../utils/dispatchEnquiry';
import { canTriggerAction, sanitizeHref, sanitizeTextInput } from '../utils/security';
import { GlassButton, GlassModal } from './liquid-glass';

const quickQuoteSchema = z.object({
  dealershipName: z
    .string()
    .transform((v) => sanitizeTextInput(v, 100, false))
    .pipe(z.string().min(2, 'Enter dealership or showroom name.')),
  contactDetail: z
    .string()
    .transform((v) => sanitizeTextInput(v, 120, false))
    .pipe(z.string().min(5, 'Enter a valid email or phone/WhatsApp number.')),
  city: z
    .string()
    .transform((v) => sanitizeTextInput(v, 60, false))
    .pipe(z.string().min(2, 'Enter showroom city.')),
  focusArea: z.string(),
  budgetRange: z.string(),
  auditNotes: z
    .string()
    .transform((v) => sanitizeTextInput(v, 500, true))
    .optional(),
});

interface BrowserSpeechRecognitionAlternative {
  transcript: string;
}

interface BrowserSpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: BrowserSpeechRecognitionAlternative;
}

interface BrowserSpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: BrowserSpeechRecognitionResult;
  };
}

interface BrowserSpeechRecognitionErrorEvent {
  error: string;
}

interface BrowserSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: BrowserSpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  const win = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return win.SpeechRecognition || win.webkitSpeechRecognition || null;
}

const FOCUS_AREAS = [
  'Lead Generation & Volume',
  'Lead Filtering & Qualification',
  'Test Drive & Festive Campaigns',
  'Sales Team Training',
];

const BUDGET_RANGES = [
  '₹75,000 – ₹1,50,000 / mo',
  '₹1,50,000 – ₹3,00,000 / mo',
  '₹3,00,000+ / mo',
  'Exploring Audit First',
];

export function AutomotiveQuickQuoteFab() {
  const shouldReduceMotion = useReducedMotion();
  const { settings } = useSiteConfig();

  const [open, setOpen] = useState(false);
  const [dealershipName, setDealershipName] = useState('');
  const [contactDetail, setContactDetail] = useState('');
  const [city, setCity] = useState('');
  const [focusArea, setFocusArea] = useState(FOCUS_AREAS[0]);
  const [budgetRange, setBudgetRange] = useState(BUDGET_RANGES[1]);
  const [auditNotes, setAuditNotes] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speechNotice, setSpeechNotice] = useState('');
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const speechSupported = Boolean(getSpeechRecognitionConstructor());

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedPayload, setSubmittedPayload] = useState<EnquiryPayload | null>(null);
  const [referenceId, setReferenceId] = useState('');

  const stopDictation = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore if recognition already ended
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimTranscript('');
  };

  useEffect(() => {
    if (!open) {
      stopDictation();
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore unmount cleanup error
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  const toggleDictation = () => {
    if (isListening) {
      stopDictation();
      return;
    }

    const SpeechRecognitionCtor = getSpeechRecognitionConstructor();
    if (!SpeechRecognitionCtor) {
      setSpeechNotice('Voice dictation is not supported in this browser. Type your requirements below.');
      return;
    }

    setSpeechNotice('');
    try {
      const recognition = new SpeechRecognitionCtor();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechNotice('');
      };

      recognition.onresult = (event) => {
        let finalChunk = '';
        let interimChunk = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i]?.[0]?.transcript ?? '';
          if (event.results[i]?.isFinal) {
            finalChunk += transcript;
          } else {
            interimChunk += transcript;
          }
        }
        if (finalChunk.trim()) {
          setAuditNotes((prev) => {
            const trimmedPrev = prev.trim();
            const combined = trimmedPrev ? `${trimmedPrev} ${finalChunk.trim()}` : finalChunk.trim();
            return combined.slice(0, 500);
          });
        }
        setInterimTranscript(interimChunk.trim());
      };

      recognition.onerror = (event) => {
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setSpeechNotice('Microphone permission was denied. Enable mic access or type below.');
        } else if (event.error === 'no-speech') {
          setSpeechNotice('No speech detected. Try speaking closer to your microphone.');
        } else if (event.error !== 'aborted') {
          setSpeechNotice('Voice recognition paused. Click the microphone to retry.');
        }
        setIsListening(false);
        setInterimTranscript('');
        recognitionRef.current = null;
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
        recognitionRef.current = null;
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setSpeechNotice('Unable to start microphone capture in this browser.');
      setIsListening(false);
      recognitionRef.current = null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot.trim().length > 0) return;
    if (!canTriggerAction('quick-quote-audit', 1500)) return;

    stopDictation();

    const parsed = quickQuoteSchema.safeParse({
      dealershipName,
      contactDetail,
      city,
      focusArea,
      budgetRange,
      auditNotes,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'Please complete all required fields.');
      return;
    }

    setError('');
    setSubmitting(true);

    const data = parsed.data;
    const isEmail = data.contactDetail.includes('@');
    const notesSegment = data.auditNotes ? ` | Requirements: ${data.auditNotes}` : '';

    const payload: EnquiryPayload = {
      category: 'Marketing Services Enquiry',
      vertical: 'Akyin Marketing',
      enquiryType: 'Automotive Dealership Marketing & Sales Strategy',
      name: `${data.dealershipName} Manager`,
      company: data.dealershipName,
      email: isEmail ? data.contactDetail : settings.officialEmail || OFFICIAL_CONTACT.email,
      phone: isEmail ? 'Requested via Email' : data.contactDetail,
      country: 'India',
      city: data.city,
      message: `Quick-Quote Dealership Marketing Audit Request — Focus: ${data.focusArea} | Monthly Ad Budget: ${data.budgetRange} | Contact: ${data.contactDetail}${notesSegment}`,
    };

    try {
      const result = await submitEnquiryRecord(payload);
      setReferenceId(result.enquiryId || `AKY-QQ-${Date.now().toString().slice(-6)}`);
    } catch {
      setReferenceId(`AKY-QQ-${Date.now().toString().slice(-6)}`);
    } finally {
      setSubmitting(false);
      setSubmittedPayload(payload);
    }
  };

  const resetForm = () => {
    stopDictation();
    setSubmittedPayload(null);
    setDealershipName('');
    setContactDetail('');
    setCity('');
    setAuditNotes('');
    setSpeechNotice('');
    setError('');
    setReferenceId('');
  };

  const safeWhatsAppUrl = submittedPayload
    ? sanitizeHref(buildWhatsAppDispatchUrl(submittedPayload), '#', true)
    : '#';

  const safeEmailUrl = submittedPayload
    ? sanitizeHref(buildEmailDispatchUrl(submittedPayload), '#', true)
    : '#';

  return (
    <>
      {/* Floating Action Button (Bottom Right) */}
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.02 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
        aria-label="Open Quick-Quote dealership marketing audit modal"
        className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-40 print:hidden inline-flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full liquid-glass-pill-dark text-white text-xs sm:text-sm font-semibold shadow-[0_18px_42px_rgba(29,29,31,0.28)] border border-white/30 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
      >
        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400/35 to-amber-300/35 border border-white/25 flex items-center justify-center shrink-0">
          <Zap className="w-3.5 h-3.5 text-amber-200" aria-hidden="true" />
        </span>
        <span>Quick-Quote Audit</span>
      </motion.button>

      {/* Compact Glass Modal */}
      <GlassModal
        open={open}
        onClose={() => setOpen(false)}
        subtitle="Fast Dealership Marketing Audit"
        title="Request a Quick-Quote Audit"
        maxWidthClass="max-w-lg"
      >
        {submittedPayload ? (
          <div className="space-y-5">
            <div className="frosted-glass-card rounded-2xl p-5 border border-emerald-200/70 bg-emerald-50/35 space-y-2">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-display text-base font-bold text-[#1D1D1F]">
                    Quick-Quote Audit Request Prepared
                  </p>
                  <p className="font-mono-num text-xs text-[#6E6E73]">
                    Ref: {referenceId}
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#6E6E73] leading-relaxed">
                Your fast marketing audit request for{' '}
                <strong className="text-[#1D1D1F]">{submittedPayload.company}</strong> ({budgetRange}) is ready. Dispatch immediately to our automotive team via WhatsApp or Email:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={safeWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full liquid-glass-pill-dark text-white text-xs font-semibold transition-all"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>Send via WhatsApp</span>
              </a>
              <a
                href={safeEmailUrl}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full liquid-glass-cta text-[#1D1D1F] text-xs font-semibold transition-all"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>Send via Email</span>
              </a>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs border-t border-[#1D1D1F]/10">
              <button
                type="button"
                onClick={resetForm}
                className="font-semibold text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
              >
                Submit another showroom
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="font-semibold text-[#1D1D1F] hover:underline cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="sr-only" aria-hidden="true">
              <label htmlFor="quick-quote-hp">Website</label>
              <input
                id="quick-quote-hp"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <p className="text-xs text-[#6E6E73] leading-relaxed">
              Share 4 quick details to receive an estimated CPL benchmark and showroom funnel review within 1 business day.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label
                  htmlFor="qq-dealership"
                  className="block text-xs font-semibold text-[#1D1D1F] mb-1"
                >
                  Dealership / Group *
                </label>
                <input
                  id="qq-dealership"
                  type="text"
                  maxLength={100}
                  value={dealershipName}
                  onChange={(e) => setDealershipName(e.target.value)}
                  placeholder="e.g. Apex Motors"
                  className="w-full rounded-xl border border-[#E8E8ED] bg-white/85 px-3.5 py-2 text-sm text-[#1D1D1F] placeholder:text-[#A1A1A6] focus:outline-none focus:border-[#1D1D1F]"
                />
              </div>

              <div>
                <label
                  htmlFor="qq-city"
                  className="block text-xs font-semibold text-[#1D1D1F] mb-1"
                >
                  Showroom City *
                </label>
                <input
                  id="qq-city"
                  type="text"
                  maxLength={60}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bengaluru"
                  className="w-full rounded-xl border border-[#E8E8ED] bg-white/85 px-3.5 py-2 text-sm text-[#1D1D1F] placeholder:text-[#A1A1A6] focus:outline-none focus:border-[#1D1D1F]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="qq-contact"
                className="block text-xs font-semibold text-[#1D1D1F] mb-1"
              >
                WhatsApp Number or Work Email *
              </label>
              <input
                id="qq-contact"
                type="text"
                maxLength={120}
                value={contactDetail}
                onChange={(e) => setContactDetail(e.target.value)}
                placeholder="+91 98XXX XXXXX or manager@dealership.com"
                className="w-full rounded-xl border border-[#E8E8ED] bg-white/85 px-3.5 py-2 text-sm text-[#1D1D1F] placeholder:text-[#A1A1A6] focus:outline-none focus:border-[#1D1D1F]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label
                  htmlFor="qq-focus"
                  className="block text-xs font-semibold text-[#1D1D1F] mb-1"
                >
                  Primary Audit Focus
                </label>
                <select
                  id="qq-focus"
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E8ED] bg-white/85 px-3 py-2 text-xs font-medium text-[#1D1D1F] focus:outline-none focus:border-[#1D1D1F] cursor-pointer"
                >
                  {FOCUS_AREAS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="qq-budget"
                  className="block text-xs font-semibold text-[#1D1D1F] mb-1"
                >
                  Monthly Ad Spend
                </label>
                <select
                  id="qq-budget"
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E8ED] bg-white/85 px-3 py-2 text-xs font-medium text-[#1D1D1F] focus:outline-none focus:border-[#1D1D1F] cursor-pointer"
                >
                  {BUDGET_RANGES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <label
                  htmlFor="qq-requirements"
                  className="block text-xs font-semibold text-[#1D1D1F]"
                >
                  Specific Audit Requirements (Optional)
                </label>
                <button
                  type="button"
                  onClick={toggleDictation}
                  disabled={!speechSupported}
                  aria-pressed={isListening}
                  aria-label={
                    isListening
                      ? 'Stop voice dictation'
                      : 'Dictate marketing audit requirements via microphone'
                  }
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isListening
                      ? 'bg-purple-700 text-white border-purple-700'
                      : 'bg-white/90 text-[#1D1D1F] border-[#E8E8ED] hover:border-[#1D1D1F]/35'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Stop Dictation</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
                      <span>Dictate</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <textarea
                  id="qq-requirements"
                  rows={2}
                  maxLength={500}
                  value={
                    isListening && interimTranscript
                      ? `${auditNotes}${auditNotes.trim() ? ' ' : ''}${interimTranscript}`
                      : auditNotes
                  }
                  onChange={(e) => setAuditNotes(e.target.value)}
                  placeholder="Speak or type specific models, festive offers, or lead qualification goals..."
                  className={`w-full rounded-xl border bg-white/85 px-3.5 py-2 pr-10 text-xs sm:text-sm text-[#1D1D1F] placeholder:text-[#A1A1A6] focus:outline-none resize-none ${
                    isListening
                      ? 'border-purple-600 ring-2 ring-purple-500/15'
                      : 'border-[#E8E8ED] focus:border-[#1D1D1F]'
                  }`}
                />
                <button
                  type="button"
                  onClick={toggleDictation}
                  disabled={!speechSupported}
                  aria-label={isListening ? 'Stop microphone' : 'Activate microphone dictation'}
                  className={`absolute right-2.5 bottom-2.5 w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 ${
                    isListening
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]'
                  }`}
                >
                  {isListening ? (
                    <MicOff className="w-3.5 h-3.5" aria-hidden="true" />
                  ) : (
                    <Mic className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                </button>
              </div>

              {isListening && (
                <p className="text-[11px] font-medium text-purple-700 mt-1">
                  Listening via microphone — speak your showroom audit goals clearly.
                </p>
              )}
              {speechNotice && !isListening && (
                <p className="text-[11px] text-[#6E6E73] mt-1">{speechNotice}</p>
              )}
            </div>

            {error && (
              <p role="alert" className="text-xs font-semibold text-[#D93025]">
                {error}
              </p>
            )}

            <div className="pt-2 flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-[#6E6E73]">
                <Sparkles className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
                <span>Includes complimentary CPL review</span>
              </span>
              <GlassButton
                type="submit"
                variant="primary"
                size="md"
                disabled={submitting}
              >
                <Send className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{submitting ? 'Preparing...' : 'Get Fast Audit'}</span>
              </GlassButton>
            </div>
          </form>
        )}
      </GlassModal>
    </>
  );
}
