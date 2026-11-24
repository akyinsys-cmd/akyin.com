import { useMemo, useState } from 'react';
import {
  BarChart3,
  Building2,
  CalendarRange,
  Car,
  CheckCircle2,
  Download,
  Gauge,
  IndianRupee,
  MapPin,
  Printer,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { GlassCard, GlassPanel } from './liquid-glass';
import { D3LeadDensityHeatmap } from './D3LeadDensityHeatmap';
import { LeadDensityLegend } from './LeadDensityLegend';

export type VehicleSegmentKey = 'mass-market' | 'suv-mid' | 'luxury-ev';
type ChartView = 'trajectory' | 'comparison';
type BenchmarkScope = 'akyin' | 'national' | 'compare';
type ProjectionHorizon = 3 | 6 | 12;

interface TrajectoryDatum {
  month: string;
  akyinEnquiries: number;
  akyinQualified: number;
  akyinTestDrives: number;
  akyinConversion: number;
  nationalEnquiries: number;
  nationalQualified: number;
  nationalTestDrives: number;
  nationalConversion: number;
}

interface ComparisonDatum {
  kpi: string;
  nationalAverage: number;
  akyinPartner: number;
  unit: string;
  gapLabel: string;
}

type DealershipBaselineProfile = 'legacy' | 'standard' | 'scaling';
type RadarComparisonMode = 'aggregate' | 'multi-location';
type RadarAxisKey = 'Lead Speed' | 'Lead Quality' | 'Test Drive Conversion' | 'Sales Closing Rate';
type DealershipBranchId =
  | 'south-mumbai'
  | 'andheri-west'
  | 'pune-expwy'
  | 'thane-ev'
  | 'nashik-hub';

interface DealershipBranchProfile {
  id: DealershipBranchId;
  name: string;
  shortName: string;
  cityTag: string;
  stroke: string;
  fill: string;
  scores: Record<RadarAxisKey, number>;
  operational: Record<RadarAxisKey, string>;
}

interface PerformanceRadarDatum {
  axis: RadarAxisKey;
  shortLabel: string;
  currentScore: number;
  platinumScore: number;
  currentOperational: string;
  platinumOperational: string;
  impactNote: string;
  qualitativeFeedback: string;
  benchmarkValueDriver: string;
}

interface EnrichedRadarDatum extends PerformanceRadarDatum {
  activeDelta: number;
  branchSpread: number;
  groupAvgScore: number;
  deltaColor: string;
  deltaBg: string;
  deltaBorder: string;
  deltaTierLabel: string;
  'south-mumbai': number;
  'andheri-west': number;
  'pune-expwy': number;
  'thane-ev': number;
  'nashik-hub': number;
}

interface ProjectionDatum {
  monthLabel: string;
  dateLabel: string;
  dateRange: string;
  monthlySpend: number;
  akyinEnquiries: number;
  akyinQualified: number;
  estTestDrives: number;
  nationalEnquiries: number;
  cumulativeQualified: number;
  akyinCpl: number;
  qualifiedCpl: number;
  industryCpl: number;
}

type HeatmapFilter = 'all' | 'suv' | 'ev-luxury' | 'exchange';

interface HeatmapCellDatum {
  x: number;
  y: number;
  region: string;
  zone: string;
  densityPct: number;
  highIntentLeads: number;
  topBuyerIntent: string;
}

const HEATMAP_REGIONS = [
  'Mumbai · Pune',
  'Bengaluru',
  'Delhi · NCR',
  'Hyderabad',
  'Chennai',
  'Jaipur · Tier-2',
];

const HEATMAP_ZONES = [
  'Corridor (25–50 km)',
  'Suburbs (10–25 km)',
  'Showroom Belt (5–10 km)',
  'Core Metro (0–5 km)',
];

const HEATMAP_MATRIX: Record<HeatmapFilter, { label: string; cells: HeatmapCellDatum[] }> = {
  all: {
    label: 'All Dealership Campaigns',
    cells: [
      // Core Metro (y = 3)
      { x: 0, y: 3, region: 'Mumbai · Pune', zone: 'Core Metro (0–5 km)', densityPct: 79, highIntentLeads: 245, topBuyerIntent: 'Mid & Premium SUVs' },
      { x: 1, y: 3, region: 'Bengaluru', zone: 'Core Metro (0–5 km)', densityPct: 82, highIntentLeads: 230, topBuyerIntent: 'EVs & Compact SUVs' },
      { x: 2, y: 3, region: 'Delhi · NCR', zone: 'Core Metro (0–5 km)', densityPct: 75, highIntentLeads: 268, topBuyerIntent: 'Luxury & Executive SUVs' },
      { x: 3, y: 3, region: 'Hyderabad', zone: 'Core Metro (0–5 km)', densityPct: 74, highIntentLeads: 196, topBuyerIntent: 'Automatic SUVs & Sedans' },
      { x: 4, y: 3, region: 'Chennai', zone: 'Core Metro (0–5 km)', densityPct: 71, highIntentLeads: 174, topBuyerIntent: 'Family MPVs & Hatchbacks' },
      { x: 5, y: 3, region: 'Jaipur · Tier-2', zone: 'Core Metro (0–5 km)', densityPct: 76, highIntentLeads: 162, topBuyerIntent: 'Compact SUVs & Festive Buyers' },
      // Showroom Belt (y = 2)
      { x: 0, y: 2, region: 'Mumbai · Pune', zone: 'Showroom Belt (5–10 km)', densityPct: 72, highIntentLeads: 210, topBuyerIntent: 'SUV & Exchange Upgrades' },
      { x: 1, y: 2, region: 'Bengaluru', zone: 'Showroom Belt (5–10 km)', densityPct: 74, highIntentLeads: 198, topBuyerIntent: 'Hybrid & EV Test Drives' },
      { x: 2, y: 2, region: 'Delhi · NCR', zone: 'Showroom Belt (5–10 km)', densityPct: 68, highIntentLeads: 224, topBuyerIntent: 'Multi-Brand Comparisons' },
      { x: 3, y: 2, region: 'Hyderabad', zone: 'Showroom Belt (5–10 km)', densityPct: 69, highIntentLeads: 178, topBuyerIntent: 'IT Corridor Upgrades' },
      { x: 4, y: 2, region: 'Chennai', zone: 'Showroom Belt (5–10 km)', densityPct: 64, highIntentLeads: 152, topBuyerIntent: 'Commuter Hatchbacks' },
      { x: 5, y: 2, region: 'Jaipur · Tier-2', zone: 'Showroom Belt (5–10 km)', densityPct: 67, highIntentLeads: 148, topBuyerIntent: 'First-Time Car Buyers' },
      // Suburbs (y = 1)
      { x: 0, y: 1, region: 'Mumbai · Pune', zone: 'Suburbs (10–25 km)', densityPct: 58, highIntentLeads: 164, topBuyerIntent: 'Value SUVs & Hatchbacks' },
      { x: 1, y: 1, region: 'Bengaluru', zone: 'Suburbs (10–25 km)', densityPct: 61, highIntentLeads: 146, topBuyerIntent: 'Family Crossovers' },
      { x: 2, y: 1, region: 'Delhi · NCR', zone: 'Suburbs (10–25 km)', densityPct: 56, highIntentLeads: 185, topBuyerIntent: 'Sub-Compact SUVs' },
      { x: 3, y: 1, region: 'Hyderabad', zone: 'Suburbs (10–25 km)', densityPct: 53, highIntentLeads: 132, topBuyerIntent: 'Entry Sedans' },
      { x: 4, y: 1, region: 'Chennai', zone: 'Suburbs (10–25 km)', densityPct: 49, highIntentLeads: 118, topBuyerIntent: 'Pre-Owned & Exchanges' },
      { x: 5, y: 1, region: 'Jaipur · Tier-2', zone: 'Suburbs (10–25 km)', densityPct: 59, highIntentLeads: 138, topBuyerIntent: 'Festive Finance Enquiries' },
      // Corridor / Fleet (y = 0)
      { x: 0, y: 0, region: 'Mumbai · Pune', zone: 'Corridor (25–50 km)', densityPct: 44, highIntentLeads: 112, topBuyerIntent: 'Corporate & Fleet Purchases' },
      { x: 1, y: 0, region: 'Bengaluru', zone: 'Corridor (25–50 km)', densityPct: 41, highIntentLeads: 94, topBuyerIntent: 'Airport & Fleet Leases' },
      { x: 2, y: 0, region: 'Delhi · NCR', zone: 'Corridor (25–50 km)', densityPct: 46, highIntentLeads: 126, topBuyerIntent: 'Commercial & Highway Buyers' },
      { x: 3, y: 0, region: 'Hyderabad', zone: 'Corridor (25–50 km)', densityPct: 39, highIntentLeads: 86, topBuyerIntent: 'Executive Mobility' },
      { x: 4, y: 0, region: 'Chennai', zone: 'Corridor (25–50 km)', densityPct: 36, highIntentLeads: 78, topBuyerIntent: 'Industrial Belt Fleet' },
      { x: 5, y: 0, region: 'Jaipur · Tier-2', zone: 'Corridor (25–50 km)', densityPct: 52, highIntentLeads: 118, topBuyerIntent: 'Upcountry Showroom Visits' },
    ],
  },
  suv: {
    label: 'SUV & Mid-Segment',
    cells: [
      { x: 0, y: 3, region: 'Mumbai · Pune', zone: 'Core Metro (0–5 km)', densityPct: 81, highIntentLeads: 142, topBuyerIntent: '7-Seater & Mid SUVs' },
      { x: 1, y: 3, region: 'Bengaluru', zone: 'Core Metro (0–5 km)', densityPct: 77, highIntentLeads: 128, topBuyerIntent: 'Automatic Compact SUVs' },
      { x: 2, y: 3, region: 'Delhi · NCR', zone: 'Core Metro (0–5 km)', densityPct: 83, highIntentLeads: 166, topBuyerIntent: 'Flagship SUVs' },
      { x: 3, y: 3, region: 'Hyderabad', zone: 'Core Metro (0–5 km)', densityPct: 76, highIntentLeads: 118, topBuyerIntent: 'Turbo Petrol SUVs' },
      { x: 4, y: 3, region: 'Chennai', zone: 'Core Metro (0–5 km)', densityPct: 69, highIntentLeads: 96, topBuyerIntent: 'Family Crossovers' },
      { x: 5, y: 3, region: 'Jaipur · Tier-2', zone: 'Core Metro (0–5 km)', densityPct: 79, highIntentLeads: 110, topBuyerIntent: 'Diesel & Highway SUVs' },
      { x: 0, y: 2, region: 'Mumbai · Pune', zone: 'Showroom Belt (5–10 km)', densityPct: 74, highIntentLeads: 124, topBuyerIntent: 'Finance & EMI Upgrades' },
      { x: 1, y: 2, region: 'Bengaluru', zone: 'Showroom Belt (5–10 km)', densityPct: 71, highIntentLeads: 112, topBuyerIntent: 'Tech-Trim Variants' },
      { x: 2, y: 2, region: 'Delhi · NCR', zone: 'Showroom Belt (5–10 km)', densityPct: 75, highIntentLeads: 138, topBuyerIntent: 'Festive SUV Bookings' },
      { x: 3, y: 2, region: 'Hyderabad', zone: 'Showroom Belt (5–10 km)', densityPct: 68, highIntentLeads: 104, topBuyerIntent: 'Corporate Upgrades' },
      { x: 4, y: 2, region: 'Chennai', zone: 'Showroom Belt (5–10 km)', densityPct: 62, highIntentLeads: 84, topBuyerIntent: 'Compact SUVs' },
      { x: 5, y: 2, region: 'Jaipur · Tier-2', zone: 'Showroom Belt (5–10 km)', densityPct: 70, highIntentLeads: 94, topBuyerIntent: 'Exchange-Led SUVs' },
      { x: 0, y: 1, region: 'Mumbai · Pune', zone: 'Suburbs (10–25 km)', densityPct: 60, highIntentLeads: 92, topBuyerIntent: 'Weekend Test Drives' },
      { x: 1, y: 1, region: 'Bengaluru', zone: 'Suburbs (10–25 km)', densityPct: 58, highIntentLeads: 82, topBuyerIntent: 'Sub-4m Crossovers' },
      { x: 2, y: 1, region: 'Delhi · NCR', zone: 'Suburbs (10–25 km)', densityPct: 63, highIntentLeads: 108, topBuyerIntent: 'Family SUVs' },
      { x: 3, y: 1, region: 'Hyderabad', zone: 'Suburbs (10–25 km)', densityPct: 54, highIntentLeads: 76, topBuyerIntent: 'Value Variants' },
      { x: 4, y: 1, region: 'Chennai', zone: 'Suburbs (10–25 km)', densityPct: 48, highIntentLeads: 64, topBuyerIntent: 'Base Trims' },
      { x: 5, y: 1, region: 'Jaipur · Tier-2', zone: 'Suburbs (10–25 km)', densityPct: 61, highIntentLeads: 86, topBuyerIntent: 'Regional Bookings' },
      { x: 0, y: 0, region: 'Mumbai · Pune', zone: 'Corridor (25–50 km)', densityPct: 45, highIntentLeads: 58, topBuyerIntent: 'Expressway Commuters' },
      { x: 1, y: 0, region: 'Bengaluru', zone: 'Corridor (25–50 km)', densityPct: 42, highIntentLeads: 50, topBuyerIntent: 'Tech Park Shuttle' },
      { x: 2, y: 0, region: 'Delhi · NCR', zone: 'Corridor (25–50 km)', densityPct: 49, highIntentLeads: 74, topBuyerIntent: 'NCR Highway Buyers' },
      { x: 3, y: 0, region: 'Hyderabad', zone: 'Corridor (25–50 km)', densityPct: 39, highIntentLeads: 48, topBuyerIntent: 'Outer Ring Buyers' },
      { x: 4, y: 0, region: 'Chennai', zone: 'Corridor (25–50 km)', densityPct: 35, highIntentLeads: 42, topBuyerIntent: 'Corridor Fleet' },
      { x: 5, y: 0, region: 'Jaipur · Tier-2', zone: 'Corridor (25–50 km)', densityPct: 53, highIntentLeads: 70, topBuyerIntent: 'District HQ Enquiries' },
    ],
  },
  'ev-luxury': {
    label: 'EV & Luxury Division',
    cells: [
      { x: 0, y: 3, region: 'Mumbai · Pune', zone: 'Core Metro (0–5 km)', densityPct: 86, highIntentLeads: 96, topBuyerIntent: 'Premium EVs & Luxury SUVs' },
      { x: 1, y: 3, region: 'Bengaluru', zone: 'Core Metro (0–5 km)', densityPct: 89, highIntentLeads: 108, topBuyerIntent: 'Long-Range Electric SUVs' },
      { x: 2, y: 3, region: 'Delhi · NCR', zone: 'Core Metro (0–5 km)', densityPct: 84, highIntentLeads: 102, topBuyerIntent: 'Luxury Sedans & EVs' },
      { x: 3, y: 3, region: 'Hyderabad', zone: 'Core Metro (0–5 km)', densityPct: 78, highIntentLeads: 78, topBuyerIntent: 'Executive Electric' },
      { x: 4, y: 3, region: 'Chennai', zone: 'Core Metro (0–5 km)', densityPct: 72, highIntentLeads: 64, topBuyerIntent: 'Connected EVs' },
      { x: 5, y: 3, region: 'Jaipur · Tier-2', zone: 'Core Metro (0–5 km)', densityPct: 63, highIntentLeads: 46, topBuyerIntent: 'Flagship Hybrid & Luxury' },
      { x: 0, y: 2, region: 'Mumbai · Pune', zone: 'Showroom Belt (5–10 km)', densityPct: 74, highIntentLeads: 76, topBuyerIntent: 'Home Test Drives' },
      { x: 1, y: 2, region: 'Bengaluru', zone: 'Showroom Belt (5–10 km)', densityPct: 79, highIntentLeads: 88, topBuyerIntent: 'Tech Founder EV Leads' },
      { x: 2, y: 2, region: 'Delhi · NCR', zone: 'Showroom Belt (5–10 km)', densityPct: 71, highIntentLeads: 80, topBuyerIntent: 'Gurugram Luxury Showrooms' },
      { x: 3, y: 2, region: 'Hyderabad', zone: 'Showroom Belt (5–10 km)', densityPct: 67, highIntentLeads: 62, topBuyerIntent: 'Jubilee/Gachibowli Leads' },
      { x: 4, y: 2, region: 'Chennai', zone: 'Showroom Belt (5–10 km)', densityPct: 58, highIntentLeads: 48, topBuyerIntent: 'Corporate Lease EVs' },
      { x: 5, y: 2, region: 'Jaipur · Tier-2', zone: 'Showroom Belt (5–10 km)', densityPct: 51, highIntentLeads: 34, topBuyerIntent: 'HNI Showroom Visits' },
      { x: 0, y: 1, region: 'Mumbai · Pune', zone: 'Suburbs (10–25 km)', densityPct: 52, highIntentLeads: 46, topBuyerIntent: 'EV Chargers & EMI' },
      { x: 1, y: 1, region: 'Bengaluru', zone: 'Suburbs (10–25 km)', densityPct: 59, highIntentLeads: 56, topBuyerIntent: 'Outer Tech Corridors' },
      { x: 2, y: 1, region: 'Delhi · NCR', zone: 'Suburbs (10–25 km)', densityPct: 50, highIntentLeads: 48, topBuyerIntent: 'Noida EV Upgrades' },
      { x: 3, y: 1, region: 'Hyderabad', zone: 'Suburbs (10–25 km)', densityPct: 46, highIntentLeads: 38, topBuyerIntent: 'Executive Sedans' },
      { x: 4, y: 1, region: 'Chennai', zone: 'Suburbs (10–25 km)', densityPct: 40, highIntentLeads: 30, topBuyerIntent: 'Entry EVs' },
      { x: 5, y: 1, region: 'Jaipur · Tier-2', zone: 'Suburbs (10–25 km)', densityPct: 34, highIntentLeads: 22, topBuyerIntent: 'Enquiry Discovery' },
      { x: 0, y: 0, region: 'Mumbai · Pune', zone: 'Corridor (25–50 km)', densityPct: 37, highIntentLeads: 28, topBuyerIntent: 'Intercity EV Fleet' },
      { x: 1, y: 0, region: 'Bengaluru', zone: 'Corridor (25–50 km)', densityPct: 39, highIntentLeads: 32, topBuyerIntent: 'Campus EV Programs' },
      { x: 2, y: 0, region: 'Delhi · NCR', zone: 'Corridor (25–50 km)', densityPct: 35, highIntentLeads: 26, topBuyerIntent: 'Chauffeur Luxury' },
      { x: 3, y: 0, region: 'Hyderabad', zone: 'Corridor (25–50 km)', densityPct: 31, highIntentLeads: 20, topBuyerIntent: 'Airport Transfers' },
      { x: 4, y: 0, region: 'Chennai', zone: 'Corridor (25–50 km)', densityPct: 28, highIntentLeads: 18, topBuyerIntent: 'Port Executive Fleet' },
      { x: 5, y: 0, region: 'Jaipur · Tier-2', zone: 'Corridor (25–50 km)', densityPct: 25, highIntentLeads: 16, topBuyerIntent: 'Heritage Hospitality' },
    ],
  },
  exchange: {
    label: 'Exchange & Pre-Owned',
    cells: [
      { x: 0, y: 3, region: 'Mumbai · Pune', zone: 'Core Metro (0–5 km)', densityPct: 73, highIntentLeads: 118, topBuyerIntent: 'Certified Used SUVs' },
      { x: 1, y: 3, region: 'Bengaluru', zone: 'Core Metro (0–5 km)', densityPct: 71, highIntentLeads: 106, topBuyerIntent: '3-Year Exchange Upgrades' },
      { x: 2, y: 3, region: 'Delhi · NCR', zone: 'Core Metro (0–5 km)', densityPct: 76, highIntentLeads: 134, topBuyerIntent: 'Pre-Owned Luxury & SUV' },
      { x: 3, y: 3, region: 'Hyderabad', zone: 'Core Metro (0–5 km)', densityPct: 69, highIntentLeads: 98, topBuyerIntent: 'Warranty Used Cars' },
      { x: 4, y: 3, region: 'Chennai', zone: 'Core Metro (0–5 km)', densityPct: 72, highIntentLeads: 102, topBuyerIntent: 'Hatchback-to-SUV Trades' },
      { x: 5, y: 3, region: 'Jaipur · Tier-2', zone: 'Core Metro (0–5 km)', densityPct: 78, highIntentLeads: 116, topBuyerIntent: 'Festive Exchange Carnivals' },
      { x: 0, y: 2, region: 'Mumbai · Pune', zone: 'Showroom Belt (5–10 km)', densityPct: 75, highIntentLeads: 124, topBuyerIntent: 'Instant Valuation Funnel' },
      { x: 1, y: 2, region: 'Bengaluru', zone: 'Showroom Belt (5–10 km)', densityPct: 72, highIntentLeads: 110, topBuyerIntent: 'Suburban Upgrades' },
      { x: 2, y: 2, region: 'Delhi · NCR', zone: 'Showroom Belt (5–10 km)', densityPct: 74, highIntentLeads: 128, topBuyerIntent: 'Certified Automatic Cars' },
      { x: 3, y: 2, region: 'Hyderabad', zone: 'Showroom Belt (5–10 km)', densityPct: 68, highIntentLeads: 92, topBuyerIntent: 'Pre-Owned Sedans' },
      { x: 4, y: 2, region: 'Chennai', zone: 'Showroom Belt (5–10 km)', densityPct: 69, highIntentLeads: 94, topBuyerIntent: 'Finance Pre-Approved' },
      { x: 5, y: 2, region: 'Jaipur · Tier-2', zone: 'Showroom Belt (5–10 km)', densityPct: 74, highIntentLeads: 104, topBuyerIntent: 'Exchange Bonus Enquiries' },
      { x: 0, y: 1, region: 'Mumbai · Pune', zone: 'Suburbs (10–25 km)', densityPct: 66, highIntentLeads: 96, topBuyerIntent: 'Entry Certified Cars' },
      { x: 1, y: 1, region: 'Bengaluru', zone: 'Suburbs (10–25 km)', densityPct: 64, highIntentLeads: 84, topBuyerIntent: 'Commuter Hatchbacks' },
      { x: 2, y: 1, region: 'Delhi · NCR', zone: 'Suburbs (10–25 km)', densityPct: 67, highIntentLeads: 108, topBuyerIntent: 'Family Upgrades' },
      { x: 3, y: 1, region: 'Hyderabad', zone: 'Suburbs (10–25 km)', densityPct: 61, highIntentLeads: 80, topBuyerIntent: 'Valuation Requests' },
      { x: 4, y: 1, region: 'Chennai', zone: 'Suburbs (10–25 km)', densityPct: 60, highIntentLeads: 76, topBuyerIntent: 'Second-Car Buyers' },
      { x: 5, y: 1, region: 'Jaipur · Tier-2', zone: 'Suburbs (10–25 km)', densityPct: 68, highIntentLeads: 92, topBuyerIntent: 'Regional Used SUVs' },
      { x: 0, y: 0, region: 'Mumbai · Pune', zone: 'Corridor (25–50 km)', densityPct: 54, highIntentLeads: 68, topBuyerIntent: 'Commercial Trade-Ins' },
      { x: 1, y: 0, region: 'Bengaluru', zone: 'Corridor (25–50 km)', densityPct: 49, highIntentLeads: 56, topBuyerIntent: 'Regional Fleet Upgrades' },
      { x: 2, y: 0, region: 'Delhi · NCR', zone: 'Corridor (25–50 km)', densityPct: 57, highIntentLeads: 82, topBuyerIntent: 'Upcountry Used Buyers' },
      { x: 3, y: 0, region: 'Hyderabad', zone: 'Corridor (25–50 km)', densityPct: 47, highIntentLeads: 52, topBuyerIntent: 'Township Upgrades' },
      { x: 4, y: 0, region: 'Chennai', zone: 'Corridor (25–50 km)', densityPct: 45, highIntentLeads: 48, topBuyerIntent: 'Warranty Used Fleet' },
      { x: 5, y: 0, region: 'Jaipur · Tier-2', zone: 'Corridor (25–50 km)', densityPct: 60, highIntentLeads: 78, topBuyerIntent: 'District Exchange Visitors' },
    ],
  },
};

const SEGMENT_RATES: Record<
  VehicleSegmentKey,
  { label: string; avgCplInr: number; qualificationRate: number; testDriveRate: number }
> = {
  'mass-market': {
    label: 'Volume & Hatchbacks',
    avgCplInr: 220,
    qualificationRate: 0.62,
    testDriveRate: 0.42,
  },
  'suv-mid': {
    label: 'Mid-Segment & SUVs',
    avgCplInr: 340,
    qualificationRate: 0.64,
    testDriveRate: 0.46,
  },
  'luxury-ev': {
    label: 'Luxury & Premium EVs',
    avgCplInr: 720,
    qualificationRate: 0.58,
    testDriveRate: 0.48,
  },
};

const SIX_MONTH_TRAJECTORY: TrajectoryDatum[] = [
  {
    month: 'Month 1',
    akyinEnquiries: 320,
    akyinQualified: 158,
    akyinTestDrives: 52,
    akyinConversion: 16.3,
    nationalEnquiries: 290,
    nationalQualified: 98,
    nationalTestDrives: 34,
    nationalConversion: 11.7,
  },
  {
    month: 'Month 2',
    akyinEnquiries: 410,
    akyinQualified: 230,
    akyinTestDrives: 88,
    akyinConversion: 21.5,
    nationalEnquiries: 295,
    nationalQualified: 101,
    nationalTestDrives: 36,
    nationalConversion: 12.2,
  },
  {
    month: 'Month 3',
    akyinEnquiries: 525,
    akyinQualified: 315,
    akyinTestDrives: 132,
    akyinConversion: 25.1,
    nationalEnquiries: 305,
    nationalQualified: 104,
    nationalTestDrives: 37,
    nationalConversion: 12.1,
  },
  {
    month: 'Month 4',
    akyinEnquiries: 640,
    akyinQualified: 404,
    akyinTestDrives: 176,
    akyinConversion: 27.5,
    nationalEnquiries: 310,
    nationalQualified: 108,
    nationalTestDrives: 38,
    nationalConversion: 12.3,
  },
  {
    month: 'Month 5',
    akyinEnquiries: 745,
    akyinQualified: 486,
    akyinTestDrives: 222,
    akyinConversion: 29.8,
    nationalEnquiries: 308,
    nationalQualified: 106,
    nationalTestDrives: 39,
    nationalConversion: 12.7,
  },
  {
    month: 'Month 6',
    akyinEnquiries: 860,
    akyinQualified: 568,
    akyinTestDrives: 268,
    akyinConversion: 31.2,
    nationalEnquiries: 315,
    nationalQualified: 110,
    nationalTestDrives: 40,
    nationalConversion: 12.7,
  },
];

const PIPELINE_COMPARISON: ComparisonDatum[] = [
  {
    kpi: 'Lead-to-Showroom Visit',
    nationalAverage: 12,
    akyinPartner: 31,
    unit: '%',
    gapLabel: '+19 pts AKYIN Partner Advantage',
  },
  {
    kpi: 'Test Drive Completion',
    nationalAverage: 34,
    akyinPartner: 72,
    unit: '%',
    gapLabel: '2.1x higher showroom test drives',
  },
  {
    kpi: 'Qualified Lead Share',
    nationalAverage: 36,
    akyinPartner: 66,
    unit: '%',
    gapLabel: 'Filters out spam & window shoppers',
  },
  {
    kpi: 'Executive Follow-Up SLA',
    nationalAverage: 42,
    akyinPartner: 91,
    unit: '%',
    gapLabel: 'Sub-5 min instant routing & coaching',
  },
];

const PERFORMANCE_RADAR_PROFILES: Record<
  DealershipBaselineProfile,
  {
    label: string;
    description: string;
    metrics: PerformanceRadarDatum[];
  }
> = {
  legacy: {
    label: 'Unfiltered Ad Account',
    description: 'Manual spreadsheet follow-up with broad form-fill ad targeting',
    metrics: [
      {
        axis: 'Lead Speed',
        shortLabel: 'Lead Speed',
        currentScore: 34,
        platinumScore: 96,
        currentOperational: '4.5 hrs avg callback',
        platinumOperational: '<3 min instant WhatsApp & CRM routing',
        impactNote: 'Eliminates 62% lead decay after first 15 minutes',
        qualitativeFeedback:
          'Delayed manual CSV downloads mean warm car buyers already book test drives with competing showrooms before your first call.',
        benchmarkValueDriver:
          'AKYIN Platinum routing triggers automated WhatsApp model brochures and assigns a live floor advisor inside 180 seconds.',
      },
      {
        axis: 'Lead Quality',
        shortLabel: 'Lead Quality',
        currentScore: 38,
        platinumScore: 93,
        currentOperational: '31% showroom-eligible',
        platinumOperational: '74%+ OTP & purchase-window verified',
        impactNote: 'Pre-screens budget tier and exchange readiness',
        qualitativeFeedback:
          'Broad lead forms attract out-of-budget browsers and invalid numbers, draining sales executive morale on low-intent cold calls.',
        benchmarkValueDriver:
          'AKYIN two-tier qualification filters out noise before leads enter the showroom CRM, lifting floor productivity 2.4x.',
      },
      {
        axis: 'Test Drive Conversion',
        shortLabel: 'Test Drive Conversion',
        currentScore: 32,
        platinumScore: 91,
        currentOperational: '29% test-drive turn-up',
        platinumOperational: '72% confirmed slot attendance',
        impactNote: 'Automated map pins & 2-hour showroom reminders',
        qualitativeFeedback:
          'Verbal appointment promises frequently slip without structured time-slot confirmation or doorstep demo coordination.',
        benchmarkValueDriver:
          'AKYIN Platinum confirmation sequences lock calendar slots with showroom directions and trade-in pre-checks.',
      },
      {
        axis: 'Sales Closing Rate',
        shortLabel: 'Sales Closing Rate',
        currentScore: 36,
        platinumScore: 89,
        currentOperational: '10.5% visit-to-booking',
        platinumOperational: '26.4% guided sales closing',
        impactNote: 'Structured executive follow-up through finance & delivery',
        qualitativeFeedback:
          'Walk-in prospects often leave unclosed when executives lack pre-visit variant, EMI, and exchange intent context.',
        benchmarkValueDriver:
          'AKYIN sales floor coaching + post-drive nurture cadences turn hesitant comparers into confirmed showroom bookings.',
      },
    ],
  },
  standard: {
    label: 'Standard Regional Dealer',
    description: 'Active CRM & Meta campaigns without two-tier intent qualification',
    metrics: [
      {
        axis: 'Lead Speed',
        shortLabel: 'Lead Speed',
        currentScore: 48,
        platinumScore: 96,
        currentOperational: '55 min avg callback',
        platinumOperational: '<3 min instant WhatsApp & CRM routing',
        impactNote: 'Real-time BDC escalation recovers evening inquiries',
        qualitativeFeedback:
          'Sub-hour responses during weekday business hours still miss evening and weekend peak browsing windows when buyers compare models.',
        benchmarkValueDriver:
          'AKYIN always-on SLA bots engage buyers instantaneously 7 days a week so zero peak-hour demand goes cold.',
      },
      {
        axis: 'Lead Quality',
        shortLabel: 'Lead Quality',
        currentScore: 46,
        platinumScore: 93,
        currentOperational: '41% showroom-eligible',
        platinumOperational: '74%+ OTP & purchase-window verified',
        impactNote: 'Cuts window-shopper calls for showroom executives',
        qualitativeFeedback:
          'Raw Meta/Search leads mix 6-month researchers with immediate buyers, forcing your BDC team to spend half the day sifting.',
        benchmarkValueDriver:
          'AKYIN intent scoring tags purchase timeline, variant preference, and finance readiness prior to showroom handoff.',
      },
      {
        axis: 'Test Drive Conversion',
        shortLabel: 'Test Drive Conversion',
        currentScore: 44,
        platinumScore: 91,
        currentOperational: '38% test-drive turn-up',
        platinumOperational: '72% confirmed slot attendance',
        impactNote: 'Pre-booked doorstep or showroom demo scheduling',
        qualitativeFeedback:
          'Standard reminder calls suffer high no-show rates whenever weekend showroom traffic or competitor offers intervene.',
        benchmarkValueDriver:
          'AKYIN Platinum WhatsApp slot passes + automated rescheduling rescue nearly 2x more confirmed weekend test drives.',
      },
      {
        axis: 'Sales Closing Rate',
        shortLabel: 'Sales Closing Rate',
        currentScore: 45,
        platinumScore: 89,
        currentOperational: '14.2% visit-to-booking',
        platinumOperational: '26.4% guided sales closing',
        impactNote: 'Variant & trade-in context passed before buyer arrives',
        qualitativeFeedback:
          'Sales teams close walk-ins well but struggle to re-engage undecided test-drive visitors beyond Day 3.',
        benchmarkValueDriver:
          'AKYIN CRM attribution pairs executive follow-up scripts with retargeting creative tailored to the exact model driven.',
      },
    ],
  },
  scaling: {
    label: 'Multi-Rooftop Showrooms',
    description: 'High enquiry volume needing faster response SLA & closing consistency',
    metrics: [
      {
        axis: 'Lead Speed',
        shortLabel: 'Lead Speed',
        currentScore: 60,
        platinumScore: 96,
        currentOperational: '22 min avg callback',
        platinumOperational: '<3 min instant WhatsApp & CRM routing',
        impactNote: 'Cross-rooftop load balancing prevents queue backlogs',
        qualitativeFeedback:
          'High festive campaign bursts overwhelm single-desk BDC queues, causing inconsistent callback times across satellite rooftops.',
        benchmarkValueDriver:
          'AKYIN automated SLA overflow routing balances buyer enquiries by pin-code and real-time advisor availability.',
      },
      {
        axis: 'Lead Quality',
        shortLabel: 'Lead Quality',
        currentScore: 56,
        platinumScore: 93,
        currentOperational: '52% showroom-eligible',
        platinumOperational: '74%+ OTP & purchase-window verified',
        impactNote: 'Dynamic budget & fuel-type tagging boosts floor focus',
        qualitativeFeedback:
          'Multi-brand groups often lose cross-shoppers when leads aren’t segmented cleanly across EV, SUV, and exchange desks.',
        benchmarkValueDriver:
          'AKYIN Platinum segmentation routes each verified buyer straight to the matching specialist desk with zero friction.',
      },
      {
        axis: 'Test Drive Conversion',
        shortLabel: 'Test Drive Conversion',
        currentScore: 54,
        platinumScore: 91,
        currentOperational: '48% test-drive turn-up',
        platinumOperational: '72% confirmed slot attendance',
        impactNote: 'Dedicated weekend drive slot recovery sequences',
        qualitativeFeedback:
          'Fleet availability mismatches and unconfirmed branch transfers quietly erode multi-rooftop test-drive completion.',
        benchmarkValueDriver:
          'AKYIN centralized drive slot orchestration guarantees confirmed demo vehicle readiness before the customer arrives.',
      },
      {
        axis: 'Sales Closing Rate',
        shortLabel: 'Sales Closing Rate',
        currentScore: 58,
        platinumScore: 89,
        currentOperational: '18.6% visit-to-booking',
        platinumOperational: '26.4% guided sales closing',
        impactNote: 'Weekly creative-to-booking attribution tuning',
        qualitativeFeedback:
          'Closing performance varies widely between flagship metro stores and regional outlets without unified objection-handling standards.',
        benchmarkValueDriver:
          'AKYIN weekly floor audits and closing playbooks lift underperforming rooftops toward Platinum-tier conversion.',
      },
    ],
  },
};

const DEALERSHIP_GROUP_BRANCHES: DealershipBranchProfile[] = [
  {
    id: 'south-mumbai',
    name: 'South Mumbai Flagship',
    shortName: 'S. Mumbai',
    cityTag: 'Flagship · Worli',
    stroke: '#2563EB',
    fill: '#3B82F6',
    scores: {
      'Lead Speed': 84,
      'Lead Quality': 79,
      'Test Drive Conversion': 72,
      'Sales Closing Rate': 76,
    },
    operational: {
      'Lead Speed': '6 min avg response',
      'Lead Quality': '66% showroom-eligible',
      'Test Drive Conversion': '60% slot attendance',
      'Sales Closing Rate': '22.4% booking rate',
    },
  },
  {
    id: 'andheri-west',
    name: 'Andheri West Hub',
    shortName: 'Andheri W.',
    cityTag: 'Suburban · West',
    stroke: '#059669',
    fill: '#10B981',
    scores: {
      'Lead Speed': 74,
      'Lead Quality': 68,
      'Test Drive Conversion': 65,
      'Sales Closing Rate': 58,
    },
    operational: {
      'Lead Speed': '14 min avg response',
      'Lead Quality': '58% showroom-eligible',
      'Test Drive Conversion': '54% slot attendance',
      'Sales Closing Rate': '17.8% booking rate',
    },
  },
  {
    id: 'pune-expwy',
    name: 'Pune Expressway Store',
    shortName: 'Pune Exp.',
    cityTag: 'Metro Corridor',
    stroke: '#D97706',
    fill: '#F59E0B',
    scores: {
      'Lead Speed': 49,
      'Lead Quality': 52,
      'Test Drive Conversion': 46,
      'Sales Closing Rate': 50,
    },
    operational: {
      'Lead Speed': '44 min avg response',
      'Lead Quality': '45% showroom-eligible',
      'Test Drive Conversion': '40% slot attendance',
      'Sales Closing Rate': '14.9% booking rate',
    },
  },
  {
    id: 'thane-ev',
    name: 'Thane EV & SUV Annex',
    shortName: 'Thane EV',
    cityTag: 'EV Specialty',
    stroke: '#0891B2',
    fill: '#06B6D4',
    scores: {
      'Lead Speed': 66,
      'Lead Quality': 74,
      'Test Drive Conversion': 48,
      'Sales Closing Rate': 57,
    },
    operational: {
      'Lead Speed': '19 min avg response',
      'Lead Quality': '62% showroom-eligible',
      'Test Drive Conversion': '42% slot attendance',
      'Sales Closing Rate': '17.2% booking rate',
    },
  },
  {
    id: 'nashik-hub',
    name: 'Nashik Regional Outlet',
    shortName: 'Nashik',
    cityTag: 'Tier-2 Growth',
    stroke: '#E11D48',
    fill: '#F43F5E',
    scores: {
      'Lead Speed': 42,
      'Lead Quality': 55,
      'Test Drive Conversion': 53,
      'Sales Closing Rate': 47,
    },
    operational: {
      'Lead Speed': '65 min avg response',
      'Lead Quality': '47% showroom-eligible',
      'Test Drive Conversion': '45% slot attendance',
      'Sales Closing Rate': '13.8% booking rate',
    },
  },
];

const getDeltaTierStyle = (delta: number) => {
  if (delta < 25) {
    return {
      color: '#059669',
      bg: '#ECFDF5',
      border: '#A7F3D0',
      label: 'Near Platinum (<25 pts)',
    };
  }
  if (delta < 45) {
    return {
      color: '#7C3AED',
      bg: '#F5F3FF',
      border: '#DDD6FE',
      label: 'Moderate Gap (25–44 pts)',
    };
  }
  return {
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
    label: 'Priority Gap (45+ pts)',
  };
};

interface AutomotiveResultsSectionProps {
  monthlyBudget: number;
  segmentId: VehicleSegmentKey;
  onChangeBudget?: (budget: number) => void;
}

export function AutomotiveResultsSection({
  monthlyBudget,
  segmentId,
  onChangeBudget,
}: AutomotiveResultsSectionProps) {
  const [chartView, setChartView] = useState<ChartView>('trajectory');
  const [benchmarkScope, setBenchmarkScope] = useState<BenchmarkScope>('compare');
  const [projectionHorizon, setProjectionHorizon] = useState<ProjectionHorizon>(6);
  const [heatmapFilter, setHeatmapFilter] = useState<HeatmapFilter>('all');
  const [radarProfile, setRadarProfile] = useState<DealershipBaselineProfile>('standard');
  const [radarMode, setRadarMode] = useState<RadarComparisonMode>('aggregate');
  const [selectedBranchIds, setSelectedBranchIds] = useState<DealershipBranchId[]>([
    'south-mumbai',
    'andheri-west',
    'pune-expwy',
  ]);
  const [showBenchmarkAnnotations, setShowBenchmarkAnnotations] = useState<boolean>(true);

  const segment = SEGMENT_RATES[segmentId];
  const activeRadarProfile = PERFORMANCE_RADAR_PROFILES[radarProfile];

  const selectedBranches = useMemo(
    () =>
      DEALERSHIP_GROUP_BRANCHES.filter((branch) => selectedBranchIds.includes(branch.id)),
    [selectedBranchIds]
  );

  const handleToggleBranch = (branchId: DealershipBranchId) => {
    setSelectedBranchIds((prev) => {
      if (prev.includes(branchId)) {
        return prev.length > 1 ? prev.filter((id) => id !== branchId) : prev;
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, branchId];
    });
  };

  const handleExportRadarPdf = () => {
    document.body.classList.add('printing-performance-radar');

    const cleanup = () => {
      document.body.classList.remove('printing-performance-radar');
      window.removeEventListener('afterprint', cleanup);
    };

    window.addEventListener('afterprint', cleanup);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.print();
        window.setTimeout(cleanup, 1500);
      });
    });
  };

  const radarChartData = useMemo<EnrichedRadarDatum[]>(() => {
    const branchLookup = Object.fromEntries(
      DEALERSHIP_GROUP_BRANCHES.map((b) => [b.id, b])
    ) as Record<DealershipBranchId, DealershipBranchProfile>;

    return activeRadarProfile.metrics.map((metric) => {
      const branchScores = selectedBranches.map((branch) => branch.scores[metric.axis]);
      const avgBranchScore =
        branchScores.length > 0
          ? Math.round(branchScores.reduce((acc, val) => acc + val, 0) / branchScores.length)
          : metric.currentScore;
      const spread =
        branchScores.length > 1
          ? Math.max(...branchScores) - Math.min(...branchScores)
          : 0;

      const delta =
        radarMode === 'multi-location'
          ? Math.max(0, metric.platinumScore - avgBranchScore)
          : Math.max(0, metric.platinumScore - metric.currentScore);
      const tier = getDeltaTierStyle(delta);

      return {
        ...metric,
        activeDelta: delta,
        branchSpread: spread,
        groupAvgScore: avgBranchScore,
        deltaColor: tier.color,
        deltaBg: tier.bg,
        deltaBorder: tier.border,
        deltaTierLabel: tier.label,
        'south-mumbai': branchLookup['south-mumbai'].scores[metric.axis],
        'andheri-west': branchLookup['andheri-west'].scores[metric.axis],
        'pune-expwy': branchLookup['pune-expwy'].scores[metric.axis],
        'thane-ev': branchLookup['thane-ev'].scores[metric.axis],
        'nashik-hub': branchLookup['nashik-hub'].scores[metric.axis],
      };
    });
  }, [activeRadarProfile, radarMode, selectedBranches]);

  const radarSummary = useMemo(() => {
    const avgCurrent = Math.round(
      radarChartData.reduce(
        (sum, item) =>
          sum + (radarMode === 'multi-location' ? item.groupAvgScore : item.currentScore),
        0
      ) / radarChartData.length
    );
    const avgPlatinum = Math.round(
      radarChartData.reduce((sum, item) => sum + item.platinumScore, 0) /
        radarChartData.length
    );
    const largestGap = radarChartData.reduce(
      (best, item) => (item.activeDelta > best.activeDelta ? item : best),
      radarChartData[0]
    );
    const maxSpread = Math.max(...radarChartData.map((item) => item.branchSpread));
    const consistencyScore = Math.max(0, 100 - maxSpread);

    return {
      avgCurrent,
      avgPlatinum,
      avgUplift: Math.max(0, avgPlatinum - avgCurrent),
      largestGap,
      maxSpread,
      consistencyScore,
    };
  }, [radarChartData, radarMode]);

  const kpiCards = useMemo(() => {
    if (benchmarkScope === 'national') {
      return [
        {
          label: 'Lead-to-Showroom Rate',
          value: '12.7%',
          detail: 'National Average across unfiltered automotive dealer campaigns',
          badge: 'National Avg',
          icon: Users,
          accentClass: 'bg-slate-100 text-slate-700',
        },
        {
          label: 'Test Drive Completion',
          value: '34.0%',
          detail: 'Typical showroom test-drive show-up rate without SMS/WhatsApp reminders',
          badge: 'National Avg',
          icon: Car,
          accentClass: 'bg-slate-100 text-slate-700',
        },
        {
          label: '6-Month Enquiry Growth',
          value: '+8.6%',
          detail: 'Flat seasonal trajectory without algorithmic creative & funnel iteration',
          badge: 'National Avg',
          icon: TrendingUp,
          accentClass: 'bg-slate-100 text-slate-700',
        },
      ];
    }

    return [
      {
        label: 'Lead-to-Showroom Rate',
        value: '31.2%',
        detail:
          benchmarkScope === 'compare'
            ? '+18.5 pts above National Avg (12.7%) via two-tier lead qualification'
            : 'Up from 16.3% Month-1 baseline via two-tier lead qualification',
        badge: benchmarkScope === 'compare' ? '+18.5 pts Gap' : 'AKYIN Partner',
        icon: Users,
        accentClass: 'bg-purple-100/80 text-purple-700',
      },
      {
        label: 'Test Drive Completion',
        value: '72.0%',
        detail:
          benchmarkScope === 'compare'
            ? '2.1x National Avg (34%) via dedicated booking & WhatsApp slot reminders'
            : 'Dedicated test-drive booking & automated WhatsApp slot reminders',
        badge: benchmarkScope === 'compare' ? '2.1x Benchmark' : 'AKYIN Partner',
        icon: Car,
        accentClass: 'bg-amber-100/80 text-amber-800',
      },
      {
        label: '6-Month Enquiry Growth',
        value: '+168%',
        detail:
          benchmarkScope === 'compare'
            ? 'Outpaces +8.6% National Avg through geo-fenced creative optimization'
            : 'Geo-fenced Meta & Search capture scaled steadily over 6 months',
        badge: benchmarkScope === 'compare' ? '+159 pts Gap' : 'AKYIN Partner',
        icon: TrendingUp,
        accentClass: 'bg-emerald-100/80 text-emerald-700',
      },
    ];
  }, [benchmarkScope]);

  const projectionData = useMemo<ProjectionDatum[]>(() => {
    const safeBudget = Math.max(25000, Math.min(2000000, monthlyBudget || 150000));
    const baseEnquiries = safeBudget / segment.avgCplInr;
    const rows: ProjectionDatum[] = [];
    let cumulativeQualified = 0;
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const baseYear = 2026;
    const baseMonthIndex = 10; // November 2026

    for (let m = 1; m <= projectionHorizon; m++) {
      // Compounding optimization factor as pixel & qualification feedback mature
      const optimizationMultiplier = 1 + Math.min(0.68, (m - 1) * 0.068);
      const akyinEnquiries = Math.round(baseEnquiries * optimizationMultiplier);
      const qualEfficiency = Math.min(0.74, segment.qualificationRate + (m - 1) * 0.01);
      const akyinQualified = Math.round(akyinEnquiries * qualEfficiency);
      const estTestDrives = Math.round(akyinQualified * segment.testDriveRate);
      const nationalEnquiries = Math.round(baseEnquiries * (0.86 + (m % 2) * 0.02));
      cumulativeQualified += akyinQualified;

      const akyinCpl = Math.round(safeBudget / Math.max(1, akyinEnquiries));
      const qualifiedCpl = Math.round(safeBudget / Math.max(1, akyinQualified));
      const industryCpl = Math.round(
        segment.avgCplInr * (1.16 + Math.min(0.18, (m - 1) * 0.015))
      );

      const periodStart = new Date(baseYear, baseMonthIndex + (m - 1), 1);
      const periodEnd = new Date(
        periodStart.getFullYear(),
        periodStart.getMonth() + 1,
        0
      );
      const shortMonth = monthNames[periodStart.getMonth()];
      const yearNum = periodStart.getFullYear();
      const dateLabel = `${shortMonth} ${yearNum}`;
      const dateRange = `01 ${shortMonth} – ${String(periodEnd.getDate()).padStart(2, '0')} ${shortMonth} ${yearNum}`;

      rows.push({
        monthLabel: `M${m}`,
        dateLabel,
        dateRange,
        monthlySpend: safeBudget,
        akyinEnquiries,
        akyinQualified,
        estTestDrives,
        nationalEnquiries,
        cumulativeQualified,
        akyinCpl,
        qualifiedCpl,
        industryCpl,
      });
    }
    return rows;
  }, [monthlyBudget, projectionHorizon, segment]);

  const projectionTotals = useMemo(() => {
    const totalRaw = projectionData.reduce((sum, r) => sum + r.akyinEnquiries, 0);
    const totalQualified = projectionData.reduce((sum, r) => sum + r.akyinQualified, 0);
    const totalNational = projectionData.reduce((sum, r) => sum + r.nationalEnquiries, 0);
    const estTestDrives = Math.round(totalQualified * segment.testDriveRate);
    const startCpl = projectionData[0]?.akyinCpl ?? segment.avgCplInr;
    const endCpl = projectionData[projectionData.length - 1]?.akyinCpl ?? segment.avgCplInr;
    const cplReductionPct = Math.max(0, Math.round(((startCpl - endCpl) / startCpl) * 100));
    const volumeUpliftPct = Math.max(
      0,
      Math.round(
        (((projectionData[projectionData.length - 1]?.akyinEnquiries ?? 0) -
          (projectionData[0]?.akyinEnquiries ?? 1)) /
          Math.max(1, projectionData[0]?.akyinEnquiries ?? 1)) *
          100
      )
    );
    return {
      totalRaw,
      totalQualified,
      totalNational,
      estTestDrives,
      startCpl,
      endCpl,
      cplReductionPct,
      volumeUpliftPct,
    };
  }, [projectionData, segment.avgCplInr, segment.testDriveRate]);

  const activeHeatmap = HEATMAP_MATRIX[heatmapFilter];
  const heatmapSummary = useMemo(() => {
    const cells = activeHeatmap.cells;
    const totalLeads = cells.reduce((acc, c) => acc + c.highIntentLeads, 0);
    const avgDensity = Math.round(
      cells.reduce((acc, c) => acc + c.densityPct, 0) / cells.length
    );
    const peakCell = cells.reduce(
      (best, c) => (c.densityPct > best.densityPct ? c : best),
      cells[0]
    );
    return { totalLeads, avgDensity, peakCell };
  }, [activeHeatmap]);

  const formatInr = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);

  const escapeCsvCell = (value: string | number): string => {
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const triggerCsvDownload = (
    filename: string,
    headers: string[],
    rows: Array<Array<string | number>>
  ) => {
    const csvLines = [
      headers.map(escapeCsvCell).join(','),
      ...rows.map((row) => row.map(escapeCsvCell).join(',')),
    ];
    const blob = new Blob(['\uFEFF' + csvLines.join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleDownloadEnquiryProjectionCsv = () => {
    const headers = [
      'Month Index',
      'Period',
      'Date Range',
      'Vehicle Segment',
      'Monthly Ad Budget (INR)',
      'AKYIN Forecasted Enquiries',
      'AKYIN Qualified Showroom Leads',
      'Cumulative Qualified Leads',
      'Estimated Showroom Test Drives',
      'National Avg Baseline Enquiries',
      'Enquiry Volume Advantage vs National (%)',
    ];
    const rows = projectionData.map((d) => {
      const advantagePct = Math.max(
        0,
        Math.round(
          ((d.akyinEnquiries - d.nationalEnquiries) / Math.max(1, d.nationalEnquiries)) * 100
        )
      );
      return [
        d.monthLabel,
        d.dateLabel,
        d.dateRange,
        segment.label,
        d.monthlySpend,
        d.akyinEnquiries,
        d.akyinQualified,
        d.cumulativeQualified,
        d.estTestDrives,
        d.nationalEnquiries,
        `${advantagePct}%`,
      ];
    });
    triggerCsvDownload(
      `akyin-enquiry-projection-${segmentId}-${projectionHorizon}m.csv`,
      headers,
      rows
    );
  };

  const handleDownloadCplVolumeCsv = () => {
    const headers = [
      'Month Index',
      'Period',
      'Date Range',
      'Vehicle Segment',
      'Monthly Ad Spend (INR)',
      'Total Enquiry Volume',
      'Qualified Showroom Leads',
      'Estimated Test Drives',
      'AKYIN Partner CPL (INR)',
      'Cost Per Qualified Lead (INR)',
      'Industry Avg CPL (INR)',
      'Savings Per Lead (INR)',
      'CPL Reduction vs Industry (%)',
    ];
    const rows = projectionData.map((d) => {
      const savingsPerLead = Math.max(0, d.industryCpl - d.akyinCpl);
      const savingsPct = Math.max(
        0,
        Math.round((savingsPerLead / Math.max(1, d.industryCpl)) * 100)
      );
      return [
        d.monthLabel,
        d.dateLabel,
        d.dateRange,
        segment.label,
        d.monthlySpend,
        d.akyinEnquiries,
        d.akyinQualified,
        d.estTestDrives,
        d.akyinCpl,
        d.qualifiedCpl,
        d.industryCpl,
        savingsPerLead,
        `${savingsPct}%`,
      ];
    });
    triggerCsvDownload(
      `akyin-cpl-volume-trend-${segmentId}-${projectionHorizon}m.csv`,
      headers,
      rows
    );
  };

  return (
    <section
      id="automotive-results"
      className="py-20 lg:py-28 bg-[#FFFFFF] border-t border-[#E8E8ED]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header + Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full frosted-glass-pill text-xs font-semibold text-[#1D1D1F]">
              <BarChart3 className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
              <span>Dealership Benchmark Performance · Recharts Analytics</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
              Automotive Results Across the Showroom Funnel.
            </h2>
            <p className="text-base text-[#6E6E73] leading-relaxed">
              Toggle between <strong className="text-[#1D1D1F]">National Average</strong> and{' '}
              <strong className="text-[#1D1D1F]">AKYIN Partner</strong> benchmarks to inspect the performance gap, and forecast enquiry growth across 3, 6, and 12-month horizons.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 self-start lg:self-auto">
            {/* Benchmark Scope Toggle */}
            <div
              role="group"
              aria-label="Toggle benchmark dataset"
              className="inline-flex p-1.5 rounded-2xl frosted-glass border border-[#E8E8ED]"
            >
              {[
                { id: 'national' as BenchmarkScope, label: 'National Average' },
                { id: 'akyin' as BenchmarkScope, label: 'AKYIN Partner' },
                { id: 'compare' as BenchmarkScope, label: 'Compare Gap' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={benchmarkScope === opt.id}
                  onClick={() => setBenchmarkScope(opt.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    benchmarkScope === opt.id
                      ? 'liquid-glass-pill-dark text-white shadow-xs'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Chart Mode Switcher */}
            <div
              role="tablist"
              aria-label="Automotive results visualization mode"
              className="inline-flex p-1.5 rounded-2xl frosted-glass border border-[#E8E8ED]"
            >
              <button
                type="button"
                role="tab"
                aria-selected={chartView === 'trajectory'}
                onClick={() => setChartView('trajectory')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  chartView === 'trajectory'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                6-Month Trajectory
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={chartView === 'comparison'}
                onClick={() => setChartView('comparison')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  chartView === 'comparison'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                Efficiency Breakdown
              </button>
            </div>
          </div>
        </div>

        {/* Summary KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kpiCards.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <GlassCard key={kpi.label} className="p-6 sm:p-7 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                    {kpi.label}
                  </span>
                  <span
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${kpi.accentClass}`}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-mono-num text-3xl sm:text-4xl font-bold text-[#1D1D1F] tracking-tight">
                    {kpi.value}
                  </p>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full frosted-glass-pill text-[#1D1D1F]">
                    {kpi.badge}
                  </span>
                </div>
                <p className="text-xs text-[#6E6E73] leading-relaxed">{kpi.detail}</p>
              </GlassCard>
            );
          })}
        </div>

        {/* Main Benchmark Recharts Panel */}
        <GlassPanel className="p-6 sm:p-8 space-y-6 bg-gradient-to-br from-white via-purple-50/25 to-amber-50/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E8ED] pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                {chartView === 'trajectory'
                  ? `Benchmark View: ${
                      benchmarkScope === 'national'
                        ? 'National Average Dealership Baseline'
                        : benchmarkScope === 'akyin'
                          ? 'AKYIN Partner Dealership Performance'
                          : 'National Average vs. AKYIN Partner Performance Gap'
                    }`
                  : 'Operational Efficiency Comparison (%)'}
              </p>
              <h3 className="font-display text-xl font-bold text-[#1D1D1F] mt-0.5">
                {chartView === 'trajectory'
                  ? 'Enquiry Growth, Test Drives & Lead-to-Showroom Conversion Rate'
                  : 'Dealership Pipeline Benchmarks Across Core Conversion Metrics'}
              </h3>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6E6E73] bg-white/80 px-3 py-1.5 rounded-full border border-[#E8E8ED]">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
              <span>Interactive Benchmark Graph</span>
            </span>
          </div>

          <div className="w-full h-[340px] sm:h-[390px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartView === 'trajectory' ? (
                <ComposedChart
                  data={SIX_MONTH_TRAJECTORY}
                  margin={{ top: 16, right: 20, left: 4, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E8ED" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: '#6E6E73' }}
                    axisLine={{ stroke: '#E8E8ED' }}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 12, fill: '#6E6E73' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    unit="%"
                    domain={[0, 40]}
                    tick={{ fontSize: 12, fill: '#7C3AED' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload || payload.length === 0) return null;
                      const datum = payload[0].payload as TrajectoryDatum;
                      return (
                        <div className="liquid-glass-dropdown rounded-2xl p-4 text-xs text-[#1D1D1F] shadow-xl space-y-2 min-w-[240px]">
                          <p className="font-display text-sm font-bold text-[#1D1D1F] border-b border-[#1D1D1F]/10 pb-1.5">
                            {label} Benchmark Comparison
                          </p>
                          {(benchmarkScope === 'akyin' || benchmarkScope === 'compare') && (
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                                AKYIN Partner Dealership
                              </p>
                              <div className="flex justify-between gap-4">
                                <span className="text-[#6E6E73]">Qualified Leads</span>
                                <span className="font-mono-num font-bold">
                                  {datum.akyinQualified}
                                </span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span className="text-[#6E6E73]">Test Drives</span>
                                <span className="font-mono-num font-bold text-amber-700">
                                  {datum.akyinTestDrives}
                                </span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span className="text-[#6E6E73]">Conversion Rate</span>
                                <span className="font-mono-num font-bold text-emerald-700">
                                  {datum.akyinConversion}%
                                </span>
                              </div>
                            </div>
                          )}
                          {(benchmarkScope === 'national' || benchmarkScope === 'compare') && (
                            <div
                              className={`space-y-1 ${
                                benchmarkScope === 'compare' ? 'pt-2 border-t border-[#1D1D1F]/10' : ''
                              }`}
                            >
                              <p className="text-[10px] font-bold uppercase tracking-wider text-[#6E6E73]">
                                National Dealership Average
                              </p>
                              <div className="flex justify-between gap-4">
                                <span className="text-[#6E6E73]">Qualified Leads</span>
                                <span className="font-mono-num font-semibold">
                                  {datum.nationalQualified}
                                </span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span className="text-[#6E6E73]">Test Drives</span>
                                <span className="font-mono-num font-semibold">
                                  {datum.nationalTestDrives}
                                </span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span className="text-[#6E6E73]">Conversion Rate</span>
                                <span className="font-mono-num font-semibold">
                                  {datum.nationalConversion}%
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />

                  {(benchmarkScope === 'national' || benchmarkScope === 'compare') && (
                    <>
                      <Bar
                        yAxisId="left"
                        dataKey="nationalQualified"
                        name="National Avg Qualified Leads"
                        fill="#D1D1D6"
                        radius={[6, 6, 0, 0]}
                        barSize={benchmarkScope === 'compare' ? 18 : 26}
                      />
                      <Bar
                        yAxisId="left"
                        dataKey="nationalTestDrives"
                        name="National Avg Test Drives"
                        fill="#94A3B8"
                        radius={[6, 6, 0, 0]}
                        barSize={benchmarkScope === 'compare' ? 18 : 26}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="nationalConversion"
                        name="National Avg Conversion (%)"
                        stroke="#64748B"
                        strokeWidth={2.5}
                        strokeDasharray="5 5"
                        dot={{ r: 3.5, fill: '#64748B' }}
                      />
                    </>
                  )}

                  {(benchmarkScope === 'akyin' || benchmarkScope === 'compare') && (
                    <>
                      <Bar
                        yAxisId="left"
                        dataKey="akyinQualified"
                        name="AKYIN Partner Qualified Leads"
                        fill="#1D1D1F"
                        radius={[6, 6, 0, 0]}
                        barSize={benchmarkScope === 'compare' ? 18 : 26}
                      />
                      <Bar
                        yAxisId="left"
                        dataKey="akyinTestDrives"
                        name="AKYIN Partner Test Drives"
                        fill="#F59E0B"
                        radius={[6, 6, 0, 0]}
                        barSize={benchmarkScope === 'compare' ? 18 : 26}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="akyinConversion"
                        name="AKYIN Partner Conversion (%)"
                        stroke="#7C3AED"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#7C3AED', strokeWidth: 2, stroke: '#FFFFFF' }}
                        activeDot={{ r: 6 }}
                      />
                    </>
                  )}
                </ComposedChart>
              ) : (
                <BarChart
                  data={PIPELINE_COMPARISON}
                  margin={{ top: 16, right: 20, left: 4, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E8ED" vertical={false} />
                  <XAxis
                    dataKey="kpi"
                    tick={{ fontSize: 12, fill: '#6E6E73' }}
                    axisLine={{ stroke: '#E8E8ED' }}
                    tickLine={false}
                  />
                  <YAxis
                    unit="%"
                    domain={[0, 100]}
                    tick={{ fontSize: 12, fill: '#6E6E73' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || payload.length === 0) return null;
                      const datum = payload[0].payload as ComparisonDatum;
                      return (
                        <div className="liquid-glass-dropdown rounded-2xl p-4 text-xs text-[#1D1D1F] shadow-xl space-y-2 min-w-[230px]">
                          <p className="font-display text-sm font-bold text-[#1D1D1F]">
                            {datum.kpi}
                          </p>
                          {(benchmarkScope === 'national' || benchmarkScope === 'compare') && (
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-[#6E6E73]">National Average</span>
                              <span className="font-mono-num font-semibold">
                                {datum.nationalAverage}
                                {datum.unit}
                              </span>
                            </div>
                          )}
                          {(benchmarkScope === 'akyin' || benchmarkScope === 'compare') && (
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-purple-700 font-semibold">AKYIN Partner</span>
                              <span className="font-mono-num font-bold text-purple-700">
                                {datum.akyinPartner}
                                {datum.unit}
                              </span>
                            </div>
                          )}
                          <p className="text-[11px] font-semibold text-emerald-700 pt-1 border-t border-[#1D1D1F]/10">
                            {datum.gapLabel}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                  {(benchmarkScope === 'national' || benchmarkScope === 'compare') && (
                    <Bar
                      dataKey="nationalAverage"
                      name="National Average (%)"
                      fill="#D1D1D6"
                      radius={[8, 8, 0, 0]}
                      barSize={36}
                    />
                  )}
                  {(benchmarkScope === 'akyin' || benchmarkScope === 'compare') && (
                    <Bar
                      dataKey="akyinPartner"
                      name="AKYIN Partner (%)"
                      fill="#7C3AED"
                      radius={[8, 8, 0, 0]}
                      barSize={36}
                    />
                  )}
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </GlassPanel>

        {/* Performance Radar: Dealership Current vs. AKYIN Platinum Partner Benchmark */}
        <div id="performance-radar-panel">
        <GlassPanel
          className="p-6 sm:p-8 space-y-6 bg-gradient-to-br from-white via-purple-50/20 to-amber-50/15 relative"
        >
          <div className="hidden print-confidential-watermark" aria-hidden="true">
            AKYIN Confidential
          </div>
          {/* Print-Only Presentation Masthead (Visible only during scoped PDF export) */}
          <div className="hidden radar-print-masthead">
            <div className="radar-print-brand">
              <img
                src="/assets/aistudio/akyin_logo_clean.png"
                alt="AKYIN Ventures"
                className="radar-print-logo"
              />
              <div>
                <p className="radar-print-kicker">AKYIN AUTOMOTIVE MARKETING DIVISION</p>
                <p className="radar-print-subkicker">
                  Dealership Presentation Slide · Performance Radar Benchmark ({segment.label})
                </p>
              </div>
            </div>
            <div className="radar-print-meta">
              <span>
                {radarMode === 'multi-location'
                  ? `Multi-Location (${selectedBranches.map((b) => b.shortName).join(' · ')})`
                  : `Baseline: ${activeRadarProfile.label}`}
              </span>
              <span>·</span>
              <span>Target: Platinum Partner</span>
            </div>
          </div>

          <div className="flex flex-col gap-5 border-b border-[#E8E8ED] pb-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700">
                  <Gauge className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Capability Index · Recharts Performance Radar</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-[#1D1D1F]">
                  {radarMode === 'multi-location'
                    ? 'Performance Radar: Multi-Location Branch Consistency'
                    : 'Performance Radar: Current Dealership vs. Platinum Partner'}
                </h3>
                <p className="text-xs sm:text-sm text-[#6E6E73]">
                  {radarMode === 'multi-location'
                    ? 'Compare up to three branches across Apex Motors Group against AKYIN’s Platinum Partner standard to uncover regional execution gaps.'
                    : 'Inspect color-coded axis delta markers and hover over vertices for qualitative diagnostics comparing your showroom against AKYIN’s Platinum Partner standard.'}
                </p>
              </div>

              {/* Primary Mode Switcher + Benchmark Annotation Toggle + Export PDF */}
              <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto shrink-0 radar-print-hide">
                <div
                  role="tablist"
                  aria-label="Performance radar comparison view"
                  className="inline-flex p-1 rounded-xl frosted-glass border border-[#E8E8ED]"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={radarMode === 'aggregate'}
                    onClick={() => setRadarMode('aggregate')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      radarMode === 'aggregate'
                        ? 'liquid-glass-pill-dark text-white shadow-xs'
                        : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                    }`}
                  >
                    Aggregate View
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={radarMode === 'multi-location'}
                    onClick={() => setRadarMode('multi-location')}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      radarMode === 'multi-location'
                        ? 'bg-purple-700 text-white shadow-xs'
                        : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Multi-Location Comparison</span>
                  </button>
                </div>

                <button
                  type="button"
                  aria-pressed={showBenchmarkAnnotations}
                  onClick={() => setShowBenchmarkAnnotations((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    showBenchmarkAnnotations
                      ? 'bg-purple-50 border-purple-300 text-purple-800'
                      : 'bg-white border-[#E8E8ED] text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      showBenchmarkAnnotations ? 'bg-purple-600' : 'bg-[#A1A1A6]'
                    }`}
                    aria-hidden="true"
                  />
                  <span>Benchmark Annotations</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportRadarPdf}
                  aria-label="Export Performance Radar benchmark chart as presentation PDF"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E8E8ED] hover:border-[#1D1D1F]/35 hover:bg-[#F5F5F7] text-xs font-semibold text-[#1D1D1F] transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>

            {/* Sub-Control Bar: Aggregate Baseline Profiles OR Multi-Location Branch Selector (Max 3) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 radar-print-hide">
              {radarMode === 'aggregate' ? (
                <div
                  role="group"
                  aria-label="Select current dealership performance baseline"
                  className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl frosted-glass border border-[#E8E8ED] self-start"
                >
                  {(Object.keys(PERFORMANCE_RADAR_PROFILES) as DealershipBaselineProfile[]).map(
                    (profileKey) => {
                      const isSelected = radarProfile === profileKey;
                      return (
                        <button
                          key={profileKey}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => setRadarProfile(profileKey)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                            isSelected
                              ? 'liquid-glass-pill-dark text-white shadow-xs'
                              : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                          }`}
                        >
                          {PERFORMANCE_RADAR_PROFILES[profileKey].label}
                        </button>
                      );
                    }
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-[#1D1D1F]">
                      Select Dealership Group Branches (Up to 3)
                    </span>
                    <span className="font-mono-num tabular-nums text-xs font-semibold text-purple-700">
                      {selectedBranchIds.length} / 3 branches active
                    </span>
                  </div>
                  <div
                    role="group"
                    aria-label="Select up to three dealership branches to compare"
                    className="flex flex-wrap gap-2"
                  >
                    {DEALERSHIP_GROUP_BRANCHES.map((branch) => {
                      const active = selectedBranchIds.includes(branch.id);
                      const disabled = !active && selectedBranchIds.length >= 3;
                      return (
                        <button
                          key={branch.id}
                          type="button"
                          disabled={disabled}
                          aria-pressed={active}
                          onClick={() => handleToggleBranch(branch.id)}
                          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                            active
                              ? 'bg-white border-[#1D1D1F] text-[#1D1D1F] shadow-xs cursor-pointer'
                              : disabled
                                ? 'bg-[#F5F5F7] border-[#E8E8ED] text-[#A1A1A6] cursor-not-allowed opacity-65'
                                : 'bg-white/75 border-[#E8E8ED] text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-white cursor-pointer'
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: active ? branch.stroke : '#CBD5E1' }}
                            aria-hidden="true"
                          />
                          <span>{branch.name}</span>
                          <span className="text-[10.5px] font-normal text-[#6E6E73]">
                            {branch.cityTag}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center radar-print-grid">
            {/* Radar Chart Canvas + Benchmark Annotation Key */}
            <div className="lg:col-span-7 space-y-3">
              <div className="w-full h-[360px] sm:h-[410px] radar-print-chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="60%"
                    margin={{ top: 32, right: 86, bottom: 38, left: 86 }}
                    data={radarChartData}
                  >
                    <PolarGrid stroke="#E2E2E8" />
                    <PolarAngleAxis
                      dataKey="axis"
                      tick={(tickProps: {
                        x?: string | number;
                        y?: string | number;
                        cx?: string | number;
                        cy?: string | number;
                        payload?: { value?: string };
                      }) => {
                        const x = Number(tickProps.x ?? 0);
                        const y = Number(tickProps.y ?? 0);
                        const cx = Number(tickProps.cx ?? 0);
                        const cy = Number(tickProps.cy ?? 0);
                        const axisLabel = String(tickProps.payload?.value ?? '');
                        const datum = radarChartData.find((d) => d.axis === axisLabel);

                        const dx = x - cx;
                        const dy = y - cy;
                        const isTop = dy < -20;
                        const isBottom = dy > 20;
                        const isRight = dx > 20;
                        const isLeft = dx < -20;

                        const anchor: 'start' | 'end' | 'middle' = isRight
                          ? 'start'
                          : isLeft
                            ? 'end'
                            : 'middle';

                        const labelX = isRight ? x + 6 : isLeft ? x - 6 : x;
                        const labelY = isTop ? y - 16 : isBottom ? y + 10 : y - 4;
                        const badgeText = datum
                          ? `${radarMode === 'multi-location' ? 'Avg ' : ''}-${datum.activeDelta} pts`
                          : '';
                        const badgeWidth = radarMode === 'multi-location' ? 94 : 74;
                        const badgeY = labelY + 7;
                        const badgeX =
                          anchor === 'middle'
                            ? labelX - badgeWidth / 2
                            : anchor === 'start'
                              ? labelX
                              : labelX - badgeWidth;

                        return (
                          <g>
                            <text
                              x={labelX}
                              y={labelY}
                              textAnchor={anchor}
                              fill="#1D1D1F"
                              fontSize={12}
                              fontWeight={700}
                              style={{ fontFamily: 'var(--font-sans)' }}
                            >
                              {axisLabel}
                            </text>
                            {showBenchmarkAnnotations && datum && (
                              <g>
                                <rect
                                  x={badgeX}
                                  y={badgeY}
                                  width={badgeWidth}
                                  height={19}
                                  rx={6}
                                  fill={datum.deltaBg}
                                  stroke={datum.deltaBorder}
                                  strokeWidth={1}
                                />
                                <circle
                                  cx={badgeX + 9}
                                  cy={badgeY + 9.5}
                                  r={3.2}
                                  fill={datum.deltaColor}
                                />
                                <text
                                  x={badgeX + 16}
                                  y={badgeY + 13}
                                  fill={datum.deltaColor}
                                  fontSize={10}
                                  fontWeight={700}
                                  style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontVariantNumeric: 'tabular-nums',
                                  }}
                                >
                                  {badgeText}
                                </text>
                              </g>
                            )}
                          </g>
                        );
                      }}
                    />
                    <PolarRadiusAxis
                      angle={45}
                      domain={[0, 100]}
                      tickCount={5}
                      tick={{ fontSize: 10, fill: '#6E6E73' }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload || payload.length === 0) return null;
                        const datum = payload[0].payload as EnrichedRadarDatum;

                        if (radarMode === 'multi-location') {
                          return (
                            <div className="liquid-glass-dropdown rounded-2xl p-4 text-xs text-[#1D1D1F] shadow-xl space-y-2.5 max-w-[335px]">
                              <div className="flex items-center justify-between gap-3 border-b border-[#1D1D1F]/10 pb-1.5">
                                <p className="font-display text-sm font-bold text-[#1D1D1F]">
                                  {datum.axis}
                                </p>
                                <span
                                  className="font-mono-num tabular-nums text-[11px] font-bold"
                                  style={{ color: datum.deltaColor }}
                                >
                                  Group Avg -{datum.activeDelta} pts
                                </span>
                              </div>

                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between gap-3 rounded-lg bg-purple-50/80 border border-purple-200/80 px-2.5 py-1.5">
                                  <span className="font-semibold text-purple-800">
                                    AKYIN Platinum Partner
                                  </span>
                                  <span className="font-mono-num tabular-nums font-bold text-purple-700">
                                    {datum.platinumScore} / 100
                                  </span>
                                </div>

                                {selectedBranches.map((branch) => {
                                  const branchVal = branch.scores[datum.axis];
                                  const deltaToPlatinum = datum.platinumScore - branchVal;
                                  return (
                                    <div
                                      key={branch.id}
                                      className="flex items-center justify-between gap-3 px-1"
                                    >
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        <span
                                          className="w-2 h-2 rounded-full shrink-0"
                                          style={{ backgroundColor: branch.stroke }}
                                          aria-hidden="true"
                                        />
                                        <span className="font-medium text-[#1D1D1F] truncate">
                                          {branch.name}
                                        </span>
                                      </div>
                                      <span className="font-mono-num tabular-nums font-bold text-[#1D1D1F] shrink-0">
                                        {branchVal}{' '}
                                        <span className="text-[10.5px] font-medium text-[#6E6E73]">
                                          (-{deltaToPlatinum})
                                        </span>
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>

                              <div className="pt-1.5 border-t border-[#1D1D1F]/10 space-y-1">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-[#6E6E73]">Cross-Branch Spread</span>
                                  <span className="font-mono-num tabular-nums font-bold text-amber-700">
                                    {datum.branchSpread} pts variance
                                  </span>
                                </div>
                                <p className="text-[11px] text-purple-950 leading-relaxed">
                                  {datum.benchmarkValueDriver}
                                </p>
                              </div>
                            </div>
                          );
                        }

                        const gap = datum.platinumScore - datum.currentScore;
                        return (
                          <div className="liquid-glass-dropdown rounded-2xl p-4 text-xs text-[#1D1D1F] shadow-xl space-y-2.5 max-w-[320px]">
                            <div className="flex items-center justify-between gap-3 border-b border-[#1D1D1F]/10 pb-1.5">
                              <p className="font-display text-sm font-bold text-[#1D1D1F]">
                                {datum.axis}
                              </p>
                              <span
                                className="font-mono-num tabular-nums text-[11px] font-bold"
                                style={{ color: datum.deltaColor }}
                              >
                                +{gap} pts upside
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                              <div className="rounded-xl bg-white/80 border border-[#E8E8ED] p-2">
                                <p className="text-[#6E6E73] font-medium">Current Dealer</p>
                                <p className="font-mono-num tabular-nums text-sm font-bold text-[#1D1D1F]">
                                  {datum.currentScore} / 100
                                </p>
                                <p className="text-[10.5px] text-[#6E6E73] mt-0.5 leading-snug">
                                  {datum.currentOperational}
                                </p>
                              </div>
                              <div className="rounded-xl bg-purple-50/80 border border-purple-200/80 p-2">
                                <p className="text-purple-700 font-semibold">Platinum Target</p>
                                <p className="font-mono-num tabular-nums text-sm font-bold text-purple-700">
                                  {datum.platinumScore} / 100
                                </p>
                                <p className="text-[10.5px] text-purple-900/80 mt-0.5 leading-snug">
                                  {datum.platinumOperational}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-1 pt-1.5 border-t border-[#1D1D1F]/10">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-[#6E6E73]">
                                Current Bottleneck Assessment
                              </p>
                              <p className="text-[11px] text-[#1D1D1F] leading-relaxed">
                                {datum.qualitativeFeedback}
                              </p>
                            </div>

                            <div className="space-y-1 pt-1.5 border-t border-[#1D1D1F]/10">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                                AKYIN Platinum Advantage
                              </p>
                              <p className="text-[11px] text-purple-950 leading-relaxed">
                                {datum.benchmarkValueDriver}
                              </p>
                              <p className="text-[10.5px] font-semibold text-emerald-700">
                                {datum.impactNote}
                              </p>
                            </div>
                          </div>
                        );
                      }}
                    />

                    {radarMode === 'aggregate' ? (
                      <Radar
                        name="Current Dealership Performance"
                        dataKey="currentScore"
                        stroke="#64748B"
                        strokeWidth={2.2}
                        fill="#94A3B8"
                        fillOpacity={0.28}
                        dot={{ r: 4, fill: '#64748B', stroke: '#FFFFFF', strokeWidth: 1.5 }}
                        activeDot={{ r: 6.5, fill: '#1D1D1F', stroke: '#FFFFFF', strokeWidth: 2 }}
                      />
                    ) : (
                      selectedBranches.map((branch) => (
                        <Radar
                          key={branch.id}
                          name={branch.name}
                          dataKey={branch.id}
                          stroke={branch.stroke}
                          strokeWidth={2.3}
                          fill={branch.fill}
                          fillOpacity={0.14}
                          dot={{
                            r: 4,
                            fill: branch.stroke,
                            stroke: '#FFFFFF',
                            strokeWidth: 1.5,
                          }}
                          activeDot={{
                            r: 6.5,
                            fill: branch.stroke,
                            stroke: '#FFFFFF',
                            strokeWidth: 2,
                          }}
                        />
                      ))
                    )}

                    <Radar
                      name="AKYIN Platinum Partner Benchmark"
                      dataKey="platinumScore"
                      stroke="#7C3AED"
                      strokeWidth={2.8}
                      strokeDasharray={radarMode === 'multi-location' ? '6 3' : undefined}
                      fill="#8B5CF6"
                      fillOpacity={radarMode === 'multi-location' ? 0.16 : 0.34}
                      dot={{ r: 4.5, fill: '#7C3AED', stroke: '#FFFFFF', strokeWidth: 1.5 }}
                      activeDot={{ r: 7, fill: '#7C3AED', stroke: '#FFFFFF', strokeWidth: 2 }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '6px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Benchmark Annotation Color-Coded Key */}
              {showBenchmarkAnnotations && (
                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-2xl bg-white/85 border border-[#E8E8ED] px-4 py-2.5 text-[11px]">
                  <span className="font-semibold text-[#1D1D1F]">
                    Axis Delta Marker Key:
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" aria-hidden="true" />
                    Near Platinum (&lt;25 pts)
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-purple-700 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600" aria-hidden="true" />
                    Moderate Gap (25–44 pts)
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-amber-700 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600" aria-hidden="true" />
                    Priority Gap (45+ pts)
                  </span>
                </div>
              )}
            </div>

            {/* Side-by-Side Pillar Breakdown */}
            <div className="lg:col-span-5 space-y-4">
              {radarMode === 'aggregate' ? (
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl p-3.5 bg-white border border-[#E8E8ED]">
                    <p className="text-[11px] font-medium text-[#6E6E73]">Current Index</p>
                    <p className="font-mono-num tabular-nums text-2xl font-bold text-[#1D1D1F] mt-0.5">
                      {radarSummary.avgCurrent}
                      <span className="text-xs font-normal text-[#6E6E73]">/100</span>
                    </p>
                  </div>
                  <div className="rounded-2xl p-3.5 bg-purple-50/60 border border-purple-200/80">
                    <p className="text-[11px] font-medium text-purple-900">Platinum Avg</p>
                    <p className="font-mono-num tabular-nums text-2xl font-bold text-purple-700 mt-0.5">
                      {radarSummary.avgPlatinum}
                      <span className="text-xs font-normal text-purple-700/70">/100</span>
                    </p>
                  </div>
                  <div className="rounded-2xl p-3.5 bg-emerald-50/60 border border-emerald-200/80">
                    <p className="text-[11px] font-medium text-emerald-900">Net Uplift</p>
                    <p className="font-mono-num tabular-nums text-2xl font-bold text-emerald-700 mt-0.5">
                      +{radarSummary.avgUplift}
                      <span className="text-xs font-normal text-emerald-700/80"> pts</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl p-3.5 bg-white border border-[#E8E8ED]">
                    <p className="text-[11px] font-medium text-[#6E6E73]">Group Avg</p>
                    <p className="font-mono-num tabular-nums text-2xl font-bold text-[#1D1D1F] mt-0.5">
                      {radarSummary.avgCurrent}
                      <span className="text-xs font-normal text-[#6E6E73]">/100</span>
                    </p>
                  </div>
                  <div className="rounded-2xl p-3.5 bg-amber-50/60 border border-amber-200/80">
                    <p className="text-[11px] font-medium text-amber-900">Consistency</p>
                    <p className="font-mono-num tabular-nums text-2xl font-bold text-amber-800 mt-0.5">
                      {radarSummary.consistencyScore}%
                    </p>
                  </div>
                  <div className="rounded-2xl p-3.5 bg-purple-50/60 border border-purple-200/80">
                    <p className="text-[11px] font-medium text-purple-900">Max Spread</p>
                    <p className="font-mono-num tabular-nums text-2xl font-bold text-purple-700 mt-0.5">
                      {radarSummary.maxSpread}
                      <span className="text-xs font-normal text-purple-700/70"> pts</span>
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2.5">
                {radarChartData.map((metric) => {
                  if (radarMode === 'multi-location') {
                    const ranked = [...selectedBranches].sort(
                      (a, b) => b.scores[metric.axis] - a.scores[metric.axis]
                    );
                    const leader = ranked[0];
                    const laggard = ranked[ranked.length - 1];
                    return (
                      <div
                        key={metric.axis}
                        className="rounded-2xl p-3.5 bg-white border border-[#E8E8ED] space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-[#1D1D1F]">{metric.axis}</span>
                          <span
                            className="font-mono-num tabular-nums text-xs font-bold"
                            style={{ color: metric.deltaColor }}
                          >
                            Avg -{metric.activeDelta} pts vs. Platinum
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#6E6E73]">
                          <span>
                            Lead:{' '}
                            <strong className="text-[#1D1D1F]">
                              {leader.shortName} ({leader.scores[metric.axis]})
                            </strong>
                          </span>
                          {selectedBranches.length > 1 && (
                            <span>
                              Gap store:{' '}
                              <strong className="text-amber-800">
                                {laggard.shortName} ({laggard.scores[metric.axis]})
                              </strong>
                            </span>
                          )}
                          <span className="font-mono-num tabular-nums font-semibold text-purple-700">
                            Platinum: {metric.platinumScore}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={metric.axis}
                      className="rounded-2xl p-3.5 bg-white border border-[#E8E8ED] space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#1D1D1F]">{metric.axis}</span>
                        <span
                          className="font-mono-num tabular-nums text-xs font-bold"
                          style={{ color: metric.deltaColor }}
                        >
                          +{metric.activeDelta} pts vs. current
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#6E6E73]">
                        <span>
                          Current:{' '}
                          <strong className="font-mono-num tabular-nums text-[#1D1D1F]">
                            {metric.currentScore}
                          </strong>{' '}
                          ({metric.currentOperational})
                        </span>
                        <span className="font-mono-num tabular-nums font-semibold text-purple-700">
                          Platinum: {metric.platinumScore}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-[#6E6E73] leading-snug pt-0.5">
                        {metric.impactNote}
                      </p>
                    </div>
                  );
                })}
              </div>

              <p className="text-[11px] text-[#6E6E73] leading-relaxed">
                {radarMode === 'multi-location' ? (
                  <>
                    Active group branches:{' '}
                    <strong className="text-[#1D1D1F]">
                      {selectedBranches.map((b) => b.name).join(', ')}
                    </strong>
                    . Highest group upside:{' '}
                    <strong className="text-purple-700">{radarSummary.largestGap.axis}</strong>.
                  </>
                ) : (
                  <>
                    Baseline profile:{' '}
                    <strong className="text-[#1D1D1F]">{activeRadarProfile.label}</strong> —{' '}
                    {activeRadarProfile.description}. Biggest immediate opportunity:{' '}
                    <strong className="text-purple-700">{radarSummary.largestGap.axis}</strong>.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Print-Only Presentation Footer */}
          <div className="hidden radar-print-footer">
            <span>AKYIN Group · Automotive Dealership Performance Benchmark</span>
            <span>Segment: {segment.label} · Prepared for Executive Review</span>
          </div>
        </GlassPanel>
        </div>

        {/* Enquiry Trend Projection Recharts AreaChart (3, 6, and 12-Month Budget Forecast) */}
        <GlassPanel className="p-6 sm:p-8 space-y-6 bg-gradient-to-br from-purple-50/35 via-white to-amber-50/25">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-[#E8E8ED] pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-purple-700">
                <CalendarRange className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Synced with Dealership Budget Settings · {segment.label}</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-[#1D1D1F]">
                Enquiry Trend Projection ({projectionHorizon}-Month Forecast)
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6E73]">
                Forecasted monthly lead volume growth at{' '}
                <strong className="font-mono-num text-[#1D1D1F]">
                  {formatInr(monthlyBudget)}/mo
                </strong>{' '}
                comparing AKYIN optimization compounding vs. flat National Average returns.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {onChangeBudget && (
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#E8E8ED]">
                  <IndianRupee className="w-3.5 h-3.5 text-[#6E6E73]" aria-hidden="true" />
                  <select
                    aria-label="Quick select monthly ad budget for forecast"
                    value={monthlyBudget}
                    onChange={(e) => onChangeBudget(Number(e.target.value))}
                    className="text-xs font-mono-num font-bold text-[#1D1D1F] bg-transparent focus:outline-none cursor-pointer"
                  >
                    {[75000, 150000, 300000, 500000, 750000].includes(monthlyBudget) ? null : (
                      <option value={monthlyBudget}>{formatInr(monthlyBudget)}/mo</option>
                    )}
                    <option value={75000}>₹75,000/mo</option>
                    <option value={150000}>₹1,50,000/mo</option>
                    <option value={300000}>₹3,00,000/mo</option>
                    <option value={500000}>₹5,00,000/mo</option>
                    <option value={750000}>₹7,50,000/mo</option>
                  </select>
                </div>
              )}

              <div
                role="group"
                aria-label="Select forecast horizon"
                className="inline-flex p-1 rounded-xl frosted-glass border border-[#E8E8ED]"
              >
                {([3, 6, 12] as ProjectionHorizon[]).map((months) => (
                  <button
                    key={months}
                    type="button"
                    aria-pressed={projectionHorizon === months}
                    onClick={() => setProjectionHorizon(months)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-num font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      projectionHorizon === months
                        ? 'liquid-glass-pill-dark text-white shadow-xs'
                        : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                    }`}
                  >
                    {months} Months
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleDownloadEnquiryProjectionCsv}
                aria-label={`Download ${projectionHorizon}-month enquiry trend projection as CSV`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E8E8ED] hover:border-[#1D1D1F]/35 hover:bg-[#F5F5F7] text-xs font-semibold text-[#1D1D1F] transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
                <span>Download CSV</span>
              </button>
            </div>
          </div>

          {/* Projection Summary Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="frosted-glass-pill rounded-2xl p-4 border border-[#E8E8ED]">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73]">
                {projectionHorizon}-Mo Total Enquiries
              </p>
              <p className="font-mono-num text-2xl font-bold text-[#1D1D1F] mt-1">
                {projectionTotals.totalRaw.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="frosted-glass-pill rounded-2xl p-4 border border-purple-200/70 bg-purple-50/40">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-700">
                Qualified Leads Forecast
              </p>
              <p className="font-mono-num text-2xl font-bold text-purple-700 mt-1">
                {projectionTotals.totalQualified.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="frosted-glass-pill rounded-2xl p-4 border border-amber-200/70 bg-amber-50/40">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-800">
                Projected Test Drives
              </p>
              <p className="font-mono-num text-2xl font-bold text-amber-800 mt-1">
                {projectionTotals.estTestDrives.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="frosted-glass-pill rounded-2xl p-4 border border-[#E8E8ED]">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73]">
                vs. National Avg Volume
              </p>
              <p className="font-mono-num text-2xl font-bold text-emerald-700 mt-1">
                +
                {Math.max(
                  0,
                  Math.round(
                    ((projectionTotals.totalRaw - projectionTotals.totalNational) /
                      Math.max(1, projectionTotals.totalNational)) *
                      100
                  )
                )}
                %
              </p>
            </div>
          </div>

          <div className="w-full h-[320px] sm:h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={projectionData}
                margin={{ top: 16, right: 20, left: 4, bottom: 8 }}
              >
                <defs>
                  <linearGradient id="projTotalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.03} />
                  </linearGradient>
                  <linearGradient id="projQualifiedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1D1D1F" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#1D1D1F" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="projNationalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E8ED" vertical={false} />
                <XAxis
                  dataKey="monthLabel"
                  tick={{ fontSize: 12, fill: '#6E6E73' }}
                  axisLine={{ stroke: '#E8E8ED' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#6E6E73' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload || payload.length === 0) return null;
                    const datum = payload[0].payload as ProjectionDatum;
                    return (
                      <div className="liquid-glass-dropdown rounded-2xl p-4 text-xs text-[#1D1D1F] shadow-xl space-y-2 min-w-[230px]">
                        <p className="font-display text-sm font-bold text-[#1D1D1F] border-b border-[#1D1D1F]/10 pb-1.5">
                          {label} Forecast ({formatInr(monthlyBudget)}/mo)
                        </p>
                        <div className="flex justify-between gap-4">
                          <span className="text-[#6E6E73]">AKYIN Forecasted Enquiries</span>
                          <span className="font-mono-num font-bold text-purple-700">
                            {datum.akyinEnquiries.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-[#6E6E73]">AKYIN Qualified Leads</span>
                          <span className="font-mono-num font-bold text-[#1D1D1F]">
                            {datum.akyinQualified.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-[#6E6E73]">National Avg Baseline</span>
                          <span className="font-mono-num font-semibold text-slate-600">
                            {datum.nationalEnquiries.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4 pt-1.5 border-t border-[#1D1D1F]/10">
                          <span className="font-semibold">Cumulative Qualified</span>
                          <span className="font-mono-num font-bold text-emerald-700">
                            {datum.cumulativeQualified.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    );
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                <Area
                  type="monotone"
                  dataKey="akyinEnquiries"
                  name="AKYIN Forecasted Monthly Enquiries"
                  stroke="#7C3AED"
                  strokeWidth={2.5}
                  fill="url(#projTotalGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="akyinQualified"
                  name="AKYIN Qualified Showroom Leads"
                  stroke="#1D1D1F"
                  strokeWidth={2.5}
                  fill="url(#projQualifiedGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="nationalEnquiries"
                  name="National Avg Baseline Enquiries"
                  stroke="#94A3B8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fill="url(#projNationalGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-[#6E6E73]">
            Note: Benchmarks and 3/6/12-month forecasts illustrate typical AKYIN automotive campaign dynamics based on historical segment models and do not constitute fixed performance guarantees.
          </p>
        </GlassPanel>

        {/* Multi-Line Recharts: Cost Per Lead (CPL) Trends vs. Enquiry Volume */}
        <GlassPanel className="p-6 sm:p-8 space-y-6 bg-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-[#E8E8ED] pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700">
                <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Efficiency Gain Analysis</span>
                <span aria-hidden="true">·</span>
                <span>{segment.label}</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-[#1D1D1F]">
                Cost Per Lead (CPL) Efficiency vs. Enquiry Volume ({projectionHorizon}-Month View)
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6E73]">
                As algorithmic targeting and two-tier lead filtering mature across {projectionHorizon} months, partner Cost Per Lead declines from{' '}
                <strong className="font-mono-num tabular-nums text-[#1D1D1F]">
                  {formatInr(projectionTotals.startCpl)}
                </strong>{' '}
                to{' '}
                <strong className="font-mono-num tabular-nums text-emerald-700">
                  {formatInr(projectionTotals.endCpl)}
                </strong>{' '}
                while monthly enquiry volume scales.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto shrink-0">
              <div
                role="group"
                aria-label="Select CPL vs Enquiry Volume period"
                className="inline-flex p-1 rounded-xl frosted-glass border border-[#E8E8ED]"
              >
                {([3, 6, 12] as ProjectionHorizon[]).map((months) => (
                  <button
                    key={months}
                    type="button"
                    aria-pressed={projectionHorizon === months}
                    onClick={() => setProjectionHorizon(months)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-num font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      projectionHorizon === months
                        ? 'liquid-glass-pill-dark text-white shadow-xs'
                        : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                    }`}
                  >
                    {months} Months
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleDownloadCplVolumeCsv}
                aria-label={`Download ${projectionHorizon}-month CPL and enquiry volume metrics as CSV`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E8E8ED] hover:border-[#1D1D1F]/35 hover:bg-[#F5F5F7] text-xs font-semibold text-[#1D1D1F] transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
                <span>Download CSV</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl p-4 border border-[#E8E8ED] bg-[#F5F5F7]/50">
              <p className="text-xs font-medium text-[#6E6E73]">Month-1 Starting CPL</p>
              <p className="font-mono-num tabular-nums text-2xl font-bold text-[#1D1D1F] mt-1">
                {formatInr(projectionTotals.startCpl)}
              </p>
            </div>
            <div className="rounded-2xl p-4 border border-amber-200/80 bg-amber-50/40">
              <p className="text-xs font-medium text-amber-900">
                Month-{projectionHorizon} Optimized CPL
              </p>
              <p className="font-mono-num tabular-nums text-2xl font-bold text-amber-800 mt-1">
                {formatInr(projectionTotals.endCpl)}{' '}
                <span className="text-xs font-semibold text-emerald-700">
                  (-{projectionTotals.cplReductionPct}%)
                </span>
              </p>
            </div>
            <div className="rounded-2xl p-4 border border-purple-200/80 bg-purple-50/40">
              <p className="text-xs font-medium text-purple-900">
                Monthly Enquiry Volume Gain
              </p>
              <p className="font-mono-num tabular-nums text-2xl font-bold text-purple-700 mt-1">
                +{projectionTotals.volumeUpliftPct}%
              </p>
            </div>
          </div>

          <div className="w-full h-[330px] sm:h-[370px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={projectionData}
                margin={{ top: 16, right: 20, left: 4, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E8ED" vertical={false} />
                <XAxis
                  dataKey="dateLabel"
                  tick={{ fontSize: 12, fill: '#6E6E73' }}
                  axisLine={{ stroke: '#E8E8ED' }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="volume"
                  tick={{ fontSize: 12, fill: '#6D28D9' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="cpl"
                  orientation="right"
                  tickFormatter={(v) => `₹${v}`}
                  tick={{ fontSize: 12, fill: '#B45309' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ stroke: '#7C3AED', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                  content={({ active, payload }) => {
                    if (!active || !payload || payload.length === 0) return null;
                    const datum = payload[0].payload as ProjectionDatum;
                    const savingsPct = Math.max(
                      0,
                      Math.round(((datum.industryCpl - datum.akyinCpl) / datum.industryCpl) * 100)
                    );
                    const savingsPerLead = Math.max(0, datum.industryCpl - datum.akyinCpl);
                    return (
                      <div className="liquid-glass-dropdown rounded-2xl p-4 text-xs text-[#1D1D1F] shadow-xl space-y-2.5 min-w-[270px]">
                        <div className="border-b border-[#1D1D1F]/10 pb-2">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-display text-sm font-bold text-[#1D1D1F]">
                              {datum.dateLabel}
                            </p>
                            <span className="font-mono-num tabular-nums text-[11px] font-semibold text-purple-700">
                              {datum.monthLabel} of {projectionHorizon}
                            </span>
                          </div>
                          <p className="font-mono-num tabular-nums text-[11px] text-[#6E6E73] mt-0.5">
                            {datum.dateRange}
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6E6E73]">
                            Volume Metrics
                          </p>
                          <div className="flex items-center justify-between gap-4">
                            <span className="inline-flex items-center gap-1.5 text-[#6E6E73]">
                              <span className="w-2 h-2 rounded-full bg-purple-600" aria-hidden="true" />
                              Total Enquiry Volume
                            </span>
                            <span className="font-mono-num tabular-nums font-bold text-purple-700">
                              {datum.akyinEnquiries.toLocaleString('en-IN')} leads
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="inline-flex items-center gap-1.5 text-[#6E6E73]">
                              <span className="w-2 h-2 rounded-full bg-[#1D1D1F]" aria-hidden="true" />
                              Qualified Showroom Leads
                            </span>
                            <span className="font-mono-num tabular-nums font-bold text-[#1D1D1F]">
                              {datum.akyinQualified.toLocaleString('en-IN')} leads
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-[#6E6E73] pl-3.5">Est. Showroom Test Drives</span>
                            <span className="font-mono-num tabular-nums font-semibold text-[#1D1D1F]">
                              {datum.estTestDrives.toLocaleString('en-IN')} bookings
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-[#1D1D1F]/10">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6E6E73]">
                            Cost Breakdown
                          </p>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-[#6E6E73]">Monthly Ad Spend</span>
                            <span className="font-mono-num tabular-nums font-semibold text-[#1D1D1F]">
                              {formatInr(datum.monthlySpend)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="inline-flex items-center gap-1.5 text-amber-800 font-semibold">
                              <span className="w-2 h-2 rounded-full bg-amber-600" aria-hidden="true" />
                              AKYIN Partner CPL
                            </span>
                            <span className="font-mono-num tabular-nums font-bold text-amber-800">
                              {formatInr(datum.akyinCpl)} / lead
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-[#6E6E73] pl-3.5">Cost per Qualified Lead</span>
                            <span className="font-mono-num tabular-nums font-semibold text-[#1D1D1F]">
                              {formatInr(datum.qualifiedCpl)} / lead
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="inline-flex items-center gap-1.5 text-[#6E6E73]">
                              <span className="w-2 h-2 rounded-full bg-slate-400" aria-hidden="true" />
                              Industry Avg CPL
                            </span>
                            <span className="font-mono-num tabular-nums font-semibold text-slate-600">
                              {formatInr(datum.industryCpl)} / lead
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#1D1D1F]/10 text-[11px] font-semibold text-emerald-700">
                          <span>Efficiency Savings</span>
                          <span className="font-mono-num tabular-nums">
                            {formatInr(savingsPerLead)}/lead ({savingsPct}% lower)
                          </span>
                        </div>
                      </div>
                    );
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                <Line
                  yAxisId="volume"
                  type="monotone"
                  dataKey="akyinEnquiries"
                  name="Enquiry Volume (Leads)"
                  stroke="#7C3AED"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#7C3AED', stroke: '#FFFFFF', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="volume"
                  type="monotone"
                  dataKey="akyinQualified"
                  name="Qualified Showroom Leads"
                  stroke="#1D1D1F"
                  strokeWidth={2.2}
                  dot={{ r: 3.5, fill: '#1D1D1F' }}
                />
                <Line
                  yAxisId="cpl"
                  type="monotone"
                  dataKey="akyinCpl"
                  name="AKYIN Partner CPL (₹)"
                  stroke="#D97706"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#D97706', stroke: '#FFFFFF', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="cpl"
                  type="monotone"
                  dataKey="industryCpl"
                  name="Industry Avg CPL (₹)"
                  stroke="#94A3B8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3, fill: '#94A3B8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>

        {/* Geographical Lead Qualification Density Heatmap (D3 ScaleBand & Threshold Matrix) */}
        <GlassPanel className="p-6 sm:p-8 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-[#E8E8ED] pb-5">
            <div className="space-y-1 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Geographical High-Intent Distribution</span>
                <span aria-hidden="true">·</span>
                <span>D3 Density Matrix</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-[#1D1D1F]">
                Lead Qualification Density Heatmap
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6E73]">
                Visualizes the concentration of verified, showroom-ready buyer leads across six automotive metro hubs and four showroom catchment distances.
              </p>
            </div>

            {/* Segment Switcher */}
            <div
              role="group"
              aria-label="Filter geographical heatmap by vehicle campaign segment"
              className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl frosted-glass border border-[#E8E8ED] self-start lg:self-auto"
            >
              {(Object.keys(HEATMAP_MATRIX) as HeatmapFilter[]).map((key) => {
                const isSelected = heatmapFilter === key;
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setHeatmapFilter(key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'liquid-glass-pill-dark text-white shadow-xs'
                        : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                    }`}
                  >
                    {HEATMAP_MATRIX[key].label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Heatmap Highlights Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="rounded-2xl p-4 bg-white border border-[#E8E8ED]">
              <p className="text-[#6E6E73]">Peak High-Intent Cluster</p>
              <p className="font-display text-base font-bold text-[#1D1D1F] mt-0.5">
                {heatmapSummary.peakCell.region} · {heatmapSummary.peakCell.zone}
              </p>
              <p className="font-mono-num tabular-nums text-xs font-bold text-purple-700 mt-0.5">
                {heatmapSummary.peakCell.densityPct}% Qualified Density
              </p>
            </div>
            <div className="rounded-2xl p-4 bg-white border border-[#E8E8ED]">
              <p className="text-[#6E6E73]">Average Catchment Qualification</p>
              <p className="font-mono-num tabular-nums text-2xl font-bold text-[#1D1D1F] mt-0.5">
                {heatmapSummary.avgDensity}%
              </p>
            </div>
            <div className="rounded-2xl p-4 bg-white border border-[#E8E8ED]">
              <p className="text-[#6E6E73]">Monthly Verified Leads Across Grid</p>
              <p className="font-mono-num tabular-nums text-2xl font-bold text-purple-700 mt-0.5">
                {heatmapSummary.totalLeads.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <D3LeadDensityHeatmap
            cells={activeHeatmap.cells}
            regions={HEATMAP_REGIONS}
            zones={HEATMAP_ZONES}
          />

          {/* Descriptive Heatmap Intensity Scale Legend */}
          <LeadDensityLegend
            activeFilterLabel={activeHeatmap.label}
            avgDensity={heatmapSummary.avgDensity}
          />
        </GlassPanel>
      </div>
    </section>
  );
}
