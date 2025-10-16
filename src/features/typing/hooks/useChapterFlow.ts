import { Verse } from "@/types/models/bible";
import { useCallback } from "react";
import { useTypingSession } from "./useTypingSession";

export function useTypingFlow(verses: Verse[]) {
  const { currentVerseIndex, goNext, goPrev, activate } =
    useTypingSession(verses);

  const handleNext = useCallback(() => {
    if (currentVerseIndex < verses.length - 1) {
      goNext();
    }
  }, [currentVerseIndex, verses.length, goNext]);

  return { currentVerseIndex, handleNext, goPrev, activate };
}
