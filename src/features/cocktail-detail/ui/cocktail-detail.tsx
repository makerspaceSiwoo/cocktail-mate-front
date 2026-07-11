import Image from "next/image";
import Link from "next/link";

import { type CocktailDetail as CocktailDetailModel } from "@/entities/cocktail";
import { Badge } from "@/shared/ui/badge";
import { Card, CardBody, CardHeader } from "@/shared/ui/card";
import { ChevronLeftIcon, GlassIcon, ShareIcon } from "@/shared/ui/icon/icons";

import { DetailActions } from "./detail-actions";

const BASE_LABELS: Record<string, string> = {
  gin: "진",
  rum: "럼",
  tequila: "데킬라",
  vodka: "보드카",
  whiskey: "위스키",
  whisky: "위스키",
};

const CATEGORY_LABELS: Record<string, string> = {
  spirit: "스피릿",
  liqueur: "리큐르",
  juice: "주스",
  syrup: "시럽",
  bitter: "비터",
  garnish: "가니시",
  dairy: "유제품",
  other: "기타",
};

function formatAmount(amount: number | null, unit: string | null) {
  if (amount === null) return unit ?? "적당량";

  const value = Number.isInteger(amount) ? String(amount) : String(Number(amount.toFixed(1)));
  return `${value}${unit ?? ""}`;
}

function normalizeImageUrl(imageUrl: string | null) {
  if (!imageUrl) return null;

  const match = imageUrl.match(
    /^https:\/\/fastly\.picsum\.photos\/id\/([^/]+)\/([^/]+)\/([^/.]+)\.jpg$/,
  );

  if (!match) return imageUrl;

  const [, id, width, height] = match;
  return `https://picsum.photos/id/${id}/${width}/${height}`;
}

function getBaseLabel(baseTag: string | null) {
  if (!baseTag) return "기타";

  const normalizedTag = baseTag.trim().toLowerCase();
  const compactTag = normalizedTag.replace(/[\s_-]/g, "");
  return BASE_LABELS[normalizedTag] ?? BASE_LABELS[compactTag] ?? baseTag;
}

function getCategoryLabel(category: string | null) {
  if (!category) return "재료";
  return CATEGORY_LABELS[category.toLowerCase()] ?? category;
}

function getAbvLabel(abv: number | null) {
  if (abv === null) return "-";
  return `${Number.isInteger(abv) ? abv : Number(abv.toFixed(1))}%`;
}

function getDifficultyLabel(abv: number | null) {
  if (abv === null) return "정보 없음";
  if (abv >= 20) return "강함";
  if (abv >= 10) return "보통";
  return "가벼움";
}

