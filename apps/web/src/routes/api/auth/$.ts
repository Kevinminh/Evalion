import { handler } from "@/lib/auth-server";
import { createFileRoute } from "@tanstack/react-router";

const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN;

async function authHandler(request: Request) {
  const response = await handler(request);
  if (!COOKIE_DOMAIN) return response;

  const setCookieHeaders = response.headers.getSetCookie();
  if (setCookieHeaders.length === 0) return response;

  const newHeaders = new Headers();
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "set-cookie") {
      newHeaders.append(key, value);
    }
  });

  for (const cookie of setCookieHeaders) {
    const rewritten =
      cookie.replace(/;\s*domain=[^;]*/i, "") + `; Domain=${COOKIE_DOMAIN}`;
    newHeaders.append("set-cookie", rewritten);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
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
