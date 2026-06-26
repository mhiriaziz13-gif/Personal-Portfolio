import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { getAdminMessages, getAdminPortfolioContent, isCurrentUserAdmin } from '@/lib/cms';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Portfolio Manager' };

export default async function AdminPage() {
  if (!isSupabaseConfigured()) return <main className="admin-setup-screen"><p className="eyebrow">Configuration required</p><h1>Connect the content backend before using the portfolio manager.</h1><p>Add the required local environment values, run the setup SQL files, then restart the Next.js server.</p></main>;
  if (!await isCurrentUserAdmin()) redirect('/admin/login?denied=1');
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [content, messages] = await Promise.all([getAdminPortfolioContent(), getAdminMessages()]);
  return <AdminDashboard initialContent={content} initialMessages={messages} userEmail={user?.email || 'Administrator'} />;
}
