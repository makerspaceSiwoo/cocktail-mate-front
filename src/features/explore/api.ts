import { apiFetch } from "@/shared/api";

import { type ExploreCocktail } from "./model";

/**
 * 탐색용 칵테일 목록(3D 맛 임베딩 포함)을 서버에서 가져온다.
 *
 * async Server Component 에서 호출하는 SSR 페치다. 임베딩은 거의 고정
 * 데이터라 1시간 단위로 재검증(ISR)한다.
 *
 * @api [GET] /explore
 */
export async function getExploreCocktails(): Promise<ExploreCocktail[]> {
  return apiFetch<ExploreCocktail[]>("/explore", {
    next: { revalidate: 3600 },
  });
}
