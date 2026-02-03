import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import commonEn from './locales/en/common.json';
import navigationEn from './locales/en/navigation.json';
import profileEn from './locales/en/profile.json';
import jobsEn from './locales/en/jobs.json';
import dashboardEn from './locales/en/dashboard.json';
import applicationsEn from './locales/en/applications.json';
import candidatesEn from './locales/en/candidates.json';

import commonEs from './locales/es/common.json';
import navigationEs from './locales/es/navigation.json';
import profileEs from './locales/es/profile.json';
import jobsEs from './locales/es/jobs.json';
import dashboardEs from './locales/es/dashboard.json';
import applicationsEs from './locales/es/applications.json';
import candidatesEs from './locales/es/candidates.json';

export const defaultNS = 'common';
export const resources = {
  en: {
    common: commonEn,
    navigation: navigationEn,
    profile: profileEn,
    jobs: jobsEn,
    dashboard: dashboardEn,
    applications: applicationsEn,
    candidates: candidatesEn,
  },
  es: {
    common: commonEs,
    navigation: navigationEs,
    profile: profileEs,
    jobs: jobsEs,
    dashboard: dashboardEs,
    applications: applicationsEs,
    candidates: candidatesEs,
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
