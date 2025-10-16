"use client";

import { useLogin } from "@/features/auth/hooks/useAuth";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const loginMutation = useLogin();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  // ✅ 로그인 성공/실패 토스트
  useEffect(() => {
    if (loginMutation.isSuccess) {
      router.push("/");
    }

    if (loginMutation.isError) {
      toast.error("로그인 실패 ❌", {
        description:
          (loginMutation.error as any)?.response?.data?.detail ||
          "아이디 또는 비밀번호가 올바르지 않습니다.",
      });
    }
  }, [loginMutation.isSuccess, loginMutation.isError, loginMutation.error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-background text-foreground">
      <div className="w-full max-w-md space-y-8">
        {/* ===== 로고 ===== */}
        <div className="text-center">
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
            로그인
          </h2>
        </div>

        {/* ===== 로그인 카드 ===== */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 아이디 (username) */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-muted-foreground"
              >
                아이디
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="아이디를 입력하세요"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* 비밀번호 */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  비밀번호
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  아이디/비밀번호 찾기
                </Link>
              </div>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                  aria-label={
                    showPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="btn-primary w-full py-3 font-medium text-base disabled:opacity-60 flex justify-center items-center gap-2"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  로그인 중...
                </>
              ) : (
                "로그인"
              )}
            </button>
          </form>

          {/* ✅ 회원가입 링크 추가 */}
          <div className="text-center text-sm text-muted-foreground mt-4">
            계정이 없으신가요?{" "}
            <Link
              href="/signup"
              className="text-primary font-medium hover:underline"
            >
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
