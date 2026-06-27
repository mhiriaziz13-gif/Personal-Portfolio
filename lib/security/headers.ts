const GOOGLE_TAG_ORIGIN = 'https://www.googletagmanager.com';
const GOOGLE_ANALYTICS_ORIGIN = 'https://www.google-analytics.com';
const GOOGLE_ANALYTICS_REGION_ORIGIN = 'https://region1.google-analytics.com';
const VERCEL_ANALYTICS_ORIGIN = 'https://va.vercel-scripts.com';
const VERCEL_INSIGHTS_ORIGIN = 'https://vitals.vercel-insights.com';
const TURNSTILE_ORIGIN = 'https://challenges.cloudflare.com';

function origin(value: string | undefined) {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function websocketOrigin(value: string | undefined) {
  const parsed = origin(value);
  return parsed ? parsed.replace(/^https:/, 'wss:').replace(/^http:/, 'ws:') : null;
}

function compact(values: Array<string | null | undefined>) {
  return values.filter((value): value is string => Boolean(value));
}

export function createNonce() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let value = '';
  for (const byte of bytes) value += String.fromCharCode(byte);
  return btoa(value);
}

export function buildContentSecurityPolicy(nonce: string) {
  const supabaseHttp = origin(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseWs = websocketOrigin(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const connectSources = compact([
    "'self'",
    supabaseHttp,
    supabaseWs,
    GOOGLE_ANALYTICS_ORIGIN,
    GOOGLE_ANALYTICS_REGION_ORIGIN,
    VERCEL_ANALYTICS_ORIGIN,
    VERCEL_INSIGHTS_ORIGIN,
    TURNSTILE_ORIGIN,
  ]);
  const scriptSources = [
    "'self'",
    `'nonce-${nonce}'`,
    GOOGLE_TAG_ORIGIN,
    GOOGLE_ANALYTICS_ORIGIN,
    VERCEL_ANALYTICS_ORIGIN,
    TURNSTILE_ORIGIN,
  ];
  const imageSources = compact(["'self'", 'data:', 'blob:', supabaseHttp, GOOGLE_ANALYTICS_ORIGIN, GOOGLE_TAG_ORIGIN]);

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    `script-src ${scriptSources.join(' ')}`,
    `style-src 'self' 'nonce-${nonce}'`,
    `img-src ${imageSources.join(' ')}`,
    "font-src 'self'",
    `connect-src ${connectSources.join(' ')}`,
    `frame-src ${TURNSTILE_ORIGIN}`,
    `child-src ${TURNSTILE_ORIGIN}`,
    "worker-src 'self' blob:",
    "media-src 'self'",
    "manifest-src 'self'",
    "upgrade-insecure-requests",
  ].join('; ');
}

export function isSensitivePath(pathname: string) {
  return pathname.startsWith('/admin') || pathname.startsWith('/api');
}

export function securityHeaders(nonce: string, pathname: string) {
  const headers: Record<string, string> = {
    'Content-Security-Policy': buildContentSecurityPolicy(nonce),
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=(), browsing-topics=()',
    'X-Frame-Options': 'DENY',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'unsafe-none',
    'Cross-Origin-Resource-Policy': 'same-origin',
  };

  if (process.env.NODE_ENV === 'production') {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
  }

  if (isSensitivePath(pathname)) {
    headers['X-Robots-Tag'] = 'noindex, nofollow, noarchive';
    headers['Cache-Control'] = 'no-store, private, max-age=0';
    headers.Pragma = 'no-cache';
    headers.Expires = '0';
  }

  return headers;
}

export function applyHeaders(target: Headers, headers: Record<string, string>) {
  for (const [key, value] of Object.entries(headers)) target.set(key, value);
}
