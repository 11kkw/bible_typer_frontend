"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useTypingStore } from "../stores/useTypingStore";

/**
 * 전역 라우트 감시 컴포넌트
 * - 홈("/")을 벗어나는 순간 타자 진행 상태를 초기화한다.
 */
export function TypingProgressResetter() {
  const pathname = usePathname();
  const resetTyping = useTypingStore((state) => state.resetAll);
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    const prev = previousPathRef.current;
    previousPathRef.current = pathname;

    const leftHome = prev === "/" && pathname !== "/";
    const isOutsideHome = pathname !== "/";

    if (leftHome || (prev === null && isOutsideHome)) {
      resetTyping();
    }
  }, [pathname, resetTyping]);

  return null;
}
