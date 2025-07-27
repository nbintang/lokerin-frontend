import { create } from "zustand";
import Cookies from "js-cookie";
import { isExpiredToken } from "../helpers/isExpiredToken";
import axios from "axios";
import { BASE_URL } from "../constants";
import { lokerinAPI } from "../config/api";
import { jwtDecode, JwtUserPayload } from "../helpers/jwtDecode";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  initialize: () => Promise<string | null>;
  setToken: (token: string) => void;
  clear: () => void;
  logout: () => void;
  decodedToken:() => JwtUserPayload | null
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  isAuthenticated: false,
  initialize: async () => {
    const storedToken = Cookies.get("accessToken");
    if (!storedToken || isExpiredToken(storedToken)) {
      if (storedToken) Cookies.remove("accessToken");
      const response = await axios.post<{ accessToken: string }>(
        `${BASE_URL}/api/auth/refresh-token`,
        null,
        { withCredentials: true }
      );
      const newAccessToken = response.data.accessToken;
      get().setToken(newAccessToken);
      return newAccessToken;
    } else {
      set({ token: storedToken, isAuthenticated: true });
      return storedToken;
    }
  },
  setToken: (token: string) => {
    Cookies.set("accessToken", token);
    set({ token, isAuthenticated: true });
  },
  clear: () => {
    Cookies.remove("accessToken");
    set({ token: null, isAuthenticated: false });
  },
  logout: async () => {
    Cookies.remove("refreshToken");
    await lokerinAPI.delete(`/auth/signout`);
    get().clear();
  },
  decodedToken: () => {
    if (get().token) {
      return jwtDecode(get().token || "");
    }
    return null;
  }
}));
