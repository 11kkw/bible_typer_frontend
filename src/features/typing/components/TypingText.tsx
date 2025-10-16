"use client";

import { ComparedChar } from "@/types/models/bible";
import clsx from "clsx";

interface TypingTextProps {
  compared: ComparedChar[];
}

export function TypingText({ compared }: TypingTextProps) {
  return (
    <div className="typed-text whitespace-pre-wrap">
      {compared.map(({ char, status }, i) => (
        <span
          key={i}
          className={clsx({
            "text-[#2D3748]": status === "correct" || status === "current",
            "text-[#F56565] underline decoration-[#F56565]":
              status === "incorrect",
            "text-transparent": status === "pending",
          })}
        >
          {char}
        </span>
      ))}
    </div>
  );
}
