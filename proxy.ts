import type { NextRequest } from 'next/server';
import { createNonce, securityHeaders } from '@/lib/security/headers';
import { updateSession } from '@/lib/supabase/proxy';

export async function proxy(request: NextRequest) {
  const nonce = createNonce();
  const requestHeaders = new Headers(request.headers);
  const responseHeaders = securityHeaders(nonce, request.nextUrl.pathname);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', responseHeaders['Content-Security-Policy']);
  return updateSession(request, { requestHeaders, responseHeaders });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|favicon.svg|og-cover.svg|images/|cv/).*)'],
};
