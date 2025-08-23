import { ThemeColors } from "@/constants/Colors";

/**
 * Creates a theme-aware stylesheet factory
 * Use this pattern to avoid creating styles at module scope with COLORS
 *
 * @example
 * const createStyles = (colors: ThemeColors) =>
 *   StyleSheet.create({
 *     container: { backgroundColor: colors.background },
 *     text: { color: colors.text },
 *   });
 *
 * export default function MyComponent() {
 *   const colors = useThemeStore(s => s.colors);
 *   const styles = createStyles(colors);
 *   return <View style={styles.container} />;
 * }
 */
export const createThemeStyles = <T extends Record<string, any>>(
  styleFactory: (colors: ThemeColors) => T
) => {
  return styleFactory;
};

// Shared style constants for consistent spacing and styling across the app
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const PADDING = {
  screen: SPACING.xl, // 20px
  card: SPACING.lg, // 16px
  input: SPACING.lg, // 16px
} as const;

export const MARGIN = {
  section: SPACING.xxl, // 24px
  item: SPACING.md, // 12px
  card: SPACING.xl, // 20px
} as const;

import { StyleSheet } from "react-native";

// Common style patterns
export const createCommonStyles = (colors: any) =>
  StyleSheet.create({
    screenContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      paddingHorizontal: PADDING.screen,
      paddingBottom: PADDING.screen,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: BORDER_RADIUS.md,
      padding: PADDING.card,
      marginBottom: MARGIN.card,
    },
    section: {
      marginBottom: MARGIN.section,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: SPACING.md,
    },
    emptyStateContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: PADDING.screen,
    },
    emptyStateIcon: {
      marginBottom: SPACING.lg,
    },
    emptyStateTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: SPACING.sm,
      textAlign: "center",
    },
    emptyStateSubtitle: {
      fontSize: 14,
      color: colors.textLight,
      textAlign: "center",
    },
  });
