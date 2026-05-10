import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/me/:path*", "/favorites/:path*", "/settings/:path*"],
};

export function middleware(req: NextRequest) {
  const hasSession = req.cookies.has("sb-access-token");
  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
