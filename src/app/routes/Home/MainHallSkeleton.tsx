import styles from './MainHallSkeleton.module.css'

/** Loading shell until `pageReady` (i18n + session or referral code in storage). */
export function MainHallSkeleton() {
  return (
    <section className={styles.root} aria-busy="true" aria-label="Loading">
      <div className={styles.hero} />
      <div className={styles.row}>
        <div className={styles.pill} />
        <div className={styles.pill} />
      </div>
      <div className={styles.strip} />
    </section>
  )
}
