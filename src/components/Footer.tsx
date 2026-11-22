import { ArrowRight, ArrowUpRight, Check, Link2, Mail, Phone } from 'lucide-react';
import {
  AppRoute,
  EXTERNAL_VERTICAL_URLS,
  OFFICIAL_CONTACT,
  PUBLISHING_LINKS,
} from '../data/akyinData';
import { useSiteConfig } from '../context/SiteConfigContext';
import { sanitizeHref } from '../utils/security';
import { AkyinLogo } from './AkyinLogo';
import { EditorialReveal } from './EditorialReveal';
import { GlassButton, GlassPanel } from './liquid-glass';
import { NewsletterSignup } from './NewsletterSignup';
import { SocialLinks } from './SocialLinks';

interface FooterProps {
  onNavigate: (route: AppRoute) => void;
  onStartEnquiry: (options: {
    category: string;
    vertical: string;
    enquiryType?: string;
  }) => void;
  onCopyLink: () => void;
  copied: boolean;
}

export function Footer({ onNavigate, onStartEnquiry, onCopyLink, copied }: FooterProps) {
  const { settings } = useSiteConfig();
  const displayEmail = settings.contactEmail || OFFICIAL_CONTACT.email;
  const displayPhone = settings.contactPhone || OFFICIAL_CONTACT.phoneDisplay;
  const whatsappUrl = sanitizeHref(
    `https://wa.me/${settings.whatsappNumber || OFFICIAL_CONTACT.whatsappNumber}`,
    OFFICIAL_CONTACT.whatsappUrl
  );
  const footerTagline =
    settings.footerTagline ||
    'Parent corporate group bringing together operating ventures across publishing, full-service marketing agency growth, value retail, AI utility software, B2B stock commerce, and business consulting.';

  const handleLink = (e: React.MouseEvent, route: AppRoute) => {
    e.preventDefault();
    onNavigate(route);
  };

  return (
    <footer className="surface-silver-gradient text-[#1D1D1F] border-t border-[#E8E8ED]">
      <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        {/* Highlighted Liquid Glass Final Enquiry CTA */}
        <GlassPanel className="mb-14 p-7 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              Direct Corporate &amp; Vertical Desk
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[#1D1D1F]">
              Have a Business Enquiry?
            </h2>
          </div>
          <GlassButton
            variant="primary"
            size="lg"
            onClick={() => onNavigate('/contact')}
          >
            <span>Let&apos;s Talk</span>
            <ArrowRight
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </GlassButton>
        </GlassPanel>

        {/* 4-Column Corporate Footer Layout */}
        <div className="pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 print:hidden">
          {/* COLUMN 1 – AKYIN VENTURES */}
          <div className="space-y-4">
            <AkyinLogo wordmark="AKYIN" size="sm" showSubtext />
            <p className="text-sm font-semibold text-[#1D1D1F]">
              Building Ideas Into Businesses.
            </p>
            <p className="text-sm text-[#6E6E73] leading-relaxed">
              {footerTagline}
            </p>
            <div className="pt-2 space-y-2 text-xs">
              <a
                href={`mailto:${displayEmail}`}
                className="flex items-center gap-2 text-[#1D1D1F] hover:text-[#6E6E73] transition-colors font-medium"
              >
                <Mail className="w-3.5 h-3.5 text-[#1D1D1F]" aria-hidden="true" />
                <span>{displayEmail}</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-mono-num text-[#1D1D1F] hover:text-[#6E6E73] transition-colors font-medium"
              >
                <Phone className="w-3.5 h-3.5 text-[#1D1D1F]" aria-hidden="true" />
                <span>{displayPhone}</span>
              </a>
            </div>
          </div>

          {/* COLUMN 2 – OUR VENTURES */}
          <div className="space-y-4">
            <h3 className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              Our Ventures
            </h3>
            <ul className="space-y-2.5 text-sm text-[#1D1D1F]">
              <li>
                <a
                  href="/ventures/publishing"
                  onClick={(e) => handleLink(e, '/ventures/publishing')}
                  className="hover:text-[#6E6E73] transition-colors"
                >
                  Publishing
                </a>
              </li>
              <li>
                <a
                  href="/ventures/marketing"
                  onClick={(e) => handleLink(e, '/ventures/marketing')}
                  className="hover:text-[#6E6E73] transition-colors"
                >
                  Marketing Agency
                </a>
              </li>
              <li>
                <a
                  href="/ventures/store"
                  onClick={(e) => handleLink(e, '/ventures/store')}
                  className="hover:text-[#6E6E73] transition-colors"
                >
                  Store
                </a>
              </li>
              <li>
                <a
                  href="/ventures/aicalc"
                  onClick={(e) => handleLink(e, '/ventures/aicalc')}
                  className="hover:text-[#6E6E73] transition-colors"
                >
                  AICalc
                </a>
              </li>
              <li>
                <a
                  href="/ventures/kartigo"
                  onClick={(e) => handleLink(e, '/ventures/kartigo')}
                  className="hover:text-[#6E6E73] transition-colors"
                >
                  Kartigo
                </a>
              </li>
              <li>
                <a
                  href="/ventures/biznxt"
                  onClick={(e) => handleLink(e, '/ventures/biznxt')}
                  className="hover:text-[#6E6E73] transition-colors"
                >
                  BizNXT
                </a>
              </li>
              <li>
                <a
                  href="/ventures/budget-bazaar"
                  onClick={(e) => handleLink(e, '/ventures/budget-bazaar')}
                  className="hover:text-[#6E6E73] transition-colors"
                >
                  Budget Bazaar
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 3 – OUR ECOSYSTEM */}
          <div className="space-y-4">
            <h3 className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              Our Ecosystem
            </h3>
            <ul className="space-y-3 text-sm text-[#6E6E73]">
              <li>
                <div className="flex flex-col">
                  <span className="font-semibold text-[#1D1D1F]">AutoClub</span>
                  <span className="text-xs text-[#6E6E73]">Client</span>
                </div>
              </li>
              <li>
                <a
                  href={PUBLISHING_LINKS.amazonAuthorStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col hover:text-[#1D1D1F] transition-colors"
                >
                  <span className="inline-flex items-center gap-1 font-semibold text-[#1D1D1F]">
                    <span>Amazon</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#A1A1A6]" aria-hidden="true" />
                  </span>
                  <span className="text-xs text-[#6E6E73]">Publishing marketplace</span>
                </a>
              </li>
              <li>
                <a
                  href={PUBLISHING_LINKS.googlePlayDisciplineCode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col hover:text-[#1D1D1F] transition-colors"
                >
                  <span className="inline-flex items-center gap-1 font-semibold text-[#1D1D1F]">
                    <span>Google Play Books</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#A1A1A6]" aria-hidden="true" />
                  </span>
                  <span className="text-xs text-[#6E6E73]">Digital publishing platform</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.shopify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col hover:text-[#1D1D1F] transition-colors"
                >
                  <span className="inline-flex items-center gap-1 font-semibold text-[#1D1D1F]">
                    <span>Shopify</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#A1A1A6]" aria-hidden="true" />
                  </span>
                  <span className="text-xs text-[#6E6E73]">Commerce platform</span>
                </a>
              </li>
              <li className="pt-2 border-t border-[#1D1D1F]/10 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                <a
                  href={EXTERNAL_VERTICAL_URLS.biznxt}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#1D1D1F] transition-colors"
                >
                  biznxt.online
                </a>
                <a
                  href={EXTERNAL_VERTICAL_URLS.budgetBazaar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#1D1D1F] transition-colors"
                >
                  budgetbazaar.org
                </a>
                <a
                  href={EXTERNAL_VERTICAL_URLS.aicalc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#1D1D1F] transition-colors"
                >
                  aicalc.in
                </a>
                <a
                  href={EXTERNAL_VERTICAL_URLS.kartigo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#1D1D1F] transition-colors"
                >
                  kartigo.online
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 4 – CONNECT */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                Connect
              </h3>
              <ul className="space-y-2.5 text-sm text-[#6E6E73]">
                <li>
                  <a
                    href="/advisory"
                    onClick={(e) => handleLink(e, '/advisory')}
                    className="hover:text-[#1D1D1F] transition-colors font-semibold text-[#1D1D1F]"
                  >
                    Business Advisory Booking
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    onClick={(e) => handleLink(e, '/contact')}
                    className="hover:text-[#6E6E73] transition-colors text-[#1D1D1F]"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      onStartEnquiry({
                        category: 'General Business Enquiry',
                        vertical: 'AKYIN Ventures (Corporate Group)',
                      })
                    }
                    className="hover:text-[#1D1D1F] transition-colors cursor-pointer text-left"
                  >
                    General Enquiries
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      onStartEnquiry({
                        category: 'BizNXT Consulting Enquiry',
                        vertical: 'BizNXT (biznxt.online)',
                        enquiryType: 'BizNXT Business Guidance & Consulting Enquiry',
                      })
                    }
                    className="hover:text-[#1D1D1F] transition-colors cursor-pointer text-left"
                  >
                    Business Enquiries
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      onStartEnquiry({
                        category: 'Partnership Enquiry',
                        vertical: 'AKYIN Ventures (Corporate Group)',
                        enquiryType: 'Strategic Business Partnership',
                      })
                    }
                    className="hover:text-[#1D1D1F] transition-colors cursor-pointer text-left"
                  >
                    Partnership Enquiries
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#1D1D1F]/10">
              <h4 className="font-display text-xs font-semibold text-[#1D1D1F]">
                Social Media ({OFFICIAL_CONTACT.marketingSocialHandle})
              </h4>
              <SocialLinks variant="compact" />
            </div>
          </div>
        </div>

        {/* Compact Newsletter Sign-Up */}
        <div className="print:hidden">
          <NewsletterSignup />
        </div>

        {/* Bottom Copyright & Copy Link */}
        <div className="pt-6 border-t border-[#1D1D1F]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6E6E73]">
          <p>© 2026 AKYIN VENTURES. All Rights Reserved.</p>
          <p className="hidden print:block text-[#1D1D1F]">
            https://akyin.com · {OFFICIAL_CONTACT.email} · {OFFICIAL_CONTACT.phoneDisplay}
          </p>
          <div className="flex flex-wrap items-center gap-2.5 print:hidden">
            <span>Official Group Portal</span>
            <span aria-hidden="true">·</span>
            <a
              href="https://akyin.com"
              onClick={(e) => handleLink(e, '/')}
              className="text-[#1D1D1F] font-semibold hover:opacity-75 transition-opacity"
            >
              AKYIN.com
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="/about"
              onClick={(e) => handleLink(e, '/about')}
              className="hover:text-[#1D1D1F] transition-colors"
            >
              About
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="/sitemap"
              onClick={(e) => handleLink(e, '/sitemap')}
              className="hover:text-[#1D1D1F] transition-colors"
            >
              Sitemap
            </a>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={onCopyLink}
              aria-label="Copy current page link to clipboard"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass-cta text-[11px] font-semibold text-[#1D1D1F] transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-[#1D1D1F]" aria-hidden="true" />
                  <span className="text-[#1D1D1F]">Copied</span>
                </>
              ) : (
                <>
                  <Link2 className="w-3 h-3 text-[#1D1D1F]" aria-hidden="true" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </EditorialReveal>
    </footer>
  );
}
