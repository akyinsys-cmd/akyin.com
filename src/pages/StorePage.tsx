import { useState } from 'react';
import { ArrowRight, CheckCircle2, ShoppingBag, Tag } from 'lucide-react';
import { IMAGES } from '../data/akyinData';
import { ContactDispatcher } from '../components/ContactDispatcher';
import { EditorialReveal } from '../components/EditorialReveal';
import { ResilientImage } from '../components/ResilientImage';

export function StorePage() {
  const [selectedCollection, setSelectedCollection] = useState(
    'AKYIN THRIFT — Catalogue & Discounted Fashion Enquiry'
  );

  const handleEnquireCollection = (label: string) => {
    setSelectedCollection(label);
    const el = document.getElementById('store-contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div>
      {/* 1. Fashion Editorial Hero Campaign */}
      <section className="bg-[#F7F5F0] text-[#292722] pt-24 pb-16 lg:pt-32 lg:pb-24 border-b border-[#D9CCB9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wide text-[#77736C]">
              <span>AKYIN STORE</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#B66A50]">AKYIN THRIFT</span>
              <span aria-hidden="true">·</span>
              <span>Affordable Fashion. Exceptional Discounts.</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight leading-[1.06] text-[#292722] text-balance">
              Great Style. Smarter Prices.
            </h1>

            <p className="text-base sm:text-lg text-[#77736C] leading-relaxed">
              Discover carefully selected fashion and clothing at exceptional discounted prices through AKYIN THRIFT.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() =>
                  handleEnquireCollection('AKYIN THRIFT — Catalogue & Discounted Fashion Enquiry')
                }
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#B66A50] hover:bg-[#9E5740] text-white text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
              >
                Request Available Catalogue
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <a
                href="#thrift-collections"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#FFFFFF] hover:bg-[#EFE9DE] text-[#292722] border border-[#D9CCB9] text-sm font-semibold transition-colors whitespace-nowrap"
              >
                Explore Collections
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-[#D9CCB9] shadow-lg aspect-[4/3] bg-[#EFE9DE]">
              <ResilientImage
                src={IMAGES.thriftHero}
                alt="Curated clothing racks inside the sunlit AKYIN THRIFT fashion showroom"
                loading="eager"
                fallbackTitle="AKYIN STORE · AKYIN THRIFT"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. About AKYIN THRIFT */}
      <section className="py-20 lg:py-24 bg-[#FFFFFF]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 space-y-5">
            <p className="text-xs font-semibold tracking-wide text-[#B66A50]">
              AKYIN STORE · Retail Brand Architecture
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#292722] text-balance">
              About AKYIN THRIFT
            </h2>
            <p className="text-base text-[#77736C] leading-relaxed">
              Operating under <span className="font-semibold text-[#292722]">AKYIN STORE</span>, <span className="font-semibold text-[#292722]">AKYIN THRIFT</span> is a clothing and fashion retail label dedicated to making wearable contemporary clothing accessible at substantial discounts.
            </p>
            <p className="text-base text-[#77736C] leading-relaxed">
              Every selection balances timeless everyday staples—clean streetwear, tailored casual shirts, denim, and soft knitwear—with practical value for smart shoppers.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-[#D9CCB9] aspect-[4/3] bg-[#F7F5F0]">
              <ResilientImage
                src={IMAGES.thriftFlatlay}
                alt="Folded cotton tees, denim, and knitwear curated by AKYIN THRIFT"
                loading="lazy"
                fallbackTitle="AKYIN THRIFT Curated Apparel"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </EditorialReveal>
      </section>

      {/* 3. Featured Clothing Collections + 4. Men's & 5. Women's Fashion */}
      <section
        id="thrift-collections"
        className="py-20 lg:py-24 bg-[#F7F5F0] border-t border-[#D9CCB9]"
      >
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold tracking-wide text-[#B66A50]">
              Featured Clothing Collections
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#292722] text-balance">
              Curated Apparel Across Men’s, Women’s &amp; Everyday Streetwear.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <article className="bg-[#FFFFFF] rounded-2xl border border-[#D9CCB9] p-7 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold text-[#83866A]">01 · Men’s Fashion</p>
                <h3 className="font-display text-2xl font-bold text-[#292722]">
                  Men’s Contemporary &amp; Casual Wear
                </h3>
                <p className="text-sm text-[#77736C] leading-relaxed">
                  Clean-cut shirts, heavy cotton tees, structured overshirts, denim, and relaxed knitwear selected for durability and everyday versatility at discounted retail value.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleEnquireCollection("AKYIN THRIFT — Men's Fashion Enquiry")}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#B66A50] hover:underline transition-colors cursor-pointer"
              >
                Enquire Men’s Selection
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </article>

            <article className="bg-[#FFFFFF] rounded-2xl border border-[#D9CCB9] p-7 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold text-[#83866A]">02 · Women’s Fashion</p>
                <h3 className="font-display text-2xl font-bold text-[#292722]">
                  Women’s Everyday &amp; Layered Styles
                </h3>
                <p className="text-sm text-[#77736C] leading-relaxed">
                  Thoughtfully selected tops, tailored separates, knitwear, casual outerwear, and effortless wardrobe essentials priced for value-minded shoppers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleEnquireCollection("AKYIN THRIFT — Women's Fashion Enquiry")}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#B66A50] hover:underline transition-colors cursor-pointer"
              >
                Enquire Women’s Selection
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </article>

            <article className="bg-[#FFFFFF] rounded-2xl border border-[#D9CCB9] p-7 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold text-[#83866A]">03 · Streetwear &amp; Casual</p>
                <h3 className="font-display text-2xl font-bold text-[#292722]">
                  Streetwear &amp; Seasonal Drops
                </h3>
                <p className="text-sm text-[#77736C] leading-relaxed">
                  Relaxed-fit hoodies, graphic essentials, utility outerwear, and seasonal assortments brought together under the AKYIN THRIFT value banner.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleEnquireCollection('AKYIN THRIFT — Streetwear & Seasonal Drops Enquiry')
                }
                className="inline-flex items-center gap-2 text-xs font-bold text-[#B66A50] hover:underline transition-colors cursor-pointer"
              >
                Enquire Seasonal Drops
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </article>
          </div>
        </EditorialReveal>
      </section>

      {/* 6. Fashion Deals & Discounts + 7. Why Shop AKYIN THRIFT (Warm Cream Section) */}
      <section className="py-20 lg:py-24 bg-[#EFE9DE] border-t border-[#D9CCB9]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#B66A50]">
              <Tag className="w-4 h-4" aria-hidden="true" />
              <span>Fashion Deals &amp; Value Merchandising</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#292722] text-balance">
              Why Shop AKYIN THRIFT?
            </h2>
            <p className="text-base text-[#77736C] leading-relaxed">
              We focus on curated quality clothing offered at genuinely accessible, discounted price points—without inflated retail markups or artificial countdown gimmicks.
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: 'Curated Selection',
                text: 'Handpicked apparel focused on fit, fabric feel, and wearable everyday style.',
              },
              {
                title: 'Value-Driven Pricing',
                text: 'Built specifically around exceptional discounts compared to standard retail pricing.',
              },
              {
                title: 'Men’s & Women’s Ranges',
                text: 'Balanced collections spanning streetwear, casual staples, and smart-casual layers.',
              },
              {
                title: 'Direct Shopping Support',
                text: 'Connect directly with the AKYIN STORE team for current availability and bulk/retail enquiries.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-[#FFFFFF] border border-[#D9CCB9] rounded-xl p-5 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#83866A] shrink-0" aria-hidden="true" />
                  <h3 className="font-display text-sm font-bold text-[#292722]">{item.title}</h3>
                </div>
                <p className="text-xs text-[#77736C] leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </EditorialReveal>
      </section>

      {/* Shopping CTA Banner */}
      <section className="py-12 bg-[#FFFFFF] border-t border-[#D9CCB9]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#F7F5F0] border border-[#D9CCB9] flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 text-[#B66A50]" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-[#292722]">
                Interested in Current AKYIN THRIFT Availability?
              </h3>
              <p className="text-xs sm:text-sm text-[#77736C]">
                Send a direct shopping or retail catalogue enquiry below—no fake checkout or placeholder stock counts.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              handleEnquireCollection('AKYIN THRIFT — Catalogue & Discounted Fashion Enquiry')
            }
            className="px-5 py-3 rounded-lg bg-[#B66A50] hover:bg-[#9E5740] text-white text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer"
          >
            Enquire About Current Stock
          </button>
        </EditorialReveal>
      </section>

      {/* 8. Contact & Shopping Enquiries */}
      <EditorialReveal>
        <ContactDispatcher
          sectionId="store-contact"
          defaultCategory="Retail and Store Enquiry"
          defaultVertical="Akyin Store / AKYIN THRIFT"
          defaultEnquiryType={selectedCollection}
          heading="AKYIN STORE &amp; AKYIN THRIFT Enquiries."
          subheading="Reach out for current discounted clothing collections, sizing availability, or retail collaborations."
        />
      </EditorialReveal>
    </div>
  );
}
