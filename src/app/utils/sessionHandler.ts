import type { ErrorCode } from '@/app/constant/errorCode'

let triggerAuthError: ((error: ErrorCode) => void) | null = null

export function registerAuthErrorHandler(fn: (error: ErrorCode) => void): void {
  triggerAuthError = fn
}

export function notifyAuthError(error: ErrorCode): void {
  triggerAuthError?.(error)
}
