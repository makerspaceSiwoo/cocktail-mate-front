import Image from "next/image";
import Link from "next/link";

import { ChevronRightIcon } from "@/shared/ui/icon/icons";

/**
 * 홈: "내 취향 알아보기" 배너. 클릭 시 취향 선택 폼(/recommend)으로 이동한다.
 * 아이콘 대신 배너 일러스트(public/images/taste-recommend-banner.png)를 노출한다.
 */
export function TasteBanner() {
  return (
    <Link
      href="/recommend"
      aria-label="내 취향 알아보기 — 나에게 맞는 칵테일 찾기"
      className="bg-banner-bg focus-visible:outline-accent flex items-center gap-3 rounded-2xl p-4 transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <div className="min-w-0 flex-1">
        <p className="text-text text-lg font-bold">내 취향 알아보기</p>
        <p className="text-muted mt-1 text-sm break-keep">나에게 딱 맞는 칵테일을 찾아보세요</p>
      </div>

      {/* 박스 비율을 원본 일러스트(≈1.11:1)에 맞춰 여백 없이 채운다.
          unoptimized: 디테일 많은 일러스트를 next/image 재인코딩(q75)으로
          뭉개지 않도록 원본 그대로 서빙한다. */}
      <div className="relative aspect-[831/746] w-20 shrink-0">
        <Image
          src="/images/taste-recommend-banner.png"
          alt=""
          fill
          unoptimized
          className="object-contain"
        />
      </div>

      <ChevronRightIcon size={22} className="text-muted shrink-0" aria-hidden />
    </Link>
  );
}
