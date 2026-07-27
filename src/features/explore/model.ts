import { BASE_TAG_MAP, BASE_TAGS, baseTagColor, normalizeBaseTag } from "@/entities/cocktail";
import type { SoloLegendItem } from "@/shared/ui/solo-legend";

export interface ExploreCocktail {
  id: number;
  name: string;
  abv: number | null;
  baseTag: string | null;
  embedding3d: [number, number, number];
}

export interface ScenePoint {
  id: number;
  name: string;
  abv: number;
  baseTag: string;
  position: [number, number, number];
}

export type ColorMode = "abv" | "base";
export const INACTIVE_POINT_COLOR = "#e6e2dc";
const EXPLORE_OTHER_BASE_COLOR = "#8f949b";

export interface AbvBucket {
  id: string;
  label: string;
  color: string;
}

export const ABV_BUCKETS: AbvBucket[] = [
  { id: "non-alcohol", label: "무알콜", color: "#57bd74" },
  { id: "0-10", label: "0~10%", color: "#bfd35d" },
  { id: "10-20", label: "10~20%", color: "#e08a4b" },
  { id: "20-30", label: "20~30%", color: "#d96c4c" },
  { id: "30+", label: "30% 이상", color: "#c94f45" },
];

function abvBucketIndex(abv: number): number {
  if (abv <= 0) return 0;
  if (abv <= 10) return 1;
  if (abv <= 20) return 2;
  if (abv <= 30) return 3;
  return 4;
}

export function abvColor(abv: number): string {
  return ABV_BUCKETS[abvBucketIndex(abv)].color;
}

export function abvBucketId(abv: number): string {
  return ABV_BUCKETS[abvBucketIndex(abv)].id;
}

export function pointColorForMode(point: ScenePoint, mode: ColorMode): string {
  if (mode === "abv") return abvColor(point.abv);
  if (normalizeBaseTag(point.baseTag) === "other") return EXPLORE_OTHER_BASE_COLOR;
  return baseTagColor(point.baseTag);
}

export function pointIsActiveForLegend(
  point: ScenePoint,
  mode: ColorMode,
  selectedLegendId: string | null,
): boolean {
  if (!selectedLegendId) return true;
  return pointLegendIdForMode(point, mode) === selectedLegendId;
}

export function pointDisplayColorForMode(
  point: ScenePoint,
  mode: ColorMode,
  selectedLegendId: string | null,
): string {
  if (!pointIsActiveForLegend(point, mode, selectedLegendId)) {
    return INACTIVE_POINT_COLOR;
  }
  return pointColorForMode(point, mode);
}

export function legendItemsForMode(mode: ColorMode): SoloLegendItem[] {
  if (mode === "abv") {
    return ABV_BUCKETS.map(({ id, label, color }) => ({ id, label, color }));
  }
  return BASE_TAGS.map((tag) => ({
    id: tag,
    label: BASE_TAG_MAP[tag].label,
    color: tag === "other" ? EXPLORE_OTHER_BASE_COLOR : BASE_TAG_MAP[tag].color,
  }));
}

export function pointLegendIdForMode(point: ScenePoint, mode: ColorMode): string {
  if (mode === "abv") return abvBucketId(point.abv);
  return normalizeBaseTag(point.baseTag);
}

export function toScenePoints(cocktails: ExploreCocktail[]): ScenePoint[] {
  return cocktails.map((cocktail) => ({
    id: cocktail.id,
    name: cocktail.name,
    abv: cocktail.abv ?? 0,
    baseTag: cocktail.baseTag ?? "other",
    position: cocktail.embedding3d,
  }));
}
