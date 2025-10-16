import { create } from "zustand";

interface VerseSelectState {
  selectedVersionId: number | null;
  selectedBookId: number | null;
  chapterStart: number;
  chapterEnd: number;

  // actions
  setVersion: (id: number | null) => void;
  setBook: (id: number | null) => void;
  setChapterStart: (start: number) => void;
  setChapterEnd: (end: number) => void;
  reset: () => void;
}

export const useVerseSelectStore = create<VerseSelectState>((set) => ({
  selectedVersionId: null,
  selectedBookId: null,
  chapterStart: 1,
  chapterEnd: 1,

  setVersion: (id) =>
    set(() => ({
      selectedVersionId: id,
      selectedBookId: null,
      chapterStart: 1,
      chapterEnd: 1,
    })),

  setBook: (id) =>
    set(() => ({
      selectedBookId: id,
      chapterStart: 1,
      chapterEnd: 1,
    })),

  setChapterStart: (start) =>
    set((state) => ({
      chapterStart: start,
      chapterEnd: state.chapterEnd < start ? start : state.chapterEnd,
    })),

  setChapterEnd: (end) => set(() => ({ chapterEnd: end })),

  reset: () =>
    set({
      selectedVersionId: null,
      selectedBookId: null,
      chapterStart: 1,
      chapterEnd: 1,
    }),
}));
