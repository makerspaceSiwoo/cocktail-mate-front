import { type CocktailDetail } from "@/entities/cocktail";
import { apiFetch } from "@/shared/api";

/**
 * 칵테일 상세를 서버에서 익명으로 가져온다(SSR/ISR).
 *
 * 클라이언트(DetailActions)는 계속 cocktailApis.getDetail(axios)로 authed 재요청해
 * 좋아요 상태를 보정하지만, 서버 렌더는 apiFetch(= Next 가 패치한 fetch)로 한다.
 * axios 는 Next 의 fetch 가 아니라 서버 캐시가 전혀 걸리지 않아, 라우트를 dynamic 에
 * 묶어두고 이동할 때마다 배포 API 로 왕복(≈400ms)하게 만든다.
 *
 * 레시피·재료는 거의 바뀌지 않아 1시간 단위로 재검증한다(목록·랭킹과 동일 정책).
 */
export async function getCocktailDetail(id: number): Promise<CocktailDetail> {
  return apiFetch<CocktailDetail>(`/cocktail/${id}`, {
    next: { revalidate: 3600 },
  });
}
