/**
 * 인증 관련 API 호출 함수 모음 (소셜 로그인 전용).
 * 로그인/가입은 백엔드 소셜 콜백(/auth/{provider}/...)이 처리하므로 프론트 래퍼가 없다.
 * 여기에는 세션 관련(내 정보/로그아웃/갱신)만 둔다. 모든 함수는 apiFetch 래퍼를 통해 호출된다.
 */
import type { User } from "@/entities/user";

import { apiFetch } from "./client";

// ─── 로그아웃 ─────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  await apiFetch("/auth/logout", { method: "POST" });
}

// ─── 내 정보 ──────────────────────────────────────────────────────────────

export async function getMyInfo(): Promise<User> {
  return apiFetch<User>("/auth/my-info");
}

// ─── 토큰 갱신 ────────────────────────────────────────────────────────────

export async function refreshToken(): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/refresh", { method: "POST" });
}
