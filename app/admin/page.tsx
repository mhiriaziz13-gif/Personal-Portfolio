import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { getAdminMessages, getAdminPortfolioContent } from '@/lib/cms';
import { AdminAuthError, getVerifiedAdmin } from '@/lib/security/admin-auth';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata = { title: 'Portfolio Manager', robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!isSupabaseConfigured()) return <main className="admin-setup-screen"><p className="eyebrow">Configuration required</p><h1>Connect the content backend before using the portfolio manager.</h1><p>Add the required local environment values, run the setup SQL files, then restart the Next.js server.</p></main>;
  let admin: Awaited<ReturnType<typeof getVerifiedAdmin>>;
  try {
    admin = await getVerifiedAdmin();
  } catch (error) {
    if (error instanceof AdminAuthError && error.code === 'mfa_required') redirect('/admin/security?mfa=required');
    redirect('/admin/login?denied=1');
  }
  const [content, messages] = await Promise.all([getAdminPortfolioContent(), getAdminMessages()]);
  return <AdminDashboard initialContent={content} initialMessages={messages} userEmail={admin.email || 'Administrator'} />;
}
