import { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle2,
  CreditCard,
  Plus,
  RotateCcw,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { SuiteInvoice, SuitePayment, suiteApi } from '../../services/suiteApi';
import { GlassButton, GlassModal } from '../liquid-glass';
import { ServiceBillingDisclaimer } from '../ServiceBillingDisclaimer';

interface AdminPaymentsPanelProps {
  onChanged?: () => void;
}

export function AdminPaymentsPanel({ onChanged }: AdminPaymentsPanelProps) {
  const [invoices, setInvoices] = useState<SuiteInvoice[]>([]);
  const [payments, setPayments] = useState<SuitePayment[]>([]);
  const [razorpayConfigured, setRazorpayConfigured] = useState(false);
  const [razorpayMode, setRazorpayMode] = useState<'test' | 'live'>('test');
  const [webhookConfigured, setWebhookConfigured] = useState(false);
  const [uaeGatewayEnabled, setUaeGatewayEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [serviceCategories, setServiceCategories] = useState<string[]>([
    'Digital marketing',
    'Bulk SMS Marketing',
    'WhatsApp Business Messaging',
  ]);

  // Create Direct Invoice Modal
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [newInv, setNewInv] = useState({
    customerName: '',
    companyName: '',
    customerEmail: '',
    customerPhone: '',
    serviceCategory: 'Digital marketing',
    leadSource: 'Website',
    currency: 'INR' as 'INR' | 'AED' | 'USD',
    paymentType: 'full' as 'advance' | 'full' | 'consultation' | 'recurring' | 'balance',
    amount: '3998',
    gstEnabled: true,
    gstRate: 18,
    notes: '',
  });

  // Record Manual Settlement Modal
  const [manualInvoice, setManualInvoice] = useState<SuiteInvoice | null>(null);
  const [manualAmount, setManualAmount] = useState('');
  const [manualGateway, setManualGateway] = useState<
    'manual_bank' | 'manual_uae_transfer' | 'cash'
  >('manual_bank');
  const [manualMode, setManualMode] = useState<'live' | 'test'>('live');
  const [manualFee, setManualFee] = useState('0');
  const [manualNote, setManualNote] = useState('');

  // Refund Modal
  const [refundTarget, setRefundTarget] = useState<SuitePayment | null>(null);
  const [refundAmt, setRefundAmt] = useState('');
  const [refundReason, setRefundReason] = useState('Client requested adjustment');

  const loadPayments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await suiteApi.getPayments();
      setInvoices(res.invoices);
      setPayments(res.payments);
      setRazorpayConfigured(res.razorpayConfigured);
      setRazorpayMode(res.razorpayMode);
      setWebhookConfigured(res.webhookConfigured);
      setUaeGatewayEnabled(res.uaeGatewayEnabled);
      suiteApi
        .getServices()
        .then((srvRes) => {
          if (srvRes.categories?.length) setServiceCategories(srvRes.categories);
        })
        .catch(() => undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load payment ledger.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPayments();
  }, [loadPayments]);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await suiteApi.createInvoice({
        ...newInv,
        amount: Math.max(1, Number(newInv.amount) || 0),
        gstRate: Number(newInv.gstRate) || 18,
      });
      setInvoiceModal(false);
      setNotice(`Issued invoice ${res.invoice.invoiceNumber}.`);
      await loadPayments();
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invoice creation failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleRecordManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInvoice) return;
    setSaving(true);
    setError('');
    try {
      await suiteApi.recordManualPayment(manualInvoice.id, {
        amount: Number(manualAmount) || 0,
        gateway: manualGateway,
        mode: manualMode,
        gatewayFeeAmount: Number(manualFee) || 0,
        referenceNote: manualNote,
      });
      setManualInvoice(null);
      setNotice(`Recorded ${manualMode} settlement for ${manualInvoice.invoiceNumber}.`);
      await loadPayments();
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record manual settlement.');
    } finally {
      setSaving(false);
    }
  };

  const handleRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundTarget) return;
    setSaving(true);
    setError('');
    try {
      await suiteApi.refundPayment(refundTarget.id, Number(refundAmt) || 0, refundReason);
      setRefundTarget(null);
      setNotice(`Processed refund on ${refundTarget.id}.`);
      await loadPayments();
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Refund failed.');
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    'w-full rounded-xl border border-[#E8E8ED] bg-white px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F]">
            Invoices &amp; Razorpay Payments
          </h2>
          <p className="text-xs text-[#6E6E73] mt-0.5">
            Live &amp; Test mode separation, server-verified Razorpay signatures, UAE/bank manual fallback, and refund reconciliation.
          </p>
        </div>

        <GlassButton variant="primary" size="sm" onClick={() => setInvoiceModal(true)}>
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Create Direct Invoice</span>
        </GlassButton>
      </div>

      {/* Gateway Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="liquid-glass-card rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <CreditCard className="w-4 h-4 text-[#0071E3]" />
            <span>Razorpay Mode</span>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full font-mono-num text-[11px] font-bold border ${
              razorpayMode === 'live'
                ? 'bg-[#ECFDF3] border-[#ABEFC6] text-[#067647]'
                : 'bg-[#FFF7ED] border-[#FED7AA] text-[#C2410C]'
            }`}
          >
            {razorpayMode.toUpperCase()} {razorpayConfigured ? '' : '(Keys Unset)'}
          </span>
        </div>

        <div className="liquid-glass-card rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#0071E3]" />
            <span>Webhook Verification</span>
          </div>
          <span className="font-mono-num text-[11px] font-bold text-[#1D1D1F]">
            {webhookConfigured ? 'HMAC Active' : 'Secret Unset'}
          </span>
        </div>

        <div className="liquid-glass-card rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <Wallet className="w-4 h-4 text-[#0071E3]" />
            <span>UAE (AED) Handling</span>
          </div>
          <span className="font-mono-num text-[11px] font-bold text-[#1D1D1F]">
            {uaeGatewayEnabled ? 'UAE Gateway Active' : 'Manual Bank Fallback'}
          </span>
        </div>
      </div>

      {notice && (
        <div className="rounded-2xl liquid-glass-panel px-4 py-3 text-xs font-semibold text-[#1D1D1F] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#067647]" />
          <span>{notice}</span>
        </div>
      )}
      {error && (
        <div className="rounded-2xl bg-[#FEF3F2] border border-[#FECDCA] px-4 py-3 text-xs font-semibold text-[#B42318]">
          {error}
        </div>
      )}

      {/* Invoices Table */}
      <div className="liquid-glass-card rounded-3xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8E8ED] flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-[#1D1D1F]">
            Invoices Ledger ({invoices.length})
          </h3>
        </div>
        {loading ? (
          <div className="p-8 text-center text-xs text-[#6E6E73]">Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#6E6E73]">
            No invoices issued yet. Convert an accepted quotation or issue a direct invoice.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5F5F7]/85 border-b border-[#E8E8ED] text-[#6E6E73] font-semibold">
                  <th className="py-3 px-4">Invoice</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Type / Due</th>
                  <th className="py-3 px-4">Total vs Paid</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8ED]">
                {invoices.map((inv) => {
                  const balance = Math.max(0, inv.totalAmount - inv.paidAmount);
                  return (
                    <tr key={inv.id} className="hover:bg-white/75">
                      <td className="py-3.5 px-4 font-mono-num">
                        <p className="font-bold text-[#1D1D1F]">{inv.invoiceNumber}</p>
                        {inv.quotationNumber && (
                          <p className="text-[10px] text-[#6E6E73]">Quote: {inv.quotationNumber}</p>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-[#1D1D1F]">
                          {inv.companyName || inv.customerName}
                        </p>
                        <p className="text-[11px] text-[#6E6E73]">{inv.serviceCategory}</p>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="uppercase font-semibold text-[#1D1D1F]">{inv.paymentType}</p>
                        <p className="font-mono-num text-[10px] text-[#6E6E73]">
                          Due {inv.dueDate}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 font-mono-num whitespace-nowrap">
                        <p className="font-bold text-[#1D1D1F]">
                          {inv.currency} {inv.totalAmount.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[10px] text-[#6E6E73]">
                          Paid: {inv.paidAmount.toLocaleString('en-IN')} · Bal:{' '}
                          {balance.toLocaleString('en-IN')}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold ${
                            inv.status === 'PAID'
                              ? 'bg-[#ECFDF3] border-[#ABEFC6] text-[#067647]'
                              : inv.status === 'REFUNDED'
                                ? 'bg-[#FEF3F2] border-[#FECDCA] text-[#B42318]'
                                : 'bg-white border-[#E8E8ED] text-[#1D1D1F]'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {balance > 0 && inv.status !== 'REFUNDED' && (
                          <button
                            type="button"
                            onClick={() => {
                              setManualInvoice(inv);
                              setManualAmount(String(balance));
                              setManualGateway(
                                inv.currency === 'AED' ? 'manual_uae_transfer' : 'manual_bank'
                              );
                            }}
                            className="px-2.5 py-1.5 rounded-lg border border-[#E8E8ED] bg-white hover:border-[#0071E3] text-[11px] font-semibold cursor-pointer"
                          >
                            Record Settlement
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Transactions Table */}
      <div className="liquid-glass-card rounded-3xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8E8ED]">
          <h3 className="font-display text-base font-bold text-[#1D1D1F]">
            Payment Gateway &amp; Manual Ledger ({payments.length})
          </h3>
        </div>
        {payments.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#6E6E73]">
            No payment attempts or captured settlements recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5F5F7]/85 border-b border-[#E8E8ED] text-[#6E6E73] font-semibold">
                  <th className="py-3 px-4">Payment ID</th>
                  <th className="py-3 px-4">Client &amp; Invoice</th>
                  <th className="py-3 px-4">Gateway / Mode</th>
                  <th className="py-3 px-4">Amount &amp; Fees</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Refund</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8ED]">
                {payments.map((p) => {
                  const canRefund =
                    (p.status === 'captured' || p.status === 'manual_recorded') &&
                    p.amount - p.refundedAmount > 0;
                  return (
                    <tr key={p.id} className="hover:bg-white/75">
                      <td className="py-3.5 px-4 font-mono-num">
                        <p className="font-bold text-[#1D1D1F]">{p.id}</p>
                        {p.razorpayPaymentId && (
                          <p className="text-[10px] text-[#6E6E73]">{p.razorpayPaymentId}</p>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-[#1D1D1F]">{p.customerName}</p>
                        <p className="font-mono-num text-[10px] text-[#6E6E73]">
                          {p.invoiceNumber || p.serviceCategory}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-[#1D1D1F]">{p.gateway}</span>{' '}
                        <span
                          className={`ml-1 px-1.5 py-0.5 rounded font-mono-num text-[10px] font-bold ${
                            p.mode === 'live'
                              ? 'bg-[#ECFDF3] text-[#067647]'
                              : 'bg-[#FFF7ED] text-[#C2410C]'
                          }`}
                        >
                          {p.mode.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono-num whitespace-nowrap">
                        <p className="font-bold text-[#1D1D1F]">
                          {p.currency} {p.amount.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[10px] text-[#6E6E73]">
                          Fee: {p.gatewayFeeAmount} · Refunded: {p.refundedAmount}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold ${
                            p.verified && p.mode === 'live'
                              ? 'bg-[#ECFDF3] border-[#ABEFC6] text-[#067647]'
                              : 'bg-[#F5F5F7] border-[#E8E8ED] text-[#6E6E73]'
                          }`}
                        >
                          {p.status} {p.verified ? '· Verified' : '· Unverified'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {canRefund && (
                          <button
                            type="button"
                            onClick={() => {
                              setRefundTarget(p);
                              setRefundAmt(String(p.amount - p.refundedAmount));
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E8E8ED] bg-white hover:border-[#D92D20] text-[11px] font-semibold text-[#B42318] cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" /> Refund
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Direct Invoice Modal */}
      <GlassModal
        open={invoiceModal}
        onClose={() => setInvoiceModal(false)}
        subtitle="NEW INVOICE"
        title="Issue Direct Invoice"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Customer Name *</label>
              <input
                required
                value={newInv.customerName}
                onChange={(e) => setNewInv({ ...newInv, customerName: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Company Name</label>
              <input
                value={newInv.companyName}
                onChange={(e) => setNewInv({ ...newInv, companyName: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Email *</label>
              <input
                required
                type="email"
                value={newInv.customerEmail}
                onChange={(e) => setNewInv({ ...newInv, customerEmail: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Service Category *</label>
              <select
                required
                value={newInv.serviceCategory}
                onChange={(e) => {
                  const cat = e.target.value;
                  const presetAmount =
                    cat === 'Bulk SMS Marketing'
                      ? '3000'
                      : cat === 'WhatsApp Business Messaging'
                        ? '4999'
                        : newInv.amount;
                  setNewInv({ ...newInv, serviceCategory: cat, amount: presetAmount });
                }}
                className={inputCls}
              >
                {serviceCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Payment Type</label>
              <select
                value={newInv.paymentType}
                onChange={(e) => setNewInv({ ...newInv, paymentType: e.target.value as any })}
                className={inputCls}
              >
                <option value="full">Full Payment</option>
                <option value="advance">Advance</option>
                <option value="consultation">Consultation Fee</option>
                <option value="recurring">Monthly Retainer</option>
                <option value="balance">Balance Settlement</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Currency</label>
              <select
                value={newInv.currency}
                onChange={(e) => setNewInv({ ...newInv, currency: e.target.value as any })}
                className={inputCls}
              >
                <option value="INR">INR (Razorpay Enabled)</option>
                <option value="AED">AED (UAE Manual Fallback)</option>
                <option value="USD">USD (Manual Transfer)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Base Amount *</label>
              <input
                required
                type="number"
                step="0.01"
                min={1}
                value={newInv.amount}
                onChange={(e) => setNewInv({ ...newInv, amount: e.target.value })}
                className={`${inputCls} font-mono-num`}
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="inline-flex items-center gap-2 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={newInv.gstEnabled}
                  onChange={(e) => setNewInv({ ...newInv, gstEnabled: e.target.checked })}
                  className="accent-[#0071E3]"
                />
                <span>Apply 18% GST</span>
              </label>
            </div>
          </div>
          {(newInv.serviceCategory === 'Bulk SMS Marketing' ||
            newInv.serviceCategory === 'WhatsApp Business Messaging') && (
            <ServiceBillingDisclaimer className="my-2" />
          )}
          <div className="flex justify-end gap-2 pt-2">
            <GlassButton variant="subtle" size="sm" onClick={() => setInvoiceModal(false)}>
              Cancel
            </GlassButton>
            <GlassButton type="submit" disabled={saving} variant="primary" size="sm">
              {saving ? 'Issuing...' : 'Issue Invoice'}
            </GlassButton>
          </div>
        </form>
      </GlassModal>

      {/* Record Manual / UAE Settlement Modal */}
      <GlassModal
        open={Boolean(manualInvoice)}
        onClose={() => setManualInvoice(null)}
        subtitle={manualInvoice?.invoiceNumber}
        title="Record Bank / UAE Transfer Settlement"
      >
        {manualInvoice && (
          <form onSubmit={handleRecordManual} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Amount ({manualInvoice.currency})
                </label>
                <input
                  required
                  type="number"
                  step="0.01"
                  min={0.01}
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  className={`${inputCls} font-mono-num`}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Method</label>
                <select
                  value={manualGateway}
                  onChange={(e) => setManualGateway(e.target.value as any)}
                  className={inputCls}
                >
                  <option value="manual_bank">NEFT / IMPS / Bank Transfer</option>
                  <option value="manual_uae_transfer">UAE Bank / AED Transfer</option>
                  <option value="cash">Cash / Verified Receipt</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Mode</label>
                <select
                  value={manualMode}
                  onChange={(e) => setManualMode(e.target.value as any)}
                  className={inputCls}
                >
                  <option value="live">LIVE (Count in Actual Revenue)</option>
                  <option value="test">TEST (Exclude from Revenue)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Bank / Gateway Fee
                </label>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  value={manualFee}
                  onChange={(e) => setManualFee(e.target.value)}
                  className={`${inputCls} font-mono-num`}
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">UTR / Reference Note</label>
              <input
                value={manualNote}
                onChange={(e) => setManualNote(e.target.value)}
                placeholder="UTR number or wire confirmation reference..."
                className={inputCls}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <GlassButton variant="subtle" size="sm" onClick={() => setManualInvoice(null)}>
                Cancel
              </GlassButton>
              <GlassButton type="submit" disabled={saving} variant="primary" size="sm">
                {saving ? 'Recording...' : 'Record Settlement'}
              </GlassButton>
            </div>
          </form>
        )}
      </GlassModal>

      {/* Refund Modal */}
      <GlassModal
        open={Boolean(refundTarget)}
        onClose={() => setRefundTarget(null)}
        subtitle={refundTarget?.id}
        title="Process Partial / Full Refund"
      >
        {refundTarget && (
          <form onSubmit={handleRefund} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">
                Refund Amount ({refundTarget.currency})
              </label>
              <input
                required
                type="number"
                step="0.01"
                min={0.01}
                max={refundTarget.amount - refundTarget.refundedAmount}
                value={refundAmt}
                onChange={(e) => setRefundAmt(e.target.value)}
                className={`${inputCls} font-mono-num`}
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Reason</label>
              <input
                required
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <GlassButton variant="subtle" size="sm" onClick={() => setRefundTarget(null)}>
                Cancel
              </GlassButton>
              <GlassButton type="submit" disabled={saving} variant="primary" size="sm">
                {saving ? 'Processing...' : 'Confirm Refund'}
              </GlassButton>
            </div>
          </form>
        )}
      </GlassModal>
    </div>
  );
}
