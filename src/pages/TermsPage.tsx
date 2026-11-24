import { ArrowRight, FileCheck2, Lock, Mail, Phone, ShieldCheck } from 'lucide-react';
import { AppRoute, OFFICIAL_CONTACT } from '../data/akyinData';
import { EditorialReveal } from '../components/EditorialReveal';
import { GlassButton, GlassPanel } from '../components/liquid-glass';

interface TermsPageProps {
  onNavigate: (route: AppRoute) => void;
  section?: 'terms' | 'privacy';
}

export function TermsPage({ onNavigate, section = 'terms' }: TermsPageProps) {
  return (
    <div>
      <section className="surface-silver-gradient text-[#1D1D1F] pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
            Legal &amp; Governance · AKYIN Ventures (akyin.com)
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-[-0.025em] leading-[1.06] text-balance max-w-4xl">
            {section === 'privacy'
              ? 'Privacy Policy & Data Protection Standards.'
              : 'Terms of Service, Engagement Scope & Privacy Policy.'}
          </h1>
          <p className="text-base sm:text-lg text-[#6E6E73] max-w-3xl leading-relaxed">
            Clear, plain-language legal terms governing corporate website usage, commercial agency retainers, direct advertising platform billing, business advisory bookings, and data privacy across AKYIN Ventures.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            <a
              href="/pricing"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/pricing');
              }}
              className="font-semibold text-[#1D1D1F] hover:underline"
            >
              View Transparent Pricing
            </a>
            <span aria-hidden="true" className="text-[#A1A1A6]">·</span>
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
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-[#FFFFFF]">
        <EditorialReveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <GlassPanel className="p-7 sm:p-10 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.06em] text-[#6E6E73]">
              <FileCheck2 className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
              <span>1. Terms of Service &amp; Corporate Scope</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-[#1D1D1F]">
              Website Use, Operating Verticals &amp; Client Engagements
            </h2>
            <div className="space-y-3 text-sm text-[#6E6E73] leading-relaxed">
              <p>
                <strong className="text-[#1D1D1F]">akyin.com</strong> serves as the parent corporate hub for <strong className="text-[#1D1D1F]">AKYIN Ventures</strong>, uniting three core operating ventures (AKYIN Publishing, AKYIN Marketing Agency, and AKYIN Store / AKYIN Thrift) alongside our client advisory and digital growth engagements supporting 58+ client businesses.
              </p>
              <p>
                Client companies (including AICalc, Kartigo, BizNXT, Budget Bazaar, AutoClub, Arosco Ventures, MEI Cosmetics, Krutika Cosmetics, Nyika Traders, and NS Traders) are independent commercial entities supported by AKYIN; they are not owned subsidiaries, internal brands, or corporate divisions of AKYIN Ventures. External platforms and distribution channels (such as Amazon, Google Play Books, Shopify, Instagram, Facebook, and YouTube) remain the property of their respective owners.
              </p>
            </div>
          </GlassPanel>

          <GlassPanel className="p-7 sm:p-10 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.06em] text-[#6E6E73]">
              <ShieldCheck className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
              <span>2. Marketing Agency, Lead Filtering &amp; Billing Policy</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-[#1D1D1F]">
              Written Scope, Direct Ad Spend &amp; Service Boundaries
            </h2>
            <div className="space-y-3 text-sm text-[#6E6E73] leading-relaxed">
              <p>
                <strong className="text-[#1D1D1F]">Direct Platform Billing:</strong> All advertising budgets for Meta Ads and Google Ads are paid directly to the respective ad platforms by the client from their own billing account. AKYIN MARKETINGS agency fees cover strategy, setup, creative management, and qualification operations only.
              </p>
              <p>
                <strong className="text-[#1D1D1F]">Strict Service Separation:</strong> Lead Generation (acquiring new buyer enquiries) and Lead Filtering &amp; Qualification (screening existing inbound enquiries) are independent deliverables. AI-assisted calling and CRM pipeline tracking are operated internally by AKYIN as a managed service—not sold as standalone SaaS software.
              </p>
              <p>
                <strong className="text-[#1D1D1F]">Pricing &amp; Taxes:</strong> Published INR fees (Package A ₹39,999 setup / ₹49,999 monthly; Package B ₹14,999 setup / ₹19,999 monthly; Sales Training ₹25,000/session) are indicative and subject to a mutually approved written proposal prior to kickoff. Applicable GST is extra.
              </p>
            </div>
          </GlassPanel>

          <div id="privacy-policy">
            <GlassPanel className="p-7 sm:p-10 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.06em] text-[#6E6E73]">
                <Lock className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
                <span>3. Privacy Policy &amp; Enquiry Security</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-[#1D1D1F]">
                Zero-Broker Contact Handling &amp; Data Protection
              </h2>
              <div className="space-y-3 text-sm text-[#6E6E73] leading-relaxed">
                <p>
                  <strong className="text-[#1D1D1F]">Minimal Data Collection:</strong> Contact, consultation, and quote details entered on AKYIN.com (name, company, phone, email, city, country, enquiry context) are used strictly to respond to your commercial enquiry or schedule requested consultations on India Standard Time (Asia/Kolkata).
                </p>
                <p>
                  <strong className="text-[#1D1D1F]">No Third-Party Lead Resale:</strong> AKYIN Ventures never sells, rents, or brokers visitor contact details to third-party lead aggregators. Enquiries are validated locally in your browser with schema checks and transmitted directly to AKYIN’s authorized workspace desk or your chosen WhatsApp / Email application.
                </p>
                <p>
                  <strong className="text-[#1D1D1F]">Data Inquiries &amp; Deletion:</strong> To request access, correction, or removal of any previously submitted enquiry record, email{' '}
                  <a href={`mailto:${OFFICIAL_CONTACT.email}`} className="font-semibold text-[#1D1D1F] underline">
                    {OFFICIAL_CONTACT.email}
                  </a>{' '}
                  or call{' '}
                  <a href={`tel:+${OFFICIAL_CONTACT.whatsappNumber}`} className="font-mono-num font-semibold text-[#1D1D1F] underline">
                    {OFFICIAL_CONTACT.phoneDisplay}
                  </a>.
                </p>
              </div>
            </GlassPanel>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <GlassButton variant="primary" size="md" onClick={() => onNavigate('/contact')}>
              <span>Contact AKYIN Legal &amp; Desk</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </GlassButton>
            <GlassButton variant="glass" size="md" onClick={() => onNavigate('/')}>
              <span>Return Home</span>
            </GlassButton>
          </div>
        </EditorialReveal>
      </section>
    </div>
  );
}
