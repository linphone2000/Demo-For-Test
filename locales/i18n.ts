import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en/translation.json";
import mm from "./mm/translation.json";

// Get device language, fallback to 'en' if not supported
const fallbackLng = "en";
const locales = getLocales(); // returns an array of preferred locales
const deviceLanguage = locales[0]?.languageCode || fallbackLng; // e.g., 'en-US' → 'en'
const supportedLanguages = ["en", "mm"];
const lng = supportedLanguages.includes(deviceLanguage)
  ? deviceLanguage
  : fallbackLng;

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v4",
    lng,
    fallbackLng,
    resources: {
      en: {
        translation: en,
      },
      mm: {
        translation: mm,
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
