"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { AlertDialog } from "@/shared/ui/alert-dialog";
import { Avatar } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { SettingsIcon } from "@/shared/ui/icon/icons";

import { useAuth } from "./auth-context";

export function MyProfile({ children }: { children?: ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  const goToSignIn = () => {
    sessionStorage.setItem("returnTo", "/my");
    router.replace("/sign-in");
  };

  if (isLoading) {
    return (
      <div
        className="flex flex-1 items-center justify-center"
        role="status"
        aria-label="회원정보를 불러오는 중"
      >
        <span
          className="border-border border-t-accent size-8 animate-spin rounded-full border-4"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <AlertDialog
        open
        onClose={goToSignIn}
        variant="alert"
        title="로그인이 필요한 서비스입니다."
        confirmText="확인"
        onConfirm={goToSignIn}
        dismissible={false}
      />
    );
  }

  return (
    <>
      <section
        aria-labelledby="my-profile-heading"
        className="bg-profile-bg flex min-h-40 w-full items-center gap-4 px-[22px] pt-10 pb-[26px]"
      >
        <Avatar
          src={user.profile_image_url ?? undefined}
          alt={`${user.nickname} 프로필 이미지`}
          size="lg"
          fallbackColor="var(--color-avatar-bg)"
          fallback={
            <span className="text-text text-2xl font-bold" aria-hidden="true">
              {getInitial(user.nickname)}
            </span>
          }
        />

        <div className="min-w-0 flex-1 overflow-hidden">
          <h1 id="my-profile-heading" className="truncate text-[22px] font-bold tracking-[-0.02em]">
            {user.nickname}
          </h1>
          <p className="text-muted truncate text-[13px] leading-5">
            {user.email ?? `${providerLabel(user.provider)} 계정`}
          </p>
          <p className="text-muted truncate text-xs leading-5">
            {providerLabel(user.provider)} 계정으로 로그인했어요
          </p>
        </div>

        <Button
          asChild
          variant="naked"
          className="text-muted flex size-11 shrink-0 items-center justify-center"
        >
          <Link href="/my/edit" aria-label="회원정보 수정">
            <SettingsIcon size={28} aria-hidden />
          </Link>
        </Button>
      </section>

      {children ? <div className="w-full min-w-0 px-[18px] pt-4">{children}</div> : null}

      <div className="px-[22px] py-6">
        <Button type="button" variant="secondary" size="lg" fullWidth onClick={handleLogout}>
          로그아웃
        </Button>
      </div>
    </>
  );
}

function getInitial(nickname: string): string {
  return nickname.trim().charAt(0).toUpperCase() || "C";
}

function providerLabel(provider: string): string {
  const normalized = provider.toLowerCase();

  if (normalized === "kakao") return "카카오";
  if (normalized === "google") return "Google";
  if (normalized === "naver") return "네이버";

  return provider;
}
