import { NextRequest, NextResponse } from 'next/server';

type RouteContext = { params: Promise<{ path: string[] }> };

async function proxy(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  if (!path.length || path.some((segment) => !segment || segment === '.' || segment === '..')) {
    return NextResponse.json({ success: false, message: 'Invalid API path.' }, { status: 400 });
  }

  const backendBaseUrl = (
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') ||
    'https://laundry.anushatechnologies.com'
  ).replace(/\/$/, '');

  const target = new URL(`/api/${path.map(encodeURIComponent).join('/')}`, backendBaseUrl);
  target.search = request.nextUrl.search;

  const headers = new Headers();
  const contentType = request.headers.get('content-type');
  const accept = request.headers.get('accept');
  const authorization = request.headers.get('authorization');
  if (contentType) headers.set('content-type', contentType);
  if (accept) headers.set('accept', accept);
  if (authorization) headers.set('authorization', authorization);

  const adminApiToken = process.env.ADMIN_API_TOKEN?.trim() || 'laundry-admin-secret-token-2026';
  headers.set('x-admin-token', adminApiToken);

  try {
    const method = request.method;
    const body = method === 'GET' || method === 'HEAD' ? undefined : await request.text();
    const backendResponse = await fetch(target, {
      method,
      headers,
      body,
      cache: 'no-store',
    });
    const responseBody = await backendResponse.arrayBuffer();
    const responseHeaders = new Headers();
    responseHeaders.set('content-type', backendResponse.headers.get('content-type') || 'application/json; charset=utf-8');
    return new NextResponse(responseBody, { status: backendResponse.status, headers: responseHeaders });
  } catch (err: any) {
    console.error(`[Admin Proxy Error] Failed to proxy to ${target.toString()}:`, err.message);
    return NextResponse.json({ success: false, message: 'The operations API is unavailable.' }, { status: 502 });
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
