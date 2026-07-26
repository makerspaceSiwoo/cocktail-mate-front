import { apiFetch } from "@/shared/api";

import { type ExploreCocktail } from "./model";

export async function getExploreCocktails(): Promise<ExploreCocktail[]> {
  return apiFetch<ExploreCocktail[]>("/explore", {
    next: { revalidate: 3600 },
  });
}
