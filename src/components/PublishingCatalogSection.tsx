import { ArrowUpRight, BookOpen } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { PUBLISHING_BOOKS, PUBLISHING_LINKS } from '../data/akyinData';
import { sanitizeHref } from '../utils/security';
import { GlassButton } from './liquid-glass';
import { ResilientImage } from './ResilientImage';

interface PublishingCatalogSectionProps {
  sectionId?: string;
}

export function PublishingCatalogSection({
  sectionId = 'publishing-catalog',
}: PublishingCatalogSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id={sectionId}
      className="relative py-20 lg:py-28 bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#F5F5F7] border-t border-[#E8E8ED] overflow-hidden"
    >
      {/* Subtle Apple-inspired silver & blue ambient daylight glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[780px] h-[360px] rounded-full bg-[#0071E3]/[0.045] blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#0071E3]">
              <BookOpen className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>AKYIN PUBLISHING</span>
              <span aria-hidden="true" className="text-[#A1A1A6]">·</span>
              <span className="text-[#6E6E73]">5 Published Titles</span>
            </div>

            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-[-0.025em] leading-[1.1] text-[#1D1D1F] text-balance">
              Stories, Knowledge &amp; Ideas Worth Sharing.
            </h2>

            <p className="text-base sm:text-lg text-[#6E6E73] leading-relaxed">
              Discover books published by AKYIN, created to inspire learning, personal development and new perspectives.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <GlassButton
              href={sanitizeHref(PUBLISHING_LINKS.amazonAuthorStore)}
              target="_blank"
              rel="noopener noreferrer"
              variant="glass"
              size="md"
              className="border-[#0071E3]/20 hover:border-[#0071E3]/40"
            >
              <span>Amazon Author Store</span>
              <ArrowUpRight className="w-4 h-4 text-[#0071E3]" aria-hidden="true" />
            </GlassButton>
          </div>
        </div>

        {/* Responsive 5-Book Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {PUBLISHING_BOOKS.map((book, idx) => {
            const safeAmazonHref = sanitizeHref(book.amazonUrl, 'https://www.amazon.com');

            return (
              <motion.article
                key={book.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.42,
                  delay: shouldReduceMotion ? 0 : idx * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="h-full"
              >
                <a
                  href={safeAmazonHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${book.title} by ${book.author} on Amazon (opens in a new tab)`}
                  className="group h-full liquid-glass-card rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-[#0071E3]/35 hover:shadow-[0_24px_56px_rgba(0,113,227,0.11),0_4px_16px_rgba(0,0,0,0.04)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:ring-offset-2"
                >
                  <div>
                    {/* Consistent 2:3 Studio Cover Frame */}
                    <div className="relative aspect-[2/3] w-full bg-gradient-to-b from-[#F4F6F9] to-[#FFFFFF] border-b border-[#E8E8ED]/80 overflow-hidden p-3 sm:p-3.5">
                      <div className="w-full h-full rounded-xl overflow-hidden shadow-[0_8px_22px_rgba(0,0,0,0.08)] bg-[#FFFFFF]">
                        <ResilientImage
                          src={book.coverImage}
                          alt={book.coverAlt}
                          loading={idx < 2 ? 'eager' : 'lazy'}
                          fallbackTitle={book.title}
                          className="w-full h-full bg-[#FFFFFF]"
                          imageClassName="object-contain group-hover:scale-[1.03]"
                        />
                      </div>
                    </div>

                    {/* Clean Typography & Verified Metadata */}
                    <div className="p-4 sm:p-5 space-y-2">
                      <div className="flex items-center justify-between gap-2 text-[11px] text-[#6E6E73]">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-[#0071E3]">
                          <span
                            aria-hidden="true"
                            className="inline-flex items-center justify-center w-4 h-4 rounded bg-[#1D1D1F] text-white font-mono-num text-[9px] font-bold leading-none"
                          >
                            a
                          </span>
                          <span>Amazon</span>
                        </span>
                        <span className="font-mono-num tabular-nums text-[#6E6E73]">
                          {book.number}
                        </span>
                      </div>

                      <h3 className="font-editorial text-[16px] font-bold tracking-[-0.01em] leading-snug text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors line-clamp-2">
                        {book.title}
                      </h3>

                      <p className="text-xs font-medium text-[#1D1D1F]/80">
                        By {book.author}
                      </p>

                      <p className="text-xs text-[#6E6E73] leading-relaxed line-clamp-3">
                        {book.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Prominent View on Amazon CTA */}
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-3 border-t border-[#1D1D1F]/8">
                    <span className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold text-white bg-[#1D1D1F] group-hover:bg-[#0071E3] shadow-xs transition-all duration-200 whitespace-nowrap shrink-0">
                      <span>View on Amazon</span>
                      <ArrowUpRight
                        className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </a>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
