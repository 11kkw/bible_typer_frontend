"use client";

import { decomposeHangulString } from "@/core/utils/disassemble";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useTransition,
} from "react";
import { useTypingLogStore } from "../stores/useTypingLogStore";
import { useTypingStore } from "../stores/useTypingStore";
import { compareVerseParts } from "../utils/compareVerseParts";

interface TypingInputProps {
  verseId: number;
  text: string;
  onNext?: () => void;
  onPrev?: () => void;
}

export const TypingInput = forwardRef<HTMLTextAreaElement, TypingInputProps>(
  ({ verseId, text, onNext, onPrev }, ref) => {
    const setUserTyped = useTypingStore((s) => s.setUserTyped);
    const orig = useTypingStore((s) => s.origDecomposedMap[verseId]);
    const expectedParts = useMemo(() => {
      if (!orig) return [];
      return orig.flatMap((ch) =>
        ch.parts.map((part, idx) => ({
          part,
          syllable: ch.char,
          partIndex: idx,
        }))
      );
    }, [orig]);
    const totalLen = expectedParts.length;
    const startVerseLogging = useTypingLogStore((s) => s.startVerseLogging);
    const appendEvent = useTypingLogStore((s) => s.appendEvent);
    const [, startTransition] = useTransition();

    // ── 가드 상태 ─────────────────────────────────────────────
    const enterLockRef = useRef(false);
    const skipAutoNextRef = useRef(false);
    const lastValueRef = useRef("");
    const lastTypedLengthRef = useRef(0);
    const isComposingRef = useRef(false);
    const pendingValueRef = useRef<string | null>(null);
    const rafIdRef = useRef<number | null>(null);

    const triggerNext = useCallback(() => {
      onNext?.();
    }, [onNext]);

    const processPendingValue = useCallback(() => {
      if (!orig) return;
      const val = pendingValueRef.current;
      if (val == null || val === lastValueRef.current) return;

      pendingValueRef.current = null;

      const userDecomposed = decomposeHangulString(val);
      const typedLen = userDecomposed.reduce(
        (len, ch) => len + ch.parts.length,
        0
      );
      const compared = compareVerseParts(orig, userDecomposed);
      startTransition(() => {
        setUserTyped(verseId, compared);
      });

      const last = compared.at(-1);

      lastValueRef.current = val;
      lastTypedLengthRef.current = typedLen;

      if (skipAutoNextRef.current) {
        skipAutoNextRef.current = false;
        return;
      }

      const shouldAutoNext =
        typedLen >= totalLen &&
        last &&
        (last.status === "correct" || last.status === "incorrect");

      if (shouldAutoNext) triggerNext();
    }, [
      orig,
      setUserTyped,
      startTransition,
      totalLen,
      triggerNext,
      verseId,
    ]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        pendingValueRef.current = e.target.value;
        if (rafIdRef.current != null) {
          cancelAnimationFrame(rafIdRef.current);
        }
        rafIdRef.current = requestAnimationFrame(() => {
          rafIdRef.current = null;
          processPendingValue();
        });
      },
      [processPendingValue]
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const el = e.currentTarget;
      const nativeEvent = e.nativeEvent as KeyboardEvent;
      const isComposing = nativeEvent.isComposing === true;

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
        return;
      }

      const isCharInput =
        e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey;

      if (isCharInput) {
        const pos = lastTypedLengthRef.current;
        const expected = expectedParts[pos];
        const expectedChar = expected?.part ?? expected?.syllable ?? "";
        const isError = expectedChar.length > 0 ? expectedChar !== e.key : true;

        appendEvent(verseId, {
          key_type: "input",
          char: e.key,
          raw_key: e.key,
          key_code: e.code,
          expected_char: expectedChar,
          is_error: isError,
          position: pos,
        });
        return;
      }

      if (e.key === "Backspace") {
        const pos = lastTypedLengthRef.current - 1;
        if (pos < 0) return;
        const expected = expectedParts[pos];

        appendEvent(verseId, {
          key_type: "delete",
          char: "",
          raw_key: e.key,
          key_code: e.code,
          expected_char: expected?.part ?? expected?.syllable ?? "",
          is_error: false,
          position: pos,
        });
      }
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter") enterLockRef.current = false;
    };

    useEffect(() => {
      startVerseLogging(verseId);
      lastTypedLengthRef.current = 0;
      lastValueRef.current = "";
      pendingValueRef.current = null;
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    }, [startVerseLogging, verseId]);

    useEffect(() => {
      return () => {
        if (rafIdRef.current != null) {
          cancelAnimationFrame(rafIdRef.current);
        }
      };
    }, []);

    return (
      <textarea
        ref={ref}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onCompositionStart={() => {
          isComposingRef.current = true;
        }}
        onCompositionEnd={() => {
          isComposingRef.current = false;
        }}
        spellCheck={false}
        className="
          absolute inset-0 w-full h-full
          text-3xl font-normal
          text-transparent caret-[#68D391]
          bg-transparent
          resize-none outline-none
          whitespace-pre-wrap break-words tracking-normal
          overflow-hidden
          pr-3 sm:pr-4 lg:pr-8
          [user-select:text!important]
        "
        style={{
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          lineHeight: "1.625",
          letterSpacing: "normal",
          fontFamily: "inherit",
        }}
      />
    );
  }
);

TypingInput.displayName = "TypingInput";
