import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set, get) => ({
      isDark: true,
      toggleTheme: () => {
        const next = !get().isDark;
        document.documentElement.classList.toggle('dark', next);
        set({ isDark: next });
      },
      applyTheme: () => {
        document.documentElement.classList.toggle('dark', get().isDark);
      },
    }),
    {
      name: 'savdo-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.classList.toggle('dark', state.isDark ?? true);
        }
      },
    }
  )
);

export default useThemeStore;
