/**
 * 탐색(explore) 도메인 모델.
 *
 * 백엔드 `/explore` 는 칵테일별 3D 맛 임베딩(단위 구 표면 위 좌표)을 준다.
 * 이를 3D 씬에서 쓰기 좋은 `ScenePoint` 형태로 변환한다. 포인트 색상은
 * 3가지 모드(클러스터/도수/베이스)로 볼 수 있다.
 */

import { baseTagColor } from "@/entities/cocktail";

import { clusterPalette, kMeansClusters } from "./cluster";

/** 백엔드 `/explore` 가 반환하는 칵테일 1건. */
export interface ExploreCocktail {
  id: number;
  name: string;
  abv: number;
  baseTag: string;
  /** 단위 구(반지름 1) 표면 위 좌표 [x, y, z]. */
  embedding3d: [number, number, number];
}

/** 3D 씬에서 렌더링하는 포인트. (page → client 로 넘기므로 직렬화 가능해야 함) */
export interface ScenePoint {
  id: number;
  name: string;
  abv: number;
  baseTag: string;
  /** 단위 구 위 좌표. 씬에서 반지름 R 로 스케일링된다. */
  position: [number, number, number];
  /** 이 점이 속한 공간 클러스터 인덱스. */
  cluster: number;
  /** 클러스터 모드에서 쓰는 색(위치 기반, 가까운 점끼리 같은 색). */
  clusterColor: string;
}

/** 포인트 색상 모드. */
export type ColorMode = "cluster" | "abv" | "base";

/** 도수(abv) 구간별 색. 낮음(초록) → 높음(빨강) 순차 색상. */
export interface AbvBucket {
  label: string;
  color: string;
}

export const ABV_BUCKETS: AbvBucket[] = [
  { label: "무알콜", color: "#57bd74" },
  { label: "0~5%", color: "#a9cf5b" },
  { label: "5~10%", color: "#e8c15a" },
  { label: "10~20%", color: "#e08a4b" },
  { label: "20% 이상", color: "#d45b4a" },
];

function abvBucketIndex(abv: number): number {
  if (abv <= 0) return 0;
  if (abv <= 5) return 1;
  if (abv <= 10) return 2;
  if (abv <= 20) return 3;
  return 4;
}

/** 도수 → 색. */
export function abvColor(abv: number): string {
  return ABV_BUCKETS[abvBucketIndex(abv)].color;
}

/** 현재 색상 모드에서 포인트의 색을 반환한다. */
export function pointColorForMode(point: ScenePoint, mode: ColorMode): string {
  switch (mode) {
    case "abv":
      return abvColor(point.abv);
    case "base":
      return baseTagColor(point.baseTag);
    case "cluster":
    default:
      return point.clusterColor;
  }
}

/** 공간 클러스터 개수. */
const CLUSTER_COUNT = 7;

/** API 응답을 씬 포인트 배열로 변환한다. (SSR 단계에서 클러스터링까지 수행) */
export function toScenePoints(cocktails: ExploreCocktail[]): ScenePoint[] {
  const positions = cocktails.map((c) => c.embedding3d);
  const clusters = kMeansClusters(positions, CLUSTER_COUNT);
  const palette = clusterPalette(CLUSTER_COUNT);

  return cocktails.map((c, i) => {
    const cluster = clusters[i] ?? 0;
    return {
      id: c.id,
      name: c.name,
      abv: c.abv,
      baseTag: c.baseTag,
      position: c.embedding3d,
      cluster,
      clusterColor: palette[cluster] ?? palette[0],
    };
  });
}
