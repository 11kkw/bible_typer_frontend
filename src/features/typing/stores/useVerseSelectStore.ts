"use client";

import { TypingSessionEntry } from "../types";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import { useTypingStore } from "./useTypingStore";

function clearTypingProgress() {
  const { resetAll } = useTypingStore.getState();
  resetAll();
}

export interface VerseSelectState {
  selectedVersionId: number | null;
  selectedVersionName: string | null;
  selectedBookId: number | null;
  selectedBookTitle: string | null;
  serverSession: TypingSessionEntry | null;
  chapterStart: number;
  currentChapter: number;
  chapterEnd: number;
  startVerse: number | null;
  totalVerseCount: number;
  totalCharacterCount: number;
  selectionTotalVerseCount: number;
  selectionTotalCharacterCount: number;

  // ✅ 페이지 관련 상태
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;

  // --- setters / actions ---
  setVersion: (id: number | null, meta?: { name?: string | null }) => void;
  setBook: (id: number | null, meta?: { title?: string | null }) => void;
  setBookStats: (data: {
    totalVerseCount: number;
    totalCharacterCount: number;
    scope?: "page" | "selection";
  }) => void;

  setChapterStart: (start: number) => void;
  setChapterEnd: (end: number) => void;
  setCurrentChapter: (chapter: number) => void;
  setStartVerse: (verse: number | null) => void;
  setStartVerse: (verse: number | null) => void;

  // ✅ 페이지 제어 관련
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;

  // ✅ pagination 메타 업데이트
  setPagination: (meta: {
    count?: number;
    next?: string | null;
    previous?: string | null;
    results?: any[];
    page?: number;
    total_pages?: number;
    totalPages?: number;
    pages?: number;
    page_count?: number;
    page_size?: number;
    pageSize?: number;
    per_page?: number;
    limit?: number;
    current_page?: number;
    currentPage?: number;
    page_number?: number;
    has_next?: boolean;
    hasNext?: boolean;
    has_more?: boolean;
    hasMore?: boolean;
    has_prev?: boolean;
    hasPrev?: boolean;
    next_page?: number;
    prev_page?: number;
  }) => void;

  // ✅ 고수준 이동
  nextStep: () => void;

  nextChapter: () => void;
  prevChapter: () => void;
  reset: () => void;
  setServerSession: (session: TypingSessionEntry | null) => void;
}

