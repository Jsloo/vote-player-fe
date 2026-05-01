import dayjs, { type Dayjs } from 'dayjs'
import { useState } from 'react'
import { IoChevronDown, IoChevronUp } from 'react-icons/io5'
import './styles.css'

type MatchDate = {
  date: Dayjs
  matchCount: number
}

const today = dayjs()

const MOCK_DATES: MatchDate[] = Array.from({ length: 19 }, (_, i) => ({
  date: dayjs('2026-06-12').add(i, 'day'),
  matchCount: 3,
}))

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
      <span className="calendarStripCardCount">({item.matchCount} Match)</span>
    </button>
  )
}

export function CalendarStrip() {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(MOCK_DATES[0].date)
  const [isExpanded, setIsExpanded] = useState(false)

  const collapsedDates = MOCK_DATES.slice(0, COLLAPSED_COUNT)
  const expandedDates = MOCK_DATES.slice(COLLAPSED_COUNT)

  // chunk remaining dates into rows of 7
  const expandedRows: MatchDate[][] = []
  for (let i = 0; i < expandedDates.length; i += EXPANDED_COLS) {
    expandedRows.push(expandedDates.slice(i, i + EXPANDED_COLS))
  }

  return (
    <div className="calendarStrip">
      {/* first row — always visible */}
      <div className="calendarStripRow">
        {collapsedDates.map((item) => (
          <DateCard
            key={item.date.toString()}
            item={item}
            selected={item.date.isSame(selectedDate, 'day')}
            onClick={() => setSelectedDate(item.date)}
          />
        ))}
        <button
          type="button"
          className="calendarStripToggle"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-label={isExpanded ? 'Collapse calendar' : 'Expand calendar'}
        >
          {isExpanded ? <IoChevronUp /> : <IoChevronDown />}
        </button>
      </div>

      {/* expanded rows */}
      {isExpanded && (
        <div className="calendarStripExpanded">
          {expandedRows.map((row, rowIdx) => (
            <div key={rowIdx} className="calendarStripExpandedRow">
              {row.map((item) => (
                <DateCard
                  key={item.date.toString()}
                  item={item}
                  selected={item.date.isSame(selectedDate, 'day')}
                  onClick={() => setSelectedDate(item.date)}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
