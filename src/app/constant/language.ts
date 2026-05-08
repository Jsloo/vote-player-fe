/** Supported i18n language codes (BCP-47 style, aligned with backend / lucky-draw). */
export const SUPPORTED_LANGUAGES = ['en', 'zh-CN', 'ms'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en'

/**
 * Maps inbound `langCode` (URL query param) and legacy stored values to supported codes.
 */
export const languageMap: Record<string, SupportedLanguage> = {
  en: 'en',
  'en-US': 'en',
  'en-us': 'en',
  /** Legacy short code from older builds → canonical zh-CN */
  zh: 'zh-CN',
  'zh-CN': 'zh-CN',
  'zh-cn': 'zh-CN',
  'zh_CN': 'zh-CN',
  'zh-Hans': 'zh-CN',
  'zh-Hans-CN': 'zh-CN',
  ms: 'ms',
  'ms-MY': 'ms',
  'ms-my': 'ms',
  ms_MY: 'ms',
}

export function isSupportedLanguage(value: string): value is SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value)
}
