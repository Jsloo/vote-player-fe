const rawBase = import.meta.env.VITE_BASE_URL?.replace(/\/+$/, "") ?? "";

export const API_PUBLIC_BASE = rawBase.endsWith("/api/public")
  ? rawBase
  : `${rawBase}/api/public`;

export const GET_SESSION_ID = `${API_PUBLIC_BASE}/player/sessions/get-session-id`;
export const GET_LANGUAGE_FILE = `${API_PUBLIC_BASE}/i18n`;

export const GET_CATEGORY = `${API_PUBLIC_BASE}/player/categories`;

export const GET_REGISTRATION_LINK = `${API_PUBLIC_BASE}/player/registration-link`;

export const SSE_CONNECT = `${API_PUBLIC_BASE}/sse/connect`;

export const STREAM_CONNECT = SSE_CONNECT;
