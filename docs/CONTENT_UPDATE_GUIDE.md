# Content update guide

After Supabase setup, routine content updates do not require VS Code.

## Use the CMS

1. Open `/admin/login`.
2. Sign in with the account created in Supabase Authentication.
3. Select a section from the left navigation.
4. Add, edit or delete content.
5. Click **Save**. The public website reads the new content from the database.

## What each section controls

- **Profile & portrait:** hero content, About text, email, LinkedIn, location, availability, portrait and person schema.
- **Projects:** project cards, individual case-study pages, workflow diagrams and optional custom cover images.
- **Experience:** timeline and detailed experience page.
- **Skills & services:** value proposition cards and capability clusters on the Home page.
- **Education:** qualifications and certifications.
- **CVs:** CV card text and public PDF/DOCX links. Upload replacement files from the CMS when needed.
- **Messages:** messages sent through the contact form; mark them read or delete them.

## Content safety rules

- Do not publish confidential invoices, booking records, real client data, internal commercial rules or customer data.
- Keep project claims accurate. Do not add results, metrics, dates or responsibilities that are not verified.
- Use short, specific project impacts. Avoid exaggerated claims.
- When replacing the portrait, use the official unaltered image and keep the face clearly visible.

## If the dashboard is unavailable

The site can still display fallback content when local Supabase variables are missing. For a deployed site, check the environment variables, redeploy after correcting them, and verify that the authorised user remains in `public.admins`.

## Developers: changing the structure

The database schema is in `supabase/schema.sql`; browser/server Supabase clients are in `lib/supabase/`; the mapping layer is `lib/cms.ts`; the CMS interface is `components/admin/admin-dashboard.tsx`. Update the schema and mapping layer together when adding a new public content type.
