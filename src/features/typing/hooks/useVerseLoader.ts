// typing/hooks/useVerseLoader.ts
"use client";

import { useVerseSelectStore } from "@/features/typing/stores/useVerseSelectStore";
import { Verse } from "@/types/models/bible";
import { useVerseQuery } from "./useVerseQuery";

export function useVerseLoader(initialVerses: Verse[], page: number = 1) {
  const { selectedBookId, currentChapter, chapterStart, chapterEnd } =
    useVerseSelectStore((s) => ({
      selectedBookId: s.selectedBookId,
      currentChapter: s.currentChapter,
      chapterStart: s.chapterStart,
      chapterEnd: s.chapterEnd,
    }));

  const { verses, isLoading, error } = useVerseQuery({
    bookId: selectedBookId ?? undefined,
    chapter: currentChapter ?? undefined,
    page,
    initialData: initialVerses,
  });

  const isActive =
    !!selectedBookId && !!chapterStart && !!chapterEnd && !!currentChapter;

  return {
    verses: isActive ? verses : initialVerses,
    isLoading: isActive ? isLoading : false,
    error,
  };
}
