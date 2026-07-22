import type { Metadata } from "next";

import { MyProfileContainer } from "@/features/mypage";

export const metadata: Metadata = {
  title: "마이페이지 | Cocktail Mate",
  description: "Cocktail Mate 사용자 프로필을 확인합니다.",
};

export default function MyPage() {
  return (
    <main className="flex flex-1 flex-col" aria-label="마이페이지">
      <MyProfileContainer />
    </main>
  );
}
