import type { Metadata } from "next";

import { getDevice } from "@/shared/lib/device";

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
      <body className="bg-white text-text">
        {device === "pc" ? (
          <PcShell>{children}</PcShell>
        ) : (
          <MobileShell>{children}</MobileShell>
        )}
      </body>
    </html>
  );
}

function PcShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-white">
      <span
        aria-hidden="true"
        className="pointer-events-none fixed left-6 top-6 text-sm font-medium text-muted"
      >
        pc 입니다
      </span>
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-bg @container/shell">
        {children}
      </div>
    </div>
  );
}

function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-bg @container/shell">
      {children}
    </div>
  );
}
