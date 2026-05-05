import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { skipToken } from "@tanstack/react-query";
import { useLocation } from "react-router";
import { tsr } from "@/app/contract";
import { ErrorCode } from "@/app/constant/errorCode";
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
  const [i18nReady, setI18nReady] = useState(false);

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

  useEffect(() => {
    void initI18n().finally(() => setI18nReady(true));
  }, []);

  const ready = !!sessionId;

  const canLoadPlayer = !!sessionId && !isInitPage && i18nReady;

  const {
    data: user,
    isFetching,
    error,
    refetch,
  } = tsr.getPlayer.useQuery({
    queryKey: ["getPlayer", sessionId],
    queryData: canLoadPlayer
      ? { query: { sessionToken: sessionId } }
      : skipToken,
  });

  useEffect(() => {
    if (error) {
      console.error("Failed to fetch user:", error);
    }
  }, [error]);

  const value = useMemo<AuthContextValue>(
    () => ({
      sessionId,
      ready,
      user: canLoadPlayer ? (user ?? null) : null,
      isLoading: canLoadPlayer && isFetching,
      refetch: () => {
        void refetch();
      },
      authError,
      triggerAuthError,
      clearAuthError,
    }),
    [
      sessionId,
      ready,
      canLoadPlayer,
      user,
      isFetching,
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
