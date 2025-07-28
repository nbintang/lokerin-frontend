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
  isRefreshing: boolean; // Tambahan untuk mencegah multiple refresh
  initialize: () => Promise<string | null>;
  setToken: (token: string) => void;
  clear: () => void;
  logout: () => void;
  decodedToken: () => JwtUserPayload | null;
}

// Global variable untuk mencegah multiple refresh token calls
let refreshPromise: Promise<string | null> | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  isAuthenticated: false,
  isRefreshing: false,

  initialize: async () => {
    // Jika sedang refresh, tunggu hasil dari refresh yang sedang berjalan
    if (refreshPromise) {
      return refreshPromise;
    }

    const storedToken = Cookies.get("accessToken");
    
    if (!storedToken || isExpiredToken(storedToken)) {
      // Jika tidak ada token atau expired, coba refresh
      set({ isRefreshing: true });
      
      refreshPromise = (async () => {
        try {
          if (storedToken) {
            Cookies.remove("accessToken");
          }
          
          const response = await axios.post<{ accessToken: string }>(
            `${BASE_URL}/api/auth/refresh-token`,
            null,
            { 
              withCredentials: true,
              timeout: 10000 // 10 detik timeout
            }
          );
          
          const newAccessToken = response.data.accessToken;
          get().setToken(newAccessToken);
          return newAccessToken;
        } catch (error) {
          console.error('Token refresh failed:', error);
          get().clear();
          return null;
        } finally {
          set({ isRefreshing: false });
          refreshPromise = null;
        }
      })();
      
      return refreshPromise;
    } else {
      // Token masih valid
      set({ token: storedToken, isAuthenticated: true });
      return storedToken;
    }
  },

  setToken: (token: string) => {
    // Set cookie dengan expiration time yang sesuai
    Cookies.set("accessToken", token, {
      expires: 1/96, // 15 menit (1/96 hari)
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    set({ token, isAuthenticated: true });
  },

  clear: () => {
    Cookies.remove("accessToken");
    set({ token: null, isAuthenticated: false, isRefreshing: false });
    // Reset refresh promise
    refreshPromise = null;
  },

  logout: async () => {
    try { 
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");

      await lokerinAPI.delete(`/auth/signout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      get().clear();
    }
  },

  decodedToken: () => {
    const currentToken = get().token;
    if (currentToken && !isExpiredToken(currentToken)) {
      try {
        return jwtDecode(currentToken);
      } catch (error) {
        console.error('Error decoding token:', error);
        get().clear();
        return null;
      }
    }
    return null;
  }
}));