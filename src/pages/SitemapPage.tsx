import { ArrowRight, ArrowUpRight, Compass, Globe, Layers, Mail, Phone } from 'lucide-react';
import {
  AppRoute,
  EXTERNAL_VERTICAL_URLS,
  OFFICIAL_CONTACT,
  PUBLISHING_LINKS,
  VENTURES_PORTFOLIO,
} from '../data/akyinData';
import { EditorialReveal } from '../components/EditorialReveal';
import { SocialLinks } from '../components/SocialLinks';

interface SitemapPageProps {
  onNavigate: (route: AppRoute) => void;
}

interface CorporateRouteItem {
  route: AppRoute;
  title: string;
  description: string;
  sections: string[];
}

interface VerticalSectionItem {
  id: string;
  code: string;
  name: string;
  route: AppRoute;
  sector: string;
  externalUrl?: string;
  externalLabel?: string;
  keySections: string[];
}

const CORPORATE_ROUTES: CorporateRouteItem[] = [
  {
    route: '/',
    title: 'Home — AKYIN Ventures Group Portal',
    description:
      'Parent corporate overview introducing AKYIN Ventures, equal-weight portfolio showcase across five operating verticals, and group enquiry gateway.',
    sections: [
      'Hero Introduction (Building Ideas Into Businesses)',
      'About AKYIN Ventures',
      'Our Business Portfolio (All 5 Verticals)',
      'Explore Our Ventures',
      'Our Approach to Business',
      'Featured Products & Direct Gateways',
      'Official Channels (@akyinmarketing) & Contact Desk',
    ],
  },
  {
    route: '/about',
    title: 'About Us — Corporate Profile & FAQs',
    description:
      'Corporate orientation, diversified business model architecture, purpose of each operating vertical, and answers to common business group questions.',
    sections: [
      'Corporate Profile Header',
      'Group Orientation & Diversified Initiatives',
      'Venture Architecture & Vertical Purpose',
      'Business FAQs Accordion',
    ],
  },
  {
    route: '/ventures',
    title: 'Our Businesses — Venture Portfolio Directory',
    description:
      'Structured directory comparing all five operating divisions with direct links to dedicated vertical pages, live external domains, and vertical enquiries.',
    sections: [
      'Portfolio Directory Overview',
      '5-Vertical Comparison Grid',
      'Direct Vertical Enquiry Triggers',
    ],
  },
  {
    route: '/insights',
    title: 'Insights — Perspectives & Business Philosophy',
    description:
      'Operational essays covering global independent publishing, transparent dealership qualification separation, curated retail merchandising, and specialized digital platforms.',
    sections: [
      '01 · Independent Publishing Through Digital Storefronts',
      '02 · Measuring Lead Generation & Qualification Separately',
      '03 · Accessible Fashion Through Curated Merchandising',
      '04 · Purpose-Built Platforms vs. Generic Portals',
    ],
  },
  {
    route: '/contact',
    title: 'Contact — Central Enquiry Desk',
    description:
      'Zero-backend structured enquiry dispatcher routing publishing, dealership marketing, retail, AICalc, Kartigo, and strategic partnership requests via WhatsApp or Email.',
    sections: [
      'Enquiry Categories Overview',
      'Official Social Media Channels (@akyinmarketing)',
      'Structured Enquiry Dispatcher Form',
    ],
  },
  {
    route: '/sitemap',
    title: 'Sitemap — Complete Directory & Index',
    description:
      'Full architectural map of all corporate pages, vertical landing pages, key page sections, external platforms, and verified social destinations.',
    sections: [
      'Corporate Parent Group Pages',
      'Five Operating Verticals & Key Sections',
      'External Platforms & Direct Channels',
    ],
  },
];

