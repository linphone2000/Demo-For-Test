import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useAuthStore } from "@/stores/useAuthStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { usePortfolioStore } from "@/stores/usePortfolioStore";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { createCommonStyles } from "@/utils/themeStyles";
import CustomHeader from "@/components/Global/CustomHeader";
import { LoadingState } from "@/components/Common";
import { databaseService } from "@/services/mock/databaseService";
import { formatMMK, formatNumber } from "@/utils/storageUtils";
import { useTranslation } from "react-i18next";

export default function ProfileScreen() {
  const { user, signOut, isAuthenticated, isLoading } = useAuthStore();
  const { colors, toggleTheme, mode } = useThemeStore();
  const { portfolio } = usePortfolioStore();
  const router = useRouter();
  const commonStyles = createCommonStyles(colors);
  const { t } = useTranslation();
  
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    joinedDays: 0,
  });

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      await databaseService.initializeFromStorage();
      const users = await databaseService.getAllUsers();
      const properties = await databaseService.getAllProperties();
      
      const joinedDays = user 
        ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      setUserStats({
        totalUsers: users.length,
        totalProperties: properties.length,
        joinedDays,
      });
    } catch (error) {
      console.error("Failed to load user stats:", error);
    }
  };

  const handleSignIn = () => {
    router.push("/(share)/sign-in");
  };

  const handleSignOut = async () => {
    Alert.alert(
      t("auth.signOut"),
      t("profile.signOutConfirm"),
      [
        { text: t("common.cancel"), style: "cancel" },
        { 
          text: t("auth.signOut"), 
          style: "destructive",
          onPress: async () => await signOut()
        },
      ]
    );
  };

  const handleNavigateToManage = () => {
    router.push("/(root)/manage");
  };

  const handleNavigateToHome = () => {
    router.push("/(root)/home");
  };

  if (isLoading) {
    return (
      <View style={commonStyles.screenContainer}>
        <SafeAreaView style={commonStyles.safeArea}>
          <CustomHeader isMainTab title={t("common.profile")} showSettingsButton />
          <LoadingState />
        </SafeAreaView>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={commonStyles.screenContainer}>
        <SafeAreaView style={commonStyles.safeArea}>
          <CustomHeader isMainTab title={t("common.profile")} showSettingsButton />
          <View style={styles.content}>
            <View style={styles.authPrompt}>
              <Text style={[styles.authTitle, { color: colors.text }]}>
                {t("auth.signInRequired")}
              </Text>
              <Text style={[styles.authSubtitle, { color: colors.textLight }]}>
                {t("auth.signInRequiredSubtitle")}
              </Text>
              
              <TouchableOpacity
                style={[styles.signInButton, { backgroundColor: colors.primary }]}
                onPress={handleSignIn}
              >
                <Text style={[styles.signInButtonText, { color: colors.white }]}>
                  {t("auth.signIn")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={commonStyles.screenContainer}>
      <SafeAreaView style={commonStyles.safeArea}>
        <CustomHeader isMainTab title={t("common.profile")} showSettingsButton />
        
        <ScrollView style={commonStyles.contentContainer}>
          {/* User Profile Header */}
          <View style={[styles.profileHeader, { backgroundColor: colors.card }]}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={[styles.avatarText, { color: colors.white }]}>
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.name || "User"}
            </Text>
            <Text style={[styles.userEmail, { color: colors.textLight }]}>
              {user?.email || "user@example.com"}
            </Text>
            <Text style={[styles.memberSince, { color: colors.textLight }]}>
              {t("profile.memberSince", { days: userStats.joinedDays })}
            </Text>
          </View>

          {/* Portfolio Summary */}
          {portfolio && (
            <View style={[styles.portfolioSummary, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t("profile.portfolioSummary")}
              </Text>
              <View style={styles.portfolioStats}>
                <View style={styles.portfolioStat}>
                  <Text style={[styles.portfolioStatLabel, { color: colors.textLight }]}>
                    {t("profile.totalValue")}
                  </Text>
                  <Text style={[styles.portfolioStatValue, { color: colors.text }]}>
                    {formatMMK(portfolio.totalValueMMK)}
                  </Text>
                </View>
                <View style={styles.portfolioStat}>
                  <Text style={[styles.portfolioStatLabel, { color: colors.textLight }]}>
                    {t("profile.holdings")}
                  </Text>
                  <Text style={[styles.portfolioStatValue, { color: colors.text }]}>
                    {portfolio.holdings.length}
                  </Text>
                </View>
                <View style={styles.portfolioStat}>
                  <Text style={[styles.portfolioStatLabel, { color: colors.textLight }]}>
                    {t("profile.netPnl")}
                  </Text>
                  <Text style={[
                    styles.portfolioStatValue, 
                    { color: portfolio.netPnlAbs >= 0 ? colors.income : colors.expense }
                  ]}>
                    {portfolio.netPnlAbs >= 0 ? "+" : ""}{formatMMK(portfolio.netPnlAbs)}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={[styles.quickActionButton, { backgroundColor: colors.primary }]}
                onPress={handleNavigateToHome}
              >
                <Text style={[styles.quickActionText, { color: colors.white }]}>
                  {t("profile.viewDashboard")}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* App Statistics */}
          <View style={[styles.appStats, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t("profile.appStats")}
            </Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>
                  {userStats.totalUsers}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textLight }]}>
                  {t("profile.totalUsers")}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>
                  {userStats.totalProperties}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textLight }]}>
                  {t("profile.totalProperties")}
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={[styles.quickActions, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t("profile.quickActions")}
            </Text>
            
            <TouchableOpacity 
              style={[styles.actionItem, { backgroundColor: colors.background }]}
              onPress={handleNavigateToManage}
            >
              <Text style={[styles.actionIcon]}>⚙️</Text>
              <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, { color: colors.text }]}>
                  {t("profile.manageData")}
                </Text>
                <Text style={[styles.actionSubtitle, { color: colors.textLight }]}>
                  {t("profile.manageDataDesc")}
                </Text>
              </View>
              <Text style={[styles.actionArrow, { color: colors.textLight }]}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionItem, { backgroundColor: colors.background }]}
              onPress={toggleTheme}
            >
              <Text style={[styles.actionIcon]}>{mode === 'dark' ? '🌙' : '☀️'}</Text>
              <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, { color: colors.text }]}>
                  {t("profile.themeToggle", { mode: t(`common.${mode}`) })}
                </Text>
                <Text style={[styles.actionSubtitle, { color: colors.textLight }]}>
                  {t("profile.themeToggleSubtitle")}
                </Text>
              </View>
              <Text style={[styles.actionArrow, { color: colors.textLight }]}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Sign Out */}
          <TouchableOpacity 
            style={[styles.signOutButton, { backgroundColor: colors.error }]}
            onPress={handleSignOut}
          >
            <Text style={[styles.signOutText, { color: colors.white }]}>
              {t("auth.signOut")}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
  },
  
  // Auth prompt styles
  authPrompt: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  authSubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  signInButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    minWidth: 150,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    includeFontPadding: false,
  },

  // Profile header styles
  profileHeader: {
    alignItems: "center",
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 8,
  },
  memberSince: {
    fontSize: 14,
  },

  // Portfolio summary styles
  portfolioSummary: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  portfolioStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  portfolioStat: {
    flex: 1,
    alignItems: "center",
  },
  portfolioStatLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
    textAlign: "center",
  },
  portfolioStatValue: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  quickActionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: "600",
  },

  // App stats styles
  appStats: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "500",
  },

  // Quick actions styles
  quickActions: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
  },
  actionArrow: {
    fontSize: 20,
    fontWeight: "300",
  },

  // Section title
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },

  // Sign out button
  signOutButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "600",
  },
});