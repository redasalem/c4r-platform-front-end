"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translations directly (bundled approach for Next.js)
import arCommon from "./public/locales/ar/common.json";
import enCommon from "./public/locales/en/common.json";

const resources = {
  ar: {
    common: arCommon,
  },
  en: {
    common: enCommon,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "ar",
    lng: "ar", // Default language is Arabic
    supportedLngs: ["ar", "en"],
    ns: ["common"],
    defaultNS: "common",
    debug: process.env.NODE_ENV === "development",
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ["localStorage", "cookie", "navigator"],
      caches: ["localStorage", "cookie"],
      lookupLocalStorage: "i18nextLng",
      lookupCookie: "i18next",
    },
    react: {
      useSuspense: false, // Build-time safe
    },
  });

export default i18n;
