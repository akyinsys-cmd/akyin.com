import { AppRoute, ENQUIRY_CATEGORIES, OFFICIAL_CONTACT } from '../data/akyinData';
import { BusinessFAQs } from '../components/BusinessFAQs';
import { ContactDispatcher } from '../components/ContactDispatcher';
import { DirectContactSection } from '../components/DirectContactSection';
import { EditorialReveal } from '../components/EditorialReveal';
import { SocialLinks } from '../components/SocialLinks';

interface ContactPageProps {
  defaultCategory: string;
  defaultVertical: string;
  defaultEnquiryType: string;
  onNavigate?: (route: AppRoute) => void;
}

export function ContactPage({
  defaultCategory,
  defaultVertical,
  defaultEnquiryType,
  onNavigate,
}: ContactPageProps) {
  const handleNavigate = (route: AppRoute) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.location.href = route;
    }
  };

  return (
    <div>
      <section className="surface-silver-gradient text-[#1D1D1F] pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#0071E3]">
              AKYIN Ventures · {OFFICIAL_CONTACT.regionIndicator} · {OFFICIAL_CONTACT.internationalSupportLine}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-[-0.025em] text-balance">
              Let&apos;s Start a Conversation.
            </h1>
            <p className="text-base sm:text-lg text-[#6E6E73] max-w-2xl leading-relaxed">
              Route your enquiry to the appropriate vertical under AKYIN Ventures across publishing, marketing agency campaigns, retail, AICalc, Kartigo, BizNXT, Budget Bazaar, or strategic business partnerships.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#6E6E73]">
            {ENQUIRY_CATEGORIES.map((cat, idx) => (
              <span key={cat} className="inline-flex items-center gap-2">
                <span>{cat}</span>
                {idx < ENQUIRY_CATEGORIES.length - 1 && (
                  <span aria-hidden="true" className="text-[#A1A1A6]">
                    ·
                  </span>
                )}
              </span>
            ))}
          </div>

          <div className="pt-2">
            <p className="text-xs font-semibold text-[#1D1D1F] mb-3">
              Follow AKYIN
            </p>
            <SocialLinks variant="card" className="max-w-3xl" />
          </div>
        </div>
      </section>

      <DirectContactSection onNavigate={handleNavigate} />

      <EditorialReveal>
        <ContactDispatcher
          sectionId="central-contact-form"
          defaultCategory={defaultCategory}
          defaultVertical={defaultVertical}
          defaultEnquiryType={defaultEnquiryType}
        />
      </EditorialReveal>

      {/* Interactive FAQ Accordion Section */}
      <section className="py-20 lg:py-28 bg-[#FFFFFF] border-t border-[#E8E8ED]">
        <EditorialReveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BusinessFAQs />
        </EditorialReveal>
      </section>
    </div>
  );
}
