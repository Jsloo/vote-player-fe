import { DotLoading } from 'antd-mobile'
import { useTranslation } from 'react-i18next'
import liveMatchBg from '@/assets/image/live-match.png'
import countryFrame from '@/assets/image/country-frame.png'
import countryNameBg from '@/assets/image/country-name.png'
import deerMascot from '@/assets/image/deer-mascot.png'
import birdMascot from '@/assets/image/bird-mascot.png'
import type { PlayerMatchResponse } from '@/app/contract'
import { formatMatchRibbonTime } from '@/app/utils/formatMatchRibbonTime'
import { translateRemoteLabel } from '@/app/utils/translateRemoteLabel'
import { translationKey } from '@/i18n/constants'
import styles from './index.module.css'

export type LiveMatchCardProps = {
  /** `null` only while the initial fetch is in progress. */
  match: PlayerMatchResponse | null
  /** Initial fetch while showing a loading slide. */
  isLoading?: boolean
}

export function LiveMatchCard({ match, isLoading }: LiveMatchCardProps) {
  const { t } = useTranslation()

  if (match === null) {
    if (!isLoading) {
      return null
    }
    return (
      <div className={styles.container}>
        <div className={styles.cardLayer}>
          <img src={liveMatchBg} alt="" aria-hidden="true" className={styles.layer1Background} />
          <div className={styles.layer2Flags} aria-hidden="true">
            <div className={styles.flagSlot} />
            <div className={styles.flagSlot} />
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
          <div className={styles.layer5Text} aria-busy>
            <div className={styles.ribbonText}>
              <DotLoading color="white" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const home = match.teams[0]
  const away = match.teams[1]
  if (!home || !away) {
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.cardLayer}>
        <img src={liveMatchBg} alt="" aria-hidden="true" className={styles.layer1Background} />

        <div className={styles.layer2Flags} aria-hidden="true">
          <div className={styles.flagSlot}>
            <img src={home.team.logoUrl} alt="" className={styles.flagImage} />
          </div>
          <div className={styles.flagSlot}>
            <img src={away.team.logoUrl} alt="" className={styles.flagImage} />
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

        <div className={styles.layer5Text}>
          <div className={styles.ribbonText}>{formatMatchRibbonTime(match.matchTime)}</div>

          <div className={styles.teamTextRow}>
            <div className={styles.teamTextCol}>
              <span className={styles.teamName}>{home.team.name}</span>
              <span className={styles.voteLine}>
                {t(translationKey.LIVE_MATCH_TOTAL_VOTE, {
                  defaultValue: 'Total Vote {{count}}',
                  count: home.votedCount,
                })}
              </span>
            </div>
            <div className={styles.centerTextCol}>
              <span className={styles.scoreText}>
                {home.score} - {away.score}
              </span>
            </div>
            <div className={styles.teamTextCol}>
              <span className={styles.teamName}>{away.team.name}</span>
              <span className={styles.voteLine}>
                {t(translationKey.LIVE_MATCH_TOTAL_VOTE, {
                  defaultValue: 'Total Vote {{count}}',
                  count: away.votedCount,
                })}
              </span>
            </div>
          </div>

          <div className={styles.bottomRibbonText}>
            <span className={styles.matchName}>
              {translateRemoteLabel(t, match.matchName)}
            </span>
            {match.titleName ? (
              <span className={styles.titleName}>
                {translateRemoteLabel(t, match.titleName)}
              </span>
            ) : null}
          </div>
          {match.status === 'LIVE' ? (
            <span className={styles.watchLiveNow}>
              <span>• {t(translationKey.LIVE_MATCH_WATCH, { defaultValue: 'Watch' })}</span>
              <span>{t(translationKey.LIVE_MATCH_LIVE_NOW, { defaultValue: 'Live Now' })}</span>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}
