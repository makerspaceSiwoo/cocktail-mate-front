"use client";

import Image from "next/image";
import Link from "next/link";

import { baseTagColor, baseTagLabel, readableTextColor } from "@/entities/cocktail";
import { type LikedCocktail } from "@/entities/like";

import { LikeButton } from "./like-button";

interface LikedCocktailRowProps {
  cocktail: LikedCocktail;
  showDivider: boolean;
}

export function LikedCocktailRow({ cocktail, showDivider }: LikedCocktailRowProps) {
  const baseColor = baseTagColor(cocktail.baseTag);

  return (
    <li
      className={`grid h-20 min-w-0 grid-cols-[56px_minmax(0,1fr)_44px] items-center gap-3 ${
        showDivider ? "border-border-soft border-b" : ""
      }`}
    >
      <Link
        href={`/detail/${cocktail.cocktailId}`}
        className="focus-visible:ring-accent col-span-2 grid min-w-0 grid-cols-[56px_minmax(0,1fr)] items-center gap-3 rounded outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-card-bg)]"
      >
        <div className="bg-chip-bg relative size-14 shrink-0 overflow-hidden rounded-[12px]">
          {cocktail.imageUrl ? (
            <Image
              src={cocktail.imageUrl}
              alt=""
              fill
              unoptimized
              sizes="56px"
              className="object-cover"
            />
          ) : null}
        </div>
        <div className="min-w-0">
          <h3 className="text-text truncate text-[14px] leading-5 font-bold">
            {cocktail.cocktailName}
          </h3>
          <div className="mt-1 flex min-w-0 items-center gap-2">
            <span
              className="max-w-[45%] truncate rounded-full px-2 py-0.5 text-[10.5px] font-semibold"
              style={{ backgroundColor: baseColor, color: readableTextColor(baseColor) }}
            >
              {baseTagLabel(cocktail.baseTag)}
            </span>
            <span className="text-muted min-w-0 truncate text-[11px]">
              좋아요 {cocktail.likeCount.toLocaleString("ko-KR")}
            </span>
          </div>
        </div>
      </Link>
      <LikeButton
        cocktailId={cocktail.cocktailId}
        initialLiked={cocktail.isLiked}
        initialLikeCount={cocktail.likeCount}
      />
    </li>
  );
}
