// utils/hangulUtils.ts
import { HangulChar } from "@/types/models/Hangul";

export const CHO = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

export const JUNG = [
  "ㅏ",
  "ㅐ",
  "ㅑ",
  "ㅒ",
  "ㅓ",
  "ㅔ",
  "ㅕ",
  "ㅖ",
  "ㅗ",
  "ㅘ",
  "ㅙ",
  "ㅚ",
  "ㅛ",
  "ㅜ",
  "ㅝ",
  "ㅞ",
  "ㅟ",
  "ㅠ",
  "ㅡ",
  "ㅢ",
  "ㅣ",
];

export const JONG = [
  "",
  "ㄱ",
  "ㄲ",
  "ㄳ",
  "ㄴ",
  "ㄵ",
  "ㄶ",
  "ㄷ",
  "ㄹ",
  "ㄺ",
  "ㄻ",
  "ㄼ",
  "ㄽ",
  "ㄾ",
  "ㄿ",
  "ㅀ",
  "ㅁ",
  "ㅂ",
  "ㅄ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

/** ✅ 복모음(중성 결합) */
export const JUNG_COMBINE_TABLE: Record<string, string> = {
  "ㅗ+ㅏ": "ㅘ",
  "ㅗ+ㅐ": "ㅙ",
  "ㅗ+ㅣ": "ㅚ",
  "ㅜ+ㅓ": "ㅝ",
  "ㅜ+ㅔ": "ㅞ",
  "ㅜ+ㅣ": "ㅟ",
  "ㅡ+ㅣ": "ㅢ",
};

/** ✅ 복모음 분해 (역방향) */
export const JUNG_SPLIT_TABLE: Record<string, [string, string]> = {
  ㅘ: ["ㅗ", "ㅏ"],
  ㅙ: ["ㅗ", "ㅐ"],
  ㅚ: ["ㅗ", "ㅣ"],
  ㅝ: ["ㅜ", "ㅓ"],
  ㅞ: ["ㅜ", "ㅔ"],
  ㅟ: ["ㅜ", "ㅣ"],
  ㅢ: ["ㅡ", "ㅣ"],
};

/** ✅ 겹받침(종성 결합) */
export const JONG_COMBINE_TABLE: Record<string, string> = {
  "ㄱ+ㅅ": "ㄳ",
  "ㄴ+ㅈ": "ㄵ",
  "ㄴ+ㅎ": "ㄶ",
  "ㄹ+ㄱ": "ㄺ",
  "ㄹ+ㅁ": "ㄻ",
  "ㄹ+ㅂ": "ㄼ",
  "ㄹ+ㅅ": "ㄽ",
  "ㄹ+ㅌ": "ㄾ",
  "ㄹ+ㅍ": "ㄿ",
  "ㄹ+ㅎ": "ㅀ",
  "ㅂ+ㅅ": "ㅄ",
};

/** ✅ 겹받침 분해 (역방향) */
export const JONG_SPLIT_TABLE: Record<string, [string, string]> = {
  ㄳ: ["ㄱ", "ㅅ"],
  ㄵ: ["ㄴ", "ㅈ"],
  ㄶ: ["ㄴ", "ㅎ"],
  ㄺ: ["ㄹ", "ㄱ"],
  ㄻ: ["ㄹ", "ㅁ"],
  ㄼ: ["ㄹ", "ㅂ"],
  ㄽ: ["ㄹ", "ㅅ"],
  ㄾ: ["ㄹ", "ㅌ"],
  ㄿ: ["ㄹ", "ㅍ"],
  ㅀ: ["ㄹ", "ㅎ"],
  ㅄ: ["ㅂ", "ㅅ"],
};

/** ✅ 초성 ↔ 종성 변환 */
export const CHO_TO_JONG: Record<string, string> = {
  ㄱ: "ㄱ",
  ㄲ: "ㄲ",
  ㄴ: "ㄴ",
  ㄷ: "ㄷ",
  ㄹ: "ㄹ",
  ㅁ: "ㅁ",
  ㅂ: "ㅂ",
  ㅅ: "ㅅ",
  ㅆ: "ㅆ",
  ㅇ: "ㅇ",
  ㅈ: "ㅈ",
  ㅊ: "ㅊ",
  ㅋ: "ㅋ",
  ㅌ: "ㅌ",
  ㅍ: "ㅍ",
  ㅎ: "ㅎ",
};

export const JONG_TO_CHO: Record<string, string> = { ...CHO_TO_JONG };

export function decomposeHangul(char: string): string[] {
  const code = char.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return [char];

  const diff = code - 0xac00;
  const cho = Math.floor(diff / 588);
  const jung = Math.floor((diff % 588) / 28);
  const jong = diff % 28;

  const result = [CHO[cho], JUNG[jung]];
  if (JONG[jong]) result.push(JONG[jong]);
  return result;
}

export function decomposeHangulString(text: string): HangulChar[] {
  return Array.from(text).map((char, index) => {
    const code = char.charCodeAt(0);

    const isHangul =
      (code >= 0xac00 && code <= 0xd7a3) || // 완성형
      (code >= 0x1100 && code <= 0x11ff) || // 옛 자모
      (code >= 0x3130 && code <= 0x318f); // 현대 자모 (ㄱ, ㅏ 등)

    if (!isHangul) {
      let type: HangulChar["type"] = "latin";
      if (char === " ") type = "space";
      else if (/[^ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]/.test(char)) type = "symbol";
      return { id: index, char, parts: [char], type };
    }

    if (code >= 0xac00 && code <= 0xd7a3) {
      const diff = code - 0xac00;
      const choIndex = Math.floor(diff / 588);
      const jungIndex = Math.floor((diff % 588) / 28);
      const jongIndex = diff % 28;

      const cho = CHO[choIndex];
      const jung = JUNG[jungIndex];
      const jong = JONG[jongIndex];

      return {
        id: index,
        char,
        cho,
        jung,
        jong: jong || undefined,
        parts: jong ? [cho, jung, jong] : [cho, jung],
        type: "hangul",
        isCompoundJung: isCompoundJung(jung),
        isCompoundJong: isCompoundJong(jong),
      };
    }

    if (CHO.includes(char)) {
      return {
        id: index,
        char,
        cho: char,
        parts: [char],
        type: "hangul",
      };
    }

    if (JUNG.includes(char)) {
      return {
        id: index,
        char,
        jung: char,
        parts: [char],
        type: "hangul",
        isCompoundJung: isCompoundJung(char),
      };
    }

    if (JONG.includes(char)) {
      return {
        id: index,
        char,
        jong: char,
        parts: [char],
        type: "hangul",
        isCompoundJong: isCompoundJong(char),
      };
    }

    return {
      id: index,
      char,
      parts: [char],
      type: "hangul",
    };
  });
}

export function composeHangul(
  cho: string,
  jung?: string,
  jong?: string
): string {
  if (!cho || !jung) return cho || jung || "";
  const choIndex = CHO.indexOf(cho);
  const jungIndex = JUNG.indexOf(jung);
  const jongIndex = jong ? JONG.indexOf(jong) : 0;

  if (choIndex < 0 || jungIndex < 0) return cho + (jung || "") + (jong || "");

  const code = 0xac00 + (choIndex * 21 + jungIndex) * 28 + jongIndex;
  return String.fromCharCode(code);
}

/** ✅ 복모음인지 확인 */
export function isCompoundJung(jung?: string): boolean {
  if (!jung) return false;
  return Object.prototype.hasOwnProperty.call(JUNG_SPLIT_TABLE, jung);
}

/** ✅ 겹받침인지 확인 */
export function isCompoundJong(jong?: string): boolean {
  if (!jong) return false;
  return Object.prototype.hasOwnProperty.call(JONG_SPLIT_TABLE, jong);
}

/** ✅ 복모음 구성 요소 반환 (예: ㅘ → ["ㅗ", "ㅏ"]) */
export function getJungComponents(jung?: string): [string, string] | null {
  if (!jung) return null;
  return JUNG_SPLIT_TABLE[jung] ?? null;
}

/** ✅ 겹받침 구성 요소 반환 (예: ㄳ → ["ㄱ", "ㅅ"]) */
export function getJongComponents(jong?: string): [string, string] | null {
  if (!jong) return null;
  return JONG_SPLIT_TABLE[jong] ?? null;
}
