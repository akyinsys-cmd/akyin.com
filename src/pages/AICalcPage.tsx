import { useState } from 'react';
import { ArrowUpRight, Calculator, Cpu, Layers, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { EXTERNAL_VERTICAL_URLS, IMAGES } from '../data/akyinData';
import { ContactDispatcher } from '../components/ContactDispatcher';
import { EditorialReveal } from '../components/EditorialReveal';
import {
  GlassButton,
  GlassCard,
  GlassImageFrame,
  GlassPanel,
} from '../components/liquid-glass';
import { ResilientImage } from '../components/ResilientImage';

const SAMPLE_PROMPTS = [
  {
    query: 'Calculate 18% GST added to ₹45,000',
    result: '₹53,100 (Tax: ₹8,100)',
    mode: 'Tax & Commerce',
  },
  {
    query: 'Monthly EMI on ₹12,00,000 at 8.75% for 5 years',
    result: '₹24,765 / month',
    mode: 'Loan & Finance',
  },
  {
    query: 'What is 15% margin on a base cost of $240?',
    result: '$282.35 selling price',
    mode: 'Business Margin',
  },
];

export function AICalcPage() {
  const shouldReduceMotion = useReducedMotion();
  const [activePromptIdx, setActivePromptIdx] = useState(0);

  return (
    <div>
      {/* 1. Pure Apple-Inspired Tech Hero */}
      <section className="surface-silver-gradient text-[#1D1D1F] pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              AKYIN AI CALCULATOR · aicalc.in
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-[-0.025em] leading-[1.06] text-[#1D1D1F] text-balance">
              Smart Calculations. Powered by AI.
            </h1>
            <p className="text-base sm:text-lg text-[#6E6E73] leading-relaxed">
              AICalc is an AI-powered calculator platform that allows users to solve mathematical and practical calculation problems using natural-language text queries alongside traditional calculator functions.
            </p>
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <GlassButton
                href={EXTERNAL_VERTICAL_URLS.aicalc}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="lg"
              >
                <span>Visit AICalc.in</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </GlassButton>
              <GlassButton href="#aicalc-capabilities" variant="glass" size="lg">
                Explore Capabilities
              </GlassButton>
            </div>
          </motion.div>

          {/* Tech Workspace Visual + Liquid Glass Interactive Preview */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-5"
          >
            <GlassImageFrame>
              <div className="aspect-[16/9] bg-[#FFFFFF] overflow-hidden">
                <ResilientImage
                  src={IMAGES.aicalcWorkspace}
                  alt="Apple-style isolated precision anodized silver AICalc calculator device on pure white studio ground"
                  loading="eager"
                  fallbackTitle="AICalc.in Platform"
                  className="w-full h-full bg-[#FFFFFF]"
                  imageClassName="object-contain p-3"
                />
              </div>
            </GlassImageFrame>

            <GlassPanel className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1D1D1F]/8 pb-3">
                <div>
                  <p className="text-xs font-medium text-[#6E6E73]">Product Interface Preview</p>
                  <p className="font-mono-num text-sm font-bold text-[#1D1D1F]">https://aicalc.in</p>
                </div>
                <a
                  href={EXTERNAL_VERTICAL_URLS.aicalc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D1D1F] hover:underline"
                >
                  Open Live App
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>

              <div className="flex flex-wrap gap-2">
                {SAMPLE_PROMPTS.map((item, index) => (
                  <button
                    key={item.mode}
                    type="button"
                    onClick={() => setActivePromptIdx(index)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      activePromptIdx === index
                        ? 'bg-[#1D1D1F] text-white shadow-xs'
                        : 'liquid-glass-cta text-[#1D1D1F]'
                    }`}
                  >
                    {item.mode}
                  </button>
                ))}
              </div>

              <div className="rounded-2xl bg-[#FFFFFF] border border-[#E8E8ED] p-4 space-y-2.5">
                <div>
                  <p className="text-[11px] font-medium text-[#6E6E73]">Natural-Language Input</p>
                  <p className="text-sm font-medium text-[#1D1D1F] mt-0.5">
                    &ldquo;{SAMPLE_PROMPTS[activePromptIdx].query}&rdquo;
                  </p>
                </div>
                <div className="h-px bg-[#E8E8ED]" />
                <div>
                  <p className="text-[11px] font-medium text-[#6E6E73]">Structured Output</p>
                  <p className="font-mono-num text-base font-bold text-[#1D1D1F] mt-0.5">
                    {SAMPLE_PROMPTS[activePromptIdx].result}
                  </p>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </section>

      {/* 2. AI Calculator Capabilities & 3. Manual Calculator Capabilities */}
      <section id="aicalc-capabilities" className="py-20 lg:py-24 bg-[#F5F5F7]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              Dual-Mode Calculation Architecture
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
              Natural-Language AI Prompts Paired With Classic Keypad Precision.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard interactive className="p-8 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#E8E8ED] text-[#1D1D1F] flex items-center justify-center shadow-xs">
                <Sparkles className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[#1D1D1F]">
                AI Calculator Capabilities
              </h3>
              <p className="text-sm text-[#6E6E73] leading-relaxed">
                Type everyday word problems, multi-step financial expressions, percentage markups, or unit conversions in plain language without translating them into nested formulas.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-[#1D1D1F]/85 pt-2">
                <li>· Plain-text question parsing for everyday math</li>
                <li>· Multi-step commercial and finance problem solving</li>
                <li>· Clear, readable expression interpretation</li>
              </ul>
            </GlassCard>

            <GlassCard interactive className="p-8 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#E8E8ED] text-[#1D1D1F] flex items-center justify-center shadow-xs">
                <Calculator className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[#1D1D1F]">
                Manual Calculator Capabilities
              </h3>
              <p className="text-sm text-[#6E6E73] leading-relaxed">
                When direct numeric entry is faster than typing a sentence, switch seamlessly to traditional calculator controls built for reliable arithmetic.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-[#1D1D1F]/85 pt-2">
                <li>· Responsive standard arithmetic &amp; percentage keypad</li>
                <li>· Clean keyboard and touch input ergonomics</li>
                <li>· Zero-clutter display for rapid daily checks</li>
              </ul>
            </GlassCard>
          </div>
        </EditorialReveal>
      </section>

      {/* 4. Supported Calculation Categories & Visit CTA */}
      <section className="py-20 lg:py-24 bg-[#FFFFFF] border-t border-[#E8E8ED]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                Supported Calculation Categories
              </p>
              <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
                Practical Utility Across Personal, Academic &amp; Business Math.
              </h2>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: Cpu,
                  title: 'Financial & Loan Math',
                  desc: 'Interest estimates, EMI breakdowns, percentage adjustments, and savings comparisons.',
                },
                {
                  icon: Layers,
                  title: 'Commerce & Pricing',
                  desc: 'Discounts, tax additions, profit margin calculations, and unit pricing.',
                },
                {
                  icon: Calculator,
                  title: 'General Arithmetic & Algebra',
                  desc: 'Everyday numeric operations, ratios, fractions, and multi-term equations.',
                },
                {
                  icon: Sparkles,
                  title: 'Everyday Conversions',
                  desc: 'Unit conversions, time spans, measurements, and practical day-to-day ratios.',
                },
              ].map((cat) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.title}
                    className="liquid-glass-card rounded-2xl p-5 space-y-2"
                  >
                    <Icon className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
                    <h3 className="font-display text-base font-bold text-[#1D1D1F]">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-[#6E6E73] leading-relaxed">{cat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <GlassPanel className="p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h3 className="font-display text-2xl font-bold text-[#1D1D1F]">
                Use the Full Platform on AICalc.in
              </h3>
              <p className="text-sm text-[#6E6E73]">
                AICalc runs on its own dedicated web application so you can calculate directly in your browser.
              </p>
            </div>
            <GlassButton
              href={EXTERNAL_VERTICAL_URLS.aicalc}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="lg"
            >
              <span>Visit AICalc.in</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </GlassButton>
          </GlassPanel>
        </EditorialReveal>
      </section>

      {/* 8. Product Enquiry Section */}
      <EditorialReveal>
        <ContactDispatcher
          sectionId="aicalc-contact"
          defaultCategory="AICalc Enquiry"
          defaultVertical="AICalc (aicalc.in)"
          defaultEnquiryType="AICalc Platform / Integration Enquiry"
          heading="AICalc Platform Enquiries."
          subheading="Contact the AKYIN team regarding AICalc.in capabilities, feature feedback, or commercial partnerships."
        />
      </EditorialReveal>
    </div>
  );
}