const VERTICAL_SECTION_INDEX: VerticalSectionItem[] = [
  {
    id: 'publishing',
    code: '01',
    name: 'AKYIN Publishing',
    route: '/ventures/publishing',
    sector: 'Book & Digital Publishing',
    externalUrl: PUBLISHING_LINKS.amazonAuthorStore,
    externalLabel: 'Amazon Author Store',
    keySections: [
      'Editorial Publishing Hero & Marketplace Links',
      'Featured Publication: THE DISCIPLINE CODE by Akyin',
      'Amazon Author Store & Google Play Books Distribution',
      'About Our Publishing Initiative',
      'Publishing Enquiries Form',
    ],
  },
  {
    id: 'marketing',
    code: '02',
    name: 'AKYIN MARKETINGS',
    route: '/ventures/marketing',
    sector: 'Automotive Dealership Marketing & Sales Training',
    keySections: [
      'Automotive Dealership Growth Hero',
      'About AKYIN MARKETINGS (3 Core Pillars)',
      'Complete 18-Service Filterable Catalogue',
      '16 Years of Automotive Industry Experience (Maruti Suzuki to Audi)',
      'Dealership Showroom Sales Training (₹25,000 per session)',
      'Retainer Packages (Package A & Package B) & Searchable 21-Item Rate Card',
      'Official @akyinmarketing Social Channels & Proposal Dispatcher',
    ],
  },
  {
    id: 'store',
    code: '03',
    name: 'AKYIN STORE / AKYIN THRIFT',
    route: '/ventures/store',
    sector: 'Fashion & Value Apparel Retail',
    keySections: [
      'AKYIN THRIFT Retail Hero Campaign',
      'Retail Brand Architecture & Merchandising Focus',
      'Featured Collections (Men’s, Women’s & Streetwear)',
      'Why Shop AKYIN THRIFT',
      'Available Catalogue & Retail Enquiries',
    ],
  },
  {
    id: 'aicalc',
    code: '04',
    name: 'AICalc',
    route: '/ventures/aicalc',
    sector: 'AI Utility & Financial Calculation Platform',
    externalUrl: EXTERNAL_VERTICAL_URLS.aicalc,
    externalLabel: 'aicalc.in',
    keySections: [
      'AICalc Hero & Interactive Natural-Language Query Preview',
      'AI Calculator vs. Manual Calculator Capabilities',
      'Supported Calculation Categories (Finance, Commerce, Arithmetic, Conversions)',
      'Direct Gateway to AICalc.in & Platform Enquiries',
    ],
  },
  {
    id: 'kartigo',
    code: '05',
    name: 'Kartigo',
    route: '/ventures/kartigo',
    sector: 'B2B Stock Supply & Wholesale Commerce',
    externalUrl: EXTERNAL_VERTICAL_URLS.kartigo,
    externalLabel: 'kartigo.online',
    keySections: [
      'B2B Stock Supply Hero',
      'Focused Wholesale & Stock Trade Concept',
      'Business Buyer Benefits & Supplier Opportunities',
      '3-Step How Businesses Engage With Kartigo Workflow',
      'Direct Gateway to Kartigo.online & B2B Supply Enquiries',
    ],
  },
  {
    id: 'biznxt',
    code: '06',
    name: 'BizNXT.online',
    route: '/ventures/biznxt',
    sector: 'Business Guidance & Consulting',
    externalUrl: EXTERNAL_VERTICAL_URLS.biznxt,
    externalLabel: 'biznxt.online',
    keySections: [
      'Hero Introduction & BizNXT.online Gateway',
      'About BizNXT & Entrepreneurial Focus',
      'Business Guidance & Feasibility Evaluation',
      'Consulting Services & Commercial Structuring',
      'Business Development & Direct Consulting Enquiries',
    ],
  },
  {
    id: 'budget-bazaar',
    code: '07',
    name: 'Budget Bazaar',
    route: '/ventures/budget-bazaar',
    sector: 'Affordable Retail & Everyday Goods',
    externalUrl: EXTERNAL_VERTICAL_URLS.budgetBazaar,
    externalLabel: 'budgetbazaar.org',
    keySections: [
      'Value Retail Hero & Storefront CTA',
      'Value-First Merchandising Principles',
      'Direct Gateway to budgetbazaar.org',
      'Budget Bazaar Retail & Product Enquiries',
    ],
  },
];

