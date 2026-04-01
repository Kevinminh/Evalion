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

- **`apps/web`** — Main app. TanStack Start + React 19 + Vite. File-based routing via TanStack Router (`src/routes/`). Path alias `@/*` maps to `./src/*`.
- **`apps/dashboard`** — Dashboard app. Same stack as web. Path alias `@/*` maps to `./src/*`.
- **`apps/landing`** — Marketing site. Next.js 15 App Router + Turbopack. Path alias `@/*` maps to `./app/*`.

### Packages

- **`packages/ui`** (`@workspace/ui`) — Shared UI library. Components built on @base-ui/react with CVA variants, styled via Tailwind CSS 4 with oklch CSS variables. Exports via subpath: `@workspace/ui/components/button`, `@workspace/ui/lib/utils`, `@workspace/ui/globals.css`.
- **`packages/config`** (`@evalion/config`) — Shared base tsconfig.

### Adding UI components

```bash
pnpm dlx shadcn@latest add <component> -c apps/web
```

Components land in `packages/ui/src/components/`. Import as `@workspace/ui/components/<name>`.

## Key Conventions

- **Dependency versions** are managed via the `catalog:` protocol in `pnpm-workspace.yaml` — add/update versions there, not in individual package.json files.
- **Formatting**: oxfmt with 2-space indent, semicolons, 100 char width, trailing commas, Tailwind class sorting.
- **Linting**: oxlint with TypeScript, React, react-perf, jsx-a11y, TanStack Router/Query plugins.
- **Styling**: Tailwind CSS 4 utility-first. CSS variables defined in `packages/ui/src/styles/globals.css` using oklch color space. Dark mode via `.dark` class with variable overrides.
- **Git hooks**: husky + lint-staged runs on pre-commit.

<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->
