import { BibleVersionDetail } from "@/types/api/bible";
import { PaginatedResponse } from "@/types/api/common";
import { BibleVersion, Verse } from "@/types/models/bible";
import { apiClient } from "../../../core/http/apiClient";

export async function fetchBibleVersions(
  page?: number
): Promise<PaginatedResponse<BibleVersion>> {
  const query = page ? `?page=${page}` : "";
  return apiClient(`/scriptures/bible_versions/${query}`, {
    method: "GET",
  });
}

export async function fetchBibleVersionDetail(
  id: number
): Promise<BibleVersionDetail> {
  return apiClient(`/scriptures/bible_versions/${id}/`, {
    method: "GET",
  });
}

export async function fetchRandomVerses(count: number): Promise<Verse[]> {
  return apiClient(`/scriptures/verses/random/${count}/`, {
    method: "GET",
  });
}

export async function fetchVersesByBookAndChapter(
  bookId: number,
  chapterNumber: number,
  page?: number
): Promise<PaginatedResponse<Verse>> {
  const query = page ? `?page=${page}` : "";
  return apiClient(
    `/scriptures/verses/books/${bookId}/chapters/${chapterNumber}/${query}`,
    { method: "GET" }
  );
}
