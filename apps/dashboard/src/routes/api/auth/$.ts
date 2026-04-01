import { handler } from "@/lib/auth-server";
import { createFileRoute } from "@tanstack/react-router";
import { setResponseHeader } from "@tanstack/react-start/server";

const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN;

async function authHandler(request: Request) {
  const response = await handler(request);

  if (!COOKIE_DOMAIN) return response;

  const setCookieHeaders = response.headers.getSetCookie?.() ?? [];
  if (setCookieHeaders.length === 0) return response;

  // Rewrite all cookies with the correct domain
  const rewritten = setCookieHeaders.map(
    (cookie) =>
      cookie.replace(/;\s*domain=[^;]*/i, "") + `; Domain=${COOKIE_DOMAIN}`,
  );

  // Set rewritten cookies on the h3 response (replaces any existing)
  setResponseHeader("set-cookie", rewritten);

  // Return response WITHOUT Set-Cookie headers to prevent duplicates
  const cleanHeaders = new Headers();
  for (const [key, value] of response.headers.entries()) {
    if (key.toLowerCase() !== "set-cookie") {
      cleanHeaders.append(key, value);
    }
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: cleanHeaders,
  });
}

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => authHandler(request),
      POST: ({ request }) => authHandler(request),
    },
  },
});
