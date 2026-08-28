import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  createAdminSession,
  hasValidAdminSession,
  isAdminConsoleConfigured,
  passwordsMatch,
} from '@/lib/admin-session';

function clearSession(response: NextResponse) {
  response.cookies.set({ name: ADMIN_SESSION_COOKIE, value: '', path: '/', maxAge: 0 });
  return response;
}

export async function GET(request: NextRequest) {
  if (!isAdminConsoleConfigured()) {
    return NextResponse.json({ authenticated: false, configured: false }, { status: 503 });
  }

  return NextResponse.json({
    authenticated: hasValidAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value),
    configured: true,
  });
}

export async function POST(request: NextRequest) {
  if (!isAdminConsoleConfigured()) {
    return NextResponse.json({ message: 'Admin console is not configured.' }, { status: 503 });
  }

  const body = await request.json().catch(() => null) as { password?: unknown } | null;
  const password = typeof body?.password === 'string' ? body.password : '';
  if (!password || password.length > 512 || !passwordsMatch(password)) {
    return NextResponse.json({ message: 'The passphrase is incorrect.' }, { status: 401 });
  }

  const response = NextResponse.json({ authenticated: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: createAdminSession(),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 8 * 60 * 60,
  });
  return response;
}

export async function DELETE() {
  return clearSession(NextResponse.json({ authenticated: false }));
}
