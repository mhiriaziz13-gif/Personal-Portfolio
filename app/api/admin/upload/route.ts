import { NextResponse } from 'next/server';
import { AdminAuthError, getVerifiedAdmin } from '@/lib/security/admin-auth';
import { assertSameOrigin, clientIp, isRequestSecurityError, jsonError, noStoreHeaders } from '@/lib/security/http';
import { rateLimit } from '@/lib/security/rate-limit';
import { cleanString } from '@/lib/security/validation';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const uploadKinds = {
  portrait: { folder: 'portraits', extensions: ['jpg', 'jpeg', 'png', 'webp'], mimes: ['image/jpeg', 'image/png', 'image/webp'], maxBytes: 2_000_000 },
  'project-cover': { folder: 'project-covers', extensions: ['jpg', 'jpeg', 'png', 'webp'], mimes: ['image/jpeg', 'image/png', 'image/webp'], maxBytes: 2_000_000 },
  'cv-pdf': { folder: 'cvs', extensions: ['pdf'], mimes: ['application/pdf'], maxBytes: 5_000_000 },
  'cv-docx': { folder: 'cvs', extensions: ['docx'], mimes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'], maxBytes: 5_000_000 },
} as const;

function extension(name: string) {
  return name.includes('.') ? name.split('.').pop()!.toLowerCase() : '';
}

function hasMagic(bytes: Uint8Array, ext: string) {
  if (ext === 'pdf') return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
  if (ext === 'png') return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  if (ext === 'jpg' || ext === 'jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (ext === 'webp') return bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
  if (ext === 'docx') return bytes[0] === 0x50 && bytes[1] === 0x4b;
  return false;
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const auth = await getVerifiedAdmin();
    const limit = rateLimit(`admin-upload:${auth.userId}:${clientIp(request)}`, 30, 10 * 60 * 1000);
    if (!limit.allowed) return jsonError('Too many uploads. Please wait and try again.', 429);

    const form = await request.formData();
    const kind = cleanString(form.get('kind'), 40) as keyof typeof uploadKinds;
    const config = uploadKinds[kind];
    const file = form.get('file');
    if (!config || !(file instanceof File)) return jsonError('Invalid upload.', 400);

    const ext = extension(file.name);
    if (!(config.extensions as readonly string[]).includes(ext) || !(config.mimes as readonly string[]).includes(file.type)) {
      return jsonError('Unsupported file type.', 400);
    }
    if (file.size <= 0 || file.size > config.maxBytes) return jsonError('File is too large.', 413);

    const bytes = new Uint8Array(await file.arrayBuffer());
    if (!hasMagic(bytes, ext)) return jsonError('File content does not match the selected type.', 400);

    const path = `${config.folder}/${crypto.randomUUID()}.${ext === 'jpeg' ? 'jpg' : ext}`;
    const supabase = createAdminClient();
    const { error } = await supabase.storage.from('portfolio-assets').upload(path, bytes, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });
    if (error) throw error;

    const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(path);
    try {
      await supabase.from('admin_audit_logs').insert({
        actor_user_id: auth.userId,
        action_type: 'upload',
        entity_type: kind,
        entity_id: path,
      }).throwOnError();
    } catch {
      // The audit table is created by the security migration. Do not break uploads if it has not been applied yet.
    }

    return NextResponse.json({ publicUrl: data.publicUrl, sizeLabel: `${Math.ceil(file.size / 1024)} KB` }, { headers: noStoreHeaders() });
  } catch (error) {
    if (isRequestSecurityError(error)) return jsonError('Invalid request.', error.status);
    if (error instanceof AdminAuthError) return jsonError(error.message, error.status);
    return jsonError('Unable to upload this file.', 400);
  }
}
