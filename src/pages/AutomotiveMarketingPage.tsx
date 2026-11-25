import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  FileText,
  Sparkles,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { AgencyValueCalculator } from '../components/AgencyValueCalculator';
import { AutomotiveBenchmarkAnalysis } from '../components/AutomotiveBenchmarkAnalysis';
import { AutomotiveDealershipDossier } from '../components/AutomotiveDealershipDossier';
import { AutomotiveGrowthNewsletter } from '../components/AutomotiveGrowthNewsletter';
import { AutomotiveIndustryNews } from '../components/AutomotiveIndustryNews';
import { AutomotiveLeadFunnel } from '../components/AutomotiveLeadFunnel';
import { AutomotiveMarketMomentum } from '../components/AutomotiveMarketMomentum';
import { AutomotiveQuickQuoteFab } from '../components/AutomotiveQuickQuoteFab';
import { AutomotiveRoiCalculator } from '../components/AutomotiveRoiCalculator';
import {
  AutomotiveResultsSection,
  VehicleSegmentKey,
} from '../components/AutomotiveResultsSection';
import { AutomotiveSuccessStories } from '../components/AutomotiveSuccessStories';
import { ClientSuccessCarousel } from '../components/ClientSuccessCarousel';
import { ContactDispatcher } from '../components/ContactDispatcher';
import { DealershipGrowthCalculator } from '../components/DealershipGrowthCalculator';
import { LeadImpactTracker } from '../components/LeadImpactTracker';
import { PerformanceGrowthRoadmap } from '../components/PerformanceGrowthRoadmap';
import {
  GlassButton,
  GlassCard,
  GlassImageFrame,
  GlassPanel,
} from '../components/liquid-glass';
import { PresentationDeckViewer } from '../components/PresentationDeckViewer';
import { ResilientImage } from '../components/ResilientImage';
import { VerifiedAutomotiveBadge } from '../components/VerifiedAutomotiveBadge';
import { VideoSuccessStories } from '../components/VideoSuccessStories';
import { AppRoute, IMAGES } from '../data/akyinData';
import { ALL_BUSINESSES_DECK, AUTOMOTIVE_DECK } from '../data/presentationDecks';

interface AutomotiveMarketingPageProps {
  onNavigate: (route: AppRoute) => void;
}

