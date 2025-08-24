import React, { useState, useEffect } from "react";
import { useThemeStore } from "@/stores/useThemeStore";
import { View, Text, ScrollView, FlatList, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createCommonStyles } from "@/utils/themeStyles";
import CustomHeader from "@/components/Global/CustomHeader";
import { useTranslation } from "react-i18next";
import { LoadingState, ErrorState } from "@/components/Common";
import { databaseService } from "@/services/mock/databaseService";
import { Property } from "@/types/models";
import { Ionicons } from "@expo/vector-icons";
import PropertyFormModal from "@/components/Property/PropertyFormModal";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "expo-router";
import { formatMMK } from "@/utils/storageUtils";

export default function PropertyScreen() {
  const colors = useThemeStore((state) => state.colors);
  const commonStyles = createCommonStyles(colors);
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Initialize database and get all properties
      await databaseService.initializeFromStorage();
      const allProperties = await databaseService.getAllProperties();
      
      setProperties(allProperties);
    } catch (err) {
      console.error("Load properties error:", err);
      setError("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = () => {
    setFormMode("create");
    setSelectedProperty(null);
    setFormModalVisible(true);
  };

  const handleEditProperty = (property: Property) => {
    const propertyType = databaseService.getPropertyType(property.id);
    
    if (propertyType === "static") {
      Alert.alert(
        t("property.staticProperty"),
        t("property.staticPropertyDesc"),
        [{ text: t("common.ok") }]
      );
      return;
    }

    setFormMode("edit");
    setSelectedProperty(property);
    setFormModalVisible(true);
  };

  const handleDeleteProperty = (property: Property) => {
    const propertyType = databaseService.getPropertyType(property.id);
    
    if (propertyType === "static") {
      Alert.alert(
        t("property.staticProperty"),
        t("property.staticPropertyDesc"),
        [{ text: t("common.ok") }]
      );
      return;
    }

    Alert.alert(
      t("property.deleteProperty"),
      `${t("property.deletePropertyDesc")} ${property.name}?`,
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("property.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              const success = await databaseService.deleteProperty(property.id);
              if (success) {
                await loadProperties(); // Refresh list
                Alert.alert(t("common.success"), t("property.deleteSuccess"));
              } else {
                Alert.alert(t("common.error"), t("property.deleteError"));
              }
            } catch (err) {
              Alert.alert(t("common.error"), t("property.deleteError"));
            }
          }
        }
      ]
    );
  };

  const getPropertyTypeIndicator = (propertyId: string) => {
    const type = databaseService.getPropertyType(propertyId);
    return type === "static" ? "🔒" : "✏️";
  };

  // Use centralized formatMMK function from utils

  const handleFormSubmit = async (propertyData: Omit<Property, "id">): Promise<boolean> => {
    try {
      if (formMode === "create") {
        const newProperty = await databaseService.createProperty(propertyData);
        if (newProperty) {
          await loadProperties(); // Refresh the list
          return true;
        }
      } else if (formMode === "edit" && selectedProperty) {
        const success = await databaseService.updateProperty(selectedProperty.id, propertyData);
        if (success) {
          await loadProperties(); // Refresh the list
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Form submit error:", error);
      return false;
    }
  };

  if (loading) {
    return (
      <View style={commonStyles.screenContainer}>
        <SafeAreaView style={commonStyles.safeArea}>
          <CustomHeader isMainTab title={t("common.property")} showSettingsButton />
          <LoadingState />
        </SafeAreaView>
      </View>
    );
  }

  if (error) {
    return (
      <View style={commonStyles.screenContainer}>
        <SafeAreaView style={commonStyles.safeArea}>
          <CustomHeader isMainTab title={t("common.property")} showSettingsButton />
          <ErrorState error={error} onRetry={loadProperties} />
        </SafeAreaView>
      </View>
    );
  }

  // Check authentication for admin features
  if (!isAuthenticated) {
    return (
      <View style={commonStyles.screenContainer}>
        <SafeAreaView style={commonStyles.safeArea}>
          <CustomHeader isMainTab title={t("common.property")} showSettingsButton />
          <View style={commonStyles.emptyStateContainer}>
            <Text style={commonStyles.emptyStateTitle}>
              {t("property.authRequired")}
            </Text>
            <Text style={commonStyles.emptyStateSubtitle}>
              {t("property.authRequiredSubtitle")}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 8,
                marginTop: 20,
                alignItems: "center",
                justifyContent: "center",
                minHeight: 48,
                elevation: 2,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
              onPress={() => router.push("/(share)/sign-in")}
            >
              <Text style={{ 
                color: colors.white, 
                fontSize: 16, 
                fontWeight: "600",
                textAlign: "center",
                includeFontPadding: false,
              }}>
                {t("auth.signIn")}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={commonStyles.screenContainer}>
      <SafeAreaView style={commonStyles.safeArea}>
        <CustomHeader isMainTab title={t("property.adminTitle")} showSettingsButton />
        <ScrollView style={commonStyles.contentContainer}>
          {/* Header Section */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: colors.text, fontSize: 24, fontWeight: "700", marginBottom: 8 }}>
              {t("property.cisProperties")}
            </Text>
            <Text style={{ color: colors.textLight, fontSize: 16 }}>
              {t("property.adminDescription")}
            </Text>
          </View>

          {/* Add Property Button */}
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              borderRadius: 12,
              marginBottom: 20,
            }}
            onPress={handleAddProperty}
          >
            <Ionicons name="add" size={20} color={colors.white} />
            <Text style={{ color: colors.white, fontSize: 16, fontWeight: "600", marginLeft: 8 }}>
              {t("property.addProperty")}
            </Text>
          </TouchableOpacity>

          {/* Properties List */}
          <FlatList
            data={properties}
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 16,
                  shadowColor: colors.shadow,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                {/* Property Header */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                    <Text style={{ fontSize: 16, marginRight: 8 }}>
                      {getPropertyTypeIndicator(item.id)}
                    </Text>
                    <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700", flex: 1 }}>
                      {item.name}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      style={{
                        padding: 8,
                        borderRadius: 8,
                        backgroundColor: colors.primary,
                        marginRight: 8,
                      }}
                      onPress={() => handleEditProperty(item)}
                    >
                      <Ionicons name="pencil" size={16} color={colors.white} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        padding: 8,
                        borderRadius: 8,
                        backgroundColor: colors.expense,
                      }}
                      onPress={() => handleDeleteProperty(item)}
                    >
                      <Ionicons name="trash" size={16} color={colors.white} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Property Details */}
                <View style={{ flexDirection: "row", marginBottom: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, color: colors.textLight }}>
                      {t("property.segment")}
                    </Text>
                    <Text style={{ fontSize: 14, color: colors.text, fontWeight: "600" }}>
                      {item.segment}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, color: colors.textLight }}>
                      {t("property.location")}
                    </Text>
                    <Text style={{ fontSize: 14, color: colors.text, fontWeight: "600" }}>
                      {item.location}
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: "row", marginBottom: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, color: colors.textLight }}>
                      {t("property.totalValue")}
                    </Text>
                    <Text style={{ fontSize: 14, color: colors.text, fontWeight: "600" }}>
                      {formatMMK(item.currentValueMMK)}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, color: colors.textLight }}>
                      {t("property.sharePrice")}
                    </Text>
                    <Text style={{ fontSize: 14, color: colors.text, fontWeight: "600" }}>
                      {formatMMK(item.sharePriceMMK)}
                    </Text>
                  </View>
                </View>

                <Text style={{ fontSize: 12, color: colors.textLight, fontStyle: "italic" }}>
                  {item.description}
                </Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />

          {/* Property Form Modal */}
          <PropertyFormModal
            visible={formModalVisible}
            onClose={() => setFormModalVisible(false)}
            onSubmit={handleFormSubmit}
            property={selectedProperty}
            mode={formMode}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
