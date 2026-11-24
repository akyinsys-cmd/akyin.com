export interface DownloadablePdfDocument {
  id: 'all-businesses' | 'automotive-marketing';
  categoryBadge: string;
  categoryType: 'all-businesses' | 'automotive';
  displayTitle: string;
  description: string;
  pageCount: number;
  pageCountLabel: string;
  filename: string;
  downloadPath: string;
  buttonText: string;
  seoTitle: string;
  seoDescription: string;
  highlights: string[];
  themeColor: {
    accent: string;
    pillBg: string;
    border: string;
  };
}

export const DOWNLOADABLE_PDF_DOCUMENTS: DownloadablePdfDocument[] = [
  {
    id: 'all-businesses',
    categoryBadge: 'General Business Portfolio',
    categoryType: 'all-businesses',
    displayTitle: 'Business Services & Digital Solutions',
    description:
      "Explore AKYIN's complete business support portfolio, including branding, logo design, graphic design, PowerPoint presentations, Excel dashboards, social media management, digital marketing, website development and monthly business support packages.",
    pageCount: 23,
    pageCountLabel: '23 pages',
    filename: 'AKYIN_All_Businesses_Presentation_Updated.pdf',
    downloadPath: '/downloads/AKYIN_All_Businesses_Presentation_Updated.pdf',
    buttonText: 'Download Business Services PDF',
    seoTitle: 'AKYIN Business Services and Digital Solutions – Service Portfolio & Pricing',
    seoDescription:
      "Explore AKYIN's complete business support portfolio, including branding, logo design, graphic design, PowerPoint presentations, Excel dashboards, social media management, digital marketing, website development and monthly business support packages.",
    highlights: [
      'Branding & Logo Design',
      'PowerPoint Presentations',
      'Excel Dashboards',
      'Social Media Management',
      'Digital Marketing & Meta Ads',
      'Website Development',
      'Monthly Retainer Packages',
    ],
    themeColor: {
      accent: 'text-[#0071E3]',
      pillBg: 'bg-[#0071E3]/10 text-[#0071E3] border-[#0071E3]/20',
      border: 'hover:border-[#0071E3]/40',
    },
  },
  {
    id: 'automotive-marketing',
    categoryBadge: 'Specialist Automotive Sector',
    categoryType: 'automotive',
    displayTitle: 'Automotive Marketing & Dealership Growth',
    description:
      "Explore AKYIN's automotive-specific marketing solutions, dealership lead generation, lead filtering, social media marketing, vehicle promotions, creative services, dealership presentations, sales training and monthly marketing packages.",
    pageCount: 22,
    pageCountLabel: '22 pages',
    filename: 'AKYIN_Automotive_Marketing_Presentation_Updated.pdf',
    downloadPath: '/downloads/AKYIN_Automotive_Marketing_Presentation_Updated.pdf',
    buttonText: 'Download Automotive Marketing PDF',
    seoTitle: 'AKYIN Automotive Marketing – Dealership Growth & Marketing Services',
    seoDescription:
      "Explore AKYIN's automotive-specific marketing solutions, dealership lead generation, lead filtering, social media marketing, vehicle promotions, creative services, dealership presentations, sales training and monthly marketing packages.",
    highlights: [
      'Dealership Lead Generation',
      'Lead Filtering & Qualification',
      'Social Media & Video Walkarounds',
      'Vehicle Promotions & EMI Creatives',
      'Dealership Presentations',
      'Sales Team Training & Coaching',
      'Monthly Dealership Packages',
    ],
    themeColor: {
      accent: 'text-[#34C759]',
      pillBg: 'bg-[#34C759]/10 text-[#1B7931] border-[#34C759]/25',
      border: 'hover:border-[#34C759]/40',
    },
  },
];
