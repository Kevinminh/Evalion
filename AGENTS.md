# Agent Guidelines

## Essentials

- Stack: TypeScript + React (TanStack Start for `apps/web` & `apps/dashboard`, Next.js 15 for `apps/landing`) in a pnpm + Turborepo monorepo. Backend is Convex; auth is Better Auth via `@convex-dev/better-auth`.
- Three workspace packages: `@workspace/backend` (Convex), `@workspace/evalion` (cross-app feature code), `@workspace/ui` (pure UI primitives).
- Prefer shared `@workspace/ui` components; add primitives via shadcn CLI (`pnpm dlx shadcn@latest add <component> -c apps/web`). Promote anything that needs Convex/auth into `@workspace/evalion` instead of duplicating it across apps.
- Use shared pnpm catalog versions (`pnpm-workspace.yaml`) via `catalog:`.
- Don't build after every little change. If `pnpm lint` and `pnpm typecheck` pass, assume changes work.

## Topic-specific Guidelines

- [Architecture overview](.agents/architecture.md) — Apps, packages, route layouts, where new code belongs
- [Convex backend](.agents/backend.md) — Schema, function files, indexes, AI generation, deployment
- [Auth patterns](.agents/auth.md) — Better Auth + Convex, route guards, middleware, guest sessions
- [TanStack patterns](.agents/tanstack-patterns.md) — Routing, data fetching, loaders, server functions, Vite plugin order
- [TypeScript conventions](.agents/typescript.md) — Casting rules, prefer type inference
- [Workflow](.agents/workflow.md) — Workflow commands, validation approach

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.

<!-- convex-ai-end -->
