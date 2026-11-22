import { useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CalendarCheck2,
  CheckCircle2,
  Compass,
  FileSpreadsheet,
  Globe,
  Inbox,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Palette,
  Share2,
  Shield,
  X,
} from 'lucide-react';
import { AppRoute } from '../data/akyinData';
import { useSiteConfig } from '../context/SiteConfigContext';
import { akyinApiClient } from '../utils/AkyinApiClient';
import { AdminDashboardData } from '../types/advisory';
import { formatSlotRangeIst } from '../utils/advisoryHelpers';
import { AkyinLogo } from '../components/AkyinLogo';
import { GlassButton } from '../components/liquid-glass';
import { AdminAppointmentsPanel } from '../components/admin/AdminAppointmentsPanel';
import { AdminCalendarPanel } from '../components/admin/AdminCalendarPanel';
import {
  AdminSettingsSection,
  AdminVenturesPanel,
} from '../components/admin/AdminContentPanels';
import { AdminEnquiriesPanel } from '../components/admin/AdminEnquiriesPanel';
import { AdminLoginPage } from '../components/admin/AdminLoginPage';
import { DeploymentChecklistCard } from '../components/admin/DeploymentChecklistCard';
import { GoogleWorkspacePanel } from '../components/admin/GoogleWorkspacePanel';

export { AdminLoginPage } from '../components/admin/AdminLoginPage';

type AdminSidebarTab =
  | 'Overview'
  | 'Appointments'
  | 'Calendar'
  | 'Google Workspace'
  | 'Enquiries'
  | 'Business Advisory'
  | 'Ventures'
  | 'Website Settings'
  | 'Branding'
  | 'Social Links'
  | 'Contact Settings'
  | 'Admin Security'
  | 'Logout';

const SIDEBAR_ITEMS: Array<{
  id: AdminSidebarTab;
  icon: typeof LayoutDashboard;
}> = [
  { id: 'Overview', icon: LayoutDashboard },
  { id: 'Appointments', icon: CalendarCheck2 },
  { id: 'Calendar', icon: Calendar },
  { id: 'Google Workspace', icon: FileSpreadsheet },
  { id: 'Enquiries', icon: Inbox },
  { id: 'Business Advisory', icon: Compass },
  { id: 'Ventures', icon: Briefcase },
  { id: 'Website Settings', icon: Globe },
  { id: 'Branding', icon: Palette },
  { id: 'Social Links', icon: Share2 },
  { id: 'Contact Settings', icon: Mail },
  { id: 'Admin Security', icon: Shield },
  { id: 'Logout', icon: LogOut },
];

interface AdminPageProps {
  onNavigate: (route: AppRoute) => void;
}

