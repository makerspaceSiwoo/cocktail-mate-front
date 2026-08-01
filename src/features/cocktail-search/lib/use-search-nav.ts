"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { useRecentSearches } from "./use-recent-searches";

export function searchResultHref(keyword: string) {
  return `/search/result?q=${encodeURIComponent(keyword.trim())}`;
}

/** 검색 홈. 결과 페이지에서 검색어를 이어서 편집할 수 있도록 현재 키워드를 prefill 한다. */
export function searchHomeHref(keyword: string) {
  const q = keyword.trim();
  return q ? `/search?q=${encodeURIComponent(q)}` : "/search";
}

/**
 * 검색 홈·결과 페이지에서 공유하는 네비게이션.
 * - 텍스트 검색 → 검색 결과 리스트로 이동
 * - 자동완성 추천 선택 → 해당 칵테일 상세로 이동
 * 두 경우 모두 검색어를 최근 검색어에 추가한다.
 */
export function useSearchNav() {
  const router = useRouter();
  const { add } = useRecentSearches();

  const goToResults = useCallback(
    (term: string) => {
      const trimmed = term.trim();
      if (!trimmed) return;
      add(trimmed);
      // 검색 홈(/search)은 검색을 조합하는 임시 화면이라 히스토리에 남기지 않는다.
      // replace 로 이동해야 결과 페이지에서 뒤로가기 시 검색 홈이 아닌 그 이전 화면으로 간다.
      router.replace(searchResultHref(trimmed));
    },
    [add, router],
  );

  const goToDetail = useCallback(
    (id: number, name: string) => {
      add(name);
      router.push(`/detail/${id}`);
    },
    [add, router],
  );

  return { goToResults, goToDetail };
}
