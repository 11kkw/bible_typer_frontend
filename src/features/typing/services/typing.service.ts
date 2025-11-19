import { apiClient } from "@/core/http/apiClient";
import {
  CreateTypingSessionRequest,
  NextUntypedVerseResponse,
  TypingSessionEntry,
  TypingVerseLogInput,
} from "@/features/typing/types";

/**
 * 타이핑 세션 생성 요청
 * POST /api/typing/sessions/
 */
export async function createTypingSession(
  payload: CreateTypingSessionRequest
): Promise<TypingSessionEntry> {
  return apiClient("/typing/sessions/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createTypingVerseLog(
  payload: TypingVerseLogInput
): Promise<{
  verse_log_id: number;
  event_count: number;
}> {
  return apiClient("/typing/verse-logs/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchNextUntypedVerse(
  versionId: number
): Promise<NextUntypedVerseResponse> {
  return apiClient(`/typing/versions/${versionId}/next-untyped-verse/`, {
    method: "GET",
  });
}
