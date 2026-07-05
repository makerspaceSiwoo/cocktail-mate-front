import type { Metadata } from "next";
import { Suspense } from "react";

import { ForgotPasswordForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "비밀번호 찾기 | Cocktail Mate",
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <Suspense>
        <ForgotPasswordForm />
      </Suspense>
    </main>
  );
}
