import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";

// English-only. The language toggle was removed, so we lock the UI to English
// and skip browser/locale detection entirely.
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
  },
  lng: "en",
  fallbackLng: "en",
  debug: false,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
