import {
  REFERAL_CODE_KEY,
  REFERAL_SHARE_KEY,
  SESSION_ID_KEY,
} from '@/app/constant/storageKeys'
import { ErrorCode } from '@/app/constant/errorCode'
import { HTTP_METHOD } from '@/app/constant/httpMethod'
import { genFingerprint } from '@/app/utils/genFingerprint'
import { clearSession, safeParseStorage } from '@/app/utils/sessionTools'
import { notifyAuthError } from '@/app/utils/sessionHandler'
import i18n from '@/i18n'

export interface IRequestProps {
  url: string
  method?: HTTP_METHOD
  requestBody?: object
  params?: Record<string, unknown>
}

export interface IApiResponse<R> {
  success?: boolean
  status?: boolean
  code: string
  message: string
  data: R
  timestamp?: string
}

/**
 * Session chain (HTTP): `X-Session-Id` from `SESSION_ID_KEY` storage; optional `params` (e.g. `GET_USR_DETAIL`
 * uses `sessionToken`). Guest `code` / share `referral` appended when present. `12016` → `notifyAuthError` + `clearSession`.
 */
export async function apiRequest<R>({
  url,
  params,
  method = HTTP_METHOD.GET,
  requestBody,
}: IRequestProps): Promise<IApiResponse<R>> {
  let qs = ''
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Accept-Language': i18n.language || 'en',
  })
  const options: RequestInit = { method }

  const sessionRaw = sessionStorage.getItem(SESSION_ID_KEY)
  if (sessionRaw) {
    headers.append('X-Session-Id', safeParseStorage(sessionRaw))
  }

  if (params) {
    Object.entries(params).forEach(([key, value], index) => {
      if (index === 0) {
        qs += `?${key}=${encodeURIComponent(String(value))}`
      } else {
        qs += `&${key}=${encodeURIComponent(String(value))}`
      }
    })
  }

  const referralCode = safeParseStorage(sessionStorage.getItem(REFERAL_CODE_KEY) || '')
  if (referralCode.length > 0) {
    qs += qs.length ? `&code=${encodeURIComponent(referralCode)}` : `?code=${encodeURIComponent(referralCode)}`
  }

  const referralShareCode = safeParseStorage(sessionStorage.getItem(REFERAL_SHARE_KEY) || '')
  if (referralShareCode.length > 0) {
    qs += qs.length
      ? `&referral=${encodeURIComponent(referralShareCode)}`
      : `?referral=${encodeURIComponent(referralShareCode)}`
    const fingerprint = await genFingerprint()
    qs += `&fingerprint=${encodeURIComponent(fingerprint)}`
  }

  const requestUrl = url + qs

  if (requestBody && method !== HTTP_METHOD.GET) {
    options.body = JSON.stringify(requestBody)
  }

  const response = await fetch(requestUrl, { headers, ...options })
  const result = (await response.json()) as IApiResponse<R>

  if (result?.code === ErrorCode.SESSION_INVALID) {
    notifyAuthError(result.code as ErrorCode)
    clearSession()
  }

  if (!(result?.success || result?.status)) {
    throw result
  }

  return result
}
