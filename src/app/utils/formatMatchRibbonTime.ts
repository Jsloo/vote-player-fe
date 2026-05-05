import dayjs from 'dayjs'

/**
 * Ribbon line for match start time, e.g. `4/6/2026 | 3:00pm`
 * (US-style date, pipe separator, 12h clock, lowercase am/pm with no space before suffix).
 */
export function formatMatchRibbonTime(matchTimeIso: string): string {
  const raw = dayjs(matchTimeIso).format('M/D/YYYY | h:mma')
  return raw.replace(/\s+(am|pm)$/i, '$1')
}
