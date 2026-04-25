import { setResponseHeader } from "@tanstack/react-start/server";

import { handler } from "@workspace/evalion/lib/auth-server";

/**
 * Creates a TanStack Start-compatible auth handler that rewrites any
 * Set-Cookie headers to use the configured `COOKIE_DOMAIN` when present.
 * Both `apps/dashboard` and `apps/web` mount this at /api/auth/$.
 */
export function createAuthHandler(cookieDomain: string | undefined) {
  return async function authHandler(request: Request): Promise<Response> {
    const response = await handler(request);

    if (!cookieDomain) return response;

    const setCookieHeaders = response.headers.getSetCookie?.() ?? [];
    if (setCookieHeaders.length === 0) return response;

    // Rewrite all cookies with the correct domain
    const rewritten = setCookieHeaders.map(
      (cookie: string) => cookie.replace(/;\s*domain=[^;]*/i, "") + `; Domain=${cookieDomain}`,
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
  };
}
