import { NextRequest, NextResponse } from "next/server";

// 로그인 필수 그룹의 경로들. (member) 라우트 그룹 아래 페이지를 여기에 추가.
// 그룹 디렉토리명 `(member)`은 URL에 노출되지 않으므로 실제 path 패턴을 적는다.
export const config = {
  matcher: ["/my/:path*"],
};

// TODO(auth): 백엔드에서 발급한 JWT 쿠키(HttpOnly · Secure · SameSite) 서명 검증 추후 구현.
// 현재는 쿠키 존재 여부만 확인한다.
const ACCESS_COOKIE = "access_token";

export function proxy(req: NextRequest) {
  if (req.cookies.has(ACCESS_COOKIE)) {
    return NextResponse.next();
  }
  const url = req.nextUrl.clone();
  url.pathname = "/sign-in";
  url.searchParams.set("next", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}
