import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { AppRoute, IMAGES, VENTURES_PORTFOLIO } from '../data/akyinData';
import { BusinessFAQs } from '../components/BusinessFAQs';
import { EditorialReveal } from '../components/EditorialReveal';
import { ResilientImage } from '../components/ResilientImage';

interface AboutPageProps {
  onNavigate: (route: AppRoute) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div>
      {/* Warm Editorial Corporate Header */}
      <section className="bg-[#EFE9DE] text-[#292722] pt-28 pb-20 lg:pt-36 lg:pb-24 border-b border-[#D9CCB9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <p className="text-xs font-semibold tracking-wide text-[#B66A50]">
              Corporate Profile · AKYIN Ventures
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] text-balance">
              One Vision. Multiple Business Ventures.
            </h1>
            <p className="text-base sm:text-lg text-[#77736C] leading-relaxed max-w-2xl">
              AKYIN Ventures develops and operates business initiatives across different industries, bringing together digital platforms, publishing, marketing, commerce and retail under one parent business identity.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-[#D9CCB9] shadow-md aspect-[4/3] bg-[#F7F5F0]">
              <ResilientImage
                src={IMAGES.warmCorporateHero}
                alt="Warm sunlit architectural workspace representing AKYIN Ventures"
                loading="eager"
                fallbackTitle="AKYIN Ventures"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Operating Orientation */}
      <section className="py-20 bg-[#FFFFFF]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 space-y-5">
            <p className="text-xs font-semibold tracking-wide text-[#B66A50]">
              Group Orientation
            </p>
            <h2 className="font-display text-3xl font-bold text-[#292722] text-balance">
              Diversified Initiatives Guided by Practical Demand.
            </h2>
            <p className="text-base text-[#77736C] leading-relaxed">
              AKYIN Ventures focuses on operating practical ventures across seven clear domains: independent publishing reaching readers worldwide, specialized marketing and sales training for automobile dealerships, discounted fashion apparel through AKYIN THRIFT, value retail through Budget Bazaar, AI-enabled calculation tools at AICalc.in, B2B stock commerce on Kartigo.online, and business guidance through BizNXT.online.
            </p>
            <p className="text-base text-[#77736C] leading-relaxed">
              Each venture maintains its own dedicated identity and platform while benefitting from unified entrepreneurial direction and commercial governance.
            </p>
          </div>
          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-[#D9CCB9] aspect-[4/3] bg-[#F7F5F0]">
              <ResilientImage
                src={IMAGES.warmEditorialStudio}
                alt="AKYIN Ventures editorial strategy desk in natural daylight"
                loading="lazy"
                fallbackTitle="AKYIN Ventures Studio"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </EditorialReveal>
      </section>

      {/* Complete Business Portfolio Purpose Breakdown */}
      <section className="py-20 lg:py-24 bg-[#F7F5F0] border-t border-[#D9CCB9]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold tracking-wide text-[#B66A50]">
              Venture Architecture
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#292722] text-balance">
              Purpose of Each Business Vertical.
            </h2>
          </div>

          <div className="space-y-6">
            {VENTURES_PORTFOLIO.map((venture) => (
              <article
                key={venture.id}
                className="group bg-[#FFFFFF] rounded-2xl border border-[#D9CCB9] overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch transition-all duration-200 hover:shadow-md"
              >
                <div className="lg:col-span-4 aspect-[16/10] lg:aspect-auto bg-[#EFE9DE]">
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
                      <span>{venture.sector}</span>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-[#292722]">
                      {venture.name}
                    </h3>
                    <p className="text-sm font-semibold text-[#83866A]">
                      {venture.positioning}
                    </p>
                    <p className="text-sm text-[#77736C] leading-relaxed">
                      {venture.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-[#EFE9DE]">
                    <button
                      type="button"
                      onClick={() => onNavigate(venture.route)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#B66A50] hover:bg-[#9E5740] text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Open Vertical Page
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>

                    {venture.externalUrl && (
                      <a
                        href={venture.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#292722] hover:text-[#B66A50] transition-colors"
                      >
                        Visit {venture.externalLabel}
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

      {/* New Business FAQs Component for the About Page */}
      <section className="py-20 lg:py-24 bg-[#FFFFFF] border-t border-[#D9CCB9]">
        <EditorialReveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BusinessFAQs />
        </EditorialReveal>
      </section>
    </div>
  );
}
