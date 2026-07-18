/**
 * 탐색(explore) 도메인 모델.
 *
 * 백엔드 `/explore` 는 칵테일별 3D 맛 임베딩(단위 구 표면 위 좌표)을 준다.
 * 이를 3D 씬에서 쓰기 좋은 `ScenePoint` 형태로 변환하면서, 위치 기반으로
 * 클러스터링해 색을 정한다.
 */

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
  /**
   * 포인트 색상. 위치 기반 클러스터로 결정한다(가까운 점끼리 같은 색).
   * halo 는 이 값을 그대로 참조하므로 색 로직이 바뀌어도 자동으로 따라온다.
   */
  color: string;
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
      color: palette[cluster] ?? palette[0],
    };
  });
}
