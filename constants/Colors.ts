export type ThemeColors = {
  primary: string;
  background: string;
  text: string;
  border: string;
  borderInput: string;
  white: string;
  textLight: string;
  expense: string;
  income: string;
  card: string;
  shadow: string;
  error: string;
  accent: string;
};

const lightTheme: ThemeColors = {
  primary: "#FF385C",       // Airbnb’s warm coral/red
  background: "#FFFFFF",    // Clean white
  text: "#222222",          // Deep neutral text
  card: "#F7F7F7",          // Soft gray card background
  border: "#E5E5E5",        // Subtle border gray
  borderInput: "#DDDDDD",   // Lighter input border
  textLight: "#717171",     // Muted gray text for secondary info
  income: "#008A5A",        // Calm green for positive
  expense: "#E63946",       // Red for warnings/errors
  white: "#FFFFFF",         // Neutral
  shadow: "rgba(0, 0, 0, 0.1)", // Subtle soft shadow
  error: "#FF385C",         // Error uses the coral red
  accent: "#FFB400",        // Warm yellow accent
};

const darkTheme: ThemeColors = {
  primary: "#FF5A75",       // Brighter coral red for contrast
  background: "#121212",    // Deep dark background
  text: "#EDEDED",          // Soft white text
  card: "#1E1E1E",          // Dark gray card
  border: "#2C2C2C",        // Subtle border
  borderInput: "#3A3A3A",   // Inputs still separated
  white: "#FFFFFF",
  textLight: "#A0A0A0",     // Muted gray text
  expense: "#FF6B6B",       // Vibrant red
  income: "#4CAF50",        // Fresh green
  shadow: "rgba(0,0,0,0.6)",// Darker shadow
  error: "#FF5A75",
  accent: "#FFC94D",        // Warm yellow accent
};

export const THEMES = {
  light: lightTheme,
  dark: darkTheme,
} as const;

// Type for the theme store getter function
type ThemeStoreGetter = { getState: () => { colors: ThemeColors } } | null;
let currentThemeStore: ThemeStoreGetter = null;

// Typed function to set the theme store
export const setThemeStore = (store: ThemeStoreGetter): void => {
  currentThemeStore = store;
};

// Dynamic COLORS proxy with proper typing for autocompletion
export const COLORS: ThemeColors = new Proxy({} as ThemeColors, {
  get(_, prop: keyof ThemeColors) {
    if (currentThemeStore) {
      return currentThemeStore.getState().colors[prop];
    }
    // Fallback to light theme if store not available
    return THEMES.light[prop];
  },
});
