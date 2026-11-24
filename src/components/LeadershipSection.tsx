import { ArrowRight } from 'lucide-react';
import { AppRoute, LEADERSHIP_TEAM } from '../data/akyinData';
import { EditorialReveal } from './EditorialReveal';
import { ResilientImage } from './ResilientImage';

interface LeadershipSectionProps {
  onNavigate: (route: AppRoute) => void;
}

export function LeadershipSection({ onNavigate }: LeadershipSectionProps) {
  return (
    <section
      id="our-leadership"
      aria-labelledby="our-leadership-heading"
      className="py-20 lg:py-24 bg-[#F5F5F7] border-t border-[#E8E8ED]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <EditorialReveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                Executive Stewardship · AKYIN Ventures
              </p>
              <h2
                id="our-leadership-heading"
                className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance"
              >
                Our Leadership
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed max-w-xl">
              Principals and vertical leads uniting 16 years of automotive retail experience, structured lead qualification, and independent digital platforms under one disciplined parent group.
            </p>
          </div>
        </EditorialReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LEADERSHIP_TEAM.map((member, idx) => (
            <EditorialReveal key={member.id} delay={idx * 0.06} className="h-full">
              <article className="h-full group liquid-glass-card rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5">
                <div>
                  <div className="aspect-square bg-[#ECECEF] overflow-hidden border-b border-[#E8E8ED]/80">
                    <ResilientImage
                      src={member.headshot}
                      alt={member.headshotAlt}
                      loading="lazy"
                      branded={false}
                      fallbackTitle={member.name}
                      className="w-full h-full bg-[#ECECEF]"
                      imageClassName="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="p-7 space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E6E73]">
                      <span className="font-semibold text-[#1D1D1F]">{member.title}</span>
                    </div>

                    <h3 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F]">
                      {member.name}
                    </h3>

                    <p className="text-xs font-medium text-[#6E6E73]">
                      {member.divisionFocus} · {member.experienceLabel}
                    </p>

                    <p className="text-sm text-[#3A3A3F] leading-relaxed pt-1">
                      {member.expertise}
                    </p>
                  </div>
                </div>

                <div className="px-7 pb-7 pt-4 border-t border-[#1D1D1F]/8 flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-[#6E6E73] truncate">
                    {member.ctaLabel}
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate(member.route)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D1D1F] hover:underline cursor-pointer whitespace-nowrap shrink-0 min-h-[40px]"
                  >
                    <span>Explore Vertical</span>
                    <ArrowRight
                      className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </article>
            </EditorialReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
