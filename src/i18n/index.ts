import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

void i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        app: {
          title: 'Get started',
          count: 'Count is {{count}}',
          langEn: 'English',
          langZh: '中文',
          queryLabel: 'React Query:',
          queryReady: 'ready',
        },
      },
    },
    zh: {
      translation: {
        app: {
          title: '开始上手',
          count: '计数：{{count}}',
          langEn: 'English',
          langZh: '中文',
          queryLabel: 'React Query：',
          queryReady: '已就绪',
        },
      },
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
})

export default i18n
