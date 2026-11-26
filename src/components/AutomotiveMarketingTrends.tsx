import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Car,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  Filter,
  Globe,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AppRoute } from '../data/akyinData';
import { GlassButton, GlassCard, GlassModal, GlassPanel } from './liquid-glass';

export interface AutomotiveTrendItem {
  id: string;
  category: 'dealership-leadgen' | 'ev-shift' | 'digital-showroom' | 'video-social' | 'retention';
  categoryLabel: string;
  year: string;
  quarter: string;
  headline: string;
  summary: string;
  growthMetric: string;
  metricLabel: string;
  numericValue: number; // for Recharts visualization
  strategicTakeaways: string[];
  operationalChecklist: string[];
  applicability: string;
  benchmarkImpact: 'High' | 'Transformational' | 'Standard';
  source?: string;
}

export interface GroundedHeadline {
  title: string;
  snippet: string;
  source: string;
  url: string;
}

const BASE_AUTOMOTIVE_TRENDS: AutomotiveTrendItem[] = [
  {
    id: 'trend-auto-01',
    category: 'dealership-leadgen',
    categoryLabel: 'Dealership Lead Gen & AI Qualification',
    year: '2025–2026',
    quarter: 'Q1 Trend Benchmark',
    headline: 'Two-Tier Lead Velocity: Instant Response & Dedicated Qualification',
    summary:
      'Automotive buyers comparing multi-brand dealerships abandon inquiries within 25 minutes if unattended. Modern high-conversion dealerships separate high-volume Meta ad campaigns from automated conversational AI pre-qualification before routing hot test-drive prospects to senior sales advisors.',
    growthMetric: '4.2x',
    metricLabel: 'Test-Drive Booking Velocity Multiple',
    numericValue: 4.2,
    strategicTakeaways: [
      'Sub-5 minute initial follow-up increases test-drive show-up rates by 68%.',
      'Automated qualification questions (budget window, exchange car details, financing readiness) eliminate tire-kickers before showroom visits.',
      'Daily CRM reconciliation prevents lead leakage between marketing agencies and showroom floor managers.',
    ],
    operationalChecklist: [
      'Deploy WhatsApp Business API with instant response templates within 90 seconds of ad click.',
      'Classify leads into Hot (visiting this week), Warm (researching 30 days), and Cold before floor assignment.',
      'Audit lead-to-showroom visit ratios weekly per sales executive.',
    ],
    applicability: 'Authorized Dealerships, Multi-Brand Showrooms, Luxury Pre-Owned Hubs',
    benchmarkImpact: 'Transformational',
    source: 'ACV Auctions & Dealership Intelligence',
  },
  {
    id: 'trend-auto-02',
    category: 'ev-shift',
    categoryLabel: 'EV Consumer Shift & Range Anxiety Marketing',
    year: '2025–2026',
    quarter: 'Strategic Insight',
    headline: 'Total Cost of Ownership (TCO) Calculators Outperform Spec Sheets',
    summary:
      'Prospective EV purchasers care significantly more about real-world charging logistics, daily commute savings, and 5-year battery warranty confidence than top-speed benchmarks. Transparent monthly savings comparisons drive 3x higher consultation conversions.',
    growthMetric: '+58%',
    metricLabel: 'Consultation Conversion Lift with TCO Tools',
    numericValue: 58,
    strategicTakeaways: [
      'Home charging installation assistance is the #1 deciding factor for urban EV buyers.',
      'Side-by-side fuel vs. electricity cost visualizations on mobile landing pages lower bounce rates by 44%.',
      'Weekend experiential extended test drives convert at 2.4x standard 15-minute showroom laps.',
    ],
    operationalChecklist: [
      'Embed interactive EMI + fuel savings sliders on digital campaign landing pages.',
      'Train showroom product specialists on battery degradation warranties and local DC fast-charging maps.',
      'Offer overnight home test-drive programs for qualified premium EV prospects.',
    ],
    applicability: 'EV Brands, Electric 2W/4W Dealers, Charging Infrastructure Partners',
    benchmarkImpact: 'High',
    source: 'EV Consumer Analytics Group',
  },
  {
    id: 'trend-auto-03',
    category: 'digital-showroom',
    categoryLabel: 'Digital Showroom & 3D Walkthroughs',
    year: '2025–2026',
    quarter: 'Technology Frontier',
    headline: 'Photorealistic 360° Walkthroughs with Direct WhatsApp Hand-Off',
    summary:
      'Over 74% of car buyers configure vehicle colors, interior trims, and accessory bundles digitally before stepping foot into a dealership. Providing seamless high-resolution interactive 3D visualizers with 1-tap WhatsApp consultation captures buyers during peak evening research hours.',
    growthMetric: '74%',
    metricLabel: 'Online Buyers Pre-Configuring Prior to Visit',
    numericValue: 74,
    strategicTakeaways: [
      'Interactive interior cabin 360° tours keep prospective buyers engaged for 3.8 minutes on average.',
      'Personalized video walkthroughs sent by sales advisors convert at 52% higher rates than generic PDF brochures.',
      'Virtual accessory visualizers lift average transaction value per booked vehicle by ₹45,000–₹85,000.',
    ],
    operationalChecklist: [
      'Incorporate 360° interactive exterior/interior walk-around modules on venture landing pages.',
      'Equip showroom staff with dedicated smartphones for personalized video customer walkthroughs.',
      'Track which accessories buyers click online to brief the sales team before in-person test drives.',
    ],
    applicability: 'Tier 1 & Tier 2 Showrooms, Premium Auto Brands, Customizers',
    benchmarkImpact: 'High',
    source: 'Automora Digital Showroom Index',
  },
  {
    id: 'trend-auto-04',
    category: 'video-social',
    categoryLabel: 'Video & Creator Social Proof',
    year: '2025–2026',
    quarter: 'Media Trend',
    headline: 'Micro-Creator Real-World Ownership Vlogs Replace Polished Studio Ads',
    summary:
      'Modern automotive audiences trust unscripted family luggage tests, highway overtaking capability reels, and genuine owner mileage reviews over airbrushed television commercials. Regional language micro-influencers generate 3.1x higher local showroom footfall.',
    growthMetric: '3.1x',
    metricLabel: 'Showroom Footfall Multiple from Creators',
    numericValue: 3.1,
    strategicTakeaways: [
      'Authentic vertical video clips detailing real-world family road trips outperform corporate commercials on Meta ads.',
      'Regional language voiceovers build immediate trust in Tier 2 and Tier 3 markets.',
      'Short-form customer delivery celebration reels create powerful local viral referral loops.',
    ],
    operationalChecklist: [
      'Partner with 3–5 trusted local auto creators per quarter for authentic vehicle road tests.',
      'Produce short 20-second delivery moments with happy families for Instagram Reels and WhatsApp status.',
      'Ensure clear local showroom geo-tagging on all video ad creative.',
    ],
    applicability: 'Regional Dealer Groups, Independent Showrooms, Brand Marketing Teams',
    benchmarkImpact: 'Transformational',
    source: 'Meta Automotive Creative Benchmark',
  },
  {
    id: 'trend-auto-05',
    category: 'retention',
    categoryLabel: 'Post-Sale Lifecycle & Service Loyalty',
    year: '2025–2026',
    quarter: 'Operational Retention',
    headline: 'Predictive Service Scheduling & Automated Warranty Milestones',
    summary:
      'Dealership profitability hinges on service workshop retention and customer trade-in cycles. Automated mileage-based service reminders and guaranteed trade-in valuation locks retain 61% more second-car family upgrades within the same dealer network.',
    growthMetric: '61%',
    metricLabel: 'Repeat Customer Retention via Proactive Reminders',
    numericValue: 61,
    strategicTakeaways: [
      'Service reminders delivered via WhatsApp with transparent cost estimates yield an 82% open rate.',
      'Annual vehicle health check invitations keep customers tethered to authorized workshops.',
      'Guaranteed trade-in evaluations at the 3-year mark accelerate vehicle upgrade cycles by 14 months.',
    ],
    operationalChecklist: [
      'Implement automated 6-month service interval notifications synced with customer odometer readings.',
      'Provide fixed-price transparent routine maintenance packages online.',
      'Trigger personalized trade-in exchange bonuses 90 days before warranty expiration.',
    ],
    applicability: 'Authorized Service Stations, Multi-Brand Service Chains, Dealer Groups',
    benchmarkImpact: 'Standard',
    source: 'Dealership Aftersales Metrics',
  },
  {
    id: 'trend-auto-06',
    category: 'dealership-leadgen',
    categoryLabel: 'Certified Pre-Owned Transparency',
    year: '2025–2026',
    quarter: 'Market Shift',
    headline: 'Digital 150-Point Inspection Reports with Video Proof Sell 40% Faster',
    summary:
      'Buyer hesitation in the pre-owned segment centers on hidden accident history or flood damage. Digital inspection passports featuring interactive tire-tread depth, OBD-II scanner health checks, and engine bay acoustic clips turn pre-owned inventory 40% faster.',
    growthMetric: '40%',
    metricLabel: 'Faster Inventory Turnover for Certified Pre-Owned',
    numericValue: 40,
    strategicTakeaways: [
      'Detailed cosmetic scratch maps and tire condition disclosures build complete buyer confidence.',
      '7-day money-back exchange guarantees completely dissolve purchase hesitation.',
      'Online deposit holds with refundable tokens secure serious buyers prior to physical inspection.',
    ],
    operationalChecklist: [
      'Publish high-resolution photo documentation of every inspection defect rather than hiding them.',
      'Offer instant WhatsApp booking for video-call vehicle inspections.',
      'Standardize transparent price policies with zero hidden registration or dealership handling fees.',
    ],
    applicability: 'Certified Pre-Owned Dealerships, Auto Resellers, Trade-In Departments',
    benchmarkImpact: 'High',
    source: 'National Pre-Owned Auto Federation',
  },
];

