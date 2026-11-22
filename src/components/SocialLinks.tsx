import { ArrowUpRight } from 'lucide-react';
import { OFFICIAL_CONTACT } from '../data/akyinData';
import { useSiteConfig } from '../context/SiteConfigContext';
import { sanitizeHref } from '../utils/security';

interface SocialLinksProps {
  variant?: 'compact' | 'card' | 'inline';
  className?: string;
}

function PlatformIcon({ id }: { id: 'instagram' | 'facebook' | 'x' | 'youtube' }) {
  switch (id) {
    case 'instagram':
      return (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      );
    case 'facebook':
      return (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case 'x':
      return (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
          <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" stroke="none" />
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
          : s.id === 'x'
            ? settings.xUrl
            : settings.youtubeUrl;
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
            className="liquid-glass-card flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl hover:border-white text-[#1D1D1F] transition-all duration-200 hover:-translate-y-0.5 group"
          >
            <span className="flex items-center gap-2.5 text-sm font-semibold">
              <span className="text-[#1D1D1F]">
                <PlatformIcon id={social.id} />
              </span>
              <span>{social.name}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-[#6E6E73] group-hover:text-[#1D1D1F]">
              <span>{social.handle}</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </span>
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
            aria-label={`${social.name} (${social.handle})`}
            className="liquid-glass-cta group inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold text-[#1D1D1F] hover:bg-white/95 transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap"
          >
            <span className="transition-transform duration-200 group-hover:scale-110">
              <PlatformIcon id={social.id} />
            </span>
            <span>{social.name}</span>
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
            className="group inline-flex items-center gap-2.5 text-[#1D1D1F] hover:text-black transition-colors"
          >
            <span className="text-[#6E6E73] group-hover:text-[#1D1D1F] transition-all duration-200 group-hover:scale-110">
              <PlatformIcon id={social.id} />
            </span>
            <span>{social.name}</span>
            <span className="text-xs text-[#6E6E73]">({social.handle})</span>
            <ArrowUpRight
              className="w-3.5 h-3.5 text-[#A1A1A6] group-hover:text-[#1D1D1F] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
