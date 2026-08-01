"use client";

import * as React from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { cocktailQueries } from "@/entities/cocktail";
import { useGoBack } from "@/shared/hooks";
import { ChevronLeftIcon, CloseIcon, SearchIcon } from "@/shared/ui/icon/icons";
import { SearchBar } from "@/shared/ui/search-bar";

import { useDebouncedValue } from "../lib/use-debounced-value";
import { useRecentSearches } from "../lib/use-recent-searches";
import { searchResultHref, useSearchNav } from "../lib/use-search-nav";

/** query 와 겹치는 부분을 accent 볼드로 강조. (대소문자 무시) */
function highlightMatch(label: string, query: string): React.ReactNode {
  const q = query.trim();
  if (!q) return label;
  const idx = label.toLowerCase().indexOf(q.toLowerCase());
  if (idx < 0) return label;
  return (
    <>
      {label.slice(0, idx)}
      <span className="text-accent font-bold">{label.slice(idx, idx + q.length)}</span>
      {label.slice(idx + q.length)}
    </>
  );
}

export function SearchHome() {
  const [value, setValue] = useState("");
  const trimmed = value.trim();
  const searching = trimmed.length > 0;

  const debounced = useDebouncedValue(trimmed, 200);
  const { data } = useQuery({
    ...cocktailQueries.autocomplete(debounced, 10),
    enabled: debounced.length > 0,
  });
  const suggestions = data ?? [];
  // data 가 아직 없으면(로딩·미조회) '결과 없음' 을 띄우지 않는다.
  const noResult = searching && data !== undefined && suggestions.length === 0;

  const { recent, remove, clear } = useRecentSearches();
  const { goToResults, goToDetail } = useSearchNav();
  const goBack = useGoBack();

  return (
    <main className="bg-bg flex min-h-dvh w-full flex-col">
      <div className="flex items-center gap-1 px-[14px] py-3">
        <button
          type="button"
          onClick={goBack}
          aria-label="뒤로 가기"
          className="text-text flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full"
        >
          <ChevronLeftIcon size={25} aria-hidden />
        </button>
        <div className="min-w-0 flex-1">
          <SearchBar
            autoFocus
            placeholder="칵테일 이름·재료로 검색"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onSubmit={goToResults}
          />
        </div>
      </div>

      {searching ? (
        <section aria-label="추천 검색 결과" className="flex min-h-0 flex-1 flex-col">
          {suggestions.length > 0 ? (
            <ul className="px-[10px]">
              {suggestions.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => goToDetail(item.id, item.name)}
                    className="hover:bg-chip-bg focus-visible:bg-chip-bg flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left outline-none transition-colors"
                  >
                    <SearchIcon size={16} aria-hidden className="text-muted shrink-0" />
                    <span className="text-text min-w-0 flex-1 truncate text-[15px]">
                      {highlightMatch(item.name, trimmed)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : noResult ? (
            <div className="px-[22px] pt-12 text-center">
              <p className="text-text mb-1 text-[15px] font-semibold">{`'${trimmed}' 검색 결과가 없어요`}</p>
              <p className="text-muted text-[13px]">다른 칵테일 이름이나 재료로 검색해보세요.</p>
            </div>
          ) : null}

          {suggestions.length > 0 ? (
            <button
              type="button"
              onClick={() => goToResults(trimmed)}
              className="border-border-soft text-accent hover:bg-chip-bg mt-1 flex w-full items-center gap-2 border-t px-[22px] py-4 text-[14px] font-bold transition-colors"
            >
              <SearchIcon size={16} aria-hidden className="text-accent shrink-0" />
              <span className="truncate">{`'${trimmed}' 전체 검색 결과 보기`}</span>
            </button>
          ) : null}
        </section>
      ) : (
        <section aria-label="최근 검색어" className="px-[22px] pt-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-text text-[15px] font-bold">최근 검색어</h2>
            {recent.length > 0 ? (
              <button
                type="button"
                onClick={clear}
                className="text-muted hover:text-text text-[13px] transition-colors"
              >
                전체 삭제
              </button>
            ) : null}
          </div>

          {recent.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {recent.map((term) => (
                <li key={term}>
                  <span className="bg-chip-bg text-text flex items-center gap-1.5 rounded-full py-1.5 pr-2 pl-3.5 text-[13px]">
                    <Link
                      href={searchResultHref(term)}
                      replace
                      className="focus-visible:ring-accent max-w-[180px] truncate rounded outline-none focus-visible:ring-2"
                    >
                      {term}
                    </Link>
                    <button
                      type="button"
                      aria-label={`최근 검색어 ${term} 삭제`}
                      onClick={() => remove(term)}
                      className="text-muted hover:text-text -m-0.5 flex shrink-0 p-0.5 transition-colors"
                    >
                      <CloseIcon size={14} aria-hidden />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted py-6 text-center text-sm">최근 검색 기록이 없어요.</p>
          )}
        </section>
      )}
    </main>
  );
}
