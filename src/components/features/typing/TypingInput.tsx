"use client";
import { forwardRef, useCallback, useEffect, useRef } from "react";

interface TypingInputProps {
  value: string;
  onChange: (v: string) => void;
  onNext?: () => void;
  onPrev?: () => void;
  targetLength?: number; // 원문 길이
  autoNextOnComplete?: boolean; // 길이 다 차면 자동 이동
  autoNextOnOverflow?: boolean; // 줄바꿈/오버플로우면 자동 이동
  enterToNext?: boolean; // Enter로 다음 절 이동 (기본 true)
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
    // 최신 props를 ref에 싱크 -> 핸들러는 고정
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
    useEffect(
      () => () => {
        if (lockTimerRef.current) {
          clearTimeout(lockTimerRef.current);
        }
      },
      []
    );

    const measureOverflowAndMaybeNext = (
      el: HTMLTextAreaElement,
      val: string
    ) => {
      const { targetLength, autoNextOnComplete, autoNextOnOverflow } =
        cfgRef.current;

      // 1) 길이 기준 (>= 로 수정)
      if (autoNextOnComplete && typeof targetLength === "number") {
        if (val.length >= targetLength) {
          safeNext();
          return;
        }
      }

      // 2) 오버플로우 기준 (레이아웃 확정 후 측정)
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
        // IME 조합 중 Enter는 무시 (중복 이동 예방)
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
