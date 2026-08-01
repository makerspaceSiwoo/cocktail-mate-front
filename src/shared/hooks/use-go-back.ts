"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

/**
 * 헤더의 '<' 뒤로가기 버튼용 콜백.
 *
 * 이전 히스토리가 있으면 `router.back()` 으로 브라우저 뒤로가기와 동일하게 동작하고,
 * 히스토리가 없을 때(공유 링크·북마크 등 직접 진입)만 `fallback` 으로 이동해
 * 버튼이 먹통이 되는 것을 막는다. 정상 흐름에서는 항상 뒤로가기다.
 */
export function useGoBack(fallback = "/") {
  const router = useRouter();
  return useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  }, [router, fallback]);
}
