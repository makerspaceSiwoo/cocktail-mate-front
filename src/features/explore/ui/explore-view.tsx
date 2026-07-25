"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

import { type ColorMode, type ScenePoint } from "../model";
import { CocktailDetailSheet } from "./cocktail-detail-sheet";
import { ColorModeControls } from "./color-mode-controls";
import { type SphereControls } from "./explore-scene";
import { ExploreSearch } from "./explore-search";

/**
 * R3F 씬은 three.js(WebGL) 라 서버에서 렌더할 수 없다. ssr:false 로 클라이언트
 * 에서만 로드하고, three 번들이 /explore 에서만 코드 스플리팅되도록 한다.
 */
const ExploreScene = dynamic(() => import("./explore-scene").then((m) => m.ExploreScene), {
  ssr: false,
  loading: () => <SceneFallback message="3D 씬을 불러오는 중…" />,
});

interface ExploreViewProps {
  points: ScenePoint[];
}

export function ExploreView({ points }: ExploreViewProps) {
  // 선택 상태(halo·시트가 렌더로 반영). 시트/헤일로가 이 값으로 그려지므로 상태다.
  const [selectedId, setSelectedId] = useState<number | null>(null);
  // 포인트 색상 기준(클러스터/도수/베이스). 버튼(canvas 아래)에서 전환한다.
  const [colorMode, setColorMode] = useState<ColorMode>("cluster");
  // 씬이 채워주는 3D 구체 조작 함수(회전 등). 사용처가 직접 호출한다.
  const sphereControls = useRef<SphereControls | null>(null);

  const selectedPoint = useMemo(
    () => points.find((p) => p.id === selectedId) ?? null,
    [points, selectedId],
  );

  // ── 조합 가능한 두 선택 동작 (사용처에서 골라 쓴다) ──────────────
  // 1) 직접 점 클릭: 회전 없이 선택(halo) + 시트만 연다.
  const selectPoint = useCallback((point: ScenePoint) => {
    setSelectedId(point.id);
  }, []);

  // 2) 검색 선택: 선택(halo) + 시트 + 씬의 회전 함수를 호출해 중앙으로.
  const focusPoint = useCallback((point: ScenePoint) => {
    setSelectedId(point.id);
    sphereControls.current?.focusTo(point.id);
  }, []);

  const handleClose = useCallback(() => setSelectedId(null), []);

  return (
    <main className="bg-bg relative flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      {/* 검색창: 캔버스 "밖" 위쪽에 배치해 3D 구체가 검색창에 가려·잘리지 않게 한다.
          z-50 은 상세 시트(dialog)와 동일 — 시트의 dimmed 백드롭(z-40)보다 위라
          검색창은 어두워지지 않는다. */}
      <div className="relative z-50 shrink-0 px-[22px] pt-4">
        <div className="mx-auto w-full max-w-[430px]">
          <ExploreSearch points={points} handleSearch={focusPoint} />
        </div>
      </div>

      <div
        className="max-h-[60vh] min-h-0 flex-1 overflow-hidden"
        role="application"
        aria-label="맛 임베딩 기반 3D 칵테일 포인트 클라우드. 드래그로 회전, 휠·핀치로 확대, 점을 눌러 선택하세요."
      >
        {points.length > 0 ? (
          <ExploreScene
            points={points}
            selectedId={selectedId}
            colorMode={colorMode}
            onSelect={selectPoint}
            controlsRef={sphereControls}
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
