import type { Metadata } from "next";
import Link from "next/link";

import { SignUpForm } from "@/features/auth";
import { Text } from "@/shared/ui/text";

export const metadata: Metadata = {
  title: "회원가입 | Cocktail Mate",
};

export default function SignUpPage() {
  return (
    <main className="flex flex-1 flex-col px-6 py-10 gap-8">
      <SignUpForm />
      <Text as="p" variant="body" tone="muted" align="center">
        이미 계정이 있으신가요?{" "}
        <Link
          href="/sign-in"
          className="text-accent font-medium hover:underline"
        >
          로그인
        </Link>
      </Text>
    </main>
  );
}
