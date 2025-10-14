"use client";

import { composeHangul, decomposeHangulString } from "@/lib/utils/disassemble";
import { useCallback, useMemo } from "react";

interface TypingTextProps {
  text: string;
  typed: string;
}

export function TypingText({ text, typed }: TypingTextProps) {
  // 🔸 따옴표 통일 (함수 외부로 빼거나 useCallback으로 메모이징)
  const normalizeQuotes = useCallback((str: string) => {
    return str.replace(/'/g, "`").replace(/[‘’]/g, "`").replace(/[“”]/g, '"');
  }, []);

  const compared = useMemo(() => {
    const original = decomposeHangulString(normalizeQuotes(text));
    const typedChars = decomposeHangulString(normalizeQuotes(typed));

    return original.map((origChar, i) => {
      const typedChar = typedChars[i];
      if (!typedChar) return { char: origChar.char, status: "pending" };

      const origParts = origChar.parts;
      const typedParts = typedChar.parts;

      const composedTyped = composeHangul(
        typedParts[0] ?? "",
        typedParts[1] ?? "",
        typedParts[2] ?? ""
      );

      const isCurrent =
        i === typedChars.length - 1 && typed.length < text.length;

      if (isCurrent) {
        const partialMismatch = typedParts.some(
          (part, idx) => part !== origParts[idx]
        );
        return {
          char: composedTyped,
          status: partialMismatch ? "incorrect" : "current",
        };
      }

      if (composedTyped === origChar.char) {
        return { char: origChar.char, status: "correct" };
      }
      return { char: composedTyped, status: "incorrect" };
    });
  }, [text, typed, normalizeQuotes]);

  return (
    <div className="typed-text whitespace-pre-wrap">
      {compared.map(({ char, status }, i) => (
        <span
          key={i}
          className={
            status === "correct"
              ? "text-[#2D3748]"
              : status === "incorrect"
              ? "text-[#F56565] underline decoration-[#F56565]"
              : status === "current"
              ? "text-[#2D3748]"
              : "text-transparent"
          }
        >
          {char}
        </span>
      ))}
    </div>
  );
}
