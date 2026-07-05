import type { Metadata } from "next";
import { Suspense } from "react";

import { SignInForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "로그인 | Cocktail Mate",
};

export default function SignInPage() {
  return (
    <main className="flex flex-1 flex-col justify-center px-6 py-10">
      {/*
        SignInForm uses useSearchParams() internally, which requires a Suspense
        boundary per Next.js App Router rules.
      */}
      <Suspense>
        <SignInForm />
      </Suspense>
    </main>
  );
}
