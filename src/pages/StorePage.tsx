import { useState } from 'react';
import { ArrowRight, CheckCircle2, ShoppingBag, Tag } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { IMAGES } from '../data/akyinData';
import { ContactDispatcher } from '../components/ContactDispatcher';
import { EditorialReveal } from '../components/EditorialReveal';
import { GlassButton, GlassImageFrame, GlassPanel } from '../components/liquid-glass';
import { ResilientImage } from '../components/ResilientImage';

export function StorePage() {
  const shouldReduceMotion = useReducedMotion();
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
      {/* 1. Fashion Retail Liquid Glass Hero */}
      <section className="surface-silver-gradient text-[#1D1D1F] pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.06em] text-[#6E6E73]">
              <span>AKYIN STORE</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#1D1D1F]">AKYIN THRIFT</span>
              <span aria-hidden="true">·</span>
              <span>Affordable Fashion. Exceptional Discounts.</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-[-0.025em] leading-[1.06] text-[#1D1D1F] text-balance">
              Great Style. Smarter Prices.
            </h1>

            <p className="text-base sm:text-lg text-[#6E6E73] leading-relaxed">
              Discover carefully selected fashion and clothing at exceptional discounted prices through AKYIN THRIFT.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <GlassButton
                variant="primary"
                size="lg"
                onClick={() =>
                  handleEnquireCollection('AKYIN THRIFT — Catalogue & Discounted Fashion Enquiry')
                }
              >
                <span>Request Available Catalogue</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </GlassButton>
              <GlassButton href="#thrift-collections" variant="glass" size="lg">
                Explore Collections
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
                  src={IMAGES.thriftHero}
                  alt="Apple-style isolated studio sculpture of brushed aluminum hanger displaying tailored coat with embossed AKYIN emblem"
                  loading="eager"
                  fallbackTitle="AKYIN STORE · AKYIN THRIFT"
                  className="w-full h-full bg-[#FFFFFF]"
                  imageClassName="object-contain p-3"
                />
              </div>
            </GlassImageFrame>
          </motion.div>
        </div>
      </section>

      {/* 2. About AKYIN THRIFT */}
      <section className="py-20 lg:py-24 bg-[#FFFFFF]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              AKYIN STORE · Retail Brand Architecture
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
              About AKYIN THRIFT
            </h2>
            <p className="text-base text-[#6E6E73] leading-relaxed">
              Operating under <span className="font-semibold text-[#1D1D1F]">AKYIN STORE</span>, <span className="font-semibold text-[#1D1D1F]">AKYIN THRIFT</span> is a clothing and fashion retail label dedicated to making wearable contemporary clothing accessible at substantial discounts.
            </p>
            <p className="text-base text-[#6E6E73] leading-relaxed">
              Every selection balances timeless everyday staples—clean streetwear, tailored casual shirts, denim, and soft knitwear—with practical value for smart shoppers.
            </p>
          </div>

          <div className="lg:col-span-6">
            <GlassImageFrame>
              <div className="aspect-[4/3] bg-[#FFFFFF] overflow-hidden">
                <ResilientImage
                  src={IMAGES.thriftFlatlay}
                  alt="Apple-style neatly folded charcoal cotton apparel and matte black label tag bearing AKYIN monogram on pure white background"
                  loading="lazy"
                  fallbackTitle="AKYIN THRIFT Curated Apparel"
                  className="w-full h-full bg-[#FFFFFF]"
                  imageClassName="object-contain p-3"
                />
              </div>
            </GlassImageFrame>
          </div>
        </EditorialReveal>
      </section>

      {/* 3. Featured Clothing Collections */}
      <section
        id="thrift-collections"
        className="py-20 lg:py-24 bg-[#F5F5F7] border-t border-[#E8E8ED]"
      >
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              Featured Clothing Collections
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
              Curated Apparel Across Men’s, Women’s &amp; Everyday Streetwear.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <article className="liquid-glass-card rounded-3xl p-7 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <p className="font-mono-num text-xs font-semibold text-[#1D1D1F]">01 · Men’s Fashion</p>
                <h3 className="font-display text-2xl font-bold text-[#1D1D1F]">
                  Men’s Contemporary &amp; Casual Wear
                </h3>
                <p className="text-sm text-[#6E6E73] leading-relaxed">
                  Clean-cut shirts, heavy cotton tees, structured overshirts, denim, and relaxed knitwear selected for durability and everyday versatility at discounted retail value.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleEnquireCollection("AKYIN THRIFT — Men's Fashion Enquiry")}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#1D1D1F] hover:underline transition-colors cursor-pointer"
              >
                Enquire Men’s Selection
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </article>

            <article className="liquid-glass-card rounded-3xl p-7 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <p className="font-mono-num text-xs font-semibold text-[#1D1D1F]">02 · Women’s Fashion</p>
                <h3 className="font-display text-2xl font-bold text-[#1D1D1F]">
                  Women’s Everyday &amp; Layered Styles
                </h3>
                <p className="text-sm text-[#6E6E73] leading-relaxed">
                  Thoughtfully selected tops, tailored separates, knitwear, casual outerwear, and effortless wardrobe essentials priced for value-minded shoppers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleEnquireCollection("AKYIN THRIFT — Women's Fashion Enquiry")}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#1D1D1F] hover:underline transition-colors cursor-pointer"
              >
                Enquire Women’s Selection
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </article>

            <article className="liquid-glass-card rounded-3xl p-7 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <p className="font-mono-num text-xs font-semibold text-[#1D1D1F]">03 · Streetwear &amp; Casual</p>
                <h3 className="font-display text-2xl font-bold text-[#1D1D1F]">
                  Streetwear &amp; Seasonal Drops
                </h3>
                <p className="text-sm text-[#6E6E73] leading-relaxed">
                  Relaxed-fit hoodies, graphic essentials, utility outerwear, and seasonal assortments brought together under the AKYIN THRIFT value banner.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleEnquireCollection('AKYIN THRIFT — Streetwear & Seasonal Drops Enquiry')
                }
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#1D1D1F] hover:underline transition-colors cursor-pointer"
              >
                Enquire Seasonal Drops
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </article>
          </div>
        </EditorialReveal>
      </section>

      {/* 6. Fashion Deals & Why Shop AKYIN THRIFT */}
      <section className="py-20 lg:py-24 surface-silver-gradient border-t border-[#E8E8ED]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.06em] text-[#6E6E73]">
              <Tag className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
              <span>Fashion Deals &amp; Value Merchandising</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
              Why Shop AKYIN THRIFT?
            </h2>
            <p className="text-base text-[#6E6E73] leading-relaxed">
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
                className="liquid-glass-card rounded-2xl p-5 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1D1D1F] shrink-0" aria-hidden="true" />
                  <h3 className="font-display text-sm font-bold text-[#1D1D1F]">{item.title}</h3>
                </div>
                <p className="text-xs text-[#6E6E73] leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </EditorialReveal>
      </section>

      {/* Shopping CTA Banner */}
      <section className="py-14 bg-[#FFFFFF] border-t border-[#E8E8ED]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassPanel className="p-7 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#FFFFFF] border border-[#E8E8ED] flex items-center justify-center shrink-0 shadow-xs">
                <ShoppingBag className="w-5 h-5 text-[#1D1D1F]" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#1D1D1F]">
                  Interested in Current AKYIN THRIFT Availability?
                </h3>
                <p className="text-xs sm:text-sm text-[#6E6E73]">
                  Send a direct shopping or retail catalogue enquiry below—no fake checkout or placeholder stock counts.
                </p>
              </div>
            </div>
            <GlassButton
              variant="primary"
              size="md"
              onClick={() =>
                handleEnquireCollection('AKYIN THRIFT — Catalogue & Discounted Fashion Enquiry')
              }
            >
              Enquire About Current Stock
            </GlassButton>
          </GlassPanel>
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
