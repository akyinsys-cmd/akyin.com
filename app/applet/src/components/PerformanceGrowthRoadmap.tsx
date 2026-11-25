import React from 'react';
import { ArrowRight, CheckCircle2, Filter, Layers, MapPin, PhoneCall, Sparkles, Target, TrendingUp, Users } from 'lucide-react';
import { GlassCard, GlassPanel } from './liquid-glass';

export function PerformanceGrowthRoadmap() {
  const steps = [
    {
      phase: 'Stage 01',
      title: 'High-Intent Lead Generation',
      icon: Target,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      description:
        'Geo-fenced Meta & Google performance ad campaigns targeting active car buyers within your dealership catchment area.',
      metrics: ['Avg CPL: ₹280 - ₹450', 'Geo-Targeted Radius', 'Dynamic Creative A/B Testing'],
    },
    {
      phase: 'Stage 02',
      title: 'Qualification & Vetting',
      icon: Filter,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      description:
        'Instant telephonic & automated qualification filtering out window shoppers, verifying budget, timeline, and exact model preference.',
      metrics: ['100% Lead Vetting', 'Instant Call-Back (<3 mins)', 'Hot / Warm Categorization'],
    },
    {
      phase: 'Stage 03',
      title: 'Test-Drive Booking & Reminder',
      icon: PhoneCall,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      description:
        'Frictionless booking widget paired with automated WhatsApp and SMS appointment confirmation reminders to guarantee showroom arrivals.',
      metrics: ['+38% Showroom Turnout', 'Automated Calendar Sync', 'Sales Exec Assignment'],
    },
    {
      phase: 'Stage 04',
      title: 'Showroom Conversion & Delivery',
      icon: TrendingUp,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      description:
        'Seamless showroom floor handover, expert test-drive experience, structured follow-up sequences, and final vehicle delivery closure.',
      metrics: ['19% Avg Conversion Rate', 'Customer Feedback Loop', 'Referral & Exchange Upsell'],
    },
  ];

  return (
    <div className="rounded-3xl border border-[#E8E8ED] bg-white/90 backdrop-blur-2xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0071E3] text-xs font-semibold">
          <MapPin className="w-3.5 h-3.5" />
          <span>Dealership Growth Blueprint</span>
        </div>
        <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F]">
          Performance Growth Roadmap: From Inbound Ad to Showroom Key Handover
        </h3>
        <p className="text-sm text-[#6E6E73]">
          Our proven 4-stage dealership conversion methodology eliminates wasted ad expenditure and ensures every inquiry is methodically nurtured into a confirmed showroom booking.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.phase}
              className="rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7]/70 p-6 flex flex-col justify-between space-y-6 relative hover:border-[#0071E3]/40 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0071E3]">
                    {step.phase}
                  </span>
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${step.color} shadow-xs`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-base font-bold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-xs text-[#6E6E73] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-[#E8E8ED]">
                {step.metrics.map((m, mIdx) => (
                  <div key={mIdx} className="flex items-center gap-2 text-[11px] text-[#4A4A4F] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0071E3] shrink-0" />
                    <span className="truncate">{m}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
