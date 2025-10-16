import { create } from "zustand";

export interface VerseSelectState {
  selectedVersionId: number | null;
  selectedBookId: number | null;
  chapterStart: number;
  currentChapter: number;
  chapterEnd: number;

  // actions
  setVersion: (id: number | null) => void;
  setBook: (id: number | null) => void;
  setChapterStart: (start: number) => void;
  setChapterEnd: (end: number) => void;
  setCurrentChapter: (chapter: number) => void;
  nextChapter: () => void;
  prevChapter: () => void;
  reset: () => void;
}

export const useVerseSelectStore = create<VerseSelectState>((set, get) => ({
  selectedVersionId: null,
  selectedBookId: null,
  chapterStart: 1,
  currentChapter: 1,
  chapterEnd: 1,

  setVersion: (id) =>
    set(() => ({
      selectedVersionId: id,
      selectedBookId: null,
      chapterStart: 1,
      currentChapter: 1,
      chapterEnd: 1,
    })),

  setBook: (id) =>
    set(() => ({
      selectedBookId: id,
      chapterStart: 1,
      currentChapter: 1,
      chapterEnd: 1,
    })),

  setChapterStart: (start) =>
    set((state) => ({
      chapterStart: start,
      currentChapter: start,
      chapterEnd: state.chapterEnd < start ? start : state.chapterEnd,
    })),

  setChapterEnd: (end) =>
    set((state) => ({
      chapterEnd: end,
      currentChapter: state.currentChapter > end ? end : state.currentChapter,
    })),

  setCurrentChapter: (chapter) =>
    set((state) => {
      const clamped = Math.min(
        Math.max(chapter, state.chapterStart),
        state.chapterEnd
      );
      if (clamped === state.currentChapter) return state;
      return { currentChapter: clamped };
    }),

  nextChapter: () =>
    set((state) => {
      const next = state.currentChapter + 1;
      if (next > state.chapterEnd) return state;
      if (next === state.currentChapter) return state;
      return { currentChapter: next };
    }),

  prevChapter: () =>
    set((state) => {
      const prev = Math.max(state.chapterStart, state.currentChapter - 1);
      if (prev === state.currentChapter) return state;
      return { currentChapter: prev };
    }),

  reset: () =>
    set((state) => ({
      selectedVersionId: null,
      selectedBookId: null,
      chapterStart: 1,
      currentChapter: 1,
      chapterEnd: 1,
    })),
}));
