"use client";

import { useSearchParams } from "next/navigation";
import * as React from "react";

import { HttpError, verifyEmailToken } from "@/shared/api";
import { Text } from "@/shared/ui/text";

type Status = "loading" | "success" | "error";

export function VerifyEmailView() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  // 토큰 없으면 처음부터 error로 시작
  const [status, setStatus] = React.useState<Status>(
    token ? "loading" : "error",
  );
  const [errorMessage, setErrorMessage] = React.useState(
    token ? "" : "잘못된 링크입니다. 토큰이 없습니다.",
  );

  React.useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function verify() {
      try {
        await verifyEmailToken(token);
        if (!cancelled) setStatus("success");
      } catch (err) {
        if (cancelled) return;
        let msg = "만료되었거나 잘못된 링크입니다.";
        if (err instanceof HttpError) {
          if (err.status !== 400 && err.status !== 404) {
            msg = err.message;
          }
        } else {
          msg = "네트워크 오류가 발생했습니다.";
        }
        setErrorMessage(msg);
        setStatus("error");
      }
    }

    verify();

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center gap-4" role="status">
        <span
          className="inline-block size-10 rounded-full border-4 border-border border-t-accent animate-spin"
          aria-hidden="true"
        />
        <Text as="p" variant="body" tone="muted">
          인증 중...
        </Text>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4">
        <span className="text-4xl" aria-hidden="true">
          ✓
        </span>
        <div className="flex flex-col gap-2">
          <Text as="h1" variant="title">
            인증 완료!
          </Text>
          <Text as="p" variant="body" tone="muted">
            가입하던 창으로 돌아가세요.
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <span className="text-4xl" aria-hidden="true">
        ✕
      </span>
      <div className="flex flex-col gap-2">
        <Text as="h1" variant="title">
          인증 실패
        </Text>
        <Text as="p" variant="body" tone="muted">
          {errorMessage || "만료되었거나 잘못된 링크입니다."}
        </Text>
      </div>
    </div>
  );
}
