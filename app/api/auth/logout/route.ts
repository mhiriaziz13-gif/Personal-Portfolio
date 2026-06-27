import { NextResponse } from 'next/server';
import { assertSameOrigin, isRequestSecurityError, jsonError, noStoreHeaders } from '@/lib/security/http';
import { safeRedirectPath } from '@/lib/security/redirects';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await request.json().catch(() => ({})) as Record<string, unknown>;
    const redirectTo = safeRedirectPath(body.redirectTo, '/admin/login');
    const supabase = await createClient();
    await supabase.auth.signOut();
    return NextResponse.json({ redirectTo }, { headers: noStoreHeaders() });
  } catch (error) {
    if (isRequestSecurityError(error)) return jsonError('Invalid request.', error.status);
    return jsonError('Unable to sign out.', 400);
  }
}
