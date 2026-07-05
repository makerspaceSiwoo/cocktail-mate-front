import type { Metadata } from "next";
import { Suspense } from "react";

import { ResetPasswordForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "비밀번호 재설정 | Cocktail Mate",
};

export default function ResetPasswordPage() {
  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      {/*
        ResetPasswordForm uses useSearchParams() internally, which requires a
        Suspense boundary per Next.js App Router rules.
      */}
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
