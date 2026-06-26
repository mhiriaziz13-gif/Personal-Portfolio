import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

function cleanText(value: unknown, limit: number) {
  return typeof value === 'string' ? value.trim().slice(0, limit) : '';
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const name = cleanText(body.name, 120);
    const email = cleanText(body.email, 254).toLowerCase();
    const message = cleanText(body.message, 5000);
    const honeypot = cleanText(body.website, 200);

    if (honeypot) return NextResponse.json({ message: 'Thank you.' }, { status: 200 });
    if (!name || !validEmail(email) || message.length < 8) {
      return NextResponse.json({ message: 'Please provide a valid name, email address and message.' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from('contact_messages').insert({ name, email, message });
    if (error) throw error;

    return NextResponse.json({ message: 'Message received.' }, { status: 201 });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ message: 'Unable to send your message right now. Please email directly instead.' }, { status: 500 });
  }
}
