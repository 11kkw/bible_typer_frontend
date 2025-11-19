"use client";

import { useEffect, useState } from "react";
import { TypingBibleProgress } from "@/types/api/typing";
import { fetchTypingBibleProgress } from "../services/myRecord.service";

interface TypingBibleProgressState {
  progress: TypingBibleProgress | null;
  loading: boolean;
  error: Error | null;
}

export function useTypingBibleProgress(versionId?: number) {
  const [state, setState] = useState<TypingBibleProgressState>({
    progress: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!versionId) {
      setState({ progress: null, loading: false, error: null });
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    setState((prev) => ({
      progress: prev.progress,
      loading: true,
      error: null,
    }));

    fetchTypingBibleProgress(versionId, { signal: controller.signal })
      .then((data) => {
        if (!isMounted) return;
        setState({ progress: data, loading: false, error: null });
      })
      .catch((error: unknown) => {
        const typedError =
          error instanceof Error ? error : new Error("Unknown error");
        if (!isMounted || typedError.name === "AbortError") return;
        setState({ progress: null, loading: false, error: typedError });
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [versionId]);

  return state;
}
