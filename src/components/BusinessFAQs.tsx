import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'group-architecture',
    category: 'Group Structure',
    question: 'How does AKYIN Ventures operate its business ventures and client relationships?',
    answer:
      'AKYIN Ventures serves as the parent corporate group operating three core businesses: AKYIN Publishing, AKYIN Marketing (including its specialized Automotive Division), and AKYIN Store (AKYIN Thrift). Concurrently, AKYIN acts as a growth, digital solutions, and marketing partner for 58+ client businesses—including AICalc, Kartigo, BizNXT, Budget Bazaar, and AutoClub—which remain independent businesses supported by our services.',
  },
  {
    id: 'ecosystem-distinction',
    category: 'Ecosystem & Attribution',
    question:
      'How do owned ventures, clients, and third-party platforms differ in the ecosystem?',
    answer:
      'We maintain strict attribution across every relationship shown on AKYIN.com: (1) AKYIN Ventures (Publishing, Marketing Agency, and Store) are owned and operated directly by AKYIN; (2) Our Clients (including AICalc, Kartigo, BizNXT, Budget Bazaar, AutoClub, Arosco Ventures, MEI Cosmetics, Krutika Cosmetics, Nyika Traders, and NS Traders) are independent business clients supported by AKYIN; and (3) Platforms & Ecosystem (Amazon, Google Play Books, Shopify, YouTube, etc.) are third-party distribution channels we leverage.',
  },
  {
    id: 'dedicated-platforms',
    category: 'Platform Strategy',
    question:
      'How do independent client businesses work alongside AKYIN Ventures?',
    answer:
      'AICalc (aicalc.in), Kartigo, BizNXT, and Budget Bazaar are independent client businesses with their own distinct operations and customer bases, while AKYIN provides external digital solutions, marketing execution, and growth strategy.',
  },
  {
    id: 'advisory-marketing',
    category: 'Services & Consulting',
    question:
      'What can businesses expect when engaging AKYIN Marketing Agency or BizNXT.online?',
    answer:
      'AKYIN Marketing works as a full-service marketing agency supporting brands, retail companies, service businesses, and dealerships with lead generation, enquiry qualification, creative campaigns, and sales team training. BizNXT.online focuses on practical business guidance, opportunity evaluation, and consulting for entrepreneurs—always framed with transparent written scope and no fabricated guarantees.',
  },
  {
    id: 'security-privacy',
    category: 'Security & Privacy',
    question: 'How does AKYIN.com protect visitor privacy and verify external ecosystem links?',
    answer:
      'AKYIN.com applies strict Content Security Policy controls, HTTPS link allowlisting, and real-time client-side Zod input validation with automated spam safeguards. Enquiries are prepared locally inside your browser and logged securely or opened directly in your own WhatsApp or Email client rather than passing through hidden third-party form brokers.',
  },
];

export function BusinessFAQs() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const shouldReduceMotion = useReducedMotion();

  const toggleFaq = (index: number) => {
    setOpenIdx((prev) => (prev === index ? null : index));
  };

  return (
    <div className="space-y-8">
      <div className="max-w-2xl space-y-2.5">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[#6E6E73]">
          <HelpCircle className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
          <span>AKYIN Ventures Ecosystem · FAQ</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
          Frequently Asked Questions.
        </h2>
        <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed">
          Clear, straightforward answers regarding the AKYIN Ventures multi-business portfolio, full-service marketing agency, independent platforms, and privacy standards.
        </p>
      </div>

      <div className="liquid-glass-panel rounded-3xl divide-y divide-[#1D1D1F]/10 overflow-hidden">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIdx === index;
          const triggerId = `faq-trigger-${item.id}`;
          const panelId = `faq-panel-${item.id}`;

          return (
            <div key={item.id} className="transition-colors">
              <button
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleFaq(index)}
                className="w-full px-6 sm:px-8 py-5.5 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-white/55 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1D1D1F]"
              >
                <div className="space-y-1 min-w-0">
                  <span className="text-[11px] font-semibold tracking-wide text-[#6E6E73]">
                    {item.category}
                  </span>
                  <p className="font-display text-base sm:text-[17px] font-semibold text-[#1D1D1F] leading-snug">
                    {item.question}
                  </p>
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                    isOpen
                      ? 'rotate-180 bg-[#1D1D1F] text-white'
                      : 'bg-white/80 text-[#1D1D1F] border border-white/90 shadow-xs'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" aria-hidden="true" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 sm:px-8 pb-6 pt-3 text-sm sm:text-[15px] text-[#6E6E73] leading-relaxed bg-[#F5F5F7]/50 border-t border-[#E8E8ED]">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isOpen && (
                <div className="hidden print:block px-6 pb-4 pt-1 text-xs text-[#6E6E73] leading-relaxed">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
