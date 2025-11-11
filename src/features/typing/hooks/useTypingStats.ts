import { useVerseSelectStore } from "@/features/typing/stores/useVerseSelectStore";
import { useEffect, useMemo, useRef, useState } from "react";
import { shallow } from "zustand/shallow";
import { useTypingStore } from "../stores/useTypingStore";

export function useTypingStats(intervalMs = 500) {
  const userTypedMap = useTypingStore((s) => s.userTypedMap);
  const origDecomposedMap = useTypingStore((s) => s.origDecomposedMap);
  const isSessionFrozen = useTypingStore((s) => s.isSessionFrozen);
  const prevKeyRef = useRef<string>("");
  const [sessionBaseline, setSessionBaseline] = useState(0);
  const wasCompleteRef = useRef(false);

  // ------------------------------------------------------------------
  // 1. 상태 선택 (Zustand + shallow)
  // ------------------------------------------------------------------
  const {
    selectedVersionId,
    selectedBookId,
    chapterStart,
    chapterEnd,
    totalCharacterCount,
    selectionTotalCharacterCount,
  } = useVerseSelectStore(
    (s) => ({
      selectedVersionId: s.selectedVersionId,
      selectedBookId: s.selectedBookId,
      chapterStart: s.chapterStart,
      chapterEnd: s.chapterEnd,
      totalCharacterCount: s.totalCharacterCount,
      selectionTotalCharacterCount: s.selectionTotalCharacterCount,
    }),
    shallow
  );

  // ------------------------------------------------------------------
  // 2. 실시간 통계 계산 (useMemo)
  // ------------------------------------------------------------------
  const { totalTypedCount, totalCorrectCount, totalErrorCount } = useMemo(() => {
    const init = {
      totalTypedCount: 0,
      totalCorrectCount: 0,
      totalErrorCount: 0,
    };

    return Object.values(userTypedMap).reduce((acc, arr) => {
      if (!Array.isArray(arr)) return acc;
      for (const ch of arr) {
        if (ch.status === "pending") continue;
        acc.totalTypedCount++;
        if (ch.status === "correct") acc.totalCorrectCount++;
        if (ch.status === "incorrect") acc.totalErrorCount++;
      }
      return acc;
    }, init);
  }, [userTypedMap]);

  const totalOriginalCount = useMemo(() => {
    return Object.values(origDecomposedMap).reduce((acc, arr) => {
      if (!Array.isArray(arr)) return acc;
      return acc + arr.length;
    }, 0);
  }, [origDecomposedMap]);

  const accuracy = useMemo(() => {
    return totalTypedCount > 0
      ? Math.round((totalCorrectCount / totalTypedCount) * 1000) / 10
      : 100;
  }, [totalTypedCount, totalCorrectCount]);

  const totalTargetCount = useMemo(() => {
    if (selectionTotalCharacterCount > 0) {
      return selectionTotalCharacterCount;
    }
    if (totalCharacterCount > 0) {
      return totalCharacterCount;
    }
    return totalOriginalCount;
  }, [totalOriginalCount, totalCharacterCount, selectionTotalCharacterCount]);

  const netTypedCount = useMemo(() => {
    return Math.max(totalTypedCount - sessionBaseline, 0);
  }, [totalTypedCount, sessionBaseline]);

  const isSessionComplete = useMemo(() => {
    if (totalTargetCount <= 0) return false;
    return totalTypedCount >= totalTargetCount;
  }, [totalTargetCount, totalTypedCount]);

  const progress = useMemo(() => {
    if (totalTargetCount <= 0) return 0;

    const ratio = totalTypedCount / totalTargetCount;
    const rounded = Math.round(ratio * 100);
    return Math.min(100, Math.max(0, rounded));
  }, [totalTypedCount, totalTargetCount]);

  // ------------------------------------------------------------------
  // 3. 타이머 및 상태 관리
  // ------------------------------------------------------------------
  const [cpm, setCpm] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  const rafRef = useRef<number | null>(null);
  const startPerfRef = useRef<number | null>(null);
  const lastCpmUpdateRef = useRef<number>(0);
  // ------------------------------------------------------------------
  // 4. 데이터 변경 시 초기화
  // ------------------------------------------------------------------
  useEffect(() => {
    const currentKey = `${selectedVersionId}-${selectedBookId}-${chapterStart}-${chapterEnd}`;

    if (prevKeyRef.current !== currentKey) {
      prevKeyRef.current = currentKey;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startPerfRef.current = null;
      lastCpmUpdateRef.current = 0;
      setCpm(0);
      setElapsedMs(0);
      setStartTime(null);
    }
  }, [selectedVersionId, selectedBookId, chapterStart, chapterEnd]);

  // ------------------------------------------------------------------
  // 5. 첫 입력 시 타이머 시작
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!startPerfRef.current && totalTypedCount < sessionBaseline) {
      setSessionBaseline(totalTypedCount);
    }
  }, [totalTypedCount, sessionBaseline]);

  useEffect(() => {
    if (
      isSessionComplete &&
      !wasCompleteRef.current &&
      totalTypedCount > 0
    ) {
      setSessionBaseline(totalTypedCount);
    }
    wasCompleteRef.current = isSessionComplete;
  }, [isSessionComplete, totalTypedCount]);

  useEffect(() => {
    if (isSessionFrozen) return;
    if (netTypedCount > 0 && !startPerfRef.current) {
      const now = performance.now();
      startPerfRef.current = now;
      setStartTime(Date.now());
    }
  }, [netTypedCount, isSessionFrozen]);

  // ------------------------------------------------------------------
  // 6. requestAnimationFrame 루프 (elapsed + CPM)
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!startPerfRef.current || isSessionFrozen) return;

    const loop = () => {
      const nowPerf = performance.now();
      const elapsedSec = (nowPerf - startPerfRef.current!) / 1000;
      const elapsedMsNow = Math.floor(elapsedSec * 1000);
      setElapsedMs(elapsedMsNow);

      if (nowPerf - lastCpmUpdateRef.current >= intervalMs) {
        const cpmVal =
          elapsedSec > 0 ? Math.round((netTypedCount / elapsedSec) * 60) : 0;
        setCpm(cpmVal);
        lastCpmUpdateRef.current = nowPerf;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    lastCpmUpdateRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [netTypedCount, intervalMs, isSessionFrozen]);

  useEffect(() => {
    if (!isSessionFrozen) return;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    startPerfRef.current = null;
  }, [isSessionFrozen]);

  useEffect(() => {
    if (!isSessionComplete) return;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    startPerfRef.current = null;
  }, [isSessionComplete]);

  useEffect(() => {
    if (progress < 100 || totalTypedCount === 0) return;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    startPerfRef.current = null;
  }, [progress, totalTypedCount]);

  useEffect(() => {
    if (totalTypedCount !== 0 || totalOriginalCount !== 0) return;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    startPerfRef.current = null;
    lastCpmUpdateRef.current = 0;
    setCpm(0);
    setElapsedMs(0);
    setStartTime(null);
  }, [totalTypedCount, totalOriginalCount]);

  const elapsedTime = formatTime(elapsedMs);
  const elapsedMinutes = elapsedMs > 0 ? elapsedMs / 60000 : 0;
  // ------------------------------------------------------------------
  // 7. 반환값
  // ------------------------------------------------------------------
  return {
    cpm,
    accuracy,
    errorCount: totalErrorCount,
    totalTypedCount,
    elapsedMs,
    elapsedTime,
    startTime,
    progress,
  };
}

// ------------------------------------------------------------------
// ⏱ ms → "MM:SS" 포맷터
// ------------------------------------------------------------------
function formatTime(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const min = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const sec = String(totalSec % 60).padStart(2, "0");
  return `${min}:${sec}`;
}
