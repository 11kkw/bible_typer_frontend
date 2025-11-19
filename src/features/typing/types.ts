export type CharStatus = "pending" | "correct" | "incorrect" | "current";

export interface TypedChar {
  char: string;
  status: CharStatus;
}

export type TypingSessionStatus = "in_progress" | "completed" | (string & {});

export interface TypingSession {
  version: number;
  book: number;
  start_chapter: number;
  end_chapter: number;
  status: TypingSessionStatus;
  last_unfinished_verse: number;
}

export interface TypingSessionEntry extends TypingSession {
  id: number;
  created_at?: string;
  updated_at?: string;
  start_time?: string;
  end_time?: string | null;
}

export type CreateTypingSessionRequest = Omit<
  TypingSession,
  "id" | "created_at" | "updated_at"
>;

export type TypingEventKeyType = "input" | "delete" | "pause";

export interface TypingEventLogInput {
  duration: number;
  key_type: TypingEventKeyType;
  char?: string;
  expected_char?: string;
  key_code?: string;
  raw_key?: string;
  is_error?: boolean;
  position: number;
}

export interface TypingVerseLogInput {
  session: number;
  verse: number;
  accuracy?: number;
  speed?: number;
  error_count?: number;
  backspace_count?: number;
  time_spent?: number;
  events: TypingEventLogInput[];
}

export interface NextUntypedVerseResponse {
  book_id: number;
  book_title?: string;
  chapter_number: number;
  verse_number: number;
  detail?: string;
}
