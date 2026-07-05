"use client";

import Link from "next/link";
import * as React from "react";

import { forgotPassword, HttpError } from "@/shared/api";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Text } from "@/shared/ui/text";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_COOLDOWN_SEC = 60;

export function ForgotPasswordForm() {
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [cooldown, setCooldown] = React.useState(0);

  const isEmailValid = EMAIL_RE.test(email);

  // 쿨다운 타이머
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid || isLoading || cooldown > 0) return;
    setError("");
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
      setCooldown(RESEND_COOLDOWN_SEC);
    } catch (err) {
      // 항상 성공 응답이지만 네트워크 오류 등 예외 처리
      if (err instanceof HttpError && err.status === 429) {
        setError("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
        setCooldown(RESEND_COOLDOWN_SEC);
      } else if (err instanceof HttpError) {
        setError(err.message);
      } else {
        setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Text as="h1" variant="title">
          비밀번호 찾기
        </Text>
        <Text as="p" variant="body" tone="muted">
          가입 시 사용한 이메일을 입력하면 재설정 링크를 보내드립니다.
        </Text>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="forgot-email" className="sr-only">
            이메일
          </label>
          <Input
            id="forgot-email"
            type="email"
            placeholder="이메일 주소"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            clearable
            onClear={() => setEmail("")}
            disabled={isLoading}
          />
        </div>

        {sent ? (
          <div
            className="rounded-xl bg-chip-bg border border-border px-4 py-3"
            role="status"
          >
            <Text as="p" variant="body">
              입력하신 메일로 재설정 링크를 보냈습니다. 메일함을 확인해주세요.
            </Text>
          </div>
        ) : null}

        {error ? (
          <Text as="p" variant="caption" tone="heart" role="alert">
            {error}
          </Text>
        ) : null}

        <Button
          type="submit"
          variant="cta"
          size="lg"
          fullWidth
          disabled={!isEmailValid || isLoading || cooldown > 0}
          aria-label={
            cooldown > 0 ? `${cooldown}초 후 재전송 가능` : "재설정 링크 보내기"
          }
        >
          {isLoading
            ? "전송 중..."
            : cooldown > 0
              ? `재전송 (${cooldown}초)`
              : sent
                ? "다시 보내기"
                : "재설정 링크 보내기"}
        </Button>
      </form>

      <Text as="p" variant="body" tone="muted" align="center">
        <Link
          href="/sign-in"
          className="text-accent font-medium hover:underline"
        >
          로그인으로 돌아가기
        </Link>
      </Text>
    </div>
  );
}
