import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useThemeStore } from "@/stores/useThemeStore";
import { useTranslation } from "react-i18next";
import { formatMMK } from "@/utils/storageUtils";
import { SPACING, BORDER_RADIUS, PADDING } from "@/utils/themeStyles";
import { Property } from "@/types/models";
import { Ionicons } from "@expo/vector-icons";

interface PropertyInvestmentCardProps {
  property: Property;
  onBuyShares: (propertyId: string) => void;
  userShares?: number; // Optional: show user's current shares if they have any
}

export default function PropertyInvestmentCard({
  property,
  onBuyShares,
  userShares = 0,
}: PropertyInvestmentCardProps) {
  const colors = useThemeStore((state) => state.colors);
  const { t } = useTranslation();
  const styles = createStyles(colors);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const getSegmentIcon = (segment: string) => {
    switch (segment.toLowerCase()) {
      case "residential":
        return "home";
      case "commercial":
        return "business";
      case "retail":
        return "cart";
      case "industrial":
        return "factory";
      default:
        return "location";
    }
  };

  return (
    <View style={styles.container}>
      {/* Property Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons 
            name={getSegmentIcon(property.segment) as any} 
            size={20} 
            color={colors.primary} 
          />
          <Text style={styles.title}>{property.name}</Text>
        </View>
        <View style={styles.segmentBadge}>
          <Text style={styles.segmentText}>{property.segment}</Text>
        </View>
      </View>

      {/* Property Details */}
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>{t("property.location")}</Text>
          <Text style={styles.detailValue}>{property.location}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>{t("property.yearBuilt")}</Text>
          <Text style={styles.detailValue}>{property.yearBuilt}</Text>
        </View>
      </View>

      {/* Investment Info */}
      <View style={styles.investmentSection}>
        <View style={styles.investmentRow}>
          <View style={styles.investmentItem}>
            <Text style={styles.investmentLabel}>{t("property.totalValue")}</Text>
            <Text style={styles.investmentValue}>
              {formatMMK(property.currentValueMMK)}
            </Text>
          </View>
          <View style={styles.investmentItem}>
            <Text style={styles.investmentLabel}>{t("property.sharePrice")}</Text>
            <Text style={styles.investmentValue}>
              {formatMMK(property.sharePriceMMK)}
            </Text>
          </View>
        </View>

        <View style={styles.sharesRow}>
          <View style={styles.sharesItem}>
            <Text style={styles.sharesLabel}>{t("property.availableShares")}</Text>
            <Text style={styles.sharesValue}>
              {formatNumber(property.availableShares)}
            </Text>
          </View>
          <View style={styles.sharesItem}>
            <Text style={styles.sharesLabel}>{t("property.cisOwnership")}</Text>
            <Text style={styles.sharesValue}>
              {property.cisOwnershipPct}%
            </Text>
          </View>
        </View>

        {/* User's Current Shares (if any) */}
        {userShares > 0 && (
          <View style={styles.userSharesContainer}>
            <Text style={styles.userSharesLabel}>
              {t("property.yourShares")}
            </Text>
            <Text style={[styles.userSharesValue, { color: colors.primary }]}>
              {formatNumber(userShares)} {t("property.shares")}
            </Text>
          </View>
        )}
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={[styles.buyButton, { backgroundColor: colors.primary }]}
        onPress={() => onBuyShares(property.id)}
      >
        <Ionicons name="add-circle" size={20} color={colors.white} />
        <Text style={styles.buyButtonText}>
          {userShares > 0 ? t("property.buyMoreShares") : t("property.buyShares")}
        </Text>
      </TouchableOpacity>
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
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: SPACING.md,
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginLeft: SPACING.sm,
    },
    segmentBadge: {
      backgroundColor: colors.primary,
      paddingHorizontal: SPACING.sm,
      paddingVertical: 4,
      borderRadius: BORDER_RADIUS.sm,
    },
    segmentText: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.white,
    },
    detailsRow: {
      flexDirection: "row",
      marginBottom: SPACING.md,
    },
    detailItem: {
      flex: 1,
    },
    detailLabel: {
      fontSize: 12,
      color: colors.textLight,
      marginBottom: 2,
    },
    detailValue: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    investmentSection: {
      marginBottom: SPACING.md,
    },
    investmentRow: {
      flexDirection: "row",
      marginBottom: SPACING.sm,
    },
    investmentItem: {
      flex: 1,
    },
    investmentLabel: {
      fontSize: 12,
      color: colors.textLight,
      marginBottom: 2,
    },
    investmentValue: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    sharesRow: {
      flexDirection: "row",
      marginBottom: SPACING.sm,
    },
    sharesItem: {
      flex: 1,
    },
    sharesLabel: {
      fontSize: 12,
      color: colors.textLight,
      marginBottom: 2,
    },
    sharesValue: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    userSharesContainer: {
      backgroundColor: colors.background,
      padding: SPACING.sm,
      borderRadius: BORDER_RADIUS.md,
      alignItems: "center",
    },
    userSharesLabel: {
      fontSize: 12,
      color: colors.textLight,
      marginBottom: 2,
    },
    userSharesValue: {
      fontSize: 16,
      fontWeight: "700",
    },
    buyButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: SPACING.md,
      borderRadius: BORDER_RADIUS.md,
    },
    buyButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.white,
      marginLeft: SPACING.sm,
    },
  });
