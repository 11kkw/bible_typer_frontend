import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderNavProps {
  navItems: { href: string; label: string }[];
}

export function HeaderNav({ navItems }: HeaderNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
      {navItems.map((item) => {
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              group relative pb-1 transition-colors
              ${
                active
                  ? "text-[var(--primary)] font-semibold"
                  : "text-muted-foreground hover:text-[var(--primary)]"
              }
            `}
          >
            {item.label}

            {/* 밑줄 (활성 + hover 시 표시) */}
            <span
              className={`
                absolute left-0 -bottom-0.5 h-[2px] rounded-full bg-[var(--primary)]
                transition-all duration-300 ease-out
                ${
                  active
                    ? "w-full opacity-100"
                    : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                }
              `}
            />
          </Link>
        );
      })}
    </nav>
  );
}
