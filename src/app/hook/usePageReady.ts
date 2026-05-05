import { startTransition, useEffect, useState } from "react";
import {
  REFERAL_CODE_KEY,
  REFERAL_SHARE_KEY,
} from "@/app/constant/storageKeys";
import {
  SESSION_CHANGED_EVENT,
  getSessionTokenForRequest,
  safeParseStorage,
} from "@/app/utils/sessionTools";
import i18n from "@/i18n";
import { initI18n } from "@/i18n/reload";

function hasReferralInStorage(): boolean {
  return (
    !!safeParseStorage(sessionStorage.getItem(REFERAL_CODE_KEY) || "").trim() ||
    !!safeParseStorage(sessionStorage.getItem(REFERAL_SHARE_KEY) || "").trim()
  );
}

export function usePageReady() {
  const [translationReady, setTranslationReady] = useState(i18n.isInitialized);

  const [hasSessionOrReferral, setHasSessionOrReferral] = useState(() => ({
    session: !!getSessionTokenForRequest().trim(),
    referral: hasReferralInStorage(),
  }));

  useEffect(() => {
    const sync = () => {
      setHasSessionOrReferral({
        session: !!getSessionTokenForRequest().trim(),
        referral: hasReferralInStorage(),
      });
    };
    window.addEventListener(SESSION_CHANGED_EVENT, sync);
    return () => window.removeEventListener(SESSION_CHANGED_EVENT, sync);
  }, []);

  useEffect(() => {
    const runInitI18n = async () => {
      await initI18n();
    };

    if (hasSessionOrReferral.session || hasSessionOrReferral.referral) {
      void runInitI18n();
    }

    if (i18n.isInitialized) {
      startTransition(() => setTranslationReady(true));
      return;
    }

    const onInitialized = () => {
      startTransition(() => setTranslationReady(true));
    };

    i18n.on("initialized", onInitialized);
    return () => {
      i18n.off("initialized", onInitialized);
    };
  }, [hasSessionOrReferral.session, hasSessionOrReferral.referral]);

  const pageReady =
    translationReady &&
    (hasSessionOrReferral.session || hasSessionOrReferral.referral);

  return { pageReady, translationReady };
}
