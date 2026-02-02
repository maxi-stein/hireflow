import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import commonEn from './locales/en/common.json';
import navigationEn from './locales/en/navigation.json';
import commonEs from './locales/es/common.json';
import navigationEs from './locales/es/navigation.json';

export const defaultNS = 'common';
export const resources = {
  en: {
    common: commonEn,
    navigation: navigationEn,
  },
  es: {
    common: commonEs,
    navigation: navigationEs,
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: 'en',
    defaultNS,
    resources,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['queryString', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
