import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useThemeStore } from "@/stores/useThemeStore";
import { useTranslation } from "react-i18next";
import { formatMMK } from "@/utils/storageUtils";
import { SPACING, BORDER_RADIUS, PADDING } from "@/utils/themeStyles";
import { Ionicons } from "@expo/vector-icons";
import { Holding } from "@/types/models";
import { databaseService } from "@/services/mock/databaseService";

interface PropertyHoldingCardProps {
  holding: Holding;
}

export default function PropertyHoldingCard({ holding }: PropertyHoldingCardProps) {
  const colors = useThemeStore((state) => state.colors);
  const { t } = useTranslation();
  const styles = createStyles(colors);

  const [property, setProperty] = useState<any>(null);

  useEffect(() => {
    const loadProperty = async () => {
      const prop = await databaseService.getPropertyById(holding.propertyId);
      setProperty(prop);
    };
    loadProperty();
  }, [holding.propertyId]);
  if (!property) return null;

  const isPnlPositive = holding.pnlPct >= 0;
  const progressPercentage = Math.min(holding.userSharePct, 100);

  return (
    <View style={styles.container}>
      {/* Property Name and Segment */}
      <View style={styles.header}>
        <View style={styles.propertyInfo}>
          <Text style={styles.propertyName} numberOfLines={1}>
            {property.name}
          </Text>
          <Text style={styles.segment}>
            {property.segment}
          </Text>
        </View>
        
        {/* P&L Chip */}
        <View style={[
          styles.pnlChip,
          { backgroundColor: isPnlPositive ? colors.income : colors.expense }
        ]}>
          <Ionicons
            name={isPnlPositive ? "trending-up" : "trending-down"}
            size={12}
            color={colors.white}
          />
          <Text style={styles.pnlChipText}>
            {isPnlPositive ? "+" : ""}{holding.pnlPct.toFixed(1)}%
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progressPercentage}%`,
                backgroundColor: colors.primary,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {holding.userSharePct.toFixed(1)}%
        </Text>
      </View>

      {/* Value and P&L Details */}
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>
            {t("home.holdings.value")}
          </Text>
          <Text style={styles.detailValue}>
            {formatMMK(holding.userValueMMK)}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>
            {t("home.holdings.pnl")}
          </Text>
          <Text style={[
            styles.detailValue,
            { color: isPnlPositive ? colors.income : colors.expense }
          ]}>
            {formatMMK(Math.abs(holding.pnlAbs))}
          </Text>
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.md,
      padding: PADDING.card,
      marginBottom: SPACING.md,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: SPACING.md,
    },
    propertyInfo: {
      flex: 1,
      marginRight: SPACING.md,
    },
    propertyName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: SPACING.xs,
    },
    segment: {
      fontSize: 12,
      color: colors.textLight,
    },
    pnlChip: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.xs,
      borderRadius: BORDER_RADIUS.sm,
      gap: SPACING.xs,
    },
    pnlChipText: {
      color: colors.white,
      fontSize: 12,
      fontWeight: "600",
    },
    progressContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: SPACING.md,
      gap: SPACING.sm,
    },
    progressBar: {
      flex: 1,
      height: 6,
      backgroundColor: colors.border,
      borderRadius: 3,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      borderRadius: 3,
    },
    progressText: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.text,
      minWidth: 40,
      textAlign: "right",
    },
    detailsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    detailItem: {
      flex: 1,
    },
    detailLabel: {
      fontSize: 11,
      color: colors.textLight,
      marginBottom: SPACING.xs,
    },
    detailValue: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
  });
