"use client";

import { fetchBibleVersionDetail } from "@/features/typing/services/bible.service";
import { BibleVersionDetail } from "@/types/api/bible";
import { useQuery } from "@tanstack/react-query";

/* === 상세 === */
export function useBibleVersionDetail(id?: number) {
  return useQuery<BibleVersionDetail>({
    queryKey: ["bibleVersion", id],
    queryFn: () => fetchBibleVersionDetail(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
