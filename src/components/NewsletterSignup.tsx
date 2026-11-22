import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';
import { canTriggerAction, sanitizeTextInput } from '../utils/security';

const newsletterEmailSchema = z
  .string()
  .transform((val) => sanitizeTextInput(val, 160, false))
  .pipe(
    z
      .string()
      .min(1, 'Please enter your email address.')
      .max(160, 'Email address must be 160 characters or fewer.')
      .email('Please enter a valid email address.')
  );

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState('');
  const [subscribedEmail, setSubscribedEmail] = useState<string | null>(null);

  const validateEmail = (value: string): string => {
    const result = newsletterEmailSchema.safeParse(value);
    if (result.success) return '';
    return result.error.issues[0]?.message || 'Please enter a valid email address.';
  };

  const handleChange = (value: string) => {
    setEmail(value);
    if (subscribedEmail) {
      setSubscribedEmail(null);
    }
    if (touched || error) {
      setError(validateEmail(value));
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setError(validateEmail(email));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypot.trim().length > 0) {
      return;
    }

    if (!canTriggerAction('footer-newsletter', 1500)) {
      return;
    }

    setTouched(true);
    const parsed = newsletterEmailSchema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'Please enter a valid email address.');
      return;
    }

    setError('');
    setSubscribedEmail(parsed.data);
    setEmail('');
    setTouched(false);
  };

  return (
    <div className="py-8 border-t border-[#1D1D1F]/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div className="space-y-1 max-w-md">
        <p className="text-xs font-semibold tracking-wide text-[#6E6E73]">
          Newsletter
        </p>
        <h3 className="font-display text-lg font-bold tracking-tight text-[#1D1D1F]">
          Notes &amp; Updates Across AKYIN Ventures.
        </h3>
        <p className="text-xs text-[#6E6E73] leading-relaxed">
          Occasional dispatches on new publications, digital tools, agency work, and group announcements.
        </p>
      </div>

      <div className="w-full lg:w-auto lg:min-w-[400px] max-w-md">
        {subscribedEmail ? (
          <div
            role="status"
            className="liquid-glass-card rounded-2xl px-4 py-3 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-[#1D1D1F] shrink-0" aria-hidden="true" />
              <p className="text-xs font-medium text-[#1D1D1F] truncate">
                You&apos;re subscribed ({subscribedEmail}). Thank you for joining.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSubscribedEmail(null)}
              className="text-[11px] font-semibold text-[#1D1D1F] hover:underline shrink-0 cursor-pointer"
            >
              Update
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-1.5">
            <div className="sr-only" aria-hidden="true">
              <label htmlFor="footer-newsletter-site">Website</label>
              <input
                id="footer-newsletter-site"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 liquid-glass-cta focus-within:border-[#1D1D1F]/40 focus-within:ring-2 focus-within:ring-[#1D1D1F]/12 rounded-full p-1.5 transition-all">
              <label htmlFor="footer-newsletter-email" className="sr-only">
                Email address for newsletter
              </label>
              <input
                id="footer-newsletter-email"
                type="email"
                maxLength={160}
                value={email}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'footer-newsletter-error' : undefined}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={handleBlur}
                placeholder="Enter your email address"
                className="flex-1 min-w-0 bg-transparent px-3.5 py-1.5 text-sm text-[#1D1D1F] placeholder:text-[#A1A1A6] focus:outline-none"
              />
              <button
                type="submit"
                className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-full liquid-glass-pill-dark text-white text-xs font-semibold transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Subscribe</span>
                <ArrowRight
                  className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </button>
            </div>

            {error && (
              <p
                id="footer-newsletter-error"
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
  );
}
