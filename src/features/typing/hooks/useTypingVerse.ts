import { composeHangul, decomposeHangulString } from "@/core/utils/disassemble";
import { ComparedChar, Verse } from "@/types/models/bible";
import { useMemo, useState } from "react";

export function useTypingVerse(verse: Verse) {
  const [userTyped, setUserTyped] = useState("");

  const compared: ComparedChar[] = useMemo(() => {
    const origChars = decomposeHangulString(verse.text);
    const typedChars = decomposeHangulString(userTyped);

    return origChars.map((orig, i) => {
      const typed = typedChars[i];
      if (!typed) return { char: orig.char, status: "pending" };

      const composed = composeHangul(
        typed.parts[0] ?? "",
        typed.parts[1] ?? "",
        typed.parts[2] ?? ""
      );
      if (i === typedChars.length - 1 && userTyped.length < verse.text.length) {
        const mismatch = typed.parts.some((p, idx) => p !== orig.parts[idx]);
        return { char: composed, status: mismatch ? "incorrect" : "current" };
      }
      return composed === orig.char
        ? { char: orig.char, status: "correct" }
        : { char: composed, status: "incorrect" };
    });
  }, [userTyped, verse.text]);

  return { userTyped, setUserTyped, compared };
}
