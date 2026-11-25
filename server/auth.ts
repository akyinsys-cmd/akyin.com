import crypto from 'crypto';
import type { NextFunction, Request, Response } from 'express';
import { PublicSuiteUser, SessionRecord, SuiteDatabase, SuiteUser, UserRole } from './types';

const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours rolling
const SCRYPT_KEYLEN = 64;

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, SCRYPT_KEYLEN).toString('hex');
  return `scrypt$${salt}$${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const [, salt, expectedHex] = parts;
  if (!salt || !expectedHex) return false;
  try {
    const derived = crypto.scryptSync(password, salt, SCRYPT_KEYLEN);
    const expected = Buffer.from(expectedHex, 'hex');
    if (derived.length !== expected.length) return false;
    return crypto.timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

export function hashSessionToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

export function toPublicUser(user: SuiteUser): PublicSuiteUser {
  const { passwordHash: _ignored, ...safe } = user;
  return safe;
}

export type AdminResource =
  | 'overview'
  | 'leads'
  | 'clients'
  | 'services'
  | 'quotations'
  | 'appointments'
  | 'payments'
  | 'reports'
  | 'marketing_tools'
  | 'website_settings'
  | 'social_media'
  | 'users'
  | 'security_audit';

const ROLE_PERMISSIONS: Record<UserRole, Set<AdminResource>> = {
  'Super Admin': new Set<AdminResource>([
    'overview',
    'leads',
    'clients',
    'services',
    'quotations',
    'appointments',
    'payments',
    'reports',
    'marketing_tools',
    'website_settings',
    'social_media',
    'users',
    'security_audit',
  ]),
  'Sales Manager': new Set<AdminResource>([
    'overview',
    'leads',
    'clients',
    'services',
    'quotations',
    'appointments',
    'marketing_tools',
  ]),
  'Finance Manager': new Set<AdminResource>([
    'overview',
    'clients',
    'services',
    'quotations',
    'payments',
    'reports',
  ]),
  Staff: new Set<AdminResource>(['overview', 'leads', 'clients', 'appointments']),
};

export function hasPermission(role: UserRole, resource: AdminResource): boolean {
  return ROLE_PERMISSIONS[role]?.has(resource) ?? false;
}

export function createSessionForUser(
  db: SuiteDatabase,
  user: SuiteUser
): { rawToken: string; session: SessionRecord } {
  const now = Date.now();
  // Prune expired sessions
  db.sessions = (db.sessions || []).filter((s) => Date.parse(s.expiresAt) > now);

  const rawToken = `aky_${crypto.randomBytes(32).toString('hex')}`;
  const session: SessionRecord = {
    tokenHash: hashSessionToken(rawToken),
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + SESSION_TTL_MS).toISOString(),
  };
  db.sessions.push(session);
  user.lastLoginAt = new Date(now).toISOString();
  return { rawToken, session };
}

export interface AuthenticatedRequest extends Request {
  suiteUser?: PublicSuiteUser;
  suiteTokenHash?: string;
}

export function extractBearerToken(req: Request): string {
  const authHeader = String(req.headers.authorization || '').trim();
  if (!authHeader.toLowerCase().startsWith('bearer ')) return '';
  return authHeader.slice(7).trim();
}

export function makeAuthMiddleware(readDbFn: () => SuiteDatabase) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const rawToken = extractBearerToken(req);
    if (!rawToken) {
      res.status(401).json({
        error: 'Authentication required. Sign in at /admin to continue.',
        code: 'AUTH_REQUIRED',
      });
      return;
    }

    const tokenHash = hashSessionToken(rawToken);
    const db = readDbFn();
    const now = Date.now();
    const session = (db.sessions || []).find(
      (s) => s.tokenHash === tokenHash && Date.parse(s.expiresAt) > now
    );
    if (!session) {
      res.status(401).json({
        error: 'Session expired or invalid. Please sign in again.',
        code: 'SESSION_INVALID',
      });
      return;
    }

    const user = (db.users || []).find((u) => u.id === session.userId && u.active);
    if (!user) {
      res.status(403).json({
        error: 'User account is inactive or no longer exists.',
        code: 'ACCOUNT_DISABLED',
      });
      return;
    }

    req.suiteUser = toPublicUser(user);
    req.suiteTokenHash = tokenHash;
    next();
  };
}

export function requirePermission(resource: AdminResource) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.suiteUser) {
      res.status(401).json({ error: 'Authentication required.', code: 'AUTH_REQUIRED' });
      return;
    }
    if (!hasPermission(req.suiteUser.role, resource)) {
      res.status(403).json({
        error: `Role '${req.suiteUser.role}' does not have permission for '${resource}'.`,
        code: 'FORBIDDEN_ROLE',
      });
      return;
    }
    next();
  };
}

export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.suiteUser) {
      res.status(401).json({ error: 'Authentication required.', code: 'AUTH_REQUIRED' });
      return;
    }
    if (!allowedRoles.includes(req.suiteUser.role)) {
      res.status(403).json({
        error: `This action requires one of: ${allowedRoles.join(', ')}.`,
        code: 'FORBIDDEN_ROLE',
      });
      return;
    }
    next();
  };
}
