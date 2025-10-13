"use client";

import { Verse } from "@/types/models/bible";
import { useState } from "react";
import { TypingInput } from "./TypingInput";
import { TypingText } from "./TypingText";

interface TypingVerseProps {
  verse: Verse;
}

export function TypingVerse({ verse }: TypingVerseProps) {
  const [typed, setTyped] = useState("");

  return (
    <div className="relative text-3xl leading-relaxed font-normal typing-verse">
      {/* 원본 텍스트 (희미하게 표시) */}
      <div className="opacity-40 text-gray-400 absolute top-0 left-0 pointer-events-none whitespace-pre-wrap">
        {verse.text}
      </div>

      {/* 비교 결과 표시 */}
      <TypingText text={verse.text} typed={typed} />

      {/* 절별 입력창 */}
      <TypingInput value={typed} onChange={setTyped} />
    </div>
  );
}
