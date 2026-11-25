import { useCallback, useEffect, useState } from 'react';
import { Bell, CheckCircle2, KeyRound, ShieldCheck } from 'lucide-react';
import { suiteApi } from '../../services/suiteApi';
import { akyinApiClient } from '../../utils/AkyinApiClient';
import { GlassButton } from '../liquid-glass';
import { DeploymentChecklistCard } from './DeploymentChecklistCard';

export function AdminSecurityAuditPanel() {
  const [auditLogs, setAuditLogs] = useState<
    Array<{
      logId: string;
      timestamp: string;
      actorName: string;
      actorRole: string;
      action: string;
      targetId: string;
      summary: string;
    }>
  >([]);
  const [notifSettings, setNotifSettings] = useState<{
    ownerNotificationEmail: string;
    sendClientReceipts: boolean;
    events: Record<string, boolean>;
  } | null>(null);
  const [notifLogs, setNotifLogs] = useState<
    Array<{
      id: string;
      timestamp: string;
      event: string;
      recipient: string;
      subject: string;
      deliveryStatus: string;
      errorMessage?: string;
    }>
  >([]);
  const [smtpConfigured, setSmtpConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingPw, setSavingPw] = useState(false);

  // Apps Script Legacy URL
  const [endpointDraft, setEndpointDraft] = useState(() => akyinApiClient.getEndpointUrl());

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await suiteApi.getAuditLogs();
      setAuditLogs(res.auditLogs);
      setNotifSettings(res.notificationSettings);
      setNotifLogs(res.notificationLogs);
      setSmtpConfigured(res.smtpConfigured);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load security and audit logs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPw(true);
    setError('');
    setNotice('');
    try {
      await suiteApi.changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setNotice('Updated your account password cleanly.');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password rotation failed.');
    } finally {
      setSavingPw(false);
    }
  };

  const handleSaveNotif = async () => {
    if (!notifSettings) return;
    setError('');
    setNotice('');
    try {
      await suiteApi.updateNotificationSettings(notifSettings);
      setNotice('Saved automated notification preferences.');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update notifications.');
    }
  };

  const handleSaveAppsScriptUrl = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      akyinApiClient.setEndpointUrl(endpointDraft);
      setNotice(
        endpointDraft.trim()
          ? 'Saved Google Apps Script /exec endpoint for Workspace advisory sync.'
          : 'Cleared custom Apps Script URL.'
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid URL.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F]">
          Security, Notifications &amp; Audit Logs
        </h2>
        <p className="text-xs text-[#6E6E73] mt-0.5">
          Immutable security event logs, scrypt credential rotation, SMTP alert configuration, and Apps Script integration.
        </p>
      </div>

      {notice && (
        <div className="rounded-2xl liquid-glass-panel px-4 py-3 text-xs font-semibold text-[#1D1D1F] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#067647]" />
          <span>{notice}</span>
        </div>
      )}
      {error && (
        <div className="rounded-2xl bg-[#FEF3F2] border border-[#FECDCA] px-4 py-3 text-xs font-semibold text-[#B42318]">
          {error}
        </div>
      )}

      {/* Password Rotation */}
      <div className="liquid-glass-card rounded-3xl p-6 space-y-4 text-xs">
        <div className="inline-flex items-center gap-2 text-sm font-bold text-[#1D1D1F]">
          <KeyRound className="w-4 h-4 text-[#0071E3]" />
          <span>Rotate Your Account Password</span>
        </div>
        <form onSubmit={handlePasswordChange} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block font-semibold text-[#1D1D1F] mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-xl border border-[#E8E8ED] bg-white px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#1D1D1F] mb-1">
              New Password (min 8 chars)
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-[#E8E8ED] bg-white px-3 py-2"
            />
          </div>
          <GlassButton type="submit" disabled={savingPw} variant="primary" size="md">
            {savingPw ? 'Updating...' : 'Update Password'}
          </GlassButton>
        </form>
      </div>

      {/* Automated Notifications & SMTP */}
      {notifSettings && (
        <div className="liquid-glass-card rounded-3xl p-6 space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 text-sm font-bold text-[#1D1D1F]">
              <Bell className="w-4 h-4 text-[#0071E3]" />
              <span>
                Automated Email Notifications ({Object.keys(notifSettings.events).length} Events)
              </span>
            </div>
            <span
              className={`px-3 py-1 rounded-full font-mono-num text-[11px] font-bold border ${
                smtpConfigured
                  ? 'bg-[#ECFDF3] border-[#ABEFC6] text-[#067647]'
                  : 'bg-[#F5F5F7] border-[#E8E8ED] text-[#6E6E73]'
              }`}
            >
              SMTP Env: {smtpConfigured ? 'Configured & Live' : 'Unset (Logged to Audit Queue)'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">
                Owner Alert Email
              </label>
              <input
                type="email"
                value={notifSettings.ownerNotificationEmail}
                onChange={(e) =>
                  setNotifSettings({ ...notifSettings, ownerNotificationEmail: e.target.value })
                }
                className="w-full rounded-xl border border-[#E8E8ED] bg-white px-3 py-2"
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="inline-flex items-center gap-2 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifSettings.sendClientReceipts}
                  onChange={(e) =>
                    setNotifSettings({ ...notifSettings, sendClientReceipts: e.target.checked })
                  }
                  className="accent-[#0071E3]"
                />
                <span>Send client confirmation / quotation receipts when SMTP is set</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
            {Object.entries(notifSettings.events).map(([key, enabled]) => {
              const labelMap: Record<string, string> = {
                service_price_updated: 'Service Price Updated',
                service_added: 'New Service Added',
              };
              return (
                <label
                  key={key}
                  className="flex items-center gap-2 rounded-xl border border-[#E8E8ED] bg-white px-3 py-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) =>
                      setNotifSettings({
                        ...notifSettings,
                        events: { ...notifSettings.events, [key]: e.target.checked },
                      })
                    }
                    className="accent-[#0071E3]"
                  />
                  <span className="font-mono-num text-[11px]">{labelMap[key] || key}</span>
                </label>
              );
            })}
          </div>

          <div className="flex justify-end">
            <GlassButton variant="primary" size="sm" onClick={() => void handleSaveNotif()}>
              Save Notification Rules
            </GlassButton>
          </div>
        </div>
      )}

      {/* Apps Script Legacy Sync */}
      <div className="liquid-glass-card rounded-3xl p-6 space-y-3 text-xs">
        <div className="inline-flex items-center gap-2 font-bold text-sm text-[#1D1D1F]">
          <ShieldCheck className="w-4 h-4 text-[#0071E3]" />
          <span>Optional Google Apps Script Bridge (/exec URL)</span>
        </div>
        <form onSubmit={handleSaveAppsScriptUrl} className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            value={endpointDraft}
            onChange={(e) => setEndpointDraft(e.target.value)}
            placeholder="https://script.google.com/macros/s/.../exec"
            className="flex-1 rounded-xl border border-[#E8E8ED] bg-white px-3 py-2 font-mono-num"
          />
          <GlassButton type="submit" variant="subtle" size="sm">
            Save Bridge URL
          </GlassButton>
        </form>
      </div>

      {/* Audit Logs */}
      <div className="liquid-glass-card rounded-3xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8E8ED]">
          <h3 className="font-display text-base font-bold text-[#1D1D1F]">
            Immutable Security &amp; Audit Trail ({auditLogs.length})
          </h3>
        </div>
        {loading ? (
          <div className="p-8 text-center text-xs text-[#6E6E73]">Loading audit logs...</div>
        ) : auditLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#6E6E73]">No audit events yet.</div>
        ) : (
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5F5F7] border-b border-[#E8E8ED] text-[#6E6E73] font-semibold">
                  <th className="py-2.5 px-4">Timestamp</th>
                  <th className="py-2.5 px-4">Actor</th>
                  <th className="py-2.5 px-4">Action</th>
                  <th className="py-2.5 px-4">Target</th>
                  <th className="py-2.5 px-4">Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8ED]">
                {auditLogs.slice(0, 60).map((log) => (
                  <tr key={log.logId}>
                    <td className="py-2.5 px-4 font-mono-num text-[11px] text-[#6E6E73] whitespace-nowrap">
                      {log.timestamp.slice(0, 19).replace('T', ' ')}
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-[#1D1D1F]">{log.actorName}</span>{' '}
                      <span className="text-[10px] text-[#6E6E73]">({log.actorRole})</span>
                    </td>
                    <td className="py-2.5 px-4 font-mono-num font-bold text-[#0071E3] whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="py-2.5 px-4 font-mono-num">{log.targetId}</td>
                    <td className="py-2.5 px-4 text-[#1D1D1F]">{log.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Notification Delivery Log */}
      {notifLogs.length > 0 && (
        <div className="liquid-glass-card rounded-3xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8E8ED]">
            <h3 className="font-display text-base font-bold text-[#1D1D1F]">
              Notification Queue &amp; Delivery History ({notifLogs.length})
            </h3>
          </div>
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5F5F7] border-b border-[#E8E8ED] text-[#6E6E73]">
                  <th className="py-2.5 px-4">Time</th>
                  <th className="py-2.5 px-4">Event</th>
                  <th className="py-2.5 px-4">Recipient</th>
                  <th className="py-2.5 px-4">Subject</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8ED]">
                {notifLogs.slice(0, 30).map((nl) => (
                  <tr key={nl.id}>
                    <td className="py-2 px-4 font-mono-num text-[10px] text-[#6E6E73] whitespace-nowrap">
                      {nl.timestamp.slice(0, 16).replace('T', ' ')}
                    </td>
                    <td className="py-2 px-4 font-mono-num font-semibold">{nl.event}</td>
                    <td className="py-2 px-4">{nl.recipient}</td>
                    <td className="py-2 px-4 max-w-[260px] truncate">{nl.subject}</td>
                    <td className="py-2 px-4 font-mono-num text-[10px]">{nl.deliveryStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <DeploymentChecklistCard />
    </div>
  );
}
