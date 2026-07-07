import Image from "next/image";
import Link from "next/link";

import { type CocktailDetail as CocktailDetailModel } from "@/entities/cocktail";
import { ChevronLeftIcon, ShareIcon } from "@/shared/ui/icon/icons";

import { DetailActions } from "./detail-actions";

const BASE_LABELS: Record<string, string> = {
  gin: "진",
  rum: "럼",
  tequila: "데킬라",
  vodka: "보드카",
  whiskey: "위스키",
  whisky: "위스키",
};

function formatAmount(amount: number | null, unit: string | null) {
  if (amount === null) return unit ?? "적당량";
  const value = Number.isInteger(amount) ? String(amount) : String(Number(amount.toFixed(1)));
  return `${value}${unit ?? ""}`;
}

export function CocktailDetail({ cocktail }: { cocktail: CocktailDetailModel }) {
  const baseLabel = cocktail.baseTag
    ? (BASE_LABELS[cocktail.baseTag.toLowerCase()] ?? cocktail.baseTag)
    : "기타";

  return (
    <main className="bg-bg mx-auto min-h-dvh w-full max-w-[430px] overflow-x-hidden pb-8">
      <header className="bg-bg sticky top-0 z-10 flex h-[54px] items-center justify-between px-[18px]">
        <Link
          href="/list"
          aria-label="칵테일 목록으로 돌아가기"
          className="flex size-[26px] items-center justify-center"
        >
          <ChevronLeftIcon size={26} aria-hidden />
        </Link>
        <h1 className="max-w-[calc(100%-96px)] truncate text-[17px] font-bold">{cocktail.name}</h1>
        <a
          href="#detail-actions"
          aria-label="공유 버튼으로 이동"
          className="text-text flex size-[26px] items-center justify-center"
        >
          <ShareIcon size={22} aria-hidden />
        </a>
      </header>

      <section
        className="bg-banner-bg relative h-80 w-full overflow-hidden"
        aria-label="칵테일 이미지"
      >
        {cocktail.imageUrl ? (
          <Image
            src={cocktail.imageUrl}
            alt={`${cocktail.name} 칵테일`}
            fill
            priority
            sizes="(max-width: 430px) 100vw, 430px"
            className="object-cover"
          />
        ) : (
          <div className="text-muted flex h-full items-center justify-center text-sm">
            이미지 준비 중
          </div>
        )}
      </section>

      <section className="px-[22px] pt-5 pb-1.5">
        <h2 className="text-text text-[26px] leading-tight font-bold tracking-[-0.02em]">
          {cocktail.name}
        </h2>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="bg-chip-bg text-text rounded-full px-2.5 py-1 font-semibold">
            {baseLabel}
          </span>
          {cocktail.glass ? <span className="text-muted">· {cocktail.glass}</span> : null}
        </div>
        <p className="mt-2 text-[13px]">
          <span className="text-text">도수</span>{" "}
          <span className="text-muted">{cocktail.abv ?? 0}%</span>
        </p>
      </section>

      <DetailActions />

      <section className="px-[18px] pt-3.5">
        <article className="border-border-soft bg-card-bg rounded-[14px] border p-[18px]">
          <h2 className="text-base font-bold">설명</h2>
          <p className="mt-2 text-[13px] leading-[1.6]">
            {cocktail.description ?? "설명이 준비되지 않았습니다."}
          </p>
        </article>
      </section>

      <section className="px-[18px] pt-7">
        <div className="border-border-soft bg-card-bg rounded-[14px] border p-[18px]">
          <h2 className="pb-2.5 text-base font-bold">재료 및 용량</h2>
          {cocktail.ingredients.length ? (
            <dl>
              {cocktail.ingredients.map((ingredient) => (
                <div
                  key={ingredient.id}
                  className="flex min-h-9 items-start justify-between gap-4 py-2 text-[13px]"
                >
                  <dt>{ingredient.name}</dt>
                  <dd className="text-right whitespace-nowrap">
                    {formatAmount(ingredient.amount, ingredient.unit)}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-muted py-2 text-[13px]">재료 정보가 없습니다.</p>
          )}
        </div>
      </section>

      {cocktail.recipe?.length ? (
        <section className="px-[18px] pt-7">
          <article className="border-border-soft bg-card-bg rounded-[14px] border p-[18px]">
            <h2 className="text-base font-bold">만드는 법</h2>
            <ol className="mt-3 space-y-3 text-[13px] leading-[1.6]">
              {cocktail.recipe.map((step, index) => (
                <li key={`${index}-${step}`} className="flex gap-3">
                  <span className="bg-chip-bg flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </article>
        </section>
      ) : null}
    </main>
  );
}
