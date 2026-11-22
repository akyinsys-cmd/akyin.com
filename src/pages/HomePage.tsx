import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import {
  AppRoute,
  EXTERNAL_VERTICAL_URLS,
  IMAGES,
  PUBLISHING_LINKS,
  VENTURES_PORTFOLIO,
} from '../data/akyinData';
import { ContactDispatcher } from '../components/ContactDispatcher';
import { EcosystemSection } from '../components/EcosystemSection';
import { EditorialReveal } from '../components/EditorialReveal';
import { ResilientImage } from '../components/ResilientImage';
import { SocialLinks } from '../components/SocialLinks';

interface HomePageProps {
  onNavigate: (route: AppRoute) => void;
  onStartEnquiry: (options: {
    category: string;
    vertical: string;
    enquiryType?: string;
  }) => void;
}

export function HomePage({ onNavigate, onStartEnquiry }: HomePageProps) {
  const shouldReduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, 28]);

  return (
    <div>
      {/* 1. Hero Introduction — Bright Warm Ivory & Sunlit Architecture */}
      <section
        ref={heroRef}
        className="relative bg-[#F7F5F0] pt-24 pb-16 lg:pt-32 lg:pb-24 border-b border-[#D9CCB9] overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 space-y-6"
            >
              <motion.p
                initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="text-xs sm:text-sm font-semibold tracking-wide text-[#B66A50]"
              >
                AKYIN VENTURES · Parent Corporate Group
              </motion.p>

              <motion.h1
                initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight leading-[1.06] text-[#292722] text-balance"
              >
                Building Ideas Into Businesses.
              </motion.h1>

              <motion.p
                initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="text-base sm:text-lg text-[#292722]/85 leading-relaxed"
              >
                AKYIN Ventures brings together diverse business initiatives across publishing, marketing, retail, digital technology, B2B commerce and business consulting.
              </motion.p>

              <motion.p
                initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="text-sm sm:text-base text-[#77736C] leading-relaxed"
              >
                We build, develop and operate ventures focused on practical solutions, accessible products and evolving market opportunities.
              </motion.p>

              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <button
                  type="button"
                  onClick={() => onNavigate('/ventures')}
                  className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#B66A50] hover:bg-[#9E5740] text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
                >
                  <span>Explore Our Ventures</span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#FFFFFF] hover:bg-[#EFE9DE] text-[#292722] border border-[#D9CCB9] text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
                >
                  Connect With Us
                </button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
              style={shouldReduceMotion ? undefined : { y: heroImageY }}
              className="lg:col-span-6"
            >
              <div className="group rounded-2xl overflow-hidden border border-[#D9CCB9] shadow-lg aspect-[4/3] bg-[#EFE9DE]">
                <ResilientImage
                  src={IMAGES.warmCorporateHero}
                  alt="Sunlit international corporate workspace with travertine walls and natural oak architecture"
                  loading="eager"
                  fallbackTitle="AKYIN Ventures Corporate Studio"
                  className="w-full h-full"
                  imageClassName="group-hover:scale-[1.03]"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. About AKYIN Ventures (Minimalist Pure White Editorial Composition) */}
      <section className="py-20 lg:py-24 bg-[#FFFFFF]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-5 space-y-3">
              <p className="text-xs font-semibold tracking-wide text-[#B66A50]">
                About AKYIN Ventures
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#292722] text-balance">
                One Parent Group. Seven Distinct Verticals.
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-5 text-base text-[#77736C] leading-relaxed">
              <p className="text-[#292722]">
                AKYIN Ventures operates as the parent business group overseeing seven specialized ventures across independent publishing, automotive marketing and sales training, fashion retail, value consumer retail, AI-enabled calculation tools, B2B stock commerce, and business consulting.
              </p>
              <p>
                Each vertical runs with its own dedicated brand, domain, and operating model—giving readers, dealerships, shoppers, entrepreneurs, and commercial buyers focused execution under the central umbrella of{' '}
                <span className="font-semibold text-[#292722]">akyin.com</span>.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('/about')}
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-[#B66A50] hover:text-[#9E5740] transition-colors cursor-pointer"
                >
                  <span>Read the Corporate Profile</span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        </EditorialReveal>
      </section>

      {/* 3. Our Business Portfolio — Visual Grid Across All 7 Verticals */}
      <section className="py-20 lg:py-24 bg-[#F7F5F0] border-t border-[#D9CCB9]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold tracking-wide text-[#B66A50]">
                Our Business Portfolio
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#292722] text-balance">
                Equal Focus Across Seven Operating Industries.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/ventures')}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[#292722] hover:text-[#B66A50] transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>View Portfolio Directory</span>
              <ArrowRight
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </button>
          </div>

          <div className="divide-y divide-[#D9CCB9] border border-[#D9CCB9] bg-[#FFFFFF] rounded-2xl overflow-hidden shadow-sm">
            {VENTURES_PORTFOLIO.map((venture) => (
              <article
                key={venture.id}
                className="group grid grid-cols-1 lg:grid-cols-12 items-stretch transition-colors duration-200 hover:bg-[#F7F5F0]/55"
              >
                <div className="lg:col-span-4 aspect-[16/10] lg:aspect-auto bg-[#EFE9DE] overflow-hidden">
                  <ResilientImage
                    src={venture.image}
                    alt={venture.imageAlt}
                    loading="lazy"
                    fallbackTitle={venture.name}
                    className="w-full h-full"
                    imageClassName="group-hover:scale-[1.04]"
                  />
                </div>
                <div className="lg:col-span-8 p-7 sm:p-9 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#77736C]">
                      <span className="font-mono-num font-bold text-[#B66A50]">
                        {venture.code}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium">{venture.sector}</span>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-[#292722] group-hover:text-[#B66A50] transition-colors">
                      {venture.name}
                    </h3>
                    <p className="text-sm font-semibold text-[#83866A]">
                      {venture.positioning}
                    </p>
                    <p className="text-sm text-[#77736C] leading-relaxed max-w-2xl">
                      {venture.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#EFE9DE]">
                    <button
                      type="button"
                      onClick={() => onNavigate(venture.route)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#B66A50] hover:bg-[#9E5740] text-white text-xs font-semibold transition-all duration-200 cursor-pointer"
                    >
                      <span>Explore Venture</span>
                      <ArrowRight
                        className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </button>

                    {venture.externalUrl && (
                      <a
                        href={venture.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#292722] hover:text-[#B66A50] transition-colors"
                      >
                        <span>Visit {venture.externalLabel}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </EditorialReveal>
      </section>

      {/* 4. Our Business Ecosystem — Ventures Ticker, AutoClub Client, Platforms Ticker */}
      <EcosystemSection onNavigate={onNavigate} />

      {/* 5. Explore Our Ventures (Pure White Editorial Composition) */}
      <section className="py-20 lg:py-24 bg-[#FFFFFF] border-t border-[#D9CCB9]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6">
              <div className="group rounded-2xl overflow-hidden border border-[#D9CCB9] shadow-md aspect-[4/3] bg-[#F7F5F0]">
                <ResilientImage
                  src={IMAGES.warmEditorialStudio}
                  alt="Warm stone strategy table with business notebooks and ceramic vessel in natural daylight"
                  loading="lazy"
                  fallbackTitle="AKYIN Ventures Strategy"
                  className="w-full h-full"
                  imageClassName="group-hover:scale-[1.03]"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <p className="text-xs font-semibold tracking-wide text-[#B66A50]">
                Explore Our Ventures
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#292722] text-balance">
                Dedicated Destinations for Readers, Shoppers, Entrepreneurs &amp; Businesses.
              </h2>
              <p className="text-base text-[#292722]/80 leading-relaxed">
                Whether exploring global book editions, modern discounted fashion, everyday consumer value retail, natural-language calculation tools, wholesale B2B stock opportunities, business consulting, or automotive dealership marketing, navigate directly to the division built for your need.
              </p>
              <div className="flex flex-wrap gap-2.5 pt-2">
                {VENTURES_PORTFOLIO.map((venture) => (
                  <button
                    key={venture.id}
                    type="button"
                    onClick={() => onNavigate(venture.route)}
                    className="px-4 py-2.5 rounded-lg bg-[#F7F5F0] border border-[#D9CCB9] hover:border-[#B66A50] text-[#292722] hover:text-[#B66A50] text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
                  >
                    {venture.shortName}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </EditorialReveal>
      </section>

      {/* 6. Our Approach to Business (Warm Ivory) */}
      <section className="py-20 lg:py-24 bg-[#F7F5F0] border-t border-[#D9CCB9]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold tracking-wide text-[#B66A50]">
              Our Approach to Business
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#292722] text-balance">
              Grounded Execution Over Hype.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2 border-t border-[#D9CCB9]">
            <div className="pt-6 space-y-3">
              <p className="font-mono-num text-xs font-bold text-[#B66A50]">01</p>
              <h3 className="font-display text-xl font-bold text-[#292722]">
                Clear Operational Boundaries
              </h3>
              <p className="text-sm text-[#77736C] leading-relaxed">
                Each operating unit maintains transparent scope—keeping independent platforms, client engagements, and owned ventures clearly distinguished.
              </p>
            </div>
            <div className="pt-6 space-y-3">
              <p className="font-mono-num text-xs font-bold text-[#B66A50]">02</p>
              <h3 className="font-display text-xl font-bold text-[#292722]">
                Accessible Products &amp; Utilities
              </h3>
              <p className="text-sm text-[#77736C] leading-relaxed">
                From books on international marketplaces and everyday retail value to AI calculation tools, B2B supply, and consulting guidance, our ventures emphasize practical usefulness.
              </p>
            </div>
            <div className="pt-6 space-y-3">
              <p className="font-mono-num text-xs font-bold text-[#B66A50]">03</p>
              <h3 className="font-display text-xl font-bold text-[#292722]">
                Honest Commercial Communication
              </h3>
              <p className="text-sm text-[#77736C] leading-relaxed">
                We communicate actual capabilities, written pricing terms, and direct contact pathways without inflated claims or fabricated metrics.
              </p>
            </div>
          </div>
        </EditorialReveal>
      </section>

      {/* 7. Featured Products & Platforms (All 7 Verticals Showcase) */}
      <section className="py-20 lg:py-24 bg-[#FFFFFF] border-t border-[#D9CCB9]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold tracking-wide text-[#B66A50]">
              Featured Products &amp; Platforms
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#292722] text-balance">
              Direct Gateways Across All Seven Verticals.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Publishing */}
            <div className="group bg-[#F7F5F0]/60 hover:bg-[#FFFFFF] rounded-xl border border-[#D9CCB9] p-6 flex flex-col justify-between space-y-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-[#83866A]">Publishing</p>
                <h3 className="font-editorial text-lg font-bold text-[#292722]">
                  THE DISCIPLINE CODE
                </h3>
                <p className="text-xs text-[#77736C] leading-relaxed">
                  Published by AKYIN Publishing. Available on Google Play Books and Amazon.
                </p>
              </div>
              <div className="pt-3 border-t border-[#EFE9DE]">
                <a
                  href={PUBLISHING_LINKS.googlePlayDisciplineCode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#B66A50] hover:underline"
                >
                  <span>Google Play Books</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* 2. Marketing */}
            <div className="group bg-[#F7F5F0]/60 hover:bg-[#FFFFFF] rounded-xl border border-[#D9CCB9] p-6 flex flex-col justify-between space-y-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-[#83866A]">Marketing</p>
                <h3 className="font-display text-lg font-bold text-[#292722]">
                  AKYIN Marketing
                </h3>
                <p className="text-xs text-[#77736C] leading-relaxed">
                  Automotive lead generation, enquiry qualification, and dealership sales training.
                </p>
              </div>
              <div className="pt-3 border-t border-[#EFE9DE]">
                <button
                  type="button"
                  onClick={() => onNavigate('/ventures/marketing')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#B66A50] hover:underline cursor-pointer"
                >
                  <span>Explore Division</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* 3. Store / Thrift */}
            <div className="group bg-[#F7F5F0]/60 hover:bg-[#FFFFFF] rounded-xl border border-[#D9CCB9] p-6 flex flex-col justify-between space-y-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-[#83866A]">Fashion Retail</p>
                <h3 className="font-display text-lg font-bold text-[#292722]">
                  AKYIN Thrift
                </h3>
                <p className="text-xs text-[#77736C] leading-relaxed">
                  Fashionable men’s and women’s clothing at exceptional discounted prices.
                </p>
              </div>
              <div className="pt-3 border-t border-[#EFE9DE]">
                <button
                  type="button"
                  onClick={() => onNavigate('/ventures/store')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#B66A50] hover:underline cursor-pointer"
                >
                  <span>Explore Store</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* 4. AICalc */}
            <div className="group bg-[#F7F5F0]/60 hover:bg-[#FFFFFF] rounded-xl border border-[#D9CCB9] p-6 flex flex-col justify-between space-y-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-[#83866A]">Technology</p>
                <h3 className="font-display text-lg font-bold text-[#292722]">
                  AICalc.in
                </h3>
                <p className="text-xs text-[#77736C] leading-relaxed">
                  Natural-language AI calculation queries paired with manual calculator controls.
                </p>
              </div>
              <div className="pt-3 border-t border-[#EFE9DE]">
                <a
                  href={EXTERNAL_VERTICAL_URLS.aicalc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#B66A50] hover:underline"
                >
                  <span>Visit AICalc.in</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* 5. Kartigo */}
            <div className="group bg-[#F7F5F0]/60 hover:bg-[#FFFFFF] rounded-xl border border-[#D9CCB9] p-6 flex flex-col justify-between space-y-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-[#83866A]">B2B Supply</p>
                <h3 className="font-display text-lg font-bold text-[#292722]">
                  Kartigo.online
                </h3>
                <p className="text-xs text-[#77736C] leading-relaxed">
                  Dedicated B2B stock supply and wholesale commerce platform for businesses.
                </p>
              </div>
              <div className="pt-3 border-t border-[#EFE9DE]">
                <a
                  href={EXTERNAL_VERTICAL_URLS.kartigo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#B66A50] hover:underline"
                >
                  <span>Explore Kartigo</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* 6. BizNXT */}
            <div className="group bg-[#F7F5F0]/60 hover:bg-[#FFFFFF] rounded-xl border border-[#D9CCB9] p-6 flex flex-col justify-between space-y-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-[#83866A]">Consulting</p>
                <h3 className="font-display text-lg font-bold text-[#292722]">
                  BizNXT.online
                </h3>
                <p className="text-xs text-[#77736C] leading-relaxed">
                  Business guidance and consulting helping entrepreneurs make informed decisions.
                </p>
              </div>
              <div className="pt-3 border-t border-[#EFE9DE] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate('/ventures/biznxt')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#B66A50] hover:underline cursor-pointer"
                >
                  <span>Overview</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </button>
                <a
                  href={EXTERNAL_VERTICAL_URLS.biznxt}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#292722] hover:text-[#B66A50]"
                >
                  <span>biznxt.online</span>
                  <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* 7. Budget Bazaar */}
            <div className="group bg-[#F7F5F0]/60 hover:bg-[#FFFFFF] rounded-xl border border-[#D9CCB9] p-6 flex flex-col justify-between space-y-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm sm:col-span-2 lg:col-span-2">
              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-[#83866A]">Affordable Retail</p>
                <h3 className="font-display text-lg font-bold text-[#292722]">
                  Budget Bazaar (budgetbazaar.org)
                </h3>
                <p className="text-xs text-[#77736C] leading-relaxed max-w-xl">
                  Value-oriented retail storefront bringing affordable household goods and everyday essentials directly to budget-conscious shoppers.
                </p>
              </div>
              <div className="pt-3 border-t border-[#EFE9DE] flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('/ventures/budget-bazaar')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#B66A50] hover:underline cursor-pointer"
                >
                  <span>Explore Budget Bazaar</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </button>
                <a
                  href={EXTERNAL_VERTICAL_URLS.budgetBazaar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#292722] hover:text-[#B66A50]"
                >
                  <span>Visit budgetbazaar.org</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </EditorialReveal>
      </section>

      {/* Dedicated Social Channels Strip */}
      <section className="py-12 bg-[#F7F5F0] border-t border-[#D9CCB9]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold text-[#B66A50]">
              Connect Across Social Platforms · @akyinmarketing
            </p>
            <h3 className="font-display text-xl font-bold text-[#292722] mt-1">
              Follow Our Official Channels
            </h3>
          </div>
          <SocialLinks variant="inline" />
        </EditorialReveal>
      </section>

      {/* 8. Contact & Partnership Enquiries */}
      <EditorialReveal>
        <ContactDispatcher
          sectionId="home-contact"
          heading="Contact & Partnership Enquiries."
          subheading="Connect with AKYIN Ventures for publishing discussions, retail collaborations, AICalc, Kartigo, BizNXT, Budget Bazaar, dealership marketing proposals, or corporate partnerships."
        />
      </EditorialReveal>

      <section className="py-8 bg-[#EFE9DE] border-t border-[#D9CCB9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#292722]">
            Need a specialized category form? Visit our central enquiry desk.
          </p>
          <button
            type="button"
            onClick={() =>
              onStartEnquiry({
                category: 'Partnership Enquiry',
                vertical: 'AKYIN Ventures (Corporate Group)',
                enquiryType: 'Strategic Business Partnership',
              })
            }
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#B66A50] hover:bg-[#9E5740] text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>Open Dedicated Contact Page</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  );
}
