import { NextResponse } from 'next/server';
import { assertSameOrigin, clientIp, isRequestSecurityError, jsonError, noStoreHeaders } from '@/lib/security/http';
import { rateLimit } from '@/lib/security/rate-limit';
import { cleanLongText, cleanString, email as cleanEmail } from '@/lib/security/validation';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const form = new FormData();
    form.set('secret', secret);
    form.set('response', token);
    if (ip !== 'unknown') form.set('remoteip', ip);
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
    const result = await response.json().catch(() => ({})) as { success?: boolean };
    return Boolean(result.success);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    if (Number(request.headers.get('content-length') || 0) > 12_000) return jsonError('Unable to send your message.', 413);
    const ip = clientIp(request);
    const limit = rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
    if (!limit.allowed) return jsonError('Too many messages. Please try again later.', 429);

    const body = await request.json().catch(() => null) as Record<string, unknown> | null;
    if (!body) return jsonError('Please provide a valid name, email address and message.', 400);

    let name = '';
    let email = '';
    let message = '';
    let honeypot = '';
    let turnstileToken = '';
    try {
      name = cleanString(body.name, 120);
      email = cleanEmail(body.email);
      message = cleanLongText(body.message, 5000);
      honeypot = cleanString(body.website, 200, false);
      turnstileToken = cleanString(body.turnstileToken, 2000, false);
    } catch {
      return jsonError('Please provide a valid name, email address and message.', 400);
    }

    if (honeypot) return NextResponse.json({ message: 'Thank you.' }, { status: 200, headers: noStoreHeaders() });
    if (name.length < 2 || message.length < 8 || message.length > 5000) return jsonError('Please provide a valid name, email address and message.', 400);
    if (/(https?:\/\/|www\.)/i.test(message) && message.length < 80) return jsonError('Please provide a little more context in your message.', 400);
    if (!await verifyTurnstile(turnstileToken, ip)) return jsonError('Please complete the anti-spam check.', 400);

    const supabase = createAdminClient();
    const { error } = await supabase.from('contact_messages').insert({ name, email, message });
    if (error) throw error;

    return NextResponse.json({ message: 'Message received.' }, { status: 201, headers: noStoreHeaders() });
  } catch (error) {
    if (isRequestSecurityError(error)) return jsonError('Invalid request.', error.status);
    console.error('Contact form error:', error);
    return jsonError('Unable to send your message right now. Please email directly instead.', 500);
  }
}
