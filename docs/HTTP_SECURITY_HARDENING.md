# HTTP Security Hardening

Date: 2026-06-27

## Initial Result

HTTP Observatory reported:

- Grade: B
- Score: 70 / 100
- CSP failure: unsafe directives including `script-src 'unsafe-inline'`, broad sources and insufficient script restrictions.
- Cookie failure: one or more cookies missing `Secure`.
- Referrer Policy failure: policy considered too permissive.
- CORP missing.
- HSTS, `nosniff`, clickjacking protection, redirects and CORS passed.

## Production Header Inspection

Commands requested:

```bash
curl -I https://personal-portfolio-c9phenztm-ahmed-aziz-mhiri.vercel.app/
curl -I https://personal-portfolio-c9phenztm-ahmed-aziz-mhiri.vercel.app/admin/login
```

Observed result on 2026-06-27: both routes were intercepted by Vercel Deployment Protection / SSO before the app response was served.

Homepage response:

```text
HTTP/1.1 302 Found
Cache-Control: no-store, max-age=0
Location: https://vercel.com/sso-api?...
Server: Vercel
Set-Cookie: _vercel_sso_nonce=...; Max-Age=3600; Path=/; Secure; HttpOnly; SameSite=Lax
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: DENY
X-Robots-Tag: noindex
```

Admin login response:

```text
HTTP/1.1 302 Found
Cache-Control: no-store, max-age=0
Location: https://vercel.com/sso-api?...
Server: Vercel
Set-Cookie: _vercel_sso_nonce=...; Max-Age=3600; Path=/; Secure; HttpOnly; SameSite=Lax
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: DENY
X-Robots-Tag: noindex
```

Cookie audit from the visible production response: `_vercel_sso_nonce` is controlled by Vercel and already has `Secure`, `HttpOnly` and `SameSite=Lax`. The app's own headers cannot be confirmed from that protected URL until Deployment Protection is disabled for the production portfolio or a public production domain is scanned.

## Issues Found In Source

The previous app CSP in `next.config.ts` included:

```text
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com https://challenges.cloudflare.com
style-src 'self' 'unsafe-inline'
img-src 'self' data: blob: https:
font-src 'self' data:
connect-src 'self' https://PROJECT.supabase.co https://*.supabase.co ...
```

Problems:

- `script-src` allowed `'unsafe-inline'`.
- `img-src` allowed broad `https:`.
- `connect-src` allowed broad `https://*.supabase.co` instead of the configured project origin.
- `style-src` used `'unsafe-inline'`.
- Two React inline style attributes were present in `components/site-header.tsx` and `components/project-cover.tsx`.
- CORP was already present locally from the prior hardening pass, but this change keeps and documents it.

## Headers After Hardening

App responses now get a nonce-based CSP from `proxy.ts`, not a static CSP from `next.config.ts`.

Local production homepage header, normalized:

```text
Content-Security-Policy:
  default-src 'self';
  base-uri 'self';
  object-src 'none';
  frame-ancestors 'none';
  form-action 'self';
  script-src 'self' 'nonce-{per-request}' https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com https://challenges.cloudflare.com;
  style-src 'self' 'nonce-{per-request}';
  img-src 'self' data: blob: https://PROJECT.supabase.co https://www.google-analytics.com https://www.googletagmanager.com;
  font-src 'self';
  connect-src 'self' https://PROJECT.supabase.co wss://PROJECT.supabase.co https://www.google-analytics.com https://region1.google-analytics.com https://va.vercel-scripts.com https://vitals.vercel-insights.com https://challenges.cloudflare.com;
  frame-src https://challenges.cloudflare.com;
  child-src https://challenges.cloudflare.com;
  worker-src 'self' blob:;
  media-src 'self';
  manifest-src 'self';
  upgrade-insecure-requests
```

Additional headers:

```text
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=(), browsing-topics=()
X-Frame-Options: DENY
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: unsafe-none
Cross-Origin-Resource-Policy: same-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

Admin and API routes additionally receive:

```text
X-Robots-Tag: noindex, nofollow, noarchive
Cache-Control: no-store, private, max-age=0
Pragma: no-cache
Expires: 0
```

## CSP Source Allowlist

- `'self'`: required for Next.js scripts, CSS chunks, route data and same-origin APIs.
- `'nonce-{per-request}'`: required for Next/App Router inline bootstrapping, the Google tag setup snippet and JSON-LD. The nonce is generated with `crypto.getRandomValues()` per request in `proxy.ts`.
- `https://www.googletagmanager.com`: required by the explicit Google tag loader in `app/layout.tsx`.
- `https://www.google-analytics.com` and `https://region1.google-analytics.com`: required for Google Analytics collection.
- `https://va.vercel-scripts.com`: required by Vercel Analytics / Speed Insights scripts.
- `https://vitals.vercel-insights.com`: required by Vercel Speed Insights collection.
- `https://challenges.cloudflare.com`: required only when the contact form Turnstile widget is enabled.
- `https://PROJECT.supabase.co`: required for Supabase Auth/API/Storage assets.
- `wss://PROJECT.supabase.co`: allowed for Supabase realtime/session-compatible browser behavior.
- `data:` in `img-src` only: required for data-image flows such as Supabase TOTP QR codes. It is not allowed in `script-src`.
- `blob:` in `img-src` and `worker-src`: retained for browser image/blob compatibility and worker compatibility. It is not allowed globally.