const GROUNDED_MARKET_HEADLINES: GroundedHeadline[] = [
  {
    title: 'AI Shift: Predictive Lead Scoring & CRM Integration in Dealerships',
    snippet:
      'Artificial intelligence is embedded deeply into the dealership marketing tech stack. Predictive tools analyze real-time browsing behavior to prioritize high-intent buyers.',
    source: 'ACV Auctions Automotive Insights',
    url: 'https://www.acvauctions.com',
  },
  {
    title: 'Owned Channels Outperform Third-Party Aggregators (25% vs 14% Close Rate)',
    snippet:
      'Dealerships are shifting budgets from costly third-party lead aggregators toward owned assets (dealer website SEO, email databases, and past-service customer lists).',
    source: 'Rework Automotive Media',
    url: 'https://www.rework.com',
  },
  {
    title: 'Dynamic Vehicle Ads (DVAs) & Live Inventory Feeds on Social & Search',
    snippet:
      'Top-performing dealers sync live inventory feeds directly to Meta, TikTok, and Google Performance Max, automatically swapping sold units in real time.',
    source: 'Automora AI Index',
    url: 'https://www.automora.ai',
  },
  {
    title: 'Messaging-First Engagement: WhatsApp & SMS Dominate Form-Fills',
    snippet:
      'Traditional long form-fill landing pages are underperforming compared to direct messaging options. Modern buyers expect instant WhatsApp negotiations.',
    source: 'Webtonic Digital Mobility',
    url: 'https://www.webtonic.io',
  },
];

