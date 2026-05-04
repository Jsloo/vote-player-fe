import { Toast } from "antd-mobile";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Error404 } from "@/app/components/Error404";
import { TRANSLATION_KEYS } from "@/constant/translationKeys";

/**
 * Shown when the app is opened without `?sessionId=` / `?code=` / `?referral=` and no prior storage
 * (same visual language as Relogin / session Error404 + toast).
 */
export function SessionEntryBlocked() {
  const { t } = useTranslation();

  useEffect(() => {
    Toast.show({
      content: t(TRANSLATION_KEYS.SESSION_INVALID_TOAST, {
        defaultValue: "Player Session Expired or Invalid.",
      }),
      duration: 4000,
    });
  }, [t]);

  return (
    <main className="page">
      <Error404
        visible
        onBack={() => window.location.reload()}
        code="404"
        title={t(TRANSLATION_KEYS.ERROR_404_TITLE, {
          defaultValue: "Page Not Found",
        })}
        message={t(TRANSLATION_KEYS.SESSION_ENTRY_MESSAGE, {
          defaultValue: "Your session has expired or is invalid.",
        })}
        btnText={t(TRANSLATION_KEYS.COMMON_HOME, { defaultValue: "Home" })}
      />
    </main>
  );
}
