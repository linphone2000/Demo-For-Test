import { setThemeStore, ThemeColors, THEMES } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance, ColorSchemeName } from "react-native";
import { create } from "zustand";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  mode: ThemeMode; // what user chose
  isDark: boolean; // effective
  colors: ThemeColors;

  // Actions
  toggleTheme: () => Promise<void>;
  setTheme: (mode: ThemeMode) => Promise<void>;
  restore: () => Promise<void>;
  applySystem: (scheme: ColorSchemeName) => void; // react to system change
}

const THEME_STORAGE_KEY = "app_theme_mode";

export const useThemeStore = create<ThemeState>((set, get) => {
  // Register with colors.ts so COLORS works anywhere
  setThemeStore({ getState: get });

  const compute = (mode: ThemeMode, system: ColorSchemeName) => {
    const isDark = mode === "dark" || (mode === "system" && system === "dark");
    return {
      mode,
      isDark,
      colors: isDark ? THEMES.dark : THEMES.light,
    };
  };

  return {
    mode: "light",
    isDark: false,
    colors: THEMES.light,

    toggleTheme: async () => {
      const { mode } = get();
      let nextMode: ThemeMode;

      if (mode === "light") {
        nextMode = "dark";
      } else if (mode === "dark") {
        nextMode = "system";
      } else {
        // If system, toggle based on current effective theme
        nextMode = get().isDark ? "light" : "dark";
      }

      await get().setTheme(nextMode);
    },

    setTheme: async (mode: ThemeMode) => {
      try {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      } catch (e) {
        console.error("Error saving theme:", e);
      }
      const sys = Appearance.getColorScheme();
      set(compute(mode, sys));
    },

    restore: async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        const mode: ThemeMode = (saved as ThemeMode) || "light";
        const sys = Appearance.getColorScheme();
        set(compute(mode, sys));
      } catch (e) {
        console.error("Error restoring theme:", e);
        const sys = Appearance.getColorScheme();
        set(compute("light", sys));
      }
    },

    applySystem: (scheme: ColorSchemeName) => {
      const { mode } = get();
      if (mode === "system") {
        const sys = scheme || Appearance.getColorScheme();
        set({
          ...get(),
          ...compute("system", sys),
        });
      }
    },
  };
});
