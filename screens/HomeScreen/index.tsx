import { useThemeStore } from "@/stores/useThemeStore";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createCommonStyles } from "@/utils/themeStyles";
import CustomHeader from "@/components/Global/CustomHeader";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { logStorageData } from "@/utils/storageUtils";

export default function HomeScreen() {
  const colors = useThemeStore((state) => state.colors);
  const { isAuthenticated, user } = useAuthStore();
  const commonStyles = createCommonStyles(colors);
  const { t } = useTranslation();

  useEffect(() => {
    logStorageData();
  }, []);

  return (
    <View style={commonStyles.screenContainer}>
      <SafeAreaView style={commonStyles.safeArea}>
        <CustomHeader isMainTab title={t("common.home")} showSettingsButton />
        <ScrollView style={commonStyles.contentContainer}>
          <View>
            <Text style={{ color: colors.text, fontSize: 18 }}>
              {t("home.title")}
            </Text>
            <Text style={{ color: colors.textLight, marginTop: 10 }}>
              {t("home.authStatus")}:{" "}
              {isAuthenticated ? t("home.signedIn") : t("home.guest")}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
