import type { DailyRecommendationResponse } from "@/entities/cocktail";
import { apiFetch } from "@/shared/api";

const ONE_HOUR_IN_SECONDS = 60 * 60;

export async function getDailyRecommendations() {
  const { items } = await apiFetch<DailyRecommendationResponse>("/daily-recommend", {
    next: { revalidate: ONE_HOUR_IN_SECONDS },
  });

  return items;
}
