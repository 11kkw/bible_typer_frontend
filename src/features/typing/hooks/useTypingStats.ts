"use client";

import { useEffect, useRef, useState } from "react";
import { useTypingStore } from "../stores/useTypingStore";

/**
 * ✅ useTypingStats
 * - CPM, 정확도, 오타수, 시작시간, 경과시간 계산
 * - 정확도 즉시 반영
 * - 모든 입력 삭제 시 자동 초기화
 */
export function useTypingStats(intervalMs = 500) {
  const userTypedMap = useTypingStore((s) => s.userTypedMap);

  const [cpm, setCpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errorCount, setErrorCount] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  const startPerfRef = useRef<number | null>(null);

  // ✅ 전체 입력 상태 집계
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

  /** ✅ 최초 입력 시 시작시간 기록 */
  useEffect(() => {
    if (totalTypedCount > 0 && !startPerfRef.current) {
      const now = performance.now();
      startPerfRef.current = now;
      setStartTime(Date.now());
      setElapsedMs(0);
    }
  }, [totalTypedCount]);

  /** ✅ 모든 입력이 지워지면 통계 리셋 */
  useEffect(() => {
    if (totalTypedCount === 0 && startPerfRef.current) {
      startPerfRef.current = null;
      setStartTime(null);
      setElapsedMs(0);
      setCpm(0);
      setAccuracy(100);
      setErrorCount(0);
    }
  }, [totalTypedCount]);

  /** ✅ CPM 계산 */
  useEffect(() => {
    if (!startPerfRef.current) return;

    const timer = setInterval(() => {
      const now = performance.now();
      const elapsedSec = (now - startPerfRef.current!) / 1000;
      const cpmVal =
        elapsedSec > 0 ? Math.round((totalTypedCount / elapsedSec) * 60) : 0;
      setCpm(cpmVal);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs, totalTypedCount]);

  /** ✅ 경과 시간 갱신 */
  useEffect(() => {
    if (!startTime) return;

    const timer = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  /** ✅ 정확도 & 오타 즉시 반영 */
  useEffect(() => {
    const accVal =
      totalTypedCount > 0 ? (totalCorrectCount / totalTypedCount) * 100 : 100;
    setAccuracy(Math.round(accVal * 10) / 10);
    setErrorCount(totalErrorCount);
  }, [totalTypedCount, totalCorrectCount, totalErrorCount]);

  const elapsedTime = formatTime(elapsedMs);

  return {
    cpm,
    accuracy,
    errorCount,
    totalTypedCount,
    elapsedMs,
    elapsedTime,
    startTime,
  };
}

/** ⏱ ms → "MM:SS" 변환 */
function formatTime(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const min = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const sec = String(totalSec % 60).padStart(2, "0");
  return `${min}:${sec}`;
}
