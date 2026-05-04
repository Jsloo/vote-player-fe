import { REFERAL_CODE_KEY, SESSION_ID_KEY } from '@/app/constant/storageKeys'

export const SESSION_CHANGED_EVENT = 'votePlayer:session-changed'

export function safeParseStorage(value: string | null): string {
  if (!value) return ''
  try {
    const parsed: unknown = JSON.parse(value)
    if (typeof parsed === 'string') return parsed
    if (parsed == null) return ''
    return String(parsed)
  } catch {
    return value
  }
}

/** Same keys as lucky-draw `clearSession` (does not remove `REFERAL_SHARE_KEY`). */
export function clearSession(): void {
  if (typeof sessionStorage === 'undefined') return
  sessionStorage.removeItem(REFERAL_CODE_KEY)
  sessionStorage.removeItem(SESSION_ID_KEY)
  notifySessionChanged()
}

export function notifySessionChanged(): void {
  window.dispatchEvent(new CustomEvent(SESSION_CHANGED_EVENT))
}

const parentTarget = () => import.meta.env.VITE_PARENT_URL || '*'

export function exitApps(): void {
  window.close()
  window.parent.postMessage({ type: 'IFRAME_CLOSE' }, parentTarget())
}

export function announceLoad(): void {
  window.parent.postMessage({ type: 'IFRAME_LOADED' }, parentTarget())
}

export function postSessionIdToParent(sessionId: string): void {
  if (window.parent === window.self) return
  window.parent.postMessage({ type: 'IFRAME_SESSION_ID', sessionId }, parentTarget())
}

export function readSessionIdRaw(): string | null {
  if (typeof sessionStorage === 'undefined') return null
  return sessionStorage.getItem(SESSION_ID_KEY)
}

export function getSessionTokenForRequest(): string {
  return safeParseStorage(readSessionIdRaw())
}

/** True when a player session id is stored (lucky-draw `checkIsPlayer`; used before SSE / player-only APIs). */
export function checkIsPlayer(): boolean {
  return !!readSessionIdRaw()
}
