import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Loader2,
  Lock,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import { OFFICIAL_CONTACT } from '../data/akyinData';
import { PAYMENT_CATALOG_BY_SKU, PaymentSku } from '../data/paymentCatalog';
import {
  RazorpayPaymentResult,
  RazorpayPrefill,
  startRazorpayPayment,
} from '../utils/razorpayClient';
import { sanitizeHref } from '../utils/security';
import { GlassButton } from './liquid-glass';

interface RazorpayCheckoutButtonProps {
  sku: PaymentSku;
  label?: string;
  variant?: 'primary' | 'glass' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  prefill?: RazorpayPrefill;
  referenceId?: string;
  onVerified?: (result: Extract<RazorpayPaymentResult, { status: 'verified' }>) => void;
}

export function RazorpayCheckoutButton({
  sku,
  label,
  variant = 'glass',
  size = 'md',
  className = '',
  prefill,
  referenceId,
  onVerified,
}: RazorpayCheckoutButtonProps) {
  const item = PAYMENT_CATALOG_BY_SKU[sku];
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<RazorpayPaymentResult | null>(null);

  const handlePay = async () => {
    setProcessing(true);
    const outcome = await startRazorpayPayment({
      sku,
      prefill,
      referenceId,
    });
    setProcessing(false);
    setResult(outcome);
    if (outcome.status === 'verified' && onVerified) {
      onVerified(outcome);
    }
  };

  if (result?.status === 'verified') {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 backdrop-blur-md p-3.5 text-xs space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-emerald-900">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
          <span>Payment Verified · {result.displayPrice}</span>
        </div>
        <p className="font-mono-num text-[11px] text-emerald-800 break-all">
          Payment ID: {result.paymentId} · Order: {result.orderId}
        </p>
        <p className="text-[11px] text-emerald-800">
          Verified via server HMAC-SHA256 signature. A confirmation receipt can also be shared via{' '}
          <a
            href={sanitizeHref(
              `https://wa.me/${OFFICIAL_CONTACT.whatsappNumber}?text=${encodeURIComponent(
                `Hello AKYIN Ventures, I completed Razorpay payment ${result.paymentId} (Order ${result.orderId}) for ${result.title} (${result.displayPrice}).`
              )}`,
              OFFICIAL_CONTACT.whatsappUrl
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
          >
            WhatsApp Desk
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <GlassButton
        type="button"
        variant={variant}
        size={size}
        disabled={processing}
        onClick={() => void handlePay()}
        className={className}
      >
        {processing ? (
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
        ) : (
          <CreditCard className="w-4 h-4" aria-hidden="true" />
        )}
        <span>
          {processing
            ? 'Opening Razorpay...'
            : label || `Pay ${item.displayPrice} Online`}
        </span>
      </GlassButton>

      {result?.status === 'unconfigured' && (
        <div
          role="status"
          className="rounded-2xl border border-[#E8E8ED] bg-white/85 backdrop-blur-md p-3.5 text-[11px] text-[#4A4A4F] space-y-2"
        >
          <div className="flex items-start gap-2">
            <Lock className="w-3.5 h-3.5 text-[#1D1D1F] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-semibold text-[#1D1D1F]">
                Razorpay Live Gateway Setup Pending
              </p>
              <p className="mt-0.5 leading-relaxed">
                Add <span className="font-mono-num font-semibold">RAZORPAY_KEY_ID</span> and{' '}
                <span className="font-mono-num font-semibold">RAZORPAY_KEY_SECRET</span> in Settings &rarr; Secrets to enable live UPI, Card &amp; NetBanking settlement, or complete payment via our official WhatsApp desk:
              </p>
            </div>
          </div>
          <a
            href={sanitizeHref(
              `https://wa.me/${OFFICIAL_CONTACT.whatsappNumber}?text=${encodeURIComponent(
                `Hello AKYIN Ventures, I would like a payment link for ${item.title} (${item.displayPrice})${referenceId ? ` (Ref: ${referenceId})` : ''}.`
              )}`,
              OFFICIAL_CONTACT.whatsappUrl
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-[#1D1D1F] hover:underline"
          >
            <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Request Razorpay Link on WhatsApp ({OFFICIAL_CONTACT.phoneDisplay})</span>
          </a>
        </div>
      )}

      {result?.status === 'error' && (
        <div
          role="alert"
          className="rounded-2xl border border-[#FECDCA] bg-[#FEF3F2] p-3 text-[11px] text-[#B42318] flex items-start gap-2"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{result.message}</span>
        </div>
      )}

      {result?.status === 'cancelled' && (
        <p className="text-[11px] text-[#6E6E73] flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#6E6E73]" aria-hidden="true" />
          <span>Checkout closed. No amount was charged.</span>
        </p>
      )}
    </div>
  );
}
