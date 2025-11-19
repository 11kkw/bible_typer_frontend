export interface TypingVersionSummary {
  total_time?: number;
  avg_speed?: number;
  avg_accuracy?: number;
}

export interface TypingBibleProgressSection {
  total_verses: number;
  completed_verses: number;
  progress: number; // 0~1 범위
}

export interface TypingBibleProgress {
  ot: TypingBibleProgressSection;
  nt: TypingBibleProgressSection;
  overall: TypingBibleProgressSection;
}

export interface TypingVersionSessionSummary {
  session_id: number;
  version_id: number;
  book_id: number;
  book_title?: string;
  start_chapter: number;
  start_verse?: number | null;
  end_chapter: number;
  total_verses: number;
  completed: number;
  progress: number;
  avg_speed: number;
  avg_accuracy: number;
  next_start_chapter?: number;
  next_end_chapter?: number | null;
  next_start_verse?: number | null;
}
