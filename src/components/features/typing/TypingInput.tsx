"use client";
import { forwardRef, useCallback, useRef } from "react";

interface TypingInputProps {
  value: string;
  onChange: (v: string) => void;
  onNext?: () => void;
  onPrev?: () => void;
  targetLength?: number; // 원문 길이
  autoNextOnComplete?: boolean; // 길이 다 차면 자동 이동
  autoNextOnOverflow?: boolean; // 줄바꿈/오버플로우면 자동 이동
}

export const TypingInput = forwardRef<HTMLTextAreaElement, TypingInputProps>(
  (
    {
      value,
      onChange,
      onNext,
      onPrev,
      targetLength,
      autoNextOnComplete = true,
      autoNextOnOverflow = false,
    },
    ref
  ) => {
    // onNext 중복 호출 방지 락
    const nextLockRef = useRef(false);

    const safeNext = () => {
      if (nextLockRef.current) return;
      nextLockRef.current = true;
      onNext?.();
      setTimeout(() => (nextLockRef.current = false), 150);
    };

    const tryAutoNext = (el: HTMLTextAreaElement, val: string) => {
      // 1) 길이 기준
      if (autoNextOnComplete && typeof targetLength === "number") {
        if (val.length > targetLength) {
          safeNext();
          return;
        }
      }
      // 2) 오버플로우 기준
      if (autoNextOnOverflow) {
        const hasNewline = val.includes("\n");
        const overflowed = el.scrollHeight > el.clientHeight;
        if (hasNewline || overflowed) {
          safeNext();
        }
      }
    };

    const handleChange = useCallback(
      (e: React.FormEvent<HTMLTextAreaElement>) => {
        const nextVal = e.currentTarget.value;
        onChange(nextVal);
        // 현재 값으로 검사 (stale value 방지)
        tryAutoNext(e.currentTarget, nextVal);
      },
      [onChange, targetLength, autoNextOnComplete, autoNextOnOverflow]
    );

    const handleCompositionEnd = useCallback(
      (e: React.CompositionEvent<HTMLTextAreaElement>) => {
        tryAutoNext(e.currentTarget, e.currentTarget.value);
      },
      [targetLength, autoNextOnComplete, autoNextOnOverflow]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // 한글 IME 조합 중 Enter는 무시 (중복 이동 예방)
        // @ts-ignore
        if (e.isComposing || (e.nativeEvent as any)?.isComposing) return;

        if (e.key === "Enter") {
          e.preventDefault();
          safeNext(); // ← Enter 이동도 락으로 보호
          return;
        }
        if (e.key === "Backspace" && e.currentTarget.value.length === 0) {
          e.preventDefault();
          onPrev?.();
          return;
        }
      },
      [onPrev]
    );

    return (
      <textarea
        ref={ref}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onCompositionEnd={handleCompositionEnd}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        className="
          absolute inset-0 w-full h-full
          text-transparent caret-[#68D391]
          cursor-text z-10 resize-none bg-transparent border-none p-0
        "
      />
    );
  }
);

TypingInput.displayName = "TypingInput";
