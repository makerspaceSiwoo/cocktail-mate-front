import { NextResponse, type NextRequest } from "next/server";

// 로그인 필수 그룹의 경로들. (member) 라우트 그룹 아래 페이지를 여기에 추가.
// 그룹 디렉토리명 `(member)`은 URL에 노출되지 않으므로 실제 path 패턴을 적는다.
export const config = {
  matcher: ["/me/:path*", "/favorites/:path*"],
};

// 세션 식별 쿠키명. Supabase 도입 시 sb-access-token 등 실제 이름으로 교체.
const SESSION_COOKIE = "session";

export function middleware(req: NextRequest) {
  if (req.cookies.has(SESSION_COOKIE)) {
    return NextResponse.next();
  }
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}
