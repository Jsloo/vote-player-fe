import queryString from 'query-string'
import {
  REFERAL_CODE_KEY,
  REFERAL_SHARE_KEY,
  SESSION_ID_KEY,
} from '@/app/constant/storageKeys'
import {
  getSessionTokenForRequest,
  notifySessionChanged,
  safeParseStorage,
} from '@/app/utils/sessionTools'

let blockAppForMissingEntryContext = false

/** True when the first URL cannot start the app (no session / referral context). */
export function shouldShowMissingEntryGate(): boolean {
  return blockAppForMissingEntryContext
}

function setExclusiveSession(key: string, value: string, keysToClear: string[]): void {
  sessionStorage.setItem(key, JSON.stringify(value))
  keysToClear.forEach((k) => sessionStorage.removeItem(k))
}

function asSingleString(v: string | string[] | null | undefined): string | undefined {
  if (v == null) return undefined
  if (Array.isArray(v)) return v[0]
  return v
}

/**
 * Reads `sessionId`, `code`, and `referral` from the URL (not `accessToken`).
 * Same exclusive storage rules as lucky-draw `bootstrapSession`.
 */
export function bootstrapSession(): void {
  if (typeof window === 'undefined') return

  blockAppForMissingEntryContext = false

  const { pathname, search } = window.location
  const isInitRoute = pathname === '/init' || pathname.endsWith('/init')

  const parsed = queryString.parse(search) as {
    sessionId?: string | string[]
    referral?: string | string[]
    code?: string | string[]
  }

  const sessionId = asSingleString(parsed.sessionId)?.trim()
  const code = asSingleString(parsed.code)?.trim()
  const referral = asSingleString(parsed.referral)?.trim()

  let dirty = false

  if (sessionId) {
    setExclusiveSession(SESSION_ID_KEY, sessionId, [REFERAL_CODE_KEY, REFERAL_SHARE_KEY])
    dirty = true
  }

  if (code) {
    setExclusiveSession(REFERAL_CODE_KEY, code, [SESSION_ID_KEY, REFERAL_SHARE_KEY])
    dirty = true
  }

  if (referral) {
    setExclusiveSession(REFERAL_SHARE_KEY, referral, [SESSION_ID_KEY, REFERAL_CODE_KEY])
    dirty = true
  }

  if (dirty) notifySessionChanged()

  if (isInitRoute) {
    return
  }

  const hadUrlEntry = !!(sessionId || code || referral)
  const hasStoredSession = !!getSessionTokenForRequest().trim()
  const hasStoredReferralCode = !!safeParseStorage(
    sessionStorage.getItem(REFERAL_CODE_KEY) || '',
  ).trim()
  const hasStoredReferralShare = !!safeParseStorage(
    sessionStorage.getItem(REFERAL_SHARE_KEY) || '',
  ).trim()

  if (
    !hadUrlEntry &&
    !hasStoredSession &&
    !hasStoredReferralCode &&
    !hasStoredReferralShare
  ) {
    blockAppForMissingEntryContext = true
  }
}
