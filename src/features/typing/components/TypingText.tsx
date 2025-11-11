"use client";

import clsx from "clsx";
import { useTypingStore } from "../stores/useTypingStore";
import { TypedChar } from "../types";

interface TypingTextProps {
  verseId: number;
}

const EMPTY_TYPED = Object.freeze([]) as unknown as TypedChar[];

export function TypingText({ verseId }: TypingTextProps) {
  const typedList = useTypingStore(
    (s) => s.userTypedMap[verseId] ?? EMPTY_TYPED
  );

  return (
    <div className="typed-text whitespace-pre-wrap break-words text-3xl leading-[1.625] font-normal tracking-normal relative z-20">
      {typedList.map(({ char, status }, i) => {
        return (
          <span
            key={i}
            className={clsx("relative inline-block", {
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
