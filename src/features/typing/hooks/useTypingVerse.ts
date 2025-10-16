"use client";

import { composeHangul, decomposeHangulString } from "@/core/utils/disassemble";
import {
  fetchRandomVerses,
  fetchVersesByBookAndChapter,
} from "@/features/typing/services/bible.service";
import { useVerseSelectStore } from "@/features/typing/stores/useVerseSelectStore";
import { ComparedChar, Verse } from "@/types/models/bible";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

//
// ✅ 1️⃣ 단일 절 타이핑 비교 훅
//
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

export function useTypingVerses(initialVerses: Verse[]) {
  const { selectedBookId, chapterStart } = useVerseSelectStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    data: verses = initialVerses,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["verses", selectedBookId, chapterStart],
    queryFn: async () => {
      if (selectedBookId && chapterStart) {
        const res = await fetchVersesByBookAndChapter(
          selectedBookId,
          chapterStart
        );
        return res.results;
      }
      return await fetchRandomVerses(4);
    },
    initialData: initialVerses,
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedBookId, chapterStart]);

  const goNext = () =>
    setCurrentIndex((prev) => Math.min(prev + 1, verses.length - 1));

  const goPrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  const activate = (index: number) => setCurrentIndex(index);

  return {
    verses,
    isLoading: isLoading || isFetching,
    currentIndex,
    goNext,
    goPrev,
    activate,
    refetch,
  };
}
