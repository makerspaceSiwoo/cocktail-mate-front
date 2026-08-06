import { Suspense } from "react";

import { DailyRecommendCarousel, DailyRecommendCarouselSkeleton } from "@/features/daily-recommend";
import { FavorRecommendations } from "@/features/favor-recommend";
import { LikesRankingSection, LikesRankingSectionSkeleton } from "@/features/likes-ranking";
import { TasteBanner } from "@/features/taste-recommend";

/**
 * 홈 화면. 오늘의 추천·좋아요 랭킹은 각각 <Suspense> 로 감싸서, 배포 API 응답을
 * 기다리는 동안에도 셸과 제목이 먼저 스트리밍되고 느린 한쪽이 다른 쪽을 막지 않게 한다.
 */
export function HomePage() {
  return (
    <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold">오늘의 추천</h2>
        <Suspense fallback={<DailyRecommendCarouselSkeleton />}>
          <DailyRecommendCarousel />
        </Suspense>
      </section>

      {/* 좋아요 랭킹 → 나를 위한 Pick(로그인 시에만 렌더) → 추천 배너 순. */}
      <Suspense fallback={<LikesRankingSectionSkeleton />}>
        <LikesRankingSection />
      </Suspense>

      <FavorRecommendations />

      <TasteBanner />
    </main>
  );
}
