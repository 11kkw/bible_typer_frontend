import { apiClient } from "@/core/http/apiClient";

export interface BookStatsParams {
  startChapter?: number;
  endChapter?: number;
  startVerse?: number;
  endVerse?: number;
}

export async function fetchBookStats(
  bookId: number,
  { startChapter, endChapter, startVerse, endVerse }: BookStatsParams
): Promise<{ total_verse_count: number; total_character_count: number }> {
  const params = new URLSearchParams();
  if (startChapter != null) params.set("start", String(startChapter));
  if (endChapter != null) params.set("end", String(endChapter));
  if (startVerse != null) params.set("start_verse", String(startVerse));
  if (endVerse != null) params.set("end_verse", String(endVerse));

  const query = params.toString();
  const suffix = query ? `?${query}` : "";

  return apiClient(`/scriptures/books/${bookId}/stats/${suffix}`, {
    method: "GET",
  });
}
