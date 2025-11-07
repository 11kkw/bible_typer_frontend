// typing/hooks/useVerseLoader.ts
"use client";

import { useCallback, useEffect } from "react";

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
  }));

  const { verses, isLoading, error } = useVerseQuery({
    bookId: selectedBookId ?? undefined,
    chapter: currentChapter ?? undefined,
    page: currentPage,
    initialData: initialVerses,
  });

  const isActive =
    !!selectedBookId && !!chapterStart && !!chapterEnd && !!currentChapter;

  const loadNextPage = useCallback(async () => {
    if (!hasNextPage) return;
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "[useVerseLoader] loadNextPage",
        "bookId",
        selectedBookId,
        "chapter",
        currentChapter,
        "currentPage",
        currentPage + 1
      );
    }
    nextPage();
  }, [hasNextPage, nextPage, currentPage, selectedBookId, currentChapter]);

  const loadPrevPage = useCallback(async () => {
    if (!hasPrevPage) return;
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "[useVerseLoader] loadPrevPage",
        "bookId",
        selectedBookId,
        "chapter",
        currentChapter,
        "currentPage",
        Math.max(1, currentPage - 1)
      );
    }
    prevPage();
  }, [hasPrevPage, prevPage, currentPage, selectedBookId, currentChapter]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    console.log("[useVerseLoader] state", {
      selectedBookId,
      currentChapter,
      currentPage,
      hasNextPage,
      hasPrevPage,
      versesCount: verses.length,
    });
  }, [
    selectedBookId,
    currentChapter,
    currentPage,
    hasNextPage,
    hasPrevPage,
    verses,
  ]);

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
