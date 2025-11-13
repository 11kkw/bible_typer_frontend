"use client";

import clsx from "clsx";
import { useMemo } from "react";
import { useTypingStore } from "../stores/useTypingStore";
import { TypedChar } from "../types";

interface TypingTextProps {
  verseId: number;
  className?: string;
}

const EMPTY_TYPED = Object.freeze([]) as unknown as TypedChar[];

export function TypingText({ verseId, className }: TypingTextProps) {
  const typedList = useTypingStore(
    (s) => s.userTypedMap[verseId] ?? EMPTY_TYPED
  );
  const origChars = useTypingStore((s) => s.origDecomposedMap[verseId]);

  const charEntries = useMemo(() => {
    const totalLength = Math.max(origChars?.length ?? 0, typedList.length);
    const entries: Array<{ char: string; status: TypedChar["status"] }> = [];

    for (let i = 0; i < totalLength; i++) {
      const baseChar = origChars?.[i]?.char ?? "";
      const typed = typedList[i];

      if (!typed) {
        entries.push({
          char: baseChar,
          status: "pending",
        });
        continue;
      }

      entries.push({
        char: typed.char ?? baseChar,
        status: typed.status,
      });
    }

    return entries;
  }, [origChars, typedList]);

  return (
    <div
      className={clsx(
        "typed-text whitespace-pre-wrap break-words text-3xl leading-[1.625] font-normal tracking-normal z-20 select-none pointer-events-none",
        className
      )}
    >
      {charEntries.map(({ char, status }, i) => {
        return (
          <span
            key={i}
            className={clsx({
              "text-[#2D3748]": status === "correct" || status === "current",
              "text-[#F56565] underline decoration-[#F56565]":
                status === "incorrect",
              "text-transparent": status === "pending",
            })}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
}
