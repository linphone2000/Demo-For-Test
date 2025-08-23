import { useThemeStore } from "@/stores/useThemeStore";
import { useTopInsetPadding } from "@/utils/useInsetsHelpers";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSettingsModalStore } from "@/stores/useSettingsModalStore";

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

const createStyles = (
  colors: ReturnType<typeof useThemeStore.getState>["colors"]
) =>
  StyleSheet.create({
    container: {
      width: "100%",
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: colors.background,
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    leftSection: {
      flex: 1,
      alignItems: "flex-start",
    },
    centerSection: {
      flex: 2,
    },
    centerSectionLeft: {
      alignItems: "flex-start",
    },
    centerSectionCenter: {
      alignItems: "center",
    },
    rightSection: {
      alignItems: "flex-end",
      flexDirection: "row",
      gap: 8,
    },
    backButton: {
      padding: 5,
      borderRadius: 8,
    },
    settingsButton: {
      padding: 8,
      borderRadius: 8,
    },
    title: {
      fontSize: 26,
      fontWeight: "800",
      color: colors.text,
    },
    titleSubScreen: {
      fontSize: 18,
      fontWeight: "400",
      color: colors.text,
    },
    actionButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      maxWidth: 120, // Prevent button from getting too wide
    },
    actionButtonDisabled: {
      opacity: 0.5,
    },
    actionText: {
      fontSize: 16,
      fontWeight: "600",
      flexShrink: 1, // Allow text to shrink
    },
    notificationBell: {
      padding: 8,
      borderRadius: 8,
      position: "relative",
    },
    notificationBadge: {
      position: "absolute",
      top: 4,
      right: 4,
      backgroundColor: colors.error,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: colors.background,
    },
    notificationBadgeText: {
      color: colors.white,
      fontSize: 10,
      fontWeight: "700",
    },
  });

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  isMainTab = false,
  showNotificationBell = false,
  onNotificationPress,
  notificationCount = 0,
  showSettingsButton = false,
  rightAction,
}) => {
  const router = useRouter();
  const topInsetPadding = useTopInsetPadding();
  const colors = useThemeStore((s) => s.colors);
  const { openModal } = useSettingsModalStore();
  const styles = createStyles(colors);

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Platform.OS === "android" ? topInsetPadding + 16 : 8,
        },
      ]}
    >
      <View style={styles.content}>
        {/* Left side - Back button */}
        {showBackButton && (
          <View style={styles.leftSection}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        )}

        {/* Center section - Title */}
        <View
          style={[
            styles.centerSection,
            isMainTab ? styles.centerSectionLeft : styles.centerSectionCenter,
          ]}
        >
          <Text style={isMainTab ? styles.title : styles.titleSubScreen}>
            {title}
          </Text>
        </View>

        {/* Right side - Settings, Notification bell, or Action button */}
        <View style={styles.rightSection}>
          {showSettingsButton && (
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={openModal}
              activeOpacity={0.7}
            >
              <Ionicons name="menu-sharp" size={24} color={colors.text} />
            </TouchableOpacity>
          )}
          
          {showNotificationBell && (
            <TouchableOpacity
              style={styles.notificationBell}
              onPress={onNotificationPress}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications" size={24} color={colors.text} />
              {notificationCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {notificationCount > 99 ? "99+" : notificationCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          
          {rightAction && !showNotificationBell && !showSettingsButton && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                rightAction.disabled && styles.actionButtonDisabled,
              ]}
              onPress={rightAction.onPress}
              disabled={rightAction.disabled || rightAction.loading}
              activeOpacity={0.7}
            >
              {rightAction.loading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : rightAction.icon ? (
                <Ionicons
                  name={rightAction.icon as any}
                  size={20}
                  color={
                    rightAction.disabled ? colors.textLight : colors.primary
                  }
                />
              ) : rightAction.text ? (
                <Text
                  style={[
                    styles.actionText,
                    {
                      color: rightAction.disabled
                        ? colors.textLight
                        : colors.primary,
                      fontSize: rightAction.text.length > 12 ? 9 : 11,
                    },
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {rightAction.text}
                </Text>
              ) : null}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default CustomHeader;
