import type { Metadata } from "next";

import { SearchHome } from "@/features/cocktail-search";

export const metadata: Metadata = {
  title: "검색 | CocktailMate",
  description: "칵테일 이름이나 재료로 검색하세요.",
};

export default function SearchPage() {
  return <SearchHome />;
}
