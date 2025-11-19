"use client";

import { useEffect, useState } from "react";
import { TypingVersionSummary } from "@/types/api/typing";
import { fetchTypingVersionSummary } from "../services/myRecord.service";

interface TypingVersionSummaryState {
  summary: TypingVersionSummary | null;
  loading: boolean;
  error: Error | null;
}

export function useTypingVersionSummary(versionId?: number) {
  const [state, setState] = useState<TypingVersionSummaryState>({
    summary: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!versionId) {
      setState({
        summary: null,
        loading: false,
        error: null,
      });
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    setState((prev) => ({
      summary: prev.summary,
      loading: true,
      error: null,
    }));

    fetchTypingVersionSummary(versionId, { signal: controller.signal })
      .then((data) => {
        if (!isMounted) return;
        setState({
          summary: data,
          loading: false,
          error: null,
        });
      })
      .catch((error: unknown) => {
        const typedError =
          error instanceof Error ? error : new Error("Unknown error");
        if (!isMounted || typedError.name === "AbortError") return;
        setState({
          summary: null,
          loading: false,
          error: typedError,
        });
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [versionId]);

  return state;
}
