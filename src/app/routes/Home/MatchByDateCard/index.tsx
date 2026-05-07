import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import countryFrameMatch from '@/assets/image/country-frame-match.png'
import voteButton from '@/assets/image/vote-button.png'
import type { PlayerMatchResponse } from '@/app/contract'
import { translationKey } from '@/i18n/constants'
import styles from './index.module.css'

type Props = {
  match: PlayerMatchResponse
}

export function MatchByDateCard({ match }: Props) {
  const { t } = useTranslation()
  const home = match.teams[0]
  const away = match.teams[1]
  if (!home || !away) return null

  const totalVotes = home.votedCount + away.votedCount
  const homePct = totalVotes > 0 ? Math.round((home.votedCount / totalVotes) * 100) : 50
  const awayPct = 100 - homePct

  const timeLabel = dayjs(match.matchTime).format('D MMM, h:mma').replace(/\s?(am|pm)$/i, '$1')

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.headerStage}>{match.matchName}</span>
        <span className={styles.headerTime}>{timeLabel}</span>
      </div>

      <div className={styles.teamsRow}>
        <div className={styles.teamCol}>
          <span className={styles.sideLabel}>Home</span>
          <div className={styles.flagWrap}>
            <img src={home.team.logoUrl} alt={home.team.name} className={styles.flagImg} />
            <img src={countryFrameMatch} alt="" aria-hidden="true" className={styles.frameOverlay} />
          </div>
          <span className={styles.teamName}>{home.team.name}</span>
        </div>

        <div className={styles.centerCol}>
          <span className={styles.vs}>VS</span>
          {match.status === 'LIVE' && (
            <span className={styles.liveBadge}>LIVE</span>
          )}
        </div>

        <div className={styles.teamCol}>
          <span className={styles.sideLabel}>Away</span>
          <div className={styles.flagWrap}>
            <img src={away.team.logoUrl} alt={away.team.name} className={styles.flagImg} />
            <img src={countryFrameMatch} alt="" aria-hidden="true" className={styles.frameOverlay} />
          </div>
          <span className={styles.teamName}>{away.team.name}</span>
        </div>
      </div>

      <button
        type="button"
        className={styles.voteBtn}
        aria-label={t(translationKey.MATCH_BY_DATE_VOTE_NOW, {
          defaultValue: 'Vote Now',
        })}
      >
        <img src={voteButton} alt="" aria-hidden="true" className={styles.voteBtnImg} />
        <span className={styles.voteBtnText}>
          {t(translationKey.MATCH_BY_DATE_VOTE_NOW, {
            defaultValue: 'Vote Now',
          })}
        </span>
      </button>

      <div className={styles.voteBarRow}>
        <div className={styles.voteBar} aria-label={`Home ${homePct}%, Away ${awayPct}%`}>
          <div className={styles.voteBarTrack}>
            <div className={styles.voteBarHome} style={{ width: `${homePct}%` }} />
            <div className={styles.voteBarAway} style={{ width: `${awayPct}%` }} />
          </div>
          <span className={styles.voteCountLeft}>{homePct}</span>
          <span className={styles.voteCountRight}>{awayPct}</span>
        </div>
      </div>
    </div>
  )
}
