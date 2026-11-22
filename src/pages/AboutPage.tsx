import { ArrowRight, ArrowUpRight, FileCheck2, Lock, ShieldCheck, UserCheck } from 'lucide-react';
import { AppRoute, IMAGES, VENTURES_PORTFOLIO } from '../data/akyinData';
import { BusinessFAQs } from '../components/BusinessFAQs';
import { EditorialReveal } from '../components/EditorialReveal';
import { InteractiveTimeline } from '../components/InteractiveTimeline';
import { GlassButton, GlassImageFrame } from '../components/liquid-glass';
import { ResilientImage } from '../components/ResilientImage';

interface AboutPageProps {
  onNavigate: (route: AppRoute) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div>
      {/* Liquid Glass Corporate Header */}
      <section className="surface-silver-gradient text-[#1D1D1F] pt-12 pb-20 lg:pt-16 lg:pb-24 border-b border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              Corporate Profile · AKYIN Ventures
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-[-0.025em] leading-[1.06] text-balance">
              One Vision. Multiple Business Ventures.
            </h1>
            <p className="text-base sm:text-lg text-[#6E6E73] leading-relaxed max-w-2xl">
              AKYIN Ventures develops and operates independent business initiatives alongside a full-service marketing agency—bringing together digital platforms, publishing, brand growth, commerce and retail under one parent business identity.
            </p>
          </div>
          <div className="lg:col-span-5">
            <GlassImageFrame>
              <div className="aspect-[4/3] bg-[#FFFFFF] overflow-hidden">
                <ResilientImage
                  src={IMAGES.liquidGlassHero}
                  alt="Apple-style translucent crystal prism on seamless pure white studio surface with engraved AKYIN ribbon emblem"
                  loading="eager"
                  branded={false}
                  fallbackTitle="AKYIN Ventures"
                  className="w-full h-full bg-[#FFFFFF]"
                  imageClassName="object-contain p-3"
                />
              </div>
            </GlassImageFrame>
          </div>
        </div>
      </section>

      {/* Operating Orientation */}
      <section className="py-20 lg:py-24 bg-[#FFFFFF]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              Group Orientation
            </p>
            <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
              Diversified Initiatives Guided by Practical Demand.
            </h2>
            <p className="text-base text-[#6E6E73] leading-relaxed">
              AKYIN Ventures focuses on operating practical ventures across seven clear domains: independent publishing reaching readers worldwide, a full-service marketing agency and commercial sales training division for brands across sectors, discounted fashion apparel through AKYIN THRIFT, value retail through Budget Bazaar, AI-enabled calculation tools at AICalc.in, B2B stock commerce on Kartigo.online, and business guidance through BizNXT.online.
            </p>
            <p className="text-base text-[#6E6E73] leading-relaxed">
              Each venture maintains its own dedicated identity and platform while benefitting from unified entrepreneurial direction and commercial governance.
            </p>
          </div>
          <div className="lg:col-span-6">
            <GlassImageFrame>
              <div className="aspect-[4/3] bg-[#FFFFFF] overflow-hidden">
                <ResilientImage
                  src={IMAGES.liquidGlassVentures}
                  alt="Apple-style isolated layered white and frosted glass cubes engraved with AKYIN emblem"
                  loading="lazy"
                  fallbackTitle="AKYIN Ventures Studio"
                  className="w-full h-full bg-[#FFFFFF]"
                  imageClassName="object-contain p-3"
                />
              </div>
            </GlassImageFrame>
          </div>
        </EditorialReveal>
      </section>

      {/* Interactive Growth Milestones Timeline */}
      <section
        id="growth-timeline"
        className="py-20 lg:py-24 surface-silver-gradient border-t border-[#E8E8ED]"
      >
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InteractiveTimeline onNavigate={onNavigate} />
        </EditorialReveal>
      </section>

      {/* Complete Business Portfolio Purpose Breakdown */}
      <section className="py-20 lg:py-24 bg-[#F5F5F7] border-t border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <EditorialReveal>
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                Venture Architecture
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
                Purpose of Each Business Vertical.
              </h2>
            </div>
          </EditorialReveal>

