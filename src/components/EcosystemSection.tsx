import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Briefcase } from 'lucide-react';
import {
  AppRoute,
  ECOSYSTEM_CLIENT,
  ECOSYSTEM_PLATFORMS_TICKER,
  ECOSYSTEM_VENTURES_TICKER,
  EcosystemBrandEntry,
  FULL_ECOSYSTEM_TICKER,
} from '../data/akyinData';
import { sanitizeHref } from '../utils/security';
import { EditorialReveal } from './EditorialReveal';

interface EcosystemSectionProps {
  onNavigate: (route: AppRoute) => void;
}

function ThirdPartyMark({ iconKey }: { iconKey?: EcosystemBrandEntry['iconKey'] }) {
  switch (iconKey) {
    case 'amazon':
      return (
        <svg className="w-5 h-5 shrink-0 text-[#1D1D1F]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4.5 16.5c4.2 2.9 10.6 3.1 15 0.4"
            stroke="#1D1D1F"
            strokeWidth="2"
            strokeLinecap="round"
          />
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
          <path
            d="M4.5 3.6c-.3.3-.5.8-.5 1.4v14c0 .6.2 1.1.5 1.4l.1.1 7.8-7.8v-.2L4.6 3.5l-.1.1z"
            fill="#6E6E73"
          />
          <path
            d="M15 15.1l-2.6-2.6v-.2l2.6-2.6.1.1 3.1 1.8c.9.5.9 1.3 0 1.8l-3.1 1.7-.1 0z"
            fill="#3A3A3F"
          />
          <path
            d="M15.1 15l-2.7-2.7L4.5 20.2c.3.3.9.3 1.5 0l9.1-5.2z"
            fill="#1D1D1F"
            opacity="0.85"
          />
          <path
            d="M15.1 9L6 3.8c-.6-.3-1.2-.3-1.5 0l7.9 7.9L15.1 9z"
            fill="#A1A1A6"
          />
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
    case 'x':
      return (
        <svg className="w-4 h-4 shrink-0 text-[#1D1D1F]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg className="w-4 h-4 shrink-0 text-[#1D1D1F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
          <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return null;
  }
}

function TickerItemCard({
  entry,
  onNavigate,
}: {
  entry: EcosystemBrandEntry;
  onNavigate: (route: AppRoute) => void;
}) {
  const wordmarkClass =
    entry.wordmarkStyle === 'serif'
      ? 'font-editorial font-bold tracking-tight'
      : entry.wordmarkStyle === 'mono'
        ? 'font-mono-num font-bold tracking-tight'
        : 'font-display font-semibold tracking-tight';

  const relationshipTone =
    entry.category === 'client'
      ? 'text-[#1D1D1F] font-semibold'
      : entry.category === 'venture'
        ? 'text-[#1D1D1F]'
        : 'text-[#6E6E73]';

  const innerContent = (
    <div className="liquid-glass-card rounded-2xl px-5 py-3.5 min-w-[220px] sm:min-w-[248px] transition-transform duration-200 hover:-translate-y-0.5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {entry.iconKey && <ThirdPartyMark iconKey={entry.iconKey} />}
          <div className="min-w-0">
            <p className={`text-sm sm:text-[15px] text-[#1D1D1F] whitespace-nowrap ${wordmarkClass}`}>
              {entry.name}
            </p>
            <p className={`text-[11px] font-medium truncate max-w-[175px] ${relationshipTone}`}>
              {entry.relationshipLabel}
            </p>
          </div>
        </div>

        {(entry.externalUrl || entry.internalRoute) && (
          <ArrowUpRight
            className="w-3.5 h-3.5 text-[#A1A1A6] group-hover:text-[#1D1D1F] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0"
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );

  if (entry.externalUrl) {
    const safeUrl = sanitizeHref(entry.externalUrl);
    if (safeUrl !== '#') {
      return (
        <a
          href={safeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group shrink-0 pr-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1D1F]/35 rounded-2xl"
          aria-label={`${entry.name} — ${entry.relationshipLabel}`}
        >
          {innerContent}
        </a>
      );
    }
  }

  if (entry.internalRoute) {
    return (
      <button
        type="button"
        onClick={() => onNavigate(entry.internalRoute!)}
        className="group shrink-0 pr-4 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1D1F]/35 rounded-2xl"
        aria-label={`${entry.name} — ${entry.relationshipLabel}`}
      >
        {innerContent}
      </button>
    );
  }

  return (
    <div
      className="group shrink-0 pr-4"
      aria-label={`${entry.name} — ${entry.relationshipLabel}`}
    >
      {innerContent}
    </div>
  );
}

function InfiniteTickerRow({
  items,
  direction = 'left',
  label,
  onNavigate,
}: {
  items: EcosystemBrandEntry[];
  direction?: 'left' | 'right';
  label: string;
  onNavigate: (route: AppRoute) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [hasIntersected, setHasIntersected] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = rowRef.current;
    if (!node || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setHasIntersected(true);
      setIsVisible(true);
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
      { rootMargin: '220px 0px', threshold: 0.01 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const trackClass =
    direction === 'left' ? 'akyin-marquee-track-left' : 'akyin-marquee-track-right';

  return (
    <div
      ref={rowRef}
      aria-label={label}
      className="akyin-marquee-container relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
    >
      {!hasIntersected ? (
        <div className="flex items-center gap-4 overflow-hidden" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((slot) => (
            <div
              key={slot}
              className="min-w-[220px] sm:min-w-[248px] h-[68px] shrink-0 rounded-2xl bg-white/75 border border-white animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div
          className={trackClass}
          style={isVisible ? undefined : { animationPlayState: 'paused' }}
        >
          <div className="flex items-center motion-reduce:flex-wrap motion-reduce:gap-y-3">
            {items.map((entry) => (
              <TickerItemCard
                key={`a-${entry.id}`}
                entry={entry}
                onNavigate={onNavigate}
              />
            ))}
          </div>
          <div className="flex items-center motion-reduce:hidden" aria-hidden="true">
            {items.map((entry) => (
              <TickerItemCard
                key={`b-${entry.id}`}
                entry={entry}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function EcosystemSection({ onNavigate }: EcosystemSectionProps) {
  return (
    <section
      id="our-ecosystem"
      className="py-20 lg:py-28 surface-silver-gradient border-t border-[#E8E8ED]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Ecosystem Heading */}
        <EditorialReveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                Our Business Ecosystem
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-[-0.025em] text-[#1D1D1F] text-balance">
                A Growing Business Ecosystem.
              </h2>
              <p className="text-base text-[#6E6E73] leading-relaxed">
                A collection of ventures, brands, clients and platforms connected through business, marketing, commerce, publishing and digital innovation.
              </p>
            </div>
            <p className="text-xs font-medium text-[#6E6E73] shrink-0">
              <span className="font-mono-num font-bold text-[#1D1D1F]">
                {FULL_ECOSYSTEM_TICKER.length}
              </span>{' '}
              Connected Entries · Clear Ownership &amp; Relationship Labels
            </p>
          </div>
        </EditorialReveal>

        {/* Full 16-Item Continuous Network Strip */}
        <EditorialReveal delay={0.05}>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4 text-xs text-[#6E6E73]">
              <span className="font-semibold text-[#1D1D1F]">
                Combined Brand, Client &amp; Platform Network
              </span>
              <span className="hidden sm:inline">Hover or focus to pause</span>
            </div>
            <InfiniteTickerRow
              items={FULL_ECOSYSTEM_TICKER}
              direction="left"
              label="AKYIN Ventures 16-item business ecosystem ticker"
              onNavigate={onNavigate}
            />
          </div>
        </EditorialReveal>

        {/* Subsection A: OUR VENTURES */}
        <EditorialReveal delay={0.08}>
          <div className="pt-8 border-t border-[#1D1D1F]/10 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                  01 · Our Ventures
                </p>
                <h3 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F]">
                  AKYIN-Owned Brands &amp; Operating Businesses
                </h3>
                <p className="text-sm text-[#6E6E73]">
                  Seven operating ventures managed under the AKYIN Ventures parent umbrella.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('/ventures')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D1D1F] hover:underline transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Explore Visual Venture Grid
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>

            <InfiniteTickerRow
              items={ECOSYSTEM_VENTURES_TICKER}
              direction="left"
              label="AKYIN Ventures owned brands ticker"
              onNavigate={onNavigate}
            />
          </div>
        </EditorialReveal>

        {/* Subsection B: OUR CLIENTS */}
        <EditorialReveal delay={0.1}>
          <div className="pt-8 border-t border-[#1D1D1F]/10 space-y-5">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                02 · Our Clients
              </p>
              <h3 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F]">
                Client Relationships
              </h3>
              <p className="text-sm text-[#6E6E73]">
                External client engagements presented distinctly from owned AKYIN ventures.
              </p>
            </div>

            <div className="liquid-glass-panel rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFFFFF] border border-[#E8E8ED] flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5 text-[#1D1D1F]" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E6E73]">
                    <span className="font-semibold text-[#1D1D1F]">
                      {ECOSYSTEM_CLIENT.relationshipLabel}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>External Client Relationship (Not an AKYIN-owned brand)</span>
                  </div>
                  <p className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[#1D1D1F]">
                    {ECOSYSTEM_CLIENT.name}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('/ventures/marketing')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full liquid-glass-cta text-xs font-semibold text-[#1D1D1F] transition-all whitespace-nowrap shrink-0 cursor-pointer"
              >
                Explore Marketing Agency
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </EditorialReveal>

        {/* Subsection C: OUR PLATFORMS & ECOSYSTEM */}
        <EditorialReveal delay={0.12}>
          <div className="pt-8 border-t border-[#1D1D1F]/10 space-y-5">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
                03 · Our Platforms &amp; Ecosystem
              </p>
              <h3 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F]">
                Distribution Marketplaces, Commerce Infrastructure &amp; Social Channels
              </h3>
              <p className="text-sm text-[#6E6E73]">
                Independent platforms and social media channels used across publishing, commerce, and marketing distribution.
              </p>
            </div>

            <InfiniteTickerRow
              items={ECOSYSTEM_PLATFORMS_TICKER}
              direction="right"
              label="Third-party publishing, commerce and social platforms ticker"
              onNavigate={onNavigate}
            />
          </div>
        </EditorialReveal>
      </div>
    </section>
  );
}
