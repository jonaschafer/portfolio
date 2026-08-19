# portfolio

Jonas Schafer's personal site — portfolio, case studies, advising info, and a
handful of small apps/prototypes ("play"). Built with Next.js (App Router)
and deployed on Vercel.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in what you need — most features work without any
npm run dev
```

Runs at `http://localhost:3000`. See `.env.example` for what each optional
integration (Supabase, Spotify, YouTube, eero) needs and where to get it.

Other scripts:

```bash
npm run build   # production build (also runs Next's type/lint checks)
npm run start   # serve the production build
```

## Project structure

- **`app/`** — Next.js App Router routes. Notable ones: `/work`,
  `/case-studies`, `/advising`, `/play`, `/mma`, `/dana-plan-v2`, `/typing`,
  `/gels-cc`. API routes live under `app/api/`.
- **`components/`** — shared React components used across routes.
- **`lib/`** — client-safe helpers and config (e.g. `typingConfig.js`).
- **`public/`** — static assets, plus static HTML prototypes under
  `public/play/prototypes/<name>/`.
- **`archive/`** — retired features kept for reference, excluded from the
  build (e.g. `archive/wall-of-sound`).
- **`scripts/`** — one-off local scripts (not part of the app build), e.g.
  `scripts/eero-login.mjs`.
- **`supabase/`** — database migrations for the Supabase-backed features
  (currently `/play/sounds`).
- **`docs/`** — project docs: architecture notes, setup guides, and AI
  session context. See below.

## Docs

- [`docs/ai-context.md`](docs/ai-context.md) — running log of architecture
  decisions and project state, read automatically by Cursor/Claude sessions
  at the start of each chat (see `.cursorrules`).
- [`docs/typing-eero-setup.md`](docs/typing-eero-setup.md) — one-time setup
  for the `/typing` → eero WiFi unlock integration.
- [`docs/figma-export-and-images.md`](docs/figma-export-and-images.md) —
  Figma export and image compression guide.
- [`docs/dana-plan-v2-figma-capture.md`](docs/dana-plan-v2-figma-capture.md) —
  Figma capture notes for the Dana plan v2 UI.
- [`docs/advising/`](docs/advising) — working notes for the advising
  business (not app code).

## Deployment

Deploys to Vercel on push. `vercel.json` configures the Supabase keepalive
cron (`/api/cron/keepalive`).
