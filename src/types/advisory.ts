import { z } from 'zod';
import { sanitizeSafeHttpUrl } from '../utils/advisoryHelpers';
import { sanitizeTextInput } from '../utils/security';

export type BookingStatus =
  | 'Pending'
  | 'Contact Required'
  | 'Payment Awaited'
  | 'Payment Received'
  | 'Confirmed'
  | 'Completed'
  | 'Cancelled'
  | 'Rescheduled';

export type PaymentStatus =
  | 'Payment Awaited'
  | 'Payment Received'
  | 'Not Required'
  | 'Refunded';

export type EnquiryStatus =
  | 'New'
  | 'Contacted'
  | 'In Progress'
  | 'Resolved'
  | 'Archived';

export const BOOKING_STATUS_OPTIONS: BookingStatus[] = [
  'Pending',
  'Contact Required',
  'Payment Awaited',
  'Payment Received',
  'Confirmed',
  'Completed',
  'Cancelled',
  'Rescheduled',
];

export const PAYMENT_STATUS_OPTIONS: PaymentStatus[] = [
  'Payment Awaited',
  'Payment Received',
  'Not Required',
  'Refunded',
];

export const ENQUIRY_STATUS_OPTIONS: EnquiryStatus[] = [
  'New',
  'Contacted',
  'In Progress',
  'Resolved',
  'Archived',
];

export const BUSINESS_STAGES = [
  'Idea / Pre-Launch',
  'Early Stage (0–2 Years)',
  'Growing SME / Retail',
  'Automobile Dealership',
  'Established Enterprise',
] as const;

export const CONSULTATION_TOPICS = [
  'Business Clarity & Strategic Direction',
  'New Business Exploration & Feasibility',
  'Automotive Dealership Growth & Training',
  'Digital Marketing & Lead Qualification',
  'Retail / E-Commerce Positioning',
  'B2B Commerce & Expansion Strategy',
] as const;

export interface AppointmentRecord {
  bookingId: string;
  createdAt: string;
  customerName: string;
  phone: string;
  email: string;
  city: string;
  country: string;
  businessName: string;
  website: string;
  businessStage: string;
  consultationTopic: string;
  businessChallenge: string;
  appointmentDate: string; // YYYY-MM-DD (IST)
  startTime: string; // HH:mm (24h IST)
  endTime: string; // HH:mm (24h IST)
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  adminNotes: string;
  calendarEventId: string;
  updatedAt: string;
}

export interface EnquiryRecord {
  enquiryId: string;
  createdAt: string;
  name: string;
  business: string;
  phone: string;
  email: string;
  city: string;
  country: string;
  vertical: string;
  enquiryType: string;
  message: string;
  enquiryStatus: EnquiryStatus;
  adminNotes: string;
}

export interface AvailabilityRule {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
  slotDuration: number;
  maximumBookings: number;
}

export interface BlockedDateRecord {
  date: string;
  reason: string;
  createdBy: string;
  createdAt: string;
}

export interface WebsiteSettingsMap {
  advisoryHeadline: string;
  advisorySubheadline: string;
  consultationFee: string;
  advisorySlotDuration: string;
  advisoryMaxBookings: string;
  notificationEmail: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  heroHeadline: string;
  heroSubheadline: string;
  footerTagline: string;
  brandWordmark: string;
  logoUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  xUrl: string;
  youtubeUrl: string;
  amazonUrl: string;
  googlePlayBooksUrl: string;
  [key: string]: string;
}

export interface VentureConfigRecord {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  externalUrl: string;
  imageUrl: string;
  active: boolean;
  sortOrder: number;
}

export interface AdminLogRecord {
  logId: string;
  timestamp: string;
  actor: string;
  action: string;
  targetId: string;
  summary: string;
}

export interface TimeSlotAvailability {
  startTime: string;
  endTime: string;
  label: string;
  available: boolean;
  reason: string;
}

export interface DateAvailabilityResponse {
  date: string;
  blocked: boolean;
  reason: string;
  slots: TimeSlotAvailability[];
  consultationFee: string;
}

export interface BookingConfirmationResult {
  bookingId: string;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  slotLabel: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  calendarEventCreated: boolean;
  emailStatus: {
    customerNotified: boolean;
    adminNotified: boolean;
    error: string;
  };
  confirmationNotice: string;
}

export interface AdminDashboardData {
  appointments: AppointmentRecord[];
  enquiries: EnquiryRecord[];
  availability: AvailabilityRule[];
  blockedDates: BlockedDateRecord[];
  settings: WebsiteSettingsMap;
  ventures: VentureConfigRecord[];
  logs: AdminLogRecord[];
  timezone: string;
}

