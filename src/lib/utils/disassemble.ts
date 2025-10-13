import { HangulChar } from "@/types/models/Hangul";

const CHO = [
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

const JUNG = [
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

const JONG = [
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

    if (code < 0xac00 || code > 0xd7a3) {
      let type: HangulChar["type"] = "latin";
      if (char === " ") type = "space";
      else if (/[^ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]/.test(char)) type = "symbol";

      return {
        id: index,
        char,
        parts: [char],
        type,
      };
    }

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
      type: "hangul" as const,
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
