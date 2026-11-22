import { ArrowUpRight, Boxes, Building2, CheckCircle2, Truck } from 'lucide-react';
import { EXTERNAL_VERTICAL_URLS, IMAGES } from '../data/akyinData';
import { ContactDispatcher } from '../components/ContactDispatcher';
import { EditorialReveal } from '../components/EditorialReveal';
import { ResilientImage } from '../components/ResilientImage';

export function KartigoPage() {
  return (
    <div>
      {/* 1. Bright B2B Commerce Hero */}
      <section className="bg-[#F7F5F0] text-[#292722] pt-24 pb-16 lg:pt-32 lg:pb-24 border-b border-[#D9CCB9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#B66A50]">
              KARTIGO · kartigo.online · B2B Stock Supply &amp; Commerce
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.06] text-[#292722] text-balance">
              Connecting Businesses With Stock Opportunities.
            </h1>
            <p className="text-base sm:text-lg text-[#77736C] leading-relaxed">
              Kartigo is a B2B-oriented stock supply platform designed to support business buyers and sellers through a dedicated commerce environment.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={EXTERNAL_VERTICAL_URLS.kartigo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#B66A50] hover:bg-[#9E5740] text-white text-sm font-semibold transition-colors whitespace-nowrap"
              >
                Explore Kartigo.online
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="#kartigo-concept"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#FFFFFF] hover:bg-[#EFE9DE] text-[#292722] border border-[#D9CCB9] text-sm font-semibold transition-colors whitespace-nowrap"
              >
                Learn How It Works
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-[#D9CCB9] shadow-lg aspect-[4/3] bg-[#EFE9DE]">
              <ResilientImage
                src={IMAGES.kartigoWarehouse}
                alt="Bright modern wholesale distribution and B2B stock warehouse interior"
                loading="eager"
                fallbackTitle="KARTIGO · kartigo.online"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. B2B Stock Supply Concept */}
      <section id="kartigo-concept" className="py-20 lg:py-24 bg-[#FFFFFF]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5 space-y-3">
            <p className="text-xs font-semibold tracking-wide text-[#B66A50]">
              B2B Stock Supply Concept
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#292722] text-balance">
              Focused Wholesale &amp; Stock Trade Environment.
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-4 text-base text-[#77736C] leading-relaxed">
            <p className="text-[#292722]">
              Businesses sourcing inventory and suppliers holding available commercial stock often rely on fragmented phone calls and informal messaging threads. Kartigo gives B2B buyers and sellers a dedicated web destination built around commercial stock discovery.
            </p>
            <p>
              As an independent operating platform under AKYIN Ventures at <span className="font-semibold text-[#292722]">kartigo.online</span>, Kartigo focuses cleanly on B2B stock supply interactions without unrelated consumer retail clutter.
            </p>
          </div>
        </EditorialReveal>
      </section>

      {/* 3. Business Buyer Benefits & 4. Supplier Opportunities */}
      <section className="py-20 lg:py-24 bg-[#F7F5F0] border-t border-[#D9CCB9]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#D9CCB9] p-8 space-y-5">
            <div className="w-10 h-10 rounded-lg bg-[#EFE9DE] text-[#B66A50] flex items-center justify-center">
              <Building2 className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-display text-2xl font-bold text-[#292722]">
              Business Buyer Benefits
            </h3>
            <p className="text-sm text-[#77736C] leading-relaxed">
              Structured discovery for commercial buyers seeking wholesale and bulk stock lots.
            </p>
            <ul className="space-y-2.5 text-sm text-[#292722]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#83866A] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Dedicated B2B commerce focus without consumer clutter</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#83866A] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Direct access to wholesale stock opportunities</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#83866A] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Clear pathway for trade and procurement discussions</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#FFFFFF] rounded-2xl border border-[#D9CCB9] p-8 space-y-5">
            <div className="w-10 h-10 rounded-lg bg-[#EFE9DE] text-[#83866A] flex items-center justify-center">
              <Boxes className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-display text-2xl font-bold text-[#292722]">
              Supplier Opportunities
            </h3>
            <p className="text-sm text-[#77736C] leading-relaxed">
              A focused channel for wholesalers, distributors, and stock holders to reach business buyers.
            </p>
            <ul className="space-y-2.5 text-sm text-[#292722]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#83866A] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Present commercial stock opportunities to trade-oriented visitors</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#83866A] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Support structured wholesale and stock movement cycles</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#83866A] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Initiate direct B2B supply conversations with AKYIN Ventures</span>
              </li>
            </ul>
          </div>
        </EditorialReveal>
      </section>

      {/* 5. Wholesale & Stock Opportunities + 6. How the Platform Works + 7. Explore CTA */}
      <section className="py-20 lg:py-24 bg-[#EFE9DE] border-t border-[#D9CCB9]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold tracking-wide text-[#B66A50]">
              Wholesale &amp; Stock Workflow
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#292722] text-balance">
              How Businesses Engage With Kartigo.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Visit Kartigo.online',
                desc: 'Access the dedicated B2B stock commerce platform directly on its independent domain.',
              },
              {
                step: '02',
                title: 'Explore Stock Opportunities',
                desc: 'Review available wholesale and business stock supply categories structured for commercial buyers.',
              },
              {
                step: '03',
                title: 'Connect for Trade & Supply',
                desc: 'Engage on wholesale enquiries or supplier onboarding through direct B2B communication channels.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-[#FFFFFF] border border-[#D9CCB9] rounded-2xl p-6 sm:p-7 space-y-3"
              >
                <p className="font-mono-num text-xs font-bold text-[#B66A50]">{item.step}</p>
                <h3 className="font-display text-xl font-bold text-[#292722]">{item.title}</h3>
                <p className="text-sm text-[#77736C] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-[#FFFFFF] border border-[#D9CCB9] p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Truck className="w-8 h-8 text-[#B66A50] shrink-0" aria-hidden="true" />
              <div>
                <h3 className="font-display text-xl font-bold text-[#292722]">
                  Ready to Explore Wholesale &amp; B2B Stock Supply?
                </h3>
                <p className="text-sm text-[#77736C] mt-0.5">
                  Visit the dedicated Kartigo platform directly at kartigo.online.
                </p>
              </div>
            </div>
            <a
              href={EXTERNAL_VERTICAL_URLS.kartigo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#B66A50] hover:bg-[#9E5740] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              Explore Kartigo.online
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </EditorialReveal>
      </section>

      {/* 8. Business Partnership Enquiry */}
      <EditorialReveal>
        <ContactDispatcher
          sectionId="kartigo-contact"
          defaultCategory="Kartigo Business Enquiry"
          defaultVertical="Kartigo (kartigo.online)"
          defaultEnquiryType="Kartigo B2B Buyer / Supplier Onboarding"
          heading="Kartigo B2B Supply &amp; Partnership Enquiries."
          subheading="Connect with our B2B commerce desk regarding wholesale sourcing, supplier onboarding, or stock supply collaborations."
        />
      </EditorialReveal>
    </div>
  );
}
