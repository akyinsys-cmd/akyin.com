import { useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Search,
  ShieldAlert,
  X,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ABOUT_PILLARS,
  EXPERIENCE_MILESTONES,
  IMAGES,
  MARKETING_SERVICES,
  OFFICIAL_CONTACT,
  PRICING_PACKAGES,
  RATE_CARD_ITEMS,
  SERVICE_CATEGORIES,
  ServiceCategory,
  TRAINING_CURRICULUM,
} from '../data/akyinData';
import { ContactDispatcher } from '../components/ContactDispatcher';
import { EditorialReveal } from '../components/EditorialReveal';
import {
  GlassButton,
  GlassCard,
  GlassImageFrame,
  GlassPanel,
} from '../components/liquid-glass';
import { ResilientImage } from '../components/ResilientImage';
import { SocialLinks } from '../components/SocialLinks';

export function MarketingPage() {
  const shouldReduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');
  const [rateSearch, setRateSearch] = useState('');
  const [selectedEnquiryType, setSelectedEnquiryType] = useState(
    'Package A — Full-Service Growth Marketing & Lead Management'
  );

  const filteredServices = useMemo(() => {
    if (activeCategory === 'all') return MARKETING_SERVICES;
    return MARKETING_SERVICES.filter((svc) => svc.category === activeCategory);
  }, [activeCategory]);

  const filteredRates = useMemo(() => {
    const q = rateSearch.trim().toLowerCase();
    if (!q) return RATE_CARD_ITEMS;
    return RATE_CARD_ITEMS.filter(
      (item) =>
        item.service.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.notes.toLowerCase().includes(q)
    );
  }, [rateSearch]);

  const handleEnquireItem = (serviceName: string) => {
    setSelectedEnquiryType(serviceName);
    const el = document.getElementById('marketing-contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div>
      {/* 1. Apple-Inspired Liquid Glass Marketing Agency Hero */}
      <section className="surface-silver-gradient text-[#1D1D1F] pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.06em] text-[#6E6E73]">
              AKYIN MARKETINGS · Full-Service Marketing Agency &amp; Growth Solutions
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-[-0.025em] leading-[1.06] text-[#1D1D1F] text-balance">
              Drive Qualified Demand. Grow Stronger Brands.
            </h1>
            <p className="text-base sm:text-lg text-[#6E6E73] leading-relaxed">
              AKYIN MARKETINGS is a full-service marketing agency helping retail brands, service businesses, B2B companies, and dealerships generate qualified leads, manage AI-assisted enquiry follow-up, and elevate commercial sales conversion.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <GlassButton href="#marketing-services" variant="primary" size="lg">
                <span>Explore Agency Services</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </GlassButton>
              <GlassButton
                variant="glass"
                size="lg"
                onClick={() =>
                  handleEnquireItem('Package A — Full-Service Growth Marketing & Lead Management')
                }
              >
                Request an Agency Proposal
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
                  src={IMAGES.salesTraining}
                  alt="Apple-style isolated anodized aluminum marketing agency workstation with AKYIN emblem on seamless pure white studio background"
                  loading="eager"
                  fallbackTitle="AKYIN MARKETINGS Agency"
                  className="w-full h-full bg-[#FFFFFF]"
                  imageClassName="object-contain p-3"
                />
              </div>
            </GlassImageFrame>
          </motion.div>
        </div>
      </section>

      {/* Automotive Marketing Dedicated Division Banner */}
      <section className="py-10 bg-white border-b border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassPanel className="p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-purple-50/50 via-white to-amber-50/30">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                Specialised Industry Division
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1D1D1F]">
                Looking for AKYIN Automotive Marketing &amp; Dealership Growth?
              </h2>
              <p className="text-sm sm:text-base text-[#6E6E73]">
                Explore our dedicated automotive division featuring 16 specialised dealership services and an interactive 19-slide company presentation viewer.
              </p>
            </div>
            <GlassButton
              href="/marketing/automotive"
              variant="primary"
              size="lg"
              className="shrink-0"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                window.history.pushState({}, '', '/marketing/automotive');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
            >
              <span>Visit Automotive Marketing</span>
              <ArrowRight className="w-4 h-4" />
            </GlassButton>
          </GlassPanel>
        </div>
      </section>

      {/* 2. About AKYIN MARKETINGS */}
      <section className="py-20 lg:py-24 bg-[#F5F5F7]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                About AKYIN MARKETINGS
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
                Brand Strategy. Performance Intelligence. Sales Conversion.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-base text-[#1D1D1F]/85 leading-relaxed">
                Grounded in <span className="font-semibold">16 years of multi-sector commercial &amp; automobile industry experience</span> with exposure to leading brands from <span className="font-semibold">Maruti Suzuki to Audi</span>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ABOUT_PILLARS.map((pillar) => (
              <GlassCard key={pillar.number} interactive className="p-7 sm:p-8 space-y-4">
                <div className="flex items-center gap-2 text-xs font-medium text-[#6E6E73]">
                  <span className="font-mono-num font-bold text-[#1D1D1F]">
                    {pillar.number}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{pillar.meta}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-[#1D1D1F]">
                  {pillar.title}
                </h3>
                <p className="text-sm text-[#6E6E73] leading-relaxed">
                  {pillar.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </EditorialReveal>
      </section>

      {/* 3. Complete 18-Service Catalogue */}
      <section
        id="marketing-services"
        className="py-20 lg:py-24 bg-[#FFFFFF] border-t border-[#E8E8ED]"
      >
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                Complete Agency Service Catalogue · 18 Services
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
                Full-Service Marketing, Lead Qualification &amp; Commercial Training.
              </h2>
              <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed">
                <span className="font-semibold text-[#1D1D1F]">Lead Generation</span> and{' '}
                <span className="font-semibold text-[#1D1D1F]">Lead Filtering &amp; Qualification</span>{' '}
                are strictly distinct services. AKYIN manages AI calling and pipeline workflows internally and does not sell standalone CRM software.
              </p>
            </div>

            <div
              role="tablist"
              aria-label="Filter marketing services"
              className="flex flex-wrap gap-1.5 p-1.5 liquid-glass-nav rounded-2xl"
            >
              {SERVICE_CATEGORIES.map((tab) => {
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#1D1D1F] text-white shadow-xs'
                        : 'text-[#1D1D1F] hover:bg-white/80'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((svc) => (
              <article
                key={svc.id}
                className="liquid-glass-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-5 transition-all duration-200"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs text-[#6E6E73]">
                    <span>
                      <span className="font-mono-num font-bold text-[#1D1D1F]">
                        {svc.number}
                      </span>{' '}
                      <span aria-hidden="true">·</span> {svc.categoryLabel}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#1D1D1F]">
                    {svc.title}
                  </h3>
                  {svc.scopeNote && (
                    <p className="text-xs font-semibold text-[#3A3A3F] leading-snug">
                      {svc.scopeNote}
                    </p>
                  )}
                  <p className="text-sm text-[#6E6E73] leading-relaxed">
                    {svc.summary}
                  </p>
                  <ul className="space-y-1.5 pt-1 text-xs text-[#1D1D1F]/85">
                    {svc.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-2">
                        <CheckCircle2
                          className="w-3.5 h-3.5 text-[#1D1D1F] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#1D1D1F]/8 flex items-center justify-between gap-3">
                  <span className="text-xs text-[#6E6E73] truncate">
                    {svc.rateCardMatch}
                  </span>
                  <GlassButton
                    variant="primary"
                    size="sm"
                    onClick={() => handleEnquireItem(svc.rateCardMatch)}
                  >
                    <span>Enquire</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </GlassButton>
                </div>
              </article>
            ))}
          </div>
        </EditorialReveal>
      </section>

      {/* 4. 16 Years of Multi-Industry & Automotive Commercial Experience */}
      <section className="py-20 lg:py-24 bg-[#F5F5F7] border-t border-[#E8E8ED]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                16 Years of Commercial &amp; Industry Track Record
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
                Proven Experience Across Diverse Markets—Including Maruti Suzuki to Audi.
              </h2>
              <p className="text-base text-[#6E6E73] leading-relaxed">
                Sixteen years working across customer acquisition funnels, BDC follow-up systems, commercial teams, and brand growth initiatives—from retail and B2B businesses to leading automotive dealerships—ensuring marketing campaigns align with actual sales conversions.
              </p>
            </div>
            <div className="lg:col-span-6">
              <GlassImageFrame>
                <div className="aspect-[4/3] bg-[#FFFFFF] overflow-hidden">
                  <ResilientImage
                    src={IMAGES.automotiveHeritage}
                    alt="Apple-style minimal architectural glass podium display featuring the engraved AKYIN ribbon emblem"
                    loading="lazy"
                    fallbackTitle="Commercial Marketing Heritage"
                    className="w-full h-full bg-[#FFFFFF]"
                    imageClassName="object-contain p-3"
                  />
                </div>
              </GlassImageFrame>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXPERIENCE_MILESTONES.map((milestone) => (
              <GlassCard
                key={milestone.number}
                interactive
                className="p-6 sm:p-7 space-y-3"
              >
                <div className="flex items-center gap-2 text-xs text-[#6E6E73]">
                  <span className="font-mono-num font-bold text-[#1D1D1F]">
                    {milestone.number}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{milestone.spectrum}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-[#1D1D1F]">
                  {milestone.title}
                </h3>
                <p className="text-sm text-[#6E6E73] leading-relaxed">
                  {milestone.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </EditorialReveal>
      </section>

      {/* 5. Dedicated Commercial Sales Training Section */}
      <section className="py-20 lg:py-24 surface-silver-gradient border-t border-[#E8E8ED]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-5">
            <GlassImageFrame className="h-full">
              <div className="h-full min-h-[340px] bg-[#FFFFFF] flex items-center justify-center">
                <ResilientImage
                  src={IMAGES.heroShowroom}
                  alt="Apple-style sleek frosted presentation tablet stand with engraved AKYIN emblem"
                  loading="lazy"
                  fallbackTitle="Commercial Sales Training"
                  className="w-full h-full bg-[#FFFFFF]"
                  imageClassName="object-contain p-4"
                />
              </div>
            </GlassImageFrame>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between space-y-7">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                Commercial &amp; Showroom Sales Training · Personality Development
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
                Develop Stronger Sales Executives. Create Better Customer Experiences.
              </h2>
              <p className="text-base text-[#6E6E73] leading-relaxed">
                Structured on-site and team sales training focused on client discipline, product presentation, consultative objection handling, and conversion craft across retail, service, and automotive environments.
              </p>
            </div>

            <GlassPanel className="rounded-3xl p-6 sm:p-7 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1D1D1F]/8">
                <div>
                  <p className="text-xs font-medium text-[#6E6E73]">Training Session Fee</p>
                  <p className="font-mono-num text-2xl sm:text-3xl font-bold text-[#1D1D1F] mt-0.5">
                    ₹25,000 <span className="text-sm font-medium text-[#6E6E73]">per session</span>
                  </p>
                </div>
                <GlassButton
                  variant="primary"
                  size="md"
                  onClick={() => handleEnquireItem('Sales training')}
                >
                  <span>Request Training Proposal</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </GlassButton>
              </div>

              <p className="text-xs text-[#6E6E73]">
                Scope, duration, participant count, and location are agreed in writing before booking.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                {TRAINING_CURRICULUM.map((topic, index) => (
                  <div key={topic} className="flex items-start gap-2.5 text-sm text-[#1D1D1F]">
                    <span className="font-mono-num text-xs font-bold text-[#1D1D1F] mt-0.5">
                      {String(index + 1).padStart(2, '0')}.
                    </span>
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>
        </EditorialReveal>
      </section>

      {/* 6. Packages & Complete Searchable Rate Card */}
      <section className="py-20 lg:py-24 bg-[#FFFFFF] border-t border-[#E8E8ED]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              Transparent Pricing &amp; Commercial Terms
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
              Retainer Packages &amp; Individual Service Rate Card.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {PRICING_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-3xl p-7 sm:p-9 flex flex-col justify-between space-y-7 transition-shadow ${
                  pkg.featured
                    ? 'liquid-glass-panel border border-[#1D1D1F]/25'
                    : 'liquid-glass-card'
                }`}
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono-num text-xs font-bold text-[#1D1D1F]">
                      {pkg.code}
                    </span>
                    <span className="text-xs font-medium text-[#6E6E73]">
                      Commercial Retainer
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-2xl font-bold text-[#1D1D1F]">
                      {pkg.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#6E6E73]">
                      {pkg.subtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#1D1D1F]/8">
                    <div>
                      <p className="text-xs text-[#6E6E73]">One-time Setup</p>
                      <p className="font-mono-num text-2xl font-bold text-[#1D1D1F] mt-1">
                        {pkg.setupFee}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6E6E73]">Monthly Maintenance</p>
                      <p className="font-mono-num text-2xl font-bold text-[#1D1D1F] mt-1">
                        {pkg.monthlyFee}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <p className="text-xs font-semibold text-[#1D1D1F]">Included Scope</p>
                    <ul className="space-y-2 text-sm text-[#1D1D1F]">
                      {pkg.includes.map((inc) => (
                        <li key={inc} className="flex items-start gap-2.5">
                          <CheckCircle2
                            className="w-4 h-4 text-[#1D1D1F] shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 pt-1">
                    <p className="text-xs font-semibold text-[#6E6E73]">
                      Explicitly Excluded
                    </p>
                    <ul className="space-y-1.5 text-xs text-[#6E6E73]">
                      {pkg.excludes.map((exc) => (
                        <li key={exc} className="flex items-start gap-2">
                          <ShieldAlert
                            className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#A1A1A6]"
                            aria-hidden="true"
                          />
                          <span>{exc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <GlassButton
                  variant={pkg.featured ? 'primary' : 'subtle'}
                  size="lg"
                  className="w-full"
                  onClick={() => handleEnquireItem(pkg.enquiryServiceValue)}
                >
                  <span>Enquire About {pkg.code}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </GlassButton>
              </div>
            ))}
          </div>

          {/* Searchable 21-item Individual Rate Card */}
          <div className="rounded-3xl liquid-glass-panel p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#6E6E73]">
                  Individual Service Rate Card
                </p>
                <h3 className="font-display text-2xl font-bold text-[#1D1D1F] mt-1">
                  Searchable Service Fee Schedule
                </h3>
                <p className="text-xs text-[#6E6E73] mt-1.5">
                  Indicative service fees subject to written quotation · Applicable GST extra · External costs (Meta ad spend, extra AI minutes, creator fees, special video shoots) charged separately.
                </p>
              </div>

              <div className="relative w-full md:w-80 shrink-0">
                <Search
                  className="w-4 h-4 text-[#A1A1A6] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  maxLength={80}
                  value={rateSearch}
                  onChange={(e) => setRateSearch(e.target.value)}
                  placeholder="Search service or category..."
                  aria-label="Search rate card"
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E8E8ED] text-sm text-[#1D1D1F] placeholder:text-[#A1A1A6] focus:outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/15"
                />
                {rateSearch && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setRateSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {filteredRates.length === 0 ? (
              <div className="rounded-2xl bg-[#FFFFFF] p-8 text-center border border-[#E8E8ED]">
                <p className="text-sm font-semibold text-[#1D1D1F]">
                  No services matched &ldquo;{rateSearch}&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => setRateSearch('')}
                  className="mt-3 text-xs font-semibold text-[#1D1D1F] hover:underline cursor-pointer"
                >
                  Reset Search
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl bg-[#FFFFFF] border border-[#E8E8ED]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E8E8ED] text-xs font-semibold text-[#6E6E73]">
                      <th className="py-3.5 px-4 sm:px-5">Service</th>
                      <th className="py-3.5 px-4 hidden md:table-cell">Category</th>
                      <th className="py-3.5 px-4 hidden lg:table-cell">Scope Notes</th>
                      <th className="py-3.5 px-4 text-right">Indicative Fee</th>
                      <th className="py-3.5 px-4 sm:px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E8ED] text-sm">
                    {filteredRates.map((item) => (
                      <tr key={item.id} className="hover:bg-[#F5F5F7]/70 transition-colors">
                        <td className="py-3.5 px-4 sm:px-5 font-semibold text-[#1D1D1F]">
                          <div>{item.service}</div>
                          <div className="text-xs font-normal text-[#6E6E73] md:hidden mt-0.5">
                            {item.category}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-medium text-[#6E6E73] hidden md:table-cell whitespace-nowrap">
                          {item.category}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-[#6E6E73] hidden lg:table-cell">
                          {item.notes}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <span className="font-mono-num font-bold text-[#1D1D1F]">
                            {item.fee}
                          </span>
                          <span className="text-xs text-[#6E6E73]">{item.unit}</span>
                        </td>
                        <td className="py-3.5 px-4 sm:px-5 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleEnquireItem(item.service)}
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
            )}
          </div>

          {/* Official @akyinmarketing Social Strip */}
          <GlassPanel className="p-6 sm:p-8 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#6E6E73]">
                  Official Social Channels · {OFFICIAL_CONTACT.marketingSocialHandle}
                </p>
                <h3 className="font-display text-xl font-bold text-[#1D1D1F] mt-1">
                  Follow AKYIN MARKETINGS
                </h3>
              </div>
            </div>
            <SocialLinks variant="card" />
          </GlassPanel>
        </EditorialReveal>
      </section>

      {/* 7. Marketing Enquiry Dispatcher */}
      <EditorialReveal>
        <ContactDispatcher
          sectionId="marketing-contact"
          defaultCategory="Marketing Services Enquiry"
          defaultVertical="Akyin Marketing"
          defaultEnquiryType={selectedEnquiryType}
          heading="Request an Agency Proposal."
          subheading="Pre-select any package or individual service above and send your structured marketing enquiry directly via WhatsApp or Email."
        />
      </EditorialReveal>
    </div>
  );
}
