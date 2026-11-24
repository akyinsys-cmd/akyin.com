import { ArrowDown, ArrowUpRight, BookOpen } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { IMAGES, PUBLISHING_BOOKS, PUBLISHING_LINKS } from '../data/akyinData';
import { ContactDispatcher } from '../components/ContactDispatcher';
import { EditorialReveal } from '../components/EditorialReveal';
import {
  GlassButton,
  GlassImageFrame,
  GlassPanel,
} from '../components/liquid-glass';
import { PublishingCatalogSection } from '../components/PublishingCatalogSection';
import { ResilientImage } from '../components/ResilientImage';
import { sanitizeHref } from '../utils/security';

export function PublishingPage() {
  const shouldReduceMotion = useReducedMotion();

  const scrollToCatalog = () => {
    const el = document.getElementById('publishing-catalog');
    if (el) {
      el.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  };

  return (
    <div>
      {/* Apple-Inspired Liquid Glass Publishing Hero */}
      <section className="relative surface-silver-gradient text-[#1D1D1F] pt-12 pb-20 lg:pt-16 lg:pb-24 border-b border-[#E8E8ED] overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 right-1/4 w-[460px] h-[460px] rounded-full bg-[#0071E3]/[0.05] blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#0071E3]">
              AKYIN PUBLISHING · {PUBLISHING_BOOKS.length} Books on Amazon
            </p>
            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-[-0.025em] leading-[1.07] text-[#1D1D1F] text-balance">
              Stories, Knowledge &amp; Ideas Worth Sharing.
            </h1>
            <p className="text-base sm:text-lg text-[#6E6E73] leading-relaxed">
              Discover books published by AKYIN, created to inspire learning, personal development and new perspectives—available directly on Amazon and Google Play Books.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <GlassButton
                variant="primary"
                size="lg"
                onClick={scrollToCatalog}
              >
                <span>Browse All {PUBLISHING_BOOKS.length} Books</span>
                <ArrowDown className="w-4 h-4" aria-hidden="true" />
              </GlassButton>
              <GlassButton
                href={sanitizeHref(PUBLISHING_LINKS.amazonAuthorStore)}
                target="_blank"
                rel="noopener noreferrer"
                variant="glass"
                size="lg"
              >
                <span>Amazon Author Store</span>
                <ArrowUpRight className="w-4 h-4 text-[#0071E3]" aria-hidden="true" />
              </GlassButton>
              <GlassButton
                href={sanitizeHref(PUBLISHING_LINKS.googlePlayDisciplineCode)}
                target="_blank"
                rel="noopener noreferrer"
                variant="subtle"
                size="lg"
              >
                <span>Google Play Books</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
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
                  src={IMAGES.publishingHero}
                  alt="Apple-style isolated studio render of hardcover AKYIN books and matte e-reader tablet with AKYIN emblem"
                  loading="eager"
                  fallbackTitle="AKYIN PUBLISHING"
                  className="w-full h-full bg-[#FFFFFF]"
                  imageClassName="object-contain p-3"
                />
              </div>
            </GlassImageFrame>
          </motion.div>
        </div>
      </section>

      {/* 5-Book Amazon Catalog Section */}
      <PublishingCatalogSection sectionId="publishing-catalog" />

      {/* About Publishing Initiative */}
      <section className="py-20 bg-[#FFFFFF] border-t border-[#E8E8ED]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassPanel className="p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#E8E8ED] text-[#0071E3] flex items-center justify-center shadow-xs">
                <BookOpen className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 className="font-editorial text-3xl font-bold tracking-[-0.02em] text-[#1D1D1F]">
                About Our Publishing Initiative
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-4 text-base text-[#1D1D1F]/85 leading-relaxed">
              <p>
                AKYIN Publishing pairs thoughtful editorial curation with global digital storefronts. Across personal discipline, mindset recovery, wealth psychology, and autobiographical resilience, our five published editions on Amazon and Google Play Books give readers practical frameworks they can apply daily.
              </p>
              <p className="text-[#6E6E73]">
                For distribution discussions, institutional bulk book requests, or publishing enquiries, complete the enquiry form below.
              </p>
            </div>
          </GlassPanel>
        </EditorialReveal>
      </section>

      {/* Publishing Enquiries Form */}
      <EditorialReveal>
        <ContactDispatcher
          sectionId="publishing-contact"
          defaultCategory="Publishing Enquiry"
          defaultVertical="Akyin Publishing"
          defaultEnquiryType="Book Distribution / Publishing Rights"
          heading="Publishing Enquiries."
          subheading="Reach out regarding AKYIN Publishing titles, distribution questions, or publishing collaborations."
        />
      </EditorialReveal>
    </div>
  );
}
