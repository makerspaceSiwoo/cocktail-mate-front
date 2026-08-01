import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import { API } from "@/shared/api";

import {
  type AutocompleteResponse,
  type CocktailDetail,
  type CocktailListResponse,
  type CocktailRecommendation,
  type CocktailSearchResponse,
  type CocktailSuggestion,
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
  getDetail: async (id: number, accessToken?: string): Promise<CocktailDetail> => {
    const { data } = await API.get<CocktailDetail>(`/cocktail/${id}`, {
      headers: accessToken ? { Cookie: `access_token=${accessToken}` } : undefined,
    });
    return data;
  },

  /**
   * Returns cocktails similar to the selected cocktail for the signed-in user.
   * The shared API instance sends the browser's authentication cookie.
   * @api [GET] /cocktail/{id}/recommend
   */
  getRecommendations: async (id: number): Promise<CocktailRecommendation[]> => {
    const { data } = await API.get<CocktailRecommendation[]>(`/cocktail/${id}/recommend`);
    return data;
  },

  /**
   * 검색어 자동완성 추천 목록.
   * 호출 측에서 keyword 를 trim·정규식 검증한 뒤 넘긴다(빈/유효하지 않은 값은
   * 호출하지 않음).
   * @api [GET] /search/autocomplete
   */
  autocomplete: async (keyword: string, limit = 5): Promise<CocktailSuggestion[]> => {
    const { data } = await API.get<AutocompleteResponse>("/search/autocomplete", {
      params: { keyword, limit },
    });
    return data.items;
  },

  /**
   * 키워드 검색 (페이지네이션).
   * @api [GET] /search?keyword=&page=&rpp=
   */
  search: async (keyword: string, page = 1, rpp = 10): Promise<CocktailSearchResponse> => {
    const { data } = await API.get<CocktailSearchResponse>("/search", {
      params: { keyword, page, rpp },
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

  detail: (id: number) =>
    queryOptions({
      queryKey: [...cocktailQueries._all(), "detail", id],
      queryFn: () => cocktailApis.getDetail(id),
    }),

  recommendations: (id: number) =>
    queryOptions({
      queryKey: [...cocktailQueries._all(), "recommendations", id],
      queryFn: () => cocktailApis.getRecommendations(id),
    }),

  autocomplete: (keyword: string, limit = 5) =>
    queryOptions({
      queryKey: [...cocktailQueries._all(), "autocomplete", keyword, limit],
      queryFn: () => cocktailApis.autocomplete(keyword, limit),
    }),

  infiniteListByBase: (baseTag: string | null, rpp = 10) =>
    infiniteQueryOptions({
      queryKey: [...cocktailQueries._all(), "list", "infinite", { baseTag, rpp }],
      queryFn: ({ pageParam }) => cocktailApis.getListPage(pageParam, rpp, baseTag),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    }),

  infiniteSearch: (keyword: string, rpp = 10) =>
    infiniteQueryOptions({
      queryKey: [...cocktailQueries._all(), "search", "infinite", { keyword, rpp }],
      queryFn: ({ pageParam }) => cocktailApis.search(keyword, pageParam, rpp),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
      enabled: keyword.trim().length > 0,
    }),
};
