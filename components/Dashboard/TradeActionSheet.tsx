import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import { useThemeStore } from "@/stores/useThemeStore";
import { useTranslation } from "react-i18next";
import { usePortfolioStore } from "@/stores/usePortfolioStore";
import { SPACING, BORDER_RADIUS, PADDING } from "@/utils/themeStyles";
import { Ionicons } from "@expo/vector-icons";
import { databaseService } from "@/services/mock/databaseService";

interface TradeActionSheetProps {
  visible: boolean;
  onClose: () => void;
  action: "buy" | "sell";
}

export default function TradeActionSheet({
  visible,
  onClose,
  action,
}: TradeActionSheetProps) {
  const colors = useThemeStore((state) => state.colors);
  const { t } = useTranslation();
  const { portfolio, buyProperty, sellProperty } = usePortfolioStore();
  const styles = createStyles(colors);

  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [amount, setAmount] = useState("");

  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    const loadProperties = async () => {
      if (visible) { // Only load when modal is visible
        try {
          await databaseService.initializeFromStorage(); // Ensure latest data
          const allProps = await databaseService.getAllProperties();
          
          if (action === "sell") {
            // For selling, only show properties the user owns
            const userHoldings = portfolio?.holdings || [];
            const ownedPropertyIds = userHoldings.map(h => h.propertyId);
            const ownedProperties = allProps.filter(prop => ownedPropertyIds.includes(prop.id));
            setProperties(ownedProperties);
          } else {
            // For buying, show all available properties
            setProperties(allProps);
          }
        } catch (error) {
          console.error("Failed to load properties:", error);
        }
      }
    };
    loadProperties();
  }, [visible, action, portfolio?.holdings]); // Reload when modal visibility, action, or holdings change
  const isBuy = action === "buy";

  const handleConfirm = async () => {
    if (!selectedPropertyId || !amount) {
      Alert.alert("Error", "Please select a property and enter an amount");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (!portfolio) {
      Alert.alert("Error", "Portfolio data not available");
      return;
    }

    // Check if user has enough cash/shares
    if (isBuy && portfolio.cashMMK < amountNum) {
      Alert.alert("Error", t("home.trade.insufficientCash"));
      return;
    }

    if (!isBuy) {
      const holding = portfolio.holdings.find(h => h.propertyId === selectedPropertyId);
      if (!holding || holding.userValueMMK < amountNum) {
        Alert.alert("Error", t("home.trade.insufficientShares"));
        return;
      }
    }

    const success = isBuy
      ? await buyProperty(selectedPropertyId, amountNum)
      : await sellProperty(selectedPropertyId, amountNum);

    if (success) {
      Alert.alert("Success", t("home.trade.success"));
      handleClose();
    } else {
              Alert.alert("Error", t("home.trade.error"));
    }
  };

  const handleClose = () => {
    setSelectedPropertyId("");
    setAmount("");
    onClose();
  };

  const adjustAmount = (delta: number) => {
    const currentAmount = parseFloat(amount) || 0;
    const newAmount = Math.max(0, currentAmount + delta);
    setAmount(newAmount.toString());
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>
            {t(`home.trade.${action}`)}
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Scrollable Content */}
        <ScrollView 
          style={styles.scrollContent} 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Property Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Property</Text>
            
            {properties.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>
                  {action === "sell" 
                    ? "No properties to sell" 
                    : "No properties available"
                  }
                </Text>
                <Text style={styles.emptyStateSubtitle}>
                  {action === "sell" 
                    ? "You don't own any properties yet. Buy some first!" 
                    : "No properties are currently available for purchase."
                  }
                </Text>
              </View>
            ) : (
              <View style={styles.propertyGrid}>
                {properties.map((property) => (
                  <TouchableOpacity
                    key={property.id}
                    style={[
                      styles.propertyButton,
                      selectedPropertyId === property.id && styles.selectedProperty,
                    ]}
                    onPress={() => setSelectedPropertyId(property.id)}
                  >
                    <Text
                      style={[
                        styles.propertyButtonText,
                        selectedPropertyId === property.id && styles.selectedPropertyText,
                      ]}
                      numberOfLines={2}
                    >
                      {property.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Amount Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t("home.trade.amount")}
            </Text>
            
            <View style={styles.amountContainer}>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() => adjustAmount(-10000000)} // -10M
              >
                <Ionicons name="remove" size={20} color={colors.text} />
              </TouchableOpacity>

              <View style={styles.amountInputContainer}>
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textLight}
                />
                <Text style={styles.currencyLabel}>MMK</Text>
              </View>

              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() => adjustAmount(10000000)} // +10M
              >
                <Ionicons name="add" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Quick Amount Buttons */}
            <View style={styles.quickAmounts}>
              {[10000000, 50000000, 100000000].map((quickAmount) => (
                <TouchableOpacity
                  key={quickAmount}
                  style={styles.quickAmountButton}
                  onPress={() => setAmount(quickAmount.toString())}
                >
                  <Text style={styles.quickAmountText}>
                    {(quickAmount / 1000000).toFixed(0)}M
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Fixed Footer with Confirm Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              { 
                backgroundColor: properties.length === 0 
                  ? colors.textLight 
                  : (isBuy ? colors.income : colors.expense)
              },
            ]}
            onPress={handleConfirm}
            disabled={properties.length === 0}
          >
            <Text style={styles.confirmButtonText}>
              {properties.length === 0 
                ? "No Properties Available" 
                : t("home.trade.confirm")
              }
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: PADDING.screen,
      paddingVertical: SPACING.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    closeButton: {
      padding: SPACING.xs,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    placeholder: {
      width: 40,
    },
    scrollContent: {
      flex: 1,
    },
    scrollContainer: {
      paddingBottom: SPACING.lg,
    },
    section: {
      paddingHorizontal: PADDING.screen,
      paddingVertical: SPACING.lg,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: SPACING.md,
    },
    propertyGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: SPACING.md,
    },
    propertyButton: {
      width: "48%",
      padding: SPACING.lg,
      borderRadius: BORDER_RADIUS.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
      alignItems: "center",
    },
    selectedProperty: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + "10",
    },
    propertyButtonText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.text,
      textAlign: "center",
    },
    selectedPropertyText: {
      color: colors.primary,
      fontWeight: "600",
    },
    amountContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: SPACING.lg,
    },
    stepperButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.card,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    amountInputContainer: {
      flex: 1,
      marginHorizontal: SPACING.lg,
      alignItems: "center",
    },
    amountInput: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
      minWidth: 200,
    },
    currencyLabel: {
      fontSize: 14,
      color: colors.textLight,
      marginTop: SPACING.xs,
    },
    quickAmounts: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    quickAmountButton: {
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      borderRadius: BORDER_RADIUS.md,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    quickAmountText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.text,
    },
    footer: {
      paddingHorizontal: PADDING.screen,
      paddingVertical: SPACING.lg,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    confirmButton: {
      paddingVertical: SPACING.lg,
      borderRadius: BORDER_RADIUS.md,
      alignItems: "center",
    },
    confirmButtonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: "600",
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: SPACING.xl,
      paddingHorizontal: PADDING.screen,
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
      lineHeight: 20,
    },
  });
