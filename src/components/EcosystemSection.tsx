import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Briefcase, Building2, Layers } from 'lucide-react';
import {
  AppRoute,
  ECOSYSTEM_CLIENTS_TICKER,
  ECOSYSTEM_PLATFORMS_TICKER,
  ECOSYSTEM_VENTURES_TICKER,
  EcosystemBrandEntry,
} from '../data/akyinData';
import {
  CLIENT_ECOSYSTEM_RECORDS,
  ClientEcosystemRecord,
  ECOSYSTEM_INDUSTRY_CATEGORIES,
  ECOSYSTEM_STATS,
  EcosystemRelationshipType,
} from '../data/ecosystemConfig';
import { sanitizeHref } from '../utils/security';
import { suiteApi } from '../services/suiteApi';
import { EditorialReveal } from './EditorialReveal';
import { GlassPanel } from './liquid-glass';

interface EcosystemSectionProps {
  onNavigate: (route: AppRoute) => void;
}

type RelationshipFilter = 'all' | EcosystemRelationshipType;

function ThirdPartyMark({ iconKey }: { iconKey?: EcosystemBrandEntry['iconKey'] }) {
  switch (iconKey) {
    case 'amazon':
      return (
        <svg className="w-5 h-5 shrink-0 text-[#1D1D1F]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4.5 16.5c4.2 2.9 10.6 3.1 15 0.4" stroke="#1D1D1F" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M17.5 15.6l2.4 1.1-.8 2.5"
            stroke="#1D1D1F"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.7 13.4c-.3.2-.7.2-1 0-.7-.6-.8-.9-1.2-1.4-1.1 1.1-1.9 1.5-3.4 1.5-1.7 0-3-1.1-3-3.2 0-1.7.9-2.8 2.2-3.4 1.1-.5 2.7-.6 3.9-.7v-.3c0-.5 0-1.1-.3-1.5-.3-.4-.8-.6-1.3-.6-.9 0-1.7.5-1.9 1.4 0 .2-.2.4-.4.4l-1.9-.2c-.2 0-.4-.2-.3-.5.5-2.1 2.4-2.8 4.2-2.8.9 0 2.1.2 2.8.9.9.9.8 2 .8 3.3v3c0 .9.4 1.3.7 1.8.1.2.1.4 0 .5-.4.3-1 .9-1.9 1zM12.2 8.7c0 .8 0 1.4-.4 2-.3.5-.8.8-1.4.8-.8 0-1.2-.6-1.2-1.5 0-1.7 1.5-2 3-2v.7z"
            fill="currentColor"
          />
        </svg>
      );
    case 'google-play':
      return (
        <svg className="w-5 h-5 shrink-0 text-[#1D1D1F]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4.5 3.6c-.3.3-.5.8-.5 1.4v14c0 .6.2 1.1.5 1.4l.1.1 7.8-7.8v-.2L4.6 3.5l-.1.1z" fill="#6E6E73" />
          <path d="M15 15.1l-2.6-2.6v-.2l2.6-2.6.1.1 3.1 1.8c.9.5.9 1.3 0 1.8l-3.1 1.7-.1 0z" fill="#3A3A3F" />
          <path d="M15.1 15l-2.7-2.7L4.5 20.2c.3.3.9.3 1.5 0l9.1-5.2z" fill="#1D1D1F" opacity="0.85" />
          <path d="M15.1 9L6 3.8c-.6-.3-1.2-.3-1.5 0l7.9 7.9L15.1 9z" fill="#A1A1A6" />
        </svg>
      );
    case 'shopify':
      return (
        <svg className="w-5 h-5 shrink-0 text-[#1D1D1F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 7l1.2-3h9.6L18 7" />
          <path d="M5 7h14l1.1 12.2a1.5 1.5 0 0 1-1.5 1.6H5.4a1.5 1.5 0 0 1-1.5-1.6L5 7z" />
          <path d="M9.5 10.5c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5" />
        </svg>
      );
    case 'instagram':
      return (
        <svg className="w-4 h-4 shrink-0 text-[#1D1D1F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      );
    case 'facebook':
      return (
        <svg className="w-4 h-4 shrink-0 text-[#1D1D1F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg className="w-4 h-4 shrink-0 text-[#1D1D1F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
          <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg className="w-4 h-4 shrink-0 text-[#1D1D1F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          <path d="M9.5 9.2c.2-.4.4-.4.6-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .4-.1.6l-.4.5c-.1.1-.1.3 0 .4.4.7 1 1.3 1.7 1.7.1.1.3.1.4 0l.5-.4c.2-.1.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .2 0 .4-.4.6-.6.3-1.6.4-2.8-.1-1.7-.7-3.3-2.3-4-4-.5-1.2-.4-2.2-.1-2.8z" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return null;
  }
}

function ClientBrandTickerCard({
  record,
  onNavigate,
}: {
  record: ClientEcosystemRecord;
  onNavigate: (route: AppRoute) => void;
}) {
  const wordmarkClass =
    record.wordmarkStyle === 'serif'
      ? 'font-editorial font-bold tracking-tight'
      : record.wordmarkStyle === 'mono'
        ? 'font-mono-num font-bold tracking-tight'
        : 'font-display font-semibold tracking-tight';

  const relationshipColor =
    record.relationshipType === 'Client'
      ? 'text-[#0071E3]'
      : record.relationshipType === 'AKYIN Venture'
        ? 'text-[#1D1D1F]'
        : 'text-[#6E6E73]';

  const cardBody = (
    <div className="liquid-glass-card rounded-2xl px-5 py-3.5 min-w-[238px] sm:min-w-[264px] border border-[#E8E8ED] transition-transform duration-200 hover:-translate-y-0.5">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className={`text-sm sm:text-[15px] text-[#1D1D1F] whitespace-nowrap ${wordmarkClass}`}>
            {record.name}
          </p>
          <p className="text-[11px] font-medium text-[#6E6E73] truncate max-w-[196px]">
            <span className={`font-semibold ${relationshipColor}`}>
              {record.relationshipType}
            </span>{' '}
            <span aria-hidden="true">·</span> {record.industryCategory}
          </p>
        </div>
        {(record.externalUrl || record.internalRoute) && (
          <ArrowUpRight
            className="w-3.5 h-3.5 text-[#A1A1A6] group-hover:text-[#1D1D1F] transition-colors shrink-0"
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );

  if (record.internalRoute) {
    return (
      <button
        type="button"
        onClick={() => onNavigate(record.internalRoute!)}
        aria-label={`${record.name} — ${record.relationshipType} (${record.industryCategory})`}
        className="group shrink-0 pr-4 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] rounded-2xl"
      >
        {cardBody}
      </button>
    );
  }

  if (record.externalUrl) {
    const safeUrl = sanitizeHref(record.externalUrl);
    if (safeUrl !== '#') {
      return (
        <a
          href={safeUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${record.name} — ${record.relationshipType}`}
          className="group shrink-0 pr-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] rounded-2xl"
        >
          {cardBody}
        </a>
      );
    }
  }

  return (
    <div
      className="group shrink-0 pr-4"
      aria-label={`${record.name} — ${record.relationshipType}`}
    >
      {cardBody}
    </div>
  );
}

function GenericBrandTickerCard({
  entry,
  onNavigate,
}: {
  entry: EcosystemBrandEntry;
  onNavigate?: (route: AppRoute) => void;
}) {
  const wordmarkClass =
    entry.wordmarkStyle === 'serif'
      ? 'font-editorial font-bold tracking-tight'
      : entry.wordmarkStyle === 'mono'
        ? 'font-mono-num font-bold tracking-tight'
        : 'font-display font-semibold tracking-tight';

  const badgeColor =
    entry.category === 'client'
      ? 'text-[#0071E3] bg-[#0071E3]/10'
      : entry.category === 'venture'
        ? 'text-[#1D1D1F] bg-[#1D1D1F]/8'
        : 'text-[#6E6E73] bg-[#F5F5F7]';

  const cardBody = (
    <div className="liquid-glass-card rounded-2xl px-5 py-3.5 min-w-[240px] sm:min-w-[264px] border border-[#E8E8ED] transition-transform duration-200 hover:-translate-y-0.5 bg-white/90 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className={`text-sm sm:text-[15px] text-[#1D1D1F] whitespace-nowrap ${wordmarkClass}`}>
            {entry.name}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>
              {entry.category === 'venture'
                ? 'AKYIN Venture'
                : entry.category === 'client'
                  ? 'Client'
                  : 'Platform'}
            </span>
            <span className="text-[11px] text-[#6E6E73] truncate max-w-[140px]">
              {entry.relationshipLabel}
            </span>
          </div>
        </div>
        {(entry.externalUrl || entry.internalRoute) && (
          <ArrowUpRight className="w-3.5 h-3.5 text-[#A1A1A6] group-hover:text-[#1D1D1F] transition-colors shrink-0" />
        )}
      </div>
    </div>
  );

  if (entry.externalUrl) {
    return (
      <a
        href={sanitizeHref(entry.externalUrl)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${entry.name} — ${entry.relationshipLabel}`}
        className="group shrink-0 pr-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] rounded-2xl"
      >
        {cardBody}
      </a>
    );
  }

  if (entry.internalRoute && onNavigate) {
    return (
      <button
        type="button"
        onClick={() => onNavigate(entry.internalRoute!)}
        aria-label={`${entry.name} — ${entry.relationshipLabel}`}
        className="group shrink-0 pr-4 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] rounded-2xl"
      >
        {cardBody}
      </button>
    );
  }

  return <div className="group shrink-0 pr-4">{cardBody}</div>;
}

function PlatformTickerCard({ entry }: { entry: EcosystemBrandEntry }) {
  const safeUrl = entry.externalUrl ? sanitizeHref(entry.externalUrl) : '#';
  return (
    <a
      href={safeUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${entry.name} — ${entry.relationshipLabel}`}
      className="group shrink-0 pr-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] rounded-2xl"
    >
      <div className="liquid-glass-card rounded-2xl px-5 py-3.5 min-w-[220px] sm:min-w-[244px] border border-[#E8E8ED] transition-transform duration-200 hover:-translate-y-0.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {entry.iconKey && <ThirdPartyMark iconKey={entry.iconKey} />}
            <div className="min-w-0">
              <p className="font-display font-semibold text-sm text-[#1D1D1F] whitespace-nowrap">
                {entry.name}
              </p>
              <p className="text-[11px] text-[#6E6E73] truncate max-w-[165px]">
                {entry.relationshipLabel}
              </p>
            </div>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#A1A1A6] group-hover:text-[#1D1D1F] shrink-0" aria-hidden="true" />
        </div>
      </div>
    </a>
  );
}

function useIntersectionVisible(ref: React.RefObject<HTMLDivElement | null>) {
  const [hasIntersected, setHasIntersected] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setHasIntersected(true);
          }
          setIsVisible(entry.isIntersecting);
        }
      },
      { rootMargin: '200px 0px', threshold: 0.01 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return { hasIntersected, isVisible };
}

export function EcosystemSection({ onNavigate }: EcosystemSectionProps) {
  const [activeFilter, setActiveFilter] = useState<RelationshipFilter>('all');
  const [liveTickerClients, setLiveTickerClients] = useState<EcosystemBrandEntry[]>(
    ECOSYSTEM_CLIENTS_TICKER
  );
  const [reportedClientsCount, setReportedClientsCount] = useState<number>(58);
  const brandRowRef = useRef<HTMLDivElement>(null);
  const categoryRowRef = useRef<HTMLDivElement>(null);
  const platformRowRef = useRef<HTMLDivElement>(null);

  const brandVis = useIntersectionVisible(brandRowRef);
  const categoryVis = useIntersectionVisible(categoryRowRef);
  const platformVis = useIntersectionVisible(platformRowRef);

  useEffect(() => {
    let active = true;
    suiteApi
      .fetchPublicTicker()
      .then((res) => {
        if (!active || !res?.clients) return;
        setReportedClientsCount(res.reportedClientsHandled || 58);
        setLiveTickerClients(
          res.clients.map((c) => ({
            id: c.id,
            name: c.name,
            relationshipLabel: 'Client',
            category: 'client',
            externalUrl: c.websiteUrl && c.websiteUrl.startsWith('http') ? c.websiteUrl : undefined,
            internalRoute: (c.internalShowcaseRoute || undefined) as AppRoute | undefined,
            wordmarkStyle: c.wordmarkStyle || 'sans',
          }))
        );
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const filteredRecords = useMemo(() => {
    if (activeFilter === 'all') return CLIENT_ECOSYSTEM_RECORDS;
    return CLIENT_ECOSYSTEM_RECORDS.filter((r) => r.relationshipType === activeFilter);
  }, [activeFilter]);

  const counts = useMemo(
    () => ({
      all: CLIENT_ECOSYSTEM_RECORDS.length,
      ventures: CLIENT_ECOSYSTEM_RECORDS.filter((r) => r.relationshipType === 'AKYIN Venture').length,
      clients: CLIENT_ECOSYSTEM_RECORDS.filter((r) => r.relationshipType === 'Client').length,
      ecosystem: CLIENT_ECOSYSTEM_RECORDS.filter((r) => r.relationshipType === 'Business Ecosystem').length,
    }),
    []
  );

  return (
    <section
      id="our-ecosystem"
      className="py-20 lg:py-28 surface-silver-gradient border-t border-[#E8E8ED]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* 1. CLIENT ECOSYSTEM HEADER & 58+ STATISTIC */}
        <EditorialReveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                {ECOSYSTEM_STATS.tickerHeading}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-[-0.025em] text-[#1D1D1F] text-balance">
                {ECOSYSTEM_STATS.heading}
              </h2>
              <p className="text-base text-[#6E6E73] leading-relaxed max-w-2xl">
                {ECOSYSTEM_STATS.subheading}
              </p>
            </div>

            <div className="lg:col-span-4">
              <GlassPanel className="rounded-3xl p-5 sm:p-6 border border-[#E8E8ED] space-y-1.5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono-num text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
                    {reportedClientsCount} Clients Currently Handled
                  </span>
                  <span className="text-xs font-semibold text-[#0071E3] whitespace-nowrap">
                    Verified Portfolio
                  </span>
                </div>
                <p className="font-display text-sm font-bold text-[#1D1D1F]">
                  {ECOSYSTEM_STATS.clientsHandledLabel}
                </p>
                <p className="text-[11px] text-[#6E6E73] leading-relaxed">
                  {ECOSYSTEM_STATS.clientsHandledFootnote}
                </p>
              </GlassPanel>
            </div>
          </div>
        </EditorialReveal>

        {/* 2. THREE-TIER SEPARATED TICKER (Ventures vs Clients vs Platforms) */}
        <EditorialReveal delay={0.05}>
          <div className="space-y-8">
            {/* Ticker Section Intro */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#6E6E73]">
              <span className="font-semibold uppercase tracking-[0.06em] text-[#1D1D1F]">
                {ECOSYSTEM_STATS.tickerHeading} · 3 Distinct Categories
              </span>
              <span>Hover or focus any card to pause</span>
            </div>

            {/* CATEGORY A: OUR VENTURES */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#6E6E73] px-1">
                <span className="font-semibold uppercase tracking-[0.06em] text-[#1D1D1F] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#1D1D1F]" />
                  Category A · OUR VENTURES (Genuinely Owned &amp; Operated by AKYIN)
                </span>
                <span className="text-[11px] font-medium text-[#1D1D1F]">
                  Core Group Operating Verticals
                </span>
              </div>

              <div
                ref={brandRowRef}
                aria-label="Category A — AKYIN Owned Ventures Ticker"
                className="akyin-marquee-container relative overflow-x-auto sm:overflow-hidden py-1.5 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
              >
                {brandVis.hasIntersected && (
                  <div
                    className="akyin-marquee-track-left"
                    style={brandVis.isVisible ? undefined : { animationPlayState: 'paused' }}
                  >
                    <div className="flex items-center motion-reduce:flex-wrap motion-reduce:gap-y-3">
                      {ECOSYSTEM_VENTURES_TICKER.map((entry) => (
                        <GenericBrandTickerCard
                          key={`ven-a-${entry.id}`}
                          entry={entry}
                          onNavigate={onNavigate}
                        />
                      ))}
                    </div>
                    <div className="flex items-center motion-reduce:hidden" aria-hidden="true">
                      {ECOSYSTEM_VENTURES_TICKER.map((entry) => (
                        <GenericBrandTickerCard
                          key={`ven-b-${entry.id}`}
                          entry={entry}
                          onNavigate={onNavigate}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CATEGORY B: OUR CLIENTS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#6E6E73] px-1">
                <span className="font-semibold uppercase tracking-[0.06em] text-[#0071E3] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0071E3]" />
                  Category B · OUR CLIENTS (Independent Businesses Supported for Growth)
                </span>
                <span className="text-[11px] font-semibold text-[#0071E3]">
                  {reportedClientsCount} Clients Currently Handled · {liveTickerClients.length} Shown
                </span>
              </div>

              <div
                aria-label="Category B — AKYIN Client Relationships Ticker"
                className="akyin-marquee-container relative overflow-x-auto sm:overflow-hidden py-1.5 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
              >
                {brandVis.hasIntersected && liveTickerClients.length > 0 && (
                  <div
                    className="akyin-marquee-track-right"
                    style={brandVis.isVisible ? undefined : { animationPlayState: 'paused' }}
                  >
                    <div className="flex items-center motion-reduce:flex-wrap motion-reduce:gap-y-3">
                      {liveTickerClients.map((entry) => (
                        <GenericBrandTickerCard
                          key={`cli-a-${entry.id}`}
                          entry={entry}
                          onNavigate={onNavigate}
                        />
                      ))}
                    </div>
                    <div className="flex items-center motion-reduce:hidden" aria-hidden="true">
                      {liveTickerClients.map((entry) => (
                        <GenericBrandTickerCard
                          key={`cli-b-${entry.id}`}
                          entry={entry}
                          onNavigate={onNavigate}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CATEGORY C: OUR PLATFORMS & ECOSYSTEM */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#6E6E73] px-1">
                <span className="font-semibold uppercase tracking-[0.06em] text-[#6E6E73] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#6E6E73]" />
                  Category C · OUR PLATFORMS &amp; ECOSYSTEM (Marketplaces &amp; Official Channels)
                </span>
                <span className="text-[11px] text-[#6E6E73]">
                  Independent Marketplaces &amp; Media
                </span>
              </div>

              <div
                aria-label="Category C — Distribution Marketplaces & Official Channels Ticker"
                className="akyin-marquee-container relative overflow-x-auto sm:overflow-hidden py-1.5 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
              >
                {brandVis.hasIntersected && (
                  <div
                    className="akyin-marquee-track-left"
                    style={brandVis.isVisible ? undefined : { animationPlayState: 'paused' }}
                  >
                    <div className="flex items-center motion-reduce:flex-wrap motion-reduce:gap-y-3">
                      {ECOSYSTEM_PLATFORMS_TICKER.map((entry) => (
                        <PlatformTickerCard key={`plat-tier-a-${entry.id}`} entry={entry} />
                      ))}
                    </div>
                    <div className="flex items-center motion-reduce:hidden" aria-hidden="true">
                      {ECOSYSTEM_PLATFORMS_TICKER.map((entry) => (
                        <PlatformTickerCard key={`plat-tier-b-${entry.id}`} entry={entry} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Distinct Industry Categories Strip (Never mislabeled as client names) */}
            <div className="space-y-2.5 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#6E6E73]">
                <span className="font-semibold text-[#1D1D1F]">
                  Industry Categories We Serve
                </span>
                <span>Cross-sector coverage across India &amp; UAE</span>
              </div>

              <div
                ref={categoryRowRef}
                aria-label="Industry categories served across AKYIN Ventures"
                className="akyin-marquee-container relative overflow-x-auto sm:overflow-hidden py-1.5 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
              >
                {categoryVis.hasIntersected && (
                  <div
                    className="akyin-marquee-track-right"
                    style={categoryVis.isVisible ? undefined : { animationPlayState: 'paused' }}
                  >
                    <div className="flex items-center motion-reduce:flex-wrap motion-reduce:gap-2">
                      {ECOSYSTEM_INDUSTRY_CATEGORIES.map((categoryName) => (
                        <div
                          key={`cat-a-${categoryName}`}
                          className="shrink-0 pr-3"
                        >
                          <div className="bg-white/85 backdrop-blur-md border border-[#E8E8ED] rounded-xl px-4 py-2 text-xs font-medium text-[#1D1D1F] whitespace-nowrap shadow-[0_2px_8px_rgba(0,0,0,0.025)]">
                            {categoryName}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center motion-reduce:hidden" aria-hidden="true">
                      {ECOSYSTEM_INDUSTRY_CATEGORIES.map((categoryName) => (
                        <div
                          key={`cat-b-${categoryName}`}
                          className="shrink-0 pr-3"
                        >
                          <div className="bg-white/85 backdrop-blur-md border border-[#E8E8ED] rounded-xl px-4 py-2 text-xs font-medium text-[#1D1D1F] whitespace-nowrap shadow-[0_2px_8px_rgba(0,0,0,0.025)]">
                            {categoryName}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </EditorialReveal>

        {/* 3. CLIENT RELATIONSHIP DIRECTORY GRID (Separate AKYIN Ventures vs Client vs Ecosystem) */}
        <EditorialReveal delay={0.08}>
          <div className="pt-8 border-t border-[#1D1D1F]/10 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                  Verified Ownership &amp; Relationship Clarity
                </p>
                <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[#1D1D1F]">
                  Ventures, Client Relationships &amp; Business Ecosystem.
                </h3>
                <p className="text-sm text-[#6E6E73] max-w-2xl">
                  AKYIN-owned ventures are explicitly distinguished from independent external client engagements and commercial ecosystem partners.
                </p>
              </div>

              <div
                role="tablist"
                aria-label="Filter businesses by relationship type"
                className="flex flex-wrap gap-1.5 p-1.5 liquid-glass-nav rounded-2xl w-fit"
              >
                {[
                  { id: 'all' as const, label: `All (${counts.all})` },
                  { id: 'AKYIN Venture' as const, label: `AKYIN Ventures (${counts.ventures})` },
                  { id: 'Client' as const, label: `Client Relationships (${counts.clients})` },
                  { id: 'Business Ecosystem' as const, label: `Business Ecosystem (${counts.ecosystem})` },
                ].map((tab) => {
                  const active = activeFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveFilter(tab.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                        active
                          ? 'bg-[#1D1D1F] text-white shadow-xs'
                          : 'text-[#1D1D1F] hover:bg-white/80'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRecords.map((record) => {
                const wordmarkCls =
                  record.wordmarkStyle === 'serif'
                    ? 'font-editorial font-bold'
                    : record.wordmarkStyle === 'mono'
                      ? 'font-mono-num font-bold'
                      : 'font-display font-bold';

                return (
                  <article
                    key={record.id}
                    className="liquid-glass-card rounded-2xl p-6 border border-[#E8E8ED] flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2 text-xs text-[#6E6E73]">
                        <span
                          className={`font-semibold ${
                            record.relationshipType === 'Client'
                              ? 'text-[#0071E3]'
                              : 'text-[#1D1D1F]'
                          }`}
                        >
                          {record.relationshipType}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate font-medium">{record.industryCategory}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white border border-[#E8E8ED] flex items-center justify-center shrink-0 text-[#1D1D1F]">
                          {record.relationshipType === 'AKYIN Venture' ? (
                            <Layers className="w-4 h-4" aria-hidden="true" />
                          ) : record.relationshipType === 'Client' ? (
                            <Briefcase className="w-4 h-4 text-[#0071E3]" aria-hidden="true" />
                          ) : (
                            <Building2 className="w-4 h-4" aria-hidden="true" />
                          )}
                        </div>
                        <h4 className={`text-lg sm:text-xl text-[#1D1D1F] tracking-tight ${wordmarkCls}`}>
                          {record.name}
                        </h4>
                      </div>

                      <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed">
                        {record.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#1D1D1F]/8 flex flex-wrap items-center justify-between gap-3 text-xs">
                      {record.internalRoute ? (
                        <button
                          type="button"
                          onClick={() => onNavigate(record.internalRoute!)}
                          className="inline-flex items-center gap-1.5 font-semibold text-[#1D1D1F] hover:underline cursor-pointer"
                        >
                          <span>Explore Venture</span>
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      ) : (
                        <span className="text-[#6E6E73] font-medium">
                          {record.relationshipType === 'Client'
                            ? 'Client Engagement'
                            : 'Ecosystem Relationship'}
                        </span>
                      )}

                      {record.externalUrl && (
                        <a
                          href={sanitizeHref(record.externalUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-[#0071E3] hover:underline"
                        >
                          <span>{record.externalLabel || 'Visit Website'}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </EditorialReveal>

      </div>
    </section>
  );
}
