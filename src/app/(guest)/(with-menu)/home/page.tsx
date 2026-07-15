import type { Metadata } from "next";

import { getDailyRecommendations } from "@/features/home/api";
import { TodayRecommendations } from "@/features/home/ui";

export const metadata: Metadata = {
  title: "오늘의 추천 | Cocktail Mate",
};

export default async function HomeRoute() {
  const recommendations = await getDailyRecommendations().catch(() => []);

  return (
    <main className="bg-bg flex flex-1 flex-col pt-4 pb-24">
      <TodayRecommendations recommendations={recommendations} />
    </main>
  );
}
