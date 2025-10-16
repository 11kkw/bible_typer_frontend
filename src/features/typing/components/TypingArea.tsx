"use client";

import { useTypingVerses } from "@/features/typing/hooks/useTypingVerse"; // ✅ 추가
import { Verse } from "@/types/models/bible";
import { TypingVerse } from "./TypingVerse";

export function TypingArea({ initialVerses }: { initialVerses: Verse[] }) {
  const { verses, isLoading, currentIndex, goNext, goPrev, activate } =
    useTypingVerses(initialVerses);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-gray-400 text-lg"> 구절을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl w-full text-left py-16 md:py-24 relative">
      {verses.map((verse, index) => (
        <TypingVerse
          key={verse.id ?? index}
          verse={verse}
          className="mb-8 md:mb-12"
          onNext={goNext}
          onPrev={goPrev}
          isActive={index === currentIndex}
          onActivate={() => activate(index)}
        />
      ))}
    </div>
  );
}
