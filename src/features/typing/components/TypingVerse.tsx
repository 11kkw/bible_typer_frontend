import { decomposeHangulString } from "@/core/utils/disassemble";
import { Verse } from "@/types/models/bible";
import clsx from "clsx";
import { useEffect, useMemo, useRef } from "react";
import { useTypingStore } from "../stores/useTypingStore";
import { TypingInput } from "./TypingInput";
import { TypingText } from "./TypingText";

interface TypingVerseProps {
  verse: Verse;
  className?: string;
  onNext?: () => void;
  onPrev?: () => void;
  isActive?: boolean;
  onActivate?: () => void;
}

export function TypingVerse({
  verse,
  className,
  onNext,
  onPrev,
  isActive,
  onActivate,
}: TypingVerseProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null); // ✅ useRef 정상 작동
  const { setOrigDecomposed, origDecomposedMap } = useTypingStore();
  const referenceLabel = useMemo(() => {
    const bookTitle = verse.book_title?.trim();
    const chapterNumber =
      typeof verse.chapter_number === "number"
        ? verse.chapter_number
        : typeof verse.chapter === "number"
        ? verse.chapter
        : null;
    const verseNumber =
      typeof verse.number === "number" ? verse.number : undefined;

    if (bookTitle && chapterNumber && verseNumber) {
      return `${bookTitle.replace(
        /\s+/g,
        " "
      )} ${chapterNumber}장 ${verseNumber}절`;
    }

    if (verse.bcv?.trim()) return verse.bcv.trim();

    const chapterLabel =
      typeof chapterNumber === "number" ? `${chapterNumber}장` : "";
    const verseLabel = verseNumber ? `${verseNumber}절` : "";
    const fallback = `${chapterLabel} ${verseLabel}`.trim();

    return fallback || "";
  }, [
    verse.book_title,
    verse.chapter_number,
    verse.chapter,
    verse.number,
    verse.bcv,
  ]);

  useEffect(() => {
    if (!origDecomposedMap[verse.id]) {
      const decomposed = decomposeHangulString(verse.text);
      setOrigDecomposed(verse.id, decomposed);
    }
  }, [verse.id, verse.text, origDecomposedMap, setOrigDecomposed]);

  useEffect(() => {
    if (isActive) inputRef.current?.focus();
    else inputRef.current?.blur();
  }, [isActive]);

  return (
    <div
      className={clsx("typing-verse space-y-3 py-4", className)}
      onClick={onActivate}
    >
      {referenceLabel && (
        <div className="text-base font-semibold text-primary/80 tracking-tight">
          {referenceLabel}
        </div>
      )}

      <div className="relative">
        {/* 회색 원문 */}
        <div className="opacity-40 text-gray-400 whitespace-pre-wrap break-words text-3xl leading-[1.625] font-normal tracking-normal pr-3 sm:pr-4 lg:pr-8">
          {verse.text}
        </div>

        {/* 유저 입력 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="whitespace-pre-wrap break-words text-3xl leading-[1.625] font-normal tracking-normal pr-3 sm:pr-4 lg:pr-8">
            <TypingText verseId={verse.id} />
          </div>
        </div>

        {/* 투명 입력창 */}
        <TypingInput
          verseId={verse.id}
          ref={inputRef}
          onNext={onNext}
          onPrev={onPrev}
        />
      </div>
    </div>
  );
}
