import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useThemeStore } from "@/stores/useThemeStore";
import { useTranslation } from "react-i18next";
import { formatMMK } from "@/utils/storageUtils";
import { SPACING, BORDER_RADIUS } from "@/utils/themeStyles";
import { Activity } from "@/types/models";
import { databaseService } from "@/services/mock/databaseService";

interface ActivityItemProps {
  activity: Activity;
}

export default function ActivityItem({ activity }: ActivityItemProps) {
  const colors = useThemeStore((state) => state.colors);
  const { t } = useTranslation();
  const styles = createStyles(colors);

  const [property, setProperty] = useState<any>(null);

  useEffect(() => {
    const loadProperty = async () => {
      const prop = await databaseService.getPropertyById(activity.propertyId);
      setProperty(prop);
    };
    loadProperty();
  }, [activity.propertyId]);
  if (!property) return null;

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "buy":
      case "sell":
        return "💹";
      case "injection":
        return "🏗️";
      default:
        return "📊";
    }
  };

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "buy":
        return colors.income;
      case "sell":
        return colors.expense;
      case "injection":
        return colors.accent;
      default:
        return colors.textLight;
    }
  };

  const formatTimestamp = (ts: number) => {
    const now = Date.now();
    const diff = now - ts;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return "Just now";
    }
  };

  return (
    <View style={styles.container}>
      {/* Icon */}
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>
          {getActivityIcon(activity.type)}
        </Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.activityType}>
            {t(`home.activity.${activity.type}`)}
          </Text>
          <Text style={styles.timestamp}>
            {formatTimestamp(activity.ts)}
          </Text>
        </View>
        
        <Text style={styles.propertyName} numberOfLines={1}>
          {property.name}
        </Text>
        
        <Text style={[
          styles.amount,
          { color: getActivityColor(activity.type) }
        ]}>
          {formatMMK(activity.amountMMK)}
        </Text>
      </View>
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
      marginRight: SPACING.md,
    },
    icon: {
      fontSize: 18,
    },
    content: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: SPACING.xs,
    },
    activityType: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      textTransform: "capitalize",
    },
    timestamp: {
      fontSize: 12,
      color: colors.textLight,
    },
    propertyName: {
      fontSize: 13,
      color: colors.text,
      marginBottom: SPACING.xs,
    },
    amount: {
      fontSize: 14,
      fontWeight: "600",
    },
  });
