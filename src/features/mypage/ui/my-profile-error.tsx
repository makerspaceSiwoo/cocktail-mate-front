import Link from "next/link";

import { Button } from "@/shared/ui/button";

interface MyProfileErrorProps {
  unauthorized?: boolean;
  onRetry: () => void;
  onSignIn?: () => void;
}

export function MyProfileError({ unauthorized = false, onRetry, onSignIn }: MyProfileErrorProps) {
  return (
    <section
      aria-labelledby="my-profile-error-heading"
      role="alert"
      className="bg-profile-bg flex min-h-40 w-full flex-col items-start justify-center gap-3 px-[22px] py-8"
    >
      <div>
        <h1 id="my-profile-error-heading" className="text-lg font-bold tracking-[-0.02em]">
          {unauthorized ? "로그인이 필요해요" : "사용자 정보를 불러오지 못했어요"}
        </h1>
        <p className="text-muted mt-1 text-sm">
          {unauthorized ? "로그인 후 내 프로필을 확인할 수 있어요." : "잠시 후 다시 시도해 주세요."}
        </p>
      </div>

      {unauthorized ? (
        onSignIn ? (
          <Button type="button" size="sm" variant="secondary" onClick={onSignIn}>
            로그인하러 가기
          </Button>
        ) : (
          <Button asChild size="sm" variant="secondary">
            <Link href="/sign-in">로그인하러 가기</Link>
          </Button>
        )
      ) : (
        <Button type="button" size="sm" variant="secondary" onClick={onRetry}>
          다시 시도
        </Button>
      )}
    </section>
  );
}
