import { ArrowUpRight, BookOpen } from 'lucide-react';
import { IMAGES, PUBLISHING_LINKS } from '../data/akyinData';
import { ContactDispatcher } from '../components/ContactDispatcher';
import { EditorialReveal } from '../components/EditorialReveal';
import { ResilientImage } from '../components/ResilientImage';

export function PublishingPage() {
  return (
    <div>
      {/* Warm Editorial Publishing Hero */}
      <section className="bg-[#EFE9DE] text-[#292722] pt-28 pb-20 lg:pt-36 lg:pb-24 border-b border-[#D9CCB9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <p className="text-xs font-semibold tracking-wide text-[#B66A50]">
              AKYIN PUBLISHING · Book &amp; Digital Publishing
            </p>
            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight leading-[1.08] text-balance">
              Ideas Worth Reading. Knowledge Worth Sharing.
            </h1>
            <p className="text-base sm:text-lg text-[#77736C] leading-relaxed">
              AKYIN Publishing focuses on creating and distributing books and digital reading experiences for readers across international marketplaces.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={PUBLISHING_LINKS.amazonAuthorStore}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#B66A50] hover:bg-[#9E5740] text-white text-sm font-semibold transition-colors whitespace-nowrap"
              >
                Explore Our Books on Amazon
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href={PUBLISHING_LINKS.googlePlayDisciplineCode}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#FFFFFF] hover:bg-[#F7F5F0] text-[#292722] border border-[#D9CCB9] text-sm font-semibold transition-colors whitespace-nowrap"
              >
                Read on Google Play Books
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-[#D9CCB9] shadow-md aspect-[4/3] bg-[#F7F5F0]">
              <ResilientImage
                src={IMAGES.publishingHero}
                alt="Hardcover editions and brass lamp on an editorial reading desk"
                loading="eager"
                fallbackTitle="AKYIN PUBLISHING"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Book Presentation: THE DISCIPLINE CODE */}
      <section className="py-20 lg:py-24 bg-[#FFFFFF]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden bg-[#EFE9DE] border border-[#D9CCB9] shadow-md aspect-[3/4] max-w-md mx-auto">
                <ResilientImage
                  src={IMAGES.disciplineCodeBook}
                  alt="THE DISCIPLINE CODE by Akyin book cover presentation"
                  loading="lazy"
                  fallbackTitle="THE DISCIPLINE CODE — Akyin"
                  branded={false}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold tracking-wide text-[#B66A50]">
                  Featured Publication · Google Play Books
                </p>
                <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#292722]">
                  THE DISCIPLINE CODE
                </h2>
                <p className="text-sm font-semibold text-[#77736C]">
                  Author: Akyin
                </p>
              </div>

              <p className="text-base text-[#77736C] leading-relaxed">
                Published under AKYIN Publishing, <span className="font-semibold text-[#292722]">THE DISCIPLINE CODE</span> is available digitally on Google Play Books, enabling readers globally to access the edition seamlessly across devices.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="rounded-xl bg-[#F7F5F0] border border-[#D9CCB9] p-5 space-y-2">
                  <p className="text-xs font-semibold text-[#83866A]">Platform A</p>
                  <h3 className="font-display text-lg font-bold text-[#292722]">
                    Amazon Author Store
                  </h3>
                  <p className="text-xs text-[#77736C] leading-relaxed">
                    Browse the official Akyin author storefront and available editions on Amazon.com.
                  </p>
                  <a
                    href={PUBLISHING_LINKS.amazonAuthorStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 pt-2 text-xs font-bold text-[#B66A50] hover:underline"
                  >
                    Explore Our Books on Amazon
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>

                <div className="rounded-xl bg-[#F7F5F0] border border-[#D9CCB9] p-5 space-y-2">
                  <p className="text-xs font-semibold text-[#83866A]">Platform B</p>
                  <h3 className="font-display text-lg font-bold text-[#292722]">
                    Google Play Books
                  </h3>
                  <p className="text-xs text-[#77736C] leading-relaxed">
                    Read <span className="font-semibold text-[#292722]">THE DISCIPLINE CODE</span> directly via Google Play Books.
                  </p>
                  <a
                    href={PUBLISHING_LINKS.googlePlayDisciplineCode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 pt-2 text-xs font-bold text-[#292722] hover:text-[#B66A50]"
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
      <section className="py-20 bg-[#EFE9DE] border-t border-[#D9CCB9]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#FFFFFF] border border-[#D9CCB9] text-[#B66A50] flex items-center justify-center">
              <BookOpen className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="font-editorial text-3xl font-bold text-[#292722]">
              About Our Publishing Initiative
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-4 text-base text-[#292722]/85 leading-relaxed">
            <p>
              AKYIN Publishing pairs thoughtful editorial curation with established global digital storefronts. By distributing directly through Amazon and Google Play Books, readers worldwide can discover and read editions in reliable digital and print formats.
            </p>
            <p>
              For distribution discussions, institutional bulk book requests, or publishing enquiries, complete the enquiry form below.
            </p>
          </div>
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
