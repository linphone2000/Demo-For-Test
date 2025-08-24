import { StyleSheet } from "react-native";

export const createStyles = (colors: any) => StyleSheet.create({
  headerActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center",
  },
  clearButton: {
    backgroundColor: colors.error,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  value: {
    color: colors.text,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
    fontStyle: "italic",
  },
  userItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textLight,
  },
  userId: {
    fontSize: 12,
    color: colors.textLight,
    fontFamily: "monospace",
  },
  propertyItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  propertyValue: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
  },
  propertyLocation: {
    fontSize: 12,
    color: colors.textLight,
  },
  portfolioCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  portfolioTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  portfolioCash: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  portfolioTotal: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
    marginBottom: 4,
  },
  portfolioHoldings: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 2,
  },
  portfolioActivities: {
    fontSize: 12,
    color: colors.textLight,
  },
  storageItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  storageKey: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    fontFamily: "monospace",
  },
  storageValue: {
    fontSize: 12,
    color: colors.textLight,
    fontFamily: "monospace",
    marginTop: 4,
  },
});
