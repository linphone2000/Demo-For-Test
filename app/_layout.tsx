import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useThemeStore } from "@/stores/useThemeStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Appearance } from "react-native";
import SettingsModal from "@/components/Global/SettingsModal";
import { useSettingsModalStore } from "@/stores/useSettingsModalStore";
import { useTranslation } from "react-i18next";
import { View, Text } from "react-native";
import "@/locales/i18n"; // Initialize i18n

export default function RootLayout() {
  const { restore: restoreTheme, applySystem } = useThemeStore();
  const { restoreAuth } = useAuthStore();
  const { isOpen, closeModal } = useSettingsModalStore();
  const { i18n } = useTranslation();
  const [isI18nReady, setIsI18nReady] = useState(false);

  useEffect(() => {
    // Wait for i18n to be ready
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
    
    // Initialize stores on app startup
    restoreTheme();
    restoreAuth();

    // Listen for system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      applySystem(colorScheme);
    });

    return () => subscription?.remove();
  }, [restoreTheme, restoreAuth, applySystem, isI18nReady]);

  // Show loading while i18n is initializing
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
        {/* Home */}
        <Stack.Screen
          name="(root)"
          options={{
            headerShown: false,
          }}
        />

        {/* Share screens */}
        {/* Auth */}
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
