import type { Metadata } from "next";

import { ProfileEditor } from "@/features/auth";

export const metadata: Metadata = {
  title: "회원정보 수정 | Cocktail Mate",
  description: "Cocktail Mate 닉네임을 수정합니다.",
};

export default function MyProfileEditPage() {
  return (
    <main className="flex min-h-0 flex-1 flex-col" aria-label="회원정보 수정">
      <ProfileEditor />
    </main>
  );
}
