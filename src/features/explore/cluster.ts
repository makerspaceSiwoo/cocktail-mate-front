/**
 * 3D 임베딩 좌표를 공간적으로 클러스터링해 포인트 색을 결정한다.
 *
 * baseTag 별로 색을 주면 서로 다른 색이 구 전체에 흩뿌려져 어수선하다.
 * 대신 위치가 가까운 점끼리 묶어 같은 색을 주면 구 위에 색 영역이 생겨
 * 훨씬 정돈돼 보인다. 결과가 SSR/재렌더에서 동일해야 하므로 초기화까지
 * 결정적(deterministic)인 k-means 를 쓴다.
 */

type Vec3 = readonly [number, number, number];

function dist2(a: Vec3, b: Vec3): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return dx * dx + dy * dy + dz * dz;
}

/**
 * k-means. farthest-first 로 초기 중심을 결정적으로 고른 뒤 Lloyd 반복.
 * @returns 각 점의 클러스터 인덱스 배열
 */
export function kMeansClusters(
  positions: readonly Vec3[],
  k: number,
  iterations = 24,
): number[] {
  const n = positions.length;
  if (n === 0) return [];
  const kk = Math.min(k, n);

  // farthest-first 초기화: 0번 점에서 시작, 기존 중심들에서 가장 먼 점을 순차 선택
  const centroidIdx = [0];
  const minDist = new Array<number>(n).fill(Infinity);
  for (let c = 1; c < kk; c++) {
    const last = positions[centroidIdx[c - 1]];
    let best = 0;
    let bestD = -1;
    for (let i = 0; i < n; i++) {
      const d = dist2(positions[i], last);
      if (d < minDist[i]) minDist[i] = d;
      if (minDist[i] > bestD) {
        bestD = minDist[i];
        best = i;
      }
    }
    centroidIdx.push(best);
  }
  const centroids: number[][] = centroidIdx.map((i) => [...positions[i]]);

  const assign = new Array<number>(n).fill(0);
  for (let iter = 0; iter < iterations; iter++) {
    let changed = false;

    // 할당 단계
    for (let i = 0; i < n; i++) {
      let best = 0;
      let bestD = Infinity;
      for (let c = 0; c < kk; c++) {
        const d = dist2(positions[i], centroids[c] as unknown as Vec3);
        if (d < bestD) {
          bestD = d;
          best = c;
        }
      }
      if (assign[i] !== best) {
        assign[i] = best;
        changed = true;
      }
    }

    // 갱신 단계 (중심 = 소속 점 평균)
    const sums = Array.from({ length: kk }, () => [0, 0, 0]);
    const counts = new Array<number>(kk).fill(0);
    for (let i = 0; i < n; i++) {
      const c = assign[i];
      sums[c][0] += positions[i][0];
      sums[c][1] += positions[i][1];
      sums[c][2] += positions[i][2];
      counts[c]++;
    }
    for (let c = 0; c < kk; c++) {
      if (counts[c] === 0) continue; // 빈 클러스터는 이전 중심 유지
      centroids[c] = [
        sums[c][0] / counts[c],
        sums[c][1] / counts[c],
        sums[c][2] / counts[c],
      ];
    }

    if (!changed) break;
  }

  return assign;
}

function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100;
  const ln = l / 100;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = ln - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(color * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * 클러스터별 색 팔레트. 색상(hue)만 균등 분포시키고 채도/명도는 고정해
 * 톤을 통일한다 → 밝은 크림 배경에서 정돈돼 보인다.
 */
export function clusterPalette(k: number): string[] {
  const palette: string[] = [];
  for (let i = 0; i < k; i++) {
    const hue = Math.round((i / k) * 360);
    palette.push(hslToHex(hue, 55, 55));
  }
  return palette;
}
