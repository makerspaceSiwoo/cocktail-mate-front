"use client";

import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import type * as THREE from "three";

import { SPHERE_RADIUS } from "./constants";
import { sphereCameraDistance } from "./scene-camera";

/**
 * `--color-bg` 토큰을 실제 rgb 로 해석한다. body 는 bg-white 라서 직접 못 읽고,
 * var(--color-bg) 를 적용한 임시 요소의 computed 색을 읽어 테마(라이트/다크)를
 * 자동으로 따라간다. → 다른 페이지들(bg-bg)과 동일한 배경색.
 */
function resolveBgColor(): string {
  if (typeof document === "undefined") return "#f3efe7";
  const probe = document.createElement("div");
  probe.style.backgroundColor = "var(--color-bg)";
  probe.style.display = "none";
  document.body.appendChild(probe);
  const color = getComputedStyle(probe).backgroundColor;
  probe.remove();
  return color || "#f3efe7";
}

/**
 * 씬 배경색 + Fog 설정.
 *
 * - 배경: 축/그리드 없이 앱 배경(`--color-bg`)과 동일한 단색.
 * - Fog: 카메라에서 가까운 앞면 점은 선명하게, 먼 뒷면 점은 배경색으로
 *   흐려지게 해 앞/뒤를 구분한다(앞면 클릭 유도). near/far 는 카메라 fit 과
 *   동일한 거리(sphereCameraDistance)를 기준으로 계산해 정합을 맞춘다.
 */
export function SceneEnvironment() {
  const size = useThree((s) => s.size);
  const camera = useThree((s) => s.camera);

  const bg = useMemo(() => resolveBgColor(), []);

  const fov = (camera as THREE.PerspectiveCamera).fov;
  const dist = sphereCameraDistance(fov, size.width / size.height);
  const near = Math.max(0.1, dist - SPHERE_RADIUS * 0.35);
  const far = dist + SPHERE_RADIUS;

  return (
    <>
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, near, far]} />
    </>
  );
}
