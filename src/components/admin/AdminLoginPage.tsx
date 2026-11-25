import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Lock, ShieldCheck, UserPlus } from 'lucide-react';
import { AppRoute } from '../../data/akyinData';
import { PublicSuiteUser, suiteApi } from '../../services/suiteApi';
import { AkyinLogo } from '../AkyinLogo';
import { GlassButton, GlassPanel } from '../liquid-glass';

interface AdminLoginPageProps {
  configured: boolean;
  checkingStatus: boolean;
  onNavigate: (route: AppRoute) => void;
  onAuthenticated: (user: PublicSuiteUser) => void;
}

export function AdminLoginPage({
  configured,
  checkingStatus,
  onNavigate,
  onAuthenticated,
}: AdminLoginPageProps) {
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const cleanEmail = emailInput.trim();
    if (!cleanEmail) {
      setAuthError('Please enter your administrator email address.');
      return;
    }
    if (passwordInput.length < 8) {
      setAuthError('Password must be at least 8 characters long.');
      return;
    }

    setAuthLoading(true);
    try {
      if (!configured) {
        if (nameInput.trim().length < 2) {
          throw new Error('Please enter the Super Admin full name.');
        }
        if (passwordInput !== confirmPasswordInput) {
          throw new Error('Passwords do not match.');
        }
        const res = await suiteApi.setupInitialAdmin({
          name: nameInput.trim(),
          email: cleanEmail,
          password: passwordInput,
        });
        setPasswordInput('');
        setConfirmPasswordInput('');
        onAuthenticated(res.user);
      } else {
        const res = await suiteApi.login({
          email: cleanEmail,
          password: passwordInput,
        });
        setPasswordInput('');
        onAuthenticated(res.user);
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const inputCls =
    'w-full rounded-xl border border-white/85 bg-white/75 backdrop-blur-sm px-3.5 py-2.5 text-sm text-[#1D1D1F] focus:outline-none focus:bg-white focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/15';

  return (
    <div className="min-h-screen surface-silver-gradient text-[#1D1D1F] flex flex-col justify-between p-4 sm:p-8">
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Return to AKYIN.com
        </button>
        <span className="font-mono-num text-[11px] font-semibold text-[#6E6E73]">
          No Public Registration · Internal Team Access Only
        </span>
      </div>

      <div className="max-w-lg w-full mx-auto my-8 space-y-6">
        <GlassPanel className="p-7 sm:p-9 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <AkyinLogo size="sm" />
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D1D1F]">
                {configured ? (
                  <Lock className="w-3.5 h-3.5 text-[#0071E3]" aria-hidden="true" />
                ) : (
                  <UserPlus className="w-3.5 h-3.5 text-[#0071E3]" aria-hidden="true" />
                )}
                <span>{configured ? 'Suite Sign In' : 'Initial Super Admin Setup'}</span>
              </div>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[#1D1D1F]">
              {checkingStatus
                ? 'Checking Suite Status...'
                : configured
                  ? 'AKYIN Business Suite'
                  : 'Create Super Admin Account'}
            </h1>
            <p className="text-xs text-[#6E6E73] leading-relaxed">
              {configured
                ? 'Sign in with your team email and password to access CRM, quotations, Razorpay settlements, and executive revenue reporting.'
                : 'One-time initialization: create the first Super Admin account. Public sign-up is permanently disabled once configured.'}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {!configured && (
              <div>
                <label
                  htmlFor="admin-name"
                  className="block text-xs font-semibold text-[#1D1D1F] mb-1.5"
                >
                  Super Admin Full Name
                </label>
                <input
                  id="admin-name"
                  type="text"
                  required
                  minLength={2}
                  autoComplete="name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Akyin"
                  className={inputCls}
                />
              </div>
            )}

            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold text-[#1D1D1F] mb-1.5"
              >
                Administrator Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="connect@akyin.com"
                className={inputCls}
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-[#1D1D1F] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete={configured ? 'current-password' : 'new-password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter password (min 8 characters)"
                  className="w-full rounded-xl border border-white/85 bg-white/75 backdrop-blur-sm pl-3.5 pr-10 py-2.5 text-sm text-[#1D1D1F] focus:outline-none focus:bg-white focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Eye className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {!configured && (
              <div>
                <label
                  htmlFor="admin-password-confirm"
                  className="block text-xs font-semibold text-[#1D1D1F] mb-1.5"
                >
                  Confirm Password
                </label>
                <input
                  id="admin-password-confirm"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="Re-enter password"
                  className={inputCls}
                />
              </div>
            )}

            {authError && (
              <p role="alert" className="text-xs font-semibold text-[#D92D20]">
                {authError}
              </p>
            )}

            <GlassButton
              type="submit"
              disabled={authLoading || checkingStatus}
              variant="primary"
              size="lg"
              className="w-full"
            >
              {authLoading
                ? 'Authenticating...'
                : configured
                  ? 'Sign In to Business Suite'
                  : 'Initialize Super Admin & Sign In'}
            </GlassButton>
          </form>

          <div className="flex items-start gap-2.5 rounded-2xl bg-[#FFFFFF]/80 border border-[#E8E8ED] p-3.5 text-[11px] text-[#6E6E73]">
            <ShieldCheck className="w-4 h-4 text-[#0071E3] shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              Protected by scrypt password hashing, SHA-256 server session hashes, and RBAC permission guards. Session tokens reside strictly in JavaScript memory (no browser storage persistence).
            </span>
          </div>
        </GlassPanel>
      </div>

      <p className="text-center text-[11px] text-[#6E6E73]">
        AKYIN.com Business Management Suite · Protected Route (/admin)
      </p>
    </div>
  );
}
