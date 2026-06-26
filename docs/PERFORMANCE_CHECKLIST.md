# Performance Checklist

## Included choices

- Server-rendered Next.js routes fetch small structured Supabase records; public content is lightweight and cacheable by the host.
- No video, audio, custom webfont, heavy chart package or Three.js dependency.
- Hero visual is CSS pseudo-3D, not a heavyweight canvas or WebGL asset.
- Official portrait is loaded only where required and uses explicit dimensions to prevent layout shift.
- CMS content is requested from one managed Supabase backend; no analytics, advertising or tracking scripts are included.
- Dependency footprint remains restrained: Next.js, React, TypeScript and Supabase SSR/client packages.
- CSS transitions are short and disabled for reduced-motion users.
- Initial visual assets are local; optional CMS uploads are stored in Supabase Storage. No tracking scripts are included.

## Release checks

1. Run `npm run build` without errors.
2. Run Lighthouse mobile performance on the deployed Home page.
3. Confirm image file size remains reasonable when replacing the portrait; use PNG/WebP/AVIF appropriate to transparency needs.
4. Avoid adding autoplay media, uncompressed images, large animation libraries or third-party widgets without measuring impact.
5. Confirm both initial `public/cv/` links and newly uploaded Storage CV files return the correct downloads.
6. Check Core Web Vitals after deploying the real domain: target LCP <= 2.5s, INP <= 200ms and CLS <= 0.1 where hosting conditions permit.
