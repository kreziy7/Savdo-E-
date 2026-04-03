import { create } from "zustand";
import { mmkv } from "./storage";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  loadToken: () => Promise<void>;
  setToken: (token: string, refreshToken: string) => Promise<void>;
  clearToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  refreshToken: null,

  loadToken: async () => {
    const token = await mmkv.getString("token");
    const refreshToken = await mmkv.getString("refreshToken");
    set({ token, refreshToken });
  },

  setToken: async (token, refreshToken) => {
    await mmkv.setString("token", token);
    await mmkv.setString("refreshToken", refreshToken);
    set({ token, refreshToken });
  },

  clearToken: async () => {
    await mmkv.delete("token");
    await mmkv.delete("refreshToken");
    set({ token: null, refreshToken: null });
  },
}));
