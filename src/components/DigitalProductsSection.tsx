import { ArrowUpRight, Layers } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { GUMROAD_DIGITAL_PRODUCTS } from '../data/akyinData';
import { sanitizeHref } from '../utils/security';
import { ResilientImage } from './ResilientImage';

interface DigitalProductsSectionProps {
  sectionId?: string;
}

export function DigitalProductsSection({
  sectionId = 'digital-guides-tools',
}: DigitalProductsSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id={sectionId}
      className="relative py-20 lg:py-24 bg-[#FFFFFF] border-t border-[#E8E8ED] overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-1/4 w-[520px] h-[280px] rounded-full bg-[#0071E3]/[0.04] blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#0071E3]">
            <Layers className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>AKYIN DIGITAL PRODUCTS</span>
            <span aria-hidden="true" className="text-[#A1A1A6]">·</span>
            <span className="text-[#6E6E73]">Direct Gumroad Editions</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-[-0.025em] leading-[1.1] text-[#1D1D1F] text-balance">
            Digital Guides &amp; Productivity Tools
          </h2>

          <p className="text-base sm:text-lg text-[#6E6E73] leading-relaxed">
            Practical toolkits, structured planners, and step-by-step recovery systems available directly via Gumroad.
          </p>
        </div>

        {/* 3-Column Gumroad Digital Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GUMROAD_DIGITAL_PRODUCTS.map((product, idx) => {
            const safeGumroadHref = sanitizeHref(product.gumroadUrl, 'https://akyinspire.gumroad.com');

            return (
              <motion.article
                key={product.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.42,
                  delay: shouldReduceMotion ? 0 : idx * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="h-full"
              >
                <a
                  href={safeGumroadHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Get ${product.shortTitle} on Gumroad (opens in a new tab)`}
                  className="group h-full liquid-glass-card rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-[#0071E3]/35 hover:shadow-[0_24px_56px_rgba(0,113,227,0.11),0_4px_16px_rgba(0,0,0,0.04)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:ring-offset-2"
                >
                  <div>
                    {/* 16:9 Studio Cover Thumbnail matching verified 1005x566 Gumroad art */}
                    <div className="relative aspect-video w-full bg-gradient-to-b from-[#F5F5F7] to-[#FFFFFF] border-b border-[#E8E8ED]/80 overflow-hidden p-3">
                      <div className="w-full h-full rounded-xl overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.06)] bg-[#FFFFFF]">
                        <ResilientImage
                          src={product.coverImage}
                          alt={product.coverAlt}
                          loading="lazy"
                          fallbackTitle={product.shortTitle}
                          className="w-full h-full bg-[#FFFFFF]"
                          imageClassName="object-cover group-hover:scale-[1.03]"
                        />
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 space-y-2.5">
                      <div className="flex items-center justify-between gap-2 text-[11px] text-[#6E6E73]">
                        <span className="font-semibold text-[#0071E3]">
                          {product.platformLabel}
                        </span>
                        <span className="font-mono-num tabular-nums text-[#6E6E73]">
                          {product.number}
                        </span>
                      </div>

                      <h3 className="font-editorial text-lg font-bold tracking-[-0.015em] leading-snug text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors min-h-[1.75rem]">
                        {product.shortTitle}
                      </h3>

                      {product.title !== product.shortTitle && (
                        <p className="text-xs font-medium text-[#1D1D1F]/70 line-clamp-1">
                          {product.title}
                        </p>
                      )}

                      <p className="text-sm text-[#6E6E73] leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Unified Glassmorphism Gumroad Checkout CTA */}
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 border-t border-[#1D1D1F]/8">
                    <span className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold liquid-glass-cta text-[#1D1D1F] group-hover:bg-[#0071E3] group-hover:text-white group-hover:border-[#0071E3] group-hover:shadow-[0_12px_26px_rgba(0,113,227,0.22)] transition-all duration-200 whitespace-nowrap shrink-0">
                      <span>Get This Product</span>
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
