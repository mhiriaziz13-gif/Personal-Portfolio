# Security Hardening Audit

Date: 2026-06-27

## Current Security Architecture

The portfolio is a Next.js App Router application backed by Supabase Auth, PostgreSQL, RLS and Storage.

- Public pages use server-rendered CMS reads and explicitly filter collections to `is_published = true`.
- Private admin pages live under `/admin` and are protected by `proxy.ts`, Supabase SSR cookies, `supabase.auth.getClaims()`, and an explicit row in `public.admins`.
- Admin mutations now go through server route handlers under `/api/admin` and `/api/admin/upload`.
- The contact form writes through `/api/contact`; anonymous direct database writes are not exposed.
- Server-only Supabase access uses `SUPABASE_SECRET_KEY` from `lib/supabase/admin.ts`; the browser uses only public Supabase values.

## Threat Model

Primary risks for this portfolio CMS:

- Unauthorized editing by authenticated but non-admin users.
- Session spoofing or trusting unverified sessions in server code.
- Public leakage of drafts, contact messages, audit logs or private admin data.
- CSRF against admin mutations, uploads, logout, login and MFA setup.
- Unsafe file uploads that lead to SVG/HTML/script execution or overwritten objects.
- Open redirects through `next` or logout destinations.
- Contact-form spam and high-volume request abuse.
- Incorrect caching or indexing of authenticated pages.
- Exposed service-role/secret keys in browser code or Git.
- Weak RLS/storage policies that rely on client UI hiding controls.

## Reviewed Files And Routes

Reviewed:

