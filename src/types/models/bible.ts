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
  chapter: number;
  number: number;
  bcv: string;
  text: string;
}
