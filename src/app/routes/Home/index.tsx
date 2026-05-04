import { useCallback } from 'react'
import { usePageReady } from '@/app/hook/usePageReady'
import { useSubscribe } from '@/app/hook/useSubscribe'
import { Banner } from './Banner'
import { CalendarStrip } from './CalendarStrip'
import { MainHallSkeleton } from './MainHallSkeleton'
import { MatchActionBar } from './MatchActionBar'

const DEFAULT_SSE_EVENTS = ['message'] as const

function HomeHallContent() {
  const onSse = useCallback((payload: { data: string; eventType: string }) => {
    if (import.meta.env.DEV) {
      console.debug('[SSE]', payload.eventType, payload.data)
    }
  }, [])

  useSubscribe(onSse, [...DEFAULT_SSE_EVENTS])

  return (
    <section aria-label="Promotional banner">
      <Banner />
      <MatchActionBar />
      <CalendarStrip />
    </section>
  )
}

export function HomePage() {
  const { pageReady } = usePageReady()

  if (!pageReady) {
    return <MainHallSkeleton />
  }

  return <HomeHallContent />
}
