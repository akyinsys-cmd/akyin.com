import { useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Minus,
  Sparkles,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { AutomotiveLeadFunnel } from '../components/AutomotiveLeadFunnel';
import { AutomotiveResultsSection } from '../components/AutomotiveResultsSection';
import { AutomotiveSuccessStories } from '../components/AutomotiveSuccessStories';
import { ContactDispatcher } from '../components/ContactDispatcher';
import { DealershipGrowthCalculator } from '../components/DealershipGrowthCalculator';
import {
  GlassButton,
  GlassCard,
  GlassImageFrame,
  GlassPanel,
} from '../components/liquid-glass';
import { ResilientImage } from '../components/ResilientImage';
import { VerifiedAutomotiveBadge } from '../components/VerifiedAutomotiveBadge';
import { AppRoute, IMAGES } from '../data/akyinData';

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

const COMPARISON_TIERS = [
  {
    name: 'Starter Showroom',
    subtitle: 'Essential Growth',
    badge: 'Single Location',
    description: 'For single-location dealerships looking to establish robust digital presence & lead generation.',
    features: [
      { name: 'Geo-fenced Meta & Google Ads', included: true },
      { name: 'Lead Generation Campaigns', included: true },
      { name: 'Basic Lead Filtering', included: true },
      { name: 'Social Media Management (3 posts/wk)', included: true },
      { name: 'Google Business Profile Optimization', included: true },
      { name: 'Test Drive & Festive Campaigns', included: false },
      { name: 'AI & Human Telephonic Vetting', included: false },
      { name: 'Custom Lead Tracking Web App', included: false },
      { name: 'Sales Team Training Workshops', included: false },
      { name: 'Dedicated Account Director', included: false },
    ],
  },
  {
    name: 'Growth Dealership',
    subtitle: 'Full-Service Performance',
    badge: 'Most Popular',
    description: 'For high-volume multi-model showrooms needing advanced lead filtering, social media, and test drive campaigns.',
    highlighted: true,
    features: [
      { name: 'Geo-fenced Meta & Google Ads', included: true },
      { name: 'Lead Generation Campaigns', included: true },
      { name: 'Basic Lead Filtering', included: true },
      { name: 'Social Media Management (Daily)', included: true },
      { name: 'Google Business Profile Optimization', included: true },
      { name: 'Test Drive & Festive Campaigns', included: true },
      { name: 'AI & Human Telephonic Vetting', included: true },
      { name: 'Custom Lead Tracking Web App', included: false },
      { name: 'Sales Team Training Workshops', included: true },
      { name: 'Dedicated Account Director', included: true },
    ],
  },
  {
    name: 'Enterprise Group',
    subtitle: 'Nationwide / Multi-Brand Mastery',
    badge: 'Multi-Brand Groups',
    description: 'For large automotive groups requiring custom app development, dedicated telephonic lead qualification, and executive sales training.',
    features: [
      { name: 'Geo-fenced Meta & Google Ads', included: true },
      { name: 'Lead Generation Campaigns', included: true },
      { name: 'Basic Lead Filtering', included: true },
      { name: 'Social Media Management (Multi-Channel)', included: true },
      { name: 'Google Business Profile Optimization', included: true },
      { name: 'Test Drive & Festive Campaigns', included: true },
      { name: 'AI & Human Telephonic Vetting', included: true },
      { name: 'Custom Lead Tracking Web App', included: true },
      { name: 'Sales Team Training Workshops', included: true },
      { name: 'Dedicated Account Director', included: true },
    ],
  },
];

const AUTOMOTIVE_FAQS = [
  {
    question: 'How does AKYIN ensure leads are not spam or unqualified?',
    answer: 'We maintain strict separation between lead generation and human/AI lead qualification. Every inquiry undergoes automated phone number verification and quick intent screening before being dispatched to your sales executives, ensuring zero spam and high showroom conversion intent.',
  },
  {
    question: 'Can AKYIN integrate directly with our dealership CRM?',
    answer: 'Yes. We integrate seamlessly with all major dealership CRM systems and WhatsApp notification workflows, pushing hot test-drive and booking leads instantly to your sales floor executives within seconds.',
  },
  {
    question: 'What is the exact difference between lead generation and lead filtering?',
    answer: 'Lead generation focuses on ad creative, targeting, and capturing buyer attention across Meta and Google. Lead filtering is a separate, rigorous vetting step where we verify budget, timeline, and model preference so your sales team only spends time on genuine buyers.',
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

const PRESENTATION_SLIDES = [
  { slide: 1, title: 'AKYIN Marketing — Automotive Growth Presentation', subtitle: 'Marketing That Moves Dealerships Forward' },
  { slide: 2, title: 'Executive Summary & Industry Overview', subtitle: 'Navigating modern dealership challenges and showroom footfall dynamics' },
  { slide: 3, title: 'The AKYIN Advantage · 16 Years Experience', subtitle: 'Deep domain expertise spanning Maruti Suzuki to Audi dealerships' },
  { slide: 4, title: 'Service 1 & 2: Lead Generation & Qualification', subtitle: 'High-intent digital acquisition paired with rigorous AI & human vetting' },
  { slide: 5, title: 'Service 3 & 4: Influencer & Social Media Marketing', subtitle: 'Building organic brand desire through trusted automotive creators and daily reels' },
  { slide: 6, title: 'Service 5 & 6: Video Production & Product Launches', subtitle: 'Cinematic vehicle showcases and high-impact showroom launch events' },
  { slide: 7, title: 'Service 7 & 8: Test Drive & Festive Campaigns', subtitle: 'Driving maximum footfalls and seasonal exchange carnivals' },
  { slide: 8, title: 'Service 9 & 10: Google Local SEO & Customer Retention', subtitle: 'Dominating local map packs and securing repeat after-sales business' },
  { slide: 9, title: 'Service 11 & 12: Pre-Owned & Corporate Fleet Marketing', subtitle: 'Expanding revenue streams into certified used cars and institutional fleets' },
  { slide: 10, title: 'Service 13 & 14: Landing Pages & Analytics Dashboards', subtitle: 'High-speed conversion funnels and transparent 24/7 ROI tracking' },
  { slide: 11, title: 'Service 15: Custom App Development for Dealerships', subtitle: 'Proprietary lead tracking and executive target monitoring portals' },
  { slide: 12, title: 'Service 16: Sales Team Training & Conversion Discipline', subtitle: 'Transforming floor executives into high-closing automotive advisors' },
  { slide: 13, title: 'Dealership Success Case Study: Multi-Location SUV Growth', subtitle: 'Achieving a 3.4x increase in qualified test-drive enquiries within 90 days' },
  { slide: 14, title: 'The AKYIN Lead Quality Guarantee', subtitle: 'Zero spam, 100% verified phone numbers, and instant CRM routing' },
  { slide: 15, title: 'Transparent Pricing & Retainer Models', subtitle: 'Tailored engagement packages designed for single dealerships and multi-brand groups' },
  { slide: 16, title: 'Technology & AI Integration in Dealerships', subtitle: 'Leveraging automated WhatsApp follow-ups and smart pipeline sorting' },
  { slide: 17, title: 'About AKYIN Ventures Parent Group Ecosystem', subtitle: 'Synergies across Publishing, Fashion, AI Tools, and B2B Commerce' },
  { slide: 18, title: 'Frequently Asked Questions by Dealership Principals', subtitle: 'Answers to lead exclusivity, campaign setup speeds, and training schedules' },
  { slide: 19, title: 'Let’s Move Your Dealership Forward · Contact AKYIN', subtitle: 'Schedule an executive consultation with our automotive growth directors' },
];

export function AutomotiveMarketingPage({}: AutomotiveMarketingPageProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeSlide, setActiveSlide] = useState(1);
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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
  }) => {
    const formattedBudget = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(summary.budget);
    setEnquiryMessage(
      `Dealership Growth Calculator Audit Request — Segment: ${summary.segmentLabel} | Monthly Ad Budget: ${formattedBudget} | Benchmark Estimate: ~${summary.totalEnquiries} enquiries, ~${summary.qualifiedLeads} qualified leads, ~${summary.testDrives} test drives, ~${summary.projectedBookings} bookings/mo.`
    );
    scrollToEnquiry();
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev >= 19 ? 1 : prev + 1));
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev <= 1 ? 19 : prev - 1));
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

      {/* Automotive Results (Recharts Dealership KPI Visualizations) */}
      <AutomotiveResultsSection />

      {/* 4. Service Tier Comparison Table */}
      <section className="py-20 lg:py-28 bg-[#FFFFFF] border-t border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              Flexible Dealership Retainers
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F]">
              Compare Marketing Support Tiers
            </h2>
            <p className="text-base text-[#6E6E73] leading-relaxed">
              Differentiate between standard showroom awareness and enterprise multi-location dealership growth support.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {COMPARISON_TIERS.map((tier, idx) => (
              <GlassPanel
                key={idx}
                solid={!tier.highlighted}
                className={`p-8 flex flex-col justify-between space-y-8 relative ${
                  tier.highlighted
                    ? 'border-2 border-[#1D1D1F] shadow-xl bg-gradient-to-b from-white via-purple-50/20 to-white'
                    : 'bg-white'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1D1D1F] text-white text-[11px] font-semibold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                    {tier.badge}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                      {tier.badge}
                    </span>
                    <span className="text-xs font-mono-num font-bold text-[#1D1D1F] bg-[#F5F5F7] px-2.5 py-1 rounded-lg">
                      Tier {idx + 1}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-[#1D1D1F]">
                    {tier.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#6E6E73]">{tier.subtitle}</p>
                  <p className="text-sm text-[#6E6E73] leading-relaxed">
                    {tier.description}
                  </p>

                  <ul className="space-y-3 pt-6 border-t border-[#E8E8ED]">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-3 text-xs sm:text-sm text-[#1D1D1F]">
                        {feat.included ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center shrink-0">
                            <Minus className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <span className={feat.included ? 'font-medium' : 'text-gray-400 line-through'}>
                          {feat.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-[#E8E8ED]">
                  <GlassButton
                    variant={tier.highlighted ? 'primary' : 'glass'}
                    size="lg"
                    className="w-full justify-center"
                    onClick={() => handleEnquire(`${tier.name} (${tier.subtitle})`)}
                  >
                    <span>Choose {tier.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </GlassButton>
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Dealership Growth Calculator */}
      <DealershipGrowthCalculator onRequestAudit={handleCalculatorAudit} />

      {/* Featured Automotive Client Success Stories */}
      <AutomotiveSuccessStories />

      {/* 5. Company Presentation Viewer Section */}
      <section id="presentation-viewer" className="py-20 lg:py-28 bg-[#F5F5F7] border-t border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              Official 19-Slide Deck Viewer
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F]">
              Explore Our Company Presentation
            </h2>
            <p className="text-base text-[#6E6E73] leading-relaxed">
              Browse through all 19 slides of the official AKYIN Marketing presentation or download the PDF directly.
            </p>
          </div>

          <GlassPanel className="p-6 sm:p-8 space-y-6">
            {/* Presentation Controls Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E8E8ED]">
              <div className="flex items-center gap-2">
                <span className="font-mono-num text-sm font-bold bg-black text-white px-3 py-1.5 rounded-xl">
                  Slide {activeSlide} of 19
                </span>
                <span className="text-xs text-[#6E6E73] hidden sm:inline">
                  AKYIN_Marketing_Presentation.pdf
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <GlassButton variant="glass" size="sm" onClick={prevSlide}>
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </GlassButton>
                <GlassButton variant="glass" size="sm" onClick={nextSlide}>
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </GlassButton>
                <a
                  href="/assets/akyin-marketing-presentation.pdf"
                  download="AKYIN_Marketing_Presentation.pdf"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1D1D1F] text-white hover:bg-[#1D1D1F]/90 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>

            {/* Slide Stage / Embedded View */}
            <div className="aspect-[16/9] bg-gradient-to-br from-[#F5F5F7] to-[#E8E8ED] rounded-2xl border border-[#E8E8ED] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden shadow-inner">
              <div className="absolute top-4 right-4 text-xs font-mono-num text-[#6E6E73] uppercase tracking-widest bg-white/60 px-3 py-1 rounded-full">
                AKYIN Ventures Official Deck
              </div>

              <div className="space-y-4 my-auto max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#6E6E73]">
                  Slide {activeSlide} · AKYIN Automotive Marketing
                </p>
                <h3 className="font-display text-2xl sm:text-4xl font-bold text-[#1D1D1F] tracking-tight">
                  {PRESENTATION_SLIDES[activeSlide - 1]?.title}
                </h3>
                <p className="text-base sm:text-lg text-[#6E6E73] leading-relaxed">
                  {PRESENTATION_SLIDES[activeSlide - 1]?.subtitle}
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-[#1D1D1F]/10 text-xs text-[#6E6E73]">
                <span>akyin.com/marketing/automotive</span>
                <span className="font-mono-num font-bold">19 Slides Total</span>
              </div>
            </div>

            {/* Slide Thumbnail Quick Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {PRESENTATION_SLIDES.map((s) => (
                <button
                  key={s.slide}
                  onClick={() => setActiveSlide(s.slide)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono-num font-bold transition-all shrink-0 cursor-pointer ${
                    activeSlide === s.slide
                      ? 'bg-[#1D1D1F] text-white shadow-xs'
                      : 'bg-white text-[#6E6E73] hover:bg-white/80 border border-[#E8E8ED]'
                  }`}
                >
                  {s.slide}
                </button>
              ))}
            </div>
          </GlassPanel>
        </div>
      </section>

      {/* 6. Automotive FAQ Component (Glassmorphism Accordion) */}
      <section className="py-20 lg:py-28 bg-[#FFFFFF] border-t border-[#E8E8ED]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              Dealership Inquiries &amp; Answers
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F]">
              Frequently Asked Questions
            </h2>
            <p className="text-base text-[#6E6E73] leading-relaxed max-w-2xl mx-auto">
              Clear answers regarding lead generation, AI filtering, CRM integrations, and sales team training for automotive dealership principals.
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
        defaultEnquiryType="Package A — Full-Service Growth Marketing & Lead Management"
        defaultMessage={enquiryMessage}
        heading="Schedule a Dealership Growth Consultation."
        subheading="Connect directly with AKYIN’s automotive marketing directors to discuss custom lead generation, two-tier lead qualification, CRM integration, and sales team training for your dealership group."
      />
    </div>
  );
}
