const rawBase = import.meta.env.VITE_BASE_URL?.replace(/\/+$/, '') ?? ''

/** Swagger: `/api/public/...`. Accept env as host root or already ending in `/api/public`. */
export const API_PUBLIC_BASE = rawBase.endsWith('/api/public')
  ? rawBase
  : `${rawBase}/api/public`

export const GET_SESSION_ID = `${API_PUBLIC_BASE}/player/sessions/get-session-id`
export const GET_USR_DETAIL = `${API_PUBLIC_BASE}/player/sessions/player`
export const GET_LANGUAGE_FILE = `${API_PUBLIC_BASE}/i18n`

/** Call via `apiRequest` when `pageReady` (same `X-Session-Id` as other player APIs). Adjust path if backend differs. */
export const GET_CATEGORY = `${API_PUBLIC_BASE}/player/categories`
export const GET_REGISTRATION_LINK = `${API_PUBLIC_BASE}/player/registration-link`

/** Server-Sent Events (Swagger: `GET /api/public/sse/connect`). */
export const SSE_CONNECT = `${API_PUBLIC_BASE}/sse/connect`

/** @deprecated Use {@link SSE_CONNECT} — kept for older imports. */
export const STREAM_CONNECT = SSE_CONNECT
