import type { Metadata } from "next";

import { LikedCocktailInfiniteList } from "@/features/like";
import { SubHeader } from "@/shared/components/sub-header/sub-header";

export const metadata: Metadata = {
  title: "좋아요 목록 | Cocktail Mate",
  description: "좋아요를 표시한 칵테일 목록을 확인합니다.",
};

export default function MyLikesPage() {
  return (
    <main className="flex min-h-0 flex-1 flex-col">
      {/* 칵테일 상세와 동일한 헤더(뒤로가기 + 가운데 제목). 공유 버튼은 미노출. */}
      <SubHeader title="좋아요 목록" />

      <section className="min-h-0 flex-1 overflow-y-auto px-[18px] pt-4 pb-6">
        <LikedCocktailInfiniteList />
      </section>
    </main>
  );
}
