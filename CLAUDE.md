# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

- **`apps/web`** (`play.evalion.no`) — Student game client. TanStack Start + React 19 + Vite. Students join live sessions via 6-character code, vote on statements (sant/usant/delvis), discuss in groups, and receive feedback. File-based routing via TanStack Router (`src/routes/`). Path alias `@/*` maps to `./src/*`. Dev port: 3000.
- **`apps/dashboard`** (`dashboard.evalion.no`) — Teacher dashboard. Same stack as web. Teachers create/manage FagPrat question sets, launch live sessions, view student analytics and session history. Path alias `@/*` maps to `./src/*`. Dev port: 3001.
- **`apps/landing`** (`evalion.no`) — Marketing/landing site. Next.js 15 App Router + Turbopack. Pricing, FAQ, help center, legal pages. Path alias `@/*` maps to `./app/*`. Dev port: 3002.

### Packages

- **`packages/backend`** (`@workspace/backend`) — Convex backend. Contains schema, queries, mutations, HTTP routes, and auth config. Exports generated types via `@workspace/backend/convex/_generated/*`. Both web and dashboard apps share the same Convex deployment.
- **`packages/ui`** (`@workspace/ui`) — Shared UI library. Components built on @base-ui/react with CVA variants, styled via Tailwind CSS 4 with oklch CSS variables. Exports via subpath: `@workspace/ui/components/button`, `@workspace/ui/lib/utils`, `@workspace/ui/globals.css`.
- **`packages/config`** (`@evalion/config`) — Shared base tsconfig.

### Adding UI components

```bash
pnpm dlx shadcn@latest add <component> -c apps/web
```

Components land in `packages/ui/src/components/`. Import as `@workspace/ui/components/<name>`.

## Convex Backend

### Database tables

- **`fagprats`** — Question sets with title, subject, level, type, statements (text + fasit + explanation), visibility, author info.
- **`liveSessions`** — Active/ended game sessions with join code, status (lobby/active/ended), current step, group and feature toggles.
- **`sessionStudents`** — Students enrolled in a session (name, avatar color, group index).
- **`sessionVotes`** — Vote records per statement per round (sant/usant/delvis).
- **`sessionRatings`** — Student self-evaluation ratings (1-5 scale).

### Authentication

Uses **Better Auth** integrated with Convex via `@convex-dev/better-auth`. Supports email/password and Google OAuth. Auth component lives in `packages/backend/convex/betterAuth/`. Both apps share the same auth instance — a user can log in on either app with the same account.

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
- `COOKIE_DOMAIN` — Domain for auth cookies (production only)
- `TRUSTED_ORIGINS` — Allowed CORS origins (production only)
- `OPENAI_API_KEY` — OpenAI API key (used by `reddi.generateStatements`)
- `ANTHROPIC_API_KEY` — Anthropic API key (used by `reddi.generateStatements` when an admin selects a Claude model)

### Frontend apps (`apps/web/.env.local`, `apps/dashboard/.env.local`)

- `VITE_CONVEX_URL` — Convex deployment URL (`VITE_`-prefixed = exposed to browser)
- `VITE_CONVEX_SITE_URL` — Convex HTTP endpoint URL
- `BETTER_AUTH_SECRET` — Must match backend value
- `SITE_URL` — App base URL (e.g. `http://localhost:3000` for web, `http://localhost:3001` for dashboard)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth credentials

Dashboard additionally uses:
- `VITE_PLAY_URL` — URL to the play/web app (for generating join links and QR codes)

## Key Conventions

- **Dependency versions** are managed via the `catalog:` protocol in `pnpm-workspace.yaml` — add/update versions there, not in individual package.json files.
- **Formatting**: oxfmt with 2-space indent, semicolons, 100 char width, trailing commas, Tailwind class sorting.
- **Linting**: oxlint with TypeScript, React, react-perf, jsx-a11y, TanStack Router/Query plugins.
- **Styling**: Tailwind CSS 4 utility-first. CSS variables defined in `packages/ui/src/styles/globals.css` using oklch color space. Dark mode via `.dark` class with variable overrides.
- **Git hooks**: husky + lint-staged runs on pre-commit.

### Naming

- **Code identifiers** (variables, functions, types, props, file names) are in **English**.
- **UI strings** (labels, messages, button text, toasts) are in **Norwegian**.
- **Domain terms** — `fagprat`, `fasit`, `begrunnelse`, `liveokt`, `sant`/`usant`/`delvis`, `trinn`, `påstand` — are **canonical Norwegian vocabulary** and stay in Norwegian even inside code. They have no good English equivalent and translating them loses meaning.
- **Routes** use the Norwegian verb for the action (`/lag-fagprat`, `/velg-pastander`, `/min-samling`). This is intentional and matches the URL structure exposed to teachers.
