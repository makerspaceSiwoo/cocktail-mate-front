import { Suspense } from "react";
import type { Metadata } from "next";

import { CocktailListSection, CocktailListSkeleton } from "@/features/cocktail-list";

export const metadata: Metadata = {
  title: "칵테일 목록 | CocktailMate",
  description: "베이스별 칵테일 레시피를 탐색합니다.",
};

export default function ListPage() {
  // 데이터 await 는 CocktailListSection 이 들고 있다. 페이지가 직접 await 하면
  // 배포 API 응답 전까지 셸(헤더·바텀네비)조차 스트리밍되지 않는다.
  return (
    <Suspense fallback={<CocktailListSkeleton />}>
      <CocktailListSection />
    </Suspense>
  );
}
