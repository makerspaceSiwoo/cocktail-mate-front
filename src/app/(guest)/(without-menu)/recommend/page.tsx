import type { Metadata } from "next";

import { TasteForm } from "@/features/taste-recommend";
import { SubHeader } from "@/shared/components/sub-header/sub-header";

export const metadata: Metadata = {
  title: "내 취향 알아보기 | CocktailMate",
  description: "취향을 선택하고 나에게 딱 맞는 칵테일을 추천받아보세요.",
};

export default function TastePage() {
  return (
    <>
      <SubHeader />
      <TasteForm />
    </>
  );
}
