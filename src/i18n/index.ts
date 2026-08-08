import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import ka from "./locales/ka.json";

const resources = {
  en: {
    translation: en,
  },
  ka: {
    translation: ka,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: false,

    detection: {
      order: ["querystring", "localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupQuerystring: "lng",
      lookupLocalStorage: "i18nextLng",
      convertDetectedLanguage: (lng: string) => {
        // Convert en-US, en-GB, etc. to just "en"
        if (lng.startsWith("en")) return "en";
        if (lng.startsWith("ka")) return "ka";
        return lng;
      },
    },

    interpolation: {
      escapeValue: false,
    },
  });

// Update URL query string when language changes
i18n.on("languageChanged", (lng: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set("lng", lng);
  window.history.replaceState({}, "", url.toString());
});

export default i18n;
