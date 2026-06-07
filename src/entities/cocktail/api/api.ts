import { queryOptions } from "@tanstack/react-query";

import { API } from "@/shared/api";

import { type CocktailSummary, type SearchResult } from "./schema";

/**
 * 칵테일 도메인 API.
 *   - 위:  cocktailApis   (실제 호출 함수)
 *   - 아래: cocktailQueries (React Query 옵션)
 */

// ===== APIs =====
export const cocktailApis = {
  /**
   * 전체 칵테일 목록
   * @api [GET] /list
   */
  getList: async (): Promise<CocktailSummary[]> => {
    const { data } = await API.get<CocktailSummary[]>("/list");
    return data;
  },

  /**
   * 칵테일 검색
   * @api [GET] /search?keyword=
   */
  search: async (keyword: string): Promise<SearchResult> => {
    const { data } = await API.get<SearchResult>("/search", {
      params: { keyword },
    });
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

  search: (keyword: string) =>
    queryOptions({
      queryKey: [...cocktailQueries._all(), "search", keyword],
      queryFn: () => cocktailApis.search(keyword),
    }),
};
