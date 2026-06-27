import 'server-only';

import { createClient } from '@/lib/supabase/server';

export class AdminAuthError extends Error {
  constructor(message: string, public status = 401, public code = 'unauthorized') {
    super(message);
  }
}

export function requireAdminMfa() {
  return process.env.REQUIRE_ADMIN_MFA === 'true';
}

export async function getVerifiedAdmin(options: { enforceMfa?: boolean } = {}) {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  const userId = claims?.sub;

  if (claimsError || !userId) throw new AdminAuthError('Authentication required.', 401);

  const { data: admin, error: adminError } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (adminError || !admin) throw new AdminAuthError('Administrator access required.', 403, 'forbidden');

  const enforceMfa = options.enforceMfa ?? requireAdminMfa();
  if (enforceMfa) {
    const { data: aal, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (error || aal?.currentLevel !== 'aal2') {
      throw new AdminAuthError('MFA verification required.', 403, 'mfa_required');
    }
  }

  return { supabase, userId, email: typeof claims.email === 'string' ? claims.email : undefined, claims };
}

export async function isVerifiedAdmin() {
  try {
    await getVerifiedAdmin({ enforceMfa: false });
    return true;
  } catch {
    return false;
  }
}
