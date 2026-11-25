export interface PresentationSlideMeta {
  slide: number;
  title: string;
  subtitle: string;
}

export interface PresentationDeckConfig {
  id: 'all-businesses' | 'automotive';
  label: string;
  badge: string;
  title: string;
  description: string;
  pdfUrl: string;
  downloadFilename: string;
  slides: PresentationSlideMeta[];
}

export const ALL_BUSINESSES_DECK: PresentationDeckConfig = {
  id: 'all-businesses',
  label: 'All Businesses & Digital Solutions',
  badge: '19 Slides · General B2B & B2C',
  title: 'AKYIN Marketing — Business Growth & Digital Solutions',
  description:
    'Complete 16-service marketing, digital solutions, and sales support deck for retail, e-commerce, professional services, education, manufacturing, B2B, and growing brands.',
  pdfUrl: '/assets/aistudio/All_Businesses_Presentation_72c79302.pdf',
  downloadFilename: 'AKYIN_Marketing_All_Businesses_Presentation.pdf',
  slides: [
    {
      slide: 1,
      title: 'AKYIN Marketing — Business Growth & Digital Solutions',
      subtitle: 'Build visibility. Attract customers. Grow your business.',
    },
    {
      slide: 2,
      title: 'Agency Overview: Who We Are',
      subtitle: 'A growth partner for every business — reach, enquiries, digital presence & team support.',
    },
    {
      slide: 3,
      title: 'Industries We Support: Built for Different Business Types',
      subtitle: 'Flexible support across Retail, Professional Services, Education, Manufacturing, Hospitality & Startups.',
    },
    {
      slide: 4,
      title: 'Our Approach: Connected Support. Clear Outcomes.',
      subtitle: 'Four-step methodology: 01 Understand, 02 Plan, 03 Deliver, 04 Improve.',
    },
    {
      slide: 5,
      title: 'Modular Service Portfolio: 16 Services. One Growth Partner.',
      subtitle: 'Choose individual services or combine them into an agreed growth plan.',
    },
    {
      slide: 6,
      title: 'Service 01: Lead Generation',
      subtitle: 'Paid campaigns, enquiry forms, WhatsApp enquiries & focused landing pages.',
    },
    {
      slide: 7,
      title: 'Service 02: Lead Filtering & Qualification',
      subtitle: 'Organise existing databases, check requirements, classify priority leads & clean duplicates.',
    },
    {
      slide: 8,
      title: 'Services 03 & 04: Influencer & Social Media Marketing',
      subtitle: 'Creator partnerships, campaign planning, social page support & monthly content calendars.',
    },
    {
      slide: 9,
      title: 'Services 05 & 06: Video, Content & Graphic Design',
      subtitle: 'Product explainers, brand stories, campaign artwork & ready-to-use business collateral.',
    },
    {
      slide: 10,
      title: 'Service 07: Business Presentations & Sales Collateral',
      subtitle: 'Company profiles, service presentations, product decks & proposal decks.',
    },
    {
      slide: 11,
      title: 'Service 08: Product Launches & Business Events',
      subtitle: 'Pre-event promotion, launch communication, event coverage & post-event follow-up.',
    },
    {
      slide: 12,
      title: 'Service 09: Demo, Consultation & Appointment Campaigns',
      subtitle: 'Structured booking forms, appointment reminders & outcome tracking workflows.',
    },
    {
      slide: 13,
      title: 'Service 10: Seasonal & Promotional Campaigns',
      subtitle: 'Coordinated festive, seasonal demand & special-offer creative promotions.',
    },
    {
      slide: 14,
      title: 'Service 11: Local Marketing & Google Business Profile',
      subtitle: 'Profile optimisation, business accuracy, local content & ethical review workflows.',
    },
    {
      slide: 15,
      title: 'Service 12: Customer Retention & Referral Campaigns',
      subtitle: 'Customer updates, repeat-purchase nudges, referral triggers & experience feedback.',
    },
    {
      slide: 16,
      title: 'Service 13: Product Catalogue & E-commerce Promotion',
      subtitle: 'Structured digital catalogues, storefront content upgrades & product traffic campaigns.',
    },
    {
      slide: 17,
      title: 'Service 14: Corporate, B2B & Partnership Marketing',
      subtitle: 'Target audience research, B2B outreach campaigns, meeting decks & partnership support.',
    },
    {
      slide: 18,
      title: 'Services 15 & 16: Websites, Apps, Analytics & Team Development',
      subtitle: 'Custom websites, lead forms, workflow automation & customer-facing team coaching.',
    },
    {
      slide: 19,
      title: 'Partner With AKYIN: Let’s Grow Your Business',
      subtitle: 'Clear scope, agreed deliverables & measurable work — connect@akyin.com · WhatsApp Connect.',
    },
  ],
};

