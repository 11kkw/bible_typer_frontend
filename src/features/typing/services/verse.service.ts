import { apiClient } from "@/core/http/apiClient";
import { PaginatedResponse } from "@/types/api/common";
import { Verse } from "@/types/models/bible";

export async function fetchRandomVerses(count: number): Promise<Verse[]> {
  return apiClient(`/scriptures/verses/random/${count}/`, { method: "GET" });
}

export async function fetchVersesByBookAndChapter(
  bookId: number,
  chapterNumber: number,
  page?: number
): Promise<PaginatedResponse<Verse>> {
  const query = page ? `?page=${page}` : "";
  return apiClient(
    `/scriptures/books/${bookId}/chapters/${chapterNumber}/verses/${query}`,
    { method: "GET" }
  );
}
