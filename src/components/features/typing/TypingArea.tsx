import { useState } from "react";
import { TypingText } from "./TypingText";
import { TypingInput } from "./TypingInput";

export function TypingArea() {
  const [typed, setTyped] = useState("");
  const text =
    "태초에 하나님이 천지를 창조하시니라 땅이 혼돈하고 공허하며 흑암이 깊음 위에 있고 하나님의 영은 수면 위에 운행하시니라";

  return (
    <div className="max-w-4xl w-full text-left py-16 md:py-24 relative">
      <div className="relative text-3xl leading-relaxed font-normal typing-area">
        <div className="original-text opacity-40 text-gray-400 absolute top-0 left-0 pointer-events-none">
          {text}
        </div>
        <TypingText text={text} typed={typed} />
        <TypingInput value={typed} onChange={setTyped} />
      </div>
    </div>
  );
}
