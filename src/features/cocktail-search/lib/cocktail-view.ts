import { type CocktailSummary } from "@/entities/cocktail";

/** 목록/검색 행에서 쓰는 화면용 칵테일 모델. */
export type CocktailBase = "데킬라" | "럼" | "위스키" | "진" | "보드카";

export type CocktailView = {
  id: string;
  name: string;
  base: CocktailBase;
  description: string;
  abv: number | null;
  liked: boolean;
  imageUrl: string;
};

export const BASE_BADGE_CLASS: Record<CocktailBase, string> = {
  데킬라: "bg-banner-bg",
  럼: "bg-chip-bg",
  위스키: "bg-cream-200",
  진: "bg-profile-bg",
  보드카: "bg-border-soft",
};

const BASE_LABELS: Record<string, CocktailBase> = {
  tequila: "데킬라",
  rum: "럼",
  whiskey: "위스키",
  whisky: "위스키",
  gin: "진",
  vodka: "보드카",
  데킬라: "데킬라",
  럼: "럼",
  위스키: "위스키",
  진: "진",
  보드카: "보드카",
};

function normalizeBase(baseTag: string | null): CocktailBase | null {
  if (!baseTag) return null;

  const normalizedTag = baseTag.trim().toLowerCase();
  const compactTag = normalizedTag.replace(/[\s_-]/g, "");

  return BASE_LABELS[normalizedTag] ?? BASE_LABELS[compactTag] ?? null;
}

function normalizeImageUrl(imageUrl: string | null): string {
  if (!imageUrl) return "";

  const match = imageUrl.match(
    /^https:\/\/fastly\.picsum\.photos\/id\/([^/]+)\/([^/]+)\/([^/.]+)\.jpg$/,
  );

  if (!match) return imageUrl;

  const [, id, width, height] = match;
  return `https://picsum.photos/id/${id}/${width}/${height}`;
}

/** 검색/목록 API 요약 → 화면용 모델. */
export function toCocktailView(summary: CocktailSummary): CocktailView {
  const base = normalizeBase(summary.baseTag) ?? "진";

  return {
    id: String(summary.id),
    name: summary.name,
    base,
    description: summary.description ?? "설명이 준비 중입니다.",
    abv: summary.abv === null ? null : Math.round(summary.abv),
    liked: summary.isLiked,
    imageUrl: normalizeImageUrl(summary.imageUrl),
  };
}
