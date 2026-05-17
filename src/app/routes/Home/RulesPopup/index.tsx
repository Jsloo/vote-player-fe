import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'
import howToWinEn from '@/assets/image/how-to-win-en.png'
import howToWinMs from '@/assets/image/how-to-win-ms.png'
import howToWinZh from '@/assets/image/how-to-win-zhCN.png'
import gameRuleEn from '@/assets/image/game-rule-en.png'
import gameRuleMs from '@/assets/image/game-rule-ms.png'
import gameRuleZh from '@/assets/image/game-rule-zhCN.png'
import type { SupportedLanguage } from '@/app/constant'
import styles from './index.module.css'

// Module-level cache so each asset is fetched at most once per session.
const preloadedSources = new Set<string>()

function preloadImage(src: string) {
  if (preloadedSources.has(src)) return
  preloadedSources.add(src)
  const img = new Image()
  img.decoding = 'async'
  img.src = src
}

type RulesPopupProps = {
  visible: boolean
  onClose: () => void
}

type Page = 'how-to-win' | 'game-rule'

const HOW_TO_WIN_BY_LANG: Record<SupportedLanguage, string> = {
  en: howToWinEn,
  ms: howToWinMs,
  'zh-CN': howToWinZh,
}

const GAME_RULE_BY_LANG: Record<SupportedLanguage, string> = {
  en: gameRuleEn,
  ms: gameRuleMs,
  'zh-CN': gameRuleZh,
}

function resolveLanguageKey(lang: string | undefined): SupportedLanguage {
  if (lang === 'ms' || lang === 'zh-CN') return lang
  return 'en'
}

export function RulesPopup({ visible, onClose }: RulesPopupProps) {
  const { i18n } = useTranslation()
  const [page, setPage] = useState<Page>('how-to-win')
  const [loaded, setLoaded] = useState<Record<string, boolean>>({})
  const hasPreloadedRef = useRef(false)

  const lang = useMemo(() => resolveLanguageKey(i18n.language), [i18n.language])

  // Kick off a background fetch of every popup asset the moment the component
  // mounts so the popup feels instant when the user opens it.
  useEffect(() => {
    if (hasPreloadedRef.current) return
    hasPreloadedRef.current = true
    const sources = [
      HOW_TO_WIN_BY_LANG[lang],
      GAME_RULE_BY_LANG[lang],
      ...Object.values(HOW_TO_WIN_BY_LANG),
      ...Object.values(GAME_RULE_BY_LANG),
    ]
    sources.forEach(preloadImage)
  }, [lang])

  useEffect(() => {
    if (visible) setPage('how-to-win')
  }, [visible])

  const imageSrc =
    page === 'how-to-win' ? HOW_TO_WIN_BY_LANG[lang] : GAME_RULE_BY_LANG[lang]

  const imageAlt =
    page === 'how-to-win' ? 'How to win' : 'Game rules'

  const isImageLoaded = !!loaded[imageSrc]

  if (!visible) return null

  return createPortal(
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={imageAlt}
      onClick={onClose}
    >
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.scrollArea}>
          {!isImageLoaded && (
            <div className={styles.loading} aria-hidden="true">
              <span className={styles.spinner} />
            </div>
          )}
          <img
            className={styles.image}
            src={imageSrc}
            alt={imageAlt}
            decoding="async"
            data-loaded={isImageLoaded ? 'true' : 'false'}
            onLoad={() => setLoaded((prev) => ({ ...prev, [imageSrc]: true }))}
          />
        </div>
        <button
          type="button"
          className={styles.closeHotspot}
          onClick={onClose}
          aria-label="Close"
        />
      </div>

      {page === 'game-rule' && (
        <button
          type="button"
          className={`${styles.navBtn} ${styles.navLeft}`}
          onClick={(e) => {
            e.stopPropagation()
            setPage('how-to-win')
          }}
          aria-label="How to win"
        >
          <IoChevronBack aria-hidden="true" />
        </button>
      )}

      {page === 'how-to-win' && (
        <button
          type="button"
          className={`${styles.navBtn} ${styles.navRight}`}
          onClick={(e) => {
            e.stopPropagation()
            setPage('game-rule')
          }}
          aria-label="Game rules"
        >
          <IoChevronForward aria-hidden="true" />
        </button>
      )}
    </div>,
    document.body,
  )
}

export default RulesPopup