const AUTOMOTIVE_SERVICES = [
  {
    number: '01',
    title: 'Lead Generation',
    category: 'Demand Generation',
    summary:
      'High-intent digital advertising campaigns across Meta (Facebook & Instagram), Google Search, and YouTube targeted at car buyers actively searching for new models, test drives, and dealership offers.',
    deliverables: [
      'Targeted geo-fenced Meta & Google ad campaigns',
      'High-conversion dynamic lead capture forms',
      'Real-time inquiry capture & instant routing',
      'Monthly cost-per-lead (CPL) optimisation',
    ],
  },
  {
    number: '02',
    title: 'Lead Filtering & Qualification',
    category: 'Pipeline Management',
    summary:
      'Advanced multi-tier lead vetting ensuring your sales executives spend time exclusively on high-intent buyers ready for test drives and showroom visits rather than unqualified window shoppers.',
    deliverables: [
      'Instant AI & human telephonic qualification screening',
      'Budget, timeline & model preference verification',
      'Hot, warm & cold pipeline categorization',
      'Direct CRM push & sales team instant alerts',
    ],
  },
  {
    number: '03',
    title: 'Influencer Marketing',
    category: 'Brand Advocacy',
    summary:
      'Collaborations with trusted automotive reviewers, lifestyle creators, and local opinion leaders to showcase vehicle deliveries, test drive experiences, and dealership launches to engaged audiences.',
    deliverables: [
      'Automotive creator shortlisting & vetting',
      'Reels, Shorts & dedicated car review videos',
      'Dealership event creator invitations',
      'Trackable referral links & promo codes',
    ],
  },
  {
    number: '04',
    title: 'Social Media Marketing',
    category: 'Brand Presence',
    summary:
      'Consistent, premium day-to-day management of dealership social media profiles with high-aesthetic car showcase reels, customer delivery spotlights, and engaging interactive polls.',
    deliverables: [
      'Monthly content calendar & graphic design',
      'High-performing Reels & walkthrough videos',
      'Community management & prompt comment replies',
      'Engagement growth & follower analytics',
    ],
  },
  {
    number: '05',
    title: 'Video & Creative Production',
    category: 'Creative Assets',
    summary:
      'Cinematic showroom walkthroughs, exterior/interior feature highlights, customer delivery celebration videos, and high-retention ad creatives produced to professional broadcast standards.',
    deliverables: [
      '4K cinematic vehicle feature showcases',
      'Customer key handover celebration clips',
      'Professional voiceovers, color grading & subtitling',
      'Optimised formats for Reels, Shorts & YouTube ads',
    ],
  },
  {
    number: '06',
    title: 'Product Launch & Event Management',
    category: 'On-Ground Events',
    summary:
      'End-to-end digital and on-ground promotional support for new car launches, model unveilings, and exclusive VIP customer preview evenings at the showroom.',
    deliverables: [
      'Digital teaser campaigns & countdowns',
      'VIP customer RSVP registration landing pages',
      'On-ground event media coverage & live stories',
      'Post-launch follow-up sequences for attendees',
    ],
  },
  {
    number: '07',
    title: 'Test Drive Campaigns',
    category: 'Showroom Footfall',
    summary:
      'Dedicated conversion campaigns specifically structured to drive maximum booking requests for home test drives and showroom test drive slots.',
    deliverables: [
      'Frictionless "Book a Test Drive" ad creatives',
      'Automated SMS/WhatsApp slot confirmation reminders',
      'Showroom appointment tracking dashboard',
      'Test-drive-to-booking conversion rate tracking',
    ],
  },
  {
    number: '08',
    title: 'Exchange & Festive Campaigns',
    category: 'Seasonal Boost',
    summary:
      'High-impact promotional blitzes designed around festive seasons (Diwali, New Year, Dussehra, Onam) and old-car exchange valuation carnivals to spike showroom rush.',
    deliverables: [
      'Festive themed ad campaigns & landing pages',
      'Instant used-car valuation calculator widgets',
      'Limited-period festive offer promotions',
      'High-urgency retargeting ad sequences',
    ],
  },
  {
    number: '09',
    title: 'Google Business & Local Marketing',
    category: 'Local Discovery',
    summary:
      'Complete optimization of your dealership Google Business Profile to ensure top rankings in local map packs when buyers search for "car showroom near me" or service centres.',
    deliverables: [
      'Google Business Profile complete audit & optimization',
      'Review generation campaigns & rating management',
      'Local service area keyword domination',
      'Showroom location pin accuracy & photo updates',
    ],
  },
  {
    number: '10',
    title: 'Customer Retention Campaigns',
    category: 'After-Sales Growth',
    summary:
      'Lifecycle marketing programs for periodic service reminders, insurance renewals, accessories upsell, and upgrade campaigns for existing vehicle owners.',
    deliverables: [
      'Automated service due WhatsApp & SMS sequences',
      'Annual maintenance contract (AMC) promotions',
      'Insurance renewal reminder workflows',
      'Upgrade offers for customers completing 3-5 years',
    ],
  },
  {
    number: '11',
    title: 'Pre-Owned Vehicle Marketing',
    category: 'Used Car Division',
    summary:
      'Dedicated marketing funnels to buy and sell certified pre-owned vehicles, highlighting multi-point quality checks, warranty assurances, and easy financing.',
    deliverables: [
      'Pre-owned stock showcase landing pages',
      'Targeted ads for used SUV and sedan buyers',
      'Instant sell-your-car valuation lead funnels',
      'Trust & warranty assurance messaging',
    ],
  },
  {
    number: '12',
    title: 'Corporate & Fleet Marketing',
    category: 'B2B Sales',
    summary:
      'Targeted outreach programs connecting with local businesses, corporate HR departments, taxi fleet operators, and government institutions for bulk vehicle acquisitions.',
    deliverables: [
      'LinkedIn & corporate email outreach campaigns',
      'B2B corporate fleet proposal brochures',
      'Special commercial discount structuring support',
      'Dedicated institutional sales lead funnels',
    ],
  },
  {
    number: '13',
    title: 'Website & Landing Page Marketing',
    category: 'Digital Infrastructure',
    summary:
      'High-speed, mobile-optimised landing pages designed specifically for automotive models, featuring instant finance calculators, color customizers, and test drive booking forms.',
    deliverables: [
      'Lightning-fast responsive landing pages',
      'Interactive EMI & loan eligibility calculators',
      'Seamless WhatsApp click-to-chat integration',
      'Advanced conversion rate optimisation (CRO)',
    ],
  },
  {
    number: '14',
    title: 'Reporting & Marketing Analytics',
    category: 'Performance Transparency',
    summary:
      'Real-time executive dashboards tracking every rupee spent, cost per lead, lead quality breakdown, test drive conversions, and ultimate vehicle delivery attribution.',
    deliverables: [
      'Live 24/7 executive performance dashboard',
      'Weekly ROI & lead quality deep-dive reports',
      'Attribution modelling across Meta and Google',
      'Monthly strategic growth review meetings',
    ],
  },
  {
    number: '15',
    title: 'Custom App Development (Leads & Targets)',
    category: 'Proprietary Tech',
    summary:
      'Custom lightweight web applications and sales tracking portals built for dealership sales managers to monitor daily showroom targets, lead follow-ups, and executive performance.',
    deliverables: [
      'Custom lead distribution & tracking web apps',
      'Sales executive daily target management portals',
      'WhatsApp API notification integrations',
      'Secure cloud hosting & maintenance',
    ],
  },
  {
    number: '16',
    title: 'Sales Team Training & Development',
    category: 'Human Excellence',
    summary:
      'Comprehensive commercial training programs for dealership sales executives covering digital lead handling etiquette, objection handling, test drive conversion psychology, and CRM discipline.',
    deliverables: [
      'On-site & virtual sales team workshops',
      'Lead response speed & telephonic script training',
      'Showroom walk-in conversion best practices',
      'Sales manager pipeline review masterclasses',
    ],
  },
];

