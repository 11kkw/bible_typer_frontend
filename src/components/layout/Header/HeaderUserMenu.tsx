"use client";

import { logoutApi } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/stores/authStore";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function HeaderUserMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const { access, user, clearAuth } = useAuthStore();
  const isLoggedIn = Boolean(access && user);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (error) {
    } finally {
      clearAuth();
      setOpen(false);
      router.push("/");
    }
  };

  return (
    <div className="hidden md:flex items-center gap-4">
      {isLoggedIn ? (
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              open
                ? "text-foreground bg-muted/70"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
            aria-haspopup="true"
            aria-expanded={open}
            aria-label="사용자 메뉴"
          >
            <span className="material-symbols-outlined text-xl opacity-80">
              account_circle
            </span>
            <span>{user?.username ?? "마이페이지"}</span>
            <span className="material-symbols-outlined text-base opacity-70">
              {open ? "expand_less" : "expand_more"}
            </span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border/70 bg-background/95 backdrop-blur-md shadow-lg shadow-black/10 ring-1 ring-border/70 z-[9999]">
              <div className="py-1">
                <Link
                  href="/mypage"
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                    pathname.startsWith("/mypage")
                      ? "text-[var(--primary)] font-semibold bg-muted/60"
                      : "text-foreground hover:bg-muted/50"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg opacity-80">
                    space_dashboard
                  </span>
                  마이페이지
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg opacity-80">
                    logout
                  </span>
                  로그아웃
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Link
          href="/login"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-[var(--primary)] transition-colors"
        >
          <span className="material-symbols-outlined text-xl opacity-80">
            login
          </span>
          <span>로그인/가입</span>
        </Link>
      )}
    </div>
  );
}
