"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import type { User } from "@/entities/user";
import {
  getMyInfo,
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
  /** /auth/my-info를 다시 호출해 상태 동기화 (소셜 로그인 콜백 등). 조회된 유저를 반환 */
  refreshUser: () => Promise<User | null>;
}

export type AuthContextValue = AuthState & AuthActions;

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  const refreshUser = React.useCallback(async () => {
    try {
      const me = await getMyInfo();
      setUser(me);
      return me;
    } catch {
      setUser(null);
      return null;
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

  // 앱 초기 로드 시 /auth/my-info 1회 호출.
  // 소셜 로그인 콜백은 FRONTEND_URL 로 풀 페이지 이동해 돌아오므로 여기서 재실행된다.
  // 로그인이 확인되면, 로그인 전 저장해둔 returnTo(원래 가려던 경로)로 이동한다.
  React.useEffect(() => {
    async function init() {
      const me = await refreshUser();
      setIsLoading(false);
      if (me) {
        const returnTo = sessionStorage.getItem("returnTo");
        if (returnTo) {
          sessionStorage.removeItem("returnTo");
          router.replace(returnTo);
        }
      }
    }
    init();
  }, [refreshUser, router]);

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
