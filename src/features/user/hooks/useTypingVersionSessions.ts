"use client";

import { useEffect, useState } from "react";
import { TypingVersionSessionSummary } from "@/types/api/typing";
import { PaginatedResponse } from "@/types/api/common";
import { fetchTypingVersionSessions } from "../services/myRecord.service";

interface TypingVersionSessionsState {
  data: PaginatedResponse<TypingVersionSessionSummary> | null;
  loading: boolean;
  error: Error | null;
}

export function useTypingVersionSessions(versionId?: number) {
  const [state, setState] = useState<TypingVersionSessionsState>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!versionId) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    setState((prev) => ({
      data: prev.data,
      loading: true,
      error: null,
    }));

    fetchTypingVersionSessions(versionId, { signal: controller.signal })
      .then((res) => {
        if (!isMounted) return;
        setState({ data: res, loading: false, error: null });
      })
      .catch((error: unknown) => {
        const typedError =
          error instanceof Error ? error : new Error("Unknown error");
        if (!isMounted || typedError.name === "AbortError") return;
        setState({ data: null, loading: false, error: typedError });
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [versionId]);

  return state;
}
