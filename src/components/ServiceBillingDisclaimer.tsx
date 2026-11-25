import React from 'react';
import { Info } from 'lucide-react';

export const VERBATIM_MESSAGING_DISCLAIMER =
  'Messaging rates are subject to provider charges, applicable taxes, message category, destination and delivery conditions. Final charges are confirmed in the quotation.';

interface ServiceBillingDisclaimerProps {
  className?: string;
  variant?: 'compact' | 'full' | 'card';
  showSeparationNote?: boolean;
}

export const ServiceBillingDisclaimer: React.FC<ServiceBillingDisclaimerProps> = ({
  className = '',
  variant = 'card',
  showSeparationNote = true,
}) => {
  if (variant === 'compact') {
    return (
      <div
        className={`flex items-start gap-2 text-xs text-amber-700/90 dark:text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5 ${className}`}
      >
        <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {VERBATIM_MESSAGING_DISCLAIMER}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 text-xs text-zinc-700 dark:text-zinc-300 backdrop-blur-sm ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-1.5">
          <p className="font-semibold text-amber-900 dark:text-amber-200 uppercase tracking-wider text-[11px]">
            Commercial & Messaging Billing Disclaimer
          </p>
          <p className="leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium">
            {VERBATIM_MESSAGING_DISCLAIMER}
          </p>
          {showSeparationNote && (
            <div className="pt-1 text-[11px] text-zinc-500 dark:text-zinc-400 border-t border-amber-500/15 space-y-0.5">
              <p>
                • <strong>Bulk SMS:</strong> ₹3,000 for 10,000 SMS credits (₹0.30/SMS). Additional usage calculated using admin rate.
              </p>
              <p>
                • <strong>WhatsApp:</strong> ₹4,999 one-time setup fee is strictly separated from ₹1.50/message usage charges.
              </p>
              <p className="italic">
                • Real-time delivery requires client DLT / Meta WhatsApp Business Account credentials configuration.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceBillingDisclaimer;
