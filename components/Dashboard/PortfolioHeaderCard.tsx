import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useThemeStore } from "@/stores/useThemeStore";
import { useTranslation } from "react-i18next";
import { formatMMK } from "@/utils/storageUtils";
import { SPACING, BORDER_RADIUS, PADDING } from "@/utils/themeStyles";
import { Ionicons } from "@expo/vector-icons";

interface PortfolioHeaderCardProps {
  totalValueMMK: number;
  cashMMK: number;
  netPnlAbs: number;
  netPnlPct: number;
  onSimulate: (deltaPct: number) => void;
  isGuestMode?: boolean;
}

export default function PortfolioHeaderCard({
  totalValueMMK,
  cashMMK,
  netPnlAbs,
  netPnlPct,
  onSimulate,
  isGuestMode = false,
}: PortfolioHeaderCardProps) {
  const colors = useThemeStore((state) => state.colors);
  const { t } = useTranslation();
  const styles = createStyles(colors);

  const isPnlPositive = netPnlAbs >= 0;

  return (
    <View style={styles.container}>
      {/* Main Portfolio/Market Value */}
      <View style={styles.mainValueContainer}>
        <Text style={styles.mainValueLabel}>
          {isGuestMode ? t("home.portfolioHeader.marketValue") : t("home.portfolioHeader.totalValue")}
        </Text>
        <Text style={styles.mainValue}>
          {formatMMK(totalValueMMK)}
        </Text>
      </View>

      {/* Cash and P&L Row for authenticated users only */}
      {!isGuestMode && (
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>
              {t("home.portfolioHeader.cash")}
            </Text>
            <Text style={styles.statValue}>
              {formatMMK(cashMMK)}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>
              {t("home.portfolioHeader.netPnl")}
            </Text>
            <View style={styles.pnlContainer}>
              <Text style={[
                styles.pnlValue,
                { color: isPnlPositive ? colors.income : colors.expense }
              ]}>
                {formatMMK(Math.abs(netPnlAbs))}
              </Text>
              <Text style={[
                styles.pnlPercentage,
                { color: isPnlPositive ? colors.income : colors.expense }
              ]}>
                {isPnlPositive ? "+" : "-"}{Math.abs(netPnlPct).toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Simulation Buttons */}
      {!isGuestMode && (
        <View style={styles.simulationRow}>
          <TouchableOpacity
            style={[styles.simulateButton, styles.simulateDown]}
            onPress={() => onSimulate(-0.5)}
            accessibilityLabel={t("home.portfolioHeader.simulateDown")}
          >
            <Ionicons name="trending-down" size={16} color={colors.white} />
            <Text style={styles.simulateButtonText}>
              {t("home.portfolioHeader.simulateDown")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.simulateButton, styles.simulateUp]}
            onPress={() => onSimulate(0.5)}
            accessibilityLabel={t("home.portfolioHeader.simulateUp")}
          >
            <Ionicons name="trending-up" size={16} color={colors.white} />
            <Text style={styles.simulateButtonText}>
              {t("home.portfolioHeader.simulateUp")}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.lg,
      padding: PADDING.card,
      marginBottom: SPACING.lg,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    mainValueContainer: {
      marginBottom: SPACING.lg,
    },
    mainValueLabel: {
      fontSize: 14,
      color: colors.textLight,
      marginBottom: SPACING.xs,
    },
    mainValue: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.text,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: SPACING.lg,
    },
    statItem: {
      flex: 1,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textLight,
      marginBottom: SPACING.xs,
    },
    statValue: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    pnlContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    pnlValue: {
      fontSize: 16,
      fontWeight: "600",
      marginRight: SPACING.xs,
    },
    pnlPercentage: {
      fontSize: 14,
      fontWeight: "500",
    },
    simulationRow: {
      flexDirection: "row",
      gap: SPACING.md,
    },
    simulateButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.lg,
      borderRadius: BORDER_RADIUS.md,
      gap: SPACING.xs,
    },
    simulateUp: {
      backgroundColor: colors.income,
    },
    simulateDown: {
      backgroundColor: colors.expense,
    },
    simulateButtonText: {
      color: colors.white,
      fontSize: 14,
      fontWeight: "600",
    },
  });
