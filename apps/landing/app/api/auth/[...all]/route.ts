import { handler } from "@/lib/auth-server";

const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN;

function rewriteCookieDomain(response: Response): Response {
  if (!COOKIE_DOMAIN) return response;

  const setCookies = response.headers.getSetCookie?.() ?? [];
  if (setCookies.length === 0) return response;

  const rewritten = setCookies.map(
    (c) => c.replace(/;\s*domain=[^;]*/i, "") + `; Domain=${COOKIE_DOMAIN}`,
  );

  const headers = new Headers();
  for (const [key, value] of response.headers.entries()) {
    if (key.toLowerCase() !== "set-cookie") {
      headers.append(key, value);
    }
  }
  for (const cookie of rewritten) {
    headers.append("set-cookie", cookie);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export async function GET(request: Request) {
  return rewriteCookieDomain(await handler.GET(request));
}

export async function POST(request: Request) {
  return rewriteCookieDomain(await handler.POST(request));
}
