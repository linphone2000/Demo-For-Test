import React from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useThemeStore } from "@/stores/useThemeStore";
import { useTranslation } from "react-i18next";
import { formatNumber } from "@/utils/storageUtils";

interface PerformanceChartProps {
  currentValue: number;
  previousValue: number;
}

const { width } = Dimensions.get("window");

export default function PerformanceChart({
  currentValue,
  previousValue,
}: PerformanceChartProps) {
  const colors = useThemeStore((state) => state.colors);
  const { t } = useTranslation();

  // Generate mock performance data for the last 7 days
  const generatePerformanceData = () => {
    const data = [];
    const changePercent = ((currentValue - previousValue) / previousValue) * 100;
    
    // Generate 7 data points with realistic variation
    for (let i = 6; i >= 0; i--) {
      const daysAgo = 6 - i;
      const baseValue = previousValue;
      const variation = (changePercent / 6) * daysAgo;
      const randomVariation = (Math.random() - 0.5) * 0.02; // ±1% random variation
      const value = baseValue * (1 + variation / 100 + randomVariation);
      data.push(value);
    }
    
    return data;
  };

  const performanceData = generatePerformanceData();
  
  // Calculate performance metrics
  const performanceChange = currentValue - previousValue;
  const performanceChangePercent = previousValue > 0 ? (performanceChange / previousValue) * 100 : 0;
  const isPositive = performanceChange >= 0;

  const chartData = {
    labels: ["6d", "5d", "4d", "3d", "2d", "1d", "Today"],
    datasets: [
      {
        data: performanceData,
        color: (opacity = 1) => isPositive ? colors.income : colors.expense,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => colors.text,
    labelColor: (opacity = 1) => colors.textLight,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: isPositive ? colors.income : colors.expense,
    },
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
        {t("home.charts.performance")}
      </Text>

      {/* Performance Summary */}
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        paddingHorizontal: 10,
      }}>
        <View>
          <Text style={{
            fontSize: 14,
            color: colors.textLight,
            marginBottom: 4,
          }}>
            {t("home.charts.weekChange")}
          </Text>
          <Text style={{
            fontSize: 16,
            fontWeight: "600",
            color: isPositive ? colors.income : colors.expense,
          }}>
            {isPositive ? "+" : ""}{(performanceChangePercent).toFixed(2)}%
          </Text>
        </View>
        
        <View>
          <Text style={{
            fontSize: 14,
            color: colors.textLight,
            marginBottom: 4,
          }}>
            {t("home.charts.weekValue")}
          </Text>
          <Text style={{
            fontSize: 16,
            fontWeight: "600",
            color: colors.text,
          }}>
            {formatNumber(performanceChange)} MMK
          </Text>
        </View>
      </View>

      <LineChart
        data={chartData}
        width={width - 80}
        height={180}
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        withDots={true}
        withShadow={false}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        fromZero={false}
        yAxisSuffix=""
        yAxisInterval={1}
        segments={4}
      />

      {/* Chart Legend */}
      <View style={{
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        alignItems: "center",
      }}>
        <Text style={{
          fontSize: 12,
          color: colors.textLight,
          textAlign: "center",
        }}>
          {t("home.charts.performanceNote")}
        </Text>
      </View>
    </View>
  );
}
