import {
  composeHangul,
  getJongComponents,
  getJungComponents,
} from "@/core/utils/disassemble";
import { HangulChar } from "@/types/models/Hangul";
import { TypedChar } from "../types";

const safeJongParts = (jong?: string): string[] =>
  getJongComponents(jong ?? "") ?? [];

const safeJungParts = (jung?: string): string[] =>
  getJungComponents(jung ?? "") ?? [];

/** ✅ 이전 current 상태를 정리 (마지막 글자만 유지) */
function stabilizeStatuses(rows: TypedChar[], userLen: number): TypedChar[] {
  const last = userLen - 1;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].status === "current" && i < last) {
      rows[i] = { ...rows[i], status: "correct" };
    }
  }
  return rows;
}

/** ✅ 원문과 입력을 비교해서 TypedChar[] 반환 (순수 함수) */
export function compareVerseParts(
  origDecomposed: HangulChar[],
  userDecomposed: HangulChar[]
): TypedChar[] {
  const rows: TypedChar[] = new Array(origDecomposed.length);

  for (let i = 0; i < origDecomposed.length; i++) {
    const orig = origDecomposed[i];
    const userPart = userDecomposed[i];
    const isCurrent = i === userDecomposed.length - 1;

    // 입력 없음
    if (!userPart) {
      rows[i] = { char: orig.char, status: "pending" };
      continue;
    }

    const composed = composeHangul(
      userPart.parts[0] ?? "",
      userPart.parts[1] ?? "",
      userPart.parts[2] ?? ""
    );

    const nextTyped = userDecomposed[i + 1];
    const nextOrig = origDecomposed[i + 1];

    // ✅ 조합 완료 여부
    const isFullyComposed =
      !!userPart.cho && !!userPart.jung && (orig.jong ? !!userPart.jong : true);

    // 1️⃣ 초성 비교
    if (userPart.cho !== orig.cho) {
      const isNextChoShift =
        isCurrent &&
        nextTyped &&
        nextOrig &&
        nextTyped.cho === nextOrig.cho &&
        !nextTyped.jung;
      rows[i] = {
        char: composed,
        status: isNextChoShift ? "current" : "incorrect",
      };
      continue;
    }

    // 2️⃣ 초성만 입력된 상태
    if (!userPart.jung && orig.jung) {
      rows[i] = {
        char: composed,
        status: isCurrent ? "current" : "incorrect",
      };
      continue;
    }

    // 3️⃣ 중성 비교
    if (userPart.jung !== orig.jung && userPart.jung) {
      const isPartialCompound =
        orig.isCompoundJung && safeJungParts(orig.jung).includes(userPart.jung);
      rows[i] = {
        char: composed,
        status: isPartialCompound ? "current" : "incorrect",
      };
      continue;
    }

    // 4️⃣ 종성 비교
    if (userPart.jong !== orig.jong && userPart.jong) {
      const nextOrigCho = nextOrig?.cho;
      const mistakenAsNextCho =
        isCurrent &&
        nextOrigCho &&
        (userPart.jong === nextOrigCho ||
          safeJongParts(userPart.jong).includes(nextOrigCho)) &&
        (!nextTyped || !nextTyped.jung);

      if (mistakenAsNextCho) {
        rows[i] = { char: composed, status: "current" };
        continue;
      }

      if (orig.isCompoundJong) {
        const parts = safeJongParts(orig.jong);
        const isPartialMatch = parts.includes(userPart.jong);
        if (isPartialMatch && isCurrent) {
          rows[i] = { char: composed, status: "current" };
          continue;
        }
      }

      rows[i] = { char: composed, status: "incorrect" };
      continue;
    }

    // 5️⃣ 기본 일치 (조합 완료 판정 포함)
    if (isCurrent) {
      if (composed === orig.char && isFullyComposed) {
        rows[i] = { char: composed, status: "correct" };
      } else {
        rows[i] = { char: composed, status: "current" };
      }

      // ✅ 이전 글자 재검사 (현재 글자 확정 전에)
      const prevIndex = i - 1;
      if (prevIndex >= 0 && rows[prevIndex]) {
        const prevUser = userDecomposed[prevIndex];
        const prevOrig = origDecomposed[prevIndex];

        if (prevUser && prevOrig) {
          const prevComposed = composeHangul(
            prevUser.parts[0] ?? "",
            prevUser.parts[1] ?? "",
            prevUser.parts[2] ?? ""
          );

          const prevFullyComposed =
            !!prevUser.cho &&
            !!prevUser.jung &&
            (prevOrig.jong ? !!prevUser.jong : true);

          if (prevFullyComposed) {
            if (prevComposed === prevOrig.char) {
              rows[prevIndex] = { char: prevOrig.char, status: "correct" };
            } else {
              rows[prevIndex] = { char: prevComposed, status: "incorrect" };
            }
          }
        }
      }
    } else if (composed !== orig.char) {
      rows[i] = { char: composed, status: "incorrect" };
    } else {
      rows[i] = { char: orig.char, status: "correct" };
    }
  }

  return stabilizeStatuses(rows, userDecomposed.length);
}
