"use client";

import { useEffect, useState } from "react";

/** 값이 `delay` ms 동안 안정되면 반영한다. 자동완성 요청 스로틀링에 사용. */
export function useDebouncedValue<T>(value: T, delay = 200): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
