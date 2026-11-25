import { useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Image as ImageIcon,
  Loader2,
  Maximize2,
  Printer,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { GlassButton, GlassModal, GlassPanel } from './liquid-glass';
import { QRCodeSVG } from 'qrcode.react';

interface AutomotiveDealershipDossierProps {
  onRequestConsultation: (contextLabel: string) => void;
}

const DOSSIER_PAGES = [
  {
    page: 1,
    sectionTitle: 'Executive Summary & Value Benchmarks',
    kicker: 'Section 01 · Strategic Overview',
    headline: 'Marketing That Moves Dealerships Forward.',
    summary:
      'A distilled executive brief engineered for Dealer Principals, General Managers, and Marketing Heads evaluating structured showroom growth.',
    pillars: [
      {
        title: 'Precision Lead Demand',
        detail: 'Geo-fenced Meta, Google Search & local showroom capture.',
      },
      {
        title: 'Two-Tier Filtering',
        detail: 'Separate buyer vetting isolating showroom-ready prospects.',
      },
      {
        title: 'Showroom Footfall Activation',
        detail: 'Test-drive booking workflows, festive launches & creator trust.',
      },
      {
        title: 'Analytics & Sales Coaching',
        detail: 'Live attribution dashboards, custom apps & floor staff training.',
      },
    ],
    metrics: [
      { label: 'Showroom Visit Rate', value: '31.2%', benchmark: 'vs 12.7% avg' },
      { label: 'Test Drive Completion', value: '72.0%', benchmark: '2.1x industry' },
      { label: 'Follow-Up SLA Target', value: '91.0%', benchmark: '< 5 min response' },
    ],
  },
  {
    page: 2,
    sectionTitle: 'Complete 16-Service Growth Architecture',
    kicker: 'Section 02 · Service Scope (01–16)',
    headline: 'End-to-End Automotive Capabilities.',
    summary:
      'Structured across 4 operational tiers keeping Lead Generation and Lead Filtering strictly distinct for clean showroom accountability.',
    groups: [
      {
        heading: 'Demand & Qualification (01–04)',
        items: [
          '01. Lead Generation',
          '02. Lead Filtering & Qualification',
          '03. Influencer Marketing',
          '04. Social Media Marketing',
        ],
      },
      {
        heading: 'Creative, Events & Footfall (05–08)',
        items: [
          '05. Video & Creative Production',
          '06. Product Launch & Event Management',
          '07. Test Drive Campaigns',
          '08. Exchange & Festive Campaigns',
        ],
      },
      {
        heading: 'Local, Retention & Segments (09–12)',
        items: [
          '09. Google Business & Local Marketing',
          '10. Customer Retention Campaigns',
          '11. Pre-Owned Vehicle Marketing',
          '12. Corporate & Fleet Marketing',
        ],
      },
      {
        heading: 'Platforms, Data & Training (13–16)',
        items: [
          '13. Website & Landing Page Marketing',
          '14. Reporting & Marketing Analytics',
          '15. Custom App Development (Leads & Targets)',
          '16. Sales Team Training & Development',
        ],
      },
    ],
  },
  {
    page: 3,
    sectionTitle: 'Tier Matrix & 90-Day Rollout Plan',
    kicker: 'Section 03 · Deployment Cadence',
    headline: 'From Kickoff to Compounding Showroom Velocity.',
    summary:
      'Clear implementation milestones designed to align digital ad spend with sales floor capacity in your first 90 days.',
    phases: [
      {
        window: 'Days 01–15',
        title: 'Audit & Funnel Foundations',
        detail:
          'Google Business optimization, pixel verification, high-speed model landing pages, and telephonic qualification scripts.',
      },
      {
        window: 'Days 16–45',
        title: 'Lead Filtering & Test-Drive Activation',
        detail:
          'Launch geo-fenced campaigns alongside instant WhatsApp booking reminders and executive SLA tracking.',
      },
      {
        window: 'Days 46–90',
        title: 'Sales Floor Coaching & Optimization',
        detail:
          'On-site/virtual team training, festive or exchange campaign scaling, and full attribution ROI reporting.',
      },
    ],
  },
];

const PRINT_SIXTEEN_SERVICES = [
  { num: '01', name: 'Lead Generation', desc: 'Geo-fenced Meta, Google Search & WhatsApp buyer ads' },
  { num: '02', name: 'Lead Filtering & Qualification', desc: 'Separate database vetting & hot/warm priority scoring' },
  { num: '03', name: 'Influencer Marketing', desc: 'Local automotive creators, Reels & showroom walkarounds' },
  { num: '04', name: 'Social Media Marketing', desc: 'Daily showroom calendars, model posts & community care' },
  { num: '05', name: 'Video & Creative Production', desc: '4K feature showcases, handovers & festive ad artwork' },
  { num: '06', name: 'Product Launch & Event Management', desc: 'Teasers, launch-day coverage & VIP RSVP previews' },
  { num: '07', name: 'Test Drive Campaigns', desc: 'Frictionless test-drive bookings & slot reminders' },
  { num: '08', name: 'Exchange & Festive Campaigns', desc: 'Seasonal offers & instant used-car exchange drives' },
  { num: '09', name: 'Google Business & Local Marketing', desc: 'Local map pack visibility & ethical buyer reviews' },
  { num: '10', name: 'Customer Retention Campaigns', desc: 'Periodic service dues, insurance & owner referrals' },
  { num: '11', name: 'Pre-Owned Vehicle Marketing', desc: 'Certified used-car stock funnels & valuation leads' },
  { num: '12', name: 'Corporate & Fleet Marketing', desc: 'B2B outreach, HR programs & institutional fleet deals' },
  { num: '13', name: 'Website & Landing Page Marketing', desc: 'Fast model pages, EMI calculators & CRO funnels' },
  { num: '14', name: 'Reporting & Marketing Analytics', desc: 'Live spend, CPL & showroom delivery attribution' },
  { num: '15', name: 'Custom App Development (Leads & Targets)', desc: 'Unified lead tracking & sales executive target apps' },
  { num: '16', name: 'Sales Team Training & Development', desc: 'Lead etiquette, walkarounds, objection handling & close' },
];

export function AutomotiveDealershipDossier({
  onRequestConsultation,
}: AutomotiveDealershipDossierProps) {
  const [activePage, setActivePage] = useState<number>(1);
  const [fullPreviewOpen, setFullPreviewOpen] = useState(false);
  const [isFullScreenMode, setIsFullScreenMode] = useState(false);
  const [printInitiatedNotice, setPrintInitiatedNotice] = useState(false);
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [pngNotice, setPngNotice] = useState<string | null>(null);

  const screenSheetRef = useRef<HTMLDivElement>(null);
  const modalSheetRef = useRef<HTMLDivElement>(null);

  const generatedDate = useMemo(() => {
    return new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }, []);

  const currentDoc = DOSSIER_PAGES[activePage - 1] ?? DOSSIER_PAGES[0];
  const liveAutomotiveUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/marketing/automotive`
      : 'https://akyin.com/marketing/automotive';

  const triggerDossierPrintPdf = () => {
    setFullPreviewOpen(false);
    document.body.classList.add('printing-dealership-dossier');
    setPrintInitiatedNotice(true);

    const cleanup = () => {
      document.body.classList.remove('printing-dealership-dossier');
      window.removeEventListener('afterprint', cleanup);
    };

    window.addEventListener('afterprint', cleanup);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.print();
        setTimeout(cleanup, 1500);
      });
    });

    setTimeout(() => setPrintInitiatedNotice(false), 5000);
  };

  const handleDownloadPng = async (isModal: boolean = false) => {
    const targetElement = isModal ? modalSheetRef.current : screenSheetRef.current;
    if (!targetElement) return;

    try {
      setIsExportingPng(true);
      setPngNotice(null);

      const canvas = await html2canvas(targetElement, {
        scale: 2, // High resolution retina snapshot
        useCORS: true,
        backgroundColor: '#FFFFFF',
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = `AKYIN-Dealership-Growth-Dossier-Page-0${activePage}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setPngNotice(`Page 0${activePage} downloaded as PNG — ready for WhatsApp & executive sharing.`);
      setTimeout(() => setPngNotice(null), 5000);
    } catch {
      setPngNotice('Failed to generate PNG image. Please try again or download as PDF.');
      setTimeout(() => setPngNotice(null), 5000);
    } finally {
      setIsExportingPng(false);
    }
  };

  const renderDocumentSheet = (compact: boolean, sheetContainerRef?: React.RefObject<HTMLDivElement | null>) => (
    <div
      ref={sheetContainerRef}
      className={`bg-white rounded-2xl border border-[#E8E8ED] shadow-[0_20px_50px_rgba(29,29,31,0.08)] flex flex-col justify-between ${
        compact ? 'p-6 sm:p-8 min-h-[430px]' : 'p-7 sm:p-10 min-h-[500px]'
      }`}
    >
      {/* PDF / PNG Sheet Masthead */}
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#E8E8ED]">
          <div className="flex items-center gap-2 text-xs text-[#6E6E73]">
            <span className="font-display font-bold tracking-tight text-[#1D1D1F]">
              AKYIN MARKETING
            </span>
            <span aria-hidden="true">/</span>
            <span>Automotive Growth Dossier</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono-num tabular-nums text-[10px] text-[#86868B]">
              Generated on: {generatedDate}
            </span>
            <span className="font-mono-num tabular-nums text-[11px] font-semibold text-[#6E6E73]">
              Page {activePage} of 3
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-purple-700">{currentDoc.kicker}</p>
          <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F]">
            {currentDoc.headline}
          </h3>
          <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed">
            {currentDoc.summary}
          </p>
        </div>

        {/* Page-Specific Content */}
        {activePage === 1 && currentDoc.pillars && currentDoc.metrics && (
          <div className="space-y-6 pt-2">
            <div className="grid grid-cols-3 gap-3 py-4 border-y border-[#E8E8ED]">
              {currentDoc.metrics.map((m) => (
                <div key={m.label} className="space-y-0.5">
                  <p className="text-[11px] text-[#6E6E73]">{m.label}</p>
                  <p className="font-mono-num tabular-nums text-lg sm:text-xl font-bold text-[#1D1D1F]">
                    {m.value}
                  </p>
                  <p className="text-[11px] font-medium text-purple-700">{m.benchmark}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {currentDoc.pillars.map((pillar) => (
                <div key={pillar.title} className="space-y-1">
                  <p className="text-xs font-bold text-[#1D1D1F]">{pillar.title}</p>
                  <p className="text-xs text-[#6E6E73] leading-relaxed">{pillar.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePage === 2 && currentDoc.groups && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 pt-2">
            {currentDoc.groups.map((grp) => (
              <div key={grp.heading} className="space-y-1.5 pb-3 border-b border-[#E8E8ED]/80">
                <p className="text-xs font-bold text-[#1D1D1F]">{grp.heading}</p>
                <ul className="space-y-1 text-xs text-[#6E6E73]">
                  {grp.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activePage === 3 && currentDoc.phases && (
          <div className="space-y-4 pt-2">
            {currentDoc.phases.map((phase) => (
              <div
                key={phase.window}
                className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3.5 border-b border-[#E8E8ED]/80"
              >
                <span className="font-mono-num tabular-nums text-xs font-bold text-purple-700 shrink-0 w-24">
                  {phase.window}
                </span>
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs font-bold text-[#1D1D1F]">{phase.title}</p>
                  <p className="text-xs text-[#6E6E73] leading-relaxed">{phase.detail}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PDF / PNG Sheet Footer */}
      <div className="pt-4 mt-6 border-t border-[#E8E8ED] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#6E6E73]">
        <div className="flex items-center gap-2">
          <span>AKYIN Ventures · Automotive Division</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-num text-[10px]">Generated on: {generatedDate}</span>
        </div>
        <span className="font-mono-num tabular-nums">akyin.com/marketing/automotive</span>
      </div>
    </div>
  );

  return (
    <section
      id="dealership-dossier"
      className="py-20 lg:py-24 bg-[#FFFFFF] border-t border-[#E8E8ED]"
    >
      {/* Interactive Screen Glassmorphism Experience */}
      <div className="dossier-screen-only max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GlassPanel className="p-7 sm:p-10 lg:p-12 bg-gradient-to-br from-purple-50/45 via-white to-amber-50/35">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Brief Overview & Actions */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-[#6E6E73]">
                  <FileText className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
                  <span className="font-semibold text-purple-700">Executive PDF Dossier</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num tabular-nums">Single A4 Print-Ready Brief</span>
                </div>

                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
                  Download the Dealership Growth Dossier.
                </h2>

                <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed">
                  Save or print an executive, A4-formatted PDF brief summarizing AKYIN’s 16 automotive marketing services, regional conversion benchmarks, and 90-day showroom roadmap for leadership review.
                </p>
              </div>

              {/* Page Selector Controls */}
              <div className="space-y-2.5 pt-2 border-t border-[#1D1D1F]/10">
                <p className="text-xs font-semibold text-[#1D1D1F]">
                  Preview Dossier Sections ({activePage}/3)
                </p>
                <div className="flex flex-wrap gap-2">
                  {DOSSIER_PAGES.map((doc) => {
                    const isActive = activePage === doc.page;
                    return (
                      <button
                        key={doc.page}
                        type="button"
                        onClick={() => setActivePage(doc.page)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          isActive
                            ? 'liquid-glass-pill-dark text-white shadow-xs'
                            : 'bg-white/85 text-[#6E6E73] hover:text-[#1D1D1F] border border-[#E8E8ED]'
                        }`}
                      >
                        0{doc.page}.{' '}
                        {doc.page === 1
                          ? 'Overview'
                          : doc.page === 2
                            ? '16 Services'
                            : '90-Day Plan'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <GlassButton
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={triggerDossierPrintPdf}
                  aria-label="Download PDF — Open single A4 print dialog for Dealership Dossier"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  <span>Download PDF</span>
                </GlassButton>

                <GlassButton
                  type="button"
                  variant="glass"
                  size="lg"
                  onClick={() => void handleDownloadPng(false)}
                  disabled={isExportingPng}
                  aria-label="Download as PNG — Export high resolution visual image for WhatsApp & messaging"
                >
                  {isExportingPng ? (
                    <Loader2 className="w-4 h-4 animate-spin text-purple-700" aria-hidden="true" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-purple-700" aria-hidden="true" />
                  )}
                  <span>{isExportingPng ? 'Rendering PNG...' : 'Download as PNG'}</span>
                </GlassButton>

                <GlassButton
                  type="button"
                  variant="glass"
                  size="md"
                  onClick={() => setFullPreviewOpen(true)}
                >
                  <Maximize2 className="w-4 h-4" aria-hidden="true" />
                  <span>Full View</span>
                </GlassButton>
              </div>

              {printInitiatedNotice && (
                <div
                  role="status"
                  className="flex items-center gap-2 text-xs font-semibold text-emerald-700"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>
                    A4 Dossier print dialog prepared — choose &ldquo;Save as PDF&rdquo; for executive distribution.
                  </span>
                </div>
              )}

              {pngNotice && (
                <div
                  role="status"
                  className="flex items-center gap-2 text-xs font-semibold text-purple-800 bg-purple-50/80 border border-purple-200/80 rounded-xl p-3"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-purple-700" aria-hidden="true" />
                  <span>{pngNotice}</span>
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center gap-5 text-xs">
                <button
                  type="button"
                  onClick={triggerDossierPrintPdf}
                  className="inline-flex items-center gap-1.5 font-semibold text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Print A4 Sheet</span>
                </button>
                <button
                  type="button"
                  onClick={() => void handleDownloadPng(false)}
                  disabled={isExportingPng}
                  className="inline-flex items-center gap-1.5 font-semibold text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Save for WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onRequestConsultation('Customised Dealership Growth Dossier & Proposal')
                  }
                  className="inline-flex items-center gap-1.5 font-semibold text-purple-700 hover:text-purple-800 cursor-pointer"
                >
                  <span>Request Custom Proposal</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Right Column: Interactive PDF-Style Sheet Preview */}
            <div className="lg:col-span-7 space-y-4">
              {renderDocumentSheet(true, screenSheetRef)}

              {/* Sheet Navigation Bar */}
              <div className="flex items-center justify-between gap-4 px-1">
                <span className="text-xs font-medium text-[#6E6E73]">
                  {currentDoc.sectionTitle}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Previous dossier page"
                    disabled={activePage === 1}
                    onClick={() => setActivePage((p) => Math.max(1, p - 1))}
                    className="w-9 h-9 rounded-full bg-white border border-[#E8E8ED] flex items-center justify-center text-[#1D1D1F] disabled:opacity-40 cursor-pointer hover:bg-[#F5F5F7] transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next dossier page"
                    disabled={activePage === 3}
                    onClick={() => setActivePage((p) => Math.min(3, p + 1))}
                    className="w-9 h-9 rounded-full bg-white border border-[#E8E8ED] flex items-center justify-center text-[#1D1D1F] disabled:opacity-40 cursor-pointer hover:bg-[#F5F5F7] transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </GlassPanel>
      </div>

      {/* Dedicated Single-Page A4 Print Distribution Master Sheet (shown only during Dossier print) */}
      <div className="hidden dealership-dossier-print-sheet" aria-hidden="true">
        <div className="hidden print-confidential-watermark" aria-hidden="true">
          AKYIN Confidential
        </div>

        {/* Automatic AKYIN-Branded Header Banner (appears only when printing) */}
        <div className="dossier-print-header-banner">
          <div className="dossier-print-header-banner-left">
            <span className="dossier-print-header-banner-badge">AKYIN VENTURES</span>
            <span className="dossier-print-header-banner-title">
              Automotive Marketing Growth Dossier
            </span>
          </div>
          <div className="dossier-print-header-banner-right">
            <span>CONFIDENTIAL &amp; PROPRIETARY</span>
            <span>·</span>
            <span className="font-mono-num">Generated on: {generatedDate}</span>
          </div>
        </div>

        {/* A4 Header Masthead */}
        <div className="dossier-print-masthead">
          <div className="dossier-print-brand">
            <img
              src="/assets/aistudio/akyin_logo_clean.png"
              alt="AKYIN Ventures"
              className="dossier-print-logo"
            />
            <div>
              <p className="dossier-print-kicker">
                AKYIN MARKETING · AUTOMOTIVE DEALERSHIP GROWTH
              </p>
              <p className="dossier-print-subkicker">
                Executive Capabilities &amp; Showroom Benchmark Dossier
              </p>
            </div>
          </div>
          <div className="dossier-print-meta">
            <span>16+ Years Experience</span>
            <span>·</span>
            <span>16 Services</span>
            <span>·</span>
            <span>Generated on: {generatedDate}</span>
          </div>
        </div>

        {/* Hero Title & Summary */}
        <div className="dossier-print-hero">
          <h1 className="dossier-print-title">
            Marketing That Moves Dealerships Forward.
          </h1>
          <p className="dossier-print-lead">
            From customer enquiries to showroom performance, AKYIN helps automotive dealerships improve local visibility, strictly filter and qualify buyer leads separately from ad generation, and strengthen floor sales conversion teams.
          </p>
        </div>

        {/* Benchmark KPI Comparison Strip */}
        <div className="dossier-print-kpi-grid">
          <div className="dossier-print-kpi">
            <span className="dossier-print-kpi-label">Lead-to-Showroom Visit</span>
            <span className="dossier-print-kpi-value">31.2%</span>
            <span className="dossier-print-kpi-note">vs 12.7% national avg</span>
          </div>
          <div className="dossier-print-kpi">
            <span className="dossier-print-kpi-label">Test Drive Completion</span>
            <span className="dossier-print-kpi-value">72.0%</span>
            <span className="dossier-print-kpi-note">2.1x industry baseline</span>
          </div>
          <div className="dossier-print-kpi">
            <span className="dossier-print-kpi-label">Qualified Lead Share</span>
            <span className="dossier-print-kpi-value">66.0%</span>
            <span className="dossier-print-kpi-note">vs 36.0% unfiltered avg</span>
          </div>
          <div className="dossier-print-kpi">
            <span className="dossier-print-kpi-label">Follow-Up SLA (&lt;5 min)</span>
            <span className="dossier-print-kpi-value">91.0%</span>
            <span className="dossier-print-kpi-note">+49 pts over avg dealers</span>
          </div>
        </div>

        {/* Complete 16-Service Numbered Grid (2 Columns x 8 Rows) */}
        <div className="dossier-print-section">
          <div className="dossier-print-section-head">
            <h2>16 Integrated Automotive Marketing &amp; Growth Services</h2>
            <span>Lead Generation (01) &amp; Lead Filtering (02) delivered independently</span>
          </div>
          <div className="dossier-print-services-grid">
            {PRINT_SIXTEEN_SERVICES.map((svc) => (
              <div key={svc.num} className="dossier-print-service-item">
                <span className="dossier-print-service-num">{svc.num}.</span>
                <div>
                  <p className="dossier-print-service-name">{svc.name}</p>
                  <p className="dossier-print-service-desc">{svc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 90-Day Rollout + Tier Snapshot */}
        <div className="dossier-print-section">
          <div className="dossier-print-section-head">
            <h2>90-Day Dealership Rollout &amp; Engagement Structure</h2>
            <span>Agreed scope · Direct platform ad billing</span>
          </div>
          <div className="dossier-print-roadmap-grid">
            <div className="dossier-print-roadmap-col">
              <span className="dossier-print-phase-tag">Days 01–15 · Foundations</span>
              <p className="dossier-print-phase-title">Audit &amp; Funnel Setup</p>
              <p className="dossier-print-phase-desc">
                Google Business audit, pixel &amp; CRM alignment, high-speed model pages &amp; screening scripts.
              </p>
            </div>
            <div className="dossier-print-roadmap-col">
              <span className="dossier-print-phase-tag">Days 16–45 · Activation</span>
              <p className="dossier-print-phase-title">Filtering &amp; Test Drives</p>
              <p className="dossier-print-phase-desc">
                Geo-fenced Meta/Search launch, hot/warm priority sheets &amp; automated WhatsApp reminders.
              </p>
            </div>
            <div className="dossier-print-roadmap-col">
              <span className="dossier-print-phase-tag">Days 46–90 · Compounding</span>
              <p className="dossier-print-phase-title">Sales Coaching &amp; Scale</p>
              <p className="dossier-print-phase-desc">
                Showroom staff training, exchange/festive campaigns &amp; live delivery attribution reviews.
              </p>
            </div>
          </div>
        </div>

        {/* Official Contact & Terms Footer + Live Benchmark QR Code */}
        <div className="dossier-print-footer">
          <div>
            <strong>AKYIN Ventures · Automotive Marketing</strong>
            <span>Shaikh Nazir · connect@akyin.com · WhatsApp Connect</span>
          </div>
          <div className="dossier-print-footer-meta-qr">
            <div className="dossier-print-footer-right">
              <span>akyin.com/marketing/automotive</span>
              <span>Working terms: Advertising paid directly to platforms · Campaign approval prior to launch</span>
            </div>
            <div className="dossier-print-qr-box">
              <QRCodeSVG
                value={liveAutomotiveUrl}
                size={42}
                level="M"
                bgColor="#FFFFFF"
                fgColor="#1D1D1F"
              />
              <span className="dossier-print-qr-label">Live Hub</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded PDF-Style Modal Reader */}
      <GlassModal
        open={fullPreviewOpen}
        onClose={() => {
          setFullPreviewOpen(false);
          setIsFullScreenMode(false);
        }}
        subtitle="AKYIN Marketing · Automotive Brief"
        title="Dealership Growth Dossier Preview"
        maxWidthClass={isFullScreenMode ? 'max-w-5xl' : 'max-w-3xl'}
      >
        <div className="space-y-5">
          <div className="flex items-center justify-end pb-1">
            <button
              type="button"
              onClick={() => setIsFullScreenMode(!isFullScreenMode)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E8E8ED] text-xs font-semibold text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors cursor-pointer shadow-xs"
            >
              <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isFullScreenMode ? 'Standard View' : 'Full Screen Preview'}</span>
            </button>
          </div>

          {renderDocumentSheet(false, modalSheetRef)}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              {DOSSIER_PAGES.map((doc) => (
                <button
                  key={doc.page}
                  type="button"
                  onClick={() => setActivePage(doc.page)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono-num font-bold cursor-pointer transition-colors ${
                    activePage === doc.page
                      ? 'bg-[#1D1D1F] text-white'
                      : 'bg-white border border-[#E8E8ED] text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  Page {doc.page}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <GlassButton
                type="button"
                variant="glass"
                size="md"
                onClick={() => void handleDownloadPng(true)}
                disabled={isExportingPng}
                aria-label="Download modal page as PNG image"
              >
                {isExportingPng ? (
                  <Loader2 className="w-4 h-4 animate-spin text-purple-700" aria-hidden="true" />
                ) : (
                  <ImageIcon className="w-4 h-4 text-purple-700" aria-hidden="true" />
                )}
                <span>Download PNG</span>
              </GlassButton>

              <GlassButton
                type="button"
                variant="primary"
                size="md"
                onClick={triggerDossierPrintPdf}
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>Download PDF</span>
              </GlassButton>
            </div>
          </div>
        </div>
      </GlassModal>
    </section>
  );
}
