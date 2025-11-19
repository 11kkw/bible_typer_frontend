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
  startVerse?: number;
  initialData?: Verse[];
}

export function useVerseQuery({
  bookId,
  chapter,
  page = 1,
  startVerse,
  initialData = [],
}: UseVerseQueryOptions) {
  const setPagination = useVerseSelectStore((s) => s.setPagination);

  const query = useQuery<PaginatedResponse<Verse>, Error>({
    queryKey: ["verses", bookId, chapter, page, startVerse],
    queryFn: async () => {
      if (!bookId || chapter == null) {
        throw new Error("bookId와 chapter가 필요합니다.");
      }

      const res = await fetchVersesByBookAndChapter(bookId, chapter, {
        page,
        startVerse,
      });

      const pagination =
        (res as any).pagination ?? (res as any).meta ?? (res as any);
      const pageSize =
        res.page_size ??
        res.pageSize ??
        pagination.page_size ??
        pagination.pageSize ??
        pagination.per_page ??
        pagination.limit ??
        res.results?.length ??
        pagination.results?.length;
      const currentPage =
        pagination.current_page ??
        pagination.currentPage ??
        pagination.page_number ??
        pagination.page ??
        res.current_page ??
        res.currentPage ??
        page;
      const totalPages =
        res.total_pages ??
        res.totalPages ??
        pagination.total_pages ??
        pagination.totalPages ??
        pagination.pages ??
        pagination.page_count ??
        (res.count && pageSize
          ? Math.max(1, Math.ceil(res.count / pageSize))
          : undefined);
      const hasNext =
        res.has_next ??
        res.hasNext ??
        pagination.has_next ??
        pagination.hasNext ??
        pagination.has_more ??
        pagination.hasMore ??
        (typeof pagination.next_page === "number"
          ? pagination.next_page > currentPage
          : undefined) ??
        (totalPages != null ? currentPage < totalPages : undefined) ??
        (res.next ? true : undefined);
      const hasPrev =
        res.has_prev ??
        res.hasPrev ??
        pagination.has_prev ??
        pagination.hasPrev ??
        (typeof pagination.prev_page === "number"
          ? pagination.prev_page >= 1 &&
            pagination.prev_page < (currentPage ?? 1)
          : undefined) ??
        (currentPage ? currentPage > 1 : undefined) ??
        (res.previous ? true : undefined);

      setPagination({
        count: res.count ?? pagination.count ?? pagination.total,
        next:
          res.next ??
          pagination.next ??
          pagination.next_url ??
          pagination.nextPage ??
          null,
        previous:
          res.previous ??
          pagination.previous ??
          pagination.prev ??
          pagination.prev_url ??
          pagination.prevPage ??
          null,
        results: res.results,
        page,
        total_pages: totalPages,
        page_size: pageSize,
        current_page: currentPage,
        has_next: hasNext,
        has_prev: hasPrev,
        next_page: pagination.next_page,
        prev_page: pagination.prev_page,
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
