import { NextRequest, NextResponse } from "next/server";

// NOTE(auth): 프로덕션 환경에서는 프론트(Vercel)와 API 서버가 도메인이 달라
// 백엔드가 발급하는 HttpOnly 쿠키가 Next.js 미들웨어(프론트 도메인)에서는 보이지 않는다.
// 따라서 미들웨어에서 쿠키 존재 여부로 인증을 판단하면 로그인 상태에서도 /my 접근이
// 차단되어 리다이렉트 루프가 발생한다.
//
// 인증 가드는 클라이언트 사이드(my-profile.tsx, AuthProvider)에서 담당한다.
// 미들웨어는 요청을 그대로 통과시키고, 실제 인증 여부 확인은 /auth/my-info API 호출 결과로
// 처리한다.
export const config = {
  matcher: ["/my/:path*"],
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function proxy(_req: NextRequest) {
  return NextResponse.next();
}
