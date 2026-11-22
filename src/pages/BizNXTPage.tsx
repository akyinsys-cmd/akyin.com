import { ArrowRight, ArrowUpRight, Compass, Lightbulb, TrendingUp } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { EXTERNAL_VERTICAL_URLS, IMAGES } from '../data/akyinData';
import { ContactDispatcher } from '../components/ContactDispatcher';
import { EditorialReveal } from '../components/EditorialReveal';
import { ResilientImage } from '../components/ResilientImage';

export function BizNXTPage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div>
      {/* 1. Hero Introduction */}
      <section className="bg-[#F7F5F0] text-[#292722] pt-24 pb-16 lg:pt-32 lg:pb-24 border-b border-[#D9CCB9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#B66A50]">
              BIZNXT · biznxt.online · Business Guidance &amp; Consulting
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.06] text-[#292722] text-balance">
              Business Clarity. Smarter Decisions. Better Direction.
            </h1>
            <p className="text-base sm:text-lg text-[#77736C] leading-relaxed">
              BizNXT focuses on business guidance, consulting and helping entrepreneurs explore business opportunities and make informed business decisions.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={EXTERNAL_VERTICAL_URLS.biznxt}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#B66A50] hover:bg-[#9E5740] text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap"
              >
                <span>Visit BizNXT.online</span>
                <ArrowUpRight
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
              <a
                href="#biznxt-guidance"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#FFFFFF] hover:bg-[#EFE9DE] text-[#292722] border border-[#D9CCB9] text-sm font-semibold transition-colors whitespace-nowrap"
              >
                Explore Consulting Scope
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <div className="group rounded-2xl overflow-hidden border border-[#D9CCB9] shadow-lg aspect-[4/3] bg-[#EFE9DE]">
              <ResilientImage
                src={IMAGES.biznxtConsulting}
                alt="Sunlit oak executive conference table inside a modern business consulting workspace"
                loading="eager"
                fallbackTitle="BizNXT · Business Guidance & Consulting"
                className="w-full h-full"
                imageClassName="group-hover:scale-[1.03]"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. About BizNXT */}
      <section className="py-20 lg:py-24 bg-[#FFFFFF]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 space-y-5">
            <p className="text-xs font-semibold tracking-wide text-[#B66A50]">
              About BizNXT
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#292722] text-balance">
              Practical Advisory for Founders, Operators &amp; Emerging Ventures.
            </h2>
            <p className="text-base text-[#77736C] leading-relaxed">
              Starting or refining a business involves navigating numerous choices—evaluating commercial demand, structuring operations, selecting sales channels, and pacing capital responsibly.
            </p>
            <p className="text-base text-[#77736C] leading-relaxed">
              Operating under AKYIN Ventures at{' '}
              <span className="font-semibold text-[#292722]">biznxt.online</span>, BizNXT provides structured business guidance and consulting centered on realistic planning rather than theoretical jargon.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="group rounded-2xl overflow-hidden border border-[#D9CCB9] aspect-[4/3] bg-[#F7F5F0]">
              <ResilientImage
                src={IMAGES.biznxtStrategy}
                alt="Business planning desk with strategic plans, notebook, and brass drafting divider"
                loading="lazy"
                fallbackTitle="BizNXT Strategy & Advisory"
                className="w-full h-full"
                imageClassName="group-hover:scale-[1.03]"
              />
            </div>
          </div>
        </EditorialReveal>
      </section>

      {/* 3. Business Guidance + 4. Consulting Services */}
      <section
        id="biznxt-guidance"
        className="py-20 lg:py-24 bg-[#F7F5F0] border-t border-[#D9CCB9]"
      >
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold tracking-wide text-[#B66A50]">
              Business Guidance &amp; Consulting Services
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#292722] text-balance">
              Structured Thinking Across Opportunity Evaluation &amp; Execution.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <article className="bg-[#FFFFFF] rounded-2xl border border-[#D9CCB9] p-7 sm:p-8 space-y-4 hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-10 h-10 rounded-lg bg-[#EFE9DE] text-[#B66A50] flex items-center justify-center">
                <Compass className="w-5 h-5" aria-hidden="true" />
              </div>
              <p className="text-xs font-semibold text-[#83866A]">01 · Business Guidance</p>
              <h3 className="font-display text-xl font-bold text-[#292722]">
                Opportunity Exploration &amp; Feasibility
              </h3>
              <p className="text-sm text-[#77736C] leading-relaxed">
                Structured assessment of prospective business models, customer demand alignment, pricing viability, and initial operational requirements before committing major resources.
              </p>
            </article>

            <article className="bg-[#FFFFFF] rounded-2xl border border-[#D9CCB9] p-7 sm:p-8 space-y-4 hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-10 h-10 rounded-lg bg-[#EFE9DE] text-[#B66A50] flex items-center justify-center">
                <Lightbulb className="w-5 h-5" aria-hidden="true" />
              </div>
              <p className="text-xs font-semibold text-[#83866A]">02 · Consulting Services</p>
              <h3 className="font-display text-xl font-bold text-[#292722]">
                Operational &amp; Commercial Structuring
              </h3>
              <p className="text-sm text-[#77736C] leading-relaxed">
                Collaborative consulting sessions focused on clarifying offer positioning, customer acquisition workflows, retail or B2B unit economics, and practical execution roadmaps.
              </p>
            </article>

            <article className="bg-[#FFFFFF] rounded-2xl border border-[#D9CCB9] p-7 sm:p-8 space-y-4 hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-10 h-10 rounded-lg bg-[#EFE9DE] text-[#83866A] flex items-center justify-center">
                <TrendingUp className="w-5 h-5" aria-hidden="true" />
              </div>
              <p className="text-xs font-semibold text-[#83866A]">03 · Business Development</p>
              <h3 className="font-display text-xl font-bold text-[#292722]">
                Channel Expansion &amp; Growth Direction
              </h3>
              <p className="text-sm text-[#77736C] leading-relaxed">
                Practical guidance on identifying distribution channels, refining sales conversations, and organizing repeatable business development processes as initiatives mature.
              </p>
            </article>
          </div>
        </EditorialReveal>
      </section>

      {/* 5. Business Development & Visit BizNXT CTA */}
      <section className="py-20 bg-[#EFE9DE] border-t border-[#D9CCB9]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-3">
              <p className="text-xs font-semibold tracking-wide text-[#B66A50]">
                Business Development Orientation
              </p>
              <h2 className="font-display text-3xl font-bold text-[#292722] text-balance">
                Decisions Rooted in Real Commercial Context.
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-4 text-base text-[#292722]/85 leading-relaxed">
              <p>
                BizNXT does not offer unrealistic promises or pre-packaged formulas. Consulting engagements focus on asking the right commercial questions, examining real constraints, and helping entrepreneurs organize clear next steps.
              </p>
              <p>
                Visit the dedicated platform at{' '}
                <span className="font-semibold text-[#292722]">biznxt.online</span> or submit an enquiry below to discuss a guidance or consulting conversation.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#FFFFFF] border border-[#D9CCB9] p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <h3 className="font-display text-2xl font-bold text-[#292722]">
                Explore BizNXT Online
              </h3>
              <p className="text-sm text-[#77736C]">
                Access the dedicated BizNXT consulting website directly at biznxt.online.
              </p>
            </div>
            <a
              href={EXTERNAL_VERTICAL_URLS.biznxt}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#B66A50] hover:bg-[#9E5740] text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap shrink-0"
            >
              <span>Visit BizNXT.online</span>
              <ArrowUpRight
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
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
