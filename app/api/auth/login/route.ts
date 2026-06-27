import { NextResponse } from 'next/server';
import { assertSameOrigin, clientIp, isRequestSecurityError, jsonError, noStoreHeaders } from '@/lib/security/http';
import { rateLimit } from '@/lib/security/rate-limit';
import { safeRedirectPath } from '@/lib/security/redirects';
import { cleanString, email as cleanEmail } from '@/lib/security/validation';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    if (Number(request.headers.get('content-length') || 0) > 4000) return jsonError('Unable to sign in.', 400);

    const body = await request.json() as Record<string, unknown>;
    const email = cleanEmail(body.email);
    const password = cleanString(body.password, 200);
    const next = safeRedirectPath(body.next, '/admin');
    const ip = clientIp(request);

    const ipLimit = rateLimit(`admin-login-ip:${ip}`, 30, 15 * 60 * 1000);
    const emailLimit = rateLimit(`admin-login:${ip}:${email}`, 8, 15 * 60 * 1000);
    if (!ipLimit.allowed || !emailLimit.allowed) return jsonError('Too many sign-in attempts. Please try again later.', 429);

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return jsonError('Unable to sign in with administrator access.', 401);

    const { data: admin } = await supabase.from('admins').select('user_id').eq('user_id', data.user.id).maybeSingle();
    if (!admin) {
      await supabase.auth.signOut();
      return jsonError('Unable to sign in with administrator access.', 403);
    }

    return NextResponse.json({ redirectTo: next }, { headers: noStoreHeaders() });
  } catch (error) {
    if (isRequestSecurityError(error)) return jsonError('Invalid request.', error.status);
    return jsonError('Unable to sign in with administrator access.', 400);
  }
}
