// features/typing/stores/useTypingStore.ts
import { HangulChar } from "@/types/models/Hangul";
import { create } from "zustand";

/**
 * 📦 Typing 상태 관리 Store (순수 저장소 전용)
 * - 오직 상태 저장 및 수정만 담당
 * - 한글 분해, 캐싱, 비교 등의 계산 로직은 포함하지 않음
 */
interface TypingState {
  /** 유저 입력 문자열 (verse.id → text) */
  userTypedMap: Record<number, string>;

  userDecomposedMap: Record<number, HangulChar[]>;

  origDecomposedMap: Record<number, HangulChar[]>;

  /** ✅ 유저 입력 문자열 저장 */
  setUserTyped: (id: number, value: string) => void;

  /** ✅ 유저 입력 분해 결과 저장 */
  setUserDecomposed: (id: number, decomposed: HangulChar[]) => void;

  /** ✅ 원문(성경절) 분해 결과 저장 */
  setOrigDecomposed: (id: number, decomposed: HangulChar[]) => void;

  /** ✅ 전체 초기화 */
  resetAll: () => void;
}

export const useTypingStore = create<TypingState>((set) => ({
  userTypedMap: {},
  userDecomposedMap: {},
  origDecomposedMap: {},

  // ✅ 순수 setter들
  setUserTyped: (id, value) =>
    set((state) => ({
      userTypedMap: { ...state.userTypedMap, [id]: value },
    })),

  setUserDecomposed: (id, decomposed) =>
    set((state) => ({
      userDecomposedMap: { ...state.userDecomposedMap, [id]: decomposed },
    })),

  setOrigDecomposed: (id, decomposed) =>
    set((state) => ({
      origDecomposedMap: { ...state.origDecomposedMap, [id]: decomposed },
    })),

  // ✅ 전체 초기화
  resetAll: () =>
    set({
      userTypedMap: {},
      userDecomposedMap: {},
      origDecomposedMap: {},
    }),
}));
