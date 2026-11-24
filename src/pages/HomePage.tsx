import { ArrowRight, ArrowUpRight, ChevronDown, Sparkles } from 'lucide-react';
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
import { CustomerReviews } from '../components/CustomerReviews';
import { EcosystemSection } from '../components/EcosystemSection';
import { EditorialReveal } from '../components/EditorialReveal';
import {
  FloatingGlassCTA,
  GlassButton,
  GlassCard,
  GlassImageFrame,
  GlassPanel,
} from '../components/liquid-glass';
import { ResilientImage } from '../components/ResilientImage';
import { SocialLinks } from '../components/SocialLinks';
import { SuccessStoriesCarousel } from '../components/SuccessStoriesCarousel';
import { useSiteConfig } from '../context/SiteConfigContext';

interface HomePageProps {
  onNavigate: (route: AppRoute) => void;
  onStartEnquiry: (options: {
    category: string;
    vertical: string;
    enquiryType?: string;
  }) => void;
}

export function HomePage({ onNavigate, onStartEnquiry }: HomePageProps) {
  const { settings, ventures: ventureOverrides } = useSiteConfig();
  const shouldReduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, 32]);

  const activeVentures = VENTURES_PORTFOLIO.map((baseVenture) => {
    const override = ventureOverrides.find((v) => v.id === baseVenture.id);
    if (override && !override.active) return null;
    return {
      ...baseVenture,
      name: override?.title || baseVenture.name,
      sector: override?.category || baseVenture.sector,
      description: override?.description || baseVenture.description,
      externalUrl: override?.externalUrl || baseVenture.externalUrl,
    };
  }).filter((v): v is NonNullable<typeof v> => Boolean(v));

  const rowOneVentures = activeVentures.slice(0, 2);
  const rowTwoVentures = activeVentures.slice(2, 5);
  const rowThreeVentures = activeVentures.slice(5);

  return (
    <div>
      {/* 1. Apple-Inspired Liquid Glass Full-Width Hero */}
      <section
        ref={heroRef}
        className="relative surface-silver-gradient pt-24 pb-16 lg:pt-32 lg:pb-24 border-b border-[#E8E8ED] overflow-hidden"
      >
        {/* Subtle studio daylight ambient halos */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 right-1/4 w-[520px] h-[520px] rounded-full bg-white/90 blur-3xl opacity-95"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-10 w-[420px] h-[420px] rounded-full bg-[#1D1D1F]/[0.03] blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 space-y-6"
            >
              <div className="space-y-3">
                <motion.h1
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display text-4xl sm:text-5xl lg:text-[58px] font-bold tracking-[-0.03em] leading-[1.05] text-[#1D1D1F] text-balance"
                >
                  {settings.heroHeadline || 'Building Ideas Into Businesses.'}
                </motion.h1>

                <motion.p
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display text-lg sm:text-xl font-semibold tracking-[-0.015em] text-[#3A3A3F]"
                >
                  One Vision. Multiple Ventures. Endless Possibilities.
                </motion.p>
              </div>

              <motion.p
                initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="text-base sm:text-[17px] text-[#6E6E73] leading-relaxed max-w-xl"
              >
                {settings.heroSubheadline ||
                  'AKYIN Ventures operates a diverse portfolio of seven independent businesses alongside a full-service marketing agency—spanning publishing, retail, AI tools, B2B supply, consulting, and multi-sector brand growth.'}
              </motion.p>

              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap items-center gap-3.5 pt-2"
              >
                <GlassButton
                  variant="primary"
                  size="lg"
                  onClick={() => onNavigate('/ventures')}
                >
                  <span>Explore Our Ventures</span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </GlassButton>

                <FloatingGlassCTA onClick={() => onNavigate('/advisory')}>
                  <span>Book Business Advisory</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#1D1D1F]" aria-hidden="true" />
                </FloatingGlassCTA>
              </motion.div>
            </motion.div>

            {/* Right 3D Liquid Glass Studio Monolith Showcase */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
              style={shouldReduceMotion ? undefined : { y: heroImageY }}
              className="lg:col-span-6 relative"
            >
              <GlassImageFrame>
                <div className="group aspect-[16/10] sm:aspect-[4/3] bg-[#FFFFFF] overflow-hidden">
                  <ResilientImage
                    src={IMAGES.liquidGlassHero}
                    alt="Apple-style isolated translucent crystal prism on seamless pure white studio surface featuring the brushed metallic AKYIN ribbon emblem"
                    loading="eager"
                    branded={false}
                    fallbackTitle="AKYIN Ventures Liquid Glass"
                    className="w-full h-full bg-[#FFFFFF]"
                    imageClassName="object-contain p-2 sm:p-4 group-hover:scale-[1.03]"
                  />
                </div>
              </GlassImageFrame>

              {/* Floating Translucent Liquid Glass Spec Panel */}
              <div className="mt-4 sm:mt-0 sm:absolute sm:-bottom-5 sm:left-5 sm:right-5">
                <GlassPanel className="rounded-2xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-[#1D1D1F]/8 text-[#1D1D1F] flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                    <div className="text-xs">
                      <p className="font-semibold text-[#1D1D1F]">
                        Multiple Businesses &amp; Full-Service Marketing Agency
                      </p>
                      <p className="text-[#6E6E73]">
                        Publishing · Marketing Agency · Retail · AI · B2B · Consulting
                      </p>
                    </div>
                  </div>
                  <span className="font-mono-num text-[11px] font-semibold text-[#1D1D1F]">
                    akyin.com
                  </span>
                </GlassPanel>
              </div>
            </motion.div>
          </div>

          {/* Subtle Scroll-Down Discovery Indicator */}
          <div className="mt-12 lg:mt-16 flex justify-center">
            <a
              href="#our-ecosystem"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('our-ecosystem')?.scrollIntoView({
                  behavior: shouldReduceMotion ? 'auto' : 'smooth',
                  block: 'start',
                });
              }}
              aria-label="Scroll down to discover our ecosystem verticals"
              className="group inline-flex flex-col items-center gap-2.5 text-xs font-medium text-[#6E6E73] hover:text-[#1D1D1F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1D1F]/30 rounded-2xl px-4 py-2"
            >
              <span className="tracking-[0.12em] uppercase text-[10px] font-semibold">
                Scroll to explore verticals
              </span>
              <motion.span
                animate={shouldReduceMotion ? undefined : { y: [0, 5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="w-9 h-9 rounded-full frosted-glass-pill flex items-center justify-center text-[#1D1D1F] group-hover:bg-white transition-all shadow-xs"
              >
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              </motion.span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. About AKYIN Ventures (Pure White Editorial Composition) */}
      <section className="py-20 lg:py-28 bg-[#FFFFFF]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-5 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                About AKYIN Ventures
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.025em] text-[#1D1D1F] text-balance">
                One Parent Group. Seven Distinct Verticals.
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-5 text-base text-[#6E6E73] leading-relaxed">
              <p className="text-[#1D1D1F] font-medium text-lg leading-relaxed">
                AKYIN Ventures operates as a diversified business group and marketing agency overseeing seven specialized verticals across independent publishing, full-service marketing and brand growth, fashion retail, value consumer retail, AI-enabled calculation tools, B2B stock commerce, and business consulting.
              </p>
              <p>
                Each vertical runs with its own dedicated brand, domain, and operating model—giving readers, growing brands, shoppers, entrepreneurs, and commercial buyers focused execution under the central umbrella of{' '}
                <span className="font-semibold text-[#1D1D1F]">akyin.com</span>.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('/about')}
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-[#1D1D1F] hover:underline transition-colors cursor-pointer"
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

      {/* 3. Our Business Portfolio — Asymmetric Apple Bento & Editorial Showcase (All 7 Verticals) */}
      <section className="py-20 lg:py-28 bg-[#F5F5F7] border-t border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <EditorialReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                  Our Business Portfolio
                </p>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-[-0.025em] text-[#1D1D1F] text-balance">
                  Equal Focus Across Seven Operating Industries.
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('/ventures')}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-[#1D1D1F] hover:underline transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>View Portfolio Directory</span>
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </button>
            </div>
          </EditorialReveal>

          {/* Row 1: Verticals 01 & 02 — Flagship 2-Up Spotlight */}
          {rowOneVentures.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {rowOneVentures.map((venture, idx) => (
                <EditorialReveal key={venture.id} delay={idx * 0.05} className="h-full">
                  <article className="h-full group liquid-glass-card rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5">
                    <div>
                      <div className="aspect-[4/3] bg-[#FFFFFF] overflow-hidden border-b border-[#E8E8ED]/70">
                        <ResilientImage
                          src={venture.image}
                          alt={venture.imageAlt}
                          loading="lazy"
                          fallbackTitle={venture.name}
                          className="w-full h-full bg-[#FFFFFF]"
                          imageClassName="object-contain p-3 sm:p-4 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="p-7 sm:p-8 space-y-3">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E6E73]">
                          <span className="font-mono-num font-bold text-[#1D1D1F]">
                            {venture.code}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-medium">{venture.sector}</span>
                        </div>
                        <h3 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F] group-hover:text-[#3A3A3F] transition-colors">
                          {venture.name}
                        </h3>
                        <p className="text-sm font-semibold text-[#1D1D1F]/80">
                          {venture.positioning}
                        </p>
                        <p className="text-sm text-[#6E6E73] leading-relaxed">
                          {venture.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-7 sm:px-8 pb-7 pt-4 border-t border-[#1D1D1F]/8 flex flex-wrap items-center justify-between gap-4">
                      <GlassButton
                        variant="primary"
                        size="sm"
                        onClick={() => onNavigate(venture.route)}
                      >
                        <span>Explore Venture</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </GlassButton>

                      {venture.externalUrl && (
                        <a
                          href={venture.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D1D1F] hover:text-[#6E6E73] transition-colors"
                        >
                          <span>Visit {venture.externalLabel}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </article>
                </EditorialReveal>
              ))}
            </div>
          )}

          {/* Row 2: Verticals 03, 04 & 05 — 3-Up Balanced Showcase */}
          {rowTwoVentures.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rowTwoVentures.map((venture, idx) => (
                <EditorialReveal key={venture.id} delay={idx * 0.05} className="h-full">
                  <article className="h-full group liquid-glass-card rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5">
                    <div>
                      <div className="aspect-[4/3] bg-[#FFFFFF] overflow-hidden border-b border-[#E8E8ED]/70">
                        <ResilientImage
                          src={venture.image}
                          alt={venture.imageAlt}
                          loading="lazy"
                          fallbackTitle={venture.name}
                          className="w-full h-full bg-[#FFFFFF]"
                          imageClassName="object-contain p-3 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="p-6 sm:p-7 space-y-2.5">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E6E73]">
                          <span className="font-mono-num font-bold text-[#1D1D1F]">
                            {venture.code}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-medium truncate">{venture.sector}</span>
                        </div>
                        <h3 className="font-display text-xl font-bold tracking-[-0.015em] text-[#1D1D1F] group-hover:text-[#3A3A3F] transition-colors">
                          {venture.name}
                        </h3>
                        <p className="text-xs font-semibold text-[#1D1D1F]/80">
                          {venture.positioning}
                        </p>
                        <p className="text-sm text-[#6E6E73] leading-relaxed">
                          {venture.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 sm:px-7 pb-6 pt-4 border-t border-[#1D1D1F]/8 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => onNavigate(venture.route)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D1D1F] hover:underline cursor-pointer"
                      >
                        <span>Explore Venture</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>

                      {venture.externalUrl && (
                        <a
                          href={venture.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
                        >
                          <span>{venture.externalLabel}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </article>
                </EditorialReveal>
              ))}
            </div>
          )}

          {/* Row 3: Verticals 06 & 07 — Wide Editorial Cards */}
          {rowThreeVentures.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {rowThreeVentures.map((venture, idx) => (
                <EditorialReveal key={venture.id} delay={idx * 0.05} className="h-full">
                  <article className="h-full group liquid-glass-card rounded-3xl overflow-hidden grid grid-cols-1 sm:grid-cols-12 items-stretch transition-all duration-300 hover:-translate-y-0.5">
                    <div className="sm:col-span-5 aspect-[4/3] sm:aspect-auto bg-[#FFFFFF] overflow-hidden border-b sm:border-b-0 sm:border-r border-[#E8E8ED]/70">
                      <ResilientImage
                        src={venture.image}
                        alt={venture.imageAlt}
                        loading="lazy"
                        fallbackTitle={venture.name}
                        className="w-full h-full bg-[#FFFFFF]"
                        imageClassName="object-contain p-3 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="sm:col-span-7 p-6 sm:p-7 flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E6E73]">
                          <span className="font-mono-num font-bold text-[#1D1D1F]">
                            {venture.code}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-medium">{venture.sector}</span>
                        </div>
                        <h3 className="font-display text-xl font-bold tracking-[-0.015em] text-[#1D1D1F] group-hover:text-[#3A3A3F] transition-colors">
                          {venture.name}
                        </h3>
                        <p className="text-xs font-semibold text-[#1D1D1F]/80">
                          {venture.positioning}
                        </p>
                        <p className="text-sm text-[#6E6E73] leading-relaxed">
                          {venture.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#1D1D1F]/8 flex flex-wrap items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => onNavigate(venture.route)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D1D1F] hover:underline cursor-pointer"
                        >
                          <span>Explore Venture</span>
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>

                        {venture.externalUrl && (
                          <a
                            href={venture.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
                          >
                            <span>{venture.externalLabel}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                </EditorialReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Our Business Ecosystem — Ventures Ticker, AutoClub Client, Platforms Ticker */}
      <EcosystemSection onNavigate={onNavigate} />

      {/* 5. Explore Our Ventures — Architectural Liquid Glass Composition */}
      <section className="py-20 lg:py-28 bg-[#FFFFFF] border-t border-[#E8E8ED]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6">
              <GlassImageFrame>
                <div className="group aspect-[4/3] bg-[#FFFFFF] overflow-hidden">
                  <ResilientImage
                    src={IMAGES.liquidGlassVentures}
                    alt="Apple-style isolated layered white and frosted glass cubes engraved with the AKYIN emblem on pure white studio ground"
                    loading="lazy"
                    fallbackTitle="AKYIN Ventures Architecture"
                    className="w-full h-full bg-[#FFFFFF]"
                    imageClassName="object-contain p-3 group-hover:scale-[1.03]"
                  />
                </div>
              </GlassImageFrame>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                Explore Our Ventures
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.025em] text-[#1D1D1F] text-balance">
                Dedicated Destinations for Readers, Shoppers, Entrepreneurs &amp; Growing Brands.
              </h2>
              <p className="text-base text-[#6E6E73] leading-relaxed">
                Whether exploring global book editions, full-service marketing agency campaigns, curated discounted fashion, everyday household value retail, natural-language AI calculation tools, wholesale B2B stock opportunities, or business consulting, navigate directly to the division built for your need.
              </p>
              <div className="flex flex-wrap gap-2.5 pt-2">
                {VENTURES_PORTFOLIO.map((venture) => (
                  <button
                    key={venture.id}
                    type="button"
                    onClick={() => onNavigate(venture.route)}
                    className="px-4 py-2.5 rounded-full liquid-glass-cta text-[#1D1D1F] text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
                  >
                    {venture.shortName}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </EditorialReveal>
      </section>

      {/* 6. Our Approach to Business */}
      <section className="py-20 lg:py-28 surface-silver-gradient border-t border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <EditorialReveal>
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                Our Approach to Business
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.025em] text-[#1D1D1F] text-balance">
                Grounded Execution Over Hype.
              </h2>
            </div>
          </EditorialReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <EditorialReveal delay={0}>
              <GlassCard className="p-7 h-full space-y-3">
                <p className="font-mono-num text-xs font-bold text-[#1D1D1F]">01</p>
                <h3 className="font-display text-xl font-bold text-[#1D1D1F]">
                  Clear Operational Boundaries
                </h3>
                <p className="text-sm text-[#6E6E73] leading-relaxed">
                  Each operating unit maintains transparent scope—keeping independent platforms, client engagements, and owned ventures clearly distinguished.
                </p>
              </GlassCard>
            </EditorialReveal>
            <EditorialReveal delay={0.07}>
              <GlassCard className="p-7 h-full space-y-3">
                <p className="font-mono-num text-xs font-bold text-[#1D1D1F]">02</p>
                <h3 className="font-display text-xl font-bold text-[#1D1D1F]">
                  Accessible Products &amp; Utilities
                </h3>
                <p className="text-sm text-[#6E6E73] leading-relaxed">
                  From books on international marketplaces and full-service brand growth to everyday retail value, AI utilities, B2B supply, and consulting guidance, our ventures emphasize practical usefulness.
                </p>
              </GlassCard>
            </EditorialReveal>
            <EditorialReveal delay={0.14}>
              <GlassCard className="p-7 h-full space-y-3">
                <p className="font-mono-num text-xs font-bold text-[#1D1D1F]">03</p>
                <h3 className="font-display text-xl font-bold text-[#1D1D1F]">
                  Honest Commercial Communication
                </h3>
                <p className="text-sm text-[#6E6E73] leading-relaxed">
                  We communicate actual capabilities, written pricing terms, and direct contact pathways without inflated claims or fabricated metrics.
                </p>
              </GlassCard>
            </EditorialReveal>
          </div>
        </div>
      </section>

      {/* 7. Featured Products & Platforms (All 7 Verticals Gateways) */}
      <section className="py-20 lg:py-28 bg-[#FFFFFF] border-t border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <EditorialReveal>
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                Featured Products &amp; Platforms
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.025em] text-[#1D1D1F] text-balance">
                Direct Gateways Across All Seven Verticals.
              </h2>
            </div>
          </EditorialReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Publishing */}
            <EditorialReveal delay={0} className="h-full">
              <GlassCard interactive className="h-full group rounded-3xl p-6 flex flex-col justify-between space-y-5">
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold text-[#0071E3]">Publishing · 5 Books</p>
                  <h3 className="font-editorial text-lg font-bold text-[#1D1D1F]">
                    AKYIN Publishing
                  </h3>
                  <p className="text-xs text-[#6E6E73] leading-relaxed">
                    Five published titles on Amazon—including <span className="font-semibold text-[#1D1D1F]">The Discipline Code</span>, <span className="font-semibold text-[#1D1D1F]">The Reset Code</span>, and <span className="font-semibold text-[#1D1D1F]">The Wealth Trap</span>.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#1D1D1F]/8 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigate('/ventures/publishing')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D1D1F] hover:underline cursor-pointer"
                  >
                    <span>Explore Books</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </button>
                  <a
                    href={PUBLISHING_LINKS.amazonAuthorStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F]"
                  >
                    <span>Amazon</span>
                    <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                  </a>
                </div>
              </GlassCard>
            </EditorialReveal>

            {/* 2. Marketing Agency */}
            <EditorialReveal delay={0.05} className="h-full">
              <GlassCard interactive className="h-full group rounded-3xl p-6 flex flex-col justify-between space-y-5">
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold text-[#6E6E73]">Marketing Agency</p>
                  <h3 className="font-display text-lg font-bold text-[#1D1D1F]">
                    AKYIN Marketing
                  </h3>
                  <p className="text-xs text-[#6E6E73] leading-relaxed">
                    Full-service performance marketing, creative strategy, lead qualification, and commercial sales training.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#1D1D1F]/8">
                  <button
                    type="button"
                    onClick={() => onNavigate('/ventures/marketing')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D1D1F] hover:underline cursor-pointer"
                  >
                    <span>Explore Agency</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </button>
                </div>
              </GlassCard>
            </EditorialReveal>

            {/* 3. Store / Thrift */}
            <EditorialReveal delay={0.1} className="h-full">
              <GlassCard interactive className="h-full group rounded-3xl p-6 flex flex-col justify-between space-y-5">
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold text-[#6E6E73]">Fashion Retail</p>
                  <h3 className="font-display text-lg font-bold text-[#1D1D1F]">
                    AKYIN Thrift
                  </h3>
                  <p className="text-xs text-[#6E6E73] leading-relaxed">
                    Fashionable men’s and women’s clothing at exceptional discounted prices.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#1D1D1F]/8">
                  <button
                    type="button"
                    onClick={() => onNavigate('/ventures/store')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D1D1F] hover:underline cursor-pointer"
                  >
                    <span>Explore Store</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </button>
                </div>
              </GlassCard>
            </EditorialReveal>

            {/* 4. AICalc */}
            <EditorialReveal delay={0.15} className="h-full">
              <GlassCard interactive className="h-full group rounded-3xl p-6 flex flex-col justify-between space-y-5">
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold text-[#6E6E73]">Technology</p>
                  <h3 className="font-display text-lg font-bold text-[#1D1D1F]">
                    AICalc.in
                  </h3>
                  <p className="text-xs text-[#6E6E73] leading-relaxed">
                    Natural-language AI calculation queries paired with manual calculator controls.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#1D1D1F]/8">
                  <a
                    href={EXTERNAL_VERTICAL_URLS.aicalc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D1D1F] hover:underline"
                  >
                    <span>Visit AICalc.in</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </GlassCard>
            </EditorialReveal>

            {/* 5. Kartigo */}
            <EditorialReveal delay={0.05} className="h-full">
              <GlassCard interactive className="h-full group rounded-3xl p-6 flex flex-col justify-between space-y-5">
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold text-[#6E6E73]">B2B Supply</p>
                  <h3 className="font-display text-lg font-bold text-[#1D1D1F]">
                    Kartigo.online
                  </h3>
                  <p className="text-xs text-[#6E6E73] leading-relaxed">
                    Dedicated B2B stock supply and wholesale commerce platform for businesses.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#1D1D1F]/8">
                  <a
                    href={EXTERNAL_VERTICAL_URLS.kartigo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D1D1F] hover:underline"
                  >
                    <span>Explore Kartigo</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </GlassCard>
            </EditorialReveal>

            {/* 6. BizNXT */}
            <EditorialReveal delay={0.1} className="h-full">
              <GlassCard interactive className="h-full group rounded-3xl p-6 flex flex-col justify-between space-y-5">
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold text-[#6E6E73]">Consulting</p>
                  <h3 className="font-display text-lg font-bold text-[#1D1D1F]">
                    BizNXT.online
                  </h3>
                  <p className="text-xs text-[#6E6E73] leading-relaxed">
                    Business guidance and consulting helping entrepreneurs make informed decisions.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#1D1D1F]/8 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigate('/ventures/biznxt')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D1D1F] hover:underline cursor-pointer"
                  >
                    <span>Overview</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </button>
                  <a
                    href={EXTERNAL_VERTICAL_URLS.biznxt}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F]"
                  >
                    <span>biznxt.online</span>
                    <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                  </a>
                </div>
              </GlassCard>
            </EditorialReveal>

            {/* 7. Budget Bazaar */}
            <EditorialReveal delay={0.15} className="h-full sm:col-span-2 lg:col-span-2">
              <GlassCard interactive className="h-full group rounded-3xl p-6 flex flex-col justify-between space-y-5">
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold text-[#6E6E73]">Affordable Retail</p>
                  <h3 className="font-display text-lg font-bold text-[#1D1D1F]">
                    Budget Bazaar (budgetbazaar.org)
                  </h3>
                  <p className="text-xs text-[#6E6E73] leading-relaxed max-w-xl">
                    Value-oriented retail storefront bringing affordable household goods and everyday essentials directly to budget-conscious shoppers.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#1D1D1F]/8 flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => onNavigate('/ventures/budget-bazaar')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D1D1F] hover:underline cursor-pointer"
                  >
                    <span>Explore Budget Bazaar</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </button>
                  <a
                    href={EXTERNAL_VERTICAL_URLS.budgetBazaar}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F]"
                  >
                    <span>Visit budgetbazaar.org</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </GlassCard>
            </EditorialReveal>
          </div>
        </div>
      </section>

      {/* Dedicated Social Channels Strip */}
      <section className="py-12 surface-silver-gradient border-t border-[#E8E8ED]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#6E6E73]">
              Connect Across Social Platforms · @akyinmarketing
            </p>
            <h3 className="font-display text-xl font-bold text-[#1D1D1F] mt-1">
              Follow Our Official Channels
            </h3>
          </div>
          <SocialLinks variant="inline" />
        </EditorialReveal>
      </section>

      {/* Automotive & B2B Client Success Stories Carousel */}
      <EditorialReveal>
        <SuccessStoriesCarousel onNavigate={onNavigate} />
      </EditorialReveal>

      {/* 8. Customer & Client Endorsements — Verified Reviews across AKYIN Ventures */}
      <EditorialReveal>
        <CustomerReviews onNavigate={onNavigate} />
      </EditorialReveal>

      {/* 9. Contact & Partnership Enquiries */}
      <EditorialReveal>
        <ContactDispatcher
          sectionId="home-contact"
          heading="Contact & Partnership Enquiries."
          subheading="Connect with AKYIN Ventures for marketing agency proposals, publishing discussions, retail collaborations, AICalc, Kartigo, BizNXT, Budget Bazaar, or corporate partnerships."
        />
      </EditorialReveal>

      {/* Transparent Pricing Summary & Corporate Gateways */}
      <section className="py-14 bg-[#FFFFFF] border-t border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                Transparent Commercial Pricing · INR
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[#1D1D1F]">
                Clear Agency Retainers, Training &amp; Advisory Rates.
              </h2>
            </div>
            <a
              href="/pricing"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/pricing');
              }}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1D1D1F] hover:underline whitespace-nowrap"
            >
              <span>View Full Pricing &amp; 21-Item Rate Card</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="frosted-glass-card rounded-2xl p-5 space-y-1.5">
              <p className="text-xs font-semibold text-[#6E6E73]">Package A · Full Growth</p>
              <p className="font-mono-num text-xl font-bold text-[#1D1D1F]">₹49,999/mo</p>
              <p className="text-xs text-[#6E6E73]">+ ₹39,999 one-time setup</p>
            </div>
            <div className="frosted-glass-card rounded-2xl p-5 space-y-1.5">
              <p className="text-xs font-semibold text-[#6E6E73]">Package B · Lead Filtering</p>
              <p className="font-mono-num text-xl font-bold text-[#1D1D1F]">₹19,999/mo</p>
              <p className="text-xs text-[#6E6E73]">+ ₹14,999 one-time setup</p>
            </div>
            <div className="frosted-glass-card rounded-2xl p-5 space-y-1.5">
              <p className="text-xs font-semibold text-[#6E6E73]">Sales Team Training</p>
              <p className="font-mono-num text-xl font-bold text-[#1D1D1F]">₹25,000</p>
              <p className="text-xs text-[#6E6E73]">Per showroom/team session</p>
            </div>
            <div className="frosted-glass-card rounded-2xl p-5 space-y-1.5">
              <p className="text-xs font-semibold text-[#6E6E73]">1-on-1 Advisory</p>
              <p className="font-mono-num text-xl font-bold text-[#1D1D1F]">₹1,999</p>
              <p className="text-xs text-[#6E6E73]">30-min IST strategy session</p>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E8E8ED] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#6E6E73]">
              <a href="mailto:connect@akyin.com" className="font-semibold text-[#1D1D1F] hover:underline">
                connect@akyin.com
              </a>
              <span aria-hidden="true">·</span>
              <a href="tel:+916305694011" className="font-mono-num font-semibold text-[#1D1D1F] hover:underline">
                +91-6305694011
              </a>
              <span aria-hidden="true">·</span>
              <a
                href="/terms"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/terms');
                }}
                className="hover:text-[#1D1D1F] hover:underline"
              >
                Terms of Service
              </a>
              <span aria-hidden="true">·</span>
              <a
                href="/privacy"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/privacy');
                }}
                className="hover:text-[#1D1D1F] hover:underline"
              >
                Privacy Policy
              </a>
            </div>
            <GlassButton
              variant="primary"
              size="sm"
              onClick={() =>
                onStartEnquiry({
                  category: 'Partnership Enquiry',
                  vertical: 'AKYIN Ventures (Corporate Group)',
                  enquiryType: 'Strategic Business Partnership',
                })
              }
            >
              <span>Open Dedicated Contact Page</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </GlassButton>
          </div>
        </div>
      </section>
    </div>
  );
}
