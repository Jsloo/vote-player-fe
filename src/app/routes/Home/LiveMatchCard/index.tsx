import { DotLoading } from 'antd-mobile'
import liveMatchBg from '@/assets/image/live-match.png'
import countryFrame from '@/assets/image/country-frame.png'
import countryNameBg from '@/assets/image/country-name.png'
import deerMascot from '@/assets/image/deer-mascot.png'
import birdMascot from '@/assets/image/bird-mascot.png'
import type { PlayerMatchResponse } from '@/app/contract'
import { formatMatchRibbonTime } from '@/app/utils/formatMatchRibbonTime'
import styles from './index.module.css'

export type LiveMatchCardProps = {
  /** `null` = empty shell (no live match). */
  match: PlayerMatchResponse | null
  /** Initial fetch while showing empty slide. */
  isLoading?: boolean
}

export function LiveMatchCard({ match, isLoading }: LiveMatchCardProps) {
  const empty = match === null
  const home = match?.teams?.[0]
  const away = match?.teams?.[1]
  const hasTeams = !!home && !!away

  return (
    <div className={styles.container}>
      <div className={styles.cardLayer}>
        <img src={liveMatchBg} alt="" aria-hidden="true" className={styles.layer1Background} />

        <div className={styles.layer2Flags} aria-hidden="true">
          <div className={styles.flagSlot}>
            {hasTeams ? <img src={home.team.logoUrl} alt="" className={styles.flagImage} /> : null}
          </div>
          <div className={styles.flagSlot}>
            {hasTeams ? <img src={away.team.logoUrl} alt="" className={styles.flagImage} /> : null}
          </div>
        </div>

        <div className={styles.layer3Frames} aria-hidden="true">
          <img src={countryFrame} alt="" className={styles.countryFrameCenter} />
          <div className={styles.countryNameRow}>
            <img src={countryNameBg} alt="" className={styles.countryNameBg} />
            <img src={countryNameBg} alt="" className={styles.countryNameBg} />
          </div>
        </div>

        <div className={styles.layer4Mascots} aria-hidden="true">
          <img src={deerMascot} alt="" className={styles.mascotLeft} />
          <img src={birdMascot} alt="" className={styles.mascotRight} />
        </div>

        <div className={styles.layer5Text} aria-busy={isLoading}>
          <div className={styles.ribbonText}>
            {empty || !hasTeams
              ? isLoading
                ? <DotLoading color="white" />
                : '—'
              : formatMatchRibbonTime(match.matchTime)}
          </div>

          <div className={styles.teamTextRow}>
            <div className={styles.teamTextCol}>
              <span className={styles.teamName}>{hasTeams ? home.team.name : '—'}</span>
              <span className={styles.voteLine}>Total Vote {hasTeams ? home.votedCount : '—'}</span>
            </div>
            <div className={styles.centerTextCol}>
              <span className={styles.scoreText}>
                {hasTeams ? `${home.score} - ${away.score}` : '—'}
              </span>
            </div>
            <div className={styles.teamTextCol}>
              <span className={styles.teamName}>{hasTeams ? away.team.name : '—'}</span>
              <span className={styles.voteLine}>Total Vote {hasTeams ? away.votedCount : '—'}</span>
            </div>
          </div>

          <div className={styles.bottomRibbonText}>
            <span className={styles.matchName}>{hasTeams ? match.matchName : '—'}</span>
            <span className={styles.titleName}>
              {hasTeams ? match.titleName || '—' : 'No live match'}
            </span>
          </div>
          {hasTeams && match.status === 'LIVE' ? (
            <span className={styles.watchLiveNow}>
              <span>• Watch</span>
              <span>Live Now</span>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}
