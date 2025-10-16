import { Verse } from "@/types/models/bible";
import { useEffect, useState } from "react";

export function useTypingSession(verses: Verse[]) {
  const [currentVerseIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [verses]);

  const goNext = () =>
    setCurrentIndex((i) => Math.min(i + 1, Math.max(verses.length - 1, 0)));

  const goPrev = () => setCurrentIndex((i) => Math.max(i - 1, 0));

  const activate = (index: number) =>
    setCurrentIndex((i) => {
      const clamped = Math.min(
        Math.max(index, 0),
        Math.max(verses.length - 1, 0)
      );
      return clamped;
    });

  return { currentVerseIndex, goNext, goPrev, activate };
}
