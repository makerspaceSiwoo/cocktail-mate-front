import Image from "next/image";
import Link from "next/link";

import { LikeButton } from "@/features/like";
import { getCocktailThumbnailUrl } from "@/shared/lib/cocktail-image.mjs";

import { BASE_BADGE_CLASS, type CocktailView } from "../lib/cocktail-view";

/** 검색 결과 한 행. `/list` 의 행과 동일한 레이아웃을 사용한다. */
export function CocktailResultRow({ cocktail }: { cocktail: CocktailView }) {
  return (
    <li className="border-border-soft grid h-28 grid-cols-[64px_minmax(0,1fr)_44px] items-center gap-3 border-b px-[22px]">
      <Link
        href={`/detail/${cocktail.id}`}
        className="focus-visible:ring-accent col-span-2 grid min-w-0 grid-cols-[64px_minmax(0,1fr)] items-center gap-3 rounded outline-none focus-visible:ring-2"
      >
        <div
          className="bg-chip-bg relative size-16 overflow-hidden rounded-full"
          aria-hidden={!cocktail.imageUrl}
        >
          {cocktail.imageUrl ? (
            <Image
              src={getCocktailThumbnailUrl(cocktail.imageUrl)}
              alt=""
              fill
              unoptimized
              sizes="64px"
              className="object-cover"
            />
          ) : null}
        </div>

        <article className="grid min-w-0 gap-1.5">
          <h2 className="text-text truncate text-[18px] leading-[21px] font-black tracking-normal">
            {cocktail.name}
          </h2>

          <p className="text-muted flex min-w-0 items-center gap-2 text-[12px] leading-[19px]">
            <span
              className={`text-text h-[19px] shrink-0 rounded-full px-2 text-[12px] leading-[19px] font-black ${BASE_BADGE_CLASS[cocktail.base]}`}
            >
              {cocktail.base}
            </span>
            <span aria-hidden className="text-border">
              |
            </span>
            <span className="truncate">{cocktail.description}</span>
          </p>

          <dl className="text-muted mt-1.5 flex items-center text-[12px] leading-[13px] whitespace-nowrap">
            <div>
              <dt className="sr-only">도수</dt>
              <dd>도수 {cocktail.abv === null ? "-" : `${cocktail.abv}%`}</dd>
            </div>
          </dl>
        </article>
      </Link>
      <LikeButton
        cocktailId={Number(cocktail.id)}
        initialLiked={cocktail.liked}
        className="-mr-2"
      />
    </li>
  );
}
