import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'
import howToWinEn from '@/assets/svg/how-to-win-en.svg'
import howToWinMs from '@/assets/svg/how-to-win-ms.svg'
import howToWinZh from '@/assets/svg/how-to-win-zh-CN.svg'
import gameRuleEn from '@/assets/svg/game-rule-en.svg'
import gameRuleMs from '@/assets/svg/game-rule-ms.svg'
import gameRuleZh from '@/assets/svg/game-rule-zh-CN.svg'
import type { SupportedLanguage } from '@/app/constant'
import styles from './index.module.css'

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

  useEffect(() => {
    if (visible) setPage('how-to-win')
  }, [visible])

  const lang = useMemo(() => resolveLanguageKey(i18n.language), [i18n.language])

  const imageSrc =
    page === 'how-to-win' ? HOW_TO_WIN_BY_LANG[lang] : GAME_RULE_BY_LANG[lang]

  const imageAlt =
    page === 'how-to-win' ? 'How to win' : 'Game rules'

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
          <img className={styles.image} src={imageSrc} alt={imageAlt} />
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
