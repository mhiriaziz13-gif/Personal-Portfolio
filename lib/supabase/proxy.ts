import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isSupabaseConfigured, supabasePublishableKey, supabaseUrl } from './config';

function hasSupabaseAuthCookie(request: NextRequest) {
  return request.cookies.getAll().some(({ name }) => name.startsWith('sb-') && name.includes('auth-token'));
}

function redirectToLogin(request: NextRequest, path: string) {
  const url = request.nextUrl.clone();
  url.pathname = '/admin/login';
  url.searchParams.set('next', path);
  return NextResponse.redirect(url);
}

export async function updateSession(request: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const path = request.nextUrl.pathname;

  if (!hasSupabaseAuthCookie(request)) {
    if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
      return redirectToLogin(request, path);
    }
    return response;
  }

  const supabase = createServerClient(supabaseUrl!, supabasePublishableKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    if (!user) return redirectToLogin(request, path);

    const { data: admin } = await supabase.from('admins').select('user_id').eq('user_id', user.id).maybeSingle();
    if (!admin) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('denied', '1');
      return NextResponse.redirect(url);
    }
  }

  if (path === '/admin/login' && user) {
    const { data: admin } = await supabase.from('admins').select('user_id').eq('user_id', user.id).maybeSingle();
    if (admin) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
  }

  return response;
}