import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import hi from './locales/hi.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import kn from './locales/kn.json';

const resources = { en: { translation: en }, hi: { translation: hi }, ta: { translation: ta }, te: { translation: te }, kn: { translation: kn } };

const storage =
  typeof window !== 'undefined' &&
  window.localStorage &&
  typeof window.localStorage.getItem === 'function'
    ? window.localStorage
    : null;
const browserLanguage =
  typeof navigator !== 'undefined' && navigator.language ? navigator.language.slice(0, 2) : 'en';

i18n.use(initReactI18next).init({ resources, lng: storage?.getItem('roadsos_language') || browserLanguage, fallbackLng: 'en', interpolation: { escapeValue: false } });

export default i18n;
