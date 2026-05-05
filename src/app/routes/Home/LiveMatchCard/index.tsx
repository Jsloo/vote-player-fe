import { DotLoading } from 'antd-mobile'
import liveMatchBg from '@/assets/image/live-match.png'
import deerMascot from '@/assets/image/deer-mascot.png'
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
        <img
          src={liveMatchBg}
          alt=""
          aria-hidden="true"
          className={styles.background}
        />
        <div
          className={`${styles.matchOverlay}${empty ? ` ${styles.matchOverlayEmpty}` : ''}`}
          aria-busy={isLoading}
        >
          {empty || !hasTeams ? (
            <>
              <div className={styles.ribbonText}>
                {isLoading ? <DotLoading color="white" /> : '—'}
              </div>
              <div className={styles.matchBody}>
                <div className={styles.matchInner}>
                  <div className={styles.teamsBand}>
                    <div className={styles.teamColumn}>
                      <div className={styles.teamFlagSlot}>
                        <div className={`${styles.flagRing} ${styles.flagRingEmpty}`} />
                      </div>
                      <div className={styles.teamNameSlot}>
                        <span className={styles.teamNameMuted}>—</span>
                      </div>
                      <div className={styles.teamVotesSlot}>
                        <span className={styles.voteLineMuted}>Total Vote: —</span>
                      </div>
                    </div>
                    <div className={styles.centerBand}>
                      <div className={styles.centerMeta}>
                        <div className={styles.matchNameLineMuted}>—</div>
                        <span className={styles.titleNamePillMuted}>
                          <span className={styles.titleNameMuted}>No live match</span>
                        </span>
                      </div>
                      <div className={styles.centerScore}>
                        <span className={styles.scoreTextMuted}>—</span>
                      </div>
                    </div>
                    <div className={styles.teamColumn}>
                      <div className={styles.teamFlagSlot}>
                        <div className={`${styles.flagRing} ${styles.flagRingEmpty}`} />
                      </div>
                      <div className={styles.teamNameSlot}>
                        <span className={styles.teamNameMuted}>—</span>
                      </div>
                      <div className={styles.teamVotesSlot}>
                        <span className={styles.voteLineMuted}>Total Vote: —</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.ribbonText}>
                {formatMatchRibbonTime(match.matchTime)}
              </div>
              <div className={styles.matchBody}>
                <div className={styles.matchInner}>
                  <div className={styles.teamsBand}>
                    <div className={styles.teamColumn}>
                      <div className={styles.teamFlagSlot}>
                        <div className={styles.flagRing}>
                          <img src={home.team.logoUrl} alt="" className={styles.flagImg} />
                        </div>
                      </div>
                      <div className={styles.teamNameSlot}>
                        <span className={styles.teamName}>{home.team.name}</span>
                      </div>
                      <div className={styles.teamVotesSlot}>
                        <span className={styles.voteLine}>Total Vote: {home.votedCount}</span>
                      </div>
                    </div>
                    <div className={styles.centerBand}>
                      <div className={styles.centerMeta}>
                        <div className={styles.matchNameLine}>{match.matchName}</div>
                        {match.titleName?.trim() ? (
                          <span className={styles.titleNamePill}>
                            <span className={styles.titleName}>{match.titleName}</span>
                          </span>
                        ) : null}
                      </div>
                      <div className={styles.centerScore}>
                        <span className={styles.scoreText}>
                          {home.score} - {away.score}
                        </span>
                      </div>
                    </div>
                    <div className={styles.teamColumn}>
                      <div className={styles.teamFlagSlot}>
                        <div className={styles.flagRing}>
                          <img src={away.team.logoUrl} alt="" className={styles.flagImg} />
                        </div>
                      </div>
                      <div className={styles.teamNameSlot}>
                        <span className={styles.teamName}>{away.team.name}</span>
                      </div>
                      <div className={styles.teamVotesSlot}>
                        <span className={styles.voteLine}>Total Vote: {away.votedCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <img
          src={deerMascot}
          alt=""
          aria-hidden="true"
          className={styles.mascotLeft}
        />
        <img
          src={deerMascot}
          alt=""
          aria-hidden="true"
          className={styles.mascotRight}
        />
      </div>
    </div>
  )
}
