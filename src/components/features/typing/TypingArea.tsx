"use client";

import { Verse } from "@/types/models/bible";
import { TypingVerse } from "./TypingVerse";

interface TypingAreaProps {
  initialVerses: Verse[];
}

export function TypingArea({ initialVerses }: TypingAreaProps) {
  return (
    <div className="max-w-4xl w-full text-left py-16 md:py-24 relative">
      {initialVerses.map((verse, index) => (
        <TypingVerse key={verse.id ?? index} verse={verse} />
      ))}
    </div>
  );
}
