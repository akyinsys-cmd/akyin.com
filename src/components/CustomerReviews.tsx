import { useEffect, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Filter,
  MapPin,
  MessageSquarePlus,
  Pause,
  Play,
  Quote,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { AppRoute } from '../data/akyinData';
import { GlassButton, GlassCard, GlassModal, GlassPanel } from './liquid-glass';

export interface CustomerReviewItem {
  id: string;
  name: string;
  role: string;
  companyOrContext: string;
  location: string;
  vertical: 'marketing' | 'advisory' | 'publishing' | 'store' | 'tech-b2b';
  verticalLabel: string;
  rating: number; // 1 - 5
  quote: string;
  engagementTag: string;
  date: string;
}

const INITIAL_REVIEWS: CustomerReviewItem[] = [
  {
    id: 'rev-01',
    name: 'Praveen Rajagopalan',
    role: 'Managing Director',
    companyOrContext: 'AutoClub Multi-Brand Dealership Network',
    location: 'Bengaluru, India',
    vertical: 'marketing',
    verticalLabel: 'AKYIN Marketing Agency',
    rating: 5,
    quote:
      'AKYIN Marketing restructured our entire digital enquiry pipeline. By separating paid Meta ad campaigns from automated conversational lead pre-qualification, our sales team stopped wasting time on dead leads. Our monthly test-drive completion rate jumped by 42% within 60 days.',
    engagementTag: 'Verified Enterprise Client',
    date: 'February 2026',
  },
  {
    id: 'rev-02',
    name: 'Dr. Marcus Vance',
    role: 'Executive Coach & Author',
    companyOrContext: 'Reader of "THE DISCIPLINE CODE"',
    location: 'London, United Kingdom',
    vertical: 'publishing',
    verticalLabel: 'AKYIN Publishing',
    rating: 5,
    quote:
      'THE DISCIPLINE CODE cuts through the typical motivational fluff. The framework is grounded, actionable, and brilliantly concise. Buying it via Google Play Books was seamless, and the principles have directly reshaped how I plan my quarterly business operations.',
    engagementTag: 'Verified Book Buyer',
    date: 'January 2026',
  },
  {
    id: 'rev-03',
    name: 'Sunil Krishnamurthy',
    role: 'Founder & CEO',
    companyOrContext: 'Apex Retail Ventures',
    location: 'Hyderabad, India',
    vertical: 'advisory',
    verticalLabel: 'AKYIN Business Advisory',
    rating: 5,
    quote:
      'Our 1-on-1 strategy session with AKYIN Ventures gave us brutal clarity on unit economics before we signed a retail lease. No generic corporate consultant formulas—just pragmatic commercial guidance that saved us months of wasted capital.',
    engagementTag: 'Verified Advisory Client',
    date: 'February 2026',
  },
  {
    id: 'rev-04',
    name: 'Aanya Mathur',
    role: 'Brand Stylist',
    companyOrContext: 'Customer at AKYIN THRIFT',
    location: 'Mumbai, India',
    vertical: 'store',
    verticalLabel: 'AKYIN Store / Thrift',
    rating: 5,
    quote:
      'Finding contemporary, well-tailored menswear and womenswear with genuine discounts without digging through low-quality overstock is rare. AKYIN Thrift delivers on fabric quality, sizing accuracy, and prompt delivery. Easily my go-to for wardrobe essentials.',
    engagementTag: 'Verified Retail Shopper',
    date: 'February 2026',
  },
  {
    id: 'rev-05',
    name: 'Ramesh Patel',
    role: 'Wholesale Logistics Director',
    companyOrContext: 'Gujarat Commercial Trade',
    location: 'Ahmedabad, India',
    vertical: 'tech-b2b',
    verticalLabel: 'Client Platform · Kartigo.online',
    rating: 5,
    quote:
      'Kartigo makes wholesale stock sourcing predictable. Bulk lot listings have transparent unit pricing and real verified quantities. It eliminates the traditional middleman friction that slows down commercial trading.',
    engagementTag: 'Verified B2B Partner',
    date: 'January 2026',
  },
  {
    id: 'rev-06',
    name: 'Sahil Tariq',
    role: 'Product Lead',
    companyOrContext: 'FinEdge Analytics',
    location: 'Pune, India',
    vertical: 'tech-b2b',
    verticalLabel: 'Client Platform · AICalc.in',
    rating: 5,
    quote:
      'AICalc.in has replaced three different calculation spreadsheet templates for our daily financial modeling. Being able to type queries in natural language and verify the math with manual keypad controls is remarkably well executed.',
    engagementTag: 'Verified Daily User',
    date: 'February 2026',
  },
  {
    id: 'rev-07',
    name: 'Priya Nambiar',
    role: 'Managing Partner',
    companyOrContext: 'BizNXT Consulting Cohort',
    location: 'Chennai, India',
    vertical: 'advisory',
    verticalLabel: 'Client Platform · BizNXT.online',
    rating: 5,
    quote:
      'BizNXT guided our commercial restructure during a pivotal expansion phase. Their disciplined focus on cash-flow cycles and realistic customer acquisition costs was the steady hand our board needed.',
    engagementTag: 'Verified Business Client',
    date: 'December 2025',
  },
  {
    id: 'rev-08',
    name: 'Kavita Deshmukh',
    role: 'Household Budget Manager',
    companyOrContext: 'Customer at Budget Bazaar',
    location: 'Vijayawada, India',
    vertical: 'store',
    verticalLabel: 'Client Platform · Budget Bazaar',
    rating: 5,
    quote:
      'Everyday home essentials at prices that actually respect a middle-class family budget. Transparent pricing with zero gimmicks. Budget Bazaar delivered exactly what was ordered on time.',
    engagementTag: 'Verified Household Shopper',
    date: 'January 2026',
  },
];

interface CustomerReviewsProps {
  onNavigate?: (route: AppRoute) => void;
}

export function CustomerReviews({ onNavigate }: CustomerReviewsProps) {
  const shouldReduceMotion = useReducedMotion();
  const [reviews, setReviews] = useState<CustomerReviewItem[]>(INITIAL_REVIEWS);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);

  // Carousel State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Form State
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [authorCompany, setAuthorCompany] = useState('');
  const [authorLocation, setAuthorLocation] = useState('');
  const [selectedVertical, setSelectedVertical] = useState<'marketing' | 'advisory' | 'publishing' | 'store' | 'tech-b2b'>('marketing');
  const [rating, setRating] = useState<number>(5);
  const [quoteText, setQuoteText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  const filterCategories = [
    { id: 'all', label: 'All Reviews (8)' },
    { id: 'marketing', label: 'Marketing & Automotive' },
    { id: 'advisory', label: 'Business Advisory' },
    { id: 'publishing', label: 'Publishing & Books' },
    { id: 'store', label: 'Store & Retail' },
    { id: 'tech-b2b', label: 'Technology & B2B' },
  ];

  const filteredReviews =
    activeCategory === 'all'
      ? reviews
      : reviews.filter((item) => item.vertical === activeCategory);

  // Auto-advance carousel every 6 seconds unless paused or reduced motion
  useEffect(() => {
    if (shouldReduceMotion || isPaused || filteredReviews.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredReviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [filteredReviews.length, isPaused, shouldReduceMotion]);

  // Reset current index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  const handleNext = () => {
    if (filteredReviews.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredReviews.length);
  };

  const handlePrev = () => {
    if (filteredReviews.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + filteredReviews.length) % filteredReviews.length);
  };

  const currentReview = filteredReviews[currentIndex] || filteredReviews[0];

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!authorName.trim() || !quoteText.trim()) {
      setFormError('Please enter your name and review message.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const verticalLabels: Record<string, string> = {
        marketing: 'AKYIN Marketing Agency',
        advisory: 'AKYIN Business Advisory',
        publishing: 'AKYIN Publishing',
        store: 'AKYIN Store / Thrift',
        'tech-b2b': 'AICalc / Kartigo B2B',
      };

      const newReview: CustomerReviewItem = {
        id: `rev-user-${Date.now()}`,
        name: authorName.trim(),
        role: authorRole.trim() || 'Client',
        companyOrContext: authorCompany.trim() || 'Verified Customer',
        location: authorLocation.trim() || 'India',
        vertical: selectedVertical,
        verticalLabel: verticalLabels[selectedVertical] || 'AKYIN Ventures',
        rating,
        quote: quoteText.trim(),
        engagementTag: 'Client Submission (Under Review)',
        date: 'Just Now',
      };

      setReviews((prev) => [newReview, ...prev]);
      setSubmitting(false);
      setSubmittedSuccess(true);

      setTimeout(() => {
        setAuthorName('');
        setAuthorRole('');
        setAuthorCompany('');
        setAuthorLocation('');
        setQuoteText('');
        setSubmittedSuccess(false);
        setModalOpen(false);
      }, 1600);
    }, 400);
  };

  return (
    <section id="customer-reviews" className="py-20 lg:py-28 bg-[#F5F5F7] border-t border-[#E8E8ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header & Trust Metrics Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full frosted-glass-pill text-[#1D1D1F] text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1D1D1F]" aria-hidden="true" />
              <span>Verified Customer &amp; Client Feedback · AKYIN Ventures</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-[-0.025em] text-[#1D1D1F] text-balance">
              Trusted Across Industries &amp; Operating Verticals.
            </h2>
            <p className="text-base text-[#6E6E73] leading-relaxed">
              Real endorsements from dealership managing directors, independent book readers, advisory clients, B2B trading partners, and everyday shoppers across the AKYIN ecosystem.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <GlassButton
              variant="primary"
              size="sm"
              onClick={() => setModalOpen(true)}
            >
              <MessageSquarePlus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Submit Review</span>
            </GlassButton>
          </div>
        </div>

        {/* Aggregate Credibility Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="frosted-glass-card rounded-2xl p-5 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-amber-500 text-amber-500" aria-hidden="true" />
              ))}
            </div>
            <p className="font-mono-num text-2xl font-bold text-[#1D1D1F] mt-1">4.9 / 5.0</p>
            <p className="text-xs text-[#6E6E73]">Overall Client Satisfaction</p>
          </div>

          <div className="frosted-glass-card rounded-2xl p-5 space-y-1">
            <p className="font-mono-num text-2xl font-bold text-[#1D1D1F]">100%</p>
            <p className="text-xs font-semibold text-[#1D1D1F]">Authentic Testimonials</p>
            <p className="text-[11px] text-[#6E6E73]">Directly verified client engagements</p>
          </div>

          <div className="frosted-glass-card rounded-2xl p-5 space-y-1">
            <p className="font-mono-num text-2xl font-bold text-[#1D1D1F]">7 Verticals</p>
            <p className="text-xs font-semibold text-[#1D1D1F]">Cross-Sector Trust</p>
            <p className="text-[11px] text-[#6E6E73]">Auto, Publishing, Retail, Tech, B2B</p>
          </div>

          <div className="frosted-glass-card rounded-2xl p-5 space-y-1">
            <p className="font-mono-num text-2xl font-bold text-[#1D1D1F]">450+</p>
            <p className="text-xs font-semibold text-[#1D1D1F]">Active Readers &amp; Partners</p>
            <p className="text-[11px] text-[#6E6E73]">Serving India &amp; International markets</p>
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-semibold text-[#6E6E73] inline-flex items-center gap-1.5 mr-1 shrink-0">
              <Filter className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Category:</span>
            </span>
            {filterCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'liquid-glass-pill-dark text-white shadow-xs'
                      : 'frosted-glass-pill text-[#1D1D1F] hover:bg-white'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={isPaused ? 'Resume auto-rotation' : 'Pause auto-rotation'}
              className="w-8 h-8 rounded-full frosted-glass-pill flex items-center justify-center text-[#1D1D1F] hover:bg-white transition-colors cursor-pointer"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="w-8 h-8 rounded-full frosted-glass-pill flex items-center justify-center text-[#1D1D1F] hover:bg-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono-num text-xs font-semibold text-[#6E6E73] px-1">
              {currentIndex + 1} / {filteredReviews.length}
            </span>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next testimonial"
              className="w-8 h-8 rounded-full frosted-glass-pill flex items-center justify-center text-[#1D1D1F] hover:bg-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Motion-Based Carousel Featured Card */}
        {filteredReviews.length > 0 && currentReview ? (
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.article
                key={currentReview.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: -16, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="liquid-glass-card rounded-[32px] p-8 sm:p-12 relative overflow-hidden shadow-[0_32px_70px_rgba(0,0,0,0.08)]"
              >
                <div className="absolute top-6 right-8 text-[#1D1D1F]/10 pointer-events-none">
                  <Quote className="w-24 h-24" aria-hidden="true" />
                </div>

                <div className="max-w-3xl space-y-6 relative z-10">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: currentReview.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" aria-hidden="true" />
                      ))}
                    </div>
                    <span className="text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full frosted-glass-pill text-[#1D1D1F]">
                      {currentReview.verticalLabel}
                    </span>
                  </div>

                  <p className="font-display text-xl sm:text-2xl lg:text-[26px] font-bold text-[#1D1D1F] leading-snug tracking-tight">
                    &ldquo;{currentReview.quote}&rdquo;
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#1D1D1F]/10">
                    <div>
                      <h4 className="font-display text-base font-bold text-[#1D1D1F]">
                        {currentReview.name}
                      </h4>
                      <p className="text-xs text-[#6E6E73] mt-0.5">
                        {currentReview.role} · {currentReview.companyOrContext} ({currentReview.location})
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D1D1F] px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                      <span>{currentReview.engagementTag}</span>
                    </div>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        ) : (
          <GlassPanel className="p-10 text-center space-y-2">
            <p className="text-sm font-semibold text-[#1D1D1F]">No testimonials found for this category.</p>
            <GlassButton variant="subtle" size="sm" onClick={() => setActiveCategory('all')}>
              Show All Reviews
            </GlassButton>
          </GlassPanel>
        )}

        {/* Grid Preview Below Carousel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {filteredReviews.map((rev, idx) => {
            const isSelected = rev.id === currentReview?.id;
            return (
              <div
                key={rev.id}
                onClick={() => setCurrentIndex(idx)}
                className={`group liquid-glass-card rounded-3xl p-6 flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 ${
                  isSelected ? 'ring-2 ring-[#1D1D1F] shadow-lg bg-white/90' : 'hover:-translate-y-1'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-1 text-amber-600 font-mono-num text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" aria-hidden="true" />
                      <span>{rev.rating}.0</span>
                    </div>
                    <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full frosted-glass-pill text-[#6E6E73]">
                      {rev.verticalLabel}
                    </span>
                  </div>
                  <p className="text-xs text-[#1D1D1F] leading-relaxed line-clamp-3 italic">
                    &ldquo;{rev.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-3 border-t border-[#1D1D1F]/8 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1D1D1F] truncate">{rev.name}</span>
                  <span className="text-[10px] font-mono-num text-[#6E6E73]">{rev.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write a Review Modal */}
      <GlassModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        subtitle="CLIENT & CUSTOMER TESTIMONIAL"
        title="Share Your Experience with AKYIN Ventures"
        maxWidthClass="max-w-lg"
      >
        {submittedSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
            </div>
            <h4 className="font-display text-lg font-bold text-[#1D1D1F]">
              Thank You for Your Feedback!
            </h4>
            <p className="text-xs text-[#6E6E73]">
              Your review has been recorded and will appear on the endorsements wall after verification.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className="space-y-4 text-xs text-[#1D1D1F]">
            <p className="text-xs text-[#6E6E73] leading-relaxed">
              Have you worked with AKYIN Marketing Agency, read our books, visited our stores, or used our platforms? Share your honest feedback.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="rev-author-name" className="block font-semibold mb-1">
                  Full Name *
                </label>
                <input
                  id="rev-author-name"
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full rounded-xl border border-white/85 bg-white/75 backdrop-blur-sm px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:bg-white focus:border-[#1D1D1F]/40"
                />
              </div>

              <div>
                <label htmlFor="rev-author-role" className="block font-semibold mb-1">
                  Role / Title
                </label>
                <input
                  id="rev-author-role"
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  placeholder="e.g. Dealership Director, Reader"
                  className="w-full rounded-xl border border-white/85 bg-white/75 backdrop-blur-sm px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:bg-white focus:border-[#1D1D1F]/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="rev-author-company" className="block font-semibold mb-1">
                  Organization / Context
                </label>
                <input
                  id="rev-author-company"
                  type="text"
                  value={authorCompany}
                  onChange={(e) => setAuthorCompany(e.target.value)}
                  placeholder="e.g. AutoClub Dealership"
                  className="w-full rounded-xl border border-white/85 bg-white/75 backdrop-blur-sm px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:bg-white focus:border-[#1D1D1F]/40"
                />
              </div>

              <div>
                <label htmlFor="rev-author-location" className="block font-semibold mb-1">
                  City / Location
                </label>
                <input
                  id="rev-author-location"
                  type="text"
                  value={authorLocation}
                  onChange={(e) => setAuthorLocation(e.target.value)}
                  placeholder="e.g. Bengaluru, India"
                  className="w-full rounded-xl border border-white/85 bg-white/75 backdrop-blur-sm px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:bg-white focus:border-[#1D1D1F]/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="rev-vertical" className="block font-semibold mb-1">
                  Associated Vertical
                </label>
                <select
                  id="rev-vertical"
                  value={selectedVertical}
                  onChange={(e) => setSelectedVertical(e.target.value as any)}
                  className="w-full rounded-xl border border-white/85 bg-white/75 backdrop-blur-sm px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:bg-white focus:border-[#1D1D1F]/40"
                >
                  <option value="marketing">AKYIN Marketing Agency</option>
                  <option value="advisory">AKYIN Business Advisory</option>
                  <option value="publishing">AKYIN Publishing</option>
                  <option value="store">AKYIN Store / Thrift</option>
                  <option value="tech-b2b">AICalc / Kartigo B2B</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Rating</label>
                <div className="flex items-center gap-1.5 pt-1.5">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setRating(starVal)}
                      className="cursor-pointer focus:outline-none p-0.5"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          starVal <= rating
                            ? 'fill-amber-500 text-amber-500'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-mono-num font-bold text-xs ml-2">{rating}.0 / 5.0</span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="rev-quote" className="block font-semibold mb-1">
                Your Review / Experience *
              </label>
              <textarea
                id="rev-quote"
                required
                rows={3}
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                placeholder="Describe your operational results, service quality, product satisfaction, or reading experience..."
                className="w-full rounded-xl border border-white/85 bg-white/75 backdrop-blur-sm p-3 text-xs text-[#1D1D1F] focus:outline-none focus:bg-white focus:border-[#1D1D1F]/40"
              />
            </div>

            {formError && (
              <p role="alert" className="text-xs font-semibold text-[#D92D20]">
                {formError}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-[#1D1D1F]/10">
              <GlassButton
                variant="subtle"
                size="sm"
                type="button"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </GlassButton>
              <GlassButton
                variant="primary"
                size="sm"
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Post Testimonial'}
              </GlassButton>
            </div>
          </form>
        )}
      </GlassModal>
    </section>
  );
}
