"use client";

import { useQuery } from "@tanstack/react-query";

import { cocktailQueries } from "@/entities/cocktail";

/**
 * 개발용 백엔드 연결 테스트 페이지.
 * 버튼을 누르면 react-query 로 GET /list 를 호출한다 → 연결/CORS 여부를 브라우저에서 확인.
 */
export default function ApiCheckPage() {
  const query = useQuery({ ...cocktailQueries.list(), enabled: false });

  const body = query.error
    ? `❌ 실패: ${query.error.message}\n\n서버 미기동 또는 CORS 문제일 수 있습니다.`
    : query.data
      ? `✅ 성공 (${query.data.length}건)\n\n${JSON.stringify(query.data, null, 2)}`
      : "아직 요청하지 않음";

  return (
    <main className="flex w-full max-w-[430px] flex-col gap-4 p-6">
      <h1 className="text-text text-lg font-semibold">API 연결 테스트</h1>
      <p className="text-muted text-xs break-all">대상: {process.env.NEXT_PUBLIC_API_URL}</p>
      <button
        type="button"
        onClick={() => query.refetch()}
        disabled={query.isFetching}
        className="border-border hover:bg-chip-bg rounded border px-4 py-2 text-sm disabled:opacity-50"
      >
        {query.isFetching ? "요청 중..." : "GET /list 호출"}
      </button>
      <pre className="border-border-soft text-muted overflow-auto rounded border p-3 text-xs break-all whitespace-pre-wrap">
        {body}
      </pre>
    </main>
  );
}
