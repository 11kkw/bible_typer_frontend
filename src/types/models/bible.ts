export interface BibleVersion {
  id: number;
  code: string;
  name: string;
  language: string;
  publisher: string;
}

export interface BibleBook {
  id: number;
  version: number; // FK to BibleVersion
  code: string;
  title: string;
  order: number;
  total_chapters: number;
}

export interface Verse {
  id: number;
  chapter: number; // chapter PK (not the human-readable number)
  number: number; // verse number within the chapter
  text: string;
  bcv?: string; // e.g. "01001001" or "창세기 1:1"
  chapter_number?: number; // human-readable chapter number
  book_title?: string;
  version_name?: string;
}
