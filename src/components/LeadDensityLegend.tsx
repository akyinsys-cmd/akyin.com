import { Info } from 'lucide-react';

interface DensityTier {
  range: string;
  title: string;
  description: string;
  fill: string;
  border: string;
  textColor: string;
}

const DENSITY_TIERS: DensityTier[] = [
  {
    range: '<38%',
    title: 'Exploratory',
    description: 'Early research & broad corridor reach',
    fill: '#F3E8FF',
    border: '#D8B4FE',
    textColor: '#581C87',
  },
  {
    range: '38–49%',
    title: 'Moderate',
    description: 'Multi-variant comparison stage',
    fill: '#DDD6FE',
    border: '#C4B5FD',
    textColor: '#4C1D95',
  },
  {
    range: '50–61%',
    title: 'Strong',
    description: 'Model & budget verified leads',
    fill: '#8B5CF6',
    border: '#7C3AED',
    textColor: '#FFFFFF',
  },
  {
    range: '62–73%',
    title: 'High Intent',
    description: 'Priority showroom booking cluster',
    fill: '#6D28D9',
    border: '#5B21B6',
    textColor: '#FFFFFF',
  },
  {
    range: '74%+',
    title: 'Peak Density',
    description: 'Immediate test-drive readiness',
    fill: '#4C1D95',
    border: '#3B0764',
    textColor: '#FFFFFF',
  },
];

interface LeadDensityLegendProps {
  activeFilterLabel: string;
  avgDensity: number;
}

export function LeadDensityLegend({
  activeFilterLabel,
  avgDensity,
}: LeadDensityLegendProps) {
  return (
    <div
      role="region"
      aria-label="Lead qualification density intensity scale legend"
      className="rounded-2xl border border-[#E8E8ED] bg-white/80 p-4 sm:p-5 space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-semibold text-[#1D1D1F]">
              Qualification Density Intensity Scale
            </h4>
            <p className="text-[11px] sm:text-xs text-[#6E6E73]">
              Color depth indicates the share of enquiries passing budget, model &amp; 30-day purchase verification for{' '}
              <span className="font-medium text-[#1D1D1F]">{activeFilterLabel}</span> (grid avg:{' '}
              <span className="font-mono-num tabular-nums font-semibold text-purple-700">
                {avgDensity}%
              </span>
              ).
            </p>
          </div>
        </div>
        <span className="text-[11px] text-[#6E6E73] sm:text-right shrink-0">
          Hover any tile for exact volume &amp; demand
        </span>
      </div>

      {/* Continuous Visual Gradient Bar with Threshold Markers */}
      <div className="space-y-1.5">
        <div
          className="h-3 w-full rounded-full border border-[#D8B4FE]/70 shadow-inner"
          style={{
            background:
              'linear-gradient(90deg, #F3E8FF 0%, #DDD6FE 25%, #8B5CF6 52%, #6D28D9 76%, #4C1D95 100%)',
          }}
          aria-hidden="true"
        />
        <div className="flex items-center justify-between text-[11px] font-mono-num tabular-nums text-[#6E6E73] px-0.5">
          <span>0% Low</span>
          <span>38%</span>
          <span>50%</span>
          <span>62%</span>
          <span>74%+ Peak</span>
        </div>
      </div>

      {/* Descriptive Tier Reference Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
        {DENSITY_TIERS.map((tier) => (
          <div
            key={tier.range}
            className="rounded-xl border border-[#E8E8ED] bg-[#F5F5F7]/50 p-2.5 flex flex-col gap-1"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-md border shrink-0 inline-block"
                style={{ backgroundColor: tier.fill, borderColor: tier.border }}
                aria-hidden="true"
              />
              <span className="font-mono-num tabular-nums text-xs font-bold text-[#1D1D1F]">
                {tier.range}
              </span>
            </div>
            <p className="text-[11px] font-semibold text-[#1D1D1F] leading-tight">
              {tier.title}
            </p>
            <p className="text-[11px] text-[#6E6E73] leading-snug">
              {tier.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
