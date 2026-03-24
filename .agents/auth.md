# Auth Patterns

This project uses [Better Auth](https://www.better-auth.com/) (`better-auth ^1.5.6`).

## Setup

Auth configuration should live in a shared location (e.g., `packages/auth/` or `apps/web/src/lib/auth.ts`). The auth instance is created with `betterAuth()`:

```tsx
import { betterAuth } from "better-auth"

export const auth = betterAuth({
  database: drizzleAdapter(db),
  // ...providers, plugins
})
```

Create an auth client for React:

```tsx
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_AUTH_URL,
})
```

## Route Guards

Protect routes using TanStack Router's `beforeLoad` hook:

```tsx
export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ context }) => {
    const session = await authClient.getSession()
    if (!session) {
      throw redirect({ to: "/login" })
    }
  },
})
```

For layouts that guard all child routes, use `beforeLoad` on the layout route (e.g., `_authenticated.tsx`).

## Server-side Auth

Use `createServerFn` to verify auth on the server:

```tsx
import { createServerFn } from "@tanstack/react-start"

const getSession = createServerFn({ method: "GET" }).handler(async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers })
  return session
})
```

## Middleware

For auth middleware that runs on every request, use TanStack Start's middleware system or Nitro server middleware depending on the use case.

## Auth Utilities

Export reusable auth helpers (e.g., `useSession`, `useRequireAuth`) from a shared location so all routes use consistent auth checks.
