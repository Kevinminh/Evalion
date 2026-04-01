import { handler } from "@/lib/auth-server";
import { createFileRoute } from "@tanstack/react-router";
import { setResponseHeader } from "@tanstack/react-start/server";

const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN;

async function authHandler(request: Request) {
  const response = await handler(request);

  if (COOKIE_DOMAIN) {
    const setCookieHeaders = response.headers.getSetCookie?.() ?? [];
    for (const cookie of setCookieHeaders) {
      const rewritten =
        cookie.replace(/;\s*domain=[^;]*/i, "") + `; Domain=${COOKIE_DOMAIN}`;
      setResponseHeader("set-cookie", rewritten);
    }
  }

  return response;
}

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => authHandler(request),
      POST: ({ request }) => authHandler(request),
    },
  },
});
