import type { Metadata } from "next";

import { SearchHome } from "@/features/cocktail-search";

export const metadata: Metadata = {
  title: "검색 | CocktailMate",
  description: "칵테일 이름이나 재료로 검색하세요.",
};

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // 결과 페이지에서 검색바를 탭해 넘어오면 현재 키워드를 이어받아 편집·자동완성을 이어간다.
  const { q } = await searchParams;
  return <SearchHome initialKeyword={q?.trim() ?? ""} />;
}
