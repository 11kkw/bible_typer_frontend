"use client";

import { decomposeHangulString } from "@/core/utils/disassemble";
import { forwardRef, useCallback, useRef } from "react";
import { useTypingStore } from "../stores/useTypingStore";
import { compareVerseParts } from "../utils/compareVerseParts";

interface TypingInputProps {
  verseId: number;
  onNext?: () => void;
  onPrev?: () => void;
}

export const TypingInput = forwardRef<HTMLTextAreaElement, TypingInputProps>(
  ({ verseId, onNext, onPrev }, ref) => {
    const { setUserTyped } = useTypingStore.getState();
    const orig = useTypingStore((s) => s.origDecomposedMap[verseId]);
    const totalLen = orig?.reduce((sum, c) => sum + c.parts.length, 0) ?? 0;

    // ── 가드 상태 ─────────────────────────────────────────────
    const enterLockRef = useRef(false);
    const skipAutoNextRef = useRef(false);

    const triggerNext = useCallback(() => {
      onNext?.();
    }, [onNext]);

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

        if (skipAutoNextRef.current) {
          skipAutoNextRef.current = false;
          return;
        }

        const shouldAutoNext =
          typedLen >= totalLen &&
          last &&
          (last.status === "correct" || last.status === "incorrect");

        if (shouldAutoNext) triggerNext();
      },
      [verseId, orig, totalLen, setUserTyped, triggerNext]
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const el = e.currentTarget;
      const isComposing = (e.nativeEvent as any)?.isComposing === true;

      if (e.key === "Enter") {
        if (isComposing || e.repeat || enterLockRef.current) return;
        enterLockRef.current = true;
        e.preventDefault();

        skipAutoNextRef.current = true;
        const prevValue = el.value;
        requestAnimationFrame(() => {
          if (el.value !== prevValue) el.value = prevValue;
        });
        triggerNext();
        return;
      }

      if (e.key === "Backspace" && el.value.length === 0) {
        e.preventDefault();
        onPrev?.();
      }
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter") enterLockRef.current = false;
    };

    return (
      <textarea
        ref={ref}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        spellCheck={false}
        className="
          absolute inset-0 w-full h-full
          text-3xl leading-relaxed font-normal
          text-transparent caret-[#68D391]
          bg-transparent border-none resize-none outline-none
          whitespace-pre-wrap break-all tracking-normal
          overflow-hidden
          [user-select:text!important]
        "
        style={{
          padding: 0,
          lineHeight: "1.625",
          letterSpacing: "normal",
          fontFamily: "inherit",
        }}
      />
    );
  }
);

TypingInput.displayName = "TypingInput";
