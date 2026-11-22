import { CheckCircle2 } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

interface CopyToastProps {
  visible: boolean;
  copiedUrl: string;
}

export function CopyToast({ visible, copiedUrl }: CopyToastProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-6 right-6 z-[70] pointer-events-none print:hidden"
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="liquid-glass-dropdown rounded-2xl px-4 py-3 flex items-center gap-3 max-w-xs sm:max-w-sm"
          >
            <div className="w-7 h-7 rounded-full bg-[#1D1D1F] flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#1D1D1F]">Link copied to clipboard</p>
              <p className="font-mono-num text-[11px] text-[#6E6E73] truncate">
                {copiedUrl}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
