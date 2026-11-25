import { ArrowRight, Globe, Mail, MessageCircle, UserCheck } from 'lucide-react';
import { AppRoute, OFFICIAL_CONTACT } from '../data/akyinData';
import { useSiteConfig } from '../context/SiteConfigContext';
import { sanitizeHref } from '../utils/security';
import { EditorialReveal } from './EditorialReveal';
import { GlassButton, GlassPanel } from './liquid-glass';
import { SocialLinks } from './SocialLinks';

interface DirectContactSectionProps {
  onNavigate: (route: AppRoute) => void;
  sectionId?: string;
}

export function DirectContactSection({
  onNavigate,
  sectionId = 'direct-contact-desk',
}: DirectContactSectionProps) {
  const { settings } = useSiteConfig();
  const displayEmail = settings.contactEmail || OFFICIAL_CONTACT.email;
  const whatsappHref = sanitizeHref(OFFICIAL_CONTACT.whatsappUrl, OFFICIAL_CONTACT.whatsappChannelUrl);
  const mailHref = sanitizeHref(`mailto:${displayEmail}`, `mailto:${OFFICIAL_CONTACT.email}`, true);

  return (
    <section
      id={sectionId}
      className="py-20 lg:py-24 bg-[#FFFFFF] border-t border-[#E8E8ED]"
    >
      <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GlassPanel className="p-8 sm:p-10 lg:p-12 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Heading & International Context */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#0071E3]">
                <span>Direct Contact</span>
                <span aria-hidden="true" className="text-[#A1A1A6]">·</span>
                <span className="text-[#6E6E73]">{OFFICIAL_CONTACT.regionIndicator}</span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.025em] leading-[1.1] text-[#1D1D1F] text-balance">
                Let&apos;s Build Something Together.
              </h2>

              <p className="text-base text-[#6E6E73] leading-relaxed max-w-xl">
                Have a business idea, need marketing support or want to explore a partnership? Reach out to our team via WhatsApp Connect or email.
              </p>

              <p className="text-xs font-medium text-[#6E6E73]">
                {OFFICIAL_CONTACT.internationalPositioning} · {OFFICIAL_CONTACT.internationalSupportLine}
              </p>

              {/* Three Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <GlassButton
                  variant="primary"
                  size="md"
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>WhatsApp Connect</span>
                </GlassButton>

                <GlassButton
                  variant="glass"
                  size="md"
                  href={mailHref}
                >
                  <Mail className="w-4 h-4 text-[#0071E3]" aria-hidden="true" />
                  <span>Email Us</span>
                </GlassButton>

                <GlassButton
                  variant="subtle"
                  size="md"
                  href="/ventures"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/ventures');
                  }}
                >
                  <span>Explore Our Ventures</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </GlassButton>
              </div>
            </div>

            {/* Structured Contact Card Details */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-[#FFFFFF] border border-[#E8E8ED] p-4 shadow-2xs space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#6E6E73]">
                  <UserCheck className="w-3.5 h-3.5 text-[#0071E3]" aria-hidden="true" />
                  <span>Contact Lead</span>
                </div>
                <p className="text-base font-semibold text-[#1D1D1F]">
                  {OFFICIAL_CONTACT.contactName}
                </p>
              </div>

              <div className="rounded-2xl bg-[#FFFFFF] border border-[#E8E8ED] p-4 shadow-2xs space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#6E6E73]">
                  <MessageCircle className="w-3.5 h-3.5 text-[#0071E3]" aria-hidden="true" />
                  <span>WhatsApp Connect</span>
                </div>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-base font-semibold text-[#1D1D1F] hover:text-[#0071E3] transition-colors"
                >
                  Official AKYIN Channel
                </a>
              </div>

              <div className="rounded-2xl bg-[#FFFFFF] border border-[#E8E8ED] p-4 shadow-2xs space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#6E6E73]">
                  <Mail className="w-3.5 h-3.5 text-[#0071E3]" aria-hidden="true" />
                  <span>Email</span>
                </div>
                <a
                  href={mailHref}
                  className="block text-base font-semibold text-[#1D1D1F] hover:text-[#0071E3] transition-colors break-all"
                >
                  {displayEmail}
                </a>
              </div>

              <div className="rounded-2xl bg-[#FFFFFF] border border-[#E8E8ED] p-4 shadow-2xs space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#6E6E73]">
                  <Globe className="w-3.5 h-3.5 text-[#0071E3]" aria-hidden="true" />
                  <span>Website</span>
                </div>
                <a
                  href={OFFICIAL_CONTACT.domain}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-base font-semibold text-[#1D1D1F] hover:text-[#0071E3] transition-colors"
                >
                  {OFFICIAL_CONTACT.websiteLabel}
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#1D1D1F]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              Follow AKYIN
            </p>
            <SocialLinks variant="inline" />
          </div>
        </GlassPanel>
      </EditorialReveal>
    </section>
  );
}
