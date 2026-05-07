# Architecture

A high-level map of how the Evalion monorepo fits together. For framework-specific patterns see the sibling docs in this folder.

## Apps and what runs where

| App | Domain | Stack | Port | Purpose |
| --- | --- | --- | --- | --- |
| `apps/web` | `play.co-lab.no` | TanStack Start + Vite + React 19 | 3000 | Student-facing game client. Students join with a 6-character code, vote, discuss, and self-evaluate. |
| `apps/dashboard` | `dashboard.co-lab.no` | TanStack Start + Vite + React 19 | 3001 | Teacher dashboard. Manage FagPrat sets, run live sessions, view analytics and history. |
| `apps/landing` | `co-lab.no` | Next.js 15 App Router + Turbopack | 3002 | Marketing site, public FagPrat demo, plus a logged-in workspace for the standalone Påstandsgenerator. |

All three apps speak to the same Convex deployment and share a single Better Auth instance, so an account works across them.

## Packages

```
packages/
├── backend/        @workspace/backend   Convex schema, functions, HTTP, auth
├── evalion/        @workspace/evalion   Cross-app feature code (depends on backend + ui)
├── ui/             @workspace/ui        Pure UI primitives (no backend deps)
└── config/         @evalion/config      Shared base tsconfig
```

### Decision: where does new code go?

```
                         ┌─ touches Convex/auth or shared by 2+ apps?
                         │
new component ──┬──── yes ┴──→  packages/evalion
                │
                ├──── no, pure presentational primitive ──→  packages/ui
                │
                └──── app-specific, single-app feature ──→  apps/<app>/src
```

Rules of thumb:

- **`packages/ui` must not import from `@workspace/backend`** — it stays a dumb presentation layer so it can be consumed without pulling Convex into the bundle.
- **`packages/evalion` is the right home** for things like the live-session teacher panel, the auth login/register forms, the workspace shell, and route-level skeletons that two or more apps render.
- **`apps/<app>` owns its own routes, providers, and one-off UI**. Don't promote a component to `@workspace/evalion` until a second app actually needs it.

## Routing layout

### `apps/web` (TanStack Router file-based)

```
routes/
├── __root.tsx                       Root document, providers, error/not-found fallbacks
├── index.tsx                        Join-code entry
├── login.tsx / logout.tsx
├── delta.tsx                        Marketing/early-access surface
├── _authed.tsx + _authed/           Authenticated-only routes (currently /private)
├── liveokt.$sessionId.tsx           Student lobby/session shell
├── liveokt.$sessionId.index.tsx
├── liveokt.$sessionId.steg.$step.tsx Step-driven student game flow
├── -liveokt/                        Step components (1-vote → 6-rating-summary)
├── -spill/                          Student game UI (vote, discussion, reveal, …)
├── spill.$studentId.tsx             Per-student game page
└── api/auth                         Better Auth HTTP handler mount
```

The `-liveokt` and `-spill` directories are TanStack Router "private" folders — they are imported by routes but are not themselves routable.

### `apps/dashboard` (TanStack Router file-based)

```
routes/
├── __root.tsx
├── login.tsx / logout.tsx / register.tsx
├── _authed.tsx + _authed/           Auth-required surfaces
│   ├── analytics.$id.tsx            Post-session analytics
│   ├── liveokt.$id.tsx              Live teacher console
│   └── private.tsx
├── _dashboard.tsx + _dashboard/     Dashboard chrome (sidebar) + teacher tools
│   ├── index.tsx                    Dashboard home
│   ├── lag-fagprat.tsx              Author a new FagPrat
│   ├── velg-pastander.tsx           Pick statements
│   ├── lagre-fagprat.tsx            Save/finalize a FagPrat
│   ├── min-samling.tsx              Personal collection
│   ├── historikk.tsx                Session history
│   ├── fagprat.$id.index.tsx        FagPrat detail view
│   ├── fagprat.$id.rediger.tsx      Edit a FagPrat
│   └── profile.tsx
└── api/auth                         Better Auth HTTP handler mount
```

`_authed` and `_dashboard` are separate guarded layouts: live console / analytics screens want a focused, full-bleed UI, while the rest of the teacher tools share the sidebar shell.

### `apps/landing` (Next.js App Router)

```
app/
├── (marketing)/                     Public site
│   ├── page.tsx                     Homepage
│   ├── logg-inn/, registrer-deg/    Auth pages (Better Auth client)
│   ├── teamet/, personvern-og-vilkar/
├── (workspace)/                     Logged-in standalone Påstandsgenerator
│   ├── lag-pastander/               Generator + drafts + PDF export
│   ├── velg-pastander/              Browse/select statements
│   └── profile/
├── fagprat-demo/                    Public interactive demo
├── api/auth/[...all]/route.ts       Better Auth HTTP handler
├── components/, hooks/, lib/        Marketing-only helpers
├── robots.ts, sitemap.ts, layout.tsx
└── middleware.ts                    Guards /lag-pastander/* with session cookie
```

`middleware.ts` is the auth gate for the workspace group; everything else under `(marketing)` is public.

## Data flow

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  apps/web   │      │ apps/landing│      │apps/dashboard│
└──────┬──────┘      └──────┬──────┘      └──────┬──────┘
       │                    │                    │
       │  @workspace/evalion (shared UI + lib)   │
       └────────────────────┼────────────────────┘
                            │
                  @workspace/backend (Convex)
                            │
                ┌───────────┴───────────┐
                │ Better Auth component │
                └───────────────────────┘
```

- Frontends use `@convex-dev/react-query` to subscribe to Convex queries through TanStack Query.
- Live-session screens render a single Convex query subscription per logical view; the teacher console and student step components share the same documents.
- The landing app uses Next's middleware for auth gating; the TanStack apps use route-level `beforeLoad` hooks that call `getToken()` server-side.

## Build & tooling

- **Turborepo** orchestrates `dev`, `build`, `lint`, `format`, and `typecheck`. `dev` is non-cached and persistent; `build` declares Convex's `convex/_generated/**` and the apps' `.output/**` and `.vercel/output/**` as outputs.
- **pnpm workspaces** with the `catalog:` protocol — pin all dependency versions in `pnpm-workspace.yaml` and reference them as `"pkg": "catalog:"` from individual `package.json` files.
- **oxlint + oxfmt** replace ESLint/Prettier. oxlint loads jsPlugins for Turbo and TanStack Router/Query; `consistent-type-assertions` is `never` (no `as` casts).
- **Vite plugin order** (web/dashboard): `nitro()`, `viteTsConfigPaths()`, `tailwindcss()`, `tanstackStart()`, `viteReact()`. `@convex-dev/better-auth` is in `ssr.noExternal`.
- **Next config** (landing): `transpilePackages: ["@workspace/ui", "@workspace/backend"]` — workspace packages are TS source, not pre-built.
