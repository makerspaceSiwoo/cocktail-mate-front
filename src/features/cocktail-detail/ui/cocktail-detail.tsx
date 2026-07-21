import Image from "next/image";

import { type CocktailDetail as CocktailDetailModel } from "@/entities/cocktail";
import { Badge } from "@/shared/ui/badge";
import { Card, CardBody, CardHeader } from "@/shared/ui/card";
import { GlassIcon } from "@/shared/ui/icon/icons";

import { CocktailDetailHeader } from "./cocktail-detail-header";
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

function normalizeImageUrl(imageUrl: string | null) {
  if (!imageUrl) return null;

  // TODO: Mock data uses Fastly Picsum URLs. Remove once the API returns canonical image URLs.
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

function getAbvLabel(abv: number | null) {
  if (abv === null) return "-";
  return `${Number.isInteger(abv) ? abv : Number(abv.toFixed(1))}%`;
}

export function CocktailDetail({ cocktail }: { cocktail: CocktailDetailModel }) {
  const imageUrl = normalizeImageUrl(cocktail.imageUrl);
  const baseLabel = getBaseLabel(cocktail.baseTag);

  return (
    <main className="bg-bg mx-auto min-h-dvh w-full max-w-[430px] overflow-x-hidden pb-[max(32px,env(safe-area-inset-bottom))]">
      <CocktailDetailHeader title={cocktail.name} />

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
      </section>

      <DetailActions title={cocktail.name} />

      <section className="px-[22px] pt-5">
        <dl className="grid grid-cols-2 gap-2">
          <StatItem label="도수" value={getAbvLabel(cocktail.abv)} />
          <StatItem label="재료" value={`${cocktail.ingredients.length}개`} />
        </dl>
      </section>

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
                    </dt>
                    <dd className="text-text text-right text-[13px] leading-5 font-bold whitespace-nowrap">
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
    </main>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-border-soft flex min-h-[70px] flex-col justify-center rounded-[16px] px-3">
      <dt className="text-muted text-[12px] leading-4">{label}</dt>
      <dd className="text-text mt-1 truncate text-[16px] leading-5 font-black">{value}</dd>
    </Card>
  );
}
