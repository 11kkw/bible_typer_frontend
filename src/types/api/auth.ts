import { User } from "../models/user";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh?: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password1: string;
  password2: string;
}

export interface RegisterResponse {
  detail: string;
}
