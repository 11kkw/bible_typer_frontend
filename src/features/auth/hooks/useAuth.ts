import { useAuthStore } from "@/features/auth/stores/authStore";
import { LoginRequest, RegisterRequest } from "@/types/api/auth";
import { useMutation } from "@tanstack/react-query";
import { loginApi, registerApi } from "../services/auth.service";

export function useLogin() {
  const setAccess = useAuthStore((s) => s.setAccess);
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (data: LoginRequest) => loginApi(data),

    onSuccess: (data) => {
      setAccess(data.access);
      setUser(data.user);
    },

    onError: () => {
      //
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => registerApi(data),
  });
}
