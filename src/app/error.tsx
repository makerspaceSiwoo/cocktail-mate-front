"use client";

import { useEffect } from "react";

import { ErrorView } from "@/shared/ui/error-view";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    // 운영 환경에서는 로깅 서비스로 대체할 수 있다.
    console.error(error);
  }, [error]);

  return (
    <ErrorView
      code="500"
      title="문제가 발생했어요"
      description="잠시 후 다시 시도해 주세요. 계속되면 잠시 뒤 다시 방문해 주세요."
    />
  );
}
