"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import {
  getVerificationStatus,
  HttpError,
  requestEmailVerification,
  signUp,
} from "@/shared/api";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { StepIndicator } from "@/shared/ui/step-indicator";
import { Text } from "@/shared/ui/text";

import { useAuth } from "./auth-context";

// ─── 검증 유틸리티 ────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

// ─── 단계 1: 이메일 입력 ──────────────────────────────────────────────────

interface Step1Props {
  onNext: (email: string, requestId: string) => void;
}

function Step1EmailInput({ onNext }: Step1Props) {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const isEmailValid = EMAIL_RE.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid) return;
    setError("");
    setIsLoading(true);
    try {
      const { request_id } = await requestEmailVerification(email);
      onNext(email, request_id);
    } catch (err) {
      if (err instanceof HttpError) {
        if (err.status === 429) {
          setError("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="sr-only">
          이메일
        </label>
        <Input
          id="email"
          type="email"
          placeholder="이메일 주소"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          autoFocus
          error={!!error}
          clearable
          onClear={() => setEmail("")}
          aria-describedby={error ? "email-error" : undefined}
        />
        {error ? (
          <Text
            id="email-error"
            as="p"
            variant="caption"
            tone="heart"
            role="alert"
          >
            {error}
          </Text>
        ) : null}
      </div>
      <Button
        type="submit"
        variant="cta"
        size="lg"
        fullWidth
        disabled={!isEmailValid || isLoading}
      >
        {isLoading ? "전송 중..." : "인증 메일 보내기"}
      </Button>
    </form>
  );
}

// ─── 단계 2: 메일 인증 대기 ───────────────────────────────────────────────

const POLL_INTERVAL_MS = 3000;
const RESEND_COOLDOWN_SEC = 60;

interface Step2Props {
  email: string;
  requestId: string;
  onVerified: () => void;
  onChangeEmail: () => void;
}

function Step2WaitVerification({
  email,
  requestId,
  onVerified,
  onChangeEmail,
}: Step2Props) {
  const [isExpired, setIsExpired] = React.useState(false);
  const [resendCooldown, setResendCooldown] = React.useState(0);
  const [resendError, setResendError] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);

  // 폴링: 탭 비활성 시 중단 (Page Visibility API)
  React.useEffect(() => {
    let timerId: ReturnType<typeof setTimeout> | null = null;
    let mounted = true;

    async function poll() {
      if (!mounted || document.hidden) {
        timerId = setTimeout(poll, POLL_INTERVAL_MS);
        return;
      }
      try {
        const status = await getVerificationStatus(requestId);
        if (!mounted) return;
        if (status.verified) {
          onVerified();
          return;
        }
        if (status.expired) {
          setIsExpired(true);
          return;
        }
      } catch {
        // 네트워크 오류 시 재시도 유지
      }
      if (mounted) {
        timerId = setTimeout(poll, POLL_INTERVAL_MS);
      }
    }

    timerId = setTimeout(poll, POLL_INTERVAL_MS);

    const handleVisibilityChange = () => {
      // 탭 활성화 시 즉시 폴링 재개
      if (!document.hidden && !isExpired) {
        if (timerId) clearTimeout(timerId);
        poll();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      mounted = false;
      if (timerId) clearTimeout(timerId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [requestId, onVerified, isExpired]);

  // 재전송 쿨다운 타이머
  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  const handleResend = async () => {
    if (resendCooldown > 0 || isSending) return;
    setResendError("");
    setIsSending(true);
    try {
      await requestEmailVerification(email);
      setIsExpired(false);
      setResendCooldown(RESEND_COOLDOWN_SEC);
    } catch (err) {
      if (err instanceof HttpError) {
        if (err.status === 429) {
          setResendError("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
          setResendCooldown(RESEND_COOLDOWN_SEC);
        } else {
          setResendError(err.message);
        }
      } else {
        setResendError("네트워크 오류가 발생했습니다.");
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center text-center">
      {isExpired ? (
        <>
          <div className="flex flex-col gap-2">
            <Text as="p" variant="subtitle">
              인증 링크가 만료되었습니다
            </Text>
            <Text as="p" variant="body" tone="muted">
              아래 버튼으로 인증 메일을 다시 받으세요.
            </Text>
          </div>
        </>
      ) : (
        <>
          {/* 스피너 */}
          <span
            className="inline-block size-10 rounded-full border-4 border-border border-t-accent animate-spin"
            aria-hidden="true"
          />
          <div className="flex flex-col gap-1">
            <Text as="p" variant="subtitle">
              메일함에서 인증 링크를 클릭해주세요
            </Text>
            <Text as="p" variant="body" tone="muted">
              {email} 로 전송했습니다
            </Text>
          </div>
        </>
      )}

      {resendError ? (
        <Text as="p" variant="caption" tone="heart" role="alert">
          {resendError}
        </Text>
      ) : null}

      <div className="flex flex-col gap-3 w-full">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          fullWidth
          onClick={handleResend}
          disabled={resendCooldown > 0 || isSending}
          aria-label={
            resendCooldown > 0
              ? `${resendCooldown}초 후 재전송 가능`
              : "인증 메일 재전송"
          }
        >
          {isSending
            ? "전송 중..."
            : resendCooldown > 0
              ? `재전송 (${resendCooldown}초)`
              : "메일 재전송"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="md"
          fullWidth
          onClick={onChangeEmail}
        >
          이메일 변경
        </Button>
      </div>
    </div>
  );
}

// ─── 단계 3: 비밀번호 입력 ────────────────────────────────────────────────

interface PasswordCheckItem {
  label: string;
  ok: boolean;
}

interface Step3Props {
  email: string;
  requestId: string;
}

function Step3PasswordInput({ email, requestId }: Step3Props) {
  const router = useRouter();
  const { login } = useAuth();

  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [invalidCharWarning, setInvalidCharWarning] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const checks = checkPassword(password);

  const checkItems: PasswordCheckItem[] = [
    { label: "8자 이상", ok: checks.minLength },
    { label: "영문 포함", ok: checks.hasLetter },
    { label: "숫자 포함", ok: checks.hasNumber },
    { label: "특수문자(!@#$) 포함", ok: checks.hasSpecial },
    { label: "비밀번호 일치", ok: password.length > 0 && password === confirm },
  ];

  const allOk = checkItems.every((c) => c.ok) && checks.onlyAllowed;

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    setInvalidCharWarning(val.length > 0 && !ALLOWED_CHARS_RE.test(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allOk) return;
    setError("");
    setIsLoading(true);
    try {
      const user = await signUp({
        request_id: requestId,
        email,
        password,
        password_confirm: confirm,
      });
      login(user);
      router.replace("/home");
    } catch (err) {
      if (err instanceof HttpError) {
        if (err.status === 422) {
          setError("비밀번호 정책을 확인해주세요.");
        } else if (err.status === 409) {
          setError("이미 가입된 이메일입니다. 로그인 해주세요.");
        } else if (err.status === 400) {
          setError("이메일 인증이 완료되지 않았거나 만료되었습니다.");
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        {/* 비밀번호 입력 */}
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="sr-only">
            비밀번호
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호"
              value={password}
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
        </div>

        {/* 비밀번호 확인 입력 */}
        <div className="flex flex-col gap-1">
          <label htmlFor="password-confirm" className="sr-only">
            비밀번호 확인
          </label>
          <div className="relative">
            <Input
              id="password-confirm"
              type={showConfirm ? "text" : "password"}
              placeholder="비밀번호 확인"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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
      </div>

      {/* 허용 문자 안내 */}
      <Text as="p" variant="caption" tone="muted">
        사용 가능한 특수문자: !@#$
      </Text>

      {/* 잘못된 문자 경고 */}
      {invalidCharWarning ? (
        <Text as="p" variant="caption" tone="heart" role="alert">
          허용되지 않는 문자가 포함되어 있습니다. 영문, 숫자, !@#$만 사용
          가능합니다.
        </Text>
      ) : null}

      {/* 정책 체크리스트 */}
      {password.length > 0 || confirm.length > 0 ? (
        <ul className="flex flex-col gap-1.5" aria-label="비밀번호 정책 확인">
          {checkItems.map((item) => (
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

      {/* 서버 에러 */}
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
        disabled={!allOk || isLoading}
      >
        {isLoading ? "가입 중..." : "가입 완료"}
      </Button>
    </form>
  );
}

// ─── 메인: 회원가입 폼 (단계 관리) ───────────────────────────────────────

type Step = 1 | 2 | 3;

const STEP_TITLES: Record<Step, string> = {
  1: "이메일로 가입",
  2: "이메일 인증",
  3: "비밀번호 설정",
};

export function SignUpForm() {
  const [step, setStep] = React.useState<Step>(1);
  const [email, setEmail] = React.useState("");
  const [requestId, setRequestId] = React.useState("");

  const handleStep1Next = (resolvedEmail: string, rid: string) => {
    setEmail(resolvedEmail);
    setRequestId(rid);
    setStep(2);
  };

  const handleVerified = () => {
    setStep(3);
  };

  const handleChangeEmail = () => {
    setStep(1);
    setEmail("");
    setRequestId("");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 단계 표시기 */}
      <div className="flex flex-col gap-3">
        <StepIndicator current={step} total={3} />
        <Text as="h1" variant="title">
          {STEP_TITLES[step]}
        </Text>
      </div>

      {step === 1 && <Step1EmailInput onNext={handleStep1Next} />}
      {step === 2 && (
        <Step2WaitVerification
          email={email}
          requestId={requestId}
          onVerified={handleVerified}
          onChangeEmail={handleChangeEmail}
        />
      )}
      {step === 3 && (
        <Step3PasswordInput email={email} requestId={requestId} />
      )}
    </div>
  );
}
