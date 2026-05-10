import { NextResponse } from "next/server";

/**
 * (member) 라우트 그룹의 인증 가드 자리.
 *
 * 활성화 전에 정해야 하는 값들:
 * - matcher: 어떤 경로에서 미들웨어가 동작할지 (e.g. ["/me/:path*", "/favorites/:path*"])
 * - 세션 식별 방법: Supabase 쿠키명, JWT 헤더, 자체 세션 등
 *
 * 활성화 시 예시 흐름:
 *   1. 요청 쿠키/헤더에서 세션 확인
 *   2. 없으면 /login?next=원래경로 로 redirect
 *   3. 있으면 NextResponse.next() 로 통과
 *
 * 현재는 모든 요청을 그대로 통과시키는 no-op.
 */
export function middleware() {
  return NextResponse.next();
}

// matcher를 비워두면 모든 경로에서 실행되지만, 본문이 no-op이라 영향 없음.
// 실제 가드를 켤 때 아래 config를 활성화:
// export const config = { matcher: ["/me/:path*", "/favorites/:path*"] };
