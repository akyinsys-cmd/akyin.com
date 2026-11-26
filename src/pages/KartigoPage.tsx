import { ArrowRight, Boxes, Building2, CheckCircle2, Truck } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { IMAGES } from '../data/akyinData';
import { ContactDispatcher } from '../components/ContactDispatcher';
import { EditorialReveal } from '../components/EditorialReveal';
import {
  GlassButton,
  GlassCard,
  GlassImageFrame,
  GlassPanel,
} from '../components/liquid-glass';
import { ResilientImage } from '../components/ResilientImage';

export function KartigoPage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div>
      {/* 1. Bright B2B Commerce Hero */}
      <section className="surface-silver-gradient text-[#1D1D1F] pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-[#1D1D1F]/10 text-xs font-semibold text-[#1D1D1F] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#0071E3]" />
              <span className="uppercase tracking-[0.08em] text-[#6E6E73]">AKYIN Client Showcase · B2B Stock Supply</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-[-0.025em] leading-[1.06] text-[#1D1D1F] text-balance">
              Connecting Businesses With Stock Opportunities.
            </h1>
            <p className="text-base sm:text-lg text-[#6E6E73] leading-relaxed">
              Kartigo is an independent client business supported by AKYIN for B2B commercial growth and buyer acquisition. It is a B2B stock supply platform designed to support commercial buyers and volume sellers through a dedicated wholesale commerce environment.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <GlassButton
                href="#kartigo-contact"
                variant="primary"
                size="lg"
              >
                <span>Connect for B2B Supply</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </GlassButton>
              <GlassButton href="#kartigo-concept" variant="glass" size="lg">
                Learn How It Works
              </GlassButton>
            </div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <GlassImageFrame>
              <div className="aspect-[4/3] bg-[#FFFFFF] overflow-hidden">
                <ResilientImage
                  src={IMAGES.kartigoWarehouse}
                  alt="Apple-style stacked white and metallic anodized wholesale B2B packaging crates embossed with the AKYIN emblem"
                  loading="eager"
                  fallbackTitle="KARTIGO · B2B Stock Supply"
                  className="w-full h-full bg-[#FFFFFF]"
                  imageClassName="object-contain p-3"
                />
              </div>
            </GlassImageFrame>
          </motion.div>
        </div>
      </section>

      {/* 2. B2B Stock Supply Concept */}
      <section id="kartigo-concept" className="py-20 lg:py-24 bg-[#FFFFFF]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              B2B Stock Supply Concept
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
              Focused Wholesale &amp; Stock Trade Environment.
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-4 text-base text-[#6E6E73] leading-relaxed">
            <p className="text-[#1D1D1F]">
              Businesses sourcing inventory and suppliers holding available commercial stock often rely on fragmented phone calls and informal messaging threads. Kartigo gives B2B buyers and sellers a dedicated web destination built around commercial stock discovery.
            </p>
            <p>
              As an independent B2B commerce platform supported by AKYIN Ventures, Kartigo focuses cleanly on B2B stock supply interactions without unrelated consumer retail clutter.
            </p>
          </div>
        </EditorialReveal>
      </section>

      {/* 3. Business Buyer Benefits & 4. Supplier Opportunities */}
      <section className="py-20 lg:py-24 bg-[#F5F5F7] border-t border-[#E8E8ED]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <GlassCard interactive className="p-8 space-y-5">
            <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#E8E8ED] text-[#1D1D1F] flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-display text-2xl font-bold text-[#1D1D1F]">
              Business Buyer Benefits
            </h3>
            <p className="text-sm text-[#6E6E73] leading-relaxed">
              Structured discovery for commercial buyers seeking wholesale and bulk stock lots.
            </p>
            <ul className="space-y-2.5 text-sm text-[#1D1D1F]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1D1D1F] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Dedicated B2B commerce focus without consumer clutter</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1D1D1F] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Direct access to wholesale stock opportunities</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1D1D1F] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Clear pathway for trade and procurement discussions</span>
              </li>
            </ul>
          </GlassCard>

          <GlassCard interactive className="p-8 space-y-5">
            <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#E8E8ED] text-[#1D1D1F] flex items-center justify-center shadow-xs">
              <Boxes className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-display text-2xl font-bold text-[#1D1D1F]">
              Supplier Opportunities
            </h3>
            <p className="text-sm text-[#6E6E73] leading-relaxed">
              A focused channel for wholesalers, distributors, and stock holders to reach business buyers.
            </p>
            <ul className="space-y-2.5 text-sm text-[#1D1D1F]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1D1D1F] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Present commercial stock opportunities to trade-oriented visitors</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1D1D1F] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Support structured wholesale and stock movement cycles</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1D1D1F] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Initiate direct B2B supply conversations with AKYIN Ventures</span>
              </li>
            </ul>
          </GlassCard>
        </EditorialReveal>
      </section>

      {/* 5. Wholesale & Stock Opportunities + Workflow + Explore CTA */}
      <section className="py-20 lg:py-24 surface-silver-gradient border-t border-[#E8E8ED]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              Wholesale &amp; Stock Workflow
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
              How Businesses Engage With Kartigo.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Submit Trade Requirements',
                desc: 'Share your wholesale sourcing requirements or available commercial stock inventory with the desk.',
              },
              {
                step: '02',
                title: 'Explore Stock Opportunities',
                desc: 'Review available wholesale and business stock supply categories structured for commercial buyers.',
              },
              {
                step: '03',
                title: 'Connect for Trade & Supply',
                desc: 'Engage on wholesale enquiries or supplier onboarding through direct B2B communication channels.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="liquid-glass-card rounded-3xl p-6 sm:p-7 space-y-3"
              >
                <p className="font-mono-num text-xs font-bold text-[#1D1D1F]">{item.step}</p>
                <h3 className="font-display text-xl font-bold text-[#1D1D1F]">{item.title}</h3>
                <p className="text-sm text-[#6E6E73] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <GlassPanel className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#FFFFFF] border border-[#E8E8ED] flex items-center justify-center shrink-0 shadow-xs">
                <Truck className="w-5 h-5 text-[#1D1D1F]" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-[#1D1D1F]">
                  Ready to Explore Wholesale &amp; B2B Stock Supply?
                </h3>
                <p className="text-sm text-[#6E6E73] mt-0.5">
                  Connect directly with the Kartigo B2B commerce desk below.
                </p>
              </div>
            </div>
            <GlassButton
              href="#kartigo-contact"
              variant="primary"
              size="lg"
            >
              <span>Submit B2B Enquiry</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </GlassButton>
          </GlassPanel>
        </EditorialReveal>
      </section>

      {/* 8. Business Partnership Enquiry */}
      <EditorialReveal>
        <ContactDispatcher
          sectionId="kartigo-contact"
          defaultCategory="Kartigo Business Enquiry"
          defaultVertical="Kartigo (kartigo.online)"
          defaultEnquiryType="Kartigo B2B Buyer / Supplier Onboarding"
          heading="Kartigo B2B Supply &amp; Partnership Enquiries."
          subheading="Connect with our B2B commerce desk regarding wholesale sourcing, supplier onboarding, or stock supply collaborations."
        />
      </EditorialReveal>
    </div>
  );
}
