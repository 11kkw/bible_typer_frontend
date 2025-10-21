// features/typing/hooks/useTypingStats.ts
"use client";

import { useEffect, useRef, useState } from "react";
import { useTypingStore } from "../stores/useTypingStore";

type UseTypingStatsOptions = {
  active: boolean;
  intervalMs?: number; // 로그 갱신 주기 (기본 500ms)
  debug?: boolean; // 디버그 로그 출력 여부
};

/**
 * ✅ useTypingStats (디버그 로그 포함)
 * - 전체 입력된 글자(정답/오타 포함) 기준으로 CPM 계산
 * - 디버그 모드에서 내부 계산 데이터를 콘솔로 출력
 */
export function useTypingStats({
  active,
  intervalMs = 500,
  debug = false,
}: UseTypingStatsOptions) {
  const userTypedMap = useTypingStore((s) => s.userTypedMap);
  const [cpm, setCpm] = useState(0);

  // 총 시작시각, 직전 틱 시각/카운트
  const startTsRef = useRef<number | null>(null);
  const lastTickTsRef = useRef<number | null>(null);
  const lastCountRef = useRef<number>(0);

  // ✅ 입력된 모든 글자 수 합산 (완성형 기준)
  const totalTypedCount = Object.values(userTypedMap).reduce((sum, arr) => {
    if (!Array.isArray(arr)) return sum;
    // "pending" 제외 → 실제 입력된 글자 수만 계산
    const typedCount = arr.filter((ch) => ch.status !== "pending").length;
    return sum + typedCount;
  }, 0);

  // ✅ 첫 입력 시각 기록
  useEffect(() => {
    if (totalTypedCount > 0 && !startTsRef.current) {
      startTsRef.current = performance.now();
      lastTickTsRef.current = startTsRef.current;
      lastCountRef.current = 0;

      if (debug) {
        console.log("[CPM/INIT]", {
          totalTypedCount,
          startTs: startTsRef.current,
        });
      }
    }

    // 입력 수 변할 때마다 즉시 디버그 로그
    if (debug && startTsRef.current) {
      const elapsedTotalSec = (performance.now() - startTsRef.current) / 1000;
      console.log("[CPM/INPUT]", {
        totalTypedCount,
        elapsedTotalSec: +elapsedTotalSec.toFixed(3),
      });
    }
  }, [totalTypedCount, debug]);

  // ✅ 주기적으로 CPM 계산 + 디버그 데이터 출력
  useEffect(() => {
    if (!active || !startTsRef.current) return;

    const timer = setInterval(() => {
      const now = performance.now();
      const startTs = startTsRef.current!;
      const lastTs = lastTickTsRef.current ?? now;

      // 총 경과 / 윈도 경과
      const elapsedTotalSec = (now - startTs) / 1000;
      const elapsedWindowSec = Math.max((now - lastTs) / 1000, 0.0001);

      // 델타 카운트와 원시/순간 cpm
      const prevCount = lastCountRef.current;
      const deltaCount = Math.max(totalTypedCount - prevCount, 0);

      const rawCpm =
        elapsedTotalSec > 0 ? (totalTypedCount / elapsedTotalSec) * 60 : 0;
      const instantCpm =
        deltaCount > 0 ? (deltaCount / elapsedWindowSec) * 60 : 0;

      const displayCpm = Math.round(rawCpm);
      setCpm(displayCpm);

      if (debug) {
        const log = {
          totalTypedCount,
          deltaCount,
          elapsedTotalSec: +elapsedTotalSec.toFixed(3),
          elapsedWindowSec: +elapsedWindowSec.toFixed(3),
          rawCpm: +rawCpm.toFixed(2),
          instantCpm: +instantCpm.toFixed(2),
          displayCpm,
        };
        console.log("[CPM/TICK]", log);
      }

      // 다음 tick 기준 업데이트
      lastTickTsRef.current = now;
      lastCountRef.current = totalTypedCount;
    }, intervalMs);

    return () => clearInterval(timer);
  }, [active, totalTypedCount, intervalMs, debug]);

  return { cpm };
}
