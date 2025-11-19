"use client";

import { apiClient } from "@/core/http/apiClient";
import {
  TypingBibleProgress,
  TypingVersionSessionSummary,
  TypingVersionSummary,
} from "@/types/api/typing";
import { PaginatedResponse } from "@/types/api/common";

export async function fetchTypingVersionSummary(
  versionId: number,
  init?: RequestInit
): Promise<TypingVersionSummary> {
  return apiClient(`/typing/versions/${versionId}/summary/`, {
    method: "GET",
    ...init,
  });
}

export async function fetchTypingBibleProgress(
  versionId: number,
  init?: RequestInit
): Promise<TypingBibleProgress> {
  return apiClient(`/typing/versions/${versionId}/bible-progress/`, {
    method: "GET",
    ...init,
  });
}

export async function fetchTypingVersionSessions(
  versionId: number,
  init?: RequestInit
): Promise<PaginatedResponse<TypingVersionSessionSummary>> {
  return apiClient(`/typing/versions/${versionId}/sessions/`, {
    method: "GET",
    ...init,
  });
}
