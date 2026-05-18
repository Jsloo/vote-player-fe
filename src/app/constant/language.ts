/** Supported i18n language codes (BCP-47 style, aligned with backend / lucky-draw). */
export const SUPPORTED_LANGUAGES = ['en', 'zh-CN', 'ms'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en'

/**
 * Maps parent iframe `langCode` and stored values to supported codes.
 * Parent portal uses EN / CH / MY only (aligned with lucky-draw `languageMap`).
 */
export const languageMap: Record<string, SupportedLanguage> = {
  EN: 'en',
  CH: 'zh-CN',
  MY: 'ms',
  en: 'en',
  'zh-CN': 'zh-CN',
  ms: 'ms',
}

export function isSupportedLanguage(value: string): value is SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value)
}
