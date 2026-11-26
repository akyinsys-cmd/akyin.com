import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart2,
  CheckCircle2,
  DollarSign,
  Download,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Users,
} from 'lucide-react';
import { AnimatePresence, animate, motion, useReducedMotion } from 'motion/react';
import {
  Area,
  AreaChart,
  Brush,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface AnimatedMetricNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  reducedMotion: boolean;
}

function AnimatedMetricNumber({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  reducedMotion,
}: AnimatedMetricNumberProps) {
  const [displayValue, setDisplayValue] = useState<number>(reducedMotion ? value : 0);
  const currentRef = useRef<number>(reducedMotion ? value : 0);

  useEffect(() => {
    if (reducedMotion) {
      currentRef.current = value;
      setDisplayValue(value);
      return;
    }

    const from = currentRef.current;
    const controls = animate(from, value, {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        currentRef.current = latest;
        setDisplayValue(latest);
      },
    });

    return () => controls.stop();
  }, [value, reducedMotion]);

  const formatted =
    decimals > 0
      ? displayValue.toFixed(decimals)
      : Math.round(displayValue).toLocaleString('en-IN');

  return (
    <span className="tabular-nums">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

export function LeadImpactTracker() {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const [adBudget, setAdBudget] = useState<number>(100000); // INR monthly ad budget
  const [vehicleTier, setVehicleTier] = useState<'mass' | 'suv' | 'luxury'>('suv');
  const [zoomRange, setZoomRange] = useState<'7d' | '14d' | '30d'>('30d');
  const [reloadNonce, setReloadNonce] = useState<number>(0);

  // Tier multipliers
  const tierConfig = {
    mass: { name: 'Hatchback / Compact Sedan', cpl: 280, testDriveRate: 0.38, conversionRate: 0.16 },
    suv: { name: 'Midsize SUV / Compact SUV', cpl: 450, testDriveRate: 0.42, conversionRate: 0.19 },
    luxury: { name: 'Luxury / EV Premium', cpl: 1200, testDriveRate: 0.28, conversionRate: 0.12 },
  };

  const currentTier = tierConfig[vehicleTier];
  const estimatedLeads = Math.round(adBudget / currentTier.cpl);
  const estimatedTestDrives = Math.round(estimatedLeads * currentTier.testDriveRate);
  const costPerTestDrive = Math.round(adBudget / Math.max(1, estimatedTestDrives));
  const estimatedBookings = Math.round(estimatedTestDrives * currentTier.conversionRate);
  const showroomConversionRateNum = Number((currentTier.conversionRate * 100).toFixed(1));

  // Generate 30-day Cost Per Test Drive trend data
  const fullTrendData = useMemo(() => {
    const data = [];
    const baseCptd = costPerTestDrive;
    const now = new Date();
    const reloadWave = (reloadNonce % 3) * 0.015;
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      const variance = 1 + Math.sin(i * 0.5 + reloadWave * 10) * 0.08 + (i / 30) * 0.05;
      const cptd = Math.round(baseCptd * variance);
      data.push({
        day: dateStr,
        cptd: Math.max(500, cptd),
        leads: Math.round((estimatedLeads / 30) * (1 + Math.cos(i * 0.4) * 0.1)),
      });
    }
    return data;
  }, [costPerTestDrive, estimatedLeads, reloadNonce]);

  // Filter trend data according to zoom range
  const trendData = useMemo(() => {
    if (zoomRange === '7d') return fullTrendData.slice(-7);
    if (zoomRange === '14d') return fullTrendData.slice(-14);
    return fullTrendData;
  }, [fullTrendData, zoomRange]);

  // Calculate 30-day moving average for Cost Per Test Drive
  const movingAverageCptd = useMemo(() => {
    if (fullTrendData.length === 0) return 0;
    const sum = fullTrendData.reduce((acc, curr) => acc + curr.cptd, 0);
    return Math.round(sum / fullTrendData.length);
  }, [fullTrendData]);

  const isAboveMovingAverage = costPerTestDrive > movingAverageCptd;
  const [pulseKey, setPulseKey] = useState<number>(0);
  const isFirstRenderRef = useRef<boolean>(true);

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    setPulseKey((k) => k + 1);
  }, [vehicleTier, reloadNonce]);

  // Handle CSV download
  const handleDownloadCsv = () => {
    const headers = 'Day,Cost Per Test Drive (INR),Estimated Leads,Ad Budget (INR),Vehicle Tier\n';
    const rows = fullTrendData
      .map((item) => `${item.day},${item.cptd},${item.leads},${adBudget},"${currentTier.name}"`)
      .join('\n');
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows);
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `akyin_dealership_lead_impact_${vehicleTier}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
      className="rounded-3xl border border-[#E8E8ED] bg-white/90 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] space-y-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#E8E8ED] pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0071E3] text-xs font-semibold">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Real-Time Dealership Lead Impact Tracker</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            Live Dealership KPI Simulator &amp; ROI Forecast
          </h3>
          <p className="text-sm text-[#6E6E73] max-w-2xl">
            Simulate your monthly advertising spend and vehicle category to instantly calculate projected cost per test drive, lead qualification yield, and showroom conversion rate.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#F5F5F7] p-1.5 rounded-2xl border border-[#E8E8ED]">
            {(['mass', 'suv', 'luxury'] as const).map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setVehicleTier(tier)}
                className={`px-3 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  vehicleTier === tier
                    ? 'bg-white text-[#1D1D1F] shadow-xs border border-[#E8E8ED]'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                {tier === 'mass' ? 'Hatch / Sedan' : tier === 'suv' ? 'SUV Range' : 'Luxury / EV'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setReloadNonce((n) => n + 1)}
            aria-label="Refresh performance forecast"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-[#F5F5F7] hover:bg-[#E8E8ED]/70 text-[#1D1D1F] text-xs font-semibold border border-[#E8E8ED] transition-all cursor-pointer active:scale-[0.98]"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 transition-transform duration-300 ${
                reloadNonce > 0 && !shouldReduceMotion ? 'rotate-180' : ''
              }`}
            />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* Moving Average Alert Notification Badge */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 'some' }}
        transition={{ duration: 0.4, delay: 0.08, ease: EASE_OUT_EXPO }}
        className={`rounded-2xl p-4 border flex items-center justify-between gap-4 transition-colors duration-300 ${
          isAboveMovingAverage
            ? 'bg-amber-50/90 border-amber-300 text-amber-900 shadow-xs'
            : 'bg-emerald-50/80 border-emerald-300 text-emerald-900 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-3">
          <motion.div
            key={isAboveMovingAverage ? 'alert-icon' : 'ok-icon'}
            initial={shouldReduceMotion ? false : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isAboveMovingAverage ? 'bg-amber-200 text-amber-800' : 'bg-emerald-200 text-emerald-800'
            }`}
          >
            {isAboveMovingAverage ? <AlertTriangle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </motion.div>
          <div>
            <AnimatePresence mode="wait">
              <motion.p
                key={isAboveMovingAverage ? 'above' : 'below'}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-xs font-bold"
              >
                {isAboveMovingAverage
                  ? 'CPTD Alert: Current Cost Per Test Drive exceeds 30-day moving average.'
                  : 'CPTD Efficiency: Current Cost Per Test Drive is running below 30-day benchmark.'}
              </motion.p>
            </AnimatePresence>
            <p className="text-[11px] opacity-80">
              Current CPTD:{' '}
              <span className="font-mono font-bold">
                <AnimatedMetricNumber
                  value={costPerTestDrive}
                  prefix="₹"
                  reducedMotion={shouldReduceMotion}
                />
              </span>{' '}
              vs 30-Day Avg:{' '}
              <span className="font-mono font-bold">
                <AnimatedMetricNumber
                  value={movingAverageCptd}
                  prefix="₹"
                  reducedMotion={shouldReduceMotion}
                />
              </span>
            </p>
          </div>
        </div>
        <div className="hidden sm:block text-[11px] font-mono px-3 py-1 rounded-full bg-white/70 border border-black/10">
          30-Day Benchmark
        </div>
      </motion.div>

      {/* Interactive Sliders & KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 'some' }}
          transition={{ duration: 0.45, delay: 0.1, ease: EASE_OUT_EXPO }}
          className="lg:col-span-1 rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7]/70 p-5 space-y-5"
        >
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-[#1D1D1F]">Monthly Ad Spend Budget</span>
              <span className="font-mono text-[#0071E3] text-sm">
                <AnimatedMetricNumber
                  value={adBudget}
                  prefix="₹"
                  reducedMotion={shouldReduceMotion}
                />
              </span>
            </div>
            <input
              type="range"
              min={30000}
              max={500000}
              step={10000}
              value={adBudget}
              onChange={(e) => setAdBudget(Number(e.target.value))}
              className="w-full accent-[#0071E3] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#6E6E73] font-mono">
              <span>₹30,000</span>
              <span>₹2.5L</span>
              <span>₹5,00,000</span>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-[#E8E8ED]">
            <AnimatePresence mode="wait">
              <motion.p
                key={vehicleTier}
                initial={shouldReduceMotion ? false : { opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, x: 6 }}
                transition={{ duration: 0.22, ease: EASE_OUT_EXPO }}
                className="text-xs font-bold uppercase tracking-wider text-[#6E6E73]"
              >
                Selected Model Profile:{' '}
                <span className="text-[#1D1D1F] font-semibold">{currentTier.name}</span>
              </motion.p>
            </AnimatePresence>
            <div className="space-y-2 text-xs text-[#4A4A4F]">
              <div className="flex justify-between">
                <span>Avg Cost Per Lead (CPL):</span>
                <span className="font-mono font-bold text-[#1D1D1F]">
                  <AnimatedMetricNumber
                    value={currentTier.cpl}
                    prefix="₹"
                    reducedMotion={shouldReduceMotion}
                  />
                </span>
              </div>
              <div className="flex justify-between">
                <span>Test-Drive Booking Rate:</span>
                <span className="font-mono font-bold text-[#1D1D1F]">
                  <AnimatedMetricNumber
                    value={currentTier.testDriveRate * 100}
                    suffix="%"
                    reducedMotion={shouldReduceMotion}
                  />
                </span>
              </div>
              <div className="flex justify-between">
                <span>Showroom Conversion Rate:</span>
                <span className="font-mono font-bold text-[#0071E3]">
                  <AnimatedMetricNumber
                    value={showroomConversionRateNum}
                    decimals={1}
                    suffix="%"
                    reducedMotion={shouldReduceMotion}
                  />
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Performance Indicator Cards */}
        <motion.div
          animate={
            pulseKey > 0 && !shouldReduceMotion
              ? { scale: [1, 1.008, 1] }
              : undefined
          }
          transition={{ duration: 0.32, ease: EASE_OUT_EXPO }}
          className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.4, delay: 0.08, ease: EASE_OUT_EXPO }}
            className="rounded-2xl border border-[#0071E3]/20 bg-gradient-to-br from-blue-50/80 to-white p-5 space-y-2 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#0071E3]">
                Cost Per Test Drive (CPTD)
              </span>
              <div className="w-8 h-8 rounded-full bg-blue-100/80 flex items-center justify-center text-[#0071E3]">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold font-mono text-[#1D1D1F]">
              <AnimatedMetricNumber
                value={costPerTestDrive}
                prefix="₹"
                reducedMotion={shouldReduceMotion}
              />
            </p>
            <p className="text-[11px] text-[#6E6E73]">
              Optimized ad targeting and instant telephonic qualification reduce wasted spend.
            </p>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.4, delay: 0.14, ease: EASE_OUT_EXPO }}
            className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-50/80 to-white p-5 space-y-2 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Showroom Conversion Rate
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-100/80 flex items-center justify-center text-emerald-700">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold font-mono text-[#1D1D1F]">
              <AnimatedMetricNumber
                value={showroomConversionRateNum}
                decimals={1}
                suffix="%"
                reducedMotion={shouldReduceMotion}
              />
            </p>
            <p className="text-[11px] text-[#6E6E73]">
              Projected showroom delivery and booking rate from verified test-drive leads.
            </p>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.4, delay: 0.2, ease: EASE_OUT_EXPO }}
            className="rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7]/70 p-5 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                Projected Test Drives
              </span>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1D1D1F]">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold font-mono text-[#1D1D1F]">
              <AnimatedMetricNumber
                value={estimatedTestDrives}
                reducedMotion={shouldReduceMotion}
              />{' '}
              <span className="text-xs font-normal text-[#6E6E73]">/mo</span>
            </p>
            <p className="text-[11px] text-[#6E6E73]">
              From{' '}
              <AnimatedMetricNumber
                value={estimatedLeads}
                reducedMotion={shouldReduceMotion}
              />{' '}
              inbound digital enquiries captured.
            </p>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.4, delay: 0.26, ease: EASE_OUT_EXPO }}
            className="rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7]/70 p-5 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                Estimated Car Bookings
              </span>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1D1D1F]">
                <CheckCircle2 className="w-4 h-4 text-[#0071E3]" />
              </div>
            </div>
            <p className="text-2xl font-bold font-mono text-[#1D1D1F]">
              <AnimatedMetricNumber
                value={estimatedBookings}
                reducedMotion={shouldReduceMotion}
              />{' '}
              <span className="text-xs font-normal text-[#6E6E73]">Vehicles</span>
            </p>
            <p className="text-[11px] text-[#6E6E73]">
              Based on historical dealership conversion benchmarks.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Cost Per Test Drive Trend Chart with Zoom-in & Brush Range Selector */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 'some' }}
        transition={{ duration: 0.48, delay: 0.22, ease: EASE_OUT_EXPO }}
        className="rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7]/50 p-5 sm:p-6 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E8ED] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-[#0071E3]">
              <BarChart2 className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-[#1D1D1F]">
              Cost Per Test Drive (CPTD) — Zoom-in Trend Inspection
            </h4>
          </div>

          {/* Zoom Range Toggle Buttons */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E8E8ED]">
            <span className="text-[11px] font-semibold text-[#6E6E73] px-2">Zoom:</span>
            {(['7d', '14d', '30d'] as const).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setZoomRange(range)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  zoomRange === range
                    ? 'bg-[#0071E3] text-white shadow-xs'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={`${zoomRange}-${vehicleTier}-${reloadNonce}`}
          initial={shouldReduceMotion ? false : { opacity: 0.4 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
          className="h-56 w-full pt-2"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="cptdZoomGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0071E3" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0071E3" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E8ED" vertical={false} />
              <XAxis dataKey="day" stroke="#86868B" fontSize={10} tickLine={false} />
              <YAxis stroke="#86868B" fontSize={10} tickLine={false} tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '12px',
                  border: '1px solid #E8E8ED',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                  fontSize: '12px',
                }}
                formatter={(val: unknown) => [
                  `₹${Number(val || 0).toLocaleString('en-IN')}`,
                  'Cost Per Test Drive',
                ]}
                labelStyle={{ fontWeight: 'bold', color: '#1D1D1F' }}
              />
              <Area
                type="monotone"
                dataKey="cptd"
                stroke="#0071E3"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#cptdZoomGradient)"
                isAnimationActive={!shouldReduceMotion}
                animationDuration={450}
                animationEasing="ease-out"
              />
              {zoomRange === '30d' && (
                <Brush dataKey="day" height={22} stroke="#0071E3" fill="#F5F5F7" />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
