import { akyinApiClient } from '../utils/AkyinApiClient';
import {
  AdvisoryBookingInput,
  AppointmentRecord,
  AvailabilityRule,
  EnquiryStatus,
  VentureConfigRecord,
  WebsiteSettingsMap,
} from '../types/advisory';

export type { AdminSessionState, PublicBootstrapData } from '../utils/AkyinApiClient';
export { AkyinApiClient, akyinApiClient } from '../utils/AkyinApiClient';

export const getStoredAppsScriptUrl = () => akyinApiClient.getEndpointUrl();
export const setStoredAppsScriptUrl = (url: string) => akyinApiClient.setEndpointUrl(url);
export const isLiveAppsScriptConnected = () => akyinApiClient.isLiveConnected();
export const getAdminSession = () => akyinApiClient.getStoredSession();
export const clearAdminSession = () => akyinApiClient.clearSession();
export const validateAdminSession = () => akyinApiClient.validateSession();
export const fetchPublicBootstrap = () => akyinApiClient.fetchBootstrap();
export const fetchDateAvailability = (dateStr: string) => akyinApiClient.fetchAvailability(dateStr);
export const submitAppointmentBooking = (payload: AdvisoryBookingInput) =>
  akyinApiClient.submitBooking(payload);
export const submitEnquiryRecord = (payload: {
  name: string;
  company: string;
  phone: string;
  email: string;
  city: string;
  country: string;
  vertical: string;
  enquiryType: string;
  message: string;
}) => akyinApiClient.submitEnquiry(payload);
export const checkAdminStatus = () => akyinApiClient.checkAdminStatus();
export const setupInitialAdminPassword = (password: string) =>
  akyinApiClient.setupAdminPassword(password);
export const loginAdmin = (password: string) => akyinApiClient.loginAdmin(password);
export const logoutAdmin = () => akyinApiClient.logoutAdmin();
export const fetchAdminDashboard = () => akyinApiClient.fetchAdminDashboard();
export const saveAdminAppointment = (payload: Partial<AppointmentRecord>) =>
  akyinApiClient.saveAppointment(payload);
export const saveAdminAvailability = (rules: AvailabilityRule[]) =>
  akyinApiClient.saveAvailability(rules);
export const blockAdminDate = (date: string, reason: string) =>
  akyinApiClient.blockDate(date, reason);
export const unblockAdminDate = (date: string) => akyinApiClient.unblockDate(date);
export const updateAdminEnquiry = (payload: {
  enquiryId: string;
  enquiryStatus: EnquiryStatus;
  adminNotes: string;
}) => akyinApiClient.updateEnquiry(payload);
export const saveAdminWebsiteSettings = (settings: Partial<WebsiteSettingsMap>) =>
  akyinApiClient.saveWebsiteSettings(settings);
export const saveAdminVentures = (ventures: VentureConfigRecord[]) =>
  akyinApiClient.saveVentures(ventures);
export const changeAdminPassword = (currentPassword: string, newPassword: string) =>
  akyinApiClient.changeAdminPassword(currentPassword, newPassword);
export const sendAdminTestEmail = () => akyinApiClient.sendTestEmail();
