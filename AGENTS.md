# Agent Guidelines

## Essentials

- Stack: TypeScript + React (TanStack Start) in a pnpm + Turborepo monorepo, with Drizzle ORM, shadcn/ui, and Better Auth.
- Prefer shared `@workspace/ui` components; add primitives via shadcn CLI (`pnpm dlx shadcn@latest add <component> -c apps/web`).
- Use shared pnpm catalog versions (`pnpm-workspace.yaml`) via `catalog:`.
- Don't build after every little change. If `pnpm lint` passes; assume changes work.

## Topic-specific Guidelines

- [TanStack patterns](.agents/tanstack-patterns.md) - Routing, data fetching, loaders, server functions, environment shaking
- [Auth patterns](.agents/auth.md) - Route guards, middleware, auth utilities
- [TypeScript conventions](.agents/typescript.md) - Casting rules, prefer type inference
- [Workflow](.agents/workflow.md) - Workflow commands, validation approach

<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->
