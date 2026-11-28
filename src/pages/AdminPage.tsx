import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Briefcase,
  Calculator,
  Calendar,
  CalendarCheck2,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Globe,
  Inbox,
  LayoutDashboard,
  LineChart as LineChartIcon,
  LogOut,
  Menu,
  RefreshCw,
  Save,
  Share2,
  Shield,
  TrendingUp,
  UserCog,
  Users,
  X,
} from 'lucide-react';
import { AppRoute } from '../data/akyinData';
import { useRouteMeta } from '../context/RouteMetaContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import {
  CrmLead,
  PublicSuiteUser,
  UserRole,
  suiteApi,
} from '../services/suiteApi';
import {
  AppointmentRecord,
  AvailabilityRule,
  BlockedDateRecord,
  EnquiryRecord,
} from '../types/advisory';
import { AkyinLogo } from '../components/AkyinLogo';
import { GlassButton } from '../components/liquid-glass';
import { AdminConfigDashboard } from '../components/AdminConfigDashboard';
import { AdminAppointmentsPanel } from '../components/admin/AdminAppointmentsPanel';
import { AdminCalendarPanel } from '../components/admin/AdminCalendarPanel';
import { AdminClientsPanel } from '../components/admin/AdminClientsPanel';
import { AdminCustomerDirectory } from '../components/admin/AdminCustomerDirectory';
import { AdminCrmLeadsPanel } from '../components/admin/AdminCrmLeadsPanel';
import { AdminLoginPage } from '../components/admin/AdminLoginPage';
import { AdminPaymentsPanel } from '../components/admin/AdminPaymentsPanel';
import { AdminRecurringPaymentsPanel } from '../components/admin/AdminRecurringPaymentsPanel';
import { AdminRecurringRevenueInsightsPanel } from '../components/admin/AdminRecurringRevenueInsightsPanel';
import { AdminRevenueReportsPanel } from '../components/admin/AdminRevenueReportsPanel';
import { AdminRouteSeoPanel } from '../components/admin/AdminRouteSeoPanel';
import { AdminSecurityAuditPanel } from '../components/admin/AdminSecurityAuditPanel';
import { AdminServicesPanel } from '../components/admin/AdminServicesPanel';
import { AdminSuiteOverview } from '../components/admin/AdminSuiteOverview';
import { AdminUsersPanel } from '../components/admin/AdminUsersPanel';
import { AdminQuotationsPanel } from '../components/admin/AdminQuotationsPanel';
import { GoogleWorkspacePanel } from '../components/admin/GoogleWorkspacePanel';

export { AdminLoginPage } from '../components/admin/AdminLoginPage';

type AdminSidebarTab =
  | 'Overview'
  | 'Leads and Enquiries'
  | 'Customers'
  | 'Clients'
  | 'Service Catalogue'
  | 'Quotations'
  | 'Appointments'
  | 'Payments'
  | 'Manage Recurring Payments'
  | 'Recurring Revenue Insights'
  | 'Revenue Reports'
  | 'Marketing Tools'
  | 'Website Settings'
  | 'Social Media'
  | 'User and Admin Management'
  | 'Security and Audit Logs'
  | 'Logout';

type AdminResource =
  | 'overview'
  | 'leads'
  | 'clients'
  | 'services'
  | 'quotations'
  | 'appointments'
  | 'payments'
  | 'reports'
  | 'marketing_tools'
  | 'website_settings'
  | 'social_media'
  | 'users'
  | 'security_audit';

const ROLE_RESOURCES: Record<UserRole, Set<AdminResource>> = {
  'Super Admin': new Set<AdminResource>([
    'overview',
    'leads',
    'clients',
    'services',
    'quotations',
    'appointments',
    'payments',
    'reports',
    'marketing_tools',
    'website_settings',
    'social_media',
    'users',
    'security_audit',
  ]),
  'Sales Manager': new Set<AdminResource>([
    'overview',
    'leads',
    'clients',
    'services',
    'quotations',
    'appointments',
    'marketing_tools',
  ]),
  'Finance Manager': new Set<AdminResource>([
    'overview',
    'clients',
    'services',
    'quotations',
    'payments',
    'reports',
  ]),
  Staff: new Set<AdminResource>(['overview', 'leads', 'clients', 'appointments']),
};

