import { ENQUIRY_CATEGORIES, OFFICIAL_CONTACT } from '../data/akyinData';
import { ContactDispatcher } from '../components/ContactDispatcher';
import { EditorialReveal } from '../components/EditorialReveal';
import { SocialLinks } from '../components/SocialLinks';

interface ContactPageProps {
  defaultCategory: string;
  defaultVertical: string;
  defaultEnquiryType: string;
}

export function ContactPage({
  defaultCategory,
  defaultVertical,
  defaultEnquiryType,
}: ContactPageProps) {
  return (
    <div>
      <section className="bg-[#EFE9DE] text-[#292722] pt-28 pb-16 lg:pt-36 lg:pb-20 border-b border-[#D9CCB9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-wide text-[#B66A50]">
              AKYIN Ventures · Central Enquiry Desk
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-balance">
              Let&apos;s Start a Conversation.
            </h1>
            <p className="text-base sm:text-lg text-[#77736C] max-w-2xl leading-relaxed">
              Route your enquiry to the appropriate vertical under AKYIN Ventures across publishing, dealership marketing, retail, AICalc, Kartigo, or strategic business partnerships.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#77736C]">
            {ENQUIRY_CATEGORIES.map((cat, idx) => (
              <span key={cat} className="inline-flex items-center gap-2">
                <span>{cat}</span>
                {idx < ENQUIRY_CATEGORIES.length - 1 && (
                  <span aria-hidden="true" className="text-[#A99C8B]">
                    /
                  </span>
                )}
              </span>
            ))}
          </div>

          {/* Dedicated Social Media & Direct Channels Card */}
          <div className="pt-2">
            <p className="text-xs font-semibold text-[#292722] mb-3">
              Official Social Media Channels ({OFFICIAL_CONTACT.marketingSocialHandle})
            </p>
            <SocialLinks variant="card" className="max-w-2xl" />
          </div>
        </div>
      </section>

      <EditorialReveal>
        <ContactDispatcher
          sectionId="central-contact-form"
          defaultCategory={defaultCategory}
          defaultVertical={defaultVertical}
          defaultEnquiryType={defaultEnquiryType}
        />
      </EditorialReveal>
    </div>
  );
}
