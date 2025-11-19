// typing/hooks/useVerseLoader.ts
"use client";

import { useCallback } from "react";

import { useVerseSelectStore } from "@/features/typing/stores/useVerseSelectStore";
import { Verse } from "@/types/models/bible";
import { useVerseQuery } from "./useVerseQuery";

export function useVerseLoader(initialVerses: Verse[]) {
  const {
    selectedBookId,
    currentChapter,
    chapterStart,
    chapterEnd,
    currentPage,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    startVerse,
  } = useVerseSelectStore((s) => ({
    selectedBookId: s.selectedBookId,
    currentChapter: s.currentChapter,
    chapterStart: s.chapterStart,
    chapterEnd: s.chapterEnd,
    currentPage: s.currentPage,
    hasNextPage: s.hasNextPage,
    hasPrevPage: s.hasPrevPage,
    nextPage: s.nextPage,
    prevPage: s.prevPage,
    startVerse: s.startVerse,
  }));

  const { verses, isLoading, error } = useVerseQuery({
    bookId: selectedBookId ?? undefined,
    chapter: currentChapter ?? undefined,
    page: currentPage,
    startVerse: startVerse ?? undefined,
    initialData: initialVerses,
  });

  const isActive =
    !!selectedBookId && !!chapterStart && !!chapterEnd && !!currentChapter;

  const loadNextPage = useCallback(async () => {
    if (!hasNextPage) return;
    nextPage();
  }, [hasNextPage, nextPage]);

  const loadPrevPage = useCallback(async () => {
    if (!hasPrevPage) return;
    prevPage();
  }, [hasPrevPage, prevPage]);

  return {
    verses: isActive ? verses : initialVerses,
    isLoading: isActive ? isLoading : false,
    error,
    hasNextPage: isActive ? hasNextPage : false,
    hasPrevPage: isActive ? hasPrevPage : false,
    loadNextPage,
    loadPrevPage,
  };
}