- `app/`: public pages, `/admin`, `/admin/login`, `/admin/security`, route handlers and metadata/robots.
- `components/`: admin dashboard, contact form, site shell and rendering patterns.
- `lib/`: CMS fetchers, Supabase clients, proxy/session handling and new security utilities.
- `supabase/`: schema, seed, admin creation SQL and storage/RLS policies.
- `proxy.ts`, `next.config.ts`, `.env.example`, `.gitignore`, `package.json`, README/setup docs.
- API surfaces: `/api/contact`, `/api/admin`, `/api/admin/upload`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/mfa/*`.
- Secret/dependency checks: current tracked files, browser bundle chunks, package audit, and limited Git history metadata.

## Findings By Severity

### Critical

No confirmed critical secret exposure or unauthenticated admin write path was found in the current working tree.

### High

- Admin writes and uploads were previously performed directly from the browser Supabase client in `components/admin/admin-dashboard.tsx`. RLS helped, but there was no server-side origin check, centralized validation, upload inspection or audit logging. Fixed by moving mutations to `/api/admin` and `/api/admin/upload`.
- Server-sensitive admin reads in CMS helpers depended on page-level checks. Fixed by requiring verified admin authorization inside `getAdminPortfolioContent()` and `getAdminMessages()`.
- Admin login accepted a client-side `next` value for post-login navigation. Fixed with a shared safe redirect utility used by login, logout and proxy redirects.

### Medium

- Contact form had validation but no origin check, rate limit, Turnstile support or stronger spam handling. Fixed in `/api/contact` and `components/contact-form.tsx`.
- Uploads accepted files through the client storage path. Fixed with server-side MIME, extension, magic-byte, size and UUID path validation.
- Admin/API responses lacked a consistent security-header and no-store/noindex posture. Fixed in `next.config.ts` and proxy/route responses.
- MFA was not prepared for the admin account. Added `/admin/security` and Supabase TOTP MFA enroll/verify/status routes with `REQUIRE_ADMIN_MFA` rollout flag.
- Storage policy allowed broad admin management of the public bucket. Replaced with public read plus scoped admin insert/update/delete policies and path constraints.

### Low

- `.env.example` did not list the new production controls. Updated.
- `robots.ts` disallow rules were minimal. Expanded to `/admin/` and `/api/` while documenting that robots is not access control.
- README used the older `SUPABASE_SERVICE_ROLE_KEY` name while code uses `SUPABASE_SECRET_KEY`. Updated.

## Fixes Implemented

- Added `lib/security/redirects.ts`, `http.ts`, `rate-limit.ts`, `validation.ts`, `admin-auth.ts`, and `admin-validation.ts`.
- Configured Supabase SSR cookie options: `HttpOnly`, `Secure` in production, `SameSite=Lax`, path `/`.
- Switched server authorization decisions to `supabase.auth.getClaims()` plus `public.admins` checks.
- Added server admin mutation route `/api/admin`.
- Added server upload route `/api/admin/upload`.
- Added server auth routes `/api/auth/login` and `/api/auth/logout`.
- Added MFA status/enroll/verify routes and `/admin/security`.
- Added request origin validation and generic request-security errors.
- Added in-memory app-level rate limits for contact, login, admin mutations, uploads and MFA flows.
- Added optional Cloudflare Turnstile support.
- Escaped JSON-LD serialization in `app/layout.tsx` before using `dangerouslySetInnerHTML`.
- Added security headers, CSP, HSTS in production, noindex/no-store headers for admin/API routes.
- Added `public.admin_audit_logs` table and admin-only RLS.
- Hardened `public.is_admin()` with fixed `search_path` and restricted execute grants.
- Hardened storage policies for `portfolio-assets`.
- Added `supabase/migrations/202606270001_security_hardening.sql`.

## Risks Intentionally Not Changed

- The `portfolio-assets` bucket remains public because portrait images, project covers and published CV files must be publicly downloadable.
- Existing files in `public/cv` remain public static files because the public resume page is meant for recruiters.
- CSP still uses `'unsafe-inline'` for scripts/styles to avoid breaking current Next.js inline runtime behavior, Google Analytics/Vercel scripts, JSON-LD and Turnstile. It does not allow `'unsafe-eval'`. A nonce-based CSP would be stronger but needs a separate rendering pass.
- Rate limiting is in-memory and practical for a small portfolio, but it is not durable across serverless instances. Add Vercel Firewall/WAF rules in production.
- Authenticated admin actions were not manually tested with real credentials in this run. Unauthenticated denial, route behavior, build and static checks were verified.

## Manual Settings Required

See `docs/PRODUCTION_SECURITY_CHECKLIST.md` for the full checklist. Required before production:

- Supabase: run the hardening migration, disable public signup, configure exact Site URL and redirect URLs, enable password protections, enable TOTP MFA, review RLS/storage policies and run Security Advisor.
- Vercel: set `NEXT_PUBLIC_SITE_URL`, `ALLOWED_ORIGINS`, Supabase keys, Turnstile values, and rate-limit/WAF rules.
- GitHub: enable branch protection, Dependabot alerts/security updates and secret scanning.

## Testing Evidence

Commands run:

- `npm run lint`: passed. This project maps lint to `tsc --noEmit`.
- `npm run type-check`: passed.
- `npm run build`: passed after running outside the sandbox because the sandboxed build hit Windows `spawn EPERM`.
- `npm audit --omit=dev`: `found 0 vulnerabilities`.
- `npm audit`: `found 0 vulnerabilities`.

Runtime probes against `next start -p 3010`:

- `GET /`: `200`.
- `GET /resume/`: `200`.
- `GET /admin/` without auth: `307` to `/admin/login/?next=%2Fadmin%2F`.
- `GET /admin/login/`: `200` with `X-Robots-Tag: noindex, nofollow` and `Cache-Control: no-store`.
- `GET /cv/Ahmed_Aziz_Mhiri_CV_Francais.pdf`: `200`.
- `POST /api/contact/` with no `Origin`: `403`.
- `POST /api/contact/` with invalid form data and allowed origin: `400`.
- `rg` over `.next/static` for `SUPABASE_SECRET_KEY`, `TURNSTILE_SECRET_KEY`, `service_role`, `createAdminClient`: no matches.

Secret checks:

- Current tracked-file pattern search found only placeholders/code references, not real Supabase, Turnstile or payment secrets.
- `.env`, `.env.local` and `.env.*.local` remain ignored.
- Git history metadata grep showed commits containing secret-related variable names, consistent with docs/placeholders. Real values were not printed during this audit. Rotate immediately if any real secret was ever committed.

## Security Result

Admin access is now protected by verified Supabase Auth, an explicit `admins` authorization check, no-store dynamic routes, repeated server-side authorization, RLS/storage policies and server-side validation. The admin URL itself is not treated as a security control.
