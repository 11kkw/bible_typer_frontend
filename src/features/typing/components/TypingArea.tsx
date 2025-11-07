"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";

import { Verse } from "@/types/models/bible";

import { useTypingSession } from "../hooks/useTypingSession";
import { useTypingStats } from "../hooks/useTypingStats";
import { useVerseLoader } from "../hooks/useVerseLoader";
import { useTypingStore } from "../stores/useTypingStore";
import { useVerseSelectStore } from "../stores/useVerseSelectStore";
import { SessionCompleteModal } from "./SessionCompleteModal";
import { TypingVerse } from "./TypingVerse";

export function TypingArea({ initialVerses }: { initialVerses: Verse[] }) {
  const router = useRouter();
  const [resetKey, setResetKey] = useState(0);
  const [isCompleteModalOpen, setCompleteModalOpen] = useState(false);
  const {
    verses,
    isLoading,
    hasNextPage,
    hasPrevPage,
    loadNextPage,
    loadPrevPage,
  } = useVerseLoader(initialVerses);

  const handleSessionComplete = useCallback(() => {
    setCompleteModalOpen(true);
  }, []);

  const { currentVerseIndex, goNext, goPrev, activate } = useTypingSession(
    verses,
    {
      hasNextPage,
      hasPrevPage,
      loadNextPage,
      loadPrevPage,
      onComplete: handleSessionComplete,
    }
  );
  const resetAllTyping = useTypingStore((state) => state.resetAll);
  const { cpm, accuracy, elapsedTime, progress, totalTypedCount } =
    useTypingStats();

  const { setBookStats } = useVerseSelectStore(
    (state) => ({
      setBookStats: state.setBookStats,
    }),
    shallow
  );

  const {
    selectedVersionName,
    selectedBookTitle,
    chapterStart,
    chapterEnd,
  } = useVerseSelectStore(
    (state) => ({
      selectedVersionName: state.selectedVersionName,
      selectedBookTitle: state.selectedBookTitle,
      chapterStart: state.chapterStart,
      chapterEnd: state.chapterEnd,
    }),
    shallow
  );

  const selectionLabel = useMemo(() => {
    if (!selectedBookTitle) return "";
    const versionPrefix = selectedVersionName ? `${selectedVersionName} · ` : "";
    const rangeLabel =
      chapterStart === chapterEnd
        ? `${chapterStart}장`
        : `${chapterStart}~${chapterEnd}장`;
    return `${versionPrefix}${selectedBookTitle} ${rangeLabel}`;
  }, [selectedVersionName, selectedBookTitle, chapterStart, chapterEnd]);

  useEffect(() => {
    if (progress >= 100 && totalTypedCount > 0) {
      setCompleteModalOpen(true);
    }
  }, [progress, totalTypedCount]);

  const modalTitle =
    selectionLabel ||
    verses[0]?.book_title?.trim() ||
    "타자 세션 완료";
  const modalDescription =
    selectionLabel ||
    (verses[0]?.book_title
      ? `${verses[0]?.book_title?.trim()} ${verses[0]?.chapter_number ?? verses[0]?.chapter ?? ""}장`
      : "랜덤 구절");

  useEffect(() => {
    if (!verses?.length) {
      setBookStats({ totalVerseCount: 0, totalCharacterCount: 0 });
      return;
    }

    const chapterCharacterCount = verses.reduce((sum, verse) => {
      const textLength = verse.text?.length ?? 0;
      return sum + textLength;
    }, 0);

    setBookStats({
      totalVerseCount: verses.length,
      totalCharacterCount: chapterCharacterCount,
    });
  }, [verses, setBookStats]);

  const wpm = useMemo(() => Math.max(0, Math.round((cpm || 0) / 5)), [cpm]);

  const handleRetry = () => {
    resetAllTyping();
    setCompleteModalOpen(false);
    activate(0);
    setResetKey((prev) => prev + 1);
  };

  const handleNewVerse = () => {
    resetAllTyping();
    setCompleteModalOpen(false);
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-gray-400 text-lg">구절을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl w-full text-left py-16 md:py-24 relative">
        {verses.map((verse, index) => (
          <TypingVerse
            key={`${verse.id}-${resetKey}`}
            verse={verse}
            className="mb-8 md:mb-12"
            onNext={goNext}
            onPrev={goPrev}
            isActive={index === currentVerseIndex}
            onActivate={() => activate(index)}
          />
        ))}
      </div>

      <SessionCompleteModal
        open={isCompleteModalOpen}
        title={`${modalTitle}`}
        description={`${modalDescription} 구절을 모두 입력했어요.`}
        stats={{
          wpm,
          accuracy,
          time: elapsedTime,
        }}
        onClose={() => setCompleteModalOpen(false)}
        onRetry={handleRetry}
        onNewVerse={handleNewVerse}
      />
    </>
  );
}
