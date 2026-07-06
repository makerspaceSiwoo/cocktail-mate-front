import type { Metadata } from "next";
import { Suspense } from "react";

import { KakaoSignInView } from "@/features/auth";

export const metadata: Metadata = {
  title: "로그인 | Cocktail Mate",
};

export default function SignInPage() {
  return (
    <main className="flex flex-1 flex-col justify-center px-6 py-10">
      {/*
        KakaoSignInView uses useAuth() which is a client context hook,
        wrapping in Suspense satisfies App Router requirements for
        any client-side hooks that may suspend.
      */}
      <Suspense>
        <KakaoSignInView />
      </Suspense>
    </main>
  );
}
