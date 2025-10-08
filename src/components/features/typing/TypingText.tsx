export function TypingText({ text, typed }: { text: string; typed: string }) {
  // 🔸 내부 비교 함수
  const compareText = (original: string, typed: string) => {
    return original.split("").map((char, i) => {
      const typedChar = typed[i];
      if (i === typed.length) return { char, status: "current" };
      if (typedChar === undefined) return { char, status: "pending" };
      if (typedChar === char) return { char, status: "correct" };
      return { char, status: "incorrect" };
    });
  };

  const compared = compareText(text, typed);

  return (
    <div className="typed-text whitespace-pre-wrap">
      {compared.map(({ char, status }, i) => (
        <span
          key={i}
          className={
            status === "current"
              ? "relative text-transparent after:absolute after:w-[2px] after:h-9 after:bg-[#68D391] after:bottom-0 after:left-0"
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
