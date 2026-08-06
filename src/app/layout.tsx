import type { Metadata } from "next";
import localFont from "next/font/local";

import { AuthProvider } from "@/features/auth";
import { ReactQueryProvider } from "@/shared/providers/react-query-provider";

import "./globals.css";

// 앱 전역 단일 폰트 (한/영 공용). --font-pretendard 를 <html> 에 주입한다.
const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  variable: "--font-pretendard",
  weight: "45 920",
});

export const metadata: Metadata = {
  title: "Cocktail Mate",
  icons: {
    // 레거시·기본 요청은 src/app/favicon.ico (멀티사이즈)가 처리하고,
    // 모던 브라우저용으로 사이즈별 PNG 를 함께 노출한다.
    icon: [
      { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon-64.png", type: "image/png", sizes: "64x64" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full overflow-hidden overscroll-none`}>
      <body className="text-text h-full overflow-hidden overscroll-none bg-white">
        <ReactQueryProvider>
          <AuthProvider>
            <AppShell>{children}</AppShell>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

/**
 * 앱 셸. PC/모바일 분기를 CSS 로만 한다.
 *
 * 이전에는 headers() 로 user-agent 를 읽어 두 개의 셸 중 하나를 골랐는데,
 * 루트 레이아웃에서 dynamic API 를 쓰면 하위 라우트 전체가 dynamic 으로 전염돼
 * 프리렌더된 정적 셸이 사라지고 <Link> prefetch 가 캐시할 대상을 잃는다
 * (= 네비게이션마다 콜드 서버 왕복). 그래서 UA 스니핑 대신 `pointer-fine`
 * (= 주 입력장치가 마우스/트랙패드 → 데스크탑 브라우저) 미디어 쿼리를 쓴다.
 *
 * - pointer: fine  (PC)    → 430px 중앙 정렬 + 좌우 흰 여백. 컨테이너 폭이 430
 *                            이므로 BottomNav 는 항상 default(border-t).
 * - pointer: coarse (터치) → 셸이 viewport 전체 폭. 컨테이너 폭 > 430 이면
 *                            BottomNav 가 pill 로 전환된다.
 */
function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-dvh overflow-hidden bg-white">
      <span
        aria-hidden="true"
        className="text-muted pointer-events-none fixed top-6 left-6 hidden text-sm font-medium pointer-fine:block"
      >
        pc 입니다
      </span>
      {/*
        @container/shell: 이 div를 "shell"이라는 이름의 container query 기준점으로 설정.
        자식 요소들이 이 컨테이너의 너비를 기준으로 반응형 스타일을 적용할 수 있음.
        BottomNav 의 @min-[431px]/shell: 조건이 이 폭을 기준으로 평가된다.
      */}
      <div className="bg-bg @container/shell mx-auto flex h-full min-h-0 w-full flex-col overflow-hidden pointer-fine:max-w-[430px]">
        {children}
      </div>
    </div>
  );
}
