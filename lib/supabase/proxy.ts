import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { noStoreHeaders, withNoStore } from '@/lib/security/http';
import { applyHeaders, isSensitivePath } from '@/lib/security/headers';
import { safeRedirectPath } from '@/lib/security/redirects';
import { isSupabaseConfigured, supabaseCookieOptions, supabasePublishableKey, supabaseUrl } from './config';

type UpdateSessionOptions = {
  requestHeaders?: Headers;
  responseHeaders?: Record<string, string>;
};

function hasSupabaseAuthCookie(request: NextRequest) {
  return request.cookies.getAll().some(({ name }) => name.startsWith('sb-') && name.includes('auth-token'));
}

function secureResponse(response: NextResponse, path: string, options: UpdateSessionOptions = {}) {
  if (options.responseHeaders) applyHeaders(response.headers, options.responseHeaders);
  if (isSensitivePath(path)) withNoStore(response);
  return response;
}

function nextResponse(request: NextRequest, options: UpdateSessionOptions = {}) {
  return secureResponse(NextResponse.next({
    request: { headers: options.requestHeaders || request.headers },
  }), request.nextUrl.pathname, options);
}

function redirectToLogin(request: NextRequest, path: string, options: UpdateSessionOptions = {}) {
  const url = request.nextUrl.clone();
  url.pathname = '/admin/login';
  url.searchParams.set('next', safeRedirectPath(path, '/admin'));
  return secureResponse(NextResponse.redirect(url), path, options);
}

export async function updateSession(request: NextRequest, options: UpdateSessionOptions = {}) {
  if (!isSupabaseConfigured()) return nextResponse(request, options);

  let response = nextResponse(request, options);
  const path = request.nextUrl.pathname;
  const isAdminLogin = path === '/admin/login' || path === '/admin/login/';

  if (!hasSupabaseAuthCookie(request)) {
    if (path.startsWith('/admin') && !isAdminLogin) {
      return redirectToLogin(request, path, options);
    }
    return response;
  }

  const supabase = createServerClient(supabaseUrl!, supabasePublishableKey!, {
    cookieOptions: supabaseCookieOptions,
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = nextResponse(request, options);
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
        response = secureResponse(response, path, options);
      },
    },
  });

  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (path.startsWith('/admin') && !isAdminLogin) {
    if (!userId) return redirectToLogin(request, path, options);

    const { data: admin } = await supabase.from('admins').select('user_id').eq('user_id', userId).maybeSingle();
    if (!admin) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('denied', '1');
      return secureResponse(NextResponse.redirect(url), path, options);
    }

    if (process.env.REQUIRE_ADMIN_MFA === 'true' && !path.startsWith('/admin/security')) {
      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aal?.currentLevel !== 'aal2') {
        const url = request.nextUrl.clone();
        url.pathname = '/admin/security';
        url.searchParams.set('mfa', 'required');
        return secureResponse(NextResponse.redirect(url), path, options);
      }
    }
  }

  if (isAdminLogin && userId) {
    const { data: admin } = await supabase.from('admins').select('user_id').eq('user_id', userId).maybeSingle();
    if (admin) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return secureResponse(NextResponse.redirect(url), path, options);
    }
  }

  if (isSensitivePath(path)) {
    for (const [key, value] of Object.entries(noStoreHeaders())) response.headers.set(key, value);
  }
  return secureResponse(response, path, options);
}
