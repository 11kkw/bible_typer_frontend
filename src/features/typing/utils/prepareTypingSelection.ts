"use client";

import { fetchBookStats } from "@/features/typing/services/book.service";
import { fetchVersesByBookAndChapter } from "@/features/typing/services/verse.service";
import { useVerseSelectStore } from "@/features/typing/stores/useVerseSelectStore";
import { TypingSessionEntry } from "@/features/typing/types";

export interface ChapterIdPair {
  startChapterId: number;
  endChapterId: number;
}

interface PrepareTypingSelectionParams {
  versionId: number;
  versionName?: string | null;
  bookId: number;
  bookTitle?: string | null;
  startChapterNumber: number;
  endChapterNumber: number;
  startVerseNumber?: number | null;
  session?: TypingSessionEntry | null;
  resolvedChapterIds?: ChapterIdPair;
}

export async function resolveChapterIds(
  bookId: number,
  startChapterNumber: number,
  endChapterNumber: number
): Promise<ChapterIdPair> {
  const resolveChapterId = async (chapterNumber: number) => {
    const verses = await fetchVersesByBookAndChapter(bookId, chapterNumber, {
      page: 1,
    });
    const firstVerse = verses.results?.[0];
    if (!firstVerse) {
      throw new Error("해당 장 정보를 찾을 수 없습니다.");
    }
    return firstVerse.chapter;
  };

  const startChapterId = await resolveChapterId(startChapterNumber);
  const endChapterId =
    endChapterNumber === startChapterNumber
      ? startChapterId
      : await resolveChapterId(endChapterNumber);

  return { startChapterId, endChapterId };
}

export async function prepareTypingSelection({
  versionId,
  versionName,
  bookId,
  bookTitle,
  startChapterNumber,
  endChapterNumber,
  startVerseNumber,
  session,
  resolvedChapterIds,
}: PrepareTypingSelectionParams) {
  const {
    setVersion,
    setBook,
    setChapterStart,
    setChapterEnd,
    setCurrentChapter,
    setStartVerse,
    setBookStats,
    setServerSession,
  } = useVerseSelectStore.getState();

  setVersion(versionId, { name: versionName ?? null });
  setBook(bookId, { title: bookTitle ?? null });
  setChapterStart(startChapterNumber);
  setChapterEnd(endChapterNumber);
  setCurrentChapter(startChapterNumber);
  setStartVerse(startVerseNumber ?? null);

  const { startChapterId, endChapterId } =
    resolvedChapterIds ??
    (await resolveChapterIds(bookId, startChapterNumber, endChapterNumber));

  if (session) {
    setServerSession({
      id: session.id,
      version: session.version ?? versionId,
      book: session.book ?? bookId,
      start_chapter: startChapterId,
      end_chapter: endChapterId,
      status: session.status ?? "in_progress",
      last_unfinished_verse: session.last_unfinished_verse ?? 0,
    });
  } else {
    setServerSession(null);
  }

  const stats = await fetchBookStats(bookId, {
    startChapter: startChapterNumber,
    endChapter: endChapterNumber,
    startVerse: startVerseNumber ?? undefined,
  });
  setBookStats({
    totalVerseCount: stats.total_verse_count,
    totalCharacterCount: stats.total_character_count,
    scope: "selection",
  });
}
