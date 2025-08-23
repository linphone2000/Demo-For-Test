import { useThemeStore } from "@/stores/useThemeStore";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createCommonStyles } from "@/utils/themeStyles";
import CustomHeader from "@/components/Global/CustomHeader";
import { useTranslation } from "react-i18next";

export default function PropertyScreen() {
  const colors = useThemeStore((state) => state.colors);
  const commonStyles = createCommonStyles(colors);
  const { t } = useTranslation();

  return (
    <View style={commonStyles.screenContainer}>
      <SafeAreaView style={commonStyles.safeArea}>
        <CustomHeader isMainTab title={t("common.property")} showSettingsButton />
        <ScrollView style={commonStyles.contentContainer}>
          <View style={{ padding: 20 }}>
            <Text style={{ color: colors.text, fontSize: 18 }}>
              {t("property.title")}
            </Text>
            <Text style={{ color: colors.textLight, marginTop: 10 }}>
              {t("property.addContent")}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
