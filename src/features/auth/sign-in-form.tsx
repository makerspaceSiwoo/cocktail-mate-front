"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { HttpError, login as apiLogin } from "@/shared/api";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Text } from "@/shared/ui/text";

import { useAuth } from "./auth-context";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const nextParam = searchParams.get("next") ?? "";
  const next =
    nextParam.startsWith("/") &&
    !nextParam.startsWith("//") &&
    !nextParam.startsWith("/\\")
      ? nextParam
      : "/home";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError("");
    setIsLoading(true);
    try {
      const user = await apiLogin({ email, password });
      login(user);
      router.replace(next);
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.message);
      } else {
        setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Text as="h1" variant="title">
        로그인
      </Text>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div>
            <label htmlFor="signin-email" className="sr-only">
              이메일
            </label>
            <Input
              id="signin-email"
              type="email"
              placeholder="이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              clearable
              onClear={() => setEmail("")}
              aria-describedby={error ? "signin-error" : undefined}
            />
          </div>
          <div className="relative">
            <label htmlFor="signin-password" className="sr-only">
              비밀번호
            </label>
            <Input
              id="signin-password"
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              clearable={false}
              className="pr-12"
              aria-describedby={error ? "signin-error" : undefined}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
            >
              <span className="text-xs font-medium">
                {showPassword ? "숨김" : "표시"}
              </span>
            </button>
          </div>
        </div>

        {error ? (
          <Text
            id="signin-error"
            as="p"
            variant="caption"
            tone="heart"
            role="alert"
          >
            {error}
          </Text>
        ) : null}

        <Button
          type="submit"
          variant="cta"
          size="lg"
          fullWidth
          disabled={!email || !password || isLoading}
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </Button>
      </form>

      {/* 회원가입 링크 */}
      <Text as="p" variant="body" tone="muted" align="center">
        아직 계정이 없으신가요?{" "}
        <Link
          href="/sign-up"
          className="text-accent font-medium hover:underline"
        >
          회원가입
        </Link>
      </Text>
    </div>
  );
}
