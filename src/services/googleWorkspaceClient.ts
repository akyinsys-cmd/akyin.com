import { AppointmentRecord, EnquiryRecord } from '../types/advisory';

export interface WorkspaceCalendarItem {
  id: string;
  summary: string;
  primary?: boolean;
  timeZone?: string;
  accessRole?: string;
}

export interface WorkspaceCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  htmlLink?: string;
  status?: string;
  start: { dateTime?: string; date?: string; timeZone?: string };
  end: { dateTime?: string; date?: string; timeZone?: string };
}

export interface WorkspaceFreeBusyInterval {
  start: string;
  end: string;
}

export interface WorkspaceSpreadsheetFile {
  id: string;
  name: string;
  modifiedTime?: string;
  webViewLink?: string;
}

export interface WorkspaceSheetTab {
  sheetId: number;
  title: string;
  rowCount: number;
  columnCount: number;
}

export interface WorkspaceSpreadsheetDetails {
  spreadsheetId: string;
  title: string;
  spreadsheetUrl: string;
  sheets: WorkspaceSheetTab[];
}

interface GoogleErrorShape {
  error?: {
    message?: string;
    code?: number;
  };
}

async function googleFetchJson<T>(
  url: string,
  token: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers || {}),
    },
  });

  if (res.status === 204) {
    return {} as T;
  }

  const data = (await res.json().catch(() => ({}))) as T & GoogleErrorShape;
  if (!res.ok) {
    const msg =
      data?.error?.message ||
      `Google Workspace API request failed (${res.status}).`;
    throw new Error(msg);
  }
  return data;
}

/**
 * Google Calendar REST API (v3)
 */
export async function listUserCalendars(
  token: string
): Promise<WorkspaceCalendarItem[]> {
  const data = await googleFetchJson<{ items?: WorkspaceCalendarItem[] }>(
    'https://www.googleapis.com/calendar/v3/users/me/calendarList?minAccessRole=reader',
    token
  );
  return data.items || [];
}

export async function listCalendarEvents(
  token: string,
  calendarId = 'primary',
  timeMinIso?: string,
  timeMaxIso?: string,
  maxResults = 20
): Promise<WorkspaceCalendarEvent[]> {
  const params = new URLSearchParams({
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: String(maxResults),
  });
  if (timeMinIso) params.set('timeMin', timeMinIso);
  if (timeMaxIso) params.set('timeMax', timeMaxIso);

  const data = await googleFetchJson<{ items?: WorkspaceCalendarEvent[] }>(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId
    )}/events?${params.toString()}`,
    token
  );
  return data.items || [];
}

export async function queryCalendarFreeBusy(
  token: string,
  calendarIds: string[],
  timeMinIso: string,
  timeMaxIso: string
): Promise<WorkspaceFreeBusyInterval[]> {
  const data = await googleFetchJson<{
    calendars?: Record<string, { busy?: WorkspaceFreeBusyInterval[] }>;
  }>('https://www.googleapis.com/calendar/v3/freeBusy', token, {
    method: 'POST',
    body: JSON.stringify({
      timeMin: timeMinIso,
      timeMax: timeMaxIso,
      timeZone: 'Asia/Kolkata',
      items: calendarIds.map((id) => ({ id })),
    }),
  });

  const busy: WorkspaceFreeBusyInterval[] = [];
  Object.values(data.calendars || {}).forEach((entry) => {
    if (Array.isArray(entry.busy)) {
      busy.push(...entry.busy);
    }
  });
  return busy;
}

export async function createCalendarEvent(
  token: string,
  calendarId: string,
  event: {
    summary: string;
    description?: string;
    location?: string;
    startDateTime: string;
    endDateTime: string;
    timeZone?: string;
    attendeeEmails?: string[];
  }
): Promise<WorkspaceCalendarEvent> {
  const tz = event.timeZone || 'Asia/Kolkata';
  return googleFetchJson<WorkspaceCalendarEvent>(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId
    )}/events`,
    token,
    {
      method: 'POST',
      body: JSON.stringify({
        summary: event.summary,
        description: event.description || '',
        location: event.location || 'Google Meet / Phone Consultation (IST)',
        start: { dateTime: event.startDateTime, timeZone: tz },
        end: { dateTime: event.endDateTime, timeZone: tz },
        attendees: (event.attendeeEmails || [])
          .filter(Boolean)
          .map((email) => ({ email })),
      }),
    }
  );
}

