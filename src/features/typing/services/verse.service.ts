import { apiClient } from "@/core/http/apiClient";
import { PaginatedResponse } from "@/types/api/common";
import { Verse } from "@/types/models/bible";

export async function fetchRandomVerses(count: number): Promise<Verse[]> {
  return apiClient(`/scriptures/verses/random/${count}/`, { method: "GET" });
}

export interface VerseListParams {
  page?: number;
  startVerse?: number;
}

export async function fetchVersesByBookAndChapter(
  bookId: number,
  chapterNumber: number,
  params?: VerseListParams
): Promise<PaginatedResponse<Verse>> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set("page", String(params.page));
  if (params?.startVerse) queryParams.set("start_verse", String(params.startVerse));
  const query = queryParams.toString();
  const suffix = query ? `?${query}` : "";
  return apiClient(
    `/scriptures/books/${bookId}/chapters/${chapterNumber}/verses/${suffix}`,
    { method: "GET" }
  );
}
