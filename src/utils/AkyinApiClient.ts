import { VENTURES_PORTFOLIO } from '../data/akyinData';
import {
  AdminDashboardData,
  AdminLogRecord,
  AdvisoryBookingInput,
  AppointmentRecord,
  AvailabilityRule,
  BlockedDateRecord,
  BookingConfirmationResult,
  DateAvailabilityResponse,
  DEFAULT_AVAILABILITY_RULES,
  DEFAULT_WEBSITE_SETTINGS,
  EnquiryRecord,
  EnquiryStatus,
  VentureConfigRecord,
  WebsiteSettingsMap,
} from '../types/advisory';
import {
  buildSlotIntervals,
  formatSlotRangeIst,
  getCurrentMinutesIst,
  getDayNameIst,
  getTodayIstDate,
  parseHmMinutes,
} from '../utils/advisoryHelpers';
import { isSafeExternalUrl, sanitizeTextInput } from '../utils/security';

const ENDPOINT_STORAGE_KEY = 'akyin_apps_script_url_v1';
const ADMIN_SESSION_STORAGE_KEY = 'akyin_admin_session_v1';
const PREVIEW_STORE_KEY = 'akyin_preview_db_v1';
const SESSION_TTL_MS = 30 * 60 * 1000;

export interface AdminSessionState {
  token: string;
  expiresAt: string;
}

export interface PublicBootstrapData {
  settings: WebsiteSettingsMap;
  ventures: VentureConfigRecord[];
  availability: AvailabilityRule[];
  blockedDates: string[];
  timezone: string;
  passwordConfigured: boolean;
  isLiveBackend: boolean;
}

interface PreviewStoreState {
  passwordHash: string;
  passwordSalt: string;
  activeToken: string;
  activeTokenExpiresAt: string;
  appointments: AppointmentRecord[];
  enquiries: EnquiryRecord[];
  availability: AvailabilityRule[];
  blockedDates: BlockedDateRecord[];
  settings: WebsiteSettingsMap;
  ventures: VentureConfigRecord[];
  logs: AdminLogRecord[];
}

interface AppsScriptEnvelope<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

/**
 * AkyinApiClient
 * Handles CORS-safe GET and text/plain JSON POST communication with Google Apps Script,
 * short-lived expiring session token management, and preview-mode fallback when unconfigured.
 */
export class AkyinApiClient {
  private readonly defaultEndpointUrl: string;

  constructor(defaultEndpointUrl?: string) {
    const envUrl =
      typeof import.meta !== 'undefined' && import.meta.env
        ? String(import.meta.env.VITE_APPS_SCRIPT_URL || '').trim()
        : '';
    this.defaultEndpointUrl = (defaultEndpointUrl ?? envUrl).trim();
  }

  public getEndpointUrl(): string {
    const localUrl =
      typeof window !== 'undefined'
        ? String(window.localStorage.getItem(ENDPOINT_STORAGE_KEY) || '').trim()
        : '';
    const candidate = localUrl || this.defaultEndpointUrl;
    return candidate && isSafeExternalUrl(candidate, false) ? candidate : '';
  }

  public setEndpointUrl(url: string): void {
    if (typeof window === 'undefined') return;
    const clean = url.trim();
    if (!clean) {
      window.localStorage.removeItem(ENDPOINT_STORAGE_KEY);
      this.clearSession();
      return;
    }
    if (!isSafeExternalUrl(clean, false)) {
      throw new Error('Apps Script Web App URL must be a valid https:// address.');
    }
    window.localStorage.setItem(ENDPOINT_STORAGE_KEY, clean);
    this.clearSession();
  }

  public isLiveConnected(): boolean {
    return Boolean(this.getEndpointUrl());
  }

