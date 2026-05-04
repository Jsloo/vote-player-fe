import { REFERAL_CODE_KEY, REFERAL_SHARE_KEY } from '@/app/constant/storageKeys'
import { SSE_CONNECT } from '@/app/constant/url'
import { genFingerprint } from '@/app/utils/genFingerprint'
import {
  checkIsPlayer,
  getSessionTokenForRequest,
  safeParseStorage,
} from '@/app/utils/sessionTools'

/**
 * Builds `GET /api/public/sse/connect?…` query: player `sessionId`, else guest `code`, else share `referral` + `fingerprint`.
 */
export async function buildSseConnectUrl(): Promise<string | null> {
  if (checkIsPlayer()) {
    const sid = getSessionTokenForRequest().trim()
    if (!sid) return null
    return `${SSE_CONNECT}?sessionId=${encodeURIComponent(sid)}`
  }

  const code = safeParseStorage(sessionStorage.getItem(REFERAL_CODE_KEY) || '').trim()
  if (code) {
    return `${SSE_CONNECT}?code=${encodeURIComponent(code)}`
  }

  const referral = safeParseStorage(sessionStorage.getItem(REFERAL_SHARE_KEY) || '').trim()
  if (referral) {
    const fingerprint = await genFingerprint()
    return `${SSE_CONNECT}?referral=${encodeURIComponent(referral)}&fingerprint=${encodeURIComponent(fingerprint)}`
  }

  return null
}
