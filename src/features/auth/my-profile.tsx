"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

import { useAuth } from "./auth-context";
import { Button } from "@/shared/ui/button";
import { Text } from "@/shared/ui/text";

export function MyProfile() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/home");
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center" role="status">
        <span
          className="inline-block size-8 rounded-full border-4 border-border border-t-accent animate-spin"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (!user) {
    // 인증 정보 로드 완료 후 유저가 없으면 로그인 페이지로 리다이렉트.
    // 미들웨어(proxy.ts)는 크로스도메인 배포에서 API 도메인 쿠키를 볼 수 없으므로
    // 클라이언트 사이드에서 가드를 담당한다.
    router.replace("/sign-in?next=/my");
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 items-center">
        {/* 프로필 이미지 */}
        <div className="size-20 rounded-full overflow-hidden bg-chip-bg flex items-center justify-center">
          {user.profile_image_url ? (
            <Image
              src={user.profile_image_url}
              alt={`${user.nickname} 프로필 이미지`}
              width={80}
              height={80}
              className="object-cover size-full"
            />
          ) : (
            <span className="text-2xl text-muted" aria-hidden="true">
              👤
            </span>
          )}
        </div>

        {/* 닉네임 / 이메일 */}
        <div className="flex flex-col gap-1 items-center">
          <Text as="h1" variant="subtitle">
            {user.nickname}
          </Text>
          <Text as="p" variant="body" tone="muted">
            {user.email}
          </Text>
        </div>
      </div>

      <Button
        type="button"
        variant="secondary"
        size="lg"
        fullWidth
        onClick={handleLogout}
      >
        로그아웃
      </Button>
    </div>
  );
}
