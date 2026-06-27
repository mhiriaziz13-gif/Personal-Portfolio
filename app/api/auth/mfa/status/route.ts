import { NextResponse } from 'next/server';
import { AdminAuthError, getVerifiedAdmin } from '@/lib/security/admin-auth';
import { jsonError, noStoreHeaders } from '@/lib/security/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { supabase } = await getVerifiedAdmin({ enforceMfa: false });
    const [{ data: aal }, { data: factors }] = await Promise.all([
      supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
      supabase.auth.mfa.listFactors(),
    ]);

    return NextResponse.json({
      currentLevel: aal?.currentLevel || null,
      nextLevel: aal?.nextLevel || null,
      factors: factors?.totp?.map((factor) => ({ id: factor.id, status: factor.status, friendlyName: factor.friendly_name })) || [],
      enforcementEnabled: process.env.REQUIRE_ADMIN_MFA === 'true',
    }, { headers: noStoreHeaders() });
  } catch (error) {
    if (error instanceof AdminAuthError) return jsonError(error.message, error.status);
    return jsonError('Unable to load MFA status.', 400);
  }
}
