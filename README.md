# Ahmed Aziz Mhiri — Portfolio CMS

A Next.js portfolio with a private Supabase-powered content dashboard. The public site presents Ahmed Aziz Mhiri’s work in Data-Driven Marketing, Commercial Analytics, Business Intelligence, Automation and Digital Growth. The `/admin` dashboard lets the owner update the profile, portrait, projects, experience, skills, education, certifications, CV files and contact messages without editing source code.

## Stack

- Next.js 16, React 19 and TypeScript
- Supabase Postgres, Auth, Storage and Row Level Security
- Next.js Server Components and Route Handlers
- Clean CSS design tokens; no heavy UI framework or 3D dependency
- Responsive public portfolio and private CMS dashboard

## Before you run it

This is **not a static-export website anymore**. It needs a Supabase project and a host that supports Next.js server rendering, such as Vercel or Netlify.

1. Use Node.js 20.9+ (Node 22 LTS recommended).
2. Follow `docs/SUPABASE_SETUP.md` once.
3. Copy `.env.example` to `.env.local` and add the four values.
4. Install and run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000` for the public site and `http://localhost:3000/admin` for the private dashboard.

## Configuration

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_SECRET_KEY=YOUR_SUPABASE_SECRET_KEY
```

`SUPABASE_SECRET_KEY` is used only in the server-side contact route. Never place it in a browser-exposed variable and never commit `.env.local`.

## Build and production test

```bash
npm run lint
npm run build
npm run start
```

For a local production test, set `NEXT_PUBLIC_SITE_URL=http://localhost:3000` in `.env.local`.

## Admin dashboard

After Supabase has been configured, visit `/admin/login` and sign in with the authorised admin user. The dashboard allows you to:

- Update the public profile, text and official portrait.
- Add, edit and delete project case studies.
- Add, edit and delete experience entries.
- Edit contribution cards, skill clusters, education and certifications.
- Replace CV PDFs and DOCX files through Supabase Storage.
- Read, mark and delete contact-form messages.

All public tables are protected with Row Level Security. Visitors can only read published content; only the user listed in `public.admins` can modify content or upload assets.

## Repository structure

```text
app/                 Public pages, /admin, contact API route, metadata and sitemap
components/          Reusable public UI and CMS dashboard components
data/                Verified fallback content for local use before Supabase is connected
lib/                 Supabase clients, CMS data loader and content types
supabase/            Database schema, seeded portfolio content and admin setup SQL
public/images/       Initial portrait asset
public/cv/           Initial CV files; replacements are managed through Storage
scripts/             Reusable CV generator
/docs                Setup, deployment, accessibility, performance and update guidance
```

## Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel, import the repository as a Next.js project.
3. Add all four environment variables from `.env.example` for Production. Add them for Preview too if you need a working CMS in previews.
4. Set `NEXT_PUBLIC_SITE_URL` to the final production URL.
5. Keep the build command as `npm run build`. Do not specify a static `out` directory.
6. Deploy, then test `/admin/login`, a public project page, the contact form and CV downloads.

## Deploy to Netlify

1. Push this repository to GitHub and import it in Netlify.
2. Use build command `npm run build`.
3. Use publish directory `.next` for the Next.js SSR adapter.
4. Add all four environment variables in the Netlify dashboard, including `SUPABASE_SECRET_KEY` as a secret.
5. Set `NEXT_PUBLIC_SITE_URL` to the final production URL and deploy.
6. Do not add a root rewrite rule: Netlify’s Next.js adapter handles routing automatically.

## CV generator

The initial CV source remains reusable in `scripts/generate_cvs.py`:

```bash
python3 -m pip install python-docx
npm run generate:cvs
```

After regenerating files, upload each replacement in `/admin` → **CVs**. The public download centre then uses the new Storage URLs.

## Included documentation

- `docs/SUPABASE_SETUP.md`
- `docs/CONTENT_UPDATE_GUIDE.md`
- `docs/DEPLOYMENT.md`
- `docs/ACCESSIBILITY_CHECKLIST.md`
- `docs/PERFORMANCE_CHECKLIST.md`
- `docs/SEO_CHECKLIST.md`
- `docs/DESIGN_AUDIT.md`
- `docs/MISSING_OR_UNCONFIRMED_INFORMATION.md`

## Content scope

All seeded public content is based only on the verified portfolio brief. It deliberately excludes unconfirmed metrics, personal phone details, language proficiency levels, work authorisation claims, salary expectations, street addresses and confidential client data.
