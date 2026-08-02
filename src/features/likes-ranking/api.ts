import { type RankingItem, type RankingResponse } from "@/entities/cocktail";
import { apiFetch } from "@/shared/api";

/**
 * 좋아요 랭킹(전체 좋아요 수 상위) 목록을 서버에서 가져온다(SSR).
 *
 * 공개 엔드포인트라 인증이 필요 없고, 자주 바뀌지 않아 1시간 단위로 재검증한다.
 */
export async function getRanking(limit = 10): Promise<RankingItem[]> {
  const data = await apiFetch<RankingResponse>(`/ranking?limit=${limit}`, {
    next: { revalidate: 3600 },
  });
  return data.items ?? [];
}
