"use client";

import { useCallback, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";

import { type ScenePoint } from "../model";
import { PointCloud } from "./point-cloud";
import { SceneCamera } from "./scene-camera";
import { SceneEnvironment } from "./scene-environment";
import { SelectionHalo } from "./selection-halo";

interface ExploreSceneProps {
  points: ScenePoint[];
}

/**
 * 3D 구형 포인트 클라우드 씬.
 *
 * - 선택 상태는 이 컴포넌트의 단일 `selectedId` state 로 관리한다.
 * - 포인트 클릭 시: id 를 콘솔 출력 + 선택 토글(같은 포인트 재클릭 → 해제).
 *   카메라/구는 회전·이동하지 않고 현재 시점을 그대로 유지한다.
 * - 카메라 거리/줌 한계는 SceneCamera 가 구 전체가 보이도록 맞춘다.
 * - OrbitControls: 회전 + 줌만 허용(enablePan=false).
 */
export function ExploreScene({ points }: ExploreSceneProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedPoint = useMemo(
    () => points.find((p) => p.id === selectedId) ?? null,
    [points, selectedId],
  );

  const handleSelect = useCallback((point: ScenePoint) => {
    // TODO: 추후 상세 패널/사이드바 표시 로직으로 교체
    console.log(point.id);
    setSelectedId((prev) => (prev === point.id ? null : point.id));
  }, []);

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 10], fov: 45, near: 0.1, far: 100 }}
    >
      <SceneEnvironment />
      <PointCloud
        points={points}
        selectedId={selectedId}
        onSelect={handleSelect}
      />
      <SelectionHalo selectedPoint={selectedPoint} />
      <SceneCamera />
    </Canvas>
  );
}
