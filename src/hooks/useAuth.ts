import { loginApi } from "@/api/auth";
import { useAuthStore } from "@/lib/store/authStore";
import { LoginRequest } from "@/types/api/auth";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
  const setAccess = useAuthStore((s) => s.setAccess);
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (data: LoginRequest) => loginApi(data),

    onSuccess: (data) => {
      setAccess(data.access);
      setUser(data.user);
      console.log("✅ 로그인 성공:", data.user.username);
    },

    onError: (err) => {
      console.error("❌ 로그인 실패:", err);
    },
  });
}
