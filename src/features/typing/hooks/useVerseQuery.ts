"use client";

import { useVerseSelectStore } from "@/features/typing/stores/useVerseSelectStore";
import { PaginatedResponse } from "@/types/api/common";
import { Verse } from "@/types/models/bible";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchVersesByBookAndChapter } from "../services/verse.service";

interface UseVerseQueryOptions {
  bookId?: number;
  chapter?: number;
  page?: number;
  initialData?: Verse[];
}

export function useVerseQuery({
  bookId,
  chapter,
  page = 1,
  initialData = [],
}: UseVerseQueryOptions) {
  const setPagination = useVerseSelectStore((s) => s.setPagination);

  const query = useQuery<PaginatedResponse<Verse>, Error>({
    queryKey: ["verses", bookId, chapter, page],
    queryFn: async () => {
      if (!bookId || chapter == null) {
        throw new Error("bookId와 chapter가 필요합니다.");
      }

      const res = await fetchVersesByBookAndChapter(bookId, chapter, page);

      setPagination({
        count: res.count,
        next: res.next,
        previous: res.previous,
        results: res.results,
      });

      return res;
    },
    enabled: !!bookId && chapter != null,
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    placeholderData: keepPreviousData,
  });

  const verses = query.data?.results ?? initialData;

  return {
    verses,
    isLoading: query.isLoading,
    error: query.error,
    totalCount: query.data?.count ?? 0,
    next: query.data?.next ?? null,
    previous: query.data?.previous ?? null,
    refetch: query.refetch,
  };
}
