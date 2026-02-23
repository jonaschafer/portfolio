# AI Context - Project Memory

This file serves as persistent memory for Cursor AI across chat sessions. Update it when making important decisions, architectural choices, or when project state changes significantly.

## Project Overview

**What is this project?**
- [Brief description of the project and its purpose]

**Tech Stack:**
- [List key technologies, frameworks, libraries]

**Key Dependencies:**
- [Important packages or services the project relies on]

## Key Decisions

### Architecture Decisions
- 2026-02-11 - **Prototypes and play content**: Static-only prototypes live in `public/play/prototypes/`; app-backed play features in `app/play/`. Unused features (e.g. Wall of Sound) live in `archive/`. Prototype docs live with the prototype (e.g. `public/play/prototypes/spina/docs/`) so each prototype is self-contained.
- 2026-02-15 - **Case studies**: Case study index at `/case-studies` with cursor-follow image preview (vanilla JS + requestAnimationFrame, no GSAP). Individual case studies at `/case-studies/[slug]`; content from `content.md` in each slug folder, rendered with react-markdown/remark-gfm. New case studies: add entry to `app/case-studies/case-studies-data.js` and create `app/case-studies/[slug]/page.js` + `content.md`. Blog template from other project moved to `archive/blog` (excluded from build via tsconfig) and is not used; case study article template lives in main app.

### Design Patterns
- [Pattern used]: [Why it was chosen]
  - Example: "Component composition pattern: Allows for flexible, reusable UI components"

### Tooling Choices
- [Tool]: [Why it was chosen]
  - Example: "Tailwind CSS: Rapid development with utility-first approach"

## Architecture Notes

### Project Structure
- **public/** — Static assets (fonts, images, icons) and static HTML prototypes. Prototypes live under `public/play/prototypes/<name>/` (e.g. spina, sourdough, campsite-reporter). Each prototype can have a `docs/` subfolder for its writeups (e.g. `public/play/prototypes/spina/docs/`).
- **app/play/** — Next.js routes for "play" features that need the app (e.g. `/play/sounds`, `/play/vibe-coding-setup`). The play landing page at `/play` lists all projects and links to either these routes or to `/play/prototypes/<name>` for static prototypes.
- **archive/** — Unused or retired app features (e.g. `archive/wall-of-sound`, `archive/blog`). Excluded from TypeScript/build. Not served as routes; code preserved for reference.
- **app/case-studies/** — Case studies index (cursor preview grid) and per-study pages. Data in `case-studies-data.js`; each study has its own folder with `page.js` and `content.md`.
- **docs/** — Project-wide docs (e.g. `ai-context.md`). Prototype-specific docs live next to the prototype under `public/play/prototypes/<name>/docs/`.

### Important Patterns
- [Pattern name]: [Description and where it's used]
  - Example: "Custom hooks pattern: All data fetching logic lives in hooks/ directory"

### Key Files/Directories
- `[path]`: [What it does and why it's important]
  - Example: "`lib/api.js`: Central API client with authentication handling"

## Current State

### What's Working
- [Feature/component]: [Status and notes]
  - Example: "User authentication: Fully functional, using Supabase Auth"

### In Progress
- [Feature/component]: [Current status]
  - Example: "Dashboard redesign: 60% complete, need to finish responsive layout"

### Known Issues
- [Issue]: [Impact and potential solutions]
  - Example: "Slow API response on mobile: Investigating caching strategy"

### Recent Changes
- 2026-02-15 - Nav: Work, Case Studies, Advising, Play, Email me (removed Vibes; 👋 → "Email me"). Advising page launched without pricing (commented out); added "See how this works in practice →" link to Case Studies. Case studies index with cursor-follow preview; first case study "Organizational Infrastructure" at `/case-studies/organizational-infrastructure`.
- 2026-02-15 - V2 homepage (`/v2`): Carousel runs only after client mount (`mounted` state) so arrows and auto-advance work; no ru-dy baseline. Image quality: `quality={90}` on v2 and ProjectCarousel; Figma export + compression guide in `docs/figma-export-and-images.md`.
- 2026-02-16 - Homepage is now the full-bleed carousel (formerly at `/v2`). Component lives in `components/HomeCarousel.js`; `app/page.js` renders it and exports metadata. Redirects: `/v2` and `/v2/` → `/`. Removed `app/v2/`. To change carousel images, edit `HOME_MEDIA` in `components/HomeCarousel.js`.

## Important Context

### Domain Knowledge
- [Business rule or domain concept]: [Explanation]
  - Example: "User roles: Admin, Editor, Viewer. Only Admins can delete content."

### Edge Cases
- [Edge case]: [How it's handled]
  - Example: "Empty state handling: All lists show helpful empty state messages with CTAs"

### Environment Variables
- `[VAR_NAME]`: [Purpose and where it's used]
  - Example: "`NEXT_PUBLIC_API_URL`: Base URL for all API calls, set in Vercel dashboard"

### External Services
- [Service]: [How it's integrated and what it's used for]
  - Example: "Supabase: Database and auth. Connection config in `lib/supabase.js`"

## Notes for Future Sessions

- [Any important reminders or context for future work]
  - Example: "Remember: Always run tests before deploying. Test suite located in `__tests__/`"

---

**Last Updated:** 2026-02-22 (removed brand-architecture-endorsed case study)
**Maintained By:** [Your name/team]
