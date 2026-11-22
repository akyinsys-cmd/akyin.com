import { ArrowUpRight, BookOpen } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { IMAGES, PUBLISHING_LINKS } from '../data/akyinData';
import { ContactDispatcher } from '../components/ContactDispatcher';
import { EditorialReveal } from '../components/EditorialReveal';
import { GlassButton, GlassImageFrame, GlassPanel } from '../components/liquid-glass';
import { ResilientImage } from '../components/ResilientImage';

export function PublishingPage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div>
      {/* Apple-Inspired Liquid Glass Publishing Hero */}
      <section className="surface-silver-gradient text-[#1D1D1F] pt-12 pb-20 lg:pt-16 lg:pb-24 border-b border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              AKYIN PUBLISHING · Book &amp; Digital Publishing
            </p>
            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-[-0.025em] leading-[1.07] text-[#1D1D1F] text-balance">
              Ideas Worth Reading. Knowledge Worth Sharing.
            </h1>
            <p className="text-base sm:text-lg text-[#6E6E73] leading-relaxed">
              AKYIN Publishing focuses on creating and distributing books and digital reading experiences for readers across international marketplaces.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <GlassButton
                href={PUBLISHING_LINKS.amazonAuthorStore}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="lg"
              >
                <span>Explore Our Books on Amazon</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </GlassButton>
              <GlassButton
                href={PUBLISHING_LINKS.googlePlayDisciplineCode}
                target="_blank"
                rel="noopener noreferrer"
                variant="glass"
                size="lg"
              >
                <span>Read on Google Play Books</span>
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

      {/* Featured Book Presentation: THE DISCIPLINE CODE */}
      <section className="py-20 lg:py-24 bg-[#FFFFFF]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-5">
              <div className="max-w-md mx-auto">
                <GlassImageFrame>
                  <div className="aspect-[3/4] bg-[#FFFFFF] overflow-hidden">
                    <ResilientImage
                      src={IMAGES.disciplineCodeBook}
                      alt="Apple-style studio cutout of THE DISCIPLINE CODE hardcover edition by Akyin"
                      loading="lazy"
                      fallbackTitle="THE DISCIPLINE CODE — Akyin"
                      branded={false}
                      className="w-full h-full bg-[#FFFFFF]"
                      imageClassName="object-contain p-3"
                    />
                  </div>
                </GlassImageFrame>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                  Featured Publication · Google Play Books
                </p>
                <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F]">
                  THE DISCIPLINE CODE
                </h2>
                <p className="text-sm font-semibold text-[#6E6E73]">
                  Author: Akyin
                </p>
              </div>

              <p className="text-base text-[#6E6E73] leading-relaxed">
                Published under AKYIN Publishing, <span className="font-semibold text-[#1D1D1F]">THE DISCIPLINE CODE</span> is available digitally on Google Play Books, enabling readers globally to access the edition seamlessly across devices.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="liquid-glass-card rounded-2xl p-6 space-y-2.5">
                  <p className="font-mono-num text-xs font-semibold text-[#1D1D1F]">Platform A</p>
                  <h3 className="font-display text-lg font-bold text-[#1D1D1F]">
                    Amazon Author Store
                  </h3>
                  <p className="text-xs text-[#6E6E73] leading-relaxed">
                    Browse the official Akyin author storefront and available editions on Amazon.com.
                  </p>
                  <a
                    href={PUBLISHING_LINKS.amazonAuthorStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 pt-2 text-xs font-semibold text-[#1D1D1F] hover:underline"
                  >
                    Explore Our Books on Amazon
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>

                <div className="liquid-glass-card rounded-2xl p-6 space-y-2.5">
                  <p className="font-mono-num text-xs font-semibold text-[#6E6E73]">Platform B</p>
                  <h3 className="font-display text-lg font-bold text-[#1D1D1F]">
                    Google Play Books
                  </h3>
                  <p className="text-xs text-[#6E6E73] leading-relaxed">
                    Read <span className="font-semibold text-[#1D1D1F]">THE DISCIPLINE CODE</span> directly via Google Play Books.
                  </p>
                  <a
                    href={PUBLISHING_LINKS.googlePlayDisciplineCode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 pt-2 text-xs font-semibold text-[#1D1D1F] hover:underline transition-colors"
                  >
                    Read on Google Play Books
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </EditorialReveal>
      </section>

      {/* About Publishing Initiative */}
      <section className="py-20 bg-[#F5F5F7] border-t border-[#E8E8ED]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassPanel className="p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#E8E8ED] text-[#1D1D1F] flex items-center justify-center shadow-xs">
                <BookOpen className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 className="font-editorial text-3xl font-bold tracking-[-0.02em] text-[#1D1D1F]">
                About Our Publishing Initiative
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-4 text-base text-[#1D1D1F]/85 leading-relaxed">
              <p>
                AKYIN Publishing pairs thoughtful editorial curation with established global digital storefronts. By distributing directly through Amazon and Google Play Books, readers worldwide can discover and read editions in reliable digital and print formats.
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