export async function updateCalendarEvent(
  token: string,
  calendarId: string,
  eventId: string,
  patch: {
    summary?: string;
    description?: string;
    startDateTime?: string;
    endDateTime?: string;
    timeZone?: string;
  }
): Promise<WorkspaceCalendarEvent> {
  const tz = patch.timeZone || 'Asia/Kolkata';
  const body: Record<string, unknown> = {};
  if (patch.summary !== undefined) body.summary = patch.summary;
  if (patch.description !== undefined) body.description = patch.description;
  if (patch.startDateTime) {
    body.start = { dateTime: patch.startDateTime, timeZone: tz };
  }
  if (patch.endDateTime) {
    body.end = { dateTime: patch.endDateTime, timeZone: tz };
  }

  return googleFetchJson<WorkspaceCalendarEvent>(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId
    )}/events/${encodeURIComponent(eventId)}`,
    token,
    {
      method: 'PATCH',
      body: JSON.stringify(body),
    }
  );
}

export async function deleteCalendarEvent(
  token: string,
  calendarId: string,
  eventId: string
): Promise<void> {
  await googleFetchJson<Record<string, never>>(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId
    )}/events/${encodeURIComponent(eventId)}`,
    token,
    { method: 'DELETE' }
  );
}

/**
 * Google Drive & Google Sheets REST APIs (v3 / v4)
 */
export async function listDriveSpreadsheets(
  token: string,
  pageSize = 25
): Promise<WorkspaceSpreadsheetFile[]> {
  const params = new URLSearchParams({
    q: "mimeType='application/vnd.google-apps.spreadsheet' and trashed=false",
    fields: 'files(id,name,modifiedTime,webViewLink)',
    orderBy: 'modifiedTime desc',
    pageSize: String(pageSize),
  });

  const data = await googleFetchJson<{ files?: WorkspaceSpreadsheetFile[] }>(
    `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
    token
  );
  return data.files || [];
}

export async function getSpreadsheetDetails(
  token: string,
  spreadsheetId: string
): Promise<WorkspaceSpreadsheetDetails> {
  const data = await googleFetchJson<{
    spreadsheetId: string;
    spreadsheetUrl?: string;
    properties?: { title?: string };
    sheets?: Array<{
      properties?: {
        sheetId?: number;
        title?: string;
        gridProperties?: { rowCount?: number; columnCount?: number };
      };
    }>;
  }>(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      spreadsheetId
    )}?fields=spreadsheetId,spreadsheetUrl,properties.title,sheets.properties(sheetId,title,gridProperties)`,
    token
  );

  return {
    spreadsheetId: data.spreadsheetId,
    title: data.properties?.title || 'Untitled Spreadsheet',
    spreadsheetUrl: data.spreadsheetUrl || '',
    sheets: (data.sheets || []).map((s) => ({
      sheetId: s.properties?.sheetId ?? 0,
      title: s.properties?.title || 'Sheet',
      rowCount: s.properties?.gridProperties?.rowCount ?? 1000,
      columnCount: s.properties?.gridProperties?.columnCount ?? 26,
    })),
  };
}

function escapeSheetNameForA1(sheetTitle: string): string {
  return `'${sheetTitle.replace(/'/g, "''")}'`;
}

