"use client";
import { forwardRef, useCallback, useEffect, useRef } from "react";

interface TypingInputProps {
  value: string;
  onChange: (v: string) => void;
  onNext?: () => void;
  onPrev?: () => void;
  targetLength?: number; // 목표 음절 수
  autoNextOnComplete?: boolean;
  autoNextOnOverflow?: boolean;
  enterToNext?: boolean;
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
      enterToNext = true,
    },
    ref
  ) => {
    const cfgRef = useRef({
      onNext,
      onPrev,
      targetLength,
      autoNextOnComplete,
      autoNextOnOverflow,
      enterToNext,
    });
    useEffect(() => {
      cfgRef.current = {
        onNext,
        onPrev,
        targetLength,
        autoNextOnComplete,
        autoNextOnOverflow,
        enterToNext,
      };
    }, [
      onNext,
      onPrev,
      targetLength,
      autoNextOnComplete,
      autoNextOnOverflow,
      enterToNext,
    ]);

    const nextLockRef = useRef(false);
    const lockTimerRef = useRef<number | null>(null);
    const safeNext = () => {
      if (nextLockRef.current) return;
      nextLockRef.current = true;
      cfgRef.current.onNext?.();
      lockTimerRef.current = window.setTimeout(() => {
        nextLockRef.current = false;
        lockTimerRef.current = null;
      }, 150);
    };
    useEffect(() => {
      return () => {
        if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
      };
    }, []);

    const countCompletedCharacters = (text: string) => {
      // 자모 범위: ㄱ-ㅣ (U+3131–U+3163)
      // 완성된 한글: 가-힣 (U+AC00–U+D7A3)
      // 자모만 제거 후 남은 길이를 계산
      return text.normalize("NFC").replace(/[\u3131-\u3163]/g, "").length;
    };

    const measureOverflowAndMaybeNext = (
      el: HTMLTextAreaElement,
      val: string
    ) => {
      const { targetLength, autoNextOnComplete, autoNextOnOverflow } =
        cfgRef.current;

      // ✅ 조합 완료된 문자 기준으로 판단
      const completedLen = countCompletedCharacters(val);

      // 1) 완성된 글자 수 기준
      if (autoNextOnComplete && typeof targetLength === "number") {
        if (completedLen >= targetLength) {
          safeNext();
          return;
        }
      }

      // 2) 오버플로우 기준
      if (autoNextOnOverflow) {
        requestAnimationFrame(() => {
          const hasNewline = val.includes("\n");
          const overflowed = el.scrollHeight > el.clientHeight;
          if (hasNewline || overflowed) {
            safeNext();
          }
        });
      }
    };

    const handleChange = useCallback(
      (e: React.FormEvent<HTMLTextAreaElement>) => {
        const nextVal = e.currentTarget.value;
        onChange(nextVal);
        measureOverflowAndMaybeNext(e.currentTarget, nextVal);
      },
      [onChange]
    );

    const handleCompositionEnd = useCallback(
      (e: React.CompositionEvent<HTMLTextAreaElement>) => {
        const el = e.currentTarget;
        measureOverflowAndMaybeNext(el, el.value);
      },
      []
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // IME 조합 중 Enter는 무시
        // @ts-ignore
        if (e.isComposing || (e.nativeEvent as any)?.isComposing) return;

        if (e.key === "Enter" && cfgRef.current.enterToNext) {
          e.preventDefault();
          safeNext();
          return;
        }

        if (e.key === "Backspace" && e.currentTarget.value.length === 0) {
          e.preventDefault();
          cfgRef.current.onPrev?.();
          return;
        }
      },
      []
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
        className="absolute inset-0 w-full h-full text-transparent caret-[#68D391] cursor-text z-10 resize-none bg-transparent border-none p-0"
      />
    );
  }
);

TypingInput.displayName = "TypingInput";
