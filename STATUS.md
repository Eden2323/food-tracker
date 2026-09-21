# STATUS — food tracker

_Last updated: 2026-09-21 by Claude Code (layer install)_

## Where we're at
Deployed on Vercel and in personal use. Last change (27 Mar 2026) fixed a modal cut off by the navbar on mobile. The full baseline plan (schema, pages, barcode flow, meal logic, build phases) is in `agent/HANDOFF.md`.

## Branch / uncommitted state
- **Branch:** `main`, in sync with `origin/main`
- **Deployed:** Vercel, auto-deploy from `main`

## Next steps
1. None scheduled.

## Tried & rejected
- Nothing recorded yet.

## Gotchas
- Tailwind v4 is wired through the Vite plugin; adding a PostCSS config breaks it.

## Verify with
```bash
npm run lint
npm run build
```
