import { queryOptions } from "@tanstack/react-query";

import { API } from "@/shared/api";

import { type LikeActionResponse, type LikeListResponse, type LikeRequest } from "./schema";

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

  getList: async (): Promise<LikeListResponse> => {
    const { data } = await API.get<LikeListResponse>("/like/list");
    return data;
  },
};

// ===== Queries =====
export const likeQueries = {
  _all: () => ["like"] as const,

  list: () =>
    queryOptions({
      queryKey: [...likeQueries._all(), "list"],
      queryFn: () => likeApis.getList(),
    }),
};