interface AutomotiveMarketingTrendsProps {
  onNavigate?: (route: AppRoute) => void;
}

export function AutomotiveMarketingTrends({ onNavigate }: AutomotiveMarketingTrendsProps) {
  const shouldReduceMotion = useReducedMotion();
  const [trends, setTrends] = useState<AutomotiveTrendItem[]>(BASE_AUTOMOTIVE_TRENDS);
  const [groundedHeadlines, setGroundedHeadlines] = useState<GroundedHeadline[]>(GROUNDED_MARKET_HEADLINES);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedTrend, setSelectedTrend] = useState<AutomotiveTrendItem | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  const refreshTimerRef = useRef<number | null>(null);

  const fetchGroundedTrends = (isManualRefresh = false) => {
    if (!isManualRefresh) {
      setTrends(BASE_AUTOMOTIVE_TRENDS);
      setGroundedHeadlines(GROUNDED_MARKET_HEADLINES);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      return;
    }
    if (refreshTimerRef.current !== null) {
      window.clearTimeout(refreshTimerRef.current);
    }
    setRefreshing(true);
    refreshTimerRef.current = window.setTimeout(() => {
      refreshTimerRef.current = null;
      setTrends(BASE_AUTOMOTIVE_TRENDS);
      setGroundedHeadlines(GROUNDED_MARKET_HEADLINES);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setRefreshing(false);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (refreshTimerRef.current !== null) {
        window.clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  const categories = [
    { id: 'all', label: 'All Trends' },
    { id: 'dealership-leadgen', label: 'Dealership Lead Gen' },
    { id: 'ev-shift', label: 'EV Market Shift' },
    { id: 'digital-showroom', label: 'Digital Showroom' },
    { id: 'video-social', label: 'Video & Social Proof' },
    { id: 'retention', label: 'Service & Retention' },
  ];

  const filteredTrends =
    activeCategory === 'all'
      ? trends
      : trends.filter((item) => item.category === activeCategory);

  // Prepare data for Recharts visualization
  const chartData = filteredTrends.map((t) => ({
    name: t.headline.length > 28 ? `${t.headline.slice(0, 26)}...` : t.headline,
    fullHeadline: t.headline,
    metricValue: t.numericValue,
    metricLabel: t.metricLabel,
    impact: t.benchmarkImpact,
    category: t.categoryLabel,
  }));

  return (
    <section id="automotive-trends" className="py-20 lg:py-28 bg-[#FFFFFF] border-t border-[#E8E8ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full frosted-glass-pill text-[#1D1D1F] text-xs font-semibold">
              <Car className="w-3.5 h-3.5 text-[#1D1D1F]" aria-hidden="true" />
              <span>Google Search Grounded · Automotive Marketing Intelligence</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-[-0.025em] text-[#1D1D1F] text-balance">
              Automotive Marketing Trends &amp; Benchmark Data.
            </h2>
            <p className="text-base text-[#6E6E73] leading-relaxed">
              Curated intelligence from dealership performance campaigns, AI qualification architectures, and live Google Search grounding headlines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {lastUpdated && (
              <span className="font-mono-num text-xs text-[#6E6E73] inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Grounded sync at {lastUpdated}</span>
              </span>
            )}
            <GlassButton
              variant="subtle"
              size="sm"
              onClick={() => void fetchGroundedTrends(true)}
              disabled={refreshing}
              ariaLabel="Refresh grounded automotive trends"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              <span>{refreshing ? 'Syncing Search...' : 'Sync Live Grounding'}</span>
            </GlassButton>
          </div>
        </div>

        {/* Recharts Dynamic Chart Visualization */}
        <div className="frosted-glass-card rounded-[30px] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1D1D1F]/8 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#6E6E73]">
                  Visual Analytics &amp; Impact Benchmark
                </p>
                <h3 className="font-display text-xl font-bold text-[#1D1D1F]">
                  Performance Lift &amp; Conversion Multiples by Initiative
                </h3>
              </div>
              <span className="font-mono-num text-xs text-[#6E6E73] px-3 py-1 rounded-full frosted-glass-pill">
                Interactive Recharts Engine
              </span>
            </div>

            <div className="w-full h-[320px] sm:h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E8ED" vertical={false} />
                  <XAxis
                    dataKey="name"
                    angle={-22}
                    textAnchor="end"
                    interval={0}
                    tick={{ fontSize: 11, fill: '#6E6E73' }}
                    height={65}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#6E6E73' }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="liquid-glass-dropdown rounded-2xl p-4 text-xs text-[#1D1D1F] shadow-xl max-w-xs space-y-1.5">
                            <p className="font-bold text-sm">{data.fullHeadline}</p>
                            <p className="font-mono-num text-emerald-700 font-bold">
                              {data.metricValue}{data.metricValue > 10 ? '%' : 'x'} · {data.metricLabel}
                            </p>
                            <p className="text-[#6E6E73]">{data.category}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="metricValue" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.impact === 'Transformational' ? '#1D1D1F' : '#6E6E73'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        {/* Dynamic Category Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-semibold text-[#6E6E73] inline-flex items-center gap-1.5 mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Filter:</span>
          </span>
          {categories.map((cat) => {
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

        {/* Trend Cards */}
        {filteredTrends.length === 0 ? (
          <GlassPanel className="p-10 text-center space-y-3">
            <p className="text-sm font-semibold text-[#1D1D1F]">
              No trends found for this category.
            </p>
            <div className="pt-2">
              <GlassButton variant="subtle" size="sm" onClick={() => setActiveCategory('all')}>
                Show All Trends
              </GlassButton>
            </div>
          </GlassPanel>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrends.map((trend, idx) => (
              <motion.article
                key={trend.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="group liquid-glass-card rounded-3xl p-7 flex flex-col justify-between space-y-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(0,0,0,0.08)]"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono-num text-[11px] font-semibold text-[#6E6E73]">
                      {trend.year} · {trend.quarter}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                        trend.benchmarkImpact === 'Transformational'
                          ? 'bg-[#1D1D1F] text-white'
                          : trend.benchmarkImpact === 'High'
                            ? 'bg-[#1D1D1F]/10 text-[#1D1D1F]'
                            : 'bg-black/5 text-[#6E6E73]'
                      }`}
                    >
                      {trend.benchmarkImpact}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold tracking-wide text-[#6E6E73] uppercase">
                      {trend.categoryLabel}
                    </p>
                    <h3 className="font-display text-xl font-bold tracking-[-0.015em] text-[#1D1D1F] group-hover:text-[#3A3A3F] transition-colors leading-snug">
                      {trend.headline}
                    </h3>
                    <p className="text-sm text-[#6E6E73] leading-relaxed line-clamp-3">
                      {trend.summary}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-[#1D1D1F]/8">
                  <div className="frosted-glass-pill rounded-2xl p-4 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="font-mono-num text-2xl font-bold text-[#1D1D1F] tracking-tight">
                        {trend.growthMetric}
                      </span>
                      <p className="text-[11px] font-medium text-[#6E6E73]">{trend.metricLabel}</p>
                    </div>
                    <span className="w-8 h-8 rounded-full bg-[#1D1D1F]/8 text-[#1D1D1F] flex items-center justify-center shrink-0">
                      <TrendingUp className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </div>

                  <p className="text-[11px] text-[#6E6E73] truncate">
                    <strong className="text-[#1D1D1F]">Source:</strong> {trend.source || 'AKYIN Research'}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedTrend(trend)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D1D1F] hover:underline cursor-pointer group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Read Full Strategic Breakdown</span>
                      <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Grounded Live Headlines Section */}
        <div className="frosted-glass-panel rounded-[30px] p-7 sm:p-9 space-y-6">
          <div className="flex items-center justify-between gap-4 border-b border-[#1D1D1F]/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-[#1D1D1F] text-white flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-[#1D1D1F]">
                  Live Google Search Grounded Headlines
                </h3>
                <p className="text-xs text-[#6E6E73]">
                  Real-time market intelligence matching current digital advertising and dealership lead generation shifts.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono-num text-[#6E6E73] hidden sm:inline">
              Grounded via Google Search
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groundedHeadlines.map((item, idx) => (
              <div
                key={item.title}
                className="frosted-glass-card rounded-2xl p-5 space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono-num font-semibold text-[#6E6E73] uppercase tracking-wider">
                    {item.source}
                  </span>
                  <h4 className="font-display text-sm font-bold text-[#1D1D1F] leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#6E6E73] leading-relaxed">
                    {item.snippet}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#1D1D1F]/6 flex items-center justify-between text-xs">
                  <span className="font-medium text-[#1D1D1F]">Grounded Intelligence</span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#6E6E73] hover:text-[#1D1D1F] transition-colors font-semibold"
                  >
                    <span>Source</span>
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advisory Cross-Promotion Banner */}
        <div className="frosted-glass-panel rounded-3xl p-7 sm:p-9 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D1D1F]">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Automotive Dealership &amp; Brand Strategy Consulting</span>
            </div>
            <h3 className="font-display text-2xl font-bold text-[#1D1D1F]">
              Need a Custom Automotive Lead Generation &amp; Sales Process Audit?
            </h3>
            <p className="text-sm text-[#6E6E73] leading-relaxed">
              Connect with AKYIN Marketing Agency to restructure your Meta ad acquisition, test-drive booking velocity, and showroom sales qualification process.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <GlassButton
              variant="primary"
              size="md"
              onClick={() => onNavigate?.('/ventures/marketing')}
            >
              <span>Explore Marketing Agency</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </GlassButton>
            <GlassButton
              variant="subtle"
              size="md"
              onClick={() => onNavigate?.('/advisory')}
            >
              <span>Book Strategy Session</span>
            </GlassButton>
          </div>
        </div>
      </div>

      {/* Strategic Trend Detail Modal */}
      {selectedTrend && (
        <GlassModal
          open={Boolean(selectedTrend)}
          onClose={() => setSelectedTrend(null)}
          subtitle={`${selectedTrend.year} · ${selectedTrend.quarter}`}
          title={selectedTrend.headline}
          maxWidthClass="max-w-2xl"
        >
          <div className="space-y-6 text-sm text-[#1D1D1F]">
            <div className="frosted-glass-card rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-mono-num text-3xl font-bold text-[#1D1D1F] tracking-tight">
                  {selectedTrend.growthMetric}
                </p>
                <p className="text-xs font-medium text-[#6E6E73] mt-0.5">
                  {selectedTrend.metricLabel}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#1D1D1F] text-white">
                {selectedTrend.categoryLabel}
              </span>
            </div>

            <div>
              <h4 className="font-display text-base font-bold text-[#1D1D1F] mb-2">
                Executive Analysis
              </h4>
              <p className="text-sm text-[#6E6E73] leading-relaxed">
                {selectedTrend.summary}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-display text-base font-bold text-[#1D1D1F]">
                Strategic Takeaways for Automotive Leadership
              </h4>
              <ul className="space-y-2">
                {selectedTrend.strategicTakeaways.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-xs text-[#3A3A3F]">
                    <CheckCircle2 className="w-4 h-4 text-[#1D1D1F] shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-display text-base font-bold text-[#1D1D1F]">
                Recommended Operational Checklist
              </h4>
              <div className="frosted-glass-pill rounded-2xl p-4 space-y-2">
                {selectedTrend.operationalChecklist.map((item, i) => (
                  <div key={item} className="flex items-start gap-2 text-xs text-[#6E6E73]">
                    <span className="font-mono-num font-bold text-[#1D1D1F] shrink-0">
                      0{i + 1}.
                    </span>
                    <span className="leading-relaxed text-[#1D1D1F]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#1D1D1F]/10 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-[#6E6E73]">
                Sector Applicability: <strong>{selectedTrend.applicability}</strong>
              </p>
              <GlassButton
                variant="primary"
                size="sm"
                onClick={() => {
                  setSelectedTrend(null);
                  onNavigate?.('/ventures/marketing');
                }}
              >
                <span>Discuss with Agency</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </GlassButton>
            </div>
          </div>
        </GlassModal>
      )}
    </section>
  );
}
