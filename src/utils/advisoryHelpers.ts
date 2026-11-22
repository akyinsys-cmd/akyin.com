import { sanitizeTextInput } from '../utils/security';

export const IST_TIMEZONE = 'Asia/Kolkata';

export function sanitizeSafeHttpUrl(raw: string): string {
  const cleaned = sanitizeTextInput(raw, 280, false);
  if (!cleaned) return '';
  const withScheme =
    cleaned.startsWith('http://') || cleaned.startsWith('https://')
      ? cleaned
      : `https://${cleaned}`;
  try {
    const parsed = new URL(withScheme);
    if (parsed.username || parsed.password) return '';
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
    return '';
  } catch {
    return '';
  }
}

export function getTodayIstDate(): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: IST_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(new Date());
}

export function getCurrentMinutesIst(): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: IST_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const hh = Number(parts.find((p) => p.type === 'hour')?.value ?? '0');
  const mm = Number(parts.find((p) => p.type === 'minute')?.value ?? '0');
  return hh * 60 + mm;
}

export function getDayNameIst(dateStr: string): string {
  const dt = new Date(`${dateStr}T12:00:00+05:30`);
  return new Intl.DateTimeFormat('en-US', {
    timeZone: IST_TIMEZONE,
    weekday: 'long',
  }).format(dt);
}

export function addDaysIst(dateStr: string, offsetDays: number): string {
  const dt = new Date(`${dateStr}T12:00:00+05:30`);
  dt.setUTCDate(dt.getUTCDate() + offsetDays);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: IST_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(dt);
}

export function parseHmMinutes(hm: string): number {
  const [h, m] = String(hm || '00:00').split(':');
  return Number(h) * 60 + Number(m || '0');
}

export function minutesToHm(total: number): string {
  const hh = String(Math.floor(total / 60)).padStart(2, '0');
  const mm = String(total % 60).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function formatTime12h(hm: string): string {
  const [hStr, mStr] = String(hm || '18:00').split(':');
  let h = Number(hStr);
  const suffix = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${mStr || '00'} ${suffix}`;
}

export function formatSlotRangeIst(startHm: string, endHm: string): string {
  return `${formatTime12h(startHm)} – ${formatTime12h(endHm)} IST`;
}

export function buildSlotIntervals(
  startHm: string,
  endHm: string,
  durationMins: number
): Array<{ startTime: string; endTime: string }> {
  const start = parseHmMinutes(startHm);
  const end = parseHmMinutes(endHm);
  const step = Math.max(15, Math.min(120, Number(durationMins) || 30));
  const out: Array<{ startTime: string; endTime: string }> = [];
  for (let m = start; m + step <= end; m += step) {
    out.push({
      startTime: minutesToHm(m),
      endTime: minutesToHm(m + step),
    });
  }
  return out;
}

export function formatFriendlyDateIst(dateStr: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const dt = new Date(`${dateStr}T12:00:00+05:30`);
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: IST_TIMEZONE,
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(dt);
}
