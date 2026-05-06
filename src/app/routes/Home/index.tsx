import { skipToken } from '@tanstack/react-query'
import dayjs, { type Dayjs } from 'dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  type PlayerMatchResponse,
  parseCampaignIdFromEnv,
  selectLiveMatchesWithTwoTeams,
  tsr,
} from '@/app/contract'
import { usePageReady } from '@/app/hook/usePageReady'
import { useSubscribe } from '@/app/hook/useSubscribe'
import { Banner } from './Banner'
import { CalendarStrip } from './CalendarStrip'
import { LiveMatchCardCarousel } from './LiveMatchCardCarousel'
import { MainHallSkeleton } from './MainHallSkeleton'
import { MatchActionBar } from './MatchActionBar'

const DEFAULT_SSE_EVENTS = ['message'] as const

function HomeHallContent() {
  const campaignId = useMemo(() => parseCampaignIdFromEnv(), [])
  const [selectedMatchDate, setSelectedMatchDate] = useState<Dayjs>(() => dayjs())

  const setSelectedMatchDateStable = useCallback((d: Dayjs) => {
    setSelectedMatchDate(d)
  }, [])

  const selectedDateStr = selectedMatchDate.format('YYYY-MM-DD')

  const { data: liveMatches, isPending, isError, error } = tsr.getMatch.useQuery<
    PlayerMatchResponse[]
  >({
    queryKey: ['getMatch', campaignId, selectedDateStr],
    queryData:
      campaignId !== null
        ? { params: { campaignId }, query: { date: selectedDateStr } }
        : skipToken,
    select: (response) => {
      if (response.status !== 200) {
        return []
      }
      return selectLiveMatchesWithTwoTeams(response.body ?? [])
    },
  })

  useEffect(() => {
    if (import.meta.env.DEV && isError) {
      console.error('[player/campaigns/…/matches]', error)
    }
  }, [isError, error])

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
      <CalendarStrip
        campaignId={campaignId}
        selectedDate={selectedMatchDate}
        onSelectedDateChange={setSelectedMatchDateStable}
      />
      {campaignId != null && (isPending || (liveMatches?.length ?? 0) > 0) ? (
        <LiveMatchCardCarousel matches={liveMatches ?? []} isPending={isPending} />
      ) : null}
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
