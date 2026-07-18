import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import { API } from "@/shared/api";

import {
  type CocktailDetail,
  type CocktailListResponse,
  type CocktailSummary,
} from "./schema";

/**
 * 칵테일 도메인 API.
 *   - 위:  cocktailApis   (실제 호출 함수)
 *   - 아래: cocktailQueries (React Query 옵션)
 */

// ===== APIs =====
export const cocktailApis = {
  getListPage: async (
    page = 1,
    rpp = 10,
    base: string | null = null,
  ): Promise<CocktailListResponse> => {
    const { data } = await API.get<CocktailListResponse>("/list", {
      params: { page, rpp, ...(base ? { base } : {}) },
    });
    return data;
  },

  /**
   * 전체 칵테일 목록
   * @api [GET] /list
   */
  getList: async (): Promise<CocktailSummary[]> => {
    const data = await cocktailApis.getListPage();
    return data.items;
  },

  /**
   * 칵테일 상세 (이미지·영문명·설명·재료 등)
   * @api [GET] /cocktail/{id}
   */
  getDetail: async (id: number): Promise<CocktailDetail> => {
    const { data } = await API.get<CocktailDetail>(`/cocktail/${id}`);
    return data;
  },
};

// ===== Queries =====
export const cocktailQueries = {
  _all: () => ["cocktail"] as const,

  list: () =>
    queryOptions({
      queryKey: [...cocktailQueries._all(), "list"],
      queryFn: () => cocktailApis.getList(),
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: [...cocktailQueries._all(), "detail", id],
      queryFn: () => cocktailApis.getDetail(id),
    }),

  infiniteListByBase: (baseTag: string | null, rpp = 10) =>
    infiniteQueryOptions({
      queryKey: [...cocktailQueries._all(), "list", "infinite", { baseTag, rpp }],
      queryFn: ({ pageParam }) => cocktailApis.getListPage(pageParam, rpp, baseTag),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    }),
};
