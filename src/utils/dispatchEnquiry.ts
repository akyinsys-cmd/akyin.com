import { z } from 'zod';
import {
  BUSINESS_VERTICAL_OPTIONS,
  ENQUIRY_CATEGORIES,
  ENQUIRY_TYPE_OPTIONS,
  OFFICIAL_CONTACT,
} from '../data/akyinData';
import { sanitizeHref, sanitizeTextInput } from './security';

export interface EnquiryPayload {
  category: string;
  vertical: string;
  enquiryType: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  message: string;
}

export const FIELD_LIMITS = {
  name: 100,
  company: 120,
  email: 160,
  phone: 24,
  country: 80,
  city: 80,
  message: 1500,
} as const;

const nameSchema = z
  .string()
  .transform((val) => sanitizeTextInput(val, FIELD_LIMITS.name, false))
  .pipe(
    z
      .string()
      .min(2, 'Please enter your full name (minimum 2 characters).')
      .max(FIELD_LIMITS.name, `Full name must be ${FIELD_LIMITS.name} characters or fewer.`)
      .refine((val) => !/[<>]/.test(val), 'Name cannot contain < or > characters.')
  );

const companySchema = z
  .string()
  .transform((val) => sanitizeTextInput(val, FIELD_LIMITS.company, false))
  .pipe(
    z
      .string()
      .max(
        FIELD_LIMITS.company,
        `Company name must be ${FIELD_LIMITS.company} characters or fewer.`
      )
      .refine((val) => !/[<>]/.test(val), 'Company name cannot contain < or > characters.')
  );

const emailSchema = z
  .string()
  .transform((val) => sanitizeTextInput(val, FIELD_LIMITS.email, false))
  .pipe(
    z
      .string()
      .min(1, 'Please enter your email address.')
      .max(FIELD_LIMITS.email, `Email must be ${FIELD_LIMITS.email} characters or fewer.`)
      .email('Please enter a valid email address.')
  );

const phoneSchema = z
  .string()
  .transform((val) => sanitizeTextInput(val, FIELD_LIMITS.phone, false))
  .pipe(
    z
      .string()
      .min(1, 'Please enter your phone number.')
      .refine(
        (val) => /^\+?[0-9]{8,15}$/.test(val.replace(/[\s\-()]/g, '')),
        'Please enter a valid phone number (8 to 15 digits).'
      )
  );

const countrySchema = z
  .string()
  .transform((val) => sanitizeTextInput(val, FIELD_LIMITS.country, false))
  .pipe(
    z
      .string()
      .min(2, 'Please enter your country (minimum 2 characters).')
      .max(FIELD_LIMITS.country, `Country must be ${FIELD_LIMITS.country} characters or fewer.`)
      .refine((val) => !/[<>]/.test(val), 'Country cannot contain < or > characters.')
  );

const citySchema = z
  .string()
  .transform((val) => sanitizeTextInput(val, FIELD_LIMITS.city, false))
  .pipe(
    z
      .string()
      .min(2, 'Please enter your city (minimum 2 characters).')
      .max(FIELD_LIMITS.city, `City must be ${FIELD_LIMITS.city} characters or fewer.`)
      .refine((val) => !/[<>]/.test(val), 'City cannot contain < or > characters.')
  );

const messageSchema = z
  .string()
  .refine(
    (val) => val.trim().length <= FIELD_LIMITS.message,
    `Message must be ${FIELD_LIMITS.message} characters or fewer.`
  )
  .transform((val) => sanitizeTextInput(val, FIELD_LIMITS.message, true));

const categorySchema = z
  .string()
  .refine(
    (val) => (ENQUIRY_CATEGORIES as readonly string[]).includes(val),
    'Please select a valid enquiry category.'
  );

const verticalSchema = z
  .string()
  .refine(
    (val) => (BUSINESS_VERTICAL_OPTIONS as readonly string[]).includes(val),
    'Please select a valid business vertical.'
  );

const enquiryTypeSchema = z
  .string()
  .refine(
    (val) => ENQUIRY_TYPE_OPTIONS.includes(val),
    'Please select a valid enquiry type.'
  );

