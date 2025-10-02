import Link from "next/link";

export function Header() {
  return (
    <header className="w-full px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-blue-600 leading-none">
              auto_stories
            </span>
            <h2 className="text-xl font-bold tracking-tight leading-none">
              성경 타자
            </h2>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-text-light hover:text-text-dark transition-colors"
            >
              로그인
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center h-10 px-5 text-sm font-bold text-white bg-[#3b82f6] rounded-lg shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:bg-[#2563eb]"
            >
              회원가입
            </Link>
          </div>

          <button className="md:hidden p-2 rounded-md text-text-light hover:text-text-dark hover:bg-gray-100">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
