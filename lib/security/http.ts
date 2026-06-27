import { NextResponse } from 'next/server';

export class RequestSecurityError extends Error {
  constructor(message = 'Invalid request.', public status = 403) {
    super(message);
  }
}

function parseOrigin(value: string | null) {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function allowedOrigins(request: Request) {
  const origins = new Set<string>();
  const requestOrigin = parseOrigin(request.url);
  const siteOrigin = parseOrigin(process.env.NEXT_PUBLIC_SITE_URL || null);

  if (requestOrigin && process.env.NODE_ENV !== 'production') origins.add(requestOrigin);
  if (siteOrigin) origins.add(siteOrigin);
  if (process.env.VERCEL_URL) origins.add(`https://${process.env.VERCEL_URL}`);
  if (process.env.NODE_ENV !== 'production') {
    origins.add('http://localhost:3000');
    origins.add('http://127.0.0.1:3000');
  }

  for (const value of (process.env.ALLOWED_ORIGINS || '').split(',')) {
    const origin = parseOrigin(value.trim());
    if (origin) origins.add(origin);
  }

  return origins;
}

export function assertSameOrigin(request: Request) {
  const origin = parseOrigin(request.headers.get('origin'));
  if (!origin) {
    if (process.env.NODE_ENV === 'production') throw new RequestSecurityError();
    return;
  }
  if (!allowedOrigins(request).has(origin)) throw new RequestSecurityError();
}

export function isRequestSecurityError(error: unknown): error is RequestSecurityError {
  return error instanceof RequestSecurityError;
}

export function clientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || request.headers.get('x-real-ip') || 'unknown';
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ message }, { status, headers: noStoreHeaders() });
}

export function noStoreHeaders() {
  return {
    'Cache-Control': 'no-store, private, max-age=0',
    Pragma: 'no-cache',
    Expires: '0',
    'X-Robots-Tag': 'noindex, nofollow',
  };
}

export function withNoStore(response: NextResponse) {
  for (const [key, value] of Object.entries(noStoreHeaders())) {
    response.headers.set(key, value);
  }
  return response;
}
