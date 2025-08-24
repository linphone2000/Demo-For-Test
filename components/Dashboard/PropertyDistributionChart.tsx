import React from "react";
import { View, Text, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useThemeStore } from "@/stores/useThemeStore";
import { useTranslation } from "react-i18next";
import { Holding } from "@/types/models";
import { formatNumber } from "@/utils/storageUtils";

interface PropertyDistributionChartProps {
  holdings: Holding[];
  properties: any[]; // Add properties to get property names
}

const { width } = Dimensions.get("window");

export default function PropertyDistributionChart({
  holdings,
  properties,
}: PropertyDistributionChartProps) {
  const colors = useThemeStore((state) => state.colors);
  const { t } = useTranslation();

  // Sort holdings by value and take top 5
  const topHoldings = holdings
    .sort((a, b) => b.userValueMMK - a.userValueMMK)
    .slice(0, 5);

  // If no holdings, show empty state
  if (holdings.length === 0) {
    return (
      <View style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        alignItems: "center",
      }}>
        <Text style={{
          fontSize: 16,
          fontWeight: "600",
          color: colors.text,
          marginBottom: 8,
        }}>
          {t("home.charts.noDistribution")}
        </Text>
        <Text style={{
          fontSize: 14,
          color: colors.textLight,
          textAlign: "center",
        }}>
          {t("home.charts.noDistributionSubtitle")}
        </Text>
      </View>
    );
  }

  // Prepare chart data
  const chartData = {
    labels: topHoldings.map(holding => {
      const property = properties.find(p => p.id === holding.propertyId);
      const name = property?.name || "Property";
      return name.length > 8 ? name.substring(0, 8) + "..." : name;
    }),
    datasets: [
      {
        data: topHoldings.map(holding => holding.userValueMMK / 1000000), // Convert to millions
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 1,
    color: (opacity = 1) => colors.primary,
    labelColor: (opacity = 1) => colors.textLight,
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.7,
    propsForBackgroundLines: {
      strokeDasharray: "", // Solid lines
      stroke: colors.border,
      strokeWidth: 1,
    },
  };

  return (
    <View style={{
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
    }}>
      <Text style={{
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 16,
        textAlign: "center",
      }}>
        {t("home.charts.topProperties")}
      </Text>

      <BarChart
        data={chartData}
        width={width - 80}
        height={200}
        chartConfig={chartConfig}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        withInnerLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}

        fromZero={true}
        yAxisSuffix="M"
        yAxisInterval={1}
        segments={4}
        showBarTops={true}
        showValuesOnTopOfBars={true}
        yAxisLabel=""
      />

      {/* Property Details */}
      <View style={{
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
      }}>
        <Text style={{
          fontSize: 14,
          fontWeight: "600",
          color: colors.text,
          marginBottom: 12,
        }}>
          {t("home.charts.propertyDetails")}
        </Text>
        
        {topHoldings.map((holding, index) => (
          <View
            key={holding.propertyId}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 8,
              borderBottomWidth: index < topHoldings.length - 1 ? 1 : 0,
              borderBottomColor: colors.border,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 14,
                fontWeight: "500",
                color: colors.text,
                marginBottom: 2,
              }}>
                {(() => {
                  const property = properties.find(p => p.id === holding.propertyId);
                  return property?.name || `Property ${index + 1}`;
                })()}
              </Text>
              <Text style={{
                fontSize: 12,
                color: colors.textLight,
              }}>
                {t("home.charts.share")}: {holding.userSharePct.toFixed(1)}%
              </Text>
            </View>
            
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{
                fontSize: 14,
                fontWeight: "600",
                color: colors.text,
              }}>
                {formatNumber(holding.userValueMMK)} MMK
              </Text>
              <Text style={{
                fontSize: 12,
                color: holding.pnlAbs >= 0 ? colors.income : colors.expense,
              }}>
                {holding.pnlAbs >= 0 ? "+" : ""}{holding.pnlPct.toFixed(2)}%
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
