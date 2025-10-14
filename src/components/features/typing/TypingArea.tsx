"use client";

import { Verse } from "@/types/models/bible";
import { useState } from "react";
import { TypingVerse } from "./TypingVerse";

interface TypingAreaProps {
  initialVerses: Verse[];
}

export function TypingArea({ initialVerses }: TypingAreaProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = () =>
    setCurrentIndex((prev) => Math.min(prev + 1, initialVerses.length - 1));
  const goPrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  return (
    <div className="max-w-4xl w-full text-left py-16 md:py-24 relative">
      {initialVerses.map((verse, index) => (
        <TypingVerse
          key={verse.id ?? index}
          verse={verse}
          className="mb-8 md:mb-12"
          onNext={goNext}
          onPrev={goPrev}
          isActive={index === currentIndex}
          onActivate={() => setCurrentIndex(index)}
        />
      ))}
    </div>
  );
}
