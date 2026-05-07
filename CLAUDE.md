# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

For deeper context on specific areas, see also:

- [`.agents/architecture.md`](.agents/architecture.md) — How the apps, shared packages, and Convex backend fit together.
- [`.agents/backend.md`](.agents/backend.md) — Convex schema, function files, and backend conventions.
- [`.agents/tanstack-patterns.md`](.agents/tanstack-patterns.md) — Routing, loaders, server functions, vite plugin order.
- [`.agents/auth.md`](.agents/auth.md) — Better Auth + Convex integration, route guards, middleware.
- [`.agents/typescript.md`](.agents/typescript.md) — Compiler flags, type-import rules, no-cast policy.
- [`.agents/workflow.md`](.agents/workflow.md) — Day-to-day commands and validation flow.

## Commands

```bash
# Development (all apps)
pnpm dev                  # Runs all apps via Turbo (web:3000, dashboard:3001, landing:3002)

# Single app dev
pnpm --filter web dev     # TanStack Start app on :3000
pnpm --filter dashboard dev  # TanStack Start app on :3001
pnpm --filter landing dev    # Next.js app on :3002

# Convex backend
pnpm db:dev               # Run Convex dev server (watches & pushes schema/functions)
pnpm db:deploy            # Deploy Convex backend to production
pnpm db:codegen           # Regenerate Convex types
pnpm db:dashboard         # Open Convex dashboard in browser
pnpm db:logs              # Stream Convex function logs

# Build
pnpm build                # Build all packages/apps via Turbo
pnpm --filter web build   # Build a single app

# Linting & Formatting (oxlint + oxfmt, not ESLint/Prettier)
pnpm lint                 # Type-aware oxlint across all workspaces
pnpm lint:fix             # Auto-fix lint issues
pnpm format               # Format with oxfmt
pnpm format:check         # Check formatting without writing

# Type checking
pnpm typecheck            # TypeScript checks across all workspaces
```

## Architecture

This is a **pnpm monorepo** orchestrated by **Turborepo**. Node >=20, pnpm 9.15.9.

### Apps

- **`apps/web`** (`play.co-lab.no`) — Live-session app for **both** guest students and authenticated teachers. TanStack Start + React 19 + Vite. Students enter a 6-character code at `/` → `/delta?code=…` → join as a named participant → play through `spill.$studentId.tsx` (vote sant/usant/delvis, discuss in groups, write begrunnelser, self-evaluate); per-step student UI lives under `src/routes/-spill/`. Teachers running the live session use `liveokt.$sessionId.*` (gated by `beforeLoad` redirect to `/login`) to drive the lobby and advance steps; per-step teacher UI lives under `src/routes/-liveokt/`. File-based routing via TanStack Router (`src/routes/`). Path alias `@/*` maps to `./src/*`. Dev port: 3000.
- **`apps/dashboard`** (`dashboard.co-lab.no`) — Teacher dashboard. Same stack as web. Teachers create/manage FagPrat question sets (`_dashboard` route group: `lag-fagprat`, `min-samling`, `historikk`, `fagprat.$id.*`), launch and run live sessions (`_authed/liveokt.$id`), and view analytics (`_authed/analytics.$id`). Path alias `@/*` maps to `./src/*`. Dev port: 3001.
- **`apps/landing`** (`co-lab.no`) — Marketing + lightweight workspace. Next.js 15 App Router + Turbopack. The `(marketing)` route group hosts the homepage, login/register, team page, legal pages, and a public FagPrat demo. The `(workspace)` route group is a logged-in surface for the standalone Påstandsgenerator (`lag-pastander`, `velg-pastander`, `profile`); it is guarded by `middleware.ts` against unauthenticated access. Path alias `@/*` maps to `./app/*`. Dev port: 3002.

### Packages

