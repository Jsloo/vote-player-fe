/**
 * Lightweight fingerprint for `referral` share flows (lucky-draw uses a fuller impl).
 */
export async function genFingerprint(): Promise<string> {
  const nav = typeof navigator !== 'undefined' ? navigator.userAgent : ''
  let hash = 0
  for (let i = 0; i < nav.length; i++) {
    hash = (hash * 31 + nav.charCodeAt(i)) | 0
  }
  return String(Math.abs(hash))
}
