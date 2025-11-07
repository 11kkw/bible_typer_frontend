"use client";

import clsx from "clsx";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTypingStore } from "../stores/useTypingStore";
import { TypedChar } from "../types";

interface TypingTextProps {
  verseId: number;
  highlightSpaceIndices?: Set<number>;
}

const EMPTY_TYPED = Object.freeze([]) as unknown as TypedChar[];
const EMPTY_SET = Object.freeze(new Set<number>());

export function TypingText({
  verseId,
  highlightSpaceIndices = EMPTY_SET,
}: TypingTextProps) {
  const typedList = useTypingStore(
    (s) => s.userTypedMap[verseId] ?? EMPTY_TYPED
  );
  const containerRef = useRef<HTMLDivElement | null>(null);
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [autoWrapSpaces, setAutoWrapSpaces] = useState<Set<number>>(
    () => new Set()
  );

  useLayoutEffect(() => {
    spanRefs.current = spanRefs.current.slice(0, typedList.length);
  }, [typedList.length]);

  useLayoutEffect(() => {
    const computeWraps = () => {
      const nextSet = new Set<number>();
      for (let i = 0; i < typedList.length - 1; i++) {
        const current = spanRefs.current[i];
        const next = spanRefs.current[i + 1];
        const char = typedList[i];
        if (!current || !next || char?.char !== " ") continue;
        if (char.status === "correct" || char.status === "incorrect") continue;
        const currentTop = current.offsetTop;
        const nextTop = next.offsetTop;
        if (currentTop !== nextTop) {
          nextSet.add(i);
        }
      }
      setAutoWrapSpaces((prev) => {
        const prevSize = prev.size;
        if (prevSize === nextSet.size) {
          let identical = true;
          for (const val of prev) {
            if (!nextSet.has(val)) {
              identical = false;
              break;
            }
          }
          if (identical) return prev;
        }
        return nextSet;
      });
    };

    computeWraps();

    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => computeWraps());
    observer.observe(container);
    return () => observer.disconnect();
  }, [typedList]);

  const combinedHighlight = useMemo(() => {
    const merged = new Set<number>();
    highlightSpaceIndices.forEach((idx) => merged.add(idx));
    autoWrapSpaces.forEach((idx) => merged.add(idx));
    return merged;
  }, [highlightSpaceIndices, autoWrapSpaces]);

  return (
    <div
      ref={containerRef}
      className="typed-text whitespace-pre-wrap relative z-20"
    >
      {typedList.map(({ char, status }, i) => {
        const isResolved = status === "correct" || status === "incorrect";
        const shouldHighlightSpace =
          char === " " && combinedHighlight.has(i) && !isResolved;
        return (
          <span
            key={i}
            ref={(el) => {
              spanRefs.current[i] = el;
            }}
            className={clsx("relative inline-block", {
              "text-[#2D3748]": status === "correct" || status === "current",
              "text-[#F56565] underline decoration-[#F56565]":
                status === "incorrect",
              "text-transparent": status === "pending",
            })}
          >
            {char}
            {shouldHighlightSpace && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-1 left-1/2 flex w-6 -translate-x-1/2 translate-x-[2px] justify-center font-semibold text-emerald-500 leading-none"
              >
                __
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
