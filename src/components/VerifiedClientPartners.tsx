import React, { useEffect, useState } from 'react';
import { AKYIN_CLIENTS } from '../data/clientsData';
import { suiteApi } from '../services/suiteApi';
import { EditorialReveal } from './EditorialReveal';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

interface VerifiedClientPartnersProps {
  id?: string;
  className?: string;
}

export function VerifiedClientPartners({
  id = 'verified-client-partners',
  className = '',
}: VerifiedClientPartnersProps) {
  const [clients, setClients] = useState(
    AKYIN_CLIENTS.map((c) => ({
      id: c.id,
      name: c.name,
      category: c.category,
      wordmarkStyle: c.wordmarkStyle || 'sans',
    }))
  );
  const [reportedCount, setReportedCount] = useState(58);

  useEffect(() => {
    let active = true;
    suiteApi
      .fetchPublicTicker()
      .then((res) => {
        if (!active || !res?.clients) return;
        setReportedCount(res.reportedClientsHandled || 58);
        setClients(
          res.clients.map((c) => ({
            id: c.id,
            name: c.name,
            category: c.category,
            wordmarkStyle: c.wordmarkStyle || 'sans',
          }))
        );
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      id={id}
      aria-label="Verified Client Partners"
      className={`py-16 lg:py-24 bg-[#F5F5F7] border-y border-[#E8E8ED] ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <EditorialReveal className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFFFF] border border-[#E8E8ED] text-xs font-semibold text-[#1D1D1F] shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0071E3]" />
            <span className="uppercase tracking-[0.08em] text-[#6E6E73]">
              Verified Client Portfolio · {reportedCount} Clients Currently Handled
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F]">
            Trusted by Growth Founders &amp; Commercial Brands.
          </h2>
          <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed">
            Featuring {clients.length} verified client brands currently displayed from our {reportedCount}-client portfolio across B2B commerce, cosmetics, automotive retail, AI tools, and wholesale trade.
          </p>
        </EditorialReveal>

        {/* Grayscale Logo / Brand Grid with Subtle Hover Zoom */}
        <EditorialReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
            {clients.map((client) => {
              const wordmarkClass =
                client.wordmarkStyle === 'mono'
                  ? 'font-mono-num font-bold tracking-tight'
                  : client.wordmarkStyle === 'serif'
                    ? 'font-editorial font-bold tracking-tight'
                    : 'font-display font-bold tracking-tight';

              return (
                <div
                  key={client.id}
                  className="group relative bg-[#FFFFFF] rounded-2xl p-5 border border-[#E8E8ED] flex flex-col items-center justify-center text-center aspect-[4/3] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#0071E3]/30 overflow-hidden"
                  title={`${client.name} — ${client.category}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0071E3]/0 to-[#0071E3]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div className="transform transition-transform duration-300 group-hover:scale-105 space-y-1.5 z-10">
                    <span
                      className={`text-base sm:text-lg text-[#1D1D1F]/75 group-hover:text-[#1D1D1F] transition-colors ${wordmarkClass}`}
                    >
                      {client.name}
                    </span>
                    <p className="text-[10px] uppercase tracking-wider text-[#86868B] group-hover:text-[#0071E3] transition-colors">
                      {client.category}
                    </p>
                  </div>

                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0071E3]" />
                  </div>
                </div>
              );
            })}
          </div>
        </EditorialReveal>

        {/* Bottom Stat Footer */}
        <div className="text-center pt-2">
          <p className="text-xs text-[#86868B] font-medium">
            {reportedCount} Clients Currently Handled across India and the UAE. Additional private client records remain confidential unless verified for public showcase.
          </p>
        </div>
      </div>
    </section>
  );
}
