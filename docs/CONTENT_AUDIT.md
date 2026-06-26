# Content Audit

## Scope reviewed

Reviewed public visitor-facing content in `app/layout.tsx`, `app/page.tsx`, `app/about/page.tsx`, `app/projects/page.tsx`, `app/projects/[slug]/page.tsx`, `app/experience/page.tsx`, `app/resume/page.tsx`, `app/contact/page.tsx`, `app/not-found.tsx`, `components/site-header.tsx`, `components/site-footer.tsx`, `components/project-card.tsx`, `components/value-explorer.tsx`, `components/page-hero.tsx`, `components/contact-form.tsx`, `data/site.ts`, `data/projects.ts`, `data/experience.ts`, `data/resumes.ts`, and `supabase/seed.sql`.

Reviewed private/admin-facing content in `app/admin/page.tsx`, `app/admin/login/page.tsx`, `components/admin/admin-dashboard.tsx`, and supporting CMS/content utilities in `lib/`.

Reviewed documentation and setup content in `README.md`, `DEMARRAGE_RAPIDE_FR.md`, `docs/CONTENT_UPDATE_GUIDE.md`, `docs/SUPABASE_SETUP.md`, `docs/DEPLOYMENT.md`, `docs/DESIGN_AUDIT.md`, `docs/PERFORMANCE_CHECKLIST.md`, `docs/SEO_CHECKLIST.md`, `docs/ACCESSIBILITY_CHECKLIST.md`, `docs/MISSING_OR_UNCONFIRMED_INFORMATION.md`, and SQL files under `supabase/`.

## Changes made

| Area | Problematic wording found | Why it was problematic | Revised wording / direction | Action |
| --- | --- | --- | --- | --- |
| Home hero | "Data-Driven Marketing - Commercial Analytics - Business Intelligence" and generic summary wording | Clear but not personal enough; did not immediately connect data, automation and business decisions | "Data-driven marketing, commercial analytics and business intelligence" with a summary focused on customer, campaign and process signals | Changed |
| Home contribution section | "Focused on the link between business activity, customer touchpoints and commercially useful action." | Abstract and impersonal | "I connect data from operations, customers and marketing to decisions teams can act on." | Changed |
| Home CTAs | "Explore Projects", "All projects", generic labels | Less recruiter-oriented | "View Selected Projects", "View all case studies", "Connect on LinkedIn" | Changed |
| Value cards | Generic analytics descriptions | Needed stronger practical business framing | Rewritten around campaign signals, commercial priorities, KPI/reporting confidence and reviewable automation | Changed |
| Projects page | Agency-like project intro | Needed concise case-study framing | Rewritten as selected work in analytics, automation and digital growth with business context and practical contribution | Changed |
| Project cards | Card CTA "View Case Study" was acceptable but surrounding impact text needed sharpening | Practical value was not always specific enough | Project impact copy rewritten in `data/projects.ts`; CTA retained because it is clear and recruiter-friendly | Changed/retained |
| Project detail pages | "A clear operating path", arrow mojibake, "Business value" framing | Some headings were vague; corrupted arrow rendered poorly | Rewritten as "How the work was structured", "Practical value", and ASCII separators | Changed |
| Barbershop project | "administrative dashboard" | Could sound like internal site-owner/admin implementation | Rewritten as "activity-monitoring interface" | Changed |
| RPA project | Some value points sounded broad | Needed business-control language without invented metrics | Rewritten around validation consistency, traceability and reviewable controls | Changed |
| AI learning project | "AI-Ready" and broad value statements | Needed more precise contribution and restrained AI wording | Rewritten as "AI-Supported E-Learning Platform" with structured workflows and security-conscious AI integration | Changed |
| Experience page | Repetitive role summaries and mojibake separators | Reduced readability and polish | Rewritten summaries and role details with restrained action verbs and ASCII separators | Changed |
| About page | Profile copy was accurate but slightly generic | Needed a more personal explanation of Ahmed's professional interest | Rewritten around data, marketing activity, operations and commercial decisions | Changed |
| Resume page | "verified professional information", "CMS-managed", "private admin dashboard", "public URL", "Supabase", "without changing application code" | Public page exposed implementation details and sounded like an owner manual | Removed implementation section and replaced it with recruiter guidance on which CV version to use | Removed/changed |
| Resume data | French CV labels and file paths had mojibake | Looked unpolished and could create awkward public links | Added ASCII `French` CV file copies and updated public resume links | Changed |
| Contact page | Copy was accurate but broad | Needed clearer reasons to contact Ahmed | Rewritten for recruiters, managers and collaborators in analytics, BI, automation and digital growth | Changed |
| Contact form | "Messages are sent securely..." was serviceable but generic | Could be more practical and confidentiality-aware | "Share the role, project context or collaboration topic. Please avoid confidential business information." | Changed |
| Footer | Corrupted copyright symbol and broad copy | Mojibake was visible; copy could better reinforce positioning | Rewritten around data, automation, commercial clarity and operational reliability | Changed |
| Metadata | Several titles/descriptions were generic or narrower than target roles | Recruiters and social previews should see the core positioning | Rewritten metadata for public pages and root layout | Changed |
| Admin setup/login | Mojibake in loading/saving states; some wording too developer-heavy | Private content can be practical, but should still be clean | Rewritten as concise private portfolio-management copy | Changed |
| Admin CV manager | "public URL" and technical file hints | Fine in private context, but clearer wording is better | Rewritten as "PDF link", "DOCX link" and direct file-link guidance | Changed |
| Documentation | Performance docs said no tracking scripts were present | No longer true after Vercel Analytics, Speed Insights and Google tag were added | Updated performance documentation to reflect current scripts | Changed |

## Public implementation-detail cleanup

Removed implementation details from public pages, especially the Resume / CV page. Public pages no longer explain how CV links are managed, mention private dashboards, mention Supabase, mention public URLs, or describe code/database mechanics.

Private admin screens still mention setup concepts where they are useful for the site owner. Project documentation and setup documentation still mention Supabase, seed files and schema because those are internal/developer references, not public visitor-facing copy.

## Claims and factual boundaries

No metrics, revenue impact, client names, authorisation claims, language levels, confidential rates, invoice amounts or unverified performance outcomes were added. Wording uses restrained verbs such as "designed", "contributed", "supported", "helped", "worked on" and "integrated" to preserve the existing factual scope.