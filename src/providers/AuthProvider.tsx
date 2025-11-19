"use client";

import { apiClient } from "@/core/http/apiClient";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { useEffect, useState } from "react";

/**
 * AuthProvider
 * - 앱 초기 구동 시 refresh 쿠키를 사용해 access 토큰 복원
 * - access가 유효하면 /auth/user/ 로 사용자 정보 로드
 * - ready 상태가 true가 될 때까지는 아무 것도 렌더링하지 않음 (hydration-safe)
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { access, setAccess, setUser, clearAuth } = useAuthStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // 1️⃣ access가 없으면 refresh 쿠키로 자동 로그인 시도
        if (!access) {
          const baseUrl =
            process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";
          const refreshUrl = `${baseUrl}/auth/token/refresh/`;

          const refreshRes = await fetch(refreshUrl, {
            method: "POST",
            credentials: "include", // refresh 쿠키 자동 전송
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: "cookie" }), // 서버는 쿠키를 우선 읽으므로 더미 값 전달
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            if (data?.access) {
              setAccess(data.access);
            } else {
              clearAuth();
            }
          } else {
            clearAuth();
          }
        }

        // 2️⃣ access가 존재하면 사용자 정보 조회
        if (access) {
          const user = await apiClient("/auth/user/");
          if (user) {
            setUser(user);
          }
        }
      } catch {
        clearAuth();
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [access, setAccess, setUser, clearAuth]);

  if (!ready) return null;

  return <>{children}</>;
}
