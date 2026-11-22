/**
 * Client-side input sanitization, URL allowlisting, and anti-abuse helpers.
 */

// ASCII control characters (excluding tab/LF/CR when explicitly allowed) + Unicode Bidi override chars
const CONTROL_CHARS_ALL = /[\u0000-\u001F\u007F-\u009F\u200E\u200F\u202A-\u202E\u2066-\u2069]/g;
const CONTROL_CHARS_MULTILINE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u200E\u200F\u202A-\u202E\u2066-\u2069]/g;

export function sanitizeTextInput(
  value: string,
  maxLength: number,
  allowNewlines = false
): string {
  if (typeof value !== 'string') return '';
  const pattern = allowNewlines ? CONTROL_CHARS_MULTILINE : CONTROL_CHARS_ALL;
  const normalized = value.replace(/\r\n/g, '\n').replace(pattern, allowNewlines ? '' : ' ');
  return normalized.trim().slice(0, maxLength);
}

export function isSafeExternalUrl(rawUrl: string, allowMailto = false): boolean {
  if (typeof rawUrl !== 'string') return false;
  const trimmed = rawUrl.trim();
  if (!trimmed || trimmed.startsWith('//')) return false;

  try {
    const parsed = new URL(trimmed);
    if (parsed.username || parsed.password) return false;
    if (parsed.protocol === 'https:') return true;
    if (allowMailto && parsed.protocol === 'mailto:') return true;
    return false;
  } catch {
    return false;
  }
}

export function sanitizeHref(
  rawUrl: string | undefined,
  fallback = '#',
  allowMailto = false
): string {
  if (!rawUrl) return fallback;
  return isSafeExternalUrl(rawUrl, allowMailto) ? rawUrl.trim() : fallback;
}

export function isSafeImageSrc(src: string): boolean {
  if (typeof src !== 'string') return false;
  const trimmed = src.trim();
  if (!trimmed || trimmed.startsWith('//')) return false;
  if (trimmed.startsWith('/src/') || trimmed.startsWith('/assets/')) {
    return !trimmed.includes('..');
  }
  return isSafeExternalUrl(trimmed, false);
}

const cooldownRegistry = new Map<string, number>();

export function canTriggerAction(key: string, minIntervalMs = 2500): boolean {
  const now = Date.now();
  const lastTime = cooldownRegistry.get(key) ?? 0;
  if (now - lastTime < minIntervalMs) {
    return false;
  }
  cooldownRegistry.set(key, now);
  return true;
}
