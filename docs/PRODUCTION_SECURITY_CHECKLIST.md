# Production Security Checklist

Use this before exposing the portfolio CMS in production.

## Supabase Dashboard

- Set **Authentication -> URL Configuration -> Site URL** to the exact production origin, for example `https://your-domain.com`.
- Add only required redirect URLs:
  - `https://your-domain.com/admin/login`
  - `https://your-domain.com/admin/security`
  - Preview URLs only if they are actively used.
- Avoid broad production wildcard redirects.
- Disable public sign-up for this single-owner CMS unless a future workflow truly needs it.
- Configure a strong password policy in **Authentication -> Passwords**.
- Enable leaked-password protection if available for the project.
- Require recent reauthentication for password changes where available.
- Configure custom SMTP so auth emails are deliverable and branded.
- Enable CAPTCHA/Cloudflare Turnstile in Supabase Auth if you expose any Supabase-hosted auth flows.
- Review and tune Supabase Auth rate limits for password sign-in and email flows.
- Enable TOTP MFA in Supabase Auth.
- Before setting `REQUIRE_ADMIN_MFA=true`, sign in at `/admin/security`, enroll a TOTP factor, and verify it.
- Keep a documented recovery path: disable `REQUIRE_ADMIN_MFA`, recover the Supabase Auth user, or update factors from the dashboard. Do not invent recovery codes.
- Run `supabase/migrations/202606270001_security_hardening.sql` on existing projects.
- Run Supabase Security Advisor and resolve relevant RLS/function/storage warnings.
- Confirm RLS is enabled on:
  - `admins`
  - `site_profile`
  - `value_cards`
  - `projects`
  - `experiences`
  - `skill_clusters`
  - `education`
  - `certifications`
  - `resumes`
  - `contact_messages`
  - `admin_audit_logs`
- Confirm `portfolio-assets` is public only because published portfolio assets must be downloadable.
- Confirm anonymous users cannot read unpublished rows, contact messages or audit logs.
- Rotate Supabase secrets immediately if any real secret was ever committed or shared.

## Vercel Dashboard

- Add environment variables separately for Production, Preview and Development.
- Production variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - `NEXT_PUBLIC_SITE_URL=https://your-domain.com`
  - `SUPABASE_SECRET_KEY`
  - `ALLOWED_ORIGINS=https://your-domain.com`
  - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` if Turnstile is enabled.
  - `TURNSTILE_SECRET_KEY` if Turnstile is enabled.
  - `REQUIRE_ADMIN_MFA=false` until TOTP is enrolled and verified, then `true`.
- Keep production secrets out of GitHub and local screenshots.
- Verify HTTPS and custom-domain configuration.
- Keep the production portfolio public for recruiters.
- Apply Deployment Protection to preview deployments only, not the production portfolio.
- Configure Vercel Firewall/WAF/rate-limit rules where available:
  - `/admin/login` and `/api/auth/login`: low burst, moderate sustained rate.
  - `/api/contact`: low burst per IP, higher challenge/deny thresholds.
  - `/api/admin/upload`: very low burst, authenticated traffic only.
  - `/api/admin`: low/moderate burst, authenticated traffic only.
  - `/api/auth/mfa/*`: very low burst.
- Review deployment logs after launch for repeated 401/403/429 responses, upload errors and contact spam.

## Cloudflare Turnstile

- Create a Turnstile widget for the production domain.
- Add the public site key to `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
- Add the secret key to `TURNSTILE_SECRET_KEY`.
- Do not expose the secret key in any variable starting with `NEXT_PUBLIC_`.
- Test the contact form once after deployment.

## GitHub

- Enable branch protection for `main`.
- Require pull request review if collaborators are added later.
- Enable Dependabot alerts and security updates.
- Enable secret scanning where available.
- Never commit `.env`, `.env.local`, production secrets or downloaded dashboard credentials.
- Review repository visibility and collaborator access.
- If a secret is ever committed, rotate it in Supabase/Turnstile/Vercel and invalidate old deployments.

## Release Gate

Before marking production ready:

- `npm run lint` passes.
- `npm run type-check` passes.
- `npm run build` passes.
- `npm audit` reports no unresolved actionable vulnerabilities.
- Public pages return `200`.
- `/admin/` redirects unauthenticated users to login.
- Admin routes and APIs include `noindex` and `no-store`.
- CV download URLs return `200`.
- Browser bundles do not contain server-only secret variable names or service-role code.
