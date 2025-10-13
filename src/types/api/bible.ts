import { BibleBook, BibleVersion } from "../models/bible";

export interface BibleVersionDetail extends BibleVersion {
  books: BibleBook[];
}
