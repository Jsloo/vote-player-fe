import type { TFunction } from 'i18next'

/**
 * Match / campaign APIs may return remote i18n dictionary keys (e.g. `fifa`, `title A`).
 * Resolve via the loaded `translation` bundle, or show the raw value when no entry exists.
 */
export function translateRemoteLabel(
  t: TFunction,
  raw: string | null | undefined,
): string {
  if (raw == null) return ''
  const trimmed = raw.trim()
  if (!trimmed) return ''
  return String(t(trimmed, { defaultValue: trimmed }))
}
