import { AuthState } from "@/types/store/auth";
import { create } from "zustand";

export const useAuthStore = create<AuthState>((set) => ({
  access: null,
  user: null,
  setAccess: (token) => set({ access: token }),
  setUser: (user) => set({ user }),
  clearAuth: () => set({ access: null, user: null }),
}));