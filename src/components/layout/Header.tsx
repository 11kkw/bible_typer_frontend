"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "홈" },
    { href: "/practice", label: "타자 연습" },
    { href: "/progress", label: "진행 상황" },
    { href: "/community", label: "커뮤니티" },
    { href: "/mypage", label: "마이페이지/기록" },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-card/90 backdrop-blur-lg">
      <div className="container-wide">
        <div className="flex h-16 items-center justify-between">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-primary leading-none">
              keyboard
            </span>
            <h1 className="text-xl font-bold tracking-tight leading-none text-foreground">
              말씀 타자
            </h1>
          </Link>

          {/* === 데스크톱 네비게이션 === */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navItems.slice(0, 4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  isActive(item.href)
                    ? "font-bold text-primary"
                    : "text-muted-foreground hover:text-primary transition-colors"
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* === 데스크톱: 마이페이지 === */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/mypage"
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                pathname.startsWith("/mypage")
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined text-xl">
                account_circle
              </span>
              <span>마이페이지</span>
            </Link>
          </div>

          {/* === 모바일: 햄버거 메뉴 === */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-primary transition"
            aria-label="모바일 메뉴 열기"
          >
            <span className="material-symbols-outlined text-3xl">
              {menuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* === 모바일 메뉴 === */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card shadow-sm">
          <nav className="flex flex-col space-y-1 p-4 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-3 py-2 transition-colors ${
                  isActive(item.href)
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
