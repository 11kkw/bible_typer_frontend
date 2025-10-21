"use client";

import { decomposeHangulString } from "@/core/utils/disassemble";
import { forwardRef, useCallback } from "react";
import { useTypingStore } from "../stores/useTypingStore";
import { compareVerseParts } from "../utils/compareVerseParts";

interface TypingInputProps {
  verseId: number;
  onNext?: () => void;
  onPrev?: () => void;
}

/**
 * ✅ TypingInput (간소화 버전)
 * - 사용자가 입력한 텍스트를 감지하고 비교 결과를 store에 반영
 * - IME 조합 상태 추적 제거 (조합 중 여부는 무시)
 */
export const TypingInput = forwardRef<HTMLTextAreaElement, TypingInputProps>(
  ({ verseId, onNext, onPrev }, ref) => {
    // ✅ setter만 정적으로 가져옴 (불변)
    const { setUserTyped } = useTypingStore.getState();

    // ✅ orig은 store에서 구독 (값이 바뀌면 렌더링 갱신됨)
    const orig = useTypingStore((s) => s.origDecomposedMap[verseId]);
    const totalLen = orig?.reduce((sum, c) => sum + c.parts.length, 0) ?? 0;

    /** ✅ 입력 변경 처리 */
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!orig) return;

        const val = e.target.value;
        const userDecomposed = decomposeHangulString(val);
        const compared = compareVerseParts(orig, userDecomposed);
        setUserTyped(verseId, compared);

        const typedLen = userDecomposed.reduce(
          (sum, c) => sum + c.parts.length,
          0
        );
        const last = compared.at(-1);

        if (
          typedLen >= totalLen &&
          last &&
          (last.status === "correct" || last.status === "incorrect")
        ) {
          onNext?.();
        }
      },
      [verseId, onNext, orig, totalLen, setUserTyped]
    );

    /** ✅ 특수 키 처리 (Enter, Backspace 등) */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const value = (e.target as HTMLTextAreaElement).value;

      if (e.key === "Enter") {
        e.preventDefault();
        onNext?.();
      } else if (e.key === "Backspace" && value.length === 0) {
        e.preventDefault();
        onPrev?.();
      }
    };

    return (
      <textarea
        ref={ref}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        className="absolute inset-0 w-full h-full text-transparent caret-[#68D391] bg-transparent border-none resize-none outline-none"
      />
    );
  }
);

TypingInput.displayName = "TypingInput";
