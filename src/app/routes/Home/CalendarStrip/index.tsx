import { skipToken } from '@tanstack/react-query'
import dayjs, { type Dayjs } from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { IoChevronDown, IoChevronUp } from 'react-icons/io5'
import { tsr } from '@/app/contract'
import './styles.css'

type MatchDate = {
  date: Dayjs
  matchCount: number
}

const today = dayjs()

const COLLAPSED_COUNT = 5
const EXPANDED_COLS = 7

function DateCard({
  item,
  selected,
  onClick,
}: {
  item: MatchDate
  selected: boolean
  onClick: () => void
}) {
  const isToday = item.date.isSame(today, 'day')
  const matchLabel = item.matchCount === 1 || item.matchCount === 0 ? 'Match' : 'Matches'

  return (
    <button
      type="button"
      className={`calendarStripCard${selected ? ' calendarStripCardSelected' : ''}`}
      onClick={onClick}
    >
      <span className="calendarStripCardDay">
        {isToday ? 'Today' : item.date.format('D')}
      </span>
      {!isToday && (
        <span className="calendarStripCardMonth">{item.date.format('MMM')}</span>
      )}
      <span className="calendarStripCardCount">
        ({item.matchCount} {matchLabel})
      </span>
    </button>
  )
}

export function CalendarStrip({
  campaignId,
  selectedDate,
  onSelectedDateChange,
}: {
  campaignId: number | null
  selectedDate: Dayjs
  onSelectedDateChange: (date: Dayjs) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  const {
    data: matchDates = [],
    isPending,
    isError,
    error,
  } = tsr.getMatchesCountByDate.useQuery<MatchDate[]>({
    queryKey: ['getMatchesCountByDate', campaignId],
    queryData: campaignId !== null ? { params: { campaignId } } : skipToken,
    select: (response) => {
      if (response.status !== 200) {
        return []
      }
      return response.body
        .map((row) => ({
          date: dayjs(row.date),
          matchCount: row.totalMatches,
        }))
        .filter((row) => row.date.isValid())
        .sort((a, b) => a.date.valueOf() - b.date.valueOf())
    },
  })

  useEffect(() => {
    if (import.meta.env.DEV && isError) {
      console.error('[player/campaigns/…/matches/count-by-date]', error)
    }
  }, [isError, error])

  useEffect(() => {
    if (matchDates.length === 0) {
      return
    }
    const hasSelected = matchDates.some((d) => d.date.isSame(selectedDate, 'day'))
    if (!hasSelected) {
      const todayHit = matchDates.find((d) => d.date.isSame(today, 'day'))
      onSelectedDateChange(todayHit?.date ?? matchDates[0].date)
    }
  }, [matchDates, selectedDate, onSelectedDateChange])

  const calendarSelectedDate = useMemo(() => {
    if (matchDates.length === 0) {
      return selectedDate
    }
    const hasSelected = matchDates.some((d) => d.date.isSame(selectedDate, 'day'))
    if (hasSelected) {
      return selectedDate
    }
    const todayHit = matchDates.find((d) => d.date.isSame(today, 'day'))
    return todayHit?.date ?? matchDates[0].date
  }, [matchDates, selectedDate])

  const collapsedDates = matchDates.slice(0, COLLAPSED_COUNT)
  const expandedDates = matchDates.slice(COLLAPSED_COUNT)

  const expandedRows: MatchDate[][] = []
  for (let i = 0; i < expandedDates.length; i += EXPANDED_COLS) {
    expandedRows.push(expandedDates.slice(i, i + EXPANDED_COLS))
  }

  if (campaignId === null) {
    return null
  }

  if (isPending) {
    return (
      <div className="calendarStrip">
        <div className="calendarStripRow">
          <span className="calendarStripStatus">Loading calendar…</span>
        </div>
      </div>
    )
  }

  if (matchDates.length === 0) {
    return (
      <div className="calendarStrip">
        <div className="calendarStripRow">
          <span className="calendarStripStatus">No match dates for this campaign.</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`calendarStrip${isExpanded ? ' calendarStrip--expanded' : ''}`}
    >
      <div className="calendarStripRow">
        {collapsedDates.map((item) => (
          <DateCard
            key={item.date.format('YYYY-MM-DD')}
            item={item}
            selected={item.date.isSame(calendarSelectedDate, 'day')}
            onClick={() => onSelectedDateChange(item.date)}
          />
        ))}
        {expandedDates.length > 0 ? (
          <button
            type="button"
            className="calendarStripToggle"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-label={isExpanded ? 'Collapse calendar' : 'Expand calendar'}
          >
            {isExpanded ? <IoChevronUp /> : <IoChevronDown />}
          </button>
        ) : null}
      </div>

      {isExpanded && expandedRows.length > 0 ? (
        <div className="calendarStripExpanded" role="region" aria-label="More dates">
          <div className="calendarStripExpandedScroll">
            {expandedRows.map((row, rowIdx) => (
              <div key={rowIdx} className="calendarStripExpandedRow">
                {row.map((item) => (
                  <DateCard
                    key={item.date.format('YYYY-MM-DD')}
                    item={item}
                    selected={item.date.isSame(calendarSelectedDate, 'day')}
                    onClick={() => onSelectedDateChange(item.date)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
