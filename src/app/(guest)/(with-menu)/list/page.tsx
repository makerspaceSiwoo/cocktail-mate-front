import type { Metadata } from "next";

import { CocktailList } from "@/features/cocktail-list";

export const metadata: Metadata = {
  title: "칵테일 목록 | CocktailMate",
  description: "베이스별 칵테일 레시피를 탐색합니다.",
};

export default function ListPage() {
  return <CocktailList />;
}
