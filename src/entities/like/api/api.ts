import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import { API } from "@/shared/api";

import {
  type LikeActionResponse,
  type LikeListParams,
  type LikeListResponse,
  type LikeRequest,
} from "./schema";

// ===== APIs =====
export const likeApis = {
  like: async (cocktailId: number): Promise<LikeActionResponse> => {
    const request: LikeRequest = { cocktailId };
    const { data } = await API.post<LikeActionResponse>("/like", request);
    return data;
  },

  unlike: async (cocktailId: number): Promise<LikeActionResponse> => {
    const request: LikeRequest = { cocktailId };
    const { data } = await API.delete<LikeActionResponse>("/unlike", {
      data: request,
    });
    return data;
  },

  getList: async ({ page, rpp }: LikeListParams): Promise<LikeListResponse> => {
    const { data } = await API.get<LikeListResponse>("/like/list", {
      params: { page, rpp },
    });
    return data;
  },
};

// ===== Queries =====
export const likeQueries = {
  _all: () => ["like"] as const,

  lists: () => [...likeQueries._all(), "list"] as const,

  page: (params: LikeListParams) =>
    queryOptions({
      queryKey: [...likeQueries.lists(), "page", params] as const,
      queryFn: () => likeApis.getList(params),
    }),

  summary: () => {
    const params = { page: 1, rpp: 5 } as const;

    return queryOptions({
      queryKey: [...likeQueries.lists(), "summary", params] as const,
      queryFn: () => likeApis.getList(params),
    });
  },

  infinite: (rpp = 10) =>
    infiniteQueryOptions({
      queryKey: [...likeQueries.lists(), "infinite", { rpp }] as const,
      queryFn: ({ pageParam }) => likeApis.getList({ page: pageParam, rpp }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    }),
};
