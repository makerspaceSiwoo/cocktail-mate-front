"use client";

import { type ReactNode, type RefObject, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { pointColorForMode, type ColorMode, type ScenePoint } from "../model";
import { PointCloud } from "./point-cloud";
import { SceneCamera } from "./scene-camera";
import { SceneEnvironment } from "./scene-environment";
import { SelectionHalo } from "./selection-halo";

/**
 * 3D 구체 조작 인터페이스. 씬이 소유하는 함수들을 바깥에 노출한다.
 * (사용처는 이 함수를 조합해서 호출한다 — forwardRef/의존 역전 없이)
 */
export interface SphereControls {
  /** 해당 id 포인트가 화면 중앙에 오도록 구를 회전시킨다. */
  focusTo: (id: number) => void;
}

interface ExploreSceneProps {
  points: ScenePoint[];
  selectedId: number | null;
  colorMode: ColorMode;
  /** 포인트 직접 클릭. 회전 없이 선택만 위로 전달한다. */
  onSelect: (point: ScenePoint) => void;
  /**
   * 씬이 자기 조작 함수(회전 등)를 채워 넣는 ref. 사용처가 `.current.focusTo(id)`
   * 처럼 직접 호출한다. (씬이 함수를 소유하고 바깥은 호출만)
   */
  controlsRef?: RefObject<SphereControls | null>;
}

/** 회전 애니메이션 easing (easeInOutCubic). */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** 구 자동 회전 지속(ms). */
const FOCUS_DURATION_MS = 700;

/**
 * 포인트 클라우드/헤일로를 담는 회전 그룹.
 *
 * - 회전 로직(`focusTo`)을 이 컴포넌트(=3D 구체)가 **소유**하고 `controlsRef` 로
 *   바깥에 노출한다. 바깥에서는 `controlsRef.current?.focusTo(id)` 로 호출만 한다.
 * - `focusTo` 는 해당 포인트가 현재 카메라 정면(화면 중앙)에 오도록 그룹(=구 전체)
 *   을 회전시킨다. 카메라/컨트롤은 건드리지 않아 TrackballControls(사용자 조작)와
 *   충돌하지 않는다.
 * - 직접 클릭 선택은 focusTo 를 호출하지 않으므로 회전이 일어나지 않는다.
 */
function FocusableGroup({
  points,
  controlsRef,
  children,
}: {
  points: ScenePoint[];
  controlsRef?: RefObject<SphereControls | null>;
  children: ReactNode;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const camera = useThree((s) => s.camera);

  const anim = useRef<{
    start: THREE.Quaternion;
    target: THREE.Quaternion;
    elapsed: number;
  } | null>(null);

  // 씬이 소유하는 조작 함수를 controlsRef 에 노출한다.
  useEffect(() => {
    if (!controlsRef) return;
    const controls: SphereControls = {
      focusTo: (id) => {
        const group = groupRef.current;
        if (!group) return;
        const point = points.find((p) => p.id === id);
        if (!point) return;
        // 현재 그룹 회전 하에서 포인트의 월드 방향
        const worldDir = new THREE.Vector3(...point.position)
          .normalize()
          .applyQuaternion(group.quaternion);
        // 카메라 방향(원점 → 카메라). 이 방향으로 맞추면 정면(중앙)에 온다.
        const camDir = camera.position.clone().normalize();
        // worldDir → camDir 로 돌리는 델타를 현재 회전 앞에 곱한다.
        const target = new THREE.Quaternion()
          .setFromUnitVectors(worldDir, camDir)
          .multiply(group.quaternion);
        anim.current = { start: group.quaternion.clone(), target, elapsed: 0 };
      },
    };
    controlsRef.current = controls;
    return () => {
      if (controlsRef.current === controls) controlsRef.current = null;
    };
  }, [controlsRef, points, camera]);

  useFrame((_, delta) => {
    const a = anim.current;
    const group = groupRef.current;
    if (!a || !group) return;
    a.elapsed += delta * 1_000; // delta(초) → ms 누적
    const t = Math.min(a.elapsed / FOCUS_DURATION_MS, 1);
    group.quaternion.slerpQuaternions(a.start, a.target, easeInOutCubic(t));
    if (t >= 1) anim.current = null;
  });

  return <group ref={groupRef}>{children}</group>;
}

/**
 * 3D 구형 포인트 클라우드 씬.
 *
 * - 선택 상태(selectedId)/색상 모드(colorMode)는 상위(ExploreView)에서 관리한다.
 *   포인트 클릭 시 상위로 전달돼 halo 강조 + 하단 상세 시트를 연다.
 * - 직접 클릭(onSelect)은 회전 없이 선택만 한다.
 * - 회전 등 구 조작은 `controlsRef`(SphereControls)로 노출한다. 검색 선택 등에서
 *   `controlsRef.current?.focusTo(id)` 로 호출해 해당 포인트를 중앙으로 회전시킨다.
 * - 카메라 거리/줌 한계는 SceneCamera 가 구 전체가 보이도록 맞춘다.
 */
export function ExploreScene({
  points,
  selectedId,
  colorMode,
  onSelect,
  controlsRef,
}: ExploreSceneProps) {
  const selectedPoint = useMemo(
    () => points.find((p) => p.id === selectedId) ?? null,
    [points, selectedId],
  );

  const haloColor = selectedPoint ? pointColorForMode(selectedPoint, colorMode) : null;

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 10], fov: 45, near: 0.1, far: 100 }}
      className="max-h-[60vh]"
    >
      <SceneEnvironment />
      <FocusableGroup points={points} controlsRef={controlsRef}>
        <PointCloud
          points={points}
          selectedId={selectedId}
          colorMode={colorMode}
          onSelect={onSelect}
        />
        <SelectionHalo selectedPoint={selectedPoint} color={haloColor} />
      </FocusableGroup>
      <SceneCamera />
    </Canvas>
  );
}