const STANDALONE_AUTOMOTIVE_TRACKS = [
  {
    name: 'Automotive Dealership Growth & Showroom Marketing',
    slug: '/services/automotive-marketing' as AppRoute,
    category: 'Automotive Marketing',
    description:
      'Independent showroom visibility, model-level paid demand, and dealer campaign management with direct client ad spend billing.',
    highlights: [
      'Model-wise paid search & social demand',
      'Local Google Maps showroom positioning',
      'Weekly cost-per-booking attribution',
    ],
  },
  {
    name: 'Test Drive & Exchange Lead Generation',
    slug: '/services/test-drive-lead-generation' as AppRoute,
    category: 'Automotive Marketing',
    description:
      'Dedicated conversion funnels engineered strictly to fill showroom and home test-drive calendars.',
    highlights: [
      'Home & showroom test-drive booking flows',
      'Festive & old-car exchange carnival drives',
      'Automated SMS & WhatsApp slot reminders',
    ],
  },
  {
    name: 'Lead Filtering & Floor Sales Enablement',
    slug: '/services/lead-filtering' as AppRoute,
    category: 'Lead Management & Training',
    description:
      'Separate telephonic screening and showroom executive coaching so sales consultants convert higher-intent buyers.',
    highlights: [
      'Hot, Warm & Follow-up pipeline tagging',
      'Instant showroom sales team escalation',
      'Optional standalone Floor Sales Training',
    ],
  },
];