export function CocktailDetail({ cocktail }: { cocktail: CocktailDetailModel }) {
  const imageUrl = normalizeImageUrl(cocktail.imageUrl);
  const baseLabel = getBaseLabel(cocktail.baseTag);
  const recipeSteps = cocktail.recipe ?? [];

  return (
    <main className="bg-bg mx-auto min-h-dvh w-full max-w-[430px] overflow-x-hidden pb-[max(32px,env(safe-area-inset-bottom))]">
      <header className="bg-bg/95 sticky top-0 z-20 flex h-[54px] items-center justify-between px-[18px] backdrop-blur">
        <Link
          href="/list"
          aria-label="칵테일 목록으로 돌아가기"
          className="text-text flex size-[34px] items-center justify-center rounded-full"
        >
          <ChevronLeftIcon size={25} aria-hidden />
        </Link>
        <h1 className="max-w-[240px] min-w-0 truncate text-center text-[17px] leading-5 font-bold">
          {cocktail.name}
        </h1>
        <a
          href="#detail-actions"
          aria-label="공유 버튼으로 이동"
          className="text-text flex size-[34px] items-center justify-center rounded-full"
        >
          <ShareIcon size={21} aria-hidden />
        </a>
      </header>

      <section className="px-[22px] pt-[14px]">
        <div className="bg-banner-bg relative flex h-[278px] items-center justify-center overflow-hidden rounded-[28px]">
          <div className="absolute inset-x-8 top-10 h-24 rounded-full bg-white/35 blur-2xl" />
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${cocktail.name} 칵테일`}
              fill
              priority
              sizes="(max-width: 430px) calc(100vw - 44px), 386px"
              className="object-cover"
            />
          ) : (
            <div className="border-border-soft bg-card-bg text-muted relative flex size-[190px] items-center justify-center rounded-full border text-sm font-medium">
              이미지 준비 중
            </div>
          )}
        </div>
      </section>

      <section className="px-[22px] pt-6">
        <div className="flex flex-col gap-3">
          <div>
            {cocktail.nameEn ? (
              <p className="text-muted text-[12px] leading-4 font-semibold uppercase">
                {cocktail.nameEn}
              </p>
            ) : null}
            <h2 className="text-text mt-1 text-[28px] leading-[34px] font-black">
              {cocktail.name}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge className="h-7 px-3 text-[13px] font-bold">{baseLabel}</Badge>
            {cocktail.glass ? (
              <Badge variant="outline" className="h-7 px-3 text-[13px]">
                <GlassIcon size={13} aria-hidden />
                {cocktail.glass}
              </Badge>
            ) : null}
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-3 gap-2">
          <StatItem label="도수" value={getAbvLabel(cocktail.abv)} />
          <StatItem label="난이도" value={getDifficultyLabel(cocktail.abv)} />
          <StatItem label="재료" value={`${cocktail.ingredients.length}개`} />
        </dl>
      </section>

      <DetailActions title={cocktail.name} />

      <section className="px-[22px] pt-5">
        <Card className="border-border-soft rounded-[18px]">
          <CardHeader className="px-5 pt-5 pb-2">
            <h2 className="text-[16px] leading-5 font-bold">설명</h2>
          </CardHeader>
          <CardBody className="px-5 pt-0 pb-5">
            <p className="text-text text-[14px] leading-[23px] break-keep">
              {cocktail.description ?? "설명이 준비되지 않았습니다."}
            </p>
          </CardBody>
        </Card>
      </section>

      <section className="px-[22px] pt-4">
        <Card className="border-border-soft rounded-[18px]">
          <CardHeader className="px-5 pt-5 pb-1">
            <h2 className="text-[16px] leading-5 font-bold">재료</h2>
          </CardHeader>
          <CardBody className="px-5 pt-0 pb-4">
            {cocktail.ingredients.length ? (
              <dl className="divide-border-soft divide-y">
                {cocktail.ingredients.map((ingredient) => (
                  <div
                    key={ingredient.id}
                    className="grid min-h-[58px] grid-cols-[1fr_auto] items-center gap-3 py-3"
                  >
                    <dt className="min-w-0">
                      <span className="block truncate text-[14px] leading-5 font-bold">
                        {ingredient.name}
                      </span>
                      <span className="text-muted mt-0.5 block truncate text-[12px] leading-4">
                        {getCategoryLabel(ingredient.category)}
                        {ingredient.nameEn ? ` · ${ingredient.nameEn}` : ""}
                      </span>
                    </dt>
                    <dd className="text-text bg-chip-bg rounded-full px-3 py-1 text-right text-[13px] leading-5 font-bold whitespace-nowrap">
                      {formatAmount(ingredient.amount, ingredient.unit)}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-muted py-3 text-[14px]">재료 정보가 없습니다.</p>
            )}
          </CardBody>
        </Card>
      </section>

      <section className="px-[22px] pt-4">
        <Card className="border-border-soft rounded-[18px]">
          <CardHeader className="px-5 pt-5 pb-1">
            <h2 className="text-[16px] leading-5 font-bold">만드는 법</h2>
          </CardHeader>
          <CardBody className="px-5 pt-1 pb-5">
            {recipeSteps.length ? (
              <ol className="space-y-4">
                {recipeSteps.map((step, index) => (
                  <li key={`${index}-${step}`} className="grid grid-cols-[28px_1fr] gap-3">
                    <span className="bg-text text-bg flex size-7 items-center justify-center rounded-full text-[12px] leading-none font-bold">
                      {index + 1}
                    </span>
                    <span className="text-[14px] leading-[22px] break-keep">{step}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-muted py-3 text-[14px]">레시피가 준비되지 않았습니다.</p>
            )}
          </CardBody>
        </Card>
      </section>
    </main>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border-soft bg-card-bg flex min-h-[70px] flex-col justify-center rounded-[16px] border px-3">
      <dt className="text-muted text-[12px] leading-4">{label}</dt>
      <dd className="text-text mt-1 truncate text-[16px] leading-5 font-black">{value}</dd>
    </div>
  );
}
