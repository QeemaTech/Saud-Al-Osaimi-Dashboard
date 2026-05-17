import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en/translation.json';
import ar from './ar/translation.json';

const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('locale') : null;

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: stored === 'ar' || stored === 'en' ? stored : 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem('locale', lng);
  } catch {
    /* ignore */
  }
});

export default i18n;
