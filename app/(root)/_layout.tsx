import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "@/stores/useThemeStore";
import { useTranslation } from "react-i18next";
import { useInsetsTabBarStyle } from "@/utils/useInsetsHelpers";

export default function TabLayout() {
  const { colors } = useThemeStore();
  const { t } = useTranslation();
  const insetTabBarStyle = useInsetsTabBarStyle();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          ...insetTabBarStyle
        },
      }}
    >
      {/* Redirect */}
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />

      {/* Home */}
      <Tabs.Screen
        name="home"
        options={{
          title: t("common.home"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />

      {/* Property List */}
      <Tabs.Screen
        name="property"
        options={{
          title: t("common.property"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="business" color={color} size={size} />
          ),
        }}
      />

      {/* Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: t("common.profile"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
