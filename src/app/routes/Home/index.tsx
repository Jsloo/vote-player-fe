import { useCallback } from 'react'
import { usePageReady } from '@/app/hook/usePageReady'
import { useSubscribe } from '@/app/hook/useSubscribe'
import { Banner } from './Banner'
import { CalendarStrip } from './CalendarStrip'
import { MainHallSkeleton } from './MainHallSkeleton'
import { MatchActionBar } from './MatchActionBar'

const DEFAULT_SSE_EVENTS = ['message'] as const

export function HomePage() {
  const { pageReady } = usePageReady()

  const onSse = useCallback((payload: { data: string; eventType: string }) => {
    if (import.meta.env.DEV) {
      console.debug('[SSE]', payload.eventType, payload.data)
    }
  }, [])

  useSubscribe(onSse, [...DEFAULT_SSE_EVENTS])

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
