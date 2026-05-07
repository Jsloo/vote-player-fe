import type { PlayerMatchResponse } from '@/app/contract'
import { MatchByDateCard } from '../MatchByDateCard'
import styles from './index.module.css'

type Props = {
  matches: PlayerMatchResponse[]
  isPending: boolean
}

export function MatchByDateCarousel({ matches, isPending }: Props) {
  if (!isPending && matches.length === 0) {
    return null
  }

  return (
    <div className={styles.root}>
      {isPending && matches.length === 0 ? (
        <div className={styles.placeholder}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard} aria-hidden="true" />
          ))}
        </div>
      ) : (
        <div className={styles.scroll}>
          {matches.map((match) => (
            <div key={match.id} className={styles.item}>
              <MatchByDateCard match={match} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
