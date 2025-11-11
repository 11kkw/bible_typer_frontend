// features/typing/stores/useTypingStore.ts
import { HangulChar } from "@/types/models/Hangul";
import { create } from "zustand";
import { TypedChar } from "../types";

/**
 * 📦 Typing 상태 관리 Store (순수 저장소 전용)
 * - 오직 상태 저장 및 수정만 담당
 * - 한글 분해, 캐싱, 비교 등의 계산 로직은 포함하지 않음
 */
interface TypingState {
  /** 유저 입력 문자열 (verse.id → text) */
  userTypedMap: Record<number, TypedChar[]>;

  userDecomposedMap: Record<number, HangulChar[]>;

  origDecomposedMap: Record<number, HangulChar[]>;

  /** 세션 완료 후 측정 정지 여부 */
  isSessionFrozen: boolean;

  setUserTyped: (id: number, chars: TypedChar[]) => void;

  setUserDecomposed: (id: number, decomposed: HangulChar[]) => void;

  setOrigDecomposed: (id: number, decomposed: HangulChar[]) => void;

  setSessionFrozen: (frozen: boolean) => void;

  resetAll: () => void;
}

export const useTypingStore = create<TypingState>((set) => ({
  userTypedMap: {},
  userDecomposedMap: {},
  origDecomposedMap: {},
  isSessionFrozen: false,

  // ✅ 순수 setter들
  setUserTyped: (id, chars) =>
    set((state) => ({
      userTypedMap: { ...state.userTypedMap, [id]: chars },
    })),

  setUserDecomposed: (id, decomposed) =>
    set((state) => ({
      userDecomposedMap: { ...state.userDecomposedMap, [id]: decomposed },
    })),

  setOrigDecomposed: (id, decomposed) =>
    set((state) => ({
      origDecomposedMap: { ...state.origDecomposedMap, [id]: decomposed },
    })),

  setSessionFrozen: (frozen) => set({ isSessionFrozen: frozen }),

  // ✅ 전체 초기화
  resetAll: () =>
    set({
      userTypedMap: {},
      userDecomposedMap: {},
      origDecomposedMap: {},
      isSessionFrozen: false,
    }),
}));
