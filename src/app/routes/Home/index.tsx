import { usePageReady } from '@/app/hook/usePageReady'
import { Banner } from './Banner'
import { CalendarStrip } from './CalendarStrip'
import { MainHallSkeleton } from './MainHallSkeleton'
import { MatchActionBar } from './MatchActionBar'

export function HomePage() {
  const { pageReady } = usePageReady()

  if (!pageReady) {
    return <MainHallSkeleton />
  }

  return (
    <section aria-label="Promotional banner">
      <Banner />
      <MatchActionBar />
      <CalendarStrip />
    </section>
  )
}