          <div className="space-y-6">
            {VENTURES_PORTFOLIO.map((venture, idx) => (
              <EditorialReveal key={venture.id} delay={Math.min(idx * 0.04, 0.2)}>
                <article className="group liquid-glass-card rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch transition-all duration-200">
                  <div className="lg:col-span-4 aspect-[4/3] lg:aspect-auto bg-[#FFFFFF] border-b lg:border-b-0 lg:border-r border-[#E8E8ED]/70">
                    <ResilientImage
                      src={venture.image}
                      alt={venture.imageAlt}
                      loading="lazy"
                      fallbackTitle={venture.name}
                      className="w-full h-full bg-[#FFFFFF]"
                      imageClassName="object-contain p-3 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="lg:col-span-8 p-7 sm:p-9 flex flex-col justify-between space-y-5">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E6E73]">
                        <span className="font-mono-num font-bold text-[#1D1D1F]">
                          {venture.code}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{venture.sector}</span>
                      </div>
                      <h3 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F]">
                        {venture.name}
                      </h3>
                      <p className="text-sm font-semibold text-[#1D1D1F]/80">
                        {venture.positioning}
                      </p>
                      <p className="text-sm text-[#6E6E73] leading-relaxed">
                        {venture.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-[#1D1D1F]/8">
                      <GlassButton
                        variant="primary"
                        size="sm"
                        onClick={() => onNavigate(venture.route)}
                      >
                        <span>Open Vertical Page</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </GlassButton>

                      {venture.externalUrl && (
                        <a
                          href={venture.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D1D1F] hover:text-[#6E6E73] transition-colors"
                        >
                          Visit {venture.externalLabel}
                          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </EditorialReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Integrity */}
      <section
        id="security-integrity"
        className="py-20 lg:py-24 bg-[#FFFFFF] border-t border-[#E8E8ED]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <EditorialReveal>
            <div className="max-w-3xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                Trust, Safety &amp; Content Standards
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
                Security &amp; Integrity.
              </h2>
              <p className="text-base text-[#6E6E73] leading-relaxed">
                AKYIN.com is architected around safe browsing practices, transparent corporate attribution, and client-side privacy—ensuring every visitor engages only with verified ventures and official destinations.
              </p>
            </div>
          </EditorialReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EditorialReveal delay={0} className="h-full">
              <article className="h-full rounded-3xl liquid-glass-card p-7 sm:p-8 space-y-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FFFFFF] border border-[#E8E8ED] text-[#1D1D1F] flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#1D1D1F]">
                  Safe Browsing &amp; Strict Link Verification
                </h3>
                <p className="text-sm text-[#6E6E73] leading-relaxed">
                  Content Security Policy rules, strict referrer headers, and automated URI allowlisting ensure only verified HTTPS domains and official channels are linked—preventing malicious redirects, unsafe scripts, or unapproved external destinations.
                </p>
              </article>
            </EditorialReveal>

            <EditorialReveal delay={0.07} className="h-full">
              <article className="h-full rounded-3xl liquid-glass-card p-7 sm:p-8 space-y-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FFFFFF] border border-[#E8E8ED] text-[#1D1D1F] flex items-center justify-center shadow-xs">
                  <Lock className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#1D1D1F]">
                  Zero-Broker Enquiry Privacy
                </h3>
                <p className="text-sm text-[#6E6E73] leading-relaxed">
                  Enquiries entered on AKYIN.com are structured directly inside your browser and logged via our private Google Workspace Apps Script desk or handed off to your own WhatsApp or Email application. No hidden third-party form brokers intercept your contact details.
                </p>
              </article>
            </EditorialReveal>

            <EditorialReveal delay={0.14} className="h-full">
              <article className="h-full rounded-3xl liquid-glass-card p-7 sm:p-8 space-y-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FFFFFF] border border-[#E8E8ED] text-[#1D1D1F] flex items-center justify-center shadow-xs">
                  <FileCheck2 className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#1D1D1F]">
                  Real-Time Schema Validation &amp; Input Filtering
                </h3>
                <p className="text-sm text-[#6E6E73] leading-relaxed">
                  Interactive enquiry forms validate inputs immediately with strict schema rules, strip unsafe control characters, enforce bounded field lengths, and apply anti-spam safeguards before any message draft can be created.
                </p>
              </article>
            </EditorialReveal>

            <EditorialReveal delay={0.21} className="h-full">
              <article className="h-full rounded-3xl liquid-glass-card p-7 sm:p-8 space-y-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FFFFFF] border border-[#E8E8ED] text-[#1D1D1F] flex items-center justify-center shadow-xs">
                  <UserCheck className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#1D1D1F]">
                  Verified &amp; Professional Attribution
                </h3>
                <p className="text-sm text-[#6E6E73] leading-relaxed">
                  We distinguish owned AKYIN ventures, external distribution marketplaces, and client relationships clearly—publishing factual capabilities and transparent commercial terms without fabricated claims or misleading endorsements.
                </p>
              </article>
            </EditorialReveal>
          </div>
        </div>
      </section>

      {/* Business FAQs */}
      <section className="py-20 lg:py-24 surface-silver-gradient border-t border-[#E8E8ED]">
        <EditorialReveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BusinessFAQs />
        </EditorialReveal>
      </section>
    </div>
  );
}
