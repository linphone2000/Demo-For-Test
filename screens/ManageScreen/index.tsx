import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeStore } from "@/stores/useThemeStore";
import { useTranslation } from "react-i18next";
import { createCommonStyles } from "@/utils/themeStyles";
import CustomHeader from "@/components/Global/CustomHeader";
import { LoadingState, ErrorState } from "@/components/Common";
import { databaseService } from "@/services/mock/databaseService";
import { useAuthStore } from "@/stores/useAuthStore";
import { User, Portfolio, Property } from "@/types/models";
import { formatMMK } from "@/utils/storageUtils";
import { createStyles } from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ManageScreen() {
  const colors = useThemeStore((state) => state.colors);
  const { t } = useTranslation();
  const commonStyles = createCommonStyles(colors);
  const styles = createStyles(colors);

  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [portfolios, setPortfolios] = useState<{ [userId: string]: Portfolio }>(
    {}
  );
  const [properties, setProperties] = useState<Property[]>([]);
  const [storageInfo, setStorageInfo] = useState<any>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Initialize database to get latest data
      await databaseService.initializeFromStorage();

      // Load all data
      const allUsers = await databaseService.getAllUsers();
      const allProperties = await databaseService.getAllProperties();

      // Get portfolios for each user
      const portfoliosData: { [userId: string]: Portfolio } = {};
      for (const user of allUsers) {
        const portfolio = await databaseService.getPortfolio(user.id);
        if (portfolio) {
          portfoliosData[user.id] = portfolio;
        }
      }

      setUsers(allUsers);
      setProperties(allProperties);
      setPortfolios(portfoliosData);

      // Get storage information
      await getStorageInfo();
    } catch (error) {
      console.error("Load data error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStorageInfo = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const storageData: any = {};

      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          try {
            storageData[key] = JSON.parse(value);
          } catch {
            storageData[key] = value;
          }
        }
      }

      setStorageInfo(storageData);
    } catch (error) {
      console.error("Get storage info error:", error);
    }
  };

  const handleClearAllData = () => {
    Alert.alert(
      "Clear All Data",
      "This will reset all data to the original JSON state. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await databaseService.clearAllData();
              await loadData();
              Alert.alert("Success", "All data has been cleared and reset.");
            } catch (error) {
              Alert.alert("Error", "Failed to clear data.");
            }
          },
        },
      ]
    );
  };

  const handleRefresh = () => {
    loadData();
  };

  if (loading) {
    return (
      <View style={commonStyles.screenContainer}>
        <SafeAreaView style={commonStyles.safeArea}>
          <CustomHeader isMainTab title="Admin Panel" showSettingsButton />
          <LoadingState message="Loading data..." />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={commonStyles.screenContainer}>
      <SafeAreaView style={commonStyles.safeArea}>
        <CustomHeader isMainTab title="Admin Panel" showSettingsButton />

        <ScrollView style={commonStyles.contentContainer}>
          {/* Header Actions */}
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleRefresh}
            >
              <Text style={styles.actionButtonText}>🔄 Refresh</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.clearButton]}
              onPress={handleClearAllData}
            >
              <Text style={styles.actionButtonText}>🗑️ Clear All</Text>
            </TouchableOpacity>
          </View>

          {/* Current User Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👤 Current User</Text>
            <View style={styles.card}>
              {user ? (
                <>
                  <Text style={styles.label}>
                    Name: <Text style={styles.value}>{user.name}</Text>
                  </Text>
                  <Text style={styles.label}>
                    Email: <Text style={styles.value}>{user.email}</Text>
                  </Text>
                  <Text style={styles.label}>
                    ID: <Text style={styles.value}>{user.id}</Text>
                  </Text>
                  <Text style={styles.label}>
                    Created:{" "}
                    <Text style={styles.value}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Text>
                  </Text>
                </>
              ) : (
                <Text style={styles.emptyText}>No user logged in</Text>
              )}
            </View>
          </View>

          {/* Users Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👥 Users ({users.length})</Text>
            <View style={styles.card}>
              {users.map((user, index) => (
                <View key={user.id} style={styles.userItem}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                  <Text style={styles.userId}>ID: {user.id}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Properties Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              🏢 Properties ({properties.length})
            </Text>
            <View style={styles.card}>
              {properties.map((property) => (
                <View key={property.id} style={styles.propertyItem}>
                  <Text style={styles.propertyName}>{property.name}</Text>
                  <Text style={styles.propertyValue}>
                    {formatMMK(property.currentValueMMK)}
                  </Text>
                  <Text style={styles.propertyLocation}>
                    {property.location}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Portfolios Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              💼 Portfolios ({Object.keys(portfolios).length})
            </Text>
            {Object.entries(portfolios).map(([userId, portfolio]) => {
              const user = users.find((u) => u.id === userId);
              return (
                <View key={userId} style={styles.portfolioCard}>
                  <Text style={styles.portfolioTitle}>
                    {user?.name || `User ${userId}`}
                  </Text>
                  <Text style={styles.portfolioCash}>
                    Cash: {formatMMK(portfolio.cashMMK)}
                  </Text>
                  <Text style={styles.portfolioTotal}>
                    Total: {formatMMK(portfolio.totalValueMMK)}
                  </Text>
                  <Text style={styles.portfolioHoldings}>
                    Holdings: {portfolio.holdings.length}
                  </Text>
                  <Text style={styles.portfolioActivities}>
                    Activities: {portfolio.activities.length}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Storage Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💾 Storage Info</Text>
            <View style={styles.card}>
              {Object.entries(storageInfo).map(([key, value]) => (
                <View key={key} style={styles.storageItem}>
                  <Text style={styles.storageKey}>{key}</Text>
                  <Text style={styles.storageValue}>
                    {typeof value === "object"
                      ? JSON.stringify(value).substring(0, 100) + "..."
                      : String(value)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
