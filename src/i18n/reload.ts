import { GET_LANGUAGE_FILE } from "@/app/constant/url";
import {
  REFERAL_CODE_KEY,
  REFERAL_SHARE_KEY,
} from "@/app/constant/storageKeys";
import {
  getSessionTokenForRequest,
  safeParseStorage,
} from "@/app/utils/sessionTools";
import i18n from "@/i18n";

let inflight: Promise<void> | null = null;

/**
 * Loads remote translation bundles via plain `fetch` (lucky-draw `i18n.js` HttpBackend `request`).
 * Merges `response.data` into the `translation` namespace; safe to call multiple times.
 */
export async function initI18n(): Promise<void> {
  if (!GET_LANGUAGE_FILE) {
    return Promise.resolve();
  }

  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const language = i18n.language || "en";
      const sessionId = getSessionTokenForRequest();
      const referralCode = safeParseStorage(
        sessionStorage.getItem(REFERAL_CODE_KEY) || "",
      ).trim();
      const referralShareCode = safeParseStorage(
        sessionStorage.getItem(REFERAL_SHARE_KEY) || "",
      ).trim();

      const url = new URL(GET_LANGUAGE_FILE);
      url.searchParams.set("lng", language);
      if (referralCode) url.searchParams.set("code", referralCode);
      if (referralShareCode)
        url.searchParams.set("referral", referralShareCode);

      const headers: Record<string, string> = {
        "Accept-Language": language,
      };
      if (sessionId) headers["X-Session-Id"] = sessionId;

      const res = await fetch(url.toString(), { headers });
      if (!res.ok) return;

      const json = (await res.json()) as { data?: Record<string, unknown> };
      const bundle = json.data ?? {};
      if (Object.keys(bundle).length > 0) {
        void i18n.addResourceBundle(
          language,
          "translation",
          bundle,
          true,
          true,
        );
      }
    } catch (e) {
      console.error("[initI18n]", e);
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}
