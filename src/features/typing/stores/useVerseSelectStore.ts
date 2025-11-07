"use client";

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
  chapterStart: number;
  currentChapter: number;
  chapterEnd: number;
  totalVerseCount: number;
  totalCharacterCount: number;

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
  }) => void;

  setChapterStart: (start: number) => void;
  setChapterEnd: (end: number) => void;
  setCurrentChapter: (chapter: number) => void;

  // ✅ 페이지 제어 관련
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;

  // ✅ pagination 메타 업데이트
  setPagination: (meta: {
    count: number;
    next: string | null;
    previous: string | null;
    results?: any[];
  }) => void;

  // ✅ 고수준 이동
  nextStep: () => void;

  nextChapter: () => void;
  prevChapter: () => void;
  reset: () => void;
}

export const useVerseSelectStore = createWithEqualityFn<VerseSelectState>()(
  (set, get) => ({
    selectedVersionId: null,
    selectedVersionName: null,
    selectedBookId: null,
    selectedBookTitle: null,
    chapterStart: 1,
    currentChapter: 1,
    chapterEnd: 1,
    totalVerseCount: 0,
    totalCharacterCount: 0,

    // ✅ 페이지 초기값
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
          currentPage: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
          totalVerseCount: 0,
          totalCharacterCount: 0,
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
          currentPage: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
          totalVerseCount: 0,
          totalCharacterCount: 0,
        };
      }),

    setBookStats: (data) =>
      set({
        totalVerseCount: data.totalVerseCount,
        totalCharacterCount: data.totalCharacterCount,
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
        };
      }),

    setChapterEnd: (end) =>
      set((state) => {
        clearTypingProgress();
        const nextCurrent = state.currentChapter > end ? end : state.currentChapter;
        return {
          chapterEnd: end,
          currentChapter: nextCurrent,
          currentPage: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
          totalVerseCount: 0,
          totalCharacterCount: 0,
        };
      }),

    setCurrentChapter: (chapter) =>
      set((state) => {
        const clamped = Math.min(
          Math.max(chapter, state.chapterStart),
          state.chapterEnd
        );
        if (clamped === state.currentChapter) return state;
        return { currentChapter: clamped, currentPage: 1 }; // ✅ 챕터 변경 시 페이지 초기화
      }),

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
        const next = state.currentPage + 1;
        if (next > state.totalPages) return state;
        return { currentPage: next };
      }),

    prevPage: () =>
      set((state) => {
        const prev = Math.max(1, state.currentPage - 1);
        if (prev === state.currentPage) return state;
        return { currentPage: prev };
      }),

    // ------------------------------------------------------------------
    // ✅ Pagination 메타 업데이트 (count, next, previous, results 기반)
    // ------------------------------------------------------------------
    setPagination: ({ count, next, previous, results }) =>
      set(() => {
        const pageSize = results?.length ?? 1; // ✅ 응답의 results 길이로 page_size 자동 추론
        const totalPages = Math.max(1, Math.ceil(count / pageSize));

        return {
          totalPages,
          hasNextPage: !!next,
          hasPrevPage: !!previous,
        };
      }),

    // ------------------------------------------------------------------
    // ✅ 페이지 → 챕터 통합 이동 로직
    // ------------------------------------------------------------------
    nextStep: () => {
      const { currentPage, totalPages, currentChapter, chapterEnd } = get();

      // 1️⃣ 다음 페이지로 이동
      if (currentPage < totalPages) {
        get().nextPage();
        return;
      }

      // 2️⃣ 다음 챕터로 이동
      if (currentChapter < chapterEnd) {
        get().nextChapter();
        return;
      }

      // 3️⃣ 모든 챕터 완료
      console.log("✅ 모든 진행 완료");
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
          chapterStart: 1,
          currentChapter: 1,
          chapterEnd: 1,
          currentPage: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
          totalVerseCount: 0,
          totalCharacterCount: 0,
        };
      }),
  }),
  shallow
);
