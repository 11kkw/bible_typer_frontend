"use client";
import { forwardRef, useCallback } from "react";

interface TypingInputProps {
  value: string;
  onChange: (v: string) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const TypingInput = forwardRef<HTMLTextAreaElement, TypingInputProps>(
  ({ value, onChange, onNext, onPrev }, ref) => {
    const handleChange = useCallback(
      (e: React.FormEvent<HTMLTextAreaElement>) => {
        onChange(e.currentTarget.value);
      },
      [onChange]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // 한글 조합(IME) 중 Enter는 무시 — 줄바꿈/중복 이동 방지
        // @ts-ignore
        if (e.isComposing || (e.nativeEvent as any)?.isComposing) return;

        if (e.key === "Enter") {
          e.preventDefault();
          onNext?.();
          return;
        }
        if (e.key === "Backspace" && e.currentTarget.value.length === 0) {
          e.preventDefault();
          onPrev?.();
          return;
        }
      },
      [onNext, onPrev]
    );

    return (
      <textarea
        ref={ref}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        className={`
          absolute inset-0 w-full h-full
          text-transparent caret-[#68D391]
          cursor-text z-10 resize-none bg-transparent border-none p-0
        `}
      />
    );
  }
);

TypingInput.displayName = "TypingInput";
