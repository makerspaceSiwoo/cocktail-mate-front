"use client";

import { Button } from "@/shared/ui/button";

export default function DetailError({ reset }: { reset: () => void }) {
  return (
    <main className="bg-bg mx-auto flex min-h-dvh w-full max-w-[430px] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-bold">상세 정보를 불러오지 못했어요</h1>
      <p className="text-muted mt-3 text-sm">잠시 후 다시 시도해 주세요.</p>
      <Button type="button" variant="cta" size="md" onClick={reset} className="mt-8 rounded-full">
        다시 시도
      </Button>
    </main>
  );
}
