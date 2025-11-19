"use client";

import { useMemo } from "react";
import { shallow } from "zustand/shallow";

import { useTypingStats } from "@/features/typing/hooks/useTypingStats";
import { useTypingStore } from "@/features/typing/stores/useTypingStore";
import { useVerseSelectStore } from "@/features/typing/stores/useVerseSelectStore";
import Link from "next/link";
import Image from "next/image";
import { HeaderNav } from "./HeaderNav";
import { HeaderTypingStats } from "./HeaderTypingStats";
import { HeaderUserMenu } from "./HeaderUserMenu";

export function Header() {
  const navItems = [
    { href: "/", label: "홈" },
    { href: "/setup", label: "말씀 선택" },
  ];

  const { cpm, accuracy, errorCount, totalTypedCount, elapsedTime, progress } =
    useTypingStats();

  const {
    selectedVersionName,
    selectedBookTitle,
    chapterStart,
    chapterEnd,
    reset,
  } = useVerseSelectStore(
    (state) => ({
      selectedVersionName: state.selectedVersionName,
      selectedBookTitle: state.selectedBookTitle,
      chapterStart: state.chapterStart,
      chapterEnd: state.chapterEnd,
      reset: state.reset,
    }),
    shallow
  );

  const selectionLabel = useMemo(() => {
    if (!selectedBookTitle) return "";
    const versionPrefix = selectedVersionName ? `${selectedVersionName} · ` : "";
    const rangeLabel =
      chapterStart === chapterEnd
        ? `${chapterStart}장`
        : `${chapterStart}~${chapterEnd}장`;
    return `${versionPrefix}${selectedBookTitle} ${rangeLabel}`;
  }, [
    selectedVersionName,
    selectedBookTitle,
    chapterStart,
    chapterEnd,
  ]);

  const hasInput = totalTypedCount > 0;
  const resetTyping = useTypingStore((state) => state.resetAll);

  const handleHomeClick = () => {
    resetTyping();
    reset();
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-lg">
      <div className="border-b border-border">
        <div className="container-wide">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link
                href="/"
                onClick={handleHomeClick}
                className="flex items-center gap-2"
              >
                <Image
                  src="/fish-symbol.svg"
                  alt="익투스 로고"
                  width={32}
                  height={32}
                  priority
                />
                <h1 className="text-xl font-semibold tracking-tight leading-none text-foreground">
                  말씀 타자
                </h1>
              </Link>
              <HeaderNav navItems={navItems} />
            </div>

            <HeaderUserMenu />
          </div>
        </div>

        <HeaderTypingStats
          visible={hasInput}
          progress={progress}
          elapsedTime={elapsedTime}
          accuracy={accuracy}
 	      cpm={cpm}
          errorCount={errorCount}
          currentRef={selectionLabel}
        />
      </div>
    </header>
  );
}
