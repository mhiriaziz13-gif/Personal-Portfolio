import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { noStoreHeaders, withNoStore } from '@/lib/security/http';
import { safeRedirectPath } from '@/lib/security/redirects';
import { isSupabaseConfigured, supabaseCookieOptions, supabasePublishableKey, supabaseUrl } from './config';

function hasSupabaseAuthCookie(request: NextRequest) {
  return request.cookies.getAll().some(({ name }) => name.startsWith('sb-') && name.includes('auth-token'));
}

function redirectToLogin(request: NextRequest, path: string) {
  const url = request.nextUrl.clone();
  url.pathname = '/admin/login';
  url.searchParams.set('next', safeRedirectPath(path, '/admin'));
  return withNoStore(NextResponse.redirect(url));
}

export async function updateSession(request: NextRequest) {
  if (!isSupabaseConfigured()) return withNoStore(NextResponse.next({ request }));

  let response = withNoStore(NextResponse.next({ request }));
  const path = request.nextUrl.pathname;

  if (!hasSupabaseAuthCookie(request)) {
    if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
      return redirectToLogin(request, path);
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
        response = withNoStore(NextResponse.next({ request }));
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    if (!userId) return redirectToLogin(request, path);

    const { data: admin } = await supabase.from('admins').select('user_id').eq('user_id', userId).maybeSingle();
    if (!admin) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('denied', '1');
      return withNoStore(NextResponse.redirect(url));
    }

    if (process.env.REQUIRE_ADMIN_MFA === 'true' && !path.startsWith('/admin/security')) {
      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aal?.currentLevel !== 'aal2') {
        const url = request.nextUrl.clone();
        url.pathname = '/admin/security';
        url.searchParams.set('mfa', 'required');
        return withNoStore(NextResponse.redirect(url));
      }
    }
  }

  if (path === '/admin/login' && userId) {
    const { data: admin } = await supabase.from('admins').select('user_id').eq('user_id', userId).maybeSingle();
    if (admin) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return withNoStore(NextResponse.redirect(url));
    }
  }

  for (const [key, value] of Object.entries(noStoreHeaders())) response.headers.set(key, value);
  return response;
}
