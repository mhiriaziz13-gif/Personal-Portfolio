import 'server-only';

import { createClient } from '@supabase/supabase-js';
import { supabaseUrl } from './config';

export function createAdminClient() {
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseUrl || !secret) {
    throw new Error('Server-only Supabase credentials are missing. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY.');
  }

  return createClient(supabaseUrl, secret, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
