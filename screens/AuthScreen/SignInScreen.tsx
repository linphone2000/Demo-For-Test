import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { useTranslation } from "react-i18next";

export default function SignInScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { signIn, signUp } = useAuthStore();
  const { colors } = useThemeStore();
  const { t } = useTranslation();

  const handleClose = () => {
    router.back();
  };

  const handleAuth = async () => {
    if (!email || !password) return;
    if (isSignUp && (!name || !confirmPassword)) return;
    if (isSignUp && password !== confirmPassword) return;

    setIsLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, name);
      } else {
        await signIn(email, password);
      }
      router.back();
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    header: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      width: "100%",
    },
    closeButton: {
      padding: 8,
    },
    closeText: {
      fontSize: 20,
      fontWeight: "bold",
    },
    content: {
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
    },
    subtitle: {
      fontSize: 14,
      textAlign: "center",
      marginTop: 4,
    },
    form: {
      width: "100%",
      maxWidth: 320,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 6,
    },
    input: {
      height: 40,
      borderWidth: 1,
      borderRadius: 6,
      paddingHorizontal: 12,
      fontSize: 14,
      marginBottom: 12,
    },
    authButton: {
      height: 40,
      borderRadius: 6,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 12,
    },
    authButtonText: {
      fontSize: 14,
      fontWeight: "600",
    },
    footer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 16,
    },
    footerText: {
      fontSize: 14,
    },
    linkText: {
      fontSize: 14,
      fontWeight: "600",
      marginLeft: 4,
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={[styles.closeText, { color: colors.text }]}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          {isSignUp ? t("auth.signUp") : t("auth.signIn")}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textLight }]}>
          {isSignUp ? t("auth.signUpSubtitle") : t("auth.signInSubtitle")}
        </Text>

        <View style={styles.form}>
          {isSignUp && (
            <>
              <Text style={[styles.label, { color: colors.text }]}>{t("auth.fullName")}</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.borderInput,
                    color: colors.text,
                  },
                ]}
                value={name}
                onChangeText={setName}
                placeholder={t("auth.fullName")}
                placeholderTextColor={colors.textLight}
              />
            </>
          )}

          <Text style={[styles.label, { color: colors.text }]}>{t("auth.email")}</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor: colors.borderInput,
                color: colors.text,
              },
            ]}
            value={email}
            onChangeText={setEmail}
            placeholder={t("auth.email")}
            placeholderTextColor={colors.textLight}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={[styles.label, { color: colors.text }]}>{t("auth.password")}</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor: colors.borderInput,
                color: colors.text,
              },
            ]}
            value={password}
            onChangeText={setPassword}
            placeholder={t("auth.password")}
            placeholderTextColor={colors.textLight}
            secureTextEntry
          />

          {isSignUp && (
            <>
              <Text style={[styles.label, { color: colors.text }]}>
                {t("auth.confirmPassword")}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.borderInput,
                    color: colors.text,
                  },
                ]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder={t("auth.confirmPassword")}
                placeholderTextColor={colors.textLight}
                secureTextEntry
              />
            </>
          )}

          <TouchableOpacity
            style={[styles.authButton, { backgroundColor: colors.primary }]}
            onPress={handleAuth}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={[styles.authButtonText, { color: colors.white }]}>
                {isSignUp ? t("auth.authButtonTextSignUp") : t("auth.authButtonText")}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.text }]}>
              {isSignUp ? t("auth.alreadyHaveAccount") : t("auth.dontHaveAccount")}
            </Text>
            <TouchableOpacity onPress={toggleMode}>
              <Text style={[styles.linkText, { color: colors.primary }]}>
                {isSignUp ? t("auth.toggleToSignIn") : t("auth.toggleToSignUp")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}