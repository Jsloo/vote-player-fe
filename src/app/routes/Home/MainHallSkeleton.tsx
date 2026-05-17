import { useTranslation } from 'react-i18next'
import { translationKey } from '@/i18n/constants'
import styles from './MainHallSkeleton.module.css'

/** Loading shell until `pageReady` (i18n + session or referral code in storage). */
export function MainHallSkeleton() {
  const { t } = useTranslation()

  return (
    <section
      className={styles.root}
      aria-busy="true"
      aria-label={t(translationKey.COMMON_LOADING, { defaultValue: 'Loading' })}
    >
      <div className={styles.hero} />
      <div className={styles.row}>
        <div className={styles.pill} />
        <div className={styles.pill} />
      </div>
      <div className={styles.strip} />
    </section>
  )
}
