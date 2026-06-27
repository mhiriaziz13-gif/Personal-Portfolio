-- Security hardening for the portfolio CMS.
-- Apply after the base schema. This migration is intentionally re-runnable.

create extension if not exists pgcrypto;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_admin() to service_role;

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  action_type text not null,
  entity_type text not null,
  entity_id text,
  created_at timestamptz not null default now()
);

alter table public.admin_audit_logs enable row level security;

drop policy if exists "Admin can read audit logs" on public.admin_audit_logs;
create policy "Admin can read audit logs" on public.admin_audit_logs for select using (public.is_admin());

alter table public.admins enable row level security;
alter table public.site_profile enable row level security;
alter table public.value_cards enable row level security;
alter table public.projects enable row level security;
alter table public.experiences enable row level security;
alter table public.skill_clusters enable row level security;
alter table public.education enable row level security;
alter table public.certifications enable row level security;
alter table public.resumes enable row level security;
alter table public.contact_messages enable row level security;

revoke all on function public.set_updated_at() from public;

-- Keep public portfolio media downloadable, but make direct authenticated writes admin-only
-- and constrained to the same file families accepted by the server upload route.
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "Admin can manage portfolio assets" on storage.objects;
drop policy if exists "Public can read portfolio assets" on storage.objects;
drop policy if exists "Admin can insert portfolio assets" on storage.objects;
drop policy if exists "Admin can update portfolio assets" on storage.objects;
drop policy if exists "Admin can delete portfolio assets" on storage.objects;

create policy "Public can read portfolio assets" on storage.objects for select
using (bucket_id = 'portfolio-assets');

create policy "Admin can insert portfolio assets" on storage.objects for insert
with check (
  bucket_id = 'portfolio-assets'
  and public.is_admin()
  and (
    name ~ '^portraits/[0-9a-f-]+\.(jpg|png|webp)$'
    or name ~ '^project-covers/[0-9a-f-]+\.(jpg|png|webp)$'
    or name ~ '^cvs/[0-9a-f-]+\.(pdf|docx)$'
  )
);

create policy "Admin can update portfolio assets" on storage.objects for update
using (bucket_id = 'portfolio-assets' and public.is_admin())
with check (bucket_id = 'portfolio-assets' and public.is_admin());

create policy "Admin can delete portfolio assets" on storage.objects for delete
using (bucket_id = 'portfolio-assets' and public.is_admin());