const AUTOMOTIVE_FAQS = [
  {
    question: 'How does AKYIN filter high-intent automotive test-drive leads?',
    answer: 'Every incoming enquiry undergoes automated phone verification followed by structured AI and human telephonic screening. We confirm target vehicle model, on-road budget readiness, purchase timeline, and showroom proximity before passing only genuine test-drive buyers to your floor team.',
  },
  {
    question: 'How does AKYIN ensure leads are not spam or unqualified?',
    answer: 'We maintain strict separation between lead generation and lead qualification. Enquiries are tagged into Hot, Warm, Future Follow-up, Unreachable, or Not Interested so dealership sales executives never waste floor hours on cold clicks or duplicate form fills.',
  },
  {
    question: 'Can AKYIN integrate directly with our dealership CRM?',
    answer: 'Yes. We integrate with major dealership CRM systems and WhatsApp notification workflows, routing confirmed test-drive and booking leads to your sales executives within seconds alongside structured daily Excel pipeline sheets.',
  },
  {
    question: 'What is the exact difference between lead generation and lead filtering?',
    answer: 'Lead generation focuses on ad creative, targeting, and capturing buyer attention across Meta and Google. Lead filtering is a separate, rigorous vetting step where we verify budget, timeline, and model preference so your sales team only spends time on high-intent test-drive buyers.',
  },
  {
    question: 'Do you support festive seasons and old-car exchange carnivals?',
    answer: 'Yes! We design bespoke promotional blitzes around major festivals (Diwali, New Year, Dussehra) and run dedicated used-car exchange valuation campaigns to spike showroom footfalls during peak buying windows.',
  },
  {
    question: 'How does AKYIN train dealership sales teams?',
    answer: 'Our commercial training program covers rapid inquiry response etiquette, telephonic objection handling, test-drive conversion psychology, and CRM update discipline, transforming floor executives into high-closing automotive advisors.',
  },
  {
    question: 'How fast can campaigns be launched after onboarding?',
    answer: 'Typically, after our initial discovery audit of your dealership inventory and offers, full campaign setup, landing page creation, and ad deployment go live within 5 to 7 business days.',
  },
];

