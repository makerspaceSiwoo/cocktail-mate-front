import type { Metadata } from "next";

import {
  ExploreView,
  getExploreCocktails,
  toScenePoints,
  type ScenePoint,
} from "@/features/explore";

export const metadata: Metadata = {
  title: "탐색 · Cocktail Mate",
  description: "맛 임베딩 기반 3D 칵테일 탐색",
};

export default async function ExplorePage() {
  let points: ScenePoint[] = [];
  try {
    points = toScenePoints(await getExploreCocktails());
  } catch (error) {
    console.error("탐색 데이터 로드 실패:", error);
  }

  return <ExploreView points={points} />;
}
