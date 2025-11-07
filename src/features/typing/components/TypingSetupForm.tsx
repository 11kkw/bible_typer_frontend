"use client";

import { useBibleVersionDetail } from "@/features/typing/hooks/useBibleVersions";
import { useVerseSelectStore } from "@/features/typing/stores/useVerseSelectStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { fetchBookStats } from "../services/book.service";

interface BibleVersion {
  id: number;
  name: string;
}

export default function TypingSetupForm({
  versions,
}: {
  versions: BibleVersion[];
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    selectedVersionId,
    selectedBookId,
    chapterStart,
    chapterEnd,
    setVersion,
    setBook,
    setChapterStart,
    setChapterEnd,
    setBookStats, // ✅ Zustand setter 추가
  } = useVerseSelectStore();

  // ✅ 선택된 버전 상세 정보 가져오기
  const { data: versionDetail } = useBibleVersionDetail(
    selectedVersionId ?? undefined
  );

  // ✅ 선택된 책 정보
  const selectedBook = versionDetail?.books.find(
    (b) => b.id === selectedBookId
  );
  const totalChapters = selectedBook?.total_chapters ?? 1;

  // ✅ 공통 스타일
  const commonSelectClass =
    "appearance-none w-full bg-white border border-border rounded-lg py-3 px-4 pr-10 " +
    "text-sm text-foreground transition duration-150 ease-in-out " +
    "focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/25";

  const dropdownIcon =
    "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5";

  const dropdownSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 20 20"
      className={dropdownIcon}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M6 8l4 4 4-4"
      />
    </svg>
  );

  const handleStartTyping = async () => {
    if (!selectedBookId || !selectedVersionId) return;

    setIsLoading(true);
    try {
      const data = await fetchBookStats(
        selectedBookId,
        chapterStart,
        chapterEnd
      );

      setBookStats({
        totalVerseCount: data.total_verse_count,
        totalCharacterCount: data.total_character_count,
      });

      router.push("/");
    } catch (error) {
      console.error("책 통계 불러오기 실패:", error);
      alert("책 통계 불러오기 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card space-y-5">
      {/* ✅ 성경 버전 선택 */}
      <div>
        <label
          htmlFor="bible-version-select"
          className="block text-sm font-medium mb-2"
        >
          성경 종류 선택
        </label>
        <div className="relative">
          <select
            id="bible-version-select"
            value={selectedVersionId ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              if (!value) {
                setVersion(null, { name: null });
                return;
              }
              const id = Number(value);
              const versionName = versions.find((v) => v.id === id)?.name ?? null;
              setVersion(id, { name: versionName });
            }}
            className={commonSelectClass}
          >
            <option value="">선택하세요</option>
            {versions.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
          {dropdownSvg}
        </div>
      </div>

      {/* ✅ 책 선택 */}
      <div>
        <label htmlFor="book-select" className="block text-sm font-medium mb-2">
          성경
        </label>
        <div className="relative">
          <select
            id="book-select"
            value={selectedBookId ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              if (!value) {
                setBook(null, { title: null });
                return;
              }
              const id = Number(value);
              const title = versionDetail?.books
                .find((book) => book.id === id)?.title.trim() ?? null;
              setBook(id, { title });
            }}
            disabled={!versionDetail}
            className={commonSelectClass}
          >
            <option value="">선택하세요</option>
            {versionDetail?.books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title.trim()}
              </option>
            ))}
          </select>
          {dropdownSvg}
        </div>
      </div>

      {/* ✅ 시작 장 / 끝 장 선택 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 시작 장 */}
        <div>
          <label
            htmlFor="chapter-start"
            className="block text-sm font-medium mb-2"
          >
            시작 장
          </label>
          <div className="relative">
            <select
              id="chapter-start"
              value={chapterStart}
              onChange={(e) => setChapterStart(Number(e.target.value))}
              className={commonSelectClass}
            >
              {Array.from({ length: totalChapters }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            {dropdownSvg}
          </div>
        </div>

        {/* 끝 장 */}
        <div>
          <label
            htmlFor="chapter-end"
            className="block text-sm font-medium mb-2"
          >
            끝 장
          </label>
          <div className="relative">
            <select
              id="chapter-end"
              value={chapterEnd}
              onChange={(e) => setChapterEnd(Number(e.target.value))}
              className={commonSelectClass}
            >
              {Array.from({ length: totalChapters })
                .map((_, i) => i + 1)
                .filter((n) => n >= chapterStart)
                .map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
            </select>
            {dropdownSvg}
          </div>
        </div>
      </div>

      {/* ✅ 버튼 (로딩 스피너 포함) */}
      <button
        type="button"
        onClick={handleStartTyping}
        disabled={!selectedBookId || !selectedVersionId || isLoading}
        className={`btn-primary w-full mt-2 py-3 px-6 text-base font-bold shadow-sm transition-transform duration-200 ${
          isLoading ? "opacity-70 cursor-wait" : "hover:scale-[1.02]"
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            이동 중...
          </span>
        ) : (
          "타자 시작하기"
        )}
      </button>
    </div>
  );
}
