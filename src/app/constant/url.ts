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

/**
 * Lucky-draw `STREAM_CONNECT` / SSE — not opened in vote-player-fe (no `EventSource` / `useSubscribe`).
 * Kept for URL parity and future use.
 */
export const STREAM_CONNECT = `${API_PUBLIC_BASE}/stream/connect`
