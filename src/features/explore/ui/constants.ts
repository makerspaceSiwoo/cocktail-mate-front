/** 3D 씬 공유 상수. point-cloud / halo / fog / 카메라 fit 이 같은 값을 참조한다. */

/** 구 반지름. 단위 구 임베딩 좌표에 곱해 실제 배치 반지름을 만든다. */
export const SPHERE_RADIUS = 10;

/** 개별 포인트(구) 지오메트리 반지름. */
export const POINT_RADIUS = 0.225;

/** 선택된 포인트를 강조하기 위한 스케일 배수. */
export const SELECTED_SCALE = 1.8;

/**
 * 구 지름이 뷰(짧은 변) 대비 차지하는 비율. (1 - 값) 만큼 좌우 여백이 생긴다.
 * SceneCamera 가 이 값에 맞춰 카메라 거리를 계산한다.
 */
export const SPHERE_FILL = 0.86;