export const DEFAULT_WEBSITE_SETTINGS: WebsiteSettingsMap = {
  advisoryHeadline: 'Your Business. Your Vision. A Clearer Direction.',
  advisorySubheadline:
    'Focused 1-on-1 commercial advisory and business direction sessions with AKYIN Ventures—structured around clarity, unit economics, and practical execution.',
  consultationFee: 'Contact Us for Consultation Fee.',
  advisorySlotDuration: '30',
  advisoryMaxBookings: '2',
  notificationEmail: 'connect@akyin.com',
  contactEmail: 'connect@akyin.com',
  contactPhone: '+91-6305694011',
  whatsappNumber: '916305694011',
  heroHeadline: 'Building Ideas Into Businesses.',
  heroSubheadline:
    'AKYIN Ventures brings together diverse business initiatives across publishing, marketing, retail, digital technology, B2B commerce and business consulting.',
  footerTagline:
    'Parent corporate group bringing together operating ventures across publishing, automotive marketing, value retail, AI utility software, B2B stock commerce, and business consulting.',
  brandWordmark: 'AKYIN',
  logoUrl: '',
  instagramUrl: 'https://www.instagram.com/akyinmarketing/',
  facebookUrl: 'https://www.facebook.com/akyinmarketing/',
  xUrl: 'https://x.com/akyinmarketing',
  youtubeUrl: 'https://www.youtube.com/@akyinmarketing',
  amazonUrl:
    'https://www.amazon.com/stores/Akyin-S/author/B0H6SY7N3T?_encoding=UTF8&pd_rd_w=r7GRE&content-id=amzn1.sym.7e190e19-9f6f-4df8-807a-5a7608594741&pd_rd_wg=EdC74&pd_rd_r=d01ba7b6-b1c7-4bd2-87fb-cbd0fc9deddb&ref=ap_rdr&shoppingPortalEnabled=true&ccs_id=98bb1963-9c8a-4dab-9f1b-d21a6f908208',
  googlePlayBooksUrl:
    'https://play.google.com/store/books/details/Akyin_s_THE_DISCIPLINE_CODE?id=seHuEQAAQBAJ',
};

export const DEFAULT_AVAILABILITY_RULES: AvailabilityRule[] = [
  { day: 'Monday', enabled: true, startTime: '18:00', endTime: '19:00', slotDuration: 30, maximumBookings: 2 },
  { day: 'Tuesday', enabled: true, startTime: '18:00', endTime: '19:00', slotDuration: 30, maximumBookings: 2 },
  { day: 'Wednesday', enabled: true, startTime: '18:00', endTime: '19:00', slotDuration: 30, maximumBookings: 2 },
  { day: 'Thursday', enabled: true, startTime: '18:00', endTime: '19:00', slotDuration: 30, maximumBookings: 2 },
  { day: 'Friday', enabled: true, startTime: '18:00', endTime: '19:00', slotDuration: 30, maximumBookings: 2 },
  { day: 'Saturday', enabled: true, startTime: '18:00', endTime: '19:00', slotDuration: 30, maximumBookings: 2 },
  { day: 'Sunday', enabled: true, startTime: '18:00', endTime: '19:00', slotDuration: 30, maximumBookings: 2 },
];

export interface AdvisoryBookingInput {
  customerName: string;
  phone: string;
  email: string;
  city: string;
  country: string;
  businessName: string;
  website: string;
  businessStage: string;
  consultationTopic: string;
  businessChallenge: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
}

export const advisoryBookingSchema = z.object({
  customerName: z
    .string()
    .transform((v) => sanitizeTextInput(v, 100, false))
    .pipe(z.string().min(2, 'Please enter your full name (min 2 characters).')),
  phone: z
    .string()
    .transform((v) => sanitizeTextInput(v, 24, false))
    .pipe(
      z
        .string()
        .refine(
          (val) => /^\+?[0-9]{8,15}$/.test(val.replace(/[\s\-()]/g, '')),
          'Please enter a valid phone number (8 to 15 digits).'
        )
    ),
  email: z
    .string()
    .transform((v) => sanitizeTextInput(v, 160, false))
    .pipe(z.string().email('Please enter a valid email address.')),
  city: z
    .string()
    .transform((v) => sanitizeTextInput(v, 80, false))
    .pipe(z.string().min(2, 'Please enter your city.')),
  country: z
    .string()
    .transform((v) => sanitizeTextInput(v, 80, false))
    .pipe(z.string().min(2, 'Please enter your country.')),
  businessName: z
    .string()
    .transform((v) => sanitizeTextInput(v, 120, false)),
  website: z
    .string()
    .transform((v) => sanitizeSafeHttpUrl(v))
    .refine(
      (v) => v === '' || /^https?:\/\//i.test(v),
      'Website must be a valid https:// or http:// address.'
    ),
  businessStage: z
    .string()
    .transform((v) => sanitizeTextInput(v, 80, false))
    .pipe(z.string().min(2, 'Please choose your business stage.')),
  consultationTopic: z
    .string()
    .transform((v) => sanitizeTextInput(v, 120, false))
    .pipe(z.string().min(2, 'Please choose a consultation topic.')),
  businessChallenge: z
    .string()
    .transform((v) => sanitizeTextInput(v, 1500, true))
    .pipe(
      z
        .string()
        .min(10, 'Please describe your business challenge or question (min 10 characters).')
    ),
  appointmentDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please choose a valid consultation date.'),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Please select a consultation time slot.'),
  endTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Please select a consultation time slot.'),
});
