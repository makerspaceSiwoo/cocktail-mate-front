"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

/**
 * React Query Provider. root layout(서버 컴포넌트) 안에서 클라이언트 경계를 만든다.
 * QueryClient 는 컴포넌트 인스턴스당 1회 생성(useState)해 리렌더 시 재생성을 막는다.
 */
export function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 60_000 } },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
