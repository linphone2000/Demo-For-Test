# PropertyApp Developer Guide

A comprehensive guide to build a React Native Expo app from this boilerplate with TypeScript, internationalization, theming, and state management.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Dependencies Installation](#dependencies-installation)
4. [Project Structure](#project-structure)
5. [Core Configuration Files](#core-configuration-files)
6. [Theme System](#theme-system)
7. [Internationalization (i18n)](#internationalization-i18n)
8. [State Management](#state-management)
9. [Navigation Setup](#navigation-setup)
10. [Component Structure](#component-structure)
11. [Running the App](#running-the-app)

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI**: `npm install -g @expo/cli`
- **Git**
- **iOS Simulator** (for iOS development) or **Android Studio** (for Android development)

## Project Setup

### Step 1: Create New Expo Project

```bash
# Create a new Expo project with TypeScript template
npx create-expo-app@latest YourAppName --template blank-typescript

# Navigate to project directory
cd YourAppName
```

### Step 2: Install Expo Router

```bash
# Install expo-router for file-based routing
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

### Step 3: Update package.json

Replace your `package.json` with:

```json
{
  "name": "yourappname",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "@react-native-async-storage/async-storage": "^2.2.0",
    "axios": "^1.11.0",
    "expo": "~53.0.20",
    "expo-haptics": "^14.1.4",
    "expo-localization": "^16.1.6",
    "expo-router": "^5.1.4",
    "expo-status-bar": "~2.2.3",
    "expo-vector-icons": "^10.0.1",
    "i18next": "^25.3.6",
    "i18next-http-backend": "^3.0.2",
    "react-i18next": "^15.3.0",
    "react": "19.0.0",
    "react-native": "0.79.5",
    "react-native-safe-area-context": "^5.6.1",
    "zustand": "^5.0.8"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@types/react": "~19.0.10",
    "eslint-config-expo": "^9.2.0",
    "prettier": "^3.6.2",
    "typescript": "~5.8.3"
  },
  "private": true
}
```

## Dependencies Installation

```bash
# Install all dependencies
npm install

# Or if using yarn
yarn install
```

## Project Structure

Create the following folder structure:

```
YourAppName/
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout
│   ├── (root)/            # Main app screens
│   │   ├── _layout.tsx    # Tab navigation layout
│   │   ├── home/
│   │   │   └── index.tsx
│   │   ├── property/
│   │   │   └── index.tsx
│   │   └── profile/
│   │       └── index.tsx
│   └── (share)/           # Shared screens (modals, etc.)
│       └── sign-in.tsx
├── components/            # Reusable components
│   └── Global/
├── constants/             # App constants
├── locales/              # Internationalization files
├── screens/              # Screen components
├── stores/               # State management
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
├── assets/               # Images, fonts, etc.
├── app.json             # Expo configuration
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript configuration
└── eslint.config.js     # ESLint configuration
```

## Core Configuration Files

### 1. TypeScript Configuration (tsconfig.json)

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "types/**/*.d.ts"
  ]
}
```

### 2. ESLint Configuration (eslint.config.js)

```javascript
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
]);
```

### 3. Expo Configuration (app.json)

```json
{
  "expo": {
    "name": "YourAppName",
    "slug": "YourAppName",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

## Theme System

### 1. Create Colors Constants (constants/Colors.ts)

```typescript
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
  primary: "#FF385C",
  background: "#FFFFFF",
  text: "#222222",
  card: "#F7F7F7",
  border: "#E5E5E5",
  borderInput: "#DDDDDD",
  textLight: "#717171",
  income: "#008A5A",
  expense: "#E63946",
  white: "#FFFFFF",
  shadow: "rgba(0, 0, 0, 0.1)",
  error: "#FF385C",
  accent: "#FFB400",
};

const darkTheme: ThemeColors = {
  primary: "#FF5A75",
  background: "#121212",
  text: "#EDEDED",
  card: "#1E1E1E",
  border: "#2C2C2C",
  borderInput: "#3A3A3A",
  white: "#FFFFFF",
  textLight: "#A0A0A0",
  expense: "#FF6B6B",
  income: "#4CAF50",
  shadow: "rgba(0,0,0,0.6)",
  error: "#FF5A75",
  accent: "#FFC94D",
};

export const THEMES = {
  light: lightTheme,
  dark: darkTheme,
} as const;

type ThemeStoreGetter = { getState: () => { colors: ThemeColors } } | null;
let currentThemeStore: ThemeStoreGetter = null;

export const setThemeStore = (store: ThemeStoreGetter): void => {
  currentThemeStore = store;
};

export const COLORS: ThemeColors = new Proxy({} as ThemeColors, {
  get(_, prop: keyof ThemeColors) {
    if (currentThemeStore) {
      return currentThemeStore.getState().colors[prop];
    }
    return THEMES.light[prop];
  },
});
```

### 2. Create Theme Store (stores/useThemeStore.ts)

```typescript
import { setThemeStore, ThemeColors, THEMES } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance, ColorSchemeName } from "react-native";
import { create } from "zustand";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => Promise<void>;
  setTheme: (mode: ThemeMode) => Promise<void>;
  restore: () => Promise<void>;
  applySystem: (scheme: ColorSchemeName) => void;
}

const THEME_STORAGE_KEY = "app_theme_mode";

export const useThemeStore = create<ThemeState>((set, get) => {
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
```

## Internationalization (i18n)

### 1. Create i18n Configuration (locales/i18n.ts)

```typescript
import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en/translation.json";
import mm from "./mm/translation.json";

const fallbackLng = "en";
const locales = getLocales();
const deviceLanguage = locales[0]?.languageCode || fallbackLng;
const supportedLanguages = ["en", "mm"];
const lng = supportedLanguages.includes(deviceLanguage)
  ? deviceLanguage
  : fallbackLng;

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v4",
    lng,
    fallbackLng,
    resources: {
      en: {
        translation: en,
      },
      mm: {
        translation: mm,
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

### 2. Create Translation Files

**locales/en/translation.json:**
```json
{
  "common": {
    "home": "Home",
    "property": "Property",
    "profile": "Profile",
    "settings": "Settings",
    "language": "Language",
    "theme": "Theme",
    "light": "Light",
    "dark": "Dark",
    "system": "System",
    "close": "Close",
    "save": "Save",
    "cancel": "Cancel",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success"
  },
  "auth": {
    "signIn": "Sign In",
    "signUp": "Sign Up",
    "signOut": "Sign Out",
    "fullName": "Full Name",
    "email": "Email",
    "password": "Password",
    "confirmPassword": "Confirm Password",
    "signInRequired": "Sign In Required",
    "signInRequiredSubtitle": "Please sign in to access your profile and settings",
    "dontHaveAccount": "Don't have an account?",
    "alreadyHaveAccount": "Already have an account?",
    "toggleToSignUp": "Sign Up",
    "toggleToSignIn": "Sign In",
    "authButtonText": "Sign In",
    "authButtonTextSignUp": "Sign Up",
    "signInSubtitle": "Welcome back",
    "signUpSubtitle": "Create your account"
  },
  "home": {
    "title": "Home Screen - Public Access",
    "authStatus": "Authentication Status",
    "signedIn": "Signed In",
    "guest": "Guest"
  },
  "property": {
    "title": "Property Screen - Public Access",
    "addContent": "Add your property content here"
  },
  "profile": {
    "userInfo": "User Information",
    "settings": "Settings",
    "themeToggle": "Theme: {{mode}}",
    "themeToggleSubtitle": "Tap to toggle"
  },
  "settings": {
    "title": "Settings",
    "language": "Language",
    "theme": "Theme",
    "signInForMore": "Sign in for more features",
    "signInSubtitle": "Access your profile, save preferences, and unlock additional settings",
    "goToLogin": "Go to Login"
  }
}
```

**locales/mm/translation.json:**
```json
{
  "common": {
    "home": "အိမ်",
    "property": "ပိုင်ဆိုင်မှု",
    "profile": "ပရိုဖိုင်",
    "settings": "ဆက်တင်များ",
    "language": "ဘာသာစကား",
    "theme": "အပြင်အဆင်",
    "light": "အလင်း",
    "dark": "အမှောင်",
    "system": "စနစ်",
    "close": "ပိတ်ရန်",
    "save": "သိမ်းရန်",
    "cancel": "ပယ်ဖျက်ရန်",
    "loading": "ဖွင့်နေသည်...",
    "error": "အမှား",
    "success": "အောင်မြင်သည်"
  }
}
```

## State Management

### 1. Create Auth Store (stores/useAuthStore.ts)

```typescript
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, fullName: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  restoreAuth: () => Promise<void>;
}

const AUTH_STORAGE_KEY = "app_auth_user";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  signIn: async (email: string, password: string) => {
    set({ isLoading: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user: User = {
        id: "1",
        email,
        fullName: "John Doe",
      };
      
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      return true;
    } catch (error) {
      set({ isLoading: false });
      return false;
    }
  },

  signUp: async (email: string, password: string, fullName: string) => {
    set({ isLoading: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user: User = {
        id: "1",
        email,
        fullName,
      };
      
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      return true;
    } catch (error) {
      set({ isLoading: false });
      return false;
    }
  },

  signOut: async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error("Error signing out:", error);
    }
    
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  restoreAuth: async () => {
    try {
      const userData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (userData) {
        const user = JSON.parse(userData);
        set({
          user,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error("Error restoring auth:", error);
    }
  },
}));
```

### 2. Create Settings Modal Store (stores/useSettingsModalStore.ts)

```typescript
import { create } from "zustand";

interface SettingsModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useSettingsModalStore = create<SettingsModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
```

## Navigation Setup

### 1. Root Layout (app/_layout.tsx)

```typescript
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useThemeStore } from "@/stores/useThemeStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Appearance } from "react-native";
import SettingsModal from "@/components/Global/SettingsModal";
import { useSettingsModalStore } from "@/stores/useSettingsModalStore";
import { useTranslation } from "react-i18next";
import { View, Text } from "react-native";
import "@/locales/i18n";

export default function RootLayout() {
  const { restore: restoreTheme, applySystem } = useThemeStore();
  const { restoreAuth } = useAuthStore();
  const { isOpen, closeModal } = useSettingsModalStore();
  const { i18n } = useTranslation();
  const [isI18nReady, setIsI18nReady] = useState(false);

  useEffect(() => {
    if (i18n.isInitialized) {
      setIsI18nReady(true);
    } else {
      const checkI18n = () => {
        if (i18n.isInitialized) {
          setIsI18nReady(true);
        } else {
          setTimeout(checkI18n, 100);
        }
      };
      checkI18n();
    }
  }, [i18n.isInitialized]);

  useEffect(() => {
    if (!isI18nReady) return;
    
    restoreTheme();
    restoreAuth();

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      applySystem(colorScheme);
    });

    return () => subscription?.remove();
  }, [restoreTheme, restoreAuth, applySystem, isI18nReady]);

  if (!isI18nReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Initializing...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="(root)"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="(share)/sign-in"
          options={{
            headerShown: false,
            presentation: "modal",
          }}
        />
      </Stack>
      
      <SettingsModal visible={isOpen} onClose={closeModal} />
    </>
  );
}
```

### 2. Tab Navigation Layout (app/(root)/_layout.tsx)

```typescript
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
        },
        headerStyle: {
          backgroundColor: COLORS.background,
        },
        headerTintColor: COLORS.text,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t("common.home"),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="property"
        options={{
          title: t("common.property"),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "business" : "business-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("common.profile"),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
```

## Component Structure

### 1. Create Global Components

**components/Global/SettingsModal.tsx:**
```typescript
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "@/stores/useThemeStore";
import { COLORS } from "@/constants/Colors";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { t } = useTranslation();
  const { mode, toggleTheme } = useThemeStore();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: COLORS.text }]}>
            {t("settings.title")}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeText, { color: COLORS.primary }]}>
              {t("common.close")}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <TouchableOpacity
            style={[styles.settingItem, { borderBottomColor: COLORS.border }]}
            onPress={toggleTheme}
          >
            <Text style={[styles.settingLabel, { color: COLORS.text }]}>
              {t("settings.theme")}
            </Text>
            <Text style={[styles.settingValue, { color: COLORS.textLight }]}>
              {t(`common.${mode}`)}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 16,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 16,
  },
});
```

### 2. Create Screen Components

**screens/HomeScreen/index.tsx:**
```typescript
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSettingsModalStore } from "@/stores/useSettingsModalStore";
import { COLORS } from "@/constants/Colors";

export default function HomeScreen() {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuthStore();
  const { openModal } = useSettingsModalStore();

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <Text style={[styles.title, { color: COLORS.text }]}>
        {t("home.title")}
      </Text>
      
      <View style={[styles.statusCard, { backgroundColor: COLORS.card }]}>
        <Text style={[styles.statusLabel, { color: COLORS.textLight }]}>
          {t("home.authStatus")}
        </Text>
        <Text style={[styles.statusValue, { color: COLORS.text }]}>
          {isAuthenticated ? t("home.signedIn") : t("home.guest")}
        </Text>
        {user && (
          <Text style={[styles.userInfo, { color: COLORS.textLight }]}>
            {user.fullName} ({user.email})
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.settingsButton, { backgroundColor: COLORS.primary }]}
        onPress={openModal}
      >
        <Text style={[styles.settingsButtonText, { color: COLORS.white }]}>
          {t("common.settings")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 32,
  },
  statusCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  userInfo: {
    fontSize: 14,
  },
  settingsButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  settingsButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
```

## Running the App

### 1. Start the Development Server

```bash
# Start Expo development server
npm start

# Or for specific platforms
npm run ios     # iOS simulator
npm run android # Android emulator
npm run web     # Web browser
```

### 2. Testing on Device

1. Install the **Expo Go** app on your mobile device
2. Scan the QR code displayed in the terminal
3. The app will load on your device

### 3. Building for Production

```bash
# Build for iOS
npx expo build:ios

# Build for Android
npx expo build:android

# Create standalone app
npx expo export
```

## Additional Features to Implement

1. **API Integration**: Replace mock data with real API calls
2. **Form Validation**: Add form validation libraries like Formik or React Hook Form
3. **Image Handling**: Add image picker and upload functionality
4. **Push Notifications**: Implement push notifications
5. **Offline Support**: Add offline data persistence
6. **Testing**: Add unit and integration tests
7. **CI/CD**: Set up continuous integration and deployment

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `npx expo start --clear`
2. **TypeScript errors**: Restart TypeScript server in your editor
3. **Dependency conflicts**: Delete `node_modules` and `package-lock.json`, then run `npm install`
4. **iOS build issues**: Clean build folder in Xcode
5. **Android build issues**: Clean project in Android Studio

### Performance Tips

1. Use `React.memo()` for expensive components
2. Implement proper list virtualization for long lists
3. Optimize images and assets
4. Use lazy loading for screens
5. Implement proper error boundaries

This guide provides a solid foundation for building a React Native Expo app with modern best practices. Follow each step carefully and customize the code according to your specific requirements.
