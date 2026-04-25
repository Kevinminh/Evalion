import { createFileRoute } from "@tanstack/react-router";
import { createAuthHandler } from "@workspace/evalion/lib/auth-api-handler";

const authHandler = createAuthHandler(process.env.COOKIE_DOMAIN);

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => authHandler(request),
      POST: ({ request }) => authHandler(request),
    },
  },
});
