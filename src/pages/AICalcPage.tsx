import { useState } from 'react';
import { ArrowUpRight, Calculator, Cpu, Layers, Sparkles } from 'lucide-react';
import { EXTERNAL_VERTICAL_URLS, IMAGES } from '../data/akyinData';
import { ContactDispatcher } from '../components/ContactDispatcher';
import { EditorialReveal } from '../components/EditorialReveal';
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
  const [activePromptIdx, setActivePromptIdx] = useState(0);

  return (
    <div>
      {/* 1. Clean White & Warm Ivory Technology Hero */}
      <section className="bg-[#FFFFFF] text-[#292722] pt-24 pb-16 lg:pt-32 lg:pb-24 border-b border-[#D9CCB9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <p className="text-xs font-semibold tracking-wide text-[#B66A50]">
              AKYIN AI CALCULATOR · aicalc.in
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.07] text-balance">
              Smart Calculations. Powered by AI.
            </h1>
            <p className="text-base sm:text-lg text-[#77736C] leading-relaxed">
              AICalc is an AI-powered calculator platform that allows users to solve mathematical and practical calculation problems using natural-language text queries alongside traditional calculator functions.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={EXTERNAL_VERTICAL_URLS.aicalc}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#B66A50] hover:bg-[#9E5740] text-white text-sm font-semibold transition-colors whitespace-nowrap"
              >
                Visit AICalc.in
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="#aicalc-capabilities"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#F7F5F0] hover:bg-[#EFE9DE] text-[#292722] border border-[#D9CCB9] text-sm font-semibold transition-colors whitespace-nowrap"
              >
                Explore Capabilities
              </a>
            </div>
          </div>

          {/* Bright Tech Workspace Visual + Interactive Preview */}
          <div className="lg:col-span-6 space-y-5">
            <div className="rounded-2xl overflow-hidden border border-[#D9CCB9] aspect-[16/10] bg-[#F7F5F0]">
              <ResilientImage
                src={IMAGES.aicalcWorkspace}
                alt="Minimalist white and pale oak desk setup for AICalc.in"
                loading="eager"
                fallbackTitle="AICalc.in Platform"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="rounded-2xl bg-[#F7F5F0] border border-[#D9CCB9] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#D9CCB9] pb-3">
                <div>
                  <p className="text-xs font-medium text-[#77736C]">Product Interface Preview</p>
                  <p className="font-mono-num text-sm font-bold text-[#292722]">https://aicalc.in</p>
                </div>
                <a
                  href={EXTERNAL_VERTICAL_URLS.aicalc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#B66A50] hover:underline"
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activePromptIdx === index
                        ? 'bg-[#B66A50] text-white'
                        : 'bg-[#FFFFFF] text-[#292722] border border-[#D9CCB9] hover:bg-[#EFE9DE]'
                    }`}
                  >
                    {item.mode}
                  </button>
                ))}
              </div>

              <div className="rounded-xl bg-[#FFFFFF] border border-[#D9CCB9] p-4 space-y-2.5">
                <div>
                  <p className="text-[11px] font-medium text-[#77736C]">Natural-Language Input</p>
                  <p className="text-sm font-medium text-[#292722] mt-0.5">
                    &ldquo;{SAMPLE_PROMPTS[activePromptIdx].query}&rdquo;
                  </p>
                </div>
                <div className="h-px bg-[#EFE9DE]" />
                <div>
                  <p className="text-[11px] font-medium text-[#77736C]">Structured Output</p>
                  <p className="font-mono-num text-base font-bold text-[#B66A50] mt-0.5">
                    {SAMPLE_PROMPTS[activePromptIdx].result}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. AI Calculator Capabilities & 3. Manual Calculator Capabilities */}
      <section id="aicalc-capabilities" className="py-20 lg:py-24 bg-[#F7F5F0]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold tracking-wide text-[#B66A50]">
              Dual-Mode Calculation Architecture
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#292722] text-balance">
              Natural-Language AI Prompts Paired With Classic Keypad Precision.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl bg-[#FFFFFF] border border-[#D9CCB9] p-8 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[#EFE9DE] text-[#B66A50] flex items-center justify-center">
                <Sparkles className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[#292722]">
                AI Calculator Capabilities
              </h3>
              <p className="text-sm text-[#77736C] leading-relaxed">
                Type everyday word problems, multi-step financial expressions, percentage markups, or unit conversions in plain language without translating them into nested formulas.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-[#292722]/85 pt-2">
                <li>· Plain-text question parsing for everyday math</li>
                <li>· Multi-step commercial and finance problem solving</li>
                <li>· Clear, readable expression interpretation</li>
              </ul>
            </div>

            <div className="rounded-2xl bg-[#FFFFFF] border border-[#D9CCB9] p-8 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[#EFE9DE] text-[#83866A] flex items-center justify-center">
                <Calculator className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[#292722]">
                Manual Calculator Capabilities
              </h3>
              <p className="text-sm text-[#77736C] leading-relaxed">
                When direct numeric entry is faster than typing a sentence, switch seamlessly to traditional calculator controls built for reliable arithmetic.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-[#292722]/85 pt-2">
                <li>· Responsive standard arithmetic &amp; percentage keypad</li>
                <li>· Clean keyboard and touch input ergonomics</li>
                <li>· Zero-clutter display for rapid daily checks</li>
              </ul>
            </div>
          </div>
        </EditorialReveal>
      </section>

      {/* 4. Supported Calculation Categories & 7. Visit CTA */}
      <section className="py-20 lg:py-24 bg-[#FFFFFF] border-t border-[#D9CCB9]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-3">
              <p className="text-xs font-semibold tracking-wide text-[#B66A50]">
                Supported Calculation Categories
              </p>
              <h2 className="font-display text-3xl font-bold text-[#292722] text-balance">
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
                    className="bg-[#F7F5F0] rounded-xl border border-[#D9CCB9] p-5 space-y-2"
                  >
                    <Icon className="w-4 h-4 text-[#B66A50]" aria-hidden="true" />
                    <h3 className="font-display text-base font-bold text-[#292722]">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-[#77736C] leading-relaxed">{cat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-[#EFE9DE] border border-[#D9CCB9] p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h3 className="font-display text-2xl font-bold text-[#292722]">
                Use the Full Platform on AICalc.in
              </h3>
              <p className="text-sm text-[#77736C]">
                AICalc runs on its own dedicated web application so you can calculate directly in your browser.
              </p>
            </div>
            <a
              href={EXTERNAL_VERTICAL_URLS.aicalc}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#B66A50] hover:bg-[#9E5740] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              Visit AICalc.in
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
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
