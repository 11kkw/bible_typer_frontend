"use client";

import { create } from "zustand";

interface MyRecordFilterState {
  versionId: string;
  setVersionId: (value: string) => void;
}

export const useMyRecordFilterStore = create<MyRecordFilterState>((set) => ({
  versionId: "",
  setVersionId: (value) => set({ versionId: value }),
}));
