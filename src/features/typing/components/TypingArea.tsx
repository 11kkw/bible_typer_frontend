"use client";

import { Verse } from "@/types/models/bible";
import { useTypingSession } from "../hooks/useTypingSession";
import { useTypingStats } from "../hooks/useTypingStats";
import { useVerseLoader } from "../hooks/useVerseLoader";
import { TypingVerse } from "./TypingVerse";

export function TypingArea({ initialVerses }: { initialVerses: Verse[] }) {
  const { verses, isLoading } = useVerseLoader(initialVerses);

  const { currentVerseIndex, goNext, goPrev, activate } =
    useTypingSession(verses);

  const { cpm, accuracy, errorCount } = useTypingStats({
    active: true,
    intervalMs: 300,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-gray-400 text-lg">구절을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl w-full text-left py-16 md:py-24 relative">
      <div className="flex gap-4 text-lg">
        <span>⚡ 속도: {cpm} CPM</span>
        <span>🎯 정확도: {accuracy}%</span>
        <span>❌ 오타: {errorCount}</span>
      </div>
      {verses.map((verse, index) => (
        <TypingVerse
          key={verse.id}
          verse={verse}
          className="mb-8 md:mb-12"
          onNext={goNext}
          onPrev={goPrev}
          isActive={index === currentVerseIndex}
          onActivate={() => activate(index)}
        />
      ))}
    </div>
  );
}
