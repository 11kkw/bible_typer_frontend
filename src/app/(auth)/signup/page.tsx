"use client";

import { useRegister } from "@/features/auth/hooks/useAuth"; // ✅ 추가
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const registerMutation = useRegister(); // ✅ 실제 훅 사용

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    registerMutation.mutate({
      username: formData.username,
      email: formData.email,
      password1: formData.password,
      password2: formData.confirmPassword,
    });
  };

  // ✅ 성공/에러 토스트 처리
  useEffect(() => {
    if (registerMutation.isSuccess) {
      toast.success("회원가입 성공 🎉", {
        description: "이메일 인증 후 로그인해주세요.",
      });
    }

    if (registerMutation.isError) {
      const error = registerMutation.error as any;
      const message =
        Object.values(error?.response?.data || {})
          .flat()
          .join("\n") || "회원가입 중 오류가 발생했습니다.";

      toast.error("회원가입 실패 ❌", {
        description: message,
      });
    }
  }, [
    registerMutation.isSuccess,
    registerMutation.isError,
    registerMutation.error,
  ]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-background text-foreground">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
            회원가입
          </h2>
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 사용자 이름 */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-muted-foreground"
              >
                사용자 이름
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                placeholder="사용자 이름을 입력하세요"
                value={formData.username}
                onChange={handleChange}
                className="form-input mt-1"
              />
            </div>

            {/* 이메일 */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-muted-foreground"
              >
                이메일 주소
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="form-input mt-1"
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-muted-foreground"
              >
                비밀번호
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
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

            {/* 비밀번호 확인 */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-muted-foreground"
              >
                비밀번호 확인
              </label>
              <div className="relative mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                  aria-label={showConfirm ? "비밀번호 숨기기" : "비밀번호 보기"}
                >
                  {showConfirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* 회원가입 버튼 */}
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="btn-primary w-full py-3 font-medium text-base flex justify-center items-center gap-2 disabled:opacity-60"
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  회원가입 중...
                </>
              ) : (
                "회원가입"
              )}
            </button>
          </form>

          {/* 이미 계정이 있으신가요? */}
          <p className="text-center text-sm text-muted-foreground mt-4">
            이미 계정이 있으신가요?{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
