import { User } from "@/types/models/user";
import { create } from "zustand";

interface AuthState {
  access: string | null;
  user: User | null;
  setAccess: (token: string | null) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  access: null,
  user: null,
  setAccess: (token) => set({ access: token }),
  setUser: (user) => set({ user }),
  clearAuth: () => set({ access: null, user: null }),
}));
