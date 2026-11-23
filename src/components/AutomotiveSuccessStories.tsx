import { ArrowDownRight, ArrowUpRight, MapPin, Quote, ShieldCheck, Star } from 'lucide-react';
import { GlassCard } from './liquid-glass';

interface AutomotiveStory {
  id: string;
  dealership: string;
  segment: string;
  location: string;
  spokesperson: string;
  role: string;
  quote: string;
  testDriveIncrease: string;
  leadCostReduction: string;
  secondaryMetricLabel: string;
  secondaryMetricValue: string;
}

const FEATURED_STORIES: AutomotiveStory[] = [
  {
    id: 'story-autoclub',
    dealership: 'AutoClub Multi-Brand Showrooms',
    segment: 'Mass-Market & Family SUVs · 4 Outlets',
    location: 'Bengaluru, Karnataka',
    spokesperson: 'Praveen Rajagopalan',
    role: 'Managing Director',
    quote:
      'Separating Meta ad generation from dedicated AI and telephonic lead filtering transformed our sales floor productivity. Our executives now speak exclusively to verified car buyers ready for weekend test drives.',
    testDriveIncrease: '+42%',
    leadCostReduction: '-31%',
    secondaryMetricLabel: 'Qualification Accuracy',
    secondaryMetricValue: '68%',
  },
  {
    id: 'story-crestline',
    dealership: 'Crestline Motors & Certified Pre-Owned',
    segment: 'New Vehicles & Exchange Hub',
    location: 'Hyderabad, Telangana',
    spokesperson: 'Vikramaditya Rao',
    role: 'Dealer Principal',
    quote:
      'During the festive exchange carnival, AKYIN combined localized search campaigns with instant WhatsApp valuation workflows and hands-on sales coaching. Showroom test-drive footfalls surged without bloating ad spend.',
    testDriveIncrease: '+64%',
    leadCostReduction: '-38%',
    secondaryMetricLabel: 'Showroom Show-Up Rate',
    secondaryMetricValue: '71%',
  },
  {
    id: 'story-auramobility',
    dealership: 'Aura EV & Luxury Mobility',
    segment: 'Premium Electric & Executive Sedans',
    location: 'Pune & Mumbai, Maharashtra',
    spokesperson: 'Nikhil Deshmukh',
    role: 'Head of Sales Operations',
    quote:
      'High-ticket EV buyers require immediate, informed answers. AKYIN deployed home test-drive funnels alongside a custom lead-target tracking portal that gave our showroom managers complete daily visibility.',
    testDriveIncrease: '+53%',
    leadCostReduction: '-27%',
    secondaryMetricLabel: 'Response Time Reduction',
    secondaryMetricValue: '3.1x Faster',
  },
];

export function AutomotiveSuccessStories() {
  return (
    <section
      id="automotive-success-stories"
      className="py-20 lg:py-28 bg-[#F5F5F7] border-t border-[#E8E8ED]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full frosted-glass-pill text-xs font-semibold text-[#1D1D1F]">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
            <span>Dealership Client Outcomes · Featured Case Feedback</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
            Automotive Success Stories.
          </h2>
          <p className="text-base text-[#6E6E73] leading-relaxed">
            How multi-brand showrooms, pre-owned divisions, and luxury mobility dealerships partnered with AKYIN to increase test-drive volume and reduce acquisition waste.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {FEATURED_STORIES.map((story) => (
            <GlassCard
              key={story.id}
              tilt={true}
              interactive={true}
              className="p-7 sm:p-8 flex flex-col justify-between space-y-6 bg-white/85"
            >
              <div className="space-y-5">
                {/* Header & Rating */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-0.5 rounded-full">
                      {story.segment}
                    </span>
                    <h3 className="font-display text-xl font-bold text-[#1D1D1F] pt-1">
                      {story.dealership}
                    </h3>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500 shrink-0" aria-label="5 out of 5 rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                    ))}
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="frosted-glass-pill rounded-2xl p-3.5 space-y-1 border border-emerald-200/60 bg-emerald-50/40">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#6E6E73]">
                      <span>Test Drive Increase</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                    </div>
                    <p className="font-mono-num text-2xl font-bold text-emerald-700">
                      {story.testDriveIncrease}
                    </p>
                  </div>

                  <div className="frosted-glass-pill rounded-2xl p-3.5 space-y-1 border border-purple-200/60 bg-purple-50/40">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#6E6E73]">
                      <span>Lead Cost Reduction</span>
                      <ArrowDownRight className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
                    </div>
                    <p className="font-mono-num text-2xl font-bold text-purple-700">
                      {story.leadCostReduction}
                    </p>
                  </div>
                </div>

                {/* Quote */}
                <div className="relative pt-1">
                  <Quote className="w-5 h-5 text-[#1D1D1F]/15 mb-2" aria-hidden="true" />
                  <p className="text-sm text-[#1D1D1F]/85 leading-relaxed">
                    “{story.quote}”
                  </p>
                </div>
              </div>

              {/* Attribution Footer */}
              <div className="pt-4 border-t border-[#E8E8ED] flex items-end justify-between gap-3">
                <div>
                  <p className="font-display text-sm font-bold text-[#1D1D1F]">
                    {story.spokesperson}
                  </p>
                  <p className="text-xs text-[#6E6E73]">{story.role}</p>
                  <p className="text-[11px] text-[#6E6E73] inline-flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" aria-hidden="true" />
                    <span>{story.location}</span>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6E6E73]">
                    {story.secondaryMetricLabel}
                  </p>
                  <p className="font-mono-num text-sm font-bold text-[#1D1D1F]">
                    {story.secondaryMetricValue}
                  </p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
