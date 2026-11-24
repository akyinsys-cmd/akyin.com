import { ArrowDown, ArrowLeft, ArrowUpRight, BookOpen, Compass, Mail } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import {
  AppRoute,
  GUMROAD_DIGITAL_PRODUCTS,
  IMAGES,
  OFFICIAL_CONTACT,
  PUBLISHING_BOOKS,
  PUBLISHING_LINKS,
} from '../data/akyinData';
import { AkyinLogo } from '../components/AkyinLogo';
import { ContactDispatcher } from '../components/ContactDispatcher';
import { DigitalProductsSection } from '../components/DigitalProductsSection';
import { EditorialReveal } from '../components/EditorialReveal';
import {
  GlassButton,
  GlassImageFrame,
  GlassPanel,
} from '../components/liquid-glass';
import { PublishingCatalogSection } from '../components/PublishingCatalogSection';
import { ResilientImage } from '../components/ResilientImage';
import { sanitizeHref } from '../utils/security';

interface PublishingPageProps {
  onNavigate?: (route: AppRoute) => void;
}

export function PublishingPage({ onNavigate }: PublishingPageProps) {
  const shouldReduceMotion = useReducedMotion();

  const scrollToPublications = () => {
    const el = document.getElementById('explore-books-amazon');
    if (el) {
      el.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  };

  const handleBackHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate('/');
    }
  };

  return (
    <div>
      {/* 1. Publishing Hero Section */}
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
              AKYIN PUBLISHING · {PUBLISHING_BOOKS.length} Books · {GUMROAD_DIGITAL_PRODUCTS.length} Digital Guides
            </p>
            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-[-0.025em] leading-[1.07] text-[#1D1D1F] text-balance">
              Ideas That Inspire. Knowledge That Empowers.
            </h1>
            <p className="text-base sm:text-lg text-[#6E6E73] leading-relaxed">
              Explore books, practical guides and digital resources published by AKYIN.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <GlassButton
                variant="primary"
                size="lg"
                onClick={scrollToPublications}
              >
                <span>Explore Publications</span>
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

      {/* 2. Amazon Books Section (7 Products) */}
      <PublishingCatalogSection sectionId="explore-books-amazon" />

      {/* 3. Digital Products Section (3 Gumroad Products) */}
      <DigitalProductsSection sectionId="digital-guides-tools" />

      {/* 4. Explore More Section (Pinterest Spotlight) */}
      <section
        id="explore-more-pinterest"
        className="py-16 lg:py-20 bg-gradient-to-b from-[#F5F5F7] to-[#FFFFFF] border-t border-[#E8E8ED]"
      >
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassPanel className="p-8 sm:p-10 lg:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#0071E3]">
                <Compass className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Explore More</span>
                <span aria-hidden="true" className="text-[#A1A1A6]">·</span>
                <span className="text-[#6E6E73]">Visual Inspiration &amp; Reading Lists</span>
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[#1D1D1F]">
                Discover Curated Ideas &amp; Visual Resources
              </h2>
              <p className="text-base text-[#6E6E73] leading-relaxed">
                Follow AKYIN on Pinterest for book highlights, visual productivity frameworks, and curated digital resource boards.
              </p>
            </div>

            <div className="shrink-0">
              <GlassButton
                href={sanitizeHref(PUBLISHING_LINKS.pinterest, 'https://www.pinterest.com')}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="lg"
              >
                <span>Explore AKYIN on Pinterest</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </GlassButton>
            </div>
          </GlassPanel>
        </EditorialReveal>
      </section>

      {/* Preserved Editorial Initiative Overview */}
      <section className="py-16 lg:py-20 bg-[#FFFFFF] border-t border-[#E8E8ED]">
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
                AKYIN Publishing pairs thoughtful editorial curation with trusted global storefronts. Across personal discipline, dopamine &amp; overthinking recovery, wealth psychology, career readiness, and autobiographical resilience, our eight published books on Amazon and Google Play Books alongside three digital productivity toolkits on Gumroad give readers practical frameworks they can apply daily.
              </p>
              <p className="text-[#6E6E73]">
                For distribution discussions, institutional bulk book requests, or publishing enquiries, complete the enquiry form below.
              </p>
            </div>
          </GlassPanel>
        </EditorialReveal>
      </section>

      {/* Preserved Publishing Enquiries Form */}
      <EditorialReveal>
        <ContactDispatcher
          sectionId="publishing-contact"
          defaultCategory="Publishing Enquiry"
          defaultVertical="Akyin Publishing"
          defaultEnquiryType="Book Distribution / Publishing Rights"
          heading="Publishing Enquiries."
          subheading="Reach out regarding AKYIN Publishing titles, digital resources, distribution questions, or publishing collaborations."
        />
      </EditorialReveal>

      {/* 5. Dedicated Publishing Footer */}
      <section
        aria-label="AKYIN Publishing Footer"
        className="py-12 bg-[#F5F5F7] border-t border-[#E8E8ED]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassPanel className="p-7 sm:p-9 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2.5">
              <AkyinLogo wordmark="AKYIN Publishing" size="sm" showSubtext />
              <p className="text-sm text-[#6E6E73] max-w-xl">
                An independent publishing division of AKYIN Ventures—books on Amazon &amp; Google Play Books, digital productivity systems on Gumroad.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${OFFICIAL_CONTACT.email}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#FFFFFF] border border-[#E8E8ED] text-xs font-semibold text-[#1D1D1F] hover:border-[#0071E3]/40 hover:text-[#0071E3] transition-colors shadow-2xs"
              >
                <Mail className="w-3.5 h-3.5 text-[#0071E3]" aria-hidden="true" />
                <span>{OFFICIAL_CONTACT.email}</span>
              </a>

              <a
                href="/"
                onClick={handleBackHome}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1D1D1F] text-white text-xs font-semibold hover:bg-[#0071E3] transition-colors shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Back to AKYIN.com</span>
              </a>
            </div>
          </GlassPanel>
        </div>
      </section>
    </div>
  );
}
