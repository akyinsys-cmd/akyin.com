import { ArrowUpRight, CheckCircle2, ShoppingBasket, Tag } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { EXTERNAL_VERTICAL_URLS, IMAGES } from '../data/akyinData';
import { ContactDispatcher } from '../components/ContactDispatcher';
import { EditorialReveal } from '../components/EditorialReveal';
import { ResilientImage } from '../components/ResilientImage';

export function BudgetBazaarPage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div>
      {/* 1. Retail Hero Introduction */}
      <section className="bg-[#F7F5F0] text-[#292722] pt-24 pb-16 lg:pt-32 lg:pb-24 border-b border-[#D9CCB9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#B66A50]">
              BUDGET BAZAAR · budgetbazaar.org · Affordable Consumer Retail
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.06] text-[#292722] text-balance">
              Everyday Essentials. Value-First Retail.
            </h1>
            <p className="text-base sm:text-lg text-[#77736C] leading-relaxed">
              Budget Bazaar brings practical household products, everyday essentials, and accessible consumer goods together under a straightforward, value-oriented retail storefront.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={EXTERNAL_VERTICAL_URLS.budgetBazaar}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#B66A50] hover:bg-[#9E5740] text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap"
              >
                <span>Visit BudgetBazaar.org</span>
                <ArrowUpRight
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
              <a
                href="#budget-bazaar-focus"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#FFFFFF] hover:bg-[#EFE9DE] text-[#292722] border border-[#D9CCB9] text-sm font-semibold transition-colors whitespace-nowrap"
              >
                Retail Focus
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <div className="group rounded-2xl overflow-hidden border border-[#D9CCB9] shadow-lg aspect-[4/3] bg-[#EFE9DE]">
              <ResilientImage
                src={IMAGES.budgetBazaarRetail}
                alt="Bright contemporary Budget Bazaar retail store shelves with everyday household items"
                loading="eager"
                fallbackTitle="Budget Bazaar · budgetbazaar.org"
                className="w-full h-full"
                imageClassName="group-hover:scale-[1.03]"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Retail Merchandising Approach */}
      <section id="budget-bazaar-focus" className="py-20 lg:py-24 bg-[#FFFFFF]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#B66A50]">
              <Tag className="w-4 h-4" aria-hidden="true" />
              <span>Value Retail Architecture</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#292722] text-balance">
              Practical Products Priced for Everyday Households.
            </h2>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                title: 'Accessible Pricing',
                desc: 'Focused on honest, budget-friendly product curation without inflated retail markups.',
              },
              {
                title: 'Everyday Utility',
                desc: 'Practical household goods, daily essentials, and lifestyle merchandise chosen for regular use.',
              },
              {
                title: 'Dedicated Digital Storefront',
                desc: 'Accessible online through its independent retail domain at budgetbazaar.org.',
              },
              {
                title: 'AKYIN Ventures Backing',
                desc: 'Operated with the same disciplined merchandising standards shared across AKYIN retail units.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl bg-[#F7F5F0] border border-[#D9CCB9] p-5 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#83866A] shrink-0" aria-hidden="true" />
                  <h3 className="font-display text-sm font-bold text-[#292722]">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-[#77736C] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </EditorialReveal>
      </section>

      {/* 3. Direct External Storefront CTA */}
      <section className="py-16 bg-[#EFE9DE] border-t border-[#D9CCB9]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-[#FFFFFF] border border-[#D9CCB9] p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#F7F5F0] border border-[#D9CCB9] flex items-center justify-center shrink-0">
                <ShoppingBasket className="w-5 h-5 text-[#B66A50]" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-[#292722]">
                  Shop or Explore Budget Bazaar Online
                </h2>
                <p className="text-sm text-[#77736C] mt-0.5">
                  Visit the dedicated Budget Bazaar website at budgetbazaar.org.
                </p>
              </div>
            </div>
            <a
              href={EXTERNAL_VERTICAL_URLS.budgetBazaar}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#B66A50] hover:bg-[#9E5740] text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap shrink-0"
            >
              <span>Visit BudgetBazaar.org</span>
              <ArrowUpRight
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </EditorialReveal>
      </section>

      {/* 4. Enquiry Section */}
      <EditorialReveal>
        <ContactDispatcher
          sectionId="budget-bazaar-contact"
          defaultCategory="Budget Bazaar Enquiry"
          defaultVertical="Budget Bazaar (budgetbazaar.org)"
          defaultEnquiryType="Budget Bazaar Retail & Product Enquiry"
          heading="Budget Bazaar Enquiries."
          subheading="Reach out regarding product sourcing, retail collaborations, or Budget Bazaar enquiries."
        />
      </EditorialReveal>
    </div>
  );
}
