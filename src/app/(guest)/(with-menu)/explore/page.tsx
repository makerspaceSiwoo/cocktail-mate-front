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

/**
 * /explore — 3D 구형 포인트 클라우드 탐색 페이지.
 *
 * `/explore` 를 SSR 로 페치해 3D 씬(client)에 넘긴다. 데이터 로드에 실패해도
 * 페이지는 렌더하고 빈 상태를 보여준다.
 */
export default async function ExplorePage() {
  let points: ScenePoint[] = [];
  try {
    const cocktails = await getExploreCocktails();
    points = toScenePoints(cocktails);
  } catch (error) {
    // 탐색 데이터 로드 실패해도 페이지 자체는 렌더한다(빈 상태 fallback).
    console.error("탐색 데이터 로드 실패:", error);
  }

  return <ExploreView points={points} />;
}
