import { DailyRecommendCarouselSkeleton } from "@/features/daily-recommend";
import { LikesRankingSectionSkeleton } from "@/features/likes-ranking";

/**
 * 홈(/) 의 loading 경계. (with-menu) 하위에서 자체 loading.tsx 가 없는 세그먼트도
 * 이 스켈레톤을 쓴다(현재 /list, /explore 는 각자 가지고 있다).
 *
 * 이 경계가 있어야 <Link> 클릭 즉시 URL 이 바뀌고 스켈레톤이 뜬다. 없으면 라우터는
 * RSC 페이로드가 도착할 때까지 이전 화면에 머문다.
 */
export default function HomeLoading() {
  return (
    <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4" aria-busy="true">
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold">오늘의 추천</h2>
        <DailyRecommendCarouselSkeleton />
      </section>

      <LikesRankingSectionSkeleton />
    </main>
  );
}
