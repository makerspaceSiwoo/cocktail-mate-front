"use client";

import { useCallback, useState } from "react";

import { type SearchSuggestion } from "@/shared/ui/search-bar";

const KEY_PREFIX = "recent-search:";

function storageKey(pageKey: string): string {
  return `${KEY_PREFIX}${pageKey}`;
}

/** 저장된 값이 SearchSuggestion 형태인지 검증한다(구버전/오염 데이터 방지). */
function isSuggestion(v: unknown): v is SearchSuggestion {
  return (
    typeof v === "object" &&
    v !== null &&
    ("id" in v) &&
    typeof (v as { label?: unknown }).label === "string"
  );
}

function readRecents(pageKey: string): SearchSuggestion[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(pageKey));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(isSuggestion) : [];
  } catch {
    return [];
  }
}

function writeRecents(pageKey: string, list: SearchSuggestion[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(pageKey), JSON.stringify(list));
  } catch {
    /* 저장 실패(quota 등)는 무시 */
  }
}

/**
 * 페이지별 최근 검색어를 localStorage 에 보관한다.
 *
 * - 항목은 `SearchSuggestion`(id+label). recent 를 눌러도 id 기반 실행이
 *   가능하도록 선택 시점의 id 를 그대로 저장한다(키워드↔id 매핑 보장).
 * - `pageKey`(보통 현재 URL/pathname)를 키로 페이지마다 분리 저장한다.
 * - 최신 `limit` 개만 유지하고, 같은 id 는 맨 앞으로 끌어올린다.
 * - localStorage 는 브라우저 전용이라 초기값은 lazy 로 읽는다(SSR 안전). 최근
 *   검색어는 입력 포커스 시에만 노출되므로 초기 렌더에는 나타나지 않아 hydration
 *   불일치가 없다.
 */
export function useRecentSearches(pageKey: string, limit: number) {
  const [recents, setRecents] = useState<SearchSuggestion[]>(() =>
    readRecents(pageKey),
  );

  const add = useCallback(
    (item: SearchSuggestion) => {
      if (!item.label.trim()) return;
      setRecents((prev) => {
        const next = [item, ...prev.filter((x) => x.id !== item.id)].slice(
          0,
          limit,
        );
        writeRecents(pageKey, next);
        return next;
      });
    },
    [pageKey, limit],
  );

  const remove = useCallback(
    (item: SearchSuggestion) => {
      setRecents((prev) => {
        const next = prev.filter((x) => x.id !== item.id);
        writeRecents(pageKey, next);
        return next;
      });
    },
    [pageKey],
  );

  return { recents, add, remove };
}
