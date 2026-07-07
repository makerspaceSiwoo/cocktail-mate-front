import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import { API } from "@/shared/api";

import { type CocktailListResponse, type CocktailSummary, type SearchResult } from "./schema";

/**
 * 칵테일 도메인 API.
 *   - 위:  cocktailApis   (실제 호출 함수)
 *   - 아래: cocktailQueries (React Query 옵션)
 */

// ===== APIs =====
export const cocktailApis = {
  getListPage: async (page = 1, rpp = 10): Promise<CocktailListResponse> => {
    const { data } = await API.get<CocktailListResponse>("/list", {
      params: { page, rpp },
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
   * 칵테일 검색
   * @api [GET] /search?keyword=
   */
  search: async (keyword: string, page = 1, rpp = 10): Promise<SearchResult> => {
    const { data } = await API.get<SearchResult>("/search", {
      params: { keyword, page, rpp },
    });
    return data;
  },

  getListByBasePage: async (
    baseTag: string | null,
    page = 1,
    rpp = 10,
  ): Promise<CocktailListResponse> => {
    if (!baseTag) return cocktailApis.getListPage(page, rpp);

    const data = await cocktailApis.search(baseTag, page, rpp);
    return {
      items: data.cocktails,
      meta: {
        page,
        rpp,
        hasNextPage: page * rpp < data.total,
      },
    };
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

  infiniteList: (rpp = 10) =>
    infiniteQueryOptions({
      queryKey: [...cocktailQueries._all(), "list", "infinite", { rpp }],
      queryFn: ({ pageParam }) => cocktailApis.getListPage(pageParam, rpp),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    }),

  infiniteListByBase: (baseTag: string | null, rpp = 10) =>
    infiniteQueryOptions({
      queryKey: [...cocktailQueries._all(), "list", "infinite", { baseTag, rpp }],
      queryFn: ({ pageParam }) => cocktailApis.getListByBasePage(baseTag, pageParam, rpp),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    }),

  search: (keyword: string) =>
    queryOptions({
      queryKey: [...cocktailQueries._all(), "search", keyword],
      queryFn: () => cocktailApis.search(keyword),
    }),
};
