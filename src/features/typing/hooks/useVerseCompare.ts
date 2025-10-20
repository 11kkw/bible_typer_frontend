import {
  composeHangul,
  decomposeHangulString,
  getJongComponents,
  getJungComponents,
} from "@/core/utils/disassemble";
import { ComparedChar, Verse } from "@/types/models/bible";
import { useMemo } from "react";
import { useTypingStore } from "../stores/useTypingStore";

/** ✅ 안전한 분해 헬퍼 */
const safeJongParts = (jong?: string): string[] =>
  getJongComponents(jong ?? "") ?? [];
const safeJungParts = (jung?: string): string[] =>
  getJungComponents(jung ?? "") ?? [];

/** ✅ 이전 글자 상태 안정화 */
function stabilizeStatuses(
  rows: ComparedChar[],
  userLen: number
): ComparedChar[] {
  const last = userLen - 1;
  return rows.map((r, i) => {
    if (r.status === "current" && i < last - 1) {
      return { ...r, status: "incorrect" as const };
    }
    return r;
  });
}

/** ✅ useVerseCompare
 * - 원문과 사용자 입력(분해 결과)을 비교
 * - 각 문자별 상태("pending"|"current"|"correct"|"incorrect") 계산
 */
export function useVerseCompare(verse: Verse) {
  const { userDecomposedMap, origDecomposedMap, setOrigDecomposed } =
    useTypingStore();

  /** 원문 분해 캐시 */
  const origDecomposed = useMemo(() => {
    const cached = origDecomposedMap[verse.id];
    if (cached?.length) return cached;
    const decomposed = decomposeHangulString(verse.text);
    setOrigDecomposed(verse.id, decomposed);
    return decomposed;
  }, [origDecomposedMap, setOrigDecomposed, verse.id, verse.text]);

  const userDecomposed = userDecomposedMap[verse.id] ?? [];

  /** 비교 결과 */
  const compared: ComparedChar[] = useMemo(() => {
    const rows: ComparedChar[] = origDecomposed.map((orig, i) => {
      const userTyped = userDecomposed[i];
      if (!userTyped) return { char: orig.char, status: "pending" as const };

      const composed =
        userTyped.jung || userTyped.jong
          ? composeHangul(
              userTyped.parts[0] ?? "",
              userTyped.parts[1] ?? "",
              userTyped.parts[2] ?? ""
            )
          : userTyped.cho || userTyped.char;

      const lastIndex = userDecomposed.length - 1;
      const isCurrentChar = i === lastIndex;

      const nextTyped = userDecomposed[i + 1];
      const nextOrig = origDecomposed[i + 1];

      /** 1️⃣ 초성 비교 */
      if (userTyped.cho !== orig.cho) {
        if (
          nextTyped &&
          nextOrig &&
          nextTyped.cho === nextOrig.cho &&
          !nextTyped.jung &&
          isCurrentChar
        ) {
          return { char: composed, status: "current" as const };
        }
        return { char: composed, status: "incorrect" as const };
      }

      /** 2️⃣ 초성만 입력된 상태 */
      if (!userTyped.jung && orig.jung)
        return isCurrentChar
          ? { char: composed, status: "current" as const }
          : { char: composed, status: "incorrect" as const };

      /** 3️⃣ 중성 비교 */
      if (userTyped.jung !== orig.jung && userTyped.jung) {
        if (
          orig.isCompoundJung &&
          safeJungParts(orig.jung).includes(userTyped.jung)
        ) {
          return { char: composed, status: "current" as const };
        }
        return { char: composed, status: "incorrect" as const };
      }

      /** 4️⃣ 종성 비교 */
      if (userTyped.jong !== orig.jong && userTyped.jong) {
        const nextOrigCho = nextOrig?.cho;

        // 🔥 다음 초성이 일시적으로 겹받침으로 인식된 경우 ("벉" 형태)
        const isNextInitialMistakenAsJong =
          isCurrentChar &&
          nextOrigCho &&
          (userTyped.jong === nextOrigCho ||
            safeJongParts(userTyped.jong).includes(nextOrigCho)) &&
          (!nextTyped || !nextTyped.jung);

        if (isNextInitialMistakenAsJong)
          return { char: composed, status: "current" as const };

        // 겹받침 중간 입력 — 현재 글자일 때만 current 허용
        if (orig.isCompoundJong) {
          const parts = safeJongParts(orig.jong);
          const isPartialMatch = parts.includes(userTyped.jong);
          if (isPartialMatch && isCurrentChar)
            return { char: composed, status: "current" as const };
          return { char: composed, status: "incorrect" as const };
        }

        return { char: composed, status: "incorrect" as const };
      }

      /** 5️⃣ 현재 글자 아직 완성 중 */
      if (isCurrentChar) return { char: composed, status: "current" as const };

      /** 6️⃣ 완성된 글자 구조가 다름 (‘싫’ vs ‘실’) */
      if (composed !== orig.char)
        return { char: composed, status: "incorrect" as const };

      /** 7️⃣ 완전 일치 */
      return { char: orig.char, status: "correct" as const };
    });

    return stabilizeStatuses(rows, userDecomposed.length);
  }, [origDecomposed, userDecomposed]);

  return { compared };
}
