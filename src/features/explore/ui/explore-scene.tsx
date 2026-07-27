"use client";

import { type ReactNode, type RefObject, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { pointDisplayColorForMode, type ColorMode, type ScenePoint } from "../model";
import { PointCloud } from "./point-cloud";
import { SceneCamera } from "./scene-camera";
import { SceneEnvironment } from "./scene-environment";
import { SelectionHalo } from "./selection-halo";

export interface SphereControls {
  focusTo: (id: number) => void;
}

interface ExploreSceneProps {
  points: ScenePoint[];
  selectedId: number | null;
  colorMode: ColorMode;
  selectedLegendId: string | null;
  onSelect: (point: ScenePoint) => void;
  controlsRef?: RefObject<SphereControls | null>;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const FOCUS_DURATION_MS = 700;

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
  const camera = useThree((state) => state.camera);
  const anim = useRef<{
    start: THREE.Quaternion;
    target: THREE.Quaternion;
    elapsed: number;
  } | null>(null);

  useEffect(() => {
    if (!controlsRef) return;
    const controls: SphereControls = {
      focusTo: (id) => {
        const group = groupRef.current;
        if (!group) return;
        const point = points.find((item) => item.id === id);
        if (!point) return;

        const worldDir = new THREE.Vector3(...point.position)
          .normalize()
          .applyQuaternion(group.quaternion);
        const camDir = camera.position.clone().normalize();
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
  }, [camera, controlsRef, points]);

  useFrame((_, delta) => {
    const current = anim.current;
    const group = groupRef.current;
    if (!current || !group) return;
    current.elapsed += delta * 1000;
    const t = Math.min(current.elapsed / FOCUS_DURATION_MS, 1);
    group.quaternion.slerpQuaternions(current.start, current.target, easeInOutCubic(t));
    if (t >= 1) anim.current = null;
  });

  return <group ref={groupRef}>{children}</group>;
}

export function ExploreScene({
  points,
  selectedId,
  colorMode,
  selectedLegendId,
  onSelect,
  controlsRef,
}: ExploreSceneProps) {
  const selectedPoint = useMemo(
    () => points.find((point) => point.id === selectedId) ?? null,
    [points, selectedId],
  );

  const haloColor = selectedPoint
    ? pointDisplayColorForMode(selectedPoint, colorMode, selectedLegendId)
    : null;

  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 45, near: 0.1, far: 100 }}>
      <SceneEnvironment />
      <FocusableGroup points={points} controlsRef={controlsRef}>
        <PointCloud
          points={points}
          selectedId={selectedId}
          colorMode={colorMode}
          selectedLegendId={selectedLegendId}
          onSelect={onSelect}
        />
        <SelectionHalo selectedPoint={selectedPoint} color={haloColor} />
      </FocusableGroup>
      <SceneCamera />
    </Canvas>
  );
}
