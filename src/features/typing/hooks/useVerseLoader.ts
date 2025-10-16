"use client";

import { useVerseSelectStore } from "@/features/typing/stores/useVerseSelectStore";
import { Verse } from "@/types/models/bible";
import { useQuery } from "@tanstack/react-query";
import {
  fetchRandomVerses,
  fetchVersesByBookAndChapter,
} from "../services/verse.service";

export function useVerseLoader(initialVerses: Verse[]) {
  const selectedBookId = useVerseSelectStore((s) => s.selectedBookId);
  const chapterStart = useVerseSelectStore((s) => s.chapterStart);
  const chapterEnd = useVerseSelectStore((s) => s.chapterEnd);
  const currentChapter = useVerseSelectStore((s) => s.currentChapter);

  const { data = initialVerses, isLoading } = useQuery({
    queryKey: ["verses", selectedBookId, currentChapter],
    queryFn: async () => {
      if (selectedBookId && currentChapter != null) {
        const res = await fetchVersesByBookAndChapter(
          selectedBookId,
          currentChapter
        );
        return res.results;
      }
      return await fetchRandomVerses(4);
    },
    enabled:
      !!selectedBookId && !!chapterStart && !!chapterEnd && !!currentChapter,
    staleTime: 1000 * 60, // 1분 동안 캐시 유지
    initialData:
      selectedBookId && chapterStart && currentChapter
        ? undefined
        : initialVerses,
  });

  return {
    verses: data,
    isLoading,
  };
}
