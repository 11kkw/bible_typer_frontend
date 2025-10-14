"use client";
import { forwardRef, useCallback, useEffect } from "react";

interface TypingInputProps {
  value: string;
  onChange: (v: string) => void;
}

export const TypingInput = forwardRef<HTMLTextAreaElement, TypingInputProps>(
  ({ value, onChange }, ref) => {
    const handleChange = useCallback(
      (e: React.FormEvent<HTMLTextAreaElement>) => {
        onChange(e.currentTarget.value);
      },
      [onChange]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") e.preventDefault(); // 줄바꿈 방지
      },
      []
    );

    useEffect(() => {
      if (typeof ref === "object" && ref && "current" in ref) {
        ref.current?.focus();
      }
    }, [ref]);

    return (
      <textarea
        ref={ref}
        autoFocus
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        className="
          absolute inset-0
          w-full h-full
          text-transparent
          caret-[#68D391]
          cursor-text
          z-10 resize-none bg-transparent border-none p-0
          outline-none
        "
        rows={1}
      />
    );
  }
);

TypingInput.displayName = "TypingInput";
