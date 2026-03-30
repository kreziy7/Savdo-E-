/**
 * Lang store — MMKV bilan sinxron.
 * Til almashganda darhol saqlanadi, async kutmaydi.
 */
import { create } from "zustand";
import { mmkv } from "./storage";
import { Lang } from "@/i18n";

interface LangState {
  lang: Lang;
  loadLang: () => void;
  setLang: (lang: Lang) => void;
}

export const useLangStore = create<LangState>((set) => ({
  lang: "uz",

  loadLang: () => {
    const stored = mmkv.getString("lang");
    if (stored === "uz" || stored === "ru" || stored === "en") {
      set({ lang: stored });
    }
  },

  setLang: (lang: Lang) => {
    mmkv.setString("lang", lang);
    set({ lang });
  },
}));
