import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeStore } from "@/stores/useThemeStore";
import { useTranslation } from "react-i18next";
import { createCommonStyles } from "@/utils/themeStyles";
import { styles } from "./styles";
import CustomHeader from "@/components/Global/CustomHeader";
import { LoadingState, ErrorState } from "@/components/Common";
import { usePortfolioStore } from "@/stores/usePortfolioStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "expo-router";
import { databaseService } from "@/services/mock/databaseService";

// Dashboard Components
import PortfolioHeaderCard from "@/components/Dashboard/PortfolioHeaderCard";
import PropertyHoldingCard from "@/components/Dashboard/PropertyHoldingCard";
import StatGrid from "@/components/Dashboard/StatGrid";
import ActivityItem from "@/components/Dashboard/ActivityItem";
import TradeActionSheet from "@/components/Dashboard/TradeActionSheet";
import FloatingActionButton from "@/components/Common/FloatingActionButton";

// Chart Components
import PerformanceChart from "@/components/Dashboard/PerformanceChart";
import PropertyDistributionChart from "@/components/Dashboard/PropertyDistributionChart";

export default function HomeScreen() {
  const colors = useThemeStore((state) => state.colors);
  const { t } = useTranslation();
  const router = useRouter();
  const commonStyles = createCommonStyles(colors);
  const style = styles(colors);

  const {
    portfolio,
    loading,
    error,
    isGuestMode,
    loadPortfolio,
    simulateMarket,
  } = usePortfolioStore();
  const { user } = useAuthStore();
  const [tradeSheetVisible, setTradeSheetVisible] = useState(false);
  const [tradeAction, setTradeAction] = useState<"buy" | "sell">("buy");
  const [holdingsExpanded, setHoldingsExpanded] = useState(false);
  const [activitiesExpanded, setActivitiesExpanded] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    // Load portfolio for authenticated user or guest mode
    loadPortfolio();

    // Load properties for charts
    const loadProperties = async () => {
      try {
        const props = await databaseService.getAllProperties();
        setProperties(props);
      } catch (error) {
        console.error("Failed to load properties:", error);
      }
    };
    loadProperties();
  }, [user, loadPortfolio]);

  const handleSimulate = (deltaPct: number) => {
    simulateMarket(deltaPct);
  };

  const handleTradeAction = (action: "buy" | "sell") => {
    setTradeAction(action);
    setTradeSheetVisible(true);
  };

  const handleCloseTradeSheet = () => {
    setTradeSheetVisible(false);
  };

  if (loading) {
    return (
      <View style={commonStyles.screenContainer}>
        <SafeAreaView style={commonStyles.safeArea}>
          <CustomHeader isMainTab title={t("home.title")} showSettingsButton />
          <LoadingState />
        </SafeAreaView>
      </View>
    );
  }

  if (error || !portfolio) {
    return (
      <View style={commonStyles.screenContainer}>
        <SafeAreaView style={commonStyles.safeArea}>
          <CustomHeader isMainTab title={t("home.title")} showSettingsButton />
          <ErrorState
            error={error || "Failed to load portfolio data"}
            onRetry={() => user && loadPortfolio(user.id)}
          />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={commonStyles.screenContainer}>
      <SafeAreaView style={commonStyles.safeArea}>
        <CustomHeader isMainTab title={t("home.title")} showSettingsButton />

        <ScrollView
          style={commonStyles.contentContainer}
          key="dashboard-scroll"
          showsVerticalScrollIndicator={true}
        >
          {/* Guest Mode Banner */}
          {isGuestMode && (
            <View
              style={[style.guestBanner, { backgroundColor: colors.primary }]}
            >
              <Text style={[style.guestBannerText, { color: colors.white }]}>
                🎯 {t("home.guestMode.title")}
              </Text>
              <Text style={[style.guestBannerSubtext, { color: colors.white }]}>
                {t("home.guestMode.subtitle")}
              </Text>
              <TouchableOpacity
                style={[
                  style.guestSignInButton,
                  { backgroundColor: colors.white },
                ]}
                onPress={() => router.push("/(share)/sign-in")}
              >
                <Text
                  style={[
                    style.guestSignInButtonText,
                    { color: colors.primary },
                  ]}
                >
                  {t("home.guestMode.signIn")}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Portfolio Header Card */}
          <PortfolioHeaderCard
            totalValueMMK={portfolio.totalValueMMK}
            cashMMK={portfolio.cashMMK}
            netPnlAbs={portfolio.netPnlAbs}
            netPnlPct={portfolio.netPnlPct}
            onSimulate={handleSimulate}
            isGuestMode={isGuestMode}
          />

          {/* Charts Section - Only for authenticated users */}
          {!isGuestMode && (
            <>
              {/* Performance Chart */}
              <PerformanceChart
                currentValue={portfolio.totalValueMMK}
                previousValue={portfolio.totalValueMMK - portfolio.netPnlAbs}
              />

              {/* Property Distribution Chart */}
              <PropertyDistributionChart
                holdings={portfolio.holdings}
                properties={properties}
              />
            </>
          )}

          {/* Holdings List - Only for authenticated users */}
          {!isGuestMode && (
            <View style={style.section}>
              <View style={style.sectionHeader}>
                <Text style={style.sectionTitle}>
                  {t("home.holdings.title")}
                </Text>
                {portfolio.holdings.length > 3 && (
                  <TouchableOpacity
                    onPress={() => setHoldingsExpanded(!holdingsExpanded)}
                    style={style.expandButton}
                  >
                    <Text style={style.expandButtonText}>
                      {holdingsExpanded
                        ? t("common.seeLess")
                        : t("common.seeMore")}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {portfolio.holdings.length === 0 ? (
                <View style={style.emptyState}>
                  <Text style={style.emptyStateTitle}>
                    {t("home.holdings.empty")}
                  </Text>
                  <Text style={style.emptyStateSubtitle}>
                    {t("home.holdings.emptySubtitle")}
                  </Text>
                </View>
              ) : (
                <>
                  {/* Show first 3 holdings always */}
                  {portfolio.holdings.slice(0, 3).map((holding) => (
                    <PropertyHoldingCard
                      key={holding.propertyId}
                      holding={holding}
                    />
                  ))}

                  {/* Show remaining holdings if expanded */}
                  {holdingsExpanded &&
                    portfolio.holdings
                      .slice(3)
                      .map((holding) => (
                        <PropertyHoldingCard
                          key={holding.propertyId}
                          holding={holding}
                        />
                      ))}
                </>
              )}
            </View>
          )}

          {/* Company Snapshot */}
          <StatGrid snapshot={portfolio.snapshot} isGuestMode={isGuestMode} />

          {/* Activity Strip - Only for authenticated users */}
          {!isGuestMode && (
            <View style={style.section}>
              <View style={style.sectionHeader}>
                <Text style={style.sectionTitle}>
                  {t("home.activity.title")}
                </Text>
                {portfolio.activities.length > 3 && (
                  <TouchableOpacity
                    onPress={() => setActivitiesExpanded(!activitiesExpanded)}
                    style={style.expandButton}
                  >
                    <Text style={style.expandButtonText}>
                      {activitiesExpanded
                        ? t("common.seeLess")
                        : t("common.seeMore")}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {portfolio.activities.length === 0 ? (
                <View style={style.emptyState}>
                  <Text style={style.emptyStateTitle}>
                    {t("home.activity.empty")}
                  </Text>
                  <Text style={style.emptyStateSubtitle}>
                    {t("home.activity.emptySubtitle")}
                  </Text>
                </View>
              ) : (
                <View style={style.activityContainer}>
                  {/* Show first 3 activities always */}
                  {portfolio.activities.slice(0, 3).map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}

                  {/* Show remaining activities if expanded */}
                  {activitiesExpanded &&
                    portfolio.activities
                      .slice(3)
                      .map((activity) => (
                        <ActivityItem key={activity.id} activity={activity} />
                      ))}
                </View>
              )}
            </View>
          )}

          {/* CTA Row - Only for Guest Mode */}
          {isGuestMode && (
            <View style={style.ctaRow}>
              <TouchableOpacity
                style={[style.ctaButton, { backgroundColor: colors.primary }]}
                onPress={() => router.push("/(share)/sign-in")}
              >
                <Text style={style.ctaButtonText}>
                  {t("home.guestMode.startInvesting")}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Floating Action Button */}
        <FloatingActionButton
          onBuyPress={() => handleTradeAction("buy")}
          onSellPress={() => handleTradeAction("sell")}
          isGuestMode={isGuestMode}
        />

        {/* Trade Action Sheet */}
        <TradeActionSheet
          visible={tradeSheetVisible}
          onClose={handleCloseTradeSheet}
          action={tradeAction}
        />
      </SafeAreaView>
    </View>
  );
}
