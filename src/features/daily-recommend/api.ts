import type { Cocktail } from "@/entities/cocktail";
import { apiFetch, type ApiFetchOptions } from "@/shared/api";

interface DailyRecommendResponse {
  items: Cocktail[];
}

/**
 * 오늘의 추천 칵테일 목록을 가져온다.
 *
 * 일 단위로 갱신되는 데이터라 1시간 단위로 재검증한다.
 */
export async function getDailyRecommend(): Promise<Cocktail[]> {
  const options: ApiFetchOptions = {
    revalidate: 3600,
  };
  const data = await apiFetch<DailyRecommendResponse>("/daily-recommend", options);
  return data.items ?? [];
}
