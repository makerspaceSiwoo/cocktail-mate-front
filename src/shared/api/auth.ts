/**
 * 인증 관련 API 호출 함수 모음.
 * 모든 함수는 apiFetch 래퍼를 통해 호출된다.
 */
import type { User } from "@/entities/user";

import { apiFetch } from "./client";

// ─── 이메일 인증 ───────────────────────────────────────────────────────────

export interface RequestVerificationResponse {
  request_id: string;
}

export async function requestEmailVerification(
  email: string,
): Promise<RequestVerificationResponse> {
  return apiFetch<RequestVerificationResponse>(
    "/auth/email/request-verification",
    {
      method: "POST",
      body: JSON.stringify({ email }),
    },
  );
}

export interface VerificationStatusResponse {
  verified: boolean;
  expired: boolean;
}

export async function getVerificationStatus(
  requestId: string,
): Promise<VerificationStatusResponse> {
  return apiFetch<VerificationStatusResponse>(
    `/auth/email/verification-status?request_id=${encodeURIComponent(requestId)}`,
  );
}

export async function verifyEmailToken(
  token: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/email/verify", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

// ─── 회원가입 ──────────────────────────────────────────────────────────────

export interface SignUpPayload {
  request_id: string;
  email: string;
  password: string;
  password_confirm: string;
  nickname: string;
}

export async function signUp(payload: SignUpPayload): Promise<User> {
  return apiFetch<User>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ─── 비밀번호 찾기 / 재설정 ────────────────────────────────────────────────

export async function forgotPassword(
  email: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/password/forgot", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export interface ResetPasswordPayload {
  token: string;
  new_password: string;
  new_password_confirm: string;
}

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/password/reset", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ─── 로그인 ───────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export async function login(payload: LoginPayload): Promise<User> {
  return apiFetch<User>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ─── 로그아웃 ─────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  await apiFetch("/auth/logout", { method: "POST" });
}

// ─── 내 정보 ──────────────────────────────────────────────────────────────

export async function getMe(): Promise<User> {
  return apiFetch<User>("/auth/me");
}

// ─── 토큰 갱신 ────────────────────────────────────────────────────────────

export async function refreshToken(): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/refresh", { method: "POST" });
}
