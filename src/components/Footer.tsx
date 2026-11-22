import { ArrowRight, ArrowUpRight, Mail, Phone } from 'lucide-react';
import {
  AppRoute,
  EXTERNAL_VERTICAL_URLS,
  OFFICIAL_CONTACT,
  PUBLISHING_LINKS,
} from '../data/akyinData';
import { EditorialReveal } from './EditorialReveal';
import { SocialLinks } from './SocialLinks';

interface FooterProps {
  onNavigate: (route: AppRoute) => void;
  onStartEnquiry: (options: {
    category: string;
    vertical: string;
    enquiryType?: string;
  }) => void;
}

export function Footer({ onNavigate, onStartEnquiry }: FooterProps) {
  const handleLink = (e: React.MouseEvent, route: AppRoute) => {
    e.preventDefault();
    onNavigate(route);
  };

  return (
    <footer className="bg-[#EFE9DE] text-[#292722] border-t border-[#D9CCB9]">
      <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Highlighted Final Enquiry CTA Strip */}
        <div className="mb-14 rounded-2xl bg-[#FFFFFF] border border-[#D9CCB9] p-7 sm:p-9 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold tracking-wide text-[#B66A50]">
              Direct Corporate &amp; Vertical Desk
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#292722]">
              Have a Business Enquiry?
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/contact')}
            className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#B66A50] hover:bg-[#9E5740] text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Let&apos;s Talk.</span>
            <ArrowRight
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </button>
        </div>

        {/* 4-Column Corporate Footer Layout */}
        <div className="pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* COLUMN 1 – AKYIN VENTURES */}
          <div className="space-y-4">
            <p className="font-display text-lg font-extrabold tracking-tight text-[#292722]">
              AKYIN VENTURES
            </p>
            <p className="text-sm font-semibold text-[#B66A50]">
              Building Ideas Into Businesses.
            </p>
            <p className="text-sm text-[#77736C] leading-relaxed">
              Parent corporate group bringing together operating ventures across publishing, automotive marketing, value retail, AI utility software, B2B stock commerce, and business consulting.
            </p>
            <div className="pt-2 space-y-2 text-xs">
              <a
                href={`mailto:${OFFICIAL_CONTACT.email}`}
                className="flex items-center gap-2 text-[#292722] hover:text-[#B66A50] transition-colors font-medium"
              >
                <Mail className="w-3.5 h-3.5 text-[#B66A50]" aria-hidden="true" />
                <span>{OFFICIAL_CONTACT.email}</span>
              </a>
              <a
                href={OFFICIAL_CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-mono-num text-[#292722] hover:text-[#B66A50] transition-colors font-medium"
              >
                <Phone className="w-3.5 h-3.5 text-[#B66A50]" aria-hidden="true" />
                <span>{OFFICIAL_CONTACT.phoneDisplay}</span>
              </a>
            </div>
          </div>

          {/* COLUMN 2 – OUR VENTURES */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-bold text-[#292722] tracking-wide">
              Our Ventures
            </h3>
            <ul className="space-y-2.5 text-sm text-[#77736C]">
              <li>
                <a
                  href="/ventures/publishing"
                  onClick={(e) => handleLink(e, '/ventures/publishing')}
                  className="hover:text-[#B66A50] transition-colors"
                >
                  Publishing
                </a>
              </li>
              <li>
                <a
                  href="/ventures/marketing"
                  onClick={(e) => handleLink(e, '/ventures/marketing')}
                  className="hover:text-[#B66A50] transition-colors"
                >
                  Marketing
                </a>
              </li>
              <li>
                <a
                  href="/ventures/store"
                  onClick={(e) => handleLink(e, '/ventures/store')}
                  className="hover:text-[#B66A50] transition-colors"
                >
                  Store
                </a>
              </li>
              <li>
                <a
                  href="/ventures/aicalc"
                  onClick={(e) => handleLink(e, '/ventures/aicalc')}
                  className="hover:text-[#B66A50] transition-colors"
                >
                  AICalc
                </a>
              </li>
              <li>
                <a
                  href="/ventures/kartigo"
                  onClick={(e) => handleLink(e, '/ventures/kartigo')}
                  className="hover:text-[#B66A50] transition-colors"
                >
                  Kartigo
                </a>
              </li>
              <li>
                <a
                  href="/ventures/biznxt"
                  onClick={(e) => handleLink(e, '/ventures/biznxt')}
                  className="hover:text-[#B66A50] transition-colors"
                >
                  BizNXT
                </a>
              </li>
              <li>
                <a
                  href="/ventures/budget-bazaar"
                  onClick={(e) => handleLink(e, '/ventures/budget-bazaar')}
                  className="hover:text-[#B66A50] transition-colors"
                >
                  Budget Bazaar
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 3 – OUR ECOSYSTEM */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-bold text-[#292722] tracking-wide">
              Our Ecosystem
            </h3>
            <ul className="space-y-3 text-sm text-[#77736C]">
              <li>
                <div className="flex flex-col">
                  <span className="font-semibold text-[#292722]">AutoClub</span>
                  <span className="text-xs text-[#B66A50]">Client</span>
                </div>
              </li>
              <li>
                <a
                  href={PUBLISHING_LINKS.amazonAuthorStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col hover:text-[#B66A50] transition-colors"
                >
                  <span className="inline-flex items-center gap-1 font-semibold text-[#292722] group-hover:text-[#B66A50]">
                    <span>Amazon</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#A99C8B]" aria-hidden="true" />
                  </span>
                  <span className="text-xs text-[#77736C]">Publishing marketplace</span>
                </a>
              </li>
              <li>
                <a
                  href={PUBLISHING_LINKS.googlePlayDisciplineCode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col hover:text-[#B66A50] transition-colors"
                >
                  <span className="inline-flex items-center gap-1 font-semibold text-[#292722] group-hover:text-[#B66A50]">
                    <span>Google Play Books</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#A99C8B]" aria-hidden="true" />
                  </span>
                  <span className="text-xs text-[#77736C]">Digital publishing platform</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.shopify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col hover:text-[#B66A50] transition-colors"
                >
                  <span className="inline-flex items-center gap-1 font-semibold text-[#292722] group-hover:text-[#B66A50]">
                    <span>Shopify</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#A99C8B]" aria-hidden="true" />
                  </span>
                  <span className="text-xs text-[#77736C]">Commerce platform</span>
                </a>
              </li>
              <li className="pt-1 border-t border-[#D9CCB9] flex flex-wrap gap-x-3 gap-y-1 text-xs">
                <a
                  href={EXTERNAL_VERTICAL_URLS.biznxt}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#B66A50]"
                >
                  biznxt.online
                </a>
                <a
                  href={EXTERNAL_VERTICAL_URLS.budgetBazaar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#B66A50]"
                >
                  budgetbazaar.org
                </a>
                <a
                  href={EXTERNAL_VERTICAL_URLS.aicalc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#B66A50]"
                >
                  aicalc.in
                </a>
                <a
                  href={EXTERNAL_VERTICAL_URLS.kartigo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#B66A50]"
                >
                  kartigo.online
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 4 – CONNECT */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-display text-sm font-bold text-[#292722] tracking-wide">
                Connect
              </h3>
              <ul className="space-y-2.5 text-sm text-[#77736C]">
                <li>
                  <a
                    href="/contact"
                    onClick={(e) => handleLink(e, '/contact')}
                    className="hover:text-[#B66A50] transition-colors"
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
                    className="hover:text-[#B66A50] transition-colors cursor-pointer text-left"
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
                    className="hover:text-[#B66A50] transition-colors cursor-pointer text-left"
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
                    className="hover:text-[#B66A50] transition-colors cursor-pointer text-left"
                  >
                    Partnership Enquiries
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#D9CCB9]">
              <h4 className="font-display text-xs font-bold text-[#292722] tracking-wide">
                Social Media ({OFFICIAL_CONTACT.marketingSocialHandle})
              </h4>
              <SocialLinks variant="compact" />
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-[#D9CCB9] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#77736C]">
          <p>© 2026 AKYIN VENTURES. All Rights Reserved.</p>
          <p className="flex flex-wrap items-center gap-2">
            <span>Official Group Portal</span>
            <span aria-hidden="true">·</span>
            <a
              href="https://akyin.com"
              onClick={(e) => handleLink(e, '/')}
              className="text-[#292722] font-semibold hover:text-[#B66A50] transition-colors"
            >
              AKYIN.com
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="/about"
              onClick={(e) => handleLink(e, '/about')}
              className="hover:text-[#B66A50] transition-colors"
            >
              About
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="/sitemap"
              onClick={(e) => handleLink(e, '/sitemap')}
              className="hover:text-[#B66A50] transition-colors"
            >
              Sitemap
            </a>
          </p>
        </div>
      </EditorialReveal>
    </footer>
  );
}
