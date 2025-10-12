import { User } from "../models/user";

export interface AuthState {
  access: string | null;
  user: User | null;
  setAccess: (token: string | null) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
}