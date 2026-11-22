import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    category: 'Group Structure',
    question: 'What is the operating model of AKYIN Ventures?',
    answer:
      'AKYIN Ventures operates as a parent business group that develops, structures, and guides diverse operating initiatives across publishing, automotive marketing, fashion retail, AI calculation technology, and B2B stock commerce under a unified corporate direction.',
  },
  {
    category: 'Venture Architecture',
    question: 'Why do the business verticals operate on separate platforms and domains?',
    answer:
      'Each vertical serves distinct audiences—readers, automobile dealerships, retail shoppers, engineering professionals, and B2B buyers. Operating on dedicated platforms (such as aicalc.in and kartigo.online) ensures a focused, uncompromised user experience tailored specifically to each industry.',
  },
  {
    category: 'Commercial Standards',
    question: 'How does AKYIN Ventures maintain quality and consistency across diverse industries?',
    answer:
      'We enforce strict commercial discipline, transparent scope definitions, written quotations, and real-world operational expertise (such as 16 years in automotive retail and structured editorial publishing) across every venture rather than relying on automated AI templates.',
  },
  {
    category: 'Corporate Positioning',
    question: 'Is AKYIN Ventures a large publicly listed corporation?',
    answer:
      'No. AKYIN Ventures is structured as an ambitious, professionally managed private business group. We do not claim unverified public listings, corporate office addresses, employee counts, or fabricated awards.',
  },
  {
    category: 'Enquiries & Collaboration',
    question: 'How can clients, partners, or customers connect with a specific vertical?',
    answer:
      'Every vertical features direct enquiry routing on its dedicated page. You can also use our central enquiry desk or connect directly via WhatsApp and email draft options with zero intermediary form brokers.',
  },
];

export function BusinessFAQs() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIdx(openIdx === index ? null : index);
  };

  return (
    <div className="space-y-6">
      <div className="max-w-xl space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B66A50]">
          <HelpCircle className="w-4 h-4" aria-hidden="true" />
          <span>Frequently Asked Questions</span>
        </div>
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#292722]">
          About Our Diversified Business Model
        </h3>
        <p className="text-sm text-[#77736C]">
          Clear answers regarding how AKYIN Ventures structures its operating verticals and maintains commercial standards.
        </p>
      </div>

      <div className="space-y-3">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIdx === index;
          return (
            <div
              key={item.question}
              className="bg-[#FFFFFF] rounded-xl border border-[#D9CCB9] overflow-hidden transition-colors"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-[#F7F5F0]/50 transition-colors"
              >
                <div className="space-y-0.5">
                  <span className="text-[11px] font-semibold text-[#83866A] uppercase tracking-wider">
                    {item.category}
                  </span>
                  <p className="font-display text-base font-bold text-[#292722]">
                    {item.question}
                  </p>
                </div>
                <div
                  className={`w-8 h-8 rounded-full bg-[#EFE9DE] text-[#292722] flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-[#B66A50] text-white' : ''
                  }`}
                >
                  <ChevronDown className="w-4 h-4" aria-hidden="true" />
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-5 pt-1 text-sm text-[#77736C] leading-relaxed border-t border-[#EFE9DE]/70 bg-[#F7F5F0]/30">
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
