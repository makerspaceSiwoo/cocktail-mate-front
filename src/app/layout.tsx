import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cocktail Mate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-white text-text">
        <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-bg">
          {children}
        </div>
      </body>
    </html>
  );
}
