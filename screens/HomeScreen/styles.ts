import { StyleSheet } from "react-native";
import { SPACING, BORDER_RADIUS, PADDING } from "@/utils/themeStyles";

// Shared dashboard styles to reduce code duplication
export const styles = (colors: any) =>
  StyleSheet.create({
    // Common card styles
    card: {
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

    // Section styles
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    expandButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: colors.primary + "10",
    },
    expandButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
    },

    // Empty state styles
    emptyState: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 24,
      alignItems: "center",
    },
    emptyStateTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    emptyStateSubtitle: {
      fontSize: 14,
      color: colors.textLight,
      textAlign: "center",
    },



    // CTA button styles
    ctaRow: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 24,
    },
    ctaButton: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
    },
    buyButton: {
      backgroundColor: colors.income,
    },
    sellButton: {
      backgroundColor: colors.expense,
    },
    ctaButtonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: "600",
    },

    // Activity container
    activityContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      overflow: "hidden",
    },

    // Guest mode styles
    guestBanner: {
      padding: 20,
      borderRadius: 16,
      marginBottom: 20,
      alignItems: "center",
    },
    guestBannerText: {
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 8,
      textAlign: "center",
    },
    guestBannerSubtext: {
      fontSize: 14,
      marginBottom: 16,
      textAlign: "center",
      opacity: 0.9,
    },
    guestSignInButton: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      minWidth: 120,
      alignItems: "center",
    },
    guestSignInButtonText: {
      fontSize: 16,
      fontWeight: "600",
    },
  });