function hasClientPermission(role: UserRole, resource: AdminResource): boolean {
  return ROLE_RESOURCES[role]?.has(resource) ?? false;
}

const SIDEBAR_ITEMS: Array<{
  id: AdminSidebarTab;
  resource?: AdminResource;
  icon: typeof LayoutDashboard;
}> = [
  { id: 'Overview', resource: 'overview', icon: LayoutDashboard },
  { id: 'Leads and Enquiries', resource: 'leads', icon: Inbox },
  { id: 'Customers', resource: 'clients', icon: Users },
  { id: 'Clients', resource: 'clients', icon: Users },
  { id: 'Service Catalogue', resource: 'services', icon: Briefcase },
  { id: 'Quotations', resource: 'quotations', icon: FileText },
  { id: 'Appointments', resource: 'appointments', icon: CalendarCheck2 },
  { id: 'Payments', resource: 'payments', icon: CreditCard },
  { id: 'Manage Recurring Payments', resource: 'payments', icon: RefreshCw },
  { id: 'Recurring Revenue Insights', resource: 'reports', icon: LineChartIcon },
  { id: 'Revenue Reports', resource: 'reports', icon: TrendingUp },
  { id: 'Marketing Tools', resource: 'marketing_tools', icon: Calculator },
  { id: 'Website Settings', resource: 'website_settings', icon: Globe },
  { id: 'Social Media', resource: 'social_media', icon: Share2 },
  { id: 'User and Admin Management', resource: 'users', icon: UserCog },
  { id: 'Security and Audit Logs', resource: 'security_audit', icon: Shield },
  { id: 'Logout', icon: LogOut },
];

interface AdminPageProps {
  onNavigate: (route: AppRoute) => void;
}

