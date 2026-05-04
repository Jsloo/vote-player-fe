import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react'
import { useLocation } from 'react-router'
import { shouldShowMissingEntryGate } from '@/app/utils/bootstrap'
import { buildSseConnectUrl } from '@/app/utils/buildSseConnectUrl'
import { SESSION_CHANGED_EVENT } from '@/app/utils/sessionTools'

export type SsePayload = { data: string; eventType: string }

export type SseCallback = (payload: SsePayload) => void

type Subscription = {
  id: number
  cb: SseCallback
  /** SSE `event:` names; default `message`. */
  eventTypes: Set<string>
}

export type EventContextValue = {
  subscribe: (cb: SseCallback, eventTypes?: string[]) => () => void
}

const EventContext = createContext<EventContextValue | null>(null)

export function EventProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const subsRef = useRef<Map<number, Subscription>>(new Map())
  const nextIdRef = useRef(0)
  const esRef = useRef<EventSource | null>(null)
  const urlRef = useRef<string | null>(null)
  const attachedTypesRef = useRef(new Set<string>())
  const connectingSeqRef = useRef(0)

  const deliver = useCallback((eventType: string, data: string) => {
    subsRef.current.forEach((sub) => {
      if (sub.eventTypes.has('*') || sub.eventTypes.has(eventType)) {
        try {
          sub.cb({ data, eventType })
        } catch (e) {
          console.error('[SSE]', e)
        }
      }
    })
  }, [])

  const disconnect = useCallback(() => {
    esRef.current?.close()
    esRef.current = null
    urlRef.current = null
    attachedTypesRef.current.clear()
  }, [])

  const collectEventTypes = useCallback((): Set<string> => {
    const types = new Set<string>()
    subsRef.current.forEach((sub) => {
      sub.eventTypes.forEach((t) => types.add(t))
    })
    if (types.size === 0) {
      types.add('message')
    }
    return types
  }, [])

  const wireTypes = useCallback((es: EventSource, types: Set<string>) => {
    types.forEach((type) => {
      if (attachedTypesRef.current.has(type)) return
      attachedTypesRef.current.add(type)
      if (type === 'message') {
        es.onmessage = (ev) => {
          deliver('message', ev.data)
        }
      } else {
        es.addEventListener(type, (ev) => {
          const msg = ev as MessageEvent
          deliver(type, typeof msg.data === 'string' ? msg.data : String(msg.data))
        })
      }
    })
  }, [deliver])

  const syncConnection = useCallback(async () => {
    const seq = ++connectingSeqRef.current

    if (pathname.includes('/init') || shouldShowMissingEntryGate()) {
      disconnect()
      return
    }

    if (subsRef.current.size === 0) {
      disconnect()
      return
    }

    const url = await buildSseConnectUrl()
    if (seq !== connectingSeqRef.current) return

    if (!url) {
      disconnect()
      return
    }

    const types = collectEventTypes()

    if (esRef.current && urlRef.current === url) {
      wireTypes(esRef.current, types)
      return
    }

    disconnect()
    if (seq !== connectingSeqRef.current) return

    const es = new EventSource(url)
    esRef.current = es
    urlRef.current = url
    wireTypes(es, types)
  }, [pathname, collectEventTypes, disconnect, wireTypes])

  useEffect(() => {
    void syncConnection()
  }, [pathname, syncConnection])

  useEffect(() => {
    const onSession = () => {
      void syncConnection()
    }
    window.addEventListener(SESSION_CHANGED_EVENT, onSession)
    return () => window.removeEventListener(SESSION_CHANGED_EVENT, onSession)
  }, [syncConnection])

  const subscribe = useCallback(
    (cb: SseCallback, eventTypes?: string[]) => {
      const id = ++nextIdRef.current
      const types = new Set(eventTypes?.length ? eventTypes : ['message'])
      subsRef.current.set(id, { id, cb, eventTypes: types })
      void syncConnection()
      return () => {
        subsRef.current.delete(id)
        void syncConnection()
      }
    },
    [syncConnection],
  )

  const value = useMemo<EventContextValue>(() => ({ subscribe }), [subscribe])

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook colocated with provider
export function useEvent(): EventContextValue {
  const ctx = useContext(EventContext)
  if (!ctx) {
    throw new Error('useEvent must be used within EventProvider')
  }
  return ctx
}
