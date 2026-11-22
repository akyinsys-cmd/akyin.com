import { useState } from 'react';
import { Check, Copy, FileCode2 } from 'lucide-react';
import { GlassButton } from '../liquid-glass';

const DEPLOYMENT_STEPS = [
  'Sign in to your owner Google account (the Google Workspace / Gmail account that owns AKYIN Google Sheets and Google Calendar).',
  'Open Google Sheets and create a blank spreadsheet named "AKYIN Ventures Operations Database" (or let Code.gs create it automatically on first run).',
  'Copy the Spreadsheet ID from the URL between /d/ and /edit if binding an existing sheet.',
  'Open Google Apps Script (script.google.com) -> New Project -> rename to "AKYIN Ventures Backend".',
  'Enable "Show appsscript.json manifest file in editor" in Project Settings and replace its contents with apps-script/appsscript.json (sets Asia/Kolkata timezone and minimal scopes).',
  'Replace Code.gs with apps-script/Code.gs and add optional HTML files PublicBooking.html and AdminPortal.html from the project apps-script folder.',
  'Open Project Settings -> Script Properties -> optionally set AKYIN_SPREADSHEET_ID (your Spreadsheet ID) and AKYIN_CALENDAR_ID (or leave blank to use default owner Calendar).',
  'In the Apps Script editor, run getSpreadsheet_() once manually to authorize Google Sheets, Google Calendar, and MailApp permissions and auto-create all 7 tabs with headers.',
  'Verify the 7 initialized tabs in Google Sheets: Appointments, Enquiries, Availability, BlockedDates, WebsiteSettings, Ventures, and AdminLogs.',
  'Click Deploy -> New deployment -> Select type: Web app.',
  'Set "Execute as" to "Me" (your Google account) and "Who has access" to "Anyone" so akyin.com visitors can fetch open IST slots and submit requests.',
  'Copy the generated Web App URL ending in /exec.',
  'Set VITE_APPS_SCRIPT_URL in your deployment environment OR paste the /exec URL into Admin Security below to bind this website live.',
  'Open https://akyin.com/admin, complete the one-time initial owner password setup (stored as salted SHA-256 hash inside Apps Script PropertiesService), and verify AdminLogs.',
  'Use "Send Test Notification Email" in Contact Settings to confirm MailApp delivery to connect@akyin.com and submit a test request on /advisory to verify Google Calendar event creation.',
];

export function DeploymentChecklistCard() {
  const [copiedSteps, setCopiedSteps] = useState(false);

  const handleCopyChecklist = async () => {
    const text = DEPLOYMENT_STEPS.map((s, idx) => `${idx + 1}. ${s}`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSteps(true);
      window.setTimeout(() => setCopiedSteps(false), 2000);
    } catch {
      // Clipboard fallback ignored
    }
  };

  return (
    <div className="liquid-glass-card rounded-3xl p-6 sm:p-7 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#6E6E73]">
            <FileCode2 className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
            <span>Google Account Setup &amp; Deployment Checklist</span>
          </div>
          <h3 className="font-display text-lg font-bold text-[#1D1D1F]">
            15-Step Apps Script, Sheets &amp; Calendar Launch Guide
          </h3>
        </div>

        <GlassButton variant="subtle" size="sm" onClick={handleCopyChecklist}>
          {copiedSteps ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#1D1D1F]" aria-hidden="true" />
              <span>Copied Steps</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#6E6E73]" aria-hidden="true" />
              <span>Copy Checklist</span>
            </>
          )}
        </GlassButton>
      </div>

      <ol className="space-y-2.5 text-xs sm:text-sm text-[#1D1D1F]/90">
        {DEPLOYMENT_STEPS.map((step, idx) => (
          <li
            key={idx}
            className="flex items-start gap-3 py-2 border-b border-[#E8E8ED] last:border-b-0"
          >
            <span className="font-mono-num text-xs font-bold text-[#1D1D1F] shrink-0 mt-0.5">
              {String(idx + 1).padStart(2, '0')}
            </span>
            <span className="leading-relaxed">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
