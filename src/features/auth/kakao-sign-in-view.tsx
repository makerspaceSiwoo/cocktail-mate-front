"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Text } from "@/shared/ui/text";

import { useAuth } from "./auth-context";

export function KakaoSignInView() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // 이미 로그인된 사용자는 홈("/")으로 리다이렉트
  React.useEffect(() => {
    if (!isLoading && user) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  const handleKakaoLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/kakao/login`;
  };

  // 로딩 중이거나 이미 인증된 경우 빈 화면
  if (isLoading || user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-10">
      {/* 로고 + 슬로건 */}
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-text font-serif text-[32px] font-bold tracking-[-0.02em]">
          CocktailMate
        </h1>
        <Text as="p" variant="body" tone="muted" align="center">
          당신의 한 잔을 찾아드릴게요
        </Text>
      </div>

      {/* 카카오 로그인 버튼 */}
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={handleKakaoLogin}
          aria-label="카카오로 계속하기"
          className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#FEE500] text-base font-bold text-[#191919] transition-opacity hover:opacity-90 active:opacity-80"
        >
          {/* 카카오 말풍선 아이콘 (inline SVG) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.747 1.668 5.156 4.2 6.6l-.9 3.3c-.075.273.21.497.455.348L9.6 18.9c.78.15 1.58.228 2.4.228 5.523 0 10-3.477 10-7.8C22 6.477 17.523 3 12 3z" />
          </svg>
          카카오로 계속하기
        </button>

        {/* 약관 안내 */}
        <Text as="p" variant="caption" tone="muted" align="center" className="px-4">
          로그인하면 이용약관·개인정보처리방침에 동의하는 것으로 간주됩니다
        </Text>

        {/* 홈으로 가기 (비로그인 둘러보기) */}
        <Link
          href="/"
          className="text-muted hover:text-text flex h-11 w-full cursor-pointer items-center justify-center text-sm font-medium underline-offset-4 transition-colors hover:underline"
        >
          홈으로 가기
        </Link>
      </div>
    </div>
  );
}
