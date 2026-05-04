import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

/** Empty bundles — copy comes from `t(key, { defaultValue })` at call sites (and remote `initI18n` merges). */
void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: {} },
    zh: { translation: {} },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
})

export default i18n
