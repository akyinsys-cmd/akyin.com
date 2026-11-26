import { Sparkles } from 'lucide-react';
import { useReducedMotion } from 'motion/react';

export function GlobalLoadingSkeleton() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page content"
      className={`min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-6 ${
        shouldReduceMotion ? '' : 'animate-pulse'
      }`}
    >
      <span className="sr-only">Loading page content...</span>
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#0071E3]/20 to-sky-400/20 flex items-center justify-center shadow-lg border border-white/90">
        <Sparkles
          className={`w-8 h-8 text-[#0071E3] ${shouldReduceMotion ? '' : 'animate-spin'}`}
          aria-hidden="true"
        />
      </div>
      <div className="text-center space-y-2 max-w-sm">
        <div className="h-5 bg-black/10 rounded-full w-48 mx-auto" />
        <div className="h-3.5 bg-black/5 rounded-full w-64 mx-auto" />
      </div>
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
        <div className="h-32 rounded-3xl bg-white/60 border border-white/90 shadow-sm p-5 space-y-3">
          <div className="h-4 bg-black/10 rounded-full w-24" />
          <div className="h-8 bg-black/10 rounded-xl w-full" />
        </div>
        <div className="h-32 rounded-3xl bg-white/60 border border-white/90 shadow-sm p-5 space-y-3">
          <div className="h-4 bg-black/10 rounded-full w-24" />
          <div className="h-8 bg-black/10 rounded-xl w-full" />
        </div>
        <div className="h-32 rounded-3xl bg-white/60 border border-white/90 shadow-sm p-5 space-y-3">
          <div className="h-4 bg-black/10 rounded-full w-24" />
          <div className="h-8 bg-black/10 rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
}
