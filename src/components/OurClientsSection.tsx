import React, { useState } from 'react';
import {
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles,
  Users,
} from 'lucide-react';
import { AKYIN_CLIENTS, CLIENT_STATS, ClientItem } from '../data/clientsData';
import { AppRoute } from '../data/akyinData';
import { EditorialReveal } from './EditorialReveal';
import { GlassPanel } from './liquid-glass';
import { sanitizeHref } from '../utils/security';

interface OurClientsSectionProps {
  id?: string;
  className?: string;
  backgroundClass?: string;
  onNavigate?: (route: AppRoute) => void;
  clientCountDisplay?: string;
  clientSupportTextDisplay?: string;
}

export function OurClientsSection({
  id = 'our-clients',
  className = '',
  backgroundClass = 'bg-[#FFFFFF]',
  onNavigate,
  clientCountDisplay,
  clientSupportTextDisplay,
}: OurClientsSectionProps) {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const countDisplay = clientCountDisplay || CLIENT_STATS.clientCount;
  const supportTextDisplay =
    clientSupportTextDisplay || CLIENT_STATS.clientSupportText;

  const categories = [
    { id: 'all', label: 'All Clients (10)' },
    { id: 'featured-four', label: 'Featured Growth Clients (4)' },
    { id: 'retail-trade', label: 'Retail, Trade & Commerce' },
    { id: 'tech-advisory', label: 'Tech & Advisory' },
  ];

  const filteredClients = AKYIN_CLIENTS.filter((client) => {
    if (activeCategoryFilter === 'all') return true;
    if (activeCategoryFilter === 'featured-four') {
      return ['aicalc', 'kartigo', 'biznxt', 'budget-bazaar'].includes(client.id);
    }
    if (activeCategoryFilter === 'retail-trade') {
      return [
        'kartigo',
        'budget-bazaar',
        'mei-cosmetics',
        'krutika-cosmetics',
        'nyika-traders',
        'ns-traders',
      ].includes(client.id);
    }
    if (activeCategoryFilter === 'tech-advisory') {
      return ['aicalc', 'biznxt', 'autoclub', 'arosco-ventures'].includes(client.id);
    }
    return true;
  });

  return (
    <section
      id={id}
      aria-label="Our Clients and Business Relationships"
      className={`py-20 lg:py-28 border-t border-[#E8E8ED] ${backgroundClass} ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header & 58 Clients Metric Banner */}
        <EditorialReveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-[#F5F5F7] border border-[#E8E8ED] text-[#1D1D1F]">
                <Users className="w-3.5 h-3.5 text-[#0071E3]" />
                <span className="uppercase tracking-[0.08em] text-[#6E6E73]">
                  {CLIENT_STATS.sectionTitle}
                </span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#1D1D1F] text-balance">
                {CLIENT_STATS.sectionHeading}
              </h2>

              <p className="text-base sm:text-lg text-[#6E6E73] leading-relaxed max-w-2xl text-balance">
                Independent companies and business founders supported by AKYIN across marketing, customer acquisition, lead qualification, and digital solutions.
              </p>
            </div>

            {/* Exact Configurable Metric Card: 58 Clients */}
            <div className="lg:col-span-4">
              <GlassPanel className="rounded-3xl p-6 border border-[#E8E8ED] shadow-xs space-y-2 bg-[#F5F5F7]/80">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono-num text-3xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F]">
                    {countDisplay}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0071E3] bg-[#0071E3]/10 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Portfolio
                  </span>
                </div>
                <p className="font-display text-sm font-bold text-[#1D1D1F]">
                  Businesses &amp; Client Relationships
                </p>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  {supportTextDisplay}
                </p>
              </GlassPanel>
            </div>
          </div>
        </EditorialReveal>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {categories.map((cat) => {
            const active = activeCategoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategoryFilter(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-[#1D1D1F] text-[#FFFFFF] shadow-sm'
                    : 'bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#6E6E73] hover:text-[#1D1D1F] border border-[#E8E8ED]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Client Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredClients.map((client, idx) => {
            const isFeaturedFour = [
              'aicalc',
              'kartigo',
              'biznxt',
              'budget-bazaar',
            ].includes(client.id);

            const wordmarkClass =
              client.wordmarkStyle === 'mono'
                ? 'font-mono-num font-bold tracking-tight'
                : client.wordmarkStyle === 'serif'
                  ? 'font-editorial font-bold tracking-tight'
                  : 'font-display font-bold tracking-tight';

            return (
              <EditorialReveal
                key={client.id}
                delay={(idx % 4) * 0.08}
                className="h-full flex flex-col"
              >
                <article
                  className={`group relative h-full flex flex-col justify-between liquid-glass-card rounded-2xl p-6 bg-[#FFFFFF] border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
                    isFeaturedFour
                      ? 'border-[#0071E3]/25 shadow-sm hover:border-[#0071E3]/50'
                      : 'border-[#E8E8ED] hover:border-[#D1D1D6]'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Card Top: Category Badge & Relationship Indicator */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F5F5F7] text-[#1D1D1F] border border-[#E8E8ED]">
                        <Briefcase className="w-3 h-3 text-[#0071E3]" />
                        {client.category}
                      </span>
                      <span className="text-[11px] font-semibold text-[#0071E3]">
                        Client
                      </span>
                    </div>

                    {/* Client Name & Wordmark */}
                    <div>
                      <h3 className={`text-xl sm:text-2xl text-[#1D1D1F] ${wordmarkClass}`}>
                        {client.name}
                      </h3>
                      <p className="text-xs text-[#0071E3] font-medium mt-0.5">
                        {client.supportScope}
                      </p>
                    </div>

                    {/* Summary */}
                    <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed line-clamp-3">
                      {client.summary}
                    </p>
                  </div>

                  {/* Actions / Website Button */}
                  <div className="pt-5 mt-4 border-t border-[#E8E8ED] space-y-2">
                    {client.websiteUrl ? (
                      <a
                        href={sanitizeHref(client.websiteUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#F5F5F7] group-hover:bg-[#0071E3] text-[#1D1D1F] group-hover:text-[#FFFFFF] border border-[#E8E8ED] group-hover:border-[#0071E3] transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.98]"
                        title={`Open ${client.name} website in new tab`}
                      >
                        <span>{client.websiteLabel || 'Visit Website'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    ) : (
                      <div className="w-full py-2 text-center text-xs text-[#86868B] font-medium">
                        Private Commercial Relationship
                      </div>
                    )}

                    {client.isPreviewUrl && (
                      <p className="text-[10px] text-center text-[#86868B] italic">
                        Preview environment gateway
                      </p>
                    )}
                  </div>
                </article>
              </EditorialReveal>
            );
          })}
        </div>

        {/* Client Relationship Clarification Note */}
        <div className="pt-4 text-center">
          <p className="text-xs text-[#86868B] max-w-2xl mx-auto leading-relaxed">
            {CLIENT_STATS.clientDisclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
