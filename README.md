# PropertyApp - React Native Expo Boilerplate

A modern React Native Expo boilerplate with TypeScript, internationalization, dynamic theming, authentication, and state management. Built with Expo Router, Zustand, and i18next.

## ✨ Features

### 🌍 Internationalization (i18n)
- **Multi-language Support**: English and Myanmar (Burmese) languages
- **Device Language Detection**: Automatically detects and applies device language
- **Fallback System**: Graceful fallback to English for unsupported languages
- **Dynamic Language Switching**: Change language on-the-fly

### 🎨 Dynamic Theme System
- **Three Theme Modes**: Light, Dark, and System (follows device)
- **Persistent Settings**: Theme preferences saved locally
- **System Integration**: Automatically responds to device theme changes
- **Type-Safe Colors**: Full TypeScript support for theme colors

### 🔐 Authentication System
- **Local Authentication**: Uses AsyncStorage for user data persistence
- **Protected Routes**: Profile tab requires authentication
- **Public Access**: Home and Property tabs accessible without login
- **Complete Auth Flow**: Sign in, sign up, and sign out functionality

### 📱 Modern Navigation
- **Expo Router**: File-based routing with TypeScript support
- **Tab Navigation**: Clean bottom tab navigation
- **Modal Screens**: Settings modal and authentication screens
- **Type-Safe Navigation**: Full TypeScript support for routes

### 🏗️ State Management
- **Zustand Stores**: Lightweight and performant state management
- **Persistent State**: Authentication and theme preferences saved locally
- **Type Safety**: Full TypeScript support for all stores
- **Modular Architecture**: Separate stores for different concerns

### 🛠️ Development Experience
- **TypeScript**: Full type safety throughout the app
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Hot Reload**: Fast development with Expo

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (for iOS) or Android Studio (for Android)

### Installation

1. **Clone or Download** this boilerplate
2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Run on Device/Simulator**
   ```bash
   npm run ios     # iOS Simulator
   npm run android # Android Emulator
   npm run web     # Web Browser
   ```

## 📁 Project Structure

```
PropertyApp/
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout with store initialization
│   ├── (root)/            # Main app screens
│   │   ├── _layout.tsx    # Tab navigation layout
│   │   ├── home/
│   │   │   └── index.tsx  # Home screen
│   │   ├── property/
│   │   │   └── index.tsx  # Property screen
│   │   └── profile/
│   │       └── index.tsx  # Profile screen
│   └── (share)/           # Shared screens (modals)
│       └── sign-in.tsx    # Authentication modal
├── components/            # Reusable components
│   └── Global/
│       ├── CustomHeader.tsx
│       └── SettingsModal.tsx
├── constants/             # App constants
│   └── Colors.ts         # Theme colors and configuration
├── locales/              # Internationalization
│   ├── i18n.ts          # i18n configuration
│   ├── en/
│   │   └── translation.json
│   └── mm/
│       └── translation.json
├── screens/              # Screen components
│   ├── AuthScreen/
│   ├── HomeScreen/
│   ├── ProfileScreen/
│   └── PropertyScreen/
├── stores/               # State management
│   ├── useAuthStore.ts   # Authentication state
│   ├── useThemeStore.ts  # Theme management
│   └── useSettingsModalStore.ts
├── types/                # TypeScript definitions
│   ├── images.d.ts
│   └── models.ts
├── utils/                # Utility functions
│   ├── storageUtils.ts
│   ├── themeStyles.ts
│   └── useInsetsHelpers.ts
├── assets/               # Images, icons, fonts
├── app.json             # Expo configuration
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript configuration
└── eslint.config.js     # ESLint configuration
```

## 🔧 Core Features

### Theme System
The app includes a sophisticated theme system with:
- **Dynamic Color Switching**: Colors change based on theme mode
- **System Theme Detection**: Automatically follows device theme
- **Persistent Preferences**: Theme choice saved between app launches
- **Type-Safe Implementation**: Full TypeScript support

```typescript
// Usage in components
import { COLORS } from "@/constants/Colors";

<View style={{ backgroundColor: COLORS.background }}>
  <Text style={{ color: COLORS.text }}>Hello World</Text>
</View>
```

### Internationalization
Multi-language support with:
- **Automatic Detection**: Uses device language settings
- **Easy Translation**: Simple key-based translation system
- **Fallback Support**: Graceful handling of missing translations

```typescript
// Usage in components
import { useTranslation } from "react-i18next";

const { t } = useTranslation();
<Text>{t("common.home")}</Text>
```

### Authentication
Local authentication system with:
- **User Persistence**: Login state saved locally
- **Protected Routes**: Profile screen requires authentication
- **Public Access**: Home and Property screens accessible to all

### State Management
Zustand-based state management:
- **Lightweight**: Minimal bundle size impact
- **Type-Safe**: Full TypeScript support
- **Persistent**: Critical state saved to AsyncStorage
- **Modular**: Separate stores for different concerns

## 🎯 Usage Examples

### Adding a New Screen
1. Create screen component in `screens/`
2. Add route file in `app/(root)/`
3. Update tab navigation if needed

### Adding a New Language
1. Create translation file in `locales/[language-code]/translation.json`
2. Update `locales/i18n.ts` to include new language
3. Add language to supported languages array

### Adding a New Store
1. Create new Zustand store in `stores/`
2. Add AsyncStorage persistence if needed
3. Initialize in root layout if required globally

### Customizing Themes
1. Update color definitions in `constants/Colors.ts`
2. Add new color properties as needed
3. Use `COLORS` object throughout components

## 🛠️ Development

### Available Scripts
```bash
npm start          # Start Expo development server
npm run ios        # Run on iOS Simulator
npm run android    # Run on Android Emulator
npm run web        # Run in web browser
```

### Code Quality
- **ESLint**: Code linting and quality checks
- **Prettier**: Automatic code formatting
- **TypeScript**: Type checking and IntelliSense

### Testing
The boilerplate is ready for testing setup. Consider adding:
- Jest for unit testing
- React Native Testing Library
- Detox for E2E testing

## 📱 Building for Production

### Expo Build
```bash
# Build for iOS
npx expo build:ios

# Build for Android
npx expo build:android

# Create standalone app
npx expo export
```

### EAS Build (Recommended)
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure EAS
eas build:configure

# Build for platforms
eas build --platform ios
eas build --platform android
```

## 🔄 State Management Architecture

### Stores Overview
- **useAuthStore**: User authentication and session management
- **useThemeStore**: Theme preferences and color scheme management
- **useSettingsModalStore**: Settings modal visibility state

### Storage Strategy
- **AsyncStorage**: All persistent data stored locally
- **Error Handling**: Graceful fallbacks for storage failures
- **No External Dependencies**: Works completely offline

## 🌟 Benefits

✅ **Modern Stack**: Latest React Native and Expo features  
✅ **Type Safety**: Full TypeScript support throughout  
✅ **Internationalization**: Ready for global markets  
✅ **Theme Support**: Professional light/dark mode implementation  
✅ **Offline-First**: Works without internet connection  
✅ **Fast Development**: Hot reload and modern tooling  
✅ **Scalable**: Easy to extend and customize  
✅ **Production Ready**: Proper error handling and performance  

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://expo.github.io/router/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [i18next Documentation](https://www.i18next.com/)

## 🤝 Contributing

This boilerplate is designed to be a starting point for React Native projects. Feel free to:
- Customize it for your specific needs
- Add new features and improvements
- Share your modifications with the community

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Ready to build your next React Native app?** Start with this boilerplate and focus on your unique features instead of setup and configuration!
