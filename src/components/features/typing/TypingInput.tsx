"use client";
import { useEffect, useRef, useState } from "react";

export function TypingInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [isComposing, setIsComposing] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  // 포커스 유지(선택)
  useEffect(() => {
    ref.current?.focus();
  }, []);

  const push = (e: React.FormEvent<HTMLTextAreaElement>) => {
    // 조합 중/아님 모두 현재 value를 즉시 전달
    onChange(e.currentTarget.value);
  };

  return (
    <textarea
      ref={ref}
      autoFocus
      value={value}
      onChange={push} // 영문/수정 등 일반 입력
      onCompositionStart={() => setIsComposing(true)}
      onCompositionUpdate={push} // ✅ ㄱ → 가 중간도 즉시 반영
      onCompositionEnd={(e) => {
        // ✅ 최종 확정도 즉시 반영
        setIsComposing(false);
        onChange(e.currentTarget.value);
      }}
      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-text z-10 resize-none bg-transparent border-none p-0"
      rows={1}
    />
  );
}
