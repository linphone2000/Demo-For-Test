import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useThemeStore } from "@/stores/useThemeStore";
import { useTranslation } from "react-i18next";

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  retryText?: string;
  containerStyle?: any;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  retryText,
  containerStyle,
}) => {
  const colors = useThemeStore((state) => state.colors);
  const { t } = useTranslation();
  const styles = createStyles(colors);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.title}>{t("common.error")}</Text>
      <Text style={styles.message}>{error}</Text>
      
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>
            {retryText || t("common.retry")}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    icon: {
      fontSize: 48,
      marginBottom: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    message: {
      fontSize: 16,
      color: colors.textLight,
      textAlign: "center",
      marginBottom: 24,
      lineHeight: 22,
    },
    retryButton: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      backgroundColor: colors.primary,
      borderRadius: 8,
      minWidth: 120,
      alignItems: "center",
    },
    retryButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.white,
    },
  });
