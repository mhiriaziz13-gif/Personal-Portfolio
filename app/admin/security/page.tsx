import { redirect } from 'next/navigation';
import { MfaPanel } from '@/components/admin/mfa-panel';
import { isCurrentUserAdmin } from '@/lib/cms';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata = { title: 'Admin Security', robots: { index: false, follow: false } };

export default async function AdminSecurityPage() {
  if (!isSupabaseConfigured()) redirect('/admin/login');
  if (!await isCurrentUserAdmin()) redirect('/admin/login?denied=1');
  return <main className="admin-shell"><MfaPanel /></main>;
}
