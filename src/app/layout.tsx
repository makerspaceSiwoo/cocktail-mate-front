import type { Metadata } from "next";

import { getDevice } from "@/shared/lib/device";
import { ReactQueryProvider } from "@/shared/providers/react-query-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Cocktail Mate",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const device = await getDevice();
  return (
    <html lang="ko">
      <body className="text-text bg-white">
        <ReactQueryProvider>
          {device === "pc" ? <PcShell>{children}</PcShell> : <MobileShell>{children}</MobileShell>}
        </ReactQueryProvider>
      </body>
    </html>
  );
}

function PcShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-white">
      <span
        aria-hidden="true"
        className="text-muted pointer-events-none fixed top-6 left-6 text-sm font-medium"
      >
        pc 입니다
      </span>
      {/*
        @container/shell: 이 div를 "shell"이라는 이름의 container query 기준점으로 설정.
        자식 요소들이 이 컨테이너의 너비를 기준으로 반응형 스타일을 적용할 수 있음.

        PC의 경우 max-w-[430px]로 고정되므로, 자식의 @min-[431px]/shell: 조건은 절대 발동 안 됨.
        따라서 BottomNav는 항상 default 스타일(border-t)만 적용됨.
      */}
      <div className="bg-bg @container/shell mx-auto flex min-h-screen w-full max-w-[430px] flex-col">
        {children}
      </div>
    </div>
  );
}

function MobileShell({ children }: { children: React.ReactNode }) {
  {
    /*
      @container/shell: 이 div를 "shell"이라는 이름의 container query 기준점으로 설정.

      Mobile의 경우 w-full이므로, 이 컨테이너 너비 = viewport 너비.
      - viewport ≤ 430px: @min-[431px]/shell: 조건 미발동 → BottomNav는 default(border-t)
      - viewport > 430px: @min-[431px]/shell: 조건 발동 → BottomNav는 pill(rounded-full + shadow)
    */
  }
  return <div className="bg-bg @container/shell flex min-h-screen w-full flex-col">{children}</div>;
}
