-- Ahmed Aziz Mhiri portfolio CMS
-- Run this file once in Supabase: SQL Editor > New query > paste > Run.
-- It creates the database, row-level security, and the public storage bucket.

create extension if not exists pgcrypto;

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create table if not exists public.site_profile (
  id integer primary key default 1 check (id = 1),
  name text not null,
  location text not null,
  email text not null,
  linkedin_url text not null,
  headline text not null,
  homepage_title text not null,
  tagline text not null,
  availability text not null,
  summary text not null,
  about_heading text not null,
  about_body text not null,
  long_term_objective text not null,
  target_countries jsonb not null default '[]'::jsonb,
  portrait_url text not null default '/images/ahmed-portrait.png',
  updated_at timestamptz not null default now()
);

create table if not exists public.value_cards (
  id uuid primary key default gen_random_uuid(),
  kicker text not null,
  title text not null,
  body text not null,
  detail text not null,
  sort_order integer not null default 100,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  industry text not null,
  challenge text not null,
  impact text not null,
  contributions jsonb not null default '[]'::jsonb,
  business_value jsonb not null default '[]'::jsonb,
  workflow jsonb not null default '[]'::jsonb,
  tools jsonb not null default '[]'::jsonb,
  cover text not null default 'automation' check (cover in ('automation', 'journey', 'architecture')),
  cover_image_url text,
  confidentiality text,
  before_after jsonb,
  sort_order integer not null default 100,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  organisation text not null,
  role text not null,
  date_label text not null,
  location text not null,
  summary text not null,
  responsibilities jsonb not null default '[]'::jsonb,
  tools jsonb not null default '[]'::jsonb,
  sort_order integer not null default 100,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skill_clusters (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  items jsonb not null default '[]'::jsonb,
  sort_order integer not null default 100,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organisation text not null,
  date_label text not null,
  detail text not null default '',
  sort_order integer not null default 100,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null default '',
  detail text not null default '',
  sort_order integer not null default 100,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  language text not null,
  intended_use text not null,
  description text not null,
  pdf_url text not null,
  docx_url text not null,
  pdf_size text not null default '',
  docx_size text not null default '',
  sort_order integer not null default 100,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array['site_profile', 'value_cards', 'projects', 'experiences', 'skill_clusters', 'education', 'certifications', 'resumes']
  loop
    execute format('drop trigger if exists %I on public.%I', 'set_' || t || '_updated_at', t);
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', 'set_' || t || '_updated_at', t);
  end loop;
end $$;

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

-- Re-runnable policies. Public visitors can only see published content.
drop policy if exists "Admins can see their own admin record" on public.admins;
create policy "Admins can see their own admin record" on public.admins for select using (auth.uid() = user_id);

drop policy if exists "Public can read profile" on public.site_profile;
create policy "Public can read profile" on public.site_profile for select using (true);
drop policy if exists "Admin can manage profile" on public.site_profile;
create policy "Admin can manage profile" on public.site_profile for all using (public.is_admin()) with check (public.is_admin());

-- Content collections
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['value_cards', 'projects', 'experiences', 'skill_clusters', 'education', 'certifications', 'resumes']
  LOOP
    EXECUTE format('drop policy if exists "Public can read published %s" on public.%I', t, t);
    EXECUTE format('create policy "Public can read published %s" on public.%I for select using (is_published = true)', t, t);
    EXECUTE format('drop policy if exists "Admin can manage %s" on public.%I', t, t);
    EXECUTE format('create policy "Admin can manage %s" on public.%I for all using (public.is_admin()) with check (public.is_admin())', t, t);
  END LOOP;
END $$;

drop policy if exists "Admin can read messages" on public.contact_messages;
create policy "Admin can read messages" on public.contact_messages for select using (public.is_admin());
drop policy if exists "Admin can update messages" on public.contact_messages;
create policy "Admin can update messages" on public.contact_messages for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admin can delete messages" on public.contact_messages;
create policy "Admin can delete messages" on public.contact_messages for delete using (public.is_admin());

-- A public bucket is intentional: uploaded portrait, project cover and CV files must be downloadable from the public portfolio.
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "Admin can manage portfolio assets" on storage.objects;
create policy "Admin can manage portfolio assets" on storage.objects for all
using (bucket_id = 'portfolio-assets' and public.is_admin())
with check (bucket_id = 'portfolio-assets' and public.is_admin());