export const enquirySchema = z.object({
  category: categorySchema,
  vertical: verticalSchema,
  enquiryType: enquiryTypeSchema,
  name: nameSchema,
  company: companySchema,
  email: emailSchema,
  phone: phoneSchema,
  country: countrySchema,
  city: citySchema,
  message: messageSchema,
});

const FIELD_SCHEMA_MAP: Record<keyof EnquiryPayload, z.ZodType<string>> = {
  category: categorySchema,
  vertical: verticalSchema,
  enquiryType: enquiryTypeSchema,
  name: nameSchema,
  company: companySchema,
  email: emailSchema,
  phone: phoneSchema,
  country: countrySchema,
  city: citySchema,
  message: messageSchema,
};

export function validateEnquiryField(
  field: keyof EnquiryPayload,
  value: string
): string | undefined {
  const schema = FIELD_SCHEMA_MAP[field];
  const result = schema.safeParse(value);
  if (result.success) {
    return undefined;
  }
  return result.error.issues[0]?.message || 'Please check this field.';
}

export function normalizeEnquiryPayload(payload: EnquiryPayload): EnquiryPayload {
  const safeCategory = (ENQUIRY_CATEGORIES as readonly string[]).includes(payload.category)
    ? payload.category
    : ENQUIRY_CATEGORIES[0];

  const safeVertical = (BUSINESS_VERTICAL_OPTIONS as readonly string[]).includes(payload.vertical)
    ? payload.vertical
    : BUSINESS_VERTICAL_OPTIONS[0];

  const safeEnquiryType = ENQUIRY_TYPE_OPTIONS.includes(payload.enquiryType)
    ? payload.enquiryType
    : ENQUIRY_TYPE_OPTIONS[0];

  return {
    category: safeCategory,
    vertical: safeVertical,
    enquiryType: safeEnquiryType,
    name: sanitizeTextInput(payload.name, FIELD_LIMITS.name, false),
    company: sanitizeTextInput(payload.company, FIELD_LIMITS.company, false),
    email: sanitizeTextInput(payload.email, FIELD_LIMITS.email, false),
    phone: sanitizeTextInput(payload.phone, FIELD_LIMITS.phone, false),
    country: sanitizeTextInput(payload.country, FIELD_LIMITS.country, false),
    city: sanitizeTextInput(payload.city, FIELD_LIMITS.city, false),
    message: sanitizeTextInput(payload.message, FIELD_LIMITS.message, true),
  };
}

export function buildFormattedEnquiryText(payload: EnquiryPayload): string {
  const safe = normalizeEnquiryPayload(payload);
  const lines = [
    `Hello AKYIN Ventures Team,`,
    ``,
    `Enquiry Category: ${safe.category}`,
    `Business Vertical: ${safe.vertical}`,
    `Enquiry Type: ${safe.enquiryType}`,
    `Full Name: ${safe.name}`,
    `Business / Company Name: ${safe.company || 'Not specified'}`,
    `Email Address: ${safe.email}`,
    `Phone Number: ${safe.phone}`,
    `Country: ${safe.country}`,
    `City: ${safe.city}`,
  ];

  if (safe.message) {
    lines.push(`Message: ${safe.message}`);
  }

  lines.push(``, `Prepared via AKYIN.com`);
  return lines.join('\n');
}

export function buildWhatsAppDispatchUrl(_payload: EnquiryPayload): string {
  return sanitizeHref(OFFICIAL_CONTACT.whatsappUrl, OFFICIAL_CONTACT.whatsappChannelUrl, false);
}

export function buildEmailDispatchUrl(payload: EnquiryPayload): string {
  const safe = normalizeEnquiryPayload(payload);
  const rawSubject = `[${safe.category}] ${safe.vertical} — ${safe.company || safe.name || 'Enquiry'}`;
  const cleanSubject = sanitizeTextInput(rawSubject, 180, false);
  const body = buildFormattedEnquiryText(safe);
  const candidate = `mailto:${OFFICIAL_CONTACT.email}?subject=${encodeURIComponent(cleanSubject)}&body=${encodeURIComponent(body)}`;
  return sanitizeHref(candidate, `mailto:${OFFICIAL_CONTACT.email}`, true);
}

export function validateEnquiryPayload(payload: EnquiryPayload): Record<string, string> {
  const result = enquirySchema.safeParse(payload);
  if (result.success) {
    return {};
  }

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
}
