import { normalizeBaseTag, type BaseTag, type CocktailSummary } from "@/entities/cocktail";

/** 목록/검색 행에서 쓰는 화면용 칵테일 모델. */
export type CocktailView = {
  id: string;
  name: string;
  base: BaseTag;
  description: string;
  abv: number | null;
  liked: boolean;
  imageUrl: string;
};

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
  return {
    id: String(summary.id),
    name: summary.name,
    base: normalizeBaseTag(summary.baseTag ?? ""),
    description: summary.description ?? "설명이 준비 중입니다.",
    abv: summary.abv === null ? null : Math.round(summary.abv),
    liked: summary.isLiked,
    imageUrl: normalizeImageUrl(summary.imageUrl),
  };
}