export function AdminPage({ onNavigate }: AdminPageProps) {
  const { refreshSiteConfig } = useSiteConfig();

  const [activeTab, setActiveTab] = useState<AdminSidebarTab>('Overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordConfigured, setPasswordConfigured] = useState<boolean>(true);
  const [isLiveBackend, setIsLiveBackend] = useState<boolean>(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const [endpointDraft, setEndpointDraft] = useState<string>(() =>
    akyinApiClient.getEndpointUrl()
  );
  const [endpointStatus, setEndpointStatus] = useState('');
  const [endpointError, setEndpointError] = useState('');

  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [loadingDash, setLoadingDash] = useState(false);

  // Admin Security Password Rotation
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwErr, setPwErr] = useState('');

  const refreshStatusAndValidate = useCallback(async () => {
    setCheckingStatus(true);
    try {
      const [status, isSessionValid] = await Promise.all([
        akyinApiClient.checkAdminStatus(),
        akyinApiClient.validateSession(),
      ]);
      setPasswordConfigured(status.passwordConfigured);
      setIsLiveBackend(status.isLiveBackend);
      setAuthenticated(isSessionValid);
    } catch {
      setIsLiveBackend(akyinApiClient.isLiveConnected());
      setAuthenticated(false);
    } finally {
      setCheckingStatus(false);
    }
  }, []);

  const loadDashboard = useCallback(async () => {
    setLoadingDash(true);
    try {
      const data = await akyinApiClient.fetchAdminDashboard();
      setDashboard(data);
    } catch {
      akyinApiClient.clearSession();
      setAuthenticated(false);
    } finally {
      setLoadingDash(false);
    }
  }, []);

  useEffect(() => {
    void refreshStatusAndValidate();
  }, [refreshStatusAndValidate]);

  useEffect(() => {
    if (authenticated) {
      void loadDashboard();
    }
  }, [authenticated, loadDashboard]);

  const handleSaveEndpoint = async (e: React.FormEvent) => {
    e.preventDefault();
    setEndpointStatus('');
    setEndpointError('');
    try {
      akyinApiClient.setEndpointUrl(endpointDraft);
      setAuthenticated(false);
      await refreshStatusAndValidate();
      await refreshSiteConfig();
      setEndpointStatus(
        endpointDraft.trim()
          ? 'Connected Apps Script Web App URL. Please sign in or initialize your owner password.'
          : 'Cleared custom URL — operating in local preview mode.'
      );
    } catch (err) {
      setEndpointError(err instanceof Error ? err.message : 'Invalid URL.');
    }
  };

  const handleLogout = async () => {
    await akyinApiClient.logoutAdmin();
    setAuthenticated(false);
    setDashboard(null);
    setActiveTab('Overview');
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg('');
    setPwErr('');
    try {
      await akyinApiClient.changeAdminPassword(currentPw, newPw);
      setCurrentPw('');
      setNewPw('');
      setPwMsg('Administrator password rotated securely.');
      await loadDashboard();
    } catch (err) {
      setPwErr(err instanceof Error ? err.message : 'Unable to change password.');
    }
  };

  if (!authenticated) {
    return (
      <AdminLoginPage
        passwordConfigured={passwordConfigured}
        isLiveBackend={isLiveBackend}
        checkingStatus={checkingStatus}
        onNavigate={onNavigate}
        onAuthenticated={() => {
          setPasswordConfigured(true);
          setAuthenticated(true);
        }}
        onEndpointUpdated={async () => {
          await refreshStatusAndValidate();
          await refreshSiteConfig();
        }}
      />
    );
  }

  const pendingCount = (dashboard?.appointments || []).filter(
    (a) => a.bookingStatus === 'Pending' || a.bookingStatus === 'Payment Awaited'
  ).length;
  const confirmedCount = (dashboard?.appointments || []).filter(
    (a) => a.bookingStatus === 'Confirmed'
  ).length;
  const openEnquiriesCount = (dashboard?.enquiries || []).filter(
    (e) => e.enquiryStatus === 'New' || e.enquiryStatus === 'In Progress'
  ).length;

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden liquid-glass-nav px-4 h-14 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <AkyinLogo size="sm" />
          <span className="font-mono-num text-[11px] font-semibold text-[#6E6E73]">ADMIN</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileNavOpen((prev) => !prev)}
          className="p-2 rounded-xl hover:bg-[#ECECF0] cursor-pointer"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Fixed Sidebar Navigation (12 exact items) */}
      <aside
        className={`${
          mobileNavOpen ? 'block' : 'hidden'
        } lg:flex w-full lg:w-[264px] shrink-0 liquid-glass-panel border-r border-[#1D1D1F]/8 p-4 flex-col justify-between`}
      >
        <div className="space-y-6">
          <div className="px-3 pt-2 hidden lg:block space-y-2">
            <AkyinLogo />
            <p className="text-[11px] font-semibold text-[#6E6E73]">
              Owner Management Console
            </p>
          </div>

          <nav aria-label="Admin sections" className="space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setMobileNavOpen(false);
                    if (item.id === 'Logout') {
                      void handleLogout();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    item.id === 'Logout'
                      ? 'text-[#D92D20] hover:bg-[#FEF3F2] mt-3'
                      : isActive
                        ? 'liquid-glass-pill-dark text-white'
                        : 'text-[#1D1D1F] hover:bg-[#FFFFFF]/70'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{item.id}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 mt-6 border-t border-[#1D1D1F]/8 px-2 space-y-2 hidden lg:block">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            View Public Website
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="liquid-glass-nav border-b border-[#1D1D1F]/8 px-6 h-14 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs text-[#6E6E73]">
            <span>Admin</span>
            <span>/</span>
            <span className="font-semibold text-[#1D1D1F]">{activeTab}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono-num text-[11px] font-semibold text-[#1D1D1F] whitespace-nowrap">
              {isLiveBackend ? 'Google Sheets Live' : 'Local Preview Mode'}
            </span>
            <GlassButton
              variant="subtle"
              size="sm"
              onClick={() => onNavigate('/advisory')}
            >
              Open /advisory
            </GlassButton>
          </div>
        </header>

        <div className="p-6 sm:p-8 max-w-6xl w-full mx-auto space-y-6">
          {loadingDash && !dashboard ? (
            <div className="liquid-glass-card rounded-3xl p-12 text-center text-sm text-[#6E6E73]">
              Loading AKYIN operational ledger...
            </div>
          ) : !dashboard ? null : (
            <>
              {activeTab === 'Overview' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F]">
                      Executive Overview
                    </h2>
                    <p className="text-xs text-[#6E6E73] mt-0.5">
                      Real-time snapshot across appointments, availability, enquiries, and Google Calendar status ({dashboard.timezone}).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="liquid-glass-card rounded-2xl p-5 space-y-1">
                      <p className="text-xs text-[#6E6E73]">Pending / Payment Awaited</p>
                      <p className="font-mono-num text-3xl font-extrabold text-[#1D1D1F]">
                        {pendingCount}
                      </p>
                    </div>
                    <div className="liquid-glass-card rounded-2xl p-5 space-y-1">
                      <p className="text-xs text-[#6E6E73]">Confirmed Consultations</p>
                      <p className="font-mono-num text-3xl font-extrabold text-[#1D1D1F]">
                        {confirmedCount}
                      </p>
                    </div>
                    <div className="liquid-glass-card rounded-2xl p-5 space-y-1">
                      <p className="text-xs text-[#6E6E73]">Open Enquiries</p>
                      <p className="font-mono-num text-3xl font-extrabold text-[#1D1D1F]">
                        {openEnquiriesCount}
                      </p>
                    </div>
                    <div className="liquid-glass-card rounded-2xl p-5 space-y-1">
                      <p className="text-xs text-[#6E6E73]">Blocked Dates</p>
                      <p className="font-mono-num text-3xl font-extrabold text-[#1D1D1F]">
                        {dashboard.blockedDates.length}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="liquid-glass-card rounded-3xl p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-base font-bold text-[#1D1D1F]">
                          Latest Consultation Requests
                        </h3>
                        <button
                          type="button"
                          onClick={() => setActiveTab('Appointments')}
                          className="text-xs font-semibold text-[#1D1D1F] hover:underline cursor-pointer"
                        >
                          Manage All
                        </button>
                      </div>
                      {dashboard.appointments.length === 0 ? (
                        <p className="text-xs text-[#6E6E73] py-3">
                          No consultation requests yet.
                        </p>
                      ) : (
                        <ul className="divide-y divide-[#E8E8ED] text-xs">
                          {dashboard.appointments.slice(0, 5).map((a) => (
                            <li
                              key={a.bookingId}
                              className="py-3 flex items-center justify-between gap-3"
                            >
                              <div>
                                <p className="font-semibold text-[#1D1D1F]">
                                  {a.customerName}{' '}
                                  <span className="font-mono-num text-[#6E6E73]">
                                    ({a.bookingId})
                                  </span>
                                </p>
                                <p className="font-mono-num text-[#6E6E73]">
                                  {a.appointmentDate} · {formatSlotRangeIst(a.startTime, a.endTime)}
                                </p>
                              </div>
                              <span className="px-2.5 py-1 rounded-lg bg-[#FFFFFF]/85 border border-[#E8E8ED] text-[11px] font-semibold text-[#1D1D1F]">
                                {a.bookingStatus}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="liquid-glass-card rounded-3xl p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-base font-bold text-[#1D1D1F]">
                          Recent Enquiries
                        </h3>
                        <button
                          type="button"
                          onClick={() => setActiveTab('Enquiries')}
                          className="text-xs font-semibold text-[#1D1D1F] hover:underline cursor-pointer"
                        >
                          Open Inbox
                        </button>
                      </div>
                      {dashboard.enquiries.length === 0 ? (
                        <p className="text-xs text-[#6E6E73] py-3">
                          No enquiries recorded yet.
                        </p>
                      ) : (
                        <ul className="divide-y divide-[#E8E8ED] text-xs">
                          {dashboard.enquiries.slice(0, 5).map((e) => (
                            <li
                              key={e.enquiryId}
                              className="py-3 flex items-center justify-between gap-3"
                            >
                              <div>
                                <p className="font-semibold text-[#1D1D1F]">
                                  {e.name} — {e.vertical}
                                </p>
                                <p className="text-[#6E6E73] truncate max-w-xs">
                                  {e.enquiryType}
                                </p>
                              </div>
                              <span className="px-2.5 py-1 rounded-lg bg-[#F5F5F7] border border-[#E8E8ED] text-[11px] font-semibold text-[#1D1D1F]">
                                {e.enquiryStatus}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Appointments' && (
                <AdminAppointmentsPanel
                  appointments={dashboard.appointments}
                  onSaveAppointment={async (payload) => {
                    await akyinApiClient.saveAppointment(payload);
                    await loadDashboard();
                  }}
                />
              )}

              {activeTab === 'Calendar' && (
                <AdminCalendarPanel
                  availability={dashboard.availability}
                  blockedDates={dashboard.blockedDates}
                  appointments={dashboard.appointments}
                  onSaveAvailability={async (rules) => {
                    const res = await akyinApiClient.saveAvailability(rules);
                    await loadDashboard();
                    await refreshSiteConfig();
                    return res;
                  }}
                  onBlockDate={async (date, reason) => {
                    const res = await akyinApiClient.blockDate(date, reason);
                    await loadDashboard();
                    await refreshSiteConfig();
                    return res;
                  }}
                  onUnblockDate={async (date) => {
                    await akyinApiClient.unblockDate(date);
                    await loadDashboard();
                    await refreshSiteConfig();
                  }}
                />
              )}

              {activeTab === 'Google Workspace' && (
                <GoogleWorkspacePanel
                  appointments={dashboard.appointments}
                  enquiries={dashboard.enquiries}
                />
              )}

              {activeTab === 'Enquiries' && (
                <AdminEnquiriesPanel
                  enquiries={dashboard.enquiries}
                  onUpdateEnquiry={async (payload) => {
                    await akyinApiClient.updateEnquiry(payload);
                    await loadDashboard();
                  }}
                />
              )}

              {(activeTab === 'Business Advisory' ||
                activeTab === 'Website Settings' ||
                activeTab === 'Branding' ||
                activeTab === 'Social Links' ||
                activeTab === 'Contact Settings') && (
                <AdminSettingsSection
                  key={activeTab}
                  section={activeTab}
                  settings={dashboard.settings}
                  onSaveSettings={async (patch) => {
                    await akyinApiClient.saveWebsiteSettings(patch);
                    await loadDashboard();
                    await refreshSiteConfig();
                  }}
                  onSendTestEmail={
                    activeTab === 'Contact Settings'
                      ? () => akyinApiClient.sendTestEmail()
                      : undefined
                  }
                />
              )}

              {activeTab === 'Ventures' && (
                <AdminVenturesPanel
                  ventures={dashboard.ventures}
                  onSaveVentures={async (ventures) => {
                    await akyinApiClient.saveVentures(ventures);
                    await loadDashboard();
                    await refreshSiteConfig();
                  }}
                />
              )}

              {activeTab === 'Admin Security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F]">
                      Admin Security, Audit Logs &amp; Deployment
                    </h2>
                    <p className="text-xs text-[#6E6E73] mt-0.5">
                      Manage Google Apps Script connection, rotate owner credentials, and inspect administrative activity.
                    </p>
                  </div>

                  <div className="liquid-glass-card rounded-3xl p-6 space-y-4 text-xs">
                    <h3 className="font-display text-base font-bold text-[#1D1D1F]">
                      Apps Script Web App Endpoint Connection
                    </h3>
                    <form onSubmit={handleSaveEndpoint} className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="url"
                        value={endpointDraft}
                        onChange={(e) => setEndpointDraft(e.target.value)}
                        placeholder="https://script.google.com/macros/s/.../exec"
                        className="flex-1 rounded-xl border border-[#E8E8ED] bg-[#FFFFFF] px-3.5 py-2.5 font-mono-num text-xs text-[#1D1D1F] focus:outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/15"
                      />
                      <GlassButton type="submit" variant="primary" size="md">
                        Update Connection URL
                      </GlassButton>
                    </form>
                    {endpointStatus && (
                      <p className="text-xs font-semibold text-[#1D1D1F]">{endpointStatus}</p>
                    )}
                    {endpointError && (
                      <p className="text-xs font-semibold text-[#D92D20]">{endpointError}</p>
                    )}
                  </div>

                  <div className="liquid-glass-card rounded-3xl p-6 space-y-4 text-xs">
                    <div className="inline-flex items-center gap-2 text-sm font-bold text-[#1D1D1F]">
                      <KeyRound className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
                      <span>Rotate Administrator Password</span>
                    </div>
                    <form
                      onSubmit={handlePasswordChange}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end"
                    >
                      <div>
                        <label className="block font-semibold text-[#1D1D1F] mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          required
                          value={currentPw}
                          onChange={(e) => setCurrentPw(e.target.value)}
                          className="w-full rounded-xl border border-[#E8E8ED] bg-[#FFFFFF] px-3 py-2 text-sm text-[#1D1D1F] focus:outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/15"
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
                          value={newPw}
                          onChange={(e) => setNewPw(e.target.value)}
                          className="w-full rounded-xl border border-[#E8E8ED] bg-[#FFFFFF] px-3 py-2 text-sm text-[#1D1D1F] focus:outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/15"
                        />
                      </div>
                      <GlassButton type="submit" variant="primary" size="md">
                        Update Password
                      </GlassButton>
                    </form>
                    {pwMsg && (
                      <p className="text-xs font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                        {pwMsg}
                      </p>
                    )}
                    {pwErr && <p className="text-xs font-semibold text-[#D92D20]">{pwErr}</p>}
                  </div>

                  <div className="liquid-glass-card rounded-3xl p-6 space-y-4">
                    <h3 className="font-display text-base font-bold text-[#1D1D1F]">
                      Audit Trail (AdminLogs)
                    </h3>
                    {dashboard.logs.length === 0 ? (
                      <p className="text-xs text-[#6E6E73]">No audit actions recorded yet.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-[#F5F5F7] border-b border-[#E8E8ED] text-[#6E6E73]">
                              <th className="py-2.5 px-3">Timestamp (IST)</th>
                              <th className="py-2.5 px-3">Action</th>
                              <th className="py-2.5 px-3">Target</th>
                              <th className="py-2.5 px-3">Summary</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E8E8ED]">
                            {dashboard.logs.slice(0, 25).map((log) => (
                              <tr key={log.logId}>
                                <td className="py-2.5 px-3 font-mono-num text-[#6E6E73] whitespace-nowrap">
                                  {log.timestamp}
                                </td>
                                <td className="py-2.5 px-3 font-mono-num font-bold text-[#1D1D1F] whitespace-nowrap">
                                  {log.action}
                                </td>
                                <td className="py-2.5 px-3 font-mono-num text-[#1D1D1F]">
                                  {log.targetId}
                                </td>
                                <td className="py-2.5 px-3 text-[#1D1D1F]">{log.summary}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <DeploymentChecklistCard />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
