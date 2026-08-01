"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/shared/ui/button";

export interface ErrorViewProps {
  /** 표시할 오류 코드 (예: "404", "500"). */
  code: string;
  /** 오류 제목. */
  title: string;
  /** 오류 상세 설명. */
  description: string;
}

/**
 * 404 / 500 등 오류 화면 공용 뷰.
 * 루트 layout 의 max-w-[430px] shell 안에서 렌더되며, shell 구조를 그대로 유지한다.
 * - 돌아가기: 이전 페이지로 (router.back)
 * - 홈으로: 루트 경로로 이동 (router.replace)
 */
export function ErrorView({ code, title, description }: ErrorViewProps) {
  const router = useRouter();

  return (
    <main className="bg-bg mx-auto flex min-h-dvh w-full max-w-[430px] flex-col items-center justify-center px-6 text-center">
      <p className="text-accent text-6xl font-bold tabular-nums">{code}</p>
      <h1 className="mt-4 text-2xl font-bold">{title}</h1>
      <p className="text-muted mt-3 text-sm">{description}</p>
      <div className="mt-8 flex w-full max-w-[280px] flex-col gap-3">
        <Button
          type="button"
          variant="cta"
          size="md"
          fullWidth
          className="rounded-full"
          onClick={() => router.back()}
        >
          돌아가기
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="md"
          fullWidth
          className="rounded-full"
          onClick={() => router.replace("/")}
        >
          홈으로
        </Button>
      </div>
    </main>
  );
}
