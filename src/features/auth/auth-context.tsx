"use client";

import * as React from "react";

import type { User } from "@/entities/user";
import {
  getMe,
  logout as apiLogout,
  registerUnauthorizedHandler,
  unregisterUnauthorizedHandler,
} from "@/shared/api";

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

interface AuthActions {
  /** 로그인/회원가입 성공 후 서버에서 받은 유저 정보로 상태 갱신 */
  login: (user: User) => void;
  /** 로그아웃: POST /auth/logout 후 상태 초기화 */
  logout: () => Promise<void>;
  /** /auth/me를 다시 호출해 상태 동기화 (소셜 로그인 콜백 등) */
  refreshUser: () => Promise<void>;
}

export type AuthContextValue = AuthState & AuthActions;

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const refreshUser = React.useCallback(async () => {
    try {
      const me = await getMe();
      setUser(me);
    } catch {
      setUser(null);
    }
  }, []);

  const login = React.useCallback((u: User) => {
    setUser(u);
  }, []);

  const logout = React.useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // 네트워크 실패여도 클라이언트 상태는 초기화
    }
    setUser(null);
  }, []);

  // 앱 초기 로드 시 /auth/me 1회 호출
  React.useEffect(() => {
    async function init() {
      await refreshUser();
      setIsLoading(false);
    }
    init();
  }, [refreshUser]);

  // 401 인터셉터 등록 — refresh 실패 시 전역 로그아웃
  React.useEffect(() => {
    registerUnauthorizedHandler(() => {
      setUser(null);
    });
    return () => {
      unregisterUnauthorizedHandler();
    };
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({ user, isLoading, login, logout, refreshUser }),
    [user, isLoading, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
