"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

import { type ColorMode, type ScenePoint } from "../model";
import { CocktailDetailSheet } from "./cocktail-detail-sheet";
import { ColorModeControls } from "./color-mode-controls";
import { type SphereControls } from "./explore-scene";
import { ExploreSearch } from "./explore-search";

const ExploreScene = dynamic(
  () => import("./explore-scene").then((module) => module.ExploreScene),
  {
    ssr: false,
    loading: () => <SceneFallback message="3D 씬을 불러오는 중…" />,
  },
);

interface ExploreViewProps {
  points: ScenePoint[];
}

export function ExploreView({ points }: ExploreViewProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [colorMode, setColorMode] = useState<ColorMode>("abv");
  const [soloLegendByMode, setSoloLegendByMode] = useState<Record<ColorMode, string | null>>({
    abv: null,
    base: null,
  });
  const sphereControls = useRef<SphereControls | null>(null);

  const selectedLegendId = soloLegendByMode[colorMode];
  const selectedPoint = useMemo(
    () => points.find((point) => point.id === selectedId) ?? null,
    [points, selectedId],
  );

  const selectPoint = useCallback((point: ScenePoint) => {
    setSelectedId(point.id);
  }, []);

  const focusPoint = useCallback((point: ScenePoint) => {
    setSelectedId(point.id);
    sphereControls.current?.focusTo(point.id);
  }, []);

  const handleClose = useCallback(() => setSelectedId(null), []);
  const handleLegendChange = useCallback(
    (legendId: string | null) => {
      setSoloLegendByMode((prev) => ({ ...prev, [colorMode]: legendId }));
    },
    [colorMode],
  );

  return (
    <main className="bg-bg relative flex min-h-0 w-full flex-1 flex-col overflow-y-auto">
      <div className="relative z-50 shrink-0 p-4">
        <div className="mx-auto w-full max-w-[430px]">
          <ExploreSearch points={points} handleSearch={focusPoint} />
        </div>
      </div>
      {points.length > 0 ? (
        <ColorModeControls
          mode={colorMode}
          onModeChange={setColorMode}
          selectedLegendId={selectedLegendId}
          onLegendChange={handleLegendChange}
        />
      ) : null}

      <div
        className="h-[clamp(320px,48dvh,420px)] shrink-0 overflow-hidden"
        role="application"
        aria-label="맛 임베딩 기반 3D 칵테일 포인트 클라우드. 드래그로 회전, 휠·핀치로 확대, 점을 눌러 선택하세요."
      >
        {points.length > 0 ? (
          <ExploreScene
            points={points}
            selectedId={selectedId}
            colorMode={colorMode}
            selectedLegendId={selectedLegendId}
            onSelect={selectPoint}
            controlsRef={sphereControls}
          />
        ) : (
          <SceneFallback message="탐색 데이터를 불러오지 못했어요." />
        )}
      </div>

      <div className="text-muted justify-center px-4 py-3 text-xs leading-5">
        <p className="text-center">구체를 회전 및 확대하여 자유롭게 탐색해보세요.</p>
        <p className="text-center">가까이 모여있는 칵테일은 맛이 비슷한 칵테일입니다.</p>
      </div>

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
