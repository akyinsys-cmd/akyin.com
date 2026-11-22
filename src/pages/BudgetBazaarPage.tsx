import { ArrowUpRight, CheckCircle2, ShoppingBasket, Tag } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { EXTERNAL_VERTICAL_URLS, IMAGES } from '../data/akyinData';
import { ContactDispatcher } from '../components/ContactDispatcher';
import { EditorialReveal } from '../components/EditorialReveal';
import { GlassButton, GlassImageFrame, GlassPanel } from '../components/liquid-glass';
import { ResilientImage } from '../components/ResilientImage';

export function BudgetBazaarPage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div>
      {/* 1. Retail Hero Introduction */}
      <section className="surface-silver-gradient text-[#1D1D1F] pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              BUDGET BAZAAR · budgetbazaar.org · Affordable Consumer Retail
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-[-0.025em] leading-[1.06] text-[#1D1D1F] text-balance">
              Everyday Essentials. Value-First Retail.
            </h1>
            <p className="text-base sm:text-lg text-[#6E6E73] leading-relaxed">
              Budget Bazaar brings practical household products, everyday essentials, and accessible consumer goods together under a straightforward, value-oriented retail storefront.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <GlassButton
                href={EXTERNAL_VERTICAL_URLS.budgetBazaar}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="lg"
              >
                <span>Visit BudgetBazaar.org</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </GlassButton>
              <GlassButton href="#budget-bazaar-focus" variant="glass" size="lg">
                Retail Focus
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
              <div className="group aspect-[4/3] bg-[#FFFFFF] overflow-hidden">
                <ResilientImage
                  src={IMAGES.budgetBazaarRetail}
                  alt="Apple-style isolated modern household ceramic and anodized steel consumer goods stamped with the AKYIN emblem"
                  loading="eager"
                  fallbackTitle="Budget Bazaar · budgetbazaar.org"
                  className="w-full h-full bg-[#FFFFFF]"
                  imageClassName="object-contain p-3 group-hover:scale-[1.03]"
                />
              </div>
            </GlassImageFrame>
          </motion.div>
        </div>
      </section>

      {/* 2. Retail Merchandising Approach */}
      <section id="budget-bazaar-focus" className="py-20 lg:py-24 bg-[#FFFFFF]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.06em] text-[#6E6E73]">
              <Tag className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
              <span>Value Retail Architecture</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
              Practical Products Priced for Everyday Households.
            </h2>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                className="liquid-glass-card rounded-2xl p-5 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1D1D1F] shrink-0" aria-hidden="true" />
                  <h3 className="font-display text-sm font-bold text-[#1D1D1F]">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-[#6E6E73] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </EditorialReveal>
      </section>

      {/* 3. Direct External Storefront CTA */}
      <section className="py-16 bg-[#F5F5F7] border-t border-[#E8E8ED]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassPanel className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#FFFFFF] border border-[#E8E8ED] flex items-center justify-center shrink-0 shadow-xs">
                <ShoppingBasket className="w-5 h-5 text-[#1D1D1F]" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-[#1D1D1F]">
                  Shop or Explore Budget Bazaar Online
                </h2>
                <p className="text-sm text-[#6E6E73] mt-0.5">
                  Visit the dedicated Budget Bazaar website at budgetbazaar.org.
                </p>
              </div>
            </div>
            <GlassButton
              href={EXTERNAL_VERTICAL_URLS.budgetBazaar}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="lg"
            >
              <span>Visit BudgetBazaar.org</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </GlassButton>
          </GlassPanel>
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
