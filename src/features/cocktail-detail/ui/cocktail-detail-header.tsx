"use client";

import Link from "next/link";

import { IconButton } from "@/shared/ui/button";
import { ChevronLeftIcon, ShareIcon } from "@/shared/ui/icon/icons";

import { shareCurrentPage } from "./share-current-page";

export function CocktailDetailHeader({ title }: { title: string }) {
  async function share() {
    try {
      await shareCurrentPage(title);
    } catch {
      // 사용자가 공유 창을 닫은 경우 현재 화면을 유지한다.
    }
  }

  return (
    <header className="bg-bg/95 sticky top-0 z-20 flex h-[54px] items-center justify-between px-[18px] backdrop-blur">
      <Link
        href="/list"
        aria-label="칵테일 목록으로 돌아가기"
        className="text-text flex size-[34px] items-center justify-center rounded-full"
      >
        <ChevronLeftIcon size={25} aria-hidden />
      </Link>
      <h1 className="max-w-[240px] min-w-0 truncate text-center text-[17px] leading-5 font-bold">
        {title}
      </h1>
      <IconButton
        aria-label="공유하기"
        onClick={share}
        variant="ghost"
        size="sm"
        className="rounded-full"
        icon={<ShareIcon size={21} aria-hidden />}
      />
    </header>
  );
}
