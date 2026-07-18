"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { type ScenePoint } from "../model";
import { SPHERE_RADIUS } from "./constants";

/** full-appear 시 halo 의 world-space 크기 */
const HALO_SIZE = 0.34;
/** halo 최대 불투명도 */
const MAX_OPACITY = 0.85;
/** 등장/사라짐 감쇠 계수. 클수록 빠름. (~150–250ms 체감) */
const APPEAR_LAMBDA = 10;

/** 중심 흰색 → 가장자리 투명 radial gradient 텍스처. material.color 로 tint 한다. */
function createRadialTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const half = size / 2;
  const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.35, "rgba(255,255,255,0.55)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

interface SelectionHaloProps {
  /** 현재 선택된 포인트. null 이면 halo 를 페이드아웃한다. */
  selectedPoint: ScenePoint | null;
}

/**
 * 선택된 포인트 주변의 halo(글로우).
 *
 * - 항상 하나만 마운트해두고 선택 상태에 따라 위치/색/불투명도를 갱신한다.
 *   (한 번에 하나의 포인트만 강조)
 * - 색은 선택 포인트의 `color` 를 그대로 tint → 포인트 색이 동적으로 바뀌어도
 *   halo 가 자동으로 따라간다(하드코딩 없음).
 * - 카메라를 향하는 <sprite>(빌보드)라 회전과 무관하게 정면으로 보인다.
 * - 밝은 배경이라 AdditiveBlending(발광) 대신 NormalBlending 으로 부드러운
 *   컬러 글로우를 낸다. depthWrite=false 로 다른 포인트를 가리지 않는다.
 * - 등장 시 짧게 페이드+스케일 인, 다른 포인트로 전환하면 새 위치에서 다시
 *   페이드 인, 선택 해제 시 페이드 아웃.
 */
export function SelectionHalo({ selectedPoint }: SelectionHaloProps) {
  const spriteRef = useRef<THREE.Sprite>(null);
  const texture = useMemo(() => createRadialTexture(), []);

  const appear = useRef(0); // 0..1 등장 진행도
  const renderedId = useRef<number | null>(null);

  useEffect(() => {
    return () => texture.dispose();
  }, [texture]);

  useFrame((_, delta) => {
    const sprite = spriteRef.current;
    if (!sprite) return;
    const material = sprite.material as THREE.SpriteMaterial;

    // 새 포인트가 선택되면 위치/색을 갱신하고 등장을 처음부터 재생
    if (selectedPoint && selectedPoint.id !== renderedId.current) {
      renderedId.current = selectedPoint.id;
      appear.current = 0;
      sprite.position.set(
        selectedPoint.position[0] * SPHERE_RADIUS,
        selectedPoint.position[1] * SPHERE_RADIUS,
        selectedPoint.position[2] * SPHERE_RADIUS,
      );
      material.color.set(selectedPoint.color);
      sprite.visible = true;
    }
    if (!selectedPoint) renderedId.current = null;

    // 프레임레이트 독립 감쇠
    const target = selectedPoint ? 1 : 0;
    appear.current = THREE.MathUtils.damp(
      appear.current,
      target,
      APPEAR_LAMBDA,
      delta,
    );

    const a = appear.current;
    material.opacity = a * MAX_OPACITY;
    const scale = HALO_SIZE * (0.6 + 0.4 * a); // 살짝 커지며 등장
    sprite.scale.setScalar(scale);

    // 완전히 사라지면 렌더 스킵
    if (!selectedPoint && a < 0.02) sprite.visible = false;
  });

  return (
    <sprite ref={spriteRef} visible={false}>
      <spriteMaterial
        map={texture}
        transparent
        opacity={0}
        depthWrite={false}
        fog={false}
      />
    </sprite>
  );
}
