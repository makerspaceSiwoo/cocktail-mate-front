import type { Metadata } from "next";
import Link from "next/link";

import { LikedCocktailInfiniteList } from "@/features/like";
import { ChevronLeftIcon } from "@/shared/ui/icon/icons";

export const metadata: Metadata = {
  title: "좋아요 목록 | Cocktail Mate",
  description: "좋아요를 표시한 칵테일 목록을 확인합니다.",
};

export default function MyLikesPage() {
  return (
    <main className="flex min-h-0 flex-1 flex-col" aria-labelledby="my-likes-heading">
      <header className="border-border-soft bg-card-bg relative flex h-16 shrink-0 items-center justify-center border-b px-[18px]">
        <Link
          href="/my"
          aria-label="마이페이지로 돌아가기"
          className="text-text focus-visible:ring-accent absolute left-[18px] flex size-10 items-center justify-center rounded-full outline-none focus-visible:ring-2"
        >
          <ChevronLeftIcon size={24} aria-hidden />
        </Link>
        <h1 id="my-likes-heading" className="text-text text-[17px] font-bold">
          좋아요 목록
        </h1>
      </header>

      <section className="min-h-0 flex-1 overflow-y-auto px-[18px] pt-4 pb-6">
        <LikedCocktailInfiniteList />
      </section>
    </main>
  );
}
