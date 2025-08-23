import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "@/stores/useThemeStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
  const { colors, mode, toggleTheme } = useThemeStore();
  const { isAuthenticated } = useAuthStore();
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const handleLanguageChange = () => {
    const newLanguage = i18n.language === "en" ? "mm" : "en";
    i18n.changeLanguage(newLanguage);
  };

  const handleThemeChange = () => {
    toggleTheme();
  };

  const handleGoToLogin = () => {
    onClose();
    router.push("/(share)/sign-in");
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 20,
      margin: 20,
      maxWidth: 320,
      width: "100%",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    closeButton: {
      padding: 4,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    settingLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    settingIcon: {
      marginRight: 12,
    },
    settingText: {
      fontSize: 14,
      color: colors.text,
    },
    settingValue: {
      fontSize: 12,
      color: colors.textLight,
      marginTop: 2,
    },
    authPrompt: {
      alignItems: "center",
      padding: 16,
      borderRadius: 8,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      marginTop: 16,
    },
    authTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    authSubtitle: {
      fontSize: 14,
      color: colors.textLight,
      textAlign: "center",
      marginBottom: 16,
    },
    loginButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 6,
    },
    loginButtonText: {
      color: colors.white,
      fontSize: 14,
      fontWeight: "600",
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{t("settings.title")}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Language Setting */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("settings.language")}</Text>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons
                  name="language"
                  size={18}
                  color={colors.text}
                  style={styles.settingIcon}
                />
                <View>
                  <Text style={styles.settingText}>
                    {i18n.language === "en" ? "English" : "မြန်မာ"}
                  </Text>
                  <Text style={styles.settingValue}>
                    {i18n.language === "en" ? "EN" : "MM"}
                  </Text>
                </View>
              </View>
              <Switch
                value={i18n.language === "mm"}
                onValueChange={handleLanguageChange}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
          </View>

          {/* Theme Setting */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("settings.theme")}</Text>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons
                  name={mode === "dark" ? "moon" : "sunny"}
                  size={18}
                  color={colors.text}
                  style={styles.settingIcon}
                />
                <View>
                  <Text style={styles.settingText}>
                    {t(`common.${mode}`)}
                  </Text>
                  <Text style={styles.settingValue}>
                    {mode === "light" ? "☀️" : mode === "dark" ? "🌙" : "⚙️"}
                  </Text>
                </View>
              </View>
              <Switch
                value={mode === "dark"}
                onValueChange={handleThemeChange}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
          </View>

          {/* Authentication Prompt */}
          {!isAuthenticated && (
            <View style={styles.authPrompt}>
              <Ionicons
                name="lock-closed"
                size={24}
                color={colors.textLight}
                style={{ marginBottom: 8 }}
              />
              <Text style={styles.authTitle}>{t("settings.signInForMore")}</Text>
              <Text style={styles.authSubtitle}>
                {t("settings.signInSubtitle")}
              </Text>
              <TouchableOpacity style={styles.loginButton} onPress={handleGoToLogin}>
                <Text style={styles.loginButtonText}>{t("settings.goToLogin")}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default SettingsModal;
