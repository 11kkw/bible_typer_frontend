import { composeHangul, decomposeHangulString } from "@/lib/utils/disassemble";
import { HangulChar } from "@/types/models/Hangul";

export function TypingText({ text, typed }: { text: string; typed: string }) {
  const originalDecomposed: HangulChar[] = decomposeHangulString(text);
  const typedDecomposed: HangulChar[] = decomposeHangulString(typed);

  const compared = originalDecomposed.map((origChar, i) => {
    const typedChar = typedDecomposed[i];
    if (!typedChar) return { char: origChar.char, status: "pending" };

    const origParts = origChar.parts;
    const typedParts = typedChar.parts;

    const allCorrect =
      origParts.length === typedParts.length &&
      origParts.every((p, idx) => p === typedParts[idx]);

    if (allCorrect) return { char: origChar.char, status: "correct" };

    const partialMatch = typedParts.every((p, idx) => p === origParts[idx]);
    if (partialMatch && typedParts.length < origParts.length) {
      const composed = composeHangul(
        typedParts[0],
        typedParts[1],
        typedParts[2]
      );
      return { char: composed, status: "current" };
    }

    const wrong = composeHangul(typedParts[0], typedParts[1], typedParts[2]);
    return { char: wrong, status: "incorrect" };
  });

  return (
    <div className="typed-text whitespace-pre-wrap">
      {compared.map(({ char, status }, i) => (
        <span
          key={i}
          className={
            status === "current"
              ? "relative after:absolute after:w-[2px] after:h-9 after:bg-[#68D391] after:bottom-0 after:left-0" // ✅ 글자 보이게
              : status === "correct"
              ? "text-[#2D3748]"
              : status === "incorrect"
              ? "text-[#F56565] underline decoration-[#F56565]"
              : "text-transparent"
          }
        >
          {char}
        </span>
      ))}
    </div>
  );
}
