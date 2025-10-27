import { Verse } from "@/types/models/bible";
import { useEffect, useState } from "react";
import { useVerseSelectStore } from "../stores/useVerseSelectStore";

export function useTypingSession(verses: Verse[]) {
  const [currentVerseIndex, setCurrentIndex] = useState(0);
  const { nextChapter, prevChapter } = useVerseSelectStore();

  useEffect(() => {
    if (currentVerseIndex >= verses.length) {
      setCurrentIndex(0);
    }
  }, [verses, currentVerseIndex]);

  const [shouldGoNextChapter, setShouldGoNextChapter] = useState(false);
  const [shouldGoPrevChapter, setShouldGoPrevChapter] = useState(false);

  const goNext = () =>
    setCurrentIndex((i) => {
      const nextIndex = i + 1;

      if (nextIndex >= verses.length) {
        setShouldGoNextChapter(true); // ✅ 렌더 이후에 호출
        return 0;
      }

      return nextIndex;
    });

  const goPrev = () =>
    setCurrentIndex((i) => {
      const prevIndex = i - 1;

      if (prevIndex < 0) {
        setShouldGoPrevChapter(true);
        return verses.length - 1;
      }

      return prevIndex;
    });

  useEffect(() => {
    if (shouldGoNextChapter) {
      nextChapter();
      setShouldGoNextChapter(false);
    }
  }, [shouldGoNextChapter, nextChapter]);

  useEffect(() => {
    if (shouldGoPrevChapter) {
      prevChapter();
      setShouldGoPrevChapter(false);
    }
  }, [shouldGoPrevChapter, prevChapter]);

  const activate = (index: number) =>
    setCurrentIndex(() => {
      const clamped = Math.min(
        Math.max(index, 0),
        Math.max(verses.length - 1, 0)
      );
      return clamped;
    });

  return { currentVerseIndex, goNext, goPrev, activate };
}
