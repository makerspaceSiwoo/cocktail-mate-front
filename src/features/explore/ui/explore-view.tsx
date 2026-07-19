"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";

import { type ColorMode, type ScenePoint } from "../model";
import { CocktailDetailSheet } from "./cocktail-detail-sheet";
import { ColorModeControls } from "./color-mode-controls";

/**
 * R3F 씬은 three.js(WebGL) 라 서버에서 렌더할 수 없다. ssr:false 로 클라이언트
 * 에서만 로드하고, three 번들이 /explore 에서만 코드 스플리팅되도록 한다.
 */
const ExploreScene = dynamic(
  () => import("./explore-scene").then((m) => m.ExploreScene),
  {
    ssr: false,
    loading: () => <SceneFallback message="3D 씬을 불러오는 중…" />,
  },
);

interface ExploreViewProps {
  points: ScenePoint[];
}

export function ExploreView({ points }: ExploreViewProps) {
  // 선택 상태는 여기서 관리해 씬(halo)과 하단 시트가 함께 참조한다.
  const [selectedId, setSelectedId] = useState<number | null>(null);
  // 포인트 색상 기준(클러스터/도수/베이스). 버튼(canvas 아래)에서 전환한다.
  const [colorMode, setColorMode] = useState<ColorMode>("cluster");

  const selectedPoint = useMemo(
    () => points.find((p) => p.id === selectedId) ?? null,
    [points, selectedId],
  );

  const handleSelect = useCallback((point: ScenePoint) => {
    setSelectedId(point.id);
  }, []);

  const handleClose = useCallback(() => setSelectedId(null), []);

  return (
    <main className="bg-bg relative flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <div
        className="max-h-[70%] min-h-0 flex-1 overflow-hidden"
        role="application"
        aria-label="맛 임베딩 기반 3D 칵테일 포인트 클라우드. 드래그로 회전, 휠·핀치로 확대, 점을 눌러 선택하세요."
      >
        {points.length > 0 ? (
          <ExploreScene
            points={points}
            selectedId={selectedId}
            colorMode={colorMode}
            onSelect={handleSelect}
          />
        ) : (
          <SceneFallback message="탐색 데이터를 불러오지 못했어요." />
        )}
      </div>

      {/* 캔버스 바로 아래: 색상 모드 버튼 + 범례 */}
      {points.length > 0 ? (
        <ColorModeControls mode={colorMode} onModeChange={setColorMode} />
      ) : null}

      <CocktailDetailSheet point={selectedPoint} onClose={handleClose} />
    </main>
  );
}

function SceneFallback({ message }: { message: string }) {
  return (
    <div
      role="status"
      className="text-muted flex h-full w-full items-center justify-center px-6 text-center text-sm"
    >
      {message}
    </div>
  );
}
