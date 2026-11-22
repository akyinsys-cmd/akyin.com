import { OFFICIAL_CONTACT } from '../data/akyinData';

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

export function buildFormattedEnquiryText(payload: EnquiryPayload): string {
  const lines = [
    `Hello AKYIN Ventures Team,`,
    ``,
    `Enquiry Category: ${payload.category}`,
    `Business Vertical: ${payload.vertical}`,
    `Enquiry Type: ${payload.enquiryType}`,
    `Full Name: ${payload.name.trim()}`,
    `Business / Company Name: ${payload.company.trim() || 'Not specified'}`,
    `Email Address: ${payload.email.trim()}`,
    `Phone Number: ${payload.phone.trim()}`,
    `Country: ${payload.country.trim()}`,
    `City: ${payload.city.trim()}`,
  ];

  if (payload.message.trim()) {
    lines.push(`Message: ${payload.message.trim()}`);
  }

  lines.push(``, `Prepared via AKYIN.com`);
  return lines.join('\n');
}

export function buildWhatsAppDispatchUrl(payload: EnquiryPayload): string {
  const text = buildFormattedEnquiryText(payload);
  return `https://wa.me/${OFFICIAL_CONTACT.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export function buildEmailDispatchUrl(payload: EnquiryPayload): string {
  const subject = `[${payload.category}] ${payload.vertical} — ${payload.company.trim() || payload.name.trim()}`;
  const body = buildFormattedEnquiryText(payload);
  return `mailto:${OFFICIAL_CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function validateEnquiryPayload(payload: EnquiryPayload): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!payload.name.trim() || payload.name.trim().length < 2) {
    errors.name = 'Please enter your full name.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!payload.email.trim() || !emailRegex.test(payload.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  const cleanPhone = payload.phone.replace(/[\s\-()]/g, '');
  if (!cleanPhone || cleanPhone.length < 8) {
    errors.phone = 'Please enter a valid phone number.';
  }
  if (!payload.country.trim()) {
    errors.country = 'Please enter your country.';
  }
  if (!payload.city.trim()) {
    errors.city = 'Please enter your city.';
  }

  return errors;
}
