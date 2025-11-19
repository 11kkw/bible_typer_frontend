"use client";

import { TypingEventLogInput } from "@/features/typing/types";
import { create } from "zustand";

interface VerseMetaState {
  startTimestamp: number | null;
  lastTimestamp: number | null;
  backspaceCount: number;
}

interface TypingLogState {
  startVerseLogging: (verseId: number) => void;
  appendEvent: (
    verseId: number,
    event: Omit<TypingEventLogInput, "duration"> & { duration?: number }
  ) => void;
  clearVerseLog: (verseId: number) => void;
  getVerseEvents: (verseId: number) => TypingEventLogInput[];
  getBackspaceCount: (verseId: number) => number;
  getTimeSpent: (verseId: number) => number;
}

const verseEvents: Record<number, TypingEventLogInput[]> = {};
const verseMeta: Record<number, VerseMetaState> = {};

const nowSeconds = () => performance.now();

export const useTypingLogStore = create<TypingLogState>(() => ({
  startVerseLogging: (verseId: number) => {
    if (!verseEvents[verseId]) {
      verseEvents[verseId] = [];
    }
    if (!verseMeta[verseId]) {
      verseMeta[verseId] = {
        startTimestamp: null,
        lastTimestamp: null,
        backspaceCount: 0,
      };
    }
  },

  appendEvent: (verseId, event) => {
    const now = nowSeconds();
    if (!verseEvents[verseId]) {
      verseEvents[verseId] = [];
    }
    if (!verseMeta[verseId]) {
      verseMeta[verseId] = {
        startTimestamp: null,
        lastTimestamp: null,
        backspaceCount: 0,
      };
    }

    const meta = verseMeta[verseId];
    if (meta.startTimestamp == null) {
      meta.startTimestamp = now;
      meta.lastTimestamp = now;
    }

    const prevTimestamp = meta.lastTimestamp ?? now;
    const duration =
      event.duration ?? (prevTimestamp ? (now - prevTimestamp) / 1000 : 0);

    verseEvents[verseId].push({
      duration,
      key_type: event.key_type,
      char: event.char ?? "",
      expected_char: event.expected_char ?? "",
      key_code: event.key_code ?? "",
      raw_key: event.raw_key ?? "",
      is_error: event.is_error ?? false,
      position: event.position,
    });

    meta.lastTimestamp = now;
    if (event.key_type === "delete") {
      meta.backspaceCount += 1;
    }
  },

  clearVerseLog: (verseId) => {
    delete verseEvents[verseId];
    delete verseMeta[verseId];
  },

  getVerseEvents: (verseId) => verseEvents[verseId] ?? [],

  getBackspaceCount: (verseId) => verseMeta[verseId]?.backspaceCount ?? 0,

  getTimeSpent: (verseId) => {
    const meta = verseMeta[verseId];
    if (!meta || meta.startTimestamp == null || meta.lastTimestamp == null)
      return 0;
    return (meta.lastTimestamp - meta.startTimestamp) / 1000;
  },
}));
