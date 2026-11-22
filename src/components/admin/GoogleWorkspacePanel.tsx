import { useCallback, useEffect, useState } from 'react';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ExternalLink,
  FileSpreadsheet,
  FolderOpen,
  LogOut,
  Plus,
  RefreshCw,
  TableProperties,
  Trash2,
} from 'lucide-react';
import type { User } from 'firebase/auth';
import { AppointmentRecord, EnquiryRecord } from '../../types/advisory';
import { getTodayIstDate } from '../../utils/advisoryHelpers';
import {
  getWorkspaceAccessToken,
  initWorkspaceAuth,
  logoutWorkspaceGoogle,
  signInWithGoogleWorkspace,
} from '../../services/googleWorkspaceAuth';
import {
  appendSheetValues,
  appointmentToSheetRow,
  createAkyinOperationsSpreadsheet,
  createCalendarEvent,
  deleteCalendarEvent,
  enquiryToSheetRow,
  getSpreadsheetDetails,
  listCalendarEvents,
  listDriveSpreadsheets,
  listUserCalendars,
  readSheetValues,
  updateCalendarEvent,
  WorkspaceCalendarEvent,
  WorkspaceCalendarItem,
  WorkspaceSpreadsheetDetails,
  WorkspaceSpreadsheetFile,
} from '../../services/googleWorkspaceClient';
import { sanitizeHref } from '../../utils/security';
import { GoogleSignInButton } from '../GoogleSignInButton';
import { GlassButton, GlassModal } from '../liquid-glass';

interface GoogleWorkspacePanelProps {
  appointments: AppointmentRecord[];
  enquiries: EnquiryRecord[];
}

interface PendingMutationAction {
  title: string;
  subtitle: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
  execute: (token: string) => Promise<void>;
}

