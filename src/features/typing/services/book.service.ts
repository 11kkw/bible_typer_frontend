import { apiClient } from "@/core/http/apiClient";

export async function fetchBookStats(
  bookId: number,
  start?: number,
  end?: number
): Promise<{ total_verse_count: number; total_character_count: number }> {
  const query = start && end ? `?start=${start}&end=${end}` : "";
  return apiClient(`/scriptures/books/${bookId}/stats/${query}`, {
    method: "GET",
  });
}
