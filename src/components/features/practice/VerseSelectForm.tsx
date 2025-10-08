"use client";

export function VerseSelectForm() {
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
      {/* 성경 종류 선택 */}
      <div>
        <label
          htmlFor="bible-version-select"
          className="block text-sm font-medium text-foreground mb-2"
        >
          성경 종류 선택
        </label>
        <div className="relative">
          <select
            id="bible-version-select"
            name="bible_version"
            defaultValue="개역개정"
            className={commonSelectClass}
          >
            <option>개역개정</option>
            <option>새번역</option>
            <option>NIV</option>
          </select>
          {dropdownSvg}
        </div>
      </div>

      {/* 성경 선택 */}
      <div>
        <label
          htmlFor="book-select"
          className="block text-sm font-medium text-foreground mb-2"
        >
          성경
        </label>
        <div className="relative">
          <select
            id="book-select"
            name="book"
            defaultValue="요한복음"
            className={commonSelectClass}
          >
            <option>창세기</option>
            <option>요한복음</option>
            <option>시편</option>
            <option>잠언</option>
            <option>이사야</option>
          </select>
          {dropdownSvg}
        </div>
      </div>

      {/* 시작 장 / 끝 장 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="chapter-start"
            className="block text-sm font-medium text-foreground mb-2"
          >
            시작 장
          </label>
          <div className="relative">
            <select
              id="chapter-start"
              name="chapter_start"
              defaultValue="3"
              className={commonSelectClass}
            >
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
            {dropdownSvg}
          </div>
        </div>

        <div>
          <label
            htmlFor="chapter-end"
            className="block text-sm font-medium text-foreground mb-2"
          >
            끝 장
          </label>
          <div className="relative">
            <select
              id="chapter-end"
              name="chapter_end"
              defaultValue="4"
              className={commonSelectClass}
            >
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
            {dropdownSvg}
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <button
        type="button"
        className="btn-primary w-full mt-2 py-3 px-6 text-base font-bold shadow-sm transition-transform duration-200 hover:scale-[1.02]"
      >
        타자 시작하기
      </button>
    </div>
  );
}