export const AUTOMOTIVE_DECK: PresentationDeckConfig = {
  id: 'automotive',
  label: 'Automotive Dealership Growth',
  badge: '19 Slides · Dealership Specialists',
  title: 'AKYIN Marketing — Automotive Marketing & Dealership Growth',
  description:
    'Official 19-slide dealership marketing deck covering 16 automotive services from geo-fenced lead generation and database filtering to custom lead apps and showroom sales training.',
  pdfUrl: '/assets/aistudio/Automotive_Presentation_4a4e967e.pdf',
  downloadFilename: 'AKYIN_Automotive_Marketing_Presentation.pdf',
  slides: [
    {
      slide: 1,
      title: 'AKYIN Marketing — Automotive Marketing & Dealership Growth',
      subtitle: 'Get seen. Get more enquiries. Support more sales. A marketing and growth partner for car dealerships.',
    },
    {
      slide: 2,
      title: 'Agency Overview: Who We Are',
      subtitle: 'Reach local buyers, get model enquiries, improve lead quality, promote offers & build online presence.',
    },
    {
      slide: 3,
      title: 'Industry Experience: Real Showroom Experience',
      subtitle: '16 years of experience with vehicle brands, mass-market to luxury buyers & showroom teams.',
    },
    {
      slide: 4,
      title: 'Why AKYIN: Marketing That Supports Sales',
      subtitle: 'Connecting online enquiries directly with showroom teams and sales training.',
    },
    {
      slide: 5,
      title: 'Our Services: 16 Services. One Partner.',
      subtitle: 'Full numbered automotive catalogue aligned in exact slide sequence.',
    },
    {
      slide: 6,
      title: 'Service 01: Lead Generation (New Enquiries)',
      subtitle: 'Facebook & Instagram ads, WhatsApp ads, model landing pages, offer campaigns & retargeting.',
    },
    {
      slide: 7,
      title: 'Service 02: Lead Filtering (Existing Leads)',
      subtitle: 'Works separately on leads you already have — checks buyer needs, cleans duplicates & delivers priority sheets.',
    },
    {
      slide: 8,
      title: 'Service 03: Influencer Marketing',
      subtitle: 'Show your cars through local creators via Instagram Reels, YouTube reviews & dealership visits.',
    },
    {
      slide: 9,
      title: 'Service 04: Social Media Marketing',
      subtitle: 'Keep your dealership active with page management, model posts, customer stories & monthly reports.',
    },
    {
      slide: 10,
      title: 'Service 05: Automotive Video Production',
      subtitle: 'Car walkarounds, feature videos, test-drive clips, delivery celebrations & showroom reels.',
    },
    {
      slide: 11,
      title: 'Service 05B: Graphic Design & Creative Studio',
      subtitle: 'Car artwork, EMI/offer designs, festive posters, digital brochures & showroom display banners.',
    },
    {
      slide: 12,
      title: 'Sales Support Material: Vehicle Presentations',
      subtitle: 'Model presentations, variant comparisons, launch decks & finance/fleet customer decks.',
    },
    {
      slide: 13,
      title: 'Services 06 & 07: Launch & Test-Drive Campaigns',
      subtitle: 'Before-launch teasers, launch-day coverage, WhatsApp test-drive bookings & slot reminders.',
    },
    {
      slide: 14,
      title: 'Services 08 & 09: Events & Exchange Campaigns',
      subtitle: 'Showroom events, local roadshows, used-car exchange valuations, festive drives & Google Business Profile.',
    },
    {
      slide: 15,
      title: 'Services 10, 11 & 12: Pre-Owned, Retention & Fleet',
      subtitle: 'Pre-owned vehicle listings, customer service reminders, corporate buyers & bulk fleet enquiries.',
    },
    {
      slide: 16,
      title: 'Services 13 & 14: Reporting & How We Work',
      subtitle: 'Model landing pages, ad spend & CPL tracking, buyer insights & the 7-Step Delivery Plan.',
    },
    {
      slide: 17,
      title: 'Service 15: Lead Apps & Sales Tracking',
      subtitle: 'Unified lead list, instant assignment, follow-up alerts, sales scorecards & manager dashboard.',
    },
    {
      slide: 18,
      title: 'Service 16: Sales Team Training',
      subtitle: 'Grooming, first impressions, buyer discovery, objection handling, walkarounds & closing.',
    },
    {
      slide: 19,
      title: 'Work With AKYIN: Let’s Grow Your Dealership',
      subtitle: 'Shaikh Nazir · connect@akyin.com · WhatsApp Connect · Transparent working terms.',
    },
  ],
};
