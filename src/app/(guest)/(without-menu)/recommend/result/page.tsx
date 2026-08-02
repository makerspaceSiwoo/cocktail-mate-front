import type { Metadata } from "next";

import { TasteResult } from "@/features/taste-recommend";
import { SubHeader } from "@/shared/components/sub-header/sub-header";

export const metadata: Metadata = {
  title: "취향 추천 결과 | CocktailMate",
  description: "선택한 취향에 맞는 칵테일 추천 결과입니다.",
};

type ResultPageProps = { searchParams: Promise<{ ids?: string }> };

/** `?ids=1,2,3` → 중복 제거된 양의 정수 배열(최대 7개, 백엔드 계약). */
function parseIds(raw: string | undefined): number[] {
  if (!raw) return [];
  const unique = new Set<number>();
  for (const part of raw.split(",")) {
    if (!/^\d+$/.test(part)) continue;
    const id = Number(part);
    if (Number.isSafeInteger(id) && id > 0) unique.add(id);
  }
  return [...unique].slice(0, 7);
}

export default async function TasteResultPage({ searchParams }: ResultPageProps) {
  const { ids } = await searchParams;

  return (
    <>
      <SubHeader showShare shareTitle="취향 추천 결과 | CocktailMate" />
      <TasteResult descriptorIds={parseIds(ids)} />
    </>
  );
}
