import { useState } from 'react';
import { ArrowRight, Check, CheckCircle2, Mail, Sparkles } from 'lucide-react';
import { z } from 'zod';
import { canTriggerAction, sanitizeTextInput } from '../utils/security';
import { GlassPanel } from './liquid-glass';

const growthNewsletterSchema = z
  .string()
  .transform((val) => sanitizeTextInput(val, 160, false))
  .pipe(
    z
      .string()
      .min(1, 'Please enter your dealership work email.')
      .max(160, 'Email address must be 160 characters or fewer.')
      .email('Please enter a valid dealership email address.')
  );

export function AutomotiveGrowthNewsletter() {
  const [email, setEmail] = useState('');
  const [monthlyInsights, setMonthlyInsights] = useState(true);
  const [honeypot, setHoneypot] = useState('');
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState('');
  const [subscribed, setSubscribed] = useState<{
    email: string;
    monthlyInsights: boolean;
  } | null>(null);

  const validateEmail = (value: string): string => {
    const res = growthNewsletterSchema.safeParse(value);
    return res.success ? '' : res.error.issues[0]?.message || 'Please enter a valid email.';
  };

  const handleChange = (value: string) => {
    setEmail(value);
    if (subscribed) setSubscribed(null);
    if (touched || error) setError(validateEmail(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot.trim().length > 0) return;
    if (!canTriggerAction('automotive-growth-newsletter', 1500)) return;

    setTouched(true);
    const parsed = growthNewsletterSchema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'Please enter a valid email.');
      return;
    }

    setError('');
    setSubscribed({ email: parsed.data, monthlyInsights });
    setEmail('');
    setTouched(false);
  };

  return (
    <section
      id="automotive-growth-newsletter"
      className="py-16 lg:py-20 bg-[#FFFFFF] border-t border-[#E8E8ED]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GlassPanel className="p-7 sm:p-10 bg-gradient-to-br from-purple-50/45 via-white to-amber-50/35">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-2.5 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full frosted-glass-pill text-xs font-semibold text-[#1D1D1F]">
                <Sparkles className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
                <span>Growth Newsletter · For Dealership Principals &amp; Managers</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[#1D1D1F]">
                Stay Ahead on Dealership Lead Velocity &amp; Showroom Trends.
              </h2>
              <p className="text-sm text-[#6E6E73] leading-relaxed">
                Receive curated automotive campaign playbooks, CPL benchmarks, and seasonal test-drive strategies straight to your showroom inbox.
              </p>
            </div>

            <div className="w-full lg:w-[460px] shrink-0">
              {subscribed ? (
                <div
                  role="status"
                  className="liquid-glass-card rounded-2xl p-5 flex items-start justify-between gap-4 border border-emerald-200/70 bg-emerald-50/30"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <CheckCircle2
                      className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div className="space-y-1 min-w-0">
                      <p className="text-sm font-bold text-[#1D1D1F]">
                        Subscribed to Growth Newsletter
                      </p>
                      <p className="text-xs text-[#6E6E73] truncate">
                        {subscribed.email}
                      </p>
                      <p className="text-[11px] font-medium text-purple-700">
                        {subscribed.monthlyInsights
                          ? 'Included: Monthly Industry Insights digest'
                          : 'Subscribed to dealership campaign alerts'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSubscribed(null)}
                    className="text-xs font-semibold text-[#1D1D1F] hover:underline shrink-0 cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-3">
                  <div className="sr-only" aria-hidden="true">
                    <label htmlFor="auto-newsletter-hp">Company URL</label>
                    <input
                      id="auto-newsletter-hp"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2 liquid-glass-cta rounded-full p-1.5 border border-white/95 focus-within:ring-2 focus-within:ring-purple-600/20 transition-all shadow-sm">
                    <Mail
                      className="w-4 h-4 text-[#6E6E73] ml-3 shrink-0"
                      aria-hidden="true"
                    />
                    <label htmlFor="auto-newsletter-email" className="sr-only">
                      Dealership manager email address
                    </label>
                    <input
                      id="auto-newsletter-email"
                      type="email"
                      maxLength={160}
                      value={email}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? 'auto-newsletter-error' : undefined}
                      onChange={(e) => handleChange(e.target.value)}
                      onBlur={() => {
                        setTouched(true);
                        setError(validateEmail(email));
                      }}
                      placeholder="manager@dealership.com"
                      className="flex-1 min-w-0 bg-transparent px-2 py-2 text-sm text-[#1D1D1F] placeholder:text-[#A1A1A6] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="group inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full liquid-glass-pill-dark text-white text-xs font-semibold transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>Join Brief</span>
                      <ArrowRight
                        className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  {/* Monthly Industry Insights Checkbox */}
                  <div className="flex items-center justify-between gap-3 px-2">
                    <label className="inline-flex items-center gap-2.5 cursor-pointer select-none group">
                      <span
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                          monthlyInsights
                            ? 'bg-[#1D1D1F] border-[#1D1D1F] text-white'
                            : 'bg-white/90 border-[#1D1D1F]/25 group-hover:border-[#1D1D1F]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={monthlyInsights}
                          onChange={(e) => setMonthlyInsights(e.target.checked)}
                          className="sr-only"
                        />
                        {monthlyInsights && <Check className="w-3 h-3" aria-hidden="true" />}
                      </span>
                      <span className="text-xs font-medium text-[#1D1D1F]">
                        Monthly Industry Insights
                      </span>
                    </label>
                    <span className="text-[11px] text-[#6E6E73]">
                      Zero spam · Unsubscribe anytime
                    </span>
                  </div>

                  {error && (
                    <p
                      id="auto-newsletter-error"
                      role="alert"
                      className="px-2 text-xs font-semibold text-[#D93025]"
                    >
                      {error}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}
