import { NextResponse } from 'next/server';
import { AdminAuthError, getVerifiedAdmin } from '@/lib/security/admin-auth';
import { assertSameOrigin, clientIp, isRequestSecurityError, jsonError, noStoreHeaders } from '@/lib/security/http';
import { rateLimit } from '@/lib/security/rate-limit';
import { certificationPayload, educationPayload, experiencePayload, profilePayload, projectPayload, resumePayload, skillPayload, valueCardPayload } from '@/lib/security/admin-validation';
import { cleanString, uuid } from '@/lib/security/validation';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const deleteTargets = {
  projects: 'projects',
  experiences: 'experiences',
  value_cards: 'value_cards',
  skill_clusters: 'skill_clusters',
  education: 'education',
  certifications: 'certifications',
  resumes: 'resumes',
  contact_messages: 'contact_messages',
} as const;

type DeleteTarget = keyof typeof deleteTargets;

async function audit(actorUserId: string, action: string, entityType: string, entityId?: string) {
  try {
    await createAdminClient().from('admin_audit_logs').insert({
      actor_user_id: actorUserId,
      action_type: action,
      entity_type: entityType,
      entity_id: entityId || null,
    });
  } catch {
    // The audit table is created by the security migration. Do not break admin operations if it has not been applied yet.
  }
}

async function upsert(table: string, id: string | undefined, payload: Record<string, unknown>) {
  const supabase = createAdminClient();
  if (id) return supabase.from(table).update(payload).eq('id', id).select('id').single();
  return supabase.from(table).insert(payload).select('id').single();
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    if (Number(request.headers.get('content-length') || 0) > 80_000) return jsonError('Request is too large.', 413);

    const auth = await getVerifiedAdmin();
    const limit = rateLimit(`admin-mutation:${auth.userId}:${clientIp(request)}`, 120, 10 * 60 * 1000);
    if (!limit.allowed) return jsonError('Too many admin requests. Please wait and try again.', 429);

    const body = await request.json() as Record<string, unknown>;
    const action = cleanString(body.action, 80);
    const data = body.data;

    let result: { data: { id?: string } | null; error: unknown };
    let entityType = action;
    let entityId: string | undefined;

    switch (action) {
      case 'save-profile': {
        result = await createAdminClient().from('site_profile').upsert(profilePayload(data)).select('id').single();
        entityType = 'site_profile';
        entityId = '1';
        break;
      }
      case 'save-project': {
        const next = projectPayload(data);
        result = await upsert('projects', next.id, next.payload);
        entityType = 'projects';
        entityId = next.id || result.data?.id;
        break;
      }
      case 'save-experience': {
        const next = experiencePayload(data);
        result = await upsert('experiences', next.id, next.payload);
        entityType = 'experiences';
        entityId = next.id || result.data?.id;
        break;
      }
      case 'save-value-card': {
        const next = valueCardPayload(data);
        result = await upsert('value_cards', next.id, next.payload);
        entityType = 'value_cards';
        entityId = next.id || result.data?.id;
        break;
      }
      case 'save-skill': {
        const next = skillPayload(data);
        result = await upsert('skill_clusters', next.id, next.payload);
        entityType = 'skill_clusters';
        entityId = next.id || result.data?.id;
        break;
      }
      case 'save-education': {
        const next = educationPayload(data);
        result = await upsert('education', next.id, next.payload);
        entityType = 'education';
        entityId = next.id || result.data?.id;
        break;
      }
      case 'save-certification': {
        const next = certificationPayload(data);
        result = await upsert('certifications', next.id, next.payload);
        entityType = 'certifications';
        entityId = next.id || result.data?.id;
        break;
      }
      case 'save-resume': {
        const next = resumePayload(data);
        result = await upsert('resumes', next.id, next.payload);
        entityType = 'resumes';
        entityId = next.id || result.data?.id;
        break;
      }
      case 'delete': {
        const target = cleanString(body.entity, 80) as DeleteTarget;
        if (!deleteTargets[target]) throw new Error('Invalid delete target.');
        entityId = uuid(body.id);
        result = await createAdminClient().from(deleteTargets[target]).delete().eq('id', entityId).select('id').single();
        entityType = target;
        break;
      }
      case 'mark-message': {
        entityId = uuid(body.id);
        const isRead = Boolean(body.isRead);
        result = await createAdminClient().from('contact_messages').update({ is_read: isRead }).eq('id', entityId).select('id').single();
        entityType = 'contact_messages';
        break;
      }
      default:
        return jsonError('Unknown admin action.', 400);
    }

    if (result.error) throw result.error;
    await audit(auth.userId, action, entityType, entityId);

    return NextResponse.json({ ok: true, id: entityId || result.data?.id || null }, { headers: noStoreHeaders() });
  } catch (error) {
    if (isRequestSecurityError(error)) return jsonError('Invalid request.', error.status);
    if (error instanceof AdminAuthError) return jsonError(error.message, error.status);
    return jsonError('Unable to save the requested change.', 400);
  }
}
