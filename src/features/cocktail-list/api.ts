import { type CocktailListResponse } from "@/entities/cocktail";
import { apiFetch } from "@/shared/api";

/**
 * 목록 첫 페이지(전체, base 없음)를 서버에서 익명으로 가져온다(SSR/ISR).
 *
 * 클라이언트 무한스크롤은 계속 cocktailApis.getListPage(axios) 를 쓰지만, 서버
 * 프리페치만은 apiFetch(= Next 가 패치한 fetch)로 한다. axios 는 Next 의 fetch 가
 * 아니라 서버 캐시·재검증이 전혀 걸리지 않아, 요청마다 배포 API 로 왕복한다.
 *
 * 목록은 자주 바뀌지 않아 1시간 단위로 재검증한다(홈의 추천·랭킹과 동일 정책).
 */
export async function getCocktailListFirstPage(rpp = 10): Promise<CocktailListResponse> {
  return apiFetch<CocktailListResponse>(`/list?page=1&rpp=${rpp}`, {
    next: { revalidate: 3600 },
  });
}
