import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';
import { AppRoute } from '../../data/akyinData';
import { akyinApiClient } from '../../utils/AkyinApiClient';
import { AkyinLogo } from '../AkyinLogo';
import { GlassButton, GlassPanel } from '../liquid-glass';

interface AdminLoginPageProps {
  passwordConfigured: boolean;
  isLiveBackend: boolean;
  checkingStatus: boolean;
  onNavigate: (route: AppRoute) => void;
  onAuthenticated: () => void;
  onEndpointUpdated: () => Promise<void>;
}

export function AdminLoginPage({
  passwordConfigured,
  isLiveBackend,
  checkingStatus,
  onNavigate,
  onAuthenticated,
  onEndpointUpdated,
}: AdminLoginPageProps) {
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [endpointDraft, setEndpointDraft] = useState<string>(() =>
    akyinApiClient.getEndpointUrl()
  );
  const [endpointStatus, setEndpointStatus] = useState('');

  const handleSaveEndpoint = async (e: React.FormEvent) => {
    e.preventDefault();
    setEndpointStatus('');
    setAuthError('');
    try {
      akyinApiClient.setEndpointUrl(endpointDraft);
      await onEndpointUpdated();
      setEndpointStatus(
        endpointDraft.trim()
          ? 'Connected Apps Script Web App URL. Please sign in or initialize your owner password.'
          : 'Cleared custom URL — operating in local preview mode.'
      );
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Invalid URL.');
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (passwordInput.length < 8) {
      setAuthError('Administrator password must be at least 8 characters long.');
      return;
    }
    setAuthLoading(true);
    try {
      if (!passwordConfigured) {
        if (passwordInput !== confirmPasswordInput) {
          throw new Error('Passwords do not match.');
        }
        await akyinApiClient.setupAdminPassword(passwordInput);
      } else {
        await akyinApiClient.loginAdmin(passwordInput);
      }
      setPasswordInput('');
      setConfirmPasswordInput('');
      onAuthenticated();
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen surface-silver-gradient text-[#1D1D1F] flex flex-col justify-between p-4 sm:p-8">
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Return to AKYIN.com
        </button>
        <span className="font-mono-num text-[11px] font-semibold text-[#6E6E73]">
          {isLiveBackend ? 'Google Apps Script Live Mode' : 'Local Preview Mode'}
        </span>
      </div>

      <div className="max-w-lg w-full mx-auto my-8 space-y-6">
        <GlassPanel className="p-7 sm:p-9 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <AkyinLogo size="sm" />
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D1D1F]">
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Restricted Console</span>
              </div>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[#1D1D1F]">
              {checkingStatus
                ? 'Validating Admin Session...'
                : passwordConfigured
                  ? 'Owner Sign In'
                  : 'One-Time Owner Setup'}
            </h1>
            <p className="text-xs text-[#6E6E73] leading-relaxed">
              {passwordConfigured
                ? 'Enter your administrator password to issue a short-lived expiring session token and access the management dashboard.'
                : 'Create your initial administrator password (min 8 characters). Stored as a salted cryptographic hash inside Google Apps Script PropertiesService.'}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-[#1D1D1F] mb-1.5"
              >
                Administrator Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete="current-password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter password (min 8 characters)"
                  className="w-full rounded-xl border border-white/85 bg-white/75 backdrop-blur-sm pl-3.5 pr-10 py-2.5 text-sm text-[#1D1D1F] focus:outline-none focus:bg-white focus:border-[#1D1D1F]/50 focus:ring-2 focus:ring-[#1D1D1F]/15"
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

            {!passwordConfigured && (
              <div>
                <label
                  htmlFor="admin-password-confirm"
                  className="block text-xs font-semibold text-[#1D1D1F] mb-1.5"
                >
                  Confirm Initial Password
                </label>
                <input
                  id="admin-password-confirm"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="Re-enter initial password"
                  className="w-full rounded-xl border border-white/85 bg-white/75 backdrop-blur-sm px-3.5 py-2.5 text-sm text-[#1D1D1F] focus:outline-none focus:bg-white focus:border-[#1D1D1F]/50 focus:ring-2 focus:ring-[#1D1D1F]/15"
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
                ? 'Verifying...'
                : passwordConfigured
                  ? 'Sign In to Admin Dashboard'
                  : 'Initialize Owner Password'}
            </GlassButton>
          </form>

          <div className="flex items-start gap-2 rounded-2xl bg-[#FFFFFF]/80 border border-[#E8E8ED] p-3.5 text-[11px] text-[#6E6E73]">
            <ShieldCheck className="w-4 h-4 text-[#1D1D1F] shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              Sessions use short-lived expiring tokens (30-minute window) verified via AkyinApiClient before dashboard access is granted.
            </span>
          </div>

          <div className="pt-4 border-t border-[#E8E8ED] space-y-3">
            <p className="text-[11px] font-semibold text-[#6E6E73]">
              Google Apps Script Web App Endpoint (/exec URL)
            </p>
            <form onSubmit={handleSaveEndpoint} className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={endpointDraft}
                onChange={(e) => setEndpointDraft(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="flex-1 rounded-xl border border-[#E8E8ED] bg-[#FFFFFF] px-3 py-2 text-xs font-mono-num text-[#1D1D1F] focus:outline-none focus:border-[#1D1D1F]"
              />
              <GlassButton type="submit" variant="subtle" size="sm">
                Bind URL
              </GlassButton>
            </form>
            {endpointStatus && (
              <p className="text-[11px] font-semibold text-[#1D1D1F]">{endpointStatus}</p>
            )}
          </div>
        </GlassPanel>
      </div>

      <p className="text-center text-[11px] text-[#6E6E73]">
        AKYIN Ventures Operations Portal · Protected Route (/admin)
      </p>
    </div>
  );
}
