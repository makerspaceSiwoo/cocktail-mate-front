import type { Cocktail, RankingItem } from "@/entities/cocktail";
import { getDailyRecommend } from "@/features/daily-recommend";
import { getRanking } from "@/features/likes-ranking";

import { HomePage } from "./_components/home";

export default async function HomeRoute() {
  // 오늘의 추천·좋아요 랭킹을 서버에서 병렬로 받아 SSR 한다. 각각 실패해도 홈은
  // 렌더하고 해당 섹션만 fallback(빈 배열 → 미노출/캐러셀 fallback) 처리한다.
  const [recommended, ranking] = await Promise.all([
    getDailyRecommend().catch((error: unknown): Cocktail[] => {
      console.error("오늘의 추천 로드 실패:", error);
      return [];
    }),
    getRanking().catch((error: unknown): RankingItem[] => {
      console.error("좋아요 랭킹 로드 실패:", error);
      return [];
    }),
  ]);

  return <HomePage recommended={recommended} ranking={ranking} />;
}
