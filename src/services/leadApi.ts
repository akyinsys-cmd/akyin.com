import { akyinApiClient } from '../utils/AkyinApiClient';
import { sanitizeTextInput } from '../utils/security';

export interface LeadSubmissionPayload {
  fullName: string;
  businessName: string;
  mobileNumber: string;
  email: string;
  website?: string;
  city: string;
  country: string;
  businessCategory?: string;
  requiredService: string;
  monthlyMarketingBudget: string;
  preferredContactMethod?: string;
  message: string;
  consentAccepted: boolean;
  honeypot?: string;
  source?: string;
  campaignSource?: string;
}

export interface LeadSubmissionResult {
  ok: true;
  leadId: string;
  receivedAt: string;
  syncedToLiveSheet: boolean;
}

export async function submitValidatedLead(
  payload: LeadSubmissionPayload
): Promise<LeadSubmissionResult> {
  const cleanPayload: LeadSubmissionPayload = {
    fullName: sanitizeTextInput(payload.fullName, 100, false),
    businessName: sanitizeTextInput(payload.businessName, 120, false),
    mobileNumber: sanitizeTextInput(payload.mobileNumber, 28, false),
    email: sanitizeTextInput(payload.email, 160, false),
    website: sanitizeTextInput(payload.website || '', 240, false),
    city: sanitizeTextInput(payload.city, 80, false),
    country: sanitizeTextInput(payload.country, 80, false),
    businessCategory: sanitizeTextInput(payload.businessCategory || '', 120, false),
    requiredService: sanitizeTextInput(payload.requiredService, 140, false),
    monthlyMarketingBudget: sanitizeTextInput(payload.monthlyMarketingBudget, 80, false),
    preferredContactMethod: sanitizeTextInput(
      payload.preferredContactMethod || 'Phone / WhatsApp',
      60,
      false
    ),
    message: sanitizeTextInput(payload.message, 1500, true),
    consentAccepted: Boolean(payload.consentAccepted),
    honeypot: payload.honeypot ? String(payload.honeypot).slice(0, 60) : '',
    source: sanitizeTextInput(payload.source || 'Interactive Lead Enquiry Widget', 80, false),
    campaignSource: sanitizeTextInput(payload.campaignSource || 'Website', 40, false),
  };

  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cleanPayload),
  });

  const body = (await response.json().catch(() => ({}))) as {
    ok?: boolean;
    leadId?: string;
    receivedAt?: string;
    error?: string;
    issues?: string[];
  };

  if (!response.ok || !body.ok || !body.leadId) {
    throw new Error(
      body.issues?.[0] || body.error || 'Unable to submit enquiry. Please review your details and retry.'
    );
  }

  // Forward to Google Apps Script ONLY when a live sheet endpoint is explicitly configured.
  // Never persists sensitive lead records in browser localStorage.
  let syncedToLiveSheet = false;
  if (akyinApiClient.isLiveConnected()) {
    try {
      await akyinApiClient.submitEnquiry({
        name: cleanPayload.fullName,
        company: cleanPayload.businessName,
        phone: cleanPayload.mobileNumber,
        email: cleanPayload.email,
        city: cleanPayload.city,
        country: cleanPayload.country,
        vertical: 'AKYIN Ventures / Marketing',
        enquiryType: `${cleanPayload.requiredService} (${cleanPayload.monthlyMarketingBudget})`,
        message: cleanPayload.message,
      });
      syncedToLiveSheet = true;
    } catch {
      // Server-side persistence already succeeded cleanly
      syncedToLiveSheet = false;
    }
  }

  return {
    ok: true,
    leadId: body.leadId,
    receivedAt: body.receivedAt || new Date().toISOString(),
    syncedToLiveSheet,
  };
}
