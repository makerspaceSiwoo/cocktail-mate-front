"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "cocktail-mate:recent-searches";
const MAX_RECENT = 10;
const EMPTY: readonly string[] = [];

// 모듈 스코프 store — 모든 훅 인스턴스가 같은 상태를 공유한다
// (검색 홈의 최근 검색어 목록과 검색바 드롭다운이 서로 동기화됨).
let cache: readonly string[] = EMPTY;
let initialized = false;
const listeners = new Set<() => void>();

function readFromStorage(): readonly string[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed.filter((v): v is string => typeof v === "string").slice(0, MAX_RECENT);
  } catch {
    return EMPTY;
  }
}

function commit(next: readonly string[]) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage 사용 불가(사생활 보호 모드 등) — 메모리 상태만 갱신한다.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(onChange: () => void): () => void {
  // 최초 구독 시점(= 클라이언트 mount 이후)에 localStorage 를 읽어 캐시를 채운다.
  // 초기 렌더는 서버와 동일하게 EMPTY 라 하이드레이션 불일치가 없다.
  if (!initialized) {
    initialized = true;
    cache = readFromStorage();
  }
  listeners.add(onChange);

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cache = readFromStorage();
      listeners.forEach((listener) => listener());
    }
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => cache;
const getServerSnapshot = () => EMPTY;

/**
 * 최근 검색어를 localStorage 에 보관하는 훅.
 * 최신 항목이 앞에 오고, 중복은 앞으로 끌어올리며, 최대 {@link MAX_RECENT} 개까지만 남긴다.
 */
export function useRecentSearches() {
  const recent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const add = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    commit([trimmed, ...cache.filter((t) => t !== trimmed)].slice(0, MAX_RECENT));
  }, []);

  const remove = useCallback((term: string) => {
    commit(cache.filter((t) => t !== term));
  }, []);

  const clear = useCallback(() => {
    commit(EMPTY);
  }, []);

  return { recent: recent as string[], add, remove, clear };
}
