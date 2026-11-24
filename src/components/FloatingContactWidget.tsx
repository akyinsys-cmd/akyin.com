import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Globe,
  Mail,
  MessageCircle,
  Phone,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { AppRoute, OFFICIAL_CONTACT } from '../data/akyinData';
import { sanitizeHref } from '../utils/security';

interface FloatingContactWidgetProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

export function FloatingContactWidget({
  currentRoute,
  onNavigate,
}: FloatingContactWidgetProps) {
  const shouldReduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  if (currentRoute === '/admin') {
    return null;
  }

  // Coordinate cleanly above AutomotiveQuickQuoteFab when on /marketing/automotive
  const positionClass =
    currentRoute === '/marketing/automotive'
      ? 'bottom-[4.75rem] right-5 sm:bottom-[5.25rem] sm:right-7'
      : 'bottom-5 right-5 sm:bottom-7 sm:right-7';

  const instagramHref = sanitizeHref(
    OFFICIAL_CONTACT.marketingSocials.find((s) => s.id === 'instagram')?.url ||
      'https://www.instagram.com/akyinventures/'
  );
  const youtubeHref = sanitizeHref(
    OFFICIAL_CONTACT.marketingSocials.find((s) => s.id === 'youtube')?.url ||
      'https://youtube.com/@akyinmarketing?si=hgB_tEfczt79H7wW'
  );
  const whatsappChannelHref = sanitizeHref(OFFICIAL_CONTACT.whatsappChannelUrl);

  return (
    <div
      ref={containerRef}
      className={`fixed ${positionClass} z-40 print:hidden flex flex-col items-end gap-2.5`}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Direct AKYIN contact channels"
            className="liquid-glass-dropdown rounded-3xl p-4 w-[280px] sm:w-[300px] border border-[#E8E8ED] shadow-2xl space-y-3"
          >
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#1D1D1F]/8">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                  {OFFICIAL_CONTACT.regionIndicator}
                </p>
                <p className="font-display text-sm font-bold text-[#1D1D1F]">
                  Connect With AKYIN
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close contact menu"
                className="w-7 h-7 rounded-full bg-white/85 border border-[#E8E8ED] flex items-center justify-center text-[#1D1D1F] hover:bg-[#F5F5F7] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <a
                href={OFFICIAL_CONTACT.phoneHref}
                className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-2xl bg-white/85 hover:bg-white border border-[#E8E8ED]/80 text-[#1D1D1F] transition-colors"
              >
                <span className="inline-flex items-center gap-2.5 font-semibold">
                  <Phone className="w-4 h-4 text-[#0071E3]" aria-hidden="true" />
                  <span>Call AKYIN</span>
                </span>
                <span className="font-mono-num text-[11px] text-[#6E6E73]">
                  {OFFICIAL_CONTACT.phoneDisplay}
                </span>
              </a>

              <a
                href={`mailto:${OFFICIAL_CONTACT.email}`}
                className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-2xl bg-white/85 hover:bg-white border border-[#E8E8ED]/80 text-[#1D1D1F] transition-colors"
              >
                <span className="inline-flex items-center gap-2.5 font-semibold">
                  <Mail className="w-4 h-4 text-[#0071E3]" aria-hidden="true" />
                  <span>Email AKYIN</span>
                </span>
                <span className="text-[11px] text-[#6E6E73] truncate max-w-[125px]">
                  {OFFICIAL_CONTACT.email}
                </span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onNavigate('/');
                }}
                className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-2xl bg-white/85 hover:bg-white border border-[#E8E8ED]/80 text-[#1D1D1F] transition-colors cursor-pointer"
              >
                <span className="inline-flex items-center gap-2.5 font-semibold">
                  <Globe className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
                  <span>Visit Website</span>
                </span>
                <span className="font-mono-num text-[11px] text-[#6E6E73]">akyin.com</span>
              </button>

              <a
                href={instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-2xl bg-white/85 hover:bg-white border border-[#E8E8ED]/80 text-[#1D1D1F] transition-colors"
              >
                <span className="inline-flex items-center gap-2.5 font-semibold">
                  <svg className="w-4 h-4 text-[#1D1D1F] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <span>Follow Instagram</span>
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#6E6E73]" aria-hidden="true" />
              </a>

              <a
                href={youtubeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-2xl bg-white/85 hover:bg-white border border-[#E8E8ED]/80 text-[#1D1D1F] transition-colors"
              >
                <span className="inline-flex items-center gap-2.5 font-semibold">
                  <svg className="w-4 h-4 text-[#1D1D1F] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                    <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" stroke="none" />
                  </svg>
                  <span>Subscribe on YouTube</span>
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#6E6E73]" aria-hidden="true" />
              </a>

              <a
                href={whatsappChannelHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-2xl bg-[#1D1D1F] text-white hover:bg-[#2A2A2E] transition-colors"
              >
                <span className="inline-flex items-center gap-2.5 font-semibold">
                  <MessageCircle className="w-4 h-4 text-white" aria-hidden="true" />
                  <span>Join WhatsApp Channel</span>
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/80" aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={open ? 'Close quick contact widget' : 'Open quick contact widget'}
        className="h-11 px-4 rounded-full liquid-glass-cta border border-white/95 text-[#1D1D1F] text-xs font-semibold inline-flex items-center gap-2 shadow-[0_14px_34px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3]"
      >
        <Phone className="w-3.5 h-3.5 text-[#0071E3]" aria-hidden="true" />
        <span>Connect</span>
      </button>
    </div>
  );
}
