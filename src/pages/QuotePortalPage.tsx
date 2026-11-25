import { useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowLeftRight,
  CheckCircle2,
  CreditCard,
  FileText,
  Printer,
  Search,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { AppRoute, OFFICIAL_CONTACT } from '../data/akyinData';
import { suiteApi } from '../services/suiteApi';
import { startRazorpayPayment } from '../utils/razorpayClient';
import { AkyinLogo } from '../components/AkyinLogo';
import { GlassButton, GlassPanel } from '../components/liquid-glass';
import { InteractiveQuotationBuilder } from '../components/InteractiveQuotationBuilder';
import { ServiceBillingDisclaimer } from '../components/ServiceBillingDisclaimer';

interface QuotePortalPageProps {
  onNavigate: (route: AppRoute) => void;
}

function fmtMoney(val: number, cur: 'INR' | 'AED' | 'USD' = 'INR'): string {
  return new Intl.NumberFormat(cur === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency: cur,
    maximumFractionDigits: 2,
  }).format(val || 0);
}

export function QuotePortalPage({ onNavigate }: QuotePortalPageProps) {
  const initialToken =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('token') || ''
      : '';

  const [token, setToken] = useState(initialToken);
  const [tokenInput, setTokenInput] = useState('');
  const [showCompareDrawer, setShowCompareDrawer] = useState(false);

  const [loading, setLoading] = useState(Boolean(initialToken));
  const [error, setError] = useState('');
  const [data, setData] = useState<Awaited<ReturnType<typeof suiteApi.fetchPublicQuote>> | null>(
    null
  );
  const [responseNote, setResponseNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [paying, setPaying] = useState(false);

  const loadQuote = useCallback(async () => {
    if (!token) {
      setData(null);
      setError('');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await suiteApi.fetchPublicQuote(token);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Quotation not found.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadQuote();
  }, [loadQuote]);

  const handleLookupToken = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = tokenInput.trim();
    if (!cleaned) return;
    setToken(cleaned);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('token', cleaned);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleRespond = async (decision: 'ACCEPTED' | 'REJECTED') => {
    setSubmitting(true);
    setError('');
    try {
      await suiteApi.respondToQuote(token, decision, responseNote);
      await loadQuote();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save response.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayInvoice = async () => {
    if (!data?.invoice) return;
    setPaying(true);
    setPaymentMessage('');
    const result = await startRazorpayPayment({
      invoiceId: data.invoice.id,
      prefill: {
        name: data.quotation.customerName,
      },
      referenceId: data.invoice.invoiceNumber,
    });
    setPaying(false);
    if (result.status === 'verified') {
      setPaymentMessage(
        `Payment verified (${result.mode?.toUpperCase()} mode · Ref ${result.paymentId}). Invoice updated.`
      );
      await loadQuote();
    } else if (result.status === 'unconfigured' || result.status === 'error') {
      setPaymentMessage(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] py-10 px-4 sm:px-6 lg:px-8">
      <div className={`${!token ? 'max-w-7xl' : 'max-w-5xl'} mx-auto space-y-6`}>
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Return to AKYIN.com
          </button>
          <div className="flex flex-wrap items-center gap-2">
            {token && data && (
              <GlassButton
                variant={showCompareDrawer ? 'primary' : 'subtle'}
                size="sm"
                onClick={() => setShowCompareDrawer((v) => !v)}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>{showCompareDrawer ? 'Hide Plan Comparison' : 'Compare Plans (One-Time vs Monthly)'}</span>
              </GlassButton>
            )}
            {data && (
              <GlassButton variant="subtle" size="sm" onClick={() => window.print()}>
                <Printer className="w-3.5 h-3.5" /> Print / Save A4 PDF
              </GlassButton>
            )}
          </div>
        </div>

        {!token ? (
          <div className="space-y-8">
            <GlassPanel className="p-6 sm:p-8 bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <AkyinLogo size="sm" />
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1D1D1F]">
                  AKYIN Quotation Portal &amp; Interactive Estimator
                </h1>
                <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed">
                  Build an independent quotation below using our standalone service catalogue and the Compare Plans toggle (One-Time Project vs. Monthly Subscription), or enter an issued quotation token to review and approve your official proposal.
                </p>
              </div>
              <form onSubmit={handleLookupToken} className="flex flex-wrap items-center gap-2 shrink-0">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#A1A1A6] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                  <input
                    type="text"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="Enter quote share token..."
                    className="pl-8 pr-3 py-2 rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] text-xs font-mono-num text-[#1D1D1F] w-56 focus:outline-none focus:border-[#0071E3]"
                  />
                </div>
                <GlassButton type="submit" variant="primary" size="sm">
                  Open Issued Quote
                </GlassButton>
              </form>
            </GlassPanel>

            <InteractiveQuotationBuilder />
          </div>
        ) : loading ? (
          <GlassPanel className="p-10 text-center text-sm text-[#6E6E73]">
            Loading commercial quotation...
          </GlassPanel>
        ) : error || !data ? (
          <div className="space-y-6">
            <GlassPanel className="p-10 text-center space-y-3">
              <FileText className="w-8 h-8 mx-auto text-[#6E6E73]" />
              <h1 className="font-display text-xl font-bold">Quotation Unavailable</h1>
              <p className="text-sm text-[#6E6E73]">{error || 'Invalid quotation link.'}</p>
              <div className="pt-2">
                <GlassButton
                  variant="subtle"
                  size="sm"
                  onClick={() => {
                    setToken('');
                    if (typeof window !== 'undefined') {
                      const url = new URL(window.location.href);
                      url.searchParams.delete('token');
                      window.history.replaceState({}, '', url.toString());
                    }
                  }}
                >
                  Open Interactive Quotation Builder Instead
                </GlassButton>
              </div>
            </GlassPanel>
          </div>
        ) : (
          <GlassPanel className="p-7 sm:p-10 bg-white space-y-8 shadow-sm">
            {/* Quotation Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-[#E8E8ED] pb-6">
              <div className="space-y-2">
                <AkyinLogo size="sm" />
                <p className="text-xs text-[#6E6E73]">
                  AKYIN Ventures · {OFFICIAL_CONTACT.email} · WhatsApp Connect
                </p>
              </div>
              <div className="sm:text-right space-y-1">
                <p className="font-mono-num text-xs font-bold text-[#0071E3]">
                  {data.quotation.quoteNumber} (v{data.quotation.version})
                </p>
                <p className="font-display text-2xl font-bold">Commercial Quotation</p>
                <p className="text-xs font-semibold text-[#1D1D1F]">
                  Status: <span className="text-[#0071E3]">{data.quotation.status}</span> · Valid until{' '}
                  {data.quotation.expiryDate}
                </p>
              </div>
            </div>

            {/* Client Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#F5F5F7] rounded-2xl p-5">
              <div>
                <p className="text-[#6E6E73] font-semibold uppercase tracking-wider text-[10px]">
                  Prepared For
                </p>
                <p className="font-bold text-sm text-[#1D1D1F] mt-1">
                  {data.quotation.companyName || data.quotation.customerName}
                </p>
                <p className="text-[#6E6E73]">{data.quotation.customerName}</p>
                {data.quotation.cityCountry && (
                  <p className="text-[#6E6E73]">{data.quotation.cityCountry}</p>
                )}
              </div>
              <div className="sm:text-right">
                <p className="text-[#6E6E73] font-semibold uppercase tracking-wider text-[10px]">
                  Currency &amp; Terms
                </p>
                <p className="font-mono-num font-bold text-sm mt-1">{data.quotation.currency}</p>
                <p className="text-[#6E6E73] mt-0.5">{data.quotation.paymentTerms}</p>
              </div>
            </div>

            {/* Line Items */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E8E8ED] text-[#6E6E73]">
                    <th className="py-2.5 pr-3">Deliverable / Line Item</th>
                    <th className="py-2.5 px-3 text-right">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 pl-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8ED]">
                  {data.quotation.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 pr-3">
                        <p className="font-semibold text-[#1D1D1F]">{item.title}</p>
                        {item.description && (
                          <p className="text-[#6E6E73] mt-0.5">{item.description}</p>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-mono-num">{item.qty}</td>
                      <td className="py-3 px-3 text-right font-mono-num">
                        {fmtMoney(item.unitPrice, data.quotation.currency)}
                      </td>
                      <td className="py-3 pl-3 text-right font-mono-num font-semibold">
                        {fmtMoney(item.lineTotal, data.quotation.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Breakdown */}
            <div className="space-y-4">
              <div className="flex justify-end">
                <div className="w-full sm:w-96 space-y-2 text-xs font-mono-num bg-[#F5F5F7] rounded-2xl p-5">
                  {data.quotation.oneTimeSubtotal !== undefined && data.quotation.oneTimeSubtotal > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#6E6E73]">One-Time Subtotal</span>
                      <span>{fmtMoney(data.quotation.oneTimeSubtotal, data.quotation.currency)}</span>
                    </div>
                  )}
                  {data.quotation.monthlySubtotal !== undefined && data.quotation.monthlySubtotal > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#6E6E73]">Monthly Recurring</span>
                      <span>{fmtMoney(data.quotation.monthlySubtotal, data.quotation.currency)}</span>
                    </div>
                  )}
                  {data.quotation.usageSubtotal !== undefined && data.quotation.usageSubtotal > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#6E6E73]">Usage-Based Metering</span>
                      <span>{fmtMoney(data.quotation.usageSubtotal, data.quotation.currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1 border-t border-[#E8E8ED]">
                    <span className="text-[#6E6E73]">Gross Subtotal</span>
                    <span>{fmtMoney(data.quotation.subtotal, data.quotation.currency)}</span>
                  </div>
                  {data.quotation.discountAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#6E6E73]">Discount</span>
                      <span>-{fmtMoney(data.quotation.discountAmount, data.quotation.currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#6E6E73]">Taxable Amount</span>
                    <span>{fmtMoney(data.quotation.taxableAmount, data.quotation.currency)}</span>
                  </div>
                  {data.quotation.gstEnabled && (
                    <div className="flex justify-between">
                      <span className="text-[#6E6E73]">GST ({data.quotation.gstRate}%)</span>
                      <span>{fmtMoney(data.quotation.gstAmount, data.quotation.currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-[#1D1D1F] pt-2 border-t border-[#E8E8ED]">
                    <span>Payable Upfront Now</span>
                    <span className="text-[#0071E3]">
                      {fmtMoney(data.quotation.grandTotal, data.quotation.currency)}
                    </span>
                  </div>
                  {data.quotation.futureRecurringAmount !== undefined && data.quotation.futureRecurringAmount > 0 && (
                    <div className="pt-2 border-t border-[#E8E8ED] text-[11px] font-sans font-semibold text-[#0071E3] flex justify-between">
                      <span>Future Monthly Recurring:</span>
                      <span className="font-mono-num">{fmtMoney(data.quotation.futureRecurringAmount, data.quotation.currency)}/mo</span>
                    </div>
                  )}
                </div>
              </div>
              <ServiceBillingDisclaimer />
            </div>

            {/* Scope & Exclusions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {data.quotation.scopeOfWork && (
                <div className="rounded-2xl border border-[#E8E8ED] p-4 space-y-1">
                  <p className="font-bold text-[#1D1D1F]">Scope &amp; Deliverables</p>
                  <p className="text-[#6E6E73] whitespace-pre-line leading-relaxed">
                    {data.quotation.scopeOfWork}
                  </p>
                </div>
              )}
              {data.quotation.exclusions && (
                <div className="rounded-2xl border border-[#E8E8ED] p-4 space-y-1">
                  <p className="font-bold text-[#1D1D1F]">Exclusions &amp; Conditions</p>
                  <p className="text-[#6E6E73] whitespace-pre-line leading-relaxed">
                    {data.quotation.exclusions}
                  </p>
                </div>
              )}
            </div>

            {/* Customer Response Section */}
            <div className="border-t border-[#E8E8ED] pt-6 space-y-4 print:hidden">
              {data.quotation.status === 'ACCEPTED' || data.quotation.status === 'REJECTED' ? (
                <div className="rounded-2xl bg-[#F5F5F7] p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#0071E3] shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-[#1D1D1F]">
                      Quotation {data.quotation.status} on{' '}
                      {data.quotation.respondedAt?.slice(0, 10)}
                    </p>
                    {data.quotation.customerResponseNote && (
                      <p className="text-[#6E6E73]">Note: {data.quotation.customerResponseNote}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-[#1D1D1F]">
                    Explicit Customer Approval (Viewing does not auto-accept)
                  </p>
                  <textarea
                    rows={2}
                    value={responseNote}
                    onChange={(e) => setResponseNote(e.target.value)}
                    placeholder="Optional note, PO reference, or requested revision..."
                    className="w-full rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] px-3 py-2 text-xs text-[#1D1D1F]"
                  />
                  <div className="flex flex-wrap gap-3">
                    <GlassButton
                      variant="primary"
                      size="md"
                      disabled={submitting}
                      onClick={() => void handleRespond('ACCEPTED')}
                    >
                      <CheckCircle2 className="w-4 h-4" /> Accept Quotation
                    </GlassButton>
                    <GlassButton
                      variant="subtle"
                      size="md"
                      disabled={submitting}
                      onClick={() => void handleRespond('REJECTED')}
                    >
                      <XCircle className="w-4 h-4 text-[#D92D20]" /> Decline Quotation
                    </GlassButton>
                  </div>
                </div>
              )}

              {/* Linked Invoice Payment */}
              {data.invoice && (
                <div className="rounded-2xl border border-[#0071E3]/25 bg-[#F5F5F7] p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-mono-num text-xs font-bold text-[#0071E3]">
                        Invoice {data.invoice.invoiceNumber} · {data.invoice.status}
                      </p>
                      <p className="text-sm font-bold text-[#1D1D1F]">
                        Balance Due:{' '}
                        {fmtMoney(
                          Math.max(0, data.invoice.totalAmount - data.invoice.paidAmount),
                          data.invoice.currency
                        )}
                      </p>
                    </div>

                    {data.invoice.status !== 'PAID' &&
                      data.invoice.currency === 'INR' && (
                        <GlassButton
                          variant="primary"
                          size="md"
                          disabled={paying}
                          onClick={() => void handlePayInvoice()}
                        >
                          <CreditCard className="w-4 h-4" />
                          {paying ? 'Initializing Razorpay...' : 'Pay via Razorpay (INR)'}
                        </GlassButton>
                      )}
                  </div>

                  {data.invoice.currency !== 'INR' && (
                    <div className="flex items-start gap-2 text-xs text-[#6E6E73]">
                      <ShieldCheck className="w-4 h-4 text-[#1D1D1F] shrink-0 mt-0.5" />
                      <span>
                        {data.uaeGatewayNote ||
                          'International / AED settlement is processed via official AKYIN bank transfer invoice. Contact connect@akyin.com for transfer coordinates.'}
                      </span>
                    </div>
                  )}

                  {paymentMessage && (
                    <p className="text-xs font-semibold text-[#0071E3]">{paymentMessage}</p>
                  )}
                </div>
              )}
            </div>
          </GlassPanel>
        )}

        {token && data && showCompareDrawer && (
          <div className="space-y-3 print:hidden">
            <div className="rounded-2xl border border-[#0071E3]/25 bg-white px-5 py-3 text-xs text-[#6E6E73]">
              <span className="font-semibold text-[#1D1D1F]">Optional Comparison Simulator:</span>{' '}
              Use this interactive builder to compare One-Time Project vs. Monthly Subscription rates or request an amended quotation. Your official issued quotation above remains unchanged until re-issued.
            </div>
            <InteractiveQuotationBuilder />
          </div>
        )}
      </div>
    </div>
  );
}
