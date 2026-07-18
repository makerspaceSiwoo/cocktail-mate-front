"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";

import { type ScenePoint } from "../model";
import { PointCloud } from "./point-cloud";
import { SceneCamera } from "./scene-camera";
import { SceneEnvironment } from "./scene-environment";
import { SelectionHalo } from "./selection-halo";

interface ExploreSceneProps {
  points: ScenePoint[];
  selectedId: number | null;
  onSelect: (point: ScenePoint) => void;
}

/**
 * 3D 구형 포인트 클라우드 씬.
 *
 * - 선택 상태(selectedId)는 상위(ExploreView)에서 관리한다. 포인트 클릭 시
 *   상위로 전달돼 halo 강조 + 하단 상세 시트를 연다.
 * - 클릭해도 카메라/구는 회전·이동하지 않고 현재 시점을 그대로 유지한다.
 * - 카메라 거리/줌 한계는 SceneCamera 가 구 전체가 보이도록 맞춘다.
 */
export function ExploreScene({ points, selectedId, onSelect }: ExploreSceneProps) {
  const selectedPoint = useMemo(
    () => points.find((p) => p.id === selectedId) ?? null,
    [points, selectedId],
  );

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 10], fov: 45, near: 0.1, far: 100 }}
    >
      <SceneEnvironment />
      <PointCloud points={points} selectedId={selectedId} onSelect={onSelect} />
      <SelectionHalo selectedPoint={selectedPoint} />
      <SceneCamera />
    </Canvas>
  );
}
