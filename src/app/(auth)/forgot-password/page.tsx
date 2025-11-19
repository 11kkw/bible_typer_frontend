"use client";

import { ForgotCredentials } from "@/features/auth/components/ForgotCredentials";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-background text-foreground">
      <div className="w-full max-w-3xl space-y-6 mx-auto">
        <div className="text-center space-y-2">
          <p className="text-sm uppercase tracking-wide text-primary font-semibold">
            Account Support
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            아이디 / 비밀번호 찾기
          </h1>
          <p className="text-sm text-muted-foreground">
            등록된 이메일로 계정 정보를 안전하게 안내해드립니다.
          </p>
        </div>
        <ForgotCredentials />
      </div>
    </main>
  );
}
