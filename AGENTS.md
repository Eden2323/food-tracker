# AGENTS.md — food tracker

Personal project. Read `STATUS.md`, then `agent/HANDOFF.md` (the baseline plan and schema), then `agent/DECISIONS.md`.

## What this project is
A food and meal tracking app with barcode scanning and meal suggestions. Open access, no login. Hosted on Vercel with GitHub auto-deploy from `main`; data in Supabase.

## Stack
React 19 + Vite, Tailwind v4 via the `@tailwindcss/vite` plugin (not PostCSS), React Router v7, lucide-react, Supabase (PostgreSQL, no auth, RLS off, anon key). Dark theme only.

## Commands
| Task | Command |
|---|---|
| Install | `npm ci` |
| Dev | `npm run dev` |
| Lint | `npm run lint` |
| Build | `npm run build` |

## Conventions
- Pages in `src/pages/`, shared components in `src/components/`, Supabase client in `src/lib/supabase.js`.
- No auth and no RLS by design; do not add either without a decision entry.

## Boundaries
- No secrets in the repo. Supabase keys come from Vercel env.
- Commits use the personal GitHub identity configured in this repo.

## Your obligation before the session ends
Run `/handoff`.

<!-- house-rules:start -->
## House rules (personal projects; synced from aianswers-workflow, edit there)

**Memory.** This repo is the only memory. Local Claude memory is disabled in `.claude/settings.json`. Anything worth remembering goes into `STATUS.md`, `agent/HANDOFF.md` or `agent/DECISIONS.md` via `/handoff`.

**Writing.** Australian spelling. No em dashes. No "simply", "just", "obviously".

**Subagents.** The main session plans, reviews every diff and runs the final gate. Implementation runs in subagents with `model` always set: `opus` for design-heavy work, `sonnet` for mechanical work; effort low or medium. Keep fan-outs under about five agents.

**Run, do not instruct.** Execute commands and report the result. Hand Eden a command only when the step genuinely needs a human.

**Docker on the laptop.** Ask before starting Docker.

**Secrets.** Never in the repo or in chat. Reference `.env` keys by name only.

**This is a personal project.** No ClickUp, no client rules, no hours ledger. Commits go to the personal GitHub account; the repo's git identity is set to it.

**Session discipline.** At about 60% context, run `/handoff` and stop.
<!-- house-rules:end -->
