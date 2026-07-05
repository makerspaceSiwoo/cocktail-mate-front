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
import { Text } from "@/shared/ui/text";

import { useAuth } from "./auth-context";

// ─── 검증 유틸리티 ────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NICKNAME_RE = /^[가-힣a-zA-Z0-9]{2,10}$/;

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

// ─── 단일 입력 폼 ─────────────────────────────────────────────────────────

interface SignUpData {
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
}

interface SignUpInputFormProps {
  onSubmit: (data: SignUpData, requestId: string) => void;
  /** 닉네임 중복 오류로 돌아왔을 때 미리 채워줄 데이터 */
  prefill?: Partial<SignUpData>;
  /** 닉네임 중복 오류 메시지 */
  nicknameError?: string;
}

function SignUpInputForm({
  onSubmit,
  prefill,
  nicknameError,
}: SignUpInputFormProps) {
  const [email, setEmail] = React.useState(prefill?.email ?? "");
  const [password, setPassword] = React.useState(prefill?.password ?? "");
  const [passwordConfirm, setPasswordConfirm] = React.useState(
    prefill?.passwordConfirm ?? "",
  );
  const [nickname, setNickname] = React.useState(prefill?.nickname ?? "");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [invalidCharWarning, setInvalidCharWarning] = React.useState(false);
  const [serverError, setServerError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const isEmailValid = EMAIL_RE.test(email);
  const pwChecks = checkPassword(password);
  const pwCheckItems: PasswordCheckItem[] = [
    { label: "8자 이상", ok: pwChecks.minLength },
    { label: "영문 포함", ok: pwChecks.hasLetter },
    { label: "숫자 포함", ok: pwChecks.hasNumber },
    { label: "특수문자(!@#$) 포함", ok: pwChecks.hasSpecial },
    {
      label: "비밀번호 일치",
      ok: password.length > 0 && password === passwordConfirm,
    },
  ];
  const isPwValid =
    pwCheckItems.every((c) => c.ok) && pwChecks.onlyAllowed;
  const isNicknameValid = NICKNAME_RE.test(nickname);

  const canSubmit =
    isEmailValid && isPwValid && isNicknameValid && !isLoading;

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    setInvalidCharWarning(val.length > 0 && !ALLOWED_CHARS_RE.test(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setServerError("");
    setIsLoading(true);
    try {
      const { request_id } = await requestEmailVerification(email);
      onSubmit(
        { email, password, passwordConfirm, nickname },
        request_id,
      );
    } catch (err) {
      if (err instanceof HttpError) {
        if (err.status === 429) {
          setServerError("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
        } else {
          setServerError(err.message);
        }
      } else {
        setServerError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const showPwHints = password.length > 0 || passwordConfirm.length > 0;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* 이메일 */}
      <div className="flex flex-col gap-1">
        <label htmlFor="signup-email" className="sr-only">
          이메일
        </label>
        <Input
          id="signup-email"
          type="email"
          placeholder="이메일 주소"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          clearable
          onClear={() => setEmail("")}
        />
      </div>

      {/* 비밀번호 */}
      <div className="flex flex-col gap-1">
        <label htmlFor="signup-password" className="sr-only">
          비밀번호
        </label>
        <div className="relative">
          <Input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호 (영문·숫자·특수문자!@#$ 8자 이상)"
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
        {invalidCharWarning ? (
          <Text as="p" variant="caption" tone="heart" role="alert">
            허용되지 않는 문자입니다. 영문, 숫자, !@#$만 사용 가능합니다.
          </Text>
        ) : null}
      </div>

      {/* 비밀번호 확인 */}
      <div className="flex flex-col gap-1">
        <label htmlFor="signup-password-confirm" className="sr-only">
          비밀번호 확인
        </label>
        <div className="relative">
          <Input
            id="signup-password-confirm"
            type={showConfirm ? "text" : "password"}
            placeholder="비밀번호 확인"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
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

      {/* 닉네임 */}
      <div className="flex flex-col gap-1">
        <label htmlFor="signup-nickname" className="sr-only">
          닉네임
        </label>
        <Input
          id="signup-nickname"
          type="text"
          placeholder="닉네임 (한글·영문·숫자 2~10자)"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          autoComplete="nickname"
          clearable
          onClear={() => setNickname("")}
          error={!!nicknameError}
          aria-describedby={nicknameError ? "signup-nickname-error" : undefined}
        />
        {nicknameError ? (
          <Text
            id="signup-nickname-error"
            as="p"
            variant="caption"
            tone="heart"
            role="alert"
          >
            {nicknameError}
          </Text>
        ) : null}
      </div>

      {/* 비밀번호 정책 체크리스트 */}
      {showPwHints ? (
        <ul className="flex flex-col gap-1.5" aria-label="비밀번호 정책 확인">
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

      {serverError ? (
        <Text as="p" variant="caption" tone="heart" role="alert">
          {serverError}
        </Text>
      ) : null}

      <Button
        type="submit"
        variant="cta"
        size="lg"
        fullWidth
        disabled={!canSubmit}
      >
        {isLoading ? "처리 중..." : "가입하기"}
      </Button>
    </form>
  );
}

// ─── 인증 대기 화면 ───────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 3000;
const RESEND_COOLDOWN_SEC = 60;

interface WaitingScreenProps {
  email: string;
  requestId: string;
  formData: SignUpData;
  onSignUpSuccess: () => void;
  onGoBackToForm: (nicknameError?: string) => void;
  onResend: (newRequestId: string) => void;
}

function WaitingScreen({
  email,
  requestId,
  formData,
  onSignUpSuccess,
  onGoBackToForm,
  onResend,
}: WaitingScreenProps) {
  const { login } = useAuth();
  const router = useRouter();

  const [isExpired, setIsExpired] = React.useState(false);
  const [resendCooldown, setResendCooldown] = React.useState(0);
  const [resendError, setResendError] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [signUpError, setSignUpError] = React.useState("");
  const [isSigningUp, setIsSigningUp] = React.useState(false);

  // verified=true 감지 시 자동으로 signup 호출
  const handleVerified = React.useCallback(async () => {
    if (isSigningUp) return;
    setIsSigningUp(true);
    setSignUpError("");
    try {
      const user = await signUp({
        request_id: requestId,
        email,
        password: formData.password,
        password_confirm: formData.passwordConfirm,
        nickname: formData.nickname,
      });
      login(user);
      onSignUpSuccess();
      router.replace("/home");
    } catch (err) {
      if (err instanceof HttpError) {
        if (err.status === 409) {
          if (err.message.includes("닉네임")) {
            // 닉네임 중복 → 폼으로 돌아가 닉네임만 수정
            onGoBackToForm("이미 사용 중인 닉네임입니다.");
          } else {
            // 이메일 중복
            setSignUpError(
              "이미 가입된 이메일입니다. 로그인 페이지로 이동해주세요.",
            );
          }
        } else if (err.status === 400) {
          setSignUpError("이메일 인증이 완료되지 않았거나 만료되었습니다.");
        } else if (err.status === 422) {
          setSignUpError("입력 값을 확인해주세요.");
        } else {
          setSignUpError(err.message);
        }
      } else {
        setSignUpError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsSigningUp(false);
    }
  }, [
    isSigningUp,
    requestId,
    email,
    formData,
    login,
    onSignUpSuccess,
    onGoBackToForm,
    router,
  ]);

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
          handleVerified();
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
  }, [requestId, isExpired, handleVerified]);

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
      const { request_id } = await requestEmailVerification(email);
      onResend(request_id);
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
      {isSigningUp ? (
        <>
          <span
            className="inline-block size-10 rounded-full border-4 border-border border-t-accent animate-spin"
            aria-hidden="true"
          />
          <Text as="p" variant="subtitle">
            가입 처리 중...
          </Text>
        </>
      ) : isExpired ? (
        <div className="flex flex-col gap-2">
          <Text as="p" variant="subtitle">
            인증 링크가 만료되었습니다
          </Text>
          <Text as="p" variant="body" tone="muted">
            아래 버튼으로 인증 메일을 다시 받으세요.
          </Text>
        </div>
      ) : (
        <>
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

      {signUpError ? (
        <Text as="p" variant="caption" tone="heart" role="alert">
          {signUpError}
        </Text>
      ) : null}

      {resendError ? (
        <Text as="p" variant="caption" tone="heart" role="alert">
          {resendError}
        </Text>
      ) : null}

      {!isSigningUp ? (
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
            onClick={() => onGoBackToForm()}
          >
            이메일 변경
          </Button>
        </div>
      ) : null}
    </div>
  );
}

// ─── 메인: 회원가입 폼 ────────────────────────────────────────────────────

type View = "form" | "waiting";

export function SignUpForm() {
  const [view, setView] = React.useState<View>("form");
  const [formData, setFormData] = React.useState<SignUpData>({
    email: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
  });
  const [requestId, setRequestId] = React.useState("");
  const [nicknameError, setNicknameError] = React.useState<
    string | undefined
  >(undefined);

  const handleFormSubmit = (data: SignUpData, rid: string) => {
    setFormData(data);
    setRequestId(rid);
    setNicknameError(undefined);
    setView("waiting");
  };

  const handleGoBackToForm = (errMsg?: string) => {
    setNicknameError(errMsg);
    setView("form");
  };

  if (view === "waiting") {
    return (
      <WaitingScreen
        email={formData.email}
        requestId={requestId}
        formData={formData}
        onSignUpSuccess={() => {
          /* router.replace already called inside WaitingScreen */
        }}
        onGoBackToForm={handleGoBackToForm}
        onResend={setRequestId}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Text as="h1" variant="title">
          회원가입
        </Text>
        <Text as="p" variant="body" tone="muted">
          이메일로 가입하고 나만의 칵테일을 찾아보세요
        </Text>
      </div>
      <SignUpInputForm
        onSubmit={handleFormSubmit}
        prefill={formData}
        nicknameError={nicknameError}
      />
    </div>
  );
}
