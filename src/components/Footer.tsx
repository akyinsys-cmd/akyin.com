import { ArrowUp, ArrowUpRight, Globe, Mail, MessageCircle } from 'lucide-react';
import { AppRoute, OFFICIAL_CONTACT } from '../data/akyinData';
import { useSiteConfig } from '../context/SiteConfigContext';
import { sanitizeHref } from '../utils/security';
import { AkyinLogo } from './AkyinLogo';
import { EditorialReveal } from './EditorialReveal';
import { GlassPanel } from './liquid-glass';
import { SocialLinks } from './SocialLinks';

interface FooterProps {
  onNavigate: (route: AppRoute) => void;
  onStartEnquiry?: (options: {
    category: string;
    vertical: string;
    enquiryType?: string;
  }) => void;
  onCopyLink?: () => void;
  copied?: boolean;
}

export function Footer({ onNavigate }: FooterProps) {
  const { settings } = useSiteConfig();
  const displayEmail = settings.contactEmail || OFFICIAL_CONTACT.email;
  const whatsappHref = sanitizeHref(OFFICIAL_CONTACT.whatsappUrl, OFFICIAL_CONTACT.whatsappChannelUrl);
  const safeEmailHref = sanitizeHref(`mailto:${displayEmail}`, `mailto:${OFFICIAL_CONTACT.email}`, true);
  const footerDescription =
    settings.footerTagline ||
    'A diversified business group working across marketing, publishing, technology, commerce and business solutions.';

  const handleLink = (e: React.MouseEvent, route: AppRoute) => {
    e.preventDefault();
    onNavigate(route);
  };

  const handleEcosystemScroll = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.location.pathname !== '/') {
      onNavigate('/');
      window.setTimeout(() => {
        document.getElementById('our-ecosystem')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 260);
    } else {
      document.getElementById('our-ecosystem')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="surface-silver-gradient text-[#1D1D1F] border-t border-[#E8E8ED]">
      <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10 lg:pt-18 lg:pb-12">
        {/* Sophisticated 4-Column Apple-Inspired Liquid Glass Footer */}
        <GlassPanel className="p-7 sm:p-10 mb-10 print:hidden">
          {/* Brand & International Availability Bar */}
          <div className="pb-8 mb-8 border-b border-[#E8E8ED] flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <AkyinLogo wordmark={settings.brandWordmark || 'AKYIN'} size="sm" showSubtext />
              <p className="text-sm font-semibold text-[#1D1D1F]">
                Building Businesses. Creating Opportunities.
              </p>
              <p className="text-xs text-[#6E6E73]">
                {footerDescription}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs bg-white/70 backdrop-blur-sm border border-[#E8E8ED] rounded-2xl px-4 py-3 shrink-0">
              <span className="font-semibold text-[#1D1D1F]">
                {OFFICIAL_CONTACT.regionIndicator}
              </span>
              <span className="hidden sm:inline text-[#A1A1A6]" aria-hidden="true">|</span>
              <span className="text-[#6E6E73]">
                {OFFICIAL_CONTACT.internationalSupportLine}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* COLUMN 1 – AKYIN VENTURES */}
            <div className="space-y-4">
              <h3 className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                AKYIN Ventures
              </h3>
              <ul className="space-y-2.5 text-sm text-[#1D1D1F]">
                <li>
                  <a
                    href="/ventures/publishing"
                    onClick={(e) => handleLink(e, '/ventures/publishing')}
                    className="hover:text-[#0071E3] transition-colors"
                  >
                    AKYIN Publishing
                  </a>
                </li>
                <li>
                  <a
                    href="/ventures/marketing"
                    onClick={(e) => handleLink(e, '/ventures/marketing')}
                    className="hover:text-[#0071E3] transition-colors"
                  >
                    AKYIN Marketing
                  </a>
                </li>
                <li>
                  <a
                    href="/marketing/automotive"
                    onClick={(e) => handleLink(e, '/marketing/automotive')}
                    className="hover:text-[#0071E3] transition-colors text-xs text-[#6E6E73] hover:text-[#0071E3]"
                  >
                    ↳ Automotive Marketing Division
                  </a>
                </li>
                <li>
                  <a
                    href="/ventures/store"
                    onClick={(e) => handleLink(e, '/ventures/store')}
                    className="hover:text-[#0071E3] transition-colors"
                  >
                    AKYIN Store (AKYIN Thrift)
                  </a>
                </li>
                <li className="pt-2 border-t border-[#E8E8ED]">
                  <a
                    href="/ventures"
                    onClick={(e) => handleLink(e, '/ventures')}
                    className="text-xs font-semibold text-[#0071E3] hover:underline"
                  >
                    All Ventures Portfolio →
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    onClick={(e) => handleLink(e, '/about')}
                    className="text-xs text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
                  >
                    About AKYIN Ventures
                  </a>
                </li>
              </ul>
            </div>

            {/* COLUMN 2 – OUR CLIENTS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                  Our Clients
                </h3>
                <span className="text-[10px] font-semibold text-[#0071E3] bg-[#0071E3]/10 px-2 py-0.5 rounded-full">
                  58 Clients
                </span>
              </div>
              <ul className="space-y-2.5 text-sm text-[#1D1D1F]">
                <li>
                  <a
                    href="https://ais-dev-iwemnrdjpbl2zz7yzoxiyv-71845396109.asia-east1.run.app/ventures/aicalc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-[#0071E3] transition-colors"
                  >
                    <span>AICalc</span>
                    <span className="text-[10px] text-[#6E6E73]">(AI &amp; Tech)</span>
                    <ArrowUpRight className="w-3 h-3 text-[#A1A1A6]" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://ais-dev-iwemnrdjpbl2zz7yzoxiyv-71845396109.asia-east1.run.app/ventures/kartigo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-[#0071E3] transition-colors"
                  >
                    <span>Kartigo</span>
                    <span className="text-[10px] text-[#6E6E73]">(B2B Stock)</span>
                    <ArrowUpRight className="w-3 h-3 text-[#A1A1A6]" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://ais-dev-iwemnrdjpbl2zz7yzoxiyv-71845396109.asia-east1.run.app/ventures/biznxt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-[#0071E3] transition-colors"
                  >
                    <span>BizNXT</span>
                    <span className="text-[10px] text-[#6E6E73]">(Consulting)</span>
                    <ArrowUpRight className="w-3 h-3 text-[#A1A1A6]" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://ais-dev-iwemnrdjpbl2zz7yzoxiyv-71845396109.asia-east1.run.app/ventures/budget-bazaar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-[#0071E3] transition-colors"
                  >
                    <span>Budget Bazaar</span>
                    <span className="text-[10px] text-[#6E6E73]">(E-commerce)</span>
                    <ArrowUpRight className="w-3 h-3 text-[#A1A1A6]" />
                  </a>
                </li>
                <li>
                  <span className="text-xs text-[#6E6E73]">
                    AutoClub · Arosco Ventures · MEI Cosmetics
                  </span>
                </li>
                <li className="pt-2 border-t border-[#E8E8ED]">
                  <a
                    href="/#our-clients"
                    onClick={handleEcosystemScroll}
                    className="text-xs font-semibold text-[#0071E3] hover:underline"
                  >
                    View All 58 Clients Directory →
                  </a>
                </li>
              </ul>
            </div>

            {/* COLUMN 3 – SERVICES */}
            <div className="space-y-4">
              <h3 className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                Services
              </h3>
              <ul className="space-y-2.5 text-sm text-[#1D1D1F]">
                <li>
                  <a
                    href="/ventures/marketing"
                    onClick={(e) => handleLink(e, '/ventures/marketing')}
                    className="hover:text-[#0071E3] transition-colors"
                  >
                    Growth Marketing Packages
                  </a>
                </li>
                <li>
                  <a
                    href="/marketing/automotive"
                    onClick={(e) => handleLink(e, '/marketing/automotive')}
                    className="hover:text-[#0071E3] transition-colors"
                  >
                    Automotive Dealership Growth
                  </a>
                </li>
                <li>
                  <a
                    href="/ventures/marketing"
                    onClick={(e) => handleLink(e, '/ventures/marketing')}
                    className="hover:text-[#0071E3] transition-colors"
                  >
                    Lead Generation &amp; Vetting
                  </a>
                </li>
                <li>
                  <a
                    href="/ventures/marketing"
                    onClick={(e) => handleLink(e, '/ventures/marketing')}
                    className="hover:text-[#0071E3] transition-colors"
                  >
                    Creative &amp; Brand Collateral
                  </a>
                </li>
                <li>
                  <a
                    href="/advisory"
                    onClick={(e) => handleLink(e, '/advisory')}
                    className="hover:text-[#0071E3] transition-colors"
                  >
                    1-on-1 Business Advisory
                  </a>
                </li>
                <li>
                  <a
                    href="/tools"
                    onClick={(e) => handleLink(e, '/tools')}
                    className="hover:text-[#0071E3] transition-colors"
                  >
                    Business Tools (20 Calculators)
                  </a>
                </li>
                <li className="pt-2 border-t border-[#E8E8ED]">
                  <a
                    href="/pricing"
                    onClick={(e) => handleLink(e, '/pricing')}
                    className="text-xs font-semibold text-[#0071E3] hover:underline"
                  >
                    Pricing &amp; Rate Card →
                  </a>
                </li>
              </ul>
            </div>

            {/* COLUMN 4 – CONTACT & SOCIAL MEDIA */}
            <div className="space-y-5">
              <div className="space-y-3">
                <h3 className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                  Contact &amp; Social Media
                </h3>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#1D1D1F] hover:text-[#0071E3] transition-colors font-medium"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#0071E3] shrink-0" aria-hidden="true" />
                      <span>WhatsApp Connect</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#A1A1A6]" aria-hidden="true" />
                    </a>
                  </li>
                  <li>
                    <a
                      href={safeEmailHref}
                      className="inline-flex items-center gap-2 text-[#1D1D1F] hover:text-[#0071E3] transition-colors font-medium break-all"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#0071E3] shrink-0" aria-hidden="true" />
                      <span>{displayEmail}</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/contact"
                      onClick={(e) => handleLink(e, '/contact')}
                      className="inline-flex items-center gap-2 text-[#1D1D1F] hover:text-[#0071E3] transition-colors font-medium"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#0071E3] shrink-0" aria-hidden="true" />
                      <span>Enquiry &amp; Office Desk</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#A1A1A6]" aria-hidden="true" />
                    </a>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-[#E8E8ED] space-y-3">
                <h4 className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                  Follow AKYIN
                </h4>
                <SocialLinks variant="compact" />
              </div>
            </div>
          </div>
        </GlassPanel>

        {/* Bottom Copyright Bar */}
        <div className="pt-4 border-t border-[#E8E8ED] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6E6E73]">
          <p className="text-[#1D1D1F] font-medium">
            © 2026 AKYIN. All Rights Reserved.
          </p>

          <p className="hidden print:block text-[#1D1D1F]">
            https://akyin.com · {displayEmail} · WhatsApp Connect
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
            <a
              href="/privacy"
              onClick={(e) => handleLink(e, '/privacy')}
              className="hover:text-[#1D1D1F] transition-colors"
            >
              Privacy Policy
            </a>
            <span aria-hidden="true" className="text-[#A1A1A6]">·</span>
            <a
              href="/terms"
              onClick={(e) => handleLink(e, '/terms')}
              className="hover:text-[#1D1D1F] transition-colors"
            >
              Terms &amp; Conditions
            </a>
            <span aria-hidden="true" className="text-[#A1A1A6]">·</span>
            <button
              type="button"
              onClick={handleBackToTop}
              aria-label="Scroll back to top of page"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full liquid-glass-cta text-[11px] font-semibold text-[#1D1D1F] hover:text-[#0071E3] hover:border-[#0071E3]/35 transition-all cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3 h-3" aria-hidden="true" />
            </button>
          </div>
        </div>
      </EditorialReveal>
    </footer>
  );
}
