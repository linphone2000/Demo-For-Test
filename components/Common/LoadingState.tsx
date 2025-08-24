import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useThemeStore } from "@/stores/useThemeStore";
import { useTranslation } from "react-i18next";

interface LoadingStateProps {
  message?: string;
  size?: "small" | "large";
  containerStyle?: any;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message,
  size = "large",
  containerStyle,
}) => {
  const colors = useThemeStore((state) => state.colors);
  const { t } = useTranslation();
  const styles = createStyles(colors);

  return (
    <View style={[styles.container, containerStyle]}>
      <ActivityIndicator size={size} color={colors.primary} />
      <Text style={styles.text}>
        {message || t("common.loading")}
      </Text>
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
    text: {
      marginTop: 16,
      fontSize: 16,
      color: colors.text,
      textAlign: "center",
    },
  });
