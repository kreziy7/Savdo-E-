/**
 * Auth store — MMKV (10x tezroq AsyncStorage dan).
 * Token, refreshToken MMKV da sinxron saqlanadi.
 */
import { create } from "zustand";
import { mmkv } from "./storage";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  loadToken: () => void;
  setToken: (token: string, refreshToken: string) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  refreshToken: null,

  loadToken: () => {
    const token = mmkv.getString("token");
    const refreshToken = mmkv.getString("refreshToken");
    set({ token, refreshToken });
  },

  setToken: (token, refreshToken) => {
    mmkv.setString("token", token);
    mmkv.setString("refreshToken", refreshToken);
    set({ token, refreshToken });
  },

  clearToken: () => {
    mmkv.delete("token");
    mmkv.delete("refreshToken");
    set({ token: null, refreshToken: null });
  },
}));
