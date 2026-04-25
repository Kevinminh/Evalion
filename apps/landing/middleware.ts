import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PATTERNS = [/^\/lag-pastander(\/|$)/];

export function middleware(req: NextRequest) {
  if (!PROTECTED_PATTERNS.some((re) => re.test(req.nextUrl.pathname))) {
    return NextResponse.next();
  }

  const hasSession = req.cookies.getAll().some((c) => c.name.startsWith("better-auth"));
  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/logg-inn";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/lag-pastander/:path*"],
};
