"use client";

import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { cocktailQueries } from "@/entities/cocktail";
import { SearchBar, type SearchSuggestion } from "@/shared/ui/search-bar";

import { MAX_QUERY_LENGTH, SEARCH_LIMIT, isValidSearchQuery, sanitizeSearchQuery } from "../search";
import { useRecentSearches } from "../use-recent-searches";
import { ScenePoint } from "../model";

/** 입력이 멈춘 뒤 자동완성을 요청하기까지 기다리는 시간(ms). */
const AUTOCOMPLETE_DEBOUNCE_MS = 300;

interface ExploreSearchProps {
  points: ScenePoint[];
  handleSearch: (point: ScenePoint) => void;
}

/**
 * 3D 탐색 뷰 위에 올라가는 autocomplete 검색창(echo 모드).
 *
 * - 입력은 최대 40자, 영문·한글·숫자·공백만 허용(그 외 문자는 입력 단계에서 제거).
 * - 디바운스(500ms)·조회·이전 결과 유지는 공용 `SearchBar` 가 담당한다.
 *   입력 중에는 첫 행에 현재 키워드(echo) + 그 아래 추천이 뜨고, 엔터는 입력값으로,
 *   추천 클릭/화살표는 그 항목으로 검색된다.
 * - 최근 검색어는 현재 URL 을 키로 localStorage 에 최신 5개 저장한다.
 * - 지금은 선택 시 콘솔 로그만 남긴다.
 */

export function ExploreSearch({ points, handleSearch }: ExploreSearchProps) {
  const [query, setQuery] = useState("");
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const {
    recents,
    add: addRecent,
    remove: removeRecent,
  } = useRecentSearches(pathname, SEARCH_LIMIT);

  // 입력이 멈출 때마다 SearchBar 가 실행하는 자동완성 조회 함수.
  // react-query 캐시(fetchQuery)를 그대로 활용한다.
  const fetchSuggestions = useCallback(
    async (keyword: string): Promise<SearchSuggestion[]> => {
      if (!isValidSearchQuery(keyword)) return [];
      const items = await queryClient.fetchQuery({
        ...cocktailQueries.autocomplete(keyword, SEARCH_LIMIT),
        staleTime: 60_000,
      });
      return items.map((item) => ({ id: item.id, label: item.name }));
    },
    [queryClient],
  );

  return (
    <SearchBar
      value={query}
      onChange={(e) => setQuery(sanitizeSearchQuery(e.target.value))}
      maxLength={MAX_QUERY_LENGTH}
      placeholder="칵테일 이름으로 검색"
      aria-label="칵테일 검색"
      fetchSuggestions={fetchSuggestions}
      debounceMs={AUTOCOMPLETE_DEBOUNCE_MS}
      recentSearches={recents}
      onRemoveRecent={removeRecent}
      onSelectSuggestion={(suggestion) => {
        // 추천/최근 검색어 선택 = 해당 칵테일 포인트를 선택(상세 시트 오픈).
        // 최근 검색어도 id 를 가진 항목이라 여기서 함께 처리된다.
        addRecent(suggestion);
        const point = points.find((p) => p.id === suggestion.id);
        if (point) handleSearch(point);
        else console.log("[explore] 포인트 클라우드에 없는 칵테일:", suggestion);
        // 검색 결과는 구·시트에 반영되므로 입력창은 비운다.
        setQuery("");
      }}
    />
  );
}
