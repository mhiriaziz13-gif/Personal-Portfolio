# Deployment guide

## Requirements

This project uses server-side features: Supabase cookie authentication, the private `/admin` dashboard and the `/api/contact` route. Do not deploy it as a static export and do not configure an `out` directory.

Before deploying, complete `docs/SUPABASE_SETUP.md`.

## Vercel

1. Push the repository to GitHub.
2. Import it in Vercel and keep the Next.js framework preset.
3. In **Project Settings -> Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_SITE_URL`
   - `SUPABASE_SECRET_KEY`
4. Set all variables for **Production**; add them to **Preview** only if a preview CMS is required.
5. Mark `SUPABASE_SECRET_KEY` as sensitive.
6. Deploy using `npm run build`.
7. After the final domain is known, set `NEXT_PUBLIC_SITE_URL` to `https://your-domain.com` and redeploy.

## Netlify

1. Import the GitHub repository in Netlify.
2. Build command: `npm run build`.
3. Publish directory: `.next`.
4. Add the same four environment variables in Netlify's environment-variable settings. Make the secret key restricted/sensitive.
5. Deploy and test both public pages and `/admin/login`.
6. Do not add a root rewrite in `_redirects` or `netlify.toml`; it can override the Next.js adapter's routing.

## Production checks

- Open `/admin/login` in a private browser window and verify it requests a login.
- Verify an unauthorised login cannot open `/admin`.
- Update one text field in the CMS and check the public page in another browser tab.
- Upload a CV and confirm the public PDF/DOCX links work.
- Submit the contact form and confirm the message reaches **Messages**.
- Confirm `robots.txt`, `sitemap.xml`, project URLs and canonical URLs use the correct domain.