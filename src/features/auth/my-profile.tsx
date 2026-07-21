"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import type { ReactNode } from "react";

import { useAuth } from "./auth-context";
import { AlertDialog } from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";
import { Text } from "@/shared/ui/text";

export function MyProfile({ children }: { children?: ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/home");
  };

  // 로그인 후 원래 가려던 곳(/my)으로 복귀시키기 위해, 소셜 로그인 왕복 동안
  // 의도 경로를 sessionStorage 로 보존한다. (AuthProvider 가 로그인 확인 후 읽어 이동)
  const goToSignIn = () => {
    sessionStorage.setItem("returnTo", "/my");
    router.replace("/sign-in");
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center" role="status">
        <span
          className="border-border border-t-accent inline-block size-8 animate-spin rounded-full border-4"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (!user) {
    // 인증 정보 로드 완료 후 유저가 없으면 로그인 안내 다이얼로그를 띄운다.
    // (미들웨어 proxy.ts 는 크로스도메인 배포에서 API 도메인 쿠키를 못 보므로
    //  클라이언트 사이드 가드를 담당.) 화면 dim + 중앙 다이얼로그, 확인 시 로그인 페이지 이동.
    return (
      <AlertDialog
        open
        onClose={goToSignIn}
        variant="alert"
        title="로그인 후 이용 가능합니다."
        confirmText="확인"
        onConfirm={goToSignIn}
        dismissible={false}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4">
        {/* 프로필 이미지 */}
        <div className="bg-chip-bg flex size-20 items-center justify-center overflow-hidden rounded-full">
          {user.profile_image_url ? (
            <Image
              src={user.profile_image_url}
              alt={`${user.nickname} 프로필 이미지`}
              width={80}
              height={80}
              className="size-full object-cover"
            />
          ) : (
            <span className="text-muted text-2xl" aria-hidden="true">
              👤
            </span>
          )}
        </div>

        {/* 닉네임 / 이메일 */}
        <div className="flex flex-col items-center gap-1">
          <Text as="h1" variant="subtitle">
            {user.nickname}
          </Text>
          {user.email ? (
            <Text as="p" variant="body" tone="muted">
              {user.email}
            </Text>
          ) : null}
        </div>
      </div>

      {children}

      <Button type="button" variant="secondary" size="lg" fullWidth onClick={handleLogout}>
        로그아웃
      </Button>
    </div>
  );
}
