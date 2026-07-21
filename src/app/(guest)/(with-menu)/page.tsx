import type { Cocktail } from "@/entities/cocktail";
import { getDailyRecommend } from "@/features/daily-recommend";

import { HomePage } from "./_components/home";

export default async function HomeRoute() {
  let recommended: Cocktail[] = [];
  try {
    recommended = await getDailyRecommend();
  } catch (error) {
    // 추천 로드에 실패해도 홈은 렌더한다 (캐러셀만 fallback 처리).
    console.error("오늘의 추천 로드 실패:", error);
  }

  return <HomePage recommended={recommended} />;
}
