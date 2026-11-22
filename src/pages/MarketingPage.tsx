import { useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Search,
  ShieldAlert,
  X,
} from 'lucide-react';
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
import { ResilientImage } from '../components/ResilientImage';
import { SocialLinks } from '../components/SocialLinks';

export function MarketingPage() {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');
  const [rateSearch, setRateSearch] = useState('');
  const [selectedEnquiryType, setSelectedEnquiryType] = useState(
    'Package A — Full Dealership Marketing & Lead Management'
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
      {/* 1. Warm Neutral Corporate Marketing Hero with Automotive Imagery */}
      <section className="bg-[#F7F5F0] text-[#292722] pt-24 pb-16 lg:pt-32 lg:pb-24 border-b border-[#D9CCB9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#B66A50]">
              AKYIN MARKETINGS · Automotive Dealership Growth &amp; Sales Training
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.06] text-[#292722] text-balance">
              Drive More Enquiries. Build Stronger Dealerships.
            </h1>
            <p className="text-base sm:text-lg text-[#77736C] leading-relaxed">
              AKYIN MARKETINGS helps automobile dealerships attract potential buyers, qualify customer enquiries and strengthen showroom sales performance through digital marketing, AI-assisted lead management and practical automotive sales expertise.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#marketing-services"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#B66A50] hover:bg-[#9E5740] text-white text-sm font-semibold transition-colors whitespace-nowrap"
              >
                Explore Services
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={() =>
                  handleEnquireItem('Package A — Full Dealership Marketing & Lead Management')
                }
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#FFFFFF] hover:bg-[#EFE9DE] text-[#292722] border border-[#D9CCB9] text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
              >
                Request a Proposal
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-[#D9CCB9] shadow-lg aspect-[4/3] bg-[#EFE9DE]">
              <ResilientImage
                src={IMAGES.salesTraining}
                alt="Automotive dealership showroom sales executives presenting a vehicle walkaround"
                loading="eager"
                fallbackTitle="AKYIN MARKETINGS Automotive Showroom"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. About AKYIN MARKETINGS */}
      <section className="py-20 lg:py-24 bg-[#EFE9DE]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7 space-y-3">
              <p className="text-xs font-semibold tracking-wide text-[#B66A50]">
                About AKYIN MARKETINGS
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#292722] text-balance">
                Automotive Knowledge. Marketing Intelligence. Sales Performance.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-base text-[#292722]/85 leading-relaxed">
                Grounded in <span className="font-semibold">16 years of automobile industry experience</span> with exposure to leading brands from <span className="font-semibold">Maruti Suzuki to Audi</span>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ABOUT_PILLARS.map((pillar) => (
              <div
                key={pillar.number}
                className="glass-panel-warm rounded-2xl p-7 sm:p-8 space-y-4"
              >
                <div className="flex items-center gap-2 text-xs font-medium text-[#77736C]">
                  <span className="font-mono-num font-bold text-[#B66A50]">
                    {pillar.number}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{pillar.meta}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-[#292722]">
                  {pillar.title}
                </h3>
                <p className="text-sm text-[#77736C] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </EditorialReveal>
      </section>

      {/* 3. Complete 18-Service Catalogue */}
      <section
        id="marketing-services"
        className="py-20 lg:py-24 bg-[#FFFFFF] border-t border-[#D9CCB9]"
      >
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold tracking-wide text-[#B66A50]">
                Complete Service Catalogue · 18 Services
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#292722] text-balance">
                Automotive Dealership Marketing, Qualification &amp; Training.
              </h2>
              <p className="text-sm sm:text-base text-[#77736C] leading-relaxed">
                <span className="font-semibold text-[#292722]">Lead Generation</span> and{' '}
                <span className="font-semibold text-[#292722]">Lead Filtering &amp; Qualification</span>{' '}
                are strictly distinct services. AKYIN manages AI calling and pipeline workflows internally and does not sell standalone CRM software.
              </p>
            </div>

            <div
              role="tablist"
              aria-label="Filter marketing services"
              className="flex flex-wrap gap-1.5 p-1.5 bg-[#F7F5F0] rounded-xl border border-[#D9CCB9]"
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
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#B66A50] text-white'
                        : 'text-[#292722] hover:bg-[#FFFFFF]'
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
                className="rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-5 border border-[#D9CCB9] bg-[#F7F5F0]/55 hover:bg-[#FFFFFF] transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs text-[#77736C]">
                    <span>
                      <span className="font-mono-num font-bold text-[#B66A50]">
                        {svc.number}
                      </span>{' '}
                      <span aria-hidden="true">·</span> {svc.categoryLabel}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#292722]">
                    {svc.title}
                  </h3>
                  {svc.scopeNote && (
                    <p className="text-xs font-semibold text-[#B66A50] leading-snug">
                      {svc.scopeNote}
                    </p>
                  )}
                  <p className="text-sm text-[#77736C] leading-relaxed">
                    {svc.summary}
                  </p>
                  <ul className="space-y-1.5 pt-1 text-xs text-[#292722]/85">
                    {svc.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-2">
                        <CheckCircle2
                          className="w-3.5 h-3.5 text-[#83866A] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#D9CCB9] flex items-center justify-between gap-3">
                  <span className="text-xs text-[#77736C] truncate">
                    {svc.rateCardMatch}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleEnquireItem(svc.rateCardMatch)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#B66A50] hover:bg-[#9E5740] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Enquire
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </EditorialReveal>
      </section>

      {/* 4. 16 Years of Automotive Industry Experience */}
      <section className="py-20 lg:py-24 bg-[#EFE9DE] border-t border-[#D9CCB9]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <p className="text-xs font-semibold tracking-wide text-[#B66A50]">
                16 Years of Automotive Industry Experience
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#292722] text-balance">
                Exposure Across Leading Brands from Maruti Suzuki to Audi.
              </h2>
              <p className="text-base text-[#77736C] leading-relaxed">
                Sixteen years inside showroom floors, dealership BDC workflows, vehicle deliveries, and multi-segment customer conversations—ensuring digital marketing aligns with actual showroom processes.
              </p>
            </div>
            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-[#D9CCB9] aspect-[4/3] bg-[#FFFFFF]">
                <ResilientImage
                  src={IMAGES.automotiveHeritage}
                  alt="Multi-brand automotive dealership floor spanning compact hatchbacks to executive sedans"
                  loading="lazy"
                  fallbackTitle="Automotive Industry Experience"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXPERIENCE_MILESTONES.map((milestone) => (
              <div
                key={milestone.number}
                className="bg-[#FFFFFF] rounded-2xl border border-[#D9CCB9] p-6 sm:p-7 space-y-3"
              >
                <div className="flex items-center gap-2 text-xs text-[#77736C]">
                  <span className="font-mono-num font-bold text-[#B66A50]">
                    {milestone.number}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{milestone.spectrum}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-[#292722]">
                  {milestone.title}
                </h3>
                <p className="text-sm text-[#77736C] leading-relaxed">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </EditorialReveal>
      </section>

      {/* 5. Dedicated Sales Training Section */}
      <section className="py-20 lg:py-24 bg-[#F7F5F0] border-t border-[#D9CCB9]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-5">
            <div className="h-full min-h-[340px] rounded-2xl overflow-hidden border border-[#D9CCB9] bg-[#FFFFFF]">
              <ResilientImage
                src={IMAGES.heroShowroom}
                alt="Contemporary automotive showroom bay prepared for vehicle delivery and sales coaching"
                loading="lazy"
                fallbackTitle="Automotive Sales Training"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between space-y-7">
            <div className="space-y-4">
              <p className="text-xs font-semibold tracking-wide text-[#B66A50]">
                Automotive Sales Training &amp; Personality Development
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#292722] text-balance">
                Develop Better Sales Executives. Create Better Customer Experiences.
              </h2>
              <p className="text-base text-[#77736C] leading-relaxed">
                Structured on-site dealership training focused on showroom discipline, vehicle presentation, customer confidence, and conversion craft.
              </p>
            </div>

            <div className="bg-[#FFFFFF] rounded-2xl border border-[#D9CCB9] p-6 sm:p-7 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EFE9DE]">
                <div>
                  <p className="text-xs font-medium text-[#77736C]">Training Session Fee</p>
                  <p className="font-mono-num text-2xl sm:text-3xl font-bold text-[#292722] mt-0.5">
                    ₹25,000 <span className="text-sm font-medium text-[#77736C]">per session</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleEnquireItem('Sales training')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#B66A50] hover:bg-[#9E5740] text-white text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
                >
                  Request Training Proposal
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <p className="text-xs text-[#77736C]">
                Scope, duration, participant count, and location are agreed in writing before booking.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                {TRAINING_CURRICULUM.map((topic, index) => (
                  <div key={topic} className="flex items-start gap-2.5 text-sm text-[#292722]">
                    <span className="font-mono-num text-xs font-bold text-[#B66A50] mt-0.5">
                      {String(index + 1).padStart(2, '0')}.
                    </span>
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </EditorialReveal>
      </section>

      {/* 6. Packages & Complete Searchable Rate Card */}
      <section className="py-20 lg:py-24 bg-[#FFFFFF] border-t border-[#D9CCB9]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold tracking-wide text-[#B66A50]">
              Transparent Pricing &amp; Commercial Terms
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#292722] text-balance">
              Retainer Packages &amp; Individual Service Rate Card.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {PRICING_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-2xl p-7 sm:p-9 flex flex-col justify-between space-y-7 border ${
                  pkg.featured
                    ? 'bg-[#EFE9DE] border-[#B66A50]/50'
                    : 'bg-[#F7F5F0] border-[#D9CCB9]'
                }`}
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono-num text-xs font-bold text-[#B66A50]">
                      {pkg.code}
                    </span>
                    <span className="text-xs font-medium text-[#77736C]">
                      Commercial Retainer
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-2xl font-bold text-[#292722]">
                      {pkg.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#77736C]">
                      {pkg.subtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#D9CCB9]">
                    <div>
                      <p className="text-xs text-[#77736C]">One-time Setup</p>
                      <p className="font-mono-num text-2xl font-bold text-[#292722] mt-1">
                        {pkg.setupFee}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#77736C]">Monthly Maintenance</p>
                      <p className="font-mono-num text-2xl font-bold text-[#292722] mt-1">
                        {pkg.monthlyFee}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <p className="text-xs font-semibold text-[#292722]">Included Scope</p>
                    <ul className="space-y-2 text-sm text-[#292722]">
                      {pkg.includes.map((inc) => (
                        <li key={inc} className="flex items-start gap-2.5">
                          <CheckCircle2
                            className="w-4 h-4 text-[#83866A] shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 pt-1">
                    <p className="text-xs font-semibold text-[#77736C]">
                      Explicitly Excluded
                    </p>
                    <ul className="space-y-1.5 text-xs text-[#77736C]">
                      {pkg.excludes.map((exc) => (
                        <li key={exc} className="flex items-start gap-2">
                          <ShieldAlert
                            className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#A99C8B]"
                            aria-hidden="true"
                          />
                          <span>{exc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleEnquireItem(pkg.enquiryServiceValue)}
                  className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                    pkg.featured
                      ? 'bg-[#B66A50] hover:bg-[#9E5740] text-white'
                      : 'bg-[#FFFFFF] border border-[#D9CCB9] hover:border-[#B66A50] text-[#292722]'
                  }`}
                >
                  Enquire About {pkg.code}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>

          {/* Searchable 21-item Individual Rate Card */}
          <div className="rounded-2xl bg-[#F7F5F0] border border-[#D9CCB9] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-[#B66A50]">
                  Individual Service Rate Card
                </p>
                <h3 className="font-display text-2xl font-bold text-[#292722] mt-1">
                  Searchable Service Fee Schedule
                </h3>
                <p className="text-xs text-[#77736C] mt-1.5">
                  Indicative service fees subject to written quotation · Applicable GST extra · External costs (Meta ad spend, extra AI minutes, creator fees, special video shoots) charged separately.
                </p>
              </div>

              <div className="relative w-full md:w-80 shrink-0">
                <Search
                  className="w-4 h-4 text-[#A99C8B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={rateSearch}
                  onChange={(e) => setRateSearch(e.target.value)}
                  placeholder="Search service or category..."
                  aria-label="Search rate card"
                  className="w-full pl-10 pr-9 py-2.5 rounded-lg bg-[#FFFFFF] border border-[#D9CCB9] text-sm text-[#292722] placeholder:text-[#A99C8B] focus:outline-none focus:border-[#B66A50]"
                />
                {rateSearch && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setRateSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#77736C] hover:text-[#292722] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {filteredRates.length === 0 ? (
              <div className="rounded-xl bg-[#FFFFFF] p-8 text-center border border-[#D9CCB9]">
                <p className="text-sm font-semibold text-[#292722]">
                  No services matched &ldquo;{rateSearch}&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => setRateSearch('')}
                  className="mt-3 text-xs font-semibold text-[#B66A50] hover:underline cursor-pointer"
                >
                  Reset Search
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl bg-[#FFFFFF] border border-[#D9CCB9]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#EFE9DE] text-xs font-semibold text-[#77736C]">
                      <th className="py-3.5 px-4 sm:px-5">Service</th>
                      <th className="py-3.5 px-4 hidden md:table-cell">Category</th>
                      <th className="py-3.5 px-4 hidden lg:table-cell">Scope Notes</th>
                      <th className="py-3.5 px-4 text-right">Indicative Fee</th>
                      <th className="py-3.5 px-4 sm:px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFE9DE] text-sm">
                    {filteredRates.map((item) => (
                      <tr key={item.id} className="hover:bg-[#F7F5F0]/70 transition-colors">
                        <td className="py-3.5 px-4 sm:px-5 font-semibold text-[#292722]">
                          <div>{item.service}</div>
                          <div className="text-xs font-normal text-[#77736C] md:hidden mt-0.5">
                            {item.category}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-medium text-[#77736C] hidden md:table-cell whitespace-nowrap">
                          {item.category}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-[#77736C] hidden lg:table-cell">
                          {item.notes}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <span className="font-mono-num font-bold text-[#292722]">
                            {item.fee}
                          </span>
                          <span className="text-xs text-[#77736C]">{item.unit}</span>
                        </td>
                        <td className="py-3.5 px-4 sm:px-5 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleEnquireItem(item.service)}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#EFE9DE] hover:bg-[#B66A50] text-[#292722] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
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
          <div className="rounded-2xl bg-[#EFE9DE] border border-[#D9CCB9] p-6 sm:p-8 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-[#B66A50]">
                  Official Social Channels · {OFFICIAL_CONTACT.marketingSocialHandle}
                </p>
                <h3 className="font-display text-xl font-bold text-[#292722] mt-1">
                  Follow AKYIN MARKETINGS
                </h3>
              </div>
            </div>
            <SocialLinks variant="card" />
          </div>
        </EditorialReveal>
      </section>

      {/* 7. Marketing Enquiry Dispatcher */}
      <EditorialReveal>
        <ContactDispatcher
          sectionId="marketing-contact"
          defaultCategory="Marketing Services Enquiry"
          defaultVertical="Akyin Marketing"
          defaultEnquiryType={selectedEnquiryType}
          heading="Request a Dealership Proposal."
          subheading="Pre-select any package or service above and send your structured dealership enquiry directly via WhatsApp or Email."
        />
      </EditorialReveal>
    </div>
  );
}
