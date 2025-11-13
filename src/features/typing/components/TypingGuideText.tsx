"use client";

import clsx from "clsx";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTypingStore } from "../stores/useTypingStore";
import { TypedChar } from "../types";

interface TypingGuideTextProps {
  verseId: number;
  text: string;
  className?: string;
}

const EMPTY_TYPED = Object.freeze([]) as unknown as TypedChar[];
const isSpaceChar = (ch?: string) =>
  ch === " " || ch === "\t" || ch === "\u00a0";

interface Marker {
  targetIndex: number;
  spaceIndex: number;
  left: number;
  top: number;
}

export function TypingGuideText({
  verseId,
  text,
  className,
}: TypingGuideTextProps) {
  const typedList = useTypingStore(
    (s) => s.userTypedMap[verseId] ?? EMPTY_TYPED
  );
  const chars = useMemo(() => Array.from(text ?? ""), [text]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lineHeightRef = useRef(0);
  const [markers, setMarkers] = useState<Marker[]>([]);

  useLayoutEffect(() => {
    spanRefs.current = spanRefs.current.slice(0, chars.length);
  }, [chars.length]);

  useLayoutEffect(() => {
    let rafId: number;

    const computeLineHeight = () => {
      const container = containerRef.current;
      if (!container) return;
      const computed = window.getComputedStyle(container);
      let lineHeight = parseFloat(computed.lineHeight);
      if (!Number.isFinite(lineHeight)) {
        const fontSize = parseFloat(computed.fontSize) || 16;
        lineHeight = fontSize * 1.4;
      }
      lineHeightRef.current = lineHeight;
    };

    const computeWrappedSpaces = () => {
      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const nextMarkers: Marker[] = [];

      for (let i = 0; i < chars.length; i++) {
        if (!isSpaceChar(chars[i])) continue;
        const spaceSpan = spanRefs.current[i];
        const nextSpan = spanRefs.current[i + 1];
        const targetIndex = i > 0 ? i - 1 : i;
        const targetSpan = spanRefs.current[targetIndex];
        if (!spaceSpan || !targetSpan) continue;

        if (!nextSpan) {
          const targetRect = targetSpan.getBoundingClientRect();
          nextMarkers.push({
            targetIndex,
            spaceIndex: i,
            left: targetRect.right - containerRect.left,
            top: targetRect.bottom - containerRect.top,
          });
          continue;
        }

        const spaceRect = spaceSpan.getBoundingClientRect();
        const nextRect = nextSpan.getBoundingClientRect();
        const targetRect = targetSpan.getBoundingClientRect();
        const topDiff = Math.abs(nextRect.top - spaceRect.top);
        const threshold =
          (lineHeightRef.current || spaceRect.height || 0) * 0.45;
        const movedToNextLine =
          topDiff > threshold || nextRect.left < spaceRect.left - 0.5;

        if (movedToNextLine) {
          nextMarkers.push({
            targetIndex,
            spaceIndex: i,
            left: targetRect.right - containerRect.left,
            top: targetRect.bottom - containerRect.top,
          });
        }
      }

      setMarkers(nextMarkers);
    };

    const scheduleCompute = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => computeWrappedSpaces());
    };

    computeLineHeight();
    scheduleCompute();

    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      computeLineHeight();
      scheduleCompute();
    });
    observer.observe(container);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [chars, typedList]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        "text-transparent whitespace-pre-wrap break-words text-3xl leading-[1.625] font-normal tracking-normal select-none relative",
        className
      )}
    >
      {chars.map((char, i) => (
        <span
          key={i}
          ref={(el) => {
            spanRefs.current[i] = el;
          }}
          className="text-transparent"
        >
          {char}
        </span>
      ))}

      {markers.map(({ targetIndex, spaceIndex, left, top }) => {
        const status = typedList[spaceIndex]?.status;
        if (status === "correct") return null;
        const color =
          status === "incorrect" ? "bg-red-500" : "bg-emerald-400";
        return (
          <span
            key={`${targetIndex}-${spaceIndex}`}
            className={clsx(
              "pointer-events-none absolute h-[3px] w-3 rounded-full",
              color
            )}
            style={{
              left,
              top: top - 3,
            }}
          />
        );
      })}
    </div>
  );
}
