import { ArrowRight, CheckCircle2, Lock, Mail, MessageCircle, ShieldCheck } from 'lucide-react';
import {
  AppRoute,
  MESSAGING_DISCLAIMER,
  OFFICIAL_CONTACT,
  RATE_CARD_ITEMS,
} from '../data/akyinData';
import { PAYMENT_CATALOG_LIST } from '../data/paymentCatalog';
import { EditorialReveal } from '../components/EditorialReveal';
import { InteractiveQuotationBuilder } from '../components/InteractiveQuotationBuilder';
import { GlassButton, GlassCard, GlassPanel } from '../components/liquid-glass';
import { PricingLiveChatWidget } from '../components/PricingLiveChatWidget';
import { RazorpayCheckoutButton } from '../components/RazorpayCheckoutButton';
import { ServiceBillingDisclaimer } from '../components/ServiceBillingDisclaimer';

interface PricingPageProps {
  onNavigate: (route: AppRoute) => void;
  onStartEnquiry: (options: {
    category: string;
    vertical: string;
    enquiryType?: string;
  }) => void;
}

export function PricingPage({ onNavigate, onStartEnquiry }: PricingPageProps) {
  return (
    <div>
      {/* Header */}
      <section className="surface-silver-gradient text-[#1D1D1F] pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
            Transparent Pricing &amp; Commercial Terms · INR
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-[-0.025em] leading-[1.06] text-balance max-w-4xl">
            Standalone Service Rates, Advisory Fees &amp; Custom Quotes.
          </h1>
          <p className="text-base sm:text-lg text-[#6E6E73] max-w-3xl leading-relaxed">
            Every standalone service, sales coaching workshop, messaging setup, and advisory consultation at AKYIN Ventures is published transparently with zero compulsory bundles. Advertising spend is always paid directly to Meta or Google by the client.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
            <a
              href={`mailto:${OFFICIAL_CONTACT.email}`}
              className="inline-flex items-center gap-1.5 font-semibold text-[#1D1D1F] hover:underline"
            >
              <Mail className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{OFFICIAL_CONTACT.email}</span>
            </a>
            <span aria-hidden="true" className="text-[#A1A1A6]">·</span>
            <a
              href={OFFICIAL_CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-[#1D1D1F] hover:text-[#0071E3] hover:underline"
            >
              <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>WhatsApp Connect</span>
            </a>
            <span aria-hidden="true" className="text-[#A1A1A6]">·</span>
            <a
              href="/terms"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/terms');
              }}
              className="font-semibold text-[#1D1D1F] hover:underline"
            >
              Commercial Engagement Terms
            </a>
            <span aria-hidden="true" className="text-[#A1A1A6]">·</span>
            <a
              href="#quotation-builder"
              className="inline-flex items-center gap-1.5 font-semibold text-[#0071E3] hover:underline"
            >
              <span>Interactive Quotation Builder &amp; Compare Plans</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* Core Standalone Services & Onboarding Settlement */}
      <section className="py-16 lg:py-24 bg-[#FFFFFF]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                AKYIN MARKETINGS · Modular Standalone Rates
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F]">
                Independent Growth, Qualification &amp; Creative Services.
              </h2>
              <p className="text-sm text-[#6E6E73]">
                Choose individual services independently—no forced multi-service bundles. Ad spend is paid directly to Meta or Google.
              </p>
            </div>
            <GlassButton
              href="/ventures/marketing#marketing-services"
              variant="glass"
              size="md"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                onNavigate('/ventures/marketing');
              }}
            >
              <span>Browse All 10 Categories</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </GlassButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                sku: PAYMENT_CATALOG_LIST[1].sku,
                category: 'Digital Marketing',
                slug: '/services/meta-ads-management' as AppRoute,
                title: 'Full-Service Growth Marketing & Meta Ads',
                fee: '₹40,000 / mo',
                setupNote: 'Optional onboarding setup: ₹79,998 one-time',
                description:
                  'Dedicated Google & Meta advertising setup, creative testing, and conversion reporting. Paid independently without mandatory bundles.',
              },
              {
                sku: PAYMENT_CATALOG_LIST[2].sku,
                category: 'Lead Management and CRM',
                slug: '/services/lead-filtering' as AppRoute,
                title: 'Lead Filtering & Qualification',
                fee: '₹24,000 / mo',
                setupNote: 'Optional onboarding setup: ₹29,998 one-time',
                description:
                  'Standalone screening and verification of your existing inbound leads into Hot, Warm, and Follow-up priorities.',
              },
              {
                sku: PAYMENT_CATALOG_LIST[3].sku,
                category: 'Business Consulting and Training',
                slug: '/services/commercial-dealership-sales-training' as AppRoute,
                title: 'Commercial & Dealership Sales Training',
                fee: '₹50,000 / session',
                setupNote: 'On-site showroom or executive team workshop',
                description:
                  'Single-session structured sales coaching covering client greeting, product walkthroughs, objection handling, and closing.',
              },
            ].map((item) => (
              <div
                key={item.sku}
                className="liquid-glass-card rounded-3xl p-7 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-[#0071E3] uppercase tracking-wider">
                    {item.category}
                  </span>
                  <h3 className="font-display text-xl font-bold text-[#1D1D1F]">
                    {item.title}
                  </h3>
                  <div className="py-3 border-y border-[#1D1D1F]/10 space-y-1">
                    <p className="font-mono-num text-2xl font-bold text-[#1D1D1F]">
                      {item.fee}
                    </p>
                    <p className="text-xs text-[#6E6E73]">{item.setupNote}</p>
                  </div>
                  <p className="text-xs text-[#6E6E73] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-2.5">
                  <GlassButton
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => onNavigate(item.slug)}
                  >
                    <span>View Standalone Scope</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </GlassButton>
                  <RazorpayCheckoutButton
                    sku={item.sku}
                    label={
                      item.sku === 'sales-training'
                        ? 'Pay ₹50,000 Session Fee'
                        : item.sku === 'growth-marketing-setup'
                          ? 'Pay ₹79,998 Setup Fee'
                          : 'Pay ₹29,998 Setup Fee'
                    }
                    variant="glass"
                    size="sm"
                    className="w-full"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Razorpay Verified Online Settlement Desk Banner */}
          <GlassPanel className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <span className="w-9 h-9 rounded-2xl frosted-glass-pill flex items-center justify-center text-[#1D1D1F] shrink-0">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              </span>
              <div className="space-y-1">
                <p className="text-sm font-bold text-[#1D1D1F]">
                  Razorpay INR Checkout · UPI, Cards &amp; NetBanking
                </p>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  All online setup fees, training workshops, and advisory settlements verify server-side with HMAC-SHA256 signatures. Ad media budgets remain billed directly to Meta or Google.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full frosted-glass-pill text-[11px] font-mono-num font-semibold text-[#1D1D1F] shrink-0">
              <Lock className="w-3 h-3" aria-hidden="true" />
              <span>Razorpay Secured · INR</span>
            </span>
          </GlassPanel>

          {/* Advisory, Training & Ecosystem Offers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <GlassCard className="p-6 sm:p-7 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#6E6E73]">
                  Training &amp; Coaching
                </p>
                <h3 className="font-display text-xl font-bold text-[#1D1D1F]">
                  Sales &amp; Personality Training
                </h3>
                <p className="font-mono-num text-2xl font-bold text-[#1D1D1F]">
                  ₹50,000 <span className="text-xs font-medium text-[#6E6E73]">/ session</span>
                </p>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  On-site commercial sales training, automotive dealership floor coaching, and executive grooming workshops.
                </p>
              </div>
              <RazorpayCheckoutButton
                sku="sales-training"
                label="Pay ₹50,000 via Razorpay"
                variant="glass"
                size="sm"
                className="w-full"
              />
            </GlassCard>

            <GlassCard className="p-6 sm:p-7 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#6E6E73]">
                  Executive Consultation
                </p>
                <h3 className="font-display text-xl font-bold text-[#1D1D1F]">
                  1-on-1 Business Advisory
                </h3>
                <p className="font-mono-num text-2xl font-bold text-[#1D1D1F]">
                  ₹3,998 <span className="text-xs font-medium text-[#6E6E73]">/ 30-min IST session</span>
                </p>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  Strategic consultation covering business feasibility, sales conversion discipline, and venture rollout.
                </p>
              </div>
              <div className="space-y-2">
                <RazorpayCheckoutButton
                  sku="advisory-session"
                  label="Pay ₹3,998 via Razorpay"
                  variant="glass"
                  size="sm"
                  className="w-full"
                />
                <button
                  type="button"
                  onClick={() => onNavigate('/advisory')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D1D1F] hover:underline cursor-pointer pt-1"
                >
                  <span>Select IST Slot &amp; Book</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </GlassCard>

            <GlassCard className="p-6 sm:p-7 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#6E6E73]">
                Publishing &amp; Platforms
              </p>
              <h3 className="font-display text-xl font-bold text-[#1D1D1F]">
                Books, Retail &amp; AI Tools
              </h3>
              <p className="font-mono-num text-2xl font-bold text-[#1D1D1F]">
                ₹0 – ₹999 <span className="text-xs font-medium text-[#6E6E73]">/ public access</span>
              </p>
              <p className="text-xs text-[#6E6E73] leading-relaxed">
                AICalc.in basic AI calculation tools are free; AKYIN Publishing editions and AKYIN Thrift apparel feature marketplace pricing.
              </p>
            </GlassCard>
          </div>
          {/* Bulk SMS & WhatsApp Business Messaging Services */}
          <div className="pt-8 space-y-6">
            <div className="max-w-3xl space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                Business Messaging &amp; Direct Communication · Default INR (International Configurable)
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[#1D1D1F]">
                Bulk SMS Marketing &amp; WhatsApp Business Messaging Setup.
              </h2>
              <p className="text-sm text-[#6E6E73] leading-relaxed">
                All default prices are in INR. International AED/USD rates can be configured separately in formal quotations. Provider APIs are activated only after client provider credentials are configured and verified.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bulk SMS Marketing */}
              <div className="liquid-glass-card rounded-3xl p-7 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono-num text-xs font-bold text-[#1D1D1F]">
                      SERVICE 01 · BULK SMS
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#FFF7ED] border border-[#FED7AA] text-[10px] font-semibold text-[#C2410C]">
                      Provider API Pending Setup
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-[#1D1D1F]">
                      Bulk SMS Marketing
                    </h3>
                    <p className="text-xs text-[#6E6E73] mt-1">
                      Additional SMS credits calculated dynamically using admin-configured per-SMS rate.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 py-4 border-y border-[#1D1D1F]/10">
                    <div>
                      <p className="text-[11px] text-[#6E6E73]">Package Price</p>
                      <p className="font-mono-num text-xl font-bold text-[#1D1D1F] mt-0.5">
                        ₹3,000
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#6E6E73]">Included Credits</p>
                      <p className="font-mono-num text-xl font-bold text-[#1D1D1F] mt-0.5">
                        10,000 SMS
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#6E6E73]">Effective Rate</p>
                      <p className="font-mono-num text-xl font-bold text-[#1D1D1F] mt-0.5">
                        ₹0.30/SMS
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-2 text-sm text-[#1D1D1F]">
                    {[
                      'Bulk promotional SMS',
                      'Transactional SMS, if supported by the selected provider',
                      'Contact list upload',
                      'Campaign scheduling',
                      'Delivery reports, where supported',
                      'SMS credit usage tracking',
                      'Campaign history',
                    ].map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5">
                        <CheckCircle2
                          className="w-4 h-4 text-[#1D1D1F] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2.5 pt-2">
                  <GlassButton
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() =>
                      onStartEnquiry({
                        category: 'Marketing Services Enquiry',
                        vertical: 'Akyin Marketing',
                        enquiryType: 'Bulk SMS Marketing',
                      })
                    }
                  >
                    <span>Request Bulk SMS Quotation</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </GlassButton>
                  <RazorpayCheckoutButton
                    sku="bulk-sms-starter"
                    label="Book 10,000 SMS Package (₹3,000 via Razorpay)"
                    variant="glass"
                    size="md"
                    className="w-full"
                  />
                </div>
              </div>

              {/* WhatsApp Business Messaging Setup */}
              <div className="liquid-glass-card rounded-3xl p-7 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono-num text-xs font-bold text-[#1D1D1F]">
                      SERVICE 02 · WHATSAPP BUSINESS
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#FFF7ED] border border-[#FED7AA] text-[10px] font-semibold text-[#C2410C]">
                      Provider API Pending Setup
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-[#1D1D1F]">
                      WhatsApp Business Messaging Setup
                    </h3>
                    <p className="text-xs text-[#6E6E73] mt-1">
                      One-time setup fee is strictly separated from per-message usage charges.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#1D1D1F]/10">
                    <div>
                      <p className="text-[11px] text-[#6E6E73]">One-Time Setup Fee</p>
                      <p className="font-mono-num text-2xl font-bold text-[#1D1D1F] mt-0.5">
                        ₹4,999
                      </p>
                      <p className="text-[11px] text-[#6E6E73]">Onboarding &amp; workflow only</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#6E6E73]">Messaging Charge (Separate)</p>
                      <p className="font-mono-num text-2xl font-bold text-[#1D1D1F] mt-0.5">
                        ₹1.50 <span className="text-xs font-medium text-[#6E6E73]">/ message</span>
                      </p>
                      <p className="text-[11px] text-[#6E6E73]">Per configured billing unit</p>
                    </div>
                  </div>

                  <ul className="space-y-2 text-sm text-[#1D1D1F]">
                    {[
                      'WhatsApp Business setup assistance',
                      'Business profile configuration',
                      'Messaging workflow setup',
                      'Customer communication setup',
                      'Campaign and message tracking, where supported',
                      'Usage and billing reports',
                    ].map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5">
                        <CheckCircle2
                          className="w-4 h-4 text-[#1D1D1F] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2.5 pt-2">
                  <GlassButton
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() =>
                      onStartEnquiry({
                        category: 'Marketing Services Enquiry',
                        vertical: 'Akyin Marketing',
                        enquiryType: 'WhatsApp Business Messaging Setup',
                      })
                    }
                  >
                    <span>Request WhatsApp Setup Quotation</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </GlassButton>
                  <RazorpayCheckoutButton
                    sku="whatsapp-business-setup"
                    label="Pay One-Time Setup Fee (₹4,999 via Razorpay)"
                    variant="glass"
                    size="md"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <ServiceBillingDisclaimer className="mt-4" />
          </div>
        </EditorialReveal>
      </section>

      {/* Interactive Standalone Quotation Builder with Compare Plans */}
      <section id="quotation-builder" className="py-16 lg:py-20 bg-[#F5F5F7] border-t border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InteractiveQuotationBuilder />
        </div>
      </section>

      {/* Full Modular Rate Card */}
      <section className="py-16 lg:py-24 surface-silver-gradient border-t border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              Modular Pricing Schedule · {RATE_CARD_ITEMS.length} Line Items
            </p>
            <h2 className="font-display text-3xl font-bold text-[#1D1D1F]">
              Individual Service Rate Card (INR)
            </h2>
            <p className="text-xs text-[#6E6E73]">
              Indicative fees subject to written quotation · Applicable GST extra · Third-party ad spend paid directly to Meta / Google. {MESSAGING_DISCLAIMER}
            </p>
          </div>

          <GlassPanel className="rounded-3xl overflow-hidden bg-white/90">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E8E8ED] text-xs font-semibold text-[#6E6E73]">
                    <th className="py-3.5 px-5">Service</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4 hidden md:table-cell">Scope Notes</th>
                    <th className="py-3.5 px-4 text-right">Fee (INR)</th>
                    <th className="py-3.5 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8ED] text-sm">
                  {RATE_CARD_ITEMS.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F5F5F7]/70 transition-colors">
                      <td className="py-3.5 px-5 font-semibold text-[#1D1D1F]">{item.service}</td>
                      <td className="py-3.5 px-4 text-xs text-[#6E6E73] whitespace-nowrap">{item.category}</td>
                      <td className="py-3.5 px-4 text-xs text-[#6E6E73] hidden md:table-cell">{item.notes}</td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className="font-mono-num font-bold text-[#1D1D1F]">{item.fee}</span>
                        <span className="text-xs text-[#6E6E73]">{item.unit}</span>
                      </td>
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() =>
                            onStartEnquiry({
                              category: 'Marketing Services Enquiry',
                              vertical: 'Akyin Marketing',
                              enquiryType: item.service,
                            })
                          }
                          className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#ECECF0] hover:bg-[#1D1D1F] text-[#1D1D1F] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Enquire
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassPanel>
        </div>
      </section>

      <PricingLiveChatWidget onStartEnquiry={onStartEnquiry} />
    </div>
  );
}
