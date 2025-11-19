import { createTypingVerseLog } from "@/features/typing/services/typing.service";
import { useTypingLogStore } from "@/features/typing/stores/useTypingLogStore";
import { useVerseSelectStore } from "@/features/typing/stores/useVerseSelectStore";
import { Verse } from "@/types/models/bible";
import { useEffect, useRef, useState, useCallback } from "react";
import { shallow } from "zustand/shallow";
import { useTypingStore } from "../stores/useTypingStore";

interface UseTypingSessionOptions {
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  loadNextPage?: () => Promise<void> | Promise<any>;
  loadPrevPage?: () => Promise<void> | Promise<any>;
  onComplete?: () => void;
}

export function useTypingSession(
  verses: Verse[],
  options?: UseTypingSessionOptions
) {
  const [currentVerseIndex, setCurrentIndex] = useState(0);
  const { nextChapter, prevChapter, currentChapter, chapterEnd, serverSession } =
    useVerseSelectStore(
      (state) => ({
        nextChapter: state.nextChapter,
        prevChapter: state.prevChapter,
        currentChapter: state.currentChapter,
        chapterEnd: state.chapterEnd,
        serverSession: state.serverSession,
      }),
      shallow
    );
  const firstVerseIdRef = useRef<number | null>(null);

  const {
    hasNextPage = false,
    hasPrevPage = false,
    loadNextPage,
    loadPrevPage,
    onComplete,
  } = options || {};

  // ------------------------------------------------------------------
  // ✅ 구절 배열 변경 시 인덱스 초기화
  // ------------------------------------------------------------------
  useEffect(() => {
    if (currentVerseIndex >= verses.length) {
      setCurrentIndex(0);
    }
  }, [verses, currentVerseIndex]);

  // 구절 세트가 교체되면 항상 첫 절부터 다시 시작
  useEffect(() => {
    const firstId = verses[0]?.id ?? null;
    if (
      firstVerseIdRef.current !== null &&
      firstVerseIdRef.current !== firstId
    ) {
      setCurrentIndex(0);
    }
    firstVerseIdRef.current = firstId;
  }, [verses]);

  // ------------------------------------------------------------------
  // ✅ 다음 절로 이동
  // ------------------------------------------------------------------
  const startVerseLogging = useTypingLogStore((s) => s.startVerseLogging);
  const getVerseEvents = useTypingLogStore((s) => s.getVerseEvents);
  const clearVerseLog = useTypingLogStore((s) => s.clearVerseLog);
  const getBackspaceCount = useTypingLogStore((s) => s.getBackspaceCount);
  const getTimeSpent = useTypingLogStore((s) => s.getTimeSpent);

  const currentVerseId = verses[currentVerseIndex]?.id;
  useEffect(() => {
    if (currentVerseId != null) {
      startVerseLogging(currentVerseId);
    }
  }, [currentVerseId, startVerseLogging]);

  const uploadVerseLog = useCallback(
    async (verse: Verse) => {
      if (!serverSession) return;

      const events = getVerseEvents(verse.id);
      if (!events.length) return;

      const typingState = useTypingStore.getState();
      const typedChars = typingState.userTypedMap[verse.id] ?? [];
      const totalTyped = typedChars.filter(
        (c) => c.status === "correct" || c.status === "incorrect"
      ).length;
      const correctCount = typedChars.filter(
        (c) => c.status === "correct"
      ).length;
      const incorrectCount = typedChars.filter(
        (c) => c.status === "incorrect"
      ).length;
      const accuracy =
        totalTyped > 0 ? (correctCount / totalTyped) * 100 : undefined;
      const timeSpent = getTimeSpent(verse.id);
      const speed =
        totalTyped > 0 && timeSpent > 0 ? (totalTyped / timeSpent) * 60 : undefined;

      try {
        await createTypingVerseLog({
          session: serverSession.id,
          verse: verse.id,
          accuracy:
            accuracy != null ? Math.round(accuracy * 10) / 10 : undefined,
          speed:
            speed != null ? Math.round(speed * 10) / 10 : undefined,
          error_count: incorrectCount,
          backspace_count: getBackspaceCount(verse.id),
          time_spent: timeSpent || undefined,
          events,
        });
      } finally {
        clearVerseLog(verse.id);
      }
    },
    [
      serverSession,
      getVerseEvents,
      getBackspaceCount,
      getTimeSpent,
      clearVerseLog,
    ]
  );

  const goNext = async () => {
    const nextIndex = currentVerseIndex + 1;

    const currentVerse = verses[currentVerseIndex];
    if (currentVerse) {
      void uploadVerseLog(currentVerse);
    }

    // 현재 페이지 마지막 절일 때
    if (nextIndex >= verses.length) {
      if (hasNextPage && loadNextPage) {
        await loadNextPage();
        setCurrentIndex(0);
        return;
      }

      const isLastChapter = currentChapter >= chapterEnd;

      if (!isLastChapter) {
        nextChapter();
        // 다음 챕터로 넘어갈 땐 새 데이터의 첫 절부터 시작
        setCurrentIndex(0);
      } else {
        onComplete?.();
      }
      return;
    }

    setCurrentIndex(nextIndex);
  };

  // ------------------------------------------------------------------
  // ✅ 이전 절로 이동
  // ------------------------------------------------------------------
  const goPrev = async () => {
    const prevIndex = currentVerseIndex - 1;

    // 현재 페이지 첫 절일 때
    if (prevIndex < 0) {
      if (hasPrevPage && loadPrevPage) {
        await loadPrevPage();
        setCurrentIndex(verses.length - 1);
      } else {
        prevChapter();
      }
      return;
    }

    setCurrentIndex(prevIndex);
  };

  // ------------------------------------------------------------------
  // ✅ 특정 절 활성화
  // ------------------------------------------------------------------
  const activate = (index: number) => {
    const clamped = Math.min(
      Math.max(index, 0),
      Math.max(verses.length - 1, 0)
    );
    setCurrentIndex(clamped);
  };

  // (전환 대기 로직 없음 - 원상 복구)

  return { currentVerseIndex, goNext, goPrev, activate };
}
