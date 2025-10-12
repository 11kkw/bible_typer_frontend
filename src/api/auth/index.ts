import { LoginRequest, LoginResponse } from "@/types/api/auth";
import { apiClient } from "../client";

export async function loginApi(data: LoginRequest): Promise<LoginResponse> {
  return apiClient("/auth/login/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}