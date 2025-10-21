// features/typing/hooks/useTypingStats.ts
"use client";

import { useEffect, useRef, useState } from "react";
import { useTypingStore } from "../stores/useTypingStore";

type UseTypingStatsOptions = {
  active: boolean;
  intervalMs?: number; // 갱신 주기 (기본 500ms)
};

/**
 * ✅ useTypingStats
 * - 전체 입력(정답/오타 포함) 기준 CPM 계산
 * - 정확도(Accuracy) 및 오타 수(Error Count) 계산
 */
export function useTypingStats({
  active,
  intervalMs = 500,
}: UseTypingStatsOptions) {
  const userTypedMap = useTypingStore((s) => s.userTypedMap);

  const [cpm, setCpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errorCount, setErrorCount] = useState(0);

  // 시작 시각 및 직전 상태
  const startTsRef = useRef<number | null>(null);
  const lastTickTsRef = useRef<number | null>(null);
  const lastCountRef = useRef<number>(0);

  /** ✅ 전체 입력 상태 집계 */
  const { totalTypedCount, totalCorrectCount, totalErrorCount } = Object.values(
    userTypedMap
  ).reduce(
    (acc, arr) => {
      if (!Array.isArray(arr)) return acc;
      for (const ch of arr) {
        if (ch.status === "pending") continue;
        acc.totalTypedCount++;
        if (ch.status === "correct") acc.totalCorrectCount++;
        if (ch.status === "incorrect") acc.totalErrorCount++;
      }
      return acc;
    },
    { totalTypedCount: 0, totalCorrectCount: 0, totalErrorCount: 0 }
  );

  /** ✅ 최초 입력 시점 기록 */
  useEffect(() => {
    if (totalTypedCount > 0 && !startTsRef.current) {
      const now = performance.now();
      startTsRef.current = now;
      lastTickTsRef.current = now;
      lastCountRef.current = 0;
    }
  }, [totalTypedCount]);

  /** ✅ 주기적 통계 업데이트 */
  useEffect(() => {
    if (!active || !startTsRef.current) return;

    const timer = setInterval(() => {
      const now = performance.now();
      const startTs = startTsRef.current!;
      const lastTs = lastTickTsRef.current ?? now;

      const elapsedTotalSec = (now - startTs) / 1000;
      const elapsedWindowSec = Math.max((now - lastTs) / 1000, 0.0001);

      const prevCount = lastCountRef.current;
      const deltaCount = Math.max(totalTypedCount - prevCount, 0);

      // ⏱ CPM
      const rawCpm =
        elapsedTotalSec > 0 ? (totalTypedCount / elapsedTotalSec) * 60 : 0;
      const displayCpm = Math.round(rawCpm);
      setCpm(displayCpm);

      // 🎯 정확도 (%)
      const acc =
        totalTypedCount > 0 ? (totalCorrectCount / totalTypedCount) * 100 : 100;
      setAccuracy(Math.round(acc * 10) / 10); // 소수점 1자리

      // ❌ 오타 수
      setErrorCount(totalErrorCount);

      // 기준 갱신
      lastTickTsRef.current = now;
      lastCountRef.current = totalTypedCount;
    }, intervalMs);

    return () => clearInterval(timer);
  }, [active, totalTypedCount, totalCorrectCount, totalErrorCount, intervalMs]);

  return { cpm, accuracy, errorCount };
}
