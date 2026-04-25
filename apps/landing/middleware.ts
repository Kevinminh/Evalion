import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

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

export const config = {
  matcher: ["/lag-pastander/:path*"],
};
