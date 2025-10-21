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
    const enterLockRef = useRef(false); // keyup(Enter)에서 해제
    const skipAutoNextRef = useRef(false); // Enter 직후 onChange 자동 이동 1회 스킵

    // onNext 래퍼
    const triggerNext = useCallback(() => {
      onNext?.();
    }, [onNext]);

    // ── onChange: 비교/저장 + 자동 이동(조건 충족 시) ─────────
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

        // Enter에서 이미 이동한 직후라면 자동 이동 1회 스킵
        if (skipAutoNextRef.current) {
          skipAutoNextRef.current = false;
          return;
        }

        const shouldAutoNext =
          typedLen >= totalLen &&
          last &&
          (last.status === "correct" || last.status === "incorrect");

        if (shouldAutoNext) {
          triggerNext();
        }
      },
      [verseId, orig, totalLen, setUserTyped, triggerNext]
    );

    // ── onKeyDown: Enter/Backspace 처리 + 가드 ────────────────
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const el = e.currentTarget;
      const isComposing = (e.nativeEvent as any)?.isComposing === true;

      // Enter 처리
      if (e.key === "Enter") {
        // IME 조합 중이거나 키 반복이면 무시
        if (isComposing) return;
        if (e.repeat) return;
        // 락으로 연타 방지 (keyup에서 해제)
        if (enterLockRef.current) return;
        enterLockRef.current = true;

        e.preventDefault();

        // 다음 onChange 자동 이동은 1회 스킵
        skipAutoNextRef.current = true;

        // 브라우저의 줄바꿈 삽입 차단(값 복원)
        const prevValue = el.value;
        requestAnimationFrame(() => {
          if (el.value !== prevValue) el.value = prevValue;
        });

        // (선택) 포커스 이전에 blur()로 OS 반복 끊기
        // el.blur();

        triggerNext();
        return;
      }

      // Backspace에서 이전 절로
      if (e.key === "Backspace" && el.value.length === 0) {
        e.preventDefault();
        onPrev?.();
      }
    };

    // ── onKeyUp: Enter 락 해제 ─────────────────────────────────
    const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter") {
        enterLockRef.current = false;
      }
    };

    return (
      <textarea
        ref={ref}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        spellCheck={false}
        className="absolute inset-0 w-full h-full text-transparent caret-[#68D391] bg-transparent border-none resize-none outline-none"
      />
    );
  }
);

TypingInput.displayName = "TypingInput";