- **`packages/backend`** (`@workspace/backend`) — Convex backend. Owns schema, queries, mutations, actions, HTTP routes, and Better Auth integration. All three apps share the same Convex deployment. Exports generated types via `@workspace/backend/convex/_generated/*`. See [`.agents/backend.md`](.agents/backend.md) for details on files and tables.
- **`packages/evalion`** (`@workspace/evalion`) — Shared application code that depends on the Convex backend. Cross-app components (auth forms, live-session UI, skeletons, root error/not-found fallbacks, workspace shell), hooks, and lib helpers (auth client/server, draft utils, convex-id helpers, shared types). Subpath exports: `@workspace/evalion/components/*`, `@workspace/evalion/hooks/*`, `@workspace/evalion/lib/*`. Use this package whenever logic or UI is shared across two or more apps.
- **`packages/ui`** (`@workspace/ui`) — Pure UI primitives. Components built on @base-ui/react with CVA variants, styled via Tailwind CSS 4 with oklch CSS variables. No Convex/auth dependencies. Subpath exports: `@workspace/ui/components/*`, `@workspace/ui/hooks/*`, `@workspace/ui/lib/*`, `@workspace/ui/globals.css`, `@workspace/ui/styles/*.css` (e.g. `pdf-print.css`).
- **`packages/config`** (`@evalion/config`) — Shared base tsconfig.

### Where code belongs

| Code type | Location |
| --- | --- |
| Pure presentational primitive (button, card, sheet) | `packages/ui` |
| Cross-app feature UI that talks to Convex/auth (live session widgets, login form, skeletons) | `packages/evalion` |
| App-specific routes, layouts, or one-off UI | `apps/<app>/src` (or `apps/landing/app`) |
| Schema, queries, mutations, actions, HTTP routes | `packages/backend/convex` |

### Adding UI components

```bash
pnpm dlx shadcn@latest add <component> -c apps/web
```

Components land in `packages/ui/src/components/`. Import as `@workspace/ui/components/<name>`.

## Convex Backend

See [`.agents/backend.md`](.agents/backend.md) for the full breakdown of function files, tables, and indexing patterns. Quick reference:

### Database tables

- **`fagprats`** — Question sets. Title, subject, level, type (`intro` | `oppsummering`), concepts, statements (text + fasit + explanation + optional color/image/begrunnelse), visibility, usage count, author. Indexed by author/visibility/subject/level with a `search_fagprats` search index.
- **`liveSessions`** — Active/ended game sessions. Join code, status (`lobby` | `active` | `ended`), current step, current statement index, group toggle/count, transcription toggle, self-evaluation toggle, timer state (duration/startedAt/pausedAt/remainingAtPause).
- **`sessionStudents`** — Students enrolled in a session (name, avatar color, optional avatar emoji, group index).
- **`sessionVotes`** — Vote records per student per statement per round (sant/usant/delvis + optional confidence).
- **`sessionRatings`** — Student self-evaluation ratings (1–5 scale) per statement.
- **`sessionBegrunnelser`** — Free-text justifications per student per statement per round; teachers can highlight individual entries.
- **`pastandDrafts`** — Per-user drafts from the standalone Påstandsgenerator on the landing app, including last-used fag/trinn/forkunnskap.
- **`aiPrompts`** — Editable system prompts keyed by name, used by the AI generator (`reddi.ts`).
- **`emailSubscribers`** — Newsletter / waitlist email captures from the landing site.

### Authentication

Uses **Better Auth** (`better-auth ^1.5.6`) integrated with Convex via `@convex-dev/better-auth`. Supports email/password and Google OAuth. The auth component is registered in `convex.config.ts` and lives in `packages/backend/convex/betterAuth/` with its own schema. Better Auth HTTP routes are mounted from `convex/http.ts`. All three apps share the same auth instance, so a user can log in on any app with the same account. `auth.ts` also installs an `onDelete` trigger that cascades a user's owned data (live sessions and their children, fagprats, drafts) when their account is deleted. See [`.agents/auth.md`](.agents/auth.md) for client/server patterns.

### Convex deployment workflow

