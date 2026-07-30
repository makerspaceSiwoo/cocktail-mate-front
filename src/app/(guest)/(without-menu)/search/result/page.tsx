import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SearchResults } from "@/features/cocktail-search";

type SearchResultPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({
  searchParams,
}: SearchResultPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const keyword = q?.trim();
  return {
    title: keyword ? `'${keyword}' 검색 결과 | CocktailMate` : "검색 결과 | CocktailMate",
  };
}

export default async function SearchResultPage({ searchParams }: SearchResultPageProps) {
  const { q } = await searchParams;
  const keyword = q?.trim();

  // 키워드 없이 들어오면 검색 홈으로.
  if (!keyword) redirect("/search");

  // 키워드가 바뀌면 리스트·입력 상태를 새로 시작하도록 remount.
  return <SearchResults key={keyword} keyword={keyword} />;
}