export function GoogleWorkspacePanel({
  appointments,
  enquiries,
}: GoogleWorkspacePanelProps) {
  const [needsAuth, setNeedsAuth] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  const [activeTool, setActiveTool] = useState<'calendar' | 'sheets'>('calendar');
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Google Calendar State
  const [calendars, setCalendars] = useState<WorkspaceCalendarItem[]>([]);
  const [selectedCalendarId, setSelectedCalendarId] = useState('primary');
  const [events, setEvents] = useState<WorkspaceCalendarEvent[]>([]);
  const [loadingCal, setLoadingCal] = useState(false);

  const [newEventTitle, setNewEventTitle] = useState(
    'AKYIN Business Advisory Consultation'
  );
  const [newEventDate, setNewEventDate] = useState(getTodayIstDate());
  const [newEventStart, setNewEventStart] = useState('18:00');
  const [newEventEnd, setNewEventEnd] = useState('18:30');
  const [newEventNotes, setNewEventNotes] = useState('');

  const [editingEvent, setEditingEvent] = useState<WorkspaceCalendarEvent | null>(null);
  const [editEventTitle, setEditEventTitle] = useState('');
  const [editEventNotes, setEditEventNotes] = useState('');

  // Google Sheets State
  const [spreadsheets, setSpreadsheets] = useState<WorkspaceSpreadsheetFile[]>([]);
  const [selectedSpreadsheetId, setSelectedSpreadsheetId] = useState('');
  const [spreadsheetDetails, setSpreadsheetDetails] =
    useState<WorkspaceSpreadsheetDetails | null>(null);
  const [selectedTabTitle, setSelectedTabTitle] = useState('');
  const [sheetRows, setSheetRows] = useState<string[][]>([]);
  const [loadingSheets, setLoadingSheets] = useState(false);
  const [customRowValues, setCustomRowValues] = useState('');

  // Mandatory explicit user confirmation before any mutating/destructive Workspace call
  const [pendingAction, setPendingAction] = useState<PendingMutationAction | null>(null);
  const [executingMutation, setExecutingMutation] = useState(false);

  const loadCalendarWorkspace = useCallback(
    async (token: string, calId = selectedCalendarId) => {
      setLoadingCal(true);
      setErrorMsg('');
      try {
        const list = await listUserCalendars(token);
        setCalendars(list);
        const resolvedId =
          list.some((c) => c.id === calId) || calId === 'primary'
            ? calId
            : list[0]?.id || 'primary';
        if (resolvedId !== calId) setSelectedCalendarId(resolvedId);

        const now = new Date();
        const horizon = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const ev = await listCalendarEvents(
          token,
          resolvedId,
          now.toISOString(),
          horizon.toISOString(),
          25
        );
        setEvents(ev);
      } catch (err) {
        setErrorMsg(
          err instanceof Error ? err.message : 'Unable to load Google Calendar.'
        );
      } finally {
        setLoadingCal(false);
      }
    },
    [selectedCalendarId]
  );

  const loadSheetTabRows = useCallback(
    async (token: string, spreadsheetId: string, tabTitle: string) => {
      if (!spreadsheetId || !tabTitle) return;
      setLoadingSheets(true);
      setErrorMsg('');
      try {
        const values = await readSheetValues(token, spreadsheetId, tabTitle, 'A1:T50');
        setSheetRows(values);
      } catch (err) {
        setErrorMsg(
          err instanceof Error ? err.message : 'Unable to read Google Sheet rows.'
        );
      } finally {
        setLoadingSheets(false);
      }
    },
    []
  );

  const loadSpreadsheetMeta = useCallback(
    async (token: string, spreadsheetId: string, preferredTab?: string) => {
      if (!spreadsheetId) return;
      setLoadingSheets(true);
      setErrorMsg('');
      try {
        const details = await getSpreadsheetDetails(token, spreadsheetId);
        setSpreadsheetDetails(details);
        const targetTab =
          (preferredTab &&
            details.sheets.find((s) => s.title === preferredTab)?.title) ||
          details.sheets[0]?.title ||
          '';
        setSelectedTabTitle(targetTab);
        if (targetTab) {
          const rows = await readSheetValues(token, spreadsheetId, targetTab, 'A1:T50');
          setSheetRows(rows);
        } else {
          setSheetRows([]);
        }
      } catch (err) {
        setErrorMsg(
          err instanceof Error ? err.message : 'Unable to load spreadsheet metadata.'
        );
      } finally {
        setLoadingSheets(false);
      }
    },
    []
  );

  const loadSheetsList = useCallback(
    async (token: string) => {
      setLoadingSheets(true);
      setErrorMsg('');
      try {
        const files = await listDriveSpreadsheets(token, 25);
        setSpreadsheets(files);
        if (files.length > 0 && !selectedSpreadsheetId) {
          setSelectedSpreadsheetId(files[0].id);
          await loadSpreadsheetMeta(token, files[0].id);
        }
      } catch (err) {
        setErrorMsg(
          err instanceof Error ? err.message : 'Unable to list Google Sheets from Drive.'
        );
      } finally {
        setLoadingSheets(false);
      }
    },
    [loadSpreadsheetMeta, selectedSpreadsheetId]
  );

  useEffect(() => {
    const unsub = initWorkspaceAuth(
      (authedUser, token) => {
        setUser(authedUser);
        setAccessToken(token);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setNeedsAuth(true);
      }
    );
    return unsub;
  }, []);

  const handleSignIn = async () => {
    setSigningIn(true);
    setErrorMsg('');
    setStatusMsg('');
    try {
      const result = await signInWithGoogleWorkspace();
      setUser(result.user);
      setAccessToken(result.accessToken);
      setNeedsAuth(false);
      setStatusMsg(
        `Connected Google Account (${result.user.email || result.user.displayName || 'Authorized'}).`
      );
      await Promise.all([
        loadCalendarWorkspace(result.accessToken, 'primary'),
        loadSheetsList(result.accessToken),
      ]);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Google Workspace sign-in cancelled or failed.'
      );
    } finally {
      setSigningIn(false);
    }
  };

  const handleDisconnect = async () => {
    await logoutWorkspaceGoogle();
    setAccessToken(null);
    setUser(null);
    setNeedsAuth(true);
    setCalendars([]);
    setEvents([]);
    setSpreadsheets([]);
    setSpreadsheetDetails(null);
    setSheetRows([]);
    setStatusMsg('Disconnected Google Workspace session.');
  };

  const requireValidToken = async (): Promise<string | null> => {
    const memToken = accessToken || (await getWorkspaceAccessToken());
    if (!memToken) {
      setNeedsAuth(true);
      setErrorMsg('Please sign in with Google to authorize this Workspace operation.');
      return null;
    }
    return memToken;
  };

  const confirmAndRun = async () => {
    if (!pendingAction) return;
    const token = await requireValidToken();
    if (!token) {
      setPendingAction(null);
      return;
    }
    setExecutingMutation(true);
    setErrorMsg('');
    setStatusMsg('');
    try {
      await pendingAction.execute(token);
      setPendingAction(null);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Google Workspace operation failed.'
      );
    } finally {
      setExecutingMutation(false);
    }
  };

  const requestCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventDate) return;
    const startIso = `${newEventDate}T${newEventStart}:00+05:30`;
    const endIso = `${newEventDate}T${newEventEnd}:00+05:30`;

    setPendingAction({
      subtitle: 'GOOGLE CALENDAR CONFIRMATION',
      title: 'Create Calendar Event?',
      description: `Create "${newEventTitle.trim()}" on ${newEventDate} (${newEventStart}–${newEventEnd} IST) in calendar "${
        calendars.find((c) => c.id === selectedCalendarId)?.summary || selectedCalendarId
      }"?`,
      confirmLabel: 'Confirm & Create Event',
      execute: async (token) => {
        await createCalendarEvent(token, selectedCalendarId, {
          summary: newEventTitle.trim(),
          description: newEventNotes.trim(),
          startDateTime: startIso,
          endDateTime: endIso,
          timeZone: 'Asia/Kolkata',
        });
        setNewEventNotes('');
        setStatusMsg(`Created Google Calendar event "${newEventTitle.trim()}".`);
        await loadCalendarWorkspace(token, selectedCalendarId);
      },
    });
  };

  const requestSyncAppointmentToCalendar = (appt: AppointmentRecord) => {
    const startIso = `${appt.appointmentDate}T${appt.startTime}:00+05:30`;
    const endIso = `${appt.appointmentDate}T${appt.endTime}:00+05:30`;
    setPendingAction({
      subtitle: 'GOOGLE CALENDAR SYNC',
      title: `Add ${appt.bookingId} to Google Calendar?`,
      description: `Create a Google Calendar consultation event for ${appt.customerName} (${appt.consultationTopic}) on ${appt.appointmentDate} from ${appt.startTime} to ${appt.endTime} IST and invite ${appt.email}?`,
      confirmLabel: 'Create Calendar Event',
      execute: async (token) => {
        await createCalendarEvent(token, selectedCalendarId, {
          summary: `AKYIN Advisory: ${appt.customerName} (${appt.bookingId})`,
          description: `Topic: ${appt.consultationTopic}\nBusiness: ${
            appt.businessName || 'N/A'
          }\nPhone: ${appt.phone}\nChallenge: ${appt.businessChallenge || 'N/A'}`,
          startDateTime: startIso,
          endDateTime: endIso,
          timeZone: 'Asia/Kolkata',
          attendeeEmails: appt.email ? [appt.email] : [],
        });
        setStatusMsg(`Synced appointment ${appt.bookingId} to Google Calendar.`);
        await loadCalendarWorkspace(token, selectedCalendarId);
      },
    });
  };

  const requestUpdateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    setPendingAction({
      subtitle: 'GOOGLE CALENDAR UPDATE',
      title: 'Update Calendar Event?',
      description: `Update event "${editingEvent.summary || 'Untitled Event'}" in Google Calendar with title "${editEventTitle.trim()}"?`,
      confirmLabel: 'Save Event Changes',
      execute: async (token) => {
        await updateCalendarEvent(token, selectedCalendarId, editingEvent.id, {
          summary: editEventTitle.trim(),
          description: editEventNotes,
        });
        setEditingEvent(null);
        setStatusMsg(`Updated Google Calendar event "${editEventTitle.trim()}".`);
        await loadCalendarWorkspace(token, selectedCalendarId);
      },
    });
  };

  const requestDeleteEvent = (ev: WorkspaceCalendarEvent) => {
    setPendingAction({
      subtitle: 'GOOGLE CALENDAR REMOVAL',
      title: 'Delete Calendar Event?',
      description: `Are you sure you want to permanently remove "${
        ev.summary || 'Untitled Event'
      }" from Google Calendar? This action cannot be undone.`,
      confirmLabel: 'Delete Event',
      destructive: true,
      execute: async (token) => {
        await deleteCalendarEvent(token, selectedCalendarId, ev.id);
        setStatusMsg(`Deleted event "${ev.summary || ev.id}" from Google Calendar.`);
        await loadCalendarWorkspace(token, selectedCalendarId);
      },
    });
  };

  const requestCreateAkyinSheet = () => {
    setPendingAction({
      subtitle: 'GOOGLE SHEETS CREATION',
      title: 'Create New AKYIN Operations Spreadsheet?',
      description:
        'Create a new Google Sheet named "AKYIN Ventures Operations Ledger" in your Google Drive with Appointments, Enquiries, Availability, BlockedDates, WebsiteSettings, Ventures, and AdminLogs tabs?',
      confirmLabel: 'Create Spreadsheet',
      execute: async (token) => {
        const created = await createAkyinOperationsSpreadsheet(token);
        setSelectedSpreadsheetId(created.spreadsheetId);
        setSpreadsheetDetails(created);
        setSelectedTabTitle(created.sheets[0]?.title || 'Appointments');
        setStatusMsg(`Created "${created.title}" in Google Sheets.`);
        await loadSheetsList(token);
        await loadSpreadsheetMeta(token, created.spreadsheetId, 'Appointments');
      },
    });
  };

  const requestSyncRowsToSheet = (targetType: 'appointments' | 'enquiries') => {
    if (!spreadsheetDetails || !selectedTabTitle) return;
    const rows =
      targetType === 'appointments'
        ? appointments.map(appointmentToSheetRow)
        : enquiries.map(enquiryToSheetRow);
    if (rows.length === 0) {
      setErrorMsg(`No ${targetType} records available to append.`);
      return;
    }

    setPendingAction({
      subtitle: 'GOOGLE SHEETS APPEND CONFIRMATION',
      title: `Append ${rows.length} ${targetType} row(s) to "${selectedTabTitle}"?`,
      description: `Write ${rows.length} ${targetType} record(s) into spreadsheet "${spreadsheetDetails.title}" (tab: "${selectedTabTitle}")? Existing rows in the sheet remain intact.`,
      confirmLabel: `Append ${rows.length} Row(s)`,
      execute: async (token) => {
        const res = await appendSheetValues(
          token,
          spreadsheetDetails.spreadsheetId,
          selectedTabTitle,
          rows
        );
        setStatusMsg(
          `Appended ${res.updatedRows} row(s) to "${selectedTabTitle}" in ${spreadsheetDetails.title}.`
        );
        await loadSheetTabRows(
          token,
          spreadsheetDetails.spreadsheetId,
          selectedTabTitle
        );
      },
    });
  };

  const requestAppendCustomRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spreadsheetDetails || !selectedTabTitle || !customRowValues.trim()) return;
    const cells = customRowValues.split(',').map((c) => c.trim());
    setPendingAction({
      subtitle: 'GOOGLE SHEETS ROW APPEND',
      title: `Append 1 custom row to "${selectedTabTitle}"?`,
      description: `Append [${cells.join(' | ')}] into spreadsheet "${spreadsheetDetails.title}", tab "${selectedTabTitle}"?`,
      confirmLabel: 'Append Row',
      execute: async (token) => {
        await appendSheetValues(
          token,
          spreadsheetDetails.spreadsheetId,
          selectedTabTitle,
          [cells]
        );
        setCustomRowValues('');
        setStatusMsg(`Appended 1 row to "${selectedTabTitle}".`);
        await loadSheetTabRows(
          token,
          spreadsheetDetails.spreadsheetId,
          selectedTabTitle
        );
      },
    });
  };

  const inputCls =
    'w-full rounded-xl border border-[#E8E8ED] bg-[#FFFFFF] px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/15';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F]">
            Google Calendar &amp; Google Sheets Workspace
          </h2>
          <p className="text-xs text-[#6E6E73] mt-0.5">
            Direct Google Workspace authorization via Firebase OAuth (in-memory token only) to read and manage Calendar events and Sheets ledgers.
          </p>
        </div>

        {!needsAuth && user && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="liquid-glass-panel rounded-full px-3.5 py-1.5 text-xs font-semibold text-[#1D1D1F]">
              {user.email || user.displayName || 'Google Account Connected'}
            </span>
            <GlassButton variant="subtle" size="sm" onClick={handleDisconnect}>
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Disconnect Google</span>
            </GlassButton>
          </div>
        )}
      </div>

      {statusMsg && (
        <div className="rounded-2xl liquid-glass-panel px-4 py-3 text-xs font-semibold text-[#1D1D1F] flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
          <span>{statusMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-2xl bg-[#FEF3F2] border border-[#FECDCA] px-4 py-3 text-xs font-semibold text-[#B42318] flex items-start gap-2">
          <AlertTriangle
            className="w-4 h-4 text-[#D92D20] shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <span>{errorMsg}</span>
        </div>
      )}

      {needsAuth ? (
        <div className="liquid-glass-card rounded-3xl p-8 sm:p-10 text-center space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-[#FFFFFF] border border-[#E8E8ED] text-[#1D1D1F] flex items-center justify-center mx-auto shadow-xs">
            <Calendar className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="max-w-lg mx-auto space-y-2">
            <h3 className="font-display text-xl font-bold text-[#1D1D1F]">
              Connect Your Google Calendar &amp; Google Sheets
            </h3>
            <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed">
              Sign in with Google to browse your calendars, schedule or modify Business Advisory events, and inspect or sync live Google Sheets spreadsheets. Access tokens remain strictly in browser memory during this session.
            </p>
          </div>
          <div className="flex justify-center pt-1">
            <GoogleSignInButton onClick={handleSignIn} loading={signingIn} />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Switcher */}
          <div className="inline-flex rounded-full liquid-glass-panel p-1 gap-1">
            <button
              type="button"
              onClick={() => setActiveTool('calendar')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTool === 'calendar'
                  ? 'liquid-glass-pill-dark text-white'
                  : 'text-[#1D1D1F] hover:bg-[#FFFFFF]/70'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Google Calendar</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTool('sheets')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTool === 'sheets'
                  ? 'liquid-glass-pill-dark text-white'
                  : 'text-[#1D1D1F] hover:bg-[#FFFFFF]/70'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Google Sheets</span>
            </button>
          </div>

          {activeTool === 'calendar' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: Create Event & Sync Appointments */}
              <div className="lg:col-span-5 space-y-5">
                <div className="liquid-glass-card rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-base font-bold text-[#1D1D1F]">
                      Select Calendar &amp; Schedule Event
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        accessToken &&
                        void loadCalendarWorkspace(accessToken, selectedCalendarId)
                      }
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                      Refresh
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                      Active Google Calendar
                    </label>
                    <select
                      value={selectedCalendarId}
                      onChange={(e) => {
                        const nextId = e.target.value;
                        setSelectedCalendarId(nextId);
                        if (accessToken) {
                          void loadCalendarWorkspace(accessToken, nextId);
                        }
                      }}
                      className={inputCls}
                    >
                      {calendars.length === 0 ? (
                        <option value="primary">Primary Calendar</option>
                      ) : (
                        calendars.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.summary} {c.primary ? '(Primary)' : ''}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <form onSubmit={requestCreateEvent} className="space-y-3 pt-2 border-t border-[#E8E8ED]">
                    <div>
                      <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                        Event Title
                      </label>
                      <input
                        required
                        value={newEventTitle}
                        onChange={(e) => setNewEventTitle(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                          Date (IST)
                        </label>
                        <input
                          type="date"
                          required
                          value={newEventDate}
                          onChange={(e) => setNewEventDate(e.target.value)}
                          className={`${inputCls} font-mono-num`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                          Start
                        </label>
                        <input
                          type="time"
                          required
                          value={newEventStart}
                          onChange={(e) => setNewEventStart(e.target.value)}
                          className={`${inputCls} font-mono-num`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                          End
                        </label>
                        <input
                          type="time"
                          required
                          value={newEventEnd}
                          onChange={(e) => setNewEventEnd(e.target.value)}
                          className={`${inputCls} font-mono-num`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                        Event Agenda / Notes
                      </label>
                      <textarea
                        rows={2}
                        value={newEventNotes}
                        onChange={(e) => setNewEventNotes(e.target.value)}
                        placeholder="Consultation agenda, dial-in notes..."
                        className={inputCls}
                      />
                    </div>
                    <GlassButton type="submit" variant="primary" size="sm" className="w-full">
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Schedule in Google Calendar</span>
                    </GlassButton>
                  </form>
                </div>

                {appointments.length > 0 && (
                  <div className="liquid-glass-card rounded-3xl p-6 space-y-3">
                    <h3 className="font-display text-sm font-bold text-[#1D1D1F]">
                      Quick-Sync Advisory Requests to Calendar
                    </h3>
                    <ul className="divide-y divide-[#E8E8ED] text-xs">
                      {appointments.slice(0, 5).map((a) => (
                        <li
                          key={a.bookingId}
                          className="py-2.5 flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <p className="font-semibold text-[#1D1D1F] truncate">
                              {a.customerName} ({a.bookingId})
                            </p>
                            <p className="font-mono-num text-[11px] text-[#6E6E73]">
                              {a.appointmentDate} · {a.startTime}–{a.endTime} IST
                            </p>
                          </div>
                          <GlassButton
                            variant="subtle"
                            size="sm"
                            onClick={() => requestSyncAppointmentToCalendar(a)}
                          >
                            Sync Event
                          </GlassButton>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right: Live Events List */}
              <div className="lg:col-span-7 liquid-glass-card rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-[#1D1D1F]">
                    Upcoming Calendar Events (Next 30 Days)
                  </h3>
                  <span className="font-mono-num text-xs text-[#6E6E73]">
                    {events.length} events
                  </span>
                </div>

                {loadingCal ? (
                  <p className="text-xs text-[#6E6E73] py-6">Loading Google Calendar events...</p>
                ) : events.length === 0 ? (
                  <p className="text-xs text-[#6E6E73] py-6">
                    No upcoming events found in this calendar window.
                  </p>
                ) : (
                  <ul className="divide-y divide-[#E8E8ED] text-xs">
                    {events.map((ev) => (
                      <li
                        key={ev.id}
                        className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0">
                          <p className="font-semibold text-[#1D1D1F]">
                            {ev.summary || '(No Title)'}
                          </p>
                          <p className="font-mono-num text-[11px] text-[#6E6E73]">
                            {ev.start.dateTime || ev.start.date} →{' '}
                            {ev.end.dateTime || ev.end.date}
                          </p>
                          {ev.description && (
                            <p className="text-[11px] text-[#6E6E73] line-clamp-2">
                              {ev.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {ev.htmlLink && (
                            <a
                              href={sanitizeHref(ev.htmlLink, '#')}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E8E8ED] bg-[#FFFFFF]/80 text-[11px] font-semibold text-[#1D1D1F] hover:border-[#1D1D1F]"
                            >
                              Open
                              <ExternalLink className="w-3 h-3" aria-hidden="true" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingEvent(ev);
                              setEditEventTitle(ev.summary || '');
                              setEditEventNotes(ev.description || '');
                            }}
                            className="px-2.5 py-1.5 rounded-lg border border-[#E8E8ED] bg-[#FFFFFF]/80 text-[11px] font-semibold text-[#1D1D1F] hover:border-[#1D1D1F] cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => requestDeleteEvent(ev)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E8E8ED] bg-[#FFFFFF]/80 text-[11px] font-semibold text-[#B42318] hover:border-[#D92D20] cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3 text-[#D92D20]" aria-hidden="true" />
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {activeTool === 'sheets' && (
            <div className="space-y-6">
              <div className="liquid-glass-card rounded-3xl p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 text-sm font-bold text-[#1D1D1F]">
                    <FolderOpen className="w-4 h-4" aria-hidden="true" />
                    <span>Select or Create a Google Spreadsheet</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <GlassButton
                      variant="subtle"
                      size="sm"
                      onClick={() => accessToken && void loadSheetsList(accessToken)}
                    >
                      <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Refresh Drive List</span>
                    </GlassButton>
                    <GlassButton
                      variant="primary"
                      size="sm"
                      onClick={requestCreateAkyinSheet}
                    >
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Create AKYIN Operations Sheet</span>
                    </GlassButton>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                      Spreadsheets in Google Drive
                    </label>
                    <select
                      value={selectedSpreadsheetId}
                      onChange={(e) => {
                        const id = e.target.value;
                        setSelectedSpreadsheetId(id);
                        if (accessToken && id) {
                          void loadSpreadsheetMeta(accessToken, id);
                        }
                      }}
                      className={inputCls}
                    >
                      {spreadsheets.length === 0 ? (
                        <option value="">No spreadsheets listed — create one or paste an ID</option>
                      ) : (
                        spreadsheets.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                      Sheet Tabs ({spreadsheetDetails?.sheets.length || 0} discovered)
                    </label>
                    <select
                      value={selectedTabTitle}
                      onChange={(e) => {
                        const tab = e.target.value;
                        setSelectedTabTitle(tab);
                        if (accessToken && selectedSpreadsheetId && tab) {
                          void loadSheetTabRows(accessToken, selectedSpreadsheetId, tab);
                        }
                      }}
                      className={inputCls}
                      disabled={!spreadsheetDetails}
                    >
                      {(spreadsheetDetails?.sheets || []).map((tab) => (
                        <option key={tab.sheetId} value={tab.title}>
                          {tab.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {spreadsheetDetails && (
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E8E8ED] text-xs">
                    <div className="flex items-center gap-2 text-[#6E6E73]">
                      <TableProperties className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
                      <span>
                        Active Sheet:{' '}
                        <strong className="text-[#1D1D1F]">{spreadsheetDetails.title}</strong> ·
                        Tab: <strong className="text-[#1D1D1F]">{selectedTabTitle}</strong>
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {spreadsheetDetails.spreadsheetUrl && (
                        <a
                          href={sanitizeHref(spreadsheetDetails.spreadsheetUrl, '#')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#E8E8ED] bg-[#FFFFFF]/80 font-semibold text-[#1D1D1F] hover:border-[#1D1D1F]"
                        >
                          Open in Google Sheets
                          <ExternalLink className="w-3 h-3" aria-hidden="true" />
                        </a>
                      )}
                      <GlassButton
                        variant="subtle"
                        size="sm"
                        onClick={() => requestSyncRowsToSheet('appointments')}
                      >
                        Append Appointments ({appointments.length})
                      </GlassButton>
                      <GlassButton
                        variant="subtle"
                        size="sm"
                        onClick={() => requestSyncRowsToSheet('enquiries')}
                      >
                        Append Enquiries ({enquiries.length})
                      </GlassButton>
                    </div>
                  </div>
                )}
              </div>

              {spreadsheetDetails && (
                <div className="liquid-glass-card rounded-3xl p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-display text-base font-bold text-[#1D1D1F]">
                      Live Sheet Data: {selectedTabTitle}
                    </h3>
                    <form
                      onSubmit={requestAppendCustomRow}
                      className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto"
                    >
                      <input
                        type="text"
                        value={customRowValues}
                        onChange={(e) => setCustomRowValues(e.target.value)}
                        placeholder="Comma-separated row cells to append..."
                        className="sm:w-72 rounded-xl border border-[#E8E8ED] bg-[#FFFFFF] px-3 py-1.5 text-xs text-[#1D1D1F] focus:outline-none focus:border-[#1D1D1F]"
                      />
                      <GlassButton type="submit" variant="primary" size="sm">
                        Append Row
                      </GlassButton>
                    </form>
                  </div>

                  {loadingSheets ? (
                    <p className="text-xs text-[#6E6E73] py-6">Reading Google Sheet rows...</p>
                  ) : sheetRows.length === 0 ? (
                    <p className="text-xs text-[#6E6E73] py-6">
                      This tab currently has no populated cells in range A1:T50.
                    </p>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-[#E8E8ED] bg-[#FFFFFF]">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#F5F5F7] border-b border-[#E8E8ED] text-[#1D1D1F] font-semibold">
                            {sheetRows[0].map((cell, colIdx) => (
                              <th key={colIdx} className="py-2.5 px-3 whitespace-nowrap">
                                {cell || `Col ${colIdx + 1}`}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8E8ED]">
                          {sheetRows.slice(1).map((row, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-[#F5F5F7]/60">
                              {sheetRows[0].map((_, colIdx) => (
                                <td
                                  key={colIdx}
                                  className="py-2 px-3 text-[#1D1D1F] whitespace-nowrap max-w-[240px] truncate"
                                >
                                  {row[colIdx] || ''}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Edit Event Modal */}
      <GlassModal
        open={Boolean(editingEvent)}
        onClose={() => setEditingEvent(null)}
        subtitle="EDIT CALENDAR EVENT"
        title="Modify Google Calendar Event"
      >
        {editingEvent && (
          <form onSubmit={requestUpdateEvent} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Event Title</label>
              <input
                required
                value={editEventTitle}
                onChange={(e) => setEditEventTitle(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Description</label>
              <textarea
                rows={3}
                value={editEventNotes}
                onChange={(e) => setEditEventNotes(e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <GlassButton
                variant="subtle"
                size="sm"
                onClick={() => setEditingEvent(null)}
              >
                Cancel
              </GlassButton>
              <GlassButton type="submit" variant="primary" size="sm">
                Review &amp; Update
              </GlassButton>
            </div>
          </form>
        )}
      </GlassModal>

      {/* Mandatory Confirmation Dialog for Mutating / Destructive Google Workspace Operations */}
      <GlassModal
        open={Boolean(pendingAction)}
        onClose={() => !executingMutation && setPendingAction(null)}
        subtitle={pendingAction?.subtitle}
        title={pendingAction?.title || 'Confirm Google Workspace Action'}
      >
        {pendingAction && (
          <div className="space-y-5 text-sm">
            <p className="text-[#1D1D1F] leading-relaxed">{pendingAction.description}</p>
            <div className="flex justify-end gap-2.5 pt-2 border-t border-[#E8E8ED]">
              <GlassButton
                variant="subtle"
                size="sm"
                disabled={executingMutation}
                onClick={() => setPendingAction(null)}
              >
                Cancel
              </GlassButton>
              <button
                type="button"
                disabled={executingMutation}
                onClick={() => void confirmAndRun()}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-xs font-semibold transition-all cursor-pointer disabled:opacity-55 ${
                  pendingAction.destructive
                    ? 'bg-[#D92D20] hover:bg-[#B42318] text-white'
                    : 'liquid-glass-pill-dark text-white'
                }`}
              >
                {executingMutation ? 'Executing...' : pendingAction.confirmLabel}
              </button>
            </div>
          </div>
        )}
      </GlassModal>
    </div>
  );
}
