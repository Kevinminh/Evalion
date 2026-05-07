# Convex Backend (`packages/backend`)

The single source of truth for data, auth, and AI generation. All three apps share this deployment.

> **Always read `packages/backend/convex/_generated/ai/guidelines.md` before editing Convex code.** It overrides general Convex knowledge with project-specific rules.

## File layout

```
packages/backend/convex/
├── schema.ts               Tables, indexes, validators (statementValidator)
├── convex.config.ts        defineApp() — registers the Better Auth component
├── auth.config.ts          AuthConfig provider for Convex
├── auth.ts                 Better Auth client, options, triggers (cascading delete)
├── http.ts                 HTTP router — mounts Better Auth routes
├── betterAuth/             Auth component schema + adapter (component-local)
├── _generated/             Convex codegen output (do not edit by hand)
├── helpers.ts              Cross-function helpers (e.g. requireAdmin)
├── fagprats.ts             FagPrat CRUD, search, visibility logic
├── liveSessions.ts         Live-session lifecycle, voting, group/timer state
├── pastandDrafts.ts        Standalone Påstandsgenerator drafts
├── reddi.ts                AI statement generator (OpenAI + Anthropic)
├── aiPrompts.ts            Editable system prompts (admin)
├── emailSubscribers.ts     Newsletter / waitlist captures
└── seed.ts                 Dev-only seed script
```

## Tables

| Table | Purpose | Key indexes |
| --- | --- | --- |
| `fagprats` | Authored question sets | `by_author`, `by_visibility`, `by_visibility_subject`, `by_visibility_level`, `by_visibility_subject_level`, `by_subject`, `search_fagprats` (search index over `title`, filtered by `subject`/`level`/`type`/`visibility`) |
| `liveSessions` | Active/ended sessions | `by_joinCode`, `by_teacher`. Holds session config (group toggle/count, transcription, self-eval) and timer state (`timerDuration`, `timerStartedAt`, `timerPausedAt`, `timerRemainingAtPause`). |
| `sessionStudents` | Students in a session | `by_session` |
| `sessionVotes` | Per-round votes | `by_session_statement`, `by_session_statement_student_round` |
| `sessionRatings` | Self-eval 1–5 ratings | `by_session_statement`, `by_session_statement_student` |
| `sessionBegrunnelser` | Free-text justifications, optional `highlighted` flag | `by_session_statement`, `by_session_statement_student_round`, `by_session_student` |
| `pastandDrafts` | Per-user landing-app drafts | `by_user` |
| `aiPrompts` | Editable AI system prompts keyed by name | `by_key` |
| `emailSubscribers` | Email captures from landing | `by_email` |

The shared `statementValidator` in `schema.ts` defines the canonical statement shape — text, fasit (`sant` | `usant` | `delvis`), explanation, optional color/begrunnelse/image/explanationImage. Reuse it instead of redeclaring inline validators.

## Authentication

Auth lives in three layers:

1. **`betterAuth/`** — the Convex auth component. Owns its own schema (users, sessions, accounts) inside the component boundary.
2. **`convex.config.ts`** — `app.use(betterAuth)` registers it.
3. **`auth.ts`** — top-level project glue:
   - `authComponent = createClient<DataModel, typeof schema>(components.betterAuth, …)` with an `onDelete` trigger that cascades a user's owned data (live sessions and their children, fagprats, drafts).
   - `createAuth(ctx)` / `options` — Better Auth config: email/password, Google OAuth, optional `crossSubDomainCookies` driven by `COOKIE_DOMAIN`, `trustedOrigins` from env.
   - `getCurrentUser` query — exposes `ctx.auth.getUserIdentity()` to clients.
4. **`http.ts`** — `authComponent.registerRoutes(http, createAuth)` exposes `/api/auth/*` over Convex HTTP.

Frontends authenticate via `@convex-dev/better-auth/react` (`ConvexBetterAuthProvider`). On TanStack apps the root route's `beforeLoad` reads the cookie via a server function and calls `convexQueryClient.serverHttpClient?.setAuth(token)` so loaders see the authenticated identity. Guest students (apps/web join-by-code flow) require an explicit `client.clearAuth()` call — see the `ClearAuthForGuests` workaround in `apps/web/src/routes/__root.tsx`.

## AI generation (`reddi.ts`)

`reddi.generateStatements` is a `"use node"` action that calls OpenAI or Anthropic depending on the admin-selected model. Behaviour:

- Requires admin (`requireAdmin` from `helpers.ts`).
- Reads the system prompt from `aiPrompts` keyed by the model/preset.
- Parses provider responses tolerantly — accepts top-level arrays or objects keyed by `statements` / `påstander` / `pastander` / `data` / `items` / `result`, plus `{ sant, usant, delvis }` shapes.
- Returns `GeneratedStatement[]` shaped like `statementValidator` (text + fasit + explanation).

The OpenAI/Anthropic API keys come from `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` in the backend's `.env.local`.

## Conventions

- **Validators**: prefer `v.literal` unions for enum-like values (`fasit`, `status`, `type`, `visibility`). Reuse `statementValidator` for nested statements.
- **Indexes**: query by index — never `.collect()` then `.filter()`. Add an index when you need a new access pattern; favour compound indexes (`by_visibility_subject_level`) over post-filtering.
- **Mutations that fan out** (e.g. cascading deletes in `auth.ts`) should walk indexes and `await ctx.db.delete` per row; do not assume bulk delete.
- **Optional fields** stay optional in the validator to avoid breaking existing rows. When you must change shape, follow the widen → migrate → narrow workflow.
- **Actions vs mutations/queries**: only actions can use Node APIs (`"use node"`), make external HTTP calls, or use the OpenAI/Anthropic SDKs. Wrap data access from inside actions through `ctx.runQuery` / `ctx.runMutation`.

## Deployment

```bash
pnpm db:dev         # Watches and pushes schema/functions to dev deployment
pnpm db:codegen     # Regenerate _generated/* without running dev
pnpm db:deploy      # Deploy to production (needs CONVEX_DEPLOY_KEY)
pnpm db:dashboard   # Open the Convex dashboard
pnpm db:logs        # Tail function logs
```

`CONVEX_DEPLOYMENT` in `packages/backend/.env.local` controls which dev deployment `db:dev` targets.