The final `script-src` does not include `'unsafe-inline'`, `'unsafe-eval'`, `data:`, wildcards or broad `https:`.

## Cookie Audit

Application-controlled Supabase SSR cookies are configured in `lib/supabase/config.ts`:

```ts
{
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
}
```

This preserves local HTTP development while making production HTTPS cookies `Secure`.

Observed production cookie:

- `_vercel_sso_nonce`: Vercel Deployment Protection cookie, `Secure; HttpOnly; SameSite=Lax`; not controlled by the application.

No application `Set-Cookie` header was emitted by unauthenticated local `GET /` or `GET /admin/login/` probes. Login/session cookie behavior requires a real Supabase admin sign-in and should be retested after deployment.

If Observatory still reports an insecure cookie after deployment, inspect the cookie name:

- `sb-*`: app/Supabase-controlled; should be `Secure` in production.
- `_vercel_*`: Vercel-controlled; review Deployment Protection, toolbar or preview settings.
- third-party analytics/captcha cookies: controlled by that provider.

## CORP Decision

`Cross-Origin-Resource-Policy: same-origin` is applied by app headers and retained for static assets through `next.config.ts`.

Rationale:

- The portfolio does not need to be embedded as a cross-origin subresource.
- Direct public page and CV downloads still work.
- Supabase Storage assets are loaded as external resources from Supabase and are allowed by CSP.
- `Cross-Origin-Embedder-Policy` remains `unsafe-none`; `require-corp` was not used because it could break third-party analytics, Turnstile or external Supabase assets.

## Files Changed

- `lib/security/headers.ts`
- `lib/security/http.ts`
- `proxy.ts`
- `lib/supabase/proxy.ts`
- `next.config.ts`
- `app/layout.tsx`
- `app/contact/page.tsx`
- `components/contact-form.tsx`
- `components/site-header.tsx`
- `components/project-cover.tsx`
- `app/globals.css`
- `docs/HTTP_SECURITY_HARDENING.md`

## Vercel Settings To Review

- Disable Deployment Protection for the public production portfolio if recruiters and Observatory should reach the app directly.
- Keep Deployment Protection on preview deployments if desired.
- Re-scan the public production domain after deployment, not the SSO-protected preview URL.
- Review any Vercel Toolbar or preview cookies if Observatory reports cookie issues.
- Confirm production environment variables:
  - `NEXT_PUBLIC_SITE_URL`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - `SUPABASE_SECRET_KEY`
  - `ALLOWED_ORIGINS`
  - optional Turnstile variables.

## Remaining Limitations

- The current production URL returns Vercel SSO headers, so app-level production headers could not be observed there.
- The nonce-based CSP makes matching document routes dynamic. This project already renders CMS/auth-aware pages dynamically, so the trade-off is acceptable.
- Browser console CSP validation was not performed with an interactive browser in this run. Header probes, builds and route checks passed locally.
- If Vercel or third-party cookies are the source of a remaining cookie deduction, the fix may be a Vercel dashboard or provider setting rather than application code.

## Production Test Checklist

After deploying:

- `curl -I https://your-production-domain/`
- `curl -I https://your-production-domain/admin/login`
- Confirm `script-src` has a nonce and no `unsafe-inline`, `unsafe-eval`, `data:` or wildcard script source.
- Confirm `/admin/login` has `X-Robots-Tag: noindex, nofollow, noarchive` and `Cache-Control: no-store`.
- Confirm public pages load.
- Confirm project pages load.
- Confirm CV downloads return `200`.
- Confirm Supabase admin login, logout and session refresh work.
- Confirm contact form and Turnstile work if enabled.
- Confirm Vercel Analytics / Speed Insights continue reporting.
- Check browser console for CSP violations.
- Re-run HTTP Observatory only after deployment reaches the public production domain.

## Verification Results

- `npm run lint`: passed.
- `npm run type-check`: passed.
- `npm run build`: passed after rerunning outside the sandbox because the sandboxed build hit Windows `spawn EPERM`.
- `npm audit`: `found 0 vulnerabilities`.
- Local production probes:
  - `GET /`: `200`.
  - `GET /admin/`: `307` to `/admin/login/?next=%2Fadmin%2F`.
  - `GET /admin/login/`: `200` with no-store/noindex/noarchive.
  - `GET /cv/Ahmed_Aziz_Mhiri_CV_Francais.pdf`: `200`.
  - `GET /cv/Ahmed_Aziz_Mhiri_CV_Francais.docx`: `200`.
  - Explicit CSP check for `unsafe-inline`, `unsafe-eval`, and `script-src ... data:`: passed.
