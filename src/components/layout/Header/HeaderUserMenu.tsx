"use client";

import { useAuthStore } from "@/features/auth/stores/authStore";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function HeaderUserMenu() {
  const pathname = usePathname();
  const { access, user } = useAuthStore();
  const isLoggedIn = Boolean(access && user);

  return (
    <div className="hidden md:flex items-center gap-4">
      {isLoggedIn ? (
        <Link
          href="/mypage"
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            pathname.startsWith("/mypage")
              ? "text-[var(--primary)] font-semibold"
              : "text-muted-foreground hover:text-[var(--primary)]"
          }`}
        >
          <span className="material-symbols-outlined text-xl opacity-80">
            account_circle
          </span>
          <span>{user?.username ?? "마이페이지"}</span>
        </Link>
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
