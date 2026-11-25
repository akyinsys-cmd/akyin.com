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
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="liquid-glass-dropdown rounded-2xl px-4 py-3 flex items-center gap-3 max-w-xs sm:max-w-sm"
          >
            <div className="relative w-7 h-7 shrink-0 flex items-center justify-center">
              {!shouldReduceMotion && (
                <motion.span
                  aria-hidden="true"
                  initial={{ scale: 0.75, opacity: 0.55 }}
                  animate={{ scale: 1.55, opacity: 0 }}
                  transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 rounded-full bg-[#067647]/35"
                />
              )}
              <motion.div
                initial={shouldReduceMotion ? false : { scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 460, damping: 22, delay: 0.03 }
                }
                className="relative w-7 h-7 rounded-full bg-[#067647] flex items-center justify-center shadow-xs"
              >
                <svg
                  className="w-4 h-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M5 13l4.5 4.5L19 7"
                    initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { duration: 0.3, delay: 0.1, ease: [0.16, 1, 0.3, 1] }
                    }
                  />
                </svg>
              </motion.div>
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
