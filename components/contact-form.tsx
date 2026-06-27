'use client';

import Script from 'next/script';
import { FormEvent, useState } from 'react';

export function ContactForm({ turnstileSiteKey, nonce }: { turnstileSiteKey?: string; nonce?: string }) {
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('');
    setIsSubmitting(true);
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: data.get('name'), email: data.get('email'), message: data.get('message'), website: data.get('website'), turnstileToken: data.get('cf-turnstile-response') }) });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message || 'Unable to send your message.');
      form.reset();
      setStatus('Thank you. Your message has been sent.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to send your message. Please email directly instead.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return <form className="contact-form" onSubmit={handleSubmit}>
    {turnstileSiteKey && <Script nonce={nonce} src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer strategy="afterInteractive" />}
    <p className="form-note">Share the role, project context or professional topic. Please avoid confidential business information.</p>
    <div className="form-row"><label htmlFor="name">Name</label><input id="name" name="name" autoComplete="name" required maxLength={120} /></div>
    <div className="form-row"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required maxLength={254} /></div>
    <div className="form-row"><label htmlFor="message">Message</label><textarea id="message" name="message" rows={6} required minLength={8} maxLength={5000} /></div>
    {turnstileSiteKey && <div className="cf-turnstile" data-sitekey={turnstileSiteKey} />}
    <div className="form-honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
    <button className="button button-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Send Message'}</button>
    <p className="form-status" aria-live="polite">{status}</p>
  </form>;
}
