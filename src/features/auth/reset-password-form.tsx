"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { HttpError, resetPassword } from "@/shared/api";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Text } from "@/shared/ui/text";

// 허용 문자: 영문 + 숫자 + !@#$
const ALLOWED_CHARS_RE = /^[A-Za-z0-9!@#$]*$/;

function checkPassword(pw: string) {
  return {
    minLength: pw.length >= 8,
    hasLetter: /[A-Za-z]/.test(pw),
    hasNumber: /[0-9]/.test(pw),
    hasSpecial: /[!@#$]/.test(pw),
    onlyAllowed: ALLOWED_CHARS_RE.test(pw),
  };
}

interface PasswordCheckItem {
  label: string;
  ok: boolean;
}

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = React.useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [invalidCharWarning, setInvalidCharWarning] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);

  // 토큰 없음 처리
  if (!token) {
    return (
      <div className="flex flex-col gap-6 items-center text-center">
        <Text as="h1" variant="title">
          잘못된 접근입니다
        </Text>
        <Text as="p" variant="body" tone="muted">
          비밀번호 재설정 링크가 올바르지 않습니다. 메일의 링크를 다시
          확인해주세요.
        </Text>
        <Link href="/sign-in" className="text-accent font-medium hover:underline">
          <Text as="span" variant="body" tone="accent">
            로그인으로 돌아가기
          </Text>
        </Link>
      </div>
    );
  }

  const pwChecks = checkPassword(newPassword);
  const pwCheckItems: PasswordCheckItem[] = [
    { label: "8자 이상", ok: pwChecks.minLength },
    { label: "영문 포함", ok: pwChecks.hasLetter },
    { label: "숫자 포함", ok: pwChecks.hasNumber },
    { label: "특수문자(!@#$) 포함", ok: pwChecks.hasSpecial },
    {
      label: "비밀번호 일치",
      ok: newPassword.length > 0 && newPassword === newPasswordConfirm,
    },
  ];
  const isPwValid =
    pwCheckItems.every((c) => c.ok) && pwChecks.onlyAllowed;

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewPassword(val);
    setInvalidCharWarning(val.length > 0 && !ALLOWED_CHARS_RE.test(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPwValid || isLoading) return;
    setError("");
    setIsLoading(true);
    try {
      await resetPassword({
        token,
        new_password: newPassword,
        new_password_confirm: newPasswordConfirm,
      });
      setIsDone(true);
      // 잠시 후 로그인 페이지로 이동
      setTimeout(() => {
        router.replace("/sign-in");
      }, 2000);
    } catch (err) {
      if (err instanceof HttpError) {
        if (err.status === 400) {
          setError("만료되었거나 잘못된 링크입니다.");
        } else if (err.status === 422) {
          setError("비밀번호 정책을 확인해주세요.");
        } else {
          setError(err.message);
        }
      } else {
        setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isDone) {
    return (
      <div className="flex flex-col gap-6 items-center text-center">
        <span className="text-4xl" aria-hidden="true">
          ✓
        </span>
        <div className="flex flex-col gap-2">
          <Text as="h1" variant="title">
            비밀번호가 변경되었습니다
          </Text>
          <Text as="p" variant="body" tone="muted">
            로그인 페이지로 이동합니다...
          </Text>
        </div>
        <Link href="/sign-in" className="text-accent font-medium hover:underline">
          <Text as="span" variant="body" tone="accent">
            지금 로그인하기
          </Text>
        </Link>
      </div>
    );
  }

  const showPwHints = newPassword.length > 0 || newPasswordConfirm.length > 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Text as="h1" variant="title">
          비밀번호 재설정
        </Text>
        <Text as="p" variant="body" tone="muted">
          새로운 비밀번호를 입력해주세요.
        </Text>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* 새 비밀번호 */}
        <div className="flex flex-col gap-1">
          <label htmlFor="reset-new-password" className="sr-only">
            새 비밀번호
          </label>
          <div className="relative">
            <Input
              id="reset-new-password"
              type={showPassword ? "text" : "password"}
              placeholder="새 비밀번호 (영문·숫자·특수문자!@#$ 8자 이상)"
              value={newPassword}
              onChange={handlePasswordChange}
              autoComplete="new-password"
              clearable={false}
              className="pr-12"
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
          {invalidCharWarning ? (
            <Text as="p" variant="caption" tone="heart" role="alert">
              허용되지 않는 문자입니다. 영문, 숫자, !@#$만 사용 가능합니다.
            </Text>
          ) : null}
        </div>

        {/* 새 비밀번호 확인 */}
        <div className="flex flex-col gap-1">
          <label htmlFor="reset-new-password-confirm" className="sr-only">
            새 비밀번호 확인
          </label>
          <div className="relative">
            <Input
              id="reset-new-password-confirm"
              type={showConfirm ? "text" : "password"}
              placeholder="새 비밀번호 확인"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              autoComplete="new-password"
              clearable={false}
              className="pr-12"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? "비밀번호 숨기기" : "비밀번호 표시"}
            >
              <span className="text-xs font-medium">
                {showConfirm ? "숨김" : "표시"}
              </span>
            </button>
          </div>
        </div>

        {/* 비밀번호 정책 체크리스트 */}
        {showPwHints ? (
          <ul
            className="flex flex-col gap-1.5"
            aria-label="비밀번호 정책 확인"
          >
            {pwCheckItems.map((item) => (
              <li key={item.label} className="flex items-center gap-2">
                <span
                  className={`text-sm font-bold ${item.ok ? "text-accent" : "text-muted"}`}
                  aria-hidden="true"
                >
                  {item.ok ? "✓" : "○"}
                </span>
                <Text
                  as="span"
                  variant="caption"
                  tone={item.ok ? "accent" : "muted"}
                >
                  {item.label}
                </Text>
              </li>
            ))}
          </ul>
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
          disabled={!isPwValid || isLoading}
        >
          {isLoading ? "변경 중..." : "비밀번호 변경"}
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
