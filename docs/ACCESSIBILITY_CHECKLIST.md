# Accessibility Checklist

## Implemented

- Semantic landmark structure: header, navigation, main and footer.
- Logical page heading hierarchy: one H1 per page and ordered H2/H3 sections.
- Visible `:focus-visible` outline for keyboard users.
- Skip link to the main content.
- Mobile navigation uses a native button with `aria-expanded` and a descriptive label.
- All major controls are native buttons or links, reachable through keyboard navigation.
- Responsive font sizes and touch targets of at least 44px for primary controls.
- Meaningful portrait alt text: `Portrait of Ahmed Aziz Mhiri`.
- Decorative project covers are hidden from assistive technology.
- Workflow visuals provide a text-equivalent ARIA label and are paired with written case-study content.
- Information is not conveyed by colour alone; labels, headings and text accompany all colour signals.
- Contact form fields have explicit labels, required states and a live status message.
- CSS honours `prefers-reduced-motion`; transitions and animation stop for users who request reduced motion.
- Pseudo-3D animation is disabled on small screens and when reduced motion is requested.

## Manual checks before every public release

1. Test keyboard-only navigation in Chrome, Firefox and Safari/Edge.
2. Test at 200% browser zoom and confirm no content is clipped.
3. Run Lighthouse accessibility audit on Home, Project, Resume and Contact pages.
4. Check reading order using a screen reader such as NVDA, VoiceOver or Narrator.
5. Recheck contrast if the palette or any button state is changed.
6. Ensure future embedded media has captions, transcripts or an accessible alternative.
