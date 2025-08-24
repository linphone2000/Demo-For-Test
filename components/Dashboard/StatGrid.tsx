import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useThemeStore } from "@/stores/useThemeStore";
import { useTranslation } from "react-i18next";
import { formatMMK, formatNumber } from "@/utils/storageUtils";
import { SPACING, BORDER_RADIUS, PADDING } from "@/utils/themeStyles";
import { Snapshot } from "@/types/models";

interface StatGridProps {
  snapshot: Snapshot;
  isGuestMode?: boolean;
}

export default function StatGrid({ snapshot, isGuestMode = false }: StatGridProps) {
  const colors = useThemeStore((state) => state.colors);
  const { t } = useTranslation();
  const styles = createStyles(colors);

  // Use the centralized formatNumber function

  // Base stats that are always shown
  const baseStats = [
    {
      label: t("home.snapshot.companyValue"),
      value: formatMMK(snapshot.companyValueMMK),
      subtitle: formatUSD(snapshot.companyValueMMK),
    },
    {
      label: t("home.snapshot.companyShares"),
      value: formatNumber(snapshot.companyShares),
      subtitle: "Total shares",
    },
    {
      label: t("home.snapshot.propertyCount"),
      value: snapshot.propertiesCount.toString(),
      subtitle: "Properties",
    },
  ];

  // Personal stat only for authenticated users
  const personalStat = {
    label: t("home.snapshot.weightedShare"),
    value: `${snapshot.weightedSharePct.toFixed(1)}%`,
    subtitle: "Your ownership",
  };

  // Combine stats based on user type
  const stats = isGuestMode ? baseStats : [...baseStats, personalStat];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t("home.snapshot.title")}
      </Text>
      
      <View style={[styles.grid, isGuestMode && styles.guestGrid]}>
        {stats.map((stat, index) => (
          <View 
            key={index} 
            style={[
              styles.statItem, 
              isGuestMode && styles.guestStatItem
            ]}
          >
            <Text style={styles.statValue}>
              {stat.value}
            </Text>
            <Text style={styles.statLabel}>
              {stat.label}
            </Text>
            <Text style={styles.statSubtitle}>
              {stat.subtitle}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// Helper function for USD formatting
const formatUSD = (amountMMK: number): string => {
  const usdAmount = amountMMK / 4400; // 1 USD = 4400 MMK
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(usdAmount);
};

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
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: SPACING.lg,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: SPACING.md,
    },
    statItem: {
      width: "48%",
      backgroundColor: colors.background,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.lg,
      alignItems: "center",
    },
    statValue: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: SPACING.xs,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textLight,
      textAlign: "center",
      marginBottom: SPACING.xs,
    },
    statSubtitle: {
      fontSize: 10,
      color: colors.textLight,
      textAlign: "center",
    },
    guestGrid: {
      flexWrap: "nowrap", // Force single row
      justifyContent: "space-between",
    },
    guestStatItem: {
      width: "32%", // 3 items in a row
      flex: 0,
    },
  });
