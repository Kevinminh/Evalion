# Evalion

A TypeScript + React monorepo built with TanStack Start, shadcn/ui, and Better Auth.

## Prerequisites

- Node.js >= 20
- pnpm 9.15.9

## Getting Started

```bash
pnpm install
pnpm dev
```

This starts all apps concurrently via Turborepo.

## Apps

| App | Stack | Port | Path |
|-----|-------|------|------|
| **web** | TanStack Start + Vite | 3000 | `apps/web` |
| **dashboard** | TanStack Start + Vite | 3001 | `apps/dashboard` |
| **landing** | Next.js 15 + Turbopack | 3002 | `apps/landing` |

Run a single app:

```bash
pnpm --filter web dev
```

## Packages

| Package | Name | Purpose |
|---------|------|---------|
| `packages/ui` | `@workspace/ui` | Shared UI components (shadcn/ui + Base UI + Tailwind CSS 4) |
| `packages/config` | `@evalion/config` | Shared TypeScript base configuration |

## Commands

| Task | Command |
|------|---------|
| Dev (all) | `pnpm dev` |
| Build | `pnpm build` |
| Lint | `pnpm lint` |
| Lint + fix | `pnpm lint:fix` |
| Format | `pnpm format` |
| Type check | `pnpm typecheck` |

## Adding UI Components

```bash
pnpm dlx shadcn@latest add <component> -c apps/web
```

Components are placed in `packages/ui/src/components/` and can be imported across all apps:

```tsx
import { Button } from "@workspace/ui/components/button"
```

## Dependency Management

Dependency versions are centralized in `pnpm-workspace.yaml` using the `catalog:` protocol. Add or update versions there, then reference them as `"package": "catalog:"` in individual `package.json` files.
