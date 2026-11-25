import React from 'react';

export interface ServiceSearchItem {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  slug: string;
  keywords?: string[];
  oneTimePrice?: number;
  monthlyPrice?: number;
  packagePrice?: number;
  setupFee?: number;
  recurringFee?: number;
}

/**
 * Default standalone services catalog covering all 10 categories.
 * Provides instant synchronous search before API response resolves.
 */
export const DEFAULT_SERVICE_SEARCH_ITEMS: ServiceSearchItem[] = [
  // 1. Automotive Marketing
  {
    id: 'srv-automotive',
    slug: 'automotive-marketing',
    name: 'Automotive Dealership Marketing & Sales Strategy',
    category: 'Automotive Marketing',
    description:
      'Specialized showroom marketing, dealer campaign management, automotive sales consulting, and dealership growth strategy backed by 16 years of automotive experience.',
    url: '/services/automotive-marketing',
    keywords: ['car dealership', 'showroom', 'auto sales', 'dealer growth', 'automotive consulting'],
    oneTimePrice: 50000,
  },
  {
    id: 'srv-test-drive-leads',
    slug: 'test-drive-lead-generation',
    name: 'Test-Drive Lead Generation',
    category: 'Automotive Marketing',
    description:
      'Geo-fenced dealership campaigns structured specifically to capture confirmed showroom and doorstep test-drive enquiries within your city catchment.',
    url: '/services/test-drive-lead-generation',
    keywords: ['test drive', 'car leads', 'showroom visit', 'catchment ads', 'auto bookings'],
    oneTimePrice: 15000,
  },
  {
    id: 'srv-auto-launch-exchange',
    slug: 'dealer-launch-exchange-campaigns',
    name: 'Showroom Launch & Exchange Event Campaigns',
    category: 'Automotive Marketing',
    description:
      'Focused dealership promotion for new model unveilings, weekend exchange melas, and limited-window upgrade bonus drives.',
    url: '/services/dealer-launch-exchange-campaigns',
    keywords: ['car launch', 'exchange mela', 'dealership event', 'vehicle upgrade', 'unveil'],
    oneTimePrice: 20000,
  },
  {
    id: 'srv-automotive-retention',
    slug: 'customer-follow-up-management',
    name: 'Customer Follow-Up & Retention Campaigns',
    category: 'Automotive Marketing',
    description:
      'Structured outreach for dealerships and service centers covering periodic service due reminders, catalog stock rotation, and customer follow-up.',
    url: '/services/customer-follow-up-management',
    keywords: ['service retention', 'service reminder', 'dealership crm', 'dormant buyers'],
    monthlyPrice: 16000,
  },

  // 2. Digital Marketing
  {
    id: 'srv-lead-generation',
    slug: 'lead-generation',
    name: 'Online Lead Generation Campaigns',
    category: 'Digital Marketing',
    description:
      'Dedicated digital customer acquisition focused strictly on generating fresh, high-intent inbound buyer enquiries across search and social channels.',
    url: '/services/lead-generation',
    keywords: ['lead gen', 'inbound leads', 'lead acquisition', 'customer acquisition', 'b2b leads'],
  },
  {
    id: 'srv-meta-ads',
    slug: 'meta-ads-management',
    name: 'Meta Ads Management',
    category: 'Digital Marketing',
    description:
      'Targeted Facebook & Instagram lead generation, instant lead forms, and WhatsApp click-to-chat campaigns with direct client ad billing.',
    url: '/services/meta-ads-management',
    keywords: ['facebook ads', 'instagram ads', 'meta lead gen', 'click to whatsapp', 'cpl optimization'],
    monthlyPrice: 40000,
  },
  {
    id: 'srv-google-ads',
    slug: 'google-ads-management',
    name: 'Google Ads Management',
    category: 'Digital Marketing',
    description:
      'High-intent Google Search, Performance Max, and local discovery campaigns capturing prospects actively searching for your products or services.',
    url: '/services/google-ads-management',
    keywords: ['google search ads', 'ppc', 'performance max', 'google adwords', 'search intent'],
  },
  {
    id: 'srv-seo',
    slug: 'search-engine-optimisation',
    name: 'Search Engine Optimisation & Local SEO',
    category: 'Digital Marketing',
    description:
      'On-page search optimisation, catchment keyword positioning, and Google Business Profile management for sustained organic discovery.',
    url: '/services/search-engine-optimisation',
    keywords: ['seo', 'local seo', 'google maps ranking', 'organic search', 'keyword ranking'],
    monthlyPrice: 12000,
  },
  {
    id: 'srv-website-dev',
    slug: 'landing-page-optimisation',
    name: 'Landing Page Optimisation & Conversion Websites',
    category: 'Digital Marketing',
    description:
      'Fast, mobile-first conversion landing pages and website architecture engineered to convert paid and organic visitors into structured enquiries.',
    url: '/services/landing-page-optimisation',
    keywords: ['landing page', 'cro', 'conversion rate', 'sales page', 'website redesign'],
  },
  {
    id: 'srv-digital-marketing',
    slug: 'full-service-growth-marketing',
    name: 'Full-Service Growth Marketing & Lead Management',
    category: 'Digital Marketing',
    description:
      'Standalone full-funnel digital acquisition and ongoing campaign optimisation paired with structured enquiry tracking (ad spend paid directly to Meta/Google).',
    url: '/services/full-service-growth-marketing',
    keywords: ['growth marketing', 'full funnel', 'marketing agency', 'lead tracking'],
    setupFee: 79998,
    monthlyPrice: 60000,
  },
  {
    id: 'srv-customer-acquisition',
    slug: 'digital-advertising-campaigns',
    name: 'Digital Advertising & B2B Acquisition Campaigns',
    category: 'Digital Marketing',
    description:
      'Targeted buyer acquisition sprints for commercial services, institutional B2B offers, and regional product launches.',
    url: '/services/digital-advertising-campaigns',
    keywords: ['b2b advertising', 'regional campaign', 'buyer acquisition', 'sprint'],
    monthlyPrice: 16000,
  },

  // 3. Social Media Management
  {
    id: 'srv-social-media',
    slug: 'social-media-management',
    name: 'Instagram & Facebook Management',
    category: 'Social Media Management',
    description:
      'Consistent Instagram and Facebook brand presence covering content calendar planning, post publishing, and account optimisation.',
    url: '/services/social-media-management',
    keywords: ['instagram management', 'facebook management', 'social content', 'sm marketing'],
    monthlyPrice: 16000,
  },
  {
    id: 'srv-youtube-management',
    slug: 'youtube-channel-management',
    name: 'YouTube Channel Management',
    category: 'Social Media Management',
    description:
      'End-to-end YouTube channel optimisation, video SEO titles/descriptions, playlist architecture, and consistent upload cadence.',
    url: '/services/youtube-channel-management',
    keywords: ['youtube seo', 'channel management', 'youtube growth', 'video optimization'],
  },
  {
    id: 'srv-social-content-planning',
    slug: 'social-media-content-planning',
    name: 'Content Calendar & Social Post Planning',
    category: 'Social Media Management',
    description:
      'Strategic monthly content calendar management, topic ideation, post creation briefs, and bio/account optimisation.',
    url: '/services/social-media-content-planning',
    keywords: ['content calendar', 'post planning', 'editorial calendar', 'topic hooks'],
  },

  // 4. Creative and Graphic Design
  {
    id: 'srv-creative-logo',
    slug: 'logo-design',
    name: 'Logo and Branding Design',
    category: 'Creative and Graphic Design',
    description:
      'Business logo design, clean vector variations, basic brand identity guidelines, brand colour & typography suggestions, and export-ready files.',
    url: '/services/logo-design',
    keywords: ['logo design', 'branding', 'brand identity', 'vector logo', 'typography'],
    oneTimePrice: 6000,
    monthlyPrice: 10000,
  },
  {
    id: 'srv-creative-thumbnails',
    slug: 'youtube-thumbnail-design',
    name: 'YouTube Thumbnail & Social Creative Design',
    category: 'Creative and Graphic Design',
    description:
      'High-CTR YouTube thumbnails, Instagram promotional thumbnails, Facebook creatives, and sharp advertising graphics built for click performance.',
    url: '/services/youtube-thumbnail-design',
    keywords: ['youtube thumbnail', 'social creative', 'thumbnail design', 'high ctr graphic'],
    oneTimePrice: 3000,
    monthlyPrice: 8000,
  },
  {
    id: 'srv-branding',
    slug: 'brand-identity-stationery-design',
    name: 'Business Card, Letterhead & Brand Stationery Design',
    category: 'Creative and Graphic Design',
    description:
      'Print-ready business card design, official corporate letterhead design, and cohesive visual brand identity templates.',
    url: '/services/brand-identity-stationery-design',
    keywords: ['business card', 'letterhead', 'stationery', 'corporate identity', 'print ready'],
    oneTimePrice: 6000,
  },
  {
    id: 'srv-company-profile-brochure',
    slug: 'brochure-company-profile-design',
    name: 'Company Profile, Brochure, Flyer & Product Catalogue Design',
    category: 'Creative and Graphic Design',
    description:
      'Structured graphic layout for corporate company profiles, multi-fold brochures, promotional flyers, posters, and multi-SKU product catalogues.',
    url: '/services/brochure-company-profile-design',
    keywords: ['company profile', 'brochure design', 'flyer design', 'product catalogue', 'pdf brochure'],
  },
  {
    id: 'srv-social-post-carousel',
    slug: 'social-media-post-carousel-design',
    name: 'Social Media Post, Carousel & YouTube Channel Branding',
    category: 'Creative and Graphic Design',
    description:
      'Custom social media post design, multi-slide educational carousel posts, ad creative design, and unified YouTube channel banner branding.',
    url: '/services/social-media-post-carousel-design',
    keywords: ['carousel design', 'instagram carousel', 'channel art', 'youtube banner', 'ad creative'],
  },

  // 5. Video and Content Services
  {
    id: 'srv-creative-scriptwriting',
    slug: 'script-writing',
    name: 'Script Writing',
    category: 'Video and Content Services',
    description:
      'Strategic conversion scripts for promotional videos, vertical reels, YouTube explainers, paid advertisements, and business presentations.',
    url: '/services/script-writing',
    keywords: ['script writing', 'video script', 'reels script', 'youtube script', 'ad script'],
    oneTimePrice: 4000,
    monthlyPrice: 12000,
  },
  {
    id: 'srv-reels-video-production',
    slug: 'promotional-video-reels',
    name: 'Promotional Video & Reels Production',
    category: 'Video and Content Services',
    description:
      'High-retention vertical promotional reels, dynamic captions, product cutdowns, and multi-ratio social video edits.',
    url: '/services/promotional-video-reels',
    keywords: ['reels editing', 'promotional video', 'video editing', 'vertical video', 'shorts'],
    oneTimePrice: 20000,
  },
  {
    id: 'srv-content-copywriting',
    slug: 'content-copywriting',
    name: 'Content Copywriting & Video Creative Coordination',
    category: 'Video and Content Services',
    description:
      'Persuasive commercial copywriting for web pages, brochures, email campaigns, plus end-to-end creator and video shoot coordination.',
    url: '/services/content-copywriting',
    keywords: ['copywriting', 'website copy', 'commercial writing', 'video coordination'],
  },

  // 6. Business Documents and Presentations
  {
    id: 'srv-creative-ppt',
    slug: 'presentation-design',
    name: 'PowerPoint Presentation & Pitch Deck Design',
    category: 'Business Documents and Presentations',
    description:
      'Basic PPT, Professional PPT, Investor pitch decks, Company profile PPTs, and Sales presentations structured with crisp executive hierarchy.',
    url: '/services/presentation-design',
    keywords: ['powerpoint', 'pitch deck', 'presentation design', 'investor deck', 'ppt slides'],
    oneTimePrice: 6000,
    monthlyPrice: 14000,
  },
  {
    id: 'srv-business-reports-docs',
    slug: 'business-reports-formatting',
    name: 'Business Reports, Word & PDF Formatting',
    category: 'Business Documents and Presentations',
    description:
      'Clean formatting and layout engineering for corporate business reports, Word documents (.docx), executive dossiers, and interactive PDFs.',
    url: '/services/business-reports-formatting',
    keywords: ['report formatting', 'word document', 'pdf cleanup', 'business dossier'],
  },
  {
    id: 'srv-quotation-invoice-templates',
    slug: 'quotation-invoice-templates',
    name: 'Quotation & Invoice Templates',
    category: 'Business Documents and Presentations',
    description:
      'Custom-branded commercial quotation and GST/UAE tax invoice templates built cleanly in Excel, Word, or fillable PDF.',
    url: '/services/quotation-invoice-templates',
    keywords: ['quotation template', 'invoice template', 'tax invoice', 'gst billing template'],
  },
  {
    id: 'srv-resume-ats-formatting',
    slug: 'ats-resume-formatting',
    name: 'Resume & ATS Resume Formatting',
    category: 'Business Documents and Presentations',
    description:
      'Clean, recruiter-readable executive resumes and Applicant Tracking System (ATS) compliant CV formatting tailored for clarity and impact.',
    url: '/services/ats-resume-formatting',
    keywords: ['resume formatting', 'ats resume', 'executive cv', 'cv cleanup'],
  },
  {
    id: 'srv-creative-support',
    slug: 'business-documentation-support',
    name: 'Additional Business Documentation Support',
    category: 'Business Documents and Presentations',
    description:
      'Flexible operational assistance for commercial data entry, business document formatting, basic customer enquiry handling, and custom documentation.',
    url: '/services/business-documentation-support',
    keywords: ['data entry', 'document formatting', 'office support', 'business assistance'],
    oneTimePrice: 4000,
    monthlyPrice: 8000,
  },

  // 7. Excel and Reporting Services
  {
    id: 'srv-creative-excel',
    slug: 'excel-reporting',
    name: 'Excel Workbooks, Dashboards & Automation',
    category: 'Excel and Reporting Services',
    description:
      'Basic & Professional Excel workbooks, executive Excel dashboards, automated calculation formulas, sales trackers, and inventory sheets.',
    url: '/services/excel-reporting',
    keywords: ['excel dashboards', 'spreadsheet automation', 'excel reporting', 'formulas', 'kpi tracker'],
    oneTimePrice: 5000,
    monthlyPrice: 10000,
  },
  {
    id: 'srv-data-cleaning',
    slug: 'data-cleaning-structuring',
    name: 'Data Cleaning & Spreadsheet Structuring',
    category: 'Excel and Reporting Services',
    description:
      'Thorough deduplication, phone/email standardization, scattered tab consolidation, and structured spreadsheet hygiene.',
    url: '/services/data-cleaning-structuring',
    keywords: ['data cleaning', 'spreadsheet structuring', 'deduplication', 'csv cleaning'],
  },
  {
    id: 'srv-monthly-performance-reporting',
    slug: 'monthly-performance-reporting',
    name: 'Monthly Performance & MIS Reporting',
    category: 'Excel and Reporting Services',
    description:
      'Recurring executive MIS & commercial performance reporting consolidating lead flow, campaign spend, conversion ratios, and unit margins.',
    url: '/services/monthly-performance-reporting',
    keywords: ['mis report', 'performance reporting', 'monthly scorecard', 'lead to sale roi'],
  },

  // 8. Messaging and Communication
  {
    id: 'srv-bulk-sms',
    slug: 'bulk-sms',
    name: 'Bulk SMS Marketing',
    category: 'Messaging and Communication',
    description:
      'Promotional & transactional bulk SMS campaigns (₹3,000 for 10,000 SMS credits; ₹0.30 effective rate; additional credits calculated using admin-configured rate).',
    url: '/services/bulk-sms',
    keywords: ['bulk sms', 'sms marketing', 'transactional sms', 'dlt sms', 'promotional sms'],
    packagePrice: 3000,
  },
  {
    id: 'srv-whatsapp-messaging',
    slug: 'whatsapp-business-setup',
    name: 'WhatsApp Business Messaging Setup',
    category: 'Messaging and Communication',
    description:
      'Structured WhatsApp Business Messaging onboarding and workflow configuration. One-time setup fee (₹4,999) is billed strictly separate from message usage charges (₹1.50 per message).',
    url: '/services/whatsapp-business-setup',
    keywords: ['whatsapp business', 'whatsapp messaging', 'meta bsp', 'whatsapp setup', 'customer chat'],
    setupFee: 4999,
  },

  // 9. Lead Management and CRM
  {
    id: 'srv-lead-gen',
    slug: 'lead-filtering',
    name: 'Lead Filtering & Qualification',
    category: 'Lead Management and CRM',
    description:
      'Structured telephonic and AI-assisted vetting of existing inbound leads before sales floor handover so sales executives spend time exclusively with verified buyers.',
    url: '/services/lead-filtering',
    keywords: ['lead filtering', 'lead qualification', 'vetting', 'hot leads', 'tele-qualification'],
    setupFee: 29998,
    monthlyPrice: 24000,
  },
  {
    id: 'srv-crm-pipeline',
    slug: 'crm-lead-pipeline-management',
    name: 'CRM & Lead Pipeline Management',
    category: 'Lead Management and CRM',
    description:
      'Disciplined enquiry tracking, duplicate cleanup, stage updates, and daily Excel / pipeline summaries operated internally by AKYIN.',
    url: '/services/crm-lead-pipeline-management',
    keywords: ['crm pipeline', 'lead tracking', 'pipeline hygiene', 'callback routing'],
    monthlyPrice: 10000,
  },
  {
    id: 'srv-ai-outbound-workflows',
    slug: 'ai-outbound-calling-workflows',
    name: 'AI-Assisted Outbound Calling & Inquiry Follow-Up Workflows',
    category: 'Lead Management and CRM',
    description:
      'Agency-operated AI-assisted outbound enquiry calling scripts and multi-attempt callback workflows designed to keep response times under minutes.',
    url: '/services/ai-outbound-calling-workflows',
    keywords: ['ai outbound', 'calling workflow', 'inquiry follow up', 'instant callback'],
  },

  // 10. Business Consulting and Training
  {
    id: 'srv-consulting',
    slug: 'business-advisory-session',
    name: '1-on-1 Business Advisory Session (30 min IST)',
    category: 'Business Consulting and Training',
    description:
      'Private commercial strategy, feasibility, and unit-economics diagnostic session directly with AKYIN Ventures on India Standard Time (₹3,998).',
    url: '/services/business-advisory-session',
    keywords: ['business advisory', 'consultation', 'unit economics', 'founder direction', 'commercial strategy'],
    oneTimePrice: 3998,
  },
  {
    id: 'srv-sales-strategy',
    slug: 'commercial-dealership-sales-training',
    name: 'Commercial & Dealership Sales Training Workshop',
    category: 'Business Consulting and Training',
    description:
      'Practical frontline sales and showroom coaching backed by 16 years of high-trust commercial experience from Maruti Suzuki to Audi (₹50,000/session).',
    url: '/services/commercial-dealership-sales-training',
    keywords: ['sales training', 'showroom coaching', 'dealership training', 'objection handling', 'sales workshop'],
    oneTimePrice: 50000,
  },
  {
    id: 'srv-personality-development',
    slug: 'personality-development-workshop',
    name: 'Personality Development & Executive Etiquette Workshop',
    category: 'Business Consulting and Training',
    description:
      'Dedicated grooming, verbal clarity, consultative body language, and executive presence training tailored for customer-facing sales and advisory teams.',
    url: '/services/personality-development-workshop',
    keywords: ['personality development', 'executive etiquette', 'grooming', 'communication training'],
    oneTimePrice: 50000,
  },
  {
    id: 'srv-custom-solutions',
    slug: 'custom-international-business-solutions',
    name: 'Custom International Business Solutions (India / UAE)',
    category: 'Business Consulting and Training',
    description:
      'Bespoke multi-market operations, commercial feasibility, cross-border India–UAE go-to-market planning, and custom advisory retainers.',
    url: '/services/custom-international-business-solutions',
    keywords: ['cross border', 'uae expansion', 'india uae business', 'custom advisory', 'bespoke solutions'],
  },
];

