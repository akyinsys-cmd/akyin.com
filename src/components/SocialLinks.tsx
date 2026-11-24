import { ArrowUpRight } from 'lucide-react';
import { OFFICIAL_CONTACT } from '../data/akyinData';
import { useSiteConfig } from '../context/SiteConfigContext';
import { sanitizeHref } from '../utils/security';

interface SocialLinksProps {
  variant?: 'compact' | 'card' | 'inline' | 'icon-row';
  className?: string;
}

type OfficialSocialId = 'facebook' | 'youtube' | 'instagram' | 'whatsapp';

export function PlatformIcon({ id }: { id: OfficialSocialId }) {
  switch (id) {
    case 'facebook':
      return (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M13.5 21v-7.5h2.52l.38-2.93H13.5V8.7c0-.85.24-1.43 1.46-1.43h1.56V4.64c-.27-.04-1.2-.12-2.28-.12-2.26 0-3.8 1.38-3.8 3.91v2.14H8v2.93h2.44V21h3.06z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.27 5 12 5 12 5s-6.27 0-7.82.42A2.5 2.5 0 0 0 2.42 7.2 26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C5.73 19 12 19 12 19s6.27 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.42-4.81zM10 15.15V8.85L15.45 12 10 15.15z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect width="18" height="18" x="3" y="3" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.25" cy="6.75" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20.5 11.5a8.5 8.5 0 0 1-12.64 7.42L3.5 20.5l1.62-4.24A8.5 8.5 0 1 1 20.5 11.5z" />
          <path
            d="M9.6 8.9c.2-.4.4-.4.6-.4h.5c.18 0 .38.07.48.32l.65 1.56c.08.2.05.4-.08.56l-.42.48c-.1.12-.12.27-.04.42.44.78 1.07 1.41 1.85 1.85.15.08.3.06.42-.04l.48-.42c.16-.13.36-.16.56-.08l1.56.65c.25.1.32.3.32.48v.5c0 .2 0 .4-.4.6-.55.28-1.56.45-2.9-.12-1.75-.74-3.33-2.32-4.07-4.07-.57-1.34-.4-2.35-.12-2.9z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );
  }
}

export function SocialLinks({ variant = 'compact', className = '' }: SocialLinksProps) {
  const { settings } = useSiteConfig();

  const resolvedSocials = OFFICIAL_CONTACT.marketingSocials.map((s) => {
    const dynamicUrl =
      s.id === 'instagram'
        ? settings.instagramUrl
        : s.id === 'facebook'
          ? settings.facebookUrl
          : s.id === 'youtube'
            ? settings.youtubeUrl
            : s.url;
    return {
      ...s,
      url: sanitizeHref(dynamicUrl || s.url, s.url),
    };
  });

  if (variant === 'card') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${className}`}>
        {resolvedSocials.map((social) => (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            title={social.displayLabel}
            aria-label={`${social.displayLabel} (opens in a new tab)`}
            className="liquid-glass-card flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl hover:border-[#0071E3]/30 text-[#1D1D1F] transition-all duration-200 hover:-translate-y-0.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3]"
          >
            <span className="flex items-center gap-2.5 text-sm font-semibold min-w-0">
              <span className="w-8 h-8 rounded-xl bg-[#F5F5F7] border border-[#E8E8ED] flex items-center justify-center text-[#1D1D1F] group-hover:text-[#0071E3] group-hover:border-[#0071E3]/25 transition-colors shrink-0">
                <PlatformIcon id={social.id} />
              </span>
              <span className="truncate">{social.displayLabel}</span>
            </span>
            <ArrowUpRight
              className="w-3.5 h-3.5 text-[#6E6E73] group-hover:text-[#0071E3] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </a>
        ))}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
        {resolvedSocials.map((social) => (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            title={social.displayLabel}
            aria-label={`${social.displayLabel} (opens in a new tab)`}
            className="liquid-glass-cta group inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold text-[#1D1D1F] hover:border-[#0071E3]/35 hover:text-[#0071E3] transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3]"
          >
            <span className="text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">
              <PlatformIcon id={social.id} />
            </span>
            <span>{social.displayLabel}</span>
          </a>
        ))}
      </div>
    );
  }

  if (variant === 'icon-row') {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        {resolvedSocials.map((social) => (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            title={social.displayLabel}
            aria-label={`${social.displayLabel} (opens in a new tab)`}
            className="group relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#FFFFFF] border border-[#E8E8ED] text-[#1D1D1F] hover:text-[#0071E3] hover:border-[#0071E3]/35 hover:-translate-y-0.5 shadow-2xs transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3]"
          >
            <PlatformIcon id={social.id} />
          </a>
        ))}
      </div>
    );
  }

  return (
    <ul className={`space-y-2.5 text-sm ${className}`}>
      {resolvedSocials.map((social) => (
        <li key={social.id}>
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            title={social.displayLabel}
            aria-label={`${social.displayLabel} (opens in a new tab)`}
            className="group inline-flex items-center gap-2.5 text-[#1D1D1F] hover:text-[#0071E3] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] rounded-md"
          >
            <span className="w-7 h-7 rounded-lg bg-[#FFFFFF] border border-[#E8E8ED] flex items-center justify-center text-[#6E6E73] group-hover:text-[#0071E3] group-hover:border-[#0071E3]/30 transition-colors shrink-0">
              <PlatformIcon id={social.id} />
            </span>
            <span className="text-xs font-medium">{social.displayLabel}</span>
            <ArrowUpRight
              className="w-3.5 h-3.5 text-[#A1A1A6] group-hover:text-[#0071E3] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0"
              aria-hidden="true"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
