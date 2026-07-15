"use client";

import Image from "next/image";
import { useState } from "react";

import type { User } from "@/entities/user";
import { SettingsIcon } from "@/shared/ui/icon/icons";

interface MyProfileProps {
  user: User;
}

export function MyProfile({ user }: MyProfileProps) {
  return (
    <section
      aria-labelledby="my-profile-heading"
      className="bg-profile-bg flex min-h-40 w-full items-center gap-4 px-[22px] pt-10 pb-[26px]"
    >
      <ProfileAvatar user={user} />

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

      <span
        aria-hidden="true"
        className="text-muted flex size-11 shrink-0 items-center justify-center"
        title="프로필 설정은 준비 중입니다"
      >
        <SettingsIcon size={24} />
      </span>
    </section>
  );
}

function ProfileAvatar({ user }: { user: User }) {
  const [hasImageError, setHasImageError] = useState(false);
  const showImage = Boolean(user.profile_image_url) && !hasImageError;

  return (
    <div className="bg-avatar-bg relative flex size-[88px] shrink-0 items-center justify-center overflow-hidden rounded-full">
      {showImage ? (
        <Image
          src={user.profile_image_url!}
          alt={`${user.nickname} 프로필 이미지`}
          fill
          unoptimized
          sizes="88px"
          className="object-cover"
          onError={() => setHasImageError(true)}
        />
      ) : (
        <span className="text-text text-2xl font-bold" aria-hidden="true">
          {getInitial(user.nickname)}
        </span>
      )}
    </div>
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
