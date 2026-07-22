import type { Metadata } from "next";

import { MyProfile } from "@/features/auth";
import { LikedCocktailList } from "@/features/like";

export const metadata: Metadata = {
  title: "마이페이지 | Cocktail Mate",
  description: "Cocktail Mate 사용자 프로필을 확인합니다.",
};

export default function MyPage() {
  return (
    <main className="min-h-0 flex-1 overflow-y-auto" aria-label="마이페이지">
      <MyProfile>
        <LikedCocktailList />
      </MyProfile>
    </main>
  );
}
