# Auth Patterns

This project uses **Better Auth** (`better-auth ^1.5.6`) integrated with Convex via `@convex-dev/better-auth`. There is **no Drizzle / SQL adapter** — Better Auth's data lives inside the Convex `betterAuth` component. See [`backend.md`](backend.md) for how the component is wired in `packages/backend/convex/`.

## How the pieces fit

```
Frontend ── @convex-dev/better-auth/react ─┐
                                           │
                                           ▼
              packages/backend/convex/auth.ts  ──→  components.betterAuth (component)
                                           │             │
                                           │             └─ owns its own schema (users, sessions, accounts)
                                           ▼
                          packages/backend/convex/http.ts mounts /api/auth/*
```

- `authComponent` (in `convex/auth.ts`) is created with `createClient<DataModel, typeof schema>(components.betterAuth, …)`.
- `createAuth(ctx)` / `options` configures email-password, Google OAuth, `trustedOrigins`, and optional cross-subdomain cookies via `COOKIE_DOMAIN`.
- `authComponent.registerRoutes(http, createAuth)` mounts the Better Auth HTTP routes under the Convex deployment.
- An `onDelete` trigger on the `user` table cascades a user's own live sessions, votes/ratings/begrunnelser/students, fagprats, and drafts.

## Frontend auth client

Each app exports an auth client from its `lib/auth-client.ts` (a thin wrapper around `createAuthClient` from `better-auth/react` plus the Convex plugin). Use it for sign-in / sign-up / sign-out and for reading the session reactively:

```tsx
import { authClient } from "@/lib/auth-client";

const { data: session } = authClient.useSession();
```

The Convex provider tree is set up in each app's `__root.tsx` (TanStack apps) or `app/components/providers.tsx` (landing). It wires `ConvexBetterAuthProvider` so Convex queries see the authenticated identity:

```tsx
<ConvexBetterAuthProvider
  client={convexClient}
  authClient={authClient}
  initialToken={token}
>
  …
</ConvexBetterAuthProvider>
```

## Server-side token (TanStack apps)

`apps/web` and `apps/dashboard` read the cookie server-side in the root `beforeLoad` and prime the Convex client so loaders run authenticated:

```tsx
const getAuth = createServerFn({ method: "GET" }).handler(async () => {
  return await getToken();           // from @/lib/auth-server
});

export const Route = createRootRouteWithContext<…>()({
  beforeLoad: async (ctx) => {
    const token = await getAuth();
    if (token) {
      ctx.context.convexQueryClient.serverHttpClient?.setAuth(token);
    }
    return { isAuthenticated: !!token, token };
  },
  …
});
```

## Route guards (TanStack apps)

Layout routes are the right place to guard whole sections:

```tsx
// apps/dashboard/src/routes/_authed.tsx
export const Route = createFileRoute("/_authed")({
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) throw redirect({ to: "/login" });
  },
});
```

Use `_authed` for "must be logged in but no shared chrome" (live console, analytics) and `_dashboard` for "logged in **and** wrapped in the sidebar shell" (teacher tools).

## Guest sessions on `apps/web`

Students join sessions without an account. The Convex client is created with `expectAuth: true`, which means it blocks queries until `setAuth` or `clearAuth` is called. For unauthenticated visitors we explicitly call `clearAuth()`:

```tsx
function ClearAuthForGuests() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const client = useConvex();
  useEffect(() => {
    if (!isLoading && !isAuthenticated) client.clearAuth();
  }, [isLoading, isAuthenticated, client]);
  return null;
}
```

This component is mounted inside `ConvexBetterAuthProvider` in `apps/web/src/routes/__root.tsx`. Don't remove it — without it, students hang forever waiting for an auth token that never arrives.

## Landing app middleware

The Next.js landing site uses `middleware.ts` to gate the `(workspace)` group:

```ts
const PROTECTED_PATTERNS = [/^\/lag-pastander(\/|$)/];

export function middleware(req: NextRequest) {
  if (!PROTECTED_PATTERNS.some((re) => re.test(req.nextUrl.pathname))) {
    return NextResponse.next();
  }
  if (!getSessionCookie(req)) {
    const url = req.nextUrl.clone();
    url.pathname = "/logg-inn";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
```

Add new protected patterns to `PROTECTED_PATTERNS` and the `matcher` config when introducing new gated workspace routes.

## Backend access control

Inside Convex queries and mutations, derive the caller from `ctx.auth.getUserIdentity()` (or `getAuthUser` re-exported from `auth.ts`). Use `helpers.ts#requireAdmin` to gate admin-only actions like `reddi.generateStatements` and `aiPrompts` writes.

```ts
import { requireAdmin } from "./helpers";

export const someAdminThing = mutation({
  args: { … },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    …
  },
});
```

## Shared auth UI

Login, register, logout, and the user menu live in `packages/evalion/src/components/auth/` so all three apps render the same forms. Pull them in via `@workspace/evalion/components/auth/login-form` etc. — don't fork copies into individual apps.
