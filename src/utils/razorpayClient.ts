import { OFFICIAL_CONTACT } from '../data/akyinData';
import { PaymentCatalogItem, PaymentSku } from '../data/paymentCatalog';

export interface RazorpayGatewayConfig {
  configured: boolean;
  mode?: 'test' | 'live';
  keyId: string | null;
  currency: 'INR';
  catalog: PaymentCatalogItem[];
}

export interface RazorpayPrefill {
  name?: string;
  email?: string;
  contact?: string;
}

export type RazorpayPaymentResult =
  | {
      status: 'verified';
      mode?: 'test' | 'live';
      orderId: string;
      paymentId: string;
      sku?: PaymentSku | null;
      invoiceId?: string | null;
      title: string;
      displayPrice: string;
      verifiedAt: string;
    }
  | {
      status: 'unconfigured';
      message: string;
    }
  | {
      status: 'cancelled';
    }
  | {
      status: 'error';
      message: string;
    };

interface RazorpayHandlerResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayCheckoutInstance {
  open: () => void;
  on: (
    event: string,
    handler: (response: { error?: { description?: string } }) => void
  ) => void;
}

interface RazorpayWindowConstructor {
  new (options: Record<string, unknown>): RazorpayCheckoutInstance;
}

declare global {
  interface Window {
    Razorpay?: RazorpayWindowConstructor;
  }
}

let scriptLoadPromise: Promise<boolean> | null = null;

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 15000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export async function fetchRazorpayConfig(): Promise<RazorpayGatewayConfig> {
  try {
    const res = await fetchWithTimeout('/api/razorpay/config');
    if (!res.ok) {
      return { configured: false, keyId: null, currency: 'INR', catalog: [] };
    }
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return { configured: false, keyId: null, currency: 'INR', catalog: [] };
    }
    return (await res.json()) as RazorpayGatewayConfig;
  } catch {
    return { configured: false, keyId: null, currency: 'INR', catalog: [] };
  }
}

export function loadRazorpayCheckoutScript(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (scriptLoadPromise) return scriptLoadPromise;

  scriptLoadPromise = new Promise<boolean>((resolve) => {
    let settled = false;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      if (!ok) {
        scriptLoadPromise = null;
      }
      resolve(ok);
    };

    const timeoutId = window.setTimeout(() => finish(false), 15000);

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) {
      existing.addEventListener('load', () => finish(Boolean(window.Razorpay)), { once: true });
      existing.addEventListener('error', () => finish(false), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => finish(Boolean(window.Razorpay));
    script.onerror = () => finish(false);
    document.body.appendChild(script);
  });

  return scriptLoadPromise;
}

export async function startRazorpayPayment(params: {
  sku?: PaymentSku;
  invoiceId?: string;
  prefill?: RazorpayPrefill;
  referenceId?: string;
}): Promise<RazorpayPaymentResult> {
  try {
    const orderRes = await fetchWithTimeout('/api/razorpay/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sku: params.sku,
        invoiceId: params.invoiceId,
        customerName: params.prefill?.name?.trim() || '',
        customerEmail: params.prefill?.email?.trim() || '',
        customerPhone: params.prefill?.contact?.trim() || '',
        referenceId: params.referenceId?.trim() || '',
      }),
    });

    const orderData = (await orderRes.json().catch(() => ({}))) as {
      orderId?: string;
      amount?: number;
      currency?: string;
      keyId?: string;
      title?: string;
      displayPrice?: string;
      description?: string;
      error?: string;
      code?: string;
    };

    if (orderRes.status === 503 || orderData.code === 'RAZORPAY_NOT_CONFIGURED') {
      return {
        status: 'unconfigured',
        message:
          orderData.error ||
          'Razorpay checkout requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to be configured in Settings > Secrets.',
      };
    }

    if (!orderRes.ok || !orderData.orderId || !orderData.keyId) {
      return {
        status: 'error',
        message: orderData.error || 'Could not initialize Razorpay checkout order.',
      };
    }

    const sdkReady = await loadRazorpayCheckoutScript();
    if (!sdkReady || !window.Razorpay) {
      return {
        status: 'error',
        message:
          'Unable to load Razorpay Checkout script. Please check your connection or ad-blocker settings.',
      };
    }

    const RazorpaySDK = window.Razorpay;

    return await new Promise<RazorpayPaymentResult>((resolve) => {
      let settled = false;

      const rzp = new RazorpaySDK({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'AKYIN Ventures',
        description: orderData.title || 'AKYIN Commercial Services',
        order_id: orderData.orderId,
        prefill: {
          name: params.prefill?.name || '',
          email: params.prefill?.email || '',
          contact: params.prefill?.contact || '',
        },
        notes: {
          sku: params.sku,
          referenceId: params.referenceId || 'direct-web',
          supportEmail: OFFICIAL_CONTACT.email,
        },
        theme: {
          color: '#1D1D1F',
          backdrop_color: 'rgba(29, 29, 31, 0.45)',
        },
        modal: {
          ondismiss: () => {
            if (!settled) {
              settled = true;
              resolve({ status: 'cancelled' });
            }
          },
        },
        handler: async (response: RazorpayHandlerResponse) => {
          try {
            const verifyRes = await fetchWithTimeout('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                sku: params.sku,
                invoiceId: params.invoiceId,
              }),
            });

            const verifyJson = (await verifyRes.json().catch(() => ({}))) as {
              verified?: boolean;
              mode?: 'test' | 'live';
              orderId?: string;
              paymentId?: string;
              verifiedAt?: string;
              error?: string;
            };

            if (!settled) {
              settled = true;
              if (verifyRes.ok && verifyJson.verified && verifyJson.paymentId) {
                resolve({
                  status: 'verified',
                  mode: verifyJson.mode || 'test',
                  orderId: verifyJson.orderId || response.razorpay_order_id,
                  paymentId: verifyJson.paymentId,
                  sku: params.sku || null,
                  invoiceId: params.invoiceId || null,
                  title: orderData.title || 'AKYIN Service',
                  displayPrice: orderData.displayPrice || 'INR',
                  verifiedAt: verifyJson.verifiedAt || new Date().toISOString(),
                });
              } else {
                resolve({
                  status: 'error',
                  message:
                    verifyJson.error ||
                    'Payment received but signature verification failed. Please contact connect@akyin.com.',
                });
              }
            }
          } catch {
            if (!settled) {
              settled = true;
              resolve({
                status: 'error',
                message:
                  'Payment completed but verification timed out. Save your transaction ID and contact connect@akyin.com.',
              });
            }
          }
        },
      });

      rzp.on('payment.failed', (failure) => {
        if (!settled) {
          settled = true;
          resolve({
            status: 'error',
            message:
              failure?.error?.description || 'Payment failed or was declined by the bank.',
          });
        }
      });

      rzp.open();
    });
  } catch (err) {
    return {
      status: 'error',
      message: err instanceof Error ? err.message : 'Unable to start Razorpay checkout.',
    };
  }
}
