export interface HangulChar {
  id: number;
  char: string;
  cho?: string;
  jung?: string;
  jong?: string;
  parts: string[];
  type: "hangul" | "symbol" | "space" | "latin";
  isCompoundJung?: boolean;
  isCompoundJong?: boolean;
}
