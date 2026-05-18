import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  LANGUAGE_KEY,
  languageMap,
  type SupportedLanguage,
} from '@/app/constant'
import { safeParseStorage } from '@/app/utils/sessionTools'

/**
 * Resolves the active language using the same precedence as the lucky-draw app:
 *   1. Parent `langCode` query param (`EN` | `CH` | `MY`) via `languageMap`
 *   2. previously stored value in `sessionStorage[LANGUAGE_KEY]`
 *   3. `DEFAULT_LANGUAGE` ('en')
 */
function resolveLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE

  try {
    const params = new URLSearchParams(window.location.search)
    const fromUrl = params.get('langCode')?.trim()
    if (fromUrl) {
      const mapped = languageMap[fromUrl]
      if (mapped) return mapped
      if (isSupportedLanguage(fromUrl)) return fromUrl
    }
  } catch {
    // ignore malformed URL / non-browser contexts
  }

  if (typeof sessionStorage !== 'undefined') {
    const stored = safeParseStorage(sessionStorage.getItem(LANGUAGE_KEY)).trim()
    if (stored) {
      const mapped = languageMap[stored]
      if (mapped) return mapped
      if (isSupportedLanguage(stored)) return stored
    }
  }

  return DEFAULT_LANGUAGE
}

const resolved = resolveLanguage()

if (typeof sessionStorage !== 'undefined') {
  sessionStorage.setItem(LANGUAGE_KEY, JSON.stringify(resolved))
}

/** Empty bundles — copy comes from `t(key, { defaultValue })` at call sites (and remote `initI18n` merges). */
void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: {} },
    'zh-CN': { translation: {} },
    ms: { translation: {} },
  },
  lng: resolved,
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
  react: {
    useSuspense: false,
    /** Re-render when `initI18n` merges remote keys via `addResourceBundle`. */
    bindI18nStore: 'added removed',
  },
})

export default i18n
