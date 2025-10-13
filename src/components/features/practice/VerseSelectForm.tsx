"use client";

import { useBibleVersionDetail } from "@/hooks/useBibleVersions";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface BibleVersion {
  id: number;
  name: string;
}

export default function VerseSelectForm({
  versions,
}: {
  versions: BibleVersion[];
}) {
  const router = useRouter();
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(
    null
  );
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [chapterStart, setChapterStart] = useState(1);
  const [chapterEnd, setChapterEnd] = useState(1);

  const { data: versionDetail } = useBibleVersionDetail(
    selectedVersionId ?? undefined
  );
  const selectedBook = versionDetail?.books.find(
    (b) => b.id === selectedBookId
  );
  const totalChapters = selectedBook?.total_chapters ?? 1;

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

  return (
    <div className="card space-y-5">
      {/* ✅ 서버 렌더링된 성경 버전 목록 */}
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
              setSelectedVersionId(Number(e.target.value));
              setSelectedBookId(null);
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

      {/* 성경 선택 */}
      <div>
        <label htmlFor="book-select" className="block text-sm font-medium mb-2">
          성경
        </label>
        <div className="relative">
          <select
            id="book-select"
            value={selectedBookId ?? ""}
            onChange={(e) => {
              setSelectedBookId(Number(e.target.value));
              setChapterStart(1);
              setChapterEnd(1);
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

      {/* 시작 장 / 끝 장 */}
      <div className="grid grid-cols-2 gap-4">
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
              onChange={(e) => {
                const newStart = Number(e.target.value);
                setChapterStart(newStart);
                if (chapterEnd < newStart) setChapterEnd(newStart);
              }}
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

      {/* 버튼 */}
      <button
        type="button"
        onClick={() =>
          router.push(
            `/practice/start?version=${selectedVersionId}&book=${selectedBookId}&start=${chapterStart}&end=${chapterEnd}`
          )
        }
        disabled={!selectedBookId}
        className="btn-primary w-full mt-2 py-3 px-6 text-base font-bold shadow-sm transition-transform duration-200 hover:scale-[1.02]"
      >
        타자 시작하기
      </button>
    </div>
  );
}
