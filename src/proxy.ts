import { NextRequest, NextResponse } from "next/server";

// /my/* 인증 가드를 여기 한 곳에서 처리한다(클라 컴포넌트 가드 통합).
//
// 백엔드가 인증 쿠키를 Domain=.cocktail-mate.com 로 발급하므로(프론트·API 서브도메인
// 공유), 프론트 도메인에서 도는 이 미들웨어가 access_token 쿠키를 읽을 수 있다.
// 쿠키가 없으면(= 미로그인/세션 없음) /sign-in 으로 보낸다(로그인 후 returnTo 로 복귀).
//
// ⚠️ 로컬(localhost)에서 배포 API 에 붙는 경우, 그 쿠키(.cocktail-mate.com)는 localhost
// 로 전송되지 않아 항상 미인증으로 간주되어 /my 가 sign-in 으로 튕긴다. 로컬에서 /my 를
// 보려면 access_token 쿠키가 localhost 로 실려야 한다(로컬 백엔드 + 로그인).

const ACCESS_TOKEN_COOKIE = "access_token";

export const config = {
  // /my 자신과 모든 하위 경로(/my/edit, /my/likes, ...)를 가드한다.
  matcher: ["/my", "/my/:path*"],
};

export function proxy(req: NextRequest) {
  if (req.cookies.has(ACCESS_TOKEN_COOKIE)) return NextResponse.next();

  const signInUrl = new URL("/sign-in", req.url);
  signInUrl.searchParams.set("returnTo", req.nextUrl.pathname);
  return NextResponse.redirect(signInUrl);
}
