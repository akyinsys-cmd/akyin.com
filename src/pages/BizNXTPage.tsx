import { ArrowRight, ArrowUpRight, Compass, Lightbulb, TrendingUp } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { AppRoute, EXTERNAL_VERTICAL_URLS, IMAGES } from '../data/akyinData';
import { ContactDispatcher } from '../components/ContactDispatcher';
import { EditorialReveal } from '../components/EditorialReveal';
import {
  GlassButton,
  GlassCard,
  GlassImageFrame,
  GlassPanel,
} from '../components/liquid-glass';
import { ResilientImage } from '../components/ResilientImage';

interface BizNXTPageProps {
  onNavigate?: (route: AppRoute) => void;
}

export function BizNXTPage({ onNavigate }: BizNXTPageProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div>
      {/* 1. Hero Introduction */}
      <section className="surface-silver-gradient text-[#1D1D1F] pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              BIZNXT · biznxt.online · Business Guidance &amp; Consulting
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-[-0.025em] leading-[1.06] text-[#1D1D1F] text-balance">
              Business Clarity. Smarter Decisions. Better Direction.
            </h1>
            <p className="text-base sm:text-lg text-[#6E6E73] leading-relaxed">
              BizNXT focuses on business guidance, consulting and helping entrepreneurs explore business opportunities and make informed business decisions.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <GlassButton
                href={EXTERNAL_VERTICAL_URLS.biznxt}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="lg"
              >
                <span>Visit BizNXT.online</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </GlassButton>
              {onNavigate ? (
                <GlassButton
                  variant="glass"
                  size="lg"
                  onClick={() => onNavigate('/advisory')}
                >
                  <span>Book Advisory Consultation</span>
                  <ArrowRight className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
                </GlassButton>
              ) : (
                <GlassButton href="#biznxt-guidance" variant="glass" size="lg">
                  Explore Consulting Scope
                </GlassButton>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <GlassImageFrame>
              <div className="group aspect-[4/3] bg-[#FFFFFF] overflow-hidden">
                <ResilientImage
                  src={IMAGES.biznxtConsulting}
                  alt="Apple-style isolated brushed silver and crystal compass object with AKYIN emblem on pure white studio ground"
                  loading="eager"
                  fallbackTitle="BizNXT · Business Guidance & Consulting"
                  className="w-full h-full bg-[#FFFFFF]"
                  imageClassName="object-contain p-3 group-hover:scale-[1.03]"
                />
              </div>
            </GlassImageFrame>
          </motion.div>
        </div>
      </section>

      {/* 2. About BizNXT */}
      <section className="py-20 lg:py-24 bg-[#FFFFFF]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              About BizNXT
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
              Practical Advisory for Founders, Operators &amp; Emerging Ventures.
            </h2>
            <p className="text-base text-[#6E6E73] leading-relaxed">
              Starting or refining a business involves navigating numerous choices—evaluating commercial demand, structuring operations, selecting sales channels, and pacing capital responsibly.
            </p>
            <p className="text-base text-[#6E6E73] leading-relaxed">
              Operating under AKYIN Ventures at{' '}
              <span className="font-semibold text-[#1D1D1F]">biznxt.online</span>, BizNXT provides structured business guidance and consulting centered on realistic planning rather than theoretical jargon.
            </p>
          </div>

          <div className="lg:col-span-6">
            <GlassImageFrame>
              <div className="group aspect-[4/3] bg-[#FFFFFF] overflow-hidden">
                <ResilientImage
                  src={IMAGES.biznxtStrategy}
                  alt="Apple-style isolated architectural white and metallic strategy playbook and pen with AKYIN emblem"
                  loading="lazy"
                  fallbackTitle="BizNXT Strategy & Advisory"
                  className="w-full h-full bg-[#FFFFFF]"
                  imageClassName="object-contain p-3 group-hover:scale-[1.03]"
                />
              </div>
            </GlassImageFrame>
          </div>
        </EditorialReveal>
      </section>

      {/* 3. Business Guidance + 4. Consulting Services */}
      <section
        id="biznxt-guidance"
        className="py-20 lg:py-24 bg-[#F5F5F7] border-t border-[#E8E8ED]"
      >
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              Business Guidance &amp; Consulting Services
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
              Structured Thinking Across Opportunity Evaluation &amp; Execution.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard interactive className="p-7 sm:p-8 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#E8E8ED] text-[#1D1D1F] flex items-center justify-center shadow-xs">
                <Compass className="w-5 h-5" aria-hidden="true" />
              </div>
              <p className="font-mono-num text-xs font-semibold text-[#1D1D1F]">01 · Business Guidance</p>
              <h3 className="font-display text-xl font-bold text-[#1D1D1F]">
                Opportunity Exploration &amp; Feasibility
              </h3>
              <p className="text-sm text-[#6E6E73] leading-relaxed">
                Structured assessment of prospective business models, customer demand alignment, pricing viability, and initial operational requirements before committing major resources.
              </p>
            </GlassCard>

            <GlassCard interactive className="p-7 sm:p-8 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#E8E8ED] text-[#1D1D1F] flex items-center justify-center shadow-xs">
                <Lightbulb className="w-5 h-5" aria-hidden="true" />
              </div>
              <p className="font-mono-num text-xs font-semibold text-[#1D1D1F]">02 · Consulting Services</p>
              <h3 className="font-display text-xl font-bold text-[#1D1D1F]">
                Operational &amp; Commercial Structuring
              </h3>
              <p className="text-sm text-[#6E6E73] leading-relaxed">
                Collaborative consulting sessions focused on clarifying offer positioning, customer acquisition workflows, retail or B2B unit economics, and practical execution roadmaps.
              </p>
            </GlassCard>

            <GlassCard interactive className="p-7 sm:p-8 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#E8E8ED] text-[#1D1D1F] flex items-center justify-center shadow-xs">
                <TrendingUp className="w-5 h-5" aria-hidden="true" />
              </div>
              <p className="font-mono-num text-xs font-semibold text-[#1D1D1F]">03 · Business Development</p>
              <h3 className="font-display text-xl font-bold text-[#1D1D1F]">
                Channel Expansion &amp; Growth Direction
              </h3>
              <p className="text-sm text-[#6E6E73] leading-relaxed">
                Practical guidance on identifying distribution channels, refining sales conversations, and organizing repeatable business development processes as initiatives mature.
              </p>
            </GlassCard>
          </div>
        </EditorialReveal>
      </section>

      {/* 5. Business Development & Visit BizNXT CTA */}
      <section className="py-20 surface-silver-gradient border-t border-[#E8E8ED]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                Business Development Orientation
              </p>
              <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
                Decisions Rooted in Real Commercial Context.
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-4 text-base text-[#1D1D1F]/85 leading-relaxed">
              <p>
                BizNXT does not offer unrealistic promises or pre-packaged formulas. Consulting engagements focus on asking the right commercial questions, examining real constraints, and helping entrepreneurs organize clear next steps.
              </p>
              <p className="text-[#6E6E73]">
                Visit the dedicated platform at{' '}
                <span className="font-semibold text-[#1D1D1F]">biznxt.online</span> or submit an enquiry below to discuss a guidance or consulting conversation.
              </p>
            </div>
          </div>

          <GlassPanel className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <h3 className="font-display text-2xl font-bold text-[#1D1D1F]">
                Explore BizNXT Online
              </h3>
              <p className="text-sm text-[#6E6E73]">
                Access the dedicated BizNXT consulting website directly at biznxt.online.
              </p>
            </div>
            <GlassButton
              href={EXTERNAL_VERTICAL_URLS.biznxt}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="lg"
            >
              <span>Visit BizNXT.online</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </GlassButton>
          </GlassPanel>
        </EditorialReveal>
      </section>

      {/* 6. Enquiry Section */}
      <EditorialReveal>
        <ContactDispatcher
          sectionId="biznxt-contact"
          defaultCategory="BizNXT Consulting Enquiry"
          defaultVertical="BizNXT (biznxt.online)"
          defaultEnquiryType="BizNXT Business Guidance & Consulting Enquiry"
          heading="BizNXT Guidance &amp; Consulting Enquiries."
          subheading="Share your business concept, operational challenge, or advisory question directly with the BizNXT desk."
        />
      </EditorialReveal>
    </div>
  );
}
