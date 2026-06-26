# Supabase setup — one time

This setup creates the database, secure admin access, file storage and the contact-message inbox.

## 1. Create the project

Create a new Supabase project. Keep the database password stored safely; the website itself does not require that password.

In **Project settings → API**, copy:

- Project URL
- Publishable key
- Secret key

The publishable key is safe for the browser. The secret key is server-only.

## 2. Create your local environment file

At the project root, copy `.env.example` to `.env.local`. Fill in the values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_SECRET_KEY=YOUR_SUPABASE_SECRET_KEY
```

Never commit `.env.local`. Never put `SUPABASE_SECRET_KEY` in a variable starting with `NEXT_PUBLIC_`.

## 3. Create the database and security rules

Open **SQL Editor** in Supabase. Run these files in this exact order:

1. `supabase/schema.sql`
2. `supabase/seed.sql`

`schema.sql` creates all content tables, the `portfolio-assets` storage bucket, row-level security policies and automatic `updated_at` timestamps.

`seed.sql` adds the verified content that was already in the original portfolio. It intentionally does not create a login user.

## 4. Create the administrator login

In **Authentication → Users**, create one user with email and password. Do not enable public sign-up for this single-owner portfolio.

Then open `supabase/create-admin.sql`, replace the email on the last line with the email you just created, and run that SQL in the SQL Editor.

Only this user can open `/admin` or alter portfolio content. A signed-in user who is not in `public.admins` is redirected away from the dashboard.

## 5. Run locally

```bash
npm install
npm run dev
```

Open:

- Public site: `http://localhost:3000`
- CMS: `http://localhost:3000/admin/login`

## 6. Verify before deployment

1. Sign in at `/admin/login`.
2. Change a harmless field such as a skill label and save it.
3. Open the public site in another tab and confirm the new content appears.
4. Upload one test image to a project entry.
5. Send a test contact message, then verify that it appears under **Messages**.
6. Delete the test message and, if applicable, revert the test content.

## Recovery notes

- The original local data files in `data/` are fallbacks if Supabase is not configured.
- Once Supabase is connected, public pages use the database. The SQL seed is therefore important.
- Run `schema.sql` before `seed.sql`. Re-running `seed.sql` restores the original portfolio text and will replace CMS edits in the seeded collections.
- To remove access, delete the user from `public.admins` or remove the Supabase Auth user.
