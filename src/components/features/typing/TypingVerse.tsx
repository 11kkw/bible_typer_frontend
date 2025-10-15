import { useTypingVerse } from "@/hooks/useTypingVerse";
import { Verse } from "@/types/models/bible";
import clsx from "clsx";
import { useEffect, useRef } from "react";
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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { userTyped, setUserTyped, compared } = useTypingVerse({
    verse,
    isActive,
  });

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
      <div className="opacity-40 text-gray-400 absolute top-0 left-0 pointer-events-none whitespace-pre-wrap">
        {verse.text}
      </div>

      <TypingText compared={compared} />

      <TypingInput
        ref={inputRef}
        value={userTyped}
        onChange={setUserTyped}
        onNext={onNext}
        onPrev={onPrev}
        // ⬇️ 추가
        targetLength={verse.text.length}
        autoNextOnComplete={true}
        autoNextOnOverflow={true}
        // disabled={!isActive} // 필요하면 활성 절만 입력 허용
      />
    </div>
  );
}