export function SitemapPage({ onNavigate }: SitemapPageProps) {
  return (
    <div>
      {/* Editorial Sitemap Header */}
      <section className="bg-[#EFE9DE] text-[#292722] pt-28 pb-16 lg:pt-36 lg:pb-20 border-b border-[#D9CCB9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <p className="text-xs font-semibold tracking-wide text-[#B66A50]">
            AKYIN Ventures · Website Directory &amp; Sitemap
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] text-balance max-w-4xl">
            Complete Site Map &amp; Business Directory.
          </h1>
          <p className="text-base sm:text-lg text-[#77736C] max-w-3xl leading-relaxed">
            A structured overview of all AKYIN Ventures corporate pages, dedicated vertical destinations, key content sections, and verified external platforms.
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-2 text-xs font-medium text-[#77736C]">
            <span className="font-mono-num font-bold text-[#292722]">6 Corporate Pages</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-num font-bold text-[#292722]">
              {VENTURES_PORTFOLIO.length} Operating Verticals
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-num font-bold text-[#292722]">
              6 External Storefronts &amp; Platforms
            </span>
          </div>
        </div>
      </section>

      {/* Section 1: Corporate Parent Group Pages */}
      <section className="py-20 bg-[#F7F5F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <EditorialReveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-[#B66A50]">
                  <Compass className="w-4 h-4" aria-hidden="true" />
                  <span>Parent Portal Routes</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#292722]">
                  Corporate Group Pages.
                </h2>
              </div>
              <p className="text-sm text-[#77736C] max-w-md">
                Core informational routes across akyin.com introducing the parent business group, leadership orientation, and central enquiry desk.
              </p>
            </div>
          </EditorialReveal>

          <EditorialReveal delay={0.05}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CORPORATE_ROUTES.map((item) => (
                <article
                  key={item.route}
                  className="bg-[#FFFFFF] rounded-2xl border border-[#D9CCB9] p-6 sm:p-7 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-3">
                    <p className="font-mono-num text-xs font-bold text-[#B66A50]">
                      {item.route}
                    </p>
                    <h3 className="font-display text-xl font-bold text-[#292722] text-balance">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#77736C] leading-relaxed">
                      {item.description}
                    </p>
                    <div className="pt-2 border-t border-[#EFE9DE] space-y-1.5">
                      <p className="text-[11px] font-semibold tracking-wide text-[#83866A]">
                        Key Sections
                      </p>
                      <ul className="space-y-1 text-xs text-[#292722]/85">
                        {item.sections.map((section) => (
                          <li key={section} className="flex items-start gap-2">
                            <span className="text-[#B66A50] font-bold" aria-hidden="true">
                              ·
                            </span>
                            <span>{section}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#EFE9DE]">
                    <button
                      type="button"
                      onClick={() => onNavigate(item.route)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B66A50] hover:text-[#9E5740] transition-colors cursor-pointer"
                    >
                      Open {item.route}
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </EditorialReveal>
        </div>
      </section>

      {/* Section 2: Five Operating Verticals & Detailed Sections */}
      <section className="py-20 bg-[#FFFFFF] border-t border-[#D9CCB9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <EditorialReveal>
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-[#B66A50]">
                <Layers className="w-4 h-4" aria-hidden="true" />
                <span>Operating Divisions</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#292722]">
                Vertical Landing Pages &amp; Section Index.
              </h2>
              <p className="text-sm sm:text-base text-[#77736C] leading-relaxed">
                Dedicated landing routes for each of the five AKYIN Ventures operating businesses, detailing every section available on each page.
              </p>
            </div>
          </EditorialReveal>

          <EditorialReveal delay={0.05}>
            <div className="divide-y divide-[#D9CCB9] border border-[#D9CCB9] rounded-2xl bg-[#F7F5F0]/55 overflow-hidden">
              {VERTICAL_SECTION_INDEX.map((vertical) => (
                <article
                  key={vertical.id}
                  className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start hover:bg-[#FFFFFF] transition-colors"
                >
                  <div className="lg:col-span-5 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#77736C]">
                      <span className="font-mono-num font-bold text-[#B66A50]">
                        {vertical.code}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{vertical.sector}</span>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-[#292722]">
                      {vertical.name}
                    </h3>
                    <p className="font-mono-num text-xs text-[#77736C]">{vertical.route}</p>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <button
                        type="button"
                        onClick={() => onNavigate(vertical.route)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#B66A50] hover:bg-[#9E5740] text-white text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Visit Page
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>

                      {vertical.externalUrl && (
                        <a
                          href={vertical.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#292722] hover:text-[#B66A50] transition-colors whitespace-nowrap"
                        >
                          {vertical.externalLabel}
                          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-7 bg-[#FFFFFF] rounded-xl border border-[#D9CCB9] p-5 sm:p-6 space-y-3">
                    <p className="text-xs font-semibold tracking-wide text-[#83866A]">
                      Page Sections &amp; Content Index
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs sm:text-sm text-[#292722]/90">
                      {vertical.keySections.map((sec) => (
                        <li key={sec} className="flex items-start gap-2">
                          <span className="text-[#B66A50] font-bold" aria-hidden="true">
                            ·
                          </span>
                          <span>{sec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </EditorialReveal>
        </div>
      </section>

      {/* Section 3: External Platforms, Direct Contact & Official Socials */}
      <section className="py-20 bg-[#EFE9DE] border-t border-[#D9CCB9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <EditorialReveal>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6 bg-[#FFFFFF] rounded-2xl border border-[#D9CCB9] p-7 sm:p-8 space-y-5">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#B66A50]">
                  <Globe className="w-4 h-4" aria-hidden="true" />
                  <span>External Storefronts &amp; Independent Domains</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-[#292722]">
                  Verified External Destinations.
                </h2>
                <ul className="divide-y divide-[#EFE9DE] text-sm">
                  <li className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#292722]">AICalc.in</p>
                      <p className="text-xs text-[#77736C]">AI &amp; Manual Calculation Web App</p>
                    </div>
                    <a
                      href={EXTERNAL_VERTICAL_URLS.aicalc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#B66A50] hover:underline whitespace-nowrap"
                    >
                      aicalc.in
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </li>
                  <li className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#292722]">Kartigo.online</p>
                      <p className="text-xs text-[#77736C]">B2B Stock Supply &amp; Commerce Platform</p>
                    </div>
                    <a
                      href={EXTERNAL_VERTICAL_URLS.kartigo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#B66A50] hover:underline whitespace-nowrap"
                    >
                      kartigo.online
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </li>
                  <li className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#292722]">BizNXT.online</p>
                      <p className="text-xs text-[#77736C]">Business Guidance &amp; Consulting Platform</p>
                    </div>
                    <a
                      href={EXTERNAL_VERTICAL_URLS.biznxt}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#B66A50] hover:underline whitespace-nowrap"
                    >
                      biznxt.online
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </li>
                  <li className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#292722]">BudgetBazaar.org</p>
                      <p className="text-xs text-[#77736C]">Affordable Consumer Retail Storefront</p>
                    </div>
                    <a
                      href={EXTERNAL_VERTICAL_URLS.budgetBazaar}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#B66A50] hover:underline whitespace-nowrap"
                    >
                      budgetbazaar.org
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </li>
                  <li className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#292722]">Amazon Author Store</p>
                      <p className="text-xs text-[#77736C]">AKYIN Publishing Titles on Amazon.com</p>
                    </div>
                    <a
                      href={PUBLISHING_LINKS.amazonAuthorStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#B66A50] hover:underline whitespace-nowrap"
                    >
                      Visit Store
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </li>
                  <li className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#292722]">Google Play Books</p>
                      <p className="text-xs text-[#77736C]">THE DISCIPLINE CODE by Akyin</p>
                    </div>
                    <a
                      href={PUBLISHING_LINKS.googlePlayDisciplineCode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#B66A50] hover:underline whitespace-nowrap"
                    >
                      Read Edition
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </li>
                </ul>
              </div>

              <div className="lg:col-span-6 bg-[#FFFFFF] rounded-2xl border border-[#D9CCB9] p-7 sm:p-8 space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[#B66A50]">
                    Direct Contact &amp; Official Social Accounts
                  </p>
                  <h2 className="font-display text-2xl font-bold text-[#292722]">
                    Connect Directly With AKYIN Ventures.
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <a
                    href={`mailto:${OFFICIAL_CONTACT.email}`}
                    className="rounded-xl bg-[#F7F5F0] border border-[#D9CCB9] hover:border-[#B66A50] p-4 space-y-1 transition-colors"
                  >
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#B66A50]">
                      <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Corporate Email</span>
                    </div>
                    <p className="text-sm font-bold text-[#292722]">{OFFICIAL_CONTACT.email}</p>
                  </a>

                  <a
                    href={OFFICIAL_CONTACT.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-[#F7F5F0] border border-[#D9CCB9] hover:border-[#B66A50] p-4 space-y-1 transition-colors"
                  >
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#B66A50]">
                      <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>WhatsApp / Phone</span>
                    </div>
                    <p className="font-mono-num text-sm font-bold text-[#292722]">
                      {OFFICIAL_CONTACT.phoneDisplay}
                    </p>
                  </a>
                </div>

                <div className="space-y-3 pt-2 border-t border-[#EFE9DE]">
                  <p className="text-xs font-semibold text-[#77736C]">
                    Official Social Media Channels ({OFFICIAL_CONTACT.marketingSocialHandle})
                  </p>
                  <SocialLinks variant="inline" />
                </div>
              </div>
            </div>
          </EditorialReveal>
        </div>
      </section>
    </div>
  );
}
