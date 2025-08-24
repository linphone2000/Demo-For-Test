import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { useThemeStore } from "@/stores/useThemeStore";
import { useTranslation } from "react-i18next";
import { Property } from "@/types/models";
import { Ionicons } from "@expo/vector-icons";

interface PropertyFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (propertyData: Omit<Property, "id">) => Promise<boolean>;
  property?: Property | null; // For editing mode
  mode: "create" | "edit";
}

const SEGMENTS = ["Residential", "Commercial", "Retail", "Industrial", "Hospitality"];
const LOCATIONS = ["Yangon", "Mandalay", "Naypyidaw", "Bago", "Mawlamyine"];

export default function PropertyFormModal({
  visible,
  onClose,
  onSubmit,
  property,
  mode,
}: PropertyFormModalProps) {
  const colors = useThemeStore((state) => state.colors);
  const { t } = useTranslation();
  const styles = createStyles(colors);

  const [formData, setFormData] = useState({
    name: "",
    segment: "Residential",
    currentValueMMK: "",
    description: "",
    location: "Yangon",
    yearBuilt: "",
    totalUnits: "",
    occupancyRate: "",
    totalShares: "",
    availableShares: "",
    sharePriceMMK: "",
    cisOwnershipPct: "",
  });

  const [loading, setLoading] = useState(false);

  // Initialize form with property data when editing
  useEffect(() => {
    if (property && mode === "edit") {
      setFormData({
        name: property.name,
        segment: property.segment,
        currentValueMMK: property.currentValueMMK.toString(),
        description: property.description,
        location: property.location,
        yearBuilt: property.yearBuilt.toString(),
        totalUnits: property.totalUnits.toString(),
        occupancyRate: property.occupancyRate.toString(),
        totalShares: property.totalShares.toString(),
        availableShares: property.availableShares.toString(),
        sharePriceMMK: property.sharePriceMMK.toString(),
        cisOwnershipPct: property.cisOwnershipPct.toString(),
      });
    } else {
      // Reset form for create mode
      setFormData({
        name: "",
        segment: "Residential",
        currentValueMMK: "",
        description: "",
        location: "Yangon",
        yearBuilt: new Date().getFullYear().toString(),
        totalUnits: "",
        occupancyRate: "85",
        totalShares: "",
        availableShares: "",
        sharePriceMMK: "",
        cisOwnershipPct: "25",
      });
    }
  }, [property, mode, visible]);

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      Alert.alert(t("common.error"), t("property.validation.nameRequired"));
      return;
    }
    if (!formData.currentValueMMK || parseFloat(formData.currentValueMMK) <= 0) {
      Alert.alert(t("common.error"), t("property.validation.valueRequired"));
      return;
    }
    if (!formData.totalShares || parseInt(formData.totalShares) <= 0) {
      Alert.alert(t("common.error"), t("property.validation.sharesRequired"));
      return;
    }

    setLoading(true);
    try {
      const propertyData: Omit<Property, "id"> = {
        name: formData.name.trim(),
        segment: formData.segment,
        currentValueMMK: parseFloat(formData.currentValueMMK),
        description: formData.description.trim(),
        location: formData.location,
        yearBuilt: parseInt(formData.yearBuilt),
        totalUnits: parseInt(formData.totalUnits) || 0,
        occupancyRate: parseFloat(formData.occupancyRate),
        totalShares: parseInt(formData.totalShares),
        availableShares: parseInt(formData.availableShares) || parseInt(formData.totalShares),
        sharePriceMMK: parseFloat(formData.sharePriceMMK) || parseFloat(formData.currentValueMMK) / parseInt(formData.totalShares),
        cisOwnershipPct: parseFloat(formData.cisOwnershipPct),
      };

      const success = await onSubmit(propertyData);
      if (success) {
        onClose();
        Alert.alert(
          t("common.success"),
          mode === "create" ? t("property.createSuccess") : t("property.updateSuccess")
        );
      }
    } catch (error) {
      Alert.alert(t("common.error"), t("property.saveError"));
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>
            {mode === "create" ? t("property.addProperty") : t("property.editProperty")}
          </Text>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          >
            <Text style={styles.saveButtonText}>
              {loading ? t("common.saving") : t("common.save")}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("property.basicInfo")}</Text>
            
            <TextInput
              style={styles.input}
              placeholder={t("property.name")}
              placeholderTextColor={colors.textLight}
              value={formData.name}
              onChangeText={(value) => updateFormData("name", value)}
            />

            <TextInput
              style={styles.input}
              placeholder={t("property.description")}
              placeholderTextColor={colors.textLight}
              value={formData.description}
              onChangeText={(value) => updateFormData("description", value)}
              multiline
              numberOfLines={3}
            />

            {/* Segment Picker */}
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>{t("property.segment")}</Text>
              <View style={styles.segmentButtons}>
                {SEGMENTS.map((segment) => (
                  <TouchableOpacity
                    key={segment}
                    style={[
                      styles.segmentButton,
                      formData.segment === segment && styles.segmentButtonActive,
                    ]}
                    onPress={() => updateFormData("segment", segment)}
                  >
                    <Text
                      style={[
                        styles.segmentButtonText,
                        formData.segment === segment && styles.segmentButtonTextActive,
                      ]}
                    >
                      {segment}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Location Picker */}
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>{t("property.location")}</Text>
              <View style={styles.segmentButtons}>
                {LOCATIONS.map((location) => (
                  <TouchableOpacity
                    key={location}
                    style={[
                      styles.segmentButton,
                      formData.location === location && styles.segmentButtonActive,
                    ]}
                    onPress={() => updateFormData("location", location)}
                  >
                    <Text
                      style={[
                        styles.segmentButtonText,
                        formData.location === location && styles.segmentButtonTextActive,
                      ]}
                    >
                      {location}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TextInput
              style={styles.input}
              placeholder={t("property.yearBuilt")}
              placeholderTextColor={colors.textLight}
              value={formData.yearBuilt}
              onChangeText={(value) => updateFormData("yearBuilt", value)}
              keyboardType="numeric"
            />
          </View>

          {/* Financial Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("property.financialInfo")}</Text>
            
            <TextInput
              style={styles.input}
              placeholder={t("property.currentValueMMK")}
              placeholderTextColor={colors.textLight}
              value={formData.currentValueMMK}
              onChangeText={(value) => updateFormData("currentValueMMK", value)}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder={t("property.sharePriceMMK")}
              placeholderTextColor={colors.textLight}
              value={formData.sharePriceMMK}
              onChangeText={(value) => updateFormData("sharePriceMMK", value)}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder={t("property.totalShares")}
              placeholderTextColor={colors.textLight}
              value={formData.totalShares}
              onChangeText={(value) => updateFormData("totalShares", value)}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder={t("property.availableShares")}
              placeholderTextColor={colors.textLight}
              value={formData.availableShares}
              onChangeText={(value) => updateFormData("availableShares", value)}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder={t("property.cisOwnershipPct")}
              placeholderTextColor={colors.textLight}
              value={formData.cisOwnershipPct}
              onChangeText={(value) => updateFormData("cisOwnershipPct", value)}
              keyboardType="numeric"
            />
          </View>

          {/* Property Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("property.propertyDetails")}</Text>
            
            <TextInput
              style={styles.input}
              placeholder={t("property.totalUnits")}
              placeholderTextColor={colors.textLight}
              value={formData.totalUnits}
              onChangeText={(value) => updateFormData("totalUnits", value)}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder={t("property.occupancyRate")}
              placeholderTextColor={colors.textLight}
              value={formData.occupancyRate}
              onChangeText={(value) => updateFormData("occupancyRate", value)}
              keyboardType="numeric"
            />
          </View>
        </ScrollView>
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
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.card,
    },
    closeButton: {
      padding: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      flex: 1,
      textAlign: "center",
    },
    saveButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    saveButtonDisabled: {
      opacity: 0.5,
    },
    saveButtonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: "600",
    },
    content: {
      flex: 1,
      padding: 16,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 16,
    },
    input: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      marginBottom: 12,
    },
    pickerContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    segmentButtons: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    segmentButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    segmentButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    segmentButtonText: {
      fontSize: 14,
      color: colors.text,
    },
    segmentButtonTextActive: {
      color: colors.white,
      fontWeight: "600",
    },
  });
