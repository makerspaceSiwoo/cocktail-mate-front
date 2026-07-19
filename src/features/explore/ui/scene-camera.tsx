"use client";

import { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type * as THREE from "three";

import { SPHERE_FILL, SPHERE_RADIUS } from "./constants";

/**
 * 구 전체가 뷰(짧은 변)의 SPHERE_FILL 만큼 차지하도록 하는 카메라 거리.
 * 구 실루엣(반각 β)이 화면 반폭의 SPHERE_FILL 을 차지: sin(β)=R/dist.
 * (fog near/far 도 같은 거리를 기준으로 삼아 카메라 fit 과 정합을 맞춘다)
 */
export function sphereCameraDistance(fovDeg: number, aspect: number): number {
  const vHalf = (fovDeg * Math.PI) / 360; // 세로 반각(rad)
  const hHalf = Math.atan(Math.tan(vHalf) * aspect); // 가로 반각(rad)
  const limitHalf = Math.min(hHalf, vHalf); // 짧은 변 기준 → 구 전체 노출
  const beta = Math.atan(SPHERE_FILL * Math.tan(limitHalf));
  return SPHERE_RADIUS / Math.sin(beta);
}

/**
 * 카메라 배치 + OrbitControls.
 *
 * - 구 전체가 한 눈에 보이도록 카메라 거리를 계산해 배치한다(좌우 여백 확보).
 *   뷰포트 크기가 바뀌면 다시 맞춘다.
 * - OrbitControls: 회전 + 줌만 허용(enablePan=false). 줌 한계는 fit 거리 기준.
 */
export function SceneCamera() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  const dist = sphereCameraDistance(
    (camera as THREE.PerspectiveCamera).fov,
    size.width / size.height,
  );

  useLayoutEffect(() => {
    // 위치만 이동(회전은 OrbitControls 가 관리). near/far 는 Canvas 기본값(0.1/100)
    // 으로 충분 — 카메라 거리 대비 구가 작아 클리핑/z-fighting 이 없다.
    camera.position.set(0, 0, dist);
  }, [camera, dist]);

  return (
    <OrbitControls
      makeDefault
      enablePan={false}
      enableDamping
      // 기본(fit) 거리를 최대 거리로 둬 기본 사이즈보다 더 축소(줌 아웃) 못 하게 한다.
      // 줌 인만 허용.
      minDistance={dist * 0.5}
      maxDistance={dist}
      // 회전 속도, zoom 속도 조절
      rotateSpeed={0.4}
      zoomSpeed={0.6}
    />
  );
}