export function AdminPage({ onNavigate }: AdminPageProps) {
  const { refreshSiteConfig } = useSiteConfig();
  const { routeMetaMap, defaultRouteMeta, updateRouteMeta, resetRouteMeta } = useRouteMeta();

  const [activeTab, setActiveTab] = useState<AdminSidebarTab>('Overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Auth State
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [configured, setConfigured] = useState(true);
  const [currentUser, setCurrentUser] = useState<PublicSuiteUser | null>(null);

  // Overview State
  const [overviewData, setOverviewData] =
    useState<Awaited<ReturnType<typeof suiteApi.getOverview>> | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overviewError, setOverviewError] = useState('');

  // Staff list for CRM Lead Assignment
  const [staffUsers, setStaffUsers] = useState<PublicSuiteUser[]>([]);

  // Appointments sub-navigation & state
  const [apptSubTab, setApptSubTab] = useState<'ledger' | 'calendar' | 'workspace'>('ledger');
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [availability, setAvailability] = useState<AvailabilityRule[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDateRecord[]>([]);
  const [workspaceEnquiries, setWorkspaceEnquiries] = useState<EnquiryRecord[]>([]);
  const [loadingAppts, setLoadingAppts] = useState(false);
  const [apptsError, setApptsError] = useState('');

  // Marketing Tools sub-navigation
  const [marketingSubTab, setMarketingSubTab] = useState<'routes' | 'jsonld'>('routes');

  // Website Settings & Social Media state
  const [settingsDraft, setSettingsDraft] = useState<Record<string, any>>({});
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsNotice, setSettingsNotice] = useState('');
  const [settingsError, setSettingsError] = useState('');

  const bootstrapAuth = useCallback(async () => {
    setCheckingStatus(true);
    try {
      const [status, sessionUser] = await Promise.all([
        suiteApi.getAuthStatus(),
        suiteApi.validateSession(),
      ]);
      setConfigured(status.configured);
      setCurrentUser(sessionUser);
    } catch {
      setCurrentUser(null);
    } finally {
      setCheckingStatus(false);
    }
  }, []);

  useEffect(() => {
    void bootstrapAuth();
  }, [bootstrapAuth]);

  const loadOverview = useCallback(async () => {
    if (!currentUser) return;
    setOverviewLoading(true);
    setOverviewError('');
    try {
      const res = await suiteApi.getOverview();
      setOverviewData(res);
    } catch (err) {
      setOverviewError(
        err instanceof Error ? err.message : 'Unable to load Business Suite overview.'
      );
    } finally {
      setOverviewLoading(false);
    }
  }, [currentUser]);

  const loadAppointmentsData = useCallback(async () => {
    if (!currentUser || !hasClientPermission(currentUser.role, 'appointments')) return;
    setLoadingAppts(true);
    setApptsError('');
    try {
      const [apptRes, leadsRes] = await Promise.all([
        suiteApi.getAppointments(),
        hasClientPermission(currentUser.role, 'leads')
          ? suiteApi.getLeads().catch(() => ({ leads: [] as CrmLead[] }))
          : Promise.resolve({ leads: [] as CrmLead[] }),
      ]);
      setAppointments(apptRes.appointments as AppointmentRecord[]);
      setAvailability(apptRes.availability as AvailabilityRule[]);
      setBlockedDates(apptRes.blockedDates as BlockedDateRecord[]);
      setWorkspaceEnquiries(
        leadsRes.leads.map((l) => ({
          enquiryId: l.leadId,
          createdAt: l.receivedAt,
          name: l.fullName,
          business: l.companyName,
          phone: l.mobileNumber,
          email: l.email,
          city: l.city,
          country: l.country,
          vertical: l.businessCategory || 'General',
          enquiryType: l.requiredService,
          message: l.description,
          enquiryStatus:
            l.stage === 'NEW'
              ? 'New'
              : l.stage === 'CONTACTED'
                ? 'Contacted'
                : l.stage === 'WON'
                  ? 'Resolved'
                  : 'In Progress',
          adminNotes: l.privateNotes,
        }))
      );
    } catch (err) {
      setApptsError(
        err instanceof Error ? err.message : 'Unable to load appointments and availability.'
      );
    } finally {
      setLoadingAppts(false);
    }
  }, [currentUser]);

  const loadSettingsData = useCallback(async () => {
    if (!currentUser) return;
    setLoadingSettings(true);
    setSettingsError('');
    try {
      const res = await suiteApi.getSettings();
      setSettingsDraft(res.websiteSettings || {});
    } catch (err) {
      setSettingsError(
        err instanceof Error ? err.message : 'Unable to load website configuration.'
      );
    } finally {
      setLoadingSettings(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    void loadOverview();
    if (currentUser.role === 'Super Admin') {
      suiteApi
        .getUsers()
        .then((res) => setStaffUsers(res.users))
        .catch(() => setStaffUsers([currentUser]));
    } else {
      setStaffUsers([currentUser]);
    }
  }, [currentUser, loadOverview]);

  useEffect(() => {
    if (!currentUser) return;
    if (activeTab === 'Appointments') {
      void loadAppointmentsData();
    } else if (activeTab === 'Website Settings' || activeTab === 'Social Media') {
      setSettingsNotice('');
      setSettingsError('');
      void loadSettingsData();
    }
  }, [activeTab, currentUser, loadAppointmentsData, loadSettingsData]);

  const visibleSidebarItems = useMemo(() => {
    if (!currentUser) return [];
    return SIDEBAR_ITEMS.filter(
      (item) => !item.resource || hasClientPermission(currentUser.role, item.resource)
    );
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await suiteApi.logout();
    } finally {
      setCurrentUser(null);
      setOverviewData(null);
      setActiveTab('Overview');
    }
  };

  const handleSaveSettingsPatch = async (keys: string[], label: string) => {
    setSavingSettings(true);
    setSettingsNotice('');
    setSettingsError('');
    try {
      const patch: Record<string, unknown> = {};
      keys.forEach((k) => {
        if (k in settingsDraft) {
          patch[k] = settingsDraft[k];
        }
      });
      const res = await suiteApi.updateSettings(patch);
      setSettingsDraft(res.websiteSettings || settingsDraft);
      await refreshSiteConfig();
      await loadOverview();
      setSettingsNotice(`Saved ${label} to suite database.`);
    } catch (err) {
      setSettingsError(err instanceof Error ? err.message : 'Unable to save settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  if (!currentUser) {
    return (
      <AdminLoginPage
        configured={configured}
        checkingStatus={checkingStatus}
        onNavigate={onNavigate}
        onAuthenticated={(user) => {
          setConfigured(true);
          setCurrentUser(user);
          setActiveTab('Overview');
        }}
      />
    );
  }

  const inputCls =
    'w-full rounded-xl border border-[#E8E8ED] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#1D1D1F] focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/15';

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden liquid-glass-nav px-4 h-14 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <AkyinLogo size="sm" />
          <span className="font-mono-num text-[11px] font-semibold text-[#0071E3]">SUITE</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileNavOpen((prev) => !prev)}
          aria-label="Toggle admin sidebar"
          className="p-2 rounded-xl hover:bg-[#ECECF0] cursor-pointer"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Fixed Sidebar Navigation — 13 RBAC Sections + Logout */}
      <aside
        className={`${
          mobileNavOpen ? 'block' : 'hidden'
        } lg:flex w-full lg:w-[272px] shrink-0 liquid-glass-panel border-r border-[#1D1D1F]/8 p-4 flex-col justify-between`}
      >
        <div className="space-y-5">
          <div className="px-3 pt-2 hidden lg:block space-y-2">
            <AkyinLogo />
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-semibold text-[#6E6E73] truncate">
                {currentUser.name}
              </p>
              <span className="px-2 py-0.5 rounded-md bg-[#F5F5F7] border border-[#E8E8ED] font-mono-num text-[10px] font-bold text-[#0071E3] shrink-0">
                {currentUser.role}
              </span>
            </div>
          </div>

          <nav aria-label="Admin sections" className="space-y-1">
            {visibleSidebarItems.map((item) => {
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
                  <span className="truncate">{item.id}</span>
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
          <div className="flex items-center gap-2 text-xs text-[#6E6E73] min-w-0">
            <span>Admin</span>
            <span>/</span>
            <span className="font-semibold text-[#1D1D1F] truncate">{activeTab}</span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span className="hidden sm:inline-block font-mono-num text-[11px] font-semibold text-[#6E6E73]">
              {currentUser.email}
            </span>
            <GlassButton variant="subtle" size="sm" onClick={() => onNavigate('/tools')}>
              Open /tools
            </GlassButton>
            <GlassButton variant="subtle" size="sm" onClick={() => onNavigate('/advisory')}>
              Open /advisory
            </GlassButton>
          </div>
        </header>

        <main className="p-6 sm:p-8 max-w-6xl w-full mx-auto space-y-6">
          {/* 1. Overview */}
          {activeTab === 'Overview' && (
            <AdminSuiteOverview
              loading={overviewLoading}
              error={overviewError}
              data={overviewData}
              onRefresh={() => void loadOverview()}
              onJumpToTab={(tab) => setActiveTab(tab as AdminSidebarTab)}
            />
          )}

          {/* 2. Leads and Enquiries */}
          {activeTab === 'Leads and Enquiries' && (
            <AdminCrmLeadsPanel
              staffUsers={staffUsers}
              onChanged={() => void loadOverview()}
            />
          )}

          {/* 3. Clients */}
          {activeTab === 'Customers' && <AdminCustomerDirectory />}

          {activeTab === 'Clients' && (
            <AdminClientsPanel onChanged={() => void loadOverview()} />
          )}

          {/* 4. Service Catalogue */}
          {activeTab === 'Service Catalogue' && (
            <AdminServicesPanel
              currentUserRole={currentUser.role}
              currentUserName={currentUser.name}
              currentUserEmail={currentUser.email}
            />
          )}

          {/* 5. Quotations */}
          {activeTab === 'Quotations' && (
            <AdminQuotationsPanel onChanged={() => void loadOverview()} />
          )}

          {/* 6. Appointments */}
          {activeTab === 'Appointments' && (
            <div className="space-y-6">
              <div className="inline-flex p-1 rounded-xl bg-white border border-[#E8E8ED] gap-1">
                <button
                  type="button"
                  onClick={() => setApptSubTab('ledger')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    apptSubTab === 'ledger'
                      ? 'bg-[#1D1D1F] text-white'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  <CalendarCheck2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Appointments Ledger</span>
                </button>
                <button
                  type="button"
                  onClick={() => setApptSubTab('calendar')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    apptSubTab === 'calendar'
                      ? 'bg-[#1D1D1F] text-white'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Weekly IST Calendar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setApptSubTab('workspace')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    apptSubTab === 'workspace'
                      ? 'bg-[#1D1D1F] text-white'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Google Workspace Sync</span>
                </button>
              </div>

              {apptsError && (
                <div className="rounded-2xl bg-[#FEF3F2] border border-[#FECDCA] px-4 py-3 flex items-center justify-between gap-4 text-xs font-semibold text-[#B42318]">
                  <span>{apptsError}</span>
                  <button
                    type="button"
                    onClick={() => void loadAppointmentsData()}
                    className="px-3 py-1.5 rounded-lg bg-white border border-[#FECDCA] text-[#B42318] hover:bg-[#FFF5F5] cursor-pointer shrink-0"
                  >
                    Retry
                  </button>
                </div>
              )}

              {loadingAppts && appointments.length === 0 ? (
                <div className="liquid-glass-card rounded-3xl p-12 text-center text-sm text-[#6E6E73]">
                  Loading appointments and availability...
                </div>
              ) : apptSubTab === 'ledger' ? (
                <AdminAppointmentsPanel
                  appointments={appointments}
                  onSaveAppointment={async (payload) => {
                    await suiteApi.saveAppointment(payload as Record<string, unknown>);
                    await loadAppointmentsData();
                    await loadOverview();
                  }}
                />
              ) : apptSubTab === 'calendar' ? (
                <AdminCalendarPanel
                  availability={availability}
                  blockedDates={blockedDates}
                  appointments={appointments}
                  onSaveAvailability={async (rules) => {
                    const res = await suiteApi.saveAvailability(rules);
                    await loadAppointmentsData();
                    await refreshSiteConfig();
                    return res;
                  }}
                  onBlockDate={async (date, reason) => {
                    const res = await suiteApi.blockDate(date, reason);
                    await loadAppointmentsData();
                    await refreshSiteConfig();
                    return res;
                  }}
                  onUnblockDate={async (date) => {
                    await suiteApi.unblockDate(date);
                    await loadAppointmentsData();
                    await refreshSiteConfig();
                  }}
                />
              ) : (
                <GoogleWorkspacePanel
                  appointments={appointments}
                  enquiries={workspaceEnquiries}
                />
              )}
            </div>
          )}

          {/* 7. Payments */}
          {activeTab === 'Payments' && (
            <AdminPaymentsPanel onChanged={() => void loadOverview()} />
          )}

          {/* 7b. Manage Recurring Payments */}
          {activeTab === 'Manage Recurring Payments' && (
            <AdminRecurringPaymentsPanel onChanged={() => void loadOverview()} />
          )}

          {/* 7c. Recurring Revenue Insights */}
          {activeTab === 'Recurring Revenue Insights' && (
            <AdminRecurringRevenueInsightsPanel
              onJumpToRecurring={() => setActiveTab('Manage Recurring Payments')}
            />
          )}

          {/* 8. Revenue Reports */}
          {activeTab === 'Revenue Reports' && <AdminRevenueReportsPanel />}

          {/* 9. Marketing Tools */}
          {activeTab === 'Marketing Tools' && (
            <div className="space-y-6">
              <div className="liquid-glass-card rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F]">
                    Marketing Tools, SEO &amp; Schema Management
                  </h2>
                  <p className="text-xs text-[#6E6E73] mt-0.5">
                    Public 20-calculator Business Tools Suite (/tools) and dynamic ROUTE_META / JSON-LD configuration.
                  </p>
                </div>
                <GlassButton variant="primary" size="sm" onClick={() => onNavigate('/tools')}>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Open 20 Public Calculators (/tools)</span>
                </GlassButton>
              </div>

              <div
                role="tablist"
                aria-label="SEO configuration mode"
                className="inline-flex p-1 rounded-xl bg-white border border-[#E8E8ED]"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={marketingSubTab === 'routes'}
                  onClick={() => setMarketingSubTab('routes')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    marketingSubTab === 'routes'
                      ? 'bg-[#1D1D1F] text-white'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  All Routes (Titles &amp; Descriptions)
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={marketingSubTab === 'jsonld'}
                  onClick={() => setMarketingSubTab('jsonld')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    marketingSubTab === 'jsonld'
                      ? 'bg-[#1D1D1F] text-white'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  OpenGraph &amp; JSON-LD Inspector
                </button>
              </div>

              {marketingSubTab === 'routes' ? (
                <AdminConfigDashboard onPreviewRoute={onNavigate} />
              ) : (
                <AdminRouteSeoPanel
                  routeMetaMap={routeMetaMap}
                  defaultRouteMeta={defaultRouteMeta}
                  onUpdateRouteMeta={updateRouteMeta}
                  onResetRouteMeta={resetRouteMeta}
                  onPreviewRoute={onNavigate}
                />
              )}
            </div>
          )}

          {/* 10. Website Settings */}
          {activeTab === 'Website Settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F]">
                  Website Settings, Advisory &amp; UAE Gateway Configuration
                </h2>
                <p className="text-xs text-[#6E6E73] mt-0.5">
                  Configure homepage branding, advisory parameters, portfolio client counter, contact details, and UAE AED gateway readiness.
                </p>
              </div>

              {settingsNotice && (
                <div className="rounded-2xl liquid-glass-panel px-4 py-3 text-xs font-semibold text-[#1D1D1F] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#067647]" aria-hidden="true" />
                  <span>{settingsNotice}</span>
                </div>
              )}
              {settingsError && (
                <div className="rounded-2xl bg-[#FEF3F2] border border-[#FECDCA] px-4 py-3 text-xs font-semibold text-[#B42318]">
                  {settingsError}
                </div>
              )}

              {loadingSettings ? (
                <div className="liquid-glass-card rounded-3xl p-10 text-center text-xs text-[#6E6E73]">
                  Loading website settings...
                </div>
              ) : (
                <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 space-y-6 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-[#1D1D1F] mb-1">
                        Homepage Hero Headline
                      </label>
                      <input
                        value={settingsDraft.heroHeadline || ''}
                        onChange={(e) =>
                          setSettingsDraft({ ...settingsDraft, heroHeadline: e.target.value })
                        }
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1D1D1F] mb-1">
                        Header Brand Wordmark
                      </label>
                      <input
                        value={settingsDraft.brandWordmark || 'AKYIN'}
                        onChange={(e) =>
                          setSettingsDraft({ ...settingsDraft, brandWordmark: e.target.value })
                        }
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1D1D1F] mb-1">
                      Homepage Hero Introduction
                    </label>
                    <textarea
                      rows={2}
                      value={settingsDraft.heroSubheadline || ''}
                      onChange={(e) =>
                        setSettingsDraft({ ...settingsDraft, heroSubheadline: e.target.value })
                      }
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1D1D1F] mb-1">
                      Footer Corporate Description
                    </label>
                    <textarea
                      rows={2}
                      value={settingsDraft.footerTagline || ''}
                      onChange={(e) =>
                        setSettingsDraft({ ...settingsDraft, footerTagline: e.target.value })
                      }
                      className={inputCls}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#E8E8ED]">
                    <div>
                      <label className="block font-semibold text-[#1D1D1F] mb-1">
                        Reported Clients Handled
                      </label>
                      <input
                        type="number"
                        min={11}
                        value={settingsDraft.reportedClientsCount ?? 58}
                        onChange={(e) =>
                          setSettingsDraft({
                            ...settingsDraft,
                            reportedClientsCount: Number(e.target.value) || 58,
                          })
                        }
                        className={`${inputCls} font-mono-num`}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1D1D1F] mb-1">
                        Public Contact Email
                      </label>
                      <input
                        type="email"
                        value={settingsDraft.contactEmail || ''}
                        onChange={(e) =>
                          setSettingsDraft({ ...settingsDraft, contactEmail: e.target.value })
                        }
                        className={inputCls}
                      />
                    </div>
                    <div className="md:col-span-2 rounded-xl bg-[#F5F5F7] border border-[#E8E8ED] px-4 py-3 text-xs text-[#6E6E73]">
                      <span className="font-semibold text-[#1D1D1F]">Privacy Mode Active:</span> Public phone numbers are hidden across AKYIN.com. Visitors connect via the official <span className="font-semibold text-[#1D1D1F]">WhatsApp Connect</span> channel and corporate email.
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1D1D1F] mb-1">
                        Consultation Fee Label
                      </label>
                      <input
                        value={settingsDraft.consultationFee || ''}
                        onChange={(e) =>
                          setSettingsDraft({ ...settingsDraft, consultationFee: e.target.value })
                        }
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1D1D1F] mb-1">
                        Owner Alert Email
                      </label>
                      <input
                        type="email"
                        value={settingsDraft.notificationEmail || ''}
                        onChange={(e) =>
                          setSettingsDraft({
                            ...settingsDraft,
                            notificationEmail: e.target.value,
                          })
                        }
                        className={inputCls}
                      />
                    </div>
                  </div>

                  {/* UAE AED Payment Gateway Readiness */}
                  <div className="rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED] p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-bold text-[#1D1D1F]">
                          UAE International Payment Gateway (AED / USD)
                        </p>
                        <p className="text-[11px] text-[#6E6E73]">
                          When disabled, international AED/USD quotations fall back cleanly to UAE bank transfer instructions.
                        </p>
                      </div>
                      <label className="inline-flex items-center gap-2 font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(settingsDraft.uaeGatewayEnabled)}
                          onChange={(e) =>
                            setSettingsDraft({
                              ...settingsDraft,
                              uaeGatewayEnabled: e.target.checked,
                            })
                          }
                          className="accent-[#0071E3] w-4 h-4"
                        />
                        <span>Enable UAE Gateway Checkout</span>
                      </label>
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1D1D1F] mb-1">
                        UAE Bank Transfer / Payment Note
                      </label>
                      <textarea
                        rows={2}
                        value={settingsDraft.uaeGatewayNote || ''}
                        onChange={(e) =>
                          setSettingsDraft({ ...settingsDraft, uaeGatewayNote: e.target.value })
                        }
                        placeholder="UAE AED payments can be settled via official bank transfer or Razorpay International once enabled."
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <GlassButton
                      disabled={savingSettings}
                      variant="primary"
                      size="md"
                      onClick={() =>
                        void handleSaveSettingsPatch(
                          [
                            'heroHeadline',
                            'heroSubheadline',
                            'footerTagline',
                            'brandWordmark',
                            'reportedClientsCount',
                            'contactEmail',
                            'consultationFee',
                            'notificationEmail',
                            'uaeGatewayEnabled',
                            'uaeGatewayNote',
                          ],
                          'Website & UAE Gateway Settings'
                        )
                      }
                    >
                      <Save className="w-4 h-4" aria-hidden="true" />
                      <span>{savingSettings ? 'Saving...' : 'Save Website Settings'}</span>
                    </GlassButton>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 11. Social Media */}
          {activeTab === 'Social Media' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F]">
                  Social Media &amp; Publishing Channels
                </h2>
                <p className="text-xs text-[#6E6E73] mt-0.5">
                  Manage official AKYIN social profiles and Amazon / Google Play Books storefront URLs.
                </p>
              </div>

              {settingsNotice && (
                <div className="rounded-2xl liquid-glass-panel px-4 py-3 text-xs font-semibold text-[#1D1D1F] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#067647]" aria-hidden="true" />
                  <span>{settingsNotice}</span>
                </div>
              )}
              {settingsError && (
                <div className="rounded-2xl bg-[#FEF3F2] border border-[#FECDCA] px-4 py-3 text-xs font-semibold text-[#B42318]">
                  {settingsError}
                </div>
              )}

              {loadingSettings ? (
                <div className="liquid-glass-card rounded-3xl p-10 text-center text-xs text-[#6E6E73]">
                  Loading social profile links...
                </div>
              ) : (
                <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 space-y-5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-[#1D1D1F] mb-1">Instagram URL</label>
                      <input
                        type="url"
                        value={settingsDraft.instagramUrl || ''}
                        onChange={(e) =>
                          setSettingsDraft({ ...settingsDraft, instagramUrl: e.target.value })
                        }
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1D1D1F] mb-1">Facebook URL</label>
                      <input
                        type="url"
                        value={settingsDraft.facebookUrl || ''}
                        onChange={(e) =>
                          setSettingsDraft({ ...settingsDraft, facebookUrl: e.target.value })
                        }
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1D1D1F] mb-1">X / Twitter URL</label>
                      <input
                        type="url"
                        value={settingsDraft.xUrl || ''}
                        onChange={(e) =>
                          setSettingsDraft({ ...settingsDraft, xUrl: e.target.value })
                        }
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1D1D1F] mb-1">YouTube URL</label>
                      <input
                        type="url"
                        value={settingsDraft.youtubeUrl || ''}
                        onChange={(e) =>
                          setSettingsDraft({ ...settingsDraft, youtubeUrl: e.target.value })
                        }
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1D1D1F] mb-1">
                        Amazon Author Storefront URL
                      </label>
                      <input
                        type="url"
                        value={settingsDraft.amazonUrl || ''}
                        onChange={(e) =>
                          setSettingsDraft({ ...settingsDraft, amazonUrl: e.target.value })
                        }
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1D1D1F] mb-1">
                        Google Play Books URL
                      </label>
                      <input
                        type="url"
                        value={settingsDraft.googlePlayBooksUrl || ''}
                        onChange={(e) =>
                          setSettingsDraft({
                            ...settingsDraft,
                            googlePlayBooksUrl: e.target.value,
                          })
                        }
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <GlassButton
                      disabled={savingSettings}
                      variant="primary"
                      size="md"
                      onClick={() =>
                        void handleSaveSettingsPatch(
                          [
                            'instagramUrl',
                            'facebookUrl',
                            'xUrl',
                            'youtubeUrl',
                            'amazonUrl',
                            'googlePlayBooksUrl',
                          ],
                          'Social Media & Publishing Links'
                        )
                      }
                    >
                      <Save className="w-4 h-4" aria-hidden="true" />
                      <span>{savingSettings ? 'Saving...' : 'Save Social Media Links'}</span>
                    </GlassButton>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 12. User and Admin Management */}
          {activeTab === 'User and Admin Management' && (
            <AdminUsersPanel currentUserId={currentUser.id} />
          )}

          {/* 13. Security and Audit Logs */}
          {activeTab === 'Security and Audit Logs' && <AdminSecurityAuditPanel />}
        </main>
      </div>
    </div>
  );
}