  public getStoredSession(): AdminSessionState | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<AdminSessionState>;
      if (
        typeof parsed.token !== 'string' ||
        parsed.token.length < 12 ||
        typeof parsed.expiresAt !== 'string'
      ) {
        this.clearSession();
        return null;
      }
      const expMs = Date.parse(parsed.expiresAt);
      if (!Number.isFinite(expMs) || expMs <= Date.now()) {
        this.clearSession();
        return null;
      }
      return { token: parsed.token, expiresAt: parsed.expiresAt };
    } catch {
      this.clearSession();
      return null;
    }
  }

  public saveSession(session: AdminSessionState): void {
    if (typeof window === 'undefined') return;
    if (!session?.token || !session?.expiresAt) return;
    window.localStorage.setItem(
      ADMIN_SESSION_STORAGE_KEY,
      JSON.stringify({
        token: session.token,
        expiresAt: session.expiresAt,
      })
    );
  }

  public clearSession(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
  }

  private static readonly REQUEST_TIMEOUT_MS = 20000;

  private async parseEnvelopeResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new Error(`Apps Script HTTP ${response.status}`);
    }

    const rawText = await response.text();
    let json: AppsScriptEnvelope<T>;
    try {
      json = JSON.parse(rawText) as AppsScriptEnvelope<T>;
    } catch {
      throw new Error(
        'Unexpected non-JSON response from Apps Script. Verify the Web App is deployed with "Who has access: Anyone".'
      );
    }

    if (!json || typeof json !== 'object' || !json.ok) {
      throw new Error(json?.error || 'Request failed.');
    }

    return json.data as T;
  }

  /**
   * CORS-safe GET using URL query parameters with no custom preflight headers.
   */
  private async requestGet<T>(
    action: string,
    params: Record<string, string> = {}
  ): Promise<T> {
    const baseUrl = this.getEndpointUrl();
    if (!baseUrl) {
      throw new Error('Apps Script Web App URL is not configured.');
    }

    const url = new URL(baseUrl);
    url.searchParams.set('action', action);
    Object.entries(params).forEach(([k, v]) => {
      url.searchParams.set(k, v);
    });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), AkyinApiClient.REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
      });
      return await this.parseEnvelopeResponse<T>(response);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('Google Apps Script request timed out. Please try again.');
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * CORS-safe POST using text/plain MIME type and JSON-serialized payload
   * so browsers send a simple request without an OPTIONS preflight failure on /exec.
   */
  private async requestPost<T>(payload: Record<string, unknown>): Promise<T> {
    const baseUrl = this.getEndpointUrl();
    if (!baseUrl) {
      throw new Error('Apps Script Web App URL is not configured.');
    }

    const serializedBody = JSON.stringify(payload);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), AkyinApiClient.REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: serializedBody,
        signal: controller.signal,
      });
      return await this.parseEnvelopeResponse<T>(response);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('Google Apps Script request timed out. Please try again.');
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  private requireToken(): string {
    const session = this.getStoredSession();
    if (!session?.token) {
      throw new Error('Admin session expired or missing. Please sign in.');
    }
    return session.token;
  }

  /**
   * Public Operations
   */
  public async fetchBootstrap(): Promise<PublicBootstrapData> {
    if (this.isLiveConnected()) {
      try {
        const data = await this.requestGet<Omit<PublicBootstrapData, 'isLiveBackend'>>(
          'bootstrap'
        );
        return {
          ...data,
          settings: { ...DEFAULT_WEBSITE_SETTINGS, ...(data.settings || {}) },
          isLiveBackend: true,
        };
      } catch {
        // Fallback safely to static defaults if network is temporarily unreachable
      }
    }

    const preview = this.loadPreviewStore();
    return {
      settings: preview.settings,
      ventures: preview.ventures.filter((v) => v.active),
      availability: preview.availability,
      blockedDates: preview.blockedDates.map((b) => b.date),
      timezone: 'Asia/Kolkata',
      passwordConfigured: Boolean(preview.passwordHash),
      isLiveBackend: false,
    };
  }

  public async fetchAvailability(dateStr: string): Promise<DateAvailabilityResponse> {
    const cleanDate = sanitizeTextInput(dateStr, 10, false);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanDate)) {
      throw new Error('Please choose a valid consultation date (YYYY-MM-DD).');
    }

    if (this.isLiveConnected()) {
      return this.requestGet<DateAvailabilityResponse>('availability', { date: cleanDate });
    }
    return this.computePreviewAvailability(this.loadPreviewStore(), cleanDate);
  }

  public async submitBooking(
    payload: AdvisoryBookingInput
  ): Promise<BookingConfirmationResult> {
    if (this.isLiveConnected()) {
      return this.requestPost<BookingConfirmationResult>({
        action: 'bookAppointment',
        payload,
      });
    }

    const preview = this.loadPreviewStore();
    const availability = this.computePreviewAvailability(preview, payload.appointmentDate);
    if (availability.blocked) {
      throw new Error(availability.reason || 'Selected date is unavailable.');
    }
    const slot = availability.slots.find(
      (s) => s.startTime === payload.startTime && s.endTime === payload.endTime
    );
    if (!slot || !slot.available) {
      throw new Error('The selected time slot is no longer available.');
    }

    const duplicate = preview.appointments.find(
      (a) =>
        a.bookingStatus !== 'Cancelled' &&
        a.appointmentDate === payload.appointmentDate &&
        a.startTime === payload.startTime &&
        (a.email.toLowerCase() === payload.email.toLowerCase() ||
          a.phone.replace(/\D/g, '') === payload.phone.replace(/\D/g, ''))
    );
    if (duplicate) {
      throw new Error(`A booking request for this slot already exists (${duplicate.bookingId}).`);
    }

    const bookingId = this.randomId('AKY');
    const nowStr = this.nowIstTimestamp();
    const record: AppointmentRecord = {
      bookingId,
      createdAt: nowStr,
      customerName: payload.customerName,
      phone: payload.phone,
      email: payload.email,
      city: payload.city,
      country: payload.country,
      businessName: payload.businessName,
      website: payload.website,
      businessStage: payload.businessStage,
      consultationTopic: payload.consultationTopic,
      businessChallenge: payload.businessChallenge,
      appointmentDate: payload.appointmentDate,
      startTime: payload.startTime,
      endTime: payload.endTime,
      paymentStatus: 'Payment Awaited',
      bookingStatus: 'Pending',
      adminNotes: '',
      calendarEventId: '',
      updatedAt: nowStr,
    };
    preview.appointments.unshift(record);
    this.savePreviewStore(preview);

    return {
      bookingId,
      bookingStatus: 'Pending',
      paymentStatus: 'Payment Awaited',
      slotLabel: formatSlotRangeIst(payload.startTime, payload.endTime),
      appointmentDate: payload.appointmentDate,
      startTime: payload.startTime,
      endTime: payload.endTime,
      calendarEventCreated: false,
      emailStatus: {
        customerNotified: false,
        adminNotified: false,
        error:
          'Local Preview Mode — connect your Google Apps Script Web App URL in /admin to send live emails and create Google Calendar events.',
      },
      confirmationNotice:
        'Your appointment request has been received. Our team will contact you to discuss the consultation and payment confirmation. Your appointment is not confirmed until AKYIN verifies payment.',
    };
  }

  public async submitEnquiry(payload: {
    name: string;
    company: string;
    phone: string;
    email: string;
    city: string;
    country: string;
    vertical: string;
    enquiryType: string;
    message: string;
  }): Promise<{ enquiryId: string; savedToLiveSheet: boolean }> {
    if (this.isLiveConnected()) {
      const res = await this.requestPost<{ enquiryId: string }>({
        action: 'submitEnquiry',
        payload,
      });
      return { enquiryId: res.enquiryId, savedToLiveSheet: true };
    }

    const preview = this.loadPreviewStore();
    const enquiryId = this.randomId('ENQ');
    preview.enquiries.unshift({
      enquiryId,
      createdAt: this.nowIstTimestamp(),
      name: sanitizeTextInput(payload.name, 100, false),
      business: sanitizeTextInput(payload.company, 120, false),
      phone: sanitizeTextInput(payload.phone, 24, false),
      email: sanitizeTextInput(payload.email, 160, false),
      city: sanitizeTextInput(payload.city, 80, false),
      country: sanitizeTextInput(payload.country, 80, false),
      vertical: sanitizeTextInput(payload.vertical, 120, false),
      enquiryType: sanitizeTextInput(payload.enquiryType, 160, false),
      message: sanitizeTextInput(payload.message, 1500, true),
      enquiryStatus: 'New',
      adminNotes: '',
    });
    this.savePreviewStore(preview);
    return { enquiryId, savedToLiveSheet: false };
  }

  /**
   * Admin Authentication & Session Validation
   */
  public async checkAdminStatus(): Promise<{
    passwordConfigured: boolean;
    isLiveBackend: boolean;
  }> {
    if (this.isLiveConnected()) {
      const res = await this.requestGet<{ passwordConfigured: boolean }>('adminStatus');
      return { passwordConfigured: res.passwordConfigured, isLiveBackend: true };
    }
    const preview = this.loadPreviewStore();
    return {
      passwordConfigured: Boolean(preview.passwordHash),
      isLiveBackend: false,
    };
  }

  public async validateSession(): Promise<boolean> {
    const session = this.getStoredSession();
    if (!session) return false;

    if (this.isLiveConnected()) {
      try {
        const res = await this.requestPost<{ valid: boolean }>({
          action: 'validateSession',
          token: session.token,
        });
        if (!res?.valid) {
          this.clearSession();
          return false;
        }
        return true;
      } catch {
        this.clearSession();
        return false;
      }
    }

    const preview = this.loadPreviewStore();
    const valid =
      Boolean(preview.activeToken) &&
      preview.activeToken === session.token &&
      Date.parse(preview.activeTokenExpiresAt) > Date.now();
    if (!valid) {
      this.clearSession();
    }
    return valid;
  }

  public async setupAdminPassword(password: string): Promise<AdminSessionState> {
    if (this.isLiveConnected()) {
      const session = await this.requestPost<AdminSessionState>({
        action: 'setupAdminPassword',
        password,
      });
      this.saveSession(session);
      return session;
    }

    if (password.length < 8) {
      throw new Error('Admin password must be at least 8 characters long.');
    }
    const preview = this.loadPreviewStore();
    if (preview.passwordHash) {
      throw new Error('Admin password is already configured.');
    }

    const salt = window.crypto.randomUUID();
    preview.passwordSalt = salt;
    preview.passwordHash = await this.sha256Hex(`${salt}:${password}:PREVIEW`);
    const session = {
      token: `PREVIEW-${window.crypto.randomUUID()}`,
      expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
    };
    preview.activeToken = session.token;
    preview.activeTokenExpiresAt = session.expiresAt;
    preview.logs.unshift({
      logId: this.randomId('LOG'),
      timestamp: this.nowIstTimestamp(),
      actor: 'Owner',
      action: 'INITIAL_SETUP',
      targetId: 'ADMIN_SECURITY',
      summary: 'Configured initial local preview admin password.',
    });
    this.savePreviewStore(preview);
    this.saveSession(session);
    return session;
  }

  public async loginAdmin(password: string): Promise<AdminSessionState> {
    if (this.isLiveConnected()) {
      const session = await this.requestPost<AdminSessionState>({
        action: 'adminLogin',
        password,
      });
      this.saveSession(session);
      return session;
    }

    const preview = this.loadPreviewStore();
    if (!preview.passwordHash || !preview.passwordSalt) {
      throw new Error('Please complete initial owner password setup first.');
    }
    const candidate = await this.sha256Hex(`${preview.passwordSalt}:${password}:PREVIEW`);
    if (candidate !== preview.passwordHash) {
      throw new Error('Invalid administrator password.');
    }

    const session = {
      token: `PREVIEW-${window.crypto.randomUUID()}`,
      expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
    };
    preview.activeToken = session.token;
    preview.activeTokenExpiresAt = session.expiresAt;
    preview.logs.unshift({
      logId: this.randomId('LOG'),
      timestamp: this.nowIstTimestamp(),
      actor: 'Owner',
      action: 'ADMIN_LOGIN',
      targetId: 'SESSION',
      summary: 'Signed into local preview console.',
    });
    this.savePreviewStore(preview);
    this.saveSession(session);
    return session;
  }

  public async logoutAdmin(): Promise<void> {
    const session = this.getStoredSession();
    this.clearSession();

    if (this.isLiveConnected() && session?.token) {
      try {
        await this.requestPost({ action: 'adminLogout', token: session.token });
      } catch {
        // Local session already invalidated
      }
      return;
    }

    const preview = this.loadPreviewStore();
    preview.activeToken = '';
    preview.activeTokenExpiresAt = '';
    this.savePreviewStore(preview);
  }

  /**
   * Authenticated Admin Operations
   */
  public async fetchAdminDashboard(): Promise<AdminDashboardData> {
    const token = this.requireToken();
    if (this.isLiveConnected()) {
      const res = await this.requestPost<AdminDashboardData>({
        action: 'getAdminDashboard',
        token,
      });
      return {
        ...res,
        settings: { ...DEFAULT_WEBSITE_SETTINGS, ...(res.settings || {}) },
      };
    }

    const preview = this.loadPreviewStore();
    return {
      appointments: preview.appointments,
      enquiries: preview.enquiries,
      availability: preview.availability,
      blockedDates: preview.blockedDates,
      settings: preview.settings,
      ventures: preview.ventures,
      logs: preview.logs,
      timezone: 'Asia/Kolkata',
    };
  }

  public async saveAppointment(
    payload: Partial<AppointmentRecord>
  ): Promise<{ bookingId: string }> {
    const token = this.requireToken();
    if (this.isLiveConnected()) {
      return this.requestPost<{ bookingId: string }>({
        action: 'saveAppointment',
        token,
        payload,
      });
    }

    const preview = this.loadPreviewStore();
    const nowStr = this.nowIstTimestamp();
    const existingIdx = payload.bookingId
      ? preview.appointments.findIndex((a) => a.bookingId === payload.bookingId)
      : -1;

    if (existingIdx === -1) {
      const bookingId = this.randomId('AKY');
      preview.appointments.unshift({
        bookingId,
        createdAt: nowStr,
        customerName: payload.customerName || 'Guest Client',
        phone: payload.phone || '',
        email: payload.email || '',
        city: payload.city || '',
        country: payload.country || 'India',
        businessName: payload.businessName || '',
        website: payload.website || '',
        businessStage: payload.businessStage || 'Early Stage (0–2 Years)',
        consultationTopic:
          payload.consultationTopic || 'Business Clarity & Strategic Direction',
        businessChallenge: payload.businessChallenge || '',
        appointmentDate: payload.appointmentDate || getTodayIstDate(),
        startTime: payload.startTime || '18:00',
        endTime: payload.endTime || '18:30',
        paymentStatus: payload.paymentStatus || 'Payment Awaited',
        bookingStatus: payload.bookingStatus || 'Pending',
        adminNotes: payload.adminNotes || '',
        calendarEventId: '',
        updatedAt: nowStr,
      });
      preview.logs.unshift({
        logId: this.randomId('LOG'),
        timestamp: nowStr,
        actor: 'Owner',
        action: 'CREATE_APPOINTMENT',
        targetId: bookingId,
        summary: `Created appointment (${payload.bookingStatus || 'Pending'}).`,
      });
      this.savePreviewStore(preview);
      return { bookingId };
    }

    const current = preview.appointments[existingIdx];
    preview.appointments[existingIdx] = {
      ...current,
      ...payload,
      updatedAt: nowStr,
    };
    preview.logs.unshift({
      logId: this.randomId('LOG'),
      timestamp: nowStr,
      actor: 'Owner',
      action: 'UPDATE_APPOINTMENT',
      targetId: current.bookingId,
      summary: `Status: ${payload.bookingStatus || current.bookingStatus}, Payment: ${payload.paymentStatus || current.paymentStatus}`,
    });
    this.savePreviewStore(preview);
    return { bookingId: current.bookingId };
  }

  public async saveAvailability(
    rules: AvailabilityRule[]
  ): Promise<{ updated: number; activeBookingsProtected: number }> {
    const token = this.requireToken();
    if (this.isLiveConnected()) {
      return this.requestPost({
        action: 'saveAvailability',
        token,
        rules,
      });
    }

    const preview = this.loadPreviewStore();
    preview.availability = rules;
    const activeCount = preview.appointments.filter(
      (a) => a.bookingStatus === 'Confirmed' || a.bookingStatus === 'Pending'
    ).length;
    preview.logs.unshift({
      logId: this.randomId('LOG'),
      timestamp: this.nowIstTimestamp(),
      actor: 'Owner',
      action: 'UPDATE_AVAILABILITY',
      targetId: 'WEEKLY_SCHEDULE',
      summary: 'Updated weekly consultation schedule.',
    });
    this.savePreviewStore(preview);
    return { updated: rules.length, activeBookingsProtected: activeCount };
  }

  public async blockDate(
    date: string,
    reason: string
  ): Promise<{ blocked: string; conflictWarningCount: number }> {
    const token = this.requireToken();
    if (this.isLiveConnected()) {
      return this.requestPost({
        action: 'blockDate',
        token,
        date,
        reason,
      });
    }

    const preview = this.loadPreviewStore();
    const conflicts = preview.appointments.filter(
      (a) =>
        a.appointmentDate === date &&
        (a.bookingStatus === 'Confirmed' || a.bookingStatus === 'Pending')
    ).length;
    if (!preview.blockedDates.some((b) => b.date === date)) {
      preview.blockedDates.push({
        date,
        reason: reason || 'Unavailable',
        createdBy: 'Owner',
        createdAt: this.nowIstTimestamp(),
      });
    }
    preview.logs.unshift({
      logId: this.randomId('LOG'),
      timestamp: this.nowIstTimestamp(),
      actor: 'Owner',
      action: 'BLOCK_DATE',
      targetId: date,
      summary: reason || 'Blocked date',
    });
    this.savePreviewStore(preview);
    return { blocked: date, conflictWarningCount: conflicts };
  }

  public async unblockDate(date: string): Promise<{ unblocked: string }> {
    const token = this.requireToken();
    if (this.isLiveConnected()) {
      return this.requestPost({ action: 'unblockDate', token, date });
    }

    const preview = this.loadPreviewStore();
    preview.blockedDates = preview.blockedDates.filter((b) => b.date !== date);
    preview.logs.unshift({
      logId: this.randomId('LOG'),
      timestamp: this.nowIstTimestamp(),
      actor: 'Owner',
      action: 'UNBLOCK_DATE',
      targetId: date,
      summary: 'Unblocked date',
    });
    this.savePreviewStore(preview);
    return { unblocked: date };
  }

  public async updateEnquiry(payload: {
    enquiryId: string;
    enquiryStatus: EnquiryStatus;
    adminNotes: string;
  }): Promise<void> {
    const token = this.requireToken();
    if (this.isLiveConnected()) {
      await this.requestPost({ action: 'updateEnquiry', token, payload });
      return;
    }

    const preview = this.loadPreviewStore();
    const idx = preview.enquiries.findIndex((e) => e.enquiryId === payload.enquiryId);
    if (idx >= 0) {
      preview.enquiries[idx] = {
        ...preview.enquiries[idx],
        enquiryStatus: payload.enquiryStatus,
        adminNotes: payload.adminNotes,
      };
      preview.logs.unshift({
        logId: this.randomId('LOG'),
        timestamp: this.nowIstTimestamp(),
        actor: 'Owner',
        action: 'UPDATE_ENQUIRY',
        targetId: payload.enquiryId,
        summary: `Updated status to ${payload.enquiryStatus}`,
      });
      this.savePreviewStore(preview);
    }
  }

  public async saveWebsiteSettings(
    settings: Partial<WebsiteSettingsMap>
  ): Promise<void> {
    const token = this.requireToken();
    if (this.isLiveConnected()) {
      await this.requestPost({ action: 'saveWebsiteSettings', token, settings });
      return;
    }

    const preview = this.loadPreviewStore();
    preview.settings = { ...preview.settings, ...settings } as WebsiteSettingsMap;
    preview.logs.unshift({
      logId: this.randomId('LOG'),
      timestamp: this.nowIstTimestamp(),
      actor: 'Owner',
      action: 'UPDATE_SETTINGS',
      targetId: 'WEBSITE_SETTINGS',
      summary: `Updated ${Object.keys(settings).length} setting keys.`,
    });
    this.savePreviewStore(preview);
  }

  public async saveVentures(ventures: VentureConfigRecord[]): Promise<void> {
    const token = this.requireToken();
    if (this.isLiveConnected()) {
      await this.requestPost({ action: 'saveVentures', token, ventures });
      return;
    }

    const preview = this.loadPreviewStore();
    preview.ventures = ventures;
    preview.logs.unshift({
      logId: this.randomId('LOG'),
      timestamp: this.nowIstTimestamp(),
      actor: 'Owner',
      action: 'UPDATE_VENTURES',
      targetId: 'VENTURES',
      summary: `Updated ${ventures.length} venture entries.`,
    });
    this.savePreviewStore(preview);
  }

  public async changeAdminPassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const token = this.requireToken();
    if (this.isLiveConnected()) {
      await this.requestPost({
        action: 'changeAdminPassword',
        token,
        currentPassword,
        newPassword,
      });
      return;
    }

    const preview = this.loadPreviewStore();
    const actual = await this.sha256Hex(`${preview.passwordSalt}:${currentPassword}:PREVIEW`);
    if (actual !== preview.passwordHash) {
      throw new Error('Current password does not match.');
    }
    if (newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long.');
    }
    const newSalt = window.crypto.randomUUID();
    preview.passwordSalt = newSalt;
    preview.passwordHash = await this.sha256Hex(`${newSalt}:${newPassword}:PREVIEW`);
    preview.logs.unshift({
      logId: this.randomId('LOG'),
      timestamp: this.nowIstTimestamp(),
      actor: 'Owner',
      action: 'ROTATE_PASSWORD',
      targetId: 'ADMIN_SECURITY',
      summary: 'Rotated preview admin password.',
    });
    this.savePreviewStore(preview);
  }

  public async sendTestEmail(): Promise<{ sentTo: string }> {
    const token = this.requireToken();
    if (this.isLiveConnected()) {
      return this.requestPost<{ sentTo: string }>({
        action: 'sendTestEmail',
        token,
      });
    }
    throw new Error(
      'Connect a deployed Google Apps Script Web App URL to test MailApp email delivery.'
    );
  }

  /**
   * Local Preview Helpers
   */
  private buildDefaultPreviewVentures(): VentureConfigRecord[] {
    return VENTURES_PORTFOLIO.map((v, idx) => ({
      id: v.id,
      title: v.name,
      slug: v.route,
      category: v.sector,
      description: v.description,
      externalUrl: v.externalUrl || '',
      imageUrl: v.image,
      active: true,
      sortOrder: idx + 1,
    }));
  }

  private loadPreviewStore(): PreviewStoreState {
    const fallback: PreviewStoreState = {
      passwordHash: '',
      passwordSalt: '',
      activeToken: '',
      activeTokenExpiresAt: '',
      appointments: [],
      enquiries: [],
      availability: DEFAULT_AVAILABILITY_RULES.map((r) => ({ ...r })),
      blockedDates: [],
      settings: { ...DEFAULT_WEBSITE_SETTINGS },
      ventures: this.buildDefaultPreviewVentures(),
      logs: [],
    };

    if (typeof window === 'undefined') return fallback;
    try {
      const raw = window.localStorage.getItem(PREVIEW_STORE_KEY);
      if (!raw) {
        window.localStorage.setItem(PREVIEW_STORE_KEY, JSON.stringify(fallback));
        return fallback;
      }
      const parsed = JSON.parse(raw) as Partial<PreviewStoreState>;
      return {
        ...fallback,
        ...parsed,
        settings: { ...DEFAULT_WEBSITE_SETTINGS, ...(parsed.settings || {}) },
        availability:
          Array.isArray(parsed.availability) && parsed.availability.length > 0
            ? parsed.availability
            : fallback.availability,
        ventures:
          Array.isArray(parsed.ventures) && parsed.ventures.length > 0
            ? parsed.ventures
            : fallback.ventures,
      };
    } catch {
      return fallback;
    }
  }

  private savePreviewStore(store: PreviewStoreState): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(PREVIEW_STORE_KEY, JSON.stringify(store));
  }

  private async sha256Hex(input: string): Promise<string> {
    const data = new TextEncoder().encode(input);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private randomId(prefix: string): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let out = '';
    for (let i = 0; i < 6; i++) {
      out += chars[Math.floor(Math.random() * chars.length)];
    }
    return `${prefix}-${out}`;
  }

  private nowIstTimestamp(): string {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
      .format(new Date())
      .replace(', ', ' ');
  }

  private computePreviewAvailability(
    store: PreviewStoreState,
    dateStr: string
  ): DateAvailabilityResponse {
    const fee = store.settings.consultationFee || 'Contact Us for Consultation Fee.';
    const todayIst = getTodayIstDate();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return {
        date: dateStr,
        blocked: true,
        reason: 'Please choose a valid consultation date.',
        slots: [],
        consultationFee: fee,
      };
    }

    if (dateStr < todayIst) {
      return {
        date: dateStr,
        blocked: true,
        reason: 'Past dates cannot be booked.',
        slots: [],
        consultationFee: fee,
      };
    }

    const blocked = store.blockedDates.find((b) => b.date === dateStr);
    if (blocked) {
      return {
        date: dateStr,
        blocked: true,
        reason: blocked.reason || 'This date is currently blocked.',
        slots: [],
        consultationFee: fee,
      };
    }

    const dayName = getDayNameIst(dateStr);
    const rule = store.availability.find((r) => r.day === dayName);
    if (!rule || !rule.enabled) {
      return {
        date: dateStr,
        blocked: true,
        reason: `Advisory consultations are not scheduled on ${dayName}.`,
        slots: [],
        consultationFee: fee,
      };
    }

    const intervals = buildSlotIntervals(rule.startTime, rule.endTime, rule.slotDuration);
    const dayAppointments = store.appointments.filter(
      (a) => a.appointmentDate === dateStr && a.bookingStatus !== 'Cancelled'
    );

    if (dayAppointments.length >= Math.max(1, rule.maximumBookings)) {
      return {
        date: dateStr,
        blocked: false,
        reason: 'Daily consultation capacity reached for this date.',
        slots: intervals.map((s) => ({
          startTime: s.startTime,
          endTime: s.endTime,
          label: formatSlotRangeIst(s.startTime, s.endTime),
          available: false,
          reason: 'Booked',
        })),
        consultationFee: fee,
      };
    }

    const nowMinIst = getCurrentMinutesIst();
    return {
      date: dateStr,
      blocked: false,
      reason: '',
      slots: intervals.map((s) => {
        const startMin = parseHmMinutes(s.startTime);
        if (dateStr === todayIst && startMin <= nowMinIst + 15) {
          return {
            startTime: s.startTime,
            endTime: s.endTime,
            label: formatSlotRangeIst(s.startTime, s.endTime),
            available: false,
            reason: 'Elapsed',
          };
        }
        const isBooked = dayAppointments.some((a) => a.startTime === s.startTime);
        return {
          startTime: s.startTime,
          endTime: s.endTime,
          label: formatSlotRangeIst(s.startTime, s.endTime),
          available: !isBooked,
          reason: isBooked ? 'Reserved' : 'Available',
        };
      }),
      consultationFee: fee,
    };
  }
}

export const akyinApiClient = new AkyinApiClient();
