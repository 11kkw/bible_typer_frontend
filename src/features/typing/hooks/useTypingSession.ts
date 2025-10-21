import { Verse } from "@/types/models/bible";
import { useEffect, useState } from "react";
import { useVerseSelectStore } from "../stores/useVerseSelectStore";

export function useTypingSession(verses: Verse[]) {
  const [currentVerseIndex, setCurrentIndex] = useState(0);
  const { nextChapter, prevChapter } = useVerseSelectStore();

  /** ✅ 구절 배열 변경 시 인덱스 조정 */
  useEffect(() => {
    // 1) 새로 로드된 verses가 있고,
    // 2) 현재 인덱스가 배열 범위를 벗어나면
    // → 0으로 (새 장으로 넘어온 경우)
    if (currentVerseIndex >= verses.length) {
      setCurrentIndex(0);
    }
  }, [verses, currentVerseIndex]);

  /** ✅ 다음 절로 이동 */
  const goNext = () =>
    setCurrentIndex((i) => {
      const nextIndex = i + 1;

      // 마지막 절이면 다음 장으로 이동
      if (nextIndex >= verses.length) {
        nextChapter();
        return 0; // 다음 장 로드되면 첫 절부터
      }

      return nextIndex;
    });

  /** ✅ 이전 절로 이동 */
  const goPrev = () =>
    setCurrentIndex((i) => {
      const prevIndex = i - 1;

      // 첫 절에서 이전 장으로 이동
      if (prevIndex < 0) {
        prevChapter();
        // ⬇️ 이전 장의 마지막 절부터 시작
        return verses.length - 1;
      }

      return prevIndex;
    });

  const activate = (index: number) =>
    setCurrentIndex(() => {
      const clamped = Math.min(
        Math.max(index, 0),
        Math.max(verses.length - 1, 0)
      );
      return clamped;
    });

  return { currentVerseIndex, goNext, goPrev, activate };
}
