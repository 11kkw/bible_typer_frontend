import { apiClient } from "@/core/http/apiClient";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/api/auth";

export async function loginApi(data: LoginRequest): Promise<LoginResponse> {
  return apiClient("/auth/login/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function registerApi(
  data: RegisterRequest
): Promise<RegisterResponse> {
  return apiClient("/auth/registration/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
