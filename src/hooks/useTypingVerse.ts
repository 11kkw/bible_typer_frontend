import { composeHangul, decomposeHangulString } from "@/lib/utils/disassemble";
import { ComparedChar, Verse } from "@/types/models/bible";
import { useMemo, useState } from "react";

interface UseTypingVerseProps {
  verse: Verse;
  isActive?: boolean;
}

export function useTypingVerse({ verse, isActive }: UseTypingVerseProps) {
  const [userTyped, setUserTyped] = useState("");

  const decomposedVerse = useMemo(
    () => decomposeHangulString(verse.text),
    [verse.text]
  );

  // 글자 비교
  const compared: ComparedChar[] = useMemo(() => {
    const typedChars = decomposeHangulString(userTyped);

    return decomposedVerse.map((origChar, i) => {
      const typedChar = typedChars[i];
      if (!typedChar)
        return { char: origChar.char, status: "pending" } as ComparedChar;

      const composed = composeHangul(
        typedChar.parts[0] ?? "",
        typedChar.parts[1] ?? "",
        typedChar.parts[2] ?? ""
      );

      if (i === typedChars.length - 1 && userTyped.length < verse.text.length) {
        const isMismatch = typedChar.parts.some(
          (p, idx) => p !== origChar.parts[idx]
        );
        return { char: composed, status: isMismatch ? "incorrect" : "current" };
      }

      return composed === origChar.char
        ? { char: origChar.char, status: "correct" }
        : { char: composed, status: "incorrect" };
    });
  }, [userTyped, decomposedVerse, verse.text.length]);

  return { userTyped, setUserTyped, compared };
}