export function AutomotiveMarketingPage({ onNavigate }: AutomotiveMarketingPageProps) {
  const shouldReduceMotion = useReducedMotion();
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(150000);
  const [segmentId, setSegmentId] = useState<VehicleSegmentKey>('suv-mid');

  const scrollToEnquiry = () => {
    const el = document.getElementById('dealership-enquiry');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleEnquire = (serviceTitle: string) => {
    setEnquiryMessage(
      `Automotive Dealership Enquiry — Interested in: ${serviceTitle}. Please share a tailored proposal for our showroom.`
    );
    scrollToEnquiry();
  };

  const handleCalculatorAudit = (summary: {
    budget: number;
    segmentLabel: string;
    totalEnquiries: number;
    qualifiedLeads: number;
    testDrives: number;
    projectedBookings: number;
    scenarioLabel?: string;
  }) => {
    const formattedBudget = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(summary.budget);
    const scenarioText = summary.scenarioLabel ? ` | Mode: ${summary.scenarioLabel}` : '';
    setEnquiryMessage(
      `Dealership Growth Calculator Audit Request — Segment: ${summary.segmentLabel}${scenarioText} | Monthly Ad Budget: ${formattedBudget} | Benchmark Estimate: ~${summary.totalEnquiries} enquiries, ~${summary.qualifiedLeads} qualified leads, ~${summary.testDrives} test drives, ~${summary.projectedBookings} bookings/mo.`
    );
    scrollToEnquiry();
  };

  return (
    <div className="bg-[#F5F5F7] text-[#1D1D1F] min-h-screen">
      {/* 1. Hero Section */}
      <section className="surface-silver-gradient pt-16 pb-20 lg:pt-24 lg:pb-32 border-b border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="flex flex-wrap items-center gap-3">
              <VerifiedAutomotiveBadge />
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full frosted-glass border border-[#1D1D1F]/10 text-xs font-semibold uppercase tracking-[0.08em] text-[#1D1D1F]">
                <Sparkles className="w-3.5 h-3.5 text-[#1D1D1F]" aria-hidden="true" />
                <span>AKYIN Marketing · Dealership Growth</span>
              </div>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[60px] font-bold tracking-[-0.025em] leading-[1.05] text-[#1D1D1F] text-balance">
              Marketing That Moves Dealerships Forward.
            </h1>

            <p className="text-lg sm:text-xl text-[#6E6E73] leading-relaxed max-w-2xl">
              From customer enquiries to showroom performance, AKYIN helps automotive dealerships improve visibility, organise leads and strengthen their sales teams.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <GlassButton href="#service-catalogue" variant="primary" size="lg">
                <span>Explore Our Services</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </GlassButton>
              <GlassButton
                href="#presentation-viewer"
                variant="glass"
                size="lg"
              >
                <span>View Company Presentation</span>
                <FileText className="w-4 h-4 text-[#6E6E73]" aria-hidden="true" />
              </GlassButton>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#E8E8ED]/80">
              <div>
                <p className="font-mono-num text-2xl sm:text-3xl font-bold text-[#1D1D1F]">16</p>
                <p className="text-xs text-[#6E6E73] font-medium mt-0.5">Specialised Services</p>
              </div>
              <div>
                <p className="font-mono-num text-2xl sm:text-3xl font-bold text-[#1D1D1F]">16 Yrs</p>
                <p className="text-xs text-[#6E6E73] font-medium mt-0.5">Automotive Expertise</p>
              </div>
              <div>
                <p className="font-mono-num text-2xl sm:text-3xl font-bold text-[#1D1D1F]">19</p>
                <p className="text-xs text-[#6E6E73] font-medium mt-0.5">Presentation Slides</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <GlassImageFrame>
              <div className="aspect-[4/3] bg-[#FFFFFF] overflow-hidden relative">
                <ResilientImage
                  src={IMAGES.salesTraining}
                  alt="Automotive marketing growth illustration with premium anodized studio presentation"
                  loading="eager"
                  fallbackTitle="AKYIN Automotive Marketing"
                  className="w-full h-full bg-white"
                  imageClassName="object-cover p-2"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent flex items-end p-6">
                  <div className="frosted-glass rounded-2xl p-4 w-full backdrop-blur-md border border-white/40 text-[#1D1D1F]">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">Dealership Growth Partner</p>
                    <p className="text-sm font-bold mt-0.5">Maruti Suzuki to Audi · Multi-Brand Experience</p>
                  </div>
                </div>
              </div>
            </GlassImageFrame>
          </motion.div>
        </div>
      </section>

      {/* 2. Experience & Expertise Summary */}
      <section className="py-16 lg:py-20 bg-[#FFFFFF] border-b border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              Grounded in 16 Years of Industry Experience
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F]">
              Why Automotive Dealerships Trust AKYIN
            </h2>
            <p className="text-base text-[#6E6E73] leading-relaxed">
              We understand dealership realities—from floor walk-ins and test drive drop-offs to sales target pressures and inventory turnover.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="p-7 space-y-3" tilt={true} interactive={true}>
              <div className="w-10 h-10 rounded-xl frosted-glass flex items-center justify-center text-[#1D1D1F] font-bold">
                01
              </div>
              <h3 className="font-display text-xl font-bold">Dealership Operations</h3>
              <p className="text-sm text-[#6E6E73] leading-relaxed">
                Deep familiarity with OEM standards, showroom floor management, festive sales spikes, and used-car exchange valuations.
              </p>
            </GlassCard>

            <GlassCard className="p-7 space-y-3" tilt={true} interactive={true}>
              <div className="w-10 h-10 rounded-xl frosted-glass flex items-center justify-center text-[#1D1D1F] font-bold">
                02
              </div>
              <h3 className="font-display text-xl font-bold">Rigorous Lead Vetting</h3>
              <p className="text-sm text-[#6E6E73] leading-relaxed">
                We keep Lead Generation and Lead Filtering strictly separate—vetting every contact before it hits your sales executive’s CRM.
              </p>
            </GlassCard>

            <GlassCard className="p-7 space-y-3" tilt={true} interactive={true}>
              <div className="w-10 h-10 rounded-xl frosted-glass flex items-center justify-center text-[#1D1D1F] font-bold">
                03
              </div>
              <h3 className="font-display text-xl font-bold">Sales Team Enablement</h3>
              <p className="text-sm text-[#6E6E73] leading-relaxed">
                Beyond digital ads, we train your floor sales executives on rapid inquiry response, test-drive conversion psychology, and CRM discipline.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Interactive Lead Generation & Qualification Funnel */}
      <AutomotiveLeadFunnel onEnquireStage={handleEnquire} />

      {/* 3. Complete 16-Service Catalogue (with 3D-Tilt Framer Motion effect on all cards) */}
      <section id="service-catalogue" className="py-20 lg:py-28 bg-[#F5F5F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              Official Service Catalogue · 16 Services in Exact Prescribed Order
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.02em] text-[#1D1D1F]">
              Automotive Marketing Services
            </h2>
            <p className="text-base sm:text-lg text-[#6E6E73] leading-relaxed">
              Explore our 16 core automotive marketing solutions designed to improve visibility, organise leads, and accelerate showroom conversions. Every card features Apple-inspired 3D tilt physics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AUTOMOTIVE_SERVICES.map((svc) => (
              <GlassCard
                key={svc.number}
                className="p-7 flex flex-col justify-between space-y-6 hover:shadow-xl transition-all duration-300"
                tilt={true}
                interactive={true}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#6E6E73]">
                    <span className="font-mono-num text-sm text-[#1D1D1F] font-bold bg-white/90 px-2.5 py-1 rounded-lg border border-[#1D1D1F]/10">
                      Service {svc.number}
                    </span>
                    <span className="uppercase tracking-wider">{svc.category}</span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-[#1D1D1F]">
                    {svc.title}
                  </h3>

                  <p className="text-sm text-[#6E6E73] leading-relaxed">
                    {svc.summary}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-[#E8E8ED]">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1F]">
                      Key Deliverables:
                    </p>
                    <ul className="space-y-1.5 text-xs text-[#1D1D1F]/85">
                      {svc.deliverables.map((deliv, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#1D1D1F] shrink-0 mt-0.5" />
                          <span>{deliv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E8E8ED]">
                  <GlassButton
                    variant="glass"
                    size="sm"
                    className="w-full justify-center"
                    onClick={() => handleEnquire(svc.title)}
                  >
                    <span>Enquire About This Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </GlassButton>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Automotive Results (Recharts Dealership KPI Visualizations & 3/6/12-Mo Trend Projection) */}
      <AutomotiveResultsSection
        monthlyBudget={monthlyBudget}
        segmentId={segmentId}
        onChangeBudget={setMonthlyBudget}
      />

      {/* Regional Dealership Benchmark Analysis (Recharts Regional Comparison & Radar) */}
      <AutomotiveBenchmarkAnalysis />

      {/* Market Momentum: Real-Time Lead Quality Index & ROI Progression */}
      <AutomotiveMarketMomentum />

      {/* Live Google Search Grounded Automotive Industry News */}
      <AutomotiveIndustryNews />

      {/* Real-Time Lead Impact Tracker */}
      <section className="py-16 lg:py-24 bg-[#F5F5F7] border-t border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LeadImpactTracker />
        </div>
      </section>

      {/* Performance Growth Roadmap */}
      <section className="py-16 lg:py-24 bg-[#FFFFFF] border-t border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PerformanceGrowthRoadmap />
        </div>
      </section>

      {/* 4. Standalone Modular Dealership Services (No Forced Bundles) */}
      <section className="py-20 lg:py-28 bg-[#FFFFFF] border-t border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              Modular Standalone Scope · Zero Compulsory Bundles
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F]">
              Select Only the Dealership Services You Need
            </h2>
            <p className="text-base text-[#6E6E73] leading-relaxed">
              Engage AKYIN independently for showroom demand generation, test-drive acquisition, lead filtering, or sales team coaching without forced multi-service retainers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {STANDALONE_AUTOMOTIVE_TRACKS.map((track) => (
              <GlassPanel
                key={track.slug}
                solid
                className="p-8 flex flex-col justify-between space-y-7 bg-white"
              >
                <div className="space-y-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#0071E3]">
                    {track.category}
                  </span>
                  <h3 className="font-display text-2xl font-bold text-[#1D1D1F]">
                    {track.name}
                  </h3>
                  <p className="text-sm text-[#6E6E73] leading-relaxed">
                    {track.description}
                  </p>
                  <ul className="space-y-2.5 pt-4 border-t border-[#E8E8ED]">
                    {track.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1D1D1F]">
                        <CheckCircle2 className="w-4 h-4 text-[#1D1D1F] shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#E8E8ED] space-y-2.5">
                  <GlassButton
                    variant="primary"
                    size="md"
                    className="w-full justify-center"
                    onClick={() => onNavigate(track.slug)}
                  >
                    <span>Explore Standalone Service</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </GlassButton>
                  <button
                    type="button"
                    onClick={() => handleEnquire(track.name)}
                    className="w-full text-center text-xs font-semibold text-[#1D1D1F] hover:text-[#0071E3] py-1.5 cursor-pointer"
                  >
                    Request Dealership Quotation
                  </button>
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Dealership Media ROI & Monthly Lead Estimator */}
      <AutomotiveRoiCalculator
        onApplyPlan={(summaryText) => {
          setEnquiryMessage(summaryText);
          scrollToEnquiry();
        }}
      />

      {/* Interactive Dealership Growth Calculator */}
      <DealershipGrowthCalculator
        monthlyBudget={monthlyBudget}
        onChangeBudget={setMonthlyBudget}
        segmentId={segmentId}
        onChangeSegment={setSegmentId}
        onRequestAudit={handleCalculatorAudit}
      />

      {/* Agency Value Calculator: In-House Marketing Team vs. AKYIN Partnership */}
      <AgencyValueCalculator
        onRequestBreakdown={(summaryText) => {
          setEnquiryMessage(summaryText);
          scrollToEnquiry();
        }}
      />

      {/* Featured Automotive Client Success Stories (with category filters & sort) */}
      <AutomotiveSuccessStories />

      {/* Auto-Playing Dealership Manager Video Success Stories */}
      <VideoSuccessStories />

      {/* Client Success Testimonial Carousel */}
      <ClientSuccessCarousel
        onNavigate={onNavigate}
        defaultSegment="automotive"
        backgroundClass="surface-silver-gradient"
      />

      {/* 5. Company Presentation Viewer Section */}
      <PresentationDeckViewer
        sectionId="presentation-viewer"
        eyebrow="Official 19-Slide Presentation Viewer"
        heading="Explore Our Company Presentation"
        subheading="Browse all 19 slides of the official AKYIN Automotive Marketing presentation, switch to the All Businesses overview deck, zoom in, view full-screen, or download either PDF directly."
        decks={[AUTOMOTIVE_DECK, ALL_BUSINESSES_DECK]}
        initialDeckId="automotive"
        backgroundClass="bg-[#F5F5F7]"
      />

      {/* Download Dealership Dossier (Glassmorphism PDF-Style Executive Brief) */}
      <AutomotiveDealershipDossier onRequestConsultation={handleEnquire} />

      {/* 6. Automotive FAQ Component (Glassmorphism Accordion) */}
      <section className="py-20 lg:py-28 bg-[#FFFFFF] border-t border-[#E8E8ED]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              Lead Qualification FAQ &amp; Dealership Answers
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F]">
              Lead Qualification &amp; Dealership FAQs
            </h2>
            <p className="text-base text-[#6E6E73] leading-relaxed max-w-2xl mx-auto">
              Clear answers on how AKYIN filters high-intent test-drive buyers, integrates with dealership CRMs, and coaches showroom sales teams.
            </p>
          </div>

          <div className="space-y-4">
            {AUTOMOTIVE_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <GlassPanel
                  key={idx}
                  className="overflow-hidden transition-all duration-200 border border-[#E8E8ED] bg-white"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1D1F]/20"
                  >
                    <span className="font-display text-lg font-bold text-[#1D1D1F]">
                      {faq.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 bg-[#1D1D1F] text-white' : 'text-[#1D1D1F]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-6 pb-6 pt-1 text-sm text-[#6E6E73] leading-relaxed border-t border-[#E8E8ED]/60">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassPanel>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Dealership Growth Enquiry Section */}
      <ContactDispatcher
        sectionId="dealership-enquiry"
        defaultCategory="Marketing Services Enquiry"
        defaultVertical="Akyin Marketing"
        defaultEnquiryType="Automotive Dealership Marketing & Sales Strategy"
        defaultMessage={enquiryMessage}
        heading="Schedule a Dealership Growth Consultation."
        subheading="Connect directly with AKYIN’s automotive marketing directors to discuss standalone lead generation, two-tier lead qualification, CRM integration, and sales team training for your showroom."
      />

      {/* 8. Automotive Growth Newsletter Sign-Up Footer Strip */}
      <AutomotiveGrowthNewsletter />

      {/* 9. Floating Quick-Quote Audit Action Button & Modal */}
      <AutomotiveQuickQuoteFab />
    </div>
  );
}
