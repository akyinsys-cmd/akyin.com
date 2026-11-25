import { useState } from 'react';
import { CheckCircle2, Mail, Save } from 'lucide-react';
import { VentureConfigRecord, WebsiteSettingsMap } from '../../types/advisory';
import { GlassButton } from '../liquid-glass';

interface AdminSettingsSectionProps {
  section:
    | 'Business Advisory'
    | 'Website Settings'
    | 'Branding'
    | 'Social Links'
    | 'Contact Settings';
  settings: WebsiteSettingsMap;
  onSaveSettings: (patch: Partial<WebsiteSettingsMap>) => Promise<void>;
  onSendTestEmail?: () => Promise<{ sentTo: string }>;
}

export function AdminSettingsSection({
  section,
  settings,
  onSaveSettings,
  onSendTestEmail,
}: AdminSettingsSectionProps) {
  const [draft, setDraft] = useState<WebsiteSettingsMap>({ ...settings });
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const updateKey = (k: keyof WebsiteSettingsMap, v: string) => {
    setDraft((prev) => ({ ...prev, [k]: v }));
  };

  const handleSave = async (keys: Array<keyof WebsiteSettingsMap>) => {
    setSaving(true);
    setStatusMsg('');
    setErrorMsg('');
    try {
      const patch: Partial<WebsiteSettingsMap> = {};
      keys.forEach((k) => {
        patch[k] = draft[k];
      });
      await onSaveSettings(patch);
      setStatusMsg(`Saved ${section} changes.`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    if (!onSendTestEmail) return;
    setSaving(true);
    setStatusMsg('');
    setErrorMsg('');
    try {
      const res = await onSendTestEmail();
      setStatusMsg(`Verification email dispatched via MailApp to ${res.sentTo}.`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Email delivery check failed.');
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    'w-full rounded-xl border border-[#E8E8ED] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#1D1D1F] focus:outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/15';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F]">
          {section}
        </h2>
        <p className="text-xs text-[#6E6E73] mt-0.5">
          Changes save directly to the WebsiteSettings tab and update public AKYIN.com pages.
        </p>
      </div>

      {statusMsg && (
        <div className="rounded-2xl liquid-glass-panel px-4 py-3 text-xs font-semibold text-[#1D1D1F] flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
          <span>{statusMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-2xl bg-[#FEF3F2] border border-[#FECDCA] px-4 py-3 text-xs font-semibold text-[#D92D20]">
          {errorMsg}
        </div>
      )}

      <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 space-y-5 text-xs">
        {section === 'Business Advisory' && (
          <>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1.5">
                Advisory Hero Headline
              </label>
              <input
                value={draft.advisoryHeadline || ''}
                onChange={(e) => updateKey('advisoryHeadline', e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1.5">
                Advisory Hero Subheadline
              </label>
              <textarea
                rows={3}
                value={draft.advisorySubheadline || ''}
                onChange={(e) => updateKey('advisorySubheadline', e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1.5">
                  Consultation Fee Label / Amount
                </label>
                <input
                  value={draft.consultationFee || ''}
                  onChange={(e) => updateKey('consultationFee', e.target.value)}
                  placeholder="Contact Us for Consultation Fee."
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1.5">
                  Default Slot Duration (Mins)
                </label>
                <input
                  type="number"
                  value={draft.advisorySlotDuration || '30'}
                  onChange={(e) => updateKey('advisorySlotDuration', e.target.value)}
                  className={`${inputCls} font-mono-num`}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1.5">
                  Default Daily Max Bookings
                </label>
                <input
                  type="number"
                  value={draft.advisoryMaxBookings || '2'}
                  onChange={(e) => updateKey('advisoryMaxBookings', e.target.value)}
                  className={`${inputCls} font-mono-num`}
                />
              </div>
            </div>
            <GlassButton
              disabled={saving}
              variant="primary"
              size="md"
              onClick={() =>
                handleSave([
                  'advisoryHeadline',
                  'advisorySubheadline',
                  'consultationFee',
                  'advisorySlotDuration',
                  'advisoryMaxBookings',
                ])
              }
            >
              <Save className="w-4 h-4" aria-hidden="true" />
              <span>Save Business Advisory Settings</span>
            </GlassButton>
          </>
        )}

        {section === 'Website Settings' && (
          <>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1.5">
                Homepage Hero Headline
              </label>
              <input
                value={draft.heroHeadline || ''}
                onChange={(e) => updateKey('heroHeadline', e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1.5">
                Homepage Hero Introduction
              </label>
              <textarea
                rows={3}
                value={draft.heroSubheadline || ''}
                onChange={(e) => updateKey('heroSubheadline', e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1.5">
                Footer Corporate Description
              </label>
              <textarea
                rows={3}
                value={draft.footerTagline || ''}
                onChange={(e) => updateKey('footerTagline', e.target.value)}
                className={inputCls}
              />
            </div>
            <GlassButton
              disabled={saving}
              variant="primary"
              size="md"
              onClick={() =>
                handleSave(['heroHeadline', 'heroSubheadline', 'footerTagline'])
              }
            >
              <Save className="w-4 h-4" aria-hidden="true" />
              <span>Save Website Copy</span>
            </GlassButton>
          </>
        )}

        {section === 'Branding' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1.5">
                  Header Brand Wordmark
                </label>
                <input
                  value={draft.brandWordmark || 'AKYIN'}
                  onChange={(e) => updateKey('brandWordmark', e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1.5">
                  Optional Custom Logo Image URL (https://)
                </label>
                <input
                  value={draft.logoUrl || ''}
                  onChange={(e) => updateKey('logoUrl', e.target.value)}
                  placeholder="Leave empty to use editorial AKYIN wordmark"
                  className={inputCls}
                />
              </div>
            </div>
            <GlassButton
              disabled={saving}
              variant="primary"
              size="md"
              onClick={() => handleSave(['brandWordmark', 'logoUrl'])}
            >
              <Save className="w-4 h-4" aria-hidden="true" />
              <span>Save Branding</span>
            </GlassButton>
          </>
        )}

        {section === 'Social Links' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1.5">
                  Instagram (@akyinmarketing)
                </label>
                <input
                  value={draft.instagramUrl || ''}
                  onChange={(e) => updateKey('instagramUrl', e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1.5">
                  Facebook (@akyinmarketing)
                </label>
                <input
                  value={draft.facebookUrl || ''}
                  onChange={(e) => updateKey('facebookUrl', e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1.5">
                  X / Twitter (@akyinmarketing)
                </label>
                <input
                  value={draft.xUrl || ''}
                  onChange={(e) => updateKey('xUrl', e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1.5">
                  YouTube (@akyinmarketing)
                </label>
                <input
                  value={draft.youtubeUrl || ''}
                  onChange={(e) => updateKey('youtubeUrl', e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1.5">
                  Amazon Author Store
                </label>
                <input
                  value={draft.amazonUrl || ''}
                  onChange={(e) => updateKey('amazonUrl', e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1.5">
                  Google Play Books URL
                </label>
                <input
                  value={draft.googlePlayBooksUrl || ''}
                  onChange={(e) => updateKey('googlePlayBooksUrl', e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
            <GlassButton
              disabled={saving}
              variant="primary"
              size="md"
              onClick={() =>
                handleSave([
                  'instagramUrl',
                  'facebookUrl',
                  'xUrl',
                  'youtubeUrl',
                  'amazonUrl',
                  'googlePlayBooksUrl',
                ])
              }
            >
              <Save className="w-4 h-4" aria-hidden="true" />
              <span>Save Social &amp; Platform Links</span>
            </GlassButton>
          </>
        )}

        {section === 'Contact Settings' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1.5">
                  Admin Notification Email (MailApp alerts)
                </label>
                <input
                  type="email"
                  value={draft.notificationEmail || 'connect@akyin.com'}
                  onChange={(e) => updateKey('notificationEmail', e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1.5">
                  Public Contact Email
                </label>
                <input
                  type="email"
                  value={draft.contactEmail || 'connect@akyin.com'}
                  onChange={(e) => updateKey('contactEmail', e.target.value)}
                  className={inputCls}
                />
              </div>
              <div className="sm:col-span-2 rounded-xl bg-[#F5F5F7] border border-[#E8E8ED] px-4 py-3 text-xs text-[#6E6E73]">
                <span className="font-semibold text-[#1D1D1F]">Privacy Mode Active:</span> Public mobile numbers are hidden site-wide. Visitors reach AKYIN via{' '}
                <span className="font-semibold text-[#1D1D1F]">WhatsApp Connect</span> and official email ({draft.contactEmail || 'connect@akyin.com'}).
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <GlassButton
                disabled={saving}
                variant="primary"
                size="md"
                onClick={() =>
                  handleSave([
                    'notificationEmail',
                    'contactEmail',
                  ])
                }
              >
                <Save className="w-4 h-4" aria-hidden="true" />
                <span>Save Contact Settings</span>
              </GlassButton>

              {onSendTestEmail && (
                <GlassButton
                  disabled={saving}
                  variant="subtle"
                  size="md"
                  onClick={handleTestEmail}
                >
                  <Mail className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
                  <span>Send Test Notification Email</span>
                </GlassButton>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface AdminVenturesPanelProps {
  ventures: VentureConfigRecord[];
  onSaveVentures: (ventures: VentureConfigRecord[]) => Promise<void>;
}

export function AdminVenturesPanel({ ventures, onSaveVentures }: AdminVenturesPanelProps) {
  const [items, setItems] = useState<VentureConfigRecord[]>(() =>
    ventures.map((v) => ({ ...v }))
  );
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  const updateItem = (idx: number, patch: Partial<VentureConfigRecord>) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedMsg('');
    try {
      await onSaveVentures(items);
      setSavedMsg('Saved Ventures configuration to Google Sheets.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F]">
            Ventures Directory Configuration
          </h2>
          <p className="text-xs text-[#6E6E73] mt-0.5">
            Update venture titles, descriptions, external domains, or toggle visibility.
          </p>
        </div>

        <GlassButton disabled={saving} onClick={handleSave} variant="primary" size="md">
          <Save className="w-4 h-4" aria-hidden="true" />
          <span>{saving ? 'Saving...' : 'Save Ventures'}</span>
        </GlassButton>
      </div>

      {savedMsg && (
        <div className="rounded-2xl liquid-glass-panel px-4 py-3 text-xs font-semibold text-[#1D1D1F] flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
          <span>{savedMsg}</span>
        </div>
      )}

      <div className="space-y-4">
        {items.map((venture, idx) => (
          <div
            key={venture.id}
            className="liquid-glass-card rounded-3xl p-5 sm:p-6 space-y-4 text-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono-num font-bold text-[#1D1D1F]">
                  #{String(venture.sortOrder).padStart(2, '0')}
                </span>
                <span className="font-display text-base font-bold text-[#1D1D1F]">
                  {venture.title}
                </span>
                <span className="font-mono-num text-[#6E6E73]">{venture.slug}</span>
              </div>
              <label className="inline-flex items-center gap-2 font-semibold text-[#1D1D1F] cursor-pointer">
                <input
                  type="checkbox"
                  checked={venture.active}
                  onChange={(e) => updateItem(idx, { active: e.target.checked })}
                  className="accent-[#1D1D1F] w-4 h-4"
                />
                <span>Active on Public Site</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Display Title</label>
                <input
                  value={venture.title}
                  onChange={(e) => updateItem(idx, { title: e.target.value })}
                  className="w-full rounded-xl border border-[#E8E8ED] bg-[#FFFFFF] px-3 py-2 text-sm text-[#1D1D1F] focus:outline-none focus:border-[#1D1D1F]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Category</label>
                <input
                  value={venture.category}
                  onChange={(e) => updateItem(idx, { category: e.target.value })}
                  className="w-full rounded-xl border border-[#E8E8ED] bg-[#FFFFFF] px-3 py-2 text-sm text-[#1D1D1F] focus:outline-none focus:border-[#1D1D1F]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">External URL</label>
                <input
                  value={venture.externalUrl}
                  onChange={(e) => updateItem(idx, { externalUrl: e.target.value })}
                  className="w-full rounded-xl border border-[#E8E8ED] bg-[#FFFFFF] px-3 py-2 text-sm text-[#1D1D1F] focus:outline-none focus:border-[#1D1D1F]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Description</label>
              <textarea
                rows={2}
                value={venture.description}
                onChange={(e) => updateItem(idx, { description: e.target.value })}
                className="w-full rounded-xl border border-[#E8E8ED] bg-[#FFFFFF] px-3 py-2 text-sm text-[#1D1D1F] focus:outline-none focus:border-[#1D1D1F]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
