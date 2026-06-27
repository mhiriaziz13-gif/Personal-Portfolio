# Content Voice Audit

## Scope Reviewed

Reviewed public visitor-facing content in:

- `app/layout.tsx`
- `app/page.tsx`
- `app/projects/page.tsx`
- `app/projects/[slug]/page.tsx`
- `app/resume/page.tsx`
- `app/experience/page.tsx`
- `app/about/page.tsx`
- `app/contact/page.tsx`
- `app/not-found.tsx`
- `components/page-hero.tsx`
- `components/project-card.tsx`
- `components/value-explorer.tsx`
- `components/contact-form.tsx`
- `components/site-header.tsx`
- `components/site-footer.tsx`
- `public/og-cover.svg`

Reviewed content sources and fallbacks in:

- `data/site.ts`
- `data/projects.ts`
- `data/experience.ts`
- `data/resumes.ts`
- `lib/cms.ts`
- `supabase/seed.sql`

Reviewed private or developer-facing areas for separation of public copy from implementation language:

- `app/admin/page.tsx`
- `app/admin/login/page.tsx`
- `components/admin/admin-dashboard.tsx`
- `app/api/contact/route.ts`
- `docs/*`
- `README.md`
- `DEMARRAGE_RAPIDE_FR.md`
- `supabase/schema.sql`
- `supabase/create-admin.sql`

## Public Pages Reviewed

| Page or surface | Action |
| --- | --- |
| Global metadata and Open Graph | Rewritten around marketing data analysis, BI, automation, operations and clearer decisions. |
| Home | Rewritten to explain who Ahmed is, what work he does, target role families and recruiter next steps. |
| Projects listing | Rewritten to present selected work with context, contribution, tools and practical outcomes. |
| RPA project detail | Rewritten with the required section titles and grounded invoice-control explanation. |
| Other project detail pages | Retemplated with clearer headings and less case-study jargon. |
| Experience | Rewritten for factual, recruiter-friendly role summaries and careful contribution verbs. |
| About | Rewritten with natural first-person voice and Summer 2027 Europe availability. |
| CV & Resume | Simplified to a title, four CV cards and direct download buttons. |
| Contact | Rewritten for recruiters, managers and professional collaborators. |
| 404 page | Lightly rewritten to avoid "CV formats" instruction-style language. |
| Footer | Rewritten to match the portfolio positioning. |
| Contact form | Simplified the form note and kept the CTA as "Send Message". |

## Problematic Wording Found

| Location | Before | Why it was a problem | After | Status |
| --- | --- | --- | --- | --- |
| Home profile content | "Data-driven marketing, commercial analytics and business intelligence" | Generic positioning; sounded like a category headline instead of Ahmed's work. | "Marketing analytics, business intelligence and automation for clearer operations" | Rewritten |
| Home contribution section | "I connect data from operations, customers and marketing to decisions teams can act on." | Better than before, but still abstract for fast recruiter scanning. | "Clearer reporting, smoother customer journeys and more reliable workflows." | Rewritten |
| Projects page | "Selected case studies" | More agency-like than personal portfolio language. | "Selected projects" | Rewritten |
| Project cards | Cards mainly showed impact copy. | Cards did not give enough context or challenge before asking visitors to click. | Cards now show industry, project context, practical value, tools and "Read the Case Study". | Rewritten |
| RPA project title | "RPA for Invoice Control and Booking Reconciliation" | Did not match the required title. | "RPA for Invoice Control & Booking Reconciliation" | Rewritten |
| RPA detail headings | "Contribution", "Workflow", "Business value", "Designed for clearer execution" | Template-like case-study language and not the requested headings. | "The challenge", "What I worked on", "How the workflow works", "Why it matters", "Tools used" | Rewritten |
| RPA explanation | "Invoice control and booking reconciliation required repeated manual checks..." | Accurate but too compressed and generic. | New explanation describes invoice, booking, voucher and stay data, commercial validation checks, JSON outputs and HTML reports. | Rewritten |
| Barbershop project title | "Data-Driven Digital Transformation for a Men's Barbershop" | Sounded inflated and agency-like. | "Digital Journey & Booking Improvements for a Men's Barbershop" | Rewritten |
| CV page title and intro | "CV formats for recruiters and application workflows" and guidance beginning "Choose the version..." | The page sounded like a user manual. | Page title is now "CV & Resume" with no subtitle. | Removed/reworked |
| CV guidance block | "Which version to choose" | Unnecessary recruiter instruction on a personal portfolio. | Removed completely. | Removed |
| CV card descriptions | "Best starting point for recruiters..." and ATS-heavy explanation | Too instructional and wordy for a simple CV download page. | Short factual card descriptions. | Rewritten |
| CV buttons | Labels included file sizes in the visible button text. | The requested labels were simple. | "Download PDF" and "Download DOCX" | Rewritten |
| Experience bullets | "Designed and expanded", repeated "supported" language and broad value claims | Needed more careful wording where work was collaborative. | Uses "worked on", "contributed", "supported", "built", and concrete task descriptions. | Rewritten |
| About page | Mixed neutral and third-person summary copy. | The About page is the natural place for first-person professional voice. | Uses first person for background, interests, role direction and Summer 2027 availability. | Rewritten |
| Contact page | "Start a professional conversation." | Generic invitation copy. | "Get in touch." with direct recruiter and professional-context wording. | Rewritten |
| Open Graph image | "Data-Driven Marketing" and "Turning Data into Commercial Growth" | Generic and slightly overclaiming. | "Marketing Data Analysis", "BI & Automation", and "Data, marketing, operations and clearer decisions" | Rewritten |

## Content Moved or Retained Privately

No implementation language was moved onto public pages.

Private admin and developer surfaces intentionally still contain technical wording such as Supabase, content editing, database setup, form submission internals, URL fields and admin labels. These are not visitor-facing pages and remain useful for site maintenance.

The admin project editor still uses field labels such as "Business challenge", "My contributions" and "Business value" because they help the site owner manage structured project content. The public project pages no longer expose those headings.

Documentation still mentions Supabase, seed files and setup details because those files are developer guidance, not public portfolio copy.

## Unsupported Claims Check

No new metrics, revenue claims, client names, certifications, dates, work authorisation claims or quantified results were added.

Confidentiality boundaries were strengthened for the RPA project: public copy excludes real invoices, customer data, hotel rates, booking details, invoice amounts and internal commercial rules.
