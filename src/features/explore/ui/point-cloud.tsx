"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

import { pointColorForMode, type ColorMode, type ScenePoint } from "../model";
import {
  POINT_RADIUS,
  SELECTED_SCALE,
  SPHERE_RADIUS,
} from "./constants";

interface PointCloudProps {
  points: ScenePoint[];
  selectedId: number | null;
  colorMode: ColorMode;
  onSelect: (point: ScenePoint) => void;
}

/**
 * 모든 포인트를 하나의 InstancedMesh 로 렌더링한다.
 *
 * - 수백 개 포인트를 개별 <mesh> 로 그리면 draw call 이 많아 모바일에서
 *   프레임이 떨어진다. InstancedMesh 는 draw call 1 회로 처리한다.
 * - 클릭 픽킹: 이벤트의 `instanceId` 로 어떤 포인트인지 식별한다.
 *   `stopPropagation()` 으로 레이가 가장 먼저 맞은(=카메라에 가장 가까운,
 *   즉 앞면) 포인트만 선택되게 한다.
 * - fog 는 material 기본값(true)으로 적용돼 뒷면 포인트가 배경으로 흐려진다.
 */
export function PointCloud({
  points,
  selectedId,
  colorMode,
  onSelect,
}: PointCloudProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // 재사용 임시 객체 (매 프레임/이펙트마다 새로 만들지 않음)
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  const geometry = useMemo(
    () => new THREE.SphereGeometry(POINT_RADIUS, 12, 12),
    [],
  );
  const material = useMemo(
    () => new THREE.MeshBasicMaterial({ toneMapped: false }),
    [],
  );
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  // 단위 구 좌표 → 반지름 R 로 스케일링한 실제 위치
  const positions = useMemo(
    () =>
      points.map((p) =>
        new THREE.Vector3(...p.position).multiplyScalar(SPHERE_RADIUS),
      ),
    [points],
  );

  // 인스턴스 색상: 포인트 또는 색상 모드가 바뀔 때 갱신
  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    points.forEach((p, i) =>
      mesh.setColorAt(i, color.set(pointColorForMode(p, colorMode))),
    );
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [points, colorMode, color]);

  // 인스턴스 매트릭스: 위치 + 선택된 포인트만 확대
  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    positions.forEach((pos, i) => {
      dummy.position.copy(pos);
      dummy.scale.setScalar(points[i].id === selectedId ? SELECTED_SCALE : 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [positions, points, selectedId, dummy]);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    // 가장 가까운(앞면) 인스턴스만 선택되도록 즉시 전파 중단
    event.stopPropagation();
    if (event.instanceId === undefined) return;
    const point = points[event.instanceId];
    if (point) onSelect(point);
  };

  // 포인트 위에 커서를 올리면 pointer 로 바꿔 클릭 가능함을 알린다.
  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    document.body.style.cursor = "pointer";
  };
  const handlePointerOut = () => {
    document.body.style.cursor = "";
  };
  // 언마운트 시 커서가 pointer 로 남지 않도록 정리
  useEffect(() => {
    return () => {
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, points.length]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    />
  );
}
