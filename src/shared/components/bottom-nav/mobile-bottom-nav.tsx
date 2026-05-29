"use client";

import { useEffect, useState } from "react";

import { BottomNav, type BottomNavVariant } from "./bottom-nav";

/**
 * Mobile shell 안에서 사용되는 BottomNav 래퍼.
 * viewport 폭이 430px 를 넘으면 pill variant, 이하면 default.
 *
 * SSR 단계에서는 viewport 를 모르므로 default 로 시작하고, hydration 후
 * matchMedia 결과로 보정한다. 모바일 디바이스는 대부분 viewport ≤ 430 이라
 * 깜빡임은 거의 발생하지 않는다.
 */
export function MobileBottomNav() {
  const [variant, setVariant] = useState<BottomNavVariant>("default");

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 431px)");
    const update = () => setVariant(mq.matches ? "pill" : "default");
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return <BottomNav variant={variant} />;
}