/**
 * Lightweight client-side search indexing function that maps service names,
 * descriptions, and categories to their respective URLs, allowing instant
 * navigation and filtering.
 */
export function generateServiceSearchIndex(
  services?: Array<{
    id?: string;
    slug?: string;
    name?: string;
    category?: string;
    description?: string;
    oneTimePrice?: number;
    monthlyPrice?: number;
    packagePrice?: number;
    setupFee?: number;
    recurringFee?: number;
  }> | null
): ServiceSearchItem[] {
  if (!services || services.length === 0) {
    return DEFAULT_SERVICE_SEARCH_ITEMS;
  }

  return services.map((s) => {
    const slug = (s.slug || s.name || 'service')
      .toLowerCase()
      .trim()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const url = `/services/${encodeURIComponent(slug)}`;

    return {
      id: s.id || `srv-${slug}`,
      slug,
      name: s.name || 'Standalone Service',
      category: s.category || 'General',
      description: s.description || '',
      url,
      oneTimePrice: s.oneTimePrice,
      monthlyPrice: s.monthlyPrice,
      packagePrice: s.packagePrice,
      setupFee: s.setupFee,
      recurringFee: s.recurringFee,
    };
  });
}

/**
 * Safe text highlight component that wraps matching query segments
 * in a highlighted <span> element with bolding/background styling without raw HTML injection.
 */
export function HighlightText({
  text,
  query,
  className = '',
  highlightClassName = 'bg-amber-200/75 text-[#1D1D1F] font-bold rounded-xs px-0.5 transition-colors',
}: {
  text: string;
  query: string;
  className?: string;
  highlightClassName?: string;
}): React.ReactElement {
  const trimmed = query.trim();
  if (!trimmed || !text) {
    return <span className={className}>{text}</span>;
  }

  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.toLowerCase() === trimmed.toLowerCase() ? (
          <span key={index} className={highlightClassName}>
            {part}
          </span>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        )
      )}
    </span>
  );
}