- **Development**: Run `pnpm db:dev` — watches for file changes and pushes schema/functions to the dev deployment automatically.
- **Production**: Run `pnpm db:deploy` — deploys current schema and functions to production. Requires `CONVEX_DEPLOY_KEY` env var.
- **Type generation**: Run `pnpm db:codegen` after schema changes if not running `db:dev`.

When working on Convex code, **always read `packages/backend/convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

## Environment Variables

### Backend (`packages/backend/.env.local`)

- `CONVEX_DEPLOYMENT` — Convex deployment identifier (e.g. `dev:canny-narwhal-177`)
- `BETTER_AUTH_SECRET` — Secret for signing auth tokens
- `SITE_URL` — Base URL for auth callbacks
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth credentials
- `GOOGLE_REDIRECT_BASE_URL` — Optional override base URL for Google OAuth callbacks (used when the Convex HTTP host differs from the app host)
- `COOKIE_DOMAIN` — Domain for auth cookies (production only; enables cross-subdomain cookies)
- `TRUSTED_ORIGINS` — Comma-separated list of allowed CORS origins (production only)
- `OPENAI_API_KEY` — OpenAI API key (used by `reddi.generateStatements`)
- `ANTHROPIC_API_KEY` — Anthropic API key (used by `reddi.generateStatements` when an admin selects a Claude model)

### Frontend apps (`apps/web/.env.local`, `apps/dashboard/.env.local`, `apps/landing/.env.local`)

- `VITE_CONVEX_URL` (web/dashboard) / `NEXT_PUBLIC_CONVEX_URL` (landing, if used) — Convex deployment URL. `VITE_`-prefixed values are exposed to the browser by Vite.
- `VITE_CONVEX_SITE_URL` — Convex HTTP endpoint URL (web/dashboard).
- `BETTER_AUTH_SECRET` — Must match backend value.
- `SITE_URL` — App base URL (e.g. `http://localhost:3000` for web, `http://localhost:3001` for dashboard, `http://localhost:3002` for landing).
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth credentials.

Dashboard additionally uses:

- `VITE_PLAY_URL` — URL to the play/web app (for generating join links and QR codes).

## Key Conventions

- **Dependency versions** are managed via the `catalog:` protocol in `pnpm-workspace.yaml` — add/update versions there, not in individual `package.json` files. Reference them as `"package": "catalog:"`.
- **Formatting**: oxfmt with 2-space indent, semicolons, double quotes, 100 char width, trailing commas, and Tailwind class sorting (`clsx`, `cn`, `cva`, `tw`).
- **Linting**: oxlint with TypeScript, React, react-perf, jsx-a11y, plus jsPlugins for Turbo and TanStack Router/Query. `consistent-type-assertions` is set to `never` — do not use `as` casts.
- **Styling**: Tailwind CSS 4 utility-first. CSS variables defined in `packages/ui/src/styles/globals.css` using oklch color space. Dark mode via `.dark` class with variable overrides. PDF-specific styles live in `packages/ui/src/styles/pdf-print.css`.
- **Validation flow**: `pnpm lint` and `pnpm typecheck` are the primary signals; only run `pnpm build` when you explicitly need to verify a production output. See [`.agents/workflow.md`](.agents/workflow.md).

### Naming

- **Code identifiers** (variables, functions, types, props, file names) are in **English**.
- **UI strings** (labels, messages, button text, toasts) are in **Norwegian**.
- **Domain terms** — `fagprat`, `fasit`, `begrunnelse`, `liveokt`, `sant`/`usant`/`delvis`, `trinn`, `påstand`, `forkunnskap` — are **canonical Norwegian vocabulary** and stay in Norwegian even inside code. They have no good English equivalent and translating them loses meaning.
- **Routes** use the Norwegian verb for the action (`/lag-fagprat`, `/velg-pastander`, `/min-samling`, `/lag-pastander`, `/historikk`). This is intentional and matches the URL structure exposed to teachers.
