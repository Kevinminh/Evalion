import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouteContext,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { authClient } from "@/lib/auth-client";
import { getToken } from "@/lib/auth-server";

import appCss from "@workspace/ui/globals.css?url";
import { Toaster } from "@workspace/ui/components/sonner";

const getAuth = createServerFn({ method: "GET" }).handler(async () => {
  return await getToken();
});

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  convexQueryClient: ConvexQueryClient;
}>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "FagPrat" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  beforeLoad: async (ctx) => {
    const token = await getAuth();

    ctx.context.convexQueryClient.serverHttpClient?.setAuth(token ?? undefined);

    return {
      isAuthenticated: !!token,
      token,
    };
  },
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: ErrorFallback,
  shellComponent: RootDocument,
});

function RootComponent() {
  const context = useRouteContext({ from: Route.id });
  return (
    <QueryClientProvider client={context.queryClient}>
      <ConvexBetterAuthProvider
        client={context.convexQueryClient.convexClient}
        authClient={authClient}
        initialToken={context.token}
      >
        <Outlet />
        <Toaster />
      </ConvexBetterAuthProvider>
    </QueryClientProvider>
  );
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background">
      <h1 className="text-2xl font-extrabold text-foreground">Noe gikk galt</h1>
      <p className="text-muted-foreground">{error.message}</p>
      <button
        onClick={() => window.location.reload()}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      >
        Last inn siden på nytt
      </button>
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background">
      <h1 className="text-4xl font-extrabold text-foreground">404</h1>
      <p className="text-muted-foreground">Siden ble ikke funnet</p>
      <Link to="/" className="text-sm font-semibold text-primary hover:underline">
        Tilbake til forsiden
      </Link>
    </div>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
