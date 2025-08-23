import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuthStore } from "@/stores/useAuthStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { createCommonStyles } from "@/utils/themeStyles";
import CustomHeader from "@/components/Global/CustomHeader";
import { useTranslation } from "react-i18next";

export default function ProfileScreen() {
  const { user, signOut, isAuthenticated, isLoading } = useAuthStore();
  const { colors, toggleTheme, mode } = useThemeStore();
  const router = useRouter();
  const commonStyles = createCommonStyles(colors);
  const { t } = useTranslation();

  const handleSignIn = () => {
    router.push("/(share)/sign-in");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (isLoading) {
    return (
      <View style={commonStyles.screenContainer}>
        <SafeAreaView style={commonStyles.safeArea}>
          <CustomHeader isMainTab title={t("common.profile")} showSettingsButton />
          <View style={styles.loadingContainer}>
            <Text style={{ color: colors.text }}>{t("common.loading")}</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={commonStyles.screenContainer}>
        <SafeAreaView style={commonStyles.safeArea}>
          <CustomHeader isMainTab title={t("common.profile")} showSettingsButton />
          <View style={styles.content}>
            <View style={styles.authPrompt}>
              <Text style={[styles.authTitle, { color: colors.text }]}>
                {t("auth.signInRequired")}
              </Text>
              <Text style={[styles.authSubtitle, { color: colors.textLight }]}>
                {t("auth.signInRequiredSubtitle")}
              </Text>
              
              <TouchableOpacity
                style={[styles.signInButton, { backgroundColor: colors.primary }]}
                onPress={handleSignIn}
              >
                <Text style={[styles.signInButtonText, { color: colors.white }]}>
                  {t("auth.signIn")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={commonStyles.screenContainer}>
      <SafeAreaView style={commonStyles.safeArea}>
        <CustomHeader isMainTab title={t("common.profile")} showSettingsButton />
        <View style={styles.content}>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.name || "User"}
            </Text>
            <Text style={[styles.userEmail, { color: colors.textLight }]}>
              {user?.email || "user@example.com"}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t("profile.settings")}
            </Text>
            
            <TouchableOpacity 
              style={[styles.settingItem, { backgroundColor: colors.card }]}
              onPress={toggleTheme}
            >
              <Text style={[styles.settingText, { color: colors.text }]}>
                {t("profile.themeToggle", { mode: t(`common.${mode}`) })}
              </Text>
              <Text style={[styles.settingSubtext, { color: colors.textLight }]}>
                {t("profile.themeToggleSubtitle")}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.signOutButton, { backgroundColor: colors.error }]}
            onPress={handleSignOut}
          >
            <Text style={[styles.signOutText, { color: colors.white }]}>
              {t("auth.signOut")}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  authPrompt: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  authSubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  signInButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    minWidth: 150,
    alignItems: "center",
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 40,
    paddingVertical: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  settingItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  settingText: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  signOutButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: "auto",
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "600",
  },
});