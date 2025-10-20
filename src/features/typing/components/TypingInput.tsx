"use client";

import { decomposeHangulString } from "@/core/utils/disassemble";
import { forwardRef, useCallback } from "react";
import { useTypingStore } from "../stores/useTypingStore";

interface TypingInputProps {
  verseId: number;
  onNext?: () => void;
  onPrev?: () => void;
}

export const TypingInput = forwardRef<HTMLTextAreaElement, TypingInputProps>(
  ({ verseId, onNext, onPrev }, ref) => {
    const value = useTypingStore((s) => s.userTypedMap[verseId] ?? "");

    const totalLen = useTypingStore((s) => {
      const orig = s.origDecomposedMap[verseId];
      if (!orig) return 0;
      return orig.reduce((sum, ch) => sum + ch.parts.length, 0);
    });
    const { setUserTyped, setUserDecomposed } = useTypingStore.getState();

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const nextVal = e.target.value;
        const decomposed = decomposeHangulString(nextVal);

        setUserTyped(verseId, nextVal);
        setUserDecomposed(verseId, decomposed);

        const typedLen = decomposed.reduce(
          (sum, ch) => sum + ch.parts.length,
          0
        );

        // ✅ 디버그 로그
        console.log(
          `%c[TypingInput:%d]%c 입력됨 | value="%s" | typed=%d / total=%d`,
          "color:#22c55e;font-weight:bold;",
          verseId,
          "color:gray;",
          nextVal,
          typedLen,
          totalLen
        );

        // ✅ 입력 완료 시
        if (totalLen > 0 && typedLen >= totalLen) {
          console.log(
            `%c[TypingInput:%d]%c ✅ 자동 다음 절 이동 (typed=%d / total=%d)`,
            "color:#22c55e;font-weight:bold;",
            verseId,
            "color:gray;",
            typedLen,
            totalLen
          );
          onNext?.();
        }
      },
      [verseId, totalLen, onNext]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onNext?.();
        } else if (e.key === "Backspace" && value.length === 0) {
          e.preventDefault();
          onPrev?.();
        }
      },
      [value, onNext, onPrev]
    );

    /** 🪶 렌더 */
    return (
      <textarea
        ref={ref}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        className="absolute inset-0 w-full h-full text-transparent caret-[#68D391] bg-transparent border-none resize-none"
      />
    );
  }
);

TypingInput.displayName = "TypingInput";
