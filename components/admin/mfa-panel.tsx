'use client';

import { useEffect, useState } from 'react';

type MfaStatus = {
  currentLevel: string | null;
  nextLevel: string | null;
  factors: Array<{ id: string; status: string; friendlyName?: string }>;
  enforcementEnabled: boolean;
};

type Enrollment = { factorId: string; qrCode: string; secret: string } | null;

async function readJson<T>(response: Response) {
  const payload = await response.json().catch(() => ({})) as { message?: string } & T;
  if (!response.ok) throw new Error(payload.message || 'Unable to complete the request.');
  return payload;
}

export function MfaPanel() {
  const [status, setStatus] = useState<MfaStatus | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment>(null);
  const [code, setCode] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  async function loadStatus() {
    const response = await fetch('/api/auth/mfa/status', { cache: 'no-store' });
    setStatus(await readJson<MfaStatus>(response));
  }

  useEffect(() => {
    loadStatus().catch((error) => setNotice(error instanceof Error ? error.message : 'Unable to load MFA status.'));
  }, []);

  async function enroll() {
    setBusy(true);
    setNotice('');
    try {
      const response = await fetch('/api/auth/mfa/enroll', { method: 'POST' });
      setEnrollment(await readJson<NonNullable<Enrollment>>(response));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to start MFA enrollment.');
    } finally {
      setBusy(false);
    }
  }

  async function verify() {
    if (!enrollment) return;
    setBusy(true);
    setNotice('');
    try {
      const response = await fetch('/api/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ factorId: enrollment.factorId, code }),
      });
      await readJson(response);
      setEnrollment(null);
      setCode('');
      setNotice('MFA is verified for this session.');
      await loadStatus();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to verify MFA.');
    } finally {
      setBusy(false);
    }
  }

  return <section className="admin-section"><p className="eyebrow">Admin security</p><h1>Multi-factor authentication</h1><p className="admin-intro">Enroll a TOTP authenticator app before enabling MFA enforcement in production.</p>{status && <div className="admin-item compact"><div><h3>Current session</h3><p>Current level: {status.currentLevel || 'unknown'} | Next level: {status.nextLevel || 'unknown'} | Enforcement: {status.enforcementEnabled ? 'enabled' : 'off'}</p><p>{status.factors.length ? `${status.factors.length} TOTP factor(s) on this account.` : 'No TOTP factor reported for this account yet.'}</p></div></div>}{!enrollment && <button className="button button-primary" type="button" onClick={enroll} disabled={busy}>{busy ? 'Starting...' : 'Enroll Authenticator App'}</button>}{enrollment && <div className="admin-editor"><h2>Scan and verify</h2><p className="admin-intro">Scan the QR code with an authenticator app, then enter the 6-digit code.</p><img src={enrollment.qrCode} alt="TOTP QR code" width={210} height={210} /><p><strong>Manual secret:</strong> {enrollment.secret}</p><div className="admin-form-grid"><label className="admin-field"><span>6-digit code</span><input inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} /></label></div><div className="admin-form-actions"><button className="button button-primary" type="button" disabled={busy || code.length !== 6} onClick={verify}>{busy ? 'Verifying...' : 'Verify MFA'}</button></div></div>}<p className="admin-login-error" aria-live="polite">{notice}</p></section>;
}
