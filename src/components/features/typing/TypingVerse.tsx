import { Verse } from "@/types/models/bible";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
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
  const [typed, setTyped] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isActive) inputRef.current?.focus();
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    if (typed.length >= verse.text.length && verse.text.length > 0) {
      onNext?.();
    } else if (typed.length === 0) {
      const handleBackspace = (e: KeyboardEvent) => {
        if (e.key === "Backspace") onPrev?.();
      };
      window.addEventListener("keydown", handleBackspace);
      return () => window.removeEventListener("keydown", handleBackspace);
    }
  }, [typed, verse.text.length, onNext, onPrev, isActive]);

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

      <TypingText text={verse.text} typed={typed} />
      <TypingInput ref={inputRef} value={typed} onChange={setTyped} />
    </div>
  );
}
