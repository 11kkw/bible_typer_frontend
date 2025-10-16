import { apiClient } from "@/core/http/apiClient";
import { BibleVersionDetail } from "@/types/api/bible";
import { PaginatedResponse } from "@/types/api/common";
import { BibleVersion } from "@/types/models/bible";

export async function fetchBibleVersions(
  page?: number
): Promise<PaginatedResponse<BibleVersion>> {
  const query = page ? `?page=${page}` : "";
  return apiClient(`/scriptures/bible_versions/${query}`, { method: "GET" });
}

export async function fetchBibleVersionDetail(
  id: number
): Promise<BibleVersionDetail> {
  return apiClient(`/scriptures/bible_versions/${id}/`, { method: "GET" });
}
