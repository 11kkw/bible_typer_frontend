import { useVerseSelectStore } from "@/features/typing/stores/useVerseSelectStore";
import { useEffect, useRef, useState } from "react";
import { useTypingStore } from "../stores/useTypingStore";

/**
 * ✅ useTypingStats
 * - CPM, 정확도, 오타수, 경과시간, 진행률(%) 계산
 * - 진행률: 전체 글자 수 대비 입력 글자 수
 */
export function useTypingStats(intervalMs = 500) {
  const userTypedMap = useTypingStore((s) => s.userTypedMap);
  const totalCharacterCount = useVerseSelectStore((s) => s.totalCharacterCount);

  const [cpm, setCpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errorCount, setErrorCount] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  const startPerfRef = useRef<number | null>(null);

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

  useEffect(() => {
    if (totalTypedCount > 0 && !startPerfRef.current) {
      const now = performance.now();
      startPerfRef.current = now;
      setStartTime(Date.now());
      setElapsedMs(0);
    }
  }, [totalTypedCount]);

  useEffect(() => {
    if (totalTypedCount === 0 && startPerfRef.current) {
      startPerfRef.current = null;
      setStartTime(null);
      setElapsedMs(0);
      setCpm(0);
      setAccuracy(100);
      setErrorCount(0);
      setProgress(0);
    }
  }, [totalTypedCount]);

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

  useEffect(() => {
    if (!startTime) return;

    const timer = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  useEffect(() => {
    const accVal =
      totalTypedCount > 0 ? (totalCorrectCount / totalTypedCount) * 100 : 100;
    setAccuracy(Math.round(accVal * 10) / 10);
    setErrorCount(totalErrorCount);
    console.log(totalTypedCount + "totle typed");

    if (totalCharacterCount > 0) {
      let ratio = (totalTypedCount / totalCharacterCount) * 100;
      ratio = Math.round(ratio * 10) / 10;
      if (ratio >= 98) ratio = 100;
      setProgress(ratio);
    } else {
      setProgress(0);
    }
  }, [
    totalTypedCount,
    totalCorrectCount,
    totalErrorCount,
    totalCharacterCount,
  ]);

  const elapsedTime = formatTime(elapsedMs);

  return {
    cpm,
    accuracy,
    errorCount,
    totalTypedCount,
    elapsedMs,
    elapsedTime,
    startTime,
    progress,
  };
}

/** ⏱ ms → "MM:SS" 변환 */
function formatTime(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const min = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const sec = String(totalSec % 60).padStart(2, "0");
  return `${min}:${sec}`;
}
