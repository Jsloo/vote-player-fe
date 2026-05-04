import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router";
import { ErrorCode } from "@/app/constant/errorCode";
import { HTTP_METHOD } from "@/app/constant/httpMethod";
import { GET_USR_DETAIL } from "@/app/constant/url";
import { apiRequest } from "@/app/utils/apiRequest";
import {
  SESSION_CHANGED_EVENT,
  getSessionTokenForRequest,
} from "@/app/utils/sessionTools";
import { initI18n } from "@/i18n/reload";

export type AuthContextValue = {
  sessionId: string | null;
  ready: boolean;
  user: unknown | null;
  isLoading: boolean;
  refetch: () => void;
  authError: ErrorCode | null;
  triggerAuthError: (code: ErrorCode) => void;
  clearAuthError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isInitPage = pathname.includes("/init");

  const [sessionId, setSessionId] = useState(
    () => getSessionTokenForRequest() || null,
  );
  const [authError, setAuthError] = useState<ErrorCode | null>(null);
  const [user, setUser] = useState<unknown | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadTick, setLoadTick] = useState(0);

  const triggerAuthError = useCallback((code: ErrorCode) => {
    setAuthError(code);
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  useEffect(() => {
    const sync = () => {
      const next = getSessionTokenForRequest();
      setSessionId(next || null);
    };
    window.addEventListener(SESSION_CHANGED_EVENT, sync);
    return () => window.removeEventListener(SESSION_CHANGED_EVENT, sync);
  }, []);

  /** True once `?sessionId=` (or prior storage) is synced — then hall can run `getUsrDetail` off `/init`. */
  const ready = !!sessionId;

  /**
   * Session chain step 3: after main hall / `pageReady`, load player via `GET_USR_DETAIL` + `apiRequest`
   * (`sessionToken` query + `X-Session-Id` header from storage). Skipped on `/init`.
   */
  const getUsrDetail = useCallback(async () => {
    if (!sessionId || isInitPage) {
      setUser(null);
      return;
    }

    // i18next core is sync-initialized in `main`; this still merges remote bundles before first player REST call.
    await initI18n();

    setIsLoading(true);
    try {
      const result = await apiRequest<unknown>({
        url: GET_USR_DETAIL,
        method: HTTP_METHOD.GET,
        params: { sessionToken: sessionId },
      });
      setUser(result.data);
    } catch (e) {
      console.error("Failed to fetch user:", e);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, isInitPage]);

  useEffect(() => {
    queueMicrotask(() => {
      startTransition(() => {
        void getUsrDetail();
      });
    });
  }, [getUsrDetail, loadTick]);

  const refetch = useCallback(() => {
    setLoadTick((n) => n + 1);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      sessionId,
      ready,
      user: ready && !isInitPage ? user : null,
      isLoading: ready && !isInitPage && isLoading,
      refetch,
      authError,
      triggerAuthError,
      clearAuthError,
    }),
    [
      sessionId,
      ready,
      isInitPage,
      user,
      isLoading,
      refetch,
      authError,
      triggerAuthError,
      clearAuthError,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- hook colocated with provider
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
