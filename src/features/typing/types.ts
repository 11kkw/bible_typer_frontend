export type CharStatus = "pending" | "correct" | "incorrect" | "current";

export interface TypedChar {
  char: string;
  status: CharStatus;
}