export const useVerseSelectStore = createWithEqualityFn<VerseSelectState>()(
  (set, get) => ({
    selectedVersionId: null,
    selectedVersionName: null,
    selectedBookId: null,
    selectedBookTitle: null,
    serverSession: null,
    chapterStart: 1,
    currentChapter: 1,
    chapterEnd: 1,
    startVerse: null,
    totalVerseCount: 0,
    totalCharacterCount: 0,
    selectionTotalVerseCount: 0,
    selectionTotalCharacterCount: 0,

    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,

    // ------------------------------------------------------------------
    // ✅ 기본 상태 설정
    // ------------------------------------------------------------------
    setVersion: (id, meta) =>
      set(() => {
        clearTypingProgress();
        return {
          selectedVersionId: id,
          selectedVersionName: meta?.name ?? null,
          selectedBookId: null,
          selectedBookTitle: null,
          chapterStart: 1,
          currentChapter: 1,
          chapterEnd: 1,
          startVerse: null,
          currentPage: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
          totalVerseCount: 0,
          totalCharacterCount: 0,
          selectionTotalVerseCount: 0,
          selectionTotalCharacterCount: 0,
          serverSession: null,
        };
      }),

    setBook: (id, meta) =>
      set(() => {
        clearTypingProgress();
        return {
          selectedBookId: id,
          selectedBookTitle: meta?.title ?? null,
          chapterStart: 1,
          currentChapter: 1,
          chapterEnd: 1,
          startVerse: null,
          currentPage: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
          totalVerseCount: 0,
          totalCharacterCount: 0,
          selectionTotalVerseCount: 0,
          selectionTotalCharacterCount: 0,
          serverSession: null,
        };
      }),

    setBookStats: ({ totalVerseCount, totalCharacterCount, scope = "page" }) =>
      set((state) => {
        if (scope === "selection") {
          return {
            totalVerseCount,
            totalCharacterCount,
            selectionTotalVerseCount: totalVerseCount,
            selectionTotalCharacterCount: totalCharacterCount,
          };
        }
        return {
          totalVerseCount,
          totalCharacterCount,
          selectionTotalVerseCount:
            state.selectionTotalVerseCount > 0
              ? state.selectionTotalVerseCount
              : 0,
          selectionTotalCharacterCount:
            state.selectionTotalCharacterCount > 0
              ? state.selectionTotalCharacterCount
              : 0,
        };
      }),

    setChapterStart: (start) =>
      set((state) => {
        clearTypingProgress();
        const nextEnd = state.chapterEnd < start ? start : state.chapterEnd;
        return {
          chapterStart: start,
          currentChapter: start,
         chapterEnd: nextEnd,
          currentPage: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
          totalVerseCount: 0,
          totalCharacterCount: 0,
          selectionTotalVerseCount: 0,
          selectionTotalCharacterCount: 0,
          serverSession: null,
          startVerse: null,
        };
      }),

    setChapterEnd: (end) =>
      set((state) => {
        clearTypingProgress();
        const nextCurrent =
          state.currentChapter > end ? end : state.currentChapter;
        return {
          chapterEnd: end,
          currentChapter: nextCurrent,
          currentPage: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
          totalVerseCount: 0,
          totalCharacterCount: 0,
          selectionTotalVerseCount: 0,
          selectionTotalCharacterCount: 0,
          serverSession: null,
          startVerse: null,
        };
      }),

    setCurrentChapter: (chapter) =>
      set((state) => {
        const clamped = Math.min(
          Math.max(chapter, state.chapterStart),
          state.chapterEnd
        );
        if (clamped === state.currentChapter) return state;
        return { currentChapter: clamped, currentPage: 1, startVerse: null }; // ✅ 챕터 변경 시 페이지 초기화
      }),

    setStartVerse: (verse) => set({ startVerse: verse }),

    // ------------------------------------------------------------------
    // ✅ 페이지 제어
    // ------------------------------------------------------------------
    setPage: (page) =>
      set((state) => {
        const clamped = Math.max(1, Math.min(page, state.totalPages));
        if (clamped === state.currentPage) return state;
        return { currentPage: clamped };
      }),

    nextPage: () =>
      set((state) => {
        if (!state.hasNextPage) return state;
        return { currentPage: state.currentPage + 1 };
      }),

    prevPage: () =>
      set((state) => {
        if (!state.hasPrevPage || state.currentPage <= 1) return state;
        return { currentPage: state.currentPage - 1 };
      }),

    // ------------------------------------------------------------------
    // ✅ Pagination 메타 업데이트 (count, next, previous, results 기반)
    // ------------------------------------------------------------------
    setPagination: (meta) =>
      set((state) => {
        const pageSizeFromMeta =
          meta.page_size ??
          meta.pageSize ??
          meta.per_page ??
          meta.limit ??
          (meta.results?.length && meta.results.length > 0
            ? meta.results.length
            : undefined);
        const pageSize = pageSizeFromMeta ?? 1;

        const totalPagesFromMeta =
          meta.total_pages ??
          meta.totalPages ??
          meta.pages ??
          meta.page_count ??
          (meta.count != null
            ? Math.max(1, Math.ceil(meta.count / pageSize))
            : undefined);

        const currentPageFromMeta =
          meta.current_page ??
          meta.currentPage ??
          meta.page_number ??
          meta.page ??
          state.currentPage;

        const hasNextFromMeta =
          typeof meta.has_next === "boolean"
            ? meta.has_next
            : typeof meta.hasNext === "boolean"
            ? meta.hasNext
            : typeof meta.has_more === "boolean"
            ? meta.has_more
            : typeof meta.hasMore === "boolean"
            ? meta.hasMore
            : typeof meta.next_page === "number"
            ? meta.next_page > (currentPageFromMeta ?? 1)
            : undefined;

        const hasPrevFromMeta =
          typeof meta.has_prev === "boolean"
            ? meta.has_prev
            : typeof meta.hasPrev === "boolean"
            ? meta.hasPrev
            : typeof meta.prev_page === "number"
            ? meta.prev_page >= 1 &&
              meta.prev_page < (currentPageFromMeta ?? 1)
            : undefined;

        const fallbackHasNext =
          hasNextFromMeta ??
          (meta.next
            ? true
            : totalPagesFromMeta != null
            ? currentPageFromMeta < totalPagesFromMeta
            : state.hasNextPage);

        const fallbackHasPrev =
          hasPrevFromMeta ??
          (meta.previous
            ? true
            : currentPageFromMeta > 1 || state.hasPrevPage);

        return {
          totalPages: totalPagesFromMeta ?? state.totalPages,
          hasNextPage: fallbackHasNext,
          hasPrevPage: fallbackHasPrev,
        };
      }),

    // ------------------------------------------------------------------
    // ✅ 페이지 → 챕터 통합 이동 로직
    // ------------------------------------------------------------------
    nextStep: () => {
      const { hasNextPage, currentChapter, chapterEnd } = get();

      // 1️⃣ 다음 페이지로 이동
      if (hasNextPage) {
        get().nextPage();
        return;
      }

      // 2️⃣ 다음 챕터로 이동
      if (currentChapter < chapterEnd) {
        get().nextChapter();
        return;
      }

      // 3️⃣ 모든 챕터 완료
    },

    // ------------------------------------------------------------------
    // ✅ 챕터 이동
    // ------------------------------------------------------------------
    nextChapter: () =>
      set((state) => {
        const next = state.currentChapter + 1;
        if (next > state.chapterEnd) return state;
        return { currentChapter: next, currentPage: 1 };
      }),

    prevChapter: () =>
      set((state) => {
        const prev = Math.max(state.chapterStart, state.currentChapter - 1);
        if (prev === state.currentChapter) return state;
        return { currentChapter: prev, currentPage: 1 };
      }),

    // ------------------------------------------------------------------
    // ✅ 초기화
    // ------------------------------------------------------------------
    reset: () =>
      set(() => {
        clearTypingProgress();
        return {
          selectedVersionId: null,
          selectedVersionName: null,
          selectedBookId: null,
          selectedBookTitle: null,
          serverSession: null,
          chapterStart: 1,
          currentChapter: 1,
          chapterEnd: 1,
          currentPage: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
          totalVerseCount: 0,
          totalCharacterCount: 0,
          selectionTotalVerseCount: 0,
          selectionTotalCharacterCount: 0,
        };
      }),
    setServerSession: (session) => set({ serverSession: session }),
  }),
  shallow
);
