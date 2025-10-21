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

/** ✅ 원문과 입력을 전체 비교해서 TypedChar[] 반환 */
export function compareVerseParts(
  origDecomposed: HangulChar[],
  userDecomposed: HangulChar[]
): TypedChar[] {
  const rows: TypedChar[] = [];

  for (let i = 0; i < origDecomposed.length; i++) {
    const orig = origDecomposed[i];
    const userPart = userDecomposed[i];
    const isCurrent = i === userDecomposed.length - 1;

    // 입력 없음
    if (!userPart) {
      rows.push({ char: orig.char, status: "pending" });
      continue;
    }

    const composed = composeHangul(
      userPart.parts[0] ?? "",
      userPart.parts[1] ?? "",
      userPart.parts[2] ?? ""
    );

    const nextTyped = userDecomposed[i + 1];
    const nextOrig = origDecomposed[i + 1];

    const isFullyComposed =
      !!userPart.cho && !!userPart.jung && (orig.jong ? !!userPart.jong : true);

    // 1️⃣ 초성 다름
    if (userPart.cho !== orig.cho) {
      const isNextChoShift =
        isCurrent &&
        nextTyped &&
        nextOrig &&
        nextTyped.cho === nextOrig.cho &&
        !nextTyped.jung;

      rows.push({
        char: composed,
        status: isNextChoShift ? "current" : "incorrect",
      });
      continue;
    }

    // 2️⃣ 중성 미입력
    if (!userPart.jung && orig.jung) {
      rows.push({
        char: composed,
        status: isCurrent ? "current" : "incorrect",
      });
      continue;
    }

    // 3️⃣ 중성 불일치
    if (userPart.jung !== orig.jung && userPart.jung) {
      const isPartialCompound =
        orig.isCompoundJung && safeJungParts(orig.jung).includes(userPart.jung);
      rows.push({
        char: composed,
        status: isPartialCompound ? "current" : "incorrect",
      });
      continue;
    }

    // 4️⃣ 종성 불일치
    if (userPart.jong !== orig.jong && userPart.jong) {
      const nextOrigCho = nextOrig?.cho;
      const mistakenAsNextCho =
        isCurrent &&
        nextOrigCho &&
        (userPart.jong === nextOrigCho ||
          safeJongParts(userPart.jong).includes(nextOrigCho)) &&
        (!nextTyped || !nextTyped.jung);

      if (mistakenAsNextCho) {
        rows.push({ char: composed, status: "current" });
        continue;
      }

      if (orig.isCompoundJong) {
        const parts = safeJongParts(orig.jong);
        const isPartialMatch = parts.includes(userPart.jong);
        if (isPartialMatch && isCurrent) {
          rows.push({ char: composed, status: "current" });
          continue;
        }
      }

      rows.push({ char: composed, status: "incorrect" });
      continue;
    }

    // 5️⃣ 완성형 일치 여부 (전체 기준)
    if (composed === orig.char) {
      rows.push({
        char: composed,
        status: isFullyComposed ? "correct" : "current",
      });
    } else {
      rows.push({
        char: composed,
        status: isCurrent ? "current" : "incorrect",
      });
    }
  }

  return stabilizeStatuses(rows, userDecomposed.length);
}
