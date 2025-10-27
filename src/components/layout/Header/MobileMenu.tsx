"use client";

import { useAuthStore } from "@/features/auth/stores/authStore";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileMenuProps {
  menuOpen: boolean;
  onClose: () => void;
  navItems: { href: string; label: string }[];
}

export function MobileMenu({ menuOpen, onClose, navItems }: MobileMenuProps) {
  const pathname = usePathname();
  const { access, user } = useAuthStore();
  const isLoggedIn = Boolean(access && user);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  if (!menuOpen) return null;

  return (
    <div className="md:hidden border-t border-border bg-background shadow-sm">
      <nav className="flex flex-col space-y-1 p-4 text-sm font-medium">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`rounded-lg px-3 py-2 transition-colors ${
              isActive(item.href)
                ? "bg-muted text-[var(--primary)] font-semibold"
                : "text-muted-foreground hover:text-[var(--primary)] hover:bg-muted/50"
            }`}
          >
            {item.label}
          </Link>
        ))}

        <div className="border-t border-border my-2" />

        {isLoggedIn ? (
          <Link
            href="/mypage"
            onClick={onClose}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
              pathname.startsWith("/mypage")
                ? "bg-muted text-[var(--primary)] font-semibold"
                : "text-muted-foreground hover:text-[var(--primary)] hover:bg-muted/50"
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
            onClick={onClose}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-[var(--primary)] hover:bg-muted/50 transition-colors"
          >
            <span className="material-symbols-outlined text-xl opacity-80">
              login
            </span>
            <span>로그인/가입</span>
          </Link>
        )}
      </nav>
    </div>
  );
}
