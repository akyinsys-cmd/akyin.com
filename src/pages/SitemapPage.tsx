import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, Compass, Globe, Layers, Mail, MessageCircle } from 'lucide-react';
import {
  AppRoute,
  EXTERNAL_VERTICAL_URLS,
  OFFICIAL_CONTACT,
  PUBLISHING_LINKS,
  SERVICE_MARKETPLACE_CATEGORIES,
  VENTURES_PORTFOLIO,
} from '../data/akyinData';
import { SuiteServiceItem, suiteApi } from '../services/suiteApi';
import { EditorialReveal } from '../components/EditorialReveal';
import { GlassButton } from '../components/liquid-glass';
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
      'Parent corporate overview introducing AKYIN Ventures, 3 core operating divisions, 58+ client ecosystem, and group enquiry gateway.',
    sections: [
      'Liquid Glass Hero Introduction (Building Ideas Into Businesses)',
      'About AKYIN Ventures',
      'Our Business Portfolio (3 Core Operating Divisions)',
      'Our Clients (Businesses That Trust AKYIN for Their Growth & 58 Clients Metric)',
      'Interactive Business Toolkit (ROI, Budget Planner, Assessment, Service Finder & Booking)',
      'Explore Our Ventures',
      'Our Approach to Business',
      'Featured Products & Direct Gateways',
      'Customer & Client Endorsements (Verified Reviews & Feedback)',
      'Official Channels (@akyinventures) & Contact Desk',
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
      'Interactive Growth Milestones Timeline',
      'Venture Architecture & Vertical Purpose',
      'Security & Integrity Standards',
      'Business FAQs Accordion',
    ],
  },
  {
    route: '/ventures',
    title: 'Our Businesses — Venture Portfolio Directory',
    description:
      'Structured directory comparing all seven operating divisions with direct links to dedicated vertical pages, live external domains, and vertical enquiries.',
    sections: [
      'Portfolio Directory Overview',
      '7-Vertical Comparison Grid',
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
      '05 · Clarity in Advisory & Everyday Value Retail',
      'Automotive Marketing Trends & Benchmark Intelligence',
    ],
  },
  {
    route: '/advisory',
    title: 'Business Advisory — Consultation Booking',
    description:
      'Dedicated consultation request desk with live Asia/Kolkata (IST) slot selection and fee transparency.',
    sections: [
      'Your Business. Your Vision. A Clearer Direction.',
      'Advisory Focus Areas & Session Schedule',
      'Live IST Time Slot Picker & Booking Form',
    ],
  },
  {
    route: '/contact',
    title: 'Contact — Central Enquiry Desk',
    description:
      'Structured enquiry dispatcher logging requests and preparing WhatsApp or Email drafts across publishing, marketing agency services, retail, AICalc, Kartigo, BizNXT, Budget Bazaar, and partnerships.',
    sections: [
      'Enquiry Categories Overview',
      'Official Social Media Channels (@akyinmarketing)',
      'Structured Enquiry Dispatcher Form',
    ],
  },
  {
    route: '/pricing',
    title: 'Pricing & Rate Card — Transparent Standalone Commercial Terms',
    description:
      'Complete standalone INR pricing for AKYIN MARKETINGS services, sales coaching workshops, advisory consultations, Bulk SMS, WhatsApp setup, and interactive quotation builder.',
    sections: [
      'Standalone Growth, Lead Filtering & Training Settlement',
      'Bulk SMS (₹3,000) & WhatsApp Setup (₹4,999 + Usage Separate)',
      'Interactive Standalone Quotation Builder & Complete INR Rate Card',
    ],
  },
  {
    route: '/tools',
    title: 'Business Tools — 20 Interactive Calculators & Utilities',
    description:
      'Public growth toolkit featuring 7 Marketing, 7 Sales, and 6 Business calculators including GST, Margin, Break-Even, ROI, ROAS, and Quotation Request.',
    sections: [
      'Marketing Growth Calculators (7 Tools)',
      'Sales Conversion & Revenue Calculators (7 Tools)',
      'Business Operations & Consultation Tools (6 Tools)',
    ],
  },
  {
    route: '/terms',
    title: 'Terms of Service — Governance & Engagement Scope',
    description:
      'Parent group attribution, direct platform ad billing policy, and lead generation vs. qualification separation.',
    sections: [
      'Corporate Attribution & Scope',
      'Direct Platform Ad Billing Rules',
      'Service Separation Commitments',
    ],
  },
  {
    route: '/privacy',
    title: 'Privacy Policy — Data Protection & Zero-Broker Policy',
    description:
      'Enquiry validation standards, direct routing, and zero third-party data brokering guarantees.',
    sections: [
      'Enquiry & Booking Data Processing',
      'Security Standards & Content Policy',
      'Direct Data Governance Contacts',
    ],
  },
  {
    route: '/sitemap',
    title: 'Sitemap — Complete Directory & Index',
    description:
      'Full architectural map of all corporate pages, vertical landing pages, key page sections, external platforms, and verified social destinations.',
    sections: [
      'Corporate Parent Group Pages',
      'Seven Operating Verticals & Key Sections',
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
      'Publishing Hero (Ideas That Inspire. Knowledge That Empowers.)',
      'Explore Our Books on Amazon (8 Published Titles)',
      'Digital Guides & Productivity Tools (3 Gumroad Editions)',
      'Explore More (AKYIN on Pinterest) & Author Storefronts',
      'About Our Publishing Initiative & Enquiries',
    ],
  },
  {
    id: 'marketing',
    code: '02',
    name: 'AKYIN MARKETINGS',
    route: '/ventures/marketing',
    sector: 'Standalone Marketing Service Marketplace',
    keySections: [
      'Full-Service Marketing Agency Hero',
      'About AKYIN MARKETINGS (3 Core Pillars)',
      '10-Category Standalone Service Marketplace (/services/:slug)',
      '16 Years of Multi-Industry & Automotive Commercial Experience',
      'Commercial & Dealership Sales Training (₹50,000 per session)',
      'Searchable Individual Service Rate Card & Quotation Builder',
      'Official @akyinventures Social Channels & Proposal Dispatcher',
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
    sector: 'Client Showcase · AI & Technology',
    externalUrl: EXTERNAL_VERTICAL_URLS.aicalc,
    externalLabel: 'aicalc.in',
    keySections: [
      'AICalc Client Showcase Hero & Interactive Natural-Language Preview',
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
    sector: 'Client Showcase · B2B Stock Supply',
    externalUrl: EXTERNAL_VERTICAL_URLS.kartigo,
    externalLabel: 'kartigo.online',
    keySections: [
      'Kartigo Client Showcase Hero',
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
    sector: 'Client Showcase · Business Guidance & Consulting',
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
    sector: 'Client Showcase · B2C E-commerce',
    externalUrl: EXTERNAL_VERTICAL_URLS.budgetBazaar,
    externalLabel: 'budgetbazaar.org',
    keySections: [
      'Budget Bazaar Client Showcase Hero & Storefront CTA',
      'Value-First Merchandising Principles',
      'Direct Gateway to budgetbazaar.org',
      'Budget Bazaar Retail & Product Enquiries',
    ],
  },
];

export function SitemapPage({ onNavigate }: SitemapPageProps) {
  const [services, setServices] = useState<SuiteServiceItem[]>([]);
  const [categories, setCategories] = useState<string[]>([...SERVICE_MARKETPLACE_CATEGORIES]);

  useEffect(() => {
    let active = true;
    suiteApi
      .fetchPublicServices()
      .then((res) => {
        if (!active) return;
        if (Array.isArray(res.categories) && res.categories.length > 0) {
          setCategories(res.categories);
        }
        setServices((res.services || []).filter((s) => s.active && Boolean(s.slug)));
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const servicesByCategory = useMemo(() => {
    const map = new Map<string, SuiteServiceItem[]>();
    for (const cat of categories) {
      map.set(cat, []);
    }
    for (const svc of services) {
      const list = map.get(svc.category) || [];
      list.push(svc);
      map.set(svc.category, list);
    }
    return Array.from(map.entries()).filter(([, list]) => list.length > 0);
  }, [categories, services]);

  return (
    <div>
      <section className="surface-silver-gradient text-[#1D1D1F] pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
            AKYIN Ventures · Website Directory &amp; Sitemap
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-[-0.025em] leading-[1.08] text-balance max-w-4xl">
            Complete Site Map &amp; Business Directory.
          </h1>
          <p className="text-base sm:text-lg text-[#6E6E73] max-w-3xl leading-relaxed">
            A structured overview of all AKYIN Ventures corporate pages, dedicated vertical destinations, key content sections, and verified external platforms.
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-2 text-xs font-medium text-[#6E6E73]">
            <span className="font-mono-num font-bold text-[#1D1D1F]">11 Corporate Pages</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-num font-bold text-[#1D1D1F]">
              {VENTURES_PORTFOLIO.length} Operating Verticals
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-num font-bold text-[#1D1D1F]">
              6 External Storefronts &amp; Platforms
            </span>
          </div>
        </div>
      </section>

      {/* Section 1: Corporate Parent Group Pages */}
      <section className="py-20 bg-[#F5F5F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <EditorialReveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                  <Compass className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
                  <span>Parent Portal Routes</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F]">
                  Corporate Group Pages.
                </h2>
              </div>
              <p className="text-sm text-[#6E6E73] max-w-md">
                Core informational routes across akyin.com introducing the parent business group, leadership orientation, and central enquiry desk.
              </p>
            </div>
          </EditorialReveal>

          <EditorialReveal delay={0.05}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CORPORATE_ROUTES.map((item) => (
                <article
                  key={item.route}
                  className="liquid-glass-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-3">
                    <p className="font-mono-num text-xs font-bold text-[#1D1D1F]">
                      {item.route}
                    </p>
                    <h3 className="font-display text-xl font-bold text-[#1D1D1F] text-balance">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#6E6E73] leading-relaxed">
                      {item.description}
                    </p>
                    <div className="pt-3 border-t border-[#1D1D1F]/8 space-y-1.5">
                      <p className="text-[11px] font-semibold tracking-wide text-[#6E6E73]">
                        Key Sections
                      </p>
                      <ul className="space-y-1 text-xs text-[#1D1D1F]/85">
                        {item.sections.map((section) => (
                          <li key={section} className="flex items-start gap-2">
                            <span className="text-[#1D1D1F] font-bold" aria-hidden="true">
                              ·
                            </span>
                            <span>{section}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#1D1D1F]/8">
                    <button
                      type="button"
                      onClick={() => onNavigate(item.route)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D1D1F] hover:underline transition-colors cursor-pointer"
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

      {/* Section 2: Seven Operating Verticals & Detailed Sections */}
      <section className="py-20 bg-[#FFFFFF] border-t border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <EditorialReveal>
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                <Layers className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
                <span>Operating Divisions</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F]">
                Vertical Landing Pages &amp; Section Index.
              </h2>
              <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed">
                Dedicated landing routes for each of the seven AKYIN Ventures operating businesses, detailing every section available on each page.
              </p>
            </div>
          </EditorialReveal>

          <EditorialReveal delay={0.05}>
            <div className="divide-y divide-[#E8E8ED] border border-[#E8E8ED] rounded-3xl bg-[#F5F5F7]/50 overflow-hidden">
              {VERTICAL_SECTION_INDEX.map((vertical) => (
                <article
                  key={vertical.id}
                  className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start hover:bg-[#FFFFFF] transition-colors"
                >
                  <div className="lg:col-span-5 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E6E73]">
                      <span className="font-mono-num font-bold text-[#1D1D1F]">
                        {vertical.code}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{vertical.sector}</span>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-[#1D1D1F]">
                      {vertical.name}
                    </h3>
                    <p className="font-mono-num text-xs text-[#6E6E73]">{vertical.route}</p>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <GlassButton
                        variant="primary"
                        size="sm"
                        onClick={() => onNavigate(vertical.route)}
                      >
                        <span>Visit Page</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </GlassButton>

                      {vertical.externalUrl && (
                        <a
                          href={vertical.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D1D1F] hover:text-[#6E6E73] transition-colors whitespace-nowrap"
                        >
                          {vertical.externalLabel}
                          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-7 bg-[#FFFFFF] rounded-2xl border border-[#E8E8ED] p-5 sm:p-6 space-y-3">
                    <p className="text-xs font-semibold tracking-wide text-[#6E6E73]">
                      Page Sections &amp; Content Index
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs sm:text-sm text-[#1D1D1F]/90">
                      {vertical.keySections.map((sec) => (
                        <li key={sec} className="flex items-start gap-2">
                          <span className="text-[#1D1D1F] font-bold" aria-hidden="true">
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

      {/* Section 2B: 10-Category Standalone Service Pages Directory */}
      {servicesByCategory.length > 0 && (
        <section className="py-20 bg-[#F5F5F7] border-t border-[#E8E8ED]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <EditorialReveal>
              <div className="max-w-2xl space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                  Standalone Service Marketplace · {services.length} Dedicated Routes
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F]">
                  Standalone Service Pages (/services/:slug).
                </h2>
                <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed">
                  Direct index to every individual AKYIN MARKETINGS service organised across {servicesByCategory.length} categories.
                </p>
              </div>
            </EditorialReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {servicesByCategory.map(([catName, catServices]) => (
                <div
                  key={catName}
                  className="bg-white rounded-3xl border border-[#E8E8ED] p-6 space-y-3"
                >
                  <h3 className="font-display text-lg font-bold text-[#1D1D1F]">
                    {catName}
                  </h3>
                  <ul className="space-y-1.5">
                    {catServices.map((svc) => (
                      <li key={svc.id}>
                        <a
                          href={`/services/${svc.slug}`}
                          onClick={(e) => {
                            e.preventDefault();
                            onNavigate(`/services/${svc.slug}` as AppRoute);
                          }}
                          className="inline-flex items-center justify-between w-full text-xs sm:text-sm text-[#1D1D1F] hover:text-[#0071E3] py-1 transition-colors"
                        >
                          <span>{svc.name}</span>
                          <span className="font-mono-num text-[11px] text-[#6E6E73]">
                            /services/{svc.slug}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 3: External Platforms, Direct Contact & Official Socials */}
      <section className="py-20 surface-silver-gradient border-t border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <EditorialReveal>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6 liquid-glass-panel rounded-3xl p-7 sm:p-8 space-y-5">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.06em] text-[#6E6E73]">
                  <Globe className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
                  <span>External Storefronts &amp; Independent Domains</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-[#1D1D1F]">
                  Verified External Destinations.
                </h2>
                <ul className="divide-y divide-[#1D1D1F]/8 text-sm">
                  <li className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#1D1D1F]">AICalc.in</p>
                      <p className="text-xs text-[#6E6E73]">AI &amp; Manual Calculation Web App</p>
                    </div>
                    <a
                      href={EXTERNAL_VERTICAL_URLS.aicalc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D1D1F] hover:underline whitespace-nowrap"
                    >
                      aicalc.in
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </li>
                  <li className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#1D1D1F]">Kartigo.online</p>
                      <p className="text-xs text-[#6E6E73]">B2B Stock Supply &amp; Commerce Platform</p>
                    </div>
                    <a
                      href={EXTERNAL_VERTICAL_URLS.kartigo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D1D1F] hover:underline whitespace-nowrap"
                    >
                      kartigo.online
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </li>
                  <li className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#1D1D1F]">BizNXT.online</p>
                      <p className="text-xs text-[#6E6E73]">Business Guidance &amp; Consulting Platform</p>
                    </div>
                    <a
                      href={EXTERNAL_VERTICAL_URLS.biznxt}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D1D1F] hover:underline whitespace-nowrap"
                    >
                      biznxt.online
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </li>
                  <li className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#1D1D1F]">BudgetBazaar.org</p>
                      <p className="text-xs text-[#6E6E73]">Affordable Consumer Retail Storefront</p>
                    </div>
                    <a
                      href={EXTERNAL_VERTICAL_URLS.budgetBazaar}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D1D1F] hover:underline whitespace-nowrap"
                    >
                      budgetbazaar.org
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </li>
                  <li className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#1D1D1F]">Amazon Author Store</p>
                      <p className="text-xs text-[#6E6E73]">AKYIN Publishing Titles on Amazon.com</p>
                    </div>
                    <a
                      href={PUBLISHING_LINKS.amazonAuthorStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D1D1F] hover:underline whitespace-nowrap"
                    >
                      Visit Store
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </li>
                  <li className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#1D1D1F]">Google Play Books</p>
                      <p className="text-xs text-[#6E6E73]">THE DISCIPLINE CODE by Akyin</p>
                    </div>
                    <a
                      href={PUBLISHING_LINKS.googlePlayDisciplineCode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D1D1F] hover:underline whitespace-nowrap"
                    >
                      Read Edition
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </li>
                </ul>
              </div>

              <div className="lg:col-span-6 liquid-glass-panel rounded-3xl p-7 sm:p-8 space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#6E6E73]">
                    Direct Contact &amp; Official Social Accounts
                  </p>
                  <h2 className="font-display text-2xl font-bold text-[#1D1D1F]">
                    Connect Directly With AKYIN Ventures.
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <a
                    href={`mailto:${OFFICIAL_CONTACT.email}`}
                    className="rounded-2xl liquid-glass-cta p-4 space-y-1 transition-all"
                  >
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1D1D1F]">
                      <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Corporate Email</span>
                    </div>
                    <p className="text-sm font-bold text-[#1D1D1F]">{OFFICIAL_CONTACT.email}</p>
                  </a>

                  <a
                    href={OFFICIAL_CONTACT.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl liquid-glass-cta p-4 space-y-1 transition-all"
                  >
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1D1D1F]">
                      <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>WhatsApp Connect</span>
                    </div>
                    <p className="text-sm font-bold text-[#1D1D1F]">
                      Official AKYIN Channel
                    </p>
                  </a>
                </div>

                <div className="space-y-3 pt-2 border-t border-[#1D1D1F]/8">
                  <p className="text-xs font-semibold text-[#6E6E73]">
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
