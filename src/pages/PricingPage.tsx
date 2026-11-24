import { ArrowRight, CheckCircle2, Lock, Mail, Phone, ShieldAlert, ShieldCheck } from 'lucide-react';
import {
  AppRoute,
  OFFICIAL_CONTACT,
  PRICING_PACKAGES,
  RATE_CARD_ITEMS,
} from '../data/akyinData';
import { EditorialReveal } from '../components/EditorialReveal';
import { GlassButton, GlassCard, GlassPanel } from '../components/liquid-glass';
import { PricingLiveChatWidget } from '../components/PricingLiveChatWidget';
import { RazorpayCheckoutButton } from '../components/RazorpayCheckoutButton';

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
            Clear Packages, Advisory Fees &amp; Service Rate Card.
          </h1>
          <p className="text-base sm:text-lg text-[#6E6E73] max-w-3xl leading-relaxed">
            Every commercial retainer, sales coaching workshop, and advisory consultation at AKYIN Ventures is published transparently without hidden markups. Advertising spend is always paid directly to Meta or Google by the client.
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
              href={`tel:+${OFFICIAL_CONTACT.whatsappNumber}`}
              className="inline-flex items-center gap-1.5 font-mono-num font-semibold text-[#1D1D1F] hover:underline"
            >
              <Phone className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{OFFICIAL_CONTACT.phoneDisplay}</span>
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
          </div>
        </div>
      </section>

      {/* Core Retainer Packages */}
      <section className="py-16 lg:py-24 bg-[#FFFFFF]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              AKYIN MARKETINGS · Agency Retainers
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F]">
              Monthly Growth &amp; Lead Filtering Packages.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {PRICING_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-3xl p-7 sm:p-9 flex flex-col justify-between space-y-7 ${
                  pkg.featured ? 'liquid-glass-panel border border-[#1D1D1F]/25' : 'liquid-glass-card'
                }`}
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono-num text-xs font-bold text-[#1D1D1F]">
                      {pkg.code}
                    </span>
                    <span className="text-xs font-medium text-[#6E6E73]">
                      Commercial Retainer (INR)
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-2xl font-bold text-[#1D1D1F]">
                      {pkg.name}
                    </h3>
                    <p className="mt-2 text-sm text-[#6E6E73] leading-relaxed">{pkg.subtitle}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#1D1D1F]/10">
                    <div>
                      <p className="text-xs text-[#6E6E73]">One-Time Setup</p>
                      <p className="font-mono-num text-2xl font-bold text-[#1D1D1F] mt-1">
                        {pkg.setupFee}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6E6E73]">Monthly Retainer</p>
                      <p className="font-mono-num text-2xl font-bold text-[#1D1D1F] mt-1">
                        {pkg.monthlyFee}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-[#1D1D1F]">Included Scope</p>
                    <ul className="space-y-2 text-sm text-[#1D1D1F]">
                      {pkg.includes.map((inc) => (
                        <li key={inc} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#1D1D1F] shrink-0 mt-0.5" aria-hidden="true" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-[#6E6E73]">Explicitly Excluded</p>
                    <ul className="space-y-1.5 text-xs text-[#6E6E73]">
                      {pkg.excludes.map((exc) => (
                        <li key={exc} className="flex items-start gap-2">
                          <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#A1A1A6]" aria-hidden="true" />
                          <span>{exc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <GlassButton
                    variant={pkg.featured ? 'primary' : 'subtle'}
                    size="lg"
                    className="w-full"
                    onClick={() =>
                      onStartEnquiry({
                        category: 'Marketing Services Enquiry',
                        vertical: 'Akyin Marketing',
                        enquiryType: pkg.enquiryServiceValue,
                      })
                    }
                  >
                    <span>Enquire About {pkg.code}</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </GlassButton>

                  <RazorpayCheckoutButton
                    sku={pkg.id === 'package-a' ? 'package-a-setup' : 'package-b-setup'}
                    label={`Pay ${pkg.setupFee} Setup via Razorpay`}
                    variant="glass"
                    size="md"
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
                  ₹25,000 <span className="text-xs font-medium text-[#6E6E73]">/ session</span>
                </p>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  On-site commercial sales training, automotive dealership floor coaching, and executive grooming workshops.
                </p>
              </div>
              <RazorpayCheckoutButton
                sku="sales-training"
                label="Pay ₹25,000 via Razorpay"
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
                  ₹1,999 <span className="text-xs font-medium text-[#6E6E73]">/ 30-min IST session</span>
                </p>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  Strategic consultation covering business feasibility, sales conversion discipline, and venture rollout.
                </p>
              </div>
              <div className="space-y-2">
                <RazorpayCheckoutButton
                  sku="advisory-session"
                  label="Pay ₹1,999 via Razorpay"
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
        </EditorialReveal>
      </section>

      {/* Full 21-Item Modular Rate Card */}
      <section className="py-16 lg:py-24 surface-silver-gradient border-t border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              Modular Pricing Schedule · 21 Services
            </p>
            <h2 className="font-display text-3xl font-bold text-[#1D1D1F]">
              Individual Service Rate Card (INR)
            </h2>
            <p className="text-xs text-[#6E6E73]">
              Indicative fees subject to written quotation · Applicable GST extra · Third-party ad spend paid directly to Meta / Google.
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
