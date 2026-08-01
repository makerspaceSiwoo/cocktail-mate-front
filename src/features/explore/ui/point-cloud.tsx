"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { type ThreeEvent, useThree } from "@react-three/fiber";
import * as THREE from "three";

import {
  pointDisplayColorForMode,
  pointIsActiveForLegend,
  type ColorMode,
  type ScenePoint,
} from "../model";
import { POINT_RADIUS, SELECTED_SCALE, SPHERE_RADIUS } from "./constants";
import { exploreFogRange } from "./scene-environment";

interface PointCloudProps {
  points: ScenePoint[];
  selectedId: number | null;
  colorMode: ColorMode;
  selectedLegendId: string | null;
  onSelect: (point: ScenePoint) => void;
}

export function PointCloud({
  points,
  selectedId,
  colorMode,
  selectedLegendId,
  onSelect,
}: PointCloudProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const geometry = useMemo(() => new THREE.SphereGeometry(POINT_RADIUS, 12, 12), []);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ toneMapped: false }), []);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  const positions = useMemo(
    () => points.map((point) => new THREE.Vector3(...point.position).multiplyScalar(SPHERE_RADIUS)),
    [points],
  );

  const fogClickCutoff = useMemo(() => {
    const fov = (camera as THREE.PerspectiveCamera).fov;
    const { near, far } = exploreFogRange(fov, size.width / size.height);
    return THREE.MathUtils.lerp(near, far, 0.9);
  }, [camera, size.width, size.height]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const originalRaycast = mesh.raycast.bind(mesh);
    mesh.raycast = (raycaster, intersections) => {
      const next: THREE.Intersection[] = [];
      originalRaycast(raycaster, next);
      intersections.push(
        ...next.filter(
          (intersection) => camera.position.distanceTo(intersection.point) < fogClickCutoff,
        ),
      );
    };
    return () => {
      mesh.raycast = originalRaycast;
    };
  }, [camera, fogClickCutoff]);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    points.forEach((point, index) => {
      mesh.setColorAt(
        index,
        color.set(pointDisplayColorForMode(point, colorMode, selectedLegendId)),
      );
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [color, colorMode, points, selectedLegendId]);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    positions.forEach((position, index) => {
      dummy.position.copy(position);
      dummy.scale.setScalar(points[index].id === selectedId ? SELECTED_SCALE : 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [dummy, points, positions, selectedId]);

  const downPosition = useRef<{ x: number; y: number } | null>(null);
  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    downPosition.current = {
      x: event.nativeEvent.clientX,
      y: event.nativeEvent.clientY,
    };
  };

  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const down = downPosition.current;
    downPosition.current = null;
    if (!down || event.instanceId === undefined) return;
    const moved = Math.hypot(
      event.nativeEvent.clientX - down.x,
      event.nativeEvent.clientY - down.y,
    );
    if (moved > 8) return;
    const point = points[event.instanceId];
    if (point && pointIsActiveForLegend(point, colorMode, selectedLegendId)) onSelect(point);
  };

  useEffect(
    () => () => {
      document.body.style.cursor = "";
    },
    [],
  );

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, points.length]}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerOver={(event) => {
        event.stopPropagation();
        const point = event.instanceId === undefined ? null : points[event.instanceId];
        document.body.style.cursor =
          point && pointIsActiveForLegend(point, colorMode, selectedLegendId) ? "pointer" : "";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
    />
  );
}
