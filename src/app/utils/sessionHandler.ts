import type { ErrorCode } from '@/app/constant/errorCode'

let triggerAuthError: ((error: ErrorCode) => void) | null = null
let pendingAuthError: ErrorCode | null = null

export function registerAuthErrorHandler(fn: (error: ErrorCode) => void): void {
  triggerAuthError = fn
  if (pendingAuthError) {
    triggerAuthError(pendingAuthError)
    pendingAuthError = null
  }
}

export function notifyAuthError(error: ErrorCode): void {
  if (triggerAuthError) {
    triggerAuthError(error)
    return
  }
  pendingAuthError = error
}
