import type { Metadata } from "next";
import { Suspense } from "react";

import { VerifyEmailView } from "@/features/auth/verify-email-view";

export const metadata: Metadata = {
  title: "이메일 인증 | Cocktail Mate",
};

export default function VerifyEmailPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
      <Suspense>
        <VerifyEmailView />
      </Suspense>
    </main>
  );
}
