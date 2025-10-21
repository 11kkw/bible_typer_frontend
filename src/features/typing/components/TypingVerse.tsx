import { decomposeHangulString } from "@/core/utils/disassemble";
import { Verse } from "@/types/models/bible";
import clsx from "clsx";
import { useEffect, useRef } from "react"; // ✅ useRef 추가!
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
      className={clsx(
        "relative text-3xl leading-relaxed font-normal typing-verse",
        className
      )}
      onClick={onActivate}
    >
      {/* 회색 원문 */}
      <div className="opacity-40 text-gray-400 pointer-events-none whitespace-pre-wrap">
        {verse.text}
      </div>

      {/* 유저 입력 */}
      <div className="absolute top-0 left-0 pointer-events-none">
        <TypingText verseId={verse.id} />
      </div>

      {/* 투명 입력창 */}
      <TypingInput
        verseId={verse.id}
        ref={inputRef}
        onNext={onNext}
        onPrev={onPrev}
      />
    </div>
  );
}
