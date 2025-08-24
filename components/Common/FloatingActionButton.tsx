import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { useThemeStore } from "@/stores/useThemeStore";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

interface FloatingActionButtonProps {
  onBuyPress: () => void;
  onSellPress: () => void;
  isGuestMode?: boolean;
}

const { width } = Dimensions.get("window");

export default function FloatingActionButton({
  onBuyPress,
  onSellPress,
  isGuestMode = false,
}: FloatingActionButtonProps) {
  const colors = useThemeStore((state) => state.colors);
  const { t } = useTranslation();
  const styles = createStyles(colors);

  const [isExpanded, setIsExpanded] = useState(false);
  const [rotateAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0));

  const toggleExpanded = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);

    // Rotate main FAB icon
    Animated.timing(rotateAnim, {
      toValue: newExpanded ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Scale animation for sub-buttons
    Animated.timing(scaleAnim, {
      toValue: newExpanded ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleBuyPress = () => {
    setIsExpanded(false);
    Animated.timing(rotateAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    onBuyPress();
  };

  const handleSellPress = () => {
    setIsExpanded(false);
    Animated.timing(rotateAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    onSellPress();
  };

  if (isGuestMode) {
    return null; // Don't show FAB in guest mode
  }

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  return (
    <View style={styles.container}>
      {/* Backdrop */}
      {isExpanded && (
        <TouchableOpacity
          style={styles.backdrop}
          onPress={toggleExpanded}
          activeOpacity={1}
        />
      )}

      {/* Sub Action Buttons */}
      <Animated.View
        style={[
          styles.subButton,
          styles.sellButton,
          {
            transform: [{ scale: scaleAnim }],
            opacity: scaleAnim,
          },
        ]}
      >
        <TouchableOpacity style={styles.subButtonTouchable} onPress={handleSellPress}>
          <Ionicons name="trending-down" size={20} color={colors.white} />
          <Text style={styles.subButtonText}>{t("home.trade.sell")}</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[
          styles.subButton,
          styles.buyButton,
          {
            transform: [{ scale: scaleAnim }],
            opacity: scaleAnim,
          },
        ]}
      >
        <TouchableOpacity style={styles.subButtonTouchable} onPress={handleBuyPress}>
          <Ionicons name="trending-up" size={20} color={colors.white} />
          <Text style={styles.subButtonText}>{t("home.trade.buy")}</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Main FAB */}
      <TouchableOpacity style={styles.mainFab} onPress={toggleExpanded}>
        <Animated.View
          style={[
            styles.fabIcon,
            {
              transform: [{ rotate: rotateInterpolate }],
            },
          ]}
        >
          <Ionicons name="add" size={24} color={colors.white} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      bottom: 80, // Moved down a bit more
      left: 0,
      right: 0,
      alignItems: "center", // Center horizontally
    },
    backdrop: {
      position: "absolute",
      top: -1000,
      left: -width,
      right: width,
      bottom: -200,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      zIndex: 1,
    },
    mainFab: {
      width: 65,
      height: 65,
      borderRadius: 28,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      elevation: 8,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      zIndex: 3,
    },
    fabIcon: {
      justifyContent: "center",
      alignItems: "center",
    },
    subButton: {
      position: "absolute",
      borderRadius: 25,
      elevation: 6,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      zIndex: 2,
      marginBottom: 16,
    },
    buyButton: {
      bottom: 80, // Closer to main FAB
      backgroundColor: colors.income,
    },
    sellButton: {
      bottom: 140, // Closer to main FAB with gap
      backgroundColor: colors.expense,
    },
    subButtonTouchable: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      minWidth: 100,
    },
    subButtonText: {
      color: colors.white,
      fontSize: 14,
      fontWeight: "600",
      marginLeft: 8,
    },
  });
