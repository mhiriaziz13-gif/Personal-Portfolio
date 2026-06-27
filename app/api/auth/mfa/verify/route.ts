import { NextResponse } from 'next/server';
import { AdminAuthError, getVerifiedAdmin } from '@/lib/security/admin-auth';
import { assertSameOrigin, clientIp, isRequestSecurityError, jsonError, noStoreHeaders } from '@/lib/security/http';
import { rateLimit } from '@/lib/security/rate-limit';
import { cleanString } from '@/lib/security/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const limit = rateLimit(`mfa-verify:${clientIp(request)}`, 10, 10 * 60 * 1000);
    if (!limit.allowed) return jsonError('Too many MFA verification attempts. Please try again later.', 429);

    const body = await request.json() as Record<string, unknown>;
    const factorId = cleanString(body.factorId, 80);
    const code = cleanString(body.code, 12).replace(/\s+/g, '');
    if (!/^\d{6}$/.test(code)) return jsonError('Enter the 6-digit code from your authenticator app.', 400);

    const { supabase } = await getVerifiedAdmin({ enforceMfa: false });
    const { data, error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
    if (error || !data) return jsonError('Unable to verify the MFA code.', 400);

    return NextResponse.json({ verified: true }, { headers: noStoreHeaders() });
  } catch (error) {
    if (isRequestSecurityError(error)) return jsonError('Invalid request.', error.status);
    if (error instanceof AdminAuthError) return jsonError(error.message, error.status);
    return jsonError('Unable to verify the MFA code.', 400);
  }
}