export async function readSheetValues(
  token: string,
  spreadsheetId: string,
  sheetTitle: string,
  rangeSuffix = 'A1:Z100'
): Promise<string[][]> {
  const range = `${escapeSheetNameForA1(sheetTitle)}!${rangeSuffix}`;
  const data = await googleFetchJson<{ values?: string[][] }>(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      spreadsheetId
    )}/values/${encodeURIComponent(range)}`,
    token
  );
  return data.values || [];
}

export async function appendSheetValues(
  token: string,
  spreadsheetId: string,
  sheetTitle: string,
  rows: string[][]
): Promise<{ updatedRows: number }> {
  const range = `${escapeSheetNameForA1(sheetTitle)}!A1`;
  const data = await googleFetchJson<{
    updates?: { updatedRows?: number };
  }>(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      spreadsheetId
    )}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    token,
    {
      method: 'POST',
      body: JSON.stringify({ values: rows }),
    }
  );
  return { updatedRows: data.updates?.updatedRows ?? rows.length };
}

export async function updateSheetValues(
  token: string,
  spreadsheetId: string,
  sheetTitle: string,
  rangeSuffix: string,
  rows: string[][]
): Promise<{ updatedRows: number }> {
  const range = `${escapeSheetNameForA1(sheetTitle)}!${rangeSuffix}`;
  const data = await googleFetchJson<{ updatedRows?: number }>(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      spreadsheetId
    )}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
    token,
    {
      method: 'PUT',
      body: JSON.stringify({ values: rows }),
    }
  );
  return { updatedRows: data.updatedRows ?? rows.length };
}

export async function createAkyinOperationsSpreadsheet(
  token: string,
  title = 'AKYIN Ventures Operations Ledger'
): Promise<WorkspaceSpreadsheetDetails> {
  const created = await googleFetchJson<{
    spreadsheetId: string;
    spreadsheetUrl?: string;
    properties?: { title?: string };
    sheets?: Array<{
      properties?: {
        sheetId?: number;
        title?: string;
        gridProperties?: { rowCount?: number; columnCount?: number };
      };
    }>;
  }>('https://sheets.googleapis.com/v4/spreadsheets', token, {
    method: 'POST',
    body: JSON.stringify({
      properties: { title, timeZone: 'Asia/Kolkata' },
      sheets: [
        { properties: { title: 'Appointments' } },
        { properties: { title: 'Enquiries' } },
        { properties: { title: 'Availability' } },
        { properties: { title: 'BlockedDates' } },
        { properties: { title: 'WebsiteSettings' } },
        { properties: { title: 'Ventures' } },
        { properties: { title: 'AdminLogs' } },
      ],
    }),
  });

  const id = created.spreadsheetId;

  await Promise.all([
    updateSheetValues(token, id, 'Appointments', 'A1:T1', [
      [
        'BookingID',
        'CreatedAt',
        'CustomerName',
        'Phone',
        'Email',
        'City',
        'Country',
        'BusinessName',
        'Website',
        'BusinessStage',
        'ConsultationTopic',
        'BusinessChallenge',
        'AppointmentDate',
        'StartTime',
        'EndTime',
        'PaymentStatus',
        'BookingStatus',
        'AdminNotes',
        'CalendarEventID',
        'UpdatedAt',
      ],
    ]),
    updateSheetValues(token, id, 'Enquiries', 'A1:L1', [
      [
        'EnquiryID',
        'CreatedAt',
        'Name',
        'Business',
        'Phone',
        'Email',
        'City',
        'Country',
        'Vertical',
        'EnquiryType',
        'Message',
        'Status',
      ],
    ]),
  ]);

  return getSpreadsheetDetails(token, id);
}

export function appointmentToSheetRow(a: AppointmentRecord): string[] {
  return [
    a.bookingId,
    a.createdAt,
    a.customerName,
    a.phone,
    a.email,
    a.city,
    a.country,
    a.businessName,
    a.website,
    a.businessStage,
    a.consultationTopic,
    a.businessChallenge,
    a.appointmentDate,
    a.startTime,
    a.endTime,
    a.paymentStatus,
    a.bookingStatus,
    a.adminNotes,
    a.calendarEventId,
    a.updatedAt,
  ];
}

export function enquiryToSheetRow(e: EnquiryRecord): string[] {
  return [
    e.enquiryId,
    e.createdAt,
    e.name,
    e.business,
    e.phone,
    e.email,
    e.city,
    e.country,
    e.vertical,
    e.enquiryType,
    e.message,
    e.enquiryStatus,
  ];
}
