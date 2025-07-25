import { create } from "zustand";
import Cookies from "js-cookie";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: Cookies.get("accessToken") ?? null,
  isAuthenticated: !!Cookies.get("accessToken"),
  setToken: (token: string) => {
    Cookies.set("accessToken", token); // simpan di cookie 7 hari
    set({ token, isAuthenticated: true });
  },
  clear: () => {
    Cookies.remove("accessToken");
    set({ token: null, isAuthenticated: false });
  },
}));