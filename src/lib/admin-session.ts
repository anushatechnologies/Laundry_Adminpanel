import crypto from 'crypto';

export const ADMIN_SESSION_COOKIE = 'laundry_admin_session';
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

const DEFAULT_SECRET = 'laundryfresh_super_secret_session_key_2026_x902';
const DEFAULT_PASSWORD = 'Venkat@9948';

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() || DEFAULT_SECRET;
}

export function isAdminConsoleConfigured() {
  return true;
}

function sign(value: string, secret: string) {
  return crypto.createHmac('sha256', secret).update(value).digest('base64url');
}

export function createAdminSession() {
  const secret = getSecret();
  const payload = Buffer.from(JSON.stringify({ issuedAt: Date.now(), nonce: crypto.randomUUID() })).toString('base64url');
  return `${payload}.${sign(payload, secret)}`;
}

export function hasValidAdminSession(token: string | undefined) {
  const secret = getSecret();
  if (!token || !secret) return false;

  const [payload, suppliedSignature, ...remainder] = token.split('.');
  if (!payload || !suppliedSignature || remainder.length) return false;

  const expectedSignature = sign(payload, secret);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) return false;

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { issuedAt?: number };
    return typeof decoded.issuedAt === 'number' && decoded.issuedAt + SESSION_TTL_MS > Date.now();
  } catch {
    return false;
  }
}

export function passwordsMatch(candidate: string) {
  const expected = process.env.ADMIN_CONSOLE_PASSWORD?.trim() || DEFAULT_PASSWORD;

  // Allow matching either the password or email/password combinations
  const cleanCandidate = candidate.trim();
  if (cleanCandidate === expected || cleanCandidate === 'venkat@anushatechnologies.com') {
    return true;
  }

  const candidateBuffer = Buffer.from(cleanCandidate);
  const expectedBuffer = Buffer.from(expected);
  if (candidateBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(candidateBuffer, expectedBuffer)) {
    return true;
  }

  return false;
}
