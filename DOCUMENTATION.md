# React Native Boilerplate - Complete Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Installation & Setup](#installation--setup)
5. [Project Structure](#project-structure)
6. [Core Components](#core-components)
7. [State Management](#state-management)
8. [Authentication System](#authentication-system)
9. [Theme System](#theme-system)
10. [Internationalization](#internationalization)
11. [Navigation](#navigation)
12. [Storage](#storage)
13. [API Reference](#api-reference)
14. [Customization Guide](#customization-guide)
15. [Best Practices](#best-practices)
16. [Troubleshooting](#troubleshooting)
17. [Deployment](#deployment)

---

## 🎯 Overview

This React Native boilerplate provides a production-ready foundation for building mobile applications with:

- **Local Authentication** using AsyncStorage
- **Dynamic Theme System** (Light/Dark/System)
- **Internationalization** (i18n) support
- **Protected Routes** with modal-based authentication
- **TypeScript** throughout
- **Modern Architecture** with Zustand state management
- **Expo Router** for navigation
- **Clean, Minimal UI** ready for customization

### Key Benefits

✅ **Zero External Dependencies** - Works completely offline  
✅ **Fast Development** - Pre-configured with best practices  
✅ **Scalable Architecture** - Easy to extend and maintain  
✅ **Mobile-First UX** - Guest-friendly with optional authentication  
✅ **Production Ready** - Type-safe, error-handled, well-tested patterns  

---

## ✨ Features

### 🔐 Authentication
- Local user authentication with AsyncStorage
- Sign in/Sign up with form validation
- Session restoration on app restart
- Protected routes (Profile tab only)
- Modal-based authentication flow

### 🎨 Theme Management
- Light, Dark, and System theme support
- Persistent theme preferences
- Dynamic color switching
- System theme change detection
- Comprehensive color palette

### 🌍 Internationalization
- English and Myanmar language support
- Device language detection
- Dynamic language switching
- Complete translation coverage
- Easy to add new languages

### 📱 Navigation
- Tab-based navigation for main screens
- Modal presentation for authentication
- Back button support
- Deep linking ready

### 💾 Local Storage
- AsyncStorage for data persistence
- User authentication data
- Theme preferences
- Error handling and fallbacks

---

## 🏗️ Architecture

### Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | 0.79.5 | Mobile app framework |
| Expo | ~53.0.20 | Development platform |
| Expo Router | ^5.1.4 | File-based navigation |
| Zustand | ^5.0.8 | State management |
| TypeScript | ~5.8.3 | Type safety |
| AsyncStorage | ^2.2.0 | Local data persistence |
| i18next | ^25.3.6 | Internationalization |
| React i18next | ^15.3.0 | React i18n integration |

### Architecture Principles

1. **Separation of Concerns** - Clear separation between UI, logic, and data
2. **Single Source of Truth** - Centralized state management
3. **Type Safety** - Full TypeScript coverage
4. **Modular Design** - Reusable components and utilities
5. **Offline First** - All data stored locally
6. **Progressive Enhancement** - Core features work without authentication

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PropertyApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web (optional)
   npm run web
   ```

### Environment Setup

The app is configured to work out-of-the-box with no additional setup required. All configurations are in:

- `app.json` - Expo configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint rules

---

## 📁 Project Structure

```
PropertyApp/
├── app/                          # Expo Router screens
│   ├── (root)/                   # Main app screens
│   │   ├── _layout.tsx          # Tab navigation layout
│   │   ├── home/                # Home screen
│   │   ├── property/            # Property screen
│   │   └── profile/             # Profile screen
│   ├── (share)/                 # Shared screens (modals)
│   │   ├── _layout.tsx          # Modal layout
│   │   └── sign-in.tsx          # Authentication modal
│   └── _layout.tsx              # Root layout
├── components/                   # Reusable components
│   └── Global/                  # Global components
│       ├── CustomHeader.tsx     # Header component
│       └── SettingsModal.tsx    # Settings modal
├── constants/                    # App constants
│   └── Colors.ts               # Theme colors
├── locales/                     # Internationalization
│   ├── en/                     # English translations
│   ├── mm/                     # Myanmar translations
│   └── i18n.ts                 # i18n configuration
├── screens/                     # Screen components
│   ├── AuthScreen/             # Authentication screens
│   ├── HomeScreen/             # Home screen
│   ├── PropertyScreen/         # Property screen
│   └── ProfileScreen/          # Profile screen
├── stores/                      # Zustand stores
│   ├── useAuthStore.ts         # Authentication state
│   ├── useThemeStore.ts        # Theme state
│   └── useSettingsModalStore.ts # Settings modal state
├── types/                       # TypeScript types
│   ├── images.d.ts             # Image type declarations
│   └── models.ts               # Data models
├── utils/                       # Utility functions
│   ├── themeStyles.ts          # Theme-aware styles
│   └── useInsetsHelpers.ts     # Safe area helpers
├── assets/                      # Static assets
├── app.json                     # Expo configuration
├── package.json                 # Dependencies
└── tsconfig.json               # TypeScript configuration
```

---

## 🧩 Core Components

### CustomHeader

A flexible header component used across all screens.

```typescript
interface CustomHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  isMainTab?: boolean;
  showNotificationBell?: boolean;
  onNotificationPress?: () => void;
  notificationCount?: number;
  showSettingsButton?: boolean;
  rightAction?: {
    icon?: string;
    text?: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
  };
}
```

**Usage:**
```typescript
<CustomHeader 
  title="Home"
  isMainTab
  showSettingsButton
  showNotificationBell
  notificationCount={5}
  onNotificationPress={() => {}}
/>
```

### SettingsModal

A compact modal for language and theme settings.

```typescript
interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}
```

**Features:**
- Language toggle (EN ↔ MM)
- Theme toggle (Light ↔ Dark)
- Authentication prompt for guests
- Responsive design

---

## 🗃️ State Management

### Zustand Stores

The app uses Zustand for lightweight, efficient state management.

#### useAuthStore

Manages user authentication state.

```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  restoreAuth: () => Promise<void>;
}
```

**Usage:**
```typescript
const { user, isAuthenticated, signIn, signOut } = useAuthStore();
```

#### useThemeStore

Manages theme preferences and colors.

```typescript
interface ThemeState {
  mode: ThemeMode; // "light" | "dark" | "system"
  isDark: boolean; // effective theme
  colors: ThemeColors;
  
  // Actions
  toggleTheme: () => Promise<void>;
  setTheme: (mode: ThemeMode) => Promise<void>;
  restore: () => Promise<void>;
  applySystem: (scheme: ColorSchemeName) => void;
}
```

**Usage:**
```typescript
const { colors, mode, toggleTheme } = useThemeStore();
```

#### useSettingsModalStore

Manages the settings modal visibility.

```typescript
interface SettingsModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}
```

**Usage:**
```typescript
const { isOpen, openModal, closeModal } = useSettingsModalStore();
```

---

## 🔐 Authentication System

### Overview

The authentication system is designed to be:
- **Local-first** - No external database required
- **Guest-friendly** - Users can explore without signing up
- **Secure** - Data stored locally with proper validation
- **Persistent** - Sessions survive app restarts

### User Model

```typescript
interface User {
  id: string;
  email: string;
  name: string;
}
```

### Authentication Flow

1. **App Start** - `restoreAuth()` checks for existing session
2. **Guest Mode** - Users can access Home and Property tabs
3. **Protected Access** - Profile tab requires authentication
4. **Sign In/Up** - Modal-based authentication flow
5. **Session Management** - Automatic session restoration

### Storage Keys

- `app_auth_user` - User authentication data

### Implementation Details

```typescript
// Sign in
const success = await signIn(email, password);

// Sign up
const success = await signUp(email, password, name);

// Sign out
await signOut();

// Check authentication
const { isAuthenticated, user } = useAuthStore();
```

---

## 🎨 Theme System

### Color Palette

The app includes a comprehensive color system with light and dark themes.

#### Light Theme Colors

```typescript
const lightTheme: ThemeColors = {
  primary: "#FF385C",       // Airbnb's warm coral/red
  background: "#FFFFFF",    // Clean white
  text: "#222222",          // Deep neutral text
  card: "#F7F7F7",          // Soft gray card background
  border: "#E5E5E5",        // Subtle border gray
  borderInput: "#DDDDDD",   // Lighter input border
  textLight: "#717171",     // Muted gray text
  income: "#008A5A",        // Calm green for positive
  expense: "#E63946",       // Red for warnings/errors
  white: "#FFFFFF",         // Neutral white
  shadow: "rgba(0, 0, 0, 0.1)", // Subtle shadow
  error: "#FF385C",         // Error color
  accent: "#FFB400",        // Warm yellow accent
};
```

#### Dark Theme Colors

```typescript
const darkTheme: ThemeColors = {
  primary: "#FF5A75",       // Brighter coral red
  background: "#121212",    // Deep dark background
  text: "#EDEDED",          // Soft white text
  card: "#1E1E1E",          // Dark gray card
  border: "#2C2C2C",        // Subtle border
  borderInput: "#3A3A3A",   // Input borders
  white: "#FFFFFF",
  textLight: "#A0A0A0",     // Muted gray text
  expense: "#FF6B6B",       // Vibrant red
  income: "#4CAF50",        // Fresh green
  shadow: "rgba(0,0,0,0.6)", // Darker shadow
  error: "#FF5A75",
  accent: "#FFC94D",        // Warm yellow accent
};
```

### Dynamic Colors

Use the `COLORS` proxy for dynamic theme access:

```typescript
import { COLORS } from "@/constants/Colors";

// Automatically uses current theme
const backgroundColor = COLORS.background;
const textColor = COLORS.text;
```

### Theme Modes

- **Light** - Always light theme
- **Dark** - Always dark theme  
- **System** - Follows device theme

### Storage

- `app_theme_mode` - Theme preference

---

## 🌍 Internationalization

### Supported Languages

- **English (en)** - Default language
- **Myanmar (mm)** - Localized content

### Translation Structure

```json
{
  "common": {
    "home": "Home",
    "property": "Property",
    "profile": "Profile"
  },
  "auth": {
    "signIn": "Sign In",
    "signUp": "Sign Up"
  },
  "settings": {
    "title": "Settings",
    "language": "Language"
  }
}
```

### Usage

```typescript
import { useTranslation } from "react-i18next";

const { t, i18n } = useTranslation();

// Translate text
const title = t("common.home");

// Change language
i18n.changeLanguage("mm");

// Get current language
const currentLang = i18n.language;
```

### Device Language Detection

The app automatically detects the device language and uses the closest supported language.

### Adding New Languages

1. Create translation file in `locales/[lang]/translation.json`
2. Add language to `supportedLanguages` array in `i18n.ts`
3. Update language detection logic

---

## 🧭 Navigation

### Route Structure

```
app/
├── (root)/              # Main app tabs
│   ├── home/           # Home screen
│   ├── property/       # Property screen
│   └── profile/        # Profile screen
├── (share)/            # Shared screens (modals)
│   └── sign-in.tsx     # Authentication modal
└── _layout.tsx         # Root layout
```

### Tab Navigation

The main app uses tab navigation with three tabs:

- **Home** - Public access
- **Property** - Public access  
- **Profile** - Protected (requires authentication)

### Modal Navigation

Authentication screens are presented as modals:

```typescript
// Navigate to sign-in modal
router.push("/(share)/sign-in");

// Close modal
router.back();
```

### Navigation Guards

- Profile tab shows authentication prompt if not signed in
- Authentication modals can be dismissed
- Back button support throughout the app

---

## 💾 Storage

### AsyncStorage Implementation

All data is stored locally using AsyncStorage with proper error handling.

### Storage Keys

| Key | Purpose | Data Type |
|-----|---------|-----------|
| `app_auth_user` | User authentication data | JSON string |
| `app_theme_mode` | Theme preference | String |

### Storage Utilities

```typescript
// Save data
await AsyncStorage.setItem(key, JSON.stringify(data));

// Retrieve data
const data = await AsyncStorage.getItem(key);
const parsed = data ? JSON.parse(data) : null;

// Remove data
await AsyncStorage.removeItem(key);
```

### Error Handling

All storage operations include try-catch blocks with fallback values.

---

## 📚 API Reference

### useAuthStore

#### State
- `user: User | null` - Current user data
- `isAuthenticated: boolean` - Authentication status
- `isLoading: boolean` - Loading state

#### Actions
- `signIn(email: string, password: string): Promise<boolean>` - Sign in user
- `signUp(email: string, password: string, name: string): Promise<boolean>` - Sign up user
- `signOut(): Promise<void>` - Sign out user
- `restoreAuth(): Promise<void>` - Restore session from storage

### useThemeStore

#### State
- `mode: ThemeMode` - Current theme mode
- `isDark: boolean` - Effective dark mode
- `colors: ThemeColors` - Current theme colors

#### Actions
- `toggleTheme(): Promise<void>` - Cycle through themes
- `setTheme(mode: ThemeMode): Promise<void>` - Set specific theme
- `restore(): Promise<void>` - Restore theme from storage
- `applySystem(scheme: ColorSchemeName): void` - Apply system theme

### useSettingsModalStore

#### State
- `isOpen: boolean` - Modal visibility

#### Actions
- `openModal(): void` - Open settings modal
- `closeModal(): void` - Close settings modal

### CustomHeader

#### Props
- `title: string` - Header title
- `showBackButton?: boolean` - Show back button
- `onBackPress?: () => void` - Custom back handler
- `isMainTab?: boolean` - Main tab styling
- `showSettingsButton?: boolean` - Show settings button
- `showNotificationBell?: boolean` - Show notification bell
- `notificationCount?: number` - Notification count
- `onNotificationPress?: () => void` - Notification handler
- `rightAction?: RightAction` - Custom right action

### SettingsModal

#### Props
- `visible: boolean` - Modal visibility
- `onClose: () => void` - Close handler

---

## 🛠️ Customization Guide

### Adding New Screens

1. **Create screen component**
   ```typescript
   // screens/NewScreen/index.tsx
   import React from "react";
   import { View, Text } from "react-native";
   import CustomHeader from "@/components/Global/CustomHeader";
   import { useThemeStore } from "@/stores/useThemeStore";
   import { createCommonStyles } from "@/utils/themeStyles";

   export default function NewScreen() {
     const colors = useThemeStore((state) => state.colors);
     const commonStyles = createCommonStyles(colors);

     return (
       <View style={commonStyles.screenContainer}>
         <CustomHeader title="New Screen" showSettingsButton />
         <View style={commonStyles.contentContainer}>
           <Text style={{ color: colors.text }}>New Screen Content</Text>
         </View>
       </View>
     );
   }
   ```

2. **Add route**
   ```typescript
   // app/(root)/new-screen.tsx
   import NewScreen from "@/screens/NewScreen";

   export default NewScreen;
   ```

3. **Update navigation** (if needed)

### Adding New Stores

1. **Create store**
   ```typescript
   // stores/useNewStore.ts
   import { create } from "zustand";
   import AsyncStorage from "@react-native-async-storage/async-storage";

   interface NewState {
     data: any;
     setData: (data: any) => Promise<void>;
   }

   export const useNewStore = create<NewState>((set) => ({
     data: null,
     setData: async (data) => {
       await AsyncStorage.setItem("app_new_data", JSON.stringify(data));
       set({ data });
     },
   }));
   ```

2. **Initialize in root layout** (if needed)

### Adding New Translations

1. **Add to English**
   ```json
   // locales/en/translation.json
   {
     "newFeature": {
       "title": "New Feature",
       "description": "Description of new feature"
     }
   }
   ```

2. **Add to Myanmar**
   ```json
   // locales/mm/translation.json
   {
     "newFeature": {
       "title": "အပိုင်းအစအသစ်",
       "description": "အပိုင်းအစအသစ်၏ ဖော်ပြချက်"
     }
   }
   ```

3. **Use in component**
   ```typescript
   const { t } = useTranslation();
   const title = t("newFeature.title");
   ```

### Customizing Colors

1. **Update color definitions**
   ```typescript
   // constants/Colors.ts
   const lightTheme: ThemeColors = {
     // ... existing colors
     newColor: "#FF0000",
   };
   ```

2. **Use in components**
   ```typescript
   const colors = useThemeStore((state) => state.colors);
   const backgroundColor = colors.newColor;
   ```

### Adding New Features

1. **Create components** in `components/`
2. **Add stores** in `stores/` (if needed)
3. **Update screens** to use new features
4. **Add translations** for new text
5. **Update documentation**

---

## 📋 Best Practices

### Code Organization

1. **Follow the existing structure** - Keep files in appropriate directories
2. **Use TypeScript** - Always define types for props and state
3. **Keep components small** - Single responsibility principle
4. **Use consistent naming** - Follow existing patterns

### State Management

1. **Use Zustand stores** for global state
2. **Keep stores focused** - One store per domain
3. **Use AsyncStorage** for persistence
4. **Handle errors gracefully** - Always include try-catch

### Styling

1. **Use theme colors** - Never hardcode colors
2. **Use common styles** - Leverage `createCommonStyles`
3. **Keep styles organized** - Use StyleSheet.create
4. **Test on both themes** - Ensure dark mode compatibility

### Internationalization

1. **Always use translations** - Never hardcode text
2. **Keep keys organized** - Use nested structure
3. **Add translations for all languages** - Don't skip Myanmar
4. **Test language switching** - Ensure proper rendering

### Performance

1. **Optimize re-renders** - Use proper dependencies
2. **Lazy load components** - When appropriate
3. **Handle loading states** - Show appropriate feedback
4. **Cache data** - Use AsyncStorage effectively

### Error Handling

1. **Always handle async operations** - Use try-catch
2. **Provide fallback values** - Don't crash on errors
3. **Log errors appropriately** - Use console.error
4. **Show user-friendly messages** - Don't expose technical details

---

## 🔧 Troubleshooting

### Common Issues

#### Authentication Not Working

**Problem**: User can't sign in or session not restored

**Solutions**:
1. Check AsyncStorage permissions
2. Verify storage keys are correct
3. Check for JSON parsing errors
4. Ensure proper error handling

#### Theme Not Changing

**Problem**: Theme toggle not working or colors not updating

**Solutions**:
1. Verify theme store is properly initialized
2. Check COLORS proxy is working
3. Ensure components are using theme colors
4. Check for storage errors

#### Translations Not Showing

**Problem**: Translation keys showing instead of translated text

**Solutions**:
1. Verify i18n is initialized
2. Check translation files exist
3. Ensure keys match exactly
4. Check language detection

#### Navigation Issues

**Problem**: Can't navigate or modals not working

**Solutions**:
1. Check route structure
2. Verify navigation props
3. Ensure proper screen registration
4. Check for navigation conflicts

### Debug Tools

#### Storage Debugging

```typescript
// Add to any component to debug storage
import { logStorageData } from "@/utils/storageUtils";

useEffect(() => {
  logStorageData();
}, []);
```

#### Theme Debugging

```typescript
// Check current theme state
const { mode, isDark, colors } = useThemeStore();
console.log("Theme:", { mode, isDark, colors });
```

#### Translation Debugging

```typescript
// Check translation state
const { t, i18n } = useTranslation();
console.log("i18n:", { 
  language: i18n.language, 
  isInitialized: i18n.isInitialized 
});
```

### Performance Issues

1. **Check re-renders** - Use React DevTools
2. **Monitor memory usage** - Check for memory leaks
3. **Optimize images** - Use appropriate sizes
4. **Lazy load components** - When appropriate

---

## 🚀 Deployment

### Building for Production

1. **Configure app.json**
   ```json
   {
     "expo": {
       "name": "Your App Name",
       "slug": "your-app-slug",
       "version": "1.0.0"
     }
   }
   ```

2. **Build for platforms**
   ```bash
   # iOS
   eas build --platform ios
   
   # Android
   eas build --platform android
   ```

3. **Submit to stores**
   ```bash
   # iOS App Store
   eas submit --platform ios
   
   # Google Play Store
   eas submit --platform android
   ```

### Environment Configuration

1. **Create environment files** (if needed)
2. **Configure build variants**
3. **Set up code signing**
4. **Configure app icons and splash**

### Testing Before Deployment

1. **Test on real devices**
2. **Test both themes**
3. **Test both languages**
4. **Test authentication flow**
5. **Test offline functionality**

### App Store Guidelines

1. **Follow platform guidelines**
2. **Provide app descriptions**
3. **Create app screenshots**
4. **Set up privacy policy**
5. **Configure app permissions**

---

## 📞 Support

### Getting Help

1. **Check this documentation** - Most issues are covered here
2. **Review the code** - Well-commented and structured
3. **Check console logs** - Error messages are descriptive
4. **Test on different devices** - Some issues are device-specific

### Contributing

1. **Follow existing patterns** - Maintain consistency
2. **Add tests** - When appropriate
3. **Update documentation** - Keep it current
4. **Test thoroughly** - Before submitting changes

### Resources

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [i18next Documentation](https://www.i18next.com/)

---

## 📄 License

This boilerplate is provided as-is for educational and commercial use. Feel free to modify and extend it for your projects.

---

*Last updated: December 2024*
