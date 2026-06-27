import { NextResponse } from 'next/server';
import { AdminAuthError, getVerifiedAdmin } from '@/lib/security/admin-auth';
import { assertSameOrigin, clientIp, isRequestSecurityError, jsonError, noStoreHeaders } from '@/lib/security/http';
import { rateLimit } from '@/lib/security/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const limit = rateLimit(`mfa-enroll:${clientIp(request)}`, 5, 15 * 60 * 1000);
    if (!limit.allowed) return jsonError('Too many MFA enrollment attempts. Please try again later.', 429);

    const { supabase } = await getVerifiedAdmin({ enforceMfa: false });
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'Portfolio admin' });
    if (error || !data || data.type !== 'totp') return jsonError('Unable to start MFA enrollment.', 400);

    return NextResponse.json({
      factorId: data.id,
      qrCode: data.totp.qr_code,
      secret: data.totp.secret,
    }, { headers: noStoreHeaders() });
  } catch (error) {
    if (isRequestSecurityError(error)) return jsonError('Invalid request.', error.status);
    if (error instanceof AdminAuthError) return jsonError(error.message, error.status);
    return jsonError('Unable to start MFA enrollment.', 400);
  }
}
