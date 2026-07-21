import type { Metadata } from "next";

import { MyProfile } from "@/features/auth/my-profile";
import { LikedCocktailList } from "@/features/like";

export const metadata: Metadata = {
  title: "마이페이지 | Cocktail Mate",
};

export default function MyPage() {
  return (
    <main className="min-h-0 flex-1 overflow-y-auto px-[18px] pt-7 pb-[max(28px,env(safe-area-inset-bottom))]">
      <MyProfile>
        <LikedCocktailList />
      </MyProfile>
    </main>
  );
}
