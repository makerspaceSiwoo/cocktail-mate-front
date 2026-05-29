import { getDevice } from "@/shared/lib/device";

import { BottomNav } from "./bottom-nav";
import { MobileBottomNav } from "./mobile-bottom-nav";

/**
 * App 차원의 BottomNav 진입점. 라우트 그룹 layout 은 디바이스를 신경 쓰지
 * 않고 이 컴포넌트만 렌더하면 된다.
 *
 * - PC: 항상 default variant (PcShell 의 max-w-[430px] 컨테이너 안에서는
 *   pill 이 어색하므로).
 * - Mobile: viewport 폭에 따라 default/pill 자동 전환 (MobileBottomNav).
 */
export async function AppBottomNav() {
  const device = await getDevice();
  return device === "pc" ? (
    <BottomNav variant="default" />
  ) : (
    <MobileBottomNav />
  );
}
