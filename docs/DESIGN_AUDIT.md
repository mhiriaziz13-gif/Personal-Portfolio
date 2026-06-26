# Design Audit

## Design direction

The interface deliberately avoids both a generic developer portfolio and a conventional CV microsite. It uses an editorial business layout, a controlled navy/white/soft-blue palette and a restrained amber accent to convey analytical rigor, commercial awareness and modern digital capability.

The visual story is organised around a simple idea: **signals -> insight -> action -> commercial growth**. The hero’s pseudo-3D data sculpture and project covers make this concept visible without adding unnecessary WebGL weight or generic AI imagery.

## Key decisions

- **Portrait use:** confined to the Home hero and About page. It remains the supplied image, with only responsive layout treatment.
- **Hierarchy:** large type communicates positioning quickly; modular cards allow recruiters to scan projects, experience, skills and CV options.
- **Commercial language:** project content is framed in terms of customer journeys, reliability, traceability, decisions and operating controls rather than only technology stacks.
- **Case studies:** each page separates the business challenge, contribution, toolset, workflow and business value to avoid inflated claims.
- **Maintainability:** the public site reads structured CMS records from Supabase; the data files remain safe local fallbacks, repeated UI patterns are components, and CVs can be replaced through the private dashboard or regenerated from the documented Python source.

## Longevity

The site relies on structure, typography, contrast and content hierarchy instead of short-lived visual effects. New projects, roles, skills and CV links can be managed in the private dashboard without changing routes; visual tokens remain centralised in `app/globals.css`.
