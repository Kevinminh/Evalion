# Workflow

## Commands

| Task | Command |
|------|---------|
| Dev (all apps) | `pnpm dev` |
| Dev (single app) | `pnpm --filter web dev` / `pnpm --filter dashboard dev` / `pnpm --filter landing dev` |
| Lint | `pnpm lint` |
| Lint + fix | `pnpm lint:fix` |
| Format | `pnpm format` |
| Format check | `pnpm format:check` |
| Type check | `pnpm typecheck` |
| Build (all) | `pnpm build` |
| Build (single) | `pnpm --filter web build` |

Dev ports: web = 3000, dashboard = 3001, landing = 3002.

## Validation Approach

**Don't build after every small change.** The validation flow is:

1. `pnpm lint` — catches errors and code quality issues (oxlint with type-aware checking)
2. `pnpm format:check` — verifies formatting (oxfmt)
3. `pnpm typecheck` — runs TypeScript type checking

If lint passes, assume changes work. Build only when you need to verify the full output or before deployment.

## Tooling

- **Linter**: oxlint (not ESLint) — Rust-based, type-aware
- **Formatter**: oxfmt (not Prettier) — Rust-based, 2-space indent, semicolons, 100 char width, trailing commas, Tailwind class sorting
- **Git hooks**: husky + lint-staged runs formatting and linting on pre-commit

## Adding UI Components

```bash
pnpm dlx shadcn@latest add <component> -c apps/web
```

Components land in `packages/ui/src/components/`. Import as `@workspace/ui/components/<name>`.

## Dependency Management

All dependency versions are centralized in the `catalog:` section of `pnpm-workspace.yaml`. When adding or updating a dependency:

1. Add/update the version in `pnpm-workspace.yaml` under `catalog:`
2. Reference it in the app's `package.json` as `"package": "catalog:"`
3. Run `pnpm install`
