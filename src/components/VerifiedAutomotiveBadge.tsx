import { useState } from 'react';
import { Award, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

export function VerifiedAutomotiveBadge() {
  const [isOpen, setIsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        aria-expanded={isOpen}
        aria-describedby="verified-automotive-partner-tooltip"
        className="group inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full frosted-glass border border-purple-200/80 bg-gradient-to-r from-white/90 via-purple-50/70 to-amber-50/60 shadow-[0_6px_20px_rgba(124,58,237,0.08)] hover:shadow-[0_10px_28px_rgba(124,58,237,0.14)] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1D1F]/30"
      >
        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
        </span>
        <span className="text-xs font-semibold tracking-[0.04em] text-[#1D1D1F]">
          Verified Automotive Partner
        </span>
        <span className="px-2 py-0.5 rounded-full bg-white/90 border border-[#1D1D1F]/10 font-mono-num text-[10px] font-bold text-[#1D1D1F]">
          16 YRS
        </span>
        <Info
          className="w-3.5 h-3.5 text-[#6E6E73] group-hover:text-[#1D1D1F] transition-colors"
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="verified-automotive-partner-tooltip"
            role="tooltip"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8, scale: 0.97 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            className="absolute left-0 top-full mt-3 z-40 w-[310px] sm:w-[360px] liquid-glass-dropdown rounded-2xl p-5 text-left"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-100 to-amber-50 border border-white flex items-center justify-center shrink-0 text-[#1D1D1F]">
                  <Award className="w-4 h-4 text-purple-700" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.06em] text-purple-700">
                    16 Years Automotive Domain Legacy
                  </p>
                  <h4 className="font-display text-sm font-bold text-[#1D1D1F] mt-0.5">
                    Maruti Suzuki to Audi Exposure
                  </h4>
                </div>
              </div>

              <p className="text-xs text-[#6E6E73] leading-relaxed">
                Backed by <strong className="text-[#1D1D1F]">16 years of hands-on automotive industry experience</strong> across showroom floor operations, multi-brand dealership growth, and commercial sales team coaching.
              </p>

              <ul className="space-y-1.5 pt-2 border-t border-[#1D1D1F]/8 text-[11px] text-[#1D1D1F]/90">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-700 shrink-0" aria-hidden="true" />
                  <span>Separate Lead Generation &amp; Lead Filtering</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-700 shrink-0" aria-hidden="true" />
                  <span>Test-Drive Volume &amp; CRM Discipline Workflows</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-700 shrink-0" aria-hidden="true" />
                  <span>On-Site &amp; Virtual Dealership Sales Coaching</span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
