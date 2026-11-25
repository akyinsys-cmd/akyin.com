import { useState } from 'react';
import { Activity, CheckCircle2, DollarSign, TrendingUp, Users } from 'lucide-react';

export function LeadImpactTracker() {
  const [adBudget, setAdBudget] = useState<number>(100000); // INR monthly ad budget
  const [vehicleTier, setVehicleTier] = useState<'mass' | 'suv' | 'luxury'>('suv');

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
  const showroomConversionRate = (currentTier.conversionRate * 100).toFixed(1);

  return (
    <div className="rounded-3xl border border-[#E8E8ED] bg-white/90 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] space-y-8">
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

        <div className="flex items-center gap-2 bg-[#F5F5F7] p-1.5 rounded-2xl border border-[#E8E8ED] shrink-0">
          {(['mass', 'suv', 'luxury'] as const).map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setVehicleTier(tier)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                vehicleTier === tier
                  ? 'bg-white text-[#1D1D1F] shadow-xs border border-[#E8E8ED]'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              {tier === 'mass' ? 'Hatch / Sedan' : tier === 'suv' ? 'SUV Range' : 'Luxury / EV'}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7]/70 p-5 space-y-5">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-[#1D1D1F]">Monthly Ad Spend Budget</span>
              <span className="font-mono text-[#0071E3] text-sm">₹{adBudget.toLocaleString('en-IN')}</span>
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
            <p className="text-xs font-bold uppercase tracking-wider text-[#6E6E73]">
              Selected Model Profile: <span className="text-[#1D1D1F] font-semibold">{currentTier.name}</span>
            </p>
            <div className="space-y-2 text-xs text-[#4A4A4F]">
              <div className="flex justify-between">
                <span>Avg Cost Per Lead (CPL):</span>
                <span className="font-mono font-bold text-[#1D1D1F]">₹{currentTier.cpl}</span>
              </div>
              <div className="flex justify-between">
                <span>Test-Drive Booking Rate:</span>
                <span className="font-mono font-bold text-[#1D1D1F]">{(currentTier.testDriveRate * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Showroom Conversion Rate:</span>
                <span className="font-mono font-bold text-[#0071E3]">{showroomConversionRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Performance Indicator Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[#0071E3]/20 bg-gradient-to-br from-blue-50/80 to-white p-5 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#0071E3]">
                Cost Per Test Drive (CPTD)
              </span>
              <div className="w-8 h-8 rounded-full bg-blue-100/80 flex items-center justify-center text-[#0071E3]">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold font-mono text-[#1D1D1F]">
              ₹{costPerTestDrive.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-[#6E6E73]">
              Optimized ad targeting and instant telephonic qualification reduce wasted spend.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-50/80 to-white p-5 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Showroom Conversion Rate
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-100/80 flex items-center justify-center text-emerald-700">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold font-mono text-[#1D1D1F]">
              {showroomConversionRate}%
            </p>
            <p className="text-[11px] text-[#6E6E73]">
              Projected showroom delivery and booking rate from verified test-drive leads.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7]/70 p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                Projected Test Drives
              </span>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1D1D1F]">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold font-mono text-[#1D1D1F]">
              {estimatedTestDrives.toLocaleString('en-IN')} <span className="text-xs font-normal text-[#6E6E73]">/mo</span>
            </p>
            <p className="text-[11px] text-[#6E6E73]">
              From {estimatedLeads.toLocaleString('en-IN')} inbound digital enquiries captured.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7]/70 p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                Estimated Car Bookings
              </span>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1D1D1F]">
                <CheckCircle2 className="w-4 h-4 text-[#0071E3]" />
              </div>
            </div>
            <p className="text-2xl font-bold font-mono text-[#1D1D1F]">
              {estimatedBookings.toLocaleString('en-IN')} <span className="text-xs font-normal text-[#6E6E73]">Vehicles</span>
            </p>
            <p className="text-[11px] text-[#6E6E73]">
              Based on historical dealership conversion benchmarks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
