import { Verse } from "@/types/models/bible";
import { useEffect, useRef, useState } from "react";
import { shallow } from "zustand/shallow";
import { useVerseSelectStore } from "../stores/useVerseSelectStore";

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
  const { nextChapter, prevChapter, currentChapter, chapterEnd } =
    useVerseSelectStore(
      (state) => ({
        nextChapter: state.nextChapter,
        prevChapter: state.prevChapter,
        currentChapter: state.currentChapter,
        chapterEnd: state.chapterEnd,
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
    console.log("📖 verses 변경 감지:", verses.length, "개");

    if (currentVerseIndex >= verses.length) {
      console.log("🔄 구절 길이 변경 → 인덱스 초기화 (0)");
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
  const goNext = async () => {
    const nextIndex = currentVerseIndex + 1;
    console.log("➡️ goNext 호출:", {
      currentVerseIndex,
      nextIndex,
      versesLen: verses.length,
    });

    // 현재 페이지 마지막 절일 때
    if (nextIndex >= verses.length) {
      console.log("📄 현재 페이지 마지막 절 도달");

      if (hasNextPage && loadNextPage) {
        console.log("🌐 다음 페이지 요청 실행");
        await loadNextPage();
        console.log("✅ 다음 페이지 로드 완료, 인덱스 0으로 초기화");
        setCurrentIndex(0);
        return;
      }

      const isLastChapter = currentChapter >= chapterEnd;

      if (!isLastChapter) {
        console.log("📚 다음 장으로 이동 (nextChapter 호출)");
        nextChapter();
        // 다음 챕터로 넘어갈 땐 새 데이터의 첫 절부터 시작
        setCurrentIndex(0);
      } else {
        console.log("🏁 모든 장/페이지 완료");
        onComplete?.();
      }
      return;
    }

    console.log("➡️ 다음 절로 이동:", nextIndex);
    setCurrentIndex(nextIndex);
  };

  // ------------------------------------------------------------------
  // ✅ 이전 절로 이동
  // ------------------------------------------------------------------
  const goPrev = async () => {
    const prevIndex = currentVerseIndex - 1;
    console.log("⬅️ goPrev 호출:", {
      currentVerseIndex,
      prevIndex,
      versesLen: verses.length,
    });

    // 현재 페이지 첫 절일 때
    if (prevIndex < 0) {
      console.log("📄 현재 페이지 첫 절 도달");

      if (hasPrevPage && loadPrevPage) {
        console.log("🌐 이전 페이지 요청 실행");
        await loadPrevPage();
        console.log("✅ 이전 페이지 로드 완료, 마지막 절로 이동");
        setCurrentIndex(verses.length - 1);
      } else {
        console.log("📚 이전 장으로 이동 (prevChapter 호출)");
        prevChapter();
      }
      return;
    }

    console.log("⬅️ 이전 절로 이동:", prevIndex);
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
    console.log("🎯 activate:", { requested: index, applied: clamped });
    setCurrentIndex(clamped);
  };

  // ------------------------------------------------------------------
  // ✅ 렌더 로그 (선택)
  // ------------------------------------------------------------------
  useEffect(() => {
    console.log("🧭 현재 절 인덱스:", currentVerseIndex);
  }, [currentVerseIndex]);

  // (전환 대기 로직 없음 - 원상 복구)

  return { currentVerseIndex, goNext, goPrev, activate };
}
