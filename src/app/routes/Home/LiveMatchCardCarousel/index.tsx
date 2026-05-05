import { Swiper } from 'antd-mobile'
import type { PlayerMatchResponse } from '@/app/contract'
import { LiveMatchCard } from '../LiveMatchCard'
import styles from './index.module.css'

export type LiveMatchCardCarouselProps = {
  matches: PlayerMatchResponse[]
  isPending: boolean
}

export function LiveMatchCardCarousel({ matches, isPending }: LiveMatchCardCarouselProps) {
  const slides: (PlayerMatchResponse | null)[] =
    matches.length > 0 ? matches : [null]

  const swipeEnabled = matches.length > 1

  return (
    <div className={styles.swiperRoot}>
      <Swiper
        key={matches.length > 0 ? matches.map((m) => m.id).join('-') : 'empty'}
        className={styles.swiper}
        allowTouchMove={swipeEnabled}
        indicator={swipeEnabled ? undefined : false}
        loop={false}
        defaultIndex={0}
      >
        {slides.map((match, index) => (
          <Swiper.Item key={match?.id ?? `empty-${index}`}>
            <LiveMatchCard
              match={match}
              isLoading={isPending && match === null}
            />
          </Swiper.Item>
        ))}
      </Swiper>
    </div>
  )
}
