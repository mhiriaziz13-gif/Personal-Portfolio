'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useState } from 'react';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { safeRedirectPath } from '@/lib/security/redirects';

export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  return <Suspense fallback={<main className="admin-login"><div className="admin-login-card"><p>Loading secure sign-in...</p></div></main>}><AdminLoginForm /></Suspense>;
}

function AdminLoginForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(params.get('denied') ? 'This account does not have administrator access.' : '');
  const [busy, setBusy] = useState(false);
  const configured = isSupabaseConfigured();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('');
    setBusy(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, next: safeRedirectPath(params.get('next'), '/admin') }),
      });
      const result = await response.json() as { message?: string; redirectTo?: string };
      if (!response.ok) throw new Error(result.message || 'Unable to sign in.');
      window.location.assign(safeRedirectPath(result.redirectTo, '/admin'));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to sign in with administrator access.');
    } finally { setBusy(false); }
  }

  return <main className="admin-login"><div className="admin-login-card"><Link href="/" className="admin-brand">AAM <span>Portfolio Manager</span></Link><p className="eyebrow">Private access</p><h1>Sign in to manage the portfolio.</h1>{!configured ? <p className="admin-login-error">Supabase is not configured yet. Follow <code>docs/SUPABASE_SETUP.md</code> first.</p> : <form className="admin-form" onSubmit={submit}><Field label="Email"><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></Field><Field label="Password"><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></Field><button className="button button-primary" type="submit" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</button><p className="admin-login-error" aria-live="polite">{status}</p></form>}<p className="admin-login-help">Only the Supabase account added to the <code>admins</code> table can access this page.</p></div></main>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="admin-field"><span>{label}</span>{children}</label>; }
