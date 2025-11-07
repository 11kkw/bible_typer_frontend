import {
  composeHangul,
  getJongComponents,
  getJungComponents,
} from "@/core/utils/disassemble";
import { HangulChar } from "@/types/models/Hangul";
import { TypedChar } from "../types";

/**
 * 안전하게 종성 분해
 */
const safeJongParts = (jong?: string): string[] =>
  getJongComponents(jong ?? "") ?? [];

/**
 * 안전하게 중성 분해
 */
const safeJungParts = (jung?: string): string[] =>
  getJungComponents(jung ?? "") ?? [];

/**
 * 이전 글자 상태 안정화
 * - 이전 글자가 "current"면 실제로 맞았을 때만 "correct"로 확정
 * - 틀렸다면 그대로 "incorrect" 유지
 */
function stabilizeStatuses(
  rows: TypedChar[],
  userLen: number,
  origDecomposed: HangulChar[]
): TypedChar[] {
  const last = userLen - 1;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const orig = origDecomposed[i];

    // 마지막 글자는 현재 입력 중이므로 유지
    if (i === last) continue;

    // 이전 글자가 current면, 원본과 실제 입력이 같은지 판별
    if (row.status === "current") {
      const isActuallyCorrect = row.char === orig?.char;
      rows[i] = {
        ...row,
        status: isActuallyCorrect ? "correct" : "incorrect",
      };
    }
  }

  return rows;
}

/**
 * 원본 구절과 사용자가 입력한 구절을 비교하여 각 글자의 상태를 판별
 * - correct : 정확히 일치
 * - incorrect : 틀림
 * - current : 현재 입력 중
 * - pending : 아직 입력 안됨
 */
export function compareVerseParts(
  origDecomposed: HangulChar[],
  userDecomposed: HangulChar[]
): TypedChar[] {
  const rows: TypedChar[] = [];

  for (let i = 0; i < origDecomposed.length; i++) {
    const orig = origDecomposed[i];
    const userPart = userDecomposed[i];
    const isCurrent = i === userDecomposed.length - 1;

    // 아직 입력 안된 글자
    if (!userPart) {
      rows.push({ char: orig.char, status: "pending" });
      continue;
    }

    // 입력 글자 조합
    const composed = composeHangul(
      userPart.parts[0] ?? "",
      userPart.parts[1] ?? "",
      userPart.parts[2] ?? ""
    );

    const nextTyped = userDecomposed[i + 1];
    const nextOrig = origDecomposed[i + 1];

    const isFullyComposed =
      !!userPart.cho && !!userPart.jung && (orig.jong ? !!userPart.jong : true);

    // 1️⃣ 초성 불일치
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

    // 5️⃣ 완성형 일치 여부
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

  return stabilizeStatuses(rows, userDecomposed.length, origDecomposed);
}
