"use client";

import { useTypingStats } from "@/features/typing/hooks/useTypingStats";
import Link from "next/link";
import { HeaderNav } from "./HeaderNav";
import { HeaderTypingStats } from "./HeaderTypingStats";
import { HeaderUserMenu } from "./HeaderUserMenu";

export function Header() {
  const navItems = [
    { href: "/", label: "홈" },
    { href: "/setup", label: "말씀 선택" },
  ];

  const { accuracy, totalTypedCount, elapsedTime, progress } = useTypingStats();

  const hasInput = totalTypedCount > 0;

  return (
    <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-lg">
      <div className="border-b border-border">
        <div className="container-wide">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl text-primary/80 leading-none">
                  keyboard
                </span>
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
          currentRef="창세기 1:1-2"
        />
      </div>
    </header>
  );
}
