# Security Regression Tests

Run this checklist before production releases and after changes to auth, admin, uploads, contact, Supabase policies or deployment config.

## Automated Checks

```bash
npm run lint
npm run type-check
npm run build
npm audit
```

Expected result: all pass. If `next build` hits a local Windows `spawn EPERM` under a sandbox, rerun outside the sandbox and record the result.

## Public Access

- Public homepage returns `200`.
- `/about/`, `/projects/`, `/experience/`, `/resume/`, `/contact/` return `200`.
- Published project detail pages return `200`.
- Draft or unpublished content is not visible to anonymous visitors.
- CV downloads under `/cv/` return `200`, including:
  - `/cv/Ahmed_Aziz_Mhiri_CV_Francais.pdf`
  - `/cv/Ahmed_Aziz_Mhiri_CV_Francais.docx`

## Admin Access

- Anonymous `GET /admin/` redirects to `/admin/login/?next=%2Fadmin%2F`.
- `/admin/login/` has `X-Robots-Tag: noindex, nofollow`.
- `/admin/login/` has `Cache-Control: no-store`.
- A signed-in Supabase user who is not in `public.admins` cannot access `/admin/` or admin APIs.
- An approved admin can sign in and load the dashboard.
- Logout returns only an internal redirect target and clears the Supabase session.
- External redirect attempts such as `?next=https://example.com` fall back to `/admin`.

## Admin Mutations

- All create/update/delete/publish/unpublish operations use `/api/admin`.
- Direct client-side writes with the publishable key are not used for admin content.
- Admin mutations without `Origin` in production return `403`.
- Admin mutations from an unapproved user return `401` or `403`.
- Successful admin mutations write an audit event to `public.admin_audit_logs` after the migration is applied.
- Audit logs are readable only by admins.

## Uploads

- Uploads use `/api/admin/upload`.
- Anonymous and non-admin uploads fail.
- Uploads without `Origin` in production return `403`.
- Allowed image files: JPEG, PNG, WebP.
- Allowed document files: PDF, DOCX.
- SVG, HTML, JavaScript, oversized files and mismatched extension/MIME/magic bytes are rejected.
- Uploaded object paths use generated UUID filenames under `portraits/`, `project-covers/` or `cvs/`.
- Existing public project images and CV downloads still work.

## Contact Form

- Missing `Origin` in production returns `403`.
- Invalid email or too-short message returns `400`.
- Oversized body returns `413`.
- Honeypot submissions return a generic success without inserting a message.
- Short link-only spam is rejected.
- Repeated submissions from the same IP eventually return `429`.
- If `TURNSTILE_SECRET_KEY` is set, missing/invalid Turnstile tokens are rejected.
- Turnstile secret never appears in the browser bundle.

## Headers And Indexing

- Public pages include:
  - `Content-Security-Policy`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy`
  - `Permissions-Policy`
  - `X-Frame-Options: DENY`
  - `Cross-Origin-Opener-Policy`
  - `Cross-Origin-Resource-Policy`
  - production `Strict-Transport-Security`
- Admin pages and APIs additionally include:
  - `X-Robots-Tag: noindex, nofollow`
  - `Cache-Control: no-store`
- `robots.txt` disallows `/admin`, `/admin/`, `/api` and `/api/`.

## Secrets

- `.env`, `.env.local` and `.env.*.local` are ignored by Git.
- `.env.example` contains names/placeholders only.
- Search browser chunks:

```bash
rg -n "SUPABASE_SECRET_KEY|TURNSTILE_SECRET_KEY|service_role|createAdminClient" .next/static
```

Expected result: no matches.

## RLS And Storage

- Anonymous users can read only intentionally public content and published rows.
- Anonymous users cannot read `contact_messages` or `admin_audit_logs`.
- Authenticated non-admin users cannot write portfolio content.
- `public.is_admin()` has a fixed `search_path` and restricted execute grants.
- `portfolio-assets` allows public reads but admin-only writes.
- Storage insert policy constrains new object paths to approved folders and file extensions.

## MFA

- `/admin/security/` is reachable by an approved admin with a normal authenticated session.
- Admin can enroll a TOTP factor and verify a 6-digit code.
- `REQUIRE_ADMIN_MFA=false` does not lock out the admin before enrollment.
- After enrollment and verification, setting `REQUIRE_ADMIN_MFA=true` blocks `/admin/` until the session reaches `aal2`.
