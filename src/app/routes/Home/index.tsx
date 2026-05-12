import { skipToken, useQueryClient } from '@tanstack/react-query'
import dayjs, { type Dayjs } from 'dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  type PlayerMatchResponse,
  parseCampaignIdFromEnv,
  selectDateMatchesWithTwoTeams,
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
import { MatchByDateCarousel } from './MatchByDateCarousel'
import MatchVotePopup ,{ type MatchVoteData } from "@/app/routes/Home/VotePopUp/VoteTicket.tsx"
import { type RankingEntry } from "@/app/routes/Home/Leaderboard/LeaderboardCard.tsx"
import LeaderboardPanel from "@/app/routes/Home/Leaderboard/LeaderboardPanel.tsx"
import { type MatchHistoryEntry } from "@/app/routes/Home/History/HistoryCard.tsx"

const DEFAULT_SSE_EVENTS = ['message'] as const

function HomeHallContent() {
  const campaignId = useMemo(() => parseCampaignIdFromEnv(), [])
  const [selectedMatchDate, setSelectedMatchDate] = useState<Dayjs>(() => dayjs())
  const [voteMatch, setVoteMatch] = useState<MatchVoteData | null>(null)
  const queryClient = useQueryClient()

  const setSelectedMatchDateStable = useCallback((d: Dayjs) => {
    setSelectedMatchDate(d)
  }, [])

  const selectedDateStr = selectedMatchDate.format('YYYY-MM-DD')

  const { data: matchData, isPending, isError, error } = tsr.getMatch.useQuery({
    queryKey: ['getMatch', campaignId, selectedDateStr],
    queryData:
      campaignId !== null
        ? { params: { campaignId }, query: { date: selectedDateStr } }
        : skipToken,
  })

  const { data: ticketData } = tsr.getTicket.useQuery({
    queryKey: ['getTicket', campaignId],
    queryData: campaignId !== null ? { params: { campaignId } } : skipToken,
  })

  const totalTicketBalance = useMemo(() => {
    if (!ticketData || ticketData.status !== 200 || !ticketData.body) return 0
    return ticketData.body.totalTicketBalance
  }, [ticketData])

  const { data: voteHistoryData } = tsr.getVoteHistory.useQuery({
    queryKey: ['voteHistory', campaignId],
    queryData:
      campaignId !== null ? { params: { campaignId } } : skipToken,
  })

  const { data: leaderboardData } = tsr.getLeaderboard.useQuery({
    queryKey: ['leaderboard', campaignId],
    queryData:
      campaignId !== null ? { params: { campaignId } } : skipToken,
  })

  const leaderboardCurrentUser: RankingEntry | null = useMemo(() => {
    if (!leaderboardData || leaderboardData.status !== 200 || !leaderboardData.body)
      return null
    return leaderboardData.body.currentUser ?? null
  }, [leaderboardData])

  const leaderboardTopRankings: RankingEntry[] = useMemo(() => {
    if (!leaderboardData || leaderboardData.status !== 200 || !leaderboardData.body)
      return []
    return leaderboardData.body.topRankings
  }, [leaderboardData])

  const liveMatches: PlayerMatchResponse[] = useMemo(() => {
    if (!matchData || matchData.status !== 200 || !matchData.body) return []
    return selectLiveMatchesWithTwoTeams(matchData.body)
  }, [matchData])

  const dateMatches: PlayerMatchResponse[] = useMemo(() => {
    if (!matchData || matchData.status !== 200 || !matchData.body) return []
    return selectDateMatchesWithTwoTeams(matchData.body)
  }, [matchData])

  const historyEntries: MatchHistoryEntry[] = useMemo(() => {
    if (!voteHistoryData || voteHistoryData.status !== 200 || !voteHistoryData.body)
      return []

    return voteHistoryData.body.map((item) => {
      const teamOne = item.teams[0]
      const teamTwo = item.teams[1]
      const selectedTeam = item.votedTeamId === teamOne?.teamId

      return {
        matchId: item.matchId,
        matchName: item.matchName,
        matchTitle: item.matchTitle,
        firstTeam: { name : teamOne.teamName, flagUrl: teamOne.teamLogo },
        secondTeam: { name : teamTwo.teamName, flagUrl: teamTwo.teamLogo },
        votedTeam: selectedTeam ? 'first' : 'second',
        result: item.status ?? 'PENDING',
        based: item.basePoints ?? 0,
        strike: item.multiplier ?? 0,
        total: item.pointsEarned ?? 0,
      }
    })
  },[voteHistoryData])

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

  const handleVoteClick = (match: PlayerMatchResponse) => {
    const firstTeam = match.teams[0]
    const secondTeam = match.teams[1]
    if(!firstTeam || !secondTeam) return

    setVoteMatch({
      matchId: match.id,
      matchName: match.matchName,
      matchTime: match.matchTime,
      firstTeam: {
        teamId : firstTeam.team.id,
        name: firstTeam.team.name,
        flagUrl: firstTeam.team.logoUrl,
      },
      secondTeam: {
        teamId: secondTeam.team.id,
        name: secondTeam.team.name,
        flagUrl: secondTeam.team.logoUrl,
      },
    })

  }

  // ── Vote mutation ──
  const voteMutation = tsr.voteTeam.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voteHistory', campaignId] })
      queryClient.invalidateQueries({ queryKey: ['leaderboard', campaignId] })
    },
    onError: (error) => {
      console.error('Vote failed:', error)
      if (error && typeof error === 'object' && 'status' in error) {
        const err = error as { status?: unknown; body?: unknown }
        console.error('Error status:', err.status)
        console.error('Error body:', err.body)
      }
      console.error('Full error:', JSON.stringify(error, null, 2))
    },
  })

  const handleConfirm = (matchId: number, selectedTeam: 'first' | 'second') => {
    console.log('voted', matchId, selectedTeam)
    if (!campaignId || !voteMatch) return

    const teamId = selectedTeam==="first" ? voteMatch.firstTeam.teamId : voteMatch.secondTeam.teamId

    voteMutation.mutate({
      params: {campaignId, matchId},
      body: {teamId}
    })
  }

  return (
    <section aria-label="Promotional banner">
      <Banner />
      <MatchActionBar totalTicketBalance={totalTicketBalance} />
      <CalendarStrip
        campaignId={campaignId}
        selectedDate={selectedMatchDate}
        onSelectedDateChange={setSelectedMatchDateStable}
      />
      {campaignId != null && (isPending || liveMatches.length > 0) ? (
        <LiveMatchCardCarousel matches={liveMatches} isPending={isPending} />
      ) : null}
      {campaignId != null && (isPending || dateMatches.length > 0) ? (
        <MatchByDateCarousel matches={dateMatches} isPending={isPending} onVoteClick={handleVoteClick} />
      ) : null}

      {voteMatch && (
        <MatchVotePopup
          match={voteMatch}
          onConfirm={handleConfirm}
          onBack={() => setVoteMatch(null)}
        />
      )}

      <LeaderboardPanel
        currentUser={leaderboardCurrentUser ?? null}
        topRankings={leaderboardTopRankings}
        history={historyEntries}
      />

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
